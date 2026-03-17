import { Hono } from 'hono'

export const studentRoutes = new Hono()

// Student WebApp - Workout Player
studentRoutes.get('/app', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meu Treino - FitFlow</title>
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
            .exercise-completed {
                opacity: 0.5;
                border-color: #00FF88;
            }
            #cameraPreview {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                z-index: 100;
                display: none;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
            #cameraPreview.active {
                display: flex;
            }
            #videoElement {
                max-width: 90%;
                max-height: 70vh;
                border-radius: 12px;
            }
            .camera-controls {
                margin-top: 2rem;
                display: flex;
                gap: 1rem;
            }
        </style>
    </head>
    <body>
        <!-- Header -->
        <header class="card-dark border-b border-gray-800 px-4 py-3 sticky top-0 z-10">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <i class="fas fa-dumbbell text-2xl mr-3" style="color: #CCFF00;"></i>
                    <div>
                        <h1 class="font-bold text-lg">Meu Treino</h1>
                        <p class="text-xs text-gray-400" id="workoutTitle">Carregando...</p>
                    </div>
                </div>
                <button onclick="showMenu()" class="text-gray-400 hover:text-white">
                    <i class="fas fa-ellipsis-v text-xl"></i>
                </button>
            </div>
        </header>

        <!-- Main Content -->
        <main class="p-4 pb-24">
            <div id="exercisesList" class="space-y-4">
                <!-- Exercises will be loaded here -->
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="text-center py-12">
                <i class="fas fa-dumbbell text-6xl text-gray-700 mb-4"></i>
                <p class="text-gray-400">Nenhum treino ativo no momento</p>
            </div>
        </main>

        <!-- Floating Action Button - Vision Scanner -->
        <button onclick="openCamera()" class="fixed bottom-20 right-4 w-16 h-16 rounded-full btn-neon flex items-center justify-center shadow-lg z-20">
            <i class="fas fa-camera text-2xl"></i>
        </button>

        <!-- Bottom Navigation -->
        <nav class="fixed bottom-0 left-0 right-0 card-dark border-t border-gray-800 z-10">
            <div class="flex items-center justify-around py-3">
                <a href="/student/app" class="flex flex-col items-center text-white">
                    <i class="fas fa-home text-xl mb-1"></i>
                    <span class="text-xs">Treino</span>
                </a>
                <a href="/student/progress" class="flex flex-col items-center text-gray-400 hover:text-white">
                    <i class="fas fa-chart-line text-xl mb-1"></i>
                    <span class="text-xs">Progresso</span>
                </a>
                <a href="/student/profile" class="flex flex-col items-center text-gray-400 hover:text-white">
                    <i class="fas fa-user text-xl mb-1"></i>
                    <span class="text-xs">Perfil</span>
                </a>
            </div>
        </nav>

        <!-- Camera Preview -->
        <div id="cameraPreview">
            <video id="videoElement" autoplay playsinline></video>
            <div class="camera-controls">
                <button onclick="capturePhoto()" class="btn-neon px-8 py-4 rounded-full">
                    <i class="fas fa-camera text-2xl"></i>
                </button>
                <button onclick="closeCamera()" class="bg-red-600 hover:bg-red-700 px-6 py-4 rounded-full transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <canvas id="canvas" style="display:none;"></canvas>
        </div>

        <!-- Vision Result Modal -->
        <div id="visionModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/90 backdrop-blur-sm">
            <div class="card-dark p-6 rounded-2xl max-w-md mx-4 w-full">
                <div class="text-center mb-4">
                    <div id="visionLoading" class="hidden">
                        <div class="inline-block w-12 h-12 border-4 border-gray-700 border-t-[#CCFF00] rounded-full animate-spin mb-4"></div>
                        <p class="text-gray-400">Identificando equipamento...</p>
                    </div>
                    <div id="visionResult" class="hidden">
                        <i class="fas fa-check-circle text-6xl mb-4" style="color: #CCFF00;"></i>
                        <h3 class="text-2xl font-bold mb-2" id="equipmentName">-</h3>
                        <p class="text-gray-400 mb-4" id="muscleGroups">-</p>
                        <a id="videoLink" href="#" target="_blank" class="btn-neon inline-block px-6 py-3 rounded-lg mb-4">
                            <i class="fas fa-play mr-2"></i>Ver Vídeo Tutorial
                        </a>
                    </div>
                </div>
                <button onclick="closeVisionModal()" class="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition">
                    Fechar
                </button>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // Demo workout data
            const demoWorkout = {
                title: "Treino A - Peito e Tríceps",
                exercises: [
                    {
                        name: "Supino Reto",
                        sets: 4,
                        reps: "8-12",
                        rest: 90,
                        notes: "Manter costas apoiadas no banco",
                        completed: false
                    },
                    {
                        name: "Supino Inclinado",
                        sets: 3,
                        reps: "10-12",
                        rest: 60,
                        notes: "Ângulo de 45 graus",
                        completed: false
                    },
                    {
                        name: "Crucifixo na Polia",
                        sets: 3,
                        reps: "12-15",
                        rest: 60,
                        notes: "Movimento controlado",
                        completed: false
                    },
                    {
                        name: "Tríceps Testa",
                        sets: 3,
                        reps: "10-12",
                        rest: 60,
                        notes: "Cotovelos fixos",
                        completed: false
                    }
                ]
            };

            function loadWorkout() {
                document.getElementById('workoutTitle').textContent = demoWorkout.title;
                document.getElementById('emptyState').style.display = 'none';

                const exercisesHtml = demoWorkout.exercises.map((ex, idx) => \`
                    <div class="card-dark p-4 rounded-xl \${ex.completed ? 'exercise-completed' : ''}" id="exercise-\${idx}">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <h3 class="font-bold text-lg mb-1">\${ex.name}</h3>
                                <div class="flex items-center gap-4 text-sm text-gray-400">
                                    <span><i class="fas fa-layer-group mr-1"></i>\${ex.sets}x</span>
                                    <span><i class="fas fa-repeat mr-1"></i>\${ex.reps}</span>
                                    <span><i class="fas fa-clock mr-1"></i>\${ex.rest}s</span>
                                </div>
                            </div>
                            <button onclick="toggleExercise(\${idx})" class="w-10 h-10 rounded-full \${ex.completed ? 'bg-green-600' : 'bg-gray-700'} flex items-center justify-center">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                        \${ex.notes ? \`<p class="text-sm text-gray-400 mb-3">
                            <i class="fas fa-info-circle mr-1"></i>\${ex.notes}
                        </p>\` : ''}
                        <button onclick="openCamera()" class="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm transition">
                            <i class="fas fa-camera mr-2"></i>Escanear Equipamento
                        </button>
                    </div>
                \`).join('');

                document.getElementById('exercisesList').innerHTML = exercisesHtml;
            }

            function toggleExercise(idx) {
                demoWorkout.exercises[idx].completed = !demoWorkout.exercises[idx].completed;
                loadWorkout();
            }

            let stream = null;

            async function openCamera() {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'environment' } 
                    });
                    document.getElementById('videoElement').srcObject = stream;
                    document.getElementById('cameraPreview').classList.add('active');
                } catch (error) {
                    alert('Erro ao acessar câmera: ' + error.message);
                }
            }

            function closeCamera() {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                document.getElementById('cameraPreview').classList.remove('active');
            }

            async function capturePhoto() {
                const video = document.getElementById('videoElement');
                const canvas = document.getElementById('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);
                
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                const base64 = imageData.split(',')[1];
                
                closeCamera();
                identifyEquipment(base64);
            }

            async function identifyEquipment(imageBase64) {
                document.getElementById('visionModal').classList.remove('hidden');
                document.getElementById('visionModal').classList.add('flex');
                document.getElementById('visionLoading').classList.remove('hidden');
                document.getElementById('visionResult').classList.add('hidden');

                try {
                    // For demo, simulate API call
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Demo result
                    const result = {
                        equipment: {
                            name: "Supino Reto com Barra",
                            muscleGroups: "Peitoral Maior, Tríceps, Deltoides Anterior",
                            videoUrl: "https://youtube.com/results?search_query=como+usar+supino+reto+execução+correta"
                        }
                    };

                    document.getElementById('visionLoading').classList.add('hidden');
                    document.getElementById('visionResult').classList.remove('hidden');
                    document.getElementById('equipmentName').textContent = result.equipment.name;
                    document.getElementById('muscleGroups').textContent = result.equipment.muscleGroups;
                    document.getElementById('videoLink').href = result.equipment.videoUrl;

                } catch (error) {
                    alert('Erro ao identificar equipamento: ' + error.message);
                    closeVisionModal();
                }
            }

            function closeVisionModal() {
                document.getElementById('visionModal').classList.add('hidden');
                document.getElementById('visionModal').classList.remove('flex');
            }

            function showMenu() {
                alert('Menu em desenvolvimento!');
            }

            // Load workout on page load
            loadWorkout();
        </script>
    </body>
    </html>
  `)
})

// Student Progress Page
studentRoutes.get('/progress', (c) => {
  return c.html('<h1>Progress Tracking - Coming soon</h1>')
})

// Student Profile Page
studentRoutes.get('/profile', (c) => {
  return c.html('<h1>Student Profile - Coming soon</h1>')
})
