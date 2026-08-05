# PROMPT 29 — CUSTOMER APP EXPERIENCE & RETENTION MODULE

## Contexto

Você está implementando melhorias de experiência e retenção no aplicativo motorista da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/UX_FLOW.md
- docs/BUSINESS_MODEL.md
- docs/API.md

---

# Objetivo

Criar recursos que aumentem frequência de uso e fidelização dos motoristas.

---

# Estrutura

Criar:

```
mobile/features/customer/

favorites/

wallet/

reviews/

rewards/

profile/

history/

```

---

# FAVORITOS

## Objetivo

Permitir que usuário salve postos preferidos.

---

Criar:

FavoriteStation


Campos:

- id
- user_id
- station_id
- created_at


---

## Funcionalidades

Usuário pode:

- Favoritar posto.
- Remover favorito.
- Ver favoritos no mapa.

---

# HISTÓRICO INTELIGENTE

Melhorar histórico.

Mostrar:

- Últimas recargas.
- Postos utilizados.
- Gasto mensal.
- Energia consumida.
- Frequência.

---

Criar resumo:

"Você carregou 120 kWh este mês"

---

# CARTEIRA DO USUÁRIO

Criar:

Customer Wallet


Campos:

- user_id
- balance
- credits

---

Permitir:

- Créditos promocionais.
- Cashback futuro.
- Benefícios.

---

# VEÍCULOS MÚLTIPLOS

Permitir:

Usuário cadastrar vários veículos.

Exemplo:

- Carro pessoal.
- Carro empresa.

---

Criar:

VehicleSelector

Durante recarga:

Escolher veículo utilizado.

---

# AVALIAÇÃO DOS POSTOS

Após recarga:

Solicitar avaliação.

Criar:

Review


Campos:

- user_id
- station_id
- rating
- comment
- created_at


---

Avaliar:

- Atendimento.
- Local.
- Equipamento.

---

# PROMOÇÕES

Criar estrutura:

Promotion


Campos:

- id
- title
- discount
- start_date
- end_date
- active

---

Exemplos:

- Desconto madrugada.
- Primeira recarga.
- Cliente frequente.

---

# NOTIFICAÇÕES DE RETENÇÃO

Integrar:

Notification Module


Enviar:

- Promoções.
- Postos favoritos disponíveis.
- Histórico mensal.
- Benefícios.

---

# TELA PERFIL

Criar:

/profile


Mostrar:

- Dados pessoais.
- Veículos.
- Histórico.
- Favoritos.
- Carteira.

---

# API

Criar endpoints:

GET

/customer/favorites


POST

/customer/favorites


DELETE

/customer/favorites/:id


GET

/customer/statistics


POST

/customer/reviews


GET

/customer/promotions

---

# UX

Prioridades:

- Experiência simples.
- Incentivar retorno.
- Mostrar valor ao usuário.

---

# Segurança

Garantir:

Usuário acessa somente seus dados.

---

# Testes

Validar:

- Favoritar posto.
- Remover favorito.
- Criar avaliação.
- Aplicar promoção.
- Histórico correto.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuário possui experiência personalizada.

✅ Aplicativo incentiva retorno.

✅ Dados de comportamento são registrados.

---

# Entrega

Informar:

1. Funcionalidades criadas.
2. Telas adicionadas.
3. APIs implementadas.
4. Como testar.
5. Próximo módulo recomendado.