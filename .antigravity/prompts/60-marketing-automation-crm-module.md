# PROMPT 60 — MARKETING AUTOMATION & CRM MODULE

## Contexto

Você está implementando o sistema de CRM, marketing automation e relacionamento da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/USER_EXPERIENCE.md
- docs/ANALYTICS.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar uma plataforma de relacionamento capaz de automatizar comunicação, campanhas e jornadas de clientes.

---

# Conceito

Dados usuário

↓

Segmentação

↓

Automação

↓

Comunicação

↓

Conversão

---

# Estrutura Backend

Criar:

```
modules/crm/

crm.module.ts

crm.controller.ts

crm.service.ts

segments/

campaigns/

automation/

communication/

leads/

tests/

```

---

# Cadastro CRM

Criar:

Customer Profile


Campos:

- user_id
- type
- preferences
- engagement_score
- lifecycle_stage

---

# Segmentação

Criar:

Audience Segmentation


Segmentar:

- Usuários novos.
- Usuários frequentes.
- Usuários inativos.
- Empresas.
- Motoristas.

---

# Jornadas automáticas

Criar:

Customer Journey Engine


Exemplos:

---

Novo usuário:

Cadastro

↓

Mensagem boas-vindas

↓

Primeira recarga

↓

Benefício

---

Usuário parado:

30 dias sem recarga

↓

Campanha retorno

---

# Campanhas

Criar:

Campaign Manager


Permitir:

- Criar campanha.
- Definir público.
- Definir canal.
- Medir resultado.

---

# Canais comunicação

Suportar:

- Push notification.
- Email.
- SMS.
- WhatsApp.

---

# Templates

Criar:

Message Templates


Permitir:

- Personalização.
- Variáveis.
- Traduções.

---

# Leads comerciais

Criar:

Lead Management


Para:

- Operadores.
- Empresas.
- Frotas.

---

# Pipeline vendas

Criar:

Sales Pipeline


Etapas:

Lead

↓

Contato

↓

Demonstração

↓

Proposta

↓

Contrato

---

# CRM Dashboard

Criar:

/crm/dashboard


Mostrar:

- Leads.
- Conversões.
- Campanhas.
- Receita gerada.

---

# Integração Analytics

Consumir:

- Comportamento.
- Engajamento.
- Histórico.

---

# Inteligência Artificial

Integrar:

AI Module


Criar:

- Sugestão campanha.
- Previsão churn.
- Melhor horário envio.

---

# Banco de Dados

Criar:

## CustomerProfile

Campos:

- id
- user_id
- segment
- score


---

## Campaign

Campos:

- id
- name
- audience
- status


---

## MessageLog

Campos:

- id
- user_id
- channel
- sent_at

---

# API

Criar:

GET

/crm/customers


POST

/crm/campaign


GET

/crm/segments


POST

/crm/journey

---

# Segurança

Garantir:

- Consentimento comunicação.
- Controle dados pessoais.
- Auditoria mensagens.

---

# Testes

Validar:

- Criar segmento.
- Executar campanha.
- Enviar comunicação.
- Medir conversão.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Comunicação é automatizada.

✅ Clientes são segmentados.

✅ Vendas podem escalar.

---

# Entrega

Informar:

1. CRM criado.
2. Campanhas.
3. Automações.
4. APIs.
5. Próximo módulo recomendado.