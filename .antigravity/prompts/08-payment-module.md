# PROMPT 08 — PAYMENT MODULE

## Contexto

Você está implementando o módulo financeiro de pagamentos da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/DATABASE.md
- docs/API.md
- docs/PRISMA_SCHEMA_PLAN.md

---

# Objetivo

Criar o fluxo de pagamento das sessões de recarga.

O módulo deve permitir que o motorista pague uma recarga e que a plataforma registre a transação financeira.

---

# Conceito

Fluxo:

Charging Session

↓

Payment

↓

Commission

↓

Operator Wallet

---

# Banco de Dados

Criar model Payment.

Campos:

- id
- session_id
- user_id
- gateway
- transaction_id
- amount
- status
- payment_method
- paid_at
- created_at
- updated_at

---

# Enum

PaymentStatus:

- PENDING
- APPROVED
- FAILED
- REFUNDED

---

# PaymentMethod

Criar:

- PIX
- CREDIT_CARD

---

# Estrutura do módulo

Criar:

```
modules/payments/

payments.controller.ts

payments.service.ts

payments.module.ts

gateway/

webhooks/

dto/

repository/

tests/

```

---

# Gateway

Criar arquitetura preparada para integração externa.

Criar interface:

PaymentGateway


Métodos:

createPayment()

checkPaymentStatus()

refundPayment()

---

# MVP Gateway

Implementar inicialmente:

PIX

Cartão


O gateway deve ser desacoplado.

---

# Criar pagamento

Endpoint:

POST

/payments


Request:

```json
{
"session_id":"uuid",
"method":"PIX"
}
```


Regras:

- Sessão deve existir.
- Sessão deve estar finalizada.
- Valor deve ser calculado pelo backend.
- Criar pagamento como PENDING.

---

# Consultar pagamento

Endpoint:

GET

/payments/:id


Retornar:

- Valor.
- Status.
- Método.
- Data.

---

# Webhook

Criar endpoint:

POST

/webhooks/payment


Receber:

- transaction_id
- status
- amount

---

# Processamento do webhook

Quando pagamento aprovado:

1. Atualizar Payment.

2. Alterar status para APPROVED.

3. Disparar evento PaymentApproved.

4. Criar comissão.

---

# Segurança

Obrigatório:

- Validar assinatura do webhook.
- Nunca confiar somente no frontend.
- Registrar logs financeiros.

---

# Regras financeiras

Toda transação deve guardar:

- Valor bruto.
- Gateway.
- Identificador externo.
- Status.
- Data.

Nunca apagar pagamentos.

---

# Preparação futura

Arquitetura deve permitir:

- Split payment.
- Marketplace.
- Outros gateways.
- PIX recorrente.

---

# Swagger

Documentar:

POST /payments

GET /payments/:id

POST /webhooks/payment

---

# Testes

Criar testes:

- Criar pagamento.
- Pagamento aprovado.
- Pagamento recusado.
- Webhook inválido.
- Atualização de status.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuário consegue gerar pagamento.

✅ Gateway retorna status.

✅ Pagamento aprovado atualiza sistema.

✅ Comissão pode ser criada.

---

# Entrega

Informar:

1. Arquivos criados.
2. Migration gerada.
3. Endpoints disponíveis.
4. Como testar.
5. Próximo módulo recomendado.