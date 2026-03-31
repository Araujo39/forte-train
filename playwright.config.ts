import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E - ForteTrain v8.0.1
 * 
 * Testa rotas críticas:
 * - Autenticação e RBAC (isolamento de roles)
 * - Geração de treinos Omni-Sport (9 modalidades)
 * - Tratamento de erros e timeouts
 */

export default defineConfig({
  testDir: './tests/e2e',
  
  // Timeout global para cada teste
  timeout: 30 * 1000,
  
  // Esperar até 5 segundos por cada asserção
  expect: {
    timeout: 5000
  },
  
  // Executar testes em paralelo
  fullyParallel: true,
  
  // Falhar o build se houver testes com .only
  forbidOnly: !!process.env.CI,
  
  // Retry em caso de falha (apenas no CI)
  retries: process.env.CI ? 2 : 0,
  
  // Número de workers (paralelo)
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter para GitHub Actions
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  use: {
    // Base URL para testes locais e CI
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Screenshot em caso de falha
    screenshot: 'only-on-failure',
    
    // Vídeo apenas em caso de falha
    video: 'retain-on-failure',
    
    // Trace para debug
    trace: 'on-first-retry',
    
    // User Agent
    userAgent: 'Playwright E2E Tests - ForteTrain',
  },
  
  // Configurar projetos para diferentes browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Descomente para testar em mais browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    // Mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
  
  // Servidor de desenvolvimento para testes locais
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev:sandbox',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
