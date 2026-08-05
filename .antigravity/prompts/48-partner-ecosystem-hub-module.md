# PROMPT 48 — PARTNER ECOSYSTEM & INTEGRATION HUB MODULE

## Contexto

Você está implementando o Hub de Ecossistema e Integrações da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/BUSINESS_MODEL.md
- docs/ARCHITECTURE.md

---

# Objetivo

Criar uma camada central para conectar parceiros externos e serviços complementares.

---

# Conceito

Parceiro

↓

Integration Hub

↓

APIs

↓

Serviços da plataforma

---

# Estrutura Backend

Criar:

```
modules/integrations/

integrations.module.ts

integrations.controller.ts

integrations.service.ts

connectors/

marketplace/

webhooks/

credentials/

tests/

```

---

# Tipos de parceiros

Criar categorias:

---

## Fabricantes de carregadores

Integrações:

- Status equipamento.
- Telemetria.
- Firmware.
- Comandos.

---

## Empresas de energia

Integrações:

- Tarifas.
- Consumo.
- Créditos energia.

---

## Pagamentos

Integrações:

- Gateway.
- Bancos.
- PIX.

---

## Empresas frota

Integrações:

- Veículos.
- Motoristas.
- Consumo.

---

## Seguradoras

Integrações:

- Dados de uso.
- Benefícios.
- Serviços.

---

# Cadastro parceiro

Criar:

PartnerIntegration


Campos:

- id
- name
- category
- status
- api_url
- created_at

---

# Conectores

Criar:

Connector Framework


Permitir:

Adicionar novos conectores sem alterar núcleo.

---

# Credenciais

Criar:

IntegrationCredential


Campos:

- id
- partner_id
- key
- secret
- expires_at

---

# Webhooks

Criar:

Webhook Manager


Eventos:

- Recarga iniciada.
- Recarga finalizada.
- Falha equipamento.
- Pagamento aprovado.

---

# Marketplace de integrações

Criar:

Integration Store


Mostrar:

- Integrações disponíveis.
- Status.
- Configuração.

---

# Portal parceiro

Criar:

/partner/integrations


Permitir:

- Criar conexão.
- Gerar chave.
- Consultar uso.

---

# Documentação

Criar:

Developer Portal


Disponibilizar:

- APIs.
- Exemplos.
- Webhooks.
- Guias.

---

# Monitoramento

Registrar:

- Chamadas API.
- Erros.
- Tempo resposta.

---

# Segurança

Implementar:

- OAuth.
- API Keys.
- Permissões.
- Rotação credenciais.

---

# Banco de Dados

Criar:

## Integration

Campos:

- id
- partner_id
- type
- status

---

## IntegrationLog

Campos:

- id
- integration_id
- event
- response
- timestamp

---

# Dashboard Admin

Criar:

/admin/integrations


Mostrar:

- Parceiros ativos.
- Integrações.
- Erros.
- Uso.

---

# API

Criar:

GET

/integrations


POST

/integrations/connect


DELETE

/integrations/:id


GET

/integrations/logs

---

# Testes

Validar:

- Criar parceiro.
- Conectar API.
- Receber webhook.
- Registrar erro.
- Revogar acesso.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Novos parceiros podem integrar.

✅ Plataforma possui arquitetura aberta.

✅ Ecossistema pode crescer.

---

# Entrega

Informar:

1. Integrações criadas.
2. Arquitetura conectores.
3. APIs.
4. Segurança.
5. Próximo módulo recomendado.