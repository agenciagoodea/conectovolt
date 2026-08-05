# PROMPT 10 — WALLET MODULE

## Contexto

Você está implementando o módulo financeiro de carteira da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/DATABASE.md
- docs/API.md
- docs/PRISMA_SCHEMA_PLAN.md

---

# Objetivo

Criar a carteira financeira dos operadores.

A carteira representa o saldo acumulado que uma empresa possui dentro da plataforma.

---

# Conceito

Fluxo:

Pagamento aprovado

↓

Comissão criada

↓

Valor operador

↓

Wallet

↓

Saldo disponível

↓

Saque

---

# Banco de Dados

Criar model Wallet.

Campos:

- id
- company_id
- balance
- created_at
- updated_at

---

# Criar model Transaction

Representa todas as movimentações financeiras.

Campos:

- id
- wallet_id
- type
- amount
- description
- reference_id
- created_at

---

# Enum TransactionType

Criar:

- CREDIT
- DEBIT
- WITHDRAWAL
- COMMISSION

---

# Estrutura do módulo

Criar:

```
modules/wallet/

wallet.controller.ts

wallet.service.ts

wallet.module.ts

repository/

dto/

events/

tests/

```

---

# Funcionalidades

## Consultar saldo

Endpoint:

GET

/wallet


Retornar:

```json
{
"balance":1500.50
}
```

---

# Histórico financeiro

Endpoint:

GET

/wallet/transactions


Filtros:

- período
- tipo
- empresa


Retornar:

- data
- valor
- tipo
- descrição

---

# Adicionar crédito

Uso interno.

Endpoint:

POST

/wallet/credit


Somente sistema.


Usado quando:

Commission é criada.


Criar Transaction:

type:

CREDIT


---

# Solicitar saque

Endpoint:

POST

/wallet/withdraw


Request:

```json
{
"amount":500
}
```


Regras:

- Saldo suficiente.
- Valor positivo.
- Empresa autenticada.


Criar:

Transaction:

WITHDRAWAL


Alterar saldo.


---

# Regras financeiras

Obrigatório:

- Usar Decimal.
- Nunca permitir saldo negativo.
- Nunca apagar transações.
- Toda alteração gera histórico.

---

# Segurança

SUPER_ADMIN:

Pode visualizar todas as carteiras.


OPERATOR:

Visualiza somente sua carteira.


CUSTOMER:

Sem acesso.

---

# Integração com Comissão

Quando:

Commission criada


Executar:

1. Buscar Wallet da empresa.

2. Criar crédito.

3. Atualizar saldo.

4. Registrar Transaction.

---

# Preparação futura

Arquitetura deve permitir:

- Transferência bancária.
- PIX automático.
- Split payment.
- Gateway financeiro.

---

# Swagger

Documentar:

GET /wallet

GET /wallet/transactions

POST /wallet/withdraw

---

# Testes

Criar testes:

- Criar carteira.
- Adicionar crédito.
- Consultar saldo.
- Solicitar saque.
- Bloquear saque acima do saldo.
- Histórico correto.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Operador visualiza saldo.

✅ Comissão aumenta saldo.

✅ Saque reduz saldo.

✅ Histórico financeiro existe.

---

# Entrega

Informar:

1. Arquivos criados.
2. Migration gerada.
3. Regras financeiras implementadas.
4. Como testar.
5. Próximo módulo recomendado.