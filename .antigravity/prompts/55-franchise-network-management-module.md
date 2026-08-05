# PROMPT 55 — FRANCHISE & NETWORK MANAGEMENT MODULE

## Contexto

Você está implementando o módulo de gestão de redes, franquias e grupos empresariais da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/BUSINESS_MODEL.md
- docs/MULTI_TENANT.md

---

# Objetivo

Criar uma estrutura para administrar grandes redes de carregamento com múltiplas unidades.

---

# Conceito

Grupo

↓

Franquias

↓

Unidades

↓

Postos

↓

Carregadores

---

# Estrutura Backend

Criar:

```
modules/network-management/

network.module.ts

network.controller.ts

network.service.ts

franchises/

locations/

hierarchy/

royalties/

tests/

```

---

# Estrutura organizacional

Criar hierarquia:

```
NETWORK_OWNER

↓

FRANCHISE_GROUP

↓

FRANCHISE_UNIT

↓

STATION_OPERATOR

↓

CHARGER
```

---

# Gestão de franquias

Criar:

Franchise Entity


Campos:

- id
- name
- owner_id
- status
- created_at

---

# Unidades

Criar:

Franchise Location


Campos:

- id
- franchise_id
- address
- station_count
- status

---

# Administração central

Permitir:

Controlar:

- Todas unidades.
- Relatórios consolidados.
- Padrões operação.

---

# Administração local

Permitir:

Cada unidade:

- Gerenciar seus postos.
- Visualizar receitas.
- Operar carregadores.

---

# Regras comerciais

Criar:

Royalty Engine


Permitir:

Cobrar:

- Percentual receita.
- Taxa fixa.
- Mensalidade.

---

# Exemplo:

Franquia gera:

R$100.000

Royalty:

5%

Plataforma calcula automaticamente.

---

# Padronização operacional

Criar:

Operational Standards


Definir:

- Tarifas.
- Atendimento.
- Qualidade.
- Marca.

---

# Dashboard rede

Criar:

/network/dashboard


Mostrar:

- Receita total.
- Todas unidades.
- Melhor desempenho.
- Problemas.

---

# Comparativo unidades

Criar:

Ranking


Comparar:

- Uso.
- Receita.
- Disponibilidade.
- Avaliação clientes.

---

# Expansão territorial

Criar:

Location Planning


Analisar:

- Novos locais.
- Demanda.
- Potencial mercado.

---

# Banco de Dados

Criar:

## Network

Campos:

- id
- name
- owner_id


---

## Franchise

Campos:

- id
- network_id
- name
- royalty_rule


---

## Location

Campos:

- id
- franchise_id
- address
- status

---

# API

Criar:

GET

/networks


POST

/franchises


GET

/network/:id/dashboard


GET

/franchise/:id/revenue

---

# Segurança

Garantir:

- Separação hierárquica.
- Permissões por nível.
- Auditoria.

---

# Testes

Validar:

- Criar rede.
- Criar franquia.
- Criar unidade.
- Calcular royalties.
- Relatórios consolidados.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Grandes redes conseguem operar.

✅ Franquias possuem autonomia controlada.

✅ Receita é consolidada.

---

# Entrega

Informar:

1. Hierarquia criada.
2. Regras franquia.
3. Dashboards.
4. APIs.
5. Próximo módulo recomendado.