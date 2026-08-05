# PROMPT 78 — FLEET MANAGEMENT MODULE

## Contexto

Você está implementando o módulo de gestão de frotas elétricas da EV Charge Platform.

Este módulo será responsável por atender clientes corporativos com múltiplos veículos e motoristas.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/VEHICLE.md
- docs/CHARGING_SESSION.md

---

# Objetivo

Criar uma plataforma completa para gerenciamento de frotas elétricas corporativas.

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

Recargas

↓

Relatórios

---

# Estrutura Backend

Criar:

```
modules/fleet-management/

fleet.module.ts

fleet.controller.ts

fleet.service.ts

companies/

vehicles/

drivers/

routes/

costs/

analytics/

tests/

```

---

# Gestão empresas

Criar:

Fleet Organization


Campos:

- company_id
- company_name
- industry
- plan

---

# Gestão frota

Criar:

Fleet Entity


Campos:

- id
- company_id
- name
- size
- status

---

# Veículos frota

Criar:

Fleet Vehicle


Controlar:

- Modelo.
- Placa.
- Motorista.
- Status.
- Consumo.

---

# Motoristas

Criar:

Driver Management


Permitir:

- Cadastro motorista.
- Associação veículo.
- Histórico utilização.

---

# Controle recargas

Integrar:

Charging Session Module


Mostrar:

- Quem carregou.
- Qual veículo.
- Quanto consumiu.
- Custo.

---

# Controle custos

Criar:

Fleet Cost Management


Calcular:

- Custo por veículo.
- Custo por km.
- Custo mensal.

---

# Rotas

Criar:

Fleet Route Intelligence


Permitir:

- Planejamento rotas.
- Sugestão carregamento.
- Otimização.

---

# Controle bateria

Integrar:

Vehicle Module


Monitorar:

- Estado bateria.
- Autonomia.
- Necessidade recarga.

---

# Políticas corporativas

Criar:

Fleet Rules Engine


Permitir:

- Limite consumo.
- Horários permitidos.
- Estações autorizadas.

---

# Relatórios empresariais

Criar:

Fleet Analytics


Mostrar:

- Uso veículos.
- Economia.
- Emissões evitadas.
- Performance.

---

# Dashboard frota

Criar:

/fleet/dashboard


Mostrar:

- Veículos ativos.
- Motoristas.
- Consumo.
- Custos.

---

# Banco de Dados

Criar:

## Fleet

Campos:

- id
- company_id
- name


---

## FleetVehicle

Campos:

- fleet_id
- vehicle_id
- driver_id


---

## Driver

Campos:

- id
- company_id
- name

---

# API

Criar:

POST

/fleet


GET

/fleet/:id


POST

/fleet/vehicles


GET

/fleet/reports


---

# Segurança

Garantir:

- Isolamento dados empresa.
- Permissões por equipe.
- Auditoria.

---

# Testes

Validar:

- Criar frota.
- Adicionar veículos.
- Associar motorista.
- Calcular custos.
- Gerar relatório.

---

# Critério conclusão

O módulo está pronto quando:

✅ Empresas conseguem administrar frotas.

✅ Custos de energia são controlados.

✅ Operação corporativa é mensurável.

---

# Entrega

Informar:

1. Gestão frota.
2. Dashboard.
3. Relatórios.
4. APIs.
5. Próximo módulo recomendado.