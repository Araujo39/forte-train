import { Hono } from 'hono'
import { sign, verify } from './jwt-helper'
import { generateId, hashPassword, verifyPassword } from './utils-helper'
import { generateSportPrompt, getSportConfig } from '../lib/sport-prompts'

type Bindings = {
  DB: D1Database
  OPENAI_API_KEY: string
  YOUTUBE_API_KEY: string
  JWT_SECRET: string
}

export const apiRoutes = new Hono<{ Bindings: Bindings }>()

// ==================== AUTH ROUTES ====================

apiRoutes.post('/auth/register', async (c) => {
  try {
    const { name, email, password, subdomain, plan } = await c.req.json()

    // Validate input
    if (!name || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Check if email already exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM tenants WHERE email = ?'
    ).bind(email).first()

    if (existing) {
      return c.json({ error: 'Email already registered' }, 400)
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create tenant
    const tenantId = generateId()
    const now = Math.floor(Date.now() / 1000)

    await c.env.DB.prepare(`
      INSERT INTO tenants (id, name, email, password_hash, subdomain, plan_type, plan_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'trial', ?)
    `).bind(tenantId, name, email, passwordHash, subdomain || null, plan || 'start', now).run()

    // Generate JWT
    const token = await sign({ tenantId, email }, c.env.JWT_SECRET)

    return c.json({
      token,
      user: { id: tenantId, name, email, plan: plan || 'start' }
    })
  } catch (error) {
    console.error('Register error:', error)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

apiRoutes.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400)
    }

    // Hash the password for comparison
    const passwordHash = await hashPassword(password)

    // 1. Try ADMIN login first
    const admin = await c.env.DB.prepare(
      'SELECT id, name, email, password_hash, role FROM admin_users WHERE email = ?'
    ).bind(email).first()

    if (admin) {
      const validPassword = await verifyPassword(password, admin.password_hash as string)
      if (validPassword) {
        const token = await sign({ 
          userId: admin.id, 
          email,
          role: 'admin'
        }, c.env.JWT_SECRET)

        return c.json({
          token,
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'admin',
            type: 'admin'
          }
        })
      }
    }

    // 2. Try PERSONAL TRAINER login
    const tenant = await c.env.DB.prepare(
      'SELECT id, name, email, password_hash, plan_type, role FROM tenants WHERE email = ?'
    ).bind(email).first()

    if (tenant) {
      const validPassword = await verifyPassword(password, tenant.password_hash as string)
      if (validPassword) {
        const token = await sign({ 
          tenantId: tenant.id,
          userId: tenant.id, 
          email,
          role: tenant.role || 'personal'
        }, c.env.JWT_SECRET)

        return c.json({
          token,
          user: {
            id: tenant.id,
            name: tenant.name,
            email: tenant.email,
            plan: tenant.plan_type,
            role: tenant.role || 'personal',
            type: 'personal'
          }
        })
      }
    }

    // 3. Try STUDENT login
    const student = await c.env.DB.prepare(
      'SELECT id, full_name, email, password_hash, tenant_id FROM students WHERE email = ?'
    ).bind(email).first()

    if (student && student.password_hash) {
      const validPassword = await verifyPassword(password, student.password_hash as string)
      if (validPassword) {
        const token = await sign({ 
          studentId: student.id,
          userId: student.id,
          tenantId: student.tenant_id,
          email,
          role: 'student'
        }, c.env.JWT_SECRET)

        return c.json({
          token,
          user: {
            id: student.id,
            name: student.full_name,
            email: student.email,
            tenantId: student.tenant_id,
            role: 'student',
            type: 'student'
          }
        })
      }
    }

    // No match found
    return c.json({ error: 'Invalid credentials' }, 401)
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// ==================== DASHBOARD ROUTES ====================

apiRoutes.get('/dashboard/stats', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.replace('Bearer ', '')
    const payload = await verify(token, c.env.JWT_SECRET)
    const tenantId = payload.tenantId

    // Get total students
    const totalStudentsResult = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM students WHERE tenant_id = ?'
    ).bind(tenantId).first()

    // Get active students (last workout within 7 days)
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60)
    const activeStudentsResult = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM students WHERE tenant_id = ? AND last_workout_date >= ?'
    ).bind(tenantId, sevenDaysAgo).first()

    // Get inactive students (no workout in 3+ days)
    const threeDaysAgo = Math.floor(Date.now() / 1000) - (3 * 24 * 60 * 60)
    const inactiveStudentsResult = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM students WHERE tenant_id = ? AND (last_workout_date < ? OR last_workout_date IS NULL)'
    ).bind(tenantId, threeDaysAgo).first()

    // Get total workouts
    const totalWorkoutsResult = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM workouts WHERE tenant_id = ? AND is_active = 1'
    ).bind(tenantId).first()

    return c.json({
      totalStudents: totalStudentsResult?.count || 0,
      activeStudents: activeStudentsResult?.count || 0,
      inactiveStudents: inactiveStudentsResult?.count || 0,
      totalWorkouts: totalWorkoutsResult?.count || 0
    })
  } catch (error) {
    console.error('Stats error:', error)
    return c.json({ error: 'Failed to load stats' }, 500)
  }
})

// ==================== STUDENTS ROUTES ====================

