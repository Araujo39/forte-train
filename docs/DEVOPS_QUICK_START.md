# ⚡ Quick Start - Configuração de Domínio em 15 Minutos

## 🎯 Objetivo
Apontar **fortetrain.com** para https://fortetrain.pages.dev

---

## ✅ Checklist Rápido (Ordem Cronológica)

### 1️⃣ Adicionar Site no Cloudflare (5 min)

```bash
1. Login: https://dash.cloudflare.com
2. Clique: "Add a Site" (canto superior direito)
3. Digite: fortetrain.com
4. Plano: Free (clique Continue)
5. Aguarde: Scanner DNS (clique Continue)
```

### 2️⃣ Atualizar Nameservers (2 min de trabalho + 24h propagação)

```bash
# Cloudflare vai mostrar algo como:
alex.ns.cloudflare.com
june.ns.cloudflare.com

# Fazer login no registrador (GoDaddy, Namecheap, etc.)
# Atualizar nameservers para os valores acima
# Salvar

# Voltar ao Cloudflare → "Done, check nameservers"
# ⏳ AGUARDAR até status = "Active" (pode levar 24h)
```

### 3️⃣ Configurar DNS Records (2 min)

```bash
Dashboard → fortetrain.com → DNS → Records

# Record 1: Root domain
Type: CNAME
Name: @ (ou fortetrain.com)
Target: fortetrain.pages.dev
Proxy: ON (nuvem laranja) ✅
→ Save

# Record 2: www subdomain
Type: CNAME
Name: www
Target: fortetrain.pages.dev
Proxy: ON (nuvem laranja) ✅
→ Save

# Record 3: Wildcard (OPCIONAL - para multi-tenant futuro)
Type: CNAME
Name: *
Target: fortetrain.pages.dev
Proxy: ON (nuvem laranja) ✅
→ Save
```

### 4️⃣ Adicionar Custom Domain no Pages (3 min)

#### Via Dashboard (RECOMENDADO):
```bash
Dashboard → Workers & Pages → fortetrain → Custom domains

# Adicionar root
→ "Set up a custom domain"
Digite: fortetrain.com
→ Continue → Activate domain
⏳ Aguardar status: Active (2-5 min)

# Adicionar www
→ "Set up a custom domain"
Digite: www.fortetrain.com
→ Continue → Activate domain
⏳ Aguardar status: Active (2-5 min)
```

#### Via CLI (Alternativo):
```bash
npx wrangler pages domain add fortetrain.com --project-name fortetrain
npx wrangler pages domain add www.fortetrain.com --project-name fortetrain
```

### 5️⃣ Configurar SSL/TLS (1 min)

```bash
Dashboard → SSL/TLS → Overview
Mode: Full (strict) ✅

Dashboard → SSL/TLS → Edge Certificates
Always Use HTTPS: ON ✅
Automatic HTTPS Rewrites: ON ✅
Minimum TLS Version: 1.2 ✅
```

### 6️⃣ Criar Redirect www → root (2 min)

```bash
Dashboard → Rules → Page Rules → Create Page Rule

URL pattern: www.fortetrain.com/*
Setting: Forwarding URL
Type: 301 - Permanent Redirect
Destination: https://fortetrain.com/$1
→ Save and Deploy
```

---

## 🧪 Testes Rápidos

```bash
# 1. DNS resolvendo?
nslookup fortetrain.com

# 2. SSL válido?
curl -I https://fortetrain.com

# 3. www redirecionando?
curl -I https://www.fortetrain.com

# 4. Landing page carregando?
# Abrir no navegador: https://fortetrain.com

# 5. Login funcionando?
# Abrir: https://fortetrain.com/auth/login
# Credenciais: andre@fortetrain.app / demo123
```

---

## 🚨 Troubleshooting Ultra-Rápido

### ❌ Problema: "DNS_PROBE_FINISHED_NXDOMAIN"
**Solução**: Nameservers não atualizados. Aguarde propagação (até 24h)

### ❌ Problema: "Your connection is not private"
**Solução**: SSL ainda não emitido. Aguarde 5 min e recarregue

### ❌ Problema: www não redireciona
**Solução**: Page Rule não criada. Ver passo 6️⃣

### ❌ Problema: Custom Domain "Initializing" infinito
**Solução**:
```bash
# Remover e re-adicionar
npx wrangler pages domain remove fortetrain.com --project-name fortetrain
npx wrangler pages domain add fortetrain.com --project-name fortetrain
```

---

## ✅ Status Final Esperado

```bash
✅ fortetrain.com → Active (SSL válido)
✅ www.fortetrain.com → Redirecting to root (301)
✅ https://fortetrain.com → Landing page carregando
✅ https://fortetrain.com/auth/login → Login funcionando
✅ https://fortetrain.com/dashboard → Dashboard acessível
```

---

## 🎯 Próximos Passos

Após domínio configurado:

1. **Email Routing** (opcional):
   ```bash
   Dashboard → Email → Email Routing
   Criar: contato@fortetrain.com → seu-email@gmail.com
   ```

2. **Analytics** (recomendado):
   ```bash
   Dashboard → Analytics & Logs → Web Analytics
   Ativar: ON
   ```

3. **Multi-Tenant** (futuro):
   - Ver: `/docs/DEVOPS_CLOUDFLARE_DOMAIN.md` (seção 7)
   - Configurar: Worker + KV para subdomains dinâmicos

---

**Tempo total**: ~15 minutos (+ 24h para propagação DNS)  
**Documento criado**: 2026-04-05  
**Projeto**: ForteTrain v8.0.1
