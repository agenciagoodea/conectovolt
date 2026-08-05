# PROMPT 23 — MULTI TENANCY & SAAS BILLING MODULE

## Contexto

Você está implementando o modelo SaaS da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/DATABASE.md
- docs/API.md

---

# Objetivo

Criar o sistema de planos, assinatura e cobrança da plataforma.

---

# Modelo de negócio

A plataforma possui empresas operadoras.

A cobrança pode ocorrer por:

1. Percentual sobre faturamento das recargas.

2. Plano mensal fixo (futuro).

---

# Conceito

Empresa

↓

Subscription

↓

Usage

↓

Billing

↓

Pagamento SaaS

---

# Banco de Dados

Criar model Plan.

Campos:

- id
- name
- percentage_fee
- monthly_fee
- max_stations
- max_chargers
- created_at

---

# Planos iniciais

Criar:

## STARTER

- Até 5 postos.
- Até 20 carregadores.
- Comissão padrão.


## PROFESSIONAL

- Até 50 postos.
- Até 200 carregadores.


## ENTERPRISE

- Sem limite.

---

# Criar Subscription

Campos:

- id
- company_id
- plan_id
- status
- start_date
- end_date
- created_at

---

# Enum

SubscriptionStatus:

- ACTIVE
- SUSPENDED
- CANCELLED

---

# Criar Usage Tracking

Model:

PlatformUsage


Campos:

- id
- company_id
- charging_sessions
- energy_kwh
- revenue_generated
- period
- created_at

---

# Cobrança percentual

Regra:

Quando uma recarga é paga:

Sistema calcula:

valor_recarga × percentual_plano


Exemplo:

Recarga:

R$100


Taxa:

5%


Cobrança SaaS:

R$5

---

# Estrutura do módulo

Criar:

```
modules/billing/

billing.module.ts

billing.controller.ts

billing.service.ts

plans/

subscriptions/

usage/

tests/

```

---

# Funcionalidades

## Consultar plano

Endpoint:

GET

/billing/plan


---

## Consultar assinatura

Endpoint:

GET

/billing/subscription


---

## Alterar plano

Endpoint:

PATCH

/billing/subscription


Somente:

SUPER_ADMIN

---

## Histórico cobrança SaaS

Endpoint:

GET

/billing/history


Mostrar:

- período.
- consumo.
- valor cobrado.

---

# Limites

Criar validações:

Antes de criar:

Posto:

Verificar limite do plano.


Carregador:

Verificar limite.


---

# Dashboard Admin

Adicionar:

Mostrar:

- Clientes ativos.
- Receita SaaS.
- Receita por percentual.
- Planos utilizados.

---

# Dashboard Operador

Adicionar:

Mostrar:

- Plano atual.
- Taxa aplicada.
- Volume utilizado.

---

# Segurança

Obrigatório:

Cada empresa acessa somente seus dados.

---

# Preparação futura

Permitir:

- Stripe.
- Mercado Pago.
- PIX recorrente.
- Upgrade automático.
- Cupom de desconto.

---

# Testes

Validar:

- Criar plano.
- Associar empresa.
- Calcular percentual.
- Bloquear excesso.
- Histórico correto.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Empresa possui plano.

✅ Sistema calcula percentual.

✅ Uso é registrado.

✅ Plataforma controla clientes SaaS.

---

# Entrega

Informar:

1. Arquivos criados.
2. Modelos adicionados.
3. Regras implementadas.
4. Como testar.
5. Próximo módulo recomendado.