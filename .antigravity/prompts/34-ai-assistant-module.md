# PROMPT 34 — AI ASSISTANT & AUTOMATION MODULE

## Contexto

Você está implementando o módulo de inteligência artificial da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ANALYTICS.md
- docs/API.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar um assistente inteligente capaz de analisar dados da plataforma e auxiliar usuários.

---

# Conceito

Dados da plataforma

↓

AI Assistant

↓

Insights

↓

Recomendações

↓

Ações

---

# Estrutura Backend

Criar:

```
modules/ai/

ai.module.ts

ai.controller.ts

ai.service.ts

agents/

prompts/

tools/

memory/

tests/

```

---

# Perfis de IA

Criar:

---

# AI Admin Assistant

Usuário:

SUPER_ADMIN


Funções:

- Analisar crescimento.
- Mostrar receita.
- Identificar problemas.
- Responder perguntas estratégicas.

---

# AI Operator Assistant

Usuário:

OPERATOR


Funções:

- Analisar postos.
- Sugerir melhorias.
- Explicar quedas de receita.
- Analisar carregadores.

---

# AI Customer Assistant

Usuário:

MOTORISTA


Funções:

- Encontrar posto.
- Tirar dúvidas.
- Ajudar pagamento.
- Resolver problemas.

---

# Integração com dados

Criar ferramentas:

## Analytics Tool

Consultar:

- Receita.
- Sessões.
- Usuários.
- Energia.


---

## Operations Tool

Consultar:

- Status carregadores.
- Falhas.
- Disponibilidade.


---

## Financial Tool

Consultar:

- Pagamentos.
- Comissão.
- Saldo.

---

# Perguntas suportadas

Exemplos:

"Quanto faturei esse mês?"

"Qual carregador está com problema?"

"Qual posto vende mais?"

"Quantas recargas fiz hoje?"

---

# Recomendações automáticas

Criar:

## Revenue Insights

Exemplo:

"Posto A tem baixa utilização das 10h às 14h."

---

## Maintenance Insights

Exemplo:

"Carregador 03 apresenta aumento de falhas."

---

## Pricing Insights

Exemplo:

"Sugestão de ajuste de tarifa."

---

# Automações

Criar:

AI Jobs


Executar:

Diariamente:

- Resumo financeiro.
- Análise operação.
- Alertas inteligentes.

---

# Frontend Web

Criar componente:

AI Assistant Panel


Disponível:

Admin.

Operador.


---

# Mobile

Criar:

AI Help Assistant


Para:

- Suporte usuário.
- Dúvidas.

---

# Segurança

Obrigatório:

IA só acessa dados permitidos.

ADMIN:

Dados globais.


OPERADOR:

Somente sua empresa.


CLIENTE:

Somente seus dados.

---

# Logs

Registrar:

- Perguntas.
- Respostas.
- Usuário.
- Data.

---

# Testes

Validar:

- Resposta correta.
- Controle de acesso.
- Consulta dados.
- Geração insights.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuário conversa com IA.

✅ IA entende dados reais.

✅ IA gera recomendações úteis.

---

# Entrega

Informar:

1. Arquivos criados.
2. Integrações.
3. Agentes disponíveis.
4. Como testar.
5. Próximo módulo recomendado.