# PROMPT 79 — ESG & CARBON IMPACT MANAGEMENT MODULE

## Contexto

Você está implementando o módulo de sustentabilidade e impacto ambiental da EV Charge Platform.

Este módulo transforma dados de carregamento elétrico em indicadores ESG.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/FLEET.md
- docs/ENERGY.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar um sistema de monitoramento ambiental capaz de calcular impacto positivo da mobilidade elétrica.

---

# Conceito

Recarga elétrica

↓

Energia utilizada

↓

Comparação combustível fóssil

↓

CO₂ evitado

↓

Relatório ESG

---

# Estrutura Backend

Criar:

```
modules/esg/

esg.module.ts

esg.controller.ts

esg.service.ts

carbon/

reports/

metrics/

sustainability/

credits/

tests/

```

---

# Motor cálculo carbono

Criar:

Carbon Impact Engine


Calcular:

- CO₂ evitado.
- Combustível substituído.
- Energia limpa utilizada.

---

# Modelo Carbon Impact

Criar:

CarbonRecord Entity


Campos:

- id
- user_id
- company_id
- energy_consumed
- carbon_saved
- created_at

---

# Cálculo impacto

Considerar:

- kWh utilizados.
- Emissão média combustível.
- Eficiência veículo.
- Matriz energética.

---

# Indicadores ESG

Criar:

ESG Metrics


Métricas:

## Ambiental

- CO₂ evitado.
- Energia renovável.
- Redução combustível.


## Social

- Acesso mobilidade elétrica.
- Desenvolvimento sustentável.


## Governança

- Transparência.
- Auditoria dados.

---

# Dashboard ESG

Criar:

/esg/dashboard


Mostrar:

- Carbono evitado.
- Impacto mensal.
- Comparativos.
- Evolução.

---

# Relatórios corporativos

Criar:

ESG Report Generator


Gerar:

- Relatórios mensais.
- Relatórios anuais.
- Indicadores empresariais.

---

# Integração frotas

Conectar:

Fleet Module


Mostrar:

- Economia CO₂ frota.
- Meta sustentabilidade.
- Progresso.

---

# Créditos de carbono

Preparar:

Carbon Credit Module


Permitir:

- Registro impacto.
- Rastreamento.
- Integração futura mercados carbono.

---

# Energia renovável

Criar:

Renewable Energy Tracking


Registrar:

- Origem energia.
- Percentual renovável.
- Certificados.

---

# Banco de Dados

Criar:

## ESGMetric

Campos:

- id
- company_id
- metric
- value


---

## CarbonRecord

Campos:

- energy
- carbon_saved
- timestamp


---

# API

Criar:

GET

/esg/impact


GET

/esg/reports


POST

/esg/carbon-calculate


GET

/esg/metrics

---

# Dashboard empresa

Adicionar:

ESG Section


Mostrar:

- Impacto ambiental.
- Metas.
- Relatórios.

---

# Segurança

Garantir:

- Dados auditáveis.
- Histórico cálculos.
- Transparência.

---

# Testes

Validar:

- Calcular CO₂.
- Gerar relatório.
- Consultar indicadores.
- Integrar frota.

---

# Critério conclusão

O módulo está pronto quando:

✅ Plataforma mede impacto ambiental.

✅ Empresas conseguem gerar relatórios ESG.

✅ Dados sustentam decisões sustentáveis.

---

# Entrega

Informar:

1. Motor carbono.
2. Métricas ESG.
3. Relatórios.
4. APIs.
5. Próximo módulo recomendado.