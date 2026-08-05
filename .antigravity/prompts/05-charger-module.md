# PROMPT 05 — CHARGER MODULE

## Contexto

Você está implementando o módulo de carregadores da EV Charge Platform.

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

Criar o gerenciamento dos equipamentos físicos de recarga.

Um carregador pertence a um posto.

Um carregador pode possuir múltiplos conectores.

---

# Conceito

Estrutura:

Company

↓

Station

↓

Charger

↓

Connector

---

# Banco de Dados

Criar model Charger.

Campos:

- id
- station_id
- serial_number
- manufacturer
- model
- power_kw
- ocpp_id
- status
- created_at
- updated_at

---

# Enum

ChargerStatus:

- ONLINE
- OFFLINE
- ERROR
- MAINTENANCE

---

# Estrutura do módulo

Criar:

```
modules/chargers/

chargers.controller.ts

chargers.service.ts

chargers.module.ts

repository/

dto/

entities/

tests/

```

---

# Funcionalidades

## Criar carregador

Endpoint:

POST

/chargers


Dados:

- station_id
- serial_number
- manufacturer
- model
- power_kw
- ocpp_id


Regras:

- Posto deve existir.
- Usuário deve possuir acesso ao posto.
- Número serial deve ser único.

---

# Listar carregadores

Endpoint:

GET

/chargers


Filtros:

- station_id
- status
- company_id


Regras:

SUPER_ADMIN:

Visualiza todos.


OPERATOR:

Visualiza somente seus equipamentos.


CUSTOMER:

Somente carregadores públicos ativos.

---

# Buscar carregador

Endpoint:

GET

/chargers/:id


Retornar:

- Dados do equipamento.
- Posto.
- Conectores.
- Status atual.

---

# Atualizar carregador

Endpoint:

PATCH

/chargers/:id


Permitir:

- Modelo.
- Fabricante.
- Potência.
- Status.

---

# Atualizar status

Endpoint:

PATCH

/chargers/:id/status


Receber:

```json
{
"status":"ONLINE"
}
```


Futuramente será atualizado automaticamente pelo OCPP.

---

# Remover carregador

Endpoint:

DELETE

/chargers/:id


Regra:

Não apagar fisicamente.

Alterar status:

MAINTENANCE

ou

INACTIVE.

---

# Módulo Connector

Criar entidade:

Connector


Campos:

- id
- charger_id
- type
- power_kw
- status


Tipos:

- TYPE2
- CCS
- CHADEMO


---

# Regras de negócio

1.

Todo carregador pertence a um posto.


2.

Todo carregador possui pelo menos um conector.


3.

OCPP ID deve ser único.


4.

Status online será preparado para integração futura.


5.

Somente operadores autorizados podem alterar equipamentos.


---

# Preparação OCPP

Não implementar comunicação ainda.

Apenas preparar:

- ocpp_id
- status
- last_connection_at (futuro)

---

# Swagger

Documentar:

POST /chargers

GET /chargers

GET /chargers/:id

PATCH /chargers/:id

PATCH /chargers/:id/status

DELETE /chargers/:id

---

# Testes

Criar testes:

- Criar carregador.
- Serial duplicado.
- OCPP ID duplicado.
- Acesso entre empresas.
- Atualizar status.
- Buscar carregadores públicos.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Operador consegue cadastrar carregadores.

✅ Equipamentos possuem status.

✅ Postos possuem seus carregadores.

✅ Estrutura está pronta para OCPP.

---

# Entrega

Informar:

1. Arquivos criados.
2. Migration gerada.
3. Endpoints funcionando.
4. Como testar.
5. Próximo módulo recomendado.