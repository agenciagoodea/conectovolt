# PROMPT 54 — GLOBAL EXPANSION & INTERNATIONALIZATION MODULE

## Contexto

Você está preparando a ConectoVolt para operar em múltiplos países.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/BUSINESS_MODEL.md
- docs/LEGAL.md

---

# Objetivo

Criar uma arquitetura internacional preparada para expansão global.

---

# Conceito

Uma plataforma

↓

Múltiplos países

↓

Múltiplas moedas

↓

Múltiplas regras

---

# Estrutura Backend

Criar:

```
modules/global-expansion/

internationalization/

currencies/

taxes/

localization/

countries/

compliance/

tests/
```

---

# Multi idioma

Suportar:

- Português.
- Inglês.
- Espanhol.

Preparar arquitetura para novos idiomas.

---

# Moedas

Criar:

Currency Engine


Suportar:

- BRL.
- USD.
- EUR.

Permitir conversão.

---

# Formatação regional

Adaptar:

- Datas.
- Horários.
- Números.
- Unidades.

---

# Fusos horários

Implementar:

Timezone Management


Cada operação possui:

- País.
- Região.
- Horário local.

---

# Impostos

Criar:

Tax Engine


Permitir:

Regras diferentes por país.

---

# Regulamentações locais

Criar:

Compliance Rules


Controlar:

- Documentos.
- Contratos.
- Operação.

---

# Configuração país

Criar:

Country Settings


Campos:

- country
- currency
- timezone
- tax_rules
- language

---

# Dashboard Global

Criar:

/global/dashboard


Mostrar:

- Países ativos.
- Receita por região.
- Usuários.
- Postos.

---

# Banco de Dados

Criar:

## Country

Campos:

- id
- name
- code
- active


---

## Currency

Campos:

- code
- symbol
- exchange_rate


---

# API

Criar:

GET

/global/countries


GET

/global/currencies


PATCH

/global/settings


---

# Segurança

Garantir:

Cada país possui regras próprias.

Dados seguem legislação aplicável.

---

# Testes

Validar:

- Troca idioma.
- Conversão moeda.
- Regras país.
- Fuso horário.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Plataforma suporta múltiplos países.

✅ Operações locais funcionam.

✅ Expansão pode acontecer sem reconstrução.

---

# Entrega

Informar:

1. Países suportados.
2. Configurações criadas.
3. APIs.
4. Testes.
5. Próximo módulo recomendado.