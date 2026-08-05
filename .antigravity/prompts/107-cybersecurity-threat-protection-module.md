# PROMPT 107 — CYBERSECURITY & THREAT PROTECTION MODULE

## Contexto

Você está criando a camada completa de segurança cibernética da ConectoVolt.

O objetivo é proteger usuários, empresas, operadores, dados, pagamentos, APIs e infraestrutura contra ameaças digitais.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/SECURITY.md
- docs/ARCHITECTURE.md
- docs/FINANCE.md
- docs/DEVOPS.md
- docs/COMPLIANCE.md

---

# Objetivo

Criar uma arquitetura de segurança empresarial para uma plataforma de mobilidade elétrica conectada.

---

# Conceito

Usuários

↓

Aplicações

↓

APIs

↓

Dados

↓

Infraestrutura

↓

Proteção contínua

---

# Estrutura Cybersecurity

Criar:

```
modules/security/

identity/

access-control/

encryption/

threat-detection/

vulnerability/

incident-response/

compliance/

security-monitoring/

tests/

```

---

# Security Architecture

Criar:

Cybersecurity Framework


Definir:

- Camadas proteção.
- Controles segurança.
- Processos resposta.
- Monitoramento contínuo.

---

# Gestão identidade

Criar:

Identity Management System


Controlar:

- Usuários.
- Operadores.
- Administradores.
- Parceiros.
- Equipes internas.

---

# Autenticação

Implementar:

Authentication System


Suportar:

- Login seguro.
- MFA.
- Recuperação conta.
- Controle sessões.

---

# Autorização

Criar:

Role Based Access Control (RBAC)


Definir permissões:

## Usuário

- Usar plataforma.
- Visualizar histórico.


## Operador

- Gerenciar estações.
- Visualizar operação.


## Administrador

- Configurar sistema.
- Gerenciar usuários.


## Equipe interna

- Acessos controlados.

---

# Proteção APIs

Criar:

API Security Layer


Implementar:

- Autenticação API.
- Rate limiting.
- Validação entrada.
- Proteção contra abuso.

---

# Segurança aplicações

Criar:

Application Security


Garantir:

- Proteção contra ataques comuns.
- Validação dados.
- Controle sessões.
- Segurança frontend/backend.

---

# Criptografia

Implementar:

Encryption Management


Proteger:

- Dados usuários.
- Dados financeiros.
- Credenciais.
- Comunicação dispositivos.

---

# Gestão segredos

Criar:

Secrets Management


Controlar:

- Chaves API.
- Tokens.
- Senhas.
- Certificados.

---

# Segurança pagamentos

Criar:

Payment Security Layer


Garantir:

- Proteção transações.
- Controle fraude.
- Auditoria financeira.

---

# Segurança carregadores

Criar:

Charging Infrastructure Security


Proteger:

- Comunicação carregador.
- Comandos remotos.
- Dados telemetria.
- Acesso dispositivos.

---

# Detecção ameaças

Criar:

Threat Detection System


Monitorar:

- Tentativas login.
- Acessos suspeitos.
- Comportamentos anormais.
- Ataques API.

---

# Monitoramento segurança

Criar:

Security Operations Center


Acompanhar:

- Alertas.
- Eventos.
- Vulnerabilidades.
- Incidentes.

---

# Gestão vulnerabilidades

Criar:

Vulnerability Management


Processo:

Identificação

↓

Análise

↓

Correção

↓

Validação

---

# Testes segurança

Criar:

Security Testing Framework


Executar:

- Testes APIs.
- Testes autenticação.
- Análise vulnerabilidades.
- Testes permissões.

---

# Penetration Testing

Criar:

Penetration Test Process


Avaliar:

- Aplicações.
- APIs.
- Infraestrutura.
- Integrações.

---

# Proteção dados

Criar:

Data Security Management


Controlar:

- Classificação dados.
- Acesso.
- Retenção.
- Exclusão segura.

---

# Privacidade

Integrar:

Privacy Compliance


Garantir:

- Consentimento.
- Controle usuário.
- Solicitação exclusão.
- Auditoria.

---

# Incident Response

Criar:

Security Incident Response


Processo:

Detecção

↓

Contenção

↓

Investigação

↓

Correção

↓

Relatório

---

# Auditoria segurança

Criar:

Security Audit System


Registrar:

- Eventos críticos.
- Alterações permissões.
- Acessos administrativos.
- Incidentes.

---

# Dashboard Segurança

Criar:

Security Command Center


Mostrar:

- Status segurança.
- Alertas.
- Vulnerabilidades.
- Incidentes.
- Riscos.

---

# Banco de Dados

Criar:

## SecurityEvent

Campos:

- type
- severity
- timestamp


---

## AccessLog

Campos:

- user_id
- action
- timestamp


---

## Vulnerability

Campos:

- description
- severity
- status

---

# API

Criar:

GET

/security/status


GET

/security/events


GET

/security/vulnerabilities


POST

/security/incidents


GET

/security/audit

---

# Segurança adicional

Implementar:

- Princípio menor privilégio.
- Separação ambientes.
- Monitoramento contínuo.
- Proteção credenciais.
- Auditoria completa.

---

# Testes

Validar:

- Login seguro.
- Controle permissões.
- Bloqueio acessos indevidos.
- Detecção ameaças.
- Recuperação incidentes.

---

# Critério conclusão

O módulo está pronto quando:

✅ Dados estão protegidos.

✅ Usuários possuem acesso seguro.

✅ APIs estão protegidas.

✅ Incidentes podem ser detectados e tratados.

✅ Plataforma atende padrões empresariais de segurança.

---

# Entrega

Informar:

1. Arquitetura segurança.
2. Controles implementados.
3. Monitoramento.
4. Testes realizados.
5. Próximo módulo recomendado.