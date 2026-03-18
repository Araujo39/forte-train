# 🧪 Guia de Teste - Página de Detalhes do Aluno

## 📋 Credenciais de Acesso

### 🎓 Login como Aluno (João Santos)
```
URL: https://fortetrain.pages.dev/auth/login
Email: joao.santos@email.com
Senha: aluno123
```

**Observação**: O aluno será redirecionado para `/student/app` após o login.

### 👨‍🏫 Login como Personal Trainer (Para ver detalhes dos alunos)
```
URL: https://fortetrain.pages.dev/auth/login
Email: andre@fortetrain.app
Senha: demo123
```

Após o login como Personal, acesse:
- **Lista de Alunos**: https://fortetrain.pages.dev/dashboard/students
- **Detalhes do João**: https://fortetrain.pages.dev/dashboard/student/student-1

## 🎯 Cenários de Teste

### 1️⃣ Visualizar Detalhes do Aluno

**Como Personal Trainer:**

1. Faça login em: https://fortetrain.pages.dev/auth/login
   - Email: `andre@fortetrain.app`
   - Senha: `demo123`

2. Acesse a lista de alunos: https://fortetrain.pages.dev/dashboard/students

3. Clique no botão **"Ver Mais"** no card do **João Santos**

4. Você será redirecionado para: `/dashboard/student/student-1`

### 2️⃣ Explorar as 5 Tabs

#### 📊 Tab 1: Visão Geral
- ✅ Ver informações pessoais (email, telefone, data de cadastro)
- ✅ Ver últimas medições (peso, BF%, massa muscular)
- ✅ Ver metas ativas
- ✅ Ver fotos recentes (últimas 4)

#### 📸 Tab 2: Fotos de Progresso
- ✅ Visualizar galeria com 4 fotos do João Santos
- ✅ Filtrar por tipo (Todas, Antes, Depois, Progresso, Equipamento)
- ✅ Clicar nas fotos para visualizar em tamanho real
- ✅ Ver descrições e datas das fotos

**Fotos disponíveis:**
1. Foto inicial (antes) - 90 dias atrás
2. Progresso 30 dias - 60 dias atrás
3. Progresso 60 dias - 30 dias atrás
4. Resultado final (depois) - 7 dias atrás

#### 📏 Tab 3: Medições & Evolução
- ✅ Ver gráfico de evolução de peso (85.5kg → 78.5kg)
- ✅ Ver gráfico de evolução de gordura corporal (22.5% → 16.2%)
- ✅ Ver tabela histórica com 4 medições
- ✅ Analisar todas as métricas: peso, BF%, massa muscular, IMC

**Evolução do João:**
- **Inicial** (90 dias): 85.5kg, 22.5% BF
- **30 dias** (60 dias): 83.2kg, 20.8% BF
- **60 dias** (30 dias): 80.8kg, 18.5% BF
- **Atual** (7 dias): 78.5kg, 16.2% BF
- **Resultado**: -7kg, -6.3% BF 🎉

#### 💪 Tab 4: Histórico de Treinos
- ✅ Ver lista de treinos realizados pelo aluno
- ✅ Ver datas, descrições e número de exercícios
- ✅ Status de conclusão

#### 🎯 Tab 5: Metas
- ✅ Ver metas ativas e completadas
- ✅ Meta completada: "Perder 7kg e reduzir gordura corporal para competição" ✅
- ✅ Meta ativa: "Ganhar 3-4kg de massa muscular magra mantendo BF baixo"
- ✅ Ver peso alvo, BF alvo e prazos

### 3️⃣ Adicionar Nova Foto

1. Na página de detalhes do aluno, clique em **"Adicionar Foto"**
2. Preencha o formulário:
   - **URL da Foto**: Cole uma URL válida (ex: https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400)
   - **Tipo**: Selecione "Progresso"
   - **Descrição**: "Nova foto de teste"
   - **Tags**: "frente, lateral"
3. Clique em **"Salvar Foto"**
4. A foto será adicionada à galeria

### 4️⃣ Adicionar Nova Medição

1. Clique em **"Nova Medição"** (botão azul)
2. Preencha os campos desejados:
   - **Peso**: 77.8 kg
   - **Altura**: 175 cm
   - **Gordura Corporal**: 15.5%
   - **Massa Muscular**: 63.2 kg
   - **Circunferências**: Peito 105cm, Cintura 79cm, etc.
