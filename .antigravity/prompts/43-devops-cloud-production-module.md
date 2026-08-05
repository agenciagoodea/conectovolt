# PROMPT 43 — DEVOPS, CLOUD INFRASTRUCTURE & PRODUCTION SCALE MODULE

## Contexto

Você está implementando a infraestrutura de produção da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/SECURITY.md
- docs/API.md

---

# Objetivo

Criar uma infraestrutura segura, escalável e preparada para crescimento.

---

# Arquitetura Cloud

Criar ambientes:

```
Development

↓

Staging

↓

Production
```

---

# Infraestrutura

Preparar:

Backend API

Frontend Web

Mobile Backend

Database

Cache

Storage

Queue

Monitoring

---

# Containerização

Implementar:

Docker


Criar:

```
Dockerfile

docker-compose.yml

.env.example
```

---

# Serviços

Containerizar:

- API Backend.
- Frontend.
- Worker Jobs.
- Database.
- Redis.
- Message Queue.

---

# Banco de dados

Produção:

Configurar:

- Backup automático.
- Replicação.
- Segurança.
- Migrações controladas.

---

# Cache

Implementar:

Redis


Uso:

- Sessões.
- Cache consultas.
- Filas.

---

# Filas assíncronas

Criar:

Queue System


Processos:

- Relatórios.
- Notificações.
- Webhooks.
- Jobs financeiros.

---

# CI/CD

Criar pipeline:

```
Código enviado

↓

Testes automáticos

↓

Build

↓

Deploy

↓

Monitoramento
```

---

# Controle de versão

Implementar:

Git Flow


Branches:

```
main

develop

feature/*

hotfix/*
```

---

# Deploy automático

Preparar:

Quando aprovado:

Deploy staging.

Após validação:

Deploy produção.

---

# Segurança

Implementar:

- Secrets Manager.
- Variáveis ambiente.
- HTTPS.
- Firewall.
- Proteção API.

---

# Monitoramento

Criar:

Observability Module


Monitorar:

## Aplicação

- Erros.
- Latência.
- Requisições.


## Infraestrutura

- CPU.
- Memória.
- Disco.
- Rede.


## Negócio

- Recargas.
- Pagamentos.
- Falhas.

---

# Logs

Criar:

Centralização:

- Backend logs.
- OCPP logs.
- Pagamento logs.
- Auditoria.

---

# Alertas

Criar:

Enviar alerta quando:

- API fora.
- Banco indisponível.
- Muitos erros.
- Carregadores offline.

---

# Escalabilidade

Preparar:

Horizontal scaling


Permitir:

Adicionar novas instâncias.

---

# Load Balancer

Configurar:

Distribuição:

Usuários

↓

Servidores

---

# Backup

Criar política:

Banco:

Diário.

Arquivos:

Backup automático.

---

# Disaster Recovery

Definir:

Plano:

Falha servidor

↓

Restaurar ambiente

↓

Retomar operação

---

# Documentação

Criar:

docs/INFRASTRUCTURE.md


Documentar:

- Arquitetura.
- Deploy.
- Backup.
- Recuperação.

---

# Testes

Validar:

- Deploy automático.
- Backup.
- Restore.
- Escalabilidade.
- Monitoramento.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Sistema roda em produção.

✅ Deploy é automatizado.

✅ Falhas são monitoradas.

✅ Existe plano de recuperação.

---

# Entrega

Informar:

1. Arquitetura criada.
2. Infraestrutura.
3. Pipeline.
4. Monitoramento.
5. Próximo módulo recomendado.