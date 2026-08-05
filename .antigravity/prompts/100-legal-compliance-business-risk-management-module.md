# PROMPT 100 — LEGAL, COMPLIANCE & BUSINESS RISK MANAGEMENT MODULE

## Contexto

Você está criando a estrutura jurídica, regulatória e de gestão de riscos da EV Charge Platform.

O objetivo é proteger a empresa, clientes, parceiros e usuários durante o crescimento.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/SECURITY.md
- docs/BUSINESS_MODEL.md
- docs/GLOBALIZATION.md

---

# Objetivo

Criar um sistema completo de compliance, contratos e gerenciamento de riscos empresariais.

---

# Conceito

Operação

↓

Riscos

↓

Controle

↓

Conformidade

↓

Empresa protegida

---

# Estrutura Backend

Criar:

```
modules/legal-compliance/

contracts/

privacy/

compliance/

risk-management/

policies/

audit/

tests/

```

---

# Gestão contratos

Criar:

Contract Management System


Controlar:

- Clientes.
- Operadores.
- Parceiros.
- Fornecedores.

---

# Tipos contratos

Criar modelos:

## Cliente

- SaaS.
- Licenciamento.
- Uso plataforma.


## Operador

- Gestão carregadores.
- Repasse financeiro.


## Parceiros

- Integração.
- Comissão.


## Enterprise

- Contratos personalizados.

---

# Termos plataforma

Criar:

Legal Documents Management


Documentos:

- Termos de uso.
- Política privacidade.
- Contratos serviço.
- Política pagamentos.

---

# Privacidade dados

Criar:

Privacy Management


Controlar:

- Dados coletados.
- Consentimentos.
- Solicitações usuários.

---

# LGPD Compliance

Implementar:

Privacy Framework


Permitir:

- Consentimento.
- Exclusão dados.
- Exportação dados.
- Controle finalidade.

---

# Gestão riscos

Criar:

Risk Management System


Mapear:

- Operacionais.
- Financeiros.
- Técnicos.
- Jurídicos.

---

# Matriz riscos

Criar:

Risk Matrix


Classificar:

- Probabilidade.
- Impacto.
- Prioridade.

---

# Compliance operacional

Criar:

Compliance Rules Engine


Monitorar:

- Processos internos.
- Regras negócio.
- Obrigações.

---

# Auditoria

Criar:

Compliance Audit


Registrar:

- Alterações contratos.
- Aprovações.
- Eventos críticos.

---

# Gestão seguros

Criar:

Insurance Management


Controlar:

- Apólices.
- Coberturas.
- Validades.

---

# Fornecedores

Criar:

Vendor Management


Controlar:

- Empresas terceiras.
- Avaliações.
- Contratos.

---

# Dashboard compliance

Criar:

Compliance Center


Mostrar:

- Contratos ativos.
- Riscos.
- Auditorias.
- Pendências.

---

# Banco de Dados

Criar:

## Contract

Campos:

- type
- customer
- status


---

## ComplianceRecord

Campos:

- category
- status
- date


---

## Risk

Campos:

- description
- impact
- probability

---

# API

Criar:

GET

/legal/contracts


POST

/legal/contracts


GET

/compliance/status


GET

/risk/dashboard

---

# Segurança

Implementar:

- Controle documentos.
- Permissões jurídicas.
- Auditoria completa.

---

# Testes

Validar:

- Criar contrato.
- Registrar consentimento.
- Criar risco.
- Gerar auditoria.

---

# Critério conclusão

O módulo está pronto quando:

✅ Empresa possui proteção jurídica.

✅ Dados possuem conformidade.

✅ Riscos são monitorados.

---

# Entrega

Informar:

1. Contratos.
2. Compliance.
3. Privacidade.
4. Gestão riscos.
5. Próximo módulo recomendado.