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
                                <!-- OMNI-SPORT: Sport Modality Selector -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-running mr-2"></i>Modalidade Esportiva
                                    </label>
                                    <select id="sportType" class="input-dark w-full px-4 py-3 rounded-lg" required onchange="updateSportUI()">
                                        <option value="">Carregando modalidades...</option>
                                    </select>
                                    <p class="text-xs text-gray-500 mt-1" id="sportDescription">Selecione a modalidade do treino</p>
                                </div>

                                <!-- Student Selection -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-user mr-2"></i>Selecionar Aluno
                                    </label>
                                    <select id="studentId" class="input-dark w-full px-4 py-3 rounded-lg" required>
                                        <option value="">Carregando alunos...</option>
                                    </select>
                                </div>

                                <!-- Experience Level -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-chart-line mr-2"></i>Nível de Experiência
                                    </label>
                                    <select id="experienceLevel" class="input-dark w-full px-4 py-3 rounded-lg" required>
                                        <option value="beginner">Iniciante</option>
                                        <option value="intermediate" selected>Intermediário</option>
                                        <option value="advanced">Avançado</option>
                                        <option value="elite">Elite/Competição</option>
                                    </select>
                                </div>

                                <!-- Dynamic Focus Field (changes based on sport) -->
                                <div class="mb-6" id="dynamicFocusContainer">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-crosshairs mr-2"></i>
                                        <span id="focusLabel">Foco do Treino</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="focusField" 
                                        class="input-dark w-full px-4 py-3 rounded-lg"
                                        placeholder="Ex: Peito e Tríceps, Treino A..."
                                        required
                                    />
                                    <p class="text-xs text-gray-500 mt-1" id="focusHint"></p>
                                </div>

                                <!-- Duration / Distance (dynamic) -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-clock mr-2"></i>
                                        <span id="durationLabel">Duração (minutos)</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="duration" 
                                        class="input-dark w-full px-4 py-3 rounded-lg"
                                        placeholder="45"
                                        value="45"
                                        required
                                    />
                                    <p class="text-xs text-gray-500 mt-1" id="durationHint"></p>
                                </div>

                                <!-- Equipment / Context (dynamic based on sport) -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium mb-2 text-gray-300">
                                        <i class="fas fa-tools mr-2"></i>
                                        <span id="equipmentLabel">Contexto/Equipamento</span>
                                    </label>
                                    <select id="equipment" class="input-dark w-full px-4 py-3 rounded-lg" required>
                                        <option value="">Selecione primeiro a modalidade</option>
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
            let sportsConfig = [];
            let currentSport = null;

            // OMNI-SPORT: Load available sports (using native fetch)
            async function loadSports() {
                try {
                    console.log('📡 [' + new Date().toISOString() + '] Loading sports configs...');
                    
                    const response = await fetch('/api/sports/configs', {
                        method: 'GET',
                        headers: { 
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                    }

                    const data = await response.json();
                    console.log('✅ Sports response:', data);

                    sportsConfig = data.sports || [];
                    const select = document.getElementById('sportType');
                    
                    if (!select) {
                        console.error('❌ Element #sportType not found!');
                        return;
                    }
                    
                    if (!sportsConfig || sportsConfig.length === 0) {
                        select.innerHTML = '<option value="">Nenhuma modalidade disponível</option>';
                        console.error('⚠️ No sports returned from API');
                        return;
                    }
                    
                    select.innerHTML = '<option value="">Selecione a modalidade</option>' +
                        sportsConfig.map(s => '<option value="' + s.type + '">' + s.name + '</option>').join('');
                    
                    console.log('✅ Sports loaded:', sportsConfig.length, 'modalities');
                } catch (error) {
                    console.error('❌ Error loading sports:', error);
                    console.error('   Message:', error.message);
                    console.error('   Stack:', error.stack);
                    const select = document.getElementById('sportType');
                    if (select) {
                        select.innerHTML = '<option value="">Erro ao carregar modalidades</option>';
                    }
                }
            }

            // OMNI-SPORT: Update UI based on selected sport
            function updateSportUI() {
                const sportType = document.getElementById('sportType').value;
                if (!sportType) return;

                currentSport = sportsConfig.find(s => s.type === sportType);
                if (!currentSport) return;

                // Update sport description
                document.getElementById('sportDescription').textContent = 
                    'Gerando treino otimizado para ' + currentSport.name;

                // Update dynamic focus field based on sport
                const focusConfigs = {
                    bodybuilding: {
                        label: 'Foco Muscular',
                        placeholder: 'Ex: Peito e Tríceps, Treino A (Push)',
                        hint: 'Especifique grupos musculares ou divisão de treino'
                    },
                    cycling: {
                        label: 'Tipo de Treino',
                        placeholder: 'Ex: Intervalos de potência, Endurance, Sweet Spot',
                        hint: 'Defina o objetivo da sessão (FTP, Limiar, Resistência)'
                    },
                    tennis: {
                        label: 'Foco Técnico',
                        placeholder: 'Ex: Saque e Voleio, Forehand, Condicionamento',
                        hint: 'Especifique golpes, táticas ou preparação física'
                    },
                    swimming: {
                        label: 'Estilo e Objetivo',
                        placeholder: 'Ex: Crawl - Técnica, Medley - Resistência',
                        hint: 'Defina nado e foco (técnica, velocidade, resistência)'
                    },
                    beach_tennis: {
                        label: 'Foco do Treino',
                        placeholder: 'Ex: Smash, Defesa, Condicionamento na Areia',
                        hint: 'Especifique golpes ou preparação específica'
                    },
                    crossfit: {
                        label: 'Tipo de WOD',
                        placeholder: 'Ex: AMRAP, For Time, EMOM, Benchmark',
                        hint: 'Defina formato e foco (ginástica, levantamento, metcon)'
                    },
                    running: {
                        label: 'Tipo de Sessão',
                        placeholder: 'Ex: Intervalados, Fartlek, Long Run',
                        hint: 'Especifique treino (velocidade, resistência, recuperação)'
                    },
                    pilates: {
                        label: 'Área de Foco',
                        placeholder: 'Ex: Core, Alongamento, Postura',
                        hint: 'Defina região ou objetivo (força, flexibilidade, reab)'
                    },
                    physiotherapy: {
                        label: 'Região e Objetivo',
                        placeholder: 'Ex: Ombro - Reabilitação, Joelho - Fortalecimento',
                        hint: 'Especifique área lesionada e fase do tratamento'
                    }
                };

                const config = focusConfigs[sportType] || focusConfigs.bodybuilding;
                document.getElementById('focusLabel').textContent = config.label;
                document.getElementById('focusField').placeholder = config.placeholder;
                document.getElementById('focusHint').textContent = config.hint;

                // Update duration label and hints
                const durationConfigs = {
                    cycling: { label: 'Duração ou Distância', placeholder: '90min ou 80km', hint: 'Aceita tempo (min) ou distância (km)' },
                    swimming: { label: 'Distância Total', placeholder: '3000m', hint: 'Em metros (ex: 2000m, 3500m)' },
                    running: { label: 'Distância ou Duração', placeholder: '10km ou 60min', hint: 'Aceita distância (km) ou tempo (min)' },
                    tennis: { label: 'Duração da Sessão', placeholder: '90min', hint: 'Inclui aquecimento, drills e jogo' },
                    beach_tennis: { label: 'Duração da Sessão', placeholder: '60min', hint: 'Inclui aquecimento e jogo' },
                    crossfit: { label: 'Time Cap', placeholder: '20min', hint: 'Tempo máximo para completar o WOD' },
                    pilates: { label: 'Duração da Aula', placeholder: '60min', hint: 'Sessão completa com respiração' },
                    physiotherapy: { label: 'Duração da Sessão', placeholder: '45min', hint: 'Inclui avaliação e exercícios' }
                };

                const durationConfig = durationConfigs[sportType];
                if (durationConfig) {
                    document.getElementById('durationLabel').textContent = durationConfig.label;
                    document.getElementById('duration').placeholder = durationConfig.placeholder;
                    document.getElementById('durationHint').textContent = durationConfig.hint;
                } else {
                    document.getElementById('durationLabel').textContent = 'Duração (minutos)';
                    document.getElementById('duration').placeholder = '45';
                    document.getElementById('durationHint').textContent = '';
                }

                // Update equipment options based on sport
                const equipmentOptions = {
                    bodybuilding: [
                        { value: 'completa', label: 'Academia Completa' },
                        { value: 'condominio', label: 'Academia de Condomínio' },
                        { value: 'casa', label: 'Treino em Casa (Básico)' },
                        { value: 'ao-ar-livre', label: 'Treino ao Ar Livre' }
                    ],
                    cycling: [
                        { value: 'indoor', label: 'Indoor (Rolo/Smart Trainer)' },
                        { value: 'outdoor-flat', label: 'Outdoor - Terreno Plano' },
                        { value: 'outdoor-hilly', label: 'Outdoor - Montanha/Subidas' },
                        { value: 'mixed', label: 'Treino Misto' }
                    ],
                    tennis: [
                        { value: 'full-court', label: 'Quadra Completa' },
                        { value: 'half-court', label: 'Meia Quadra' },
                        { value: 'wall', label: 'Treino na Parede' },
                        { value: 'physical', label: 'Preparação Física (sem quadra)' }
                    ],
                    swimming: [
                        { value: 'pool-50m', label: 'Piscina Olímpica (50m)' },
                        { value: 'pool-25m', label: 'Piscina Semi-Olímpica (25m)' },
                        { value: 'pool-basic', label: 'Piscina Básica' },
                        { value: 'open-water', label: 'Águas Abertas' }
                    ],
                    beach_tennis: [
                        { value: 'sand-court', label: 'Quadra na Areia' },
                        { value: 'gym', label: 'Academia (Condicionamento)' },
                        { value: 'beach', label: 'Praia (Treino Funcional)' }
                    ],
                    crossfit: [
                        { value: 'full-box', label: 'Box Completo' },
                        { value: 'garage-gym', label: 'Garage Gym' },
                        { value: 'minimal', label: 'Setup Mínimo' },
                        { value: 'bodyweight', label: 'Apenas Peso Corporal' }
                    ],
                    running: [
                        { value: 'track', label: 'Pista de Atletismo' },
                        { value: 'road', label: 'Asfalto/Rua' },
                        { value: 'trail', label: 'Trail/Montanha' },
                        { value: 'treadmill', label: 'Esteira' }
                    ],
                    pilates: [
                        { value: 'mat', label: 'Mat Pilates' },
                        { value: 'reformer', label: 'Reformer' },
                        { value: 'cadillac', label: 'Cadillac' },
                        { value: 'mixed', label: 'Equipamentos Variados' }
                    ],
                    physiotherapy: [
                        { value: 'clinic', label: 'Clínica Completa' },
                        { value: 'home', label: 'Programa Domiciliar' },
                        { value: 'basic', label: 'Equipamento Básico' }
                    ]
                };

                const options = equipmentOptions[sportType] || equipmentOptions.bodybuilding;
                document.getElementById('equipment').innerHTML = options.map(opt => 
                    '<option value="' + opt.value + '">' + opt.label + '</option>'
                ).join('');
            }

            // Load students (using native fetch)
            async function loadStudents() {
                try {
                    console.log('📡 [' + new Date().toISOString() + '] Loading students...');
                    
                    const response = await fetch('/api/students', {
                        method: 'GET',
                        headers: { 
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                    }

                    const data = await response.json();
                    const students = data.students || [];
                    const select = document.getElementById('studentId');
                    
                    if (!select) {
                        console.error('❌ Element #studentId not found!');
                        return;
                    }
                    
                    if (students.length === 0) {
                        select.innerHTML = '<option value="">Nenhum aluno cadastrado</option>';
                        console.log('⚠️ No students found');
                        return;
                    }

                    select.innerHTML = '<option value="">Selecione um aluno</option>' +
                        students.map(s => '<option value="' + s.id + '">' + s.full_name + ' - ' + (s.goal || 'Sem objetivo') + '</option>').join('');
                    
                    console.log('✅ Students loaded:', students.length);
                } catch (error) {
                    console.error('❌ Error loading students:', error);
                    console.error('   Message:', error.message);
                    console.error('   Stack:', error.stack);
                    const select = document.getElementById('studentId');
                    if (select) {
                        select.innerHTML = '<option value="">Erro ao carregar alunos</option>';
                    }
                }
            }
                    console.error('   Message:', error.message);
                    console.error('   Response:', error.response?.data);
                }
            }

            // Generate workout
            document.getElementById('workoutForm').addEventListener('submit', async (e) => {
                e.preventDefault();

                const sportType = document.getElementById('sportType').value;
                const studentId = document.getElementById('studentId').value;
                const experienceLevel = document.getElementById('experienceLevel').value;
                const focus = document.getElementById('focusField').value;
                const duration = document.getElementById('duration').value;
                const equipment = document.getElementById('equipment').value;
                const notes = document.getElementById('notes').value;

                if (!sportType) {
                    alert('Por favor, selecione uma modalidade esportiva');
                    return;
                }

                if (!studentId) {
                    alert('Por favor, selecione um aluno');
                    return;
                }

                // Build sport-specific prompt
                const prompt = 'Crie um treino de ' + currentSport.name + ' com foco em: ' + focus + '.\\nDuração/Distância: ' + duration + '\\nContexto: ' + equipment + '\\nNível: ' + experienceLevel + '\\n' + (notes ? 'Observações: ' + notes : '');

                // Show loading
                document.getElementById('emptySection').classList.add('hidden');
                document.getElementById('resultSection').classList.add('hidden');
                document.getElementById('loadingSection').classList.remove('hidden');
                document.getElementById('generateBtn').disabled = true;
                document.getElementById('generateBtn').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Gerando...';

                try {
                    const response = await axios.post('/api/ai/generate-workout',
                        { 
                            studentId, 
                            prompt,
                            sportType,
                            experienceLevel
                        },
                        { headers: { 'Authorization': 'Bearer ' + token } }
                    );

                    currentWorkoutData = response.data.workout;

                    // Display result with sport-specific rendering
                    document.getElementById('workoutTitle').textContent = currentWorkoutData.title || ('Treino de ' + currentSport.name);
                    document.getElementById('workoutDescription').textContent = currentWorkoutData.description || '';

                    // Render exercises/drills dynamically based on sport
                    let contentHtml = '';
                    
                    if (currentWorkoutData.exercises && Array.isArray(currentWorkoutData.exercises)) {
                        // Bodybuilding, CrossFit, Pilates, Physiotherapy format
                        contentHtml = currentWorkoutData.exercises.map((ex, idx) => 
                            '<div class="exercise-card p-4 rounded-lg">' +
                                '<div class="flex items-start justify-between mb-2">' +
                                    '<div class="flex items-center">' +
                                        '<div class="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold mr-3" style="background: ' + currentSport.primaryColor + ';">' +
                                            (idx + 1) +
                                        '</div>' +
                                        '<h4 class="font-bold text-lg">' + (ex.name || ex.movement) + '</h4>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="ml-11 text-sm space-y-1">' +
                                    (ex.sets ? '<div><span class="text-gray-400">Séries:</span> <span class="font-bold">' + ex.sets + '</span></div>' : '') +
                                    (ex.reps ? '<div><span class="text-gray-400">Reps:</span> <span class="font-bold">' + ex.reps + '</span></div>' : '') +
                                    (ex.weight ? '<div><span class="text-gray-400">Carga:</span> <span class="font-bold">' + ex.weight + 'kg</span></div>' : '') +
                                    (ex.rest ? '<div><span class="text-gray-400">Descanso:</span> <span class="font-bold">' + ex.rest + 's</span></div>' : '') +
                                    (ex.rest_seconds ? '<div><span class="text-gray-400">Descanso:</span> <span class="font-bold">' + ex.rest_seconds + 's</span></div>' : '') +
                                    (ex.duration ? '<div><span class="text-gray-400">Duração:</span> <span class="font-bold">' + ex.duration + '</span></div>' : '') +
                                    (ex.tempo ? '<div><span class="text-gray-400">Tempo:</span> <span class="font-bold">' + ex.tempo + '</span></div>' : '') +
                                    (ex.breathing_pattern ? '<div><span class="text-gray-400">Respiração:</span> <span class="font-bold">' + ex.breathing_pattern + '</span></div>' : '') +
                                    (ex.notes ? '<div class="text-gray-400 mt-2"><i class="fas fa-info-circle mr-1"></i>' + ex.notes + '</div>' : '') +
                                '</div>' +
                            '</div>'
                        ).join('');
                    } else if (currentWorkoutData.drills && Array.isArray(currentWorkoutData.drills)) {
                        // Tennis, Beach Tennis format
                        contentHtml = currentWorkoutData.drills.map((drill, idx) => 
                            '<div class="exercise-card p-4 rounded-lg">' +
                                '<div class="flex items-start justify-between mb-2">' +
                                    '<div class="flex items-center">' +
                                        '<div class="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold mr-3" style="background: ' + currentSport.primaryColor + ';">' +
                                            (idx + 1) +
                                        '</div>' +
                                        '<h4 class="font-bold text-lg">' + (drill.name || drill.type) + '</h4>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="ml-11 text-sm space-y-1">' +
                                    (drill.type ? '<div><span class="text-gray-400">Tipo:</span> <span class="font-bold">' + drill.type + '</span></div>' : '') +
                                    (drill.duration ? '<div><span class="text-gray-400">Duração:</span> <span class="font-bold">' + drill.duration + '</span></div>' : '') +
                                    (drill.intensity ? '<div><span class="text-gray-400">Intensidade:</span> <span class="font-bold">' + drill.intensity + '</span></div>' : '') +
                                    (drill.repetitions ? '<div><span class="text-gray-400">Repetições:</span> <span class="font-bold">' + drill.repetitions + '</span></div>' : '') +
                                    (drill.focus ? '<div><span class="text-gray-400">Foco:</span> <span class="font-bold">' + drill.focus + '</span></div>' : '') +
                                '</div>' +
                            '</div>'
                        ).join('');
                    } else if (currentWorkoutData.sets && Array.isArray(currentWorkoutData.sets)) {
                        // Swimming format
                        contentHtml = currentWorkoutData.sets.map((set, idx) => 
                            '<div class="exercise-card p-4 rounded-lg">' +
                                '<div class="flex items-start justify-between mb-2">' +
                                    '<div class="flex items-center">' +
                                        '<div class="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold mr-3" style="background: ' + currentSport.primaryColor + ';">' +
                                            (idx + 1) +
                                        '</div>' +
                                        '<h4 class="font-bold text-lg">' + set.distance + ' - ' + set.stroke + '</h4>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="ml-11 text-sm space-y-1">' +
                                    (set.interval ? '<div><span class="text-gray-400">Intervalo:</span> <span class="font-bold">' + set.interval + '</span></div>' : '') +
                                    (set.intensity ? '<div><span class="text-gray-400">Intensidade:</span> <span class="font-bold">' + set.intensity + '</span></div>' : '') +
                                    (set.rest ? '<div><span class="text-gray-400">Descanso:</span> <span class="font-bold">' + set.rest + '</span></div>' : '') +
                                    (set.focus ? '<div><span class="text-gray-400">Foco:</span> <span class="font-bold">' + set.focus + '</span></div>' : '') +
                                '</div>' +
                            '</div>'
                        ).join('');
                    } else if (currentWorkoutData.intervals && Array.isArray(currentWorkoutData.intervals)) {
                        // Cycling, Running format
                        contentHtml = currentWorkoutData.intervals.map((interval, idx) => 
                            '<div class="exercise-card p-4 rounded-lg">' +
                                '<div class="flex items-start justify-between mb-2">' +
                                    '<div class="flex items-center">' +
                                        '<div class="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold mr-3" style="background: ' + currentSport.primaryColor + ';">' +
                                            (idx + 1) +
                                        '</div>' +
                                        '<h4 class="font-bold text-lg">Intervalo ' + (idx + 1) + '</h4>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="ml-11 text-sm space-y-1">' +
                                    (interval.duration ? '<div><span class="text-gray-400">Duração:</span> <span class="font-bold">' + interval.duration + '</span></div>' : '') +
                                    (interval.distance ? '<div><span class="text-gray-400">Distância:</span> <span class="font-bold">' + interval.distance + '</span></div>' : '') +
                                    (interval.power_target ? '<div><span class="text-gray-400">Potência Alvo:</span> <span class="font-bold">' + interval.power_target + '</span></div>' : '') +
                                    (interval.pace ? '<div><span class="text-gray-400">Pace:</span> <span class="font-bold">' + interval.pace + '</span></div>' : '') +
                                    (interval.recovery ? '<div><span class="text-gray-400">Recuperação:</span> <span class="font-bold">' + interval.recovery + '</span></div>' : '') +
                                    (interval.heart_rate_zone ? '<div><span class="text-gray-400">Zona FC:</span> <span class="font-bold">' + interval.heart_rate_zone + '</span></div>' : '') +
                                '</div>' +
                            '</div>'
                        ).join('');
                    } else {
                        // Fallback: display raw JSON
                        contentHtml = 
                            '<div class="exercise-card p-4 rounded-lg">' +
                                '<pre class="text-sm text-gray-300 overflow-auto">' + JSON.stringify(currentWorkoutData, null, 2) + '</pre>' +
                            '</div>';
                    }

                    document.getElementById('exercisesList').innerHTML = contentHtml;

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

        <!-- Student Details Modal -->
        <div id="detailsModal" class="modal">
            <div class="card-dark p-8 rounded-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold">
                        <i class="fas fa-user mr-2" style="color: #CCFF00;"></i>
                        <span id="studentDetailName">Detalhes do Aluno</span>
                    </h2>
                    <button onclick="closeDetailsModal()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>

                <!-- Tabs -->
                <div class="flex border-b border-gray-700 mb-6">
                    <button onclick="showTab('personal')" id="tab-personal" class="px-6 py-3 font-medium border-b-2 border-lime-400 text-lime-400">
                        <i class="fas fa-id-card mr-2"></i>Dados Pessoais
                    </button>
                    <button onclick="showTab('training')" id="tab-training" class="px-6 py-3 font-medium text-gray-400 hover:text-white transition">
                        <i class="fas fa-dumbbell mr-2"></i>Ciclo de Treinos
                    </button>
                    <button onclick="showTab('payments')" id="tab-payments" class="px-6 py-3 font-medium text-gray-400 hover:text-white transition">
                        <i class="fas fa-credit-card mr-2"></i>Pagamentos
                    </button>
                    <button onclick="showTab('evolution')" id="tab-evolution" class="px-6 py-3 font-medium text-gray-400 hover:text-white transition">
                        <i class="fas fa-chart-line mr-2"></i>Evolução
                    </button>
                </div>

                <!-- Personal Data Tab -->
                <div id="content-personal">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Avatar & Status -->
                        <div class="bg-black/30 p-6 rounded-xl">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-20 h-20 bg-lime-400/20 rounded-full flex items-center justify-center">
                                    <i class="fas fa-user text-4xl text-lime-400"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="text-2xl font-bold mb-1" id="detail-fullname">-</div>
                                    <div class="text-gray-400" id="detail-email">-</div>
                                    <span id="detail-status-badge" class="inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full mt-2">Ativo</span>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div class="bg-black/50 p-3 rounded">
                                    <div class="text-gray-400 text-xs mb-1">WhatsApp</div>
                                    <div class="font-medium" id="detail-whatsapp">-</div>
                                </div>
                                <div class="bg-black/50 p-3 rounded">
                                    <div class="text-gray-400 text-xs mb-1">Cadastro</div>
                                    <div class="font-medium" id="detail-created">-</div>
                                </div>
                            </div>
                        </div>

                        <!-- Physical Data -->
                        <div class="bg-black/30 p-6 rounded-xl">
                            <h3 class="font-bold text-lg mb-4">Dados Físicos</h3>
                            <div class="grid grid-cols-3 gap-3">
                                <div class="bg-black/50 p-4 rounded-lg text-center">
                                    <div class="text-3xl font-bold mb-1" id="detail-weight">-</div>
                                    <div class="text-gray-400 text-xs">Peso (kg)</div>
                                </div>
                                <div class="bg-black/50 p-4 rounded-lg text-center">
                                    <div class="text-3xl font-bold mb-1" id="detail-height">-</div>
                                    <div class="text-gray-400 text-xs">Altura (cm)</div>
                                </div>
                                <div class="bg-black/50 p-4 rounded-lg text-center">
                                    <div class="text-3xl font-bold mb-1" id="detail-bf">-</div>
                                    <div class="text-gray-400 text-xs">BF (%)</div>
                                </div>
                            </div>

                            <div class="mt-4 bg-black/50 p-4 rounded-lg">
                                <div class="text-gray-400 text-xs mb-2">IMC Calculado</div>
                                <div class="text-2xl font-bold" id="detail-imc">-</div>
                                <div class="text-xs text-gray-500 mt-1" id="detail-imc-category">-</div>
                            </div>
                        </div>
                    </div>

                    <!-- Goal & Restrictions -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-black/30 p-6 rounded-xl">
                            <h3 class="font-bold text-lg mb-3">
                                <i class="fas fa-bullseye mr-2 text-lime-400"></i>Objetivo
                            </h3>
                            <div class="text-xl" id="detail-goal">-</div>
                        </div>

                        <div class="bg-black/30 p-6 rounded-xl">
                            <h3 class="font-bold text-lg mb-3">
                                <i class="fas fa-exclamation-triangle mr-2 text-orange-400"></i>Restrições
                            </h3>
                            <div class="text-gray-300" id="detail-restrictions">Nenhuma restrição cadastrada</div>
                        </div>
                    </div>
                </div>

                <!-- Training Cycle Tab -->
                <div id="content-training" class="hidden">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div class="bg-black/30 p-6 rounded-xl text-center">
                            <div class="text-4xl font-bold mb-2" style="color: #CCFF00;" id="detail-total-workouts">0</div>
                            <div class="text-gray-400">Treinos Cadastrados</div>
                        </div>
                        <div class="bg-black/30 p-6 rounded-xl text-center">
                            <div class="text-4xl font-bold mb-2 text-green-400" id="detail-completed-sessions">0</div>
                            <div class="text-gray-400">Sessões Completas</div>
                        </div>
                        <div class="bg-black/30 p-6 rounded-xl text-center">
                            <div class="text-4xl font-bold mb-2 text-blue-400" id="detail-last-workout">-</div>
                            <div class="text-gray-400">Último Treino</div>
                        </div>
                    </div>

                    <div class="bg-black/30 p-6 rounded-xl">
                        <h3 class="font-bold text-lg mb-4">
                            <i class="fas fa-list mr-2 text-lime-400"></i>Treinos Ativos
                        </h3>
                        <div id="student-workouts-list">
                            <div class="text-center py-12 text-gray-400">
                                <i class="fas fa-dumbbell text-4xl mb-3"></i>
                                <p>Nenhum treino cadastrado ainda</p>
                                <button onclick="createWorkoutForStudent()" class="btn-neon px-6 py-3 rounded-lg mt-4">
                                    <i class="fas fa-plus mr-2"></i>Criar Primeiro Treino
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payments Tab -->
                <div id="content-payments" class="hidden">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div class="bg-black/30 p-6 rounded-xl text-center">
                            <div class="text-3xl font-bold mb-2 text-green-400" id="detail-total-paid">R$ 0,00</div>
                            <div class="text-gray-400 text-sm">Total Pago</div>
                        </div>
                        <div class="bg-black/30 p-6 rounded-xl text-center">
                            <div class="text-3xl font-bold mb-2 text-orange-400" id="detail-pending">R$ 0,00</div>
                            <div class="text-gray-400 text-sm">Pendente</div>
                        </div>
                        <div class="bg-black/30 p-6 rounded-xl text-center">
                            <div class="text-3xl font-bold mb-2" style="color: #CCFF00;" id="detail-next-payment">-</div>
                            <div class="text-gray-400 text-sm">Próximo Vencimento</div>
                        </div>
                        <div class="bg-black/30 p-6 rounded-xl text-center">
                            <div class="text-3xl font-bold mb-2 text-blue-400" id="detail-plan">-</div>
                            <div class="text-gray-400 text-sm">Plano</div>
                        </div>
                    </div>

                    <div class="bg-black/30 p-6 rounded-xl">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-bold text-lg">
                                <i class="fas fa-history mr-2 text-lime-400"></i>Histórico de Pagamentos
                            </h3>
                            <button onclick="addPayment()" class="bg-lime-400 hover:bg-lime-500 text-black px-4 py-2 rounded-lg font-bold transition">
                                <i class="fas fa-plus mr-2"></i>Registrar Pagamento
                            </button>
                        </div>
                        
                        <div id="payments-history">
                            <table class="w-full text-sm">
                                <thead class="border-b border-gray-700">
                                    <tr class="text-left text-gray-400">
                                        <th class="py-3">Data</th>
                                        <th>Valor</th>
                                        <th>Método</th>
                                        <th>Status</th>
                                        <th>Referência</th>
                                    </tr>
                                </thead>
                                <tbody id="payments-tbody">
                                    <tr>
                                        <td colspan="5" class="text-center py-12 text-gray-400">
                                            <i class="fas fa-receipt text-4xl mb-3"></i>
                                            <p>Nenhum pagamento registrado</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Evolution Tab -->
                <div id="content-evolution" class="hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="bg-black/30 p-6 rounded-xl">
                            <h3 class="font-bold text-lg mb-4">
                                <i class="fas fa-weight mr-2 text-lime-400"></i>Evolução de Peso
                            </h3>
                            <canvas id="weight-chart" height="200"></canvas>
                        </div>

                        <div class="bg-black/30 p-6 rounded-xl">
                            <h3 class="font-bold text-lg mb-4">
                                <i class="fas fa-fire mr-2 text-orange-400"></i>Evolução de BF
                            </h3>
                            <canvas id="bf-chart" height="200"></canvas>
                        </div>
                    </div>

                    <div class="bg-black/30 p-6 rounded-xl">
                        <h3 class="font-bold text-lg mb-4">
                            <i class="fas fa-chart-bar mr-2 text-lime-400"></i>Frequência de Treinos (Últimos 30 dias)
                        </h3>
                        <canvas id="frequency-chart" height="100"></canvas>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4 mt-6 pt-6 border-t border-gray-700">
                    <button onclick="editStudent()" class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition">
                        <i class="fas fa-edit mr-2"></i>Editar Dados
                    </button>
                    <button onclick="createWorkoutForStudent()" class="btn-neon px-6 py-3 rounded-lg">
                        <i class="fas fa-plus mr-2"></i>Novo Treino
                    </button>
                    <button onclick="sendNotification()" class="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold transition">
                        <i class="fas fa-paper-plane mr-2"></i>Enviar Mensagem
                    </button>
                    <button onclick="deleteStudent()" class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition ml-auto">
                        <i class="fas fa-trash mr-2"></i>Excluir Aluno
                    </button>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
                // Redirect to new detailed student page
                window.location.href = \`/dashboard/student/\${studentId}\`;
            }

            function viewDetailsOld(studentId) {
                const student = allStudents.find(s => s.id === studentId);
                if (!student) return;

                currentStudentId = studentId;

                // Update personal data tab
                document.getElementById('studentDetailName').textContent = student.full_name;
                document.getElementById('detail-fullname').textContent = student.full_name;
                document.getElementById('detail-email').textContent = student.email || '-';
                document.getElementById('detail-whatsapp').textContent = student.whatsapp || '-';
                document.getElementById('detail-created').textContent = new Date(student.created_at * 1000).toLocaleDateString('pt-BR');
                
                const physicalData = JSON.parse(student.physical_data || '{}');
                document.getElementById('detail-weight').textContent = physicalData.weight || '-';
                document.getElementById('detail-height').textContent = physicalData.height || '-';
                document.getElementById('detail-bf').textContent = physicalData.bf || '-';
                document.getElementById('detail-goal').textContent = student.goal || '-';
                document.getElementById('detail-restrictions').textContent = physicalData.restrictions || 'Nenhuma restrição cadastrada';

                // Calculate IMC
                if (physicalData.weight && physicalData.height) {
                    const heightM = physicalData.height / 100;
                    const imc = (physicalData.weight / (heightM * heightM)).toFixed(1);
                    document.getElementById('detail-imc').textContent = imc;
                    
                    let category = '';
                    if (imc < 18.5) category = 'Abaixo do peso';
                    else if (imc < 25) category = 'Peso normal';
                    else if (imc < 30) category = 'Sobrepeso';
                    else category = 'Obesidade';
                    
                    document.getElementById('detail-imc-category').textContent = category;
                } else {
                    document.getElementById('detail-imc').textContent = '-';
                    document.getElementById('detail-imc-category').textContent = '-';
                }

                // Status badge
                const isActive = student.status === 'active';
                const badge = document.getElementById('detail-status-badge');
                badge.textContent = isActive ? 'Ativo' : 'Inativo';
                badge.className = isActive ? 
                    'inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full mt-2' : 
                    'inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full mt-2';

                // Load student workouts
                loadStudentWorkouts(studentId);

                // Load payment history (simulated data for now)
                loadPaymentHistory(studentId);

                // Show modal
                document.getElementById('detailsModal').classList.add('active');
                showTab('personal');
            }

            function closeDetailsModal() {
                document.getElementById('detailsModal').classList.remove('active');
                currentStudentId = null;
            }

            function showTab(tabName) {
                // Hide all content
                document.querySelectorAll('[id^="content-"]').forEach(el => el.classList.add('hidden'));
                
                // Remove active class from all tabs
                document.querySelectorAll('[id^="tab-"]').forEach(el => {
                    el.classList.remove('border-lime-400', 'text-lime-400');
                    el.classList.add('text-gray-400');
                });
                
                // Show selected content
                document.getElementById('content-' + tabName).classList.remove('hidden');
                
                // Add active class to selected tab
                const tab = document.getElementById('tab-' + tabName);
                tab.classList.add('border-lime-400', 'text-lime-400');
                tab.classList.remove('text-gray-400');

                // Load charts for evolution tab
                if (tabName === 'evolution') {
                    setTimeout(() => loadEvolutionCharts(), 100);
                }
            }

            async function loadStudentWorkouts(studentId) {
                try {
                    const response = await axios.get('/api/workouts', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    const studentWorkouts = response.data.filter(w => w.student_id === studentId);
                    
                    document.getElementById('detail-total-workouts').textContent = studentWorkouts.length;
                    
                    // Simulated session count (in production, would come from workout_sessions table)
                    const completedSessions = Math.floor(studentWorkouts.length * 8);
                    document.getElementById('detail-completed-sessions').textContent = completedSessions;

                    // Last workout date
                    if (studentWorkouts.length > 0) {
                        const lastWorkout = studentWorkouts.sort((a, b) => b.created_at - a.created_at)[0];
                        const daysSince = Math.floor((Date.now() / 1000 - lastWorkout.created_at) / 86400);
                        document.getElementById('detail-last-workout').textContent = daysSince + 'd';
                    } else {
                        document.getElementById('detail-last-workout').textContent = '-';
                    }

                    // Render workouts list
                    const listEl = document.getElementById('student-workouts-list');
                    
                    if (studentWorkouts.length === 0) {
                        listEl.innerHTML = \`
                            <div class="text-center py-12 text-gray-400">
                                <i class="fas fa-dumbbell text-4xl mb-3"></i>
                                <p>Nenhum treino cadastrado ainda</p>
                                <button onclick="createWorkoutForStudent()" class="btn-neon px-6 py-3 rounded-lg mt-4">
                                    <i class="fas fa-plus mr-2"></i>Criar Primeiro Treino
                                </button>
                            </div>
                        \`;
                        return;
                    }

                    listEl.innerHTML = studentWorkouts.map(workout => {
                        const exercises = JSON.parse(workout.exercises || '[]');
                        return \`
                            <div class="bg-black/50 p-4 rounded-lg mb-3">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <div class="font-bold text-lg mb-1">\${workout.title}</div>
                                        <div class="text-sm text-gray-400 mb-2">\${workout.description || ''}</div>
                                        <div class="flex items-center gap-4 text-xs text-gray-500">
                                            <span><i class="fas fa-dumbbell mr-1"></i>\${exercises.length} exercícios</span>
                                            <span><i class="fas fa-calendar mr-1"></i>\${new Date(workout.created_at * 1000).toLocaleDateString('pt-BR')}</span>
                                            \${workout.ai_logic_used ? '<span class="text-lime-400"><i class="fas fa-brain mr-1"></i>IA</span>' : ''}
                                        </div>
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick="viewWorkout('\${workout.id}')" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button onclick="duplicateWorkout('\${workout.id}')" class="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } catch (error) {
                    console.error('Error loading workouts:', error);
                }
            }

            function loadPaymentHistory(studentId) {
                // Simulated payment data (in production, would come from payments table)
                const payments = [
                    { date: '2026-03-01', amount: 199.90, method: 'Pix', status: 'paid', ref: 'Março/2026' },
                    { date: '2026-02-01', amount: 199.90, method: 'Cartão', status: 'paid', ref: 'Fevereiro/2026' },
                    { date: '2026-01-01', amount: 199.90, method: 'Pix', status: 'paid', ref: 'Janeiro/2026' },
                ];

                const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
                document.getElementById('detail-total-paid').textContent = \`R$ \${totalPaid.toFixed(2).replace('.', ',')}\`;
                document.getElementById('detail-pending').textContent = 'R$ 0,00';
                document.getElementById('detail-next-payment').textContent = '01/04/2026';
                document.getElementById('detail-plan').textContent = 'Mensal';

                const tbody = document.getElementById('payments-tbody');
                
                if (payments.length === 0) {
                    tbody.innerHTML = \`
                        <tr>
                            <td colspan="5" class="text-center py-12 text-gray-400">
                                <i class="fas fa-receipt text-4xl mb-3"></i>
                                <p>Nenhum pagamento registrado</p>
                            </td>
                        </tr>
                    \`;
                    return;
                }

                tbody.innerHTML = payments.map(payment => {
                    const statusClass = payment.status === 'paid' ? 'text-green-400' : 'text-orange-400';
                    const statusText = payment.status === 'paid' ? 'Pago' : 'Pendente';
                    const statusIcon = payment.status === 'paid' ? 'fa-check-circle' : 'fa-clock';

                    return \`
                        <tr class="border-b border-gray-800 hover:bg-black/30">
                            <td class="py-3">\${new Date(payment.date).toLocaleDateString('pt-BR')}</td>
                            <td class="font-bold">R$ \${payment.amount.toFixed(2).replace('.', ',')}</td>
                            <td class="text-gray-400">\${payment.method}</td>
                            <td class="\${statusClass}">
                                <i class="fas \${statusIcon} mr-1"></i>\${statusText}
                            </td>
                            <td class="text-gray-400">\${payment.ref}</td>
                        </tr>
                    \`;
                }).join('');
            }

            function loadEvolutionCharts() {
                // Weight chart
                const weightCtx = document.getElementById('weight-chart');
                if (weightCtx && !weightCtx.chart) {
                    weightCtx.chart = new Chart(weightCtx, {
                        type: 'line',
                        data: {
                            labels: ['Jan', 'Fev', 'Mar'],
                            datasets: [{
                                label: 'Peso (kg)',
                                data: [75, 73, 72],
                                borderColor: '#CCFF00',
                                backgroundColor: 'rgba(204, 255, 0, 0.1)',
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { ticks: { color: '#999' }, grid: { color: '#333' } },
                                x: { ticks: { color: '#999' }, grid: { color: '#333' } }
                            }
                        }
                    });
                }

                // BF chart
                const bfCtx = document.getElementById('bf-chart');
                if (bfCtx && !bfCtx.chart) {
                    bfCtx.chart = new Chart(bfCtx, {
                        type: 'line',
                        data: {
                            labels: ['Jan', 'Fev', 'Mar'],
                            datasets: [{
                                label: 'BF (%)',
                                data: [18, 16, 15],
                                borderColor: '#FF9500',
                                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { ticks: { color: '#999' }, grid: { color: '#333' } },
                                x: { ticks: { color: '#999' }, grid: { color: '#333' } }
                            }
                        }
                    });
                }

                // Frequency chart
                const freqCtx = document.getElementById('frequency-chart');
                if (freqCtx && !freqCtx.chart) {
                    freqCtx.chart = new Chart(freqCtx, {
                        type: 'bar',
                        data: {
                            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                            datasets: [{
                                label: 'Treinos',
                                data: [4, 5, 3, 4],
                                backgroundColor: '#00FF88'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { ticks: { color: '#999', stepSize: 1 }, grid: { color: '#333' } },
                                x: { ticks: { color: '#999' }, grid: { display: false } }
                            }
                        }
                    });
                }
            }

            function createWorkoutForStudent() {
                localStorage.setItem('selected_student_id', currentStudentId);
                window.location.href = '/dashboard/ai-generator';
            }

            function viewWorkout(workoutId) {
                window.location.href = '/dashboard/workouts';
            }

            async function duplicateWorkout(workoutId) {
                if (!confirm('Deseja duplicar este treino?')) return;
                
                try {
                    const response = await axios.get('/api/workouts', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    const workout = response.data.find(w => w.id === workoutId);
                    if (!workout) return;

                    const duplicated = {
                        student_id: workout.student_id,
                        title: workout.title + ' (Cópia)',
                        description: workout.description,
                        exercises: workout.exercises,
                        ai_logic_used: workout.ai_logic_used
                    };

                    await axios.post('/api/workouts', duplicated, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    alert('Treino duplicado com sucesso!');
                    loadStudentWorkouts(currentStudentId);
                } catch (error) {
                    console.error('Error duplicating workout:', error);
                    alert('Erro ao duplicar treino');
                }
            }

            function editStudent() {
                alert('Funcionalidade de edição será implementada em breve!');
            }

            function sendNotification() {
                alert('Redirecionando para página de notificações...');
                window.location.href = '/dashboard/notifications';
            }

            async function deleteStudent() {
                if (!confirm('Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.')) return;
                
                try {
                    await axios.delete(\`/api/students/\${currentStudentId}\`, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    alert('Aluno excluído com sucesso!');
                    closeDetailsModal();
                    loadStudents();
                } catch (error) {
                    console.error('Error deleting student:', error);
                    alert('Erro ao excluir aluno');
                }
            }

            function addPayment() {
                alert('Funcionalidade de registro de pagamento será implementada em breve!');
            }

            let currentStudentId = null;

            // Initialize - Simplified without Axios dependency
            window.addEventListener('DOMContentLoaded', async function() {
                console.log('🚀 [' + new Date().toISOString() + '] Initializing AI Generator...');
                console.log('   Token present:', !!token);
                console.log('   Token length:', token ? token.length : 0);
                
                try {
                    await loadSports();
                    await loadStudents();
                    console.log('✅ Initialization complete');
                } catch (error) {
                    console.error('❌ Initialization failed:', error);
                }
            });
        </script>
    </body>
    </html>
  `)
})
