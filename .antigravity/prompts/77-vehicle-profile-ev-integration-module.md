# PROMPT 77 — VEHICLE PROFILE & EV INTEGRATION MODULE

## Contexto

Você está implementando o sistema de gerenciamento de veículos elétricos da EV Charge Platform.

Este módulo conecta usuários aos seus veículos e prepara integrações futuras com fabricantes automotivos.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/USER_EXPERIENCE.md
- docs/CHARGING_SESSION.md
- docs/ARCHITECTURE.md

---

# Objetivo

Criar um sistema completo para cadastro, gerenciamento e inteligência dos veículos elétricos dos usuários.

---

# Conceito

Usuário

↓

Veículo elétrico

↓

Dados bateria

↓

Autonomia

↓

Recarga inteligente

---

# Estrutura Backend

Criar:

```
modules/vehicle-management/

vehicle.module.ts

vehicle.controller.ts

vehicle.service.ts

profiles/

battery/

models/

integrations/

telemetry/

tests/

```

---

# Perfil do veículo

Criar:

Vehicle Entity


Campos:

- id
- user_id
- brand
- model
- year
- battery_capacity
- connector_type

---

# Cadastro veículo

Permitir:

- Marca.
- Modelo.
- Ano.
- Capacidade bateria.
- Tipo carregamento.

---

# Base de veículos

Criar:

EV Vehicle Database


Armazenar:

- Modelos elétricos.
- Capacidade bateria.
- Consumo médio.
- Autonomia.

---

# Dados bateria

Criar:

Battery Intelligence


Monitorar:

- Capacidade total.
- Estado carga.
- Autonomia estimada.
- Histórico consumo.

---

# Cálculo autonomia

Criar:

Range Calculator


Considerar:

- Modelo veículo.
- Bateria atual.
- Consumo médio.
- Condições rota.

---

# Integração futura montadoras

Preparar:

Vehicle Connectivity Layer


Suportar:

- APIs fabricantes.
- Dados telemetria.
- Estado bateria.

---

# Telemetria veículo

Preparar:

Vehicle Data Stream


Dados:

- Bateria.
- Quilometragem.
- Localização.
- Status.

---

# Recomendação carregamento

Integrar:

AI Charging Assistant


Sugerir:

- Quando carregar.
- Onde carregar.
- Melhor tarifa.

---

# Banco de Dados

Criar:

## Vehicle

Campos:

- id
- user_id
- brand
- model
- battery_capacity


---

## BatteryStatus

Campos:

- vehicle_id
- percentage
- range
- timestamp


---

## VehicleModel

Campos:

- brand
- model
- efficiency

---

# API

Criar:

POST

/vehicles


GET

/vehicles/:id


GET

/vehicles/:id/range


GET

/vehicles/:id/recommendation

---

# Aplicativo Mobile

Adicionar:

Tela:

Meu veículo


Mostrar:

- Modelo.
- Bateria.
- Autonomia.
- Histórico.

---

# Segurança

Garantir:

- Dados veículo protegidos.
- Controle usuário.
- Consentimento integrações.

---

# Testes

Validar:

- Cadastro veículo.
- Cálculo autonomia.
- Atualização bateria.
- Recomendação.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuário possui veículo cadastrado.

✅ Sistema entende autonomia.

✅ Recargas podem ser personalizadas.

---

# Entrega

Informar:

1. Perfil veículo.
2. Banco criado.
3. Integrações.
4. APIs.
5. Próximo módulo recomendado.