# PROMPT 12 — FRONTEND WEB SETUP

## Contexto

Você está implementando o frontend web da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/PRD.md
- docs/UX_FLOW.md
- docs/API.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar a aplicação web administrativa da plataforma.

O frontend terá dois ambientes:

1. Painel Administrador

2. Painel Operador

---

# Tecnologia

Utilizar:

Framework:

Next.js

Linguagem:

TypeScript


Estilo:

Tailwind CSS


Componentes:

shadcn/ui


Comunicação:

REST API


Gerenciamento:

React Query


Formulários:

React Hook Form


Validação:

Zod

---

# Estrutura

Criar:

```
frontend/

src/

app/

components/

features/

hooks/

services/

lib/

types/

utils/

styles/

```

---

# Configuração Inicial

Criar:

.env.local


Com:

```
NEXT_PUBLIC_API_URL=
```

---

# Autenticação

Implementar:

- Login.
- Logout.
- Persistência de sessão.
- Proteção de rotas.

---

# Rotas

Criar estrutura:

```
/login


/admin

/admin/dashboard

/admin/companies

/admin/stations

/admin/chargers

/admin/financial


/operator

/operator/dashboard

/operator/stations

/operator/chargers

/operator/sessions

/operator/wallet

```

---

# Layout

Criar:

## Sidebar

Itens dinâmicos conforme perfil.


ADMIN:

- Dashboard
- Empresas
- Usuários
- Postos
- Carregadores
- Financeiro
- Relatórios


OPERATOR:

- Dashboard
- Meus Postos
- Carregadores
- Recargas
- Carteira

---

# Componentes Base

Criar:

- Button
- Input
- Modal
- Table
- Card
- Badge
- Loading
- Empty State
- Error State

---

# Comunicação API

Criar camada:

services/api.ts


Responsável por:

- Base URL.
- Token.
- Headers.
- Tratamento de erros.

---

# Regras de UX

Priorizar:

- Interface limpa.
- Poucos cliques.
- Responsividade.
- Feedback visual.

---

# Dashboard inicial

Criar cards:

## Admin

- Receita.
- Operadores.
- Postos.
- Recargas.


## Operador

- Receita.
- Energia.
- Equipamentos.
- Saldo.

---

# Segurança

Obrigatório:

- Esconder menus sem permissão.
- Validar acesso no frontend.
- Nunca confiar apenas no frontend.

---

# Critério de conclusão

O setup está pronto quando:

✅ Projeto Next.js inicia.

✅ Login funciona.

✅ Rotas protegidas funcionam.

✅ Layout base existe.

✅ Comunicação com API configurada.

---

# Entrega

Informar:

1. Arquivos criados.
2. Dependências instaladas.
3. Como executar.
4. Como testar.
5. Próximo módulo recomendado.