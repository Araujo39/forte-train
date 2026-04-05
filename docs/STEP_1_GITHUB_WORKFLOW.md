# 🚀 GUIA PASSO-A-PASSO: Adicionar GitHub Actions Workflow

## ⏱️ Tempo Estimado: 5 minutos

---

## 📋 PASSO 1: Acessar o Repositório

1. Abra seu navegador
2. Acesse: **https://github.com/Araujo39/forte-train**
3. Faça login (se necessário)

---

## 📋 PASSO 2: Navegar para Actions

1. Na página do repositório, clique na aba **"Actions"** (no topo)

   ```
   Code    Issues    Pull requests    Actions    Projects    ...
                                         ↑
                                    CLIQUE AQUI
   ```

2. Se aparecer uma mensagem de boas-vindas, clique em:
   - **"I understand my workflows, go ahead and enable them"** (se aparecer)
   - OU **"New workflow"** (canto superior direito)

---

## 📋 PASSO 3: Criar Novo Workflow

### Opção A: Interface Simples

1. Clique em **"New workflow"** (botão verde no canto superior direito)
2. Clique em **"set up a workflow yourself"** (link azul no topo)

### Opção B: Ir Direto

1. Acesse diretamente:
   ```
   https://github.com/Araujo39/forte-train/new/main?filename=.github%2Fworkflows%2Fplaywright.yml
   ```

---

## 📋 PASSO 4: Nomear o Arquivo

No campo de nome do arquivo, digite:

```
.github/workflows/playwright.yml
```

**IMPORTANTE**: O nome deve ser exatamente esse! (com as barras `/`)

---

## 📋 PASSO 5: Colar o Conteúdo do Workflow

Copie e cole o código abaixo no editor:

```yaml
name: E2E Tests - Playwright

on:
  pull_request:
    branches: [main, develop]
    paths:
      - 'src/**'
      - 'tests/**'
      - 'package.json'
      - 'wrangler.jsonc'
  
  push:
    branches: [main]
  
  workflow_dispatch:

jobs:
  test:
    name: Playwright E2E Tests
    runs-on: ubuntu-latest
    timeout-minutes: 20
    
    strategy:
      fail-fast: false
      matrix:
        shard: [1/2, 2/2]
    
    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v4
      
      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: 📦 Install dependencies
        run: npm ci
      
      - name: 🎭 Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: 🏗️ Build application
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: 🚀 Start development server
        run: |
          npm run dev:sandbox &
          echo "Waiting for server to start..."
          sleep 10
          curl --retry 10 --retry-delay 2 --retry-connrefused http://localhost:3000 || exit 1
        env:
          PORT: 3000
      
      - name: 🧪 Run Playwright tests
        run: npx playwright test --shard=${{ matrix.shard }}
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:3000
          CI: true
      
      - name: 📊 Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ matrix.shard }}
          path: |
            playwright-report/
            test-results/
          retention-days: 7
      
      - name: 📸 Upload failed test screenshots
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: failed-screenshots-${{ matrix.shard }}
          path: test-results/**/test-failed-*.png
          retention-days: 7
      
      - name: 🎥 Upload failed test videos
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: failed-videos-${{ matrix.shard }}
          path: test-results/**/video.webm
          retention-days: 7
  
  # Job para combinar resultados dos shards
  report:
    name: Generate Test Report
    needs: test
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: 📥 Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: all-reports
      
      - name: 📊 Merge Playwright reports
        run: |
          echo "## 🧪 Playwright E2E Test Results" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          
          if [ -f "all-reports/playwright-report-1-2/results.json" ]; then
            echo "✅ Shard 1/2 completed" >> $GITHUB_STEP_SUMMARY
          fi
          
          if [ -f "all-reports/playwright-report-2-2/results.json" ]; then
            echo "✅ Shard 2/2 completed" >> $GITHUB_STEP_SUMMARY
          fi
          
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "📊 View detailed report in artifacts" >> $GITHUB_STEP_SUMMARY
  
  # Job de status check para bloquear merge
  status-check:
    name: E2E Status Check
    needs: test
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: ✅ Check test results
        run: |
          if [ "${{ needs.test.result }}" == "success" ]; then
            echo "✅ All E2E tests passed!"
            exit 0
          else
            echo "❌ E2E tests failed!"
            exit 1
          fi
```

