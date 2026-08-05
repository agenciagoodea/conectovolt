# PROMPT 11 — DASHBOARD MODULE

## Contexto

Você está implementando o módulo de dashboards da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/API.md
- docs/UX_FLOW.md
- docs/DATABASE.md

---

# Objetivo

Criar os indicadores estratégicos da plataforma.

O dashboard deve apresentar informações agregadas sem alterar dados.

---

# Conceito

Existem dois dashboards:

1. Dashboard Plataforma (Admin)

2. Dashboard Operador

---

# Estrutura do módulo

Criar:

```
modules/dashboard/

dashboard.controller.ts

dashboard.service.ts

dashboard.module.ts

queries/

dto/

tests/

```

---

# DASHBOARD ADMIN

Endpoint:

GET

/dashboard/admin


Permissão:

SUPER_ADMIN


---

# Indicadores

Retornar:

## Usuários

- Total usuários.
- Clientes ativos.


## Empresas

- Total operadores.
- Empresas ativas.
- Empresas pendentes.


## Postos

- Total postos.
- Postos ativos.


## Carregadores

- Total equipamentos.
- Online.
- Offline.


## Recargas

- Total sessões.
- Sessões concluídas.
- Energia vendida.


## Financeiro

- Receita total.
- Comissão plataforma.
- Volume movimentado.

---

# Exemplo de resposta

```json
{
"companies":120,
"stations":350,
"chargers_online":500,
"charging_sessions":25000,
"revenue":150000,
"commission":7500
}
```

---

# DASHBOARD OPERADOR

Endpoint:

GET

/dashboard/operator


Permissão:

OPERATOR


---

# Indicadores

Retornar:

## Operação

- Número de postos.
- Número de carregadores.
- Status equipamentos.


## Recarga

- Sessões realizadas.
- Energia vendida.
- Clientes atendidos.


## Financeiro

- Receita bruta.
- Comissão plataforma.
- Receita líquida.
- Saldo carteira.


---

# Filtros

Permitir:

- Hoje.
- Últimos 7 dias.
- Últimos 30 dias.
- Personalizado.

---

# Regras

Dashboard somente consulta.

Nunca realizar alteração de dados.

---

# Performance

Evitar consultas pesadas.

Preparar arquitetura para:

- Cache Redis.
- Views agregadas.
- Relatórios futuros.

---

# Segurança

Obrigatório:

SUPER_ADMIN:

Visualiza toda plataforma.


OPERATOR:

Visualiza somente seus dados.


CUSTOMER:

Sem acesso.

---

# Swagger

Documentar:

GET /dashboard/admin

GET /dashboard/operator

---

# Testes

Criar testes:

- Admin vê todos indicadores.
- Operador vê apenas seus dados.
- Cliente bloqueado.
- Valores financeiros corretos.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Administrador acompanha negócio.

✅ Operador acompanha operação.

✅ Dados respeitam permissões.

---

# Entrega

Informar:

1. Arquivos criados.
2. Consultas implementadas.
3. Endpoints disponíveis.
4. Como testar.
5. Próximo módulo recomendado.