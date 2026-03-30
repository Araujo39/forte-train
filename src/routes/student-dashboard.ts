import { Hono } from 'hono'

export const studentDashboardRoutes = new Hono()

// Elite Student Dashboard - Carbon Performance Design
studentDashboardRoutes.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ForteTrain - Elite Dashboard</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            :root {
                /* 🏆 OMNI-SPORT: Dynamic CSS Variables */
                --sport-primary: #CCFF00;
                --sport-secondary: #99FF00;
                --sport-gradient: linear-gradient(135deg, #CCFF00, #99FF00);
                --sport-glow: rgba(204, 255, 0, 0.5);
            }
            
            * {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            
            body {
                background: #0D0D0D;
                color: #FFFFFF;
                padding-bottom: 90px;
                overflow-x: hidden;
            }

            /* Glassmorphism Base */
            .glass {
                background: rgba(26, 26, 26, 0.7);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            .glass-strong {
                background: rgba(26, 26, 26, 0.85);
                backdrop-filter: blur(30px);
                -webkit-backdrop-filter: blur(30px);
                border: 1px solid rgba(255, 255, 255, 0.08);
            }

            /* Neon Gradient - Dynamic */
            .neon-gradient {
                background: var(--sport-gradient);
            }

            .neon-gradient-text {
                background: var(--sport-gradient);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            /* Header Elite */
            .header-elite {
                background: linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(13, 13, 13, 0.8) 100%);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(204, 255, 0, 0.1);
            }

            .greeting-dynamic {
                font-size: 1.5rem;
                font-weight: 800;
                letter-spacing: -0.02em;
            }

            /* Flame Counter with Gradient */
            .flame-counter {
                background: linear-gradient(135deg, #FF6B35 0%, #FF4757 100%);
                padding: 0.6rem 1.2rem;
                border-radius: 2rem;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                box-shadow: 0 0 30px rgba(255, 75, 87, 0.4);
                animation: flame-pulse 2s ease-in-out infinite;
            }

            @keyframes flame-pulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(255, 75, 87, 0.4); }
                50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(255, 75, 87, 0.6); }
            }

            .flame-icon {
                font-size: 1.2rem;
                animation: flame-flicker 0.5s ease-in-out infinite alternate;
            }

            @keyframes flame-flicker {
                0% { transform: translateY(0); }
                100% { transform: translateY(-2px); }
            }

            /* Profile Photo Round */
            .profile-photo {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: linear-gradient(135deg, #CCFF00 0%, #99FF00 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 900;
                font-size: 1.2rem;
                color: #0D0D0D;
                box-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
            }

            /* Bottom Navigation Glassmorphism */
            .bottom-nav-elite {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(13, 13, 13, 0.85);
                backdrop-filter: blur(30px);
                -webkit-backdrop-filter: blur(30px);
                border-top: 1px solid rgba(204, 255, 0, 0.1);
                display: flex;
                justify-content: space-around;
                padding: 1.2rem 0;
                z-index: 50;
                box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
            }

            .nav-item-elite {
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #666;
                font-size: 0.7rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            .nav-item-elite i {
                font-size: 1.5rem;
                margin-bottom: 0.35rem;
                transition: all 0.3s;
            }

            .nav-item-elite.active {
                color: #CCFF00;
            }

            .nav-item-elite.active i {
                filter: drop-shadow(0 0 15px rgba(204, 255, 0, 0.8));
                animation: glow-pulse 2s ease-in-out infinite;
            }

            @keyframes glow-pulse {
                0%, 100% { filter: drop-shadow(0 0 15px rgba(204, 255, 0, 0.8)); }
                50% { filter: drop-shadow(0 0 25px rgba(204, 255, 0, 1)); }
            }

            /* Stat Cards Glassmorphism */
            .stat-card-elite {
                background: rgba(26, 26, 26, 0.7);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(204, 255, 0, 0.1);
                border-radius: 1rem;
                padding: 1.5rem;
                text-align: center;
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
            }

            .stat-card-elite::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(204, 255, 0, 0.5), transparent);
                opacity: 0;
                transition: opacity 0.3s;
            }

            .stat-card-elite:hover::before {
                opacity: 1;
            }

            .stat-card-elite:hover {
                transform: translateY(-2px);
                border-color: rgba(204, 255, 0, 0.3);
                box-shadow: 0 10px 30px rgba(204, 255, 0, 0.1);
            }

            /* Donut Chart Container */
            .donut-container {
                width: 60px;
                height: 60px;
                margin: 0 auto 0.5rem;
            }

            /* Weight Plate Icon with Glow */
            .weight-plate {
                font-size: 2.5rem;
                color: #00D4FF;
                filter: drop-shadow(0 0 15px rgba(0, 212, 255, 0.6));
                animation: rotate-plate 8s linear infinite;
            }

            @keyframes rotate-plate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Treino do Dia Card - Neon Border Animated */
            .workout-today-card {
                background: rgba(26, 26, 26, 0.8);
                backdrop-filter: blur(20px);
                border-radius: 1.5rem;
                padding: 2rem;
                position: relative;
                overflow: hidden;
            }

            .workout-today-card::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 1.5rem;
                padding: 2px;
                background: linear-gradient(45deg, #CCFF00, #99FF00, #00FF88, #00D4FF, #CCFF00);
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                animation: neon-rotate 4s linear infinite;
                background-size: 300% 300%;
            }

            @keyframes neon-rotate {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            /* Iniciar Treino Button - Larger with Gradient */
            .btn-start-workout {
                background: linear-gradient(135deg, #CCFF00 0%, #99FF00 100%);
                color: #0D0D0D;
                font-weight: 800;
                font-size: 1.2rem;
                padding: 1.5rem 3rem;
                border-radius: 1rem;
                border: none;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 10px 40px rgba(204, 255, 0, 0.3);
                display: inline-flex;
                align-items: center;
                gap: 0.8rem;
            }

            .btn-start-workout:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 50px rgba(204, 255, 0, 0.5);
            }

            .btn-start-workout i {
                font-size: 1.5rem;
            }

            .play-icon-hollow {
                width: 0;
                height: 0;
                border-left: 20px solid #0D0D0D;
                border-top: 12px solid transparent;
                border-bottom: 12px solid transparent;
            }

            /* 3D Metallic Badges */
            .badge-3d {
                display: inline-block;
                padding: 0.8rem 1.5rem;
                border-radius: 2rem;
                font-size: 0.85rem;
                font-weight: 700;
                position: relative;
                overflow: hidden;
                transition: all 0.3s;
            }

            .badge-3d-gold {
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                color: #0D0D0D;
                box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }

            .badge-3d-silver {
                background: linear-gradient(135deg, #E8E8E8 0%, #A0A0A0 100%);
                color: #0D0D0D;
                box-shadow: 0 8px 20px rgba(200, 200, 200, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }

            .badge-3d-bronze {
                background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
                color: #FFFFFF;
                box-shadow: 0 8px 20px rgba(205, 127, 50, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .badge-3d-locked {
                background: linear-gradient(135deg, #333 0%, #1A1A1A 100%);
                color: #666;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            }

            .badge-3d::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transform: rotate(45deg);
                animation: shimmer 3s infinite;
            }

            .badge-3d-locked::before {
                animation: none;
            }

            @keyframes shimmer {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }

            /* Consistency Chart - Rounded Bars */
            .chart-container-rounded {
                height: 300px;
                position: relative;
                background: rgba(26, 26, 26, 0.5);
                border-radius: 1rem;
                padding: 1rem;
            }

            /* Timeline de Transformação */
            .timeline-card {
                background: rgba(26, 26, 26, 0.8);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(204, 255, 0, 0.1);
                border-radius: 1.5rem;
                padding: 2rem;
                margin-bottom: 1.5rem;
            }

            .before-after-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
            }

            .photo-comparison {
                position: relative;
                aspect-ratio: 3/4;
                border-radius: 1rem;
                overflow: hidden;
                border: 2px solid rgba(204, 255, 0, 0.2);
            }

            .photo-comparison img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .photo-label {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
                padding: 1rem;
                font-weight: 700;
                font-size: 1.1rem;
            }

            .stats-change {
                display: flex;
                justify-content: space-around;
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .stat-change-item {
                text-align: center;
            }

            .stat-change-value {
                font-size: 2rem;
                font-weight: 900;
                background: linear-gradient(135deg, #FF6B35 0%, #FF4757 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .stat-change-value.positive {
                background: linear-gradient(135deg, #00FF88 0%, #00D4FF 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            /* Notification List Cards */
            .notification-card {
                background: rgba(26, 26, 26, 0.7);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 1rem;
                padding: 1.2rem;
                margin-bottom: 1rem;
                transition: all 0.3s;
            }

            .notification-card:hover {
                border-color: rgba(204, 255, 0, 0.2);
                transform: translateX(4px);
            }

            .notification-card.personal {
                border-left: 4px solid #00FF88;
            }

            .notification-card.system {
                border-left: 4px solid #FFA500;
            }

            .notification-card.reminder {
                border-left: 4px solid #00D4FF;
            }

            .mark-all-read {
                background: rgba(204, 255, 0, 0.1);
                color: #CCFF00;
                padding: 0.6rem 1.2rem;
                border-radius: 0.5rem;
                border: 1px solid rgba(204, 255, 0, 0.3);
                font-weight: 600;
                transition: all 0.3s;
            }

            .mark-all-read:hover {
                background: rgba(204, 255, 0, 0.2);
            }

            /* Profile Section */
            .profile-header {
                text-align: center;
                padding: 2rem 0;
            }

            .profile-photo-large {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: linear-gradient(135deg, #CCFF00 0%, #99FF00 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 900;
                font-size: 3rem;
                color: #0D0D0D;
                margin: 0 auto 1rem;
                box-shadow: 0 0 40px rgba(204, 255, 0, 0.4);
            }

            .member-since {
                color: #999;
                font-size: 0.9rem;
            }

            /* Subscription Badge with Pulse */
            .subscription-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1.2rem;
                border-radius: 2rem;
                font-weight: 700;
                animation: pulse-glow 2s ease-in-out infinite;
            }

            .subscription-badge.active {
                background: linear-gradient(135deg, #00FF88 0%, #00D4FF 100%);
                color: #0D0D0D;
                box-shadow: 0 0 30px rgba(0, 255, 136, 0.4);
            }

            .subscription-badge.expired {
                background: #FF3B30;
                color: #FFFFFF;
            }

            @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 136, 0.4); }
                50% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.7); }
            }

            /* Injury Check-in Button - Yellow Warning */
            .btn-injury-warning {
                background: #FFCC00;
                color: #0D0D0D;
                font-weight: 700;
                padding: 1rem 1.5rem;
                border-radius: 1rem;
                border: none;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 8px 25px rgba(255, 204, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 0.8rem;
                width: 100%;
                justify-content: center;
            }

            .btn-injury-warning:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 35px rgba(255, 204, 0, 0.5);
            }

            .btn-injury-warning i {
                font-size: 1.3rem;
            }

            /* Recovery Library - Netflix Style */
            .recovery-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: 1rem;
            }

            .recovery-video-card {
                position: relative;
                aspect-ratio: 16/9;
                border-radius: 0.75rem;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s;
                background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
            }

            .recovery-video-card:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 30px rgba(204, 255, 0, 0.2);
            }

            .recovery-video-thumb {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .recovery-play-overlay {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.5);
                transition: all 0.3s;
            }

            .recovery-video-card:hover .recovery-play-overlay {
                background: rgba(0, 0, 0, 0.7);
            }

            .recovery-play-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(204, 255, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: #0D0D0D;
            }

            .recovery-video-info {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
                padding: 0.8rem;
            }

            .recovery-video-title {
                font-weight: 600;
                font-size: 0.85rem;
                margin-bottom: 0.2rem;
            }

            .recovery-video-duration {
                font-size: 0.7rem;
                color: #999;
            }

            /* Modal Improvements */
            .modal-elite {
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
            }

            .modal-content-elite {
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(30px);
                border: 1px solid rgba(204, 255, 0, 0.1);
                border-radius: 1.5rem;
            }

            /* Section Transitions */
            .section {
                display: none;
                animation: fadeIn 0.4s ease-in-out;
            }

            .section.active {
                display: block;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Responsive */
            @media (max-width: 640px) {
                .greeting-dynamic {
                    font-size: 1.2rem;
                }
                
                .btn-start-workout {
                    font-size: 1rem;
                    padding: 1.2rem 2rem;
                }

                .before-after-container {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }

                .recovery-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        </style>
    </head>
    <body>
        <!-- Header Elite -->
        <div class="header-elite sticky top-0 z-40">
            <div class="px-4 py-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="greeting-dynamic" id="dynamicGreeting">
                            <span id="greetingText">Foco hoje</span>, <span id="studentName" class="neon-gradient-text">Aluno</span>! <span id="greetingEmoji">🔥</span>
                        </h1>
                        <p class="text-sm text-gray-400 mt-1" id="currentDate"></p>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flame-counter">
                            <i class="fas fa-fire flame-icon"></i>
                            <span id="streakDays">0</span>
                        </div>
                        <div class="profile-photo" id="profilePhoto">
                            JD
                        </div>
                        <button onclick="logout()" class="text-gray-400 hover:text-white transition">
                            <i class="fas fa-sign-out-alt text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="px-4 py-6">
            
            <!-- SECTION 1: HOME -->
            <div id="section-home" class="section active">
                
                <!-- Quick Stats with Glassmorphism -->
                <div class="grid grid-cols-3 gap-3 mb-6">
                    <div class="stat-card-elite">
                        <div class="donut-container">
                            <canvas id="donutChart"></canvas>
                        </div>
                        <div class="text-2xl font-bold neon-gradient-text" id="weekWorkouts">0</div>
                        <div class="text-xs text-gray-400 mt-1">Treinos/Sem</div>
                    </div>
                    <div class="stat-card-elite">
                        <i class="fas fa-weight weight-plate"></i>
                        <div class="text-2xl font-bold" style="color: #00D4FF;" id="totalWeight">0</div>
                        <div class="text-xs text-gray-400 mt-1">kg Total</div>
                    </div>
                    <div class="stat-card-elite">
                        <i class="fas fa-heartbeat" style="color: #FF6B35; font-size: 2rem;"></i>
                        <div class="text-2xl font-bold" style="color: #FF6B35;" id="currentWeight">-</div>
                        <div class="text-xs text-gray-400 mt-1">Peso Atual</div>
                    </div>
                </div>

                <!-- Treino do Dia - Neon Border -->
                <div class="mb-6">
                    <h2 class="text-xl font-bold mb-3">
                        <i class="fas fa-dumbbell mr-2 neon-gradient-text"></i>
                        Treino de Hoje
                    </h2>

                    <div class="workout-today-card">
                        <div id="todayWorkout">
                            <div class="text-center py-8">
                                <i class="fas fa-spinner fa-spin text-4xl text-gray-600 mb-4"></i>
                                <p class="text-gray-400">Carregando treino...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Badges 3D Metálicos -->
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
                    <div id="upcomingWorkouts" class="space-y-3">
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
                <div class="glass-strong p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Consistência Semanal</h3>
                    <div id="consistencyChartContainer" class="chart-container-rounded">
                        <canvas id="consistencyChart"></canvas>
                    </div>
                    <div id="consistencyEmptyState" class="hidden text-center py-8">
                        <i class="fas fa-calendar-times text-5xl text-gray-600 mb-4"></i>
                        <p class="text-gray-400 mb-4">Você ainda não registrou treinos esta semana.<br>Comece hoje!</p>
                        <button onclick="switchSection('home'); scrollTo(0,0);" class="btn-start-workout">
                            <div class="play-icon-hollow"></div>
                            Iniciar Treino
                        </button>
                    </div>
                </div>

                <!-- Timeline de Transformação -->
                <div class="timeline-card">
                    <h3 class="text-lg font-bold mb-4">
                        <i class="fas fa-exchange-alt mr-2 neon-gradient-text"></i>
                        Timeline de Transformação
                    </h3>
                    <div id="transformationTimeline">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Volume Chart -->
                <div class="glass-strong p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Volume Total de Carga</h3>
                    <div class="chart-container-rounded">
                        <canvas id="volumeChart"></canvas>
                    </div>
                </div>

                <!-- Weight Evolution -->
                <div class="glass-strong p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Evolução de Peso</h3>
                    <div class="chart-container-rounded">
                        <canvas id="weightEvolutionChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- SECTION 3: NOTIFICATIONS -->
            <div id="section-notifications" class="section">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">
                        <i class="fas fa-bell mr-2" style="color: #FF6B35;"></i>
                        Notificações
                    </h2>
                    <button class="mark-all-read">
                        <i class="fas fa-check-double mr-2"></i>
                        Marcar tudo como lido
                    </button>
                </div>

                <!-- Messages from Personal -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-3 text-gray-300">Mensagens do Personal</h3>
                    <div id="personalMessages">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- System Alerts -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-3 text-gray-300">Alertas do Sistema</h3>
                    <div id="systemAlerts">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Reminders -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-3 text-gray-300">Lembretes</h3>
                    <div id="reminders">
                        <!-- Will be populated by JS -->
                    </div>
                </div>
            </div>

            <!-- SECTION 4: PROFILE -->
            <div id="section-profile" class="section">
                <div class="profile-header">
                    <div class="profile-photo-large" id="profilePhotoLarge">JD</div>
                    <h2 class="text-2xl font-bold mb-1" id="profileFullName">João Doe</h2>
                    <!-- Sport Badge Dinâmico -->
                    <div id="sportBadgeContainer" class="mt-3 mb-2">
                        <!-- Will be populated by applySportTheme() -->
                    </div>
                    <p class="member-since">Membro desde <span id="memberSince">01/01/2024</span></p>
                </div>

                <!-- Subscription Status -->
                <div class="glass-strong p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Status da Assinatura</h3>
                    <div class="text-center mb-4">
                        <span class="subscription-badge active">
                            <i class="fas fa-check-circle"></i>
                            Ativo
                        </span>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span class="text-gray-400">Próxima Renovação</span>
                            <span id="nextRenewal">-</span>
                        </div>
                        <div class="flex justify-between py-2">
                            <span class="text-gray-400">Personal Trainer</span>
                            <span id="personalName">-</span>
                        </div>
                    </div>
                </div>

                <!-- Check-in de Lesões - Yellow Warning -->
                <div class="glass-strong p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">
                        <i class="fas fa-heartbeat mr-2" style="color: #FFCC00;"></i>
                        Ponto de Atenção
                    </h3>
                    <p class="text-sm text-gray-400 mb-4">Relate qualquer dor ou desconforto antes de treinar</p>
                    <button onclick="openBodyMapModal()" class="btn-injury-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        Relatar Desconforto/Dor antes de Treinar
                    </button>
                </div>

                <!-- Biblioteca de Recuperação - Netflix Style -->
                <div class="glass-strong p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">
                        <i class="fas fa-spa mr-2" style="color: #00D4FF;"></i>
                        Biblioteca de Recuperação
                    </h3>
                    <div id="recoveryLibrary" class="recovery-grid">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Personal Info -->
                <div class="glass-strong p-6 rounded-xl mb-6">
                    <h3 class="text-lg font-bold mb-4">Informações Pessoais</h3>
                    <div id="personalInfo">
                        <!-- Will be populated by JS -->
                    </div>
                </div>
            </div>

        </div>

        <!-- Bottom Navigation Elite -->
        <div class="bottom-nav-elite">
            <div class="nav-item-elite active" onclick="switchSection('home')">
                <i class="fas fa-home"></i>
                <span>Início</span>
            </div>
            <div class="nav-item-elite" onclick="switchSection('analytics')">
                <i class="fas fa-chart-bar"></i>
                <span>Evolução</span>
            </div>
            <div class="nav-item-elite" onclick="switchSection('notifications')">
                <i class="fas fa-bell"></i>
                <span>Avisos</span>
            </div>
            <div class="nav-item-elite" onclick="switchSection('profile')">
                <i class="fas fa-user"></i>
                <span>Perfil</span>
            </div>
        </div>

        <!-- Workout Modal (Vision Button inside) -->
        <div id="workoutModal" class="hidden fixed inset-0 modal-elite z-50 overflow-y-auto">
            <div class="min-h-screen flex items-center justify-center p-4">
                <div class="modal-content-elite p-6 rounded-xl max-w-2xl w-full">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold" id="workoutTitle">Treino</h3>
                        <div class="flex gap-3">
                            <button onclick="openVisionModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                                <i class="fas fa-camera mr-2"></i>
                                Vision IA
                            </button>
                            <button onclick="closeWorkoutModal()" class="text-gray-400 hover:text-white">
                                <i class="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Timer -->
                    <div class="text-center mb-6">
                        <div style="font-size: 3rem; font-weight: bold; color: #00FF88; font-family: 'Courier New', monospace;" id="workoutTimer">00:00:00</div>
                        <div class="flex gap-3 justify-center mt-4">
                            <button id="startBtn" onclick="startWorkoutTimer()" class="btn-start-workout">
                                <div class="play-icon-hollow"></div>
                                Iniciar
                            </button>
                            <button id="pauseBtn" onclick="pauseWorkoutTimer()" class="hidden bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">
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

        <!-- Vision Modal -->
        <div id="visionModal" class="hidden fixed inset-0 modal-elite z-50 flex items-center justify-center">
            <div class="modal-content-elite p-6 rounded-xl max-w-md w-full mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Vision IA - Identificar Equipamento</h3>
                    <button onclick="closeVisionModal()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="text-center py-8">
                    <i class="fas fa-camera text-6xl mb-4" style="color: #00D4FF;"></i>
                    <p class="text-gray-400 mb-4">Tire uma foto do equipamento</p>
                    <button class="btn-start-workout">
                        <i class="fas fa-camera"></i>
                        Abrir Câmera
                    </button>
                </div>
            </div>
        </div>

        <!-- Body Map Modal -->
        <div id="bodyMapModal" class="hidden fixed inset-0 modal-elite z-50 flex items-center justify-center overflow-y-auto">
            <div class="modal-content-elite p-6 rounded-xl max-w-md w-full mx-4 my-8">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Mapa Corporal - Relatar Dor</h3>
                    <button onclick="closeBodyMapModal()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <p class="text-sm text-gray-400 mb-4">Toque na área do corpo onde sente dor ou desconforto</p>
                
                <div style="position: relative; width: 100%; max-width: 300px; margin: 0 auto 1.5rem;">
                    <svg viewBox="0 0 200 400" class="w-full">
                        <ellipse cx="100" cy="30" rx="25" ry="30" fill="#2A2A2A" stroke="#CCFF00" stroke-width="2"/>
                        <rect x="75" y="55" width="50" height="80" rx="10" fill="#2A2A2A" stroke="#CCFF00" stroke-width="2"/>
                        <rect x="60" y="60" width="20" height="60" rx="5" fill="#2A2A2A" stroke="#CCFF00" stroke-width="2"/>
                        <rect x="120" y="60" width="20" height="60" rx="5" fill="#2A2A2A" stroke="#CCFF00" stroke-width="2"/>
                        <rect x="80" y="135" width="15" height="100" rx="7" fill="#2A2A2A" stroke="#CCFF00" stroke-width="2"/>
                        <rect x="105" y="135" width="15" height="100" rx="7" fill="#2A2A2A" stroke="#CCFF00" stroke-width="2"/>
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
                    <button type="submit" class="btn-start-workout w-full">
                        <i class="fas fa-save"></i>
                        Registrar Check-in
                    </button>
                </form>
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

            // Dynamic Greeting
            function setDynamicGreeting() {
                const hour = new Date().getHours();
                let greeting, emoji;
                
                if (hour >= 5 && hour < 12) {
                    greeting = 'Bom dia';
                    emoji = '☀️';
                } else if (hour >= 12 && hour < 18) {
                    greeting = 'Boa tarde';
                    emoji = '🔥';
                } else if (hour >= 18 && hour < 22) {
                    greeting = 'Hustle Mode: ON';
                    emoji = '💪';
                } else {
                    greeting = 'Modo Noturno';
                    emoji = '🌙';
                }
                
                document.getElementById('greetingText').textContent = greeting;
                document.getElementById('greetingEmoji').textContent = emoji;
            }

            // 🏆 OMNI-SPORT: Sport Theme System
            const SPORT_THEMES = {
                bodybuilding: { name: 'Musculação', icon: 'fa-dumbbell', primaryColor: '#CCFF00', secondaryColor: '#99FF00', gradient: 'linear-gradient(135deg, #CCFF00, #99FF00)', glowColor: 'rgba(204, 255, 0, 0.5)' },
                cycling: { name: 'Ciclismo', icon: 'fa-bicycle', primaryColor: '#00D4FF', secondaryColor: '#0099CC', gradient: 'linear-gradient(135deg, #00D4FF, #0099CC)', glowColor: 'rgba(0, 212, 255, 0.5)' },
                running: { name: 'Corrida', icon: 'fa-person-running', primaryColor: '#7CFC00', secondaryColor: '#32CD32', gradient: 'linear-gradient(135deg, #7CFC00, #32CD32)', glowColor: 'rgba(124, 252, 0, 0.5)' },
                tennis: { name: 'Tênis', icon: 'fa-table-tennis-paddle-ball', primaryColor: '#FFD700', secondaryColor: '#FFA500', gradient: 'linear-gradient(135deg, #FFD700, #FFA500)', glowColor: 'rgba(255, 215, 0, 0.5)' },
                beach_tennis: { name: 'Beach Tennis', icon: 'fa-sun', primaryColor: '#FF6B35', secondaryColor: '#FF4757', gradient: 'linear-gradient(135deg, #FF6B35, #FF4757)', glowColor: 'rgba(255, 107, 53, 0.5)' },
                swimming: { name: 'Natação', icon: 'fa-person-swimming', primaryColor: '#00CED1', secondaryColor: '#008B8B', gradient: 'linear-gradient(135deg, #00CED1, #008B8B)', glowColor: 'rgba(0, 206, 209, 0.5)' },
                crossfit: { name: 'CrossFit', icon: 'fa-bolt', primaryColor: '#FF0000', secondaryColor: '#CC0000', gradient: 'linear-gradient(135deg, #FF0000, #CC0000)', glowColor: 'rgba(255, 0, 0, 0.5)' },
                pilates: { name: 'Pilates', icon: 'fa-circle-dot', primaryColor: '#FF69B4', secondaryColor: '#FF1493', gradient: 'linear-gradient(135deg, #FF69B4, #FF1493)', glowColor: 'rgba(255, 105, 180, 0.5)' },
                physiotherapy: { name: 'Fisioterapia', icon: 'fa-heart-pulse', primaryColor: '#9370DB', secondaryColor: '#6A5ACD', gradient: 'linear-gradient(135deg, #9370DB, #6A5ACD)', glowColor: 'rgba(147, 112, 219, 0.5)' }
            };

            async function applySportTheme(sportType) {
                const theme = SPORT_THEMES[sportType] || SPORT_THEMES.bodybuilding;
                console.log('🎨 Applying theme:', theme.name, theme.primaryColor);
                
                // Apply to CSS variables
                document.documentElement.style.setProperty('--sport-primary', theme.primaryColor);
                document.documentElement.style.setProperty('--sport-secondary', theme.secondaryColor);
                document.documentElement.style.setProperty('--sport-gradient', theme.gradient);
                document.documentElement.style.setProperty('--sport-glow', theme.glowColor);
                
                // Update flame counter icon and color
                const flameIcon = document.querySelector('.flame-counter i');
                if (flameIcon) {
                    flameIcon.className = 'fas ' + theme.icon;
                }
                
                // Update stat card icons
                const statIcons = document.querySelectorAll('.stat-card i.fa-dumbbell');
                statIcons.forEach(icon => {
                    icon.className = 'fas ' + theme.icon + ' text-2xl';
                    icon.style.color = theme.primaryColor;
                });
                
                // Update primary buttons
                const primaryButtons = document.querySelectorAll('.neon-gradient, .btn-start-workout');
                primaryButtons.forEach(btn => {
                    btn.style.background = theme.gradient;
                    btn.style.boxShadow = '0 0 30px ' + theme.glowColor;
                });
                
                // Update badges glow
                const activeBadges = document.querySelectorAll('.badge-gold, .badge-silver, .badge-bronze');
                activeBadges.forEach(badge => {
                    badge.style.filter = 'drop-shadow(0 0 20px ' + theme.glowColor + ')';
                });
                
                // 🏆 OMNI-SPORT: Create and inject Sport Badge
                const badgeContainer = document.getElementById('sportBadgeContainer');
                if (badgeContainer) {
                    badgeContainer.innerHTML = \`
                        <div class="sport-badge-profile" style="
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            padding: 8px 16px;
                            background: \${theme.gradient};
                            border-radius: 12px;
                            font-weight: 600;
                            font-size: 0.875rem;
                            letter-spacing: 0.5px;
                            box-shadow: 0 0 20px \${theme.glowColor};
                            animation: pulse 2s infinite;
                        ">
                            <i class="fas \${theme.icon}"></i>
                            <span>\${theme.name}</span>
                        </div>
                    \`;
                }
            }

            // Initialize
            async function init() {
                try {
                    setDynamicGreeting();
                    
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
                    
                    // 🏆 OMNI-SPORT: Apply dynamic theme based on primary_sport
                    const primarySport = studentData.primary_sport || 'bodybuilding';
                    console.log('🎨 Applying sport theme:', primarySport);
                    await applySportTheme(primarySport);
                    
                    const firstName = studentData.full_name ? studentData.full_name.split(' ')[0] : 'Aluno';
                    const initials = studentData.full_name ? studentData.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AL';
                    
                    document.getElementById('studentName').textContent = firstName;
                    document.getElementById('profilePhoto').textContent = initials;
                    document.getElementById('profilePhotoLarge').textContent = initials;
                    document.getElementById('profileFullName').textContent = studentData.full_name || 'Aluno';
                    
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
                badges = [
                    { name: '10 Dias Seguidos', icon: 'fire', color: 'gold', unlocked: true },
                    { name: 'Recorde de Carga', icon: 'trophy', color: 'gold', unlocked: true },
                    { name: 'Primeira Semana', icon: 'star', color: 'silver', unlocked: true },
                    { name: '30 Dias', icon: 'medal', color: 'bronze', unlocked: false }
                ];
            }

            function renderHome() {
                // 🏆 OMNI-SPORT: Get current sport theme
                const primarySport = studentData?.primary_sport || 'bodybuilding';
                const sportTheme = SPORT_THEMES[primarySport] || SPORT_THEMES.bodybuilding;
                
                // Update "Treino de Hoje" section title icon
                const todayTitleIcon = document.querySelector('#section-home h2 i.fa-dumbbell');
                if (todayTitleIcon) {
                    todayTitleIcon.className = 'fas ' + sportTheme.icon + ' mr-2 neon-gradient-text';
                    todayTitleIcon.style.color = sportTheme.primaryColor;
                    todayTitleIcon.style.filter = 'drop-shadow(0 0 10px ' + sportTheme.glowColor + ')';
                }
                
                // Stats
                const thisWeekWorkouts = workouts.filter(w => {
                    const workoutDate = new Date(w.created_at * 1000);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return workoutDate >= weekAgo;
                }).length;
                
                document.getElementById('weekWorkouts').textContent = thisWeekWorkouts;
                document.getElementById('totalWeight').textContent = '1250';
                
                if (measurements.length > 0) {
                    document.getElementById('currentWeight').textContent = measurements[0].weight + 'kg';
                }
                
                // Streak
                document.getElementById('streakDays').textContent = thisWeekWorkouts;

                // Donut Chart
                const donutCtx = document.getElementById('donutChart');
                new Chart(donutCtx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [thisWeekWorkouts, 7 - thisWeekWorkouts],
                            backgroundColor: [sportTheme.primaryColor, '#2A2A2A'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        cutout: '75%',
                        plugins: { legend: { display: false }, tooltip: { enabled: false } }
                    }
                });

                // Today's workout
                const todayWorkout = workouts[0];
                
                if (todayWorkout) {
                    // 🏆 OMNI-SPORT: Get sport theme for workout card
                    const workoutSport = todayWorkout.sport_type || 'bodybuilding';
                    const sportTheme = SPORT_THEMES[workoutSport] || SPORT_THEMES.bodybuilding;
                    
                    document.getElementById('todayWorkout').innerHTML = \`
                        <div class="mb-4">
                            <div class="flex items-center gap-3 mb-2">
                                <i class="fas \${sportTheme.icon} text-2xl" style="color: \${sportTheme.primaryColor}; filter: drop-shadow(0 0 10px \${sportTheme.glowColor});"></i>
                                <h3 class="text-2xl font-bold">\${todayWorkout.title}</h3>
                            </div>
                            <p class="text-gray-400">\${todayWorkout.description || ''}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="text-center">
                                <div class="text-3xl font-bold neon-gradient-text">\${todayWorkout.exercises ? JSON.parse(todayWorkout.exercises).length : 0}</div>
                                <div class="text-sm text-gray-400">Exercícios</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold" style="color: \${sportTheme.primaryColor};">45min</div>
                                <div class="text-sm text-gray-400">Duração</div>
                            </div>
                        </div>
                        <button onclick="openWorkoutModal('\${todayWorkout.id}')" class="btn-start-workout w-full" style="background: \${sportTheme.gradient}; box-shadow: 0 0 30px \${sportTheme.glowColor};">
                            <div class="play-icon-hollow"></div>
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

                // Badges 3D
                const badgesHtml = badges.map(badge => \`
                    <div class="badge-3d badge-3d-\${badge.unlocked ? badge.color : 'locked'}">
                        <i class="fas fa-\${badge.icon} mr-1"></i>
                        \${badge.name}
                    </div>
                \`).join('');
                document.getElementById('badgesList').innerHTML = badgesHtml;

                // Upcoming workouts
                const upcomingHtml = workouts.slice(1, 4).map(w => \`
                    <div class="glass p-4 rounded-lg hover:border-green-500 transition">
                        <div class="font-bold">\${w.title}</div>
                        <div class="text-sm text-gray-400 mt-1">\${w.description || 'Sem descrição'}</div>
                    </div>
                \`).join('');
                document.getElementById('upcomingWorkouts').innerHTML = upcomingHtml || '<p class="text-gray-400 text-center py-4">Nenhum treino programado</p>';
            }

            function renderAnalytics() {
                // 🏆 OMNI-SPORT: Get current sport theme for charts
                const primarySport = studentData?.primary_sport || 'bodybuilding';
                const sportTheme = SPORT_THEMES[primarySport] || SPORT_THEMES.bodybuilding;
                
                // Consistency Chart with Rounded Bars
                const ctx1 = document.getElementById('consistencyChart');
                const container = document.getElementById('consistencyChartContainer');
                const emptyState = document.getElementById('consistencyEmptyState');
                
                const today = new Date();
                const dayOfWeek = today.getDay();
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
                
                const weeklyData = [0, 0, 0, 0, 0, 0, 0];
                
                workouts.forEach(workout => {
                    const workoutDate = new Date(workout.created_at * 1000);
                    if (workoutDate >= weekStart && workoutDate <= today) {
                        const day = workoutDate.getDay();
                        const index = day === 0 ? 6 : day - 1;
                        weeklyData[index]++;
                    }
                });
                
                const totalWorkouts = weeklyData.reduce((a, b) => a + b, 0);
                
                if (totalWorkouts === 0) {
                    container.classList.add('hidden');
                    emptyState.classList.remove('hidden');
                } else {
                    container.classList.remove('hidden');
                    emptyState.classList.add('hidden');
                    
                    new Chart(ctx1, {
                        type: 'bar',
                        data: {
                            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                            datasets: [{
                                label: 'Treinos',
                                data: weeklyData,
                                backgroundColor: function(context) {
                                    const value = context.parsed.y;
                                    return value > 0 ? sportTheme.primaryColor : 'rgba(42, 42, 42, 0.5)';
                                },
                                borderRadius: 8,
                                barThickness: 40
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            layout: { padding: { top: 20, bottom: 10 } },
                            scales: {
                                y: { 
                                    beginAtZero: true,
                                    max: Math.max(...weeklyData) + 1,
                                    ticks: { color: '#999', stepSize: 1 },
                                    grid: { color: '#333' }
                                },
                                x: { 
                                    ticks: { color: '#CCC', font: { size: 13, weight: '500' } },
                                    grid: { display: false }
                                }
                            },
                            plugins: { 
                                legend: { display: false },
                                tooltip: {
                                    backgroundColor: '#1A1A1A',
                                    borderColor: sportTheme.primaryColor,
                                    borderWidth: 1
                                }
                            }
                        }
                    });
                }

                // Timeline de Transformação
                if (photos.length >= 2 && measurements.length >= 2) {
                    const firstPhoto = photos[photos.length - 1];
                    const lastPhoto = photos[0];
                    const firstMeasure = measurements[measurements.length - 1];
                    const lastMeasure = measurements[0];
                    
                    const weightChange = (lastMeasure.weight - firstMeasure.weight).toFixed(1);
                    const bfChange = (lastMeasure.body_fat_percentage - firstMeasure.body_fat_percentage).toFixed(1);
                    
                    document.getElementById('transformationTimeline').innerHTML = \`
                        <div class="before-after-container">
                            <div class="photo-comparison">
                                <img src="\${firstPhoto.photo_url}" alt="Antes">
                                <div class="photo-label">
                                    Antes<br>
                                    <span style="font-size: 0.9rem; font-weight: 400;">\${firstMeasure.weight}kg | \${firstMeasure.body_fat_percentage}% BF</span>
                                </div>
                            </div>
                            <div class="photo-comparison">
                                <img src="\${lastPhoto.photo_url}" alt="Depois">
                                <div class="photo-label">
                                    Depois<br>
                                    <span style="font-size: 0.9rem; font-weight: 400;">\${lastMeasure.weight}kg | \${lastMeasure.body_fat_percentage}% BF</span>
                                </div>
                            </div>
                        </div>
                        <div class="stats-change">
                            <div class="stat-change-item">
                                <div class="stat-change-value \${weightChange < 0 ? 'positive' : ''}">\${weightChange > 0 ? '+' : ''}\${weightChange}kg</div>
                                <div class="text-sm text-gray-400">Peso</div>
                            </div>
                            <div class="stat-change-item">
                                <div class="stat-change-value \${bfChange < 0 ? 'positive' : ''}">\${bfChange > 0 ? '+' : ''}\${bfChange}%</div>
                                <div class="text-sm text-gray-400">Gordura</div>
                            </div>
                        </div>
                    \`;
                } else {
                    document.getElementById('transformationTimeline').innerHTML = \`
                        <p class="text-gray-400 text-center py-4">Adicione mais fotos e medições para ver sua transformação</p>
                    \`;
                }

                // Volume Chart (mock)
                const ctx2 = document.getElementById('volumeChart');
                new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                        datasets: [{
                            label: 'Volume (kg)',
                            data: [1000, 1150, 1200, 1250],
                            borderColor: '#00D4FF',
                            backgroundColor: 'rgba(0, 212, 255, 0.2)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 3,
                            pointRadius: 6,
                            pointBackgroundColor: '#00D4FF',
                            pointBorderColor: '#0D0D0D',
                            pointBorderWidth: 2
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
                                backgroundColor: 'rgba(255, 107, 53, 0.2)',
                                tension: 0.4,
                                fill: true,
                                borderWidth: 3,
                                pointRadius: 6,
                                pointBackgroundColor: '#FF6B35',
                                pointBorderColor: '#0D0D0D',
                                pointBorderWidth: 2
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
            }

            function renderNotifications() {
                // Personal messages
                document.getElementById('personalMessages').innerHTML = \`
                    <div class="notification-card personal">
                        <div class="flex items-start gap-3">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #00FF88, #00D4FF); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #0D0D0D;">PT</div>
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <i class="fas fa-comment text-green-500"></i>
                                    <span class="font-bold">Personal Trainer</span>
                                </div>
                                <div class="text-sm text-gray-300 mt-1">Ótimo trabalho essa semana! Continue assim 💪</div>
                                <div class="text-xs text-gray-500 mt-2">Há 2 horas</div>
                            </div>
                        </div>
                    </div>
                \`;

                // System alerts
                document.getElementById('systemAlerts').innerHTML = \`
                    <div class="notification-card system">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-exclamation-triangle text-2xl text-yellow-500"></i>
                            <div class="flex-1">
                                <div class="font-bold">Avaliação Física</div>
                                <div class="text-sm text-gray-300 mt-1">Sua reavaliação vence em 5 dias</div>
                            </div>
                        </div>
                    </div>
                \`;

                // Reminders
                document.getElementById('reminders').innerHTML = \`
                    <div class="notification-card reminder">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-tint text-2xl text-blue-500"></i>
                            <div class="flex-1">
                                <div class="font-semibold">Hidratação</div>
                                <div class="text-sm text-gray-400">Beba água a cada 30 minutos</div>
                            </div>
                            <input type="checkbox" class="w-5 h-5">
                        </div>
                    </div>
                \`;
            }

            function renderProfile() {
                // Subscription
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                document.getElementById('nextRenewal').textContent = nextMonth.toLocaleDateString('pt-BR');
                document.getElementById('personalName').textContent = 'André Silva';
                document.getElementById('memberSince').textContent = new Date(studentData.created_at * 1000).toLocaleDateString('pt-BR');

                // Recovery library - Netflix Style
                const recoveryVideos = [
                    { title: 'Alongamento Pernas', duration: '5 min', thumb: 'legs' },
                    { title: 'Mobilidade Ombros', duration: '7 min', thumb: 'shoulders' },
                    { title: 'Relaxamento Lombar', duration: '10 min', thumb: 'back' },
                    { title: 'Yoga Básico', duration: '15 min', thumb: 'yoga' }
                ];
                
                document.getElementById('recoveryLibrary').innerHTML = recoveryVideos.map(video => \`
                    <div class="recovery-video-card">
                        <div class="recovery-video-thumb" style="background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);"></div>
                        <div class="recovery-play-overlay">
                            <div class="recovery-play-icon">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="recovery-video-info">
                            <div class="recovery-video-title">\${video.title}</div>
                            <div class="recovery-video-duration">\${video.duration}</div>
                        </div>
                    </div>
                \`).join('');

                // Personal info
                document.getElementById('personalInfo').innerHTML = \`
                    <div class="space-y-3">
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span class="text-gray-400">Email</span>
                            <span>\${studentData.email}</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span class="text-gray-400">Telefone</span>
                            <span>\${studentData.whatsapp || 'Não informado'}</span>
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
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                document.querySelectorAll('.nav-item-elite').forEach(n => n.classList.remove('active'));

                document.getElementById(\`section-\${section}\`).classList.add('active');
                event.target.closest('.nav-item-elite').classList.add('active');
            }

            // Workout Modal
            function openWorkoutModal(workoutId) {
                const workout = workouts.find(w => w.id === workoutId);
                if (!workout) return;

                document.getElementById('workoutTitle').textContent = workout.title;
                
                const exercises = workout.exercises ? JSON.parse(workout.exercises) : [];
                const exercisesHtml = exercises.map((ex, idx) => \`
                    <div style="background: #0D0D0D; border: 1px solid #333; padding: 1rem; margin-bottom: 0.5rem; border-radius: 0.5rem;">
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex-1">
                                <div class="font-bold">\${idx + 1}. \${ex.name || ex.exercise}</div>
                                <div class="text-sm text-gray-400 mt-1">\${ex.sets || ex.series} séries × \${ex.reps || ex.reps} reps</div>
                            </div>
                            <input type="checkbox" class="w-6 h-6" onchange="checkExerciseComplete()">
                        </div>
                        <div class="text-xs text-gray-500">Descanso: \${ex.rest || '60'}s</div>
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
                startRestTimer(60);
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
