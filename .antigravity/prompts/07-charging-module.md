# PROMPT 07 — CHARGING SESSION MODULE

## Contexto

Você está implementando o módulo de sessões de recarga da ConectoVolt.

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

Criar o controle completo de uma sessão de recarga.

A sessão representa o momento em que um motorista conecta seu veículo a um carregador e inicia o consumo de energia.

---

# Conceito

Fluxo:

Usuário

↓

Veículo

↓

Posto

↓

Carregador

↓

Charging Session

↓

Pagamento

---

# Banco de Dados

Criar model ChargingSession.

Campos:

- id
- user_id
- vehicle_id
- station_id
- charger_id
- connector_id
- started_at
- finished_at
- energy_kwh
- amount
- status
- created_at
- updated_at

---

# Enum

ChargingStatus:

- PENDING
- ACTIVE
- COMPLETED
- CANCELLED

---

# Estrutura do módulo

Criar:

```
modules/charging/

charging.controller.ts

charging.service.ts

charging.module.ts

repository/

dto/

entities/

events/

tests/

```

---

# Funcionalidades

## Iniciar recarga

Endpoint:

POST

/charging/start


Request:

```json
{
"charger_id":"uuid",
"connector_id":"uuid",
"vehicle_id":"uuid"
}
```


Regras:

- Usuário deve estar autenticado.
- Carregador deve existir.
- Conector deve estar disponível.
- Veículo deve pertencer ao usuário.
- Não permitir duas sessões ativas no mesmo carregador.


Criar sessão:

status:

ACTIVE


Registrar:

- usuário
- veículo
- posto
- carregador
- horário inicial

---

# Consultar sessão ativa

Endpoint:

GET

/charging/active


Retornar:

- Tempo de recarga.
- Energia consumida.
- Valor parcial.
- Status.

---

# Atualizar consumo

Endpoint interno:

PATCH

/charging/:id/energy


Receber:

```json
{
"energy_kwh":15.5
}
```


Atualizar:

- consumo.
- valor parcial.

---

# Finalizar recarga

Endpoint:

POST

/charging/:id/stop


Ao finalizar:

Calcular:

energia consumida × tarifa kWh


Atualizar:

- finished_at
- energy_kwh
- amount
- status COMPLETED


---

# Histórico

Endpoint:

GET

/charging/history


Filtros:

- período
- usuário
- posto
- status


---

# Regras financeiras

Toda sessão finalizada deve gerar:

- Valor bruto da recarga.
- Registro para pagamento.
- Base para comissão.

---

# Preparação OCPP

Não implementar comunicação ainda.

Preparar arquitetura para receber futuramente:

- StartTransaction
- StopTransaction
- MeterValues
- StatusNotification


---

# Eventos

Criar estrutura preparada para eventos:

ChargingStarted

ChargingUpdated

ChargingFinished


---

# Segurança

Obrigatório:

- JWT.
- Validar propriedade do veículo.
- Validar acesso ao carregador.
- Não permitir alteração manual indevida.

---

# Swagger

Documentar:

POST /charging/start

GET /charging/active

PATCH /charging/:id/energy

POST /charging/:id/stop

GET /charging/history

---

# Testes

Criar testes:

- Iniciar recarga.
- Bloquear carregador ocupado.
- Atualizar consumo.
- Finalizar recarga.
- Calcular valor correto.
- Usuário sem permissão.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Motorista consegue iniciar uma recarga.

✅ Sistema acompanha consumo.

✅ Sistema calcula valor.

✅ Sessão fica registrada.

✅ Dados ficam preparados para pagamento.

---

# Entrega

Informar:

1. Arquivos criados.
2. Migration gerada.
3. Endpoints disponíveis.
4. Como testar.
5. Próximo módulo recomendado.