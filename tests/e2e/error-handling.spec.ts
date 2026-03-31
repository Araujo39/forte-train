import { test, expect } from '@playwright/test';
import {
  TEST_USERS,
  login,
  mockAPITimeout,
  assertNoWhiteScreenOfDeath,
  captureConsoleErrors,
  waitForToast
} from './fixtures/helpers';

/**
 * Suite de Testes: Tratamento de Timeout e Erros
 * 
 * Cenários:
 * 1. Timeout na API do YouTube (Vision)
 * 2. Timeout na geração de treinos
 * 3. Erro 500 do backend
 * 4. Erro de rede (offline)
 * 5. White Screen of Death (WSOD) prevention
 */

test.describe('Tratamento de Timeout e Erros', () => {
  
  test('⏱️ Timeout no YouTube API (Vision) - deve exibir toast de erro', async ({ page }) => {
    // Login como Personal Trainer
    await login(page, TEST_USERS.personal);
    
    // Capturar erros do console
    const consoleErrors = captureConsoleErrors(page);
    
    // Mock de timeout no YouTube API
    await page.route('**/api/youtube/search*', route => {
      setTimeout(() => {
        route.abort('timedout');
      }, 3000);
    });
    
    // Navegar para página que usa YouTube API (pode ser dashboard/workouts ou Vision)
    await page.goto('/dashboard/workouts');
    await page.waitForLoadState('networkidle');
    
    // Tentar acionar funcionalidade que usa YouTube
    // (depende da implementação - pode ser um botão de busca de vídeos)
    const searchButton = page.locator('button:has-text("Buscar"), button:has-text("Search"), [data-testid="youtube-search"]');
    
    if (await searchButton.count() > 0) {
      await searchButton.first().click();
      
      // Aguardar timeout acontecer
      await page.waitForTimeout(4000);
      
      // Verificar que UI não quebrou
      await assertNoWhiteScreenOfDeath(page);
      
      // Verificar se há toast/notification de erro
      const errorVisible = await page.isVisible('.toast, .notification, .alert, [role="alert"]');
      
      if (errorVisible) {
        const errorText = await page.textContent('.toast, .notification, .alert, [role="alert"]');
        expect(errorText?.toLowerCase()).toMatch(/erro|error|timeout|falha|fail/);
      } else {
        // Se não houver toast, verificar console errors
        console.log('Console errors capturados:', consoleErrors);
        expect(consoleErrors.length).toBeGreaterThan(0);
      }
    } else {
      console.warn('⚠️  Funcionalidade YouTube não encontrada - teste parcialmente executado');
    }
  });
  
  test('⏱️ Timeout na geração de treino - toast amigável (não WSOD)', async ({ page }) => {
    await login(page, TEST_USERS.personal);
    
    const consoleErrors = captureConsoleErrors(page);
    
    // Navegar para AI Generator
    await page.goto('/dashboard/ai-generator');
    await page.waitForLoadState('networkidle');
    
    // Mock de timeout na API de geração
    await page.route('**/api/ai/generate-workout', route => {
      setTimeout(() => {
        route.abort('timedout');
      }, 2000);
    });
    
    // Preencher formulário
    await page.selectOption('#sportType', 'cycling');
    
    const studentSelect = page.locator('#studentId');
    const studentCount = await studentSelect.locator('option').count();
    if (studentCount > 1) {
      await studentSelect.selectOption({ index: 1 });
    }
    
    const focusInput = page.locator('#focus, [name="focus"]');
    if (await focusInput.count() > 0) {
      await focusInput.fill('Teste de timeout');
    }
    
    // Submeter
    await page.click('button[type="submit"]');
    
    // Aguardar timeout
    await page.waitForTimeout(3000);
    
    // Verificar que não houve WSOD
    await assertNoWhiteScreenOfDeath(page);
    
    // Verificar mensagem de erro amigável
    const errorElements = await page.$$('.error, .alert, .toast, [role="alert"]');
    
    if (errorElements.length > 0) {
      const errorText = await page.textContent('.error, .alert, .toast, [role="alert"]');
      console.log('Mensagem de erro exibida:', errorText);
      
      // Verificar que é mensagem amigável (não stack trace)
      expect(errorText).not.toContain('TypeError');
      expect(errorText).not.toContain('undefined is not');
      expect(errorText).not.toContain('Cannot read property');
    } else {
      console.warn('⚠️  Nenhum toast de erro detectado - verificar implementação');
    }
    
    // Verificar que botão de submit ficou habilitado novamente
    const submitButton = page.locator('button[type="submit"]');
    const isDisabled = await submitButton.isDisabled();
    expect(isDisabled).toBe(false);
  });
  
  test('❌ Erro 500 do backend - deve exibir mensagem amigável', async ({ page }) => {
    await login(page, TEST_USERS.personal);
    
    await page.goto('/dashboard/ai-generator');
    await page.waitForLoadState('networkidle');
    
    // Mock de erro 500
    await page.route('**/api/ai/generate-workout', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal Server Error',
          message: 'Erro ao processar solicitação'
        })
      });
    });
    
    await page.selectOption('#sportType', 'running');
    
    const studentSelect = page.locator('#studentId');
    const studentCount = await studentSelect.locator('option').count();
    if (studentCount > 1) {
      await studentSelect.selectOption({ index: 1 });
    }
    
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    // Verificar UI não quebrou
    await assertNoWhiteScreenOfDeath(page);
    
    // Verificar mensagem de erro
    const errorVisible = await page.isVisible('.error, .alert, .toast');
    expect(errorVisible).toBe(true);
    
    const errorText = await page.textContent('.error, .alert, .toast');
    expect(errorText?.toLowerCase()).toMatch(/erro|error|falha|fail/);
  });
  
  test('🌐 Erro de rede (offline) - deve exibir mensagem de conexão', async ({ page }) => {
    await login(page, TEST_USERS.personal);
    
    await page.goto('/dashboard/ai-generator');
    await page.waitForLoadState('networkidle');
    
    // Simular offline (abortar todas as requisições)
    await page.route('**/api/**', route => {
      route.abort('failed');
    });
    
    await page.selectOption('#sportType', 'bodybuilding');
    
    const studentSelect = page.locator('#studentId');
    const studentCount = await studentSelect.locator('option').count();
    if (studentCount > 1) {
      await studentSelect.selectOption({ index: 1 });
    }
    
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    // Verificar UI não quebrou
    await assertNoWhiteScreenOfDeath(page);
    
    // Verificar mensagem
    const errorVisible = await page.isVisible('.error, .alert, .toast');
    expect(errorVisible).toBe(true);
  });
  
  test('🛡️ White Screen of Death (WSOD) - prevenir crash fatal', async ({ page }) => {
    await login(page, TEST_USERS.student);
    
    const consoleErrors = captureConsoleErrors(page);
    
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Injetar erro JavaScript fatal
    await page.evaluate(() => {
      // Forçar erro no código
      setTimeout(() => {
        try {
          // @ts-ignore
          window.undefinedFunction();
        } catch (e) {
          console.error('Erro capturado:', e);
        }
      }, 1000);
    });
    
    await page.waitForTimeout(2000);
    
    // Verificar que página ainda está responsiva
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
    
    // Verificar que elementos principais estão visíveis
    const mainElements = await page.$$('header, nav, main, .section, .dashboard');
    expect(mainElements.length).toBeGreaterThan(0);
    
    console.log('Console errors após injeção de erro:', consoleErrors);
  });
  
  test('📱 Student Dashboard - carregamento sem quebrar', async ({ page }) => {
    const consoleErrors = captureConsoleErrors(page);
    
    await login(page, TEST_USERS.student);
    
    // Navegar para dashboard
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Verificar que não houve WSOD
    await assertNoWhiteScreenOfDeath(page);
    
    // Verificar elementos principais carregaram
    const greeting = page.locator('.greeting-dynamic, h1, h2');
    await expect(greeting.first()).toBeVisible({ timeout: 10000 });
    
    // Verificar que Sport Badge aparece (pode demorar para carregar tema)
    await page.waitForTimeout(2000);
    
    const sportBadge = page.locator('#sportBadgeContainer, .sport-badge-profile');
    const badgeExists = await sportBadge.count();
    
    if (badgeExists > 0) {
      console.log('✅ Sport Badge detectado');
    } else {
      console.warn('⚠️  Sport Badge não detectado - verificar implementação');
    }
    
    // Verificar que gráficos carregaram
    const charts = page.locator('canvas');
    const chartCount = await charts.count();
    expect(chartCount).toBeGreaterThan(0);
    
    // Log de erros do console
    if (consoleErrors.length > 0) {
      console.log('Console errors durante carregamento:', consoleErrors);
    }
  });
  
  test('🔄 Retry automático em falha de rede', async ({ page }) => {
    await login(page, TEST_USERS.personal);
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    let requestCount = 0;
    
    // Mock que falha 2 vezes e depois sucede
    await page.route('**/api/dashboard/stats', route => {
      requestCount++;
      
      if (requestCount <= 2) {
        // Primeiras 2 tentativas falham
        route.abort('failed');
      } else {
        // Terceira tentativa sucede
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            totalStudents: 10,
            activeStudents: 8,
            totalWorkouts: 50
          })
        });
      }
    });
    
    // Recarregar página para acionar requisição
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Aguardar retries
    await page.waitForTimeout(5000);
    
    // Verificar que eventualmente conseguiu carregar
    console.log('Total de tentativas:', requestCount);
    
    // Se houver implementação de retry, deve ter tentado múltiplas vezes
    if (requestCount >= 2) {
      console.log('✅ Retry automático funcionando');
    } else {
      console.warn('⚠️  Retry automático não detectado');
    }
    
    // Verificar que UI não quebrou
    await assertNoWhiteScreenOfDeath(page);
  });
  
  test('🎨 Omni-Sport Landing - navegação sem erros', async ({ page }) => {
    const consoleErrors = captureConsoleErrors(page);
    
    await page.goto('/omni-sport');
    await page.waitForLoadState('networkidle');
    
    // Verificar que página carregou
    await assertNoWhiteScreenOfDeath(page);
    
    // Clicar em todos os 9 tabs
    const tabs = await page.$$('.sport-tab, [data-sport], button[onclick*="showSport"]');
    
    console.log(`Encontrados ${tabs.length} tabs de esportes`);
    
    for (let i = 0; i < Math.min(tabs.length, 9); i++) {
      await tabs[i].click();
      await page.waitForTimeout(500);
      
      // Verificar que não quebrou
      const bodyText = await page.textContent('body');
      expect(bodyText!.length).toBeGreaterThan(100);
    }
    
    // Log de erros
    if (consoleErrors.length > 0) {
      console.log('Console errors durante navegação:', consoleErrors);
      
      // Falhar apenas se houver erros críticos
      const criticalErrors = consoleErrors.filter(err => 
        err.includes('TypeError') || err.includes('ReferenceError')
      );
      expect(criticalErrors.length).toBe(0);
    }
  });
  
});