apiRoutes.get('/students', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.replace('Bearer ', '')
    const payload = await verify(token, c.env.JWT_SECRET)
    const tenantId = payload.tenantId

    const limit = c.req.query('limit') || '100'

    const result = await c.env.DB.prepare(`
      SELECT id, full_name, email, whatsapp, goal, physical_data, status, last_workout_date, created_at
      FROM students
      WHERE tenant_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).bind(tenantId, parseInt(limit)).all()

    return c.json({ students: result.results || [] })
  } catch (error) {
    console.error('Students error:', error)
    return c.json({ error: 'Failed to load students' }, 500)
  }
})

apiRoutes.get('/students/inactive', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.replace('Bearer ', '')
    const payload = await verify(token, c.env.JWT_SECRET)
    const tenantId = payload.tenantId

    const threeDaysAgo = Math.floor(Date.now() / 1000) - (3 * 24 * 60 * 60)

    const result = await c.env.DB.prepare(`
      SELECT id, full_name, email, whatsapp, goal, last_workout_date
      FROM students
      WHERE tenant_id = ? AND (last_workout_date < ? OR last_workout_date IS NULL)
      ORDER BY last_workout_date ASC NULLS FIRST
    `).bind(tenantId, threeDaysAgo).all()

    return c.json({ students: result.results || [] })
  } catch (error) {
    console.error('Inactive students error:', error)
    return c.json({ error: 'Failed to load inactive students' }, 500)
  }
})

apiRoutes.post('/students', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.replace('Bearer ', '')
    const payload = await verify(token, c.env.JWT_SECRET)
    const tenantId = payload.tenantId

    const { full_name, email, whatsapp, goal, physical_data } = await c.req.json()

    if (!full_name) {
      return c.json({ error: 'Full name is required' }, 400)
    }

    const studentId = generateId()
    const now = Math.floor(Date.now() / 1000)

    await c.env.DB.prepare(`
      INSERT INTO students (id, tenant_id, full_name, email, whatsapp, goal, physical_data, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)
    `).bind(
      studentId,
      tenantId,
      full_name,
      email || null,
      whatsapp || null,
      goal || null,
      JSON.stringify(physical_data || {}),
      now
    ).run()

    return c.json({ success: true, studentId })
  } catch (error) {
    console.error('Create student error:', error)
    return c.json({ error: 'Failed to create student' }, 500)
  }
})

// ==================== AI WORKOUT GENERATOR ====================

// ==================== OMNI-SPORT AI GENERATOR ====================
apiRoutes.post('/ai/generate-workout', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.replace('Bearer ', '')
    const payload = await verify(token, c.env.JWT_SECRET)
    const tenantId = payload.tenantId

    const { studentId, prompt, sportType = 'bodybuilding', experienceLevel = 'intermediate' } = await c.req.json()

    if (!studentId || !prompt) {
      return c.json({ error: 'Missing studentId or prompt' }, 400)
    }

    // Get student data
    const student = await c.env.DB.prepare(
      'SELECT full_name, goal, physical_data, primary_sport FROM students WHERE id = ? AND tenant_id = ?'
    ).bind(studentId, tenantId).first()

    if (!student) {
      return c.json({ error: 'Student not found' }, 404)
    }

    // Get sport configuration
    const sportConfig = await c.env.DB.prepare(
      'SELECT * FROM sport_configs WHERE sport_type = ?'
    ).bind(sportType).first()

    if (!sportConfig) {
      return c.json({ error: `Sport type '${sportType}' not configured` }, 400)
    }

    // Generate sport-specific AI prompt
    const aiPrompt = generateSportPrompt(
      sportType,
      student.goal || 'General fitness',
      experienceLevel,
      `Student: ${student.full_name}. Physical data: ${student.physical_data || 'Not provided'}. User request: ${prompt}`
    )

    // Call OpenAI API with sport-specific prompt
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw new Error('OpenAI API failed')
    }

    const aiData = await response.json()
    const aiResponse = aiData.choices[0].message.content

    // Parse AI response
    const workoutData = JSON.parse(aiResponse)

    // Save workout to database with sport_type and metrics
    const workoutId = generateId()
    const now = Math.floor(Date.now() / 1000)

    await c.env.DB.prepare(`
      INSERT INTO workouts (
        id, student_id, tenant_id, title, description, 
        exercises, metrics, sport_type, ai_logic_used, 
        is_active, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).bind(
      workoutId,
      studentId,
      tenantId,
      workoutData.title || `Treino de ${sportConfig.display_name}`,
      workoutData.description || '',
      JSON.stringify(workoutData.exercises || workoutData),
      JSON.stringify(workoutData),
      sportType,
      prompt,
      now
    ).run()

    // Log AI usage with sport_type
    const tokenUsage = aiData.usage.total_tokens
    const costPer1kTokens = 0.00015 // GPT-4o-mini pricing
    const cost = (tokenUsage / 1000) * costPer1kTokens

    await c.env.DB.prepare(`
      INSERT INTO ai_logs (
        id, tenant_id, token_usage, cost_usd, purpose, 
        model, sport_type, prompt_tokens, completion_tokens, created_at
      )
      VALUES (?, ?, ?, ?, ?, 'gpt-4o-mini', ?, ?, ?, ?)
    `).bind(
      generateId(),
      tenantId,
      tokenUsage,
      cost,
      `Workout Generation - ${sportConfig.display_name}`,
      sportType,
      aiData.usage.prompt_tokens,
      aiData.usage.completion_tokens,
      now
    ).run()

    return c.json({
      success: true,
      workoutId,
      workout: workoutData,
      sportType,
      sportConfig: {
        name: sportConfig.display_name,
        icon: sportConfig.icon_name,
        color: sportConfig.primary_color
      }
    })
  } catch (error) {
    console.error('AI workout generation error:', error)
    
    // Log error to ai_error_logs if it exists
    try {
      const auth = c.req.header('Authorization')
      if (auth) {
        const token = auth.replace('Bearer ', '')
        const payload = await verify(token, c.env.JWT_SECRET)
        
        await c.env.DB.prepare(`
          INSERT INTO ai_error_logs (id, tenant_id, error_type, error_message, created_at)
          VALUES (?, ?, 'workout_generation', ?, ?)
        `).bind(
          generateId(),
          payload.tenantId,
          error instanceof Error ? error.message : 'Unknown error',
          Math.floor(Date.now() / 1000)
        ).run()
      }
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
    
    return c.json({ 
      error: 'Failed to generate workout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// ==================== SPORTS CONFIGURATION ====================

// GET /api/sports/configs - List all available sports
apiRoutes.get('/sports/configs', async (c) => {
  try {
    const configs = await c.env.DB.prepare(`
      SELECT * FROM sport_configs ORDER BY display_name ASC
    `).all()

    return c.json({
      success: true,
      sports: configs.results.map((sport: any) => ({
        id: sport.id,
        type: sport.sport_type,
        name: sport.display_name,
        icon: sport.icon_name,
        primaryColor: sport.primary_color,
        secondaryColor: sport.secondary_color,
        metricTemplate: JSON.parse(sport.metric_template),
        uiTheme: JSON.parse(sport.ui_theme)
      }))
    })
  } catch (error) {
    console.error('Failed to fetch sport configs:', error)
    return c.json({ error: 'Failed to fetch sports' }, 500)
  }
})

// GET /api/sports/configs/:sportType - Get specific sport configuration
apiRoutes.get('/sports/configs/:sportType', async (c) => {
  try {
    const sportType = c.req.param('sportType')
    
    const sport = await c.env.DB.prepare(`
      SELECT * FROM sport_configs WHERE sport_type = ?
    `).bind(sportType).first()

    if (!sport) {
      return c.json({ error: 'Sport type not found' }, 404)
    }

    return c.json({
      success: true,
      sport: {
        id: sport.id,
        type: sport.sport_type,
        name: sport.display_name,
        icon: sport.icon_name,
        primaryColor: sport.primary_color,
        secondaryColor: sport.secondary_color,
        metricTemplate: JSON.parse(sport.metric_template as string),
        uiTheme: JSON.parse(sport.ui_theme as string)
      }
    })
  } catch (error) {
    console.error('Failed to fetch sport config:', error)
    return c.json({ error: 'Failed to fetch sport' }, 500)
  }
})

// ==================== NOTIFICATIONS ====================

apiRoutes.post('/notifications/motivational', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.replace('Bearer ', '')
    const payload = await verify(token, c.env.JWT_SECRET)
    const tenantId = payload.tenantId

    const { studentId } = await c.req.json()

    if (!studentId) {
      return c.json({ error: 'Missing studentId' }, 400)
    }

    // Get student data
    const student = await c.env.DB.prepare(
      'SELECT full_name, whatsapp FROM students WHERE id = ? AND tenant_id = ?'
    ).bind(studentId, tenantId).first()

    if (!student) {
      return c.json({ error: 'Student not found' }, 404)
    }

    // Generate motivational message with AI
    const message = `Oi ${student.full_name}! 👋 Percebi que você não treina há alguns dias. Que tal agendar um treino hoje? 💪 Seus objetivos estão te esperando! 🔥`

    // Save notification log
    const notificationId = generateId()
    const now = Math.floor(Date.now() / 1000)

    await c.env.DB.prepare(`
      INSERT INTO notifications_log (id, student_id, tenant_id, channel, content, status, sent_at, created_at)
      VALUES (?, ?, ?, 'whatsapp', ?, 'sent', ?, ?)
    `).bind(notificationId, studentId, tenantId, message, now, now).run()

    return c.json({ success: true, message })
  } catch (error) {
    console.error('Notification error:', error)
    return c.json({ error: 'Failed to send notification' }, 500)
  }
})

// ==================== AI VISION MODULE ====================

apiRoutes.post('/ai/identify-equipment', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.replace('Bearer ', '')
    const payload = await verify(token, c.env.JWT_SECRET)
    const tenantId = payload.tenantId

    const { imageBase64 } = await c.req.json()

    if (!imageBase64) {
      return c.json({ error: 'Missing image data' }, 400)
    }

    // Generate image hash for caching
    const encoder = new TextEncoder()
    const data = encoder.encode(imageBase64)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const imageHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Check cache first
    const cached = await c.env.DB.prepare(
      'SELECT equipment_name, muscle_groups, youtube_video_url FROM ai_equipment_cache WHERE image_hash = ?'
    ).bind(imageHash).first()

    if (cached) {
      return c.json({
        success: true,
        cached: true,
        equipment: {
          name: cached.equipment_name,
          muscleGroups: cached.muscle_groups,
          videoUrl: cached.youtube_video_url
        }
      })
    }

    // Call OpenAI Vision API
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em equipamentos de academia. Analise a imagem e retorne APENAS um objeto JSON com:
{
  "equipment_name": "Nome técnico do equipamento em português",
  "muscle_groups": "Músculos trabalhados (separados por vírgula)",
  "youtube_query": "Query de busca para YouTube no formato: Como usar [Nome] execução correta"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identifique este equipamento de academia e informe os músculos trabalhados.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    })

    if (!visionResponse.ok) {
      throw new Error('OpenAI Vision API failed')
    }

    const visionData = await visionResponse.json()
    const aiResponse = visionData.choices[0].message.content
    
    // Parse AI response
    const equipmentData = JSON.parse(aiResponse)

    // Search YouTube for tutorial video
    let videoUrl = null
    if (c.env.YOUTUBE_API_KEY && c.env.YOUTUBE_API_KEY !== 'demo-youtube-key') {
      try {
        const youtubeResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?` +
          `part=snippet&q=${encodeURIComponent(equipmentData.youtube_query + ' site:youtube.com Cariani OR Leandro Twin OR Refundini')}` +
          `&type=video&maxResults=1&key=${c.env.YOUTUBE_API_KEY}`
        )

        if (youtubeResponse.ok) {
          const youtubeData = await youtubeResponse.json()
          if (youtubeData.items && youtubeData.items.length > 0) {
            videoUrl = `https://www.youtube.com/watch?v=${youtubeData.items[0].id.videoId}`
          }
        }
      } catch (error) {
        console.error('YouTube API error:', error)
      }
    }

    // Use fallback demo video if YouTube API not available
    if (!videoUrl) {
      videoUrl = `https://youtube.com/results?search_query=${encodeURIComponent(equipmentData.youtube_query)}`
    }

    // Cache the result
    const cacheId = generateId()
    const now = Math.floor(Date.now() / 1000)

    await c.env.DB.prepare(`
      INSERT INTO ai_equipment_cache (id, image_hash, equipment_name, muscle_groups, youtube_video_url, youtube_query, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      cacheId,
      imageHash,
      equipmentData.equipment_name,
      equipmentData.muscle_groups,
      videoUrl,
      equipmentData.youtube_query,
      now
    ).run()

    // Log AI usage
    const tokenUsage = visionData.usage.total_tokens
    await c.env.DB.prepare(`
      INSERT INTO ai_logs (id, tenant_id, token_usage, purpose, model, prompt_tokens, completion_tokens, created_at)
      VALUES (?, ?, ?, 'Vision - Identificação de Equipamento', 'gpt-4o', ?, ?, ?)
    `).bind(
      generateId(),
      tenantId,
      tokenUsage,
      visionData.usage.prompt_tokens,
      visionData.usage.completion_tokens,
      now
    ).run()

    return c.json({
      success: true,
      cached: false,
      equipment: {
        name: equipmentData.equipment_name,
        muscleGroups: equipmentData.muscle_groups,
        videoUrl: videoUrl,
        youtubeQuery: equipmentData.youtube_query
      }
    })
  } catch (error) {
    console.error('Vision API error:', error)
    return c.json({ error: 'Failed to identify equipment' }, 500)
  }
})

// ==================== WORKOUTS ROUTES ====================

// Get all workouts for tenant
apiRoutes.get('/workouts', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload || !payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const tenantId = payload.tenantId

    // Get all workouts for this tenant
    const result = await c.env.DB.prepare(`
      SELECT * FROM workouts WHERE tenant_id = ? ORDER BY created_at DESC
    `).bind(tenantId).all()

    return c.json(result.results || [])
  } catch (error) {
    console.error('Get workouts error:', error)
    return c.json({ error: 'Failed to fetch workouts' }, 500)
  }
})

// Create workout
apiRoutes.post('/workouts', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload || !payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const tenantId = payload.tenantId
    const { student_id, title, description, exercises, ai_logic_used } = await c.req.json()

    // Validate required fields
    if (!student_id || !title || !exercises) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    const workoutId = generateId()
    const now = Math.floor(Date.now() / 1000)

    await c.env.DB.prepare(`
      INSERT INTO workouts (id, student_id, tenant_id, title, description, exercises, ai_logic_used, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).bind(
      workoutId,
      student_id,
      tenantId,
      title,
      description || null,
      typeof exercises === 'string' ? exercises : JSON.stringify(exercises),
      ai_logic_used || null,
      now,
      now
    ).run()

    return c.json({
      success: true,
      workoutId,
      message: 'Workout created successfully'
    })
  } catch (error) {
    console.error('Create workout error:', error)
    return c.json({ error: 'Failed to create workout' }, 500)
  }
})

