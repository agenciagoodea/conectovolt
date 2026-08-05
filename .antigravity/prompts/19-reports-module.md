# PROMPT 19 — REPORTS MODULE

## Contexto

Você está implementando o módulo de relatórios da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/API.md
- docs/DATABASE.md
- docs/UX_FLOW.md

---

# Objetivo

Criar relatórios gerenciais para administradores e operadores.

O módulo deve transformar dados da plataforma em informações úteis.

---

# Conceito

Dados:

- Usuários.
- Empresas.
- Postos.
- Carregadores.
- Sessões.
- Pagamentos.
- Comissões.

↓

Relatórios

↓

Exportação

---

# Estrutura

Criar:

```
modules/reports/

reports.controller.ts

reports.service.ts

reports.module.ts

queries/

export/

dto/

tests/

```

---

# Tipos de relatórios

Criar:

---

# 1. Relatório de Recargas

Endpoint:

GET

/reports/charging


Informações:

- Data.
- Usuário.
- Veículo.
- Posto.
- Carregador.
- Energia kWh.
- Valor.
- Status.

Filtros:

- Data inicial.
- Data final.
- Empresa.
- Posto.

---

# 2. Relatório Financeiro

Endpoint:

GET

/reports/financial


Informações:

- Receita bruta.
- Comissão plataforma.
- Receita operador.
- Pagamentos aprovados.
- Pagamentos pendentes.

Filtros:

- Período.
- Empresa.

---

# 3. Relatório de Consumo

Endpoint:

GET

/reports/energy


Mostrar:

- kWh vendidos.
- Média por sessão.
- Média por usuário.
- Performance carregadores.

---

# 4. Relatório de Equipamentos

Endpoint:

GET

/reports/equipment


Mostrar:

- Total carregadores.
- Tempo online.
- Falhas.
- Utilização.

---

# Exportação

Criar suporte:

## Excel

Formato:

.xlsx


## PDF

Formato:

.pdf


---

# Estrutura export

Criar:

```
export/

excel.service.ts

pdf.service.ts

```

---

# Interface

Criar páginas:

Admin:

/admin/reports


Operador:

/operator/reports

---

# Componentes Frontend

Criar:

```
features/reports/

ReportFilters

ReportTable

ExportButton

ReportChart

```

---

# Filtros

Criar:

- Data.
- Empresa.
- Posto.
- Status.
- Tipo de relatório.

---

# Segurança

ADMIN:

Visualiza toda plataforma.


OPERATOR:

Visualiza somente seus dados.


CUSTOMER:

Sem acesso.

---

# Performance

Preparar:

- Paginação.
- Consultas agregadas.
- Cache futuro.

---

# Testes

Validar:

- Gerar relatório.
- Aplicar filtros.
- Exportar Excel.
- Exportar PDF.
- Controle de permissões.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Admin gera relatórios.

✅ Operador acompanha desempenho.

✅ Dados financeiros conferem.

✅ Exportação funciona.

---

# Entrega

Informar:

1. Arquivos criados.
2. Endpoints.
3. Formatos disponíveis.
4. Como testar.
5. Próximo módulo recomendado.