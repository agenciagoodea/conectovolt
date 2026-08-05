# PROMPT 32 — FLEET MANAGEMENT MODULE

## Contexto

Você está implementando o módulo de gestão de frotas elétricas da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/API.md
- docs/DATABASE.md

---

# Objetivo

Criar uma solução para empresas controlarem veículos elétricos, motoristas e consumo de energia.

---

# Conceito

Empresa frota

↓

Veículos

↓

Motoristas

↓

Recargas

↓

Custos

↓

Relatórios

---

# Estrutura Backend

Criar:

```
modules/fleet/

fleet.module.ts

fleet.controller.ts

fleet.service.ts

vehicles/

drivers/

rules/

reports/

tests/

```

---

# Banco de Dados

Criar:

## Fleet

Campos:

- id
- company_id
- name
- created_at

---

## FleetVehicle

Campos:

- id
- fleet_id
- vehicle_id
- identifier
- status

---

## FleetDriver

Campos:

- id
- fleet_id
- user_id
- role

---

# Gestão de veículos

Permitir:

- Cadastrar veículo.
- Associar à frota.
- Visualizar histórico.

---

# Informações veículo

Mostrar:

- Modelo.
- Placa.
- Quilometragem.
- Consumo.
- Última recarga.

---

# Motoristas

Permitir:

- Adicionar motorista.
- Associar veículos.
- Definir permissões.

---

# Regras de uso

Criar:

FleetPolicy


Permitir:

Limites:

- Valor mensal.
- kWh mensal.
- Horários permitidos.
- Postos permitidos.

---

# Controle financeiro

Mostrar:

Por frota:

- Gastos.
- Consumo.
- Custo médio.
- Comparativo período.

---

# Dashboard Frota

Criar:

/fleet/dashboard


Cards:

- Veículos ativos.
- Motoristas.
- Consumo total.
- Custo total.


Gráficos:

- Consumo por veículo.
- Gastos por período.
- Ranking motoristas.

---

# Relatórios

Criar:

## Relatório consumo

Mostrar:

- Veículo.
- Motorista.
- Energia.
- Valor.


## Relatório custos

Mostrar:

- Total.
- Média.
- Comparação.

---

# Alertas

Integrar:

Notification Module


Enviar:

- Veículo excedeu limite.
- Consumo anormal.
- Recarga fora horário.

---

# API

Criar:

GET

/fleet


GET

/fleet/vehicles


GET

/fleet/drivers


GET

/fleet/reports


POST

/fleet/policies

---

# Frontend

Criar:

/fleet/dashboard


Telas:

- Veículos.
- Motoristas.
- Regras.
- Relatórios.

---

# Mobile

Preparar:

Perfil motorista corporativo.

Mostrar:

- Veículo atribuído.
- Histórico.
- Permissões.

---

# Segurança

Empresa só acessa sua própria frota.

Administrador visualiza tudo.

---

# Testes

Validar:

- Criar frota.
- Adicionar veículo.
- Associar motorista.
- Aplicar limite.
- Gerar relatório.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Empresas controlam suas frotas.

✅ Custos ficam transparentes.

✅ Recargas são rastreáveis.

---

# Entrega

Informar:

1. Arquivos criados.
2. Funcionalidades.
3. APIs.
4. Como testar.
5. Próximo módulo recomendado.