# PROMPT 35 — MARKETPLACE & ROAMING NETWORK MODULE

## Contexto

Você está implementando o módulo de marketplace e roaming da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/API.md
- docs/BUSINESS_MODEL.md
- docs/DATABASE.md

---

# Objetivo

Criar uma rede conectada de operadores de recarga permitindo interoperabilidade.

---

# Conceito

Vários operadores

↓

Rede EV Charge

↓

Motorista

↓

Uma única experiência

---

# Casos de uso

Permitir:

## Usuário

- Encontrar carregadores parceiros.
- Iniciar recarga em outra rede.
- Pagar pelo mesmo aplicativo.

---

## Operador

- Disponibilizar seus carregadores.
- Receber novos clientes.
- Compartilhar infraestrutura.

---

# Estrutura Backend

Criar:

```
modules/roaming/

roaming.module.ts

roaming.controller.ts

roaming.service.ts

partners/

agreements/

settlements/

tests/

```

---

# Banco de Dados

Criar:

## NetworkPartner

Campos:

- id
- company_id
- network_name
- status
- created_at

---

## RoamingAgreement

Campos:

- id
- partner_a
- partner_b
- commission_rule
- status
- created_at

---

## ExternalStation

Campos:

- id
- partner_id
- station_id
- external_identifier
- protocol

---

# Integrações

Preparar suporte para:

- OCPI.
- API externa.
- Webhooks.

---

# OCPI Preparation

Criar estrutura para:

Locations:

Disponibilizar postos.


Tokens:

Autenticação usuário.


Sessions:

Compartilhar recargas.


CDRs:

Compartilhar registros financeiros.

---

# Marketplace

Criar:

Station Marketplace


Mostrar:

- Postos parceiros.
- Disponibilidade.
- Preço.
- Potência.

---

# App Motorista

Adicionar:

Filtro:

"Todas as redes"


Mostrar:

- Próprios postos.
- Parceiros.

---

# Financeiro

Criar Settlement Engine


Calcular:

Exemplo:

Usuário carregou:

R$100


Posto parceiro:

Recebe R$90


Plataforma:

Recebe comissão.

---

# Dashboard Operador

Mostrar:

- Usuários externos atendidos.
- Receita roaming.
- Sessões compartilhadas.

---

# Dashboard Admin

Mostrar:

- Redes conectadas.
- Volume total.
- Receita da rede.

---

# Segurança

Implementar:

- Contratos digitais.
- Controle permissões.
- Logs de transações.

---

# Testes

Validar:

- Conectar parceiro.
- Importar estação.
- Iniciar sessão externa.
- Calcular repasse.
- Finalizar pagamento.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Diferentes operadores podem participar da rede.

✅ Usuário utiliza um único aplicativo.

✅ Repasse financeiro é calculado automaticamente.

---

# Entrega

Informar:

1. Integrações criadas.
2. Estrutura roaming.
3. Regras financeiras.
4. Como testar.
5. Próximo módulo recomendado.