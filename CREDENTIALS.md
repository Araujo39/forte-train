# 🔐 ForteTrain - Credenciais de Acesso (3 Perfis)

## 📊 Sistema de Roles Implementado

O ForteTrain possui **3 níveis de acesso** com permissões diferentes:

### 1️⃣ **ADMIN** - Administrador do Sistema
- **Visualiza**: Todos os Personal Trainers e todos os Alunos
- **Acesso**: Dashboard Admin (`/admin`)
- **Permissões**: View all tenants, view all students, manage system, view analytics

**Credenciais:**
```
📧 Email: admin@fortetrain.app
🔑 Senha: admin123
```

**Login URL**: https://fortetrain.pages.dev/auth/login  
**Dashboard**: https://fortetrain.pages.dev/admin

---

### 2️⃣ **PERSONAL** - Personal Trainer
- **Gerencia**: Apenas seus próprios alunos
- **Acesso**: Dashboard Personal (`/dashboard`)
- **Permissões**: CRUD de alunos, criar treinos, enviar notificações, analytics próprio

**Credenciais:**
```
📧 Email: andre@fortetrain.app
🔑 Senha: demo123
```

**Login URL**: https://fortetrain.pages.dev/auth/login  
**Dashboard**: https://fortetrain.pages.dev/dashboard

---

### 3️⃣ **ALUNO** - Estudante/Cliente
- **Visualiza**: Apenas seus próprios dados e treinos
- **Acesso**: WebApp do Aluno (`/student/app`)
- **Permissões**: Ver treinos, registrar cargas, usar módulo Vision

**Credenciais (3 alunos disponíveis):**

**Aluno 1 - João Santos:**
```
📧 Email: joao.santos@email.com
🔑 Senha: aluno123
```

**Aluno 2 - Maria Oliveira:**
```
📧 Email: maria.oliveira@email.com
🔑 Senha: aluno123
```

**Aluno 3 - Carlos Mendes:**
```
📧 Email: carlos.mendes@email.com
🔑 Senha: aluno123
```

**Login URL**: https://fortetrain.pages.dev/auth/login  
**WebApp**: https://fortetrain.pages.dev/student/app

---

## 🔒 Estrutura de Autenticação

### JWT Token Payload:

**Admin:**
```json
{
  "userId": "admin-super-001",
  "email": "admin@fortetrain.app",
  "role": "admin"
}
```

**Personal:**
```json
{
  "tenantId": "tenant-demo-1",
  "userId": "tenant-demo-1",
  "email": "andre@fortetrain.app",
  "role": "personal"
}
```

**Aluno:**
```json
{
  "studentId": "student-1",
  "userId": "student-1",
  "tenantId": "tenant-demo-1",
  "email": "joao.santos@email.com",
  "role": "student"
}
```

---

## 📋 Permissões por Role

| Funcionalidade | Admin | Personal | Aluno |
|----------------|-------|----------|-------|
| Ver todos os Personal Trainers | ✅ | ❌ | ❌ |
| Ver todos os Alunos (global) | ✅ | ❌ | ❌ |
| Gerenciar próprios alunos | ✅ | ✅ | ❌ |
| Criar treinos | ✅ | ✅ | ❌ |
| Ver próprios treinos | ✅ | ✅ | ✅ |
| Usar módulo Vision | ✅ | ✅ | ✅ |
| Enviar notificações | ✅ | ✅ | ❌ |
| Analytics global | ✅ | ❌ | ❌ |
| Analytics próprio | ✅ | ✅ | ✅ |
| Gerenciar sistema | ✅ | ❌ | ❌ |

---

## 🗄️ Banco de Dados

### Tabelas Criadas:
```sql
✅ admin_users     -- Usuários administradores
✅ tenants         -- Personal Trainers (role column added)
✅ students        -- Alunos (password_hash column added)
✅ workouts        -- Treinos
✅ workout_sessions -- Sessões de treino
✅ notifications_log -- Notificações
✅ ai_logs         -- Logs de IA
✅ ai_equipment_cache -- Cache de equipamentos
```

### Migrations Aplicadas:
- `0001_initial_schema.sql` - Schema inicial
- `0002_add_user_roles.sql` - Sistema de roles

---

## 🧪 Testar Logins

### Teste Admin:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fortetrain.app","password":"admin123"}'
```

### Teste Personal:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"andre@fortetrain.app","password":"demo123"}'
```

### Teste Aluno:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao.santos@email.com","password":"aluno123"}'
```

---

## 🚀 Próximos Passos

1. **Deploy em Produção**:
   - Aplicar migrations no D1 produção
   - Popular com seed-roles
   - Testar todos os logins

2. **Criar Interfaces Específicas**:
   - Dashboard Admin completo (visualizar todos tenants)
   - Student WebApp com restrições de acesso
   - Middleware de autorização por role

3. **Segurança**:
   - Rate limiting por role
   - Audit log de ações admin
   - 2FA para admins (opcional)

---

**Desenvolvido com 💪 por ForteTrain Team**
