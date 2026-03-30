import { Hono } from 'hono'

export const omniSportLandingRoutes = new Hono()

// Omni-Sport Landing Page - Interactive Multi-Sport Showcase
omniSportLandingRoutes.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ForteTrain Omni-Sport - Plataforma Multi-Modalidade</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            
            body {
                background: #0D0D0D;
                color: #FFFFFF;
                overflow-x: hidden;
            }

            /* Hero Gradient Background */
            .hero-gradient {
                background: linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%);
                position: relative;
            }

            .hero-gradient::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 50% 50%, rgba(204, 255, 0, 0.1) 0%, transparent 70%);
                animation: pulse-slow 4s ease-in-out infinite;
            }

            /* Sport Tabs */
            .sport-tab {
                background: rgba(26, 26, 26, 0.6);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
            }

            .sport-tab:hover {
                border-color: rgba(204, 255, 0, 0.3);
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .sport-tab.active {
                background: rgba(26, 26, 26, 0.9);
                border-color: var(--tab-color, #CCFF00);
                box-shadow: 0 0 30px var(--tab-glow, rgba(204, 255, 0, 0.5));
            }

            /* Tab Content Cards */
            .sport-content-card {
                background: rgba(26, 26, 26, 0.85);
                backdrop-filter: blur(30px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 1rem;
                padding: 2rem;
                min-height: 400px;
            }

            .feature-badge {
                background: rgba(204, 255, 0, 0.1);
                border: 1px solid rgba(204, 255, 0, 0.3);
                padding: 0.5rem 1rem;
                border-radius: 2rem;
                font-size: 0.875rem;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
            }

            /* Metrics Display */
            .metric-pill {
                background: rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 0.75rem 1.5rem;
                border-radius: 2rem;
                font-weight: 600;
            }

            /* CTA Buttons */
            .cta-primary {
                background: linear-gradient(135deg, #CCFF00, #99FF00);
                color: #000;
                padding: 1rem 2.5rem;
                border-radius: 0.75rem;
                font-weight: 700;
                font-size: 1.125rem;
                box-shadow: 0 0 30px rgba(204, 255, 0, 0.5);
                transition: all 0.3s;
                border: none;
                cursor: pointer;
            }

            .cta-primary:hover {
                transform: scale(1.05);
                box-shadow: 0 0 50px rgba(204, 255, 0, 0.7);
            }

            /* Animations */
            @keyframes pulse-slow {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }

            .animate-float {
                animation: float 3s ease-in-out infinite;
            }

            /* Hide non-active tabs */
            .tab-content {
                display: none;
            }

            .tab-content.active {
                display: block;
                animation: fadeIn 0.5s ease-in-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>
        <!-- Hero Section -->
        <div class="hero-gradient min-h-screen flex flex-col items-center justify-center px-4 py-20">
            <div class="text-center max-w-5xl mx-auto">
                <!-- Logo & Tagline -->
                <div class="mb-8 animate-float">
                    <h1 class="text-6xl md:text-8xl font-black mb-4" style="font-family: 'Space Grotesk', sans-serif;">
                        <span class="neon-gradient-text">ForteTrain</span>
                    </h1>
                    <p class="text-2xl md:text-3xl font-light text-gray-300 mb-2">Omni-Sport Intelligence</p>
                    <p class="text-lg text-gray-400">A plataforma de IA que se adapta ao <strong class="text-white">SEU</strong> esporte</p>
                </div>

                <!-- Sport Count Badge -->
                <div class="feature-badge mb-12 mx-auto" style="color: #CCFF00;">
                    <i class="fas fa-trophy"></i>
                    <span>9 Modalidades Esportivas</span>
                </div>

                <!-- Main CTA -->
                <button class="cta-primary mb-20" onclick="scrollToSports()">
                    Explore as Modalidades
                    <i class="fas fa-arrow-down ml-2"></i>
                </button>
            </div>
        </div>

        <!-- Sports Showcase Section -->
        <div id="sportsShowcase" class="min-h-screen px-4 py-20 bg-gradient-to-b from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D]">
            <div class="max-w-7xl mx-auto">
                <h2 class="text-5xl font-black text-center mb-4" style="font-family: 'Space Grotesk', sans-serif;">
                    <span class="neon-gradient-text">Uma Plataforma, Infinitas Modalidades</span>
                </h2>
                <p class="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
                    Geração de treinos com IA especializada para cada esporte. Prompts otimizados, métricas relevantes e UI adaptativa.
                </p>

                <!-- Sport Tabs Grid -->
                <div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-12" id="sportTabs">
                    <!-- Tabs will be rendered by JavaScript -->
                </div>

                <!-- Tab Content -->
                <div class="sport-content-card" id="tabContent">
                    <!-- Content will be rendered by JavaScript -->
                </div>

                <!-- CTA Section -->
                <div class="text-center mt-16">
                    <button class="cta-primary" onclick="window.location.href='/auth/register'">
                        Começar Gratuitamente
                        <i class="fas fa-rocket ml-2"></i>
                    </button>
                    <p class="text-gray-500 mt-4 text-sm">Teste grátis por 14 dias • Sem cartão de crédito</p>
                </div>
            </div>
        </div>

        <!-- Features Section -->
        <div class="px-4 py-20">
            <div class="max-w-7xl mx-auto">
                <h2 class="text-4xl font-black text-center mb-16" style="font-family: 'Space Grotesk', sans-serif;">
                    Por Que Personal Trainers Escolhem ForteTrain?
                </h2>

                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="sport-content-card text-center">
                        <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center neon-gradient">
                            <i class="fas fa-brain text-4xl text-black"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">IA Especializada</h3>
                        <p class="text-gray-400">Prompts otimizados por modalidade. A IA entende de ciclismo, natação, CrossFit e muito mais.</p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="sport-content-card text-center">
                        <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #00D4FF, #0099CC);">
                            <i class="fas fa-chart-line text-4xl text-black"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">Métricas Relevantes</h3>
                        <p class="text-gray-400">FTP no ciclismo, pace na corrida, drills no tênis. Cada esporte tem suas próprias métricas.</p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="sport-content-card text-center">
                        <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #FF6B35, #FF4757);">
                            <i class="fas fa-palette text-4xl text-black"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">UI Adaptativa</h3>
                        <p class="text-gray-400">Cores e ícones mudam automaticamente para cada modalidade. UX otimizada por esporte.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pricing Section -->
        <div class="px-4 py-20 bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A]">
            <div class="max-w-5xl mx-auto text-center">
                <h2 class="text-4xl font-black mb-6" style="font-family: 'Space Grotesk', sans-serif;">
                    Comece Hoje. Escale Amanhã.
                </h2>
                <p class="text-xl text-gray-400 mb-12">Plano único. Todas as modalidades. Sem limites.</p>

                <div class="sport-content-card max-w-md mx-auto">
                    <div class="text-center">
                        <h3 class="text-3xl font-bold mb-2">Pro Plan</h3>
                        <div class="text-6xl font-black mb-6">
                            <span class="neon-gradient-text">R$ 199</span>
                            <span class="text-2xl text-gray-500">/mês</span>
                        </div>
                        
                        <ul class="text-left space-y-4 mb-8">
                            <li class="flex items-start">
                                <i class="fas fa-check text-[#CCFF00] mt-1 mr-3"></i>
                                <span><strong>9 Modalidades Esportivas</strong> disponíveis</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-[#CCFF00] mt-1 mr-3"></i>
                                <span><strong>100 Alunos</strong> simultâneos</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-[#CCFF00] mt-1 mr-3"></i>
                                <span><strong>500 Gerações IA</strong> por mês</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-[#CCFF00] mt-1 mr-3"></i>
                                <span><strong>Módulo Vision</strong> para identificação de equipamentos</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-[#CCFF00] mt-1 mr-3"></i>
                                <span><strong>WhatsApp Automation</strong> para retenção</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-[#CCFF00] mt-1 mr-3"></i>
                                <span><strong>Analytics Avançado</strong> por modalidade</span>
                            </li>
                        </ul>

                        <button class="cta-primary w-full" onclick="window.location.href='/auth/register'">
                            <i class="fas fa-rocket mr-2"></i>
                            Começar Teste Grátis
                        </button>
                        <p class="text-gray-500 text-sm mt-4">14 dias grátis • Cancele quando quiser</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Script -->
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // Sport configurations
            const sports = [
                { type: 'bodybuilding', name: 'Musculação', icon: 'fa-dumbbell', color: '#CCFF00', glow: 'rgba(204, 255, 0, 0.5)', description: 'Treinos de hipertrofia, força e condicionamento físico', metrics: ['Séries', 'Repetições', 'Carga (kg)', 'Descanso'], features: ['Divisões de treino (ABC, Push/Pull)', 'Periodização avançada', 'Volume e intensidade otimizados', 'Progressão de carga inteligente'] },
                { type: 'cycling', name: 'Ciclismo', icon: 'fa-bicycle', color: '#00D4FF', glow: 'rgba(0, 212, 255, 0.5)', description: 'Treinos de estrada, MTB, rolo e pista', metrics: ['Distância (km)', 'Elevação (m)', 'Zonas de Potência (FTP)', 'Cadência (rpm)'], features: ['Intervalos de potência (FTP)', 'Treinos por zonas de FC', 'Sweet spot e threshold', 'Periodização de volume'] },
                { type: 'running', name: 'Corrida', icon: 'fa-person-running', color: '#7CFC00', glow: 'rgba(124, 252, 0, 0.5)', description: 'Treinos de corrida de rua, trail e pista', metrics: ['Distância (km)', 'Pace (min/km)', 'Elevação (m)', 'Zonas de FC'], features: ['Treinos intervalados', 'Long runs progressivos', 'Fartlek e tempo runs', 'Periodização para provas'] },
                { type: 'tennis', name: 'Tênis', icon: 'fa-table-tennis-paddle-ball', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)', description: 'Drills técnicos, táticos e físicos', metrics: ['Drills', 'Duração', 'Intensidade', 'Foco Técnico'], features: ['Drills de forehand/backhand', 'Footwork patterns', 'Simulação de jogos', 'Treinos físicos específicos'] },
                { type: 'beach_tennis', name: 'Beach Tennis', icon: 'fa-sun', color: '#FF6B35', glow: 'rgba(255, 107, 53, 0.5)', description: 'Treinos na areia com foco em potência e agilidade', metrics: ['Drills', 'Cenários de Jogo', 'Saque', 'Intensidade'], features: ['Drills específicos para areia', 'Treino de saque', 'Simulação de pontos', 'Condicionamento funcional'] },
                { type: 'swimming', name: 'Natação', icon: 'fa-person-swimming', color: '#00CED1', glow: 'rgba(0, 206, 209, 0.5)', description: 'Treinos de piscina e águas abertas', metrics: ['Distância (m)', 'Nado', 'Intervalos', 'Foco Técnico'], features: ['Sets estruturados', 'Treino por nados', 'Técnica e velocidade', 'Periodização por metragem'] },
                { type: 'crossfit', name: 'CrossFit', icon: 'fa-bolt', color: '#FF0000', glow: 'rgba(255, 0, 0, 0.5)', description: 'WODs funcionais de alta intensidade', metrics: ['WOD Type', 'Movimentos', 'Time Cap', 'Scaling'], features: ['WODs clássicos (Fran, Murph)', 'EMOM e AMRAP', 'Scaling para iniciantes', 'Benchmark tracking'] },
                { type: 'pilates', name: 'Pilates', icon: 'fa-circle-dot', color: '#FF69B4', glow: 'rgba(255, 105, 180, 0.5)', description: 'Exercícios de controle, força e flexibilidade', metrics: ['Repetições', 'Duração', 'Respiração', 'Equipamento'], features: ['Mat e Reformer', 'Foco em core', 'Padrões respiratórios', 'Progressões controladas'] },
                { type: 'physiotherapy', name: 'Fisioterapia', icon: 'fa-heart-pulse', color: '#9370DB', glow: 'rgba(147, 112, 219, 0.5)', description: 'Exercícios terapêuticos e reabilitação', metrics: ['Exercícios', 'Hold Time', 'Área Alvo', 'Nível de Dor'], features: ['Protocolos de reabilitação', 'Exercícios terapêuticos', 'Controle de dor', 'Progressão segura'] }
            ];

            let activeSport = sports[0];

            // Render sport tabs
            function renderTabs() {
                const tabsContainer = document.getElementById('sportTabs');
                tabsContainer.innerHTML = sports.map((sport, idx) => 
                    '<div class="sport-tab p-4 rounded-xl text-center ' + (idx === 0 ? 'active' : '') + '" ' +
                        'data-sport="' + sport.type + '" ' +
                        'onclick="selectSport(\'' + sport.type + '\')" ' +
                        'style="--tab-color: ' + sport.color + '; --tab-glow: ' + sport.glow + ';">' +
                        '<i class="fas ' + sport.icon + ' text-3xl mb-2" style="color: ' + sport.color + ';"></i>' +
                        '<div class="text-sm font-semibold text-gray-300">' + sport.name + '</div>' +
                    '</div>'
                ).join('');
            }

            // Render tab content
            function renderTabContent(sport) {
                const contentContainer = document.getElementById('tabContent');
                
                contentContainer.innerHTML = 
                    '<div class="grid md:grid-cols-2 gap-8">' +
                        '<!-- Left: Sport Info -->' +
                        '<div>' +
                            '<div class="flex items-center mb-6">' +
                                '<div class="w-16 h-16 rounded-xl flex items-center justify-center mr-4" style="background: linear-gradient(135deg, ' + sport.color + ', ' + sport.color + 'CC); box-shadow: 0 0 30px ' + sport.glow + ';">' +
                                    '<i class="fas ' + sport.icon + ' text-3xl text-black"></i>' +
                                '</div>' +
                                '<div>' +
                                    '<h3 class="text-3xl font-bold" style="color: ' + sport.color + ';">' + sport.name + '</h3>' +
                                    '<p class="text-gray-400">' + sport.description + '</p>' +
                                '</div>' +
                            '</div>' +
                            
                            '<h4 class="text-xl font-bold mb-4 flex items-center">' +
                                '<i class="fas fa-chart-bar mr-2" style="color: ' + sport.color + ';"></i>' +
                                'Métricas Rastreadas' +
                            '</h4>' +
                            '<div class="flex flex-wrap gap-3 mb-8">' +
                                sport.metrics.map(m => 
                                    '<div class="metric-pill">' + m + '</div>'
                                ).join('') +
                            '</div>' +
                            
                            '<h4 class="text-xl font-bold mb-4 flex items-center">' +
                                '<i class="fas fa-star mr-2" style="color: ' + sport.color + ';"></i>' +
                                'Recursos Especializados' +
                            '</h4>' +
                            '<ul class="space-y-3">' +
                                sport.features.map(f => 
                                    '<li class="flex items-start">' +
                                        '<i class="fas fa-check-circle mt-1 mr-3" style="color: ' + sport.color + ';"></i>' +
                                        '<span class="text-gray-300">' + f + '</span>' +
                                    '</li>'
                                ).join('') +
                            '</ul>' +
                        '</div>' +
                        
                        '<!-- Right: Visual Demo -->' +
                        '<div class="flex flex-col justify-center">' +
                            '<div class="aspect-video rounded-xl mb-6 flex items-center justify-center" style="background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(26,26,26,0.9)); border: 2px solid ' + sport.color + '30;">' +
                                '<div class="text-center">' +
                                    '<i class="fas ' + sport.icon + ' text-8xl mb-4" style="color: ' + sport.color + ';"></i>' +
                                    '<p class="text-2xl font-bold" style="color: ' + sport.color + ';">Preview em Breve</p>' +
                                    '<p class="text-gray-500 mt-2">Screenshot do dashboard com este tema</p>' +
                                '</div>' +
                            '</div>' +
                            
                            '<div class="text-center">' +
                                '<p class="text-lg text-gray-400 mb-4">Experimente a IA especializada em ' + sport.name + '</p>' +
                                '<button class="px-6 py-3 rounded-lg font-bold transition-all" ' +
                                    'style="background: linear-gradient(135deg, ' + sport.color + ', ' + sport.color + 'CC); color: #000; box-shadow: 0 0 20px ' + sport.glow + ';" ' +
                                    'onclick="window.location.href=\'/auth/register\'">' +
                                    '<i class="fas fa-play mr-2"></i>' +
                                    'Testar Agora' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            }

            // Select sport tab
            function selectSport(sportType) {
                activeSport = sports.find(s => s.type === sportType);
                
                // Update active tab
                document.querySelectorAll('.sport-tab').forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.dataset.sport === sportType) {
                        tab.classList.add('active');
                    }
                });
                
                // Render new content
                renderTabContent(activeSport);
            }

            // Scroll to sports section
            function scrollToSports() {
                document.getElementById('sportsShowcase').scrollIntoView({ behavior: 'smooth' });
            }

            // Initialize
            document.addEventListener('DOMContentLoaded', () => {
                renderTabs();
                renderTabContent(activeSport);
            });
        </script>
    </body>
    </html>
  `)
})
