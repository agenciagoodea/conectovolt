# PROMPT 52 — WHITE LABEL & MULTI-TENANT ENTERPRISE MODULE

## Contexto

Você está implementando a arquitetura White Label e Multi-Tenant da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/SECURITY.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar uma arquitetura que permita múltiplas empresas utilizarem a plataforma com isolamento de dados e personalização de marca.

---

# Conceito

Uma plataforma

↓

Múltiplos clientes

↓

Ambientes personalizados

↓

Dados isolados

---

# Estrutura Backend

Criar:

```
modules/multi-tenant/

tenant.module.ts

tenant.controller.ts

tenant.service.ts

branding/

domains/

isolation/

configuration/

tests/

```

---

# Modelo Tenant

Criar:

Tenant


Campos:

- id
- company_name
- slug
- status
- created_at

---

# Isolamento de dados

Implementar:

Tenant Isolation


Garantir:

Empresa A

não acessa

Empresa B.

---

# Estratégias suportadas

Preparar:

## Shared Database

Mesmo banco.

Separação por tenant_id.


---

## Dedicated Database

Banco exclusivo para grandes clientes.

---

# White Label

Criar:

Brand Configuration


Permitir:

- Logo.
- Cores.
- Nome aplicativo.
- Favicon.
- Domínio personalizado.

---

# Personalização Mobile

Permitir:

Cliente enterprise:

- Nome próprio.
- Identidade visual.
- Configurações próprias.

---

# Domínios personalizados

Suportar:

Exemplo:

cliente.evcharge.com


ou

app.cliente.com

---

# Configurações por cliente

Criar:

Tenant Settings


Permitir:

- Tarifas.
- Regras.
- Permissões.
- Integrações.
- Recursos ativos.

---

# Feature Management

Criar:

Tenant Feature Flags


Exemplo:

Cliente Enterprise:

Ativa:

- IA.
- Relatórios avançados.
- API.

---

# Usuários multi-organização

Permitir:

Usuário participar de:

- Uma empresa.
- Várias empresas.

---

# Administração tenant

Criar:

Tenant Admin Panel


Permitir:

- Usuários.
- Permissões.
- Configurações.
- Relatórios.

---

# Billing multi-tenant

Integrar:

Billing Module


Permitir:

Cada tenant possui:

- Plano.
- Cobrança.
- Consumo.

---

# Auditoria

Registrar:

- Alterações tenant.
- Usuários.
- Configurações.
- Acessos.

---

# Banco de Dados

Criar:

## Tenant

Campos:

- id
- name
- domain
- settings


---

## TenantBranding

Campos:

- tenant_id
- logo
- colors
- theme

---

## TenantFeature

Campos:

- tenant_id
- feature
- enabled

---

# API

Criar:

GET

/tenants


POST

/tenants


PATCH

/tenants/:id/branding


GET

/tenants/:id/settings

---

# Segurança

Implementar:

- Middleware tenant.
- Validação contexto.
- Logs.
- Controle acesso.

---

# Testes

Validar:

- Criar tenant.
- Isolar dados.
- Personalizar marca.
- Usuário multiempresa.
- Billing separado.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Várias empresas usam a mesma plataforma.

✅ Cada cliente possui sua identidade.

✅ Dados permanecem isolados.

---

# Entrega

Informar:

1. Arquitetura multi-tenant.
2. Recursos white label.
3. Segurança.
4. APIs.
5. Próximo módulo recomendado.