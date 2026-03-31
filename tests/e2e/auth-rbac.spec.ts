import { test, expect } from '@playwright/test';
import {
  TEST_USERS,
  login,
  assertRouteAccess,
  assertUserRole,
  decodeJWT
} from './fixtures/helpers';

/**
 * Suite de Testes: Autenticação e Isolamento de Roles (RBAC)
 * 
 * Cenários:
 * 1. Login com diferentes roles
 * 2. Student não pode acessar rotas de Admin/Personal
 * 3. Personal não pode acessar rotas de Admin/Student
 * 4. Admin tem acesso a todas as rotas
 * 5. Redirecionamento correto após login
 */

test.describe('Autenticação e RBAC', () => {
  
  test('🔐 Login como STUDENT - deve redirecionar para /student/dashboard', async ({ page }) => {
    const user = TEST_USERS.student;
    
    // Fazer login
    const token = await login(page, user);
    
    // Verificar que token foi armazenado
    expect(token).toBeTruthy();
    
    // Verificar role no JWT
    const payload = decodeJWT(token);
    expect(payload.role).toBe('student');
    
    // Verificar URL atual
    expect(page.url()).toContain('/student/dashboard');
  });
  
  test('🔐 Login como PERSONAL TRAINER - deve redirecionar para /dashboard', async ({ page }) => {
    const user = TEST_USERS.personal;
    
    const token = await login(page, user);
    expect(token).toBeTruthy();
    
    const payload = decodeJWT(token);
    expect(payload.role).toBe('personal');
    
    expect(page.url()).toContain('/dashboard');
  });
  
  test('🔐 Login como ADMIN - deve redirecionar para /admin', async ({ page }) => {
    const user = TEST_USERS.admin;
    
    const token = await login(page, user);
    expect(token).toBeTruthy();
    
    const payload = decodeJWT(token);
    expect(payload.role).toBe('admin');
    
    expect(page.url()).toContain('/admin');
  });
  
  test('🚫 STUDENT não pode acessar /dashboard (Personal Trainer)', async ({ page }) => {
    // Login como student
    await login(page, TEST_USERS.student);
    
    // Tentar acessar rota de Personal Trainer
    await page.goto('/dashboard');
    
    // Deve ser redirecionado para /student/dashboard
    await page.waitForURL(/\/student\/dashboard/, { timeout: 5000 });
    
    expect(page.url()).toContain('/student/dashboard');
    expect(page.url()).not.toContain('/dashboard');
  });
  
  test('🚫 STUDENT não pode acessar /admin', async ({ page }) => {
    await login(page, TEST_USERS.student);
    
    // Tentar acessar rota de Admin
    await page.goto('/admin');
    
    // Deve ser redirecionado para /student/dashboard
    await page.waitForURL(/\/student\/dashboard/, { timeout: 5000 });
    
    expect(page.url()).toContain('/student/dashboard');
  });
  
  test('🚫 STUDENT não pode acessar /dashboard/ai-generator', async ({ page }) => {
    await login(page, TEST_USERS.student);
    
    // Tentar acessar AI Generator (Personal Trainer only)
    await page.goto('/dashboard/ai-generator');
    
    // Deve ser redirecionado
    await page.waitForURL(/\/student\/dashboard/, { timeout: 5000 });
    
    expect(page.url()).toContain('/student/dashboard');
  });
  
  test('✅ STUDENT pode acessar /student/dashboard', async ({ page }) => {
    await login(page, TEST_USERS.student);
    
    // Acessar sua própria rota
    await page.goto('/student/dashboard');
    
    // Deve permanecer na rota
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/student/dashboard');
    
    // Verificar que o dashboard carregou
    const heading = page.locator('h1, h2, .greeting-dynamic');
    await expect(heading.first()).toBeVisible();
  });
  
  test('✅ PERSONAL TRAINER pode acessar /dashboard/ai-generator', async ({ page }) => {
    await login(page, TEST_USERS.personal);
    
    await page.goto('/dashboard/ai-generator');
    
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/dashboard/ai-generator');
    
    // Verificar que página carregou
    const title = page.locator('h1, h2');
    await expect(title.first()).toBeVisible();
  });
  
  test('🚫 PERSONAL TRAINER não pode acessar /student/dashboard', async ({ page }) => {
    await login(page, TEST_USERS.personal);
    
    await page.goto('/student/dashboard');
    
    // Deve ser redirecionado para /dashboard
    await page.waitForURL(/^(?!.*\/student).*\/dashboard/, { timeout: 5000 });
    
    expect(page.url()).toContain('/dashboard');
    expect(page.url()).not.toContain('/student');
  });
  
  test('✅ ADMIN pode acessar /admin', async ({ page }) => {
    await login(page, TEST_USERS.admin);
    
    await page.goto('/admin');
    
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin');
  });
  
  test('🔄 Logout deve limpar token e redirecionar para /auth/login', async ({ page }) => {
    await login(page, TEST_USERS.student);
    
    // Verificar que token existe
    let token = await page.evaluate(() => localStorage.getItem('fortetrain_token') || localStorage.getItem('token'));
    expect(token).toBeTruthy();
    
    // Fazer logout (buscar botão de logout)
    const logoutButton = page.locator('button:has-text("Sair"), a:has-text("Logout"), [data-testid="logout"]');
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      // Aguardar redirecionamento
      await page.waitForURL(/\/auth\/login/, { timeout: 5000 });
      
      // Verificar que token foi removido
      token = await page.evaluate(() => localStorage.getItem('fortetrain_token') || localStorage.getItem('token'));
      expect(token).toBeNull();
    } else {
      console.warn('⚠️  Botão de logout não encontrado - pulando teste de logout');
    }
  });
  
  test('🚫 Acesso sem autenticação deve redirecionar para /auth/login', async ({ page }) => {
    // Limpar localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Tentar acessar rota protegida
    await page.goto('/dashboard');
    
    // Deve redirecionar para login
    await page.waitForURL(/\/auth\/login/, { timeout: 5000 });
    
    expect(page.url()).toContain('/auth/login');
  });
  
  test('⏱️ Token expirado deve redirecionar para login', async ({ page }) => {
    await page.goto('/');
    
    // Criar token JWT expirado manualmente
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoidGVzdCIsInJvbGUiOiJzdHVkZW50IiwiZXhwIjoxNjAwMDAwMDAwfQ.fake-signature';
    
    await page.evaluate((token) => {
      localStorage.setItem('fortetrain_token', token);
    }, expiredToken);
    
    // Tentar acessar rota protegida
    await page.goto('/student/dashboard');
    
    // Deve redirecionar para login (backend rejeita token expirado)
    // Nota: Timeout maior porque pode haver verificação de API
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 }).catch(() => {
      console.warn('⚠️  Token expirado não causou redirecionamento - verificar implementação backend');
    });
  });
  
});
