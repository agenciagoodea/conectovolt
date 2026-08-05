# PRISMA SCHEMA PLAN

Projeto: ConectoVolt

Versão: MVP 1.0

Banco:

PostgreSQL

ORM:

Prisma

---

# Objetivo

Definir o planejamento do schema Prisma antes da implementação do banco.

Este documento será utilizado para gerar:

- schema.prisma
- migrations
- relacionamentos
- enums

---

# Estratégia

O banco será dividido em módulos:

1. Usuários
2. Empresas
3. Postos
4. Carregadores
5. Recargas
6. Pagamentos
7. Comissão
8. Carteira Financeira

---

# MODELS PRINCIPAIS

---

# User

Representa todos os usuários.

Tipos:

- SUPER_ADMIN
- OPERATOR
- CUSTOMER

Campos principais:

id

name

email

phone

password_hash

role

company_id

created_at

updated_at


Relacionamentos:

User pertence a Company

User possui Vehicles

User possui ChargingSessions

---

# Company

Representa o operador do posto.

Campos:

id

name

document

email

phone

status

created_at

updated_at


Relacionamentos:

Company possui:

Users

Stations

Wallet

Commissions

---

# Station

Representa o local físico de recarga.

Campos:

id

company_id

name

description

address

city

state

latitude

longitude

status


Relacionamentos:

Station possui Chargers

---

# Charger

Representa o equipamento.

Campos:

id

station_id

serial_number

manufacturer

model

power_kw

ocpp_id

status


Relacionamentos:

Charger possui Connectors

---

# Connector

Representa a porta de carregamento.

Campos:

id

charger_id

type

power_kw

status


Exemplos:

TYPE2

CCS

CHADEMO

---

# Vehicle

Veículo do cliente.

Campos:

id

user_id

brand

model

plate

battery_capacity


Relacionamento:

Vehicle pertence a User

---

# ChargingSession

Representa uma recarga.

Campos:

id

user_id

vehicle_id

station_id

charger_id

connector_id

started_at

finished_at

energy_kwh

amount

status


Status:

PENDING

ACTIVE

COMPLETED

CANCELLED


---

# Payment

Representa pagamento.

Campos:

id

session_id

gateway

external_id

amount

status

paid_at


Status:

PENDING

APPROVED

FAILED

REFUNDED


---

# Commission

Representa receita da plataforma.

Campos:

id

payment_id

company_id

percentage

platform_amount

operator_amount


---

# Wallet

Carteira do operador.

Campos:

id

company_id

balance


---

# Transaction

Movimentações financeiras.

Campos:

id

wallet_id

type

amount

description


Tipos:

CREDIT

DEBIT

WITHDRAWAL

COMMISSION

---

# ENUMS

---

## UserRole

SUPER_ADMIN

OPERATOR

CUSTOMER


---

## CompanyStatus

ACTIVE

INACTIVE

PENDING


---

## StationStatus

ACTIVE

INACTIVE

MAINTENANCE


---

## ChargerStatus

ONLINE

OFFLINE

ERROR


---

## ChargingStatus

PENDING

ACTIVE

COMPLETED

CANCELLED


---

## PaymentStatus

PENDING

APPROVED

FAILED

REFUNDED


---

# RELACIONAMENTOS

Company

1:N

Users


Company

1:N

Stations


Station

1:N

Chargers


Charger

1:N

Connectors


User

1:N

Vehicles


User

1:N

ChargingSessions


ChargingSession

1:1

Payment


Payment

1:1

Commission


Company

1:1

Wallet


Wallet

1:N

Transactions


---

# REGRAS IMPORTANTES

1.

Toda empresa possui seus próprios dados.


2.

Operadores nunca acessam dados de outra empresa.


3.

Toda recarga precisa estar vinculada a um carregador.


4.

Todo pagamento gera uma comissão.


5.

Toda comissão gera registro financeiro.


6.

Valores monetários devem usar Decimal.


7.

Energia deve utilizar Decimal.


---

# Índices

Criar índices para:

User.email

Company.document

Charger.serial_number

Charger.ocpp_id

ChargingSession.status

Payment.external_id


---

# Próxima etapa

Gerar:

schema.prisma

com:

- Models
- Enums
- Relations
- Indexes
- Constraints