# PROMPT 18 — MOBILE PAYMENT FLOW

## Contexto

Você está implementando o fluxo de pagamento dentro do aplicativo motorista da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/BUSINESS_MODEL.md
- docs/UX_FLOW.md

---

# Objetivo

Criar a experiência de pagamento após uma sessão de recarga finalizada.

---

# Fluxo

Charging Session finalizada

↓

Tela resumo

↓

Escolher pagamento

↓

Processar pagamento

↓

Confirmar

↓

Gerar recibo

---

# Estrutura

Criar:

```
features/payments/

data/

models/

repositories/


presentation/

pages/

widgets/

controllers/

```

---

# Tela Resumo da Recarga

Route:

/payment/summary


Mostrar:

- Posto.
- Data.
- Duração.
- Energia consumida.
- Valor total.


Botão:

"Pagar agora"

---

# Tela Método de Pagamento

Route:

/payment/method


Opções:

## PIX

Mostrar:

- QR Code PIX.
- Código copia e cola.


## Cartão

Campos:

- Número.
- Validade.
- CVV.
- Nome.

---

# Criar pagamento

Consumir:

POST

/payments


Enviar:

```json
{
"session_id":"uuid",
"method":"PIX"
}
```


---

# Status pagamento

Criar acompanhamento:

PENDING

↓

APPROVED

ou

FAILED


---

# Atualização

Preparar para:

Webhook.

Polling inicial:

Consultar:

GET

/payments/:id


---

# Tela Pagamento aprovado

Mostrar:

✅ Pagamento confirmado


Dados:

- Valor.
- Data.
- Identificação da transação.


Botões:

"Ver recibo"

"Nova recarga"

---

# Recibo digital

Criar tela:

/payment/receipt


Mostrar:

- Número da transação.
- Posto.
- Energia.
- Valor.
- Método.
- Data.


Permitir:

Compartilhar recibo.

---

# Histórico de pagamentos

Criar:

/payments/history


Lista:

- Data.
- Posto.
- Valor.
- Status.


---

# Model Mobile

Criar:

PaymentModel

Campos:

- id
- sessionId
- amount
- status
- method
- transactionId
- date

---

# Estados

Criar:

CREATING

PENDING

APPROVED

FAILED

---

# Segurança

Obrigatório:

- Nunca armazenar dados sensíveis do cartão.
- Usar tokenização do gateway.
- Confirmar pagamento pelo backend.

---

# UX

Prioridades:

- Pagamento em poucos passos.
- Status claro.
- Confirmação visual.
- Confiança.

---

# Testes

Validar:

- Criar pagamento.
- PIX aprovado.
- Cartão aprovado.
- Pagamento recusado.
- Gerar recibo.
- Histórico.

---

# Critério de conclusão

Fluxo pronto quando:

✅ Usuário paga recarga.

✅ Sistema confirma pagamento.

✅ Usuário recebe comprovante.

✅ Histórico fica salvo.

---

# Entrega

Informar:

1. Arquivos criados.
2. APIs utilizadas.
3. Como testar.
4. Próximo módulo recomendado.