// Update workout
apiRoutes.put('/workouts/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload || !payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const tenantId = payload.tenantId
    const workoutId = c.req.param('id')
    const { title, description, exercises, is_active } = await c.req.json()

    const now = Math.floor(Date.now() / 1000)

    await c.env.DB.prepare(`
      UPDATE workouts 
      SET title = ?, description = ?, exercises = ?, is_active = ?, updated_at = ?
      WHERE id = ? AND tenant_id = ?
    `).bind(
      title,
      description || null,
      typeof exercises === 'string' ? exercises : JSON.stringify(exercises),
      is_active ? 1 : 0,
      now,
      workoutId,
      tenantId
    ).run()

    return c.json({
      success: true,
      message: 'Workout updated successfully'
    })
  } catch (error) {
    console.error('Update workout error:', error)
    return c.json({ error: 'Failed to update workout' }, 500)
  }
})

// Delete workout
apiRoutes.delete('/workouts/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload || !payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const tenantId = payload.tenantId
    const workoutId = c.req.param('id')

    await c.env.DB.prepare(`
      DELETE FROM workouts WHERE id = ? AND tenant_id = ?
    `).bind(workoutId, tenantId).run()

    return c.json({
      success: true,
      message: 'Workout deleted successfully'
    })
  } catch (error) {
    console.error('Delete workout error:', error)
    return c.json({ error: 'Failed to delete workout' }, 500)
  }
})

