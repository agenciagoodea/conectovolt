# PROMPT 22 — REAL TIME MONITORING MODULE

## Contexto

Você está implementando o módulo de monitoramento em tempo real da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/DATABASE.md
- docs/UX_FLOW.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar comunicação em tempo real entre backend, dashboards e aplicativo.

---

# Conceito

Eventos:

Carregador muda status

↓

Backend recebe evento

↓

Publica atualização

↓

Clientes conectados recebem instantaneamente

---

# Tecnologia

Implementar:

WebSocket


Backend:

Gateway WebSocket


Frontend:

Socket Client


Mobile:

WebSocket Client

---

# Estrutura Backend

Criar:

```
modules/realtime/

realtime.module.ts

realtime.gateway.ts

realtime.service.ts

events/

channels/

tests/

```

---

# Canais

Criar canais:

## Admin Channel

Recebe:

Todos os eventos da plataforma.


---

## Company Channel

Recebe:

Eventos da empresa.


---

## Station Channel

Recebe:

Eventos de um posto específico.


---

## User Channel

Recebe:

Eventos do motorista.

---

# Eventos

Criar:

---

## ChargerStatusChanged

Payload:

```json
{
"charger_id":"uuid",
"status":"ONLINE"
}
```

---

## ChargingStarted

Enviar:

- Usuário.
- Posto.
- Carregador.
- Horário.

---

## ChargingUpdated

Enviar:

- Energia.
- Potência.
- Valor parcial.

---

## ChargingFinished

Enviar:

- Energia total.
- Valor final.

---

## PaymentUpdated

Enviar:

- Status pagamento.

---

# Backend Integration

Conectar com:

OCPP Module

Charging Module

Payment Module

Notification Module

---

# Dashboard Admin

Adicionar:

Atualização sem refresh:

Mostrar:

- Carregadores online/offline.
- Sessões ativas.
- Alertas.

---

# Dashboard Operador

Atualizar:

- Status carregadores.
- Recargas em andamento.
- Receita atual.

---

# Aplicativo Mobile

Durante recarga:

Atualizar:

- kWh.
- Tempo.
- Valor.

Sem precisar atualizar manualmente.

---

# Segurança

Implementar:

Autorização por canal.

ADMIN:

Acesso global.


OPERATOR:

Somente sua empresa.


CUSTOMER:

Somente suas sessões.

---

# Reconexão

Implementar:

- Reconectar automaticamente.
- Recuperar estado atual.
- Tratar perda de internet.

---

# Logs

Registrar:

- Conexões.
- Desconexões.
- Erros.

---

# Testes

Validar:

- Evento enviado.
- Cliente recebe.
- Permissões corretas.
- Reconexão.
- Atualização dashboard.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Status muda em tempo real.

✅ Dashboard atualiza sozinho.

✅ App acompanha recarga ao vivo.

✅ Usuários recebem apenas seus dados.

---

# Entrega

Informar:

1. Arquivos criados.
2. Eventos disponíveis.
3. Canais configurados.
4. Como testar.
5. Próximo módulo recomendado.