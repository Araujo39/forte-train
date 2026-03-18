import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
}

export const adminRoutes = new Hono<{ Bindings: Bindings }>()

// ======================================
// SUPER ADMIN DASHBOARD (Business View)
// ======================================
adminRoutes.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Super Admin - ForteTrain</title>
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
            .btn-admin {
                background: linear-gradient(135deg, #FF6B35 0%, #FF4757 100%);
                color: #FFFFFF;
                font-weight: bold;
            }
            .btn-admin:hover {
                opacity: 0.9;
            }
            .badge-active { background: #00FF88; color: #0D0D0D; }
            .badge-trial { background: #FFB800; color: #0D0D0D; }
            .badge-delinquent { background: #FF3B30; color: #FFF; }
            .badge-inactive { background: #666; color: #FFF; }
            .stat-card {
                background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
                border: 1px solid #444;
            }
            .stat-card.mrr { border-left: 4px solid #00FF88; }
            .stat-card.arr { border-left: 4px solid #0A84FF; }
            .stat-card.churn { border-left: 4px solid #FF3B30; }
            .stat-card.health { border-left: 4px solid #FFB800; }
            .admin-header {
                background: linear-gradient(135deg, #FF6B35 0%, #FF4757 100%);
                padding: 1rem;
                border-radius: 0.75rem;
                margin-bottom: 2rem;
            }
            .impersonate-btn {
                background: #0A84FF;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                font-size: 0.875rem;
            }
            .impersonate-btn:hover {
                background: #0066CC;
            }
        </style>
    </head>
    <body class="p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Admin Header -->
            <div class="admin-header">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold">
                            <i class="fas fa-crown mr-2"></i>
                            Super Admin Dashboard
                        </h1>
                        <p class="text-white opacity-90 mt-2">Visão Macro do Negócio - ForteTrain Platform</p>
                    </div>
                    <button onclick="window.location.href='/api/admin/refresh-metrics'" class="btn-admin px-6 py-3 rounded-lg">
                        <i class="fas fa-sync mr-2"></i>Atualizar Métricas
                    </button>
                </div>
            </div>

            <!-- Financial KPIs -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <!-- MRR -->
                <div class="stat-card mrr rounded-xl p-6">
                    <div class="flex items-center justify-between mb-3">
                        <div class="text-sm text-gray-400 uppercase tracking-wide">MRR</div>
                        <i class="fas fa-dollar-sign text-green-400"></i>
                    </div>
                    <div class="text-3xl font-bold text-green-400" id="mrr-value">R$ 0</div>
                    <div class="text-xs text-gray-400 mt-2">Monthly Recurring Revenue</div>
                    <div class="text-xs mt-1" id="mrr-growth">--</div>
                </div>

                <!-- ARR -->
                <div class="stat-card arr rounded-xl p-6">
                    <div class="flex items-center justify-between mb-3">
                        <div class="text-sm text-gray-400 uppercase tracking-wide">ARR</div>
                        <i class="fas fa-chart-line text-blue-400"></i>
                    </div>
                    <div class="text-3xl font-bold text-blue-400" id="arr-value">R$ 0</div>
                    <div class="text-xs text-gray-400 mt-2">Annual Recurring Revenue</div>
                    <div class="text-xs mt-1" id="arr-growth">--</div>
                </div>

                <!-- Churn Rate -->
                <div class="stat-card churn rounded-xl p-6">
                    <div class="flex items-center justify-between mb-3">
                        <div class="text-sm text-gray-400 uppercase tracking-wide">Churn (30d)</div>
                        <i class="fas fa-user-minus text-red-400"></i>
                    </div>
                    <div class="text-3xl font-bold text-red-400" id="churn-value">0</div>
                    <div class="text-xs text-gray-400 mt-2">Personal Trainers Cancelled</div>
                    <div class="text-xs mt-1" id="churn-rate">--</div>
                </div>

                <!-- Active Tenants -->
                <div class="stat-card health rounded-xl p-6">
                    <div class="flex items-center justify-between mb-3">
                        <div class="text-sm text-gray-400 uppercase tracking-wide">Active Tenants</div>
                        <i class="fas fa-users text-yellow-400"></i>
                    </div>
                    <div class="text-3xl font-bold text-yellow-400" id="active-tenants">0</div>
                    <div class="text-xs text-gray-400 mt-2">Paying Customers</div>
                    <div class="text-xs mt-1" id="tenants-breakdown">--</div>
                </div>
            </div>

            <!-- Engagement Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="card-dark rounded-xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">Total Students</h3>
                        <i class="fas fa-graduation-cap text-blue-400"></i>
                    </div>
                    <div class="text-4xl font-bold" id="total-students">0</div>
                    <div class="text-sm text-gray-400 mt-2">Across all Personal Trainers</div>
                </div>

                <div class="card-dark rounded-xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">AI Workouts (Month)</h3>
                        <i class="fas fa-robot text-purple-400"></i>
                    </div>
                    <div class="text-4xl font-bold text-purple-400" id="ai-requests">0</div>
                    <div class="text-sm text-gray-400 mt-2">Generated this month</div>
                </div>

                <div class="card-dark rounded-xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">Vision Requests</h3>
                        <i class="fas fa-camera text-orange-400"></i>
                    </div>
                    <div class="text-4xl font-bold text-orange-400" id="vision-requests">0</div>
                    <div class="text-sm text-gray-400 mt-2">Equipment photos analyzed</div>
                </div>
            </div>

            <!-- Tabs Navigation -->
            <div class="card-dark rounded-xl p-2 mb-6 flex gap-2">
                <button onclick="switchTab('tenants')" id="tab-tenants" class="tab-btn active px-6 py-3 rounded-lg font-semibold">
                    <i class="fas fa-users mr-2"></i>Personal Trainers
                </button>
                <button onclick="switchTab('health')" id="tab-health" class="tab-btn px-6 py-3 rounded-lg font-semibold">
                    <i class="fas fa-heartbeat mr-2"></i>Health Score
                </button>
                <button onclick="switchTab('ai-logs')" id="tab-ai-logs" class="tab-btn px-6 py-3 rounded-lg font-semibold">
                    <i class="fas fa-exclamation-triangle mr-2"></i>AI Error Logs
                </button>
                <button onclick="switchTab('plans')" id="tab-plans" class="tab-btn px-6 py-3 rounded-lg font-semibold">
                    <i class="fas fa-tags mr-2"></i>Pricing & Plans
                </button>
            </div>

            <!-- Tab: Personal Trainers -->
            <div id="content-tenants" class="tab-content">
                <div class="card-dark rounded-xl p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold">
                            <i class="fas fa-building mr-2"></i>Personal Trainer Management
                        </h2>
                        <input type="text" id="search-tenants" placeholder="Search by name or email..." 
                               class="px-4 py-2 rounded-lg bg-black border border-gray-700 text-white">
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-gray-700">
                                    <th class="text-left py-3 px-4">Trainer</th>
                                    <th class="text-left py-3 px-4">Email</th>
                                    <th class="text-center py-3 px-4">Plan</th>
                                    <th class="text-center py-3 px-4">Status</th>
                                    <th class="text-center py-3 px-4">Students</th>
                                    <th class="text-center py-3 px-4">Last Activity</th>
                                    <th class="text-center py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="tenants-table">
                                <tr><td colspan="7" class="text-center py-12 text-gray-400">Loading...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab: Health Score -->
            <div id="content-health" class="tab-content hidden">
                <div class="card-dark rounded-xl p-6">
                    <h2 class="text-xl font-bold mb-6">
                        <i class="fas fa-heartbeat mr-2"></i>Health Score Analysis
                    </h2>
                    <p class="text-gray-400 mb-6">Identify at-risk Personal Trainers for proactive outreach</p>
                    <div id="health-list" class="space-y-4">
                        <p class="text-center py-12 text-gray-400">Loading...</p>
                    </div>
                </div>
            </div>

            <!-- Tab: AI Error Logs -->
            <div id="content-ai-logs" class="tab-content hidden">
                <div class="card-dark rounded-xl p-6">
                    <h2 class="text-xl font-bold mb-6">
                        <i class="fas fa-bug mr-2"></i>AI Error Monitoring
                    </h2>
                    <div id="ai-errors-list" class="space-y-3">
                        <p class="text-center py-12 text-gray-400">Loading...</p>
                    </div>
                </div>
            </div>

            <!-- Tab: Pricing & Plans -->
            <div id="content-plans" class="tab-content hidden">
                <div class="card-dark rounded-xl p-6">
                    <h2 class="text-xl font-bold mb-6">
                        <i class="fas fa-tags mr-2"></i>Plan Management
                    </h2>
                    <div id="plans-list" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <p class="text-center py-12 text-gray-400">Loading...</p>
                    </div>
                </div>
            </div>

        </div>

        <!-- Impersonation Modal -->
        <div id="impersonateModal" class="fixed inset-0 bg-black bg-opacity-70 hidden flex items-center justify-center z-50">
            <div class="card-dark rounded-xl p-8 max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold mb-4">
                    <i class="fas fa-user-secret mr-2 text-blue-400"></i>Impersonate Trainer
                </h3>
                <p class="text-gray-400 mb-6">You will be logged in as this Personal Trainer for support purposes. All actions will be logged.</p>
                <div class="mb-4">
                    <label class="block text-sm font-semibold mb-2">Trainer Name:</label>
                    <div id="impersonate-name" class="text-xl font-bold"></div>
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-semibold mb-2">Email:</label>
                    <div id="impersonate-email" class="text-gray-300"></div>
                </div>
                <div class="flex gap-4">
                    <button onclick="confirmImpersonate()" class="flex-1 btn-admin px-6 py-3 rounded-lg">
                        <i class="fas fa-sign-in-alt mr-2"></i>Start Session
                    </button>
                    <button onclick="closeImpersonateModal()" class="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg">
                        Cancel
                    </button>
                </div>
            </div>
        </div>

        <!-- Edit Plan Modal -->
        <div id="editPlanModal" class="fixed inset-0 bg-black bg-opacity-70 hidden flex items-center justify-center z-50">
            <div class="card-dark rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h3 class="text-2xl font-bold mb-4">
                    <i class="fas fa-edit mr-2 text-orange-400"></i>Edit Plan
                </h3>
                <form id="editPlanForm" class="space-y-6">
                    <!-- Plan Name -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Plan Name</label>
                        <input type="text" id="edit-plan-name" class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white" required />
                    </div>

                    <!-- Plan Type (readonly) -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Plan Type</label>
                        <input type="text" id="edit-plan-type" class="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-400" readonly />
                    </div>

                    <!-- Pricing -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">Monthly Price (R$)</label>
                            <input type="number" step="0.01" id="edit-price-monthly" class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white" required />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Annual Price (R$)</label>
                            <input type="number" step="0.01" id="edit-price-annual" class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white" required />
                        </div>
                    </div>

                    <!-- Limits -->
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">Max Students</label>
                            <input type="number" id="edit-max-students" class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white" placeholder="-1 = unlimited" required />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Max AI Requests/month</label>
                            <input type="number" id="edit-max-ai" class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white" placeholder="-1 = unlimited" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-2">Max Vision/month</label>
                            <input type="number" id="edit-max-vision" class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white" placeholder="-1 = unlimited" />
                        </div>
                    </div>

                    <!-- Features -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Features (one per line)</label>
                        <textarea id="edit-features" rows="6" class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white" placeholder="AI Workout Generator&#10;Vision Module&#10;WhatsApp Notifications"></textarea>
                    </div>

                    <!-- Active Toggle -->
                    <div class="flex items-center">
                        <input type="checkbox" id="edit-is-active" class="w-5 h-5 rounded border-gray-700 text-orange-500 focus:ring-orange-500" checked />
                        <label for="edit-is-active" class="ml-3 text-sm font-semibold">Plan is active</label>
                    </div>

                    <!-- Buttons -->
                    <div class="flex gap-4 pt-4">
                        <button type="submit" class="flex-1 btn-admin px-6 py-3 rounded-lg">
                            <i class="fas fa-save mr-2"></i>Save Changes
                        </button>
                        <button type="button" onclick="closeEditPlanModal()" class="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg">
                            Cancel
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

            let allTenants = [];
            let selectedTenant = null;

            // Initialize
            loadDashboardData();

            async function loadDashboardData() {
                try {
                    // Load Platform Stats
                    const statsRes = await axios.get('/api/admin/platform-stats', {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    const stats = statsRes.data.stats;
                    displayPlatformStats(stats);

                    // Load Tenants
                    const tenantsRes = await axios.get('/api/admin/tenants', {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    allTenants = tenantsRes.data.tenants;
                    displayTenants(allTenants);

                    // Load Health Scores
                    const healthRes = await axios.get('/api/admin/health-scores', {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    displayHealthScores(healthRes.data.metrics);

                    // Load AI Errors
                    const errorsRes = await axios.get('/api/admin/ai-errors', {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    displayAIErrors(errorsRes.data.errors);

                    // Load Plans
                    const plansRes = await axios.get('/api/admin/plans', {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    displayPlans(plansRes.data.plans);

                } catch (error) {
                    console.error('Error loading data:', error);
                    if (error.response?.status === 403) {
                        alert('Access denied - Super Admin permission required');
                        window.location.href = '/dashboard';
                    }
                }
            }

            function displayPlatformStats(stats) {
                document.getElementById('mrr-value').textContent = \`R$ \${stats.mrr.toFixed(2)}\`;
                document.getElementById('arr-value').textContent = \`R$ \${stats.arr.toFixed(2)}\`;
                document.getElementById('churn-value').textContent = stats.churn_count;
                document.getElementById('active-tenants').textContent = stats.active_tenants;
                document.getElementById('total-students').textContent = stats.total_students;
                document.getElementById('ai-requests').textContent = stats.ai_requests_count;
                document.getElementById('vision-requests').textContent = stats.vision_requests_count;

                const churnRate = stats.total_tenants > 0 ? (stats.churn_count / stats.total_tenants * 100).toFixed(1) : 0;
                document.getElementById('churn-rate').textContent = \`\${churnRate}% churn rate\`;
                document.getElementById('tenants-breakdown').textContent = \`\${stats.trial_tenants} trial · \${stats.delinquent_tenants} delinquent\`;

                // Growth indicators (placeholder)
                document.getElementById('mrr-growth').innerHTML = '<i class="fas fa-arrow-up text-green-400"></i> +12% vs last month';
                document.getElementById('arr-growth').innerHTML = '<i class="fas fa-arrow-up text-blue-400"></i> +12% vs last year';
            }

            function displayTenants(tenants) {
                const html = tenants.map(t => \`
                    <tr class="border-b border-gray-800 hover:bg-gray-900">
                        <td class="py-4 px-4">
                            <div class="font-semibold">\${t.name}</div>
                            <div class="text-xs text-gray-400">\${t.subdomain}.fortetrain.app</div>
                        </td>
                        <td class="py-4 px-4 text-gray-300">\${t.email}</td>
                        <td class="py-4 px-4 text-center">
                            <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase" 
                                  style="background: \${t.plan_type === 'enterprise' ? '#FF6B35' : t.plan_type === 'pro' ? '#0A84FF' : '#666'}; color: white;">
                                \${t.plan_type}
                            </span>
                        </td>
                        <td class="py-4 px-4 text-center">
                            <span class="badge-\${t.subscription_status || 'inactive'} px-3 py-1 rounded-full text-xs font-semibold uppercase">
                                \${t.subscription_status || 'inactive'}
                            </span>
                        </td>
                        <td class="py-4 px-4 text-center font-semibold">\${t.student_count}</td>
                        <td class="py-4 px-4 text-center text-sm text-gray-400">\${formatDate(t.last_activity_date)}</td>
                        <td class="py-4 px-4 text-center">
                            <button onclick="impersonate('\${t.id}', '\${t.name}', '\${t.email}')" 
                                    class="impersonate-btn">
                                <i class="fas fa-user-secret"></i> Impersonate
                            </button>
                        </td>
                    </tr>
                \`).join('');
                document.getElementById('tenants-table').innerHTML = html;
            }

            function displayHealthScores(metrics) {
                const html = metrics.map(m => {
                    const healthColor = m.health_score >= 70 ? 'green' : m.health_score >= 40 ? 'yellow' : 'red';
                    return \`
                        <div class="card-dark rounded-lg p-4 border-l-4 border-\${healthColor}-400">
                            <div class="flex justify-between items-center">
                                <div>
                                    <div class="font-semibold text-lg">\${m.tenant_name}</div>
                                    <div class="text-sm text-gray-400">\${m.tenant_email}</div>
                                    <div class="text-xs text-gray-500 mt-2">
                                        \${m.total_students} students · \${m.total_workouts_created} workouts · 
                                        Last activity: \${formatDate(m.last_activity_date)}
                                    </div>
                                </div>
                                <div class="text-center">
                                    <div class="text-4xl font-bold text-\${healthColor}-400">\${m.health_score}</div>
                                    <div class="text-xs text-gray-400 uppercase">\${m.health_status}</div>
                                </div>
                            </div>
                        </div>
                    \`;
                }).join('');
                document.getElementById('health-list').innerHTML = html;
            }

            function displayAIErrors(errors) {
                if (errors.length === 0) {
                    document.getElementById('ai-errors-list').innerHTML = '<p class="text-center py-8 text-gray-400">No errors found</p>';
                    return;
                }
                const html = errors.map(e => \`
                    <div class="card-dark rounded-lg p-4 border-l-4 border-red-400">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <span class="px-2 py-1 rounded text-xs font-semibold uppercase bg-red-600">\${e.error_type}</span>
                                <span class="text-xs text-gray-400 ml-2">\${formatDateTime(e.created_at)}</span>
                            </div>
                            <button onclick="resolveError('\${e.id}')" class="text-xs px-3 py-1 rounded bg-green-600 hover:bg-green-700">
                                <i class="fas fa-check mr-1"></i>Resolve
                            </button>
                        </div>
                        <div class="text-sm text-gray-300 mb-1">\${e.error_message}</div>
                        <div class="text-xs text-gray-500">Tenant: \${e.tenant_email || 'System'} · Status: \${e.response_status || 'N/A'}</div>
                    </div>
                \`).join('');
                document.getElementById('ai-errors-list').innerHTML = html;
            }

            function displayPlans(plans) {
                allPlans = plans; // Store for editing
                const html = plans.map(p => \`
                    <div class="card-dark rounded-xl p-6">
                        <h3 class="text-xl font-bold mb-2">\${p.name}</h3>
                        <div class="text-3xl font-bold mb-4" style="color: #CCFF00;">R$ \${p.price_monthly.toFixed(2)}<span class="text-sm text-gray-400">/mês</span></div>
                        <div class="text-sm text-gray-400 mb-4">R$ \${p.price_annual.toFixed(2)}/ano</div>
                        <div class="space-y-2 mb-6">
                            <div class="text-sm"><i class="fas fa-users mr-2 text-blue-400"></i>\${p.max_students === -1 ? 'Unlimited' : p.max_students} students</div>
                            <div class="text-sm"><i class="fas fa-robot mr-2 text-purple-400"></i>\${p.max_ai_requests === -1 ? 'Unlimited' : p.max_ai_requests} AI requests/month</div>
                            <div class="text-sm"><i class="fas fa-camera mr-2 text-orange-400"></i>\${p.max_vision_requests === -1 ? 'Unlimited' : p.max_vision_requests} Vision requests/month</div>
                        </div>
                        <button onclick="editPlan('\${p.id}')" class="w-full btn-admin py-2 rounded-lg text-sm">
                            <i class="fas fa-edit mr-2"></i>Edit Plan
                        </button>
                    </div>
                \`).join('');
                document.getElementById('plans-list').innerHTML = html;
            }

            // Tab switching
            function switchTab(tab) {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active', 'btn-admin'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
                document.getElementById(\`tab-\${tab}\`).classList.add('active', 'btn-admin');
                document.getElementById(\`content-\${tab}\`).classList.remove('hidden');
            }

            // Impersonation
            function impersonate(tenantId, name, email) {
                selectedTenant = { id: tenantId, name, email };
                document.getElementById('impersonate-name').textContent = name;
                document.getElementById('impersonate-email').textContent = email;
                document.getElementById('impersonateModal').classList.remove('hidden');
            }

            async function confirmImpersonate() {
                try {
                    const response = await axios.post('/api/admin/impersonate', 
                        { tenant_id: selectedTenant.id },
                        { headers: { 'Authorization': \`Bearer \${token}\` } }
                    );
                    
                    // Store impersonation token and redirect
                    localStorage.setItem('fortetrain_token', response.data.impersonation_token);
                    localStorage.setItem('is_impersonating', 'true');
                    localStorage.setItem('admin_token', token);
                    alert('Impersonation started. You are now viewing as ' + selectedTenant.name);
                    window.location.href = '/dashboard';
                } catch (error) {
                    alert('Failed to start impersonation: ' + (error.response?.data?.error || 'Unknown error'));
                }
            }

            function closeImpersonateModal() {
                document.getElementById('impersonateModal').classList.add('hidden');
                selectedTenant = null;
            }

            async function resolveError(errorId) {
                try {
                    await axios.post(\`/api/admin/ai-errors/\${errorId}/resolve\`, {}, {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    alert('Error marked as resolved');
                    loadDashboardData();
                } catch (error) {
                    alert('Failed to resolve error');
                }
            }

            let selectedPlan = null;
            let allPlans = [];

            async function editPlan(planId) {
                selectedPlan = allPlans.find(p => p.id === planId);
                if (!selectedPlan) {
                    alert('Plan not found');
                    return;
                }

                // Populate form
                document.getElementById('edit-plan-name').value = selectedPlan.name;
                document.getElementById('edit-plan-type').value = selectedPlan.plan_type;
                document.getElementById('edit-price-monthly').value = selectedPlan.price_monthly;
                document.getElementById('edit-price-annual').value = selectedPlan.price_annual;
                document.getElementById('edit-max-students').value = selectedPlan.max_students;
                document.getElementById('edit-max-ai').value = selectedPlan.max_ai_requests || -1;
                document.getElementById('edit-max-vision').value = selectedPlan.max_vision_requests || -1;
                
                // Parse features JSON
                let features = '';
                try {
                    const featuresArray = JSON.parse(selectedPlan.features || '[]');
                    features = featuresArray.join('\n');
                } catch (e) {
                    features = '';
                }
                document.getElementById('edit-features').value = features;
                document.getElementById('edit-is-active').checked = selectedPlan.is_active === 1;

                // Show modal
                document.getElementById('editPlanModal').classList.remove('hidden');
            }

            function closeEditPlanModal() {
                document.getElementById('editPlanModal').classList.add('hidden');
                selectedPlan = null;
            }

            // Handle plan edit form submission
            document.getElementById('editPlanForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                try {
                    const featuresText = document.getElementById('edit-features').value;
                    const featuresArray = featuresText.split('\n').filter(f => f.trim());

                    const payload = {
                        plan_id: selectedPlan.id,
                        name: document.getElementById('edit-plan-name').value,
                        price_monthly: parseFloat(document.getElementById('edit-price-monthly').value),
                        price_annual: parseFloat(document.getElementById('edit-price-annual').value),
                        max_students: parseInt(document.getElementById('edit-max-students').value),
                        max_ai_requests: parseInt(document.getElementById('edit-max-ai').value) || null,
                        max_vision_requests: parseInt(document.getElementById('edit-max-vision').value) || null,
                        features: JSON.stringify(featuresArray),
                        is_active: document.getElementById('edit-is-active').checked ? 1 : 0
                    };

                    const response = await axios.put('/api/admin/plans', payload, {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });

                    if (response.data.success) {
                        alert('Plan updated successfully!');
                        closeEditPlanModal();
                        loadDashboardData(); // Reload data
                    } else {
                        alert('Failed to update plan');
                    }
                } catch (error) {
                    console.error('Error updating plan:', error);
                    alert('Error: ' + (error.response?.data?.error || 'Failed to update plan'));
                }
            });

            // Search tenants
            document.getElementById('search-tenants').addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = allTenants.filter(t => 
                    t.name.toLowerCase().includes(query) || 
                    t.email.toLowerCase().includes(query)
                );
                displayTenants(filtered);
            });

            // Utility functions
            function formatDate(timestamp) {
                if (!timestamp) return 'Never';
                const date = new Date(timestamp * 1000);
                const now = new Date();
                const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
                if (diffDays === 0) return 'Today';
                if (diffDays === 1) return 'Yesterday';
                if (diffDays < 7) return \`\${diffDays}d ago\`;
                return date.toLocaleDateString('pt-BR');
            }

            function formatDateTime(timestamp) {
                if (!timestamp) return 'Never';
                return new Date(timestamp * 1000).toLocaleString('pt-BR');
            }
        </script>
    </body>
    </html>
  `)
})

export default adminRoutes
