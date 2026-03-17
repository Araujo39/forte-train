import { Hono } from 'hono'

export const analyticsRoute = new Hono()

// Analytics Page with Charts
analyticsRoute.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Analytics - ForteTrain</title>
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
                        <a href="/dashboard/analytics" class="flex items-center px-4 py-3 rounded-lg bg-gray-800 text-white">
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
                                <i class="fas fa-chart-line mr-2" style="color: #CCFF00;"></i>
                                Analytics & Performance
                            </h1>
                            <p class="text-gray-400 text-sm">Análise detalhada de desempenho e evolução</p>
                        </div>
                        <div class="flex gap-2">
                            <select id="periodFilter" class="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700">
                                <option value="7">Últimos 7 dias</option>
                                <option value="30" selected>Últimos 30 dias</option>
                                <option value="90">Últimos 90 dias</option>
                            </select>
                        </div>
                    </div>
                </header>

                <div class="p-8">
                    <!-- Overview Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div class="card-dark p-6 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-400">Taxa de Retenção</span>
                                <i class="fas fa-user-check text-2xl text-green-400"></i>
                            </div>
                            <div class="text-3xl font-bold" style="color: #00FF88;">87%</div>
                            <div class="text-sm text-gray-500 mt-1">+12% vs mês anterior</div>
                        </div>

                        <div class="card-dark p-6 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-400">Média de Treinos</span>
                                <i class="fas fa-dumbbell text-2xl" style="color: #CCFF00;"></i>
                            </div>
                            <div class="text-3xl font-bold">4.2</div>
                            <div class="text-sm text-gray-500 mt-1">por semana/aluno</div>
                        </div>

                        <div class="card-dark p-6 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-400">Uso de IA</span>
                                <i class="fas fa-brain text-2xl text-purple-400"></i>
                            </div>
                            <div class="text-3xl font-bold">156</div>
                            <div class="text-sm text-gray-500 mt-1">gerações este mês</div>
                        </div>

                        <div class="card-dark p-6 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-400">Satisfação</span>
                                <i class="fas fa-star text-2xl text-yellow-400"></i>
                            </div>
                            <div class="text-3xl font-bold">4.8</div>
                            <div class="text-sm text-gray-500 mt-1">de 5 estrelas</div>
                        </div>
                    </div>

                    <!-- Charts Row 1 -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <!-- Atividade de Treinos -->
                        <div class="card-dark p-6 rounded-xl">
                            <h3 class="text-xl font-bold mb-4">
                                <i class="fas fa-chart-bar mr-2" style="color: #CCFF00;"></i>
                                Atividade de Treinos
                            </h3>
                            <canvas id="workoutActivityChart" height="300"></canvas>
                        </div>

                        <!-- Evolução de Alunos Ativos -->
                        <div class="card-dark p-6 rounded-xl">
                            <h3 class="text-xl font-bold mb-4">
                                <i class="fas fa-users mr-2" style="color: #CCFF00;"></i>
                                Alunos Ativos
                            </h3>
                            <canvas id="activeStudentsChart" height="300"></canvas>
                        </div>
                    </div>

                    <!-- Charts Row 2 -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <!-- Distribuição por Objetivo -->
                        <div class="card-dark p-6 rounded-xl">
                            <h3 class="text-xl font-bold mb-4">
                                <i class="fas fa-bullseye mr-2" style="color: #CCFF00;"></i>
                                Distribuição por Objetivo
                            </h3>
                            <canvas id="goalsChart" height="300"></canvas>
                        </div>

                        <!-- Taxa de Inatividade -->
                        <div class="card-dark p-6 rounded-xl">
                            <h3 class="text-xl font-bold mb-4">
                                <i class="fas fa-exclamation-triangle mr-2 text-red-400"></i>
                                Taxa de Inatividade
                            </h3>
                            <canvas id="inactivityChart" height="300"></canvas>
                        </div>
                    </div>

                    <!-- Top Performers -->
                    <div class="card-dark p-6 rounded-xl">
                        <h3 class="text-xl font-bold mb-6">
                            <i class="fas fa-trophy mr-2" style="color: #CCFF00;"></i>
                            Top Performers do Mês
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-black/30 p-4 rounded-lg border-l-4" style="border-color: #CCFF00;">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-2xl">🥇</span>
                                    <span class="text-sm text-gray-400">1º Lugar</span>
                                </div>
                                <div class="font-bold text-lg">João Santos</div>
                                <div class="text-sm text-gray-400">18 treinos realizados</div>
                            </div>
                            <div class="bg-black/30 p-4 rounded-lg border-l-4 border-gray-500">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-2xl">🥈</span>
                                    <span class="text-sm text-gray-400">2º Lugar</span>
                                </div>
                                <div class="font-bold text-lg">Maria Oliveira</div>
                                <div class="text-sm text-gray-400">15 treinos realizados</div>
                            </div>
                            <div class="bg-black/30 p-4 rounded-lg border-l-4 border-orange-600">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-2xl">🥉</span>
                                    <span class="text-sm text-gray-400">3º Lugar</span>
                                </div>
                                <div class="font-bold text-lg">Carlos Pereira</div>
                                <div class="text-sm text-gray-400">12 treinos realizados</div>
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

            // Chart.js default colors
            Chart.defaults.color = '#A0A0A0';
            Chart.defaults.borderColor = '#333';

            // 1. Workout Activity Chart (Bar)
            const workoutActivityCtx = document.getElementById('workoutActivityChart').getContext('2d');
            new Chart(workoutActivityCtx, {
                type: 'bar',
                data: {
                    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Treinos Realizados',
                        data: [12, 15, 18, 14, 20, 8, 5],
                        backgroundColor: '#CCFF00',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#333'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });

            // 2. Active Students Chart (Line)
            const activeStudentsCtx = document.getElementById('activeStudentsChart').getContext('2d');
            new Chart(activeStudentsCtx, {
                type: 'line',
                data: {
                    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                    datasets: [{
                        label: 'Alunos Ativos',
                        data: [45, 52, 48, 58],
                        borderColor: '#00FF88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#333'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });

            // 3. Goals Distribution Chart (Doughnut)
            const goalsCtx = document.getElementById('goalsChart').getContext('2d');
            new Chart(goalsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Hipertrofia', 'Emagrecimento', 'Condicionamento', 'Força'],
                    datasets: [{
                        data: [40, 30, 20, 10],
                        backgroundColor: ['#CCFF00', '#00FF88', '#007AFF', '#FF3B30'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
            });

            // 4. Inactivity Rate Chart (Line)
            const inactivityCtx = document.getElementById('inactivityChart').getContext('2d');
            new Chart(inactivityCtx, {
                type: 'line',
                data: {
                    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                    datasets: [{
                        label: 'Taxa de Inatividade (%)',
                        data: [18, 15, 12, 8],
                        borderColor: '#FF3B30',
                        backgroundColor: 'rgba(255, 59, 48, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 25,
                            grid: {
                                color: '#333'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        </script>
    </body>
    </html>
  `)
})