// ==================== NOTIFICATIONS ROUTES ====================

// Get notification history
apiRoutes.get('/notifications/history', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload || !payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const tenantId = payload.tenantId

    // Get all notifications for this tenant
    const result = await c.env.DB.prepare(`
      SELECT * FROM notifications_log WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 100
    `).bind(tenantId).all()

    return c.json(result.results || [])
  } catch (error) {
    console.error('Get notifications error:', error)
    return c.json({ error: 'Failed to fetch notifications' }, 500)
  }
})

// Send notification
apiRoutes.post('/notifications/send', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload || !payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const tenantId = payload.tenantId
    const { studentId, message, type } = await c.req.json()

    if (!studentId || !message) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Get student info
    const student = await c.env.DB.prepare(`
      SELECT full_name as name, whatsapp FROM students WHERE id = ? AND tenant_id = ?
    `).bind(studentId, tenantId).first()

    if (!student) {
      return c.json({ error: 'Student not found' }, 404)
    }

    // Simulate WhatsApp API call (in production, use real WhatsApp Business API)
    const notificationId = generateId()
    const now = Math.floor(Date.now() / 1000)
    
    // Save notification log
    await c.env.DB.prepare(`
      INSERT INTO notifications_log (id, student_id, tenant_id, message_text, notification_type, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'delivered', ?)
    `).bind(
      notificationId,
      studentId,
      tenantId,
      message,
      type || 'manual',
      now
    ).run()

    return c.json({
      success: true,
      notificationId,
      message: 'Notification sent successfully',
      recipient: {
        name: student.name,
        whatsapp: student.whatsapp
      }
    })
  } catch (error) {
    console.error('Send notification error:', error)
    return c.json({ error: 'Failed to send notification' }, 500)
  }
})

