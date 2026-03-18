import { Hono } from 'hono'

export const pricingRoutes = new Hono()

// Pricing & Checkout Page
pricingRoutes.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Escolha seu Plano - ForteTrain</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://sdk.mercadopago.com/js/v2"></script>
        <style>
            body {
                background: #0D0D0D;
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            .card-dark {
                background: #1A1A1A;
                border: 1px solid #333;
                transition: all 0.3s;
            }
            .card-dark:hover {
                transform: translateY(-4px);
                border-color: #CCFF00;
                box-shadow: 0 10px 30px rgba(204, 255, 0, 0.1);
            }
            .btn-neon {
                background: #CCFF00;
                color: #0D0D0D;
                font-weight: bold;
                transition: all 0.3s;
            }
            .btn-neon:hover {
                transform: scale(1.05);
                box-shadow: 0 0 20px rgba(204, 255, 0, 0.4);
            }
            .plan-recommended {
                border: 2px solid #CCFF00;
                position: relative;
            }
            .recommended-badge {
                position: absolute;
                top: -12px;
                left: 50%;
                transform: translateX(-50%);
                background: #CCFF00;
                color: #0D0D0D;
                padding: 4px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="max-w-7xl mx-auto px-6 py-12">
            <!-- Header -->
            <div class="text-center mb-16">
                <div class="flex items-center justify-center mb-6">
                    <i class="fas fa-dumbbell text-5xl" style="color: #CCFF00;"></i>
                    <span class="ml-4 text-4xl font-bold" style="color: #CCFF00;">ForteTrain</span>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    Escolha o Plano Ideal para Você
                </h1>
                <p class="text-xl text-gray-400 max-w-2xl mx-auto">
                    Potencialize seu negócio com IA. Comece grátis por 14 dias.
                </p>
            </div>

            <!-- Toggle: Mensal vs Anual -->
            <div class="flex justify-center mb-12">
                <div class="card-dark rounded-full p-2 flex items-center">
                    <button onclick="toggleBilling('monthly')" id="btn-monthly" class="btn-neon px-8 py-3 rounded-full text-sm font-bold">
                        Mensal
                    </button>
                    <button onclick="toggleBilling('annual')" id="btn-annual" class="px-8 py-3 rounded-full text-sm font-bold text-gray-400 hover:text-white transition">
                        Anual <span class="text-xs ml-2" style="color: #CCFF00;">-17% OFF</span>
                    </button>
                </div>
            </div>

            <!-- Plans Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <!-- Start Plan -->
                <div class="card-dark rounded-2xl p-8">
                    <h3 class="text-2xl font-bold mb-2">Start</h3>
                    <p class="text-gray-400 mb-6">Ideal para iniciar sua jornada</p>
                    
                    <div class="mb-6">
                        <span class="text-5xl font-bold" id="price-start-monthly">R$ 99,90</span>
                        <span class="text-gray-400">/mês</span>
                        <div class="text-sm text-gray-500 mt-2" id="annual-price-start" style="display: none;">
                            R$ 999,00/ano (R$ 83,25/mês)
                        </div>
                    </div>

                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-green-400 mr-3"></i>
                            Até 30 alunos
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-green-400 mr-3"></i>
                            100 treinos IA/mês
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-green-400 mr-3"></i>
                            50 análises Vision/mês
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-green-400 mr-3"></i>
                            Notificações WhatsApp
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-green-400 mr-3"></i>
                            Analytics Básico
                        </li>
                    </ul>

                    <button onclick="selectPlan('start')" class="w-full bg-gray-700 hover:bg-gray-600 py-4 rounded-xl font-bold transition">
                        Começar Grátis
                    </button>
                </div>

                <!-- Pro Plan (Recommended) -->
                <div class="card-dark rounded-2xl p-8 plan-recommended">
                    <div class="recommended-badge">MAIS POPULAR</div>
                    
                    <h3 class="text-2xl font-bold mb-2" style="color: #CCFF00;">Pro</h3>
                    <p class="text-gray-400 mb-6">Para Personal Trainers sérios</p>
                    
                    <div class="mb-6">
                        <span class="text-5xl font-bold" id="price-pro-monthly" style="color: #CCFF00;">R$ 199,90</span>
                        <span class="text-gray-400">/mês</span>
                        <div class="text-sm text-gray-500 mt-2" id="annual-price-pro" style="display: none;">
                            R$ 1.999,00/ano (R$ 166,58/mês)
                        </div>
                    </div>

                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                            Até 100 alunos
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                            500 treinos IA/mês
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                            200 análises Vision/mês
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                            Notificações WhatsApp
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                            Analytics Avançado
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                            Personalização de Marca
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check mr-3" style="color: #CCFF00;"></i>
                            Suporte Prioritário
                        </li>
                    </ul>

                    <button onclick="selectPlan('pro')" class="w-full btn-neon py-4 rounded-xl font-bold">
                        Começar Teste Grátis
                    </button>
                </div>

                <!-- Enterprise Plan -->
                <div class="card-dark rounded-2xl p-8">
                    <h3 class="text-2xl font-bold mb-2">Enterprise</h3>
                    <p class="text-gray-400 mb-6">Para grandes academias</p>
                    
                    <div class="mb-6">
                        <span class="text-5xl font-bold" id="price-enterprise-monthly">R$ 499,90</span>
                        <span class="text-gray-400">/mês</span>
                        <div class="text-sm text-gray-500 mt-2" id="annual-price-enterprise" style="display: none;">
                            R$ 4.999,00/ano (R$ 416,58/mês)
                        </div>
                    </div>

                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-purple-400 mr-3"></i>
                            <strong>Alunos Ilimitados</strong>
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-purple-400 mr-3"></i>
                            <strong>Treinos IA Ilimitados</strong>
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-purple-400 mr-3"></i>
                            <strong>Vision Ilimitado</strong>
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-purple-400 mr-3"></i>
                            Tudo do Pro +
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-purple-400 mr-3"></i>
                            Acesso à API
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-purple-400 mr-3"></i>
                            Gerente de Conta Dedicado
                        </li>
                        <li class="flex items-center text-gray-300">
                            <i class="fas fa-check text-purple-400 mr-3"></i>
                            SLA de 99.9%
                        </li>
                    </ul>

                    <button onclick="selectPlan('enterprise')" class="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold transition">
                        Falar com Vendas
                    </button>
                </div>
            </div>

            <!-- Features Comparison -->
            <div class="card-dark rounded-2xl p-8">
                <h2 class="text-2xl font-bold mb-6 text-center">Compare os Planos</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b border-gray-700">
                                <th class="py-4 px-4">Recurso</th>
                                <th class="py-4 px-4 text-center">Start</th>
                                <th class="py-4 px-4 text-center" style="color: #CCFF00;">Pro</th>
                                <th class="py-4 px-4 text-center">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-300">
                            <tr class="border-b border-gray-800">
                                <td class="py-4 px-4">Limite de Alunos</td>
                                <td class="py-4 px-4 text-center">30</td>
                                <td class="py-4 px-4 text-center font-bold" style="color: #CCFF00;">100</td>
                                <td class="py-4 px-4 text-center font-bold text-purple-400">Ilimitado</td>
                            </tr>
                            <tr class="border-b border-gray-800">
                                <td class="py-4 px-4">Treinos IA (mês)</td>
                                <td class="py-4 px-4 text-center">100</td>
                                <td class="py-4 px-4 text-center font-bold" style="color: #CCFF00;">500</td>
                                <td class="py-4 px-4 text-center font-bold text-purple-400">Ilimitado</td>
                            </tr>
                            <tr class="border-b border-gray-800">
                                <td class="py-4 px-4">Vision AI (mês)</td>
                                <td class="py-4 px-4 text-center">50</td>
                                <td class="py-4 px-4 text-center font-bold" style="color: #CCFF00;">200</td>
                                <td class="py-4 px-4 text-center font-bold text-purple-400">Ilimitado</td>
                            </tr>
                            <tr class="border-b border-gray-800">
                                <td class="py-4 px-4">Notificações WhatsApp</td>
                                <td class="py-4 px-4 text-center"><i class="fas fa-check text-green-400"></i></td>
                                <td class="py-4 px-4 text-center"><i class="fas fa-check" style="color: #CCFF00;"></i></td>
                                <td class="py-4 px-4 text-center"><i class="fas fa-check text-purple-400"></i></td>
                            </tr>
                            <tr class="border-b border-gray-800">
                                <td class="py-4 px-4">Analytics</td>
                                <td class="py-4 px-4 text-center">Básico</td>
                                <td class="py-4 px-4 text-center font-bold" style="color: #CCFF00;">Avançado</td>
                                <td class="py-4 px-4 text-center font-bold text-purple-400">Avançado</td>
                            </tr>
                            <tr class="border-b border-gray-800">
                                <td class="py-4 px-4">Personalização de Marca</td>
                                <td class="py-4 px-4 text-center"><i class="fas fa-times text-red-400"></i></td>
                                <td class="py-4 px-4 text-center"><i class="fas fa-check" style="color: #CCFF00;"></i></td>
                                <td class="py-4 px-4 text-center"><i class="fas fa-check text-purple-400"></i></td>
                            </tr>
                            <tr class="border-b border-gray-800">
                                <td class="py-4 px-4">Acesso à API</td>
                                <td class="py-4 px-4 text-center"><i class="fas fa-times text-red-400"></i></td>
                                <td class="py-4 px-4 text-center"><i class="fas fa-times text-red-400"></i></td>
                                <td class="py-4 px-4 text-center"><i class="fas fa-check text-purple-400"></i></td>
                            </tr>
                            <tr>
                                <td class="py-4 px-4">Suporte</td>
                                <td class="py-4 px-4 text-center">Email</td>
                                <td class="py-4 px-4 text-center font-bold" style="color: #CCFF00;">Prioritário</td>
                                <td class="py-4 px-4 text-center font-bold text-purple-400">Gerente Dedicado</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Footer -->
            <div class="text-center mt-16 text-gray-400">
                <p class="mb-4">🔒 Pagamento seguro via Mercado Pago • Cancele quando quiser</p>
                <p>Dúvidas? <a href="mailto:suporte@fortetrain.app" class="underline hover:text-white">Entre em contato</a></p>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            const token = localStorage.getItem('fortetrain_token');
            if (!token) {
                alert('Você precisa fazer login primeiro!');
                window.location.href = '/auth/login?redirect=/pricing';
                throw new Error('No token');
            }

            console.log('Token found:', token ? 'YES' : 'NO');

            let billingCycle = 'monthly';

            function toggleBilling(cycle) {
                billingCycle = cycle;
                
                // Update button styles
                const btnMonthly = document.getElementById('btn-monthly');
                const btnAnnual = document.getElementById('btn-annual');
                
                if (cycle === 'monthly') {
                    btnMonthly.className = 'btn-neon px-8 py-3 rounded-full text-sm font-bold';
                    btnAnnual.className = 'px-8 py-3 rounded-full text-sm font-bold text-gray-400 hover:text-white transition';
                    
                    // Hide annual prices
                    document.getElementById('annual-price-start').style.display = 'none';
                    document.getElementById('annual-price-pro').style.display = 'none';
                    document.getElementById('annual-price-enterprise').style.display = 'none';
                } else {
                    btnMonthly.className = 'px-8 py-3 rounded-full text-sm font-bold text-gray-400 hover:text-white transition';
                    btnAnnual.className = 'btn-neon px-8 py-3 rounded-full text-sm font-bold';
                    
                    // Show annual prices
                    document.getElementById('annual-price-start').style.display = 'block';
                    document.getElementById('annual-price-pro').style.display = 'block';
                    document.getElementById('annual-price-enterprise').style.display = 'block';
                }
            }

            async function selectPlan(planType) {
                try {
                    console.log('Selecting plan:', planType, 'billing:', billingCycle);
                    console.log('Token:', token ? token.substring(0, 20) + '...' : 'MISSING');
                    
                    // Create preference
                    const response = await axios.post('/api/payments/create-preference', {
                        plan_type: planType,
                        billing_cycle: billingCycle
                    }, {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });

                    console.log('Response:', response.data);

                    if (response.data.success) {
                        // Redirect to Mercado Pago checkout
                        window.location.href = response.data.init_point;
                    } else {
                        alert('Erro ao criar checkout. Tente novamente.');
                    }
                } catch (error) {
                    console.error('Error details:', error);
                    console.error('Error response:', error.response);
                    
                    if (error.response?.status === 401) {
                        alert('Sessão expirada. Faça login novamente.');
                        localStorage.removeItem('fortetrain_token');
                        window.location.href = '/auth/login?redirect=/pricing';
                    } else {
                        alert('Erro ao processar pagamento: ' + (error.response?.data?.error || 'Erro desconhecido'));
                    }
                }
            }
        </script>
    </body>
    </html>
  `)
})

export default pricingRoutes
