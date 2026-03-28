import { Hono } from 'hono'

export const studentDashboardRoutes = new Hono()

// Student Dashboard - Mobile First
studentDashboardRoutes.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meu Treino - ForteTrain</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body {
                background: #0D0D0D;
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                padding-bottom: 80px; /* Space for bottom nav */
            }
            .card-dark {
                background: #1A1A1A;
                border: 1px solid #333;
            }
            .btn-green-neon {
                background: #00FF88;
                color: #0D0D0D;
                font-weight: bold;
                transition: all 0.3s;
                box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
            }
            .btn-green-neon:hover {
                transform: scale(1.02);
                box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
            }
            .btn-blue {
                background: #00D4FF;
                color: #0D0D0D;
                font-weight: bold;
                transition: all 0.3s;
            }
            .btn-blue:hover {
                background: #00B8E0;
            }
            .stat-card {
                background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
                border: 1px solid #333;
            }
            .bottom-nav {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #0D0D0D;
                border-top: 1px solid #333;
                display: flex;
                justify-content: space-around;
                padding: 1rem 0;
                z-index: 50;
            }
            .nav-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #666;
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.3s;
            }
            .nav-item.active {
                color: #00FF88;
            }
            .nav-item i {
                font-size: 1.5rem;
                margin-bottom: 0.25rem;
            }
            .workout-card {
                background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
                border-left: 4px solid #00FF88;
            }
            .exercise-item {
                background: #0D0D0D;
                border: 1px solid #333;
                padding: 1rem;
                margin-bottom: 0.5rem;
                border-radius: 0.5rem;
            }
            .badge {
                display: inline-block;
                padding: 0.5rem 1rem;
                border-radius: 2rem;
                font-size: 0.875rem;
                font-weight: bold;
            }
            .badge-gold {
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                color: #0D0D0D;
            }
            .badge-silver {
                background: linear-gradient(135deg, #C0C0C0 0%, #808080 100%);
                color: #0D0D0D;
            }
            .badge-bronze {
                background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
                color: #FFFFFF;
            }
            .timer-display {
                font-size: 3rem;
                font-weight: bold;
                text-align: center;
                color: #00FF88;
                font-family: 'Courier New', monospace;
            }
            .body-map {
                position: relative;
                width: 100%;
                max-width: 300px;
                margin: 0 auto;
            }
            .pain-point {
                position: absolute;
                width: 20px;
                height: 20px;
                background: #FF3B30;
                border-radius: 50%;
                border: 2px solid #FFFFFF;
                cursor: pointer;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
            }
            .progress-ring {
                transform: rotate(-90deg);
            }
            .progress-ring-circle {
                transition: stroke-dashoffset 0.35s;
                transform-origin: 50% 50%;
            }
            .section {
                display: none;
            }
            .section.active {
                display: block;
            }
            .streak-indicator {
                background: linear-gradient(135deg, #FF6B35 0%, #FF4757 100%);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 2rem;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
            }
        </style>
    </head>
    <body>
        <!-- Header -->
        <div class="sticky top-0 z-40 bg-black bg-opacity-95 backdrop-blur-sm border-b border-gray-800">
            <div class="px-4 py-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold">Olá, <span id="studentName">Aluno</span>! 👋</h1>
                        <p class="text-sm text-gray-400" id="currentDate"></p>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="streak-indicator">
                            <i class="fas fa-fire"></i>
                            <span id="streakDays">0</span> dias
                        </div>
                        <button onclick="logout()" class="text-gray-400 hover:text-white">
                            <i class="fas fa-sign-out-alt text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="px-4 py-6">
            
            <!-- SECTION 1: HOME / TREINO DO DIA -->
            <div id="section-home" class="section active">
                
                <!-- Quick Stats -->
                <div class="grid grid-cols-3 gap-3 mb-6">
                    <div class="stat-card p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold" style="color: #00FF88;" id="weekWorkouts">0</div>
                        <div class="text-xs text-gray-400">Treinos/Sem</div>
                    </div>
                    <div class="stat-card p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold" style="color: #00D4FF;" id="totalWeight">0</div>
                        <div class="text-xs text-gray-400">kg Total</div>
                    </div>
                    <div class="stat-card p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold" style="color: #FF6B35;" id="currentWeight">-</div>
                        <div class="text-xs text-gray-400">Peso Atual</div>
                    </div>
                </div>

                <!-- Treino do Dia -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-3">
                        <h2 class="text-xl font-bold">
                            <i class="fas fa-dumbbell mr-2" style="color: #00FF88;"></i>
                            Treino de Hoje
                        </h2>
                        <button onclick="openVisionModal()" class="btn-blue px-4 py-2 rounded-lg">
                            <i class="fas fa-camera mr-2"></i>
                            Vision IA
                        </button>
                    </div>

                    <div id="todayWorkout" class="workout-card p-6 rounded-xl">
                        <div class="text-center py-8">
                            <i class="fas fa-spinner fa-spin text-4xl text-gray-600 mb-4"></i>
                            <p class="text-gray-400">Carregando treino...</p>
                        </div>
                    </div>
                </div>

                <!-- Badges/Conquistas -->
                <div class="mb-6">
                    <h2 class="text-xl font-bold mb-3">
                        <i class="fas fa-trophy mr-2" style="color: #FFD700;"></i>
                        Conquistas Recentes
                    </h2>
                    <div id="badgesList" class="flex gap-2 overflow-x-auto pb-2">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Próximos Treinos -->
                <div class="mb-6">
                    <h2 class="text-xl font-bold mb-3">
                        <i class="fas fa-calendar-alt mr-2" style="color: #00D4FF;"></i>
                        Próximos Treinos
                    </h2>
                    <div id="upcomingWorkouts">
                        <!-- Will be populated by JS -->
                    </div>
                </div>
            </div>

            <!-- SECTION 2: ANALYTICS -->
            <div id="section-analytics" class="section">
                <h2 class="text-2xl font-bold mb-6">
                    <i class="fas fa-chart-line mr-2" style="color: #00D4FF;"></i>
                    Minha Evolução
                </h2>

                <!-- Consistency Chart -->
                <div class="card-dark p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Consistência Semanal</h3>
                    <canvas id="consistencyChart" height="200"></canvas>
                </div>

                <!-- Volume Chart -->
                <div class="card-dark p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Volume Total de Carga</h3>
                    <canvas id="volumeChart" height="200"></canvas>
                </div>

                <!-- Weight Evolution -->
                <div class="card-dark p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Evolução de Peso</h3>
                    <canvas id="weightEvolutionChart" height="200"></canvas>
                </div>

                <!-- Progress Photos -->
                <div class="card-dark p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Fotos de Evolução</h3>
                    <div id="progressPhotos" class="grid grid-cols-2 gap-4">
                        <!-- Will be populated by JS -->
                    </div>
                </div>
            </div>

            <!-- SECTION 3: NOTIFICATIONS -->
            <div id="section-notifications" class="section">
                <h2 class="text-2xl font-bold mb-6">
                    <i class="fas fa-bell mr-2" style="color: #FF6B35;"></i>
                    Notificações
                </h2>

                <!-- Messages from Personal -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-3">Mensagens do Personal</h3>
                    <div id="personalMessages">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- System Alerts -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-3">Alertas do Sistema</h3>
                    <div id="systemAlerts">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Reminders -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-3">Lembretes</h3>
                    <div id="reminders">
                        <div class="card-dark p-4 rounded-lg mb-3">
                            <div class="flex items-center gap-3">
                                <i class="fas fa-tint text-2xl" style="color: #00D4FF;"></i>
                                <div class="flex-1">
                                    <div class="font-semibold">Hidratação</div>
                                    <div class="text-sm text-gray-400">Beba água a cada 30 minutos</div>
                                </div>
                                <input type="checkbox" class="w-5 h-5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECTION 4: PROFILE -->
            <div id="section-profile" class="section">
                <h2 class="text-2xl font-bold mb-6">
                    <i class="fas fa-user-circle mr-2" style="color: #00FF88;"></i>
                    Meu Perfil
                </h2>

                <!-- Subscription Status -->
                <div class="card-dark p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Status da Assinatura</h3>
                    <div id="subscriptionStatus">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-gray-400">Status</span>
                            <span class="px-3 py-1 bg-green-600 rounded-full text-sm font-bold">Ativo</span>
                        </div>
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-gray-400">Próxima Renovação</span>
                            <span id="nextRenewal">-</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-400">Personal Trainer</span>
                            <span id="personalName">-</span>
                        </div>
                    </div>
                </div>

                <!-- Check-in de Lesões -->
                <div class="card-dark p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">
                        <i class="fas fa-heartbeat mr-2" style="color: #FF3B30;"></i>
                        Check-in de Lesões
                    </h3>
                    <p class="text-sm text-gray-400 mb-4">Marque qualquer dor ou desconforto antes de treinar</p>
                    <button onclick="openBodyMapModal()" class="btn-green-neon w-full py-3 rounded-lg">
                        <i class="fas fa-user-injured mr-2"></i>
                        Registrar Dor/Desconforto
                    </button>
                </div>

                <!-- Biblioteca de Recuperação -->
                <div class="card-dark p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">
                        <i class="fas fa-spa mr-2" style="color: #00D4FF;"></i>
                        Biblioteca de Recuperação
                    </h3>
                    <div id="recoveryLibrary" class="space-y-3">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Personal Info -->
                <div class="card-dark p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Informações Pessoais</h3>
                    <div id="personalInfo">
                        <!-- Will be populated by JS -->
                    </div>
                </div>
            </div>

        </div>

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
            <div class="nav-item active" onclick="switchSection('home')">
                <i class="fas fa-home"></i>
                <span>Início</span>
            </div>
            <div class="nav-item" onclick="switchSection('analytics')">
                <i class="fas fa-chart-bar"></i>
                <span>Evolução</span>
            </div>
            <div class="nav-item" onclick="switchSection('notifications')">
                <i class="fas fa-bell"></i>
                <span>Avisos</span>
            </div>
            <div class="nav-item" onclick="switchSection('profile')">
                <i class="fas fa-user"></i>
                <span>Perfil</span>
            </div>
        </div>

        <!-- Vision Modal -->
        <div id="visionModal" class="hidden fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div class="card-dark p-6 rounded-xl max-w-md w-full mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Vision IA - Identificar Equipamento</h3>
                    <button onclick="closeVisionModal()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="text-center py-8">
                    <i class="fas fa-camera text-6xl mb-4" style="color: #00D4FF;"></i>
                    <p class="text-gray-400 mb-4">Tire uma foto do equipamento</p>
                    <button class="btn-green-neon px-6 py-3 rounded-lg">
                        <i class="fas fa-camera mr-2"></i>
                        Abrir Câmera
                    </button>
                </div>
            </div>
        </div>

        <!-- Body Map Modal -->
        <div id="bodyMapModal" class="hidden fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center overflow-y-auto">
            <div class="card-dark p-6 rounded-xl max-w-md w-full mx-4 my-8">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Mapa Corporal</h3>
                    <button onclick="closeBodyMapModal()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <p class="text-sm text-gray-400 mb-4">Toque na área do corpo onde sente dor ou desconforto</p>
                
                <div class="body-map mb-6">
                    <svg viewBox="0 0 200 400" class="w-full">
                        <!-- Simple body outline -->
                        <ellipse cx="100" cy="30" rx="25" ry="30" fill="#2A2A2A" stroke="#00FF88" stroke-width="2"/>
                        <rect x="75" y="55" width="50" height="80" rx="10" fill="#2A2A2A" stroke="#00FF88" stroke-width="2"/>
                        <rect x="60" y="60" width="20" height="60" rx="5" fill="#2A2A2A" stroke="#00FF88" stroke-width="2"/>
                        <rect x="120" y="60" width="20" height="60" rx="5" fill="#2A2A2A" stroke="#00FF88" stroke-width="2"/>
                        <rect x="80" y="135" width="15" height="100" rx="7" fill="#2A2A2A" stroke="#00FF88" stroke-width="2"/>
                        <rect x="105" y="135" width="15" height="100" rx="7" fill="#2A2A2A" stroke="#00FF88" stroke-width="2"/>
                    </svg>
                </div>

                <form id="painForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold mb-2">Região do Corpo</label>
                        <select id="painRegion" class="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white">
                            <option value="neck">Pescoço</option>
                            <option value="shoulder_left">Ombro Esquerdo</option>
                            <option value="shoulder_right">Ombro Direito</option>
                            <option value="chest">Peito</option>
                            <option value="back">Costas</option>
                            <option value="lower_back">Lombar</option>
                            <option value="bicep_left">Bíceps Esquerdo</option>
                            <option value="bicep_right">Bíceps Direito</option>
                            <option value="forearm_left">Antebraço Esquerdo</option>
                            <option value="forearm_right">Antebraço Direito</option>
                            <option value="quad_left">Quadríceps Esquerdo</option>
                            <option value="quad_right">Quadríceps Direito</option>
                            <option value="hamstring_left">Posterior Esquerdo</option>
                            <option value="hamstring_right">Posterior Direito</option>
                            <option value="calf_left">Panturrilha Esquerda</option>
                            <option value="calf_right">Panturrilha Direita</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">Intensidade da Dor (1-10)</label>
                        <input type="range" id="painIntensity" min="1" max="10" value="5" class="w-full">
                        <div class="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Leve (1)</span>
                            <span id="painValue">5</span>
                            <span>Intensa (10)</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">Descrição (opcional)</label>
                        <textarea id="painDescription" rows="3" class="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white" placeholder="Descreva o tipo de dor..."></textarea>
                    </div>
                    <button type="submit" class="btn-green-neon w-full py-3 rounded-lg">
                        <i class="fas fa-save mr-2"></i>
                        Registrar Check-in
                    </button>
                </form>
            </div>
        </div>

        <!-- Workout Modal -->
        <div id="workoutModal" class="hidden fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
            <div class="min-h-screen flex items-center justify-center p-4">
                <div class="card-dark p-6 rounded-xl max-w-2xl w-full">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold" id="workoutTitle">Treino</h3>
                        <button onclick="closeWorkoutModal()" class="text-gray-400 hover:text-white">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>

                    <!-- Timer -->
                    <div class="text-center mb-6">
                        <div class="timer-display" id="workoutTimer">00:00:00</div>
                        <div class="flex gap-3 justify-center mt-4">
                            <button id="startBtn" onclick="startWorkoutTimer()" class="btn-green-neon px-6 py-3 rounded-lg">
                                <i class="fas fa-play mr-2"></i>
                                Iniciar
                            </button>
                            <button id="pauseBtn" onclick="pauseWorkoutTimer()" class="hidden btn-blue px-6 py-3 rounded-lg">
                                <i class="fas fa-pause mr-2"></i>
                                Pausar
                            </button>
                            <button onclick="finishWorkout()" class="bg-red-600 text-white px-6 py-3 rounded-lg font-bold">
                                <i class="fas fa-check mr-2"></i>
                                Finalizar
                            </button>
                        </div>
                    </div>

                    <!-- Exercises List -->
                    <div id="exercisesList">
                        <!-- Will be populated by JS -->
                    </div>

                    <!-- Rest Timer -->
                    <div id="restTimer" class="hidden fixed bottom-20 left-0 right-0 bg-orange-600 text-white p-4 text-center">
                        <div class="text-xl font-bold">Descanso</div>
                        <div class="text-4xl font-bold" id="restTimerDisplay">00:60</div>
                        <button onclick="skipRest()" class="mt-2 px-4 py-2 bg-white text-orange-600 rounded-lg font-bold">
                            Pular Descanso
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // Global variables
            let studentData = null;
            let workouts = [];
            let measurements = [];
            let photos = [];
            let badges = [];
            let workoutTimer = null;
            let workoutStartTime = null;
            let restTimer = null;
            let restTimeRemaining = 0;

            // Load token
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/auth/login';
            }

            axios.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;

            // Initialize
            async function init() {
                try {
                    // Decode JWT to get student info
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    
                    // Security: Block admin/personal routes
                    if (payload.role !== 'student') {
                        alert('Acesso negado. Esta área é exclusiva para alunos.');
                        logout();
                        return;
                    }

                    const studentId = payload.studentId || payload.userId;
                    
                    // Load student data
                    const studentRes = await axios.get(\`/api/students/\${studentId}\`);
                    studentData = studentRes.data;
                    
                    const firstName = studentData.full_name ? studentData.full_name.split(' ')[0] : 'Aluno';
                    document.getElementById('studentName').textContent = firstName;
                    
                    // Load all data
                    await Promise.all([
                        loadWorkouts(studentId),
                        loadMeasurements(studentId),
                        loadPhotos(studentId),
                        loadBadges(studentId)
                    ]);
                    
                    // Render sections
                    renderHome();
                    renderAnalytics();
                    renderNotifications();
                    renderProfile();
                    
                    // Set current date
                    const now = new Date();
                    document.getElementById('currentDate').textContent = now.toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                } catch (error) {
                    console.error('Init error:', error);
                    if (error.response?.status === 401) {
                        logout();
                    } else {
                        alert('Erro ao carregar dados. Tente novamente.');
                    }
                }
            }

            async function loadWorkouts(studentId) {
                const res = await axios.get(\`/api/students/\${studentId}/workouts\`);
                workouts = res.data.filter(w => w.is_active !== false);
            }

            async function loadMeasurements(studentId) {
                const res = await axios.get(\`/api/students/\${studentId}/measurements\`);
                measurements = res.data;
            }

            async function loadPhotos(studentId) {
                const res = await axios.get(\`/api/students/\${studentId}/photos\`);
                photos = res.data;
            }

            async function loadBadges(studentId) {
                // Mock badges for now
                badges = [
                    { name: '10 Dias Seguidos', icon: 'fire', color: 'gold', unlocked: true },
                    { name: 'Recorde de Carga', icon: 'trophy', color: 'gold', unlocked: true },
                    { name: 'Primeira Semana', icon: 'star', color: 'silver', unlocked: true },
                    { name: '30 Dias', icon: 'medal', color: 'bronze', unlocked: false }
                ];
            }

            function renderHome() {
                // Stats
                const thisWeekWorkouts = workouts.filter(w => {
                    const workoutDate = new Date(w.created_at * 1000);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return workoutDate >= weekAgo;
                }).length;
                
                document.getElementById('weekWorkouts').textContent = thisWeekWorkouts;
                document.getElementById('totalWeight').textContent = '1250'; // Mock
                
                if (measurements.length > 0) {
                    document.getElementById('currentWeight').textContent = measurements[0].weight + 'kg';
                }
                
                // Streak (mock for now)
                document.getElementById('streakDays').textContent = thisWeekWorkouts;

                // Today's workout
                const todayWorkout = workouts[0]; // Get most recent
                
                if (todayWorkout) {
                    document.getElementById('todayWorkout').innerHTML = \`
                        <div class="mb-4">
                            <h3 class="text-2xl font-bold mb-2">\${todayWorkout.title}</h3>
                            <p class="text-gray-400">\${todayWorkout.description || ''}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div class="text-center">
                                <div class="text-3xl font-bold" style="color: #00FF88;">\${todayWorkout.exercises ? JSON.parse(todayWorkout.exercises).length : 0}</div>
                                <div class="text-sm text-gray-400">Exercícios</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold" style="color: #00D4FF;">45min</div>
                                <div class="text-sm text-gray-400">Duração</div>
                            </div>
                        </div>
                        <button onclick="openWorkoutModal('\${todayWorkout.id}')" class="btn-green-neon w-full py-4 rounded-xl text-lg">
                            <i class="fas fa-play mr-2"></i>
                            Iniciar Treino
                        </button>
                    \`;
                } else {
                    document.getElementById('todayWorkout').innerHTML = \`
                        <div class="text-center py-8">
                            <i class="fas fa-calendar-times text-4xl text-gray-600 mb-4"></i>
                            <p class="text-gray-400">Nenhum treino disponível hoje</p>
                            <p class="text-sm text-gray-500 mt-2">Entre em contato com seu Personal Trainer</p>
                        </div>
                    \`;
                }

                // Badges
                const badgesHtml = badges.map(badge => \`
                    <div class="badge badge-\${badge.color} \${!badge.unlocked ? 'opacity-50' : ''}">
                        <i class="fas fa-\${badge.icon} mr-1"></i>
                        \${badge.name}
                    </div>
                \`).join('');
                document.getElementById('badgesList').innerHTML = badgesHtml;

                // Upcoming workouts
                const upcomingHtml = workouts.slice(1, 4).map(w => \`
                    <div class="card-dark p-4 rounded-lg mb-3">
                        <div class="font-bold">\${w.title}</div>
                        <div class="text-sm text-gray-400 mt-1">\${w.description || 'Sem descrição'}</div>
                    </div>
                \`).join('');
                document.getElementById('upcomingWorkouts').innerHTML = upcomingHtml || '<p class="text-gray-400 text-center py-4">Nenhum treino programado</p>';
            }

            function renderAnalytics() {
                // Consistency Chart
                const ctx1 = document.getElementById('consistencyChart');
                new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                        datasets: [{
                            label: 'Treinos Realizados',
                            data: [1, 1, 0, 1, 1, 1, 0],
                            backgroundColor: '#00FF88'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true, ticks: { color: '#999' }, grid: { color: '#333' } },
                            x: { ticks: { color: '#999' }, grid: { color: '#333' } }
                        },
                        plugins: { legend: { labels: { color: '#FFF' } } }
                    }
                });

                // Volume Chart
                const ctx2 = document.getElementById('volumeChart');
                new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                        datasets: [{
                            label: 'Volume Total (kg)',
                            data: [1000, 1150, 1200, 1250],
                            borderColor: '#00D4FF',
                            backgroundColor: 'rgba(0, 212, 255, 0.1)',
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { ticks: { color: '#999' }, grid: { color: '#333' } },
                            x: { ticks: { color: '#999' }, grid: { color: '#333' } }
                        },
                        plugins: { legend: { labels: { color: '#FFF' } } }
                    }
                });

                // Weight Evolution
                if (measurements.length > 0) {
                    const weightData = measurements.map(m => ({
                        x: new Date(m.measured_at * 1000),
                        y: m.weight
                    })).filter(d => d.y).reverse();

                    const ctx3 = document.getElementById('weightEvolutionChart');
                    new Chart(ctx3, {
                        type: 'line',
                        data: {
                            datasets: [{
                                label: 'Peso (kg)',
                                data: weightData,
                                borderColor: '#FF6B35',
                                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                tension: 0.3
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: { type: 'time', time: { unit: 'day' }, ticks: { color: '#999' }, grid: { color: '#333' } },
                                y: { ticks: { color: '#999' }, grid: { color: '#333' } }
                            },
                            plugins: { legend: { labels: { color: '#FFF' } } }
                        }
                    });
                }

                // Progress Photos
                if (photos.length > 0) {
                    const photosHtml = photos.slice(0, 4).map(photo => \`
                        <div class="aspect-square rounded-lg overflow-hidden">
                            <img src="\${photo.photo_url}" alt="Progresso" class="w-full h-full object-cover">
                        </div>
                    \`).join('');
                    document.getElementById('progressPhotos').innerHTML = photosHtml;
                } else {
                    document.getElementById('progressPhotos').innerHTML = '<p class="text-gray-400 text-center col-span-2 py-4">Nenhuma foto ainda</p>';
                }
            }

            function renderNotifications() {
                // Personal messages (mock)
                document.getElementById('personalMessages').innerHTML = \`
                    <div class="card-dark p-4 rounded-lg mb-3">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-user-circle text-3xl" style="color: #00FF88;"></i>
                            <div class="flex-1">
                                <div class="font-bold">Personal Trainer</div>
                                <div class="text-sm text-gray-400 mt-1">Ótimo trabalho essa semana! Continue assim 💪</div>
                                <div class="text-xs text-gray-500 mt-2">Há 2 horas</div>
                            </div>
                        </div>
                    </div>
                \`;

                // System alerts (mock)
                document.getElementById('systemAlerts').innerHTML = \`
                    <div class="card-dark p-4 rounded-lg mb-3 border-l-4 border-yellow-500">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-exclamation-triangle text-2xl text-yellow-500"></i>
                            <div class="flex-1">
                                <div class="font-bold">Avaliação Física</div>
                                <div class="text-sm text-gray-400 mt-1">Sua reavaliação vence em 5 dias</div>
                            </div>
                        </div>
                    </div>
                \`;
            }

            function renderProfile() {
                // Subscription (mock)
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                document.getElementById('nextRenewal').textContent = nextMonth.toLocaleDateString('pt-BR');
                document.getElementById('personalName').textContent = 'André Silva';

                // Recovery library (mock)
                document.getElementById('recoveryLibrary').innerHTML = \`
                    <div class="card-dark p-4 rounded-lg cursor-pointer hover:border hover:border-blue-500 transition">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-play-circle text-2xl" style="color: #00D4FF;"></i>
                            <div class="flex-1">
                                <div class="font-semibold">Alongamento para Pernas</div>
                                <div class="text-xs text-gray-400">5 minutos</div>
                            </div>
                        </div>
                    </div>
                    <div class="card-dark p-4 rounded-lg cursor-pointer hover:border hover:border-blue-500 transition">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-play-circle text-2xl" style="color: #00D4FF;"></i>
                            <div class="flex-1">
                                <div class="font-semibold">Mobilidade de Ombros</div>
                                <div class="text-xs text-gray-400">7 minutos</div>
                            </div>
                        </div>
                    </div>
                    <div class="card-dark p-4 rounded-lg cursor-pointer hover:border hover:border-blue-500 transition">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-play-circle text-2xl" style="color: #00D4FF;"></i>
                            <div class="flex-1">
                                <div class="font-semibold">Relaxamento Lombar</div>
                                <div class="text-xs text-gray-400">10 minutos</div>
                            </div>
                        </div>
                    </div>
                \`;

                // Personal info
                document.getElementById('personalInfo').innerHTML = \`
                    <div class="space-y-3">
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span class="text-gray-400">Email</span>
                            <span>\${studentData.email}</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span class="text-gray-400">Telefone</span>
                            <span>\${studentData.phone || 'Não informado'}</span>
                        </div>
                        <div class="flex justify-between py-2">
                            <span class="text-gray-400">Membro desde</span>
                            <span>\${new Date(studentData.created_at * 1000).toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>
                \`;
            }

            // Section switching
            function switchSection(section) {
                // Hide all sections
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

                // Show selected section
                document.getElementById(\`section-\${section}\`).classList.add('active');
                event.target.closest('.nav-item').classList.add('active');
            }

            // Workout Modal
            function openWorkoutModal(workoutId) {
                const workout = workouts.find(w => w.id === workoutId);
                if (!workout) return;

                document.getElementById('workoutTitle').textContent = workout.title;
                
                const exercises = workout.exercises ? JSON.parse(workout.exercises) : [];
                const exercisesHtml = exercises.map((ex, idx) => \`
                    <div class="exercise-item">
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex-1">
                                <div class="font-bold">\${idx + 1}. \${ex.name || ex.exercise}</div>
                                <div class="text-sm text-gray-400 mt-1">\${ex.sets || ex.series} séries × \${ex.reps || ex.reps} reps</div>
                            </div>
                            <input type="checkbox" class="w-6 h-6" onchange="checkExerciseComplete()">
                        </div>
                        <div class="text-xs text-gray-500">
                            Descanso: \${ex.rest || '60'}s
                        </div>
                    </div>
                \`).join('');

                document.getElementById('exercisesList').innerHTML = exercisesHtml;
                document.getElementById('workoutModal').classList.remove('hidden');
            }

            function closeWorkoutModal() {
                document.getElementById('workoutModal').classList.add('hidden');
                if (workoutTimer) {
                    clearInterval(workoutTimer);
                    workoutTimer = null;
                }
            }

            function startWorkoutTimer() {
                workoutStartTime = Date.now();
                document.getElementById('startBtn').classList.add('hidden');
                document.getElementById('pauseBtn').classList.remove('hidden');
                
                workoutTimer = setInterval(() => {
                    const elapsed = Date.now() - workoutStartTime;
                    const hours = Math.floor(elapsed / 3600000);
                    const minutes = Math.floor((elapsed % 3600000) / 60000);
                    const seconds = Math.floor((elapsed % 60000) / 1000);
                    
                    document.getElementById('workoutTimer').textContent = 
                        \`\${String(hours).padStart(2, '0')}:\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;
                }, 1000);
            }

            function pauseWorkoutTimer() {
                if (workoutTimer) {
                    clearInterval(workoutTimer);
                    workoutTimer = null;
                    document.getElementById('startBtn').classList.remove('hidden');
                    document.getElementById('pauseBtn').classList.add('hidden');
                }
            }

            function checkExerciseComplete() {
                // Start rest timer when exercise is checked
                const restTime = 60; // seconds
                startRestTimer(restTime);
            }

            function startRestTimer(seconds) {
                restTimeRemaining = seconds;
                document.getElementById('restTimer').classList.remove('hidden');
                
                if (restTimer) clearInterval(restTimer);
                
                restTimer = setInterval(() => {
                    restTimeRemaining--;
                    const mins = Math.floor(restTimeRemaining / 60);
                    const secs = restTimeRemaining % 60;
                    document.getElementById('restTimerDisplay').textContent = 
                        \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
                    
                    if (restTimeRemaining <= 0) {
                        clearInterval(restTimer);
                        document.getElementById('restTimer').classList.add('hidden');
                        // Play sound (optional)
                        playBeep();
                    }
                }, 1000);
            }

            function skipRest() {
                if (restTimer) {
                    clearInterval(restTimer);
                    restTimer = null;
                }
                document.getElementById('restTimer').classList.add('hidden');
            }

            function playBeep() {
                // Simple beep using Web Audio API
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }

            function finishWorkout() {
                if (confirm('Deseja finalizar o treino?')) {
                    alert('Treino concluído! Parabéns 🎉');
                    closeWorkoutModal();
                    // Reload data
                    init();
                }
            }

            // Vision Modal
            function openVisionModal() {
                document.getElementById('visionModal').classList.remove('hidden');
            }

            function closeVisionModal() {
                document.getElementById('visionModal').classList.add('hidden');
            }

            // Body Map Modal
            function openBodyMapModal() {
                document.getElementById('bodyMapModal').classList.remove('hidden');
            }

            function closeBodyMapModal() {
                document.getElementById('bodyMapModal').classList.add('hidden');
            }

            // Pain intensity slider
            document.addEventListener('DOMContentLoaded', () => {
                const slider = document.getElementById('painIntensity');
                if (slider) {
                    slider.addEventListener('input', (e) => {
                        document.getElementById('painValue').textContent = e.target.value;
                    });
                }
            });

            // Pain form
            document.getElementById('painForm')?.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const painData = {
                    region: document.getElementById('painRegion').value,
                    intensity: parseInt(document.getElementById('painIntensity').value),
                    description: document.getElementById('painDescription').value
                };

                try {
                    // TODO: Save to API
                    alert('Check-in registrado! Seu Personal foi notificado.');
                    closeBodyMapModal();
                } catch (error) {
                    alert('Erro ao registrar check-in');
                }
            });

            function logout() {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
            }

            // Initialize on load
            init();
        </script>
    </body>
    </html>
  `)
})
