# PROMPT 36 — MAINTENANCE & PREDICTIVE MANAGEMENT MODULE

## Contexto

Você está implementando o módulo de manutenção e gestão preditiva da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/DATABASE.md
- docs/ANALYTICS.md

---

# Objetivo

Criar um sistema para monitorar, diagnosticar e gerenciar manutenção dos carregadores.

---

# Conceito

Carregador

↓

Dados operacionais

↓

Health Score

↓

Alertas

↓

Manutenção

↓

Histórico

---

# Estrutura Backend

Criar:

```
modules/maintenance/

maintenance.module.ts

maintenance.controller.ts

maintenance.service.ts

tickets/

health/

alerts/

technicians/

tests/

```

---

# Banco de Dados

Criar:

## ChargerHealth

Campos:

- id
- charger_id
- availability_score
- fault_count
- last_check
- status

---

## MaintenanceTicket

Campos:

- id
- charger_id
- title
- description
- priority
- status
- assigned_to
- created_at

---

# Status chamado

Criar:

```
OPEN

IN_PROGRESS

WAITING_PARTS

RESOLVED

CLOSED
```

---

# Prioridade

Criar:

```
LOW

MEDIUM

HIGH

CRITICAL
```

---

# Monitoramento automático

Analisar:

- Tempo offline.
- Quantidade de falhas.
- Reinicializações.
- Erros OCPP.
- Queda de potência.
- Temperatura.
- Histórico.

---

# Health Score

Criar cálculo:

Exemplo:

100 pontos = perfeito

Reduzir pontos por:

- Falhas.
- Indisponibilidade.
- Erros frequentes.

---

# Alertas automáticos

Criar:

## Charger Offline

Enviar:

- Email.
- Push.
- Dashboard.


---

## Falha recorrente

Exemplo:

"Carregador apresentou 10 falhas em 7 dias."

---

## Baixa performance

Exemplo:

"Potência média caiu 30%."

---

# Gestão técnica

Criar:

Technician Module


Permitir:

- Cadastrar técnicos.
- Associar região.
- Ver chamados.

---

# Aplicativo técnico futuro

Preparar:

Mobile Technician App


Funções:

- Receber chamado.
- Atualizar status.
- Registrar solução.
- Fotos do serviço.

---

# Relatórios

Criar:

## Relatório manutenção

Mostrar:

- Equipamentos com mais falhas.
- Tempo médio resolução.
- Custos.


---

# Dashboard Operador

Adicionar:

Mostrar:

- Saúde dos carregadores.
- Chamados abertos.
- Disponibilidade.


---

# Dashboard Admin

Mostrar:

- Rede geral.
- Equipamentos críticos.
- SLA manutenção.

---

# Inteligência artificial

Integrar AI Module:

Gerar previsões:

"Este carregador possui alta probabilidade de falha nos próximos dias."

---

# API

Criar:

GET

/maintenance/health


GET

/maintenance/tickets


POST

/maintenance/tickets


PATCH

/maintenance/tickets/:id


---

# Segurança

Garantir:

Operador vê apenas seus equipamentos.

Técnico vê apenas chamados atribuídos.

---

# Testes

Validar:

- Criar chamado.
- Alterar status.
- Gerar alerta.
- Calcular saúde.
- Registrar manutenção.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Problemas são detectados rapidamente.

✅ Técnicos conseguem atuar.

✅ Histórico de manutenção é preservado.

---

# Entrega

Informar:

1. Arquivos criados.
2. Regras de saúde.
3. Alertas implementados.
4. Como testar.
5. Próximo módulo recomendado.