# PROMPT 94 — CUSTOMER SUCCESS & SCALING OPERATIONS MODULE

## Contexto

Você está criando a operação de Customer Success da ConectoVolt.

O objetivo é garantir satisfação dos clientes, retenção, expansão e crescimento sustentável.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/PILOT_DEPLOYMENT.md
- docs/BUSINESS_MODEL.md
- docs/SALES.md

---

# Objetivo

Criar uma operação profissional para acompanhar clientes após implantação.

---

# Conceito

Venda

↓

Implantação

↓

Sucesso cliente

↓

Expansão

↓

Renovação

---

# Estrutura Backend

Criar:

```
modules/customer-success/

accounts/

health-score/

onboarding/

engagement/

renewals/

expansion/

analytics/

tests/

```

---

# Gestão clientes

Criar:

Customer Account Management


Controlar:

- Empresas.
- Contratos.
- Plano contratado.
- Histórico relacionamento.

---

# Customer Health Score

Criar:

Customer Health Engine


Avaliar:

- Uso plataforma.
- Número sessões.
- Receita.
- Chamados suporte.
- Satisfação.

Classificar:

- Saudável.
- Atenção.
- Risco.

---

# Onboarding contínuo

Criar:

Customer Journey


Etapas:

1. Implantação.
2. Treinamento.
3. Primeiro uso.
4. Acompanhamento.
5. Expansão.

---

# Monitoramento uso

Criar:

Usage Analytics


Medir:

- Frequência uso.
- Usuários ativos.
- Estações utilizadas.
- Receita gerada.

---

# Sucesso operador

Criar:

Operator Success Metrics


Avaliar:

- Disponibilidade carregadores.
- Receita.
- Crescimento usuários.

---

# Sucesso frota

Criar:

Fleet Success Metrics


Avaliar:

- Economia.
- Consumo.
- Eficiência.

---

# Programa expansão

Criar:

Expansion Engine


Identificar:

- Novas estações.
- Mais usuários.
- Upgrade plano.
- Novos serviços.

---

# Renovação contratos

Criar:

Renewal Management


Controlar:

- Vencimentos.
- Negociação.
- Histórico.

---

# Feedback contínuo

Criar:

Customer Feedback Loop


Coletar:

- Sugestões.
- Problemas.
- Necessidades.

---

# Comunidade clientes

Criar:

ConectoVolt Community


Permitir:

- Eventos.
- Conteúdo.
- Boas práticas.

---

# Dashboard Customer Success

Criar:

Customer Success Dashboard


Mostrar:

- Saúde clientes.
- Risco cancelamento.
- Receita expansão.
- Satisfação.

---

# Banco de Dados

Criar:

## CustomerAccount

Campos:

- company_id
- plan
- status


---

## HealthScore

Campos:

- customer_id
- score
- category


---

## CustomerFeedback

Campos:

- customer_id
- feedback
- rating

---

# API

Criar:

GET

/customers/health


GET

/customers/accounts


POST

/customers/feedback


GET

/customers/renewals

---

# Segurança

Garantir:

- Dados clientes isolados.
- Controle equipes.
- Histórico completo.

---

# Testes

Validar:

- Criar conta cliente.
- Calcular saúde.
- Registrar feedback.
- Identificar expansão.

---

# Critério conclusão

O módulo está pronto quando:

✅ Clientes possuem acompanhamento.

✅ Plataforma reduz cancelamentos.

✅ Crescimento pode ser medido.

---

# Entrega

Informar:

1. Customer Success criado.
2. Métricas.
3. Dashboard.
4. Processo retenção.
5. Próximo módulo recomendado.