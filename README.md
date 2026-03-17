# FitFlow SaaS - Inteligência Artificial para Personal Trainers

![FitFlow Logo](https://img.shields.io/badge/FitFlow-SaaS-CCFF00?style=for-the-badge&logo=dumbbell)
![Status](https://img.shields.io/badge/Status-MVP-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge)

## 🚀 Visão Geral

O **FitFlow** é um ecossistema digital SaaS B2B2C que permite a Personal Trainers gerirem múltiplos alunos, prescreverem treinos otimizados por IA e automatizarem a retenção via notificações inteligentes.

### 🎯 Diferenciais

- **Gerador de Treinos com IA**: GPT-4o-mini cria fichas técnicas personalizadas em 30 segundos
- **Módulo Vision**: Aluno fotografa equipamento e IA identifica + sugere vídeos tutoriais
- **Dashboard Inteligente**: Alertas de inatividade, análise de evolução e previsão de churn
- **Landing Page Integrada**: Página de vendas pronta para captar alunos
- **Multi-Tenant Seguro**: Arquitetura SaaS com isolamento total de dados

## 🌐 URLs do Projeto

### 🔗 Ambiente de Desenvolvimento
- **URL Pública**: https://3000-ique5rgckdb5657g94zcc-2e77fc33.sandbox.novita.ai
- **API Base**: https://3000-ique5rgckdb5657g94zcc-2e77fc33.sandbox.novita.ai/api
- **Dashboard**: https://3000-ique5rgckdb5657g94zcc-2e77fc33.sandbox.novita.ai/dashboard

### 📍 Principais Endpoints

| Rota | Descrição |
|------|-----------|
| `/` | Landing Page com tema Ultra Dark |
| `/auth/login` | Login do Personal Trainer |
| `/auth/register` | Cadastro de nova conta |
| `/dashboard` | Dashboard principal do Personal |
| `/api/auth/login` | API de autenticação |
| `/api/dashboard/stats` | Estatísticas do dashboard |
| `/api/students` | Gestão de alunos |
| `/api/ai/generate-workout` | Gerador de treinos com IA |

## ✨ Funcionalidades Implementadas

### ✅ Completas
- [x] Landing Page ultra dark (#0D0D0D) com acentos neon (#CCFF00)
- [x] Sistema de autenticação (registro e login)
- [x] Dashboard do Personal Trainer
- [x] Banco de dados D1 multi-tenant
- [x] Gestão de alunos
- [x] Alertas de inatividade
- [x] APIs REST completas
- [x] Integração com OpenAI GPT-4o-mini
- [x] Sistema de logs de IA para controle de custos

### 🚧 Em Desenvolvimento
- [ ] Módulo Vision (identificação de equipamentos)
- [ ] WebApp do Aluno (player de treino)
- [ ] Gerador de treinos com IA (interface completa)
- [ ] Sistema de notificações WhatsApp
- [ ] Analytics avançado
- [ ] Integração com Stripe/pagamentos

## 🗄️ Arquitetura de Dados

### Modelo Multi-Tenant com Isolamento Lógico

```
tenants (Personal Trainers)
├── students (Alunos)
│   ├── workouts (Treinos)
│   ├── workout_sessions (Sessões de treino)
│   └── notifications_log (Notificações)
├── ai_logs (Controle de custos de IA)
└── ai_equipment_cache (Cache de equipamentos identificados)
```

### 📊 Principais Tabelas

- **tenants**: Personal Trainers (id, name, email, subdomain, plan_type)
- **students**: Alunos vinculados ao tenant (id, tenant_id, full_name, goal, physical_data)
- **workouts**: Treinos gerados por IA (id, student_id, exercises, ai_logic_used)
- **ai_logs**: Logs de uso de IA para controle de custos
- **ai_equipment_cache**: Cache de equipamentos identificados pelo Vision

## 🛠️ Stack Tecnológica

### Backend
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Cloudflare Workers/Pages
- **Database**: Cloudflare D1 (SQLite distribuído)
- **ORM**: SQL direto com D1 bindings

### Frontend
- **Design**: TailwindCSS via CDN
- **Icons**: Font Awesome 6.4.0
- **Charts**: Chart.js (para analytics)
- **HTTP Client**: Axios

### IA & Integrações
- **OpenAI**: GPT-4o-mini para geração de treinos
- **OpenAI Vision**: GPT-4o-vision para identificação de equipamentos
- **YouTube Data API**: Busca de vídeos tutoriais

## 🎨 Design System

### Paleta de Cores (Carbon & Neon)
- **Background**: `#0D0D0D` (Deep Space - preto quase absoluto)
- **Surface**: `#1A1A1A` (Carbon - cards e inputs)
- **Primary**: `#CCFF00` (Neon Green - ações e CTAs)
- **Secondary**: `#007AFF` (Electric Blue - métricas)
- **Alert**: `#FF3B30` (Warning - inatividade)
- **Text**: `#FFFFFF` (títulos) e `#A0A0A0` (secundário)

### Princípios de UI
- **Glassmorphism**: Desfoque de fundo em modais
- **Micro-interações**: Feedback tátil e animações suaves
- **Card-Based Layout**: Informações organizadas em cards

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Cloudflare (para deploy em produção)
- OpenAI API Key (para funcionalidades de IA)

### Instalação Local

```bash
# Clone o repositório
git clone <repository-url>
cd webapp

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .dev.vars.example .dev.vars
# Edite .dev.vars com suas chaves de API

# Crie o banco de dados local
npm run db:migrate:local
npm run db:seed

# Build do projeto
npm run build

# Inicie o servidor de desenvolvimento
pm2 start ecosystem.config.cjs

# Ou sem PM2
npm run dev:d1
```

### Acessar a Aplicação

1. **Landing Page**: http://localhost:3000
2. **Login**: http://localhost:3000/auth/login
3. **Criar Conta**: http://localhost:3000/auth/register

### Conta Demo
- **Email**: andre@fitflow.app
- **Senha**: demo123

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Vite dev server
npm run dev:sandbox      # Wrangler dev (sandbox)
npm run dev:d1          # Wrangler dev com D1 local

# Build & Deploy
npm run build           # Build para produção
npm run deploy          # Deploy para Cloudflare Pages
npm run deploy:prod     # Deploy com nome de projeto

# Database
npm run db:migrate:local    # Aplicar migrations local
npm run db:migrate:prod     # Aplicar migrations produção
npm run db:seed             # Popular com dados de teste
npm run db:reset            # Reset completo do banco
npm run db:console:local    # Console SQL local
npm run db:console:prod     # Console SQL produção

# Utilidades
npm run clean-port      # Limpar porta 3000
npm run test            # Testar servidor local
```

## 🗺️ Roadmap de Desenvolvimento

### Sprint 1 (Dias 1-5) ✅ CONCLUÍDO
- [x] Estrutura do projeto Hono + Cloudflare Pages
- [x] Banco de dados D1 com schema multi-tenant
- [x] Landing Page ultra dark com design neon
- [x] Sistema de autenticação
- [x] Dashboard básico do Personal

### Sprint 2 (Dias 6-15) 🚧 EM ANDAMENTO
- [ ] Módulo Vision (identificação de equipamentos)
- [ ] Integração completa OpenAI GPT-4o-mini
- [ ] YouTube API para busca de vídeos
- [ ] Interface do Gerador de Treinos IA

### Sprint 3 (Dias 16-25)
- [ ] WebApp do Aluno (PWA)
- [ ] Player de Treino com checklist
- [ ] Diário de Carga
- [ ] Sistema de notificações

### Sprint 4 (Dias 26-30)
- [ ] Integração com Stripe/pagamentos
- [ ] Analytics avançado
- [ ] Testes de stress
- [ ] Preparação para Arnold Sports Festival

## 📊 Status do Projeto

| Módulo | Status | Progresso |
|--------|--------|-----------|
| Landing Page | ✅ Completo | 100% |
| Autenticação | ✅ Completo | 100% |
| Dashboard | ✅ Completo | 90% |
| API REST | ✅ Completo | 85% |
| Banco de Dados | ✅ Completo | 100% |
| Gerador IA | 🚧 Parcial | 60% |
| Módulo Vision | ⏳ Pendente | 0% |
| WebApp Aluno | ⏳ Pendente | 0% |
| Notificações | ⏳ Pendente | 20% |
| Pagamentos | ⏳ Pendente | 0% |

## 🔐 Segurança

- **Isolamento de Dados**: Row Level Security (RLS) simulado via queries filtradas por tenant_id
- **Autenticação JWT**: Tokens com expiração de 7 dias
- **Hash de Senhas**: SHA-256 (Web Crypto API)
- **CORS**: Configurado para rotas de API
- **Variáveis de Ambiente**: Secrets protegidos em .dev.vars

## 💰 Planos de Preço

### Plano Start
- **R$ 89,90/mês**
- Até 10 alunos
- Gerador de Treinos IA
- Dashboard Básico

### Plano Pro (Recomendado)
- **R$ 199,90/mês**
- Alunos Ilimitados
- Gerador IA Avançado
- Módulo Vision
- Landing Page Personalizada
- Notificações WhatsApp
- Analytics Completo
- Suporte Prioritário

## 📈 Métricas de Performance

- **Speed-to-Workout**: Criar treino completo em < 30 segundos
- **Retenção**: +200% com alertas inteligentes
- **Disponibilidade**: 24/7 com IA ativa
- **Custo de IA**: Monitorado em tempo real via ai_logs

## 🏆 Lançamento: Arnold Sports Festival 2026

O FitFlow foi desenvolvido para lançamento no Arnold Sports Festival 2026 em São Paulo, com foco em:

- ⚡ **Speed-to-Workout**: Treino em 30s usando voz
- 📱 **WhatsApp Integrado**: PDF e link do app direto no Zap
- 💰 **Dashboard de Rentabilidade**: Ganhos e previsão de churn

## 📝 Notas de Desenvolvimento

### Última Atualização
- **Data**: 2026-03-17
- **Versão**: 1.0 MVP
- **Status**: ✅ Em produção no sandbox
- **Próximos Passos**: Implementar Módulo Vision e WebApp do Aluno

### Comandos Úteis

```bash
# Ver logs em tempo real
pm2 logs fitflow-saas --nostream

# Restart da aplicação
fuser -k 3000/tcp && pm2 restart fitflow-saas

# Rebuild após mudanças
npm run build && pm2 restart fitflow-saas

# Consultar banco de dados
npm run db:console:local
```

## 🤝 Contribuindo

Este é um projeto proprietário desenvolvido para o Arnold Sports Festival 2026. Para questões de desenvolvimento, contate o time do FitFlow.

## 📄 Licença

Copyright © 2026 FitFlow SaaS. Todos os direitos reservados.

---

**Desenvolvido com ❤️ e ☕ por André Silva**

*Transformando Personal Trainers em empresas de alta performance através da Inteligência Artificial*
