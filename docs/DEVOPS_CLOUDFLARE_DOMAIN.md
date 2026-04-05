# 🌐 Guia DevOps - Configuração de Domínio Cloudflare

## 📋 Índice
- [1. Visão Geral](#1-visão-geral)
- [2. Pré-requisitos](#2-pré-requisitos)
- [3. Configuração DNS no Cloudflare](#3-configuração-dns-no-cloudflare)
- [4. Configurar Custom Domain no Cloudflare Pages](#4-configurar-custom-domain-no-cloudflare-pages)
- [5. Configuração SSL/TLS](#5-configuração-ssltls)
- [6. Configuração de Redirecionamentos](#6-configuração-de-redirecionamentos)
- [7. Preparação para Multi-Tenant (Subdomínios)](#7-preparação-para-multi-tenant-subdomínios)
- [8. Verificação e Testes](#8-verificação-e-testes)
- [9. Troubleshooting](#9-troubleshooting)

---

## 1. Visão Geral

### 🎯 Objetivo
Apontar o domínio **fortetrain.com** para a aplicação ForteTrain hospedada no Cloudflare Pages e preparar a infraestrutura para subdomínios multi-tenant.

### 📊 Arquitetura Final

```
fortetrain.com (root) → Cloudflare Pages (Landing + Auth + Student)
└── www.fortetrain.com → Redirect para root
├── andre.fortetrain.com → Dashboard do Personal Trainer (futuro)
├── maria.fortetrain.com → Dashboard do Personal Trainer (futuro)
└── *.fortetrain.com → Wildcard para multi-tenant (futuro)
```

### 🔧 Stack Tecnológica
- **Projeto Cloudflare Pages**: `fortetrain`
- **Produção URL**: https://fortetrain.pages.dev
- **Custom Domain**: fortetrain.com
- **Database**: Cloudflare D1 (c31185f7-4b89-4f7c-a1bb-05010db70cd0)
- **Region**: ENAM (East North America)

---

## 2. Pré-requisitos

### ✅ Checklist Antes de Começar

- [ ] **Domínio registrado**: fortetrain.com (registrado em algum registrador: GoDaddy, Namecheap, Registro.br, etc.)
- [ ] **Cloudflare Account**: Conta ativa no Cloudflare (Free Plan é suficiente)
- [ ] **Aplicação Deploy**: ForteTrain v8.0.1 rodando em https://fortetrain.pages.dev
- [ ] **Acesso ao Registrador**: Credenciais para atualizar nameservers
- [ ] **Wrangler CLI**: Instalado localmente (`npm install -g wrangler`)
- [ ] **Cloudflare API Token**: Configurado no sandbox (via `setup_cloudflare_api_key`)

### 📦 Informações Necessárias

```bash
# Projeto Cloudflare Pages
PROJECT_NAME="fortetrain"
PAGES_URL="https://fortetrain.pages.dev"

# Domínio
DOMAIN="fortetrain.com"
WWW_DOMAIN="www.fortetrain.com"

# Database
D1_ID="c31185f7-4b89-4f7c-a1bb-05010db70cd0"
D1_NAME="fortetrain-production"
```

---

## 3. Configuração DNS no Cloudflare

### Passo 1: Adicionar Domínio ao Cloudflare

1. **Login no Cloudflare Dashboard**:
   - URL: https://dash.cloudflare.com
   - Faça login com sua conta

2. **Adicionar Site**:
   - Clique em **"Add a Site"** no canto superior direito
   - Digite: `fortetrain.com`
   - Clique em **"Add site"**

3. **Selecionar Plano**:
   - Escolha: **Free** (suficiente para o ForteTrain)
   - Clique em **"Continue"**

4. **Cloudflare Scanner**:
   - Aguarde o scanner detectar registros DNS existentes
   - Clique em **"Continue"**

### Passo 2: Atualizar Nameservers no Registrador

**IMPORTANTE**: Este passo é crítico e pode levar até 24-48 horas para propagar globalmente.

1. **Obter Nameservers do Cloudflare**:
   - Na tela de setup, você verá algo como:
   ```
   Change your nameservers to:
   alex.ns.cloudflare.com
   june.ns.cloudflare.com
   ```

2. **Fazer Login no Registrador**:
   - GoDaddy: https://dcc.godaddy.com/domains
   - Namecheap: https://ap.www.namecheap.com/domains/list
   - Registro.br: https://registro.br/

3. **Atualizar Nameservers**:
   - Encontre **fortetrain.com** na lista de domínios
   - Procure por **"Nameservers"** ou **"DNS Settings"**
   - Altere de **"Default"** ou **"Custom"** para:
   ```
   alex.ns.cloudflare.com
   june.ns.cloudflare.com
   ```
   - **Salve as alterações**

4. **Voltar ao Cloudflare**:
   - Clique em **"Done, check nameservers"**
   - Aguarde a verificação (pode levar até 24h)

### Passo 3: Configurar Registros DNS

**IMPORTANTE**: Aguarde os nameservers serem ativados antes de prosseguir!

1. **Navegar até DNS Settings**:
   - Dashboard Cloudflare → **fortetrain.com** → **DNS** → **Records**

2. **Deletar Registros Existentes** (se houver):
   - Delete registros A, AAAA, CNAME que apontam para outros hosts
   - **NÃO delete** registros MX (email), TXT (verificações), etc.

3. **Criar Registro para Root Domain**:
   ```
   Type: CNAME
   Name: @ (ou fortetrain.com)
   Target: fortetrain.pages.dev
   Proxy status: Proxied (nuvem laranja) ✅
   TTL: Auto
   ```
   - Clique em **"Save"**

4. **Criar Registro para www**:
   ```
   Type: CNAME
   Name: www
   Target: fortetrain.pages.dev
   Proxy status: Proxied (nuvem laranja) ✅
   TTL: Auto
   ```
   - Clique em **"Save"**

5. **Criar Wildcard para Multi-Tenant** (OPCIONAL - Preparação Futura):
   ```
   Type: CNAME
   Name: *
   Target: fortetrain.pages.dev
   Proxy status: Proxied (nuvem laranja) ✅
   TTL: Auto
   ```
   - Clique em **"Save"**
   - **Nota**: Wildcard permite `andre.fortetrain.com`, `maria.fortetrain.com`, etc.

### Passo 4: Ativar Proxy (Nuvem Laranja)

**Por que ativar o Proxy?**
- ✅ **SSL/TLS Grátis**: Certificado SSL automático
- ✅ **CDN Global**: Latência ultra-baixa
- ✅ **DDoS Protection**: Proteção automática contra ataques
- ✅ **Firewall**: Web Application Firewall (WAF)
- ✅ **Analytics**: Métricas de tráfego detalhadas

**Verificar Status**:
- ✅ **Nuvem Laranja**: Proxy ativo (RECOMENDADO)
- ⚪ **Nuvem Cinza**: DNS only (não recomendado)

---

## 4. Configurar Custom Domain no Cloudflare Pages

### Método 1: Via Cloudflare Dashboard (RECOMENDADO para Produção)

1. **Navegar para Cloudflare Pages**:
   - Dashboard Cloudflare → **Workers & Pages** → **fortetrain**

2. **Acessar Custom Domains**:
   - Aba **"Custom domains"**
   - Clique em **"Set up a custom domain"**

3. **Adicionar Domínio Root**:
   - Digite: `fortetrain.com`
   - Clique em **"Continue"**
   - Cloudflare detectará automaticamente o registro DNS
   - Clique em **"Activate domain"**

4. **Adicionar www**:
   - Repita o processo para: `www.fortetrain.com`
   - Clique em **"Activate domain"**

5. **Aguardar Ativação**:
   - Status inicial: **"Initializing"** (⏳ 2-5 minutos)
   - Status final: **"Active"** (✅ SSL emitido)

### Método 2: Via Wrangler CLI (Alternativo)

```bash
# Adicionar domínio root
npx wrangler pages domain add fortetrain.com --project-name fortetrain

# Adicionar www
npx wrangler pages domain add www.fortetrain.com --project-name fortetrain

# Listar domínios configurados
npx wrangler pages domain list --project-name fortetrain
```

**Output esperado**:
```
✅ Successfully added fortetrain.com to fortetrain
✅ Successfully added www.fortetrain.com to fortetrain

Domains:
- fortetrain.com (Active) ✅
- www.fortetrain.com (Active) ✅
- fortetrain.pages.dev (Active) ✅
```

---

## 5. Configuração SSL/TLS

### Passo 1: SSL/TLS Mode

1. **Navegar para SSL/TLS**:
   - Dashboard Cloudflare → **fortetrain.com** → **SSL/TLS** → **Overview**

2. **Selecionar Modo**:
   - **Recomendado**: **Full (strict)** ✅
   - **Alternativo**: **Full** (se houver problemas)
   - **NUNCA**: Flexible (inseguro)

   ```
   Full (strict):
   - Cloudflare ↔ Origin: SSL verificado
   - Client ↔ Cloudflare: SSL Cloudflare
   - ✅ Mais seguro
   ```

3. **Salvar Alterações**:
   - A mudança é instantânea

### Passo 2: Always Use HTTPS

1. **Navegar para Edge Certificates**:
   - **SSL/TLS** → **Edge Certificates**

2. **Ativar Always Use HTTPS**:
   - Toggle: **ON** (verde) ✅
   - Redireciona automaticamente HTTP → HTTPS

3. **Outras Configurações Recomendadas**:
   - ✅ **Automatic HTTPS Rewrites**: ON
   - ✅ **Minimum TLS Version**: TLS 1.2
   - ✅ **Opportunistic Encryption**: ON
   - ❌ **TLS 1.3**: ON (se disponível)

### Passo 3: Verificar Certificado SSL

```bash
# Testar SSL do domínio
curl -I https://fortetrain.com

# Verificar certificado SSL
openssl s_client -connect fortetrain.com:443 -servername fortetrain.com
```

**Output esperado**:
```
SSL certificate verify ok
issuer=C=US; O=Cloudflare, Inc.; CN=Cloudflare Inc ECC CA-3
subject=CN=fortetrain.com
```

---

## 6. Configuração de Redirecionamentos

### Redirect www → root (RECOMENDADO)

**Por que redirecionar?**
- ✅ **SEO**: Evita conteúdo duplicado
- ✅ **UX**: URL limpa e profissional
- ✅ **Analytics**: Consolida métricas

### Método 1: Cloudflare Page Rules (Free Plan: 3 regras)

1. **Navegar para Rules**:
   - Dashboard Cloudflare → **fortetrain.com** → **Rules** → **Page Rules**

2. **Criar Regra**:
   - Clique em **"Create Page Rule"**
   - **URL pattern**: `www.fortetrain.com/*`
   - **Setting**: **Forwarding URL** → **301 Permanent Redirect**
   - **Destination URL**: `https://fortetrain.com/$1`
   - Clique em **"Save and Deploy"**

### Método 2: Cloudflare Redirect Rules (Recomendado para Pro)

1. **Navegar para Redirect Rules**:
   - **Rules** → **Redirect Rules**

2. **Criar Regra**:
   ```
   Field: Hostname
   Operator: equals
   Value: www.fortetrain.com

   Action: Dynamic
   Expression: concat("https://fortetrain.com", http.request.uri.path)
   Status code: 301
   ```

### Método 3: Via Cloudflare Workers (Avançado)

**Criar Worker `redirect-www`**:
```javascript
// redirect-www.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.hostname === 'www.fortetrain.com') {
      url.hostname = 'fortetrain.com';
      return Response.redirect(url.toString(), 301);
    }
    
    return fetch(request);
  }
};
```

**Deploy**:
```bash
npx wrangler deploy redirect-www.js
```

---

## 7. Preparação para Multi-Tenant (Subdomínios)

### Visão da Arquitetura Multi-Tenant

```
fortetrain.com → Landing + Auth
├── andre.fortetrain.com → Dashboard de André (tenant_id: 1)
├── maria.fortetrain.com → Dashboard de Maria (tenant_id: 2)
├── joao.fortetrain.com → Dashboard de João (tenant_id: 3)
└── [subdomain].fortetrain.com → Dynamic tenant routing
```

### Passo 1: Validar Wildcard DNS

1. **Verificar Registro DNS**:
   ```
   Type: CNAME
   Name: *
   Target: fortetrain.pages.dev
   Proxy: Proxied ✅
   ```

2. **Testar Resolução DNS**:
   ```bash
   # Testar subdomínio dinâmico
   nslookup andre.fortetrain.com
   nslookup teste.fortetrain.com
   nslookup qualquer-nome.fortetrain.com
   ```

   **Output esperado**:
   ```
   Non-authoritative answer:
   andre.fortetrain.com canonical name = fortetrain.pages.dev
   ```

### Passo 2: Modificar Cloudflare Pages para Suportar Wildcard

**IMPORTANTE**: Cloudflare Pages **não suporta wildcard domains nativamente**. Você tem 2 opções:

#### Opção A: Cloudflare Workers + KV (RECOMENDADO)

**Arquitetura**:
```
Client Request → Cloudflare Worker → Detecta Subdomain → KV Lookup → Redireciona
```

**Criar Worker `subdomain-router`**:
```javascript
// subdomain-router.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Extrair subdomain
    const subdomain = hostname.split('.')[0];
    
    // Lista de subdomains reservados (não são tenants)
    const reserved = ['www', 'api', 'admin', 'app', 'cdn', 'static'];
    
    // Se é root ou reservado, passa adiante
    if (hostname === 'fortetrain.com' || reserved.includes(subdomain)) {
      return fetch(request);
    }
    
    // Buscar tenant no KV
    const tenant = await env.TENANTS_KV.get(subdomain, { type: 'json' });
    
    if (!tenant) {
      // Tenant não encontrado → Redirect para landing
      return Response.redirect('https://fortetrain.com/404', 302);
    }
    
    // Adicionar header com tenant_id para a aplicação
    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set('X-Tenant-ID', tenant.tenant_id);
    modifiedHeaders.set('X-Subdomain', subdomain);
    
    // Fazer request para Cloudflare Pages com headers modificados
    const modifiedRequest = new Request(request, { headers: modifiedHeaders });
    return fetch(modifiedRequest);
  }
};
```

**Bind KV Namespace**:
```bash
# Criar KV namespace
npx wrangler kv:namespace create TENANTS_KV

# Adicionar bind no wrangler.toml
cat >> wrangler.toml << 'EOF'
[[kv_namespaces]]
binding = "TENANTS_KV"
id = "your-kv-id-here"
EOF
```

**Popular KV com Tenants**:
```bash
# Adicionar tenant "andre"
npx wrangler kv:key put "andre" '{"tenant_id":"1","name":"André Silva"}' \
  --namespace-id=your-kv-id

# Adicionar tenant "maria"
npx wrangler kv:key put "maria" '{"tenant_id":"2","name":"Maria Oliveira"}' \
  --namespace-id=your-kv-id
```

**Deploy Worker**:
```bash
npx wrangler deploy subdomain-router.js
```

**Configurar Route**:
```bash
# Dashboard Cloudflare → Workers & Pages → subdomain-router → Settings → Triggers
# Adicionar Custom Domain: *.fortetrain.com
```

#### Opção B: Custom Domains Individuais (SIMPLES, mas não escala)

**Adicionar cada subdomain manualmente**:
```bash
# Adicionar andre.fortetrain.com
npx wrangler pages domain add andre.fortetrain.com --project-name fortetrain

# Adicionar maria.fortetrain.com
npx wrangler pages domain add maria.fortetrain.com --project-name fortetrain

# Adicionar joao.fortetrain.com
npx wrangler pages domain add joao.fortetrain.com --project-name fortetrain
```

**Limitações**:
- ❌ Não escala: precisa adicionar manualmente cada novo tenant
- ✅ Simples: sem complexidade de Workers
- ✅ Grátis: não gasta quota de Workers

### Passo 3: Modificar Aplicação para Detectar Subdomain

**Backend (Hono) - Detectar Tenant**:
```typescript
// src/middleware/tenant.ts
import { Context, Next } from 'hono';

export async function tenantMiddleware(c: Context, next: Next) {
  const hostname = new URL(c.req.url).hostname;
  const subdomain = hostname.split('.')[0];
  
  // Lista de subdomains reservados
  const reserved = ['www', 'api', 'admin', 'app', 'fortetrain'];
  
  // Se for root ou reservado, não é tenant
  if (hostname === 'fortetrain.com' || reserved.includes(subdomain)) {
    c.set('subdomain', null);
    return next();
  }
  
  // Buscar tenant no D1 por subdomain
  const tenant = await c.env.DB.prepare(`
    SELECT id, name, subdomain, plan_type 
    FROM tenants 
    WHERE subdomain = ? AND status = 'active'
  `).bind(subdomain).first();
  
  if (!tenant) {
    return c.redirect('https://fortetrain.com/404');
  }
  
  // Armazenar no context
  c.set('tenant', tenant);
  c.set('subdomain', subdomain);
  
  return next();
}
```

**Aplicar Middleware**:
```typescript
// src/index.tsx
import { Hono } from 'hono';
import { tenantMiddleware } from './middleware/tenant';

const app = new Hono<{ Bindings: Bindings }>();

// Aplicar middleware global
app.use('*', tenantMiddleware);

// Rotas específicas de tenant
app.get('/dashboard/*', async (c) => {
  const tenant = c.get('tenant');
  
  if (!tenant) {
    return c.redirect('https://fortetrain.com/auth/login');
  }
  
  // Renderizar dashboard com branding do tenant
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${tenant.name} - ForteTrain</title>
    </head>
    <body>
      <h1>Dashboard de ${tenant.name}</h1>
      <p>Subdomain: ${tenant.subdomain}</p>
    </body>
    </html>
  `);
});
```

---

## 8. Verificação e Testes

### Checklist de Verificação

#### DNS e Domínio
- [ ] **Nameservers ativados** no Cloudflare (status: Active)
- [ ] **Registro CNAME root** (@) → fortetrain.pages.dev (Proxied ✅)
- [ ] **Registro CNAME www** → fortetrain.pages.dev (Proxied ✅)
- [ ] **Wildcard CNAME** (*) → fortetrain.pages.dev (Proxied ✅)

#### Cloudflare Pages
- [ ] **Custom domain root** (fortetrain.com) → Status: Active ✅
- [ ] **Custom domain www** (www.fortetrain.com) → Status: Active ✅
- [ ] **Deploy production** funcionando em https://fortetrain.pages.dev

#### SSL/TLS
- [ ] **SSL Mode**: Full (strict) ✅
- [ ] **Always Use HTTPS**: ON ✅
- [ ] **Certificado SSL válido** em https://fortetrain.com
- [ ] **Certificado SSL válido** em https://www.fortetrain.com

#### Redirecionamentos
- [ ] **www → root** redirecionando (301) ✅
- [ ] **HTTP → HTTPS** redirecionando ✅

#### Aplicação
- [ ] **Landing page** acessível em https://fortetrain.com
- [ ] **Login** funcionando em https://fortetrain.com/auth/login
- [ ] **Dashboard** funcionando em https://fortetrain.com/dashboard
- [ ] **Student App** funcionando em https://fortetrain.com/student/app

### Comandos de Teste

```bash
# 1. Testar resolução DNS
nslookup fortetrain.com
nslookup www.fortetrain.com
nslookup andre.fortetrain.com

# 2. Testar HTTP → HTTPS redirect
curl -I http://fortetrain.com

# Output esperado:
# HTTP/1.1 301 Moved Permanently
# Location: https://fortetrain.com/

# 3. Testar www → root redirect
curl -I https://www.fortetrain.com

# Output esperado:
# HTTP/1.1 301 Moved Permanently
# Location: https://fortetrain.com/

# 4. Testar certificado SSL
openssl s_client -connect fortetrain.com:443 -servername fortetrain.com | grep "Verify return code"

# Output esperado:
# Verify return code: 0 (ok)

# 5. Testar aplicação
curl -I https://fortetrain.com

# Output esperado:
# HTTP/2 200
# content-type: text/html

# 6. Testar API
curl -I https://fortetrain.com/api/health

# Output esperado:
# HTTP/2 200
# content-type: application/json

# 7. Testar subdomain (após configurar multi-tenant)
curl -I https://andre.fortetrain.com
```

### Testes no Navegador

1. **Teste Root Domain**:
   - Abrir: https://fortetrain.com
   - Verificar: Landing page carrega corretamente
   - DevTools → Network → Verificar SSL válido (cadeado verde)

2. **Teste www Redirect**:
   - Abrir: https://www.fortetrain.com
   - Verificar: Redireciona para https://fortetrain.com
   - DevTools → Network → Status 301

3. **Teste HTTP Redirect**:
   - Abrir: http://fortetrain.com
   - Verificar: Redireciona para https://fortetrain.com
   - DevTools → Network → Status 301

4. **Teste Login**:
   - Abrir: https://fortetrain.com/auth/login
   - Credenciais: andre@fortetrain.app / demo123
   - Verificar: Redireciona para /dashboard

5. **Teste Student App**:
   - Abrir: https://fortetrain.com/student/app
   - Credenciais: joao.santos@email.com / aluno123
   - Verificar: WebApp carrega treinos

### Ferramentas Online

1. **SSL Labs** (testar SSL):
   - URL: https://www.ssllabs.com/ssltest/
   - Digite: fortetrain.com
   - Resultado esperado: **A** ou **A+**

2. **DNS Checker** (testar propagação DNS):
   - URL: https://dnschecker.org
   - Digite: fortetrain.com
   - Verificar: Todos os servidores resolvendo para Cloudflare IPs

3. **Redirect Checker**:
   - URL: https://httpstatus.io
   - Digite: www.fortetrain.com
   - Verificar: 301 → https://fortetrain.com

4. **Cloudflare Speed Test**:
   - URL: https://speed.cloudflare.com
   - Verificar: Latência global

---

## 9. Troubleshooting

### Problema 1: Nameservers Não Ativam

**Sintoma**: Status permanece "Pending Nameserver Update" por mais de 24h

**Causa**: Nameservers não foram atualizados corretamente no registrador

**Solução**:
```bash
# 1. Verificar nameservers atuais
nslookup -type=ns fortetrain.com

# 2. Comparar com nameservers do Cloudflare
# Se diferentes, atualizar no registrador

# 3. Aguardar propagação (até 24-48h)
# Verificar status em: https://dash.cloudflare.com
```

### Problema 2: SSL Certificate Error

**Sintoma**: "Your connection is not private" (ERR_CERT_COMMON_NAME_INVALID)

**Causa**: Certificado SSL ainda não foi emitido ou domínio não está Proxied

**Solução**:
```bash
# 1. Verificar Proxy Status
# Dashboard → DNS → Records → Verificar nuvem laranja ✅

# 2. Verificar SSL Mode
# Dashboard → SSL/TLS → Overview → Deve estar em "Full (strict)"

# 3. Aguardar emissão (2-5 minutos)
# Dashboard → SSL/TLS → Edge Certificates → Verificar status

# 4. Testar certificado
openssl s_client -connect fortetrain.com:443 -servername fortetrain.com
```

### Problema 3: www Não Redireciona

**Sintoma**: www.fortetrain.com carrega a mesma página que root (conteúdo duplicado)

**Causa**: Redirect rule não configurado

**Solução**:
```bash
# Verificar se CNAME www existe
nslookup www.fortetrain.com

# Criar Page Rule (ver seção 6)
# Dashboard → Rules → Page Rules → Create Page Rule
```

### Problema 4: Custom Domain "Initializing" Infinito

**Sintoma**: Status permanece "Initializing" por mais de 10 minutos

**Causa**: DNS não resolvendo corretamente ou conflito com outro projeto

**Solução**:
```bash
# 1. Verificar DNS
nslookup fortetrain.com

# 2. Remover e re-adicionar domínio
npx wrangler pages domain remove fortetrain.com --project-name fortetrain
npx wrangler pages domain add fortetrain.com --project-name fortetrain

# 3. Verificar conflitos
# Dashboard → Workers & Pages → Verificar se outro projeto usa o domínio
```

### Problema 5: Subdomain Wildcard Não Funciona

**Sintoma**: andre.fortetrain.com retorna 404 ou erro DNS

**Causa**: Wildcard DNS não configurado ou Worker de routing ausente

**Solução**:
```bash
# 1. Verificar wildcard DNS
nslookup andre.fortetrain.com

# 2. Adicionar registro wildcard
# Dashboard → DNS → Records → Add Record
# Type: CNAME, Name: *, Target: fortetrain.pages.dev, Proxy: ON

# 3. Configurar Worker (ver seção 7 - Opção A)

# 4. Testar resolução
curl -I https://andre.fortetrain.com
```

### Problema 6: CORS Errors

**Sintoma**: `Access-Control-Allow-Origin` error no console

**Causa**: Headers CORS não configurados para custom domain

**Solução**:
```typescript
// src/index.tsx
import { cors } from 'hono/cors';

app.use('/api/*', cors({
  origin: [
    'https://fortetrain.com',
    'https://www.fortetrain.com',
    'https://*.fortetrain.com', // Wildcard para subdomains
    'https://fortetrain.pages.dev'
  ],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));
```

### Problema 7: D1 Database Connection Error

**Sintoma**: `Error: D1_ERROR: unable to connect` após custom domain

**Causa**: D1 binding não reconhece novo domínio

**Solução**:
```bash
# 1. Verificar bindings no wrangler.jsonc
cat wrangler.jsonc

# 2. Re-deploy aplicação
npm run build
npx wrangler pages deploy dist --project-name fortetrain

# 3. Verificar variáveis de ambiente
npx wrangler pages secret list --project-name fortetrain
```

### Problema 8: OpenAI API Timeout

**Sintoma**: Gerador de treinos IA fica em loading infinito

**Causa**: Custom domain não tem OpenAI API key configurado

**Solução**:
```bash
# 1. Verificar secret
npx wrangler pages secret list --project-name fortetrain

# 2. Adicionar OPENAI_API_KEY (se ausente)
echo "sk-YOUR-OPENAI-KEY" | npx wrangler pages secret put OPENAI_API_KEY --project-name fortetrain

# 3. Re-deploy
npx wrangler pages deploy dist --project-name fortetrain

# 4. Testar API
curl -X POST https://fortetrain.com/api/ai/generate-workout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR-JWT-TOKEN" \
  -d '{"studentId":"1","prompt":"Treino de peito"}'
```

---

## 📊 Checklist Final de Produção

### Pré-Deploy

- [ ] **Domínio registrado** e nameservers apontando para Cloudflare
- [ ] **D1 Database** populado com seed data
- [ ] **Environment secrets** configurados (OPENAI_API_KEY, JWT_SECRET)
- [ ] **Build produção** testado localmente (`npm run build`)

### DNS & Domínio

- [ ] **Root CNAME** (fortetrain.com) → fortetrain.pages.dev
- [ ] **www CNAME** (www.fortetrain.com) → fortetrain.pages.dev
- [ ] **Wildcard CNAME** (*.fortetrain.com) → fortetrain.pages.dev (opcional)
- [ ] **Proxy status** (nuvem laranja) ativado em todos os registros

### Cloudflare Pages

- [ ] **Custom domain root** adicionado e ativo
- [ ] **Custom domain www** adicionado e ativo
- [ ] **Deploy production** funcionando

### SSL/TLS

- [ ] **SSL Mode**: Full (strict)
- [ ] **Always Use HTTPS**: ON
- [ ] **Minimum TLS Version**: 1.2
- [ ] **Certificado válido** em todos os domínios

### Redirecionamentos

- [ ] **www → root** (301 redirect)
- [ ] **HTTP → HTTPS** (automático via Cloudflare)

### Aplicação

- [ ] **Landing page** carregando
- [ ] **Auth system** funcionando
- [ ] **Dashboard Personal** acessível
- [ ] **Student App** funcional
- [ ] **API endpoints** respondendo
- [ ] **D1 queries** executando

### Performance & Segurança

- [ ] **SSL Labs**: A ou A+
- [ ] **GTmetrix**: Performance Score > 90
- [ ] **Cloudflare Analytics** configurado
- [ ] **Error monitoring** ativo

### Multi-Tenant (Futuro)

- [ ] **Subdomain routing** configurado (Workers + KV)
- [ ] **Tenant detection** no backend
- [ ] **Branding personalizado** por tenant
- [ ] **Subdomains testados**: andre.fortetrain.com, maria.fortetrain.com

---

## 📚 Recursos Adicionais

### Documentação Oficial

- **Cloudflare Pages Custom Domains**: https://developers.cloudflare.com/pages/platform/custom-domains/
- **Cloudflare DNS**: https://developers.cloudflare.com/dns/
- **Cloudflare SSL/TLS**: https://developers.cloudflare.com/ssl/
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/

### Tutoriais em Vídeo

- **Cloudflare Setup**: https://www.youtube.com/cloudflare
- **Custom Domains**: https://www.youtube.com/watch?v=qlKTVj3z1PE

### Comunidade

- **Cloudflare Discord**: https://discord.gg/cloudflaredev
- **Cloudflare Community**: https://community.cloudflare.com/

---

## 🎯 Próximos Passos

Após configurar o domínio principal, você pode:

1. **Configurar Email Routing**:
   - Dashboard → Email → Email Routing
   - Criar alias: contato@fortetrain.com → seu-email@gmail.com

2. **Ativar Analytics Avançado**:
   - Dashboard → Analytics & Logs → Web Analytics
   - Adicionar snippet no HTML

3. **Configurar Firewall Rules**:
   - Dashboard → Security → WAF
   - Bloquear bots maliciosos

4. **Setup Multi-Tenant**:
   - Implementar Worker de routing (seção 7)
   - Adicionar tenants no KV
   - Testar subdomains

5. **Monitoramento**:
   - Configurar Alerts no Cloudflare
   - Integrar Sentry para error tracking
   - Setup Uptime Robot

---

**Documento criado em**: 2026-04-05  
**Versão**: 1.0  
**Projeto**: ForteTrain v8.0.1 Omni-Sport  
**Autor**: DevOps Team
