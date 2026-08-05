# PROMPT 38 — SUPPORT CENTER & CUSTOMER SUCCESS MODULE

## Contexto

Você está implementando o módulo de suporte e sucesso do cliente da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/BUSINESS_MODEL.md
- docs/UX_FLOW.md

---

# Objetivo

Criar uma central completa de atendimento e relacionamento com clientes.

---

# Conceito

Usuário

↓

Ajuda automática

↓

Ticket

↓

Equipe suporte

↓

Resolução

↓

Satisfação

---

# Estrutura Backend

Criar:

```
modules/support/

support.module.ts

support.controller.ts

support.service.ts

tickets/

knowledge/

chat/

sla/

feedback/

tests/

```

---

# Sistema de chamados

Criar:

SupportTicket


Campos:

- id
- user_id
- company_id
- category
- priority
- status
- description
- assigned_to
- created_at

---

# Status

Criar:

```
OPEN

IN_PROGRESS

WAITING_CUSTOMER

RESOLVED

CLOSED
```

---

# Categorias

Criar:

## Pagamento

Problemas:

- Cobrança.
- PIX.
- Cartão.


---

## Recarga

Problemas:

- Não iniciou.
- Falha carregador.
- Interrupção.


---

## Conta

Problemas:

- Cadastro.
- Acesso.
- Dados.


---

## Equipamento

Problemas:

- Conector.
- Estação.
- Falha técnica.

---

# SLA

Criar:

Service Level Agreement


Definir:

Prioridade alta:

Resposta rápida.


Prioridade baixa:

Prazo maior.

---

# Dashboard Suporte

Criar:

/support/dashboard


Mostrar:

- Tickets abertos.
- Tempo médio resposta.
- Resolução.
- Satisfação.

---

# Área do usuário

Criar:

/support


Permitir:

- Abrir chamado.
- Acompanhar.
- Responder.
- Avaliar atendimento.

---

# Base de conhecimento

Criar:

Knowledge Base


Permitir:

Artigos:

- Como iniciar recarga.
- Como pagar.
- Solução de problemas.

---

# Pesquisa inteligente

Integrar AI Assistant.


Antes de abrir chamado:

IA tenta resolver.


Exemplo:

Usuário:

"Minha recarga parou"


IA:

"Verifique se o conector está encaixado."

---

# Chat

Preparar:

Chat interno.

Suportar:

- Usuário.
- Operador.
- Suporte.

---

# Customer Success

Criar:

Customer Health Score


Analisar:

- Uso da plataforma.
- Tickets.
- Frequência.
- Satisfação.

---

# Alertas

Criar:

Clientes em risco:

Exemplo:

"Empresa reduziu uso 40%."

---

# Pesquisas

Criar:

NPS


Pergunta:

"Você recomendaria nossa plataforma?"

---

# Banco de Dados

Criar:

## KnowledgeArticle

Campos:

- title
- content
- category
- status


---

## CustomerFeedback

Campos:

- user_id
- rating
- comment
- created_at

---

# API

Criar:

GET

/support/tickets


POST

/support/tickets


PATCH

/support/tickets/:id


GET

/support/articles


POST

/support/feedback

---

# Segurança

Garantir:

Usuário vê seus chamados.

Empresa vê chamados da organização.

Suporte possui permissões específicas.

---

# Testes

Validar:

- Abrir chamado.
- Alterar status.
- SLA.
- Feedback.
- Base conhecimento.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuários conseguem suporte.

✅ Equipe acompanha chamados.

✅ IA reduz atendimento repetitivo.

---

# Entrega

Informar:

1. Estrutura criada.
2. Fluxo suporte.
3. APIs.
4. Como testar.
5. Próximo módulo recomendado.