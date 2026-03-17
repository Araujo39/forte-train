import { Hono } from 'hono'

export const authRoutes = new Hono()

// Login Page
authRoutes.get('/login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - FitFlow</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            body {
                background: #0D0D0D;
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            .card-dark {
                background: #1A1A1A;
                border: 1px solid #333;
            }
            .btn-neon {
                background: #CCFF00;
                color: #0D0D0D;
                font-weight: bold;
                transition: all 0.3s;
            }
            .btn-neon:hover {
                transform: scale(1.02);
                box-shadow: 0 0 20px rgba(204, 255, 0, 0.4);
            }
            .input-dark {
                background: #0D0D0D;
                border: 1px solid #333;
                color: #FFFFFF;
            }
            .input-dark:focus {
                outline: none;
                border-color: #CCFF00;
                box-shadow: 0 0 10px rgba(204, 255, 0, 0.2);
            }
        </style>
    </head>
    <body class="flex items-center justify-center min-h-screen p-4">
        <div class="w-full max-w-md">
            <!-- Logo -->
            <div class="text-center mb-8">
                <a href="/" class="inline-flex items-center">
                    <i class="fas fa-dumbbell text-4xl" style="color: #CCFF00;"></i>
                    <span class="ml-3 text-3xl font-bold" style="color: #CCFF00;">FitFlow</span>
                </a>
                <p class="mt-2 text-gray-400">Entre na sua conta</p>
            </div>

            <!-- Login Form -->
            <div class="card-dark p-8 rounded-2xl">
                <form id="loginForm">
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2 text-gray-300">
                            <i class="fas fa-envelope mr-2"></i>E-mail
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            class="input-dark w-full px-4 py-3 rounded-lg"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2 text-gray-300">
                            <i class="fas fa-lock mr-2"></i>Senha
                        </label>
                        <input 
                            type="password" 
                            id="password" 
                            class="input-dark w-full px-4 py-3 rounded-lg"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div class="flex items-center justify-between mb-6">
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-2">
                            <span class="text-sm text-gray-400">Lembrar-me</span>
                        </label>
                        <a href="#" class="text-sm" style="color: #CCFF00;">Esqueceu a senha?</a>
                    </div>

                    <button type="submit" class="btn-neon w-full py-3 rounded-lg text-lg">
                        <i class="fas fa-sign-in-alt mr-2"></i>Entrar
                    </button>
                </form>

                <div class="mt-6 text-center text-gray-400">
                    Não tem uma conta? 
                    <a href="/auth/register" class="font-bold" style="color: #CCFF00;">Criar conta grátis</a>
                </div>
            </div>

            <!-- Demo Access -->
            <div class="mt-6 text-center">
                <button onclick="loginDemo()" class="text-sm text-gray-500 hover:text-gray-300 transition">
                    <i class="fas fa-user-secret mr-1"></i>
                    Entrar com conta demo
                </button>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                try {
                    const response = await axios.post('/api/auth/login', {
                        email,
                        password
                    });

                    if (response.data.token) {
                        localStorage.setItem('fitflow_token', response.data.token);
                        localStorage.setItem('fitflow_user', JSON.stringify(response.data.user));
                        window.location.href = '/dashboard';
                    }
                } catch (error) {
                    alert('Erro ao fazer login: ' + (error.response?.data?.error || 'Erro desconhecido'));
                }
            });

            function loginDemo() {
                document.getElementById('email').value = 'andre@fitflow.app';
                document.getElementById('password').value = 'demo123';
                document.getElementById('loginForm').dispatchEvent(new Event('submit'));
            }
        </script>
    </body>
    </html>
  `)
})

// Register Page
authRoutes.get('/register', (c) => {
  const plan = c.req.query('plan') || 'start'
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Criar Conta - FitFlow</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            body {
                background: #0D0D0D;
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            .card-dark {
                background: #1A1A1A;
                border: 1px solid #333;
            }
            .btn-neon {
                background: #CCFF00;
                color: #0D0D0D;
                font-weight: bold;
                transition: all 0.3s;
            }
            .btn-neon:hover {
                transform: scale(1.02);
                box-shadow: 0 0 20px rgba(204, 255, 0, 0.4);
            }
            .input-dark {
                background: #0D0D0D;
                border: 1px solid #333;
                color: #FFFFFF;
            }
            .input-dark:focus {
                outline: none;
                border-color: #CCFF00;
                box-shadow: 0 0 10px rgba(204, 255, 0, 0.2);
            }
        </style>
    </head>
    <body class="flex items-center justify-center min-h-screen p-4">
        <div class="w-full max-w-md">
            <!-- Logo -->
            <div class="text-center mb-8">
                <a href="/" class="inline-flex items-center">
                    <i class="fas fa-dumbbell text-4xl" style="color: #CCFF00;"></i>
                    <span class="ml-3 text-3xl font-bold" style="color: #CCFF00;">FitFlow</span>
                </a>
                <p class="mt-2 text-gray-400">Crie sua conta - 14 dias grátis</p>
            </div>

            <!-- Register Form -->
            <div class="card-dark p-8 rounded-2xl">
                <form id="registerForm">
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2 text-gray-300">
                            <i class="fas fa-user mr-2"></i>Nome Completo
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            class="input-dark w-full px-4 py-3 rounded-lg"
                            placeholder="Seu nome"
                            required
                        />
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2 text-gray-300">
                            <i class="fas fa-envelope mr-2"></i>E-mail
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            class="input-dark w-full px-4 py-3 rounded-lg"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2 text-gray-300">
                            <i class="fas fa-lock mr-2"></i>Senha
                        </label>
                        <input 
                            type="password" 
                            id="password" 
                            class="input-dark w-full px-4 py-3 rounded-lg"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2 text-gray-300">
                            <i class="fas fa-globe mr-2"></i>Subdomínio (opcional)
                        </label>
                        <div class="flex items-center">
                            <input 
                                type="text" 
                                id="subdomain" 
                                class="input-dark flex-1 px-4 py-3 rounded-l-lg"
                                placeholder="seu-nome"
                            />
                            <span class="bg-gray-800 px-4 py-3 rounded-r-lg text-gray-400">.fitflow.app</span>
                        </div>
                    </div>

                    <input type="hidden" id="plan" value="${plan}">

                    <div class="mb-6">
                        <label class="flex items-center text-sm">
                            <input type="checkbox" required class="mr-2">
                            <span class="text-gray-400">
                                Concordo com os <a href="#" class="underline" style="color: #CCFF00;">Termos de Uso</a>
                            </span>
                        </label>
                    </div>

                    <button type="submit" class="btn-neon w-full py-3 rounded-lg text-lg">
                        <i class="fas fa-rocket mr-2"></i>Criar Conta Grátis
                    </button>
                </form>

                <div class="mt-6 text-center text-gray-400">
                    Já tem uma conta? 
                    <a href="/auth/login" class="font-bold" style="color: #CCFF00;">Fazer login</a>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            document.getElementById('registerForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const subdomain = document.getElementById('subdomain').value;
                const plan = document.getElementById('plan').value;

                try {
                    const response = await axios.post('/api/auth/register', {
                        name,
                        email,
                        password,
                        subdomain,
                        plan
                    });

                    if (response.data.token) {
                        localStorage.setItem('fitflow_token', response.data.token);
                        localStorage.setItem('fitflow_user', JSON.stringify(response.data.user));
                        alert('Conta criada com sucesso! Redirecionando...');
                        window.location.href = '/dashboard';
                    }
                } catch (error) {
                    alert('Erro ao criar conta: ' + (error.response?.data?.error || 'Erro desconhecido'));
                }
            });
        </script>
    </body>
    </html>
  `)
})
