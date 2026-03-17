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
        <title>Dashboard - ForteTrain</title>
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
                        <span class="ml-3 text-2xl font-bold" style="color: #CCFF00;">ForteTrain</span>
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
            const token = localStorage.getItem('fortetrain_token');
            const user = JSON.parse(localStorage.getItem('fortetrain_user') || '{}');

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

// ==================== AI WORKOUT GENERATOR ====================
dashboardRoutes.get('/ai-generator', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gerador de Treinos IA - ForteTrain</title>
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
            .btn-neon:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
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
            .exercise-card {
                background: #0D0D0D;
                border: 1px solid #333;
                transition: all 0.3s;
            }
            .exercise-card:hover {
                border-color: #CCFF00;
            }
            .loading-spinner {
                border: 3px solid #333;
                border-top: 3px solid #CCFF00;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
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
                        <a href="/dashboard/ai-generator" class="flex items-center px-4 py-3 rounded-lg bg-gray-800 text-white">
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
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 ml-64">
                <!-- Top Bar -->
                <header class="card-dark border-b border-gray-800 px-8 py-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold">
                                <i class="fas fa-brain mr-2" style="color: #CCFF00;"></i>
                                Gerador de Treinos IA
                            </h1>
                            <p class="text-gray-400 text-sm">Crie treinos personalizados em 30 segundos</p>
                        </div>
                        <a href="/dashboard" class="text-gray-400 hover:text-white transition">
                            <i class="fas fa-arrow-left mr-2"></i>Voltar
                        </a>
                    </div>
                </header>

                <div class="p-8">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Form Section -->
                        <div class="card-dark p-8 rounded-xl">
                            <h2 class="text-2xl font-bold mb-6">
                                <i class="fas fa-magic mr-2" style="color: #CCFF00;"></i>
                                Configurar Treino
                            </h2>

                            <form id="workoutForm">
                                <!-- Student Selection -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-user mr-2"></i>Selecionar Aluno
                                    </label>
                                    <select id="studentId" class="input-dark w-full px-4 py-3 rounded-lg" required>
                                        <option value="">Carregando alunos...</option>
                                    </select>
                                </div>

                                <!-- Workout Type -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-dumbbell mr-2"></i>Tipo de Treino
                                    </label>
                                    <select id="workoutType" class="input-dark w-full px-4 py-3 rounded-lg" required>
                                        <option value="hipertrofia">Hipertrofia</option>
                                        <option value="emagrecimento">Emagrecimento</option>
                                        <option value="condicionamento">Condicionamento</option>
                                        <option value="forca">Força</option>
                                        <option value="funcional">Funcional</option>
                                    </select>
                                </div>

                                <!-- Muscle Focus -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-crosshairs mr-2"></i>Foco Muscular
                                    </label>
                                    <input 
                                        type="text" 
                                        id="muscleFocus" 
                                        class="input-dark w-full px-4 py-3 rounded-lg"
                                        placeholder="Ex: Peito e Tríceps, Posteriores de Coxa, etc."
                                        required
                                    />
                                </div>

                                <!-- Duration -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-clock mr-2"></i>Duração (minutos)
                                    </label>
                                    <input 
                                        type="number" 
                                        id="duration" 
                                        class="input-dark w-full px-4 py-3 rounded-lg"
                                        placeholder="45"
                                        min="15"
                                        max="120"
                                        value="45"
                                        required
                                    />
                                </div>

                                <!-- Equipment -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-tools mr-2"></i>Equipamentos Disponíveis
                                    </label>
                                    <select id="equipment" class="input-dark w-full px-4 py-3 rounded-lg" required>
                                        <option value="completa">Academia Completa</option>
                                        <option value="condominio">Academia de Condomínio</option>
                                        <option value="casa">Treino em Casa (Básico)</option>
                                        <option value="ao-ar-livre">Treino ao Ar Livre</option>
                                    </select>
                                </div>

                                <!-- Additional Notes -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-sticky-note mr-2"></i>Observações Adicionais (opcional)
                                    </label>
                                    <textarea 
                                        id="notes" 
                                        class="input-dark w-full px-4 py-3 rounded-lg"
                                        rows="3"
                                        placeholder="Ex: Aluno tem restrição de joelho, priorizar exercícios de baixo impacto..."
                                    ></textarea>
                                </div>

                                <button type="submit" class="btn-neon w-full py-4 rounded-lg text-lg" id="generateBtn">
                                    <i class="fas fa-rocket mr-2"></i>Gerar Treino com IA
                                </button>
                            </form>
                        </div>

                        <!-- Result Section -->
                        <div class="card-dark p-8 rounded-xl">
                            <h2 class="text-2xl font-bold mb-6">
                                <i class="fas fa-file-alt mr-2" style="color: #CCFF00;"></i>
                                Treino Gerado
                            </h2>

                            <div id="loadingSection" class="hidden text-center py-12">
                                <div class="loading-spinner mx-auto mb-4"></div>
                                <p class="text-gray-400">Gerando treino personalizado...</p>
                                <p class="text-sm text-gray-500 mt-2">A IA está analisando o perfil do aluno</p>
                            </div>

                            <div id="emptySection" class="text-center py-12">
                                <i class="fas fa-brain text-6xl text-gray-700 mb-4"></i>
                                <p class="text-gray-400">Preencha o formulário ao lado para gerar um treino</p>
                            </div>

                            <div id="resultSection" class="hidden">
                                <div class="mb-6">
                                    <h3 class="text-xl font-bold mb-2" id="workoutTitle">-</h3>
                                    <p class="text-gray-400 text-sm" id="workoutDescription">-</p>
                                </div>

                                <div class="space-y-4" id="exercisesList">
                                    <!-- Exercises will be inserted here -->
                                </div>

                                <div class="mt-6 flex gap-4">
                                    <button onclick="saveWorkout()" class="btn-neon flex-1 py-3 rounded-lg">
                                        <i class="fas fa-save mr-2"></i>Salvar Treino
                                    </button>
                                    <button onclick="editWorkout()" class="bg-gray-700 hover:bg-gray-600 flex-1 py-3 rounded-lg transition">
                                        <i class="fas fa-edit mr-2"></i>Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- AI Stats -->
                    <div class="mt-8 card-dark p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-bold text-lg mb-1">
                                    <i class="fas fa-chart-bar mr-2" style="color: #CCFF00;"></i>
                                    Uso de IA Este Mês
                                </h3>
                                <p class="text-gray-400 text-sm">Monitoramento de custos em tempo real</p>
                            </div>
                            <div class="text-right">
                                <div class="text-3xl font-bold" style="color: #CCFF00;" id="aiUsageCount">0</div>
                                <div class="text-sm text-gray-400">gerações de treino</div>
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

            let currentWorkoutData = null;

            // Load students
            async function loadStudents() {
                try {
                    const response = await axios.get('/api/students', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    const students = response.data.students;
                    const select = document.getElementById('studentId');
                    
                    if (students.length === 0) {
                        select.innerHTML = '<option value="">Nenhum aluno cadastrado</option>';
                        return;
                    }

                    select.innerHTML = '<option value="">Selecione um aluno</option>' +
                        students.map(s => \`<option value="\${s.id}">\${s.full_name} - \${s.goal || 'Sem objetivo'}</option>\`).join('');
                } catch (error) {
                    console.error('Error loading students:', error);
                }
            }

            // Generate workout
            document.getElementById('workoutForm').addEventListener('submit', async (e) => {
                e.preventDefault();

                const studentId = document.getElementById('studentId').value;
                const workoutType = document.getElementById('workoutType').value;
                const muscleFocus = document.getElementById('muscleFocus').value;
                const duration = document.getElementById('duration').value;
                const equipment = document.getElementById('equipment').value;
                const notes = document.getElementById('notes').value;

                if (!studentId) {
                    alert('Por favor, selecione um aluno');
                    return;
                }

                // Build prompt
                const prompt = \`Crie um treino de \${workoutType} focado em \${muscleFocus}.
Duração: \${duration} minutos
Equipamentos: \${equipment}
\${notes ? 'Observações: ' + notes : ''}

Retorne APENAS um JSON válido seguindo exatamente esta estrutura:
{
  "title": "Nome do Treino",
  "description": "Descrição breve do treino",
  "exercises": [
    {
      "name": "Nome do Exercício",
      "sets": 4,
      "reps": "8-12",
      "rest": 90,
      "notes": "Observações técnicas importantes"
    }
  ]
}\`;

                // Show loading
                document.getElementById('emptySection').classList.add('hidden');
                document.getElementById('resultSection').classList.add('hidden');
                document.getElementById('loadingSection').classList.remove('hidden');
                document.getElementById('generateBtn').disabled = true;
                document.getElementById('generateBtn').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Gerando...';

                try {
                    const response = await axios.post('/api/ai/generate-workout',
                        { studentId, prompt },
                        { headers: { 'Authorization': 'Bearer ' + token } }
                    );

                    currentWorkoutData = response.data.workout;

                    // Display result
                    document.getElementById('workoutTitle').textContent = currentWorkoutData.title;
                    document.getElementById('workoutDescription').textContent = currentWorkoutData.description;

                    const exercisesHtml = currentWorkoutData.exercises.map((ex, idx) => \`
                        <div class="exercise-card p-4 rounded-lg">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-green-400 flex items-center justify-center text-black font-bold mr-3">
                                        \${idx + 1}
                                    </div>
                                    <h4 class="font-bold text-lg">\${ex.name}</h4>
                                </div>
                            </div>
                            <div class="ml-11 grid grid-cols-3 gap-4 text-sm mb-2">
                                <div>
                                    <span class="text-gray-400">Séries:</span>
                                    <span class="font-bold ml-2">\${ex.sets}</span>
                                </div>
                                <div>
                                    <span class="text-gray-400">Reps:</span>
                                    <span class="font-bold ml-2">\${ex.reps}</span>
                                </div>
                                <div>
                                    <span class="text-gray-400">Descanso:</span>
                                    <span class="font-bold ml-2">\${ex.rest}s</span>
                                </div>
                            </div>
                            \${ex.notes ? \`<div class="ml-11 text-sm text-gray-400 mt-2">
                                <i class="fas fa-info-circle mr-1"></i>\${ex.notes}
                            </div>\` : ''}
                        </div>
                    \`).join('');

                    document.getElementById('exercisesList').innerHTML = exercisesHtml;

                    document.getElementById('loadingSection').classList.add('hidden');
                    document.getElementById('resultSection').classList.remove('hidden');

                    // Update AI usage count
                    document.getElementById('aiUsageCount').textContent = 
                        parseInt(document.getElementById('aiUsageCount').textContent) + 1;

                } catch (error) {
                    alert('Erro ao gerar treino: ' + (error.response?.data?.error || 'Erro desconhecido'));
                    document.getElementById('loadingSection').classList.add('hidden');
                    document.getElementById('emptySection').classList.remove('hidden');
                } finally {
                    document.getElementById('generateBtn').disabled = false;
                    document.getElementById('generateBtn').innerHTML = '<i class="fas fa-rocket mr-2"></i>Gerar Treino com IA';
                }
            });

            function saveWorkout() {
                alert('Treino salvo com sucesso! (Funcionalidade em desenvolvimento)');
            }

            function editWorkout() {
                alert('Editor de treino será implementado em breve!');
            }

            // Load students on page load
            loadStudents();
        </script>
    </body>
    </html>
  `)
})

// ==================== STUDENTS MANAGEMENT ====================
dashboardRoutes.get('/students', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gestão de Alunos - ForteTrain</title>
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
            .student-card {
                transition: all 0.3s;
            }
            .student-card:hover {
                border-color: #CCFF00;
                transform: translateY(-2px);
            }
            .badge-active {
                background: #00FF88;
                color: #0D0D0D;
            }
            .badge-inactive {
                background: #FF3B30;
                color: #FFFFFF;
            }
            .modal {
                display: none;
                position: fixed;
                z-index: 50;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.8);
                backdrop-filter: blur(5px);
            }
            .modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
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
                        <a href="/dashboard/students" class="flex items-center px-4 py-3 rounded-lg bg-gray-800 text-white">
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
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 ml-64">
                <!-- Top Bar -->
                <header class="card-dark border-b border-gray-800 px-8 py-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold">
                                <i class="fas fa-users mr-2" style="color: #CCFF00;"></i>
                                Gestão de Alunos
                            </h1>
                            <p class="text-gray-400 text-sm">Gerencie todos os seus alunos em um só lugar</p>
                        </div>
                        <button onclick="openAddModal()" class="btn-neon px-6 py-2 rounded-lg">
                            <i class="fas fa-plus mr-2"></i>Novo Aluno
                        </button>
                    </div>
                </header>

                <div class="p-8">
                    <!-- Filters -->
                    <div class="card-dark p-6 rounded-xl mb-8">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <input 
                                    type="text" 
                                    id="searchInput" 
                                    class="input-dark w-full px-4 py-2 rounded-lg"
                                    placeholder="Buscar aluno..."
                                    onkeyup="filterStudents()"
                                />
                            </div>
                            <div>
                                <select id="statusFilter" class="input-dark w-full px-4 py-2 rounded-lg" onchange="filterStudents()">
                                    <option value="">Todos os status</option>
                                    <option value="active">Ativos</option>
                                    <option value="inactive">Inativos</option>
                                </select>
                            </div>
                            <div>
                                <select id="goalFilter" class="input-dark w-full px-4 py-2 rounded-lg" onchange="filterStudents()">
                                    <option value="">Todos os objetivos</option>
                                    <option value="Hipertrofia">Hipertrofia</option>
                                    <option value="Emagrecimento">Emagrecimento</option>
                                    <option value="Condicionamento">Condicionamento</option>
                                </select>
                            </div>
                            <div>
                                <button onclick="loadStudents()" class="bg-gray-700 hover:bg-gray-600 w-full px-4 py-2 rounded-lg transition">
                                    <i class="fas fa-sync-alt mr-2"></i>Atualizar
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Students Grid -->
                    <div id="studentsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="text-center py-12 col-span-full text-gray-400">
                            Carregando alunos...
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Add Student Modal -->
        <div id="addModal" class="modal">
            <div class="card-dark p-8 rounded-2xl max-w-2xl w-full mx-4">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold">
                        <i class="fas fa-user-plus mr-2" style="color: #CCFF00;"></i>
                        Adicionar Novo Aluno
                    </h2>
                    <button onclick="closeAddModal()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>

                <form id="addStudentForm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-2 text-gray-300">Nome Completo</label>
                            <input type="text" id="fullName" class="input-dark w-full px-4 py-3 rounded-lg" required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2 text-gray-300">WhatsApp</label>
                            <input type="text" id="whatsapp" class="input-dark w-full px-4 py-3 rounded-lg" placeholder="+55 11 99999-9999" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-2 text-gray-300">E-mail</label>
                            <input type="email" id="email" class="input-dark w-full px-4 py-3 rounded-lg" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2 text-gray-300">Objetivo</label>
                            <select id="goal" class="input-dark w-full px-4 py-3 rounded-lg">
                                <option value="">Selecione...</option>
                                <option value="Hipertrofia">Hipertrofia</option>
                                <option value="Emagrecimento">Emagrecimento</option>
                                <option value="Condicionamento">Condicionamento</option>
                                <option value="Força">Força</option>
                                <option value="Funcional">Funcional</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2 text-gray-300">Dados Físicos</label>
                        <div class="grid grid-cols-3 gap-4">
                            <input type="number" id="weight" class="input-dark w-full px-4 py-3 rounded-lg" placeholder="Peso (kg)" step="0.1" />
                            <input type="number" id="height" class="input-dark w-full px-4 py-3 rounded-lg" placeholder="Altura (cm)" />
                            <input type="number" id="bf" class="input-dark w-full px-4 py-3 rounded-lg" placeholder="BF %" step="0.1" />
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2 text-gray-300">Restrições/Observações</label>
                        <textarea id="restrictions" class="input-dark w-full px-4 py-3 rounded-lg" rows="3" placeholder="Ex: Lesão de joelho, problema lombar..."></textarea>
                    </div>

                    <div class="flex gap-4">
                        <button type="submit" class="btn-neon flex-1 py-3 rounded-lg">
                            <i class="fas fa-check mr-2"></i>Salvar Aluno
                        </button>
                        <button type="button" onclick="closeAddModal()" class="bg-gray-700 hover:bg-gray-600 flex-1 py-3 rounded-lg transition">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            const token = localStorage.getItem('fortetrain_token');
            if (!token) {
                window.location.href = '/auth/login';
            }

            let allStudents = [];

            async function loadStudents() {
                try {
                    const response = await axios.get('/api/students', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    allStudents = response.data.students;
                    displayStudents(allStudents);
                } catch (error) {
                    console.error('Error loading students:', error);
                }
            }

            function displayStudents(students) {
                const grid = document.getElementById('studentsGrid');

                if (students.length === 0) {
                    grid.innerHTML = \`
                        <div class="text-center py-12 col-span-full">
                            <i class="fas fa-users text-6xl text-gray-700 mb-4"></i>
                            <p class="text-gray-400">Nenhum aluno encontrado</p>
                            <button onclick="openAddModal()" class="btn-neon px-6 py-3 rounded-lg mt-4">
                                <i class="fas fa-plus mr-2"></i>Adicionar Primeiro Aluno
                            </button>
                        </div>
                    \`;
                    return;
                }

                grid.innerHTML = students.map(student => {
                    const isActive = student.status === 'active';
                    const physicalData = student.physical_data ? JSON.parse(student.physical_data) : {};
                    const daysSinceLastWorkout = student.last_workout_date ? 
                        Math.floor((Date.now() - student.last_workout_date * 1000) / (1000 * 60 * 60 * 24)) : null;

                    return \`
                        <div class="card-dark p-6 rounded-xl student-card">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex items-center">
                                    <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-2xl mr-4">
                                        \${student.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 class="font-bold text-lg">\${student.full_name}</h3>
                                        <p class="text-sm text-gray-400">\${student.goal || 'Sem objetivo definido'}</p>
                                    </div>
                                </div>
                                <span class="px-3 py-1 rounded-full text-xs font-bold \${isActive ? 'badge-active' : 'badge-inactive'}">
                                    \${isActive ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            <div class="grid grid-cols-3 gap-2 mb-4 text-sm">
                                <div class="card-dark p-2 rounded text-center">
                                    <div class="text-gray-400 text-xs">Peso</div>
                                    <div class="font-bold">\${physicalData.weight || '-'}kg</div>
                                </div>
                                <div class="card-dark p-2 rounded text-center">
                                    <div class="text-gray-400 text-xs">Altura</div>
                                    <div class="font-bold">\${physicalData.height || '-'}cm</div>
                                </div>
                                <div class="card-dark p-2 rounded text-center">
                                    <div class="text-gray-400 text-xs">BF</div>
                                    <div class="font-bold">\${physicalData.bf || '-'}%</div>
                                </div>
                            </div>

                            \${daysSinceLastWorkout !== null ? \`
                                <div class="mb-4 text-sm \${daysSinceLastWorkout > 3 ? 'text-red-400' : 'text-green-400'}">
                                    <i class="fas fa-clock mr-1"></i>
                                    Último treino há \${daysSinceLastWorkout} dias
                                </div>
                            \` : ''}

                            <div class="flex gap-2">
                                <button onclick="createWorkout('\${student.id}')" class="btn-neon flex-1 py-2 rounded-lg text-sm">
                                    <i class="fas fa-dumbbell mr-1"></i>Treino
                                </button>
                                <button onclick="viewDetails('\${student.id}')" class="bg-gray-700 hover:bg-gray-600 flex-1 py-2 rounded-lg text-sm transition">
                                    <i class="fas fa-eye mr-1"></i>Ver Mais
                                </button>
                            </div>
                        </div>
                    \`;
                }).join('');
            }

            function filterStudents() {
                const search = document.getElementById('searchInput').value.toLowerCase();
                const status = document.getElementById('statusFilter').value;
                const goal = document.getElementById('goalFilter').value;

                const filtered = allStudents.filter(student => {
                    const matchSearch = student.full_name.toLowerCase().includes(search);
                    const matchStatus = !status || student.status === status;
                    const matchGoal = !goal || student.goal === goal;
                    return matchSearch && matchStatus && matchGoal;
                });

                displayStudents(filtered);
            }

            function openAddModal() {
                document.getElementById('addModal').classList.add('active');
            }

            function closeAddModal() {
                document.getElementById('addModal').classList.remove('active');
                document.getElementById('addStudentForm').reset();
            }

            document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
                e.preventDefault();

                const physical_data = {
                    weight: document.getElementById('weight').value,
                    height: document.getElementById('height').value,
                    bf: document.getElementById('bf').value,
                    restrictions: document.getElementById('restrictions').value
                };

                const data = {
                    full_name: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    whatsapp: document.getElementById('whatsapp').value,
                    goal: document.getElementById('goal').value,
                    physical_data
                };

                try {
                    await axios.post('/api/students', data, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    alert('Aluno cadastrado com sucesso!');
                    closeAddModal();
                    loadStudents();
                } catch (error) {
                    alert('Erro ao cadastrar aluno: ' + (error.response?.data?.error || 'Erro desconhecido'));
                }
            });

            function createWorkout(studentId) {
                localStorage.setItem('selected_student_id', studentId);
                window.location.href = '/dashboard/ai-generator';
            }

            function viewDetails(studentId) {
                alert('Detalhes do aluno em desenvolvimento!');
            }

            // Load students on page load
            loadStudents();
        </script>
    </body>
    </html>
  `)
})
