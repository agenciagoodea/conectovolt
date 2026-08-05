# PROMPT 04 — STATION MODULE

## Contexto

Você está implementando o módulo de postos de recarga da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/DATABASE.md
- docs/API.md
- docs/PRISMA_SCHEMA_PLAN.md
- docs/UX_FLOW.md

---

# Objetivo

Criar o gerenciamento dos postos físicos de recarga.

Um posto pertence a uma empresa operadora.

Cada posto poderá possuir vários carregadores.

---

# Conceito

Estrutura:

Company

↓

Stations

↓

Chargers

---

# Banco de Dados

Criar model Station.

Campos:

- id
- company_id
- name
- description
- address
- city
- state
- latitude
- longitude
- status
- created_at
- updated_at

---

# Enum

StationStatus:

- ACTIVE
- INACTIVE
- MAINTENANCE

---

# Estrutura do módulo

Criar:

```
modules/stations/

stations.controller.ts

stations.service.ts

stations.module.ts

repository/

dto/

entities/

tests/

```

---

# Funcionalidades

## Criar posto

Endpoint:

POST

/stations


Dados:

- Nome
- Descrição
- Endereço
- Cidade
- Estado
- Latitude
- Longitude


Regras:

- Usuário deve estar autenticado.
- Empresa deve existir.
- Associar automaticamente ao company_id do usuário.

---

# Listar postos

Endpoint:

GET

/stations


Filtros:

- company_id
- city
- state
- status


Regras:

SUPER_ADMIN:

Visualiza todos.


OPERATOR:

Visualiza somente seus postos.


CUSTOMER:

Somente visualizar postos públicos ativos.

---

# Buscar posto

Endpoint:

GET

/stations/:id


Retornar:

Dados do posto.

Quantidade de:

- Carregadores.
- Conectores.
- Status.

---

# Atualizar posto

Endpoint:

PATCH

/stations/:id


Permitir:

- Nome.
- Descrição.
- Endereço.
- Localização.
- Status.

---

# Remover posto

Endpoint:

DELETE

/stations/:id


Regra:

Não apagar fisicamente.

Alterar status para:

INACTIVE.

---

# Localização

Preparar estrutura para:

- Google Maps.
- Busca por proximidade.
- Geolocalização.

---

# Segurança

Obrigatório:

- JWT.
- RolesGuard.
- Company isolation.

---

# Regras de negócio

1.

Todo posto pertence a uma empresa.


2.

Uma empresa pode possuir vários postos.


3.

Um posto inativo não aparece para clientes.


4.

Somente operadores autorizados podem editar seus postos.


---

# Swagger

Documentar:

POST /stations

GET /stations

GET /stations/:id

PATCH /stations/:id

DELETE /stations/:id

---

# Testes

Criar testes:

- Criar posto.
- Listar postos.
- Bloquear acesso de outra empresa.
- Alterar status.
- Buscar posto público.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Empresa consegue criar postos.

✅ Admin consegue visualizar todos.

✅ Clientes conseguem visualizar postos ativos.

✅ Permissões estão funcionando.

---

# Entrega

Informar:

1. Arquivos criados.
2. Migration gerada.
3. Endpoints funcionando.
4. Como testar.
5. Próximo módulo recomendado.