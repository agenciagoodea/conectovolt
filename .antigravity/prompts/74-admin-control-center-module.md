# PROMPT 74 — ADMIN CONTROL CENTER MODULE

## Contexto

Você está implementando o painel administrativo central da EV Charge Platform.

Este módulo será utilizado pela equipe interna da plataforma para controlar toda a operação.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/SECURITY.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar o centro de controle global da plataforma.

---

# Conceito

Super Admin

↓

Admin Control Center

↓

Toda operação

---

# Estrutura Frontend

Criar:

```
admin-dashboard/

overview/

users/

operators/

stations/

payments/

security/

analytics/

settings/

audit/

tests/

```

---

# Autenticação administrativa

Implementar:

- Login seguro.
- MFA obrigatório.
- Controle de permissões.
- Sessões administrativas.

---

# Dashboard geral

Criar:

Admin Overview


Mostrar:

- Usuários totais.
- Operadores ativos.
- Estações online.
- Receita.
- Sessões em andamento.

---

# Gestão usuários

Criar:

User Management


Permitir:

- Buscar usuários.
- Bloquear conta.
- Alterar permissões.
- Visualizar histórico.

---

# Gestão operadores

Criar:

Operator Management


Permitir:

- Aprovar operador.
- Suspender operador.
- Ver desempenho.
- Gerenciar contratos.

---

# Gestão infraestrutura

Criar:

Infrastructure Control


Mostrar:

- Estações.
- Carregadores.
- Status online.
- Falhas.

---

# Monitoramento global

Criar:

Global Monitoring


Acompanhar:

- Sistema.
- APIs.
- OCPP.
- Pagamentos.

---

# Controle financeiro

Criar:

Financial Admin


Mostrar:

- Receita total.
- Taxas plataforma.
- Repasses.
- Transações.

---

# Gestão tarifas

Criar:

Global Pricing Control


Permitir:

- Regras globais.
- Limites.
- Políticas comerciais.

---

# Auditoria

Criar:

Audit Center


Registrar:

- Login.
- Alterações.
- Ações administrativas.
- Eventos críticos.

---

# Configurações plataforma

Criar:

Platform Settings


Controlar:

- Recursos ativos.
- Limites.
- Integrações.

---

# Gestão incidentes

Criar:

Incident Dashboard


Mostrar:

- Falhas.
- Alertas.
- Resoluções.

---

# Banco de Dados

Criar:

## AdminAction

Campos:

- id
- admin_id
- action
- timestamp


---

## PlatformSetting

Campos:

- key
- value
- updated_at


---

# APIs

Criar:

GET

/admin/dashboard


GET

/admin/users


GET

/admin/operators


GET

/admin/audit


PATCH

/admin/settings

---

# Segurança

Implementar:

- MFA.
- Logs imutáveis.
- Controle RBAC.
- Alertas ações críticas.

---

# Testes

Validar:

- Login admin.
- Gerenciar usuário.
- Aprovar operador.
- Consultar auditoria.
- Alterar configuração.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Administração controla toda plataforma.

✅ Operações críticas possuem auditoria.

✅ Gestão global está centralizada.

---

# Entrega

Informar:

1. Painel criado.
2. Recursos administrativos.
3. APIs.
4. Segurança.
5. Próximo módulo recomendado.