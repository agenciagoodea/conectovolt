# PROMPT 105 — FINAL LAUNCH READINESS MODULE

## Contexto

Você está realizando a validação final da EV Charge Platform antes do lançamento comercial.

O objetivo é garantir que produto, tecnologia, operação e negócio estejam preparados para clientes reais.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/MVP.md
- docs/OPERATIONS.md
- docs/SALES.md
- docs/DOCUMENTATION.md
- docs/SECURITY.md

---

# Objetivo

Criar um checklist completo de lançamento comercial da EV Charge Platform.

---

# 1. Validação Produto

Verificar:

## Usuário

✅ Cadastro funcionando.

✅ Login funcionando.

✅ Perfil funcionando.

✅ Veículo cadastrado.

✅ Busca estações funcionando.


## Recarga

✅ Início sessão.

✅ Monitoramento.

✅ Finalização.

✅ Histórico.


## Pagamento

✅ Cobrança.

✅ Recibo.

✅ Histórico financeiro.

---

# 2. Validação Operador

Verificar:

## Estações

✅ Cadastro.

✅ Status.

✅ Disponibilidade.


## Gestão

✅ Tarifas.

✅ Relatórios.

✅ Receita.


## Operação

✅ Alertas.

✅ Monitoramento.

---

# 3. Validação Tecnologia

Verificar:

## Backend

- APIs.
- Performance.
- Segurança.


## Frontend

- Responsividade.
- Navegação.
- Erros.


## Banco dados

- Backup.
- Integridade.
- Performance.

---

# 4. Segurança final

Validar:

- HTTPS.
- Controle acesso.
- Proteção dados.
- Logs.
- Backup.
- Recuperação desastre.

---

# 5. Infraestrutura produção

Confirmar:

- Servidores ativos.
- Monitoramento.
- Alertas.
- Escalabilidade.

---

# 6. Operação empresa

Validar:

## Suporte

- Canal atendimento.
- Processo tickets.


## Comercial

- Contratos.
- Propostas.
- CRM.


## Financeiro

- Cobrança.
- Relatórios.
- Repasse.

---

# 7. Cliente piloto

Confirmar:

- Cliente configurado.
- Estações cadastradas.
- Usuários ativos.
- Feedback coletado.

---

# 8. Métricas lançamento

Acompanhar:

## Produto

- Usuários ativos.
- Sessões.
- Retenção.


## Negócio

- Receita.
- Clientes.
- Conversão.


## Operação

- Disponibilidade.
- Falhas.
- Tempo resposta.

---

# 9. Plano primeiros 90 dias

Criar:

## Dias 1-30

Objetivo:

- Validar operação.
- Corrigir problemas.


## Dias 31-60

Objetivo:

- Aumentar clientes.
- Melhorar produto.


## Dias 61-90

Objetivo:

- Escalar vendas.
- Criar casos sucesso.

---

# 10. Go / No-Go Decision

Criar avaliação:

## GO

Quando:

✅ Produto funciona.

✅ Cliente consegue usar.

✅ Operação consegue suportar.


## NO-GO

Quando:

- Falhas críticas.
- Problemas segurança.
- Pagamento quebrado.

---

# Dashboard lançamento

Criar:

Launch Command Center


Mostrar:

- Status módulos.
- Clientes.
- Operação.
- Erros.
- Receita.

---

# Banco de Dados

Criar:

## LaunchChecklist

Campos:

- item
- status
- responsible


---

## LaunchMetric

Campos:

- metric
- value
- date

---

# API

Criar:

GET

/launch/status


GET

/launch/metrics


POST

/launch/checklist

---

# Testes

Executar:

- Teste usuário completo.
- Teste operador completo.
- Teste pagamento.
- Teste produção.
- Teste suporte.

---

# Critério conclusão

O módulo está pronto quando:

✅ A plataforma pode receber clientes reais.

✅ A equipe sabe operar.

✅ Existe plano comercial.

✅ Existe monitoramento.

---

# Entrega

Informar:

1. Status lançamento.
2. Pendências.
3. Riscos.
4. Plano 90 dias.
5. Próximas evoluções.