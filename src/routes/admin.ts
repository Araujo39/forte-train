import { Hono } from 'hono'

export const adminRoutes = new Hono()

// Admin Dashboard
adminRoutes.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin - ForteTrain</title>
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
            }
        </style>
    </head>
    <body class="p-8">
        <div class="max-w-7xl mx-auto">
            <header class="mb-8">
                <h1 class="text-3xl font-bold mb-2">
                    <i class="fas fa-shield-alt mr-2" style="color: #CCFF00;"></i>
                    Admin Dashboard - ForteTrain
                </h1>
                <p class="text-gray-400">Visualize todos os Personal Trainers e seus alunos</p>
            </header>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="card-dark rounded-xl p-6">
                    <div class="text-4xl font-bold mb-2" style="color: #CCFF00;" id="total-tenants">0</div>
                    <div class="text-gray-400">Personal Trainers</div>
                </div>
                <div class="card-dark rounded-xl p-6">
                    <div class="text-4xl font-bold mb-2 text-green-400" id="total-students">0</div>
                    <div class="text-gray-400">Alunos Total</div>
                </div>
                <div class="card-dark rounded-xl p-6">
                    <div class="text-4xl font-bold mb-2 text-blue-400" id="active-trainers">0</div>
                    <div class="text-gray-400">Trainers Ativos</div>
                </div>
            </div>

            <!-- Tenants List -->
            <div class="card-dark rounded-xl p-6">
                <h2 class="text-xl font-bold mb-6">
                    <i class="fas fa-users mr-2"></i>Personal Trainers
                </h2>
                <div id="tenants-list">
                    <p class="text-center py-12 text-gray-400">Carregando...</p>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            const token = localStorage.getItem('fortetrain_token');
            if (!token) {
                window.location.href = '/auth/login';
            }

            async function loadData() {
                try {
                    const response = await axios.get('/api/admin/tenants', {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });

                    const tenants = response.data.tenants;
                    const totalStudents = tenants.reduce((sum, t) => sum + t.student_count, 0);

                    document.getElementById('total-tenants').textContent = tenants.length;
                    document.getElementById('total-students').textContent = totalStudents;
                    document.getElementById('active-trainers').textContent = tenants.filter(t => t.plan_status === 'active').length;

                    renderTenants(tenants);
                } catch (error) {
                    console.error('Error:', error);
                    if (error.response?.status === 403) {
                        alert('Acesso negado - Requer permissão de Admin');
                        window.location.href = '/dashboard';
                    }
                }
            }

            function renderTenants(tenants) {
                const list = document.getElementById('tenants-list');
                
                if (tenants.length === 0) {
                    list.innerHTML = '<p class="text-center py-12 text-gray-400">Nenhum personal trainer cadastrado</p>';
                    return;
                }

                list.innerHTML = \`
                    <table class="w-full">
                        <thead class="border-b border-gray-700">
                            <tr class="text-left text-gray-400 text-sm">
                                <th class="py-3">Nome</th>
                                <th>Email</th>
                                <th>Plano</th>
                                <th>Alunos</th>
                                <th>Cadastro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${tenants.map(tenant => \`
                                <tr class="border-b border-gray-800 hover:bg-black/30">
                                    <td class="py-4">
                                        <div class="font-bold">\${tenant.name}</div>
                                        <div class="text-xs text-gray-500">\${tenant.subdomain || 'N/A'}</div>
                                    </td>
                                    <td class="text-gray-400">\${tenant.email}</td>
                                    <td>
                                        <span class="px-2 py-1 bg-lime-400/20 text-lime-400 text-xs rounded">
                                            \${tenant.plan_type}
                                        </span>
                                    </td>
                                    <td class="font-bold">\${tenant.student_count}</td>
                                    <td class="text-gray-400 text-sm">\${new Date(tenant.created_at * 1000).toLocaleDateString('pt-BR')}</td>
                                    <td>
                                        <button onclick="viewTenantDetails('\${tenant.id}')" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                                            <i class="fas fa-eye mr-1"></i>Ver
                                        </button>
                                    </td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                \`;
            }

            function viewTenantDetails(tenantId) {
                // Redirect to tenant detail page or open modal
                alert('Visualizar detalhes do tenant: ' + tenantId);
            }

            loadData();
        </script>
    </body>
    </html>
  `)
})