---

## 📋 PASSO 6: Fazer Commit

1. **Role até o final da página**

2. No campo **"Commit message"**, digite:
   ```
   ci: Add Playwright E2E tests workflow
   ```

3. (Opcional) No campo de descrição estendida, digite:
   ```
   - 29 testes E2E automatizados
   - Paralelização em 2 shards
   - Upload de screenshots e vídeos de falhas
   - Relatórios HTML salvos como artifacts
   ```

4. Selecione: **"Commit directly to the main branch"**

5. Clique no botão verde: **"Commit new file"**

---

## 📋 PASSO 7: Verificar Workflow

1. Após o commit, você será redirecionado automaticamente

2. OU vá manualmente para: **Actions** (aba no topo)

3. Você verá:
   - **"E2E Tests - Playwright"** na lista de workflows
   - Status: 🟡 **Queued** ou ⚙️ **In progress** ou ✅ **Success**

4. Clique no workflow para ver detalhes:
   - 2 jobs paralelos (Shard 1/2 e Shard 2/2)
   - Tempo de execução
   - Logs de cada step

---

## 📋 PASSO 8: Aguardar Primeira Execução (Opcional)

O workflow vai rodar automaticamente porque você fez commit na branch `main`.

**Tempo de execução**: ~5-10 minutos

Você pode:
- ✅ **Aguardar** e ver os resultados
- ✅ **Continuar** para os próximos passos (não precisa esperar)

---

## ✅ CONFIRMAÇÃO DE SUCESSO

Você saberá que funcionou quando:

1. **Na aba Actions**:
   - Aparece workflow **"E2E Tests - Playwright"**
   - Status: ✅ **Success** (verde)

2. **No commit**:
   - Aparece ✅ verde ao lado do commit
   - Tooltip: "All checks have passed"

3. **Artifacts disponíveis**:
   - Clique no workflow
   - Seção "Artifacts" no final
   - Relatórios HTML, screenshots, vídeos

---

## 🐛 TROUBLESHOOTING

### Problema 1: "No workflows found"

**Solução**:
- Verifique se o arquivo está em `.github/workflows/playwright.yml`
- Verifique se fez commit na branch `main`

### Problema 2: Workflow falha ao executar

**Possíveis causas**:
1. **Dependências faltando**: Verificar `npm ci`
2. **Playwright browsers**: Verificar `playwright install`
3. **Server não inicia**: Verificar logs do step "Start development server"

**Ação**:
- Clique no workflow falhado
- Clique no job falhado
- Clique no step com ❌
- Ler logs de erro

### Problema 3: Testes falhando

**Não é problema do workflow!** 

Significa que os testes encontraram bugs. Para ver:
1. Download dos artifacts
2. Abrir `playwright-report/index.html`
3. Ver screenshots e vídeos das falhas

---

## 🎯 PRÓXIMO PASSO

Após adicionar o workflow com sucesso, você pode:

✅ **Continuar imediatamente** para o próximo passo (configurar domínio)

OU

⏳ **Aguardar** a primeira execução do workflow terminar (~10 min)

**Recomendação**: Continue para o próximo passo! O workflow roda em background.

---

## 📊 O QUE VOCÊ GANHOU

Com o workflow configurado:

- ✅ **Testes automáticos** em cada push/PR
- ✅ **Bloqueia merge** se testes falharem (protege o código)
- ✅ **Paralelização** (2 shards = 2x mais rápido)
- ✅ **Relatórios HTML** salvos como artifacts
- ✅ **Screenshots** de testes falhados
- ✅ **Vídeos** de execução de testes
- ✅ **Histórico** de todas as execuções

---

## ⏭️ AVANÇAR PARA PRÓXIMO PASSO

Quando terminar este passo, me avise e vamos para:

**2️⃣ Configurar Domínio fortetrain.com** (30-60 min)

---

**Criado em**: 2026-04-05  
**Tempo estimado**: 5 minutos  
**Dificuldade**: ⭐ Fácil
