import { Hono } from 'hono'

export const dashboardRoutes = new Hono()

// Dashboard Principal do Personal
dashboardRoutes.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - FitFlow</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
            .student-inactive {
                border-left: 4px solid #FF3B30;
            }
            .student-active {
                border-left: 4px solid #00FF88;
            }
            .neon-badge {
                background: #CCFF00;
                color: #0D0D0D;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: bold;
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
                        <span class="ml-3 text-2xl font-bold" style="color: #CCFF00;">FitFlow</span>
                    </div>

                    <nav class="space-y-2">
                        <a href="/dashboard" class="flex items-center px-4 py-3 rounded-lg bg-gray-800 text-white">
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
                        <a href="/dashboard/settings" class="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
                            <i class="fas fa-cog mr-3"></i>Configurações
                        </a>
                    </nav>

                    <div class="mt-8 p-4 card-dark rounded-lg">
                        <div class="text-sm text-gray-400 mb-1">Plano Atual</div>
                        <div class="font-bold text-lg" style="color: #CCFF00;">Pro</div>
                        <div class="text-xs text-gray-500 mt-1">Alunos Ilimitados</div>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 ml-64">
                <!-- Top Bar -->
                <header class="card-dark border-b border-gray-800 px-8 py-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold">Dashboard</h1>
                            <p class="text-gray-400 text-sm">Bem-vindo de volta!</p>
                        </div>
                        <div class="flex items-center space-x-4">
                            <button class="btn-neon px-6 py-2 rounded-lg" onclick="openAIGenerator()">
                                <i class="fas fa-plus mr-2"></i>Novo Treino IA
                            </button>
                            <div class="relative">
                                <button class="relative p-2 text-gray-400 hover:text-white">
                                    <i class="fas fa-bell text-xl"></i>
                                    <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="text-right">
                                    <div class="font-medium" id="userName">Carregando...</div>
                                    <div class="text-xs text-gray-400">Personal Trainer</div>
                                </div>
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-green-400 flex items-center justify-center text-black font-bold">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Stats Cards -->
                <div class="p-8">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div class="card-dark p-6 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-400">Total de Alunos</span>
                                <i class="fas fa-users text-2xl" style="color: #CCFF00;"></i>
                            </div>
                            <div class="text-3xl font-bold" id="totalStudents">-</div>
                            <div class="text-sm text-gray-500 mt-1">+2 esta semana</div>
                        </div>

                        <div class="card-dark p-6 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-400">Alunos Ativos</span>
                                <i class="fas fa-fire text-2xl text-green-400"></i>
                            </div>
                            <div class="text-3xl font-bold" id="activeStudents">-</div>
                            <div class="text-sm text-gray-500 mt-1">Treinou nos últimos 7 dias</div>
                        </div>

                        <div class="card-dark p-6 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-400">Alertas</span>
                                <i class="fas fa-exclamation-triangle text-2xl text-red-400"></i>
                            </div>
                            <div class="text-3xl font-bold" id="inactiveStudents">-</div>
                            <div class="text-sm text-gray-500 mt-1">Alunos inativos há 3+ dias</div>
                        </div>

                        <div class="card-dark p-6 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-400">Treinos Criados</span>
                                <i class="fas fa-dumbbell text-2xl" style="color: #CCFF00;"></i>
                            </div>
                            <div class="text-3xl font-bold" id="totalWorkouts">-</div>
                            <div class="text-sm text-gray-500 mt-1">Este mês</div>
                        </div>
                    </div>

                    <!-- Recent Students & Alerts -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Alunos Recentes -->
                        <div class="card-dark p-6 rounded-xl">
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-xl font-bold">Alunos Recentes</h2>
                                <a href="/dashboard/students" class="text-sm" style="color: #CCFF00;">Ver todos</a>
                            </div>
                            <div class="space-y-4" id="recentStudentsList">
                                <div class="text-gray-400 text-center py-8">Carregando...</div>
                            </div>
                        </div>

                        <!-- Alertas de Inatividade -->
                        <div class="card-dark p-6 rounded-xl">
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-xl font-bold">
                                    <i class="fas fa-exclamation-circle text-red-400 mr-2"></i>
                                    Alertas de Inatividade
                                </h2>
                            </div>
                            <div class="space-y-4" id="alertsList">
                                <div class="text-gray-400 text-center py-8">Carregando...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // Check authentication
            const token = localStorage.getItem('fitflow_token');
            const user = JSON.parse(localStorage.getItem('fitflow_user') || '{}');

            if (!token) {
                window.location.href = '/auth/login';
            }

            // Set user name
            document.getElementById('userName').textContent = user.name || 'Usuário';

            // Load dashboard data
            async function loadDashboard() {
                try {
                    const response = await axios.get('/api/dashboard/stats', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    const data = response.data;

                    document.getElementById('totalStudents').textContent = data.totalStudents;
                    document.getElementById('activeStudents').textContent = data.activeStudents;
                    document.getElementById('inactiveStudents').textContent = data.inactiveStudents;
                    document.getElementById('totalWorkouts').textContent = data.totalWorkouts;

                    // Load recent students
                    loadRecentStudents();
                    loadAlerts();
                } catch (error) {
                    console.error('Error loading dashboard:', error);
                }
            }

            async function loadRecentStudents() {
                try {
                    const response = await axios.get('/api/students?limit=5', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    const students = response.data.students;
                    const listEl = document.getElementById('recentStudentsList');

                    if (students.length === 0) {
                        listEl.innerHTML = '<div class="text-gray-400 text-center py-4">Nenhum aluno cadastrado</div>';
                        return;
                    }

                    listEl.innerHTML = students.map(student => {
                        const isActive = student.status === 'active';
                        const statusClass = isActive ? 'student-active' : 'student-inactive';
                        const statusColor = isActive ? 'text-green-400' : 'text-red-400';
                        
                        return \`
                            <div class="flex items-center justify-between p-4 bg-black/30 rounded-lg \${statusClass}">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                                        \${student.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div class="font-medium">\${student.full_name}</div>
                                        <div class="text-sm text-gray-400">\${student.goal || 'Sem objetivo definido'}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm \${statusColor}">
                                        <i class="fas fa-circle text-xs"></i> \${isActive ? 'Ativo' : 'Inativo'}
                                    </div>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } catch (error) {
                    console.error('Error loading students:', error);
                }
            }

            async function loadAlerts() {
                try {
                    const response = await axios.get('/api/students/inactive', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    const inactiveStudents = response.data.students;
                    const listEl = document.getElementById('alertsList');

                    if (inactiveStudents.length === 0) {
                        listEl.innerHTML = '<div class="text-gray-400 text-center py-4">Nenhum alerta no momento 👍</div>';
                        return;
                    }

                    listEl.innerHTML = inactiveStudents.map(student => {
                        const daysSinceLastWorkout = Math.floor((Date.now() - student.last_workout_date * 1000) / (1000 * 60 * 60 * 24));
                        
                        return \`
                            <div class="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-800">
                                <div class="flex items-center space-x-3">
                                    <i class="fas fa-exclamation-triangle text-red-400"></i>
                                    <div>
                                        <div class="font-medium">\${student.full_name}</div>
                                        <div class="text-sm text-gray-400">Sem treinar há \${daysSinceLastWorkout} dias</div>
                                    </div>
                                </div>
                                <button class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition" onclick="sendMotivationalMessage('\${student.id}')">
                                    <i class="fas fa-paper-plane mr-1"></i> Enviar Msg
                                </button>
                            </div>
                        \`;
                    }).join('');
                } catch (error) {
                    console.error('Error loading alerts:', error);
                }
            }

            function openAIGenerator() {
                window.location.href = '/dashboard/ai-generator';
            }

            async function sendMotivationalMessage(studentId) {
                try {
                    await axios.post('/api/notifications/motivational', 
                        { studentId },
                        { headers: { 'Authorization': 'Bearer ' + token } }
                    );
                    alert('Mensagem motivacional enviada com sucesso!');
                    loadAlerts();
                } catch (error) {
                    alert('Erro ao enviar mensagem: ' + (error.response?.data?.error || 'Erro desconhecido'));
                }
            }

            // Load dashboard on page load
            loadDashboard();
        </script>
    </body>
    </html>
  `)
})

// Other dashboard routes (students, workouts, etc.) will be added next
dashboardRoutes.get('/students', (c) => {
  return c.html('<h1>Students Management - Coming soon</h1>')
})

dashboardRoutes.get('/ai-generator', (c) => {
  return c.html('<h1>AI Workout Generator - Coming soon</h1>')
})
