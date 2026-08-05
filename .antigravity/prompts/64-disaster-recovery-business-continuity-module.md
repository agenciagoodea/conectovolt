# PROMPT 64 — DISASTER RECOVERY & BUSINESS CONTINUITY MODULE

## Contexto

Você está implementando a estratégia de continuidade de negócio e recuperação de desastres da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/INFRASTRUCTURE.md
- docs/SECURITY.md
- docs/ARCHITECTURE.md

---

# Objetivo

Criar uma arquitetura resiliente capaz de manter a plataforma funcionando durante falhas críticas.

---

# Conceito

Prevenção

↓

Detecção

↓

Recuperação

↓

Continuidade

---

# Estrutura Backend

Criar:

```
modules/business-continuity/

disaster-recovery/

backup/

failover/

monitoring/

incident-response/

tests/

```

---

# Estratégia Backup

Criar:

Backup Management


Garantir:

- Banco de dados.
- Arquivos.
- Configurações.
- Dados críticos.

---

# Política backup

Definir:

- Backup diário.
- Backup incremental.
- Retenção.
- Teste restauração.

---

# Disaster Recovery

Criar:

Recovery Plan


Definir:

- Sistemas críticos.
- Ordem recuperação.
- Responsáveis.
- Procedimentos.

---

# Alta disponibilidade

Implementar:

High Availability


Preparar:

- Múltiplas instâncias.
- Balanceamento.
- Redundância.

---

# Failover automático

Criar:

Failover System


Detectar:

- Servidor indisponível.
- Banco indisponível.
- Serviço crítico parado.

---

# Monitoramento

Criar:

System Health Monitoring


Monitorar:

- API.
- Banco.
- Filas.
- Integrações.
- Carregadores.

---

# Alertas críticos

Enviar:

- Falha serviço.
- Queda disponibilidade.
- Erro pagamento.
- Problema infraestrutura.

---

# Plano RTO/RPO

Definir:

## RTO

Tempo máximo recuperação.


## RPO

Quantidade máxima perda dados.

---

# Ambiente emergência

Criar:

Disaster Environment


Preparar:

- Infraestrutura reserva.
- Configurações.
- Acesso emergência.

---

# Testes recuperação

Executar:

- Restaurar backup.
- Simular falha.
- Validar retorno.

---

# Comunicação incidente

Criar:

Incident Communication Plan


Definir:

- Equipe técnica.
- Clientes.
- Parceiros.

---

# Banco de Dados

Criar:

## BackupRecord

Campos:

- id
- type
- size
- status
- created_at


---

## IncidentRecord

Campos:

- id
- severity
- cause
- resolution

---

# Dashboard operações

Criar:

/operations/health


Mostrar:

- Status serviços.
- Disponibilidade.
- Incidentes.
- Backup.

---

# API

Criar:

GET

/system/status


GET

/backups


POST

/recovery/test


GET

/incidents

---

# Segurança

Garantir:

- Backups criptografados.
- Acesso restrito.
- Auditoria.

---

# Testes

Validar:

- Criar backup.
- Restaurar sistema.
- Executar failover.
- Registrar incidente.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Plataforma possui recuperação.

✅ Falhas não interrompem negócio.

✅ Operação possui plano de continuidade.

---

# Entrega

Informar:

1. Estratégia recuperação.
2. Backups.
3. Alta disponibilidade.
4. Testes.
5. Próximo módulo recomendado.