# 🤝 Guia de Contribuição - ForteTrain

## 📋 Índice

- [Começando](#começando)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Padrões de Código](#padrões-de-código)
- [Git Workflow](#git-workflow)
- [Testes](#testes)
- [Documentação](#documentação)
- [Pull Requests](#pull-requests)

---

## 🚀 Começando

### 1. Fork e Clone

```bash
# Fork no GitHub
# https://github.com/Araujo39/forte-train

# Clone seu fork
git clone https://github.com/SEU-USERNAME/forte-train.git
cd forte-train

# Adicionar upstream
git remote add upstream https://github.com/Araujo39/forte-train.git
```

### 2. Instalar Dependências

```bash
# Instalar pacotes
npm install

# Instalar Playwright browsers
npx playwright install

# Configurar ambiente
cp .dev.vars.example .dev.vars
# Editar .dev.vars com suas API keys
```

### 3. Setup Database Local

```bash
# Aplicar migrations
npm run db:migrate:local

# Popular com seed data
npm run db:seed

# Verificar dados
npm run db:console:local
```

### 4. Iniciar Desenvolvimento

```bash
# Build
npm run build

# Iniciar servidor (sandbox)
npm run dev:d1

# Ou com PM2
pm2 start ecosystem.config.cjs

# Verificar funcionamento
curl http://localhost:3000
```

---

## 📂 Estrutura do Projeto

```
fortetrain/
├── src/
│   ├── index.tsx              # Entry point Hono
│   ├── routes/
│   │   ├── auth.ts            # Autenticação
│   │   ├── dashboard.ts       # Dashboard Personal Trainer
│   │   ├── student.ts         # Student App
│   │   ├── admin.ts           # Super Admin
│   │   └── api/
│   │       ├── students.ts    # API Alunos
│   │       ├── workouts.ts    # API Treinos
│   │       ├── ai.ts          # API OpenAI
│   │       └── sports.ts      # API Sports Configs
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification
│   │   └── tenant.ts          # Multi-tenant detection
│   └── types/
│       └── bindings.ts        # TypeScript types
├── public/
│   └── static/
│       ├── app.js             # Frontend JS
│       ├── styles.css         # Custom CSS
│       └── sport-theme.js     # Sport Theme System
├── migrations/
│   ├── 0001_initial_schema.sql
│   ├── 0002_add_admin.sql
│   ├── ...
│   └── 0006_omni_sport.sql
├── tests/
│   ├── e2e/
│   │   ├── auth-rbac.spec.ts
│   │   ├── workout-generation.spec.ts
│   │   └── error-handling.spec.ts
│   └── README.md
├── scripts/
│   ├── setup-domain.sh
│   └── README.md
├── docs/
│   ├── DEVOPS_CLOUDFLARE_DOMAIN.md
│   ├── DEVOPS_QUICK_START.md
│   ├── ARCHITECTURE_MULTI_TENANT.md
│   └── ...
├── wrangler.jsonc            # Cloudflare config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📏 Padrões de Código

### TypeScript

```typescript
// ✅ Bom: Tipos explícitos
async function getStudent(id: string): Promise<Student | null> {
  const result = await db.query('SELECT * FROM students WHERE id = ?', [id]);
  return result.rows[0] || null;
}

// ❌ Ruim: any, sem tipos
async function getStudent(id) {
  const result = await db.query('SELECT * FROM students WHERE id = ?', [id]);
  return result.rows[0] || null;
}
```

### Hono Routes

```typescript
// ✅ Bom: Separação de concerns
app.post('/api/students', async (c) => {
  const { env } = c;
  
  // 1. Validar input
  const body = await c.req.json();
  if (!body.full_name) {
    return c.json({ error: 'full_name is required' }, 400);
  }
  
  // 2. Business logic
  const student = await createStudent(env.DB, body);
  
  // 3. Retornar response
  return c.json({ success: true, student }, 201);
});

// ❌ Ruim: Tudo no handler
app.post('/api/students', async (c) => {
  const body = await c.req.json();
  const result = await c.env.DB.prepare('INSERT INTO students...').run();
  return c.json(result);
});
```

### Frontend JavaScript

```javascript
// ✅ Bom: Async/await, error handling
async function loadStudents() {
  try {
    const response = await axios.get('/api/students', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    renderStudents(response.data.students);
  } catch (error) {
    console.error('Failed to load students:', error);
    showErrorToast('Erro ao carregar alunos');
  }
}

// ❌ Ruim: Promises sem catch
function loadStudents() {
  axios.get('/api/students').then(res => {
    renderStudents(res.data.students);
  });
}
```

### CSS/TailwindCSS

```html
<!-- ✅ Bom: Tailwind classes -->
<button class="px-6 py-3 bg-gradient-to-r from-[#CCFF00] to-[#99FF00] 
               text-black font-semibold rounded-xl hover:scale-105 
               transition-transform duration-300">
  Gerar Treino
</button>

<!-- ❌ Ruim: Inline styles -->
<button style="padding: 12px 24px; background: #CCFF00; color: black;">
  Gerar Treino
</button>
```

### Naming Conventions

```typescript
// ✅ Bom
const studentList = [];
function getUserById(id: string) {}
const API_BASE_URL = 'https://api.example.com';

// ❌ Ruim
const list = [];
function get(id: string) {}
const url = 'https://api.example.com';
```

---

## 🌿 Git Workflow

### Branch Naming

```bash
# Features
git checkout -b feat/omni-sport-landing

# Bug fixes
git checkout -b fix/sports-selector-loading

# Documentation
git checkout -b docs/devops-guide

# Refactoring
git checkout -b refactor/student-dashboard-theme

# Tests
git checkout -b test/e2e-workout-generation
```

### Commit Messages

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: Adicionar sport badge no perfil do aluno"

# Bug fixes
git commit -m "fix: Corrigir sports selector que não carregava modalidades"

# Documentation
git commit -m "docs: Adicionar guia de configuração de domínio Cloudflare"

# Refactoring
git commit -m "refactor: Migrar Axios para fetch nativo no AI Generator"

# Tests
git commit -m "test: Adicionar testes E2E para geração de treinos"

# Chore (build, deps, etc)
git commit -m "chore: Atualizar dependências do Playwright"
```

**Formato**:
```
<tipo>(<escopo>): <descrição curta>

<corpo opcional - detalhar mudanças>

<footer opcional - breaking changes, issues>
```

**Tipos**:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, sem mudança de lógica
- `refactor`: Refatoração de código
- `test`: Adicionar/modificar testes
- `chore`: Tarefas de build, dependências

### Rebase vs Merge

```bash
# Atualizar branch com main
git fetch upstream
git rebase upstream/main

# Resolver conflitos
git add .
git rebase --continue

# Force push (só em sua branch)
git push origin feat/sua-feature --force-with-lease
```

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes E2E
npm run test:e2e

# Testes específicos
npm run test:e2e -- tests/e2e/auth-rbac.spec.ts

# Modo debug
npm run test:e2e:debug
```

### Escrever Novos Testes

```typescript
// tests/e2e/nova-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Nova Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
    await page.goto('/auth/login');
    // Login...
  });
  
  test('should do something @smoke', async ({ page }) => {
    // Arrange
    await page.goto('/dashboard');
    
    // Act
    await page.click('[data-testid="new-feature-btn"]');
    
    // Assert
    await expect(page.locator('#result')).toBeVisible();
  });
});
```

### Critérios de Aceitação

- ✅ Todos os testes E2E passando
- ✅ Nenhuma regressão
- ✅ Cobertura > 85%
- ✅ Lighthouse Score > 90

---

## 📝 Documentação

### Atualizar Documentação

Sempre que adicionar nova feature:

1. **README.md**: Adicionar na seção de funcionalidades
2. **Criar guia específico** em `/docs/` (se necessário)
3. **Comentar código complexo**
4. **Atualizar tipos TypeScript**

### Escrever Documentação

```markdown
## 🎯 Nome da Feature

### Visão Geral
Breve descrição da feature (1-2 parágrafos)

### Como Usar
```bash
# Exemplo de comando
npm run feature
```

### Exemplos
Exemplos práticos de uso

### API Reference
Endpoints, parâmetros, respostas

### Troubleshooting
Problemas comuns e soluções
```

---

## 🔀 Pull Requests

### Checklist Antes de Abrir PR

- [ ] Branch atualizada com `main`
- [ ] Testes E2E passando
- [ ] Build sem erros
- [ ] Documentação atualizada
- [ ] Commit messages seguem Conventional Commits
- [ ] Código segue padrões do projeto

### Template de PR

```markdown
## 📋 Descrição

Breve descrição das mudanças

## 🎯 Tipo de Mudança

- [ ] Nova feature
- [ ] Bug fix
- [ ] Documentação
- [ ] Refactoring
- [ ] Testes

## ✅ Checklist

- [ ] Testes E2E passando
- [ ] Documentação atualizada
- [ ] Build sem erros
- [ ] Screenshots adicionados (se UI)

## 📸 Screenshots

Se mudanças de UI, adicionar antes/depois

## 🔗 Issues Relacionadas

Closes #123
Refs #456
```

### Code Review

**Como revisor**:
- ✅ Verificar lógica e implementação
- ✅ Verificar testes
- ✅ Verificar documentação
- ✅ Rodar testes localmente
- ✅ Sugerir melhorias (não bloquear)

**Como autor**:
- ✅ Responder a todos os comentários
- ✅ Implementar mudanças solicitadas
- ✅ Agradecer feedback construtivo
- ✅ Atualizar PR com novas mudanças

---

## 🐛 Reportar Bugs

### Template de Issue

```markdown
## 🐛 Descrição do Bug

Descrição clara e concisa do bug

## 📍 Onde Acontece

- URL: https://fortetrain.pages.dev/dashboard
- Navegador: Chrome 120
- OS: macOS 14

## 🔄 Como Reproduzir

1. Ir para '/dashboard'
2. Clicar em 'Gerar Treino'
3. Selecionar 'Ciclismo'
4. Ver erro

## ✅ Comportamento Esperado

Deveria gerar treino de ciclismo

## ❌ Comportamento Atual

Exibe "Error loading sports"

## 📸 Screenshots

[Adicionar screenshots se aplicável]

## 📋 Logs

```
Console error: ...
```

## 🌐 Ambiente

- Produção ou Desenvolvimento?
- Versão: v8.0.1
```

---

## 💡 Sugerir Melhorias

### Template de Feature Request

```markdown
## 💡 Descrição da Feature

Descrição clara da feature sugerida

## 🎯 Problema que Resolve

Qual problema esta feature resolve?

## 📝 Proposta de Solução

Como você imagina que funcione?

## 🎨 Mockups (Opcional)

Wireframes ou designs

## 🔗 Referências

Links para inspirações
```

---

## 🏆 Reconhecimento

Contribuidores serão reconhecidos:
- 📜 Listados em CONTRIBUTORS.md
- ⭐ Mencionados em release notes
- 🎖️ Badge de contribuidor no GitHub

---

## 📚 Recursos

### Documentação Técnica
- [Hono Framework](https://hono.dev)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [Playwright](https://playwright.dev)

### Comunidade
- **Discord**: [ForteTrain Community](#)
- **GitHub Discussions**: [forte-train/discussions](#)

---

**Agradecemos sua contribuição!** 🎉

Dúvidas? Abra uma [issue](https://github.com/Araujo39/forte-train/issues/new) ou entre em contato.
