# PROMPT 63 — ENTERPRISE SLA & CONTRACT MANAGEMENT MODULE

## Contexto

Você está implementando o módulo de contratos empresariais, SLA e governança da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/SUPPORT.md
- docs/SECURITY.md

---

# Objetivo

Criar uma estrutura para gerenciar clientes enterprise, contratos, níveis de serviço e compromissos operacionais.

---

# Conceito

Cliente Enterprise

↓

Contrato

↓

SLA

↓

Monitoramento

↓

Relatórios

---

# Estrutura Backend

Criar:

```
modules/enterprise-management/

enterprise.module.ts

enterprise.controller.ts

enterprise.service.ts

contracts/

sla/

support/

compliance/

reports/

tests/

```

---

# Gestão contratos

Criar:

Contract Management


Controlar:

- Cliente.
- Plano.
- Vigência.
- Valores.
- Renovação.

---

# Entidade Contract

Campos:

- id
- company_id
- start_date
- end_date
- value
- status

---

# SLA Management

Criar:

SLA Engine


Controlar:

- Disponibilidade.
- Tempo resposta.
- Tempo resolução.
- Prioridade.

---

# Níveis atendimento

Criar:

Support Levels


Exemplo:

```
P1 Critical

P2 High

P3 Normal

P4 Low
```

---

# Monitoramento SLA

Criar:

SLA Monitoring


Medir:

- Uptime plataforma.
- Tempo atendimento.
- Incidentes.

---

# Gestão incidentes

Criar:

Incident Management


Fluxo:

Incidente

↓

Classificação

↓

Atendimento

↓

Resolução

↓

Relatório

---

# Relatórios cliente

Criar:

Enterprise Reports


Mostrar:

- SLA cumprido.
- Performance.
- Incidentes.
- Uso plataforma.

---

# Renovação contratos

Criar:

Renewal Management


Alertar:

- Próximo vencimento.
- Expansão contrato.
- Risco cancelamento.

---

# Integração CRM

Conectar:

Sales Module


Usar:

- Contratos.
- Receita.
- Histórico cliente.

---

# Dashboard Enterprise

Criar:

/enterprise/dashboard


Mostrar:

- Contratos ativos.
- SLA.
- Receita.
- Saúde cliente.

---

# Banco de Dados

Criar:

## Contract

Campos:

- id
- tenant_id
- value
- status


---

## SLA

Campos:

- id
- contract_id
- availability
- response_time


---

## Incident

Campos:

- id
- severity
- status
- resolution_time

---

# API

Criar:

GET

/contracts


POST

/contracts


GET

/sla/report


POST

/incidents

---

# Segurança

Garantir:

- Dados contratuais protegidos.
- Controle acesso.
- Auditoria.

---

# Testes

Validar:

- Criar contrato.
- Definir SLA.
- Registrar incidente.
- Gerar relatório.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Clientes enterprise possuem governança.

✅ SLA é monitorado.

✅ Contratos podem ser escalados.

---

# Entrega

Informar:

1. Gestão contratos.
2. SLA criado.
3. Relatórios.
4. APIs.
5. Próximo módulo recomendado.