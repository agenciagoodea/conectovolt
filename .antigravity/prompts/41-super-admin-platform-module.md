# PROMPT 41 — SUPER ADMIN PLATFORM CONTROL MODULE

## Contexto

Você está implementando o módulo central de administração da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/DATABASE.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar um painel administrativo global para controlar toda a plataforma SaaS.

---

# Conceito

SUPER ADMIN

↓

Plataforma completa

↓

Empresas

↓

Operadores

↓

Usuários

↓

Receitas

---

# Estrutura Backend

Criar:

```
modules/super-admin/

super-admin.module.ts

super-admin.controller.ts

super-admin.service.ts

platform/

companies/

users/

settings/

monitoring/

tests/

```

---

# Dashboard Global

Criar:

/super-admin/dashboard


Mostrar:

## Métricas principais

- Empresas cadastradas.
- Empresas ativas.
- Usuários totais.
- Postos conectados.
- Carregadores online.
- Receita SaaS.
- Volume de recarga.

---

# Gestão de empresas

Permitir:

Visualizar:

- Todas empresas.
- Plano contratado.
- Status.
- Receita gerada.

Ações:

- Ativar.
- Suspender.
- Editar.
- Alterar plano.

---

# Gestão de usuários

Permitir:

- Buscar usuários.
- Visualizar permissões.
- Bloquear conta.
- Redefinir acesso.

---

# Gestão de planos

Integrar:

Billing Module


Permitir:

- Criar plano.
- Alterar preço.
- Alterar limites.
- Aplicar plano empresa.

---

# Controle da rede

Mostrar:

- Todos os postos.
- Todos carregadores.
- Status online/offline.

---

# Monitoramento global

Criar:

Platform Health


Mostrar:

- API status.
- Banco.
- WebSocket.
- OCPP.
- Pagamentos.

---

# Configurações globais

Criar:

Platform Settings


Permitir:

- Nome plataforma.
- Taxas padrão.
- Configurações email.
- Integrações.

---

# Feature Flags

Criar:

Feature Management


Permitir ativar/desativar:

- Novas funcionalidades.
- Testes beta.
- Recursos premium.

---

# Controle de acesso

Criar:

Super Admin Permission


Permissões:

```
MANAGE_USERS

MANAGE_COMPANIES

MANAGE_BILLING

MANAGE_SETTINGS

VIEW_ANALYTICS

MANAGE_SECURITY
```

---

# Auditoria

Integrar:

Audit Module


Registrar:

- Alteração plano.
- Suspensão empresa.
- Alteração financeira.
- Mudanças críticas.

---

# Relatórios executivos

Criar:

Executive Dashboard


Mostrar:

- Crescimento mensal.
- Receita recorrente.
- Churn.
- Novos clientes.
- Retenção.

---

# API

Criar:

GET

/super-admin/dashboard


GET

/super-admin/companies


PATCH

/super-admin/company/:id/status


GET

/super-admin/platform-health


PATCH

/super-admin/settings

---

# Segurança

Obrigatório:

Somente SUPER ADMIN.

Autenticação reforçada.

Registrar todas ações.

---

# Testes

Validar:

- Login super admin.
- Controle empresas.
- Alteração plano.
- Permissões.
- Auditoria.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Dono da plataforma controla tudo.

✅ Operação inteira é visualizada.

✅ Configurações globais existem.

---

# Entrega

Informar:

1. Estrutura criada.
2. Telas.
3. APIs.
4. Permissões.
5. Próximo módulo recomendado.