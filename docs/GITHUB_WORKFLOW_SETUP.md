# ⚠️ ATENÇÃO: Adicionar GitHub Actions Workflow Manualmente

## 🎯 Problema

O GitHub App usado para autenticação não possui permissão `workflows` para criar/atualizar arquivos de workflow automaticamente.

## ✅ Solução

Adicionar o arquivo de workflow **manualmente** via interface web do GitHub.

---

## 📋 Passo a Passo

### 1. Acessar GitHub Repository

```
https://github.com/Araujo39/forte-train
```

### 2. Navegar para Actions

1. Clique na aba **"Actions"** no topo
2. Se aparecer mensagem "Get started with GitHub Actions", clique em **"Skip this and set up a workflow yourself"**

### 3. Criar Novo Workflow

1. Clique em **"New workflow"** (canto superior direito)
2. Clique em **"set up a workflow yourself"**
3. Nome do arquivo: `.github/workflows/playwright.yml`

### 4. Colar Conteúdo do Workflow

Copie e cole o conteúdo abaixo:

```yaml
name: Playwright E2E Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npx playwright test --shard=${{ matrix.shard }}/4
        env:
          BASE_URL: ${{ secrets.BASE_URL || 'http://localhost:3000' }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
      
      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
          retention-days: 30
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results-${{ matrix.shard }}
          path: test-results/
          retention-days: 7

  # Job para combinar relatórios de todos os shards
  report:
    name: Combine Reports
    if: always()
    needs: [test]
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Download all reports
        uses: actions/download-artifact@v4
        with:
          path: all-reports
          pattern: playwright-report-*
      
      - name: Merge reports
        run: |
          npm ci
          npx playwright merge-reports --reporter html ./all-reports
      
      - name: Upload combined report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-combined
          path: playwright-report/
          retention-days: 30
```

### 5. Commit do Workflow

1. No campo de commit message, digite:
   ```
   ci: Add Playwright E2E tests workflow
   ```

2. Selecione **"Commit directly to the main branch"**

3. Clique em **"Commit new file"**

---

## 🔧 Configurar Secrets (Opcional)

Para testes rodarem corretamente, configure secrets no GitHub:

### 1. Navegar para Settings

```
Repository → Settings → Secrets and variables → Actions
```

### 2. Adicionar Secrets

Clique em **"New repository secret"** para cada:

#### BASE_URL (Opcional)
- **Name**: `BASE_URL`
- **Value**: `https://fortetrain.pages.dev`

#### OPENAI_API_KEY (Recomendado para testes completos)
- **Name**: `OPENAI_API_KEY`
- **Value**: `sk-...` (sua chave OpenAI)

#### JWT_SECRET (Recomendado)
- **Name**: `JWT_SECRET`
- **Value**: `fortetrain-jwt-secret-2026` (ou seu secret)

---

## ✅ Verificar Funcionamento

### 1. Ir para Actions Tab

```
https://github.com/Araujo39/forte-train/actions
```

### 2. Verificar Workflow

- Deve aparecer **"Playwright E2E Tests"** na lista
- Status: ✅ (se passou) ou ❌ (se falhou)

### 3. Ver Resultados

Clique no workflow para ver:
- ✅ 4 jobs paralelos (shards)
- ✅ Tempo de execução
- ✅ Logs de cada teste
- ✅ Relatórios HTML (artifacts)

---

## 🐛 Troubleshooting

### Workflow não aparece

**Solução**: Faça um push qualquer para main:
```bash
git commit --allow-empty -m "trigger: Test workflow"
git push origin main
```

### Testes falhando

**Possíveis causas**:
1. **BASE_URL incorreto**: Verificar secret
2. **Dependencies faltando**: Verificar `npm ci`
3. **Browsers não instalados**: Verificar `playwright install`

**Verificar logs**:
1. Actions → Workflow run → Job → Step logs

### Secrets não configurados

**Não é crítico**: Workflow roda sem secrets, mas:
- Testes de IA podem falhar (sem OPENAI_API_KEY)
- Autenticação pode falhar (sem JWT_SECRET)

---

## 📊 Benefícios do Workflow

Com o workflow configurado:

- ✅ **Testes automáticos** em cada PR
- ✅ **Bloqueia merge** se testes falharem
- ✅ **Paralelização** (4 shards = 4x mais rápido)
- ✅ **Relatórios HTML** salvos como artifacts
- ✅ **Screenshots** de falhas
- ✅ **Vídeos** de testes falhados
- ✅ **Histórico** de execuções

---

## 🎯 Status Atual

- ✅ **Código pushed**: https://github.com/Araujo39/forte-train
- ⏳ **Workflow pendente**: Adicionar manualmente (seguir passos acima)
- ✅ **Testes locais**: Funcionando (29 testes)
- ✅ **Documentação**: Completa

---

## 📚 Documentação Relacionada

- **Testes E2E**: `/tests/README.md`
- **GitHub Actions**: https://docs.github.com/en/actions
- **Playwright CI**: https://playwright.dev/docs/ci

---

**Criado em**: 2026-04-05  
**Motivo**: GitHub App sem permissão `workflows`  
**Solução**: Adicionar workflow manualmente via web interface
