# PROMPT 66 — MVP FOUNDATION & PROJECT INITIALIZATION MODULE

## Contexto

Você está iniciando a implementação real da EV Charge Platform após conclusão da arquitetura completa.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- todos os documentos de módulos

---

# Objetivo

Criar a fundação técnica do projeto para iniciar o desenvolvimento do MVP.

---

# Definição Stack Tecnológica

Avaliar e definir:

## Backend

Escolher:

- Linguagem.
- Framework.
- Arquitetura.
- ORM.
- Testes.

---

## Frontend Web

Definir:

- Framework.
- Componentes.
- Design system.
- Estado aplicação.

---

## Mobile

Definir:

- Android.
- iOS.
- Framework compartilhado.

---

## Banco Dados

Definir:

- Banco relacional.
- Cache.
- Filas.
- Storage.

---

# Estrutura inicial projeto

Criar:

```
ev-charge-platform/

backend/

frontend/

mobile/

infrastructure/

documentation/

scripts/

tests/

```

---

# Arquitetura Backend

Implementar base:

```
src/

modules/

common/

database/

auth/

config/

events/

```

---

# Primeiro módulo obrigatório

Criar:

Identity Module


Incluindo:

- Usuários.
- Login.
- Cadastro.
- Perfis.
- Permissões.

---

# Sistema autenticação

Implementar:

- JWT.
- Refresh token.
- Controle sessão.
- Recuperação senha.

Preparar:

- MFA.
- OAuth.

---

# Banco inicial

Criar tabelas:

## User

Campos:

- id
- name
- email
- password_hash
- status
- created_at


## Role

Campos:

- id
- name


## Permission

Campos:

- id
- name


---

# Controle acesso

Criar:

RBAC


Perfis:

```
USER

OPERATOR

ADMIN

ENTERPRISE_ADMIN

SUPER_ADMIN
```

---

# Ambiente desenvolvimento

Criar:

- Development.
- Staging.
- Production.

---

# Infraestrutura inicial

Preparar:

- Containers.
- Variáveis ambiente.
- Logs.
- Monitoramento.

---

# Versionamento

Configurar:

- Git.
- Branch strategy.
- Pull requests.
- Code review.

---

# CI/CD

Criar pipeline:

Commit

↓

Testes

↓

Build

↓

Deploy

---

# Documentação

Criar:

## README

## Guia instalação

## Arquitetura

## API Documentation

---

# Segurança inicial

Implementar:

- Criptografia senha.
- Validação entrada.
- Proteção API.
- Auditoria básica.

---

# Testes

Criar:

- Testes autenticação.
- Testes usuário.
- Testes permissões.

---

# Critério conclusão

O módulo está pronto quando:

✅ Projeto criado.

✅ Ambiente configurado.

✅ Usuários conseguem autenticar.

✅ Base pronta para os próximos módulos.

---

# Entrega

Informar:

1. Stack escolhida.
2. Estrutura criada.
3. Banco inicial.
4. Segurança.
5. Próximo módulo recomendado.