# PROMPT 83 — MARKETPLACE & PARTNER ECOSYSTEM MODULE

## Contexto

Você está implementando o ecossistema de parceiros e marketplace da EV Charge Platform.

Este módulo permite conectar empresas externas aos usuários da plataforma.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/USER_EXPERIENCE.md
- docs/PARTNERS.md

---

# Objetivo

Criar uma plataforma de marketplace para serviços relacionados à mobilidade elétrica.

---

# Conceito

Parceiro

↓

Marketplace

↓

Usuário

↓

Serviço

↓

Receita adicional

---

# Estrutura Backend

Criar:

```
modules/marketplace/

marketplace.module.ts

marketplace.controller.ts

marketplace.service.ts

partners/

services/

offers/

payments/

reviews/

tests/

```

---

# Gestão parceiros

Criar:

Partner Management


Permitir:

- Cadastro empresa.
- Aprovação.
- Perfil parceiro.
- Contratos.

---

# Tipos parceiros

Suportar:

## Automotivo

- Montadoras.
- Concessionárias.
- Oficinas.


## Energia

- Empresas solares.
- Integradores energia.


## Serviços

- Seguro.
- Assistência.
- Manutenção.


## Mobilidade

- Locação.
- Compartilhamento.

---

# Perfil parceiro

Criar:

Partner Entity


Campos:

- id
- company_name
- category
- status
- rating

---

# Catálogo serviços

Criar:

Service Catalog


Permitir:

- Criar oferta.
- Definir preço.
- Disponibilidade.

---

# Marketplace usuário

Criar:

Marketplace Screen


Mostrar:

- Serviços próximos.
- Promoções.
- Benefícios.

---

# Sistema ofertas

Criar:

Offer Engine


Permitir:

- Cupons.
- Descontos.
- Campanhas.

---

# Avaliações

Criar:

Partner Review System


Permitir:

- Nota.
- Comentário.
- Feedback.

---

# Pagamentos marketplace

Integrar:

Payment Module


Permitir:

- Compra serviço.
- Comissão plataforma.
- Repasse parceiro.

---

# Programa benefícios

Criar:

EV Rewards System


Permitir:

- Pontos.
- Cashback.
- Benefícios.

---

# Analytics parceiros

Criar:

Partner Analytics


Mostrar:

- Vendas.
- Conversões.
- Receita.
- Avaliações.

---

# Banco de Dados

Criar:

## Partner

Campos:

- id
- name
- category
- status


---

## MarketplaceService

Campos:

- partner_id
- title
- price


---

## Offer

Campos:

- service_id
- discount
- expiration

---

# API

Criar:

POST

/partners


GET

/marketplace/services


POST

/marketplace/order


GET

/partners/analytics

---

# Dashboard parceiro

Criar:

Partner Portal


Mostrar:

- Serviços.
- Clientes.
- Receita.
- Performance.

---

# Segurança

Implementar:

- Aprovação parceiros.
- Controle contratos.
- Auditoria.

---

# Testes

Validar:

- Criar parceiro.
- Publicar serviço.
- Comprar serviço.
- Gerar comissão.

---

# Critério conclusão

O módulo está pronto quando:

✅ Empresas podem participar do ecossistema.

✅ Usuários acessam serviços adicionais.

✅ Plataforma cria novas fontes de receita.

---

# Entrega

Informar:

1. Marketplace criado.
2. Parceiros.
3. Serviços.
4. Pagamentos.
5. Próximo módulo recomendado.