import { Hono } from 'hono'

export const settingsRoute = new Hono()

// Settings Page
settingsRoute.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Configurações - ForteTrain</title>
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
            .sidebar {
                background: #0D0D0D;
                border-right: 1px solid #333;
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
            .tab-active {
                background: #1A1A1A;
                border-bottom: 2px solid #CCFF00;
            }
        </style>
    </head>
    <body>
        <div class="flex min-h-screen">
            <!-- Sidebar -->
            <aside class="sidebar w-64 fixed h-full">
                <div class="p-6">
                    <div class="flex items-center mb-8">
                        <i class="fas fa-dumbbell text-3xl" style="color: #CCFF00;"></i>
                        <span class="ml-3 text-2xl font-bold" style="color: #CCFF00;">ForteTrain</span>
                    </div>

                    <nav class="space-y-2">
                        <a href="/dashboard" class="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
                            <i class="fas fa-home mr-3"></i>Dashboard
                        </a>
                        <a href="/dashboard/students" class="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
                            <i class="fas fa-users mr-3"></i>Alunos
                        </a>
                        <a href="/dashboard/workouts" class="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
                            <i class="fas fa-dumbbell mr-3"></i>Treinos
                        </a>
                        <a href="/dashboard/ai-generator" class="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
                            <i class="fas fa-brain mr-3"></i>Gerador IA
                        </a>
                        <a href="/dashboard/analytics" class="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
                            <i class="fas fa-chart-line mr-3"></i>Analytics
                        </a>
                        <a href="/dashboard/notifications" class="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
                            <i class="fas fa-bell mr-3"></i>Notificações
                        </a>
                        <a href="/dashboard/settings" class="flex items-center px-4 py-3 rounded-lg bg-gray-800 text-white">
                            <i class="fas fa-cog mr-3"></i>Configurações
                        </a>
                    </nav>

                    <div class="mt-8 p-4 card-dark rounded-lg">
                        <div class="text-sm text-gray-400 mb-1">Plano Atual</div>
                        <div class="font-bold text-lg" style="color: #CCFF00;">Pro</div>
                        <div class="text-xs text-gray-500 mt-1">Alunos Ilimitados</div>
                        <button class="mt-3 w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-sm transition">
                            Gerenciar Plano
                        </button>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 ml-64">
                <!-- Top Bar -->
                <header class="card-dark border-b border-gray-800 px-8 py-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold">
                                <i class="fas fa-cog mr-2" style="color: #CCFF00;"></i>
                                Configurações
                            </h1>
                            <p class="text-gray-400 text-sm">Gerencie seu perfil e preferências</p>
                        </div>
                    </div>
                </header>

                <div class="p-8">
                    <!-- Tabs -->
                    <div class="card-dark rounded-xl mb-8">
                        <div class="flex border-b border-gray-800">
                            <button onclick="showTab('profile')" id="tab-profile" class="tab-active px-6 py-4 font-medium">
                                <i class="fas fa-user mr-2"></i>Perfil
                            </button>
                            <button onclick="showTab('api')" id="tab-api" class="px-6 py-4 text-gray-400 hover:text-white transition">
                                <i class="fas fa-key mr-2"></i>API Keys
                            </button>
                            <button onclick="showTab('branding')" id="tab-branding" class="px-6 py-4 text-gray-400 hover:text-white transition">
                                <i class="fas fa-palette mr-2"></i>Personalização
                            </button>
                            <button onclick="showTab('billing')" id="tab-billing" class="px-6 py-4 text-gray-400 hover:text-white transition">
                                <i class="fas fa-credit-card mr-2"></i>Pagamento
                            </button>
                        </div>

                        <!-- Profile Tab -->
                        <div id="content-profile" class="p-8">
                            <h2 class="text-xl font-bold mb-6">Informações do Perfil</h2>
                            
                            <form id="profileForm" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium mb-2 text-gray-300">Nome Completo</label>
                                        <input type="text" id="fullName" value="André Silva" class="input-dark w-full px-4 py-3 rounded-lg" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium mb-2 text-gray-300">Email</label>
                                        <input type="email" id="email" value="andre@fortetrain.app" class="input-dark w-full px-4 py-3 rounded-lg" disabled />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium mb-2 text-gray-300">WhatsApp</label>
                                        <input type="text" id="whatsapp" value="+55 11 99999-9999" class="input-dark w-full px-4 py-3 rounded-lg" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium mb-2 text-gray-300">CREF</label>
                                        <input type="text" id="cref" placeholder="123456-G/SP" class="input-dark w-full px-4 py-3 rounded-lg" />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2 text-gray-300">Bio / Apresentação</label>
                                    <textarea id="bio" rows="4" class="input-dark w-full px-4 py-3 rounded-lg" placeholder="Conte um pouco sobre você e sua experiência..."></textarea>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2 text-gray-300">Subdomínio Personalizado</label>
                                    <div class="flex items-center">
                                        <input type="text" id="subdomain" value="andre" class="input-dark flex-1 px-4 py-3 rounded-l-lg" />
                                        <span class="bg-gray-800 px-4 py-3 rounded-r-lg text-gray-400">.fortetrain.app</span>
                                    </div>
                                </div>

                                <button type="submit" class="btn-neon px-8 py-3 rounded-lg">
                                    <i class="fas fa-save mr-2"></i>Salvar Alterações
                                </button>
                            </form>
                        </div>

                        <!-- API Keys Tab -->
                        <div id="content-api" class="p-8 hidden">
                            <h2 class="text-xl font-bold mb-6">Chaves de API</h2>
                            
                            <div class="space-y-6">
                                <!-- OpenAI API -->
                                <div class="bg-black/30 p-6 rounded-xl">
                                    <div class="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 class="font-bold text-lg">OpenAI API Key</h3>
                                            <p class="text-sm text-gray-400">Necessária para o Gerador de Treinos IA e Módulo Vision</p>
                                        </div>
                                        <span class="px-3 py-1 bg-green-600 text-white text-xs rounded-full">Ativa</span>
                                    </div>
                                    <input type="password" value="sk-proj-demo..." class="input-dark w-full px-4 py-3 rounded-lg mb-3" disabled />
                                    <button class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition">
                                        <i class="fas fa-edit mr-2"></i>Atualizar Key
                                    </button>
                                </div>

                                <!-- YouTube API -->
                                <div class="bg-black/30 p-6 rounded-xl">
                                    <div class="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 class="font-bold text-lg">YouTube Data API Key</h3>
                                            <p class="text-sm text-gray-400">Opcional - Para busca de vídeos tutoriais</p>
                                        </div>
                                        <span class="px-3 py-1 bg-gray-600 text-white text-xs rounded-full">Não configurada</span>
                                    </div>
                                    <input type="text" placeholder="Insira sua YouTube API Key" class="input-dark w-full px-4 py-3 rounded-lg mb-3" />
                                    <button class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition">
                                        <i class="fas fa-plus mr-2"></i>Adicionar Key
                                    </button>
                                </div>

                                <!-- WhatsApp Business API -->
                                <div class="bg-black/30 p-6 rounded-xl">
                                    <div class="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 class="font-bold text-lg">WhatsApp Business API</h3>
                                            <p class="text-sm text-gray-400">Para envio de notificações automáticas</p>
                                        </div>
                                        <span class="px-3 py-1 bg-gray-600 text-white text-xs rounded-full">Não configurada</span>
                                    </div>
                                    <input type="text" placeholder="Token de acesso" class="input-dark w-full px-4 py-3 rounded-lg mb-3" />
                                    <button class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition">
                                        <i class="fas fa-plus mr-2"></i>Adicionar Token
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Branding Tab -->
                        <div id="content-branding" class="p-8 hidden">
                            <h2 class="text-xl font-bold mb-6">Personalização da Landing Page</h2>
                            
                            <div class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2 text-gray-300">Cor Principal</label>
                                    <div class="flex items-center gap-4">
                                        <input type="color" value="#CCFF00" class="w-16 h-16 rounded-lg cursor-pointer" />
                                        <span class="text-gray-400">Cor atual: #CCFF00</span>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2 text-gray-300">Logo (URL)</label>
                                    <input type="url" placeholder="https://..." class="input-dark w-full px-4 py-3 rounded-lg" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2 text-gray-300">Tagline</label>
                                    <input type="text" value="Treino forte, resultados reais" class="input-dark w-full px-4 py-3 rounded-lg" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2 text-gray-300">Descrição</label>
                                    <textarea rows="4" class="input-dark w-full px-4 py-3 rounded-lg" placeholder="Descrição da sua página de vendas..."></textarea>
                                </div>

                                <button class="btn-neon px-8 py-3 rounded-lg">
                                    <i class="fas fa-save mr-2"></i>Salvar Personalização
                                </button>
                            </div>
                        </div>

                        <!-- Billing Tab -->
                        <div id="content-billing" class="p-8 hidden">
                            <h2 class="text-xl font-bold mb-6">Informações de Pagamento</h2>
                            
                            <div class="bg-black/30 p-6 rounded-xl mb-6">
                                <div class="flex items-center justify-between mb-4">
                                    <div>
                                        <div class="text-gray-400 text-sm">Plano Atual</div>
                                        <div class="text-2xl font-bold" style="color: #CCFF00;">Pro</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-gray-400 text-sm">Próximo Pagamento</div>
                                        <div class="text-xl font-bold">R$ 199,90</div>
                                        <div class="text-sm text-gray-500">em 15 dias</div>
                                    </div>
                                </div>
                                <div class="border-t border-gray-700 pt-4 mt-4">
                                    <div class="flex justify-between text-sm mb-2">
                                        <span class="text-gray-400">Método de Pagamento</span>
                                        <span class="font-medium">Cartão •••• 4242</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-400">Próxima cobrança</span>
                                        <span class="font-medium">01/04/2026</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex gap-4">
                                <button class="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition">
                                    <i class="fas fa-credit-card mr-2"></i>Atualizar Cartão
                                </button>
                                <button class="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition">
                                    <i class="fas fa-file-invoice mr-2"></i>Ver Faturas
                                </button>
                                <button class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition ml-auto">
                                    <i class="fas fa-times-circle mr-2"></i>Cancelar Plano
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            const token = localStorage.getItem('fortetrain_token');
            if (!token) {
                window.location.href = '/auth/login';
            }

            function showTab(tabName) {
                // Hide all content
                document.querySelectorAll('[id^="content-"]').forEach(el => el.classList.add('hidden'));
                
                // Remove active class from all tabs
                document.querySelectorAll('[id^="tab-"]').forEach(el => {
                    el.classList.remove('tab-active');
                    el.classList.add('text-gray-400');
                });
                
                // Show selected content
                document.getElementById('content-' + tabName).classList.remove('hidden');
                
                // Add active class to selected tab
                const tab = document.getElementById('tab-' + tabName);
                tab.classList.add('tab-active');
                tab.classList.remove('text-gray-400');
            }

            document.getElementById('profileForm').addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Perfil atualizado com sucesso!');
            });
        </script>
    </body>
    </html>
  `)
})
