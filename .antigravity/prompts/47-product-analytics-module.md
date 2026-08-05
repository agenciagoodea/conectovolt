# PROMPT 47 — PRODUCT ANALYTICS & USER BEHAVIOR MODULE

## Contexto

Você está implementando o módulo de análise de comportamento e inteligência de produto da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/UX_FLOW.md
- docs/ANALYTICS.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar um sistema para entender como usuários interagem com a plataforma e melhorar continuamente o produto.

---

# Conceito

Ações dos usuários

↓

Eventos

↓

Análise

↓

Insights

↓

Otimização

---

# Estrutura Backend

Criar:

```
modules/product-analytics/

product-analytics.module.ts

events/

tracking/

funnels/

cohorts/

experiments/

tests/

```

---

# Sistema de eventos

Criar:

Event Tracker


Registrar:

- Login.
- Cadastro.
- Busca posto.
- Visualização carregador.
- Início recarga.
- Pagamento.
- Avaliação.
- Uso recursos.

---

# Modelo Evento

Criar:

UserEvent


Campos:

- id
- user_id
- company_id
- event_name
- metadata
- timestamp

---

# Funil motorista

Criar:

Customer Funnel


Analisar:

Download app

↓

Cadastro

↓

Adicionar pagamento

↓

Encontrar posto

↓

Primeira recarga

↓

Recorrência

---

# Funil operador

Criar:

Operator Funnel


Analisar:

Cadastro empresa

↓

Adicionar posto

↓

Conectar carregador

↓

Primeira receita

---

# Retenção

Criar:

Cohort Analysis


Medir:

- Retenção diária.
- Retenção semanal.
- Retenção mensal.

---

# Engajamento

Criar:

User Engagement Score


Considerar:

- Frequência acesso.
- Recargas.
- Uso favoritos.
- Avaliações.

---

# Identificação de abandono

Criar:

Churn Signals


Detectar:

- Usuário parou de usar.
- Operador reduziu operação.
- Queda receita.

---

# Dashboard Produto

Criar:

/product/analytics


Mostrar:

## Usuários

- Ativos.
- Novos.
- Retenção.


## Produto

- Recursos usados.
- Conversão.
- Abandono.


## Operação

- Fluxos críticos.

---

# Experimentos

Criar:

A/B Testing Framework


Permitir testar:

- Novas telas.
- Fluxos pagamento.
- Promoções.

---

# Integração AI

Usar AI Module para gerar:

Insights automáticos.


Exemplo:

"Usuários abandonam 35% das vezes antes de cadastrar pagamento."

---

# Banco de Dados

Criar:

## ProductEvent

Campos:

- id
- user_id
- event
- properties
- created_at


---

## Experiment

Campos:

- id
- name
- variant
- status

---

# Privacidade

Garantir:

- Consentimento tracking.
- Anonimização.
- Controle usuário.

Integrar:

Privacy Module.

---

# API

Criar:

POST

/analytics/event


GET

/analytics/funnel


GET

/analytics/retention


GET

/analytics/engagement

---

# Testes

Validar:

- Registro eventos.
- Cálculo retenção.
- Funis.
- Permissões.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Produto é guiado por dados.

✅ Equipe identifica melhorias.

✅ Retenção pode ser otimizada.

---

# Entrega

Informar:

1. Eventos criados.
2. Dashboards.
3. Métricas.
4. Como testar.
5. Próximo módulo recomendado.