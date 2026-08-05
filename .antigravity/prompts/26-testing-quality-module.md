# PROMPT 26 — TESTING & QUALITY ASSURANCE MODULE

## Contexto

Você está implementando a estratégia de testes da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/DATABASE.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar uma estratégia completa de qualidade para garantir estabilidade da plataforma.

---

# Tipos de testes

Implementar:

1. Unit Tests

2. Integration Tests

3. API Tests

4. End-to-End Tests

5. Performance Tests

6. Security Tests

---

# Estrutura

Criar:

```
tests/

unit/

integration/

e2e/

performance/

security/

fixtures/

```

---

# Backend Tests

Criar testes para:

---

## Autenticação

Validar:

- Cadastro.
- Login.
- Token.
- Refresh token.
- Permissões.

---

## Empresas

Validar:

- Criação.
- Aprovação.
- Isolamento de dados.

---

## Postos

Validar:

- Cadastro.
- Associação empresa.
- Limites do plano.

---

## Carregadores

Validar:

- Cadastro.
- Status.
- Integração OCPP.

---

## Recargas

Validar:

- Início.
- Atualização.
- Finalização.
- Cálculo.

---

## Pagamentos

Validar:

- PIX.
- Cartão.
- Aprovação.
- Falha.

---

## Comissão SaaS

Validar:

Exemplo:

Recarga:

R$200


Comissão:

5%


Sistema gera:

R$10 plataforma.

---

# Testes OCPP

Criar simulador:

Charger Simulator


Testar:

- BootNotification.
- StatusNotification.
- StartTransaction.
- MeterValues.
- StopTransaction.

---

# Frontend Tests

Validar:

## Admin

- Login.
- Dashboard.
- Relatórios.

---

## Operador

- Dados isolados.
- Financeiro.
- Postos.

---

# Mobile Tests

Validar:

- Cadastro.
- Login.
- Mapa.
- Escolha posto.
- Recarga.
- Pagamento.
- Histórico.

---

# Performance

Testar:

## API

Carga:

1000 usuários simultâneos.


## WebSocket

Testar:

500 conexões.


## OCPP

Testar:

100 carregadores conectados.

---

# Segurança

Testar:

- Acesso sem token.
- Usuário acessando dados de outro.
- Tentativas login.
- Manipulação API.

---

# CI/CD

Integrar testes:

Fluxo:

Commit

↓

Testes

↓

Build

↓

Deploy staging

---

# Checklist antes produção

Criar:

## Backend

☐ Testes passando

☐ Banco validado

☐ Logs funcionando


## Frontend

☐ Responsivo

☐ Permissões funcionando


## Mobile

☐ Publicação preparada


## Financeiro

☐ Cálculo conferido


## OCPP

☐ Comunicação validada

---

# Critério de conclusão

O módulo está pronto quando:

✅ Código possui cobertura de testes.

✅ Fluxos críticos validados.

✅ Deploy possui validação automática.

---

# Entrega

Informar:

1. Testes criados.
2. Cobertura.
3. Como executar.
4. Resultado.
5. Próximo módulo recomendado.