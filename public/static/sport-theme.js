/**
 * ForteTrain - Sport Theme System
 * Dynamic UI theming based on sport_type
 * Elite "Carbon Performance" Design System
 */

const SPORT_THEMES = {
  bodybuilding: {
    name: 'Musculação',
    icon: 'fa-dumbbell',
    primaryColor: '#CCFF00',
    secondaryColor: '#99FF00',
    gradient: 'linear-gradient(135deg, #CCFF00, #99FF00)',
    iconBg: '#1A1A1A',
    glowColor: 'rgba(204, 255, 0, 0.5)'
  },
  cycling: {
    name: 'Ciclismo',
    icon: 'fa-bicycle',
    primaryColor: '#00D4FF',
    secondaryColor: '#0099CC',
    gradient: 'linear-gradient(135deg, #00D4FF, #0099CC)',
    iconBg: '#0A1929',
    glowColor: 'rgba(0, 212, 255, 0.5)'
  },
  running: {
    name: 'Corrida',
    icon: 'fa-person-running',
    primaryColor: '#7CFC00',
    secondaryColor: '#32CD32',
    gradient: 'linear-gradient(135deg, #7CFC00, #32CD32)',
    iconBg: '#0F1F00',
    glowColor: 'rgba(124, 252, 0, 0.5)'
  },
  tennis: {
    name: 'Tênis',
    icon: 'fa-table-tennis-paddle-ball',
    primaryColor: '#FFD700',
    secondaryColor: '#FFA500',
    gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
    iconBg: '#1A1500',
    glowColor: 'rgba(255, 215, 0, 0.5)'
  },
  beach_tennis: {
    name: 'Beach Tennis',
    icon: 'fa-sun',
    primaryColor: '#FF6B35',
    secondaryColor: '#FF4757',
    gradient: 'linear-gradient(135deg, #FF6B35, #FF4757)',
    iconBg: '#1F0A00',
    glowColor: 'rgba(255, 107, 53, 0.5)'
  },
  swimming: {
    name: 'Natação',
    icon: 'fa-person-swimming',
    primaryColor: '#00CED1',
    secondaryColor: '#008B8B',
    gradient: 'linear-gradient(135deg, #00CED1, #008B8B)',
    iconBg: '#001F1F',
    glowColor: 'rgba(0, 206, 209, 0.5)'
  },
  crossfit: {
    name: 'CrossFit',
    icon: 'fa-bolt',
    primaryColor: '#FF0000',
    secondaryColor: '#CC0000',
    gradient: 'linear-gradient(135deg, #FF0000, #CC0000)',
    iconBg: '#1F0000',
    glowColor: 'rgba(255, 0, 0, 0.5)'
  },
  pilates: {
    name: 'Pilates',
    icon: 'fa-circle-dot',
    primaryColor: '#FF69B4',
    secondaryColor: '#FF1493',
    gradient: 'linear-gradient(135deg, #FF69B4, #FF1493)',
    iconBg: '#1F0A15',
    glowColor: 'rgba(255, 105, 180, 0.5)'
  },
  physiotherapy: {
    name: 'Fisioterapia',
    icon: 'fa-heart-pulse',
    primaryColor: '#9370DB',
    secondaryColor: '#6A5ACD',
    gradient: 'linear-gradient(135deg, #9370DB, #6A5ACD)',
    iconBg: '#0F0A1F',
    glowColor: 'rgba(147, 112, 219, 0.5)'
  }
};

/**
 * Get sport theme configuration
 * @param {string} sportType - Sport type identifier
 * @returns {object} Theme configuration object
 */
function getSportTheme(sportType) {
  return SPORT_THEMES[sportType] || SPORT_THEMES.bodybuilding;
}

/**
 * Apply sport theme to an element
 * @param {HTMLElement} element - Target element
 * @param {string} sportType - Sport type identifier
 * @param {object} options - Theming options
 */
