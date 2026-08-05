# PROMPT 61 — SALES INTELLIGENCE & REVENUE OPERATIONS MODULE

## Contexto

Você está implementando a camada de inteligência comercial e operações de receita da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/CRM.md
- docs/ANALYTICS.md

---

# Objetivo

Criar uma estrutura completa para gerenciar vendas, oportunidades e previsibilidade de receita.

---

# Conceito

Mercado

↓

Leads

↓

Oportunidades

↓

Contratos

↓

Receita

---

# Estrutura Backend

Criar:

```
modules/revenue-operations/

sales.module.ts

sales.controller.ts

sales.service.ts

pipeline/

forecast/

commission/

accounts/

territories/

tests/

```

---

# Gestão de contas

Criar:

Account Management


Clientes:

- Operadores.
- Frotas.
- Empresas.
- Parceiros.

---

# Oportunidades

Criar:

Opportunity Entity


Campos:

- id
- account_id
- value
- stage
- probability
- expected_close_date

---

# Pipeline comercial

Criar:

Sales Pipeline


Etapas:

```
PROSPECT

CONTACTED

DEMO

NEGOTIATION

CONTRACT

WON

LOST
```

---

# Forecast receita

Criar:

Revenue Forecast Engine


Calcular:

- Receita esperada.
- Probabilidade fechamento.
- Crescimento mensal.

---

# Metas comerciais

Criar:

Sales Goals


Controlar:

- Meta vendedor.
- Meta região.
- Meta período.

---

# Territórios

Criar:

Territory Management


Permitir:

- Distribuir regiões.
- Controlar responsáveis.

---

# Comissões

Criar:

Commission Engine


Calcular:

- Venda realizada.
- Receita recorrente.
- Renovação.

---

# Inteligência AI

Integrar:

AI Module


Gerar:

- Melhor oportunidade.
- Risco negociação.
- Previsão fechamento.

---

# Dashboard comercial

Criar:

/sales/dashboard


Mostrar:

- Pipeline.
- Receita.
- Conversão.
- Performance equipe.

---

# Relatórios

Criar:

Sales Reports


Incluir:

- Conversão.
- Tempo venda.
- Ticket médio.
- Churn.

---

# Banco de Dados

Criar:

## Account

Campos:

- id
- company
- segment


---

## Opportunity

Campos:

- id
- account_id
- stage
- value


---

## SalesActivity

Campos:

- id
- opportunity_id
- activity
- date

---

# API

Criar:

GET

/sales/pipeline


POST

/sales/opportunity


GET

/sales/forecast


GET

/sales/performance

---

# Segurança

Garantir:

- Equipe vê apenas permissões autorizadas.
- Dados comerciais protegidos.

---

# Testes

Validar:

- Criar oportunidade.
- Alterar estágio.
- Calcular forecast.
- Gerar comissão.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Vendas possuem previsibilidade.

✅ Receita pode ser acompanhada.

✅ Crescimento é mensurável.

---

# Entrega

Informar:

1. Pipeline criado.
2. Forecast.
3. Dashboards.
4. APIs.
5. Próximo módulo recomendado.