// Delete student
apiRoutes.delete('/students/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload || !payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const tenantId = payload.tenantId
    const studentId = c.req.param('id')

    // Delete student (cascade will handle related records if configured)
    await c.env.DB.prepare(`
      DELETE FROM students WHERE id = ? AND tenant_id = ?
    `).bind(studentId, tenantId).run()

    // Also delete related workouts
    await c.env.DB.prepare(`
      DELETE FROM workouts WHERE student_id = ? AND tenant_id = ?
    `).bind(studentId, tenantId).run()

    return c.json({
      success: true,
      message: 'Student deleted successfully'
    })
  } catch (error) {
    console.error('Delete student error:', error)
    return c.json({ error: 'Failed to delete student' }, 500)
  }
})

// ==================== ADMIN ROUTES ====================

// Get all tenants (ADMIN only)
apiRoutes.get('/admin/tenants', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    // Check if user is admin
    if (!payload || payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    // Get all tenants with student count
    const tenants = await c.env.DB.prepare(`
      SELECT 
        t.id,
        t.name,
        t.email,
        t.subdomain,
        t.plan_type,
        t.plan_status,
        t.created_at,
        COUNT(s.id) as student_count
      FROM tenants t
      LEFT JOIN students s ON s.tenant_id = t.id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `).all()

    return c.json({
      tenants: tenants.results || [],
      total: tenants.results?.length || 0
    })
  } catch (error) {
    console.error('Get tenants error:', error)
    return c.json({ error: 'Failed to fetch tenants' }, 500)
  }
})

// Get all students across all tenants (ADMIN only)
apiRoutes.get('/admin/students', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    // Check if user is admin
    if (!payload || payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    // Get all students with tenant info
    const students = await c.env.DB.prepare(`
      SELECT 
        s.id,
        s.full_name,
        s.email,
        s.whatsapp,
        s.goal,
        s.status,
        s.created_at,
        s.last_workout_date,
        t.name as tenant_name,
        t.email as tenant_email
      FROM students s
      LEFT JOIN tenants t ON t.id = s.tenant_id
      ORDER BY s.created_at DESC
    `).all()

    return c.json({
      students: students.results || [],
      total: students.results?.length || 0
    })
  } catch (error) {
    console.error('Get all students error:', error)
    return c.json({ error: 'Failed to fetch students' }, 500)
  }
})

// Get tenant details with students (ADMIN only)
apiRoutes.get('/admin/tenants/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    // Check if user is admin
    if (!payload || payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    const tenantId = c.req.param('id')

    // Get tenant details
    const tenant = await c.env.DB.prepare(`
      SELECT * FROM tenants WHERE id = ?
    `).bind(tenantId).first()

    if (!tenant) {
      return c.json({ error: 'Tenant not found' }, 404)
    }

    // Get tenant's students
    const students = await c.env.DB.prepare(`
      SELECT * FROM students WHERE tenant_id = ? ORDER BY created_at DESC
    `).bind(tenantId).all()

    return c.json({
      tenant,
      students: students.results || []
    })
  } catch (error) {
    console.error('Get tenant details error:', error)
    return c.json({ error: 'Failed to fetch tenant details' }, 500)
  }
})

// ==================== SUPER ADMIN APIS ====================

