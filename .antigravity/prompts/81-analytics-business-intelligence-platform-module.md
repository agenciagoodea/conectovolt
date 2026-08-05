# PROMPT 81 — ANALYTICS & BUSINESS INTELLIGENCE PLATFORM MODULE

## Contexto

Você está implementando a plataforma de dados, analytics e inteligência de negócios da ConectoVolt.

Este módulo consolida informações operacionais, financeiras e estratégicas.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/AI_MODULE.md
- docs/ARCHITECTURE.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar uma plataforma completa de análise de dados para tomada de decisão.

---

# Conceito

Dados brutos

↓

Processamento

↓

Indicadores

↓

Dashboards

↓

Decisão

---

# Estrutura Backend

Criar:

```
modules/analytics/

analytics.module.ts

analytics.controller.ts

analytics.service.ts

data-pipeline/

warehouse/

metrics/

dashboards/

reports/

tests/

```

---

# Data Pipeline

Criar:

Data Processing Pipeline


Coletar:

- Usuários.
- Sessões.
- Energia.
- Pagamentos.
- Estações.
- Frotas.
- ESG.

---

# Data Warehouse

Criar:

Analytical Database


Separar:

- Dados operacionais.
- Dados históricos.
- Métricas agregadas.

---

# Sistema KPIs

Criar:

KPI Engine


Métricas:

## Operacionais

- Estações ativas.
- Disponibilidade.
- Tempo médio recarga.
- Falhas.


## Financeiras

- Receita.
- Ticket médio.
- Crescimento.
- Margem.


## Usuários

- Usuários ativos.
- Retenção.
- Frequência recarga.


## Energia

- kWh vendidos.
- Consumo médio.
- Eficiência.


## ESG

- CO₂ evitado.
- Impacto ambiental.

---

# Dashboard executivo

Criar:

Executive Dashboard


Mostrar:

- Crescimento plataforma.
- Receita.
- Usuários.
- Operação.
- Tendências.

---

# Dashboard operador

Criar:

Operator Analytics


Mostrar:

- Utilização estação.
- Receita.
- Horários pico.
- Performance.

---

# Dashboard frota

Criar:

Fleet Analytics


Mostrar:

- Custos.
- Consumo.
- Eficiência veículos.

---

# Dashboard financeiro

Criar:

Financial Intelligence


Mostrar:

- Receita.
- Pagamentos.
- Repasses.
- Previsões.

---

# Relatórios automáticos

Criar:

Report Generator


Gerar:

- Relatório diário.
- Semanal.
- Mensal.
- Anual.

---

# Exportação dados

Permitir:

- CSV.
- Excel.
- PDF.
- API externa.

---

# Alertas inteligentes

Criar:

Analytics Alerts


Exemplos:

- Queda utilização.
- Aumento falhas.
- Redução receita.

---

# Banco de Dados

Criar:

## Metric

Campos:

- id
- name
- value
- period


---

## Dashboard

Campos:

- id
- user_id
- configuration


---

## Report

Campos:

- id
- type
- generated_at

---

# API

Criar:

GET

/analytics/kpis


GET

/analytics/dashboard


GET

/analytics/reports


POST

/analytics/export

---

# Segurança

Implementar:

- Controle acesso dados.
- Permissões por perfil.
- Auditoria consultas.

---

# Testes

Validar:

- Geração KPI.
- Dashboard.
- Relatório.
- Exportação.

---

# Critério conclusão

O módulo está pronto quando:

✅ Gestores possuem visão completa da operação.

✅ Dados podem gerar decisões estratégicas.

✅ Relatórios são automatizados.

---

# Entrega

Informar:

1. Data warehouse.
2. KPIs.
3. Dashboards.
4. Relatórios.
5. Próximo módulo recomendado.