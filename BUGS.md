# 🐛 BUGS & ISSUES - ForteTrain v8.0

## 🔴 **BUG CRÍTICO #1: Sports Selector não carrega modalidades**

### 📍 Localização
- **Página**: `/dashboard/ai-generator`
- **URL**: https://fortetrain.pages.dev/dashboard/ai-generator
- **Componente**: `<select id="sportType">`

### 🐛 Sintomas
- Campo "Modalidade Esportiva" fica travado em "Carregando modalidades..."
- Dropdown não popula com as 9 modalidades
- Console mostra erro: "Error loading students: M"

### 🔍 Investigação Realizada

#### ✅ Confirmado Funcionando:
1. **API Endpoint**: ✅ `/api/sports/configs` retorna 9 esportes corretamente
   ```bash
   curl https://fortetrain.pages.dev/api/sports/configs | jq '.sports | length'
   # Output: 9 ✅
   ```

2. **Backend**: ✅ Migration aplicada (local + produção)
3. **Database**: ✅ 9 esportes seedados em `sport_configs`
4. **Authentication**: ✅ Login funciona e gera token JWT

#### ❌ Problema Identificado:
- **Frontend JavaScript** não está executando `loadSports()` corretamente
- **Possíveis causas**:
  1. Race condition entre Axios CDN e script execution
  2. Erro de sintaxe não detectado pelo build (template literals)
  3. Token não disponível no momento da chamada
  4. CORS ou CSP bloqueando a request

### 🔧 Tentativas de Correção (Não Resolveram)

1. **Tentativa #1**: Converter template literals para string concatenation
   - Status: ✅ Build OK, ❌ Problema persiste

2. **Tentativa #2**: Adicionar `await` para Axios carregar
   - Status: ✅ Build OK, ❌ Problema persiste

3. **Tentativa #3**: Adicionar logging detalhado
   - Status: ✅ Build OK, ❌ Problema persiste

4. **Tentativa #4**: Corrigir escape em `loadStudents()`
   - Status: ✅ Build OK, ❌ Problema persiste

### 💡 Próximas Ações para Debug

#### 🔍 **Debug Plan A: Verificar Ordem de Execução**
```javascript
// Adicionar timestamp em cada passo
console.log('[INIT]', Date.now(), 'Starting init...');
console.log('[AXIOS]', Date.now(), 'Axios available:', typeof axios);
console.log('[TOKEN]', Date.now(), 'Token:', token?.substring(0, 20));
```

#### 🔍 **Debug Plan B: Usar Fetch Nativo**
```javascript
// Substituir Axios por fetch nativo
async function loadSports() {
    const response = await fetch('/api/sports/configs', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    sportsConfig = data.sports;
}
```

#### 🔍 **Debug Plan C: Verificar CSP Headers**
```bash
curl -I https://fortetrain.pages.dev/dashboard/ai-generator | grep -i "content-security"
```

#### 🔍 **Debug Plan D: Simplificar Inicialização**
```javascript
// Remover async/await, usar .then()
document.addEventListener('DOMContentLoaded', function() {
    axios.get('/api/sports/configs', { headers: { ... } })
        .then(response => { ... })
        .catch(error => { ... });
});
```

### 📝 Código Relevante

**Arquivo**: `src/routes/dashboard.ts`

**Função loadSports** (linha 646):
```typescript
async function loadSports() {
    try {
        const response = await axios.get('/api/sports/configs', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        sportsConfig = response.data.sports;
        const select = document.getElementById('sportType');
        select.innerHTML = '<option value="">Selecione a modalidade</option>' +
            sportsConfig.map(s => '<option value="' + s.type + '">' + s.name + '</option>').join('');
    } catch (error) {
        console.error('Error loading sports:', error);
        document.getElementById('sportType').innerHTML = '<option value="">Erro ao carregar modalidades</option>';
    }
}
```

**Inicialização** (linha 2018):
```javascript
(async function init() {
    // Wait for Axios
    if (typeof axios === 'undefined') { ... }
    
    await loadSports();   // ← NÃO EXECUTA?
    await loadStudents();
})();
```

### 🎯 Impacto

- **Severidade**: 🔴 CRÍTICA
- **Afeta**: Personal Trainers tentando gerar treinos Omni-Sport
- **Workaround**: Nenhum (funcionalidade bloqueada)
- **Urgência**: Alta

### 📅 Timeline

- **Detectado**: 2026-03-30 04:00 UTC
- **Primeira Tentativa**: 04:05 UTC (template literals)
- **Segunda Tentativa**: 04:10 UTC (Axios wait)
- **Terceira Tentativa**: 04:15 UTC (logging)
- **Status Atual**: 🔴 NÃO RESOLVIDO

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

**Última Atualização**: 2026-03-30 04:20 UTC  
**Status**: 🔴 Bug crítico não resolvido - continuando com próximas fases  
**Deploy**: https://4d2ef24e.fortetrain.pages.dev
