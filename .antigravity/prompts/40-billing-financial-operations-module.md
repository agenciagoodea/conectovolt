# PROMPT 40 — BILLING AUTOMATION & FINANCIAL OPERATIONS MODULE

## Contexto

Você está implementando o módulo financeiro operacional da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/DATABASE.md
- docs/API.md

---

# Objetivo

Criar uma estrutura completa de faturamento, cobrança, repasses e conciliação financeira.

---

# Conceito

Transação

↓

Processamento financeiro

↓

Taxas

↓

Repasse

↓

Fatura

↓

Conciliação

---

# Estrutura Backend

Criar:

```
modules/financial/

financial.module.ts

financial.controller.ts

financial.service.ts

invoices/

settlements/

reconciliation/

taxes/

reports/

tests/

```

---

# Faturas

Criar:

Invoice


Campos:

- id
- customer_id
- company_id
- period
- amount
- status
- due_date
- created_at

---

# Status Invoice

Criar:

```
DRAFT

GENERATED

SENT

PAID

OVERDUE

CANCELLED
```

---

# Geração automática

Criar:

Invoice Generator


Gerar:

- Mensalidade SaaS.
- Comissão percentual.
- Serviços adicionais.

---

# Fechamento mensal

Criar:

Monthly Closing


Processo:

Final do período

↓

Consolidar dados

↓

Gerar documentos

↓

Liberar repasses

---

# Repasse operador

Criar:

Settlement


Campos:

- id
- operator_id
- gross_amount
- platform_fee
- net_amount
- status

---

# Exemplo

Usuário paga:

R$100


Taxa plataforma:

5%


Distribuição:

Operador:

R$95


Plataforma:

R$5

---

# Conciliação

Criar:

Reconciliation Engine


Comparar:

Sistema interno

×

Gateway pagamento

---

# Detectar:

- Pagamentos faltantes.
- Valores divergentes.
- Transações duplicadas.

---

# Taxas

Criar:

Fee Engine


Suportar:

- Comissão percentual.
- Taxa fixa.
- Plano mensal.
- Taxas personalizadas.

---

# Dashboard Financeiro

Criar:

/financial/dashboard


Mostrar:

- Receita.
- Volume transacionado.
- Comissão.
- Repasses pendentes.

---

# Operador

Mostrar:

- Faturamento.
- Valores recebidos.
- Histórico.

---

# Admin

Mostrar:

- Receita SaaS.
- Clientes pagantes.
- Inadimplência.

---

# Integrações

Preparar:

- Gateway pagamento.
- Banco.
- PIX.
- Cartões.

---

# Automatizações

Criar jobs:

## Diário

- Verificar pagamentos.
- Atualizar status.

## Mensal

- Gerar invoices.
- Fechar período.
- Criar relatórios.

---

# Banco de Dados

Criar:

## TransactionLedger

Campos:

- id
- transaction_id
- type
- amount
- created_at


---

## Settlement

Campos:

- id
- company_id
- amount
- status
- processed_at

---

# Segurança

Implementar:

- Controle financeiro restrito.
- Logs completos.
- Auditoria.

---

# API

Criar:

GET

/financial/invoices


GET

/financial/settlements


POST

/financial/close-period


GET

/financial/reconciliation

---

# Testes

Validar:

- Gerar fatura.
- Calcular comissão.
- Criar repasse.
- Conciliar pagamento.
- Fechar mês.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Plataforma controla dinheiro.

✅ Operadores recebem corretamente.

✅ Clientes recebem documentos.

---

# Entrega

Informar:

1. Estrutura criada.
2. Regras financeiras.
3. APIs.
4. Como testar.
5. Próximo módulo recomendado.