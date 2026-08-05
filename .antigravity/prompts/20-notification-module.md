# PROMPT 20 — NOTIFICATION MODULE

## Contexto

Você está implementando o módulo de notificações da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/UX_FLOW.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar um sistema centralizado de notificações para usuários, operadores e administradores.

---

# Conceito

Eventos:

↓

Notification Service

↓

Canais:

- Push Mobile.
- Email.
- WhatsApp futuro.
- Notificação interna.

---

# Estrutura

Criar:

```
modules/notifications/

notifications.controller.ts

notifications.service.ts

notifications.module.ts

providers/

events/

templates/

repository/

tests/

```

---

# Banco de Dados

Criar model Notification.

Campos:

- id
- user_id
- title
- message
- type
- read
- created_at

---

# Enum

NotificationType:

- SYSTEM
- PAYMENT
- CHARGING
- EQUIPMENT
- FINANCIAL

---

# Funcionalidades

## Listar notificações

Endpoint:

GET

/notifications


Retornar:

- título.
- mensagem.
- data.
- status leitura.

---

# Marcar como lida

Endpoint:

PATCH

/notifications/:id/read


---

# Criar notificação interna

Endpoint:

POST

/notifications


Somente sistema/admin.

---

# Eventos automáticos

Criar listeners:

---

## PaymentApproved

Enviar:

"Pagamento confirmado"


---

## ChargingFinished

Enviar:

"Recarga finalizada"


---

## ChargerOffline

Enviar:

"Carregador offline"


---

## WithdrawalCompleted

Enviar:

"Saque processado"

---

# Push Mobile

Preparar integração:

Firebase Cloud Messaging


Criar:

push.provider.ts

---

# Email

Preparar:

email.provider.ts


Suportar:

- Confirmações.
- Alertas.
- Relatórios.

---

# WhatsApp

Não implementar inicialmente.

Criar arquitetura preparada para:

WhatsApp Business API.

---

# Frontend Web

Criar componente:

NotificationBell


Mostrar:

- Contador.
- Lista.
- Status leitura.

---

# Mobile

Criar:

Notification Center


Tela:

/notifications


---

# Segurança

Validar:

Usuário somente vê suas notificações.

Operador somente recebe eventos da sua empresa.

---

# Testes

Validar:

- Criar notificação.
- Listar.
- Marcar leitura.
- Evento gera aviso.
- Usuário isolado.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuários recebem avisos.

✅ Eventos importantes geram notificações.

✅ Web e mobile exibem notificações.

---

# Entrega

Informar:

1. Arquivos criados.
2. Eventos configurados.
3. Canais implementados.
4. Como testar.
5. Próximo módulo recomendado.