# PROMPT 44 — SECURITY HARDENING & CYBERSECURITY MODULE

## Contexto

Você está implementando a camada de segurança avançada da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/SECURITY.md
- docs/API.md
- docs/INFRASTRUCTURE.md

---

# Objetivo

Criar uma arquitetura segura contra ataques, fraudes e acessos indevidos.

---

# Estrutura Backend

Criar:

```
modules/security/

security.module.ts

security.controller.ts

security.service.ts

authentication/

authorization/

fraud/

monitoring/

incident-response/

tests/

```

---

# Autenticação

Implementar:

## Usuários

Suportar:

- Email.
- Telefone.
- OAuth.
- MFA.


---

# Multi Factor Authentication

Criar:

MFA Module


Métodos:

- SMS.
- Aplicativo autenticador.
- Email.

---

# Sessões

Controlar:

- Tokens.
- Expiração.
- Revogação.
- Dispositivos conectados.

---

# Autorização

Implementar:

RBAC


Papéis:

```
SUPER_ADMIN

ADMIN

OPERATOR

FLEET_MANAGER

TECHNICIAN

CUSTOMER
```

---

# Permissões

Criar:

Permission Matrix


Controlar:

- Dados.
- APIs.
- Financeiro.
- Equipamentos.

---

# Segurança API

Implementar:

- Rate limiting.
- API throttling.
- CORS.
- Validação entrada.
- Proteção contra abuso.

---

# Proteção contra ataques

Prevenir:

## SQL Injection

## XSS

## CSRF

## Brute Force

## DDoS

---

# Segurança OCPP

Proteger:

Comunicação carregador.

Implementar:

- Certificados.
- Autenticação estação.
- Logs.
- Controle comandos.

---

# Segurança pagamentos

Criar:

Fraud Detection


Monitorar:

- Muitas tentativas.
- Cartões suspeitos.
- Valores anormais.
- Padrões incomuns.

---

# Auditoria

Criar:

Security Audit Log


Registrar:

- Login.
- Alterações.
- Permissões.
- Acessos críticos.

---

# Monitoramento

Criar:

Security Monitoring


Detectar:

- Tentativas invasão.
- Usuários suspeitos.
- Falhas autenticação.

---

# Alertas

Enviar:

- Login suspeito.
- Acesso administrativo.
- Mudança crítica.

---

# Proteção de dados

Implementar:

- Criptografia dados sensíveis.
- Mascaramento informações.
- Controle acesso.

---

# Gestão de vulnerabilidades

Criar rotina:

- Dependências atualizadas.
- Scanner segurança.
- Revisão código.

---

# Backup seguro

Garantir:

- Criptografia backups.
- Controle acesso.
- Teste restauração.

---

# Testes

Executar:

## Segurança aplicação

- Teste autenticação.
- Permissões.
- APIs.


## Infraestrutura

- Portas.
- Configuração.
- Secrets.


## Financeiro

- Fraudes.
- Duplicidade pagamento.

---

# Documentação

Criar:

docs/SECURITY_OPERATIONS.md


Documentar:

- Políticas.
- Resposta incidentes.
- Acessos.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuários possuem proteção.

✅ APIs estão protegidas.

✅ Ações críticas são auditadas.

✅ Existe resposta a incidentes.

---

# Entrega

Informar:

1. Proteções implementadas.
2. Regras segurança.
3. Testes executados.
4. Documentação criada.
5. Próximo módulo recomendado.