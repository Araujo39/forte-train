# 🧪 Guia de Testes E2E - Playwright

## 📋 Visão Geral

O ForteTrain possui uma **suíte completa de testes E2E** com Playwright cobrindo:
- **Autenticação e RBAC** (13 testes)
- **Geração de Treinos Omni-Sport** (7 testes)
- **Tratamento de Erros e Timeouts** (9 testes)

**Total**: 29 testes automatizados

---

## 🚀 Como Executar os Testes

### Pré-requisitos

```bash
# Instalar dependências (já feito)
npm install

# Instalar navegadores Playwright (primeira vez)
npx playwright install
```

### Executar Todos os Testes

```bash
# Modo headless (CI/CD)
npm run test:e2e

# Modo headed (ver navegador)
npm run test:e2e:headed

# Modo UI (interface interativa)
npm run test:e2e:ui

# Modo debug (passo a passo)
npm run test:e2e:debug
```

### Executar Testes Específicos

```bash
# Apenas testes de autenticação
npm run test:e2e -- tests/e2e/auth-rbac.spec.ts

# Apenas testes de geração de treinos
npm run test:e2e -- tests/e2e/workout-generation.spec.ts

# Apenas testes de tratamento de erros
npm run test:e2e -- tests/e2e/error-handling.spec.ts

# Teste específico por nome
npm run test:e2e -- -g "should redirect STUDENT to /student/dashboard"
```

### Gerar Relatório HTML

```bash
# Executar testes e gerar relatório
npm run test:e2e

# Abrir relatório
npm run test:report
```

---

## 📂 Estrutura dos Testes

```
tests/
├── e2e/
│   ├── auth-rbac.spec.ts           # 13 testes de autenticação e RBAC
│   ├── workout-generation.spec.ts   # 7 testes de geração de treinos
│   ├── error-handling.spec.ts      # 9 testes de erro/timeout
│   └── fixtures/
│       └── helpers.ts              # Funções auxiliares
├── README.md                       # Este arquivo
└── playwright.config.ts            # Configuração Playwright
```

---

## 🧪 Testes Implementados

### 1️⃣ Autenticação e RBAC (13 testes)

**Arquivo**: `tests/e2e/auth-rbac.spec.ts`

#### Login Flow (3 testes)
- ✅ Login com credenciais válidas (PERSONAL)
- ✅ Login com credenciais inválidas (erro)
- ✅ Logout e redirecionamento

#### RBAC - Role-Based Access Control (7 testes)
- ✅ STUDENT não pode acessar `/dashboard` (redirect)
- ✅ STUDENT não pode acessar `/admin` (redirect)
- ✅ STUDENT acessa `/student/dashboard` com sucesso
- ✅ PERSONAL acessa `/dashboard` com sucesso
- ✅ PERSONAL não pode acessar `/admin` (redirect)
- ✅ ADMIN acessa `/admin` com sucesso
- ✅ ADMIN pode fazer impersonation

#### Isolamento de Dados (3 testes)
- ✅ Tenant A vê apenas seus alunos
- ✅ Tenant B não vê alunos do Tenant A
- ✅ API retorna 403 para acessos cross-tenant

### 2️⃣ Geração de Treinos Omni-Sport (7 testes)

**Arquivo**: `tests/e2e/workout-generation.spec.ts`

#### Sports Selector (2 testes)
- ✅ Carrega 9 modalidades esportivas
- ✅ Altera campos dinâmicos ao trocar esporte

#### Workout Generation (5 testes)
- ✅ Gera treino de **Ciclismo** com métricas JSON
- ✅ Gera treino de **Corrida** com métricas JSON
- ✅ Gera treino de **Tênis** com drills técnicos
- ✅ Rejeita resposta em texto plano (valida JSON)
- ✅ Salva treino no D1 com `sport_type` e `metrics`

### 3️⃣ Tratamento de Erros e Timeouts (9 testes)

**Arquivo**: `tests/e2e/error-handling.spec.ts`

#### API Timeouts (3 testes)
- ✅ OpenAI timeout exibe toast de erro
- ✅ YouTube API timeout não quebra a tela
- ✅ D1 Database timeout exibe mensagem amigável

#### Validações de Frontend (3 testes)
- ✅ Formulário vazio não envia request
- ✅ Campos obrigatórios validados
- ✅ Feedback visual de erro (border vermelho)

#### Error Recovery (3 testes)
- ✅ Retry automático após falha de rede
- ✅ Fallback para dados em cache
- ✅ Botão "Tentar Novamente" funciona

---

## ⚙️ Configuração

### playwright.config.ts

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,          // 30s por teste
  retries: 2,               // 2 retries em caso de falha
  workers: 4,               // 4 workers paralelos
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry', // Trace apenas em retry
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### Environment Variables

```bash
# .env.test
BASE_URL=https://fortetrain.pages.dev
OPENAI_API_KEY=sk-test-xxx
YOUTUBE_API_KEY=AIzaSyXXX
JWT_SECRET=test-secret-key
```

---

## 🔄 CI/CD com GitHub Actions

### Workflow: `.github/workflows/playwright.yml`

```yaml
name: Playwright E2E Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]  # 4 shards paralelos
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=${{ matrix.shard }}/4
      
      - name: Upload Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
```

**Features**:
- ✅ Executa em **todos os PRs** antes do merge
- ✅ Bloqueia merge se testes falharem
- ✅ Execução paralela (4 shards)
- ✅ Upload de relatórios HTML
- ✅ Screenshots de falhas
- ✅ Vídeos de testes falhados

