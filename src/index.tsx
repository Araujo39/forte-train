import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
  OPENAI_API_KEY: string
  YOUTUBE_API_KEY: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// Import routes
import { landingRoutes } from './routes/landing'
import { authRoutes } from './routes/auth'
import { dashboardRoutes } from './routes/dashboard'
import { apiRoutes } from './routes/api'
import { studentRoutes } from './routes/student'

// Mount routes
app.route('/', landingRoutes)
app.route('/auth', authRoutes)
app.route('/dashboard', dashboardRoutes)
app.route('/api', apiRoutes)
app.route('/student', studentRoutes)

// Default 404 handler
app.notFound((c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - ForteTrain</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background: #0D0D0D;
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
            }
            .container {
                max-width: 600px;
                padding: 2rem;
            }
            h1 {
                font-size: 6rem;
                margin: 0;
                color: #CCFF00;
                text-shadow: 0 0 30px rgba(204, 255, 0, 0.5);
            }
            p {
                font-size: 1.5rem;
                color: #A0A0A0;
            }
            a {
                display: inline-block;
                margin-top: 2rem;
                padding: 1rem 2rem;
                background: #CCFF00;
                color: #0D0D0D;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                transition: all 0.3s;
            }
            a:hover {
                transform: scale(1.05);
                box-shadow: 0 0 30px rgba(204, 255, 0, 0.5);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>404</h1>
            <p>Página não encontrada</p>
            <a href="/">Voltar para Home</a>
        </div>
    </body>
    </html>
  `)
})

export default app
