# BACKEND SETUP

Projeto: ConectoVolt

Versão: MVP 1.0

---

# Objetivo

Definir a configuração inicial do backend da plataforma.

O backend será responsável por:

- Autenticação.
- Gestão de empresas.
- Gestão de postos.
- Gestão de carregadores.
- Sessões de recarga.
- Pagamentos.
- Comissão.
- Dashboard.

---

# Tecnologia

Framework:

NestJS

Linguagem:

TypeScript

Banco:

MySQL em produção e SQLite em desenvolvimento local

ORM:

Prisma

Cache:

Redis

API:

REST

Tempo real:

WebSocket

---

# Estrutura Inicial

O backend seguirá:

```
backend/

src/

├── app.module.ts

├── main.ts

├── common/

│   ├── decorators/

│   ├── guards/

│   ├── filters/

│   ├── interceptors/

│   └── utils/


├── config/


├── database/


├── modules/

│
├── auth/

├── users/

├── companies/

├── stations/

├── chargers/

├── charging/

├── payments/

├── commissions/

├── dashboard/


└── shared/

```

---

# Configuração Inicial

Instalar:

- NestJS CLI
- Prisma
- PostgreSQL Driver
- JWT
- Passport
- Validation
- Swagger

---

# Variáveis de Ambiente

Arquivo:

.env


Obrigatório:

```
DATABASE_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

REDIS_HOST=

REDIS_PORT=

PORT=

NODE_ENV=
```

---

# Banco de Dados

Inicialização:

Criar banco PostgreSQL.

Executar:

Prisma Init.

Criar schema inicial.

Executar primeira migration.

---

# Configuração Prisma

Obrigatório:

- Schema organizado.
- Migrations versionadas.
- Seed inicial.

---

# Arquitetura dos Módulos

Cada módulo deve seguir:

```
module/

module.controller.ts

module.service.ts

module.repository.ts

module.module.ts

dto/

entities/

tests/

```

---

# Primeiro Módulos do MVP

Ordem de criação:

## 1 - Auth

Responsável:

- Login.
- Cadastro.
- JWT.
- Permissões.


## 2 - Users

Responsável:

- Usuários.
- Perfis.


## 3 - Companies

Responsável:

- Empresas operadoras.


## 4 - Stations

Responsável:

- Postos.


## 5 - Chargers

Responsável:

- Equipamentos.


## 6 - Charging

Responsável:

- Sessões.


## 7 - Payments

Responsável:

- Pagamentos.


## 8 - Commissions

Responsável:

- Comissão da plataforma.


---

# Padrão de Código

Obrigatório:

TypeScript Strict.

Utilizar:

- Interfaces.
- DTOs.
- Dependency Injection.
- Exceptions NestJS.

Evitar:

- Any.
- Código duplicado.
- Funções gigantes.

---

# Tratamento de Erros

Toda exceção deve retornar:

- Código HTTP correto.
- Mensagem clara.
- Log interno.

---

# Logs

Registrar:

- Login.
- Erros.
- Pagamentos.
- Alterações importantes.

---

# Swagger

Disponível em:

```
/api/docs
```

Toda rota deve possuir:

- Descrição.
- Request.
- Response.
- Erros possíveis.

---

# Primeira Entrega Backend

Após configuração, o backend deverá possuir:

✅ Projeto NestJS funcionando.

✅ Banco conectado.

✅ Prisma configurado.

✅ Swagger funcionando.

✅ Estrutura modular criada.

Ainda sem regras de negócio.

---

# Suporte Multi-Banco (SQLite em Dev e MySQL em Produção)

O backend possui suporte nativo a dois provedores de banco de dados:

### 1. Desenvolvimento (Local)
- **Provedor:** SQLite
- **Configuração no `.env`:**
  ```env
  DB_PROVIDER=sqlite
  DATABASE_URL="file:./prisma/dev.db"
  ```
- **Schema:** `prisma/schema.prisma`
- **Comandos:**
  ```bash
  npm run prisma:generate
  npm run prisma:migrate
  ```

---

### 2. Produção (MySQL / cPanel)
- **Provedor:** MySQL
- **Configuração no `.env.production`:**
  ```env
  DB_PROVIDER=mysql
  DATABASE_URL=mysql://usuario:senha@host_cpanel:3306/nome_banco
  ```
- **Schema:** `prisma/schema.mysql.prisma`
- **Comandos de Migração/Geração para cPanel:**
  ```bash
  npm run prisma:generate:mysql
  # Ou migração inicial:
   npx prisma migrate dev --schema=prisma/schema.mysql.prisma --name init
   ```

Para comparar migrations MySQL localmente, defina também um banco de sombra isolado em `SHADOW_DATABASE_URL`. Nunca use o banco de produção como shadow database.

