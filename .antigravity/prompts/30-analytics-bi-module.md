# PROMPT 30 — ANALYTICS & BUSINESS INTELLIGENCE MODULE

## Contexto

Você está implementando o módulo de inteligência de negócios da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/DATABASE.md
- docs/BUSINESS_MODEL.md
- docs/API.md

---

# Objetivo

Criar uma camada analítica para transformar dados operacionais em indicadores estratégicos.

---

# Conceito

Dados:

Recargas

+

Usuários

+

Postos

+

Financeiro

+

Equipamentos


↓

Analytics Engine


↓

Dashboards inteligentes

---

# Estrutura

Criar:

```
modules/analytics/

analytics.module.ts

analytics.controller.ts

analytics.service.ts

metrics/

aggregations/

queries/

reports/

tests/

```

---

# Métricas principais

Criar:

---

# Receita

Indicadores:

- Receita total.
- Receita média por usuário.
- Receita por posto.
- Receita por período.

---

# Operação

Indicadores:

- Sessões realizadas.
- kWh vendidos.
- Tempo médio de recarga.
- Taxa utilização carregadores.

---

# Usuários

Indicadores:

- Usuários ativos.
- Novos usuários.
- Frequência de uso.
- Retenção.

---

# Postos

Indicadores:

- Postos mais utilizados.
- Horários de maior movimento.
- Performance por localização.

---

# Equipamentos

Indicadores:

- Disponibilidade.
- Tempo offline.
- Falhas.
- Utilização.

---

# KPIs

Criar:

## Utilização do carregador

Fórmula:

Tempo carregando ÷ Tempo disponível


---

## Ticket médio

Fórmula:

Receita total ÷ Número de sessões


---

## Retenção

Fórmula:

Usuários que voltaram ÷ Usuários totais

---

# Dashboard BI Admin

Criar:

/admin/analytics


Mostrar:

Cards:

- GMV.
- Receita SaaS.
- Usuários ativos.
- Energia vendida.


Gráficos:

- Crescimento mensal.
- Mapa de utilização.
- Ranking postos.

---

# Dashboard Operador

Criar:

/operator/analytics


Mostrar:

- Melhor horário.
- Melhor carregador.
- Receita.
- Ocupação.

---

# Mapa inteligente

Criar:

Heatmap


Mostrar:

- Regiões com maior demanda.
- Postos com maior utilização.

---

# Previsão futura

Preparar arquitetura para:

Machine Learning.


Possíveis previsões:

- Demanda futura.
- Necessidade novos carregadores.
- Manutenção preventiva.

---

# Banco de dados

Criar tabelas agregadas:

DailyMetrics

Campos:

- date
- company_id
- sessions
- revenue
- energy


---

StationMetrics

Campos:

- station_id
- utilization
- revenue
- ranking

---

# Performance

Preparar:

- Jobs agendados.
- Cache.
- Processamento assíncrono.

---

# APIs

Criar:

GET

/analytics/platform


GET

/analytics/company


GET

/analytics/station/:id


---

# Segurança

ADMIN:

Todos os dados.


OPERATOR:

Somente sua empresa.


---

# Testes

Validar:

- Cálculos.
- Agregações.
- Permissões.
- Atualização métricas.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Gestores entendem o negócio.

✅ Operadores conseguem melhorar operação.

✅ Dados viram decisões.

---

# Entrega

Informar:

1. Métricas criadas.
2. Dashboards.
3. APIs.
4. Como testar.
5. Próximo módulo recomendado.