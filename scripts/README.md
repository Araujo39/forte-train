# 🛠️ Scripts de DevOps - ForteTrain

## 📂 Estrutura

```
scripts/
├── setup-domain.sh       # Script interativo de configuração de domínio
└── README.md            # Este arquivo
```

---

## 🚀 setup-domain.sh

**Script interativo para configuração de domínio no Cloudflare Pages**

### ✨ Funcionalidades

1. **Verificar Pré-requisitos**
   - Node.js, npm, Wrangler instalados
   - Autenticação Wrangler ativa

2. **Verificar Status DNS**
   - Resolução DNS do domínio
   - Status dos nameservers

3. **Listar Domínios Atuais**
   - Domínios custom configurados no projeto

4. **Adicionar Custom Domains**
   - Adiciona `fortetrain.com` e `www.fortetrain.com` automaticamente

5. **Testar SSL**
   - Verifica certificados SSL válidos

6. **Testar Redirects**
   - Verifica redirect www → root
   - Verifica redirect HTTP → HTTPS

7. **Testar Aplicação**
   - Testa landing page, login, API

8. **Mostrar Instruções**
   - Instruções detalhadas de DNS, SSL, Redirects

9. **Gerar Relatório**
   - Relatório completo de status da configuração

10. **Setup Completo (Automático)**
    - Executa todos os passos acima em sequência

### 📦 Uso

#### Modo Interativo (Recomendado)

```bash
# Executar script interativo
cd /home/user/webapp
./scripts/setup-domain.sh
```

**Menu será exibido:**
```
════════════════════════════════════════════════════════════════
  ForteTrain - Cloudflare Domain Setup
════════════════════════════════════════════════════════════════

Escolha uma opção:

1) ✅ Verificar pré-requisitos
2) 🔍 Verificar status DNS
3) 📋 Listar domínios atuais
4) ➕ Adicionar custom domains
5) 🔒 Testar SSL
6) 🔄 Testar redirects
7) 🌐 Testar aplicação
8) 📚 Mostrar instruções DNS
9) 🔐 Mostrar instruções SSL
10) 🔄 Mostrar instruções Redirect
11) 📊 Gerar relatório completo
12) 🚀 Setup completo (automático)
0) ❌ Sair

Opção:
```

#### Modo Direto (para CI/CD)

```bash
# Executar funções específicas diretamente
cd /home/user/webapp

# Verificar pré-requisitos
./scripts/setup-domain.sh <<< "1"

# Setup completo automático
./scripts/setup-domain.sh <<< "12"
```

### 🔧 Configuração

**Edite as variáveis no topo do script para customizar:**

```bash
PROJECT_NAME="fortetrain"       # Nome do projeto Cloudflare Pages
DOMAIN="fortetrain.com"         # Domínio principal
WWW_DOMAIN="www.fortetrain.com" # Domínio www
PAGES_URL="fortetrain.pages.dev" # URL do Cloudflare Pages
```

### 📊 Output Esperado

#### Sucesso ✅
```
✅ Node.js instalado: v18.19.0
✅ npm instalado: 10.2.3
✅ Wrangler autenticado
✅ DNS resolvendo para fortetrain.com
✅ Domínio fortetrain.com adicionado com sucesso
✅ SSL válido para fortetrain.com
✅ Redirect www → root configurado
✅ Landing page acessível
```

#### Aviso ⚠️
```
⚠️ DNS não configurado para fortetrain.com
   Configure os nameservers do Cloudflare no seu registrador

⚠️ SSL ainda não disponível (aguarde 5 minutos)

⚠️ Redirect www → root não configurado
   Configure Page Rule no Cloudflare Dashboard
```

#### Erro ❌
```
❌ Node.js não encontrado. Instale: https://nodejs.org
❌ Wrangler não autenticado
   Execute: npx wrangler login
❌ Falha ao adicionar fortetrain.com
```

### 🐛 Troubleshooting

#### Erro: "Wrangler não autenticado"
```bash
# Fazer login no Wrangler
npx wrangler login
```

#### Erro: "DNS não configurado"
```bash
# Verificar nameservers
nslookup -type=ns fortetrain.com

# Se não estiver apontando para Cloudflare:
# 1. Login no registrador de domínio
# 2. Atualizar nameservers para os fornecidos pelo Cloudflare
# 3. Aguardar propagação (até 24h)
```

#### Erro: "Falha ao adicionar domínio"
```bash
# Verificar se projeto existe
npx wrangler pages project list

# Verificar se domínio já foi adicionado
npx wrangler pages domain list --project-name fortetrain

# Remover e re-adicionar
npx wrangler pages domain remove fortetrain.com --project-name fortetrain
npx wrangler pages domain add fortetrain.com --project-name fortetrain
```

### 📚 Recursos Adicionais

- **Documentação Completa**: `/docs/DEVOPS_CLOUDFLARE_DOMAIN.md`
- **Quick Start**: `/docs/DEVOPS_QUICK_START.md`
- **Arquitetura Multi-Tenant**: `/docs/ARCHITECTURE_MULTI_TENANT.md`

---

## 🔮 Próximos Scripts (Planejados)

### deploy-production.sh
```bash
# Deploy completo para produção
./scripts/deploy-production.sh
```

**Funcionalidades**:
- Build do projeto
- Aplicar migrations D1
- Deploy para Cloudflare Pages
- Verificar deploy bem-sucedido
- Invalidar cache CDN
- Notificar equipe

### setup-multi-tenant.sh
```bash
# Configurar infraestrutura multi-tenant
./scripts/setup-multi-tenant.sh
```

**Funcionalidades**:
- Criar Cloudflare Worker de routing
- Criar KV namespace para tenants
- Configurar wildcard DNS
- Popular KV com tenants de demo
- Testar subdomains dinâmicos

### backup-database.sh
```bash
# Backup do banco D1 para arquivo local
./scripts/backup-database.sh
```

**Funcionalidades**:
- Exportar D1 para SQL dump
- Comprimir backup
- Upload para AI Drive
- Verificar integridade

### health-check.sh
```bash
# Verificar saúde da aplicação
./scripts/health-check.sh
```

**Funcionalidades**:
- Testar URLs críticas
- Verificar SSL
- Testar API endpoints
- Verificar D1 connection
- Gerar relatório de status

---

## 🤝 Contribuindo

Para adicionar novos scripts:

1. Criar arquivo `.sh` em `/scripts/`
2. Adicionar header com descrição
3. Tornar executável: `chmod +x scripts/nome-do-script.sh`
4. Documentar neste README
5. Commit: `git add scripts/ && git commit -m "feat: Add novo-script.sh"`

---

**Criado em**: 2026-04-05  
**Versão**: 1.0  
**Projeto**: ForteTrain v8.0.1 Omni-Sport
