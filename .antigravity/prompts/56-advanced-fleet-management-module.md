# PROMPT 56 — ADVANCED FLEET MANAGEMENT MODULE

## Contexto

Você está implementando o módulo avançado de gestão de frotas elétricas da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/ANALYTICS.md
- docs/API.md

---

# Objetivo

Criar uma solução completa para empresas controlarem veículos elétricos, motoristas, custos e carregamentos.

---

# Conceito

Empresa

↓

Frota

↓

Veículos

↓

Motoristas

↓

Energia

↓

Análise

---

# Estrutura Backend

Criar:

```
modules/fleet-management/

fleet.module.ts

fleet.controller.ts

fleet.service.ts

vehicles/

drivers/

charging-policies/

cost-analysis/

routes/

tests/

```

---

# Gestão de veículos

Criar:

Electric Vehicle Entity


Campos:

- id
- company_id
- model
- battery_capacity
- status
- odometer

---

# Gestão motoristas

Criar:

Driver Entity


Campos:

- id
- fleet_id
- name
- license
- status

---

# Associação

Permitir:

Veículo

↓

Motorista

↓

Empresa

---

# Controle de recargas

Registrar:

- Veículo.
- Motorista.
- Posto.
- Energia.
- Valor.
- Tempo.

---

# Políticas de carregamento

Criar:

Charging Policy


Exemplos:

- Carregar apenas horário econômico.
- Limitar custo.
- Priorizar determinados veículos.

---

# Gestão custos

Criar:

Fleet Cost Analytics


Mostrar:

- Custo por veículo.
- Custo por motorista.
- Custo mensal.
- Comparativo combustão x elétrico.

---

# Dashboard frota

Criar:

/fleet/dashboard


Mostrar:

- Veículos ativos.
- Consumo.
- Gastos.
- Economia.
- Status bateria.

---

# Relatórios corporativos

Criar:

Fleet Reports


Relatórios:

- Uso energético.
- Quilometragem.
- Custos.
- Emissões evitadas.

---

# Planejamento inteligente

Criar:

Fleet Optimization Engine


Analisar:

- Necessidade carregamento.
- Disponibilidade veículos.
- Rotas.

---

# Alertas

Criar:

Fleet Alerts


Exemplos:

- Veículo sem recarga.
- Custo acima média.
- Uso anormal.

---

# Integrações

Preparar:

- Sistemas telemáticos.
- Gestão frota.
- Fabricantes veículos.

---

# Banco de Dados

Criar:

## Vehicle

Campos:

- id
- fleet_id
- model
- battery_capacity


---

## Driver

Campos:

- id
- fleet_id
- name


---

## FleetChargingSession

Campos:

- vehicle_id
- driver_id
- charger_id
- energy
- cost

---

# API

Criar:

GET

/fleet/vehicles


POST

/fleet/vehicle


GET

/fleet/costs


GET

/fleet/reports

---

# Segurança

Garantir:

Empresa acessa apenas sua frota.

Motorista acessa apenas seus dados.

---

# Testes

Validar:

- Criar frota.
- Adicionar veículos.
- Associar motorista.
- Registrar recarga.
- Gerar relatório.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Empresas controlam frotas elétricas.

✅ Custos são mensurados.

✅ Carregamento pode ser otimizado.

---

# Entrega

Informar:

1. Recursos criados.
2. Dashboards.
3. APIs.
4. Relatórios.
5. Próximo módulo recomendado.