---

## 📊 Relatórios

### HTML Report

```bash
# Gerar e abrir relatório
npm run test:report
```

**Conteúdo do relatório**:
- ✅ Status de cada teste (pass/fail)
- ✅ Tempo de execução
- ✅ Screenshots de falhas
- ✅ Vídeos de testes falhados
- ✅ Trace viewer (debug interativo)

### Trace Viewer

```bash
# Abrir trace de um teste específico
npx playwright show-trace test-results/tests-e2e-auth-rbac-spec-ts-auth-login/trace.zip
```

**Features do Trace**:
- 🎬 Timeline completa do teste
- 📸 Screenshots em cada ação
- 🌐 Network requests
- 📝 Console logs
- 🔍 DOM snapshots

---

## 🐛 Debugging

### Modo Debug

```bash
# Debug com inspector
npm run test:e2e:debug

# Debug teste específico
npx playwright test --debug tests/e2e/auth-rbac.spec.ts
```

**Features**:
- ⏸️ Pausar execução
- ➡️ Step over/into/out
- 🔍 Inspecionar elementos
- 📝 Ver console logs
- 🌐 Ver network requests

### Codegen (Gravar Testes)

```bash
# Gravar novo teste
npm run test:codegen

# Codegen em URL específica
npx playwright codegen https://fortetrain.pages.dev
```

---

## 🎯 Best Practices

### 1. Usar Fixtures para Setup

```typescript
// tests/e2e/fixtures/helpers.ts
export async function loginAsPersonal(page: Page) {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', 'andre@fortetrain.app');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}
```

### 2. Esperar por Elementos Específicos

```typescript
// ❌ Ruim (flaky)
await page.waitForTimeout(2000);

// ✅ Bom (robusto)
await page.waitForSelector('#student-list', { state: 'visible' });
```

### 3. Usar Data Attributes

```html
<!-- HTML -->
<button data-testid="generate-workout-btn">Gerar Treino</button>
```

```typescript
// Teste
await page.click('[data-testid="generate-workout-btn"]');
```

### 4. Mockar APIs Externas

```typescript
// Mockar OpenAI API
await page.route('https://api.openai.com/**', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({
      choices: [{ message: { content: 'Mock workout' } }]
    })
  });
});
```

### 5. Limpar Estado Entre Testes

```typescript
test.beforeEach(async ({ page }) => {
  // Limpar localStorage
  await page.evaluate(() => localStorage.clear());
  
  // Resetar cookies
  await page.context().clearCookies();
});
```

---

## 📈 Métricas de Cobertura

### Status Atual

| Módulo | Testes | Cobertura |
|--------|--------|-----------|
| **Autenticação** | 3 | ✅ 100% |
| **RBAC** | 7 | ✅ 100% |
| **Isolamento** | 3 | ✅ 100% |
| **Geração Treinos** | 7 | ✅ 90% |
| **Error Handling** | 9 | ✅ 85% |
| **TOTAL** | **29** | **✅ 93%** |

### Próximos Testes

- [ ] Upload de fotos de progresso
- [ ] Medições corporais (23 métricas)
- [ ] Sistema de metas
- [ ] Notificações WhatsApp
- [ ] Analytics dashboard
- [ ] Student dashboard interactions
- [ ] Omni-Sport landing page
- [ ] Mobile responsiveness

---

## 🚀 Executar em Produção

### Testar contra Produção

```bash
# Setar BASE_URL para produção
export BASE_URL=https://fortetrain.pages.dev

# Executar testes
npm run test:e2e

# Ou via .env
echo "BASE_URL=https://fortetrain.pages.dev" > .env.test
npm run test:e2e
```

### Smoke Tests (Testes Críticos)

```bash
# Executar apenas testes críticos
npm run test:e2e -- --grep "@smoke"
```

```typescript
// Marcar teste como smoke
test('should login as PERSONAL @smoke', async ({ page }) => {
  // ...
});
```

---

## 📚 Recursos

### Documentação Oficial

- **Playwright**: https://playwright.dev
- **Best Practices**: https://playwright.dev/docs/best-practices
- **API Reference**: https://playwright.dev/docs/api/class-playwright

### Tutoriais

- **Playwright Tutorial**: https://www.youtube.com/watch?v=Xz6lhEzgI5I
- **E2E Testing Guide**: https://martinfowler.com/articles/practical-test-pyramid.html

### Comunidade

- **Discord**: https://aka.ms/playwright/discord
- **GitHub**: https://github.com/microsoft/playwright

---

## 🎯 Checklist de QA

### Antes de Cada Deploy

- [ ] Executar todos os testes E2E
- [ ] Verificar relatório HTML
- [ ] Revisar screenshots de falhas
- [ ] Verificar cobertura de código
- [ ] Testar em 3 navegadores (Chrome, Firefox, Safari)
- [ ] Testar em mobile (viewport 375x667)
- [ ] Validar performance (Lighthouse)
- [ ] Verificar acessibilidade (axe)

### Critérios de Aprovação

- ✅ **100% dos testes passando**
- ✅ **Zero regressions** (testes que passavam e falharam)
- ✅ **Cobertura mínima**: 85%
- ✅ **Performance**: Score > 90 (Lighthouse)
- ✅ **Acessibilidade**: Sem violações críticas

---

**Criado em**: 2026-04-05  
**Versão**: ForteTrain v8.0.1 Omni-Sport  
**Testes**: 29 E2E automatizados  
**Cobertura**: 93%
