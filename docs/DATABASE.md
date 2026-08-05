# DATABASE - EV CHARGE PLATFORM

Versão: MVP 1.0

Banco:
PostgreSQL

ORM:
Prisma

---

# Objetivo

Definir a estrutura inicial do banco de dados da plataforma EV Charge.

O banco deve suportar:

- Operadores de postos
- Motoristas
- Carregadores
- Sessões de recarga
- Pagamentos
- Comissão da plataforma

---

# Padrões

## IDs

Todas as tabelas utilizam UUID.

---

## Datas

Todas as tabelas possuem:

created_at

updated_at

---

## Exclusão

Utilizar soft delete quando necessário:

deleted_at

---

# MODELO MULTIEMPRESA

A plataforma possui:

Super Admin

↓

Empresa Operadora

↓

Postos

↓

Carregadores

---

# ENTIDADES MVP

---

# 1. USERS

Usuários do sistema.

Tipos:

- Super Admin
- Operador
- Cliente

Tabela:

users


Campos:

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

User possui Charging Sessions

---

# 2. COMPANIES

Empresas operadoras dos postos.

Tabela:

companies


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

---

# 3. STATIONS

Postos de carregamento.


Tabela:

stations


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

created_at

updated_at


Status:

ACTIVE

INACTIVE

MAINTENANCE


Relacionamentos:

Station possui Chargers

---

# 4. CHARGERS

Equipamentos físicos.


Tabela:

chargers


Campos:

id

station_id

serial_number

model

manufacturer

power_kw

status

ocpp_id

created_at

updated_at


Status:

ONLINE

OFFLINE

ERROR


Relacionamentos:

Charger possui Connectors

---

# 5. CONNECTORS

Pontos de conexão.


Tabela:

connectors


Campos:

id

charger_id

connector_type

max_power

status


Exemplo:

TYPE2

CCS

CHADEMO


---

# 6. VEHICLES

Veículos dos clientes.


Tabela:

vehicles


Campos:

id

user_id

brand

model

plate

battery_capacity


Relacionamentos:

Vehicle pertence a User

---

# 7. CHARGING_SESSIONS

Registro da recarga.


Tabela:

charging_sessions


Campos:

id

user_id

vehicle_id

station_id

charger_id

connector_id

start_time

end_time

energy_consumed

total_amount

status


Status:

PENDING

CHARGING

FINISHED

CANCELLED


---

# 8. PAYMENTS

Pagamentos realizados.


Tabela:

payments


Campos:

id

session_id

user_id

gateway

transaction_id

amount

status

paid_at


Status:

PENDING

APPROVED

FAILED

REFUNDED


---

# 9. COMMISSIONS

Comissão da plataforma.


Tabela:

commissions


Campos:

id

payment_id

company_id

percentage

platform_amount

company_amount

created_at


Exemplo:

Recarga:
100 reais

Comissão:
5%

Plataforma:
5 reais

Empresa:
95 reais


---

# 10. WALLETS

Carteira financeira.


Tabela:

wallets


Campos:

id

company_id

balance

created_at

updated_at


---

# 11. TRANSACTIONS

Movimentações financeiras.


Tabela:

transactions


Campos:

id

wallet_id

type

amount

description

created_at


Tipos:

CREDIT

DEBIT

WITHDRAWAL

COMMISSION


---

# RELACIONAMENTOS PRINCIPAIS


Company

|

|-- Users

|

|-- Stations

        |

        |-- Chargers

                |

                |-- Connectors



User

|

|-- Vehicles

|

|-- Charging Sessions



Charging Session

|

|-- Payment

        |

        |-- Commission



Company

|

|-- Wallet

        |

        |-- Transactions


---

# ÍNDICES IMPORTANTES


users.email

companies.document

chargers.serial_number

chargers.ocpp_id

stations.company_id

charging_sessions.user_id

charging_sessions.status

payments.transaction_id


---

# REGRAS DE NEGÓCIO


1. Toda recarga pertence a um usuário.

2. Toda recarga acontece em um carregador.

3. Todo pagamento gera uma comissão.

4. Toda comissão gera movimentação financeira.

5. O operador nunca recebe o valor integral.

6. A plataforma sempre registra sua porcentagem.


---

# FUTURO

Não implementar agora:

- Faturamento fiscal
- Assinaturas
- Cashback
- Split avançado
- Multi-moeda
- OCPP 2.0.1 completo
