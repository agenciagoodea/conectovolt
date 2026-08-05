# PROMPT 28 — PRICING, TARIFF & REVENUE MANAGEMENT MODULE

## Contexto

Você está implementando o módulo de gestão de tarifas e receita da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/DATABASE.md
- docs/API.md

---

# Objetivo

Criar um sistema flexível para operadores definirem preços de recarga.

---

# Conceito

Tarifa:

Define quanto o usuário paga.

Receita:

Distribui valores entre:

- Operador.
- Plataforma SaaS.

---

# Estrutura

Criar:

```
modules/pricing/

pricing.module.ts

pricing.controller.ts

pricing.service.ts

tariffs/

rules/

calculators/

tests/

```

---

# Banco de Dados

Criar:

## Tariff

Campos:

- id
- company_id
- station_id
- charger_id
- price_kwh
- active
- created_at


---

# Regras de tarifa

Criar:

TariffRule


Campos:

- id
- tariff_id
- type
- start_time
- end_time
- value

---

# Tipos de preço

Suportar:

## Preço fixo

Exemplo:

R$2,00/kWh


---

## Preço por horário

Exemplo:

18h às 22h:

R$2,50/kWh


---

## Preço por posto

Cada estação pode possuir preço próprio.


---

## Preço por carregador

Carregadores rápidos podem cobrar diferente.

---

# Cálculo

Criar:

PricingEngine


Entrada:

- charger_id
- station_id
- horário
- energia consumida


Saída:

```json
{
"kwh":30,
"price":2.5,
"total":75
}
```

---

# Integração

Conectar com:

Charging Module

Payment Module

Billing Module

---

# Fluxo financeiro

Exemplo:

Recarga:

R$100


Comissão plataforma:

5%


Resultado:

Plataforma:

R$5


Operador:

R$95

---

# Frontend Operador

Criar:

/operator/pricing


Permitir:

- Criar tarifa.
- Editar.
- Ativar/desativar.
- Visualizar histórico.

---

# Tela Configuração

Campos:

- Nome tarifa.
- Valor kWh.
- Posto.
- Carregador.
- Período.
- Status.

---

# Dashboard

Adicionar:

Mostrar:

- Ticket médio.
- Receita por kWh.
- Receita por posto.

---

# Histórico

Guardar:

Mudanças de preço:

- Quem alterou.
- Valor antigo.
- Novo valor.
- Data.

Integrar:

Audit Module.

---

# Segurança

Regras:

Operador altera somente seus preços.

Admin pode visualizar tudo.

---

# Testes

Validar:

- Cálculo correto.
- Tarifa por horário.
- Tarifa por posto.
- Comissão correta.
- Histórico criado.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Operador consegue definir preço.

✅ Sistema calcula automaticamente.

✅ Pagamento recebe valor correto.

✅ Comissão SaaS é aplicada.

---

# Entrega

Informar:

1. Arquivos criados.
2. Regras implementadas.
3. Fórmula de cálculo.
4. Como testar.
5. Próximo módulo recomendado.