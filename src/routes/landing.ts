import { Hono } from 'hono'

export const landingRoutes = new Hono()

// Landing Page Principal
landingRoutes.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ForteTrain - IA para Personal Trainers</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @keyframes glow {
                0%, 100% { text-shadow: 0 0 20px rgba(204, 255, 0, 0.5), 0 0 40px rgba(204, 255, 0, 0.3); }
                50% { text-shadow: 0 0 30px rgba(204, 255, 0, 0.8), 0 0 60px rgba(204, 255, 0, 0.5); }
            }
            .glow-text {
                animation: glow 2s ease-in-out infinite;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            .float {
                animation: float 3s ease-in-out infinite;
            }
            body {
                background: #0D0D0D;
                color: #FFFFFF;
            }
            .gradient-text {
                background: linear-gradient(135deg, #CCFF00 0%, #00FF88 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .card-dark {
                background: #1A1A1A;
                border: 1px solid #333;
                backdrop-filter: blur(10px);
            }
            .neon-border {
                border: 2px solid #CCFF00;
                box-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
            }
            .btn-neon {
                background: #CCFF00;
                color: #0D0D0D;
                font-weight: bold;
                transition: all 0.3s;
            }
            .btn-neon:hover {
                transform: scale(1.05);
                box-shadow: 0 0 30px rgba(204, 255, 0, 0.6);
            }
        </style>
    </head>
    <body>
        <!-- Navigation -->
        <nav class="fixed w-full z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-dumbbell text-3xl" style="color: #CCFF00;"></i>
                        <span class="ml-3 text-2xl font-bold gradient-text">ForteTrain</span>
                    </div>
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="#features" class="text-gray-300 hover:text-white transition">Recursos</a>
                        <a href="#pricing" class="text-gray-300 hover:text-white transition">Planos</a>
                        <a href="#demo" class="text-gray-300 hover:text-white transition">Demo</a>
                        <a href="/auth/login" class="text-gray-300 hover:text-white transition">Login</a>
                        <a href="/auth/register" class="btn-neon px-6 py-2 rounded-lg">Começar Grátis</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="pt-32 pb-20 px-4">
            <div class="max-w-7xl mx-auto text-center">
                <div class="float mb-8">
                    <i class="fas fa-robot text-8xl" style="color: #CCFF00;"></i>
                </div>
                <h1 class="text-6xl md:text-8xl font-bold mb-6 glow-text" style="color: #CCFF00;">
                    ForteTrain
                </h1>
                <p class="text-2xl md:text-3xl text-gray-300 mb-4">
                    Inteligência Artificial para Personal Trainers
                </p>
                <p class="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
                    Crie treinos otimizados em 30 segundos, gerencie alunos com IA e automatize a retenção. 
                    <span class="gradient-text font-bold">O futuro do treinamento está aqui.</span>
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/auth/register" class="btn-neon px-8 py-4 rounded-lg text-lg inline-flex items-center justify-center">
                        <i class="fas fa-rocket mr-2"></i>
                        Começar Agora - 14 Dias Grátis
                    </a>
                    <a href="#demo" class="bg-transparent border-2 px-8 py-4 rounded-lg text-lg text-white hover:bg-white/10 transition" style="border-color: #CCFF00;">
                        <i class="fas fa-play mr-2"></i>
                        Ver Demo
                    </a>
                </div>
                
                <!-- Stats -->
                <div class="grid grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
                    <div class="card-dark p-6 rounded-xl">
                        <div class="text-4xl font-bold mb-2" style="color: #CCFF00;">30s</div>
                        <div class="text-gray-400">Criar Treino</div>
                    </div>
                    <div class="card-dark p-6 rounded-xl">
                        <div class="text-4xl font-bold mb-2" style="color: #CCFF00;">+200%</div>
                        <div class="text-gray-400">Retenção</div>
                    </div>
                    <div class="card-dark p-6 rounded-xl">
                        <div class="text-4xl font-bold mb-2" style="color: #CCFF00;">24/7</div>
                        <div class="text-gray-400">IA Ativa</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-20 px-4">
            <div class="max-w-7xl mx-auto">
                <h2 class="text-5xl font-bold text-center mb-4 gradient-text">Recursos Revolucionários</h2>
                <p class="text-center text-gray-400 mb-16 text-lg">Tecnologia de ponta para maximizar seus resultados</p>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="card-dark p-8 rounded-2xl hover:neon-border transition-all">
                        <i class="fas fa-brain text-5xl mb-4" style="color: #CCFF00;"></i>
                        <h3 class="text-2xl font-bold mb-3">Gerador de Treinos IA</h3>
                        <p class="text-gray-400">
                            GPT-4o cria fichas técnicas personalizadas em segundos. Analisa histórico, lesões e equipamentos disponíveis.
                        </p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="card-dark p-8 rounded-2xl hover:neon-border transition-all">
                        <i class="fas fa-camera text-5xl mb-4" style="color: #CCFF00;"></i>
                        <h3 class="text-2xl font-bold mb-3">Módulo Vision</h3>
                        <p class="text-gray-400">
                            Aluno tira foto da máquina e a IA identifica o equipamento e sugere vídeos tutoriais dos melhores canais.
                        </p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="card-dark p-8 rounded-2xl hover:neon-border transition-all">
                        <i class="fas fa-chart-line text-5xl mb-4" style="color: #CCFF00;"></i>
                        <h3 class="text-2xl font-bold mb-3">Dashboard Inteligente</h3>
                        <p class="text-gray-400">
                            Análise de evolução, alertas de inatividade e previsão de churn. Dados que geram resultados.
                        </p>
                    </div>

                    <!-- Feature 4 -->
                    <div class="card-dark p-8 rounded-2xl hover:neon-border transition-all">
                        <i class="fas fa-bell text-5xl mb-4" style="color: #CCFF00;"></i>
                        <h3 class="text-2xl font-bold mb-3">Notificações Inteligentes</h3>
                        <p class="text-gray-400">
                            Mensagens motivacionais personalizadas via WhatsApp. Retenção automatizada com IA.
                        </p>
                    </div>

                    <!-- Feature 5 -->
                    <div class="card-dark p-8 rounded-2xl hover:neon-border transition-all">
                        <i class="fas fa-globe text-5xl mb-4" style="color: #CCFF00;"></i>
                        <h3 class="text-2xl font-bold mb-3">Landing Page Integrada</h3>
                        <p class="text-gray-400">
                            Página de vendas pronta para captar alunos. Checkout integrado com liberação automática.
                        </p>
                    </div>

                    <!-- Feature 6 -->
                    <div class="card-dark p-8 rounded-2xl hover:neon-border transition-all">
                        <i class="fas fa-shield-alt text-5xl mb-4" style="color: #CCFF00;"></i>
                        <h3 class="text-2xl font-bold mb-3">Multi-Tenant Seguro</h3>
                        <p class="text-gray-400">
                            Arquitetura SaaS B2B2C com isolamento total de dados. Seus alunos protegidos.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Section -->
        <section id="pricing" class="py-20 px-4 bg-black/30">
            <div class="max-w-7xl mx-auto">
                <h2 class="text-5xl font-bold text-center mb-4 gradient-text">Planos & Preços</h2>
                <p class="text-center text-gray-400 mb-16 text-lg">Escolha o plano ideal para o seu negócio</p>
                
                <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <!-- Plan 1 -->
                    <div class="card-dark p-8 rounded-2xl">
                        <h3 class="text-3xl font-bold mb-2">Start</h3>
                        <div class="mb-6">
                            <span class="text-5xl font-bold" style="color: #CCFF00;">R$ 89,90</span>
                            <span class="text-gray-400">/mês</span>
                        </div>
                        <ul class="space-y-4 mb-8">
                            <li class="flex items-center">
                                <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                                <span>Até 10 alunos</span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                                <span>Gerador de Treinos IA</span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                                <span>Dashboard Básico</span>
                            </li>
                            <li class="flex items-center text-gray-500">
                                <i class="fas fa-times mr-3"></i>
                                <span>Módulo Vision</span>
                            </li>
                            <li class="flex items-center text-gray-500">
                                <i class="fas fa-times mr-3"></i>
                                <span>Landing Page Personalizada</span>
                            </li>
                        </ul>
                        <a href="/auth/register?plan=start" class="block text-center bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition">
                            Começar Grátis
                        </a>
                    </div>

                    <!-- Plan 2 -->
                    <div class="card-dark p-8 rounded-2xl neon-border relative">
                        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-green-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                            RECOMENDADO
                        </div>
                        <h3 class="text-3xl font-bold mb-2">Pro</h3>
                        <div class="mb-6">
                            <span class="text-5xl font-bold" style="color: #CCFF00;">R$ 199,90</span>
                            <span class="text-gray-400">/mês</span>
                        </div>
                        <ul class="space-y-4 mb-8">
                            <li class="flex items-center">
                                <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                                <span><strong>Alunos Ilimitados</strong></span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                                <span>Gerador de Treinos IA Avançado</span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                                <span>Dashboard Completo + Analytics</span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                                <span><strong>Módulo Vision (IA de Equipamentos)</strong></span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                                <span><strong>Landing Page Personalizada</strong></span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                                <span>Notificações WhatsApp Automatizadas</span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                                <span>Suporte Prioritário</span>
                            </li>
                        </ul>
                        <a href="/auth/register?plan=pro" class="block text-center btn-neon py-3 rounded-lg">
                            Começar Pro - 14 Dias Grátis
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 px-4">
            <div class="max-w-4xl mx-auto text-center card-dark p-12 rounded-2xl neon-border">
                <h2 class="text-4xl md:text-5xl font-bold mb-6">
                    Pronto para revolucionar seu negócio?
                </h2>
                <p class="text-xl text-gray-400 mb-8">
                    Junte-se aos Personal Trainers que já estão usando IA para escalar seus resultados.
                </p>
                <a href="/auth/register" class="btn-neon px-12 py-4 rounded-lg text-xl inline-flex items-center">
                    <i class="fas fa-rocket mr-3"></i>
                    Começar Agora - Grátis por 14 Dias
                </a>
                <p class="text-gray-500 mt-4 text-sm">
                    Sem cartão de crédito. Cancele quando quiser.
                </p>
            </div>
        </section>

        <!-- Footer -->
        <footer class="border-t border-gray-800 py-12 px-4">
            <div class="max-w-7xl mx-auto text-center text-gray-400">
                <div class="flex items-center justify-center mb-4">
                    <i class="fas fa-dumbbell text-2xl mr-2" style="color: #CCFF00;"></i>
                    <span class="text-xl font-bold text-white">ForteTrain</span>
                </div>
                <p class="mb-4">Inteligência Artificial para Personal Trainers</p>
                <p class="text-sm">&copy; 2026 ForteTrain. Todos os direitos reservados.</p>
                <div class="mt-6 space-x-6">
                    <a href="#" class="hover:text-white transition">Termos de Uso</a>
                    <a href="#" class="hover:text-white transition">Política de Privacidade</a>
                    <a href="#" class="hover:text-white transition">Contato</a>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `)
})
