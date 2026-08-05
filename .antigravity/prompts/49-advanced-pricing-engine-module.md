# PROMPT 49 — ADVANCED PRICING ENGINE & DYNAMIC TARIFF MODULE

## Contexto

Você está implementando o motor avançado de preços da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/FINANCIAL.md
- docs/ANALYTICS.md

---

# Objetivo

Criar um sistema inteligente de precificação dinâmica para maximizar receita e controlar demanda.

---

# Conceito

Dados operação

↓

Pricing Engine

↓

Regra preço

↓

Valor cobrança

---

# Estrutura Backend

Criar:

```
modules/pricing-engine/

pricing-engine.module.ts

pricing-engine.controller.ts

pricing-engine.service.ts

rules/

calculator/

optimization/

experiments/

tests/

```

---

# Tipos de tarifa

Suportar:

---

# Tarifa fixa

Exemplo:

R$2,00/kWh

---

# Tarifa por horário

Exemplo:

06h-12h

R$1,80/kWh


18h-22h

R$3,00/kWh

---

# Tarifa por demanda

Baseada em:

- Quantidade usuários.
- Ocupação carregadores.
- Horário.

---

# Tarifa por potência

Exemplo:

Carregador rápido:

Preço maior.

Carregador lento:

Preço menor.

---

# Tarifa promocional

Criar:

Promo Rules


Exemplo:

Primeira recarga:

20% desconto.

---

# Motor de cálculo

Criar:

Pricing Calculator


Entrada:

- Posto.
- Carregador.
- Usuário.
- Horário.
- Consumo.
- Regras.


Saída:

```
{
energy: 40,
price_kwh: 2.5,
discount: 10,
total: 90
}
```

---

# Inteligência de preço

Criar:

Pricing Recommendation Engine


Analisar:

- Ocupação.
- Histórico.
- Receita.
- Concorrência.

---

# Sugestões

Exemplo:

"Reduza tarifa entre 10h e 14h para aumentar utilização."

---

# Controle operador

Criar:

/operator/pricing


Permitir:

- Criar regras.
- Ativar preço dinâmico.
- Aprovar sugestões IA.

---

# Dashboard preço

Mostrar:

- Receita por tarifa.
- Impacto alterações.
- Comparativo.

---

# Testes A/B

Criar:

Pricing Experiment


Permitir testar:

Preço A

versus

Preço B

---

# Integração Analytics

Consumir:

- Demanda.
- Histórico.
- Receita.

---

# Banco de Dados

Criar:

## PricingRule

Campos:

- id
- company_id
- type
- conditions
- value
- active

---

## PricingExperiment

Campos:

- id
- name
- variant
- result

---

# API

Criar:

GET

/pricing/rules


POST

/pricing/rules


POST

/pricing/calculate


GET

/pricing/recommendations

---

# Segurança

Garantir:

Operador altera apenas seus preços.

Mudanças ficam auditadas.

---

# Testes

Validar:

- Cálculo tarifa.
- Promoção.
- Horário.
- Demanda.
- Recomendação.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Preços podem variar automaticamente.

✅ Receita pode ser otimizada.

✅ Operador entende impacto das mudanças.

---

# Entrega

Informar:

1. Motor criado.
2. Regras suportadas.
3. APIs.
4. Testes.
5. Próximo módulo recomendado.