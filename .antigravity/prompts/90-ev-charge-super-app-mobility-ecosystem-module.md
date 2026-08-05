# PROMPT 90 — ConectoVolt SUPER APP & MOBILITY ECOSYSTEM MODULE

## Contexto

Você está implementando o Super App da ConectoVolt.

Este módulo unifica todos os serviços de mobilidade elétrica em uma experiência única.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/GLOBALIZATION.md
- docs/ROAMING.md
- docs/MARKETPLACE.md
- docs/USER_EXPERIENCE.md

---

# Objetivo

Criar uma aplicação central que reúna todos os serviços da plataforma ConectoVolt.

---

# Conceito

Usuário

↓

ConectoVolt Super App

↓

Mobilidade elétrica completa

---

# Estrutura Backend

Criar:

```
modules/super-app/

identity/

wallet/

mobility/

services/

rewards/

notifications/

personalization/

tests/

```

---

# Identidade única

Criar:

Unified User Identity


Permitir:

- Um cadastro.
- Todos serviços.
- Histórico completo.

---

# Carteira digital

Criar:

EV Wallet


Controlar:

- Saldo.
- Pagamentos.
- Créditos.
- Cashback.
- Benefícios.

---

# Centro de mobilidade

Criar:

Mobility Hub


Integrar:

- Recarga.
- Rotas.
- Estacionamento.
- Serviços parceiros.

---

# Mapa inteligente

Criar:

Smart Mobility Map


Mostrar:

- Carregadores.
- Serviços.
- Parceiros.
- Pontos interesse.

---

# Assistente pessoal IA

Criar:

AI Mobility Assistant


Permitir:

Usuário perguntar:

"Qual melhor rota?"

"Quanto vou gastar?"

"Onde carregar?"

---

# Programa fidelidade

Criar:

EV Rewards


Permitir:

- Pontos.
- Benefícios.
- Ranking.
- Recompensas.

---

# Personalização

Criar:

Personal Experience Engine


Analisar:

- Histórico.
- Preferências.
- Hábitos.

Adaptar:

- Ofertas.
- Rotas.
- Recomendações.

---

# Notificações inteligentes

Criar:

Smart Notification System


Enviar:

- Melhor horário recarga.
- Promoções.
- Alertas veículo.
- Manutenção.

---

# Integração serviços

Conectar:

## Charging

Recarga.


## Roaming

Carregamento global.


## Marketplace

Serviços.


## Fleet

Empresas.


## Energy

Consumo inteligente.


---

# Banco de Dados

Criar:

## UserExperience

Campos:

- user_id
- preferences


---

## Wallet

Campos:

- user_id
- balance


---

## Reward

Campos:

- user_id
- points

---

# API

Criar:

GET

/app/dashboard


GET

/app/wallet


GET

/app/recommendations


POST

/app/actions

---

# Aplicativo Mobile

Criar:

Home principal:

Mostrar:

- Status veículo.
- Próxima recarga.
- Saldo.
- Benefícios.
- Serviços.

---

# Segurança

Implementar:

- Proteção carteira.
- Autenticação forte.
- Privacidade.

---

# Testes

Validar:

- Login único.
- Pagamento.
- Recomendação IA.
- Serviços integrados.

---

# Critério conclusão

O módulo está pronto quando:

✅ Usuário acessa todo ecossistema em um único app.

✅ Serviços funcionam integrados.

✅ Experiência é personalizada.

---

# Entrega

Informar:

1. Super App.
2. Carteira.
3. IA.
4. Serviços integrados.
5. Próximo módulo recomendado.