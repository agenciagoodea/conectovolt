# PROMPT 14 — OPERATOR DASHBOARD UI

## Contexto

Você está implementando o dashboard do operador da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/UX_FLOW.md
- docs/API.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar o painel para empresas operadoras acompanharem sua operação.

O operador deve visualizar somente seus próprios dados.

---

# Rota

Criar:

/operator/dashboard

---

# Permissão

Acesso:

OPERATOR

---

# Estrutura

Layout:

Sidebar operador

+

Header

+

Dashboard

---

# Header

Exibir:

- Nome da empresa.
- Usuário conectado.
- Notificações.
- Logout.

---

# Cards principais

Criar:

---

## Receita Bruta

Mostrar:

Valor total das recargas.

---

## Receita Líquida

Mostrar:

Valor após comissão da plataforma.

---

## Energia Vendida

Mostrar:

kWh consumidos.

---

## Saldo Disponível

Mostrar:

Valor disponível para saque.

---

# Indicadores Operacionais

Criar cards:

## Postos

Mostrar:

- Total.
- Ativos.


## Carregadores

Mostrar:

- Online.
- Offline.
- Manutenção.


## Recargas

Mostrar:

- Hoje.
- Semana.
- Mês.

---

# Gráficos

## Receita por período

Tipo:

Linha


Dados:

- Dia.
- Semana.
- Mês.


---

## Utilização dos carregadores

Tipo:

Barras


Mostrar:

- Sessões por carregador.

---

# Lista de postos

Criar tabela:

Colunas:

- Nome.
- Cidade.
- Status.
- Carregadores.
- Receita.


Ações:

- Visualizar.
- Editar.

---

# Status dos carregadores

Criar componente:

ChargerStatusWidget


Mostrar:

ONLINE

OFFLINE

ERROR


---

# Últimas recargas

Criar tabela:

Colunas:

- Data.
- Cliente.
- Posto.
- Energia.
- Valor.
- Status.

---

# Carteira

Criar card:

Mostrar:

Saldo atual.

Botão:

Solicitar saque.

---

# Componentes

Criar:

```
features/operator-dashboard/

OperatorDashboard.tsx

RevenueCard.tsx

BalanceCard.tsx

EnergyCard.tsx

StationsTable.tsx

ChargingHistory.tsx

ChargerStatus.tsx

```

---

# APIs

Consumir:

GET

/dashboard/operator


GET

/wallet


GET

/charging/history


GET

/stations


GET

/chargers

---

# Estados

Criar:

Loading:

Skeleton.


Erro:

Mensagem amigável.


Sem dados:

Orientação para cadastrar posto.

---

# UX

Prioridades:

- Informação financeira clara.
- Fácil entendimento.
- Poucos cliques.
- Visual profissional.

---

# Segurança

Nunca permitir:

Operador visualizar dados de outro operador.

Validar:

Backend sempre.

Frontend apenas como camada visual.

---

# Testes

Validar:

- Dashboard carrega.
- Dados da empresa correta aparecem.
- Saldo correto.
- Histórico correto.
- Permissões funcionando.

---

# Critério de conclusão

O painel está pronto quando:

✅ Operador acompanha o negócio.

✅ Visualiza receita.

✅ Visualiza operação.

✅ Acessa carteira.

---

# Entrega

Informar:

1. Componentes criados.
2. APIs utilizadas.
3. Como testar.
4. Próxima tela recomendada.