# 🧪 Testes E2E - ForteTrain v8.0.1

Suíte completa de testes End-to-End usando **Playwright** para garantir a qualidade e segurança do SaaS multi-tenant ForteTrain.

## 📋 Cenários Cobertos

### 1️⃣ Autenticação e RBAC (Role-Based Access Control)
**Arquivo**: `tests/e2e/auth-rbac.spec.ts`

- ✅ Login com diferentes roles (STUDENT, PERSONAL, ADMIN)
- ✅ Verificação de JWT e redirecionamentos corretos
- ✅ Isolamento de rotas por role:
  - STUDENT não pode acessar `/dashboard` ou `/admin`
  - PERSONAL não pode acessar `/student/dashboard` ou `/admin`
  - ADMIN tem acesso a todas as rotas
- ✅ Logout e limpeza de tokens
- ✅ Proteção contra acesso sem autenticação
- ✅ Detecção de token expirado

**Total**: 13 testes

### 2️⃣ Geração de Treino Omni-Sport
**Arquivo**: `tests/e2e/workout-generation.spec.ts`

- ✅ Gerar treino de **Ciclismo** com métricas (distância, potência, FTP)
- ✅ Gerar treino de **Corrida** com métricas (pace, km, tempo)
- ✅ Gerar treino de **Musculação** com métricas (séries, reps, carga)
- ✅ Gerar treino de **Tênis** com drills e técnicas
- ✅ Validar resposta JSON estruturado (rejeitar texto plano)
- ✅ Validar que Sports Selector carrega 9 modalidades
- ✅ Tratamento de timeout da API

**Total**: 7 testes

### 3️⃣ Tratamento de Timeout e Erros
**Arquivo**: `tests/e2e/error-handling.spec.ts`

- ✅ Timeout no YouTube API (Vision) - toast de erro amigável
- ✅ Timeout na geração de treinos - não quebrar UI
- ✅ Erro 500 do backend - mensagem amigável
- ✅ Erro de rede (offline) - mensagem de conexão
- ✅ Prevenir White Screen of Death (WSOD)
- ✅ Student Dashboard - carregamento sem quebrar
- ✅ Retry automático em falha de rede
- ✅ Omni-Sport Landing - navegação sem erros

**Total**: 9 testes

---

## 🚀 Como Executar os Testes

### Pré-requisitos
```bash
# Instalar dependências
npm install

# Instalar browsers do Playwright
npx playwright install chromium
```

### Executar Todos os Testes
```bash
npm test
```

### Executar em Modo UI (Interactive)
```bash
npm run test:ui
```

### Executar com Browser Visível
```bash
npm run test:headed
```

### Executar em Modo Debug
```bash
npm run test:debug
```

### Ver Relatório HTML
```bash
npm run test:report
```

### Gerar Testes Automaticamente (Codegen)
```bash
npm run test:codegen
```

---

## 🔧 Configuração

### Variáveis de Ambiente

Criar arquivo `.env` (opcional):
```env
PLAYWRIGHT_BASE_URL=http://localhost:3000
CI=false
```

### playwright.config.ts

Configurações principais:
- **Timeout global**: 30 segundos por teste
- **Retries**: 2 tentativas em caso de falha (apenas no CI)
- **Paralelo**: Sim (workers automáticos)
- **Screenshot**: Apenas em falhas
- **Vídeo**: Apenas em falhas
- **Trace**: Na primeira tentativa de retry

---

## 🤖 GitHub Actions (CI/CD)

### Workflow: `.github/workflows/playwright.yml`

**Trigger**:
- Pull Requests para `main` ou `develop`
- Push para `main`
- Manual (workflow_dispatch)

**Jobs**:
1. **test**: Executa testes em 2 shards paralelos
2. **report**: Combina resultados e gera relatório
3. **status-check**: Bloqueia merge se testes falharem

**Artefatos salvos**:
- Relatório HTML completo
- Screenshots de testes falhados
- Vídeos de testes falhados

### Bloquear Merge sem Testes Passando

No GitHub, configure **Branch Protection Rules**:
1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. ✅ Require status checks to pass before merging
4. ✅ Selecionar: `E2E Status Check`

---

## 📊 Estrutura de Arquivos

```
webapp/
├── tests/
│   └── e2e/
│       ├── fixtures/
│       │   └── helpers.ts         # Funções utilitárias
│       ├── auth-rbac.spec.ts      # Testes de autenticação
│       ├── workout-generation.spec.ts  # Testes de geração de treinos
│       └── error-handling.spec.ts # Testes de tratamento de erros
├── playwright.config.ts           # Configuração do Playwright
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI/CD
└── package.json                   # Scripts de teste
```

---

## 🎯 Helpers Disponíveis

### Autenticação
```typescript
import { login, TEST_USERS } from './fixtures/helpers';

await login(page, TEST_USERS.student);
```

### Mock de API
```typescript
import { mockAPIResponse, mockAPITimeout } from './fixtures/helpers';

// Mock de resposta
await mockAPIResponse(page, '/api/workouts', { success: true });

// Mock de timeout
await mockAPITimeout(page, '/api/youtube/search', 5000);
```

### Verificações
```typescript
import { assertNoWhiteScreenOfDeath, waitForToast } from './fixtures/helpers';

// Verificar que não houve crash
await assertNoWhiteScreenOfDeath(page);

// Aguardar toast aparecer
await waitForToast(page, 'Erro ao gerar treino');
```

---

## 📈 Cobertura de Testes

| Categoria | Testes | Status |
|-----------|--------|--------|
| **Autenticação e RBAC** | 13 | ✅ |
| **Geração de Treinos** | 7 | ✅ |
| **Tratamento de Erros** | 9 | ✅ |
| **TOTAL** | **29 testes** | ✅ |

---

## 🐛 Troubleshooting

### Erro: "Browser not found"
```bash
npx playwright install chromium
```

### Erro: "Port 3000 already in use"
```bash
npm run clean-port
```

### Testes lentos
- Use `--headed` para ver o que está acontecendo
- Aumente o timeout em `playwright.config.ts`
- Verifique logs com `--debug`

### CI failing mas local passando
- Verificar variáveis de ambiente no GitHub Actions
- Verificar timeout (CI pode ser mais lento)
- Verificar se build está funcionando: `npm run build`

---

## 📝 Convenções de Escrita de Testes

### Nomenclatura
- Use emojis para identificar tipo de teste:
  - 🔐 Autenticação
  - 🚫 Bloqueio de acesso
  - ✅ Acesso permitido
  - 🚴 Esporte específico
  - ⏱️ Timeout
  - ❌ Erro
  - 🛡️ Proteção contra crash

### Estrutura
```typescript
test('🔐 Login como STUDENT - deve redirecionar para /student/dashboard', async ({ page }) => {
  // 1. Setup
  const user = TEST_USERS.student;
  
  // 2. Ação
  await login(page, user);
  
  // 3. Verificação
  expect(page.url()).toContain('/student/dashboard');
});
```

---

## 🔗 Links Úteis

- [Playwright Docs](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions](https://docs.github.com/en/actions)
- [ForteTrain README](../README.md)

---

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs: `npm run test:debug`
2. Ver relatório HTML: `npm run test:report`
3. Verificar console errors no trace viewer
4. Criar issue no GitHub com screenshots/vídeos

---

**Última Atualização**: 2026-03-30  
**Versão**: v8.0.1  
**Playwright**: v1.58.2  
**Status**: ✅ 29 testes implementados
