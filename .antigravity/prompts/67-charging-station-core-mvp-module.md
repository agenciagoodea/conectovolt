# PROMPT 67 — CHARGING STATION CORE MVP MODULE

## Contexto

Você está implementando o núcleo operacional inicial da EV Charge Platform.

Este é o primeiro módulo conectado diretamente à infraestrutura de carregamento.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/MVP.md
- docs/ENERGY.md

---

# Objetivo

Criar o sistema base para cadastro, gerenciamento e monitoramento de estações e carregadores elétricos.

---

# Conceito

Operador cadastra estação

↓

Estação possui carregadores

↓

Usuário encontra disponibilidade

↓

Sistema inicia recarga

---

# Estrutura Backend

Criar:

```
modules/charging-core/

charging.module.ts

charging.controller.ts

charging.service.ts

stations/

chargers/

connectors/

availability/

location/

tests/

```

---

# Gestão de estações

Criar:

Station Entity


Campos:

- id
- operator_id
- name
- address
- latitude
- longitude
- status
- created_at

---

# Status estação

Criar estados:

```
ACTIVE

INACTIVE

MAINTENANCE

OFFLINE
```

---

# Gestão carregadores

Criar:

Charger Entity


Campos:

- id
- station_id
- model
- power_kw
- status

---

# Status carregador

Criar:

```
AVAILABLE

CHARGING

UNAVAILABLE

FAULT

MAINTENANCE
```

---

# Conectores

Criar:

Connector Entity


Campos:

- id
- charger_id
- type
- status

---

# Tipos suporte

Preparar:

- CCS.
- CHAdeMO.
- Type 2.
- GB/T.

---

# Localização

Criar:

Station Location Service


Permitir:

- Busca por proximidade.
- Distância.
- Geolocalização.

---

# Mapa inicial

Criar API para:

Mostrar:

- Estações próximas.
- Status.
- Quantidade carregadores.
- Potência disponível.

---

# Disponibilidade em tempo real

Criar:

Availability Engine


Atualizar:

- Carregador livre.
- Carregador ocupado.
- Falha.

---

# Integração futura OCPP

Preparar arquitetura para:

- Comunicação carregador.
- Telemetria.
- Comandos remotos.

---

# Banco de Dados

Criar:

## Station

Campos:

- id
- operator_id
- name
- address
- latitude
- longitude


---

## Charger

Campos:

- id
- station_id
- power
- status


---

## Connector

Campos:

- id
- charger_id
- type
- status

---

# API

Criar:

GET

/stations


GET

/stations/:id


POST

/stations


POST

/chargers


GET

/chargers/:id/status

---

# Dashboard operador MVP

Criar:

/operator/stations


Mostrar:

- Estações.
- Carregadores.
- Status.
- Uso.

---

# Dashboard usuário MVP

Criar:

/map


Mostrar:

- Localização.
- Disponibilidade.
- Informações básicas.

---

# Segurança

Garantir:

- Apenas operadores autorizados criam estações.
- Controle permissões.
- Auditoria alterações.

---

# Testes

Validar:

- Criar estação.
- Adicionar carregador.
- Alterar status.
- Consultar disponibilidade.
- Buscar localização.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Operador consegue cadastrar estação.

✅ Usuário consegue encontrar carregadores.

✅ Sistema acompanha disponibilidade.

---

# Entrega

Informar:

1. Estrutura criada.
2. Banco.
3. APIs.
4. Dashboards.
5. Próximo módulo recomendado.