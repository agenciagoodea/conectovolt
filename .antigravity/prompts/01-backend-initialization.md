# PROMPT 01 — BACKEND INITIALIZATION

## Contexto

Você está trabalhando no projeto ConectoVolt.

Antes de executar qualquer alteração, leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/README.md
- docs/BUSINESS_MODEL.md
- docs/BACKEND_SETUP.md
- docs/DATABASE.md
- docs/API.md
- docs/PRISMA_SCHEMA_PLAN.md

---

# Objetivo

Criar a fundação inicial do backend.

Não criar regras de negócio ainda.

Apenas preparar a arquitetura.

---

# Tarefas

## 1. Criar projeto NestJS

Criar aplicação backend utilizando:

- NestJS
- TypeScript


Nome:

backend

---

## 2. Configurar dependências

Instalar:

- Prisma
- PostgreSQL Client
- JWT
- Passport
- Validation
- Swagger
- Config Module

---

## 3. Configurar estrutura

Criar:

src/

common/

config/

database/

modules/

shared/

---

## 4. Configurar ambiente

Criar:

.env.example


Com:

DATABASE_URL

JWT_SECRET

JWT_REFRESH_SECRET

REDIS_HOST

REDIS_PORT

PORT

NODE_ENV


---

## 5. Configurar Prisma

Executar:

Prisma Init


Criar:

prisma/schema.prisma


Configurar:

PostgreSQL


---

## 6. Configurar Database Module

Criar conexão Prisma seguindo padrão:

Service

Module

Provider


---

## 7. Configurar Swagger

Criar documentação:

/api/docs


---

## 8. Configurar validação global

Adicionar:

ValidationPipe

com:

- whitelist
- forbidNonWhitelisted
- transform


---

# Regras

Não criar:

- Controllers de negócio.
- Tabelas ainda.
- Login.
- Pagamentos.
- Recarga.

Somente infraestrutura.

---

# Entrega esperada

Ao finalizar informar:

1. Arquivos criados.
2. Dependências instaladas.
3. Como executar localmente.
4. Como testar.
5. Próximo passo recomendado.

---

# Critério de sucesso

O backend deve:

✅ iniciar sem erros.

✅ conectar ao PostgreSQL.

✅ abrir Swagger.

✅ possuir arquitetura pronta para receber módulos.