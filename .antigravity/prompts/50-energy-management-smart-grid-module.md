# PROMPT 50 — ENERGY MANAGEMENT & SMART GRID MODULE

## Contexto

Você está implementando o módulo de gerenciamento inteligente de energia da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/BUSINESS_MODEL.md
- docs/ANALYTICS.md

---

# Objetivo

Criar um sistema capaz de monitorar, otimizar e controlar o consumo energético da rede de carregadores.

---

# Conceito

Energia disponível

↓

Análise consumo

↓

Otimização

↓

Controle carregamento

---

# Estrutura Backend

Criar:

```
modules/energy-management/

energy.module.ts

energy.controller.ts

energy.service.ts

monitoring/

optimization/

smart-charging/

grid/

tests/

```

---

# Monitoramento energético

Criar:

Energy Monitoring


Coletar:

- Consumo kWh.
- Potência.
- Demanda.
- Horários.
- Custos energia.

---

# Smart Charging

Criar:

Smart Charging Engine


Objetivo:

Carregar veículos no melhor momento.


Considerar:

- Preço energia.
- Demanda rede.
- Necessidade usuário.
- Disponibilidade carregador.

---

# Controle de carga

Permitir:

Reduzir potência.

Aumentar potência.

Agendar carregamento.

---

# Exemplo

Rede sobrecarregada:

↓

Reduz potência carregadores

↓

Evita pico

---

# Peak Management

Criar:

Demand Management


Controlar:

- Pico consumo.
- Limite contratado.
- Custos adicionais.

---

# Integração energia

Preparar:

Utility Integration


Suportar:

- Tarifas energia.
- Dados consumo.
- Previsão demanda.

---

# Dashboard Energia

Criar:

/energy/dashboard


Mostrar:

- Consumo atual.
- Custo energia.
- Economia gerada.
- Status rede.

---

# Inteligência preditiva

Criar:

Energy Forecast


Prever:

- Demanda futura.
- Consumo.
- Custos.

---

# Sustentabilidade

Criar:

Green Metrics


Mostrar:

- CO2 evitado.
- Energia renovável.
- Impacto ambiental.

---

# Preparação V2G

Criar arquitetura futura:

Vehicle To Grid


Permitir futuramente:

Veículo

↓

Bateria

↓

Rede elétrica

---

# Banco de Dados

Criar:

## EnergyRecord

Campos:

- id
- charger_id
- kwh
- power
- cost
- timestamp


---

## EnergySchedule

Campos:

- id
- vehicle_id
- start_time
- target_energy
- priority

---

# API

Criar:

GET

/energy/consumption


GET

/energy/cost


POST

/energy/smart-charge


GET

/energy/forecast

---

# Segurança

Garantir:

- Apenas equipamentos autorizados recebem comandos.
- Logs de controle energético.
- Auditoria.

---

# Testes

Validar:

- Monitoramento consumo.
- Ajuste potência.
- Agendamento.
- Previsão.
- Integração rede.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Energia é monitorada.

✅ Custos podem ser otimizados.

✅ Carregamento inteligente funciona.

---

# Entrega

Informar:

1. Componentes criados.
2. Estratégia energética.
3. APIs.
4. Testes.
5. Próximo módulo recomendado.