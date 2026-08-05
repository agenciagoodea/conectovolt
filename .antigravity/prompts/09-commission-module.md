# PROMPT 09 — COMMISSION MODULE

## Contexto

Você está implementando o módulo de comissão da EV Charge Platform.

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

Criar o sistema responsável por calcular e registrar a comissão da plataforma sobre cada recarga paga.

---

# Conceito

Fluxo financeiro:

Payment aprovado

↓

Commission criada

↓

Valor dividido:

- Plataforma
- Operador

↓

Carteira atualizada

---

# Regra MVP

A comissão será baseada em percentual.

Exemplo:

Valor da recarga:

R$ 100,00


Comissão plataforma:

5%


Resultado:

Plataforma:

R$ 5,00


Operador:

R$ 95,00

---

# Banco de Dados

Criar model Commission.

Campos:

- id
- payment_id
- company_id
- percentage
- gross_amount
- platform_amount
- operator_amount
- created_at

---

# Estrutura do módulo

Criar:

```
modules/commissions/

commissions.controller.ts

commissions.service.ts

commissions.module.ts

repository/

dto/

events/

tests/

```

---

# Criação automática

A comissão deve ser criada automaticamente quando:

PaymentStatus = APPROVED


Evento:

PaymentApproved


Processo:

1. Receber pagamento aprovado.

2. Buscar empresa responsável pelo posto.

3. Aplicar percentual.

4. Criar Commission.

5. Atualizar carteira do operador.

---

# Configuração de percentual

Criar estrutura preparada para:

## Global

Percentual padrão da plataforma.


## Empresa

Percentual personalizado.


Prioridade:

Empresa > Global

---

# Endpoints

## Consultar comissão

GET

/commissions


Filtros:

- empresa
- período
- status


---

## Buscar detalhes

GET

/commissions/:id


Retornar:

- pagamento relacionado.
- valor bruto.
- percentual.
- valor plataforma.
- valor operador.

---

# Regras de segurança

Obrigatório:

SUPER_ADMIN:

Visualiza todas.


OPERATOR:

Visualiza somente suas comissões.


CUSTOMER:

Não possui acesso.

---

# Precisão financeira

Obrigatório:

Usar Decimal.

Nunca usar float.

---

# Logs

Registrar:

- Pagamento origem.
- Percentual aplicado.
- Valores calculados.
- Data.

---

# Testes

Criar testes:

- Comissão criada após pagamento.
- Cálculo correto.
- Percentual personalizado.
- Bloqueio entre empresas.
- Valores decimais.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Pagamento aprovado gera comissão.

✅ Plataforma recebe percentual correto.

✅ Operador recebe valor líquido.

✅ Histórico financeiro existe.

---

# Entrega

Informar:

1. Arquivos criados.
2. Migration gerada.
3. Regras implementadas.
4. Como testar.
5. Próximo módulo recomendado.
```

---

## Estado atual do SaaS

Agora temos o fluxo completo de monetização:

```text
Usuário
 ↓
Veículo
 ↓
Posto
 ↓
Carregador
 ↓
Recarga
 ↓
Pagamento
 ↓
Comissão
 ↓
Receita Plataforma
```

O produto já tem o **motor financeiro**.

---

# Próximo passo

Agora vamos criar:

## PASSO 20 — WALLET MODULE

A carteira vai controlar:

- saldo do operador;
- créditos;
- débitos;
- saques;
- histórico financeiro.

Depois disso teremos praticamente todo o núcleo do MVP pronto e partiremos para:

- Dashboard administrativo;
- Dashboard operador;
- Aplicativo mobile;
- Integração OCPP.