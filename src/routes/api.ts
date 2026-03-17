import { Hono } from 'hono'
import { sign, verify } from './jwt-helper'
import { generateId, hashPassword, verifyPassword } from './utils-helper'

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

    // Find tenant
    const tenant = await c.env.DB.prepare(
      'SELECT id, name, email, password_hash, plan_type FROM tenants WHERE email = ?'
    ).bind(email).first()

    if (!tenant) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const validPassword = await verifyPassword(password, tenant.password_hash as string)
    if (!validPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Generate JWT
    const token = await sign({ tenantId: tenant.id, email }, c.env.JWT_SECRET)

    return c.json({
      token,
      user: {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        plan: tenant.plan_type
      }
    })
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

apiRoutes.post('/ai/generate-workout', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.replace('Bearer ', '')
    const payload = await verify(token, c.env.JWT_SECRET)
    const tenantId = payload.tenantId

    const { studentId, prompt } = await c.req.json()

    if (!studentId || !prompt) {
      return c.json({ error: 'Missing studentId or prompt' }, 400)
    }

    // Get student data
    const student = await c.env.DB.prepare(
      'SELECT full_name, goal, physical_data FROM students WHERE id = ? AND tenant_id = ?'
    ).bind(studentId, tenantId).first()

    if (!student) {
      return c.json({ error: 'Student not found' }, 404)
    }

    // Call OpenAI API
    const systemPrompt = `Você é um assistente especializado em prescrição de treinos de musculação.
Analise o perfil do aluno e crie uma ficha de treino técnica e segura.

Perfil do Aluno:
- Nome: ${student.full_name}
- Objetivo: ${student.goal || 'Não especificado'}
- Dados Físicos: ${student.physical_data || 'Não especificado'}

Retorne APENAS um objeto JSON válido com a seguinte estrutura:
{
  "title": "Nome do Treino",
  "description": "Descrição breve",
  "exercises": [
    {
      "name": "Nome do Exercício",
      "sets": 4,
      "reps": "8-12",
      "rest": 90,
      "notes": "Observações técnicas"
    }
  ]
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error('OpenAI API failed')
    }

    const aiData = await response.json()
    const aiResponse = aiData.choices[0].message.content

    // Parse AI response
    const workoutData = JSON.parse(aiResponse)

    // Save workout to database
    const workoutId = generateId()
    const now = Math.floor(Date.now() / 1000)

    await c.env.DB.prepare(`
      INSERT INTO workouts (id, student_id, tenant_id, title, description, exercises, ai_logic_used, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).bind(
      workoutId,
      studentId,
      tenantId,
      workoutData.title,
      workoutData.description,
      JSON.stringify(workoutData.exercises),
      prompt,
      now
    ).run()

    // Log AI usage
    const tokenUsage = aiData.usage.total_tokens
    await c.env.DB.prepare(`
      INSERT INTO ai_logs (id, tenant_id, token_usage, purpose, model, prompt_tokens, completion_tokens, created_at)
      VALUES (?, ?, ?, 'Geração de Treino', 'gpt-4o-mini', ?, ?, ?)
    `).bind(
      generateId(),
      tenantId,
      tokenUsage,
      aiData.usage.prompt_tokens,
      aiData.usage.completion_tokens,
      now
    ).run()

    return c.json({
      success: true,
      workoutId,
      workout: workoutData
    })
  } catch (error) {
    console.error('AI workout generation error:', error)
    return c.json({ error: 'Failed to generate workout' }, 500)
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
