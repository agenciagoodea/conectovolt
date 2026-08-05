# PROMPT 99 — FINANCIAL OPERATIONS & REVENUE MANAGEMENT MODULE

## Contexto

Você está criando a estrutura financeira completa da EV Charge Platform.

O objetivo é controlar receitas, custos, faturamento, margens e previsões financeiras.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/ENTERPRISE.md
- docs/OPERATIONS.md

---

# Objetivo

Criar um sistema financeiro empresarial para acompanhar a saúde econômica da EV Charge.

---

# Conceito

Receita

↓

Custos

↓

Margem

↓

Lucro

↓

Crescimento

---

# Estrutura Backend

Criar:

```
modules/finance/

billing/

revenue/

expenses/

invoices/

subscriptions/

settlements/

forecast/

reports/

tests/

```

---

# Gestão receitas

Criar:

Revenue Management System


Controlar:

- Recargas.
- Assinaturas.
- Taxas plataforma.
- Contratos enterprise.

---

# Fontes receita

Registrar:

## SaaS

- Mensalidades.


## Transações

- Percentual recargas.


## Enterprise

- Contratos corporativos.


## Serviços

- Marketplace.
- Integrações.

---

# Billing Engine

Criar:

Sistema faturamento


Permitir:

- Cobrança automática.
- Faturas.
- Histórico pagamentos.

---

# Invoice Management

Criar:

Invoice System


Controlar:

- Emissão.
- Status.
- Vencimento.
- Pagamento.

---

# Controle custos

Criar:

Expense Management


Registrar:

- Infraestrutura.
- Servidores.
- Suporte.
- Operação.
- Equipe.

---

# Margem financeira

Criar:

Profitability Engine


Calcular:

- Margem cliente.
- Margem estação.
- Margem operador.
- Margem plataforma.

---

# Unit Economics

Criar:

Unit Economics Dashboard


Analisar:

- CAC.
- LTV.
- Payback.
- Receita média.

---

# Previsão financeira

Criar:

Financial Forecast Engine


Projetar:

- Receita futura.
- Custos futuros.
- Crescimento.

---

# Gestão contratos

Integrar:

Enterprise Module


Controlar:

- Valor contrato.
- Renovação.
- Receita prevista.

---

# Repasse operadores

Criar:

Settlement System


Controlar:

- Receita operador.
- Comissão plataforma.
- Pagamentos.

---

# Relatórios financeiros

Criar:

Financial Reports


Gerar:

- DRE.
- Fluxo caixa.
- Receita mensal.
- Custos.

---

# Dashboard financeiro

Criar:

CFO Dashboard


Mostrar:

- Receita.
- Custos.
- Margem.
- Crescimento.
- Previsões.

---

# Banco de Dados

Criar:

## Revenue

Campos:

- source
- amount
- date


---

## Expense

Campos:

- category
- amount
- date


---

## Invoice

Campos:

- customer
- value
- status

---

# API

Criar:

GET

/finance/revenue


GET

/finance/expenses


GET

/finance/margins


GET

/finance/reports

---

# Segurança

Implementar:

- Dados financeiros protegidos.
- Controle acesso.
- Auditoria.

---

# Testes

Validar:

- Registrar receita.
- Criar fatura.
- Calcular margem.
- Gerar relatório.

---

# Critério conclusão

O módulo está pronto quando:

✅ Empresa sabe quanto ganha.

✅ Empresa sabe quanto gasta.

✅ Decisões financeiras são baseadas em dados.

---

# Entrega

Informar:

1. Sistema financeiro.
2. Receitas.
3. Custos.
4. Margens.
5. Próximo módulo recomendado.