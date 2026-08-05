# PROMPT 75 — NOTIFICATION & COMMUNICATION CENTER MODULE

## Contexto

Você está implementando o centro de comunicação e notificações da EV Charge Platform.

Este módulo será responsável por enviar mensagens automáticas para usuários, operadores e administradores.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/USER_EXPERIENCE.md
- docs/CRM.md
- docs/ARCHITECTURE.md

---

# Objetivo

Criar uma infraestrutura centralizada de comunicação multicanal.

---

# Conceito

Evento plataforma

↓

Notification Engine

↓

Canal comunicação

↓

Usuário

---

# Estrutura Backend

Criar:

```
modules/communication/

communication.module.ts

communication.controller.ts

communication.service.ts

notifications/

templates/

channels/

preferences/

events/

tests/

```

---

# Notification Engine

Criar:

Notification Service


Responsável:

- Criar mensagens.
- Escolher canal.
- Entregar.
- Registrar histórico.

---

# Canais suporte

Implementar:

## Push Notification

Para:

- Aplicativo mobile.


## Email

Para:

- Faturas.
- Relatórios.
- Alertas.


## SMS

Para:

- Segurança.
- Avisos críticos.


## WhatsApp

Preparar:

- Atendimento.
- Comunicação comercial.

---

# Eventos automáticos

Criar gatilhos:

## Usuário

- Cadastro realizado.
- Recarga iniciada.
- Recarga finalizada.
- Pagamento aprovado.
- Pagamento falhou.


## Operador

- Carregador offline.
- Falha equipamento.
- Baixa disponibilidade.


## Administrador

- Incidente crítico.
- Falha sistema.

---

# Preferências usuário

Criar:

Notification Preferences


Permitir:

- Ativar/desativar canais.
- Escolher tipos mensagens.
- Horários permitidos.

---

# Templates

Criar:

Message Template Engine


Permitir:

- Variáveis dinâmicas.
- Tradução.
- Personalização.

---

# Exemplos:

```
Olá {name},

Sua recarga terminou.

Energia:
{kwh}

Valor:
{amount}
```

---

# Comunicação em tempo real

Criar:

Real Time Messaging


Usar:

- WebSocket.
- Eventos internos.

---

# Histórico mensagens

Criar:

Notification History


Registrar:

- Usuário.
- Mensagem.
- Canal.
- Status entrega.

---

# Dashboard comunicação

Criar:

/communication/dashboard


Mostrar:

- Mensagens enviadas.
- Taxa entrega.
- Falhas.
- Engajamento.

---

# Integração CRM

Conectar:

Marketing Automation


Permitir:

- Campanhas.
- Segmentação.
- Jornadas.

---

# Banco de Dados

Criar:

## Notification

Campos:

- id
- user_id
- channel
- message
- status


---

## NotificationPreference

Campos:

- user_id
- channel
- enabled


---

## MessageTemplate

Campos:

- id
- name
- content

---

# API

Criar:

POST

/notifications/send


GET

/notifications/history


PATCH

/notifications/preferences


GET

/notifications/templates

---

# Segurança

Garantir:

- Consentimento comunicação.
- Proteção dados.
- Controle acesso.

---

# Testes

Validar:

- Envio push.
- Envio email.
- Preferências.
- Histórico.
- Falha entrega.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Plataforma consegue comunicar eventos.

✅ Usuários recebem informações importantes.

✅ Operações críticas geram alertas.

---

# Entrega

Informar:

1. Canais criados.
2. Eventos.
3. Templates.
4. APIs.
5. Próximo módulo recomendado.