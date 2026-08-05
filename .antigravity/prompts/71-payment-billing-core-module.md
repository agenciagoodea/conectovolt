# PROMPT 71 — PAYMENT & BILLING CORE MODULE

## Contexto

Você está implementando o núcleo financeiro da ConectoVolt.

Este módulo será responsável por pagamentos, faturamento, cobranças e repasses financeiros.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/PRICING.md
- docs/BUSINESS_MODEL.md
- docs/SECURITY.md

---

# Objetivo

Criar uma infraestrutura financeira completa para processar cobranças de sessões de carregamento.

---

# Conceito

Sessão concluída

↓

Valor calculado

↓

Pagamento

↓

Fatura

↓

Repasse

---

# Estrutura Backend

Criar:

```
modules/payment-billing/

payment.module.ts

payment.controller.ts

payment.service.ts

transactions/

wallet/

invoices/

settlements/

providers/

tests/

```

---

# Gestão pagamentos

Criar:

Payment Engine


Responsável:

- Criar cobrança.
- Processar pagamento.
- Confirmar transação.
- Registrar histórico.

---

# Métodos pagamento

Suportar:

- Cartão crédito.
- Cartão débito.
- PIX.
- Carteira digital.
- Faturamento corporativo.

---

# Modelo Payment

Criar:

Payment Entity


Campos:

- id
- user_id
- session_id
- amount
- method
- status
- created_at

---

# Status pagamento

Criar:

```
PENDING

AUTHORIZED

PAID

FAILED

REFUNDED
```

---

# Integração gateways

Preparar:

Payment Provider Layer


Permitir integração:

- Gateways externos.
- Bancos.
- Processadores.

---

# Carteira digital

Criar:

Wallet System


Permitir:

- Adicionar saldo.
- Usar créditos.
- Reembolsos.
- Benefícios.

---

# Modelo Wallet

Campos:

- user_id
- balance
- currency

---

# Faturamento

Criar:

Invoice Engine


Gerar:

- Faturas usuários.
- Faturas empresas.
- Relatórios.

---

# Empresas

Criar:

Corporate Billing


Permitir:

- Cobrança mensal.
- Contratos.
- Volume de consumo.

---

# Repasse operadores

Criar:

Settlement Engine


Calcular:

Receita estação

↓

Comissão plataforma

↓

Valor operador

---

# Conciliação financeira

Criar:

Financial Reconciliation


Comparar:

- Sessões.
- Pagamentos.
- Recebimentos.
- Repasses.

---

# Banco de Dados

Criar:

## Payment

Campos:

- id
- session_id
- amount
- status


---

## Invoice

Campos:

- id
- customer_id
- total
- period


---

## Settlement

Campos:

- operator_id
- amount
- status

---

# API

Criar:

POST

/payments/create


GET

/payments/history


GET

/invoices


GET

/settlements

---

# Dashboard financeiro

Criar:

/finance/dashboard


Mostrar:

- Receita.
- Pagamentos.
- Falhas.
- Repasses.

---

# Segurança

Implementar:

- Criptografia dados financeiros.
- Tokenização pagamentos.
- Auditoria.
- Controle acesso.

---

# Testes

Validar:

- Criar pagamento.
- Aprovar.
- Falhar.
- Gerar fatura.
- Calcular repasse.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuários conseguem pagar.

✅ Empresas conseguem faturar.

✅ Operadores recebem repasses.

---

# Entrega

Informar:

1. Sistema pagamento.
2. Faturamento.
3. Repasses.
4. APIs.
5. Próximo módulo recomendado.