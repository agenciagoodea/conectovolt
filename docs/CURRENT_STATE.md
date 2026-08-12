# ConectoVolt — Estado Atual do Sistema

**Documento:** CURRENT_STATE.md  
**Versão:** 1.0.0  
**Status:** Documento de referência operacional  
**Objetivo:** Registrar o estado REAL do sistema antes de novas alterações estruturais.

---

# 1. REGRA PRINCIPAL

Este documento representa o estado atual do código e da arquitetura do ConectoVolt.

O código existente é a fonte de verdade sobre o que está implementado.

O PRD, documentos antigos, prompts e skills não devem ser considerados automaticamente superiores ao código atual.

Antes de modificar qualquer funcionalidade existente, o agente deve:

1. localizar a implementação atual;
2. entender seu comportamento;
3. identificar dependências;
4. verificar testes existentes;
5. verificar impacto da alteração;
6. alterar somente o necessário;
7. executar testes;
8. executar testes de regressão;
9. atualizar este documento quando o comportamento real mudar.

---

# 2. OBJETIVO DO SISTEMA

O ConectoVolt é uma plataforma de gestão de infraestrutura de recarga de veículos elétricos.

O sistema contempla, entre outros:

- empresas operadoras;
- estações de recarga;
- carregadores;
- sessões de carregamento;
- tarifas;
- usuários;
- veículos;
- pagamentos;
- comissões;
- carteiras;
- telemetria;
- OCPP;
- manutenção;
- notificações;
- auditoria;
- relatórios.

O objetivo atual é estabilizar o produto existente e prepará-lo para operação comercial real.

---

# 3. STACK ATUAL

## Backend

- NestJS
- TypeScript
- Prisma
- API REST
- WebSocket
- OCPP
- Redis

## Frontend

- Next.js
- TypeScript

## Mobile

- Flutter

## Banco de dados

ATENÇÃO:

Existe atualmente divergência entre documentação, configurações e schemas relacionados ao banco.

O banco oficial de produção deve ser confirmado antes de qualquer migração estrutural.

Não migrar banco por iniciativa própria.

---

# 4. IDENTIFICADORES

O código atual utiliza CUID em diversos modelos Prisma.

As skills/documentações antigas mencionam UUID.

Até que exista uma decisão explícita de migração:

- NÃO migrar CUID para UUID;
- NÃO alterar IDs existentes;
- NÃO recriar relacionamentos somente por causa dessa divergência.

A implementação atual deve ser preservada.

---

# 5. ESTRUTURA PRINCIPAL DO BACKEND

Os principais módulos existentes incluem:

- auth
- users
- companies
- stations
- chargers
- charging
- tariffs
- payments
- commissions
- billing
- wallets
- telemetry
- ocpp
- maintenance
- alerts
- notifications
- audit
- reports
- dashboard
- settings
- vehicles

Antes de criar um novo módulo, verificar se a funcionalidade já existe em algum módulo atual.

---

# 6. PAGAMENTOS — ESTADO ATUAL

O sistema possui integração com Mercado Pago.

Existem componentes relacionados a:

- criação de pagamentos;
- PIX;
- cartão;
- consulta de pagamento;
- reembolso;
- webhook;
- comissão;
- carteira;
- auditoria.

A implementação atual NÃO deve ser considerada equivalente ao modelo final de Split Payment do Mercado Pago.

Existe uma diferença entre:

1. registrar contabilmente a comissão;
2. efetivamente realizar um split financeiro entre contas Mercado Pago.

O novo modelo de negócio exige análise e implementação específica para:

- Checkout Transparente;
- Marketplace;
- OAuth dos recebedores;
- Split Payment;
- comissão da plataforma;
- recebimento do operador;
- webhook;
- idempotência;
- reembolso;
- reconciliação.

NÃO implementar essa arquitetura sem atualização prévia da documentação e das skills.

---

# 7. MODELO FINANCEIRO ATUAL

O sistema possui conceitos de:

- Payment;
- Commission;
- Wallet;
- Transaction.

Atualmente existe cálculo de comissão e crédito em carteira interna.

Esse modelo pode continuar sendo utilizado como camada contábil/ledger, mas não deve ser interpretado automaticamente como transferência financeira real para a conta do operador.

O novo modelo financeiro deverá distinguir claramente:

- valor bruto;
- comissão da plataforma;
- valor do operador;
- taxa do gateway;
- valor líquido;
- transação externa;
- transação interna;
- status financeiro.

---

# 8. VALORES MONETÁRIOS

Existem campos monetários utilizando Float no schema atual.

Isso é uma pendência técnica.

A futura camada financeira deverá utilizar representação monetária apropriada, preferencialmente Decimal, com:

- precisão definida;
- arredondamento definido;
- regras de centavos;
- cálculo determinístico;
- testes financeiros.

