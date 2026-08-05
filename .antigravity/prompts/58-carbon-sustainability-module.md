# PROMPT 58 — CARBON CREDITS & SUSTAINABILITY MARKETPLACE MODULE

## Contexto

Você está implementando o módulo de sustentabilidade, métricas ESG e créditos ambientais da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ENERGY.md
- docs/ANALYTICS.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar uma camada de sustentabilidade capaz de medir impacto ambiental, gerar relatórios ESG e preparar integração com mercados de carbono.

---

# Conceito

Dados de recarga

↓

Cálculo emissões evitadas

↓

Métricas ambientais

↓

Relatórios

↓

Serviços sustentáveis

---

# Estrutura Backend

Criar:

```
modules/sustainability/

sustainability.module.ts

sustainability.controller.ts

sustainability.service.ts

carbon/

esg/

reports/

certificates/

marketplace/

tests/

```

---

# Cálculo carbono

Criar:

Carbon Calculator


Calcular:

- Energia consumida.
- Emissões evitadas.
- Comparação combustível fóssil.

---

# Exemplo:

Veículo elétrico:

1000 kWh consumidos

↓

Estimativa CO2 evitado

---

# Modelo Carbon Credit

Criar:

Carbon Credit Entity


Campos:

- id
- company_id
- amount
- source
- status

---

# Relatórios ESG

Criar:

ESG Reporting Engine


Gerar:

- CO2 evitado.
- Energia renovável utilizada.
- Impacto por empresa.
- Impacto por frota.

---

# Dashboard sustentabilidade

Criar:

/sustainability/dashboard


Mostrar:

- Carbono evitado.
- Árvores equivalentes.
- Economia ambiental.
- Histórico.

---

# Certificados

Criar:

Green Certificate


Permitir gerar:

- Certificado empresa.
- Certificado frota.
- Certificado posto.

---

# Marketplace sustentável

Criar:

Sustainability Marketplace


Preparar:

- Empresas compradoras.
- Parceiros ambientais.
- Serviços verdes.

---

# Integração energia limpa

Permitir registrar:

- Energia solar.
- Energia renovável.
- Origem energia.

---

# Ranking sustentável

Criar:

Green Score


Avaliar:

- Operadores.
- Empresas.
- Redes.

---

# Banco de Dados

Criar:

## CarbonRecord

Campos:

- id
- entity_id
- energy
- co2_saved
- timestamp


---

## SustainabilityReport

Campos:

- id
- company_id
- period
- metrics

---

# API

Criar:

GET

/sustainability/impact


GET

/sustainability/report


GET

/carbon/credits


POST

/sustainability/certificate

---

# Segurança

Garantir:

- Dados auditáveis.
- Cálculos rastreáveis.
- Histórico imutável.

---

# Testes

Validar:

- Cálculo carbono.
- Relatórios.
- Certificados.
- Métricas ESG.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Empresas medem impacto ambiental.

✅ Dados ESG são gerados.

✅ Plataforma possui novas oportunidades de receita.

---

# Entrega

Informar:

1. Métricas criadas.
2. Cálculos carbono.
3. Relatórios.
4. APIs.
5. Próximo módulo recomendado.