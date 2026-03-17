import { Hono } from 'hono'

export const workoutsRoute = new Hono()

// Workouts Page - Lista de treinos salvos
workoutsRoute.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Treinos Salvos - ForteTrain</title>
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
            .workout-card {
                background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
                border: 1px solid #333;
                transition: all 0.3s;
            }
            .workout-card:hover {
                border-color: #CCFF00;
                transform: translateY(-2px);
            }
            .badge-active {
                background: #00FF88;
                color: #0D0D0D;
            }
            .badge-inactive {
                background: #333;
                color: #999;
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
                        <a href="/dashboard/workouts" class="flex items-center px-4 py-3 rounded-lg bg-gray-800 text-white">
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
                                <i class="fas fa-dumbbell mr-2" style="color: #CCFF00;"></i>
                                Treinos Salvos
                            </h1>
                            <p class="text-gray-400 text-sm">Gerencie todos os treinos criados</p>
                        </div>
                        <button onclick="window.location.href='/dashboard/ai-generator'" class="btn-neon px-6 py-3 rounded-lg">
                            <i class="fas fa-plus-circle mr-2"></i>Novo Treino
                        </button>
                    </div>
                </header>

                <div class="p-8">
                    <!-- Filters -->
                    <div class="flex gap-4 mb-6">
                        <input type="text" id="searchWorkout" placeholder="Buscar treino..." class="flex-1 bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-lime-400" />
                        
                        <select id="filterStudent" class="bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-lime-400">
                            <option value="">Todos os Alunos</option>
                        </select>

                        <select id="filterStatus" class="bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-lime-400">
                            <option value="">Todos os Status</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </div>

                    <!-- Workouts Grid -->
                    <div id="workoutsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Loading placeholder -->
                        <div class="col-span-full text-center py-12">
                            <i class="fas fa-spinner fa-spin text-4xl text-lime-400 mb-4"></i>
                            <p class="text-gray-400">Carregando treinos...</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Modal de Visualização -->
        <div id="viewModal" class="fixed inset-0 bg-black bg-opacity-75 hidden items-center justify-center z-50">
            <div class="card-dark rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h2 id="modalTitle" class="text-2xl font-bold" style="color: #CCFF00;">Detalhes do Treino</h2>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-white text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div id="modalContent" class="space-y-4">
                    <!-- Content will be loaded here -->
                </div>

                <div class="flex gap-4 mt-8">
                    <button onclick="editWorkout()" class="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition">
                        <i class="fas fa-edit mr-2"></i>Editar
                    </button>
                    <button onclick="duplicateWorkout()" class="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition">
                        <i class="fas fa-copy mr-2"></i>Duplicar
                    </button>
                    <button onclick="deleteWorkout()" class="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold transition">
                        <i class="fas fa-trash mr-2"></i>Excluir
                    </button>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            const token = localStorage.getItem('fortetrain_token');
            if (!token) {
                window.location.href = '/auth/login';
            }

            let workouts = [];
            let students = [];
            let currentWorkoutId = null;

            // Load data on page load
            async function loadData() {
                try {
                    // Load students for filter
                    const studentsRes = await axios.get('/api/students', {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    students = studentsRes.data;
                    
                    // Populate student filter
                    const filterSelect = document.getElementById('filterStudent');
                    students.forEach(student => {
                        const option = document.createElement('option');
                        option.value = student.id;
                        option.textContent = student.full_name;
                        filterSelect.appendChild(option);
                    });

                    // Load workouts
                    const workoutsRes = await axios.get('/api/workouts', {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    workouts = workoutsRes.data;
                    
                    renderWorkouts();
                } catch (error) {
                    console.error('Error loading data:', error);
                    alert('Erro ao carregar dados. Tente novamente.');
                }
            }

            function renderWorkouts(filter = {}) {
                const grid = document.getElementById('workoutsGrid');
                
                // Apply filters
                let filtered = workouts;
                
                if (filter.search) {
                    const search = filter.search.toLowerCase();
                    filtered = filtered.filter(w => 
                        w.title.toLowerCase().includes(search) || 
                        w.description?.toLowerCase().includes(search)
                    );
                }
                
                if (filter.student) {
                    filtered = filtered.filter(w => w.student_id === filter.student);
                }
                
                if (filter.status === 'active') {
                    filtered = filtered.filter(w => w.is_active);
                } else if (filter.status === 'inactive') {
                    filtered = filtered.filter(w => !w.is_active);
                }

                if (filtered.length === 0) {
                    grid.innerHTML = \`
                        <div class="col-span-full text-center py-12">
                            <i class="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                            <p class="text-gray-400 text-lg">Nenhum treino encontrado</p>
                            <button onclick="window.location.href='/dashboard/ai-generator'" class="btn-neon px-6 py-3 rounded-lg mt-6">
                                <i class="fas fa-plus-circle mr-2"></i>Criar Primeiro Treino
                            </button>
                        </div>
                    \`;
                    return;
                }

                grid.innerHTML = filtered.map(workout => {
                    const student = students.find(s => s.id === workout.student_id);
                    const studentName = student ? student.full_name : 'Aluno não encontrado';
                    const exercises = JSON.parse(workout.exercises || '[]');
                    const createdAt = new Date(workout.created_at).toLocaleDateString('pt-BR');
                    
                    return \`
                        <div class="workout-card rounded-xl p-6 cursor-pointer" onclick="viewWorkout('\${workout.id}')">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex-1">
                                    <h3 class="font-bold text-lg mb-1">\${workout.title}</h3>
                                    <p class="text-sm text-gray-400">\${studentName}</p>
                                </div>
                                <span class="\${workout.is_active ? 'badge-active' : 'badge-inactive'} px-3 py-1 text-xs font-bold rounded-full">
                                    \${workout.is_active ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                            
                            <p class="text-gray-400 text-sm mb-4 line-clamp-2">\${workout.description || 'Sem descrição'}</p>
                            
                            <div class="flex items-center justify-between text-sm">
                                <div class="flex items-center gap-4">
                                    <span class="text-gray-500">
                                        <i class="fas fa-dumbbell mr-1" style="color: #CCFF00;"></i>
                                        \${exercises.length} exercícios
                                    </span>
                                    <span class="text-gray-500">
                                        <i class="fas fa-calendar mr-1"></i>
                                        \${createdAt}
                                    </span>
                                </div>
                            </div>
                            
                            \${workout.ai_logic_used ? \`
                                <div class="mt-4 pt-4 border-t border-gray-800">
                                    <span class="text-xs text-lime-400">
                                        <i class="fas fa-brain mr-1"></i>Gerado por IA
                                    </span>
                                </div>
                            \` : ''}
                        </div>
                    \`;
                }).join('');
            }

            function viewWorkout(workoutId) {
                currentWorkoutId = workoutId;
                const workout = workouts.find(w => w.id === workoutId);
                if (!workout) return;

                const student = students.find(s => s.id === workout.student_id);
                const exercises = JSON.parse(workout.exercises || '[]');

                document.getElementById('modalTitle').textContent = workout.title;
                document.getElementById('modalContent').innerHTML = \`
                    <div class="bg-black/30 p-4 rounded-lg mb-4">
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-gray-400">Aluno:</span>
                                <span class="font-bold ml-2">\${student ? student.full_name : 'N/A'}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">Status:</span>
                                <span class="font-bold ml-2 \${workout.is_active ? 'text-green-400' : 'text-gray-500'}">\${workout.is_active ? 'Ativo' : 'Inativo'}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">Criado em:</span>
                                <span class="font-bold ml-2">\${new Date(workout.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">Exercícios:</span>
                                <span class="font-bold ml-2">\${exercises.length}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h3 class="font-bold text-lg mb-2">Descrição</h3>
                        <p class="text-gray-400">\${workout.description || 'Sem descrição'}</p>
                    </div>

                    <div>
                        <h3 class="font-bold text-lg mb-4">Exercícios</h3>
                        <div class="space-y-3">
                            \${exercises.map((ex, idx) => \`
                                <div class="bg-black/30 p-4 rounded-lg">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-2 mb-2">
                                                <span class="bg-lime-400 text-black font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">\${idx + 1}</span>
                                                <h4 class="font-bold">\${ex.name || ex.exercise}</h4>
                                            </div>
                                            <div class="text-sm text-gray-400 space-y-1">
                                                \${ex.sets ? \`<div><i class="fas fa-repeat mr-2"></i>\${ex.sets} séries</div>\` : ''}
                                                \${ex.reps ? \`<div><i class="fas fa-hashtag mr-2"></i>\${ex.reps} repetições</div>\` : ''}
                                                \${ex.rest ? \`<div><i class="fas fa-clock mr-2"></i>\${ex.rest} descanso</div>\` : ''}
                                                \${ex.notes ? \`<div class="mt-2 text-gray-500"><i class="fas fa-comment mr-2"></i>\${ex.notes}</div>\` : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>

                    \${workout.ai_logic_used ? \`
                        <div class="mt-6 bg-lime-900/20 border border-lime-700/30 p-4 rounded-lg">
                            <div class="flex items-center gap-2 mb-2">
                                <i class="fas fa-brain" style="color: #CCFF00;"></i>
                                <span class="font-bold">Lógica da IA</span>
                            </div>
                            <p class="text-sm text-gray-400">\${workout.ai_logic_used}</p>
                        </div>
                    \` : ''}
                \`;

                document.getElementById('viewModal').classList.remove('hidden');
                document.getElementById('viewModal').classList.add('flex');
            }

            function closeModal() {
                document.getElementById('viewModal').classList.add('hidden');
                document.getElementById('viewModal').classList.remove('flex');
                currentWorkoutId = null;
            }

            function editWorkout() {
                alert('Funcionalidade de edição será implementada em breve!');
            }

            async function duplicateWorkout() {
                if (!currentWorkoutId) return;
                
                if (!confirm('Deseja duplicar este treino?')) return;
                
                try {
                    const workout = workouts.find(w => w.id === currentWorkoutId);
                    const duplicated = {
                        ...workout,
                        title: workout.title + ' (Cópia)',
                        created_at: new Date().toISOString()
                    };
                    delete duplicated.id;

                    await axios.post('/api/workouts', duplicated, {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });

                    alert('Treino duplicado com sucesso!');
                    closeModal();
                    loadData();
                } catch (error) {
                    console.error('Error duplicating workout:', error);
                    alert('Erro ao duplicar treino. Tente novamente.');
                }
            }

            async function deleteWorkout() {
                if (!currentWorkoutId) return;
                
                if (!confirm('Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita.')) return;
                
                try {
                    await axios.delete(\`/api/workouts/\${currentWorkoutId}\`, {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });

                    alert('Treino excluído com sucesso!');
                    closeModal();
                    loadData();
                } catch (error) {
                    console.error('Error deleting workout:', error);
                    alert('Erro ao excluir treino. Tente novamente.');
                }
            }

            // Filters
            document.getElementById('searchWorkout').addEventListener('input', (e) => {
                renderWorkouts({
                    search: e.target.value,
                    student: document.getElementById('filterStudent').value,
                    status: document.getElementById('filterStatus').value
                });
            });

            document.getElementById('filterStudent').addEventListener('change', (e) => {
                renderWorkouts({
                    search: document.getElementById('searchWorkout').value,
                    student: e.target.value,
                    status: document.getElementById('filterStatus').value
                });
            });

            document.getElementById('filterStatus').addEventListener('change', (e) => {
                renderWorkouts({
                    search: document.getElementById('searchWorkout').value,
                    student: document.getElementById('filterStudent').value,
                    status: e.target.value
                });
            });

            // Load data on page load
            loadData();
        </script>
    </body>
    </html>
  `)
})
