# PROMPT 84 — SECURITY, IDENTITY & ACCESS MANAGEMENT MODULE

## Contexto

Você está implementando a camada de segurança, identidade e controle de acesso da ConectoVolt.

Este módulo protege usuários, operadores, administradores, pagamentos e infraestrutura energética.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/SECURITY.md
- docs/ARCHITECTURE.md
- docs/COMPLIANCE.md

---

# Objetivo

Criar uma infraestrutura completa de identidade, autenticação, autorização e auditoria.

---

# Conceito

Usuário

↓

Identidade digital

↓

Autenticação

↓

Permissões

↓

Recursos protegidos

---

# Estrutura Backend

Criar:

```
modules/security/

security.module.ts

identity/

authentication/

authorization/

permissions/

audit/

encryption/

compliance/

tests/

```

---

# Identity Management

Criar:

Identity Service


Responsável:

- Criar identidade.
- Atualizar perfil.
- Validar usuários.

---

# Autenticação

Implementar:

Authentication System


Suportar:

- Email.
- Telefone.
- OAuth.
- Tokens seguros.

---

# Multi Factor Authentication

Criar:

MFA Service


Suportar:

- Aplicativo autenticador.
- SMS.
- Email.
- Biometria.

---

# Controle acesso

Criar:

Authorization Engine


Modelo:

RBAC


Papéis:

```
USER

DRIVER

FLEET_MANAGER

OPERATOR

ADMIN

SUPER_ADMIN
```

---

# Permissões granulares

Criar:

Permission System


Controlar:

- Visualizar dados.
- Editar recursos.
- Executar comandos.

---

# API Security

Implementar:

- Rate limit.
- API keys.
- Tokens.
- Validação requests.

---

# Proteção dados

Criar:

Data Protection Layer


Proteger:

- Dados pessoais.
- Dados financeiros.
- Localização.
- Telemetria.

---

# Criptografia

Implementar:

Encryption Service


Usar para:

- Dados sensíveis.
- Credenciais.
- Informações privadas.

---

# Auditoria

Criar:

Audit Log System


Registrar:

- Login.
- Alterações.
- Ações administrativas.
- Operações críticas.

---

# Detecção fraude

Criar:

Security Monitoring


Detectar:

- Acessos suspeitos.
- Tentativas login.
- Comportamentos anormais.

---

# Gestão sessões

Criar:

Session Management


Controlar:

- Dispositivos ativos.
- Expiração.
- Revogação.

---

# Compliance

Preparar:

Compliance Framework


Considerar:

- LGPD.
- GDPR.
- Normas segurança.

---

# Banco de Dados

Criar:

## Identity

Campos:

- id
- user_id
- provider


---

## Role

Campos:

- id
- name


---

## Permission

Campos:

- role_id
- resource
- action


---

## AuditLog

Campos:

- user_id
- action
- timestamp

---

# API

Criar:

POST

/auth/login


POST

/auth/mfa


GET

/security/audit


GET

/security/permissions


PATCH

/security/access

---

# Dashboard segurança

Criar:

Security Center


Mostrar:

- Usuários ativos.
- Eventos segurança.
- Alertas.
- Auditoria.

---

# Testes

Validar:

- Login.
- MFA.
- Permissões.
- Auditoria.
- Bloqueios.

---

# Critério conclusão

O módulo está pronto quando:

✅ Usuários acessam apenas o permitido.

✅ Ações críticas são registradas.

✅ Dados sensíveis estão protegidos.

---

# Entrega

Informar:

1. Sistema identidade.
2. Segurança.
3. Permissões.
4. Auditoria.
5. Próximo módulo recomendado.