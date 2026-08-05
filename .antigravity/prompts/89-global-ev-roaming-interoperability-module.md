# PROMPT 89 — GLOBAL EV ROAMING & INTEROPERABILITY MODULE

## Contexto

Você está implementando a camada global de interoperabilidade da EV Charge Platform.

Este módulo permite que usuários carreguem veículos em diferentes redes e países usando uma única identidade digital.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/GLOBALIZATION.md
- docs/CHARGING_CORE.md
- docs/API_ECOSYSTEM.md

---

# Objetivo

Criar uma rede global de roaming para conectar diferentes operadores de carregamento.

---

# Conceito

Motorista

↓

Conta EV Charge

↓

Rede EV Charge

↓

Parceiros globais

↓

Carregamento universal

---

# Estrutura Backend

Criar:

```
modules/roaming/

roaming.module.ts

roaming.controller.ts

roaming.service.ts

partners/

protocols/

settlement/

identity/

tests/

```

---

# Identidade global motorista

Criar:

Global EV Identity


Permitir:

- Usuário único.
- Perfil internacional.
- Histórico global.

---

# Integração operadores

Criar:

Charging Network Connector


Conectar:

- Redes públicas.
- Operadores privados.
- Parceiros internacionais.

---

# Protocolos

Suportar:

- OCPI.
- OCPP.
- APIs proprietárias.

---

# Disponibilidade global

Criar:

Global Station Discovery


Mostrar:

- Estações parceiras.
- Status.
- Preço.
- Compatibilidade.

---

# Roaming de pagamento

Criar:

Roaming Settlement Engine


Controlar:

- Cobrança usuário.
- Repasse operador.
- Taxas internacionais.

---

# Tarifação internacional

Criar:

Global Pricing Engine


Considerar:

- Moeda local.
- Impostos.
- Conversão.
- Tarifas operador.

---

# Histórico global

Criar:

Charging Passport


Registrar:

- País.
- Estação.
- Energia.
- Valor.

---

# Gestão parceiros

Criar:

Roaming Partner Portal


Permitir:

- Cadastro rede.
- Configuração contrato.
- Monitoramento.

---

# Banco de Dados

Criar:

## RoamingPartner

Campos:

- id
- operator
- country
- status


---

## GlobalSession

Campos:

- user_id
- station
- country
- energy


---

## Settlement

Campos:

- operator
- amount
- currency

---

# API

Criar:

GET

/roaming/stations


POST

/roaming/session/start


GET

/roaming/history


POST

/roaming/settlement

---

# Dashboard Global

Criar:

Roaming Control Center


Mostrar:

- Países conectados.
- Operadores parceiros.
- Sessões internacionais.
- Receita roaming.

---

# Segurança

Implementar:

- Identidade segura.
- Autorização internacional.
- Auditoria financeira.

---

# Testes

Validar:

- Usuário carregar fora da rede.
- Pagamento internacional.
- Repasse operador.
- Histórico global.

---

# Critério conclusão

O módulo está pronto quando:

✅ Usuário consegue carregar em múltiplas redes.

✅ Operadores conseguem compartilhar infraestrutura.

✅ Plataforma funciona internacionalmente.

---

# Entrega

Informar:

1. Redes conectadas.
2. Protocolos.
3. Pagamentos roaming.
4. APIs.
5. Próximo módulo recomendado.