3. Selecione **"Medido por"**: Personal Trainer
4. Adicione observações (opcional)
5. Clique em **"Salvar Medição"**
6. Os gráficos serão atualizados automaticamente

### 5️⃣ Stats Cards

Verifique os cards no topo da página:
- **Card 1**: Treinos Realizados (verde)
- **Card 2**: Fotos de Progresso (amarelo neon) - Deve mostrar 4
- **Card 3**: Medições Registradas (azul) - Deve mostrar 4
- **Card 4**: Metas Ativas (laranja) - Deve mostrar 1

## 🔍 Outros Alunos para Testar

### Maria Oliveira (student-2)
```
URL: https://fortetrain.pages.dev/dashboard/student/student-2
Dados:
- 2 fotos de progresso
- 3 medições (68kg → 63.2kg)
- 2 metas ativas (weight_loss + endurance)
```

### Carlos Pereira (student-3)
```
URL: https://fortetrain.pages.dev/dashboard/student/student-3
Dados:
- 1 foto inicial
- 2 medições (92.5kg → 94.8kg - ganho muscular)
- 2 metas ativas (muscle_gain + strength)
```

## ✅ Checklist de Funcionalidades

### Interface
- [ ] Todas as 5 tabs carregam corretamente
- [ ] Sidebar de navegação funciona
- [ ] Botão "Voltar para Alunos" redireciona corretamente
- [ ] Tema dark (#0D0D0D) está aplicado
- [ ] Ícones FontAwesome carregam

### Dados
- [ ] Nome e email do aluno aparecem no header
- [ ] Stats cards mostram números corretos
- [ ] Fotos carregam da galeria
- [ ] Gráficos Chart.js renderizam
- [ ] Tabela de medições exibe histórico completo
- [ ] Metas mostram status correto (ativa/completada)

### Interações
- [ ] Modal de adicionar foto abre/fecha
- [ ] Modal de adicionar medição abre/fecha
- [ ] Filtro de fotos funciona
- [ ] Fotos abrem em nova aba ao clicar
- [ ] Formulários validam campos obrigatórios
- [ ] Mensagens de sucesso aparecem após salvar

### Responsividade
- [ ] Layout adapta para mobile
- [ ] Galeria de fotos fica em grid responsivo
- [ ] Gráficos são responsivos
- [ ] Tabela de medições tem scroll horizontal

## 🐛 Possíveis Problemas

### "Token not found"
- **Causa**: Não está logado
- **Solução**: Faça login novamente como Personal Trainer

### "Student not found"
- **Causa**: ID do aluno inválido
- **Solução**: Use student-1, student-2 ou student-3

### Fotos não carregam
- **Causa**: URLs do Unsplash podem estar bloqueadas
- **Solução**: Use URLs diretas de imagens ou adicione novas fotos

### Gráficos não aparecem
- **Causa**: Não há dados de medição suficientes
- **Solução**: Adicione pelo menos 2 medições com peso e BF%

## 📸 Screenshots Esperados

### Visão Geral
- 4 cards coloridos no topo
- 4 seções: Info pessoal, Últimas medições, Metas ativas, Fotos recentes

### Galeria de Fotos
- Grid de fotos com hover effect
- Filtro dropdown no canto superior direito
- Badge com tipo da foto (before/after/progress)

### Gráficos de Evolução
- Linha amarela (peso) com pontos marcados
- Linha laranja (BF%) com tendência de queda
- Eixos X (tempo) e Y (valores) claramente visíveis

### Tabela de Medições
- Colunas: Data, Peso, Gordura, Músculo, IMC, Medido por
- Linhas com hover effect
- Scroll horizontal em mobile

## 🎉 Resultado Esperado

Ao final dos testes, você deve:
- ✅ Conseguir visualizar todos os dados de progresso do João Santos
- ✅ Navegar entre as 5 tabs sem problemas
- ✅ Adicionar novas fotos e medições
- ✅ Ver gráficos de evolução atualizados
- ✅ Entender a jornada completa do aluno (fotos, medições, metas)

## 📞 Suporte

Se encontrar algum problema:
1. Verifique o console do navegador (F12)
2. Confirme que está logado como Personal Trainer
3. Teste com outro aluno (student-2 ou student-3)
4. Reporte o erro com print da tela

---

**Última atualização**: v5.0 (18/03/2026)
**URL de Produção**: https://fortetrain.pages.dev
