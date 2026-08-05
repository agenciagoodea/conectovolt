# PROMPT 39 — LEGAL, PRIVACY & DATA GOVERNANCE MODULE

## Contexto

Você está implementando o módulo de privacidade, proteção de dados e governança da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/DATABASE.md
- docs/SECURITY.md

---

# Objetivo

Criar uma estrutura de governança de dados para proteger usuários e empresas.

---

# Conceito

Dados pessoais

↓

Consentimento

↓

Processamento controlado

↓

Auditoria

↓

Direitos do usuário

---

# Estrutura Backend

Criar:

```
modules/privacy/

privacy.module.ts

privacy.controller.ts

privacy.service.ts

consents/

requests/

retention/

audit/

tests/

```

---

# Consentimento

Criar:

UserConsent


Campos:

- id
- user_id
- type
- accepted
- version
- accepted_at

---

# Tipos de consentimento

Criar:

```
TERMS_OF_USE

PRIVACY_POLICY

MARKETING

LOCATION

DATA_PROCESSING
```

---

# Política de dados

Criar:

DataProcessingRegistry


Registrar:

- Tipo de dado.
- Finalidade.
- Base legal.
- Tempo retenção.

---

# Dados controlados

Mapear:

## Usuário

- Nome.
- Email.
- Telefone.


## Operação

- Histórico recarga.
- Localização.


## Financeiro

- Pagamentos.
- Faturas.

---

# Direitos do usuário

Implementar:

## Solicitação de dados

Usuário pode solicitar:

- Seus dados armazenados.


---

## Exclusão de conta

Criar fluxo:

Solicitação

↓

Validação

↓

Anonimização

↓

Conclusão

---

## Exportação de dados

Criar:

Data Export


Formato:

JSON.

CSV.

---

# Retenção

Criar:

Data Retention Policy


Definir:

- Dados ativos.
- Dados arquivados.
- Dados removidos.

---

# Segurança

Integrar:

Audit Module


Registrar:

- Quem acessou dados.
- Quando.
- Qual informação.

---

# Controle de acesso

Criar:

Permission Matrix


Exemplo:

ADMIN:

Dados globais.


OPERATOR:

Dados da empresa.


CUSTOMER:

Somente seus dados.

---

# Frontend

Criar:

## Configuração privacidade

Usuário:

/privacy


Permitir:

- Ver consentimentos.
- Alterar preferências.
- Solicitar dados.

---

# Admin

Criar:

/admin/privacy


Mostrar:

- Solicitações.
- Consentimentos.
- Logs.

---

# API

Criar:

GET

/privacy/consents


POST

/privacy/consents


POST

/privacy/export


POST

/privacy/delete-request

---

# Notificações

Enviar:

- Confirmação consentimento.
- Atualização política.
- Status solicitação.

---

# Testes

Validar:

- Aceitar termo.
- Exportar dados.
- Solicitar exclusão.
- Controle permissões.
- Auditoria.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuário controla seus dados.

✅ Empresa possui governança.

✅ Acesso é rastreável.

---

# Entrega

Informar:

1. Estrutura criada.
2. Dados protegidos.
3. APIs.
4. Como testar.
5. Próximo módulo recomendado.