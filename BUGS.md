# 🐛 BUGS & ISSUES - ForteTrain v8.0

## 🟡 **BUG #1: Sports Selector não carrega modalidades** (PARCIALMENTE RESOLVIDO)

### 📍 Localização
- **Página**: `/dashboard/ai-generator`
- **URL**: https://fortetrain.pages.dev/dashboard/ai-generator
- **Componente**: `<select id="sportType">`

### 🐛 Sintomas
- Campo "Modalidade Esportiva" fica travado em "Carregando modalidades..."
- Dropdown não popula com as 9 modalidades
- Console mostra erro: "Error loading students: M"

### 🔧 Correção Aplicada (v8.0.1)

✅ **Substituído Axios por fetch nativo**:
```javascript
// ANTES (com Axios)
const response = await axios.get('/api/sports/configs', {
    headers: { 'Authorization': 'Bearer ' + token }
});

// DEPOIS (com fetch)
const response = await fetch('/api/sports/configs', {
    headers: { 'Authorization': 'Bearer ' + token }
});
const data = await response.json();
```

### 📅 Timeline
- **Detectado**: 2026-03-30 04:00 UTC
- **Fix Aplicado**: 04:45 UTC (fetch nativo)
- **Deploy**: https://c291fcf6.fortetrain.pages.dev
- **Status Atual**: 🟡 TESTANDO (aguardando confirmação do usuário)

---

## 🟢 **ISSUE #2: Template Literals Conflitos (RESOLVIDO)**

### 📍 Localização
- **Arquivo**: `src/routes/dashboard.ts`
- **Linhas**: 890-920 (renderização de exercícios)

### 🐛 Sintoma
- Build falha com erro de sintaxe em template literals
- Problema: template literals aninhados não escapados

### ✅ Solução Aplicada
Converter template literals aninhados para concatenação de strings:
```javascript
// ANTES (erro)
contentHtml += `<div class="${value ? 'block' : 'hidden'}">...</div>`;

// DEPOIS (correto)
contentHtml += '<div class="' + (value ? 'block' : 'hidden') + '">...</div>';
```

**Commit**: `48eacbd` - fix: Corrigir template literals no AI Generator

---

## 🟢 **ISSUE #3: loadSports() não era chamado (RESOLVIDO)**

### 🐛 Sintoma
- Função `loadSports()` definida mas nunca executada
- Dropdown ficava com "Carregando modalidades..." permanente

### ✅ Solução Aplicada
Adicionar chamada no IIFE de inicialização:
```javascript
(async function() {
    // Wait for Axios
    while (typeof axios === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    await loadSports();  // ← ADICIONADO
    await loadStudents();
})();
```

**Commit**: `a6624aa` - fix: Adicionar logs detalhados e corrigir template literals

---

## 📋 Outros Issues Menores

### ⚠️ **Issue #2: Tailwind CDN Warning**
- **Mensagem**: "cdn.tailwindcss.com should not be used in production"
- **Impacto**: Performance (não crítico)
- **Solução**: Instalar Tailwind como PostCSS plugin

### ⚠️ **Issue #3: Autocomplete Attributes**
- **Mensagem**: "Input elements should have autocomplete attributes"
- **Impacto**: Acessibilidade (baixo)
- **Solução**: Adicionar `autocomplete="current-password"` nos inputs

---

**Última Atualização**: 2026-03-30 05:00 UTC  
**Status**: 🟡 Bug #1 testando fetch nativo - Phases 3 & 4 completadas  
**Deploy**: https://7fb33a6e.fortetrain.pages.dev  
**Commits Relevantes**:
- `c8576c9`: feat: Sport Badge & Dynamic Icons
- `48f7b9d`: fix: Fetch nativo no AI Generator
- `a6624aa`: fix: Template literals + loadSports call
