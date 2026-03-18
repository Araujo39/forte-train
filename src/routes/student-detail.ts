import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

export const studentDetailRoutes = new Hono<{ Bindings: Bindings }>()

// Student Detail Page
studentDetailRoutes.get('/:id', (c) => {
  const studentId = c.req.param('id')
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Detalhes do Aluno - ForteTrain</title>
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
            .input-dark {
                background: #1A1A1A;
                border: 1px solid #333;
                color: #FFFFFF;
            }
            .input-dark:focus {
                outline: none;
                border-color: #CCFF00;
                box-shadow: 0 0 0 2px rgba(204, 255, 0, 0.1);
            }
            .stat-card {
                background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
            }
            .photo-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
            }
            .photo-card {
                position: relative;
                aspect-ratio: 3/4;
                overflow: hidden;
                border-radius: 0.5rem;
                cursor: pointer;
                transition: transform 0.3s;
            }
            .photo-card:hover {
                transform: scale(1.05);
            }
            .photo-card img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .tab-active {
                background: #CCFF00;
                color: #0D0D0D;
            }
            .tab-inactive {
                background: #1A1A1A;
                color: #999;
            }
            .progress-chart {
                height: 300px;
            }
        </style>
    </head>
    <body class="min-h-screen">
        <!-- Sidebar -->
        <div class="sidebar fixed left-0 top-0 h-full w-64 p-6">
            <div class="flex items-center gap-3 mb-8">
                <i class="fas fa-dumbbell text-3xl" style="color: #CCFF00;"></i>
                <span class="text-xl font-bold">ForteTrain</span>
            </div>
            
            <nav class="space-y-2">
                <a href="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
                    <i class="fas fa-home w-5"></i>
                    <span>Dashboard</span>
                </a>
                <a href="/dashboard/students" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800">
                    <i class="fas fa-users w-5" style="color: #CCFF00;"></i>
                    <span style="color: #CCFF00;">Alunos</span>
                </a>
                <a href="/dashboard/workouts" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
                    <i class="fas fa-clipboard-list w-5"></i>
                    <span>Treinos</span>
                </a>
                <a href="/dashboard/ai-generator" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
                    <i class="fas fa-robot w-5"></i>
                    <span>Gerador IA</span>
                </a>
                <a href="/dashboard/analytics" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
                    <i class="fas fa-chart-line w-5"></i>
                    <span>Analytics</span>
                </a>
                <a href="/dashboard/notifications" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
                    <i class="fas fa-bell w-5"></i>
                    <span>Notificações</span>
                </a>
                <a href="/dashboard/settings" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
                    <i class="fas fa-cog w-5"></i>
                    <span>Configurações</span>
                </a>
            </nav>

            <div class="absolute bottom-6 left-6 right-6">
                <button onclick="logout()" class="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition">
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    Sair
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="ml-64 p-8">
            <!-- Header -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <a href="/dashboard/students" class="text-gray-400 hover:text-white mb-2 inline-block">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Voltar para Alunos
                    </a>
                    <h1 class="text-3xl font-bold" id="studentName">
                        <i class="fas fa-user mr-3"></i>
                        Carregando...
                    </h1>
                    <p class="text-gray-400 mt-1" id="studentEmail"></p>
                </div>
                <div class="flex gap-3">
                    <button onclick="openAddPhotoModal()" class="btn-neon px-6 py-3 rounded-lg">
                        <i class="fas fa-camera mr-2"></i>
                        Adicionar Foto
                    </button>
                    <button onclick="openAddMeasurementModal()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <i class="fas fa-ruler mr-2"></i>
                        Nova Medição
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" id="statsCards">
                <!-- Will be populated by JS -->
            </div>

            <!-- Tabs -->
            <div class="flex gap-2 mb-6">
                <button onclick="switchTab('overview')" id="tab-overview" class="tab-active px-6 py-3 rounded-t-lg font-semibold transition">
                    <i class="fas fa-info-circle mr-2"></i>
                    Visão Geral
                </button>
                <button onclick="switchTab('photos')" id="tab-photos" class="tab-inactive px-6 py-3 rounded-t-lg font-semibold transition">
                    <i class="fas fa-images mr-2"></i>
                    Fotos de Progresso
                </button>
                <button onclick="switchTab('measurements')" id="tab-measurements" class="tab-inactive px-6 py-3 rounded-t-lg font-semibold transition">
                    <i class="fas fa-chart-line mr-2"></i>
                    Medições & Evolução
                </button>
                <button onclick="switchTab('workouts')" id="tab-workouts" class="tab-inactive px-6 py-3 rounded-t-lg font-semibold transition">
                    <i class="fas fa-dumbbell mr-2"></i>
                    Histórico de Treinos
                </button>
                <button onclick="switchTab('goals')" id="tab-goals" class="tab-inactive px-6 py-3 rounded-t-lg font-semibold transition">
                    <i class="fas fa-bullseye mr-2"></i>
                    Metas
                </button>
            </div>

            <!-- Tab Content -->
            <div id="content-overview" class="tab-content">
                <!-- Overview content -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Personal Info -->
                    <div class="card-dark p-6 rounded-lg">
                        <h3 class="text-xl font-bold mb-4">
                            <i class="fas fa-user-circle mr-2"></i>
                            Informações Pessoais
                        </h3>
                        <div id="personalInfo" class="space-y-3">
                            <!-- Will be populated by JS -->
                        </div>
                    </div>

                    <!-- Latest Measurements -->
                    <div class="card-dark p-6 rounded-lg">
                        <h3 class="text-xl font-bold mb-4">
                            <i class="fas fa-weight mr-2"></i>
                            Últimas Medições
                        </h3>
                        <div id="latestMeasurements" class="space-y-3">
                            <!-- Will be populated by JS -->
                        </div>
                    </div>

                    <!-- Active Goals -->
                    <div class="card-dark p-6 rounded-lg">
                        <h3 class="text-xl font-bold mb-4">
                            <i class="fas fa-bullseye mr-2"></i>
                            Metas Ativas
                        </h3>
                        <div id="activeGoals" class="space-y-3">
                            <!-- Will be populated by JS -->
                        </div>
                    </div>

                    <!-- Recent Photos -->
                    <div class="card-dark p-6 rounded-lg">
                        <h3 class="text-xl font-bold mb-4">
                            <i class="fas fa-camera mr-2"></i>
                            Fotos Recentes
                        </h3>
                        <div id="recentPhotos" class="photo-grid">
                            <!-- Will be populated by JS -->
                        </div>
                    </div>
                </div>
            </div>

            <div id="content-photos" class="tab-content hidden">
                <div class="card-dark p-6 rounded-lg">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold">
                            <i class="fas fa-images mr-2"></i>
                            Galeria de Fotos de Progresso
                        </h3>
                        <select id="photoFilter" onchange="filterPhotos()" class="input-dark px-4 py-2 rounded-lg">
                            <option value="all">Todas</option>
                            <option value="before">Antes</option>
                            <option value="after">Depois</option>
                            <option value="progress">Progresso</option>
                            <option value="equipment">Equipamento</option>
                        </select>
                    </div>
                    <div id="photoGallery" class="photo-grid">
                        <!-- Will be populated by JS -->
                    </div>
                </div>
            </div>

            <div id="content-measurements" class="tab-content hidden">
                <div class="grid grid-cols-1 gap-6">
                    <!-- Weight Chart -->
                    <div class="card-dark p-6 rounded-lg">
                        <h3 class="text-xl font-bold mb-4">
                            <i class="fas fa-weight mr-2"></i>
                            Evolução de Peso
                        </h3>
                        <canvas id="weightChart" class="progress-chart"></canvas>
                    </div>

                    <!-- Body Fat Chart -->
                    <div class="card-dark p-6 rounded-lg">
                        <h3 class="text-xl font-bold mb-4">
                            <i class="fas fa-percentage mr-2"></i>
                            Percentual de Gordura
                        </h3>
                        <canvas id="bodyFatChart" class="progress-chart"></canvas>
                    </div>

                    <!-- Measurements Table -->
                    <div class="card-dark p-6 rounded-lg">
                        <h3 class="text-xl font-bold mb-4">
                            <i class="fas fa-table mr-2"></i>
                            Histórico de Medições
                        </h3>
                        <div id="measurementsTable" class="overflow-x-auto">
                            <!-- Will be populated by JS -->
                        </div>
                    </div>
                </div>
            </div>

            <div id="content-workouts" class="tab-content hidden">
                <div class="card-dark p-6 rounded-lg">
                    <h3 class="text-2xl font-bold mb-6">
                        <i class="fas fa-clipboard-list mr-2"></i>
                        Histórico de Treinos
                    </h3>
                    <div id="workoutsList">
                        <!-- Will be populated by JS -->
                    </div>
                </div>
            </div>

            <div id="content-goals" class="tab-content hidden">
                <div class="card-dark p-6 rounded-lg">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold">
                            <i class="fas fa-bullseye mr-2"></i>
                            Metas do Aluno
                        </h3>
                        <button onclick="openAddGoalModal()" class="btn-neon px-4 py-2 rounded-lg">
                            <i class="fas fa-plus mr-2"></i>
                            Nova Meta
                        </button>
                    </div>
                    <div id="goalsList">
                        <!-- Will be populated by JS -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Photo Modal -->
        <div id="photoModal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onclick="closePhotoModal()">
            <div class="card-dark p-6 rounded-lg max-w-2xl w-full mx-4" onclick="event.stopPropagation()">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold">Adicionar Foto</h3>
                    <button onclick="closePhotoModal()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <form id="photoForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold mb-2">URL da Foto *</label>
                        <input type="url" id="photoUrl" required class="input-dark w-full px-4 py-2 rounded-lg" placeholder="https://...">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">Tipo *</label>
                        <select id="photoType" required class="input-dark w-full px-4 py-2 rounded-lg">
                            <option value="progress">Progresso</option>
                            <option value="before">Antes</option>
                            <option value="after">Depois</option>
                            <option value="equipment">Equipamento</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">Descrição</label>
                        <textarea id="photoDescription" class="input-dark w-full px-4 py-2 rounded-lg" rows="3" placeholder="Adicione uma descrição..."></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">Tags (separe por vírgula)</label>
                        <input type="text" id="photoTags" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="frente, lateral, costas">
                    </div>
                    <div class="flex gap-3">
                        <button type="submit" class="btn-neon px-6 py-2 rounded-lg flex-1">
                            <i class="fas fa-save mr-2"></i>
                            Salvar Foto
                        </button>
                        <button type="button" onclick="closePhotoModal()" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Measurement Modal -->
        <div id="measurementModal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onclick="closeMeasurementModal()">
            <div class="card-dark p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold">Nova Medição</h3>
                    <button onclick="closeMeasurementModal()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <form id="measurementForm" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">Peso (kg)</label>
                            <input type="number" step="0.1" id="weight" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="75.5">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Altura (cm)</label>
                            <input type="number" step="0.1" id="height" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="175">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Gordura Corporal (%)</label>
                            <input type="number" step="0.1" id="bodyFat" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="15.5">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">Massa Muscular (kg)</label>
                            <input type="number" step="0.1" id="muscleMass" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="55.0">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Peito (cm)</label>
                            <input type="number" step="0.1" id="chest" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="95">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Cintura (cm)</label>
                            <input type="number" step="0.1" id="waist" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="80">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">Quadril (cm)</label>
                            <input type="number" step="0.1" id="hips" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="95">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Coxa Esquerda (cm)</label>
                            <input type="number" step="0.1" id="thighLeft" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="55">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Coxa Direita (cm)</label>
                            <input type="number" step="0.1" id="thighRight" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="55">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">Panturrilha Esq (cm)</label>
                            <input type="number" step="0.1" id="calfLeft" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="38">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Panturrilha Dir (cm)</label>
                            <input type="number" step="0.1" id="calfRight" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="38">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Bíceps Esquerdo (cm)</label>
                            <input type="number" step="0.1" id="bicepLeft" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="35">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">Bíceps Direito (cm)</label>
                            <input type="number" step="0.1" id="bicepRight" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="35">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Antebraço Esq (cm)</label>
                            <input type="number" step="0.1" id="forearmLeft" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="28">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Antebraço Dir (cm)</label>
                            <input type="number" step="0.1" id="forearmRight" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="28">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">Pescoço (cm)</label>
                            <input type="number" step="0.1" id="neck" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="38">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Ombros (cm)</label>
                            <input type="number" step="0.1" id="shoulders" class="input-dark w-full px-4 py-2 rounded-lg" placeholder="110">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Medido por</label>
                            <select id="measuredBy" class="input-dark w-full px-4 py-2 rounded-lg">
                                <option value="trainer">Personal Trainer</option>
                                <option value="student">Aluno</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold mb-2">Observações</label>
                        <textarea id="measurementNotes" class="input-dark w-full px-4 py-2 rounded-lg" rows="3" placeholder="Adicione observações sobre esta medição..."></textarea>
                    </div>

                    <div class="flex gap-3">
                        <button type="submit" class="btn-neon px-6 py-2 rounded-lg flex-1">
                            <i class="fas fa-save mr-2"></i>
                            Salvar Medição
                        </button>
                        <button type="button" onclick="closeMeasurementModal()" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            const studentId = '${studentId}';
            let studentData = null;
            let photos = [];
            let measurements = [];
            let workouts = [];
            let goals = [];

            // Load token
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/auth/login';
            }

            axios.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;

            // Load all student data
            async function loadStudentData() {
                try {
                    // Load student info
                    const studentRes = await axios.get(\`/api/students/\${studentId}\`);
                    studentData = studentRes.data;
                    
                    document.getElementById('studentName').innerHTML = \`
                        <i class="fas fa-user mr-3"></i>
                        \${studentData.name}
                    \`;
                    document.getElementById('studentEmail').textContent = studentData.email;

                    // Load photos
                    const photosRes = await axios.get(\`/api/students/\${studentId}/photos\`);
                    photos = photosRes.data;

                    // Load measurements
                    const measurementsRes = await axios.get(\`/api/students/\${studentId}/measurements\`);
                    measurements = measurementsRes.data;

                    // Load workouts
                    const workoutsRes = await axios.get(\`/api/students/\${studentId}/workouts\`);
                    workouts = workoutsRes.data;

                    // Load goals
                    const goalsRes = await axios.get(\`/api/students/\${studentId}/goals\`);
                    goals = goalsRes.data;

                    // Render all sections
                    renderStats();
                    renderOverview();
                    renderPhotos();
                    renderMeasurements();
                    renderWorkouts();
                    renderGoals();
                } catch (error) {
                    console.error('Error loading student data:', error);
                    alert('Erro ao carregar dados do aluno');
                }
            }

            function renderStats() {
                const totalWorkouts = workouts.length;
                const totalPhotos = photos.length;
                const totalMeasurements = measurements.length;
                const activeGoals = goals.filter(g => g.status === 'active').length;

                document.getElementById('statsCards').innerHTML = \`
                    <div class="stat-card p-6 rounded-lg">
                        <div class="text-4xl mb-2" style="color: #00FF88;">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <div class="text-3xl font-bold">\${totalWorkouts}</div>
                        <div class="text-gray-400 text-sm">Treinos Realizados</div>
                    </div>
                    <div class="stat-card p-6 rounded-lg">
                        <div class="text-4xl mb-2" style="color: #CCFF00;">
                            <i class="fas fa-images"></i>
                        </div>
                        <div class="text-3xl font-bold">\${totalPhotos}</div>
                        <div class="text-gray-400 text-sm">Fotos de Progresso</div>
                    </div>
                    <div class="stat-card p-6 rounded-lg">
                        <div class="text-4xl mb-2" style="color: #00D4FF;">
                            <i class="fas fa-ruler"></i>
                        </div>
                        <div class="text-3xl font-bold">\${totalMeasurements}</div>
                        <div class="text-gray-400 text-sm">Medições Registradas</div>
                    </div>
                    <div class="stat-card p-6 rounded-lg">
                        <div class="text-4xl mb-2" style="color: #FF6B35;">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <div class="text-3xl font-bold">\${activeGoals}</div>
                        <div class="text-gray-400 text-sm">Metas Ativas</div>
                    </div>
                \`;
            }

            function renderOverview() {
                // Personal Info
                const createdDate = new Date(studentData.created_at * 1000).toLocaleDateString('pt-BR');
                const lastActivity = studentData.last_activity 
                    ? new Date(studentData.last_activity * 1000).toLocaleDateString('pt-BR')
                    : 'Nunca';
                
                document.getElementById('personalInfo').innerHTML = \`
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <span class="text-gray-400">Email:</span>
                        <span>\${studentData.email}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <span class="text-gray-400">Telefone:</span>
                        <span>\${studentData.phone || 'Não informado'}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <span class="text-gray-400">Cadastro:</span>
                        <span>\${createdDate}</span>
                    </div>
                    <div class="flex justify-between py-2">
                        <span class="text-gray-400">Última Atividade:</span>
                        <span>\${lastActivity}</span>
                    </div>
                \`;

                // Latest Measurements
                if (measurements.length > 0) {
                    const latest = measurements[0];
                    const measuredDate = new Date(latest.measured_at * 1000).toLocaleDateString('pt-BR');
                    
                    document.getElementById('latestMeasurements').innerHTML = \`
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span class="text-gray-400">Peso:</span>
                            <span class="font-semibold">\${latest.weight || '-'} kg</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span class="text-gray-400">Gordura Corporal:</span>
                            <span class="font-semibold">\${latest.body_fat_percentage || '-'}%</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span class="text-gray-400">Massa Muscular:</span>
                            <span class="font-semibold">\${latest.muscle_mass || '-'} kg</span>
                        </div>
                        <div class="flex justify-between py-2">
                            <span class="text-gray-400">Data da Medição:</span>
                            <span class="text-sm">\${measuredDate}</span>
                        </div>
                    \`;
                } else {
                    document.getElementById('latestMeasurements').innerHTML = \`
                        <p class="text-gray-400 text-center py-4">Nenhuma medição registrada ainda</p>
                    \`;
                }

                // Active Goals
                const activeGoals = goals.filter(g => g.status === 'active');
                if (activeGoals.length > 0) {
                    document.getElementById('activeGoals').innerHTML = activeGoals.map(goal => {
                        const targetDate = goal.target_date 
                            ? new Date(goal.target_date * 1000).toLocaleDateString('pt-BR')
                            : 'Sem prazo';
                        return \`
                            <div class="p-3 bg-gray-800 rounded-lg">
                                <div class="font-semibold">\${goal.goal_type.replace('_', ' ').toUpperCase()}</div>
                                <div class="text-sm text-gray-400 mt-1">\${goal.description || ''}</div>
                                <div class="text-xs text-gray-500 mt-2">Prazo: \${targetDate}</div>
                            </div>
                        \`;
                    }).join('');
                } else {
                    document.getElementById('activeGoals').innerHTML = \`
                        <p class="text-gray-400 text-center py-4">Nenhuma meta ativa</p>
                    \`;
                }

                // Recent Photos
                const recentPhotos = photos.slice(0, 4);
                if (recentPhotos.length > 0) {
                    document.getElementById('recentPhotos').innerHTML = recentPhotos.map(photo => \`
                        <div class="photo-card" onclick="viewPhoto('\${photo.photo_url}')">
                            <img src="\${photo.photo_url}" alt="\${photo.description || 'Foto de progresso'}">
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                <div class="text-xs text-white">\${photo.photo_type}</div>
                            </div>
                        </div>
                    \`).join('');
                } else {
                    document.getElementById('recentPhotos').innerHTML = \`
                        <p class="text-gray-400 text-center py-4 col-span-full">Nenhuma foto ainda</p>
                    \`;
                }
            }

            function renderPhotos() {
                const gallery = document.getElementById('photoGallery');
                if (photos.length === 0) {
                    gallery.innerHTML = '<p class="text-gray-400 text-center py-8">Nenhuma foto registrada ainda</p>';
                    return;
                }

                gallery.innerHTML = photos.map(photo => {
                    const date = new Date(photo.taken_at * 1000).toLocaleDateString('pt-BR');
                    return \`
                        <div class="photo-card" onclick="viewPhoto('\${photo.photo_url}')">
                            <img src="\${photo.photo_url}" alt="\${photo.description || 'Foto de progresso'}">
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                                <div class="text-xs font-semibold text-white">\${photo.photo_type}</div>
                                <div class="text-xs text-gray-300">\${date}</div>
                                \${photo.description ? \`<div class="text-xs text-gray-400 mt-1">\${photo.description}</div>\` : ''}
                            </div>
                        </div>
                    \`;
                }).join('');
            }

            function renderMeasurements() {
                if (measurements.length === 0) {
                    document.getElementById('weightChart').parentElement.innerHTML += '<p class="text-gray-400 text-center">Sem dados</p>';
                    document.getElementById('bodyFatChart').parentElement.innerHTML += '<p class="text-gray-400 text-center">Sem dados</p>';
                    document.getElementById('measurementsTable').innerHTML = '<p class="text-gray-400 text-center py-4">Nenhuma medição registrada</p>';
                    return;
                }

                // Weight Chart
                const weightData = measurements.map(m => ({
                    x: new Date(m.measured_at * 1000),
                    y: m.weight
                })).filter(d => d.y).reverse();

                new Chart(document.getElementById('weightChart'), {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Peso (kg)',
                            data: weightData,
                            borderColor: '#CCFF00',
                            backgroundColor: 'rgba(204, 255, 0, 0.1)',
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

                // Body Fat Chart
                const bodyFatData = measurements.map(m => ({
                    x: new Date(m.measured_at * 1000),
                    y: m.body_fat_percentage
                })).filter(d => d.y).reverse();

                new Chart(document.getElementById('bodyFatChart'), {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Gordura Corporal (%)',
                            data: bodyFatData,
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

                // Measurements Table
                document.getElementById('measurementsTable').innerHTML = \`
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-gray-700">
                                <th class="text-left py-3">Data</th>
                                <th class="text-right py-3">Peso</th>
                                <th class="text-right py-3">Gordura</th>
                                <th class="text-right py-3">Músculo</th>
                                <th class="text-right py-3">IMC</th>
                                <th class="text-right py-3">Medido por</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${measurements.map(m => {
                                const date = new Date(m.measured_at * 1000).toLocaleDateString('pt-BR');
                                return \`
                                    <tr class="border-b border-gray-800 hover:bg-gray-800">
                                        <td class="py-3">\${date}</td>
                                        <td class="text-right">\${m.weight || '-'} kg</td>
                                        <td class="text-right">\${m.body_fat_percentage || '-'}%</td>
                                        <td class="text-right">\${m.muscle_mass || '-'} kg</td>
                                        <td class="text-right">\${m.bmi ? m.bmi.toFixed(1) : '-'}</td>
                                        <td class="text-right">\${m.measured_by === 'trainer' ? 'Personal' : 'Aluno'}</td>
                                    </tr>
                                \`;
                            }).join('')}
                        </tbody>
                    </table>
                \`;
            }

            function renderWorkouts() {
                const list = document.getElementById('workoutsList');
                if (workouts.length === 0) {
                    list.innerHTML = '<p class="text-gray-400 text-center py-8">Nenhum treino registrado ainda</p>';
                    return;
                }

                list.innerHTML = workouts.map(workout => {
                    const date = new Date(workout.created_at * 1000).toLocaleDateString('pt-BR');
                    return \`
                        <div class="card-dark p-4 rounded-lg mb-4">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-bold text-lg">\${workout.title}</h4>
                                    <p class="text-gray-400 text-sm mt-1">\${workout.description || ''}</p>
                                    <div class="flex gap-4 mt-3 text-sm">
                                        <span class="text-gray-500">
                                            <i class="fas fa-calendar mr-1"></i>
                                            \${date}
                                        </span>
                                        <span class="text-gray-500">
                                            <i class="fas fa-list mr-1"></i>
                                            \${workout.exercises ? JSON.parse(workout.exercises).length : 0} exercícios
                                        </span>
                                    </div>
                                </div>
                                <span class="px-3 py-1 bg-green-600 rounded text-xs">Concluído</span>
                            </div>
                        </div>
                    \`;
                }).join('');
            }

            function renderGoals() {
                const list = document.getElementById('goalsList');
                if (goals.length === 0) {
                    list.innerHTML = '<p class="text-gray-400 text-center py-8">Nenhuma meta definida ainda</p>';
                    return;
                }

                list.innerHTML = goals.map(goal => {
                    const createdDate = new Date(goal.created_at * 1000).toLocaleDateString('pt-BR');
                    const targetDate = goal.target_date 
                        ? new Date(goal.target_date * 1000).toLocaleDateString('pt-BR')
                        : 'Sem prazo';
                    
                    const statusColors = {
                        active: 'bg-green-600',
                        completed: 'bg-blue-600',
                        cancelled: 'bg-red-600'
                    };

                    return \`
                        <div class="card-dark p-6 rounded-lg mb-4">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h4 class="font-bold text-lg">\${goal.goal_type.replace('_', ' ').toUpperCase()}</h4>
                                    <p class="text-gray-400 mt-2">\${goal.description || ''}</p>
                                </div>
                                <span class="px-3 py-1 \${statusColors[goal.status]} rounded text-xs">
                                    \${goal.status === 'active' ? 'Ativa' : goal.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                </span>
                            </div>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                \${goal.target_weight ? \`
                                    <div class="flex justify-between py-2 border-t border-gray-700">
                                        <span class="text-gray-400">Peso Alvo:</span>
                                        <span>\${goal.target_weight} kg</span>
                                    </div>
                                \` : ''}
                                \${goal.target_body_fat ? \`
                                    <div class="flex justify-between py-2 border-t border-gray-700">
                                        <span class="text-gray-400">BF Alvo:</span>
                                        <span>\${goal.target_body_fat}%</span>
                                    </div>
                                \` : ''}
                                <div class="flex justify-between py-2 border-t border-gray-700">
                                    <span class="text-gray-400">Criada em:</span>
                                    <span>\${createdDate}</span>
                                </div>
                                <div class="flex justify-between py-2 border-t border-gray-700">
                                    <span class="text-gray-400">Prazo:</span>
                                    <span>\${targetDate}</span>
                                </div>
                            </div>
                        </div>
                    \`;
                }).join('');
            }

            // Tab Switching
            function switchTab(tab) {
                // Hide all tabs
                document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
                document.querySelectorAll('[id^="tab-"]').forEach(el => {
                    el.classList.remove('tab-active');
                    el.classList.add('tab-inactive');
                });

                // Show selected tab
                document.getElementById(\`content-\${tab}\`).classList.remove('hidden');
                document.getElementById(\`tab-\${tab}\`).classList.add('tab-active');
                document.getElementById(\`tab-\${tab}\`).classList.remove('tab-inactive');
            }

            // Modal Functions
            function openAddPhotoModal() {
                document.getElementById('photoModal').classList.remove('hidden');
            }

            function closePhotoModal() {
                document.getElementById('photoModal').classList.add('hidden');
                document.getElementById('photoForm').reset();
            }

            function openAddMeasurementModal() {
                document.getElementById('measurementModal').classList.remove('hidden');
            }

            function closeMeasurementModal() {
                document.getElementById('measurementModal').classList.add('hidden');
                document.getElementById('measurementForm').reset();
            }

            function openAddGoalModal() {
                alert('Funcionalidade de adicionar meta será implementada em breve');
            }

            function viewPhoto(url) {
                window.open(url, '_blank');
            }

            function filterPhotos() {
                const filter = document.getElementById('photoFilter').value;
                const filtered = filter === 'all' ? photos : photos.filter(p => p.photo_type === filter);
                
                const gallery = document.getElementById('photoGallery');
                if (filtered.length === 0) {
                    gallery.innerHTML = '<p class="text-gray-400 text-center py-8">Nenhuma foto encontrada</p>';
                    return;
                }

                gallery.innerHTML = filtered.map(photo => {
                    const date = new Date(photo.taken_at * 1000).toLocaleDateString('pt-BR');
                    return \`
                        <div class="photo-card" onclick="viewPhoto('\${photo.photo_url}')">
                            <img src="\${photo.photo_url}" alt="\${photo.description || 'Foto de progresso'}">
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                                <div class="text-xs font-semibold text-white">\${photo.photo_type}</div>
                                <div class="text-xs text-gray-300">\${date}</div>
                            </div>
                        </div>
                    \`;
                }).join('');
            }

            // Form Submissions
            document.getElementById('photoForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const photoData = {
                    photo_url: document.getElementById('photoUrl').value,
                    photo_type: document.getElementById('photoType').value,
                    description: document.getElementById('photoDescription').value,
                    tags: document.getElementById('photoTags').value.split(',').map(t => t.trim()).filter(t => t)
                };

                try {
                    await axios.post(\`/api/students/\${studentId}/photos\`, photoData);
                    alert('Foto adicionada com sucesso!');
                    closePhotoModal();
                    loadStudentData();
                } catch (error) {
                    console.error('Error adding photo:', error);
                    alert('Erro ao adicionar foto');
                }
            });

            document.getElementById('measurementForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const measurementData = {
                    weight: parseFloat(document.getElementById('weight').value) || null,
                    height: parseFloat(document.getElementById('height').value) || null,
                    body_fat_percentage: parseFloat(document.getElementById('bodyFat').value) || null,
                    muscle_mass: parseFloat(document.getElementById('muscleMass').value) || null,
                    chest: parseFloat(document.getElementById('chest').value) || null,
                    waist: parseFloat(document.getElementById('waist').value) || null,
                    hips: parseFloat(document.getElementById('hips').value) || null,
                    thigh_left: parseFloat(document.getElementById('thighLeft').value) || null,
                    thigh_right: parseFloat(document.getElementById('thighRight').value) || null,
                    calf_left: parseFloat(document.getElementById('calfLeft').value) || null,
                    calf_right: parseFloat(document.getElementById('calfRight').value) || null,
                    bicep_left: parseFloat(document.getElementById('bicepLeft').value) || null,
                    bicep_right: parseFloat(document.getElementById('bicepRight').value) || null,
                    forearm_left: parseFloat(document.getElementById('forearmLeft').value) || null,
                    forearm_right: parseFloat(document.getElementById('forearmRight').value) || null,
                    neck: parseFloat(document.getElementById('neck').value) || null,
                    shoulders: parseFloat(document.getElementById('shoulders').value) || null,
                    measured_by: document.getElementById('measuredBy').value,
                    notes: document.getElementById('measurementNotes').value
                };

                // Calculate BMI if weight and height are provided
                if (measurementData.weight && measurementData.height) {
                    const heightInMeters = measurementData.height / 100;
                    measurementData.bmi = measurementData.weight / (heightInMeters * heightInMeters);
                }

                try {
                    await axios.post(\`/api/students/\${studentId}/measurements\`, measurementData);
                    alert('Medição registrada com sucesso!');
                    closeMeasurementModal();
                    loadStudentData();
                } catch (error) {
                    console.error('Error adding measurement:', error);
                    alert('Erro ao registrar medição');
                }
            });

            function logout() {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
            }

            // Initialize
            loadStudentData();
        </script>
    </body>
    </html>
  `)
})