NÃO realizar conversão global de Float para Decimal sem plano de migração e testes.

---

# 9. WEBHOOKS

O sistema possui webhook do Mercado Pago com mecanismos de validação de assinatura.

A arquitetura futura deve garantir:

- validação da assinatura;
- validação do request;
- idempotência;
- registro do evento;
- consulta segura ao gateway;
- atualização do pagamento;
- atualização do ledger;
- auditoria;
- tratamento de eventos repetidos.

Um webhook repetido nunca deve gerar duplicidade financeira.

---

# 10. SIMULAÇÃO DE PAGAMENTO

Existe comportamento de simulação para ambientes onde o Mercado Pago não está configurado.

Esse comportamento é permitido apenas em ambiente de desenvolvimento/teste controlado.

Em produção:

- pagamentos simulados são proibidos;
- ausência de credenciais deve gerar erro explícito;
- o sistema não deve transformar silenciosamente um pagamento real em pagamento simulado.

---

# 11. SESSÃO DE RECARGA E PAGAMENTO

O fluxo atual relaciona pagamento à sessão de carregamento.

A implementação atual deve ser preservada até que exista uma decisão explícita sobre:

- cobrança pós-recarga;
- pré-autorização;
- captura posterior;
- cobrança antecipada.

Não alterar o fluxo de charging apenas para implementar Split Payment.

---

# 12. OCPP

O sistema possui módulo OCPP.

Alterações no módulo de pagamentos não devem quebrar:

- início de sessão;
- término de sessão;
- status do carregador;
- comunicação OCPP;
- telemetria;
- atualização de energia;
- associação com estação/carregador.

Qualquer alteração envolvendo Charging deve possuir testes de regressão.

---

# 13. BANCO DE DADOS

Existe divergência entre:

- documentação;
- skills;
- schemas Prisma;
- configurações;
- código histórico.

Antes de qualquer migração de banco:

1. identificar banco usado em produção;
2. identificar banco usado localmente;
3. identificar schema efetivamente utilizado;
4. identificar migrations;
5. identificar dados existentes;
6. validar estratégia de migração;
7. realizar backup;
8. testar em ambiente separado.

NÃO realizar migração automática.

---

# 14. PROBLEMAS OPERACIONAIS CONHECIDOS

Existe histórico de problemas relacionados a conexão/pool de banco de dados.

Esse problema deve ser tratado como prioridade de estabilidade.

Investigar:

- DATABASE_URL;
- disponibilidade do banco;
- limite de conexões;
- pool Prisma;
- timeout;
- quantidade de instâncias;
- concorrência;
- conexões não liberadas;
- infraestrutura.

Não mascarar o problema aumentando timeouts sem identificar a causa.

---

# 15. CI/CD

Existe pipeline de deploy automatizado.

Antes de alterações futuras:

- build deve passar;
- testes devem passar;
- migrations devem ser verificadas;
- produção não deve receber código quebrado;
- deploy deve ser rastreável;
- rollback deve ser possível.

O objetivo futuro é evitar que qualquer alteração diretamente em `master` cause uma quebra silenciosa em produção.

---

# 16. TESTES

Existem testes automatizados no backend.

Novas alterações devem preservar os testes existentes.

Para módulos financeiros serão necessários testes específicos para:

- pagamentos;
- comissão;
- split;
- webhook;
- idempotência;
- refund;
- arredondamento;
- valores mínimos;
- valores com centavos;
- falhas de gateway;
- eventos duplicados.

---

# 17. SEGURANÇA

O sistema possui mecanismos de:

- autenticação;
- autorização;
- RBAC;
- validação;
- auditoria;
- proteção de webhook;
- controle de acesso.

Nenhuma nova integração financeira deve:

- armazenar dados completos de cartão;
- expor tokens;
- expor secrets;
- armazenar credenciais em código;
- registrar tokens em logs;
- retornar informações sensíveis na API.

---

# 18. REGRAS PARA ALTERAÇÃO DO CÓDIGO

Toda alteração deve ser pequena e rastreável.

Não realizar:

- refatoração global sem necessidade;
- troca de framework;
- troca de banco sem aprovação;
- troca de ORM;
- recriação de módulos existentes;
- duplicação de serviços;
- duplicação de entidades;
- remoção de funcionalidades existentes sem aprovação.

---

# 19. REGRA PARA CORREÇÃO DE BUG

Ao corrigir um bug:

```text
REPRODUZIR
↓
LOCALIZAR CAUSA
↓
IDENTIFICAR IMPACTO
↓
CRIAR/ATUALIZAR TESTE
↓
CORRIGIR
↓
EXECUTAR TESTE
↓
EXECUTAR REGRESSÃO
↓
DOCUMENTAR