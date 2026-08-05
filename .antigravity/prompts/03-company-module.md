# PROMPT 03 — COMPANY MODULE

## Contexto

Você está implementando o módulo de empresas da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/DATABASE.md
- docs/API.md
- docs/PRISMA_SCHEMA_PLAN.md

---

# Objetivo

Criar o gerenciamento das empresas operadoras de postos de recarga.

Uma empresa representa o cliente pagante da plataforma.

---

# Conceito

A plataforma possui múltiplas empresas.

Cada empresa deve possuir seus próprios:

- Usuários.
- Postos.
- Carregadores.
- Sessões.
- Dados financeiros.

Nenhuma empresa pode acessar dados de outra.

---

# Banco de Dados

Criar model Company.

Campos:

- id
- name
- document
- email
- phone
- status
- created_at
- updated_at

---

# Enum

CompanyStatus:

- PENDING
- ACTIVE
- INACTIVE

---

# Estrutura do módulo

Criar:

```
modules/companies/

companies.controller.ts

companies.service.ts

companies.module.ts

repository/

dto/

entities/

tests/

```

---

# Funcionalidades

## Criar empresa

Endpoint:

POST

/companies


Dados:

- Nome
- Documento
- Email
- Telefone


Regras:

- Documento único.
- Criar empresa como PENDING.
- Registrar data de criação.

---

# Listar empresas

Endpoint:

GET

/companies


Regras:

SUPER_ADMIN:

Pode visualizar todas.

OPERATOR:

Visualiza somente sua empresa.

---

# Buscar empresa

Endpoint:

GET

/companies/:id


Validar:

Usuário possui permissão.

---

# Atualizar empresa

Endpoint:

PATCH

/companies/:id


Permitir alterar:

- Nome.
- Email.
- Telefone.
- Status.

---

# Desativar empresa

Endpoint:

DELETE

/companies/:id


Não remover fisicamente.

Usar:

soft delete

ou

status INACTIVE.

---

# Segurança

Obrigatório:

- Guard JWT.
- Validação de roles.
- Isolamento por company_id.

---

# Regras de negócio

1.

Somente SUPER_ADMIN pode aprovar uma empresa.


2.

Empresa nova inicia como PENDING.


3.

Operadores só podem gerenciar seus próprios dados.


4.

Toda entidade futura deve possuir vínculo com company_id quando aplicável.

---

# Swagger

Documentar:

POST /companies

GET /companies

GET /companies/:id

PATCH /companies/:id

DELETE /companies/:id

---

# Testes

Criar testes:

- Criar empresa.
- Documento duplicado.
- Buscar empresa.
- Bloqueio de acesso entre empresas.
- Alteração de status.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Empresas podem ser criadas.

✅ Admin consegue aprovar.

✅ Permissões funcionam.

✅ Dados são isolados por empresa.

---

# Entrega

Informar:

1. Arquivos criados.
2. Migration criada.
3. Endpoints disponíveis.
4. Como testar.
5. Próximo módulo recomendado.