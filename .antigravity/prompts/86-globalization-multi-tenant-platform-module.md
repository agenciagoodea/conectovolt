# PROMPT 86 — GLOBALIZATION & MULTI-TENANT PLATFORM MODULE

## Contexto

Você está implementando a arquitetura global e multi-tenant da ConectoVolt.

Este módulo permite que a plataforma opere em diferentes países, regiões e organizações mantendo isolamento e escalabilidade.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/BUSINESS_MODEL.md
- docs/SECURITY.md

---

# Objetivo

Criar uma arquitetura SaaS global preparada para múltiplos clientes, países e operações.

---

# Conceito

Plataforma Global

↓

Multi Tenant

↓

Organizações independentes

↓

Operações locais

---

# Estrutura Backend

Criar:

```
modules/global-platform/

tenant/

localization/

currency/

language/

regional-rules/

configuration/

tests/

```

---

# Multi Tenant Architecture

Criar:

Tenant Management System


Permitir:

- Criar organizações.
- Isolar dados.
- Configurar regras próprias.

---

# Modelo Tenant

Criar:

Tenant Entity


Campos:

- id
- name
- country
- plan
- status

---

# Isolamento dados

Implementar:

Tenant Data Isolation


Garantir:

- Usuários separados.
- Dados financeiros separados.
- Operações independentes.

---

# Organização empresarial

Criar:

Organization Management


Permitir:

- Empresas.
- Franquias.
- Redes de carregamento.

---

# Multi região

Criar:

Regional Configuration


Controlar:

- Regras locais.
- Impostos.
- Tarifas.
- Disponibilidade.

---

# Multi moeda

Criar:

Currency Engine


Suportar:

- BRL.
- USD.
- EUR.
- Outras moedas.

---

# Conversão valores

Implementar:

Exchange Rate Service


Controlar:

- Conversão.
- Histórico taxas.
- Relatórios.

---

# Internacionalização

Criar:

Localization System


Suportar:

- Idiomas.
- Formatos data.
- Formatos número.

---

# Idiomas iniciais

Preparar:

- Português.
- Inglês.
- Espanhol.

---

# Configuração país

Criar:

Country Rules Engine


Controlar:

- Regulamentação.
- Impostos.
- Políticas energia.

---

# Planos SaaS

Criar:

Subscription Management


Permitir:

Planos:

- Basic.
- Professional.
- Enterprise.

---

# Billing SaaS

Integrar:

Billing Module


Controlar:

- Assinaturas.
- Cobranças.
- Limites uso.

---

# Banco de Dados

Criar:

## Tenant

Campos:

- id
- name
- region


---

## Currency

Campos:

- code
- exchange_rate


---

## Localization

Campos:

- language
- country

---

# API

Criar:

POST

/tenants


GET

/tenant/config


GET

/localization


GET

/currencies

---

# Dashboard Global

Criar:

Global Administration


Mostrar:

- Países ativos.
- Tenants.
- Receita global.
- Crescimento.

---

# Segurança

Implementar:

- Separação tenants.
- Controle acesso.
- Auditoria global.

---

# Testes

Validar:

- Criar tenant.
- Isolar dados.
- Alterar moeda.
- Alterar idioma.

---

# Critério conclusão

O módulo está pronto quando:

✅ Plataforma suporta múltiplas organizações.

✅ Operações podem funcionar em diferentes países.

✅ Arquitetura está pronta para escala global.

---

# Entrega

Informar:

1. Multi tenant.
2. Internacionalização.
3. Moedas.
4. SaaS billing.
5. Próximo módulo recomendado.