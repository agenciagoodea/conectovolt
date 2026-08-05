# PROMPT 62 — ADVANCED BI & DATA WAREHOUSE MODULE

## Contexto

Você está implementando a camada de Business Intelligence, Data Warehouse e Analytics corporativo da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ANALYTICS.md
- docs/ARCHITECTURE.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar uma infraestrutura analítica centralizada para transformar dados operacionais em inteligência estratégica.

---

# Conceito

Fontes de dados

↓

Data Warehouse

↓

Modelos analíticos

↓

Dashboards

↓

Decisões

---

# Estrutura Backend

Criar:

```
modules/business-intelligence/

bi.module.ts

bi.controller.ts

bi.service.ts

warehouse/

etl/

dashboards/

metrics/

reports/

tests/

```

---

# Data Warehouse

Criar:

Central Analytics Storage


Receber dados:

- Usuários.
- Recargas.
- Pagamentos.
- Energia.
- CRM.
- Vendas.
- Frotas.

---

# ETL Pipeline

Criar:

Data Pipeline


Processos:

Extract

↓

Transform

↓

Load

---

# Modelos analíticos

Criar:

Analytics Models


Exemplos:

- Receita.
- Crescimento.
- Retenção.
- Operação.
- Energia.

---

# KPIs executivos

Criar:

Executive Metrics


Monitorar:

## Receita

- MRR.
- ARR.
- Receita por cliente.

## Produto

- Usuários ativos.
- Retenção.
- Uso.

## Operação

- Disponibilidade.
- Recargas.
- Energia.

## Comercial

- Pipeline.
- Conversão.

---

# Dashboard executivo

Criar:

/executive/dashboard


Mostrar:

- Visão global.
- Receita.
- Crescimento.
- Operação.
- Clientes.

---

# Dashboard operador

Criar:

/operator/analytics


Mostrar:

- Postos.
- Receita.
- Utilização.
- Performance.

---

# Dashboard investidor

Criar:

/investor/report


Mostrar:

- Crescimento.
- Mercado.
- Métricas SaaS.
- Impacto.

---

# Relatórios automáticos

Criar:

Report Generator


Permitir:

- Relatórios semanais.
- Relatórios mensais.
- Exportação.

---

# Inteligência AI

Integrar:

AI Module


Gerar:

- Insights automáticos.
- Anomalias.
- Tendências.

---

# Monitoramento em tempo real

Criar:

Real Time Analytics


Acompanhar:

- Recargas acontecendo.
- Falhas.
- Receita.

---

# Banco de Dados

Criar:

## Metric

Campos:

- id
- name
- value
- timestamp


---

## DataSnapshot

Campos:

- id
- source
- data
- created_at

---

# API

Criar:

GET

/bi/dashboard


GET

/bi/kpis


GET

/bi/reports


POST

/bi/export

---

# Segurança

Implementar:

- Controle acesso.
- Dados financeiros protegidos.
- Auditoria relatórios.

---

# Testes

Validar:

- Pipeline dados.
- Cálculo métricas.
- Dashboards.
- Exportação.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Gestores possuem visão completa.

✅ Dados viram decisões.

✅ Relatórios são automatizados.

---

# Entrega

Informar:

1. Data Warehouse criado.
2. KPIs.
3. Dashboards.
4. APIs.
5. Próximo módulo recomendado.