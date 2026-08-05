# PROMPT 69 — CHARGING SESSION MANAGEMENT MODULE

## Contexto

Você está implementando o gerenciamento completo das sessões de carregamento da EV Charge Platform.

Este módulo conecta:

- Usuário.
- Veículo.
- Carregador.
- Energia consumida.
- Pagamento.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/CHARGING_CORE.md
- docs/ENERGY.md
- docs/PAYMENTS.md

---

# Objetivo

Criar o sistema responsável por controlar todo ciclo de uma sessão de carregamento elétrico.

---

# Conceito

Usuário solicita carga

↓

Autorização

↓

Carregamento iniciado

↓

Monitoramento energia

↓

Finalização

↓

Cobrança

---

# Estrutura Backend

Criar:

```
modules/charging-session/

session.module.ts

session.controller.ts

session.service.ts

authorization/

metering/

tracking/

history/

events/

tests/

```

---

# Modelo Charging Session

Criar:

ChargingSession Entity


Campos:

- id
- user_id
- vehicle_id
- charger_id
- station_id
- start_time
- end_time
- energy_consumed
- status
- total_cost

---

# Estados sessão

Criar:

```
REQUESTED

AUTHORIZED

STARTED

CHARGING

COMPLETED

STOPPED

FAILED
```

---

# Autorização recarga

Criar:

Charging Authorization Service


Métodos:

- Validar usuário.
- Validar pagamento.
- Validar carregador.
- Liberar sessão.

---

# Início sessão

Fluxo:

Usuário solicita

↓

Sistema valida

↓

Enviar comando OCPP

↓

Registrar início

---

# Monitoramento tempo real

Acompanhar:

- Energia.
- Tempo.
- Potência.
- Estado bateria.

---

# Finalização sessão

Permitir:

- Usuário encerra.
- Veículo completo.
- Operador encerra.
- Falha equipamento.

---

# Medição energia

Criar:

Metering Service


Registrar:

- kWh consumidos.
- Tempo conectado.
- Potência média.

---

# Histórico usuário

Criar:

Charging History


Mostrar:

- Sessões anteriores.
- Consumo.
- Valores pagos.

---

# Eventos

Criar:

Session Events


Eventos:

```
session.started

session.energy_update

session.completed

session.failed
```

---

# Banco de Dados

Criar:

## ChargingSession

Campos:

- id
- user_id
- charger_id
- status
- energy
- cost


---

## SessionMeter

Campos:

- session_id
- value
- timestamp


---

# API

Criar:

POST

/sessions/start


POST

/sessions/:id/stop


GET

/sessions/history


GET

/sessions/:id/status

---

# Dashboard operador

Criar:

/operator/sessions


Mostrar:

- Sessões ativas.
- Energia.
- Receita.
- Problemas.

---

# Dashboard usuário

Criar:

/user/sessions


Mostrar:

- Recarga atual.
- Histórico.
- Consumo.
- Valor.

---

# Segurança

Garantir:

- Usuário só controla suas sessões.
- Operador controla seus equipamentos.
- Logs completos.

---

# Testes

Validar:

- Criar sessão.
- Autorizar.
- Iniciar carregamento.
- Atualizar consumo.
- Finalizar.
- Gerar histórico.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuário consegue carregar veículo.

✅ Sistema controla energia consumida.

✅ Sessão gera dados para cobrança.

---

# Entrega

Informar:

1. Fluxo sessão.
2. Banco criado.
3. APIs.
4. Integração OCPP.
5. Próximo módulo recomendado.