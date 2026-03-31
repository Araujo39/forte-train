import { Page } from '@playwright/test';

/**
 * Test Helpers para ForteTrain E2E
 * Funções utilitárias para autenticação, navegação e assertions
 */

export interface TestUser {
  email: string;
  password: string;
  role: 'admin' | 'personal' | 'student';
  expectedRedirect?: string;
}

export const TEST_USERS: Record<string, TestUser> = {
  admin: {
    email: 'admin@fortetrain.app',
    password: 'admin123',
    role: 'admin',
    expectedRedirect: '/admin'
  },
  personal: {
    email: 'andre@fortetrain.app',
    password: 'demo123',
    role: 'personal',
    expectedRedirect: '/dashboard'
  },
  student: {
    email: 'joao.santos@email.com',
    password: 'aluno123',
    role: 'student',
    expectedRedirect: '/student/dashboard'
  }
};

/**
 * Faz login com credenciais e aguarda redirecionamento
 */
export async function login(page: Page, user: TestUser): Promise<string> {
  await page.goto('/auth/login');
  
  // Preencher formulário
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  
  // Clicar no botão de login
  await page.click('button[type="submit"]');
  
  // Aguardar navegação
  await page.waitForURL(/\/(admin|dashboard|student)/, { timeout: 10000 });
  
  // Retornar JWT token do localStorage
  const token = await page.evaluate(() => {
    return localStorage.getItem('fortetrain_token') || localStorage.getItem('token');
  });
  
  if (!token) {
    throw new Error('Token não foi armazenado após login');
  }
  
  return token;
}

/**
 * Decodifica JWT e retorna payload
 */
export function decodeJWT(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

/**
 * Verifica se usuário está autenticado e tem role correto
 */
export async function assertUserRole(page: Page, expectedRole: string) {
  const token = await page.evaluate(() => {
    return localStorage.getItem('fortetrain_token') || localStorage.getItem('token');
  });
  
  if (!token) {
    throw new Error('Token não encontrado');
  }
  
  const payload = decodeJWT(token);
  
  if (payload.role !== expectedRole) {
    throw new Error(`Role esperado: ${expectedRole}, recebido: ${payload.role}`);
  }
}

/**
 * Tenta acessar rota protegida e verifica redirecionamento
 */
export async function assertRouteAccess(
  page: Page,
  targetRoute: string,
  shouldRedirectTo?: string
) {
  await page.goto(targetRoute);
  
  if (shouldRedirectTo) {
    // Deve ser redirecionado
    await page.waitForURL(shouldRedirectTo, { timeout: 5000 });
    return page.url();
  } else {
    // Não deve ser redirecionado
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    if (!currentUrl.includes(targetRoute)) {
      throw new Error(`Esperado estar em ${targetRoute}, mas está em ${currentUrl}`);
    }
    return currentUrl;
  }
}

/**
 * Intercepta chamada de API e retorna resposta mockada
 */
export async function mockAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  mockResponse: any,
  status: number = 200
) {
  await page.route(urlPattern, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(mockResponse)
    });
  });
}

/**
 * Intercepta chamada de API e simula timeout
 */
export async function mockAPITimeout(
  page: Page,
  urlPattern: string | RegExp,
  delayMs: number = 10000
) {
  await page.route(urlPattern, async route => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    route.abort('timedout');
  });
}

/**
 * Aguarda toast/notification aparecer na tela
 */
export async function waitForToast(page: Page, expectedText?: string): Promise<string> {
  const toastSelector = '.toast, .notification, [role="alert"], .alert, .Toastify';
  
  await page.waitForSelector(toastSelector, { timeout: 5000 });
  
  const toastText = await page.textContent(toastSelector);
  
  if (expectedText && !toastText?.includes(expectedText)) {
    throw new Error(`Toast esperado conter "${expectedText}", mas contém "${toastText}"`);
  }
  
  return toastText || '';
}

/**
 * Verifica se página tem White Screen of Death (erro fatal)
 */
export async function assertNoWhiteScreenOfDeath(page: Page) {
  // Verificar se há elementos visíveis na página
  const bodyText = await page.textContent('body');
  
  if (!bodyText || bodyText.trim().length === 0) {
    throw new Error('White Screen of Death detectado: body vazio');
  }
  
  // Verificar se há erros no console
  const errors = await page.evaluate(() => {
    return (window as any).__playwrightErrors || [];
  });
  
  if (errors.length > 0) {
    console.warn('Erros no console:', errors);
  }
}

/**
 * Captura erros do console
 */
export function captureConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  return errors;
}

/**
 * Aguarda requisição de API específica e retorna resposta
 */
export async function waitForAPICall(
  page: Page,
  urlPattern: string | RegExp
): Promise<any> {
  const response = await page.waitForResponse(
    resp => {
      const url = resp.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      } else {
        return urlPattern.test(url);
      }
    },
    { timeout: 10000 }
  );
  
  return response.json();
}