// GET /api/admin/platform-stats - Platform KPIs
apiRoutes.get('/admin/platform-stats', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    // Get latest platform stats
    const stats = await c.env.DB.prepare(`
      SELECT * FROM platform_stats ORDER BY stat_date DESC LIMIT 1
    `).first()

    // If no stats exist, calculate them
    if (!stats) {
      const now = Math.floor(Date.now() / 1000)
      const today = Math.floor(now / 86400) * 86400 // Start of day

      // Count tenants by status
      const tenantStats = await c.env.DB.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN s.status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN s.status = 'trial' THEN 1 ELSE 0 END) as trial,
          SUM(CASE WHEN s.status = 'delinquent' THEN 1 ELSE 0 END) as delinquent,
          SUM(CASE WHEN s.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
        FROM tenants t
        LEFT JOIN subscriptions s ON t.id = s.tenant_id
      `).first()

      // Calculate MRR/ARR from active subscriptions
      const revenueStats = await c.env.DB.prepare(`
        SELECT 
          SUM(CASE WHEN status = 'active' THEN mrr ELSE 0 END) as total_mrr
        FROM subscriptions
      `).first()

      const mrr = revenueStats?.total_mrr || 0
      const arr = mrr * 12

      // Count students and workouts
      const engagementStats = await c.env.DB.prepare(`
        SELECT 
          (SELECT COUNT(*) FROM students) as total_students,
          (SELECT COUNT(*) FROM workouts) as total_workouts,
          (SELECT COUNT(*) FROM ai_logs WHERE purpose = 'Geração de Treino') as ai_requests,
          (SELECT COUNT(*) FROM ai_logs WHERE purpose = 'Vision - Identificação de Equipamento') as vision_requests
      `).first()

      // Count recent churns (cancelled in last 30 days)
      const churnStats = await c.env.DB.prepare(`
        SELECT COUNT(*) as churn_count
        FROM subscriptions
        WHERE status = 'cancelled' AND cancelled_at > ?
      `).bind(now - 2592000).first() // 30 days ago

      return c.json({
        stats: {
          total_tenants: tenantStats?.total || 0,
          active_tenants: tenantStats?.active || 0,
          trial_tenants: tenantStats?.trial || 0,
          delinquent_tenants: tenantStats?.delinquent || 0,
          cancelled_tenants: tenantStats?.cancelled || 0,
          total_students: engagementStats?.total_students || 0,
          total_workouts: engagementStats?.total_workouts || 0,
          ai_requests_count: engagementStats?.ai_requests || 0,
          vision_requests_count: engagementStats?.vision_requests || 0,
          mrr: parseFloat(mrr as any) || 0,
          arr: parseFloat(arr as any) || 0,
          churn_count: churnStats?.churn_count || 0
        }
      })
    }

    return c.json({ stats })
  } catch (error) {
    console.error('Platform stats error:', error)
    return c.json({ error: 'Failed to fetch platform stats' }, 500)
  }
})

// GET /api/admin/tenants - List all Personal Trainers with metrics
apiRoutes.get('/admin/tenants', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    // Get all tenants with their subscription and metrics
    const tenants = await c.env.DB.prepare(`
      SELECT 
        t.id,
        t.name,
        t.email,
        t.subdomain,
        t.plan_type,
        t.created_at,
        s.status as subscription_status,
        s.mrr,
        m.total_students as student_count,
        m.last_activity_date,
        m.health_score,
        m.health_status
      FROM tenants t
      LEFT JOIN subscriptions s ON t.id = s.tenant_id
      LEFT JOIN tenant_metrics m ON t.id = m.tenant_id
      WHERE t.role = 'personal'
      ORDER BY t.created_at DESC
    `).all()

    return c.json({ tenants: tenants.results || [] })
  } catch (error) {
    console.error('List tenants error:', error)
    return c.json({ error: 'Failed to fetch tenants' }, 500)
  }
})

// GET /api/admin/health-scores - Health Score Analysis
apiRoutes.get('/admin/health-scores', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    // Get tenant metrics sorted by health score (lowest first = at-risk)
    const metrics = await c.env.DB.prepare(`
      SELECT 
        m.*,
        t.name as tenant_name,
        t.email as tenant_email
      FROM tenant_metrics m
      JOIN tenants t ON m.tenant_id = t.id
      ORDER BY m.health_score ASC
    `).all()

    return c.json({ metrics: metrics.results || [] })
  } catch (error) {
    console.error('Health scores error:', error)
    return c.json({ error: 'Failed to fetch health scores' }, 500)
  }
})

// GET /api/admin/ai-errors - AI Error Logs
apiRoutes.get('/admin/ai-errors', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    // Get unresolved errors first
    const errors = await c.env.DB.prepare(`
      SELECT 
        e.*,
        t.email as tenant_email,
        t.name as tenant_name
      FROM ai_error_logs e
      LEFT JOIN tenants t ON e.tenant_id = t.id
      ORDER BY e.resolved ASC, e.created_at DESC
      LIMIT 50
    `).all()

    return c.json({ errors: errors.results || [] })
  } catch (error) {
    console.error('AI errors error:', error)
    return c.json({ error: 'Failed to fetch AI errors' }, 500)
  }
})

// POST /api/admin/ai-errors/:id/resolve - Mark error as resolved
apiRoutes.post('/admin/ai-errors/:id/resolve', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    const errorId = c.req.param('id')

    await c.env.DB.prepare(`
      UPDATE ai_error_logs SET resolved = 1 WHERE id = ?
    `).bind(errorId).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Resolve error error:', error)
    return c.json({ error: 'Failed to resolve error' }, 500)
  }
})

// GET /api/admin/plans - List all pricing plans
apiRoutes.get('/admin/plans', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    const plans = await c.env.DB.prepare(`
      SELECT * FROM plan_limits WHERE is_active = 1 ORDER BY price_monthly ASC
    `).all()

    return c.json({ plans: plans.results || [] })
  } catch (error) {
    console.error('Get plans error:', error)
    return c.json({ error: 'Failed to fetch plans' }, 500)
  }
})

// POST /api/admin/impersonate - Start impersonation session
apiRoutes.post('/admin/impersonate', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    const { tenant_id } = await c.req.json()

    // Get target tenant
    const tenant = await c.env.DB.prepare(`
      SELECT id, name, email, plan_type FROM tenants WHERE id = ?
    `).bind(tenant_id).first()

    if (!tenant) {
      return c.json({ error: 'Tenant not found' }, 404)
    }

    // Log impersonation
    const logId = generateId()
    const now = Math.floor(Date.now() / 1000)
    
    await c.env.DB.prepare(`
      INSERT INTO impersonation_logs 
      (id, admin_id, admin_email, target_tenant_id, target_tenant_email, start_time, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      logId,
      payload.userId,
      payload.email,
      tenant.id,
      tenant.email,
      now,
      now
    ).run()

    // Generate impersonation token
    const impersonationToken = await sign({
      tenantId: tenant.id,
      userId: tenant.id,
      email: tenant.email,
      role: 'personal',
      impersonated_by: payload.userId,
      impersonation_log_id: logId
    }, c.env.JWT_SECRET)

    return c.json({
      success: true,
      impersonation_token: impersonationToken,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email
      },
      log_id: logId
    })
  } catch (error) {
    console.error('Impersonation error:', error)
    return c.json({ error: 'Failed to start impersonation' }, 500)
  }
})

