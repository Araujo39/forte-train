import { test, expect } from '@playwright/test';
import {
  TEST_USERS,
  login,
  waitForAPICall,
  mockAPIResponse
} from './fixtures/helpers';

/**
 * Suite de Testes: Geração de Treino Omni-Sport
 * 
 * Cenários:
 * 1. Enviar payload com sport_type: 'cycling'
 * 2. Validar resposta JSON estruturado (não texto plano)
 * 3. Validar métricas específicas do esporte (distância, potência)
 * 4. Rejeitar respostas em formato de texto
 * 5. Testar todas as 9 modalidades
 */

test.describe('Geração de Treino Omni-Sport', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login como Personal Trainer
    await login(page, TEST_USERS.personal);
    
    // Navegar para AI Generator
    await page.goto('/dashboard/ai-generator');
    await page.waitForLoadState('networkidle');
  });
  
  test('🚴 Gerar treino de CICLISMO - validar JSON estruturado com métricas', async ({ page }) => {
    // Preencher formulário
    await page.selectOption('#sportType', 'cycling');
    await page.selectOption('#experienceLevel', 'intermediate');
    
    // Aguardar campos dinâmicos carregarem
    await page.waitForTimeout(500);
    
    // Preencher campos obrigatórios
    const studentSelect = page.locator('#studentId');
    const studentCount = await studentSelect.locator('option').count();
    
    if (studentCount > 1) {
      await studentSelect.selectOption({ index: 1 }); // Primeiro aluno
    }
    
    const focusInput = page.locator('#focus, [name="focus"]');
    if (await focusInput.count() > 0) {
      await focusInput.fill('Treino intervalado FTP com foco em potência');
    }
    
    // Submeter formulário
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Aguardar resposta da API
    const apiResponse = await page.waitForResponse(
      resp => resp.url().includes('/api/ai/generate-workout'),
      { timeout: 30000 }
    );
    
    expect(apiResponse.status()).toBe(200);
    
    // Validar estrutura JSON
    const responseData = await apiResponse.json();
    
    // Deve ter sucesso
    expect(responseData).toHaveProperty('success');
    
    // Deve ter workout com estrutura
    expect(responseData).toHaveProperty('workout');
    const workout = responseData.workout;
    
    // Validar que NÃO é texto plano
    if (typeof workout === 'string') {
      // Se for string, tentar parsear como JSON
      const parsed = JSON.parse(workout);
      expect(parsed).toBeInstanceOf(Object);
    } else {
      // Já é objeto
      expect(workout).toBeInstanceOf(Object);
    }
    
    // Validar métricas específicas de ciclismo
    const workoutString = JSON.stringify(workout).toLowerCase();
    
    // Deve conter métricas de ciclismo
    const cyclingMetrics = ['distância', 'distance', 'potência', 'power', 'ftp', 'watts', 'zona', 'zone'];
    const hasValidMetrics = cyclingMetrics.some(metric => workoutString.includes(metric));
    
    expect(hasValidMetrics).toBe(true);
    
    // Validar que UI exibiu o resultado
    await page.waitForSelector('#result, .workout-result, .ai-result', { timeout: 5000 });
    
    const resultVisible = await page.isVisible('#result, .workout-result, .ai-result');
    expect(resultVisible).toBe(true);
  });
  
  test('🏃 Gerar treino de CORRIDA - validar métricas de pace e distância', async ({ page }) => {
    await page.selectOption('#sportType', 'running');
    await page.selectOption('#experienceLevel', 'beginner');
    
    await page.waitForTimeout(500);
    
    const studentSelect = page.locator('#studentId');
    const studentCount = await studentSelect.locator('option').count();
    if (studentCount > 1) {
      await studentSelect.selectOption({ index: 1 });
    }
    
    const focusInput = page.locator('#focus, [name="focus"]');
    if (await focusInput.count() > 0) {
      await focusInput.fill('Treino de base aeróbica com longão');
    }
    
    await page.click('button[type="submit"]');
    
    const apiResponse = await page.waitForResponse(
      resp => resp.url().includes('/api/ai/generate-workout'),
      { timeout: 30000 }
    );
    
    const responseData = await apiResponse.json();
    const workoutString = JSON.stringify(responseData.workout).toLowerCase();
    
    // Métricas de corrida
    const runningMetrics = ['pace', 'distância', 'distance', 'km', 'min/km', 'tempo', 'time'];
    const hasValidMetrics = runningMetrics.some(metric => workoutString.includes(metric));
    
    expect(hasValidMetrics).toBe(true);
  });
  
  test('🏋️ Gerar treino de MUSCULAÇÃO - validar séries, reps e carga', async ({ page }) => {
    await page.selectOption('#sportType', 'bodybuilding');
    await page.selectOption('#experienceLevel', 'advanced');
    
    await page.waitForTimeout(500);
    
    const studentSelect = page.locator('#studentId');
    const studentCount = await studentSelect.locator('option').count();
    if (studentCount > 1) {
      await studentSelect.selectOption({ index: 1 });
    }
    
    const focusInput = page.locator('#focus, [name="focus"]');
    if (await focusInput.count() > 0) {
      await focusInput.fill('Treino de peito e tríceps com foco em hipertrofia');
    }
    
    await page.click('button[type="submit"]');
    
    const apiResponse = await page.waitForResponse(
      resp => resp.url().includes('/api/ai/generate-workout'),
      { timeout: 30000 }
    );
    
    const responseData = await apiResponse.json();
    const workoutString = JSON.stringify(responseData.workout).toLowerCase();
    
    // Métricas de musculação
    const weightTrainingMetrics = ['série', 'series', 'sets', 'reps', 'repetições', 'carga', 'weight', 'kg', 'descanso', 'rest'];
    const hasValidMetrics = weightTrainingMetrics.some(metric => workoutString.includes(metric));
    
    expect(hasValidMetrics).toBe(true);
  });
  
  test('🎾 Gerar treino de TÊNIS - validar drills e técnicas', async ({ page }) => {
    await page.selectOption('#sportType', 'tennis');
    await page.selectOption('#experienceLevel', 'intermediate');
    
    await page.waitForTimeout(500);
    
    const studentSelect = page.locator('#studentId');
    const studentCount = await studentSelect.locator('option').count();
    if (studentCount > 1) {
      await studentSelect.selectOption({ index: 1 });
    }
    
    const focusInput = page.locator('#focus, [name="focus"]');
    if (await focusInput.count() > 0) {
      await focusInput.fill('Treino de forehand e footwork');
    }
    
    await page.click('button[type="submit"]');
    
    const apiResponse = await page.waitForResponse(
      resp => resp.url().includes('/api/ai/generate-workout'),
      { timeout: 30000 }
    );
    
    const responseData = await apiResponse.json();
    const workoutString = JSON.stringify(responseData.workout).toLowerCase();
    
    // Métricas de tênis
    const tennisMetrics = ['drill', 'forehand', 'backhand', 'serve', 'saque', 'técnica', 'technique', 'duração', 'duration'];
    const hasValidMetrics = tennisMetrics.some(metric => workoutString.includes(metric));
    
    expect(hasValidMetrics).toBe(true);
  });
  
  test('🚫 Rejeitar resposta em formato de TEXTO PLANO', async ({ page }) => {
    // Mock da API para retornar texto plano ao invés de JSON
    await page.route('**/api/ai/generate-workout', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Aqui está seu treino de ciclismo: faça 30 minutos de aquecimento...'
      });
    });
    
    await page.selectOption('#sportType', 'cycling');
    
    const studentSelect = page.locator('#studentId');
    const studentCount = await studentSelect.locator('option').count();
    if (studentCount > 1) {
      await studentSelect.selectOption({ index: 1 });
    }
    
    const focusInput = page.locator('#focus, [name="focus"]');
    if (await focusInput.count() > 0) {
      await focusInput.fill('Teste de texto plano');
    }
    
    await page.click('button[type="submit"]');
    
    // Aguardar resposta
    await page.waitForTimeout(2000);
    
    // Verificar se há mensagem de erro ou alerta
    const errorVisible = await page.isVisible('.error, .alert-error, [role="alert"]');
    
    // Se não houver erro visível, verificar se resultado não foi processado corretamente
    if (!errorVisible) {
      // Verificar console para erros
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Deve ter erro de parsing JSON
      const hasParseError = errors.some(err => err.includes('JSON') || err.includes('parse'));
      console.log('Erros capturados:', errors);
      
      // Pelo menos um erro deve ter ocorrido
      expect(errors.length > 0 || errorVisible).toBe(true);
    }
  });
  
  test('✅ Sports Selector deve carregar 9 modalidades', async ({ page }) => {
    // Aguardar selector carregar
    await page.waitForSelector('#sportType', { timeout: 10000 });
    
    // Contar opções (excluindo placeholder)
    const options = await page.$$('#sportType option');
    
    // Deve ter pelo menos 9 opções + 1 placeholder = 10 total
    expect(options.length).toBeGreaterThanOrEqual(9);
    
    // Verificar que não está mostrando "Carregando..."
    const selectText = await page.textContent('#sportType');
    expect(selectText).not.toContain('Carregando');
    
    // Verificar algumas modalidades específicas
    const selectHTML = await page.innerHTML('#sportType');
    expect(selectHTML).toContain('cycling');
    expect(selectHTML).toContain('running');
    expect(selectHTML).toContain('bodybuilding');
  });
  
  test('⚡ Timeout da API deve exibir erro amigável (não quebrar UI)', async ({ page }) => {
    // Mock de timeout (30 segundos)
    await page.route('**/api/ai/generate-workout', route => {
      setTimeout(() => {
        route.abort('timedout');
      }, 5000);
    });
    
    await page.selectOption('#sportType', 'crossfit');
    
    const studentSelect = page.locator('#studentId');
    const studentCount = await studentSelect.locator('option').count();
    if (studentCount > 1) {
      await studentSelect.selectOption({ index: 1 });
    }
    
    const focusInput = page.locator('#focus, [name="focus"]');
    if (await focusInput.count() > 0) {
      await focusInput.fill('Teste de timeout');
    }
    
    await page.click('button[type="submit"]');
    
    // Aguardar timeout
    await page.waitForTimeout(6000);
    
    // Verificar que UI não quebrou (White Screen of Death)
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(0);
    
    // Verificar se há mensagem de erro
    const errorMessage = await page.isVisible('.error, .alert, [role="alert"], .toast');
    expect(errorMessage).toBe(true);
  });
  
});
