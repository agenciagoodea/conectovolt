# PROMPT 108 — CHARGING HARDWARE INTEGRATION & DEVICE MANAGEMENT MODULE

## Contexto

Você está criando a camada de integração entre a EV Charge Platform e os equipamentos físicos de carregamento elétrico.

O objetivo é permitir comunicação, monitoramento, controle remoto e gestão inteligente de carregadores de diferentes fabricantes.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/OPERATIONS.md
- docs/DEVOPS.md
- docs/SECURITY.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar uma plataforma capaz de conectar, gerenciar e operar infraestrutura física de carregamento elétrico.

---

# Conceito

Carregador físico

↓

Comunicação

↓

Plataforma EV Charge

↓

Dados

↓

Controle operacional

↓

Experiência usuário

---

# Estrutura Backend

Criar:

```
modules/charging-infrastructure/

device-management/

hardware-connectors/

protocols/

telemetry/

remote-control/

firmware/

maintenance/

monitoring/

tests/

```

---

# Gestão dispositivos

Criar:

Charging Device Management System


Controlar:

- Carregadores.
- Estações.
- Localizações.
- Fabricantes.
- Modelos.

---

# Cadastro equipamento

Criar:

Device Registry


Registrar:

- ID dispositivo.
- Fabricante.
- Modelo.
- Capacidade.
- Localização.
- Status.

---

# Integração protocolos

Criar:

Hardware Communication Layer


Suportar:

- Comunicação padrão carregadores.
- Troca dados bidirecional.
- Status equipamento.
- Eventos.

---

# Conectores fabricantes

Criar:

Hardware Connector Framework


Permitir:

- Integração múltiplos fabricantes.
- Adição novos modelos.
- Padronização comunicação.

---

# Telemetria

Criar:

Real-Time Telemetry System


Coletar:

- Estado carregador.
- Energia entregue.
- Temperatura.
- Erros.
- Disponibilidade.
- Sessões.

---

# Monitoramento tempo real

Criar:

Charging Operations Monitor


Mostrar:

- Online/offline.
- Em uso.
- Disponível.
- Falha.
- Manutenção.

---

# Controle remoto

Criar:

Remote Device Control


Permitir:

- Iniciar carregamento.
- Encerrar sessão.
- Reiniciar equipamento.
- Atualizar configurações.

---

# Gestão energia

Criar:

Energy Management Layer


Controlar:

- Consumo.
- Demanda.
- Horários pico.
- Eficiência energética.

---

# Firmware Management

Criar:

Firmware Update System


Controlar:

- Versões.
- Atualizações.
- Histórico.
- Rollback.

---

# Manutenção preventiva

Criar:

Predictive Maintenance System


Analisar:

- Falhas recorrentes.
- Desgaste equipamento.
- Performance.
- Necessidade manutenção.

---

# Gestão disponibilidade

Criar:

Charging Availability Engine


Calcular:

- Tempo online.
- Tempo indisponível.
- Taxa utilização.

---

# Alertas equipamentos

Criar:

Hardware Alert System


Detectar:

- Falhas.
- Queda comunicação.
- Sobreaquecimento.
- Erros críticos.

---

# Integração operadores

Permitir:

Operadores visualizarem:

- Frota carregadores.
- Receita.
- Performance.
- Problemas.

---

# Integração aplicativo usuário

Disponibilizar:

Dados:

- Estação disponível.
- Tipo carregador.
- Potência.
- Status em tempo real.

---

# Segurança dispositivos

Criar:

Device Security Layer


Garantir:

- Autenticação equipamento.
- Comunicação segura.
- Controle comandos.
- Registro eventos.

---

# Banco de Dados

Criar:

## ChargingDevice

Campos:

- manufacturer
- model
- serial_number
- location
- status


---

## TelemetryEvent

Campos:

- device_id
- metric
- value
- timestamp


---

## MaintenanceRecord

Campos:

- device_id
- issue
- resolution
- date

---

# API

Criar:

GET

/devices


POST

/devices/register


GET

/devices/status


GET

/devices/telemetry


POST

/devices/control


GET

/devices/maintenance

---

# Dashboard operador

Criar:

Charging Infrastructure Command Center


Mostrar:

- Carregadores ativos.
- Falhas.
- Energia.
- Receita.
- Utilização.

---

# Dashboard manutenção

Criar:

Maintenance Control Center


Mostrar:

- Equipamentos críticos.
- Histórico falhas.
- Próximas manutenções.

---

# Escalabilidade

Preparar:

- Milhares de dispositivos.
- Diferentes fabricantes.
- Diferentes regiões.
- Crescimento internacional.

---

# Testes

Validar:

- Registro equipamento.
- Comunicação dispositivo.
- Recebimento telemetria.
- Controle remoto.
- Atualização firmware.
- Tratamento falhas.

---

# Critério conclusão

O módulo está pronto quando:

✅ Carregadores conseguem se conectar à plataforma.

✅ Operadores conseguem gerenciar equipamentos.

✅ Usuários recebem informações em tempo real.

✅ Falhas podem ser detectadas e tratadas.

---

# Entrega

Informar:

1. Arquitetura integração hardware.
2. Protocolos suportados.
3. Gestão dispositivos.
4. Monitoramento.
5. Próximas integrações recomendadas.