// POST /api/admin/refresh-metrics - Recalculate platform metrics
apiRoutes.post('/admin/refresh-metrics', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    const now = Math.floor(Date.now() / 1000)
    const today = Math.floor(now / 86400) * 86400

    // Delete old stats for today
    await c.env.DB.prepare(`DELETE FROM platform_stats WHERE stat_date = ?`).bind(today).run()

    // Recalculate tenant metrics
    const tenants = await c.env.DB.prepare(`SELECT id FROM tenants WHERE role = 'personal'`).all()

    for (const tenant of (tenants.results || [])) {
      const tenantId = (tenant as any).id

      // Count students
      const studentCount = await c.env.DB.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN last_workout_date > ? THEN 1 ELSE 0 END) as active
        FROM students WHERE tenant_id = ?
      `).bind(now - 604800, tenantId).first() // 7 days ago

      // Count workouts and AI usage
      const workoutCount = await c.env.DB.prepare(`
        SELECT COUNT(*) as total FROM workouts WHERE tenant_id = ?
      `).bind(tenantId).first()

      const aiUsage = await c.env.DB.prepare(`
        SELECT 
          COUNT(*) as total,
          MAX(created_at) as last_usage
        FROM ai_logs WHERE tenant_id = ? AND purpose = 'Geração de Treino'
      `).bind(tenantId).first()

      const visionUsage = await c.env.DB.prepare(`
        SELECT 
          COUNT(*) as total,
          MAX(created_at) as last_usage
        FROM ai_logs WHERE tenant_id = ? AND purpose = 'Vision - Identificação de Equipamento'
      `).bind(tenantId).first()

      const lastActivity = await c.env.DB.prepare(`
        SELECT MAX(created_at) as last_date FROM workouts WHERE tenant_id = ?
      `).bind(tenantId).first()

      // Calculate health score (0-100)
      const totalStudents = (studentCount as any)?.total || 0
      const activeStudents = (studentCount as any)?.active || 0
      const totalWorkouts = (workoutCount as any)?.total || 0
      const aiCount = (aiUsage as any)?.total || 0
      const visionCount = (visionUsage as any)?.total || 0
      const daysSinceActivity = lastActivity ? Math.floor((now - (lastActivity as any).last_date) / 86400) : 999

      let healthScore = 0
      if (totalStudents > 0) healthScore += 20
      if (activeStudents > 0) healthScore += 30
      if (totalWorkouts > 5) healthScore += 20
      if (aiCount > 0) healthScore += 15
      if (visionCount > 0) healthScore += 10
      if (daysSinceActivity < 7) healthScore += 5

      const healthStatus = healthScore >= 70 ? 'healthy' : healthScore >= 40 ? 'at_risk' : 'inactive'

      // Upsert tenant metrics
      await c.env.DB.prepare(`
        INSERT OR REPLACE INTO tenant_metrics 
        (id, tenant_id, total_students, active_students, total_workouts_created, 
         ai_workouts_generated, vision_requests, last_activity_date, 
         last_ai_usage, last_vision_usage, health_score, health_status, calculated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        `metric-${tenantId}`,
        tenantId,
        totalStudents,
        activeStudents,
        totalWorkouts,
        aiCount,
        visionCount,
        (lastActivity as any)?.last_date || null,
        (aiUsage as any)?.last_usage || null,
        (visionUsage as any)?.last_usage || null,
        healthScore,
        healthStatus,
        now
      ).run()
    }

    return c.json({ success: true, message: 'Metrics refreshed successfully' })
  } catch (error) {
    console.error('Refresh metrics error:', error)
    return c.json({ error: 'Failed to refresh metrics' }, 500)
  }
})

// PUT /api/admin/plans - Update plan pricing and limits
apiRoutes.put('/admin/plans', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (payload.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403)
    }

    const {
      plan_id,
      name,
      price_monthly,
      price_annual,
      max_students,
      max_ai_requests,
      max_vision_requests,
      features,
      is_active
    } = await c.req.json()

    if (!plan_id) {
      return c.json({ error: 'Missing plan_id' }, 400)
    }

    const now = Math.floor(Date.now() / 1000)

    // Update plan
    await c.env.DB.prepare(`
      UPDATE plan_limits 
      SET 
        name = ?,
        price_monthly = ?,
        price_annual = ?,
        max_students = ?,
        max_ai_requests = ?,
        max_vision_requests = ?,
        features = ?,
        is_active = ?,
        updated_at = ?
      WHERE id = ?
    `).bind(
      name,
      price_monthly,
      price_annual,
      max_students,
      max_ai_requests,
      max_vision_requests,
      features,
      is_active,
      now,
      plan_id
    ).run()

    return c.json({ 
      success: true, 
      message: 'Plan updated successfully' 
    })
  } catch (error) {
    console.error('Update plan error:', error)
    return c.json({ error: 'Failed to update plan' }, 500)
  }
})

// ============================================
// STUDENT PHOTOS API
// ============================================

// Get student photos
apiRoutes.get('/students/:id/photos', async (c) => {
  try {
    const { env } = c
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const payload = await verify(token, env.JWT_SECRET)
    const tenantId = payload.tenantId
    const studentId = c.req.param('id')

    const photos = await env.DB.prepare(`
      SELECT * FROM student_photos 
      WHERE student_id = ? AND tenant_id = ?
      ORDER BY taken_at DESC
    `).bind(studentId, tenantId).all()

    return c.json(photos.results || [])
  } catch (error) {
    console.error('Get student photos error:', error)
    return c.json({ error: 'Failed to get photos' }, 500)
  }
})

