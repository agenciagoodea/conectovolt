# PROMPT 70 — PRICING & TARIFF MANAGEMENT MODULE

## Contexto

Você está implementando o motor de preços e tarifas da EV Charge Platform.

Este módulo será responsável por calcular o valor final das sessões de carregamento.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/CHARGING_SESSION.md
- docs/BUSINESS_MODEL.md
- docs/PAYMENTS.md

---

# Objetivo

Criar um sistema flexível de precificação para operadores, empresas e diferentes modelos comerciais.

---

# Conceito

Sessão carregamento

↓

Consumo energia

↓

Aplicação tarifas

↓

Preço final

↓

Pagamento

---

# Estrutura Backend

Criar:

```
modules/pricing/

pricing.module.ts

pricing.controller.ts

pricing.service.ts

tariffs/

rules/

discounts/

subscriptions/

dynamic-pricing/

tests/

```

---

# Motor de tarifas

Criar:

Tariff Engine


Responsável:

- Calcular preço.
- Aplicar regras.
- Gerar valor final.

---

# Modelo Tariff

Criar:

Tariff Entity


Campos:

- id
- operator_id
- name
- type
- active

---

# Tipos de tarifa

Suportar:

```
PER_KWH

PER_MINUTE

SESSION_FEE

HYBRID
```

---

# Preço por energia

Exemplo:

10 kWh

×

R$ 2,00/kWh

=

R$ 20,00

---

# Tarifas por horário

Criar:

Time Based Pricing


Permitir:

- Horário normal.
- Horário pico.
- Horário econômico.

---

# Tarifação dinâmica

Criar:

Dynamic Pricing Engine


Permitir alterar preço baseado em:

- Demanda.
- Disponibilidade.
- Localização.
- Horário.

---

# Tarifas por localização

Permitir:

Cada estação possuir:

- Preço próprio.
- Regras próprias.

---

# Planos assinatura

Criar:

Subscription Pricing


Exemplos:

Plano mensal:

- X kWh incluídos.
- Desconto.
- Benefícios.

---

# Descontos

Criar:

Discount Engine


Aplicar:

- Cupons.
- Campanhas.
- Fidelidade.
- Empresas.

---

# Tarifas corporativas

Criar:

Enterprise Pricing


Permitir:

- Frota.
- Volume.
- Contrato personalizado.

---

# Simulação preço

Criar:

Price Calculator


Usuário consulta:

"Quanto custa carregar?"

---

# Banco de Dados

Criar:

## Tariff

Campos:

- id
- station_id
- price_kwh
- rules


---

## PricingRule

Campos:

- id
- condition
- value


---

## Discount

Campos:

- id
- type
- amount

---

# API

Criar:

GET

/pricing/estimate


POST

/pricing/tariff


GET

/pricing/station/:id


POST

/pricing/discount

---

# Dashboard operador

Criar:

/operator/pricing


Mostrar:

- Tarifas ativas.
- Receita.
- Alterações.

---

# Dashboard usuário

Criar:

/pricing


Mostrar:

- Estimativa custo.
- Tarifas.
- Benefícios.

---

# Segurança

Garantir:

- Apenas operadores autorizados alteram preços.
- Histórico alterações.
- Auditoria.

---

# Testes

Validar:

- Criar tarifa.
- Calcular sessão.
- Aplicar desconto.
- Alterar preço.
- Simular cobrança.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Sistema calcula qualquer modelo de preço.

✅ Operadores conseguem administrar tarifas.

✅ Sessões geram valores corretos.

---

# Entrega

Informar:

1. Motor criado.
2. Regras suportadas.
3. APIs.
4. Integração sessão.
5. Próximo módulo recomendado.