function applySportTheme(element, sportType, options = {}) {
  const theme = getSportTheme(sportType);
  
  if (options.applyGradient) {
    element.style.background = theme.gradient;
  }
  
  if (options.applyPrimaryColor) {
    element.style.backgroundColor = theme.primaryColor;
  }
  
  if (options.applyTextColor) {
    element.style.color = theme.primaryColor;
  }
  
  if (options.applyBorderColor) {
    element.style.borderColor = theme.primaryColor;
  }
  
  if (options.applyGlow) {
    element.style.boxShadow = `0 0 20px ${theme.glowColor}, 0 0 40px ${theme.glowColor}`;
  }
  
  if (options.icon && element.querySelector('i')) {
    const iconElement = element.querySelector('i');
    iconElement.className = `fas ${theme.icon} ${options.iconClass || ''}`;
  }
  
  return theme;
}

/**
 * Create sport badge HTML
 * @param {string} sportType - Sport type identifier
 * @param {object} options - Badge options
 * @returns {string} HTML string
 */
function createSportBadge(sportType, options = {}) {
  const theme = getSportTheme(sportType);
  const size = options.size || 'md';
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl'
  };
  
  return `
    <div class="${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-black"
         style="background: ${theme.gradient}; box-shadow: 0 0 15px ${theme.glowColor};">
      <i class="fas ${theme.icon}"></i>
    </div>
  `;
}

/**
 * Render metric card with sport theming
 * @param {string} sportType - Sport type identifier
 * @param {string} label - Metric label
 * @param {string} value - Metric value
 * @param {string} unit - Unit of measurement
 * @returns {string} HTML string
 */
function renderSportMetric(sportType, label, value, unit = '') {
  const theme = getSportTheme(sportType);
  
  return `
    <div class="glassmorphism-strong rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
         style="box-shadow: 0 0 20px ${theme.glowColor};">
      <div class="flex items-center justify-between mb-2">
        <span class="text-gray-400 text-sm">${label}</span>
        <i class="fas ${theme.icon}" style="color: ${theme.primaryColor};"></i>
      </div>
      <div class="text-3xl font-bold" style="color: ${theme.primaryColor};">
        ${value}${unit ? '<span class="text-base text-gray-400 ml-1">' + unit + '</span>' : ''}
      </div>
    </div>
  `;
}

/**
 * Create sport header with animated icon
 * @param {string} sportType - Sport type identifier
 * @param {string} title - Header title
 * @returns {string} HTML string
 */
function createSportHeader(sportType, title) {
  const theme = getSportTheme(sportType);
  
  return `
    <div class="flex items-center mb-6">
      <div class="w-16 h-16 rounded-xl flex items-center justify-center mr-4 animate-pulse-slow"
           style="background: ${theme.gradient}; box-shadow: 0 0 30px ${theme.glowColor};">
        <i class="fas ${theme.icon} text-3xl text-black"></i>
      </div>
      <div>
        <h1 class="text-3xl font-bold" style="color: ${theme.primaryColor};">${title}</h1>
        <p class="text-gray-400 text-sm">${theme.name}</p>
      </div>
    </div>
  `;
}

/**
 * Apply sport theme to stat cards
 * @param {string} containerId - Container element ID
 * @param {string} sportType - Sport type identifier
 */
function themeSportCards(containerId, sportType) {
  const theme = getSportTheme(sportType);
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  const cards = container.querySelectorAll('.stat-card, .metric-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.borderColor = theme.primaryColor + '33';
      card.style.boxShadow = `0 0 20px ${theme.glowColor}`;
      
      const icon = card.querySelector('i.fa-dumbbell, i.fa-bicycle, i.fa-person-running');
      if (icon) {
        icon.className = `fas ${theme.icon}`;
        icon.style.color = theme.primaryColor;
      }
      
      const valueElement = card.querySelector('.stat-value, .metric-value');
      if (valueElement) {
        valueElement.style.color = theme.primaryColor;
      }
    }, index * 50);
  });
}

/**
 * Initialize sport theme system
 */
function initSportTheme() {
  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-slow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    
    .animate-pulse-slow {
      animation: pulse-slow 3s ease-in-out infinite;
    }
    
    .sport-theme-transition {
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
}

// Auto-initialize
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initSportTheme);
}

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SPORT_THEMES,
    getSportTheme,
    applySportTheme,
    createSportBadge,
    renderSportMetric,
    createSportHeader,
    themeSportCards
  };
}