// Add student photo
apiRoutes.post('/students/:id/photos', async (c) => {
  try {
    const { env } = c
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const payload = await verify(token, env.JWT_SECRET)
    const tenantId = payload.tenantId
    const studentId = c.req.param('id')
    
    const { photo_url, photo_type, description, tags } = await c.req.json()
    
    if (!photo_url) {
      return c.json({ error: 'Photo URL is required' }, 400)
    }

    const tagsJson = tags ? JSON.stringify(tags) : null
    const now = Math.floor(Date.now() / 1000)

    await env.DB.prepare(`
      INSERT INTO student_photos (student_id, tenant_id, photo_url, photo_type, description, tags, taken_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(studentId, tenantId, photo_url, photo_type || 'progress', description, tagsJson, now, now).run()

    return c.json({ success: true, message: 'Photo added successfully' })
  } catch (error) {
    console.error('Add student photo error:', error)
    return c.json({ error: 'Failed to add photo' }, 500)
  }
})

// ============================================
// STUDENT MEASUREMENTS API
// ============================================

// Get student measurements
apiRoutes.get('/students/:id/measurements', async (c) => {
  try {
    const { env } = c
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const payload = await verify(token, env.JWT_SECRET)
    const tenantId = payload.tenantId
    const studentId = c.req.param('id')

    const measurements = await env.DB.prepare(`
      SELECT * FROM student_measurements 
      WHERE student_id = ? AND tenant_id = ?
      ORDER BY measured_at DESC
    `).bind(studentId, tenantId).all()

    return c.json(measurements.results || [])
  } catch (error) {
    console.error('Get student measurements error:', error)
    return c.json({ error: 'Failed to get measurements' }, 500)
  }
})

// Add student measurement
apiRoutes.post('/students/:id/measurements', async (c) => {
  try {
    const { env } = c
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const payload = await verify(token, env.JWT_SECRET)
    const tenantId = payload.tenantId
    const studentId = c.req.param('id')
    
    const data = await c.req.json()
    const now = Math.floor(Date.now() / 1000)

    await env.DB.prepare(`
      INSERT INTO student_measurements (
        student_id, tenant_id, weight, height, body_fat_percentage, muscle_mass, bmi,
        chest, waist, hips, thigh_left, thigh_right, calf_left, calf_right,
        bicep_left, bicep_right, forearm_left, forearm_right, neck, shoulders,
        notes, measured_by, measured_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      studentId, tenantId,
      data.weight || null, data.height || null, data.body_fat_percentage || null,
      data.muscle_mass || null, data.bmi || null,
      data.chest || null, data.waist || null, data.hips || null,
      data.thigh_left || null, data.thigh_right || null,
      data.calf_left || null, data.calf_right || null,
      data.bicep_left || null, data.bicep_right || null,
      data.forearm_left || null, data.forearm_right || null,
      data.neck || null, data.shoulders || null,
      data.notes || null, data.measured_by || 'trainer', now, now
    ).run()

    return c.json({ success: true, message: 'Measurement added successfully' })
  } catch (error) {
    console.error('Add student measurement error:', error)
    return c.json({ error: 'Failed to add measurement' }, 500)
  }
})

// ============================================
// STUDENT GOALS API
// ============================================

// Get student goals
apiRoutes.get('/students/:id/goals', async (c) => {
  try {
    const { env } = c
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const payload = await verify(token, env.JWT_SECRET)
    const tenantId = payload.tenantId
    const studentId = c.req.param('id')

    const goals = await env.DB.prepare(`
      SELECT * FROM student_goals 
      WHERE student_id = ? AND tenant_id = ?
      ORDER BY created_at DESC
    `).bind(studentId, tenantId).all()

    return c.json(goals.results || [])
  } catch (error) {
    console.error('Get student goals error:', error)
    return c.json({ error: 'Failed to get goals' }, 500)
  }
})

// Add student goal
apiRoutes.post('/students/:id/goals', async (c) => {
  try {
    const { env } = c
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const payload = await verify(token, env.JWT_SECRET)
    const tenantId = payload.tenantId
    const studentId = c.req.param('id')
    
    const { goal_type, target_weight, target_body_fat, target_date, description, status } = await c.req.json()
    
    if (!goal_type) {
      return c.json({ error: 'Goal type is required' }, 400)
    }

    const now = Math.floor(Date.now() / 1000)

    await env.DB.prepare(`
      INSERT INTO student_goals (student_id, tenant_id, goal_type, target_weight, target_body_fat, target_date, description, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      studentId, tenantId, goal_type,
      target_weight || null, target_body_fat || null, target_date || null,
      description || null, status || 'active', now, now
    ).run()

    return c.json({ success: true, message: 'Goal added successfully' })
  } catch (error) {
    console.error('Add student goal error:', error)
    return c.json({ error: 'Failed to add goal' }, 500)
  }
})

// Get student by ID
apiRoutes.get('/students/:id', async (c) => {
  try {
    const { env } = c
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const payload = await verify(token, env.JWT_SECRET)
    const studentId = c.req.param('id')

    // For students, they can only access their own data
    if (payload.role === 'student' && payload.studentId !== studentId) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    // For personal trainers, check tenant_id
    const tenantId = payload.tenantId

    let student
    if (tenantId) {
      student = await env.DB.prepare(`
        SELECT * FROM students 
        WHERE id = ? AND tenant_id = ?
        LIMIT 1
      `).bind(studentId, tenantId).first()
    } else {
      student = await env.DB.prepare(`
        SELECT * FROM students 
        WHERE id = ?
        LIMIT 1
      `).bind(studentId).first()
    }

    if (!student) {
      return c.json({ error: 'Student not found' }, 404)
    }

    return c.json(student)
  } catch (error) {
    console.error('Get student error:', error)
    return c.json({ error: 'Failed to get student' }, 500)
  }
})

// Get student workouts
apiRoutes.get('/students/:id/workouts', async (c) => {
  try {
    const { env } = c
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const payload = await verify(token, env.JWT_SECRET)
    const tenantId = payload.tenantId
    const studentId = c.req.param('id')

    const workouts = await env.DB.prepare(`
      SELECT * FROM workouts 
      WHERE student_id = ? AND tenant_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).bind(studentId, tenantId).all()

    return c.json(workouts.results || [])
  } catch (error) {
    console.error('Get student workouts error:', error)
    return c.json({ error: 'Failed to get workouts' }, 500)
  }
})
