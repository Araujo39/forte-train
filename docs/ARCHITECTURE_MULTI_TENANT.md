# 🏗️ Arquitetura de Domínio e Multi-Tenant

## 📊 Visão Geral da Infraestrutura

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET (Usuários)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE DNS                             │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │ fortetrain.  │     www.     │   andre.     │     *.       │ │
│  │    com       │ fortetrain.  │ fortetrain.  │ fortetrain.  │ │
│  │              │    com       │    com       │    com       │ │
│  │ CNAME:       │ CNAME:       │ CNAME:       │ CNAME:       │ │
│  │ fortetrain.  │ fortetrain.  │ fortetrain.  │ fortetrain.  │ │
│  │ pages.dev    │ pages.dev    │ pages.dev    │ pages.dev    │ │
│  └──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┘ │
│         │              │              │              │         │
│    Proxy ON ✅    Proxy ON ✅    Proxy ON ✅    Proxy ON ✅     │
└─────────┼──────────────┼──────────────┼──────────────┼─────────┘
          │              │              │              │
          │              │              │              │
          ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│              CLOUDFLARE EDGE NETWORK (CDN Global)               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SSL/TLS Termination (Full Strict)                      │   │
│  │  - Certificado SSL automático                           │   │
│  │  - Always Use HTTPS                                     │   │
│  │  - TLS 1.2+                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  DDoS Protection & WAF                                  │   │
│  │  - Rate limiting                                        │   │
│  │  - Bot detection                                        │   │
│  │  - Firewall rules                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Redirect Rules                                         │   │
│  │  - www.fortetrain.com → fortetrain.com (301)           │   │
│  │  - http:// → https:// (301)                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│          CLOUDFLARE WORKERS (Subdomain Router) - OPCIONAL       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Detecção de Subdomain                                  │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ Hostname: andre.fortetrain.com                   │   │   │
│  │  │ Extract: subdomain = "andre"                     │   │   │
│  │  │ Lookup: KV['andre'] → tenant_id: 1              │   │   │
│  │  │ Add Headers:                                     │   │   │
│  │  │   X-Tenant-ID: 1                                │   │   │
│  │  │   X-Subdomain: andre                            │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Cloudflare KV (Tenant Registry)                        │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ "andre" → {"tenant_id": "1", "name": "André"}   │   │   │
│  │  │ "maria" → {"tenant_id": "2", "name": "Maria"}   │   │   │
│  │  │ "joao"  → {"tenant_id": "3", "name": "João"}    │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              CLOUDFLARE PAGES (Application Server)              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Hono Application (SSR)                                 │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ Request Handler                                  │  │   │
│  │  │ - Read: X-Tenant-ID, X-Subdomain headers        │  │   │
│  │  │ - Fetch: Tenant data from D1                    │  │   │
│  │  │ - Apply: Branding, theme, subdomain context     │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ Routes                                           │  │   │
│  │  │ /                → Landing Page                 │  │   │
│  │  │ /auth/login      → Authentication               │  │   │
│  │  │ /dashboard       → Personal Trainer Dashboard   │  │   │
│  │  │ /student/app     → Student WebApp               │  │   │
│  │  │ /api/*           → REST API                     │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CLOUDFLARE D1 DATABASE                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  fortetrain-production (SQLite)                         │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ tenants (Personal Trainers)                      │  │   │
│  │  │ ├─ id: 1, subdomain: "andre"                    │  │   │
│  │  │ ├─ id: 2, subdomain: "maria"                    │  │   │
│  │  │ └─ id: 3, subdomain: "joao"                     │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ students (End Users)                             │  │   │
│  │  │ ├─ tenant_id: 1 (André's students)              │  │   │
│  │  │ ├─ tenant_id: 2 (Maria's students)              │  │   │
│  │  │ └─ tenant_id: 3 (João's students)               │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ workouts, workout_sessions, ai_logs...           │  │   │
│  │  │ (26 tabelas total)                               │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Requisição

### Cenário 1: Landing Page (Root Domain)

```
User → https://fortetrain.com
  ↓
Cloudflare DNS (CNAME: fortetrain.pages.dev)
  ↓
Cloudflare Edge (SSL + DDoS + WAF)
  ↓
Cloudflare Pages (Hono App)
  ↓
Response: Landing Page HTML
```

### Cenário 2: www Redirect

```
User → https://www.fortetrain.com
  ↓
Cloudflare DNS (CNAME: fortetrain.pages.dev)
  ↓
Cloudflare Edge (Page Rule: 301 Redirect)
  ↓
Response: 301 → https://fortetrain.com
  ↓
User redirected → https://fortetrain.com
```

### Cenário 3: Subdomain Multi-Tenant (com Worker)

```
User → https://andre.fortetrain.com/dashboard
  ↓
Cloudflare DNS (Wildcard CNAME: *.fortetrain.com → fortetrain.pages.dev)
  ↓
Cloudflare Edge (SSL + DDoS + WAF)
  ↓
Cloudflare Worker (subdomain-router)
  ├─ Extract: subdomain = "andre"
  ├─ KV Lookup: KV['andre'] → tenant_id: 1
  ├─ Add Headers: X-Tenant-ID: 1, X-Subdomain: andre
  ↓
Cloudflare Pages (Hono App)
  ├─ Read Headers: tenant_id = 1
  ├─ D1 Query: SELECT * FROM tenants WHERE id = 1
  ├─ Apply Branding: André's logo, colors, subdomain
  ↓
Response: André's Dashboard HTML (customizado)
```

### Cenário 4: API Request com Auth

```
Client → POST https://fortetrain.com/api/ai/generate-workout
         Headers: Authorization: Bearer <JWT>
         Body: {"studentId": "123", "prompt": "Treino de peito"}
  ↓
Cloudflare Edge (CORS + Rate Limiting)
  ↓
Cloudflare Pages (Hono API Route)
  ├─ JWT Verify: Extract tenant_id from token
  ├─ D1 Query: Validate student belongs to tenant
  ├─ OpenAI API: Generate workout via GPT-4o-mini
  ├─ D1 Insert: Save workout to database
  ↓
Response: 200 OK
  {
    "success": true,
    "workoutId": "workout-456",
    "workout": {
      "title": "Treino de Peito",
      "exercises": [...]
    }
  }
```

---

## 🏢 Multi-Tenant Architecture

### Opção A: Worker + KV (Escalável)

```
┌────────────────────────────────────────────────────────────┐
│ Tenant Registry (Cloudflare KV)                           │
├────────────────────────────────────────────────────────────┤
│ Key: "andre"  → Value: {"tenant_id": "1", "name": "..."}  │
│ Key: "maria"  → Value: {"tenant_id": "2", "name": "..."}  │
│ Key: "joao"   → Value: {"tenant_id": "3", "name": "..."}  │
│ Key: "julia"  → Value: {"tenant_id": "4", "name": "..."}  │
│ ...                                                        │
│ (Suporta milhares de tenants)                             │
└────────────────────────────────────────────────────────────┘
         ↑
         │ Lookup em <1ms (edge cache)
         │
┌────────┴───────────────────────────────────────────────────┐
│ Cloudflare Worker (subdomain-router.js)                   │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 1. Parse hostname: andre.fortetrain.com               │ │
│ │ 2. Extract subdomain: "andre"                         │ │
│ │ 3. KV lookup: tenant = await KV.get('andre')          │ │
│ │ 4. If not found → redirect to 404                     │ │
│ │ 5. Add headers: X-Tenant-ID, X-Subdomain              │ │
│ │ 6. Forward request to Pages                           │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

**Vantagens**:
- ✅ Escala infinito: adicionar tenant = 1 registro KV
- ✅ Performance: KV cache global (< 1ms lookup)
- ✅ Automação: API para adicionar tenants dinamicamente
- ✅ Custo: Workers + KV = ~$5/mês para 100k requests

**Desvantagens**:
- ❌ Complexidade: precisa configurar Worker + KV
- ❌ Debug: mais difícil debugar routing issues

### Opção B: Custom Domains Individuais (Simples)

```
┌────────────────────────────────────────────────────────────┐
│ Cloudflare Pages Custom Domains                           │
├────────────────────────────────────────────────────────────┤
│ fortetrain.com                 → Active ✅                 │
│ www.fortetrain.com             → Active ✅                 │
│ andre.fortetrain.com           → Active ✅                 │
│ maria.fortetrain.com           → Active ✅                 │
│ joao.fortetrain.com            → Active ✅                 │
│ ...                                                        │
│ (Máximo ~100 custom domains)                              │
└────────────────────────────────────────────────────────────┘

# Adicionar manualmente via Wrangler
npx wrangler pages domain add andre.fortetrain.com --project-name fortetrain
npx wrangler pages domain add maria.fortetrain.com --project-name fortetrain
```

**Vantagens**:
- ✅ Simples: sem Workers, sem KV
- ✅ Zero config: Cloudflare gerencia tudo
- ✅ Grátis: sem custo adicional

**Desvantagens**:
- ❌ Manual: precisa adicionar cada subdomain
- ❌ Limite: ~100 custom domains por projeto
- ❌ Não escala: inviável para muitos tenants

---

## 📊 Comparativo de Abordagens

| Feature | Worker + KV | Custom Domains |
|---------|-------------|----------------|
| **Tenants Suportados** | Ilimitado | ~100 máximo |
| **Setup Inicial** | Complexo | Simples |
| **Adicionar Tenant** | Automático (API) | Manual (CLI) |
| **Performance** | < 1ms lookup | Instantâneo |
| **Custo Mensal** | ~$5 (100k req) | Grátis |
| **Escalabilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Manutenção** | Baixa | Alta |
| **Recomendado para** | Produção (10+ tenants) | MVP (< 10 tenants) |

---

## 🚀 Recomendações por Fase

### Fase 1: MVP (0-10 tenants)
```
✅ Usar: Custom Domains Individuais
✅ DNS: Root + www + 5-10 subdomains fixos
✅ Backend: Detecção via hostname simples
❌ Não precisa: Workers + KV
```

### Fase 2: Growth (10-100 tenants)
```
⚠️ Migrar para: Worker + KV
✅ DNS: Root + www + Wildcard (*.fortetrain.com)
✅ Backend: Detecção via X-Tenant-ID header
✅ Automação: API para criar tenants
```

### Fase 3: Scale (100+ tenants)
```
✅ Usar: Worker + KV + D1 Registry
✅ DNS: Wildcard único
✅ Backend: Multi-tenant completo
✅ Features: Branding, custom CSS, white-label
```

---

## 📚 Referências

- [Cloudflare Workers Multi-Tenant](https://developers.cloudflare.com/workers/examples/route-to-multiple-origins/)
- [Cloudflare KV Best Practices](https://developers.cloudflare.com/workers/wrangler/workers-kv/)
- [Hono Multi-Tenant Middleware](https://hono.dev/docs/guides/middleware)

---

**Documento criado**: 2026-04-05  
**Projeto**: ForteTrain v8.0.1 Omni-Sport
