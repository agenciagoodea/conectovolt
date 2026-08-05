# PROMPT 85 — CUSTOMER SUPPORT & SERVICE CENTER MODULE

## Contexto

Você está implementando o centro de atendimento e suporte da EV Charge Platform.

Este módulo será responsável pelo suporte de usuários, operadores, empresas e parceiros.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/USER_EXPERIENCE.md
- docs/NOTIFICATION.md
- docs/SECURITY.md

---

# Objetivo

Criar uma plataforma completa de atendimento, tickets e resolução de problemas.

---

# Conceito

Cliente

↓

Solicitação

↓

Atendimento

↓

Solução

↓

Avaliação

---

# Estrutura Backend

Criar:

```
modules/customer-support/

support.module.ts

support.controller.ts

support.service.ts

tickets/

chat/

knowledge-base/

automation/

feedback/

tests/

```

---

# Sistema tickets

Criar:

Ticket Management


Permitir:

- Criar chamado.
- Classificar problema.
- Atribuir agente.
- Acompanhar status.

---

# Tipos chamados

Suportar:

## Usuário

- Pagamento.
- Recarga.
- Conta.
- Aplicativo.


## Operador

- Carregador offline.
- Comunicação OCPP.
- Manutenção.


## Empresa

- Faturamento.
- Frota.
- Relatórios.

---

# Modelo Ticket

Criar:

Ticket Entity


Campos:

- id
- user_id
- category
- priority
- status
- created_at

---

# Status ticket

Criar:

```
OPEN

IN_PROGRESS

WAITING

RESOLVED

CLOSED
```

---

# Atendimento omnichannel

Criar:

Communication Hub


Suportar:

- Chat.
- Email.
- WhatsApp.
- Formulário app.

---

# Chat inteligente

Criar:

AI Support Assistant


Permitir:

- Responder dúvidas.
- Identificar problema.
- Sugerir solução.

---

# Base conhecimento

Criar:

Knowledge Base


Conteúdo:

- FAQ.
- Guias.
- Soluções comuns.
- Manuais.

---

# Automação suporte

Criar:

Support Automation Engine


Automatizar:

- Classificação tickets.
- Respostas simples.
- Priorização.

---

# Integração plataforma

Conectar:

Charging Module

Para identificar:

- Sessão.
- Carregador.
- Erros.

---

# SLA

Criar:

Service Level Management


Controlar:

- Tempo resposta.
- Tempo resolução.
- Prioridades.

---

# Avaliação atendimento

Criar:

Customer Feedback


Permitir:

- Nota.
- Comentário.
- Satisfação.

---

# Dashboard suporte

Criar:

Support Center Dashboard


Mostrar:

- Tickets abertos.
- Tempo médio.
- Satisfação.
- Problemas frequentes.

---

# Banco de Dados

Criar:

## Ticket

Campos:

- id
- customer
- category
- status


---

## SupportMessage

Campos:

- ticket_id
- sender
- message


---

## KnowledgeArticle

Campos:

- title
- content

---

# API

Criar:

POST

/support/tickets


GET

/support/tickets


POST

/support/messages


GET

/support/knowledge

---

# Segurança

Garantir:

- Dados privados protegidos.
- Controle agentes.
- Histórico completo.

---

# Testes

Validar:

- Criar ticket.
- Responder.
- Resolver.
- Avaliar atendimento.

---

# Critério conclusão

O módulo está pronto quando:

✅ Clientes conseguem solicitar ajuda.

✅ Problemas são rastreados.

✅ Atendimento possui métricas.

---

# Entrega

Informar:

1. Sistema tickets.
2. Chat.
3. IA suporte.
4. Dashboard.
5. Próximo módulo recomendado.