# PROMPT 31 — API MARKETPLACE & PARTNERS MODULE

## Contexto

Você está implementando a camada de integrações externas da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/BUSINESS_MODEL.md
- docs/DATABASE.md

---

# Objetivo

Criar uma plataforma de APIs para permitir integrações com parceiros externos.

---

# Conceito

Parceiro externo

↓

API Key

↓

Permissões

↓

Dados autorizados

↓

Serviços EV Charge

---

# Casos de uso

Permitir integração com:

## Empresas de frota

Exemplo:

- acompanhar veículos.
- consultar consumo.
- controlar custos.

---

## Aplicativos parceiros

Exemplo:

- mostrar postos disponíveis.
- iniciar recarga.

---

## Empresas corporativas

Exemplo:

- relatórios de funcionários.
- controle de gastos.

---

# Estrutura Backend

Criar:

```
modules/partners/

partners.module.ts

partners.controller.ts

partners.service.ts

api-keys/

permissions/

webhooks/

tests/

```

---

# Banco de Dados

Criar:

## Partner

Campos:

- id
- name
- email
- status
- created_at

---

## ApiKey

Campos:

- id
- partner_id
- key_hash
- permissions
- expires_at
- created_at

---

## Webhook

Campos:

- id
- partner_id
- url
- event
- active

---

# API Gateway

Criar controle:

- Autenticação API Key.
- Rate limit.
- Logs.
- Permissões.

---

# APIs públicas

Criar versão:

/api/v1/

---

# Endpoints disponíveis

## Postos

GET

/api/v1/stations


Retornar:

- Nome.
- Localização.
- Status.
- Disponibilidade.

---

## Carregadores

GET

/api/v1/chargers


Retornar:

- Potência.
- Tipo.
- Status.

---

## Sessões

GET

/api/v1/sessions


Permissão:

Parceiros autorizados.

---

## Usuários frota

GET

/api/v1/fleet/users

---

# Webhooks

Criar eventos:

## ChargingStarted

Enviar:

- Sessão.
- Usuário.
- Posto.

---

## ChargingFinished

Enviar:

- Energia.
- Valor.

---

## PaymentCompleted

Enviar:

- Status pagamento.

---

# Portal do parceiro

Criar:

/partner/dashboard


Mostrar:

- APIs utilizadas.
- Chaves.
- Consumo.
- Documentação.

---

# Documentação API

Criar:

Swagger público:

/api/docs


Com:

- Endpoints.
- Exemplos.
- Autenticação.

---

# Segurança

Implementar:

- API Key rotativa.
- Expiração.
- Permissões.
- Logs de acesso.

---

# Monitoramento

Registrar:

- Requisições.
- Erros.
- Latência.
- Consumo API.

---

# Testes

Validar:

- Criar parceiro.
- Gerar API Key.
- Consumir API.
- Bloquear sem permissão.
- Webhook enviado.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Parceiros conseguem integrar.

✅ APIs possuem segurança.

✅ Plataforma suporta ecossistema.

---

# Entrega

Informar:

1. APIs criadas.
2. Modelo de parceiros.
3. Sistema de permissões.
4. Como testar.
5. Próximo módulo recomendado.