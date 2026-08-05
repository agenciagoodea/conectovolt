# PROMPT 25 — BACKUP, STORAGE & INFRASTRUCTURE MODULE

## Contexto

Você está preparando a EV Charge Platform para ambiente de produção.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/DATABASE.md
- docs/API.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar uma arquitetura segura para hospedar, armazenar e manter a plataforma.

---

# Ambientes

Criar três ambientes:

## Development

Uso local.

---

## Staging

Testes antes da produção.

---

## Production

Ambiente real.

---

# Infraestrutura

Preparar:

Backend:

Node.js


Frontend:

Next.js


Mobile:

Flutter


Database:

PostgreSQL


Cache:

Redis


Storage:

Object Storage

---

# Estrutura

Criar:

```
infra/

docker/

docker-compose.yml

nginx/

monitoring/

backup/

scripts/

```

---

# Docker

Criar containers:

## Backend

API.

---

## Frontend

Aplicação web.

---

## Database

PostgreSQL.

---

## Redis

Cache e filas.

---

# Variáveis de ambiente

Criar:

.env.example


Separar:

DATABASE_URL

JWT_SECRET

REDIS_URL

STORAGE_KEY

PAYMENT_KEY

OCPP_CONFIG

---

# Storage

Criar serviço:

StorageService


Responsável por:

- Upload.
- Download.
- Remoção.
- Controle acesso.

---

# Arquivos suportados

Preparar:

## Empresas

- Logo.
- Documentos.


## Postos

- Fotos.
- Imagens.


## Usuários

- Avatar.


## Relatórios

- PDFs.
- Excel.

---

# Banco de Dados

Adicionar controle:

FileAsset


Campos:

- id
- owner_id
- type
- path
- size
- created_at

---

# Backup

Criar estratégia:

## Banco

Backup diário.

---

## Arquivos

Backup periódico.

---

## Logs

Retenção configurável.

---

# Segurança

Implementar:

- Arquivos privados.
- URLs temporárias.
- Validação de tamanho.
- Validação de tipo.

---

# Deploy

Preparar:

## Backend

Build automático.


## Frontend

Build automático.


## Mobile

Pipeline futuro.

---

# CI/CD

Criar preparação:

GitHub Actions


Fluxo:

Push

↓

Testes

↓

Build

↓

Deploy

---

# Monitoramento

Preparar:

Monitorar:

- CPU.
- Memória.
- Banco.
- Erros API.
- WebSocket.
- OCPP.

---

# Logs

Centralizar:

- Backend.
- Pagamentos.
- OCPP.
- Segurança.

---

# Testes

Validar:

- Subir ambiente Docker.
- Restaurar backup.
- Upload arquivo.
- Variáveis ambiente.
- Deploy staging.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Ambiente pode ser replicado.

✅ Dados possuem backup.

✅ Arquivos possuem armazenamento.

✅ Deploy é previsível.

---

# Entrega

Informar:

1. Arquivos criados.
2. Infraestrutura configurada.
3. Como executar local.
4. Como publicar.
5. Próximo módulo recomendado.