# PROMPT 02 — AUTH MODULE

## Contexto

Você está implementando o módulo de autenticação da ConectoVolt.

Antes de executar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/DATABASE.md
- docs/PRISMA_SCHEMA_PLAN.md

---

# Objetivo

Criar o sistema de autenticação MVP.

O módulo deve permitir:

- Cadastro de usuários.
- Login.
- Geração de JWT.
- Controle de permissões.
- Proteção das rotas.

---

# Tecnologias

Utilizar:

- NestJS
- Prisma
- PostgreSQL
- Passport JWT
- bcrypt

---

# Banco de Dados

Criar model User conforme definido no Prisma.

Campos obrigatórios:

- id
- name
- email
- phone
- password_hash
- role
- company_id
- created_at
- updated_at

---

# Criar Enums

UserRole:

- SUPER_ADMIN
- OPERATOR
- CUSTOMER

---

# Estrutura do módulo

Criar:

```
modules/auth/

auth.controller.ts

auth.service.ts

auth.module.ts

strategies/

guards/

dto/

```

---

# Funcionalidades

## Cadastro

Endpoint:

POST

/auth/register


Receber:

- Nome
- Email
- Senha
- Perfil


Regras:

- Email único.
- Senha deve ser armazenada com hash.
- Validar dados.

---

## Login

Endpoint:

POST

/auth/login


Receber:

- Email
- Senha


Retornar:

- Access Token
- Refresh Token
- Dados do usuário


---

# JWT

Criar:

Access Token

Refresh Token


Configurar:

JWT_SECRET

JWT_REFRESH_SECRET


---

# Guards

Criar:

JwtAuthGuard


Criar:

RolesGuard


Permitir:

Exemplo:

Somente:

SUPER_ADMIN

pode acessar rotas administrativas.

---

# Segurança

Obrigatório:

- Nunca retornar password_hash.
- Validar credenciais.
- Criar mensagens de erro seguras.
- Aplicar hash bcrypt.

---

# Testes

Criar testes para:

- Cadastro válido.
- Email duplicado.
- Login correto.
- Senha incorreta.
- Permissão negada.

---

# Swagger

Documentar:

POST /auth/register

POST /auth/login

---

# Critérios de conclusão

O módulo está pronto quando:

✅ Usuário consegue criar conta.

✅ Usuário consegue autenticar.

✅ Token JWT funciona.

✅ Rotas protegidas funcionam.

✅ Permissões funcionam.

---

# Entrega

Informar:

1. Arquivos criados.
2. Alterações no banco.
3. Como testar.
4. Exemplos de chamadas API.
5. Próximo módulo recomendado.