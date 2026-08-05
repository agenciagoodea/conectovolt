# PROMPT 106 — DEVOPS, CLOUD INFRASTRUCTURE & RELIABILITY MODULE

## Contexto

Você está criando a infraestrutura de produção, DevOps e confiabilidade da EV Charge Platform.

O objetivo é garantir que a plataforma opere com alta disponibilidade, segurança, performance e capacidade de escala.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/SECURITY.md
- docs/MVP.md
- docs/OPERATIONS.md

---

# Objetivo

Criar uma infraestrutura profissional de produção para suportar crescimento da EV Charge.

---

# Conceito

Código

↓

Deploy automatizado

↓

Infraestrutura

↓

Monitoramento

↓

Alta disponibilidade

---

# Estrutura DevOps

Criar:

```
infrastructure/

cloud/

ci-cd/

monitoring/

logging/

security/

backup/

disaster-recovery/

tests/

```

---

# Cloud Infrastructure

Criar:

Cloud Architecture


Definir:

- Ambiente produção.
- Ambiente homologação.
- Ambiente desenvolvimento.


Separar:

- Recursos.
- Permissões.
- Configurações.

---

# Ambientes

Criar:

## Development

Uso:

- Desenvolvimento interno.
- Testes iniciais.


## Staging

Uso:

- Validação antes produção.


## Production

Uso:

- Clientes reais.

---

# Containerização

Implementar:

Container Strategy


Definir:

- Aplicações.
- Serviços.
- Dependências.


Garantir:

- Padronização.
- Portabilidade.
- Escalabilidade.

---

# CI/CD Pipeline

Criar:

Continuous Integration Pipeline


Processo:

Código enviado

↓

Testes automáticos

↓

Validação qualidade

↓

Build

↓

Deploy


---

# Deploy automático

Criar:

Continuous Deployment


Permitir:

- Atualização segura.
- Rollback.
- Controle versões.

---

# Controle versões

Implementar:

Version Management


Controlar:

- Releases.
- Histórico.
- Alterações.

---

# Infraestrutura como código

Criar:

Infrastructure as Code


Definir:

- Servidores.
- Redes.
- Serviços.
- Configurações.

---

# Monitoramento

Criar:

Infrastructure Monitoring System


Monitorar:

## Aplicação

- Erros.
- Performance.
- Disponibilidade.


## Servidores

- CPU.
- Memória.
- Armazenamento.


## Banco dados

- Conexões.
- Performance.
- Crescimento.

---

# Alertas

Criar:

Alert Management System


Detectar:

- Serviço offline.
- Alta utilização.
- Falhas críticas.
- Lentidão.

---

# Logs

Criar:

Centralized Logging System


Registrar:

- Eventos.
- Erros.
- Auditoria.
- Ações usuários.

---

# Observabilidade

Criar:

Observability Platform


Permitir:

- Rastreamento problemas.
- Análise causa raiz.
- Histórico eventos.

---

# Alta disponibilidade

Criar:

High Availability Architecture


Implementar:

- Redundância.
- Balanceamento.
- Recuperação automática.

---

# Escalabilidade

Criar:

Scaling Strategy


Preparar:

- Crescimento usuários.
- Crescimento estações.
- Crescimento transações.

---

# Banco de dados

Implementar:

Database Reliability


Garantir:

- Backup automático.
- Replicação.
- Recuperação.
- Monitoramento.

---

# Backup

Criar:

Backup Management


Controlar:

- Frequência.
- Retenção.
- Testes restauração.

---

# Disaster Recovery

Criar:

Disaster Recovery Plan


Definir:

- Cenários falha.
- Tempo recuperação.
- Procedimentos.

---

# Performance

Criar:

Performance Management


Medir:

- Tempo resposta API.
- Velocidade aplicação.
- Capacidade usuários simultâneos.

---

# Segurança infraestrutura

Implementar:

Infrastructure Security


Garantir:

- Gestão segredos.
- Controle acessos.
- Firewall.
- Proteção ambientes.

---

# Banco de Dados

Criar:

## InfrastructureResource

Campos:

- name
- type
- environment
- status


---

## Deployment

Campos:

- version
- environment
- timestamp


---

## Incident

Campos:

- type
- severity
- resolution

---

# API

Criar:

GET

/infrastructure/status


GET

/deployments/history


GET

/monitoring/alerts


GET

/incidents


POST

/deployments/rollback

---

# Dashboard DevOps

Criar:

DevOps Command Center


Mostrar:

- Status serviços.
- Deploys.
- Alertas.
- Performance.
- Incidentes.

---

# Segurança

Garantir:

- Acesso mínimo necessário.
- Auditoria completa.
- Proteção credenciais.
- Separação ambientes.

---

# Testes

Validar:

- Deploy automático.
- Recuperação falhas.
- Backup restauração.
- Alertas.
- Escalabilidade.

---

# Critério conclusão

O módulo está pronto quando:

✅ Plataforma possui infraestrutura produção.

✅ Deploy é seguro e repetível.

✅ Falhas podem ser detectadas rapidamente.

✅ Sistema consegue crescer.

---

# Entrega

Informar:

1. Arquitetura cloud.
2. Pipeline CI/CD.
3. Monitoramento.
4. Backup.
5. Plano recuperação.
6. Próximo módulo recomendado.