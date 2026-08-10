# ConectoVolt

## SaaS de Gestão e Pagamento para Postos de Recarga de Veículos Elétricos

Versão: MVP 1.0

Status: Em desenvolvimento

---

# Visão Geral

A ConectoVolt é uma plataforma SaaS criada para conectar operadores de postos de recarga elétrica e motoristas de veículos elétricos.

O sistema permite:

* Gerenciamento de postos.
* Gerenciamento de carregadores.
* Controle de sessões de recarga.
* Pagamentos digitais.
* Gestão financeira.
* Comissão automática da plataforma.
* Aplicativo para usuários finais.

---

# Modelo de Negócio

A plataforma funciona através de comissão sobre cada recarga realizada.

Exemplo:

Recarga:
R$ 100,00

Comissão plataforma:
5%

Receita plataforma:
R$ 5,00

Operador recebe:
R$ 95,00

---

# Objetivo do MVP

Criar uma primeira versão funcional que permita:

## Operadores

* Cadastrar postos.
* Cadastrar carregadores.
* Definir tarifas.
* Acompanhar recargas.
* Visualizar receitas.
* Receber repasses.

## Motoristas

* Criar conta.
* Encontrar postos.
* Iniciar recarga.
* Realizar pagamento.
* Consultar histórico.

## Plataforma

* Gerenciar operadores.
* Controlar comissões.
* Visualizar indicadores financeiros.

---

# Tecnologias

## Backend

* NestJS
* TypeScript
* Prisma ORM
* MySQL em produção (SQLite disponível para desenvolvimento local)
* Redis
* WebSocket

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

## Mobile

* Flutter
* Dart

## Infraestrutura MVP

* Docker
* VPS ou Cloud simples

---

# Estrutura do Projeto

```
ev-charge-platform/

├── .antigravity/
│   ├── skill.md
│   └── prompts/
│
├── docs/
│   ├── PRD.md
│   ├── BUSINESS_MODEL.md
│   ├── ROADMAP.md
│   ├── TODO.md
│   ├── DATABASE.md
│   ├── API.md
│   └── UX_FLOW.md
│
├── backend/
│
├── frontend/
│
├── mobile/
│
└── README.md
```

---

# Documentação Obrigatória

Antes de desenvolver qualquer funcionalidade, consultar:

## Produto

docs/PRD.md

Define o que o sistema deve fazer.

---

## Modelo de Negócio

docs/BUSINESS_MODEL.md

Define como a plataforma ganha dinheiro.

---

## Banco de Dados

docs/DATABASE.md

Define entidades e relacionamentos.

---

## API

docs/API.md

Define contratos do backend.

---

## Experiência

docs/UX_FLOW.md

Define jornadas e telas.

---

## Execução

docs/TODO.md

Define a ordem das tarefas.

---

# Uso do Antigravity CLI

Antes de gerar código:

1. Ler `.antigravity/skill.md`.
2. Ler documentos relacionados.
3. Identificar a tarefa atual no TODO.
4. Criar plano de implementação.
5. Executar desenvolvimento.
6. Testar.
7. Atualizar documentação quando necessário.

---

# Regras Principais

* Desenvolver primeiro o MVP.
* Não criar funcionalidades fora do escopo sem aprovação.
* Priorizar simplicidade.
* Código limpo.
* Código organizado.
* Segurança desde o início.
* Sempre validar dados.
* Sempre documentar APIs.

---

# Fluxo de Desenvolvimento

```
Planejamento

↓

Banco de Dados

↓

Backend

↓

Frontend

↓

Mobile

↓

Testes

↓

Produção
```

---

# MVP Inicial

Funcionalidades:

✅ Autenticação

✅ Empresas

✅ Usuários

✅ Postos

✅ Carregadores

✅ Sessões de recarga

✅ Pagamentos

✅ Comissão da plataforma

✅ Dashboard

✅ Aplicativo básico

---

# Futuras Evoluções

Após validação do mercado:

* White Label.
* Assinaturas.
* Cashback.
* Fidelidade.
* IA.
* Tarifação dinâmica.
* OCPP 2.0.1 completo.
* API pública.

---

# Princípio do Projeto

Construir um produto simples, funcional e vendável.

A prioridade é colocar a plataforma em operação, validar clientes e evoluir com base em dados reais.
