# PROMPT 37 — REPORTING, DOCUMENTS & COMPLIANCE MODULE

## Contexto

Você está implementando o módulo de relatórios, documentos e conformidade da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/DATABASE.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar um sistema profissional de geração, armazenamento e distribuição de relatórios.

---

# Conceito

Dados operacionais

↓

Report Engine

↓

Documentos

↓

Usuários autorizados

---

# Estrutura Backend

Criar:

```
modules/reporting/

reporting.module.ts

reporting.controller.ts

reporting.service.ts

templates/

generators/

exports/

compliance/

tests/

```

---

# Motor de relatórios

Criar:

Report Engine


Responsável por:

- Buscar dados.
- Processar informações.
- Gerar documentos.
- Controlar permissões.

---

# Tipos de relatório

Criar:

---

# Relatório financeiro

Mostrar:

- Receita total.
- Taxas.
- Comissão SaaS.
- Repasse operador.
- Pagamentos.

---

# Relatório de recargas

Mostrar:

- Sessões.
- Usuário.
- Posto.
- Carregador.
- kWh.
- Valor.

---

# Relatório operacional

Mostrar:

- Disponibilidade.
- Tempo online.
- Falhas.
- Utilização.

---

# Relatório de frota

Mostrar:

- Veículos.
- Motoristas.
- Consumo.
- Custos.

---

# Relatório ambiental

Criar:

Indicadores:

- Energia consumida.
- Estimativa redução CO2.
- Impacto sustentável.

---

# Exportações

Suportar:

## PDF

Para:

- Relatórios executivos.
- Documentos oficiais.

---

## Excel

Para:

- Análise financeira.
- Dados brutos.

---

## CSV

Para integrações.

---

# Agendamento

Criar:

Scheduled Reports


Permitir:

Cliente configurar:

- Diário.
- Semanal.
- Mensal.

---

# Envio automático

Integrar:

Notification Module


Enviar:

Email.

Push.

---

# Documentos

Criar:

Document Manager


Permitir:

- Armazenar documentos.
- Controlar versões.
- Definir acesso.

---

# Compliance

Criar:

Compliance Module


Registrar:

- Aprovações.
- Auditorias.
- Documentações.

---

# Banco de Dados

Criar:

## Report

Campos:

- id
- company_id
- type
- file_url
- created_at


---

## ScheduledReport

Campos:

- id
- user_id
- frequency
- next_run
- active

---

## Document

Campos:

- id
- owner_id
- type
- version
- url
- created_at

---

# Dashboard

Adicionar:

## Admin

Mostrar:

- Relatórios gerados.
- Exportações.
- Auditoria.


---

## Operador

Mostrar:

- Financeiro.
- Operação.
- Clientes.

---

# Segurança

Implementar:

Controle por permissão.

Empresa acessa somente seus relatórios.

---

# API

Criar:

GET

/reports


POST

/reports/generate


GET

/reports/:id/download


POST

/reports/schedule

---

# Testes

Validar:

- Gerar PDF.
- Gerar Excel.
- Agendamento.
- Permissões.
- Histórico.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuário consegue gerar relatórios.

✅ Documentos são armazenados.

✅ Dados financeiros possuem rastreabilidade.

---

# Entrega

Informar:

1. Relatórios criados.
2. Formatos disponíveis.
3. APIs.
4. Como testar.
5. Próximo módulo recomendado.