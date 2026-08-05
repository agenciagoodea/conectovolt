# PROMPT 57 — AUTOMOTIVE MANUFACTURER INTEGRATION MODULE

## Contexto

Você está implementando o módulo de integração com fabricantes automotivos da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/INTEGRATIONS.md
- docs/SECURITY.md

---

# Objetivo

Criar uma camada de integração para conectar veículos elétricos, sistemas embarcados e aplicativos de montadoras.

---

# Conceito

Veículo conectado

↓

API automotiva

↓

EV Charge Platform

↓

Serviços de mobilidade

---

# Estrutura Backend

Criar:

```
modules/automotive/

automotive.module.ts

automotive.controller.ts

automotive.service.ts

vehicles/

manufacturers/

telemetry/

connectivity/

tests/

```

---

# Cadastro fabricantes

Criar:

Manufacturer Entity


Campos:

- id
- name
- country
- status

---

# Integração veículo

Criar:

Connected Vehicle


Campos:

- id
- manufacturer_id
- model
- vin
- battery_status

---

# Dados telemétricos

Receber:

- Estado bateria.
- Autonomia.
- Localização.
- Quilometragem.
- Consumo.

---

# Experiência motorista

Permitir:

Dentro do veículo:

- Buscar carregadores.
- Navegar até posto.
- Iniciar recarga.
- Consultar histórico.

---

# API montadora

Criar:

Vehicle API


Endpoints:

GET

/vehicle/status


GET

/vehicle/charging


POST

/vehicle/start-charge

---

# Autorização veículo

Criar:

Vehicle Authentication


Suportar:

- Certificados.
- Tokens.
- Identidade veículo.

---

# Smart Charging

Integrar:

Energy Management Module


Permitir:

Veículo informar:

- Horário saída.
- Energia necessária.

Sistema otimiza carga.

---

# Serviços premium

Preparar:

Ofertas:

- Plano carregamento.
- Assinatura energia.
- Benefícios.

---

# Dados bateria

Criar:

Battery Analytics


Analisar:

- Saúde bateria.
- Degradação.
- Uso.

---

# Segurança

Implementar:

- Comunicação criptografada.
- Validação fabricante.
- Controle consentimento.

---

# Banco de Dados

Criar:

## Manufacturer

Campos:

- id
- name
- api_config


---

## ConnectedVehicle

Campos:

- id
- manufacturer_id
- vin
- user_id


---

## VehicleTelemetry

Campos:

- vehicle_id
- battery
- location
- timestamp

---

# Dashboard Admin

Criar:

/automotive/dashboard


Mostrar:

- Fabricantes conectados.
- Veículos ativos.
- Dados recebidos.

---

# Testes

Validar:

- Cadastro fabricante.
- Conectar veículo.
- Receber telemetria.
- Autorizar recarga.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Veículos conseguem interagir com a plataforma.

✅ Montadoras podem integrar seus sistemas.

✅ Usuário possui experiência conectada.

---

# Entrega

Informar:

1. Integrações criadas.
2. APIs automotivas.
3. Segurança.
4. Testes.
5. Próximo módulo recomendado.