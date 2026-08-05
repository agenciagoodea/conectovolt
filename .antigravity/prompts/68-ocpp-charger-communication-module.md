# PROMPT 68 — OCPP CHARGER COMMUNICATION MODULE

## Contexto

Você está implementando a camada de comunicação entre a EV Charge Platform e carregadores elétricos físicos utilizando protocolo OCPP.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/ENERGY.md
- docs/CHARGING_CORE.md

---

# Objetivo

Criar um sistema capaz de conectar, monitorar e controlar carregadores reais através de comunicação OCPP.

---

# Conceito

Carregador

↓

OCPP Gateway

↓

Charging Backend

↓

Aplicação

---

# Estrutura Backend

Criar:

```
modules/ocpp/

ocpp.module.ts

ocpp.gateway.ts

ocpp.controller.ts

ocpp.service.ts

connections/

messages/

commands/

telemetry/

sessions/

tests/

```

---

# OCPP Gateway

Implementar:

WebSocket Server


Responsável:

- Conexão carregadores.
- Autenticação.
- Comunicação bidirecional.

---

# Compatibilidade

Preparar suporte:

- OCPP 1.6
- OCPP 2.0.1

---

# Gerenciamento conexão

Criar:

Charger Connection Manager


Controlar:

- Online.
- Offline.
- Última comunicação.
- Qualidade conexão.

---

# Mensagens OCPP

Implementar suporte:

## BootNotification

Registrar carregador.

---

## Heartbeat

Monitorar presença.

---

## StatusNotification

Receber:

- Disponível.
- Carregando.
- Falha.

---

## MeterValues

Receber:

- Energia.
- Potência.
- Corrente.
- Tensão.

---

## StartTransaction

Iniciar sessão.

---

## StopTransaction

Finalizar sessão.

---

# Comandos remotos

Criar:

Remote Command Engine


Permitir:

- Iniciar recarga.
- Parar recarga.
- Reiniciar carregador.
- Atualizar configuração.

---

# Segurança comunicação

Implementar:

- Certificados.
- Autenticação carregador.
- Comunicação criptografada.
- Controle autorização.

---

# Telemetria

Criar:

Telemetry Processor


Armazenar:

- Consumo.
- Temperatura.
- Potência.
- Eventos.

---

# Monitoramento carregadores

Criar:

Charger Health Monitor


Detectar:

- Falhas.
- Quedas conexão.
- Anomalias.

---

# Banco de Dados

Criar:

## ChargerConnection

Campos:

- id
- charger_id
- status
- last_seen


---

## OcppMessage

Campos:

- id
- charger_id
- message_type
- timestamp


---

## ChargerTelemetry

Campos:

- id
- charger_id
- power
- energy
- created_at

---

# API

Criar:

GET

/ocpp/chargers/status


POST

/ocpp/charger/command


GET

/ocpp/telemetry


---

# Dashboard operador

Criar:

/operator/chargers


Mostrar:

- Carregadores online.
- Falhas.
- Sessões.
- Consumo.

---

# Logs

Registrar:

- Comunicação.
- Erros.
- Eventos críticos.

---

# Testes

Validar:

- Conectar carregador.
- Receber heartbeat.
- Atualizar status.
- Enviar comando.
- Registrar telemetria.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Carregadores reais conseguem comunicar.

✅ Plataforma recebe dados em tempo real.

✅ Operadores conseguem controlar equipamentos.

---

# Entrega

Informar:

1. Gateway OCPP.
2. Mensagens suportadas.
3. Comandos criados.
4. Segurança.
5. Próximo módulo recomendado.