# ConectoVolt - ENGINEERING RULES

Versão: MVP 1.0

---

# OBJETIVO

Este documento define as regras obrigatórias para desenvolvimento utilizando IA no projeto ConectoVolt.

Toda implementação deve respeitar estas regras.

---

# REGRA 01 — ANTES DE CODIFICAR

Nunca iniciar código imediatamente.

Antes de implementar:

1. Identificar a funcionalidade.
2. Consultar documentação relacionada.
3. Verificar impacto no banco.
4. Verificar impacto na API.
5. Apresentar plano de execução.

Formato:

```
Análise:

Objetivo:

Arquivos envolvidos:

Alterações necessárias:

Riscos:

Teste:
```

---

# REGRA 02 — DESENVOLVIMENTO POR MÓDULO

Cada funcionalidade deve ser criada dentro do seu próprio módulo.

Exemplo:

```
users/

controllers

services

repositories

dto

entities

tests
```

Não misturar responsabilidades.

---

# REGRA 03 — BACKEND

Padrão obrigatório:

Controller

↓

Service

↓

Repository

↓

Database


---

Controllers devem:

- Receber requisições.
- Validar entrada.
- Retornar resposta.


Controllers NÃO devem:

- Possuir regras de negócio.
- Acessar banco diretamente.

---

Services devem:

- Possuir regras de negócio.
- Controlar processos.
- Validar operações.

---

Repositories devem:

- Acessar dados.
- Executar consultas.

---

# REGRA 04 — BANCO DE DADOS

Sempre:

- Usar UUID.
- Criar timestamps.
- Criar índices necessários.
- Criar relacionamentos claros.

Nunca:

- Criar tabelas sem necessidade.
- Duplicar informações.
- Salvar dados calculáveis sem motivo.

---

# REGRA 05 — API

Toda API deve possuir:

- Endpoint definido no API.md.
- DTO de entrada.
- Validação.
- Tratamento de erros.
- Documentação Swagger.

---

# REGRA 06 — SEGURANÇA

Obrigatório:

- Senhas usando hash.
- JWT.
- Controle de acesso.
- Validação de dados.

Nunca:

- Expor senha.
- Expor tokens.
- Confiar em dados enviados pelo usuário.

---

# REGRA 07 — FINANCEIRO

Toda operação financeira deve registrar:

- Valor bruto.
- Comissão plataforma.
- Valor operador.
- Status.
- Data.
- Identificador externo.

Nunca calcular valores financeiros apenas na interface.

O cálculo sempre pertence ao backend.

---

# REGRA 08 — RECARGAS

Uma sessão de recarga deve possuir:

- Usuário.
- Posto.
- Carregador.
- Início.
- Fim.
- Consumo.
- Valor.

Toda alteração de status deve ser registrada.

---

# REGRA 09 — FRONTEND

Componentes devem ser:

- Pequenos.
- Reutilizáveis.
- Responsivos.

Evitar:

- Código duplicado.
- Componentes gigantes.
- Lógica de negócio na tela.

---

# REGRA 10 — MOBILE

O aplicativo deve priorizar:

- Poucos passos.
- Feedback rápido.
- Tratamento de erro.
- Boa experiência offline quando possível.

---

# REGRA 11 — TESTES

Toda funcionalidade crítica deve possuir teste.

Prioridade:

1. Pagamento.
2. Recarga.
3. Autenticação.
4. Comissão.
5. Permissões.

---

# REGRA 12 — NÃO INVENTAR

Se uma informação não existe na documentação:

Não assumir.

Perguntar.

Exemplo:

"Não encontrei definição da regra de tarifa. Deseja criar uma regra nova?"

---

# REGRA 13 — CONTROLE DE ESCOPO

Sempre classificar novas ideias:

MVP

ou

FUTURO


Não implementar FUTURO sem aprovação.

---

# REGRA 14 — ENTREGA DE TAREFAS

Toda tarefa concluída deve informar:

## Alterações realizadas

Lista de arquivos.

## Como testar

Passos.

## Possíveis melhorias futuras

Sugestões.

---

# CHECKLIST FINAL

Antes de considerar concluído:

[ ] Código criado

[ ] Testado

[ ] Documentação atualizada

[ ] Sem erros

[ ] Segurança validada

[ ] Segue arquitetura

[ ] Está dentro do MVP

---

# PRINCÍPIO FINAL

A velocidade é importante.

Mas código simples, organizado e funcional é prioridade.