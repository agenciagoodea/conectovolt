# PROMPT 24 — AUDIT LOG & SECURITY MODULE

## Contexto

Você está implementando o módulo de auditoria e segurança da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/DATABASE.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar rastreabilidade completa das ações realizadas dentro da plataforma.

---

# Conceito

Toda ação importante gera um registro.

Fluxo:

Usuário

↓

Ação

↓

Audit Service

↓

Banco de dados

↓

Consulta administrativa

---

# Banco de Dados

Criar model AuditLog.

Campos:

- id
- user_id
- company_id
- action
- entity
- entity_id
- old_value
- new_value
- ip_address
- user_agent
- created_at

---

# Enum ActionType

Criar:

- CREATE
- UPDATE
- DELETE
- LOGIN
- LOGOUT
- PAYMENT
- APPROVAL
- SECURITY

---

# Estrutura

Criar:

```
modules/audit/

audit.module.ts

audit.service.ts

audit.controller.ts

interceptors/

guards/

repository/

tests/

```

---

# Eventos monitorados

Registrar:

## Usuários

- Criar usuário.
- Alterar perfil.
- Bloquear usuário.

---

## Empresas

- Criar empresa.
- Aprovar empresa.
- Alterar plano.

---

## Postos

- Criar.
- Editar.
- Desativar.

---

## Carregadores

- Cadastro.
- Alteração.
- Status.

---

## Financeiro

- Pagamento aprovado.
- Saque.
- Alteração comissão.

---

# Login Security

Registrar:

- Login realizado.
- Falha de login.
- IP.
- Dispositivo.

---

# Segurança adicional

Implementar:

## Rate Limit

Proteger:

- Login.
- Pagamentos.
- APIs públicas.

---

## JWT Security

Configurar:

- Expiração de token.
- Refresh token.
- Revogação.

---

## Senhas

Obrigatório:

- Hash seguro.
- Nunca armazenar senha pura.

---

# Painel Admin

Criar:

/admin/audit


Mostrar:

Tabela:

- Usuário.
- Ação.
- Data.
- Entidade.
- Detalhes.

---

# Filtros

Permitir:

- Usuário.
- Empresa.
- Tipo ação.
- Período.

---

# Logs técnicos

Preparar:

- Erros.
- Integrações.
- OCPP.
- Pagamentos.

---

# Regras

Audit Log nunca pode ser apagado.

Somente leitura.

---

# Testes

Validar:

- Registro de criação.
- Registro de alteração.
- Login registrado.
- Bloqueio de acesso.
- Consulta admin.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Toda ação crítica é registrada.

✅ Admin consegue consultar histórico.

✅ Segurança básica está implementada.

---

# Entrega

Informar:

1. Arquivos criados.
2. Eventos monitorados.
3. Regras de segurança.
4. Como testar.
5. Próximo módulo recomendado.