# PROMPT 46 — CUSTOMER ONBOARDING & IMPLEMENTATION MODULE

## Contexto

Você está implementando o processo de implantação e ativação de clientes da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/SUPPORT.md
- docs/ARCHITECTURE.md

---

# Objetivo

Criar um processo estruturado para colocar novos clientes em operação rapidamente.

---

# Conceito

Cliente contratado

↓

Onboarding

↓

Configuração

↓

Treinamento

↓

Go Live

↓

Acompanhamento

---

# Estrutura Backend

Criar:

```
modules/onboarding/

onboarding.module.ts

onboarding.controller.ts

onboarding.service.ts

checklists/

steps/

progress/

training/

tests/

```

---

# Processo de onboarding

Criar etapas:

---

# Etapa 1 — Cadastro empresa

Coletar:

- Dados empresa.
- Responsável.
- Documentos.
- Plano contratado.

Status:

PENDING_COMPANY

---

# Etapa 2 — Configuração operação

Cadastrar:

- Postos.
- Endereços.
- Carregadores.
- Tarifas.

Status:

CONFIGURING

---

# Etapa 3 — Integração equipamentos

Validar:

- Comunicação OCPP.
- Status carregador.
- Teste conexão.

Status:

CONNECTING

---

# Etapa 4 — Pagamentos

Configurar:

- Gateway.
- Métodos pagamento.
- Regras comissão.

Status:

PAYMENT_SETUP

---

# Etapa 5 — Treinamento

Criar:

Training Center


Conteúdo:

- Gestão posto.
- Relatórios.
- Financeiro.
- Suporte.

Status:

TRAINING

---

# Etapa 6 — Go Live

Checklist:

- Primeiro carregador online.
- Primeiro pagamento.
- Primeiro relatório.

Status:

ACTIVE

---

# Dashboard implantação

Criar:

/onboarding/dashboard


Mostrar:

- Clientes em implantação.
- Pendências.
- Tempo médio ativação.

---

# Área cliente

Criar:

/setup


Mostrar:

Checklist:

☐ Empresa cadastrada

☐ Postos configurados

☐ Carregadores conectados

☐ Pagamento ativo

☐ Usuários criados

---

# Documentação automática

Gerar:

- Guia inicial.
- Manual operador.
- Configuração técnica.

---

# Customer Success

Criar:

30 Days Success Plan


Acompanhar:

Dia 1:

Primeira configuração.


Dia 7:

Primeiras métricas.


Dia 30:

Avaliação resultado.

---

# Banco de Dados

Criar:

## OnboardingProcess

Campos:

- id
- company_id
- current_step
- status
- started_at
- completed_at


---

## OnboardingTask

Campos:

- id
- process_id
- title
- completed
- completed_at

---

# Notificações

Enviar:

- Nova etapa liberada.
- Pendência.
- Implantação concluída.

---

# API

Criar:

GET

/onboarding/:companyId


POST

/onboarding/start


PATCH

/onboarding/task/:id


GET

/onboarding/checklist

---

# Métricas

Medir:

- Tempo ativação.
- Taxa conclusão.
- Clientes ativos após 30 dias.

---

# Testes

Validar:

- Criar onboarding.
- Completar etapas.
- Bloqueio pendências.
- Ativação cliente.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Novo cliente consegue ser implantado.

✅ Processo é repetível.

✅ Equipe acompanha progresso.

---

# Entrega

Informar:

1. Fluxo criado.
2. Telas.
3. APIs.
4. Checklist.
5. Próximo módulo recomendado.