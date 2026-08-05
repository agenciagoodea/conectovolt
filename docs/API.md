# API DOCUMENTATION

Projeto: EV Charge Platform

Versão: MVP 1.0

Base URL:

/api/v1

Tecnologia:

REST API

Backend:

NestJS

Formato:

JSON

---

# PADRÃO DE RESPOSTA

Sucesso:

```json
{
  "success": true,
  "data": {}
}
```

Erro:

```json
{
  "success": false,
  "message": "Mensagem de erro"
}
```

---

# AUTENTICAÇÃO

Método:

JWT Bearer Token


Header:

Authorization:

Bearer TOKEN


---

# MÓDULO AUTH

## Cadastro

POST

/auth/register


Request:

```json
{
"name":"João",
"email":"joao@email.com",
"password":"123456"
}
```


Response:

```json
{
"user":{
"id":"uuid",
"name":"João"
}
}
```

---

## Login

POST

/auth/login


Request:

```json
{
"email":"usuario@email.com",
"password":"senha"
}
```


Response:

```json
{
"access_token":"token",
"refresh_token":"token"
}
```

---

## Atualizar Token

POST

/auth/refresh


---

# MÓDULO USUÁRIOS

## Listar usuários

GET

/users


## Buscar usuário

GET

/users/:id


## Atualizar usuário

PATCH

/users/:id


## Remover usuário

DELETE

/users/:id


---

# MÓDULO EMPRESAS


## Criar empresa

POST

/companies


Request:

```json
{
"name":"Empresa XYZ",
"document":"000000000"
}
```


---

## Listar empresas

GET

/companies


---

## Buscar empresa

GET

/companies/:id


---

# MÓDULO POSTOS


## Criar posto

POST

/stations


Request:

```json
{
"name":"Posto Centro",
"address":"Rua A",
"latitude":-3.1,
"longitude":-60.1
}
```


---

## Listar postos

GET

/stations


Filtros:

status

city

company_id


---

## Buscar posto

GET

/stations/:id


---

# MÓDULO CARREGADORES


## Criar carregador

POST

/chargers


Request:

```json
{
"station_id":"uuid",
"serial_number":"ABC123",
"power_kw":60
}
```


---

## Status do carregador


PATCH

/chargers/:id/status


Request:

```json
{
"status":"ONLINE"
}
```

---

## Listar carregadores

GET

/chargers


---

# MÓDULO VEÍCULOS


## Criar veículo


POST

/vehicles


Request:

```json
{
"brand":"Tesla",
"model":"Model 3",
"plate":"ABC1234"
}
```


---

## Listar veículos

GET

/vehicles


---

# MÓDULO RECARGA


## Iniciar recarga


POST

/charging/start


Request:

```json
{
"charger_id":"uuid",
"connector_id":"uuid",
"vehicle_id":"uuid"
}
```


Response:

```json
{
"session_id":"uuid",
"status":"CHARGING"
}
```


---

## Finalizar recarga


POST

/charging/:id/stop


Response:

```json
{
"energy":32.5,
"amount":65
}
```


---

## Histórico


GET

/charging/history


---

# MÓDULO PAGAMENTO


## Criar pagamento


POST

/payments


Request:

```json
{
"session_id":"uuid",
"method":"PIX"
}
```


---

## Consultar pagamento


GET

/payments/:id


---

# MÓDULO COMISSÃO


## Consultar comissão


GET

/commissions


Retorno:

```json
{
"gross_amount":100,
"platform_fee":5,
"operator_amount":95
}
```

---

# MÓDULO CARTEIRA


## Consultar saldo


GET

/wallet


Response:

```json
{
"balance":1500
}
```

---

## Solicitar saque


POST

/wallet/withdraw


Request:

```json
{
"amount":500
}
```

---

# DASHBOARD


## Resumo operador


GET

/dashboard/operator


Retorno:

```json
{
"revenue":5000,
"sessions":120,
"energy":3500
}
```

---

## Resumo plataforma


GET

/dashboard/admin


Retorno:

```json
{
"total_revenue":50000,
"commission":2500,
"operators":30
}
```

---

# WEBHOOKS


## Gateway pagamento


POST

/webhooks/payment


Recebe:

- Status pagamento
- Transaction ID
- Valor

---

# OCPP


Endpoint futuro:


/ocpp


Funções:

- BootNotification
- Heartbeat
- StatusNotification
- StartTransaction
- StopTransaction


---

# REGRAS DA API


Todas as rotas privadas exigem JWT.


Todos os dados devem respeitar o usuário autenticado.


Operador só visualiza seus próprios dados.


Super Admin visualiza tudo.


Toda alteração importante gera log.


Todas as respostas devem possuir tratamento de erro.


---

# DOCUMENTAÇÃO

Swagger obrigatório:

/api/docs
