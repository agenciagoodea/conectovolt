# PROMPT 59 — LOYALTY & REWARDS ENGINE MODULE

## Contexto

Você está implementando o sistema de fidelidade, recompensas e engajamento da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/USER_EXPERIENCE.md
- docs/BUSINESS_MODEL.md
- docs/ANALYTICS.md

---

# Objetivo

Criar um sistema de recompensa para aumentar retenção e frequência de uso dos usuários.

---

# Conceito

Usuário utiliza plataforma

↓

Ganha pontos

↓

Troca benefícios

↓

Maior fidelidade

---

# Estrutura Backend

Criar:

```
modules/loyalty/

loyalty.module.ts

loyalty.controller.ts

loyalty.service.ts

points/

rewards/

campaigns/

gamification/

partners/

tests/

```

---

# Sistema de pontos

Criar:

Points Engine


Ganhar pontos por:

- Recarga realizada.
- Frequência.
- Avaliação.
- Indicação.
- Uso horários promocionais.

---

# Modelo Points

Criar:

UserPoints


Campos:

- id
- user_id
- balance
- total_earned
- total_spent

---

# Histórico pontos

Criar:

Points Transaction


Registrar:

- Ganho.
- Uso.
- Expiração.
- Motivo.

---

# Recompensas

Criar:

Reward Marketplace


Tipos:

- Desconto recarga.
- Créditos energia.
- Benefícios parceiros.
- Serviços automotivos.

---

# Resgate

Criar:

Reward Redemption


Fluxo:

Escolher recompensa

↓

Validar pontos

↓

Aplicar benefício

---

# Gamificação

Criar:

Achievement System


Exemplos:

- Primeira recarga.
- 10 recargas.
- 100 kWh consumidos.
- Usuário frequente.

---

# Níveis usuário

Criar:

Membership Levels


Exemplo:

```
Bronze

Silver

Gold

Platinum
```

---

# Campanhas

Criar:

Campaign Engine


Permitir:

- Pontos dobrados.
- Promoções horários.
- Eventos especiais.

---

# Programa indicação

Criar:

Referral System


Permitir:

Usuário indica amigo.

Ambos recebem benefício.

---

# Parceiros

Criar:

Partner Rewards


Permitir empresas oferecerem:

- Descontos.
- Serviços.
- Benefícios.

---

# Dashboard usuário

Criar:

/rewards


Mostrar:

- Pontos.
- Nível.
- Histórico.
- Recompensas.

---

# Dashboard operador

Criar:

/operator/loyalty


Mostrar:

- Campanhas.
- Custos.
- Engajamento.

---

# Banco de Dados

Criar:

## Reward

Campos:

- id
- name
- points_cost
- partner_id


---

## LoyaltyTransaction

Campos:

- id
- user_id
- points
- type
- created_at


---

## Campaign

Campos:

- id
- name
- rules
- active

---

# API

Criar:

GET

/loyalty/balance


POST

/loyalty/redeem


GET

/loyalty/rewards


POST

/loyalty/campaign

---

# Inteligência

Integrar:

AI Module


Criar recomendações:

- Melhor recompensa para usuário.
- Campanha ideal.
- Previsão abandono.

---

# Segurança

Garantir:

- Controle fraude pontos.
- Auditoria.
- Limites resgate.

---

# Testes

Validar:

- Gerar pontos.
- Resgatar.
- Aplicar campanha.
- Controle fraude.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuários possuem incentivo de retorno.

✅ Operadores conseguem criar campanhas.

✅ Fidelização pode ser medida.

---

# Entrega

Informar:

1. Sistema pontos.
2. Recompensas.
3. Gamificação.
4. APIs.
5. Próximo módulo recomendado.