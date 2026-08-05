# PROMPT 102 — DATA PLATFORM & OPERATIONAL ANALYTICS MODULE

## Contexto

Você está criando a plataforma de dados e analytics operacional da ConectoVolt.

O objetivo é transformar dados de operação em informações estratégicas para clientes e gestão interna.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/FINANCE.md
- docs/OPERATIONS.md

---

# Objetivo

Criar uma camada de dados para monitoramento, análise e tomada de decisão.

---

# Conceito

Dados operação

↓

Processamento

↓

Indicadores

↓

Decisão

---

# Estrutura Backend

Criar:

```
modules/data-platform/

data-warehouse/

pipelines/

analytics/

dashboards/

reports/

metrics/

tests/

```

---

# Coleta dados

Integrar:

## Carregadores

Dados:

- Sessões.
- Energia.
- Disponibilidade.
- Erros.


## Usuários

Dados:

- Uso.
- Frequência.
- Preferências.


## Financeiro

Dados:

- Receita.
- Custos.
- Margem.

---

# Data Warehouse

Criar:

Centralização dados


Organizar:

- Operação.
- Clientes.
- Financeiro.
- Energia.

---

# Pipeline dados

Criar:

Data Processing Pipeline


Fluxo:

Entrada dados

↓

Validação

↓

Processamento

↓

Armazenamento

---

# Métricas principais

Criar:

Operational KPIs


## Estações

- Disponibilidade.
- Utilização.
- Receita.


## Recargas

- Quantidade.
- Energia consumida.
- Duração.


## Clientes

- Usuários ativos.
- Retenção.
- Frequência.


## Financeiro

- Receita.
- Margem.
- Crescimento.

---

# Analytics operador

Criar:

Operator Analytics Dashboard


Mostrar:

- Performance estações.
- Receita.
- Uso horários.
- Problemas.

---

# Analytics plataforma

Criar:

Company Analytics Dashboard


Mostrar:

- Crescimento.
- Clientes.
- Receita.
- Operação global.

---

# Relatórios automáticos

Criar:

Report Generator


Gerar:

- Relatório mensal.
- Performance estação.
- Relatório financeiro.

---

# Alertas inteligentes

Criar:

Analytics Alert System


Detectar:

- Queda utilização.
- Falhas recorrentes.
- Perda receita.

---

# Banco de Dados

Criar:

## Metric

Campos:

- name
- value
- date


---

## DataEvent

Campos:

- type
- source
- timestamp


---

## Report

Campos:

- customer
- period
- file

---

# API

Criar:

GET

/analytics/dashboard


GET

/analytics/stations


GET

/analytics/revenue


GET

/analytics/reports

---

# Dashboard executivo

Criar:

Executive Analytics Center


Mostrar:

- Saúde plataforma.
- Crescimento.
- Operação.
- Receita.

---

# Segurança

Implementar:

- Controle acesso dados.
- Separação clientes.
- Proteção informações sensíveis.

---

# Testes

Validar:

- Entrada dados.
- Processamento.
- Dashboards.
- Relatórios.

---

# Critério conclusão

O módulo está pronto quando:

✅ Operadores conseguem entender performance.

✅ A empresa toma decisões com dados.

✅ Clientes recebem relatórios de valor.

---

# Entrega

Informar:

1. Dados coletados.
2. Métricas.
3. Dashboards.
4. Relatórios.
5. Próximo módulo recomendado.