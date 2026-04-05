# 🌐 GUIA PASSO-A-PASSO: Configurar Domínio fortetrain.com

## ⏱️ Tempo Estimado: 30-60 minutos + 24 horas (propagação DNS)

---

## 📋 PRÉ-REQUISITOS

Antes de começar, você precisa:

- ✅ **Domínio registrado**: fortetrain.com (em GoDaddy, Namecheap, Registro.br, etc.)
- ✅ **Acesso ao registrador**: Login e senha do registrador
- ✅ **Conta Cloudflare**: Conta gratuita (criar em cloudflare.com se não tiver)
- ✅ **Wrangler autenticado**: Já está OK ✅

---

## 🚀 OPÇÃO A: Script Automático (RECOMENDADO)

### Vantagens:
- ✅ Automatiza verificações
- ✅ Testa cada etapa
- ✅ Gera relatório de status
- ✅ Comandos pré-configurados

### Como usar:

```bash
cd /home/user/webapp
chmod +x scripts/setup-domain.sh
./scripts/setup-domain.sh
```

**Menu aparecerá com 12 opções. Você pode:**

1. **Opção 12**: Setup completo automático (faz tudo de uma vez)
2. **Opções 1-11**: Executar passo a passo

**Recomendação**: Use opção 12 para automação completa!

---

## 🎯 OPÇÃO B: Passo a Passo Manual (Detalhado)

Se preferir fazer manualmente ou o script não funcionar:

---

### FASE 1: Adicionar Domínio no Cloudflare (10 min)

#### 1.1 Login no Cloudflare

1. Acesse: **https://dash.cloudflare.com**
2. Faça login (ou crie conta se não tiver)

#### 1.2 Adicionar Site

1. Clique em **"Add a Site"** (canto superior direito)
2. Digite: `fortetrain.com`
3. Clique: **"Add site"**

#### 1.3 Selecionar Plano

1. Escolha: **"Free"** (plano gratuito)
2. Clique: **"Continue"**

#### 1.4 Scanner DNS

1. Cloudflare vai escanear registros DNS existentes
2. Aguarde: ~30 segundos
3. Clique: **"Continue"**

---

### FASE 2: Atualizar Nameservers (5 min + 24h propagação)

#### 2.1 Copiar Nameservers do Cloudflare

Cloudflare vai mostrar algo como:

```
Change your nameservers to:

alex.ns.cloudflare.com
june.ns.cloudflare.com
```

**✏️ ANOTE ESSES VALORES!** Você precisará deles.

#### 2.2 Login no Registrador

Escolha seu registrador:

**GoDaddy**:
1. Acesse: https://dcc.godaddy.com/domains
2. Login com suas credenciais
3. Encontre: fortetrain.com
4. Clique: **"DNS"** ou **"Manage DNS"**

**Namecheap**:
1. Acesse: https://ap.www.namecheap.com/domains/list
2. Login
3. Encontre: fortetrain.com
4. Clique: **"Manage"**

**Registro.br**:
1. Acesse: https://registro.br
2. Login
3. Encontre: fortetrain.com
4. Clique: **"Alterar Servidores DNS"**

#### 2.3 Atualizar Nameservers

1. Procure por: **"Nameservers"** ou **"DNS Servers"**
2. Altere de **"Default"** para **"Custom"**
3. Cole os nameservers do Cloudflare:
   ```
   alex.ns.cloudflare.com
   june.ns.cloudflare.com
   ```
4. **Salve as alterações**

#### 2.4 Confirmar no Cloudflare

1. Volte para o Cloudflare
2. Clique: **"Done, check nameservers"**
3. Aguarde: Status mudará de "Pending" para "Active" (pode levar até 24h)

⏰ **ATENÇÃO**: Esta etapa pode demorar até 24 horas! Você pode:
- ✅ Aguardar a ativação
- ✅ Continuar com os próximos passos (configurar DNS, etc.)

---

### FASE 3: Configurar DNS Records (5 min)

