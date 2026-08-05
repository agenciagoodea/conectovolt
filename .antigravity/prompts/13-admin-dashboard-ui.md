# PROMPT 13 — ADMIN DASHBOARD UI

## Contexto

Você está implementando o dashboard administrativo da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/UX_FLOW.md
- docs/API.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar a primeira tela de gestão da plataforma.

O dashboard será utilizado pelo SUPER_ADMIN.

---

# Rota

Criar:

/admin/dashboard

---

# Estrutura da página

Layout:

Sidebar

+

Header

+

Dashboard Content

---

# Header

Exibir:

- Nome da plataforma.
- Usuário logado.
- Botão sair.

---

# Cards principais

Criar quatro cards:

---

## Receita Total

Mostrar:

- Valor acumulado.
- Comparação período anterior.

Fonte:

GET

/dashboard/admin

---

## Operadores

Mostrar:

- Quantidade de empresas.
- Empresas ativas.

---

## Postos

Mostrar:

- Total cadastrados.
- Postos ativos.

---

## Recargas

Mostrar:

- Total sessões.
- Energia vendida.

---

# Gráficos

Criar:

## Receita por período

Tipo:

Linha


Dados:

- Dia.
- Semana.
- Mês.


---

## Recargas realizadas

Tipo:

Barra


Mostrar:

- Quantidade de sessões.

---

# Tabela Operadores

Criar tabela:

Colunas:

- Empresa.
- Status.
- Postos.
- Receita.
- Data cadastro.


Ações:

- Visualizar.
- Bloquear.
- Editar.

---

# Status da operação

Criar painel:

Mostrar:

Carregadores:

ONLINE

OFFLINE

ERRO


---

# Componentes

Criar:

```
features/dashboard/

AdminDashboard.tsx

RevenueCard.tsx

MetricCard.tsx

RevenueChart.tsx

OperatorsTable.tsx

ChargerStatus.tsx

```

---

# Comunicação API

Consumir:

GET

/dashboard/admin


GET

/companies


---

# Estados da tela

Criar:

Loading:

Skeleton.


Erro:

Mensagem amigável.


Sem dados:

Empty State.

---

# Responsividade

Desktop:

Layout completo.


Tablet:

Cards reorganizados.


Mobile:

Scroll vertical.

---

# Design

Características:

- Profissional.
- Simples.
- Visual SaaS.
- Alta legibilidade.
- Poucos elementos.

---

# Segurança

Somente:

SUPER_ADMIN

pode acessar.

---

# Testes

Validar:

- Dashboard carrega dados.
- Usuário sem permissão é bloqueado.
- Valores aparecem corretamente.
- Loading funciona.
- Erro tratado.

---

# Critério de conclusão

Tela pronta quando:

✅ Admin consegue visualizar o negócio.

✅ Indicadores carregam da API.

✅ Layout está responsivo.

---

# Entrega

Informar:

1. Componentes criados.
2. APIs utilizadas.
3. Como testar.
4. Próxima tela recomendada.