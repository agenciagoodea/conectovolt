# PROMPT 21 — OCPP INTEGRATION MODULE

## Contexto

Você está implementando a integração OCPP da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/DATABASE.md
- docs/API.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar a camada de comunicação entre a plataforma e os carregadores elétricos.

---

# Protocolo

Implementar arquitetura preparada para:

OCPP 1.6 JSON


Futuro:

OCPP 2.0.1

---

# Conceito

Fluxo:

Carregador

↓

WebSocket OCPP

↓

OCPP Gateway

↓

Charging Service

↓

Banco de dados

↓

Dashboards

---

# Estrutura

Criar:

```
modules/ocpp/

ocpp.module.ts

ocpp.gateway.ts

ocpp.service.ts

handlers/

events/

messages/

tests/

```

---

# WebSocket Server

Criar:

OCPP Gateway


Responsável por:

- Aceitar conexões.
- Autenticar carregadores.
- Manter sessão.
- Receber mensagens.
- Enviar comandos.

---

# Banco de Dados

Adicionar model:

ChargerConnection


Campos:

- id
- charger_id
- connected
- last_seen
- ip_address
- created_at


---

# Eventos OCPP

Implementar handlers:

---

# BootNotification

Quando carregador conecta:

Salvar:

- fabricante.
- modelo.
- versão firmware.

Atualizar:

Status ONLINE.

---

# StatusNotification

Receber:

Estados:

- Available
- Preparing
- Charging
- Suspended
- Faulted
- Unavailable


Atualizar status do carregador.

---

# Authorize

Validar:

Usuário autorizado.

---

# StartTransaction

Criar:

Charging Session


Relacionar:

- usuário.
- carregador.
- conector.


---

# MeterValues

Receber:

- Energia consumida.
- Potência.
- Voltagem.
- Corrente.


Atualizar:

Charging Session.

---

# StopTransaction

Finalizar:

Sessão.

Calcular:

Valor final.

Enviar para Payment.

---

# Comandos da plataforma

Preparar:

Enviar para carregador:

## RemoteStartTransaction

Iniciar remotamente.


## RemoteStopTransaction

Parar remotamente.


## UnlockConnector

Liberar conector.

---

# Segurança

Implementar:

- Autenticação por charger_id.
- Validação de conexão.
- Logs de comunicação.

---

# Logs

Criar registro:

OCPPMessageLog


Campos:

- charger_id
- action
- payload
- timestamp

---

# Monitoramento

Criar:

Heartbeat

Verificar:

- Última comunicação.
- Tempo offline.

---

# Dashboard

Adicionar:

Informações:

- Carregadores conectados.
- Última comunicação.
- Erros.
- Sessões ativas.

---

# Testes

Criar testes:

- Conexão carregador.
- BootNotification.
- Status update.
- StartTransaction.
- MeterValues.
- StopTransaction.
- Perda de conexão.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Plataforma aceita conexão OCPP.

✅ Carregador atualiza status.

✅ Sessão pode iniciar pelo carregador.

✅ Consumo é registrado.

✅ Sessão finaliza automaticamente.

---

# Entrega

Informar:

1. Arquivos criados.
2. Eventos implementados.
3. Mensagens OCPP suportadas.
4. Como testar.
5. Próximo módulo recomendado.