⚠️ **IMPORTANTE**: Só faça isso DEPOIS dos nameservers estarem ativos!

#### 3.1 Navegar para DNS

1. Cloudflare Dashboard
2. Selecione: **fortetrain.com**
3. Clique em: **"DNS"** → **"Records"**

#### 3.2 Deletar Registros Antigos (se houver)

- Delete registros A, AAAA, CNAME que apontam para outros hosts
- **NÃO delete**: MX (email), TXT (verificações)

#### 3.3 Criar Registro Root Domain

Clique em **"Add record"**:

```
Type: CNAME
Name: @ (ou fortetrain.com)
Target: fortetrain.pages.dev
Proxy status: Proxied (nuvem laranja 🟠)
TTL: Auto
```

Clique: **"Save"**

#### 3.4 Criar Registro www

Clique em **"Add record"** novamente:

```
Type: CNAME
Name: www
Target: fortetrain.pages.dev
Proxy status: Proxied (nuvem laranja 🟠)
TTL: Auto
```

Clique: **"Save"**

#### 3.5 Criar Wildcard (OPCIONAL - para multi-tenant futuro)

```
Type: CNAME
Name: *
Target: fortetrain.pages.dev
Proxy status: Proxied (nuvem laranja 🟠)
TTL: Auto
```

Clique: **"Save"**

---

### FASE 4: Adicionar Custom Domain no Cloudflare Pages (10 min)

#### 4.1 Via Dashboard Cloudflare

1. Dashboard Cloudflare
2. Menu lateral: **"Workers & Pages"**
3. Clique em: **"fortetrain"** (seu projeto)
4. Aba: **"Custom domains"**
5. Clique: **"Set up a custom domain"**

#### 4.2 Adicionar Root Domain

1. Digite: `fortetrain.com`
2. Clique: **"Continue"**
3. Cloudflare detecta DNS automaticamente
4. Clique: **"Activate domain"**
5. Aguarde: Status "Initializing" → "Active" (2-5 min)

#### 4.3 Adicionar www Domain

Repita o processo:

1. **"Set up a custom domain"**
2. Digite: `www.fortetrain.com`
3. **"Continue"** → **"Activate domain"**
4. Aguarde status: "Active"

#### 4.4 Via CLI (Alternativo)

```bash
# Adicionar root
npx wrangler pages domain add fortetrain.com --project-name fortetrain

# Adicionar www
npx wrangler pages domain add www.fortetrain.com --project-name fortetrain

# Listar domínios
npx wrangler pages domain list --project-name fortetrain
```

---

### FASE 5: Configurar SSL/TLS (5 min)

#### 5.1 SSL Mode

1. Dashboard Cloudflare → **fortetrain.com**
2. Menu: **"SSL/TLS"** → **"Overview"**
3. Selecionar: **"Full (strict)"** ✅
4. Mudança é instantânea

#### 5.2 Always Use HTTPS

1. Menu: **"SSL/TLS"** → **"Edge Certificates"**
2. Ativar: **"Always Use HTTPS"** → ON
3. Ativar: **"Automatic HTTPS Rewrites"** → ON
4. Configurar: **"Minimum TLS Version"** → 1.2

---

### FASE 6: Criar Redirect www → root (5 min)

#### 6.1 Via Page Rules (Free Plan: 3 regras)

1. Dashboard → **fortetrain.com**
2. Menu: **"Rules"** → **"Page Rules"**
3. Clique: **"Create Page Rule"**

Configuração:

```
URL pattern: www.fortetrain.com/*
Setting: Forwarding URL
Type: 301 - Permanent Redirect
Destination URL: https://fortetrain.com/$1
```

4. Clique: **"Save and Deploy"**

---

### FASE 7: Testar e Validar (10 min)

#### 7.1 Testar DNS

```bash
# Root domain
nslookup fortetrain.com

# www
nslookup www.fortetrain.com

# Wildcard (opcional)
nslookup andre.fortetrain.com
```

#### 7.2 Testar HTTP → HTTPS

```bash
curl -I http://fortetrain.com
# Deve retornar: 301 → https://fortetrain.com
```

#### 7.3 Testar www → root

```bash
curl -I https://www.fortetrain.com
# Deve retornar: 301 → https://fortetrain.com
```

#### 7.4 Testar SSL

```bash
curl -I https://fortetrain.com
# Deve retornar: 200 OK
```

#### 7.5 Testar Navegador

Abra no navegador:

1. **https://fortetrain.com**
   - ✅ Landing page carrega
   - ✅ Cadeado verde (SSL válido)

2. **https://www.fortetrain.com**
   - ✅ Redireciona para root

3. **http://fortetrain.com**
   - ✅ Redireciona para https://

4. **https://fortetrain.com/auth/login**
   - ✅ Página de login carrega
   - Login: andre@fortetrain.app / demo123

5. **https://fortetrain.com/dashboard**
   - ✅ Dashboard carrega após login

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Use esta checklist para garantir que tudo está OK:

### DNS & Domínio
- [ ] Nameservers atualizados no registrador
- [ ] Status "Active" no Cloudflare
- [ ] Registro CNAME @ → fortetrain.pages.dev
- [ ] Registro CNAME www → fortetrain.pages.dev
- [ ] Proxy (nuvem laranja) ativado em todos

### Cloudflare Pages
- [ ] Custom domain fortetrain.com → Active
- [ ] Custom domain www.fortetrain.com → Active
- [ ] Deploy production funcionando

### SSL/TLS
- [ ] SSL Mode: Full (strict)
- [ ] Always Use HTTPS: ON
- [ ] Certificado válido em fortetrain.com
- [ ] Certificado válido em www.fortetrain.com

### Redirects
- [ ] www → root (301 redirect)
- [ ] HTTP → HTTPS (automático)

### Aplicação
- [ ] Landing page: https://fortetrain.com
- [ ] Login: https://fortetrain.com/auth/login
- [ ] Dashboard: https://fortetrain.com/dashboard
- [ ] Student App: https://fortetrain.com/student/app
- [ ] API: https://fortetrain.com/api/health

---

## 🐛 TROUBLESHOOTING

### Problema: "DNS_PROBE_FINISHED_NXDOMAIN"

**Causa**: Nameservers não atualizados ou propagação DNS não completa

**Solução**:
```bash
# Verificar nameservers atuais
nslookup -type=ns fortetrain.com

# Se não for Cloudflare, aguardar propagação (até 24h)
```

### Problema: "Your connection is not private"

**Causa**: Certificado SSL ainda não emitido

**Solução**: Aguardar 5 minutos e recarregar página

### Problema: Custom Domain "Initializing" infinito

**Solução**:
```bash
# Remover e re-adicionar
npx wrangler pages domain remove fortetrain.com --project-name fortetrain
npx wrangler pages domain add fortetrain.com --project-name fortetrain
```

### Problema: www não redireciona

**Solução**: Verificar Page Rule foi criada corretamente

---

## 📊 TEMPO ESTIMADO POR FASE

| Fase | Tempo | Espera |
|------|-------|--------|
| 1. Adicionar no Cloudflare | 10 min | - |
| 2. Atualizar nameservers | 5 min | 24h |
| 3. Configurar DNS | 5 min | - |
| 4. Custom domain | 10 min | 5 min |
| 5. SSL/TLS | 5 min | - |
| 6. Redirects | 5 min | - |
| 7. Testar | 10 min | - |
| **TOTAL** | **50 min** | **24h** |

---

## ⏭️ PRÓXIMO PASSO

Quando seu domínio estiver configurado e funcionando, me avise!

Vamos para: **3️⃣ Executar Testes E2E** (10 minutos)

---

**Criado em**: 2026-04-05  
**Tempo estimado**: 30-60 min + 24h DNS  
**Dificuldade**: ⭐⭐ Médio
