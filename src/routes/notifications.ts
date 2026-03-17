import { Hono } from 'hono'

export const notificationsRoute = new Hono()

// Notifications Page
notificationsRoute.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notificações - ForteTrain</title>
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
            .notification-card {
                background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
                border: 1px solid #333;
                transition: all 0.3s;
            }
            .notification-card:hover {
                border-color: #CCFF00;
                transform: translateY(-2px);
            }
            .badge-success {
                background: #00FF88;
                color: #0D0D0D;
            }
            .badge-pending {
                background: #FF9500;
                color: #0D0D0D;
            }
            .badge-failed {
                background: #FF3B30;
                color: #FFFFFF;
            }
            .template-card {
                background: #000;
                border: 1px solid #333;
                cursor: pointer;
                transition: all 0.3s;
            }
            .template-card:hover {
                border-color: #CCFF00;
            }
            .template-card.selected {
                border-color: #CCFF00;
                background: #1A1A1A;
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
                        <a href="/dashboard/notifications" class="flex items-center px-4 py-3 rounded-lg bg-gray-800 text-white">
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
                                <i class="fas fa-bell mr-2" style="color: #CCFF00;"></i>
                                Notificações WhatsApp
                            </h1>
                            <p class="text-gray-400 text-sm">Envie mensagens motivacionais automaticamente</p>
                        </div>
                        <button onclick="showNewNotificationModal()" class="btn-neon px-6 py-3 rounded-lg">
                            <i class="fas fa-paper-plane mr-2"></i>Nova Mensagem
                        </button>
                    </div>
                </header>

                <div class="p-8">
                    <!-- Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div class="card-dark rounded-xl p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-gray-400 text-sm">Total Enviadas</div>
                                    <div class="text-3xl font-bold mt-2" id="totalSent">0</div>
                                </div>
                                <i class="fas fa-paper-plane text-4xl text-lime-400"></i>
                            </div>
                        </div>

                        <div class="card-dark rounded-xl p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-gray-400 text-sm">Entregues</div>
                                    <div class="text-3xl font-bold mt-2 text-green-400" id="totalDelivered">0</div>
                                </div>
                                <i class="fas fa-check-double text-4xl text-green-400"></i>
                            </div>
                        </div>

                        <div class="card-dark rounded-xl p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-gray-400 text-sm">Taxa de Abertura</div>
                                    <div class="text-3xl font-bold mt-2 text-blue-400" id="openRate">0%</div>
                                </div>
                                <i class="fas fa-eye text-4xl text-blue-400"></i>
                            </div>
                        </div>

                        <div class="card-dark rounded-xl p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-gray-400 text-sm">Respostas</div>
                                    <div class="text-3xl font-bold mt-2 text-purple-400" id="totalReplies">0</div>
                                </div>
                                <i class="fas fa-reply text-4xl text-purple-400"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Notifications List -->
                    <div class="card-dark rounded-xl p-6">
                        <h2 class="text-xl font-bold mb-6">Histórico de Notificações</h2>
                        
                        <div id="notificationsList" class="space-y-4">
                            <!-- Loading -->
                            <div class="text-center py-12">
                                <i class="fas fa-spinner fa-spin text-4xl text-lime-400 mb-4"></i>
                                <p class="text-gray-400">Carregando notificações...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Modal Nova Mensagem -->
        <div id="newMessageModal" class="fixed inset-0 bg-black bg-opacity-75 hidden items-center justify-center z-50">
            <div class="card-dark rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold" style="color: #CCFF00;">
                        <i class="fas fa-paper-plane mr-2"></i>Nova Mensagem WhatsApp
                    </h2>
                    <button onclick="closeNewMessageModal()" class="text-gray-400 hover:text-white text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form id="newMessageForm" class="space-y-6">
                    <!-- Recipient -->
                    <div>
                        <label class="block text-sm font-medium mb-2 text-gray-300">Destinatário</label>
                        <select id="recipientType" class="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg">
                            <option value="inactive">Alunos Inativos (3+ dias)</option>
                            <option value="all">Todos os Alunos</option>
                            <option value="specific">Aluno Específico</option>
                        </select>
                    </div>

                    <div id="specificStudentDiv" class="hidden">
                        <label class="block text-sm font-medium mb-2 text-gray-300">Selecione o Aluno</label>
                        <select id="specificStudent" class="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg">
                            <option value="">Carregando...</option>
                        </select>
                    </div>

                    <!-- Templates -->
                    <div>
                        <label class="block text-sm font-medium mb-3 text-gray-300">Template de Mensagem</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="template-card p-4 rounded-lg" onclick="selectTemplate('motivational')">
                                <div class="flex items-center gap-3 mb-2">
                                    <i class="fas fa-fire text-2xl text-orange-400"></i>
                                    <div>
                                        <div class="font-bold">Motivacional</div>
                                        <div class="text-xs text-gray-400">Incentivo para voltar a treinar</div>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-400 mt-2">
                                    "Olá {nome}! 💪 Sentimos sua falta! Que tal retomar os treinos hoje? Seus objetivos estão te esperando!"
                                </p>
                            </div>

                            <div class="template-card p-4 rounded-lg" onclick="selectTemplate('progress')">
                                <div class="flex items-center gap-3 mb-2">
                                    <i class="fas fa-chart-line text-2xl text-green-400"></i>
                                    <div>
                                        <div class="font-bold">Progresso</div>
                                        <div class="text-xs text-gray-400">Parabenizar evolução</div>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-400 mt-2">
                                    "Parabéns {nome}! 🎉 Você está evoluindo muito! Continue firme nos treinos e logo verá resultados incríveis!"
                                </p>
                            </div>

                            <div class="template-card p-4 rounded-lg" onclick="selectTemplate('reminder')">
                                <div class="flex items-center gap-3 mb-2">
                                    <i class="fas fa-clock text-2xl text-blue-400"></i>
                                    <div>
                                        <div class="font-bold">Lembrete</div>
                                        <div class="text-xs text-gray-400">Lembrar de treinar hoje</div>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-400 mt-2">
                                    "E aí {nome}! ⏰ Não esqueça do treino de hoje! Separei um treino especial pra você. Bora lá!"
                                </p>
                            </div>

                            <div class="template-card p-4 rounded-lg" onclick="selectTemplate('custom')">
                                <div class="flex items-center gap-3 mb-2">
                                    <i class="fas fa-edit text-2xl text-purple-400"></i>
                                    <div>
                                        <div class="font-bold">Personalizada</div>
                                        <div class="text-xs text-gray-400">Escrever mensagem própria</div>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-400 mt-2">
                                    Crie sua própria mensagem personalizada
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Message Text -->
                    <div id="messageTextDiv">
                        <label class="block text-sm font-medium mb-2 text-gray-300">Mensagem</label>
                        <textarea id="messageText" rows="6" class="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg" placeholder="Digite sua mensagem... Use {nome} para incluir o nome do aluno."></textarea>
                        <div class="text-xs text-gray-400 mt-1">
                            <i class="fas fa-info-circle mr-1"></i>
                            Use {nome} para personalizar com o nome do aluno
                        </div>
                    </div>

                    <!-- Schedule -->
                    <div>
                        <label class="block text-sm font-medium mb-2 text-gray-300">Agendamento</label>
                        <select id="scheduleType" class="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg">
                            <option value="now">Enviar Agora</option>
                            <option value="scheduled">Agendar Envio</option>
                        </select>
                    </div>

                    <div id="scheduleTimeDiv" class="hidden">
                        <label class="block text-sm font-medium mb-2 text-gray-300">Data e Hora</label>
                        <input type="datetime-local" id="scheduleTime" class="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg" />
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-4">
                        <button type="submit" class="flex-1 btn-neon py-3 rounded-lg font-bold">
                            <i class="fas fa-paper-plane mr-2"></i>Enviar Mensagem
                        </button>
                        <button type="button" onclick="closeNewMessageModal()" class="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition">
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

            let students = [];
            let notifications = [];
            let selectedTemplate = '';

            async function loadData() {
                try {
                    // Load students
                    const studentsRes = await axios.get('/api/students', {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    students = studentsRes.data;

                    // Load notifications
                    const notificationsRes = await axios.get('/api/notifications/history', {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    notifications = notificationsRes.data;

                    updateStats();
                    renderNotifications();
                } catch (error) {
                    console.error('Error loading data:', error);
                }
            }

            function updateStats() {
                const totalSent = notifications.length;
                const totalDelivered = notifications.filter(n => n.status === 'delivered').length;
                const totalReplies = Math.floor(totalSent * 0.3); // Simulated
                const openRate = totalSent > 0 ? Math.floor((totalDelivered / totalSent) * 100) : 0;

                document.getElementById('totalSent').textContent = totalSent;
                document.getElementById('totalDelivered').textContent = totalDelivered;
                document.getElementById('totalReplies').textContent = totalReplies;
                document.getElementById('openRate').textContent = openRate + '%';
            }

            function renderNotifications() {
                const list = document.getElementById('notificationsList');
                
                if (notifications.length === 0) {
                    list.innerHTML = \`
                        <div class="text-center py-12">
                            <i class="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                            <p class="text-gray-400 text-lg">Nenhuma notificação enviada ainda</p>
                            <button onclick="showNewNotificationModal()" class="btn-neon px-6 py-3 rounded-lg mt-6">
                                <i class="fas fa-paper-plane mr-2"></i>Enviar Primeira Mensagem
                            </button>
                        </div>
                    \`;
                    return;
                }

                list.innerHTML = notifications.map(notif => {
                    const student = students.find(s => s.id === notif.student_id);
                    const statusColors = {
                        'sent': 'badge-pending',
                        'delivered': 'badge-success',
                        'failed': 'badge-failed'
                    };
                    const statusIcons = {
                        'sent': 'fa-clock',
                        'delivered': 'fa-check-double',
                        'failed': 'fa-exclamation-circle'
                    };
                    const statusLabels = {
                        'sent': 'Enviada',
                        'delivered': 'Entregue',
                        'failed': 'Falhou'
                    };

                    return \`
                        <div class="notification-card rounded-xl p-6">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="w-10 h-10 bg-lime-400/20 rounded-full flex items-center justify-center">
                                            <i class="fas fa-user text-lime-400"></i>
                                        </div>
                                        <div>
                                            <div class="font-bold">\${student ? student.full_name : 'Aluno não encontrado'}</div>
                                            <div class="text-sm text-gray-400">\${student ? student.whatsapp : ''}</div>
                                        </div>
                                    </div>
                                    
                                    <div class="bg-black/30 p-4 rounded-lg mb-3">
                                        <p class="text-gray-300">\${notif.message_text}</p>
                                    </div>

                                    <div class="flex items-center gap-4 text-sm text-gray-400">
                                        <span>
                                            <i class="fas fa-calendar mr-1"></i>
                                            \${new Date(notif.created_at * 1000).toLocaleDateString('pt-BR')}
                                        </span>
                                        <span>
                                            <i class="fas fa-clock mr-1"></i>
                                            \${new Date(notif.created_at * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span>
                                            <i class="fas fa-tag mr-1"></i>
                                            \${notif.notification_type}
                                        </span>
                                    </div>
                                </div>

                                <span class="\${statusColors[notif.status]} px-3 py-1 text-xs font-bold rounded-full">
                                    <i class="fas \${statusIcons[notif.status]} mr-1"></i>
                                    \${statusLabels[notif.status]}
                                </span>
                            </div>
                        </div>
                    \`;
                }).join('');
            }

            function showNewNotificationModal() {
                // Populate students select
                const select = document.getElementById('specificStudent');
                select.innerHTML = '<option value="">Selecione um aluno</option>' + 
                    students.map(s => \`<option value="\${s.id}">\${s.name}</option>\`).join('');

                document.getElementById('newMessageModal').classList.remove('hidden');
                document.getElementById('newMessageModal').classList.add('flex');
            }

            function closeNewMessageModal() {
                document.getElementById('newMessageModal').classList.add('hidden');
                document.getElementById('newMessageModal').classList.remove('flex');
                document.getElementById('newMessageForm').reset();
            }

            function selectTemplate(templateType) {
                // Remove selected class from all templates
                document.querySelectorAll('.template-card').forEach(card => {
                    card.classList.remove('selected');
                });

                // Add selected class to clicked template
                event.target.closest('.template-card').classList.add('selected');
                selectedTemplate = templateType;

                const templates = {
                    motivational: 'Olá {nome}! 💪 Sentimos sua falta! Que tal retomar os treinos hoje? Seus objetivos estão te esperando!',
                    progress: 'Parabéns {nome}! 🎉 Você está evoluindo muito! Continue firme nos treinos e logo verá resultados incríveis!',
                    reminder: 'E aí {nome}! ⏰ Não esqueça do treino de hoje! Separei um treino especial pra você. Bora lá!',
                    custom: ''
                };

                document.getElementById('messageText').value = templates[templateType];
            }

            // Form handlers
            document.getElementById('recipientType').addEventListener('change', (e) => {
                const specificDiv = document.getElementById('specificStudentDiv');
                if (e.target.value === 'specific') {
                    specificDiv.classList.remove('hidden');
                } else {
                    specificDiv.classList.add('hidden');
                }
            });

            document.getElementById('scheduleType').addEventListener('change', (e) => {
                const scheduleDiv = document.getElementById('scheduleTimeDiv');
                if (e.target.value === 'scheduled') {
                    scheduleDiv.classList.remove('hidden');
                } else {
                    scheduleDiv.classList.add('hidden');
                }
            });

            document.getElementById('newMessageForm').addEventListener('submit', async (e) => {
                e.preventDefault();

                const recipientType = document.getElementById('recipientType').value;
                const messageText = document.getElementById('messageText').value;

                if (!messageText) {
                    alert('Por favor, escreva uma mensagem');
                    return;
                }

                try {
                    let targetStudents = [];

                    if (recipientType === 'inactive') {
                        const res = await axios.get('/api/students/inactive', {
                            headers: { 'Authorization': \`Bearer \${token}\` }
                        });
                        targetStudents = res.data;
                    } else if (recipientType === 'all') {
                        targetStudents = students;
                    } else {
                        const studentId = document.getElementById('specificStudent').value;
                        const student = students.find(s => s.id === studentId);
                        if (student) targetStudents = [student];
                    }

                    if (targetStudents.length === 0) {
                        alert('Nenhum destinatário selecionado');
                        return;
                    }

                    // Send notifications (simulated)
                    for (const student of targetStudents) {
                        const personalizedMessage = messageText.replace('{nome}', student.full_name);
                        
                        await axios.post('/api/notifications/send', {
                            studentId: student.id,
                            message: personalizedMessage,
                            type: selectedTemplate || 'custom'
                        }, {
                            headers: { 'Authorization': \`Bearer \${token}\` }
                        });
                    }

                    alert(\`Mensagem enviada com sucesso para \${targetStudents.length} aluno(s)!\`);
                    closeNewMessageModal();
                    loadData();
                } catch (error) {
                    console.error('Error sending notification:', error);
                    alert('Erro ao enviar mensagem. Tente novamente.');
                }
            });

            // Load data on page load
            loadData();
        </script>
    </body>
    </html>
  `)
})
