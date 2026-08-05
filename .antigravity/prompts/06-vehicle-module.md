# PROMPT 06 — VEHICLE MODULE

## Contexto

Você está implementando o módulo de veículos da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/DATABASE.md
- docs/API.md
- docs/PRISMA_SCHEMA_PLAN.md
- docs/UX_FLOW.md

---

# Objetivo

Criar o gerenciamento dos veículos dos motoristas.

Um usuário pode possuir um ou mais veículos.

Um veículo poderá ser utilizado em várias sessões de recarga.

---

# Conceito

Estrutura:

Customer

↓

Vehicles

↓

Charging Sessions

---

# Banco de Dados

Criar model Vehicle.

Campos:

- id
- user_id
- brand
- model
- plate
- battery_capacity
- created_at
- updated_at

---

# Estrutura do módulo

Criar:

```
modules/vehicles/

vehicles.controller.ts

vehicles.service.ts

vehicles.module.ts

repository/

dto/

entities/

tests/

```

---

# Funcionalidades

## Cadastrar veículo

Endpoint:

POST

/vehicles


Dados:

```json
{
"brand":"Tesla",
"model":"Model 3",
"plate":"ABC1234",
"battery_capacity":60
}
```


Regras:

- Usuário deve estar autenticado.
- Associar automaticamente ao usuário logado.
- Placa deve ser validada.

---

# Listar veículos do usuário

Endpoint:

GET

/vehicles


Regra:

Cliente visualiza somente seus próprios veículos.

---

# Buscar veículo

Endpoint:

GET

/vehicles/:id


Validar:

Usuário possui acesso ao veículo.

---

# Atualizar veículo

Endpoint:

PATCH

/vehicles/:id


Permitir:

- Marca.
- Modelo.
- Placa.
- Capacidade da bateria.

---

# Remover veículo

Endpoint:

DELETE

/vehicles/:id


Regra:

Utilizar soft delete.

Não remover histórico de recargas.

---

# Regras de negócio

1.

Um usuário pode possuir vários veículos.


2.

Um veículo pertence a apenas um usuário.


3.

Um veículo removido continua relacionado ao histórico.


4.

Toda Charging Session deve poder identificar o veículo utilizado.


---

# Validação

Obrigatório:

- Placa única por usuário.
- Capacidade da bateria maior que zero.
- Campos obrigatórios preenchidos.

---

# Segurança

Obrigatório:

- JWT Guard.
- Usuário só acessa seus próprios veículos.

---

# Swagger

Documentar:

POST /vehicles

GET /vehicles

GET /vehicles/:id

PATCH /vehicles/:id

DELETE /vehicles/:id

---

# Testes

Criar testes:

- Criar veículo.
- Listar veículos próprios.
- Bloquear acesso de outro usuário.
- Atualizar veículo.
- Remover sem perder histórico.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Motorista consegue cadastrar veículo.

✅ Veículo aparece no aplicativo.

✅ Pode ser usado em uma recarga.

✅ Histórico permanece protegido.

---

# Entrega

Informar:

1. Arquivos criados.
2. Migration gerada.
3. Endpoints disponíveis.
4. Como testar.
5. Próximo módulo recomendado.