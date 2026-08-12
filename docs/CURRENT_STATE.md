```text
CURRENT_STATE.md

# ConectoVolt — Estado Atual do Sistema

Versão: 1.0.0
Status: Documento de referência operacional
Idioma: Português do Brasil

## 1. OBJETIVO

Este documento registra o estado atual e conhecido do sistema ConectoVolt.

A finalidade é servir como referência para desenvolvimento, manutenção, correção de bugs e evolução do sistema, evitando que decisões sejam tomadas com base em documentação antiga ou suposições.

Prioridade atual:

ESTABILIZAR → CONSOLIDAR → CORRIGIR → TESTAR → VENDER


## 2. FONTE DE VERDADE

Para alterações no sistema, considerar a seguinte ordem:

1. Código-fonte atual.
2. Banco de dados, schema e migrations efetivamente utilizados.
3. CURRENT_STATE.md.
4. ARCHITECTURE.md.
5. BUSINESS_MODEL.md.
6. PRD.md.
7. .antigravity/rules.md.
8. .antigravity/skill.md.
9. Documentação histórica.

Quando houver divergência entre documentação e código:

- não assumir automaticamente que o código está errado;
- não realizar migração automática;
- identificar a divergência;
- determinar qual comportamento representa o estado atual;
- corrigir a documentação ou o código conforme a decisão aprovada.


## 3. VISÃO GERAL

O ConectoVolt é uma plataforma de gestão de infraestrutura de recarga de veículos elétricos.

O sistema contempla:

- empresas operadoras;
- estações;
- carregadores;
- usuários;
- veículos;
- tarifas;
- sessões de carregamento;
- pagamentos;
- comissões;
- carteiras;
- transações financeiras;
- telemetria;
- OCPP;
- manutenção;
- notificações;
- alertas;
- auditoria;
- relatórios;
- dashboards;
- configurações.


## 4. OBJETIVO ATUAL

O objetivo atual não é reconstruir o sistema.

O objetivo é estabilizar a base existente e preparar o produto para operação comercial real.

Prioridades:

- estabilidade;
- segurança;
- pagamentos reais;
- Mercado Pago;
- Checkout Transparente;
- Split Payment;
- comissão;
- recebimento do operador;
- webhooks;
- idempotência;
- reembolsos;
- reconciliação;
- testes;
- observabilidade.


## 5. ESTRUTURA DO REPOSITÓRIO

A estrutura principal conhecida inclui:

.antigravity/
.github/
backend/
docs/
frontend/
mobile/
ops/

A estrutura existente deve ser preservada.

Não reorganizar o projeto inteiro sem necessidade.


## 6. STACK

### Backend

- NestJS
- TypeScript
- Prisma
- REST API
- WebSocket
- Redis
- OCPP

### Frontend

- Next.js
- TypeScript

### Mobile

- Flutter

### Banco

Existem referências históricas a:

- PostgreSQL;
- MySQL;
- SQLite.

O código atual possui referências a schemas Prisma relacionados a SQLite e MySQL.

A infraestrutura de produção atual está orientada para MySQL/MariaDB.

Não migrar para PostgreSQL sem decisão arquitetural explícita.


## 7. BANCO DE DADOS

O banco é componente crítico.

Antes de qualquer alteração:

1. verificar banco utilizado em produção;
2. verificar DATABASE_URL;
3. verificar schema Prisma;
4. verificar migrations;
5. verificar CI/CD;
6. verificar infraestrutura;
7. realizar backup;
8. testar a alteração.

Não executar alterações destrutivas automaticamente.

Não utilizar db push em produção como estratégia de migração.

Usar migrations versionadas e revisadas.


## 8. ORM

O projeto utiliza Prisma.

Não substituir Prisma por outro ORM.

Antes de modificar schemas:

- verificar migrations;
- verificar relações;
- verificar dados existentes;
- verificar código dependente;
- verificar ambiente de produção.


## 9. IDENTIFICADORES

O código atual utiliza CUID em diversos modelos.

Exemplo:

@default(cuid())

Existe documentação histórica mencionando UUID.

Estado atual:

CUID é considerado o padrão atual.

Não converter CUID para UUID sem plano específico.

Não recriar IDs.

Não alterar relacionamentos existentes somente para alinhar documentação antiga.


## 10. MÓDULOS PRINCIPAIS

Existem módulos relacionados a:

- alerts;
- audit;
- auth;
- billing;
- chargers;
- charging;
- commissions;
- companies;
- dashboard;
- maintenance;
- notifications;
- ocpp;
- payments;
- reports;
- settings;
- stations;
- tariffs;
- telemetry;
- users;
- vehicles.

Também existem componentes financeiros relacionados a Wallet e transações.

Antes de criar um módulo novo:

1. pesquisar o repositório;
2. verificar funcionalidades existentes;
3. verificar services;
4. verificar controllers;
5. verificar DTOs;
6. verificar entidades;
7. verificar testes.

Não criar módulos duplicados.


## 11. AUTENTICAÇÃO

O sistema possui autenticação e autorização.

A arquitetura considera:

- autenticação;
- JWT;
- RBAC;
- permissões;
- auditoria.

Alterações devem preservar compatibilidade com frontend, mobile e APIs.


## 12. OCPP

OCPP é componente crítico.

Não quebrar:

- conexão com carregadores;
- início de sessão;
- término de sessão;
- status;
- comandos;
- telemetria;
- relacionamento carregador/estação;
- relacionamento sessão/carregador.

Alterações em Charging, Payments ou infraestrutura devem possuir testes de regressão quando houver risco de impacto.


## 13. CHARGING

O sistema possui fluxo de sessões de carregamento.

Fluxo conceitual:

Usuário
↓
Veículo
↓
Carregador
↓
Estação
↓
Sessão
↓
Energia consumida
↓
Tarifa
↓
Valor
↓
Pagamento

Alterações financeiras não devem quebrar o fluxo de Charging.


## 14. TARIFAS

Existe módulo de tarifas.

O backend é responsável pelo cálculo definitivo dos valores.

Não confiar no frontend para:

- preço final;
- comissão;
- percentual;
- valor do operador;
- valor da plataforma.


## 15. PAGAMENTOS

Existe módulo:

backend/src/modules/payments

Existe integração com Mercado Pago.

O sistema possui conceitos relacionados a:

- pagamento;
- PIX;
- cartão;
- consulta;
- webhook;
- refund;
- comissão;
- carteira.

A implementação atual deve ser tratada como base existente que precisa ser consolidada.

Não criar um segundo módulo de pagamentos paralelo.


## 16. MERCADO PAGO

O Mercado Pago é uma integração externa crítica.

O modelo comercial desejado é:

Cliente
↓
Pagamento
↓
Mercado Pago
├── percentual ConectoVolt
└── restante do operador

Exemplo:

Pagamento: R$100,00
Comissão: 10%

ConectoVolt: R$10,00
Operador: R$90,00

O percentual deve ser calculado pelo backend.

O frontend nunca deve definir o percentual definitivo.


## 17. CHECKOUT TRANSPARENTE

O objetivo é utilizar Checkout Transparente de forma segura.

O fluxo deve contemplar:

- criação da cobrança;
- tokenização quando aplicável;
- meio de pagamento;
- identificação do pagador;
- valor;
- parcelas quando aplicável;
- comissão;
- recebedor;
- status;
- webhook;
- idempotência;
- reembolso;
- tratamento de erros.

Não armazenar:

- número completo do cartão;
- CVV;
- dados sensíveis desnecessários.


## 18. SPLIT PAYMENT

O modelo desejado é:

Valor bruto
↓
Comissão ConectoVolt
↓
Valor do operador

Exemplo:

R$100,00
10% ConectoVolt
R$10,00 ConectoVolt
R$90,00 operador

O split real deverá ser realizado pelo gateway quando a arquitetura aprovada utilizar Split Payment.

Não confundir:

comissão registrada internamente

com:

split financeiro efetivamente executado pelo gateway.


## 19. CONTA DO OPERADOR

O modelo financeiro exige que operadores possam possuir conta de recebimento vinculada ao provedor de pagamento.

Conceito:

Empresa
↓
PaymentProviderAccount
↓
Mercado Pago
↓
Conta de recebimento

A implementação deverá contemplar:

- identificação externa;
- status;
- autorização;
- OAuth;
- tokens;
- expiração;
- revogação;
- reconexão.

Credenciais sensíveis devem ser protegidas.


## 20. PAYMENT CORE

A arquitetura financeira deve separar:

Payment
PaymentSplit
PaymentProviderAccount
FinancialTransaction
Commission
Wallet
WebhookEvent
Refund
Reconciliation

Cada entidade possui responsabilidade própria.


## 21. PAYMENT

Representa a cobrança.

Deve permitir rastrear:

- valor bruto;
- moeda;
- status;
- usuário;
- empresa;
- sessão;
- gateway;
- identificador externo;
- referência;
- idempotência;
- timestamps.


## 22. PAYMENT SPLIT

Representa a distribuição financeira.

Deve permitir rastrear:

- recebedor;
- percentual;
- valor;
- status;
- referência externa;
- gateway;
- timestamps.


## 23. PAYMENT PROVIDER ACCOUNT

Representa a conta externa do recebedor.

Relacionamento:

Empresa
↓
Conta externa
↓
Gateway

Não armazenar tokens sensíveis em texto puro.


## 24. COMMISSION

O sistema possui módulo de comissão.

Exemplo:

Pagamento: R$100,00
Comissão: 10%
Comissão: R$10,00
Operador: R$90,00

O percentual aplicado deve ser rastreável.

Alterações futuras da regra não devem alterar pagamentos antigos.


## 25. WALLET

O sistema possui Wallet.

A Wallet deve ser tratada como camada financeira interna.

Ela pode representar:

- ledger;
- extrato;
- histórico;
- saldo contábil;
- conciliação.

A Wallet não deve afirmar que a ConectoVolt possui fisicamente um dinheiro que foi diretamente enviado pelo gateway para a conta do operador.


## 26. TRANSAÇÕES

Devem ser diferenciadas:

Transação externa:
movimentação no gateway.

Transação interna:
registro financeiro interno/ledger.

Não misturar os dois conceitos.


## 27. VALORES MONETÁRIOS

Existem campos financeiros utilizando Float.

Isso é dívida técnica conhecida.

Para novas funcionalidades financeiras:

NÃO utilizar Float como representação principal de dinheiro.

Preferir Decimal.

Não converter todo o banco automaticamente de Float para Decimal.

A migração deve ser planejada e testada.


## 28. ARREDONDAMENTO

Os cálculos financeiros devem utilizar regras determinísticas.

Testar:

R$0,01
R$0,10
R$0,99
R$1,01
R$9,99
R$10,01
R$99,99
R$100,00
R$100,01
R$1000,01

Testar percentuais:

1%
2,5%
5%
7,5%
10%
15%
20%


## 29. IDEMPOTÊNCIA

Operações financeiras devem ser idempotentes.

Inclui:

- criação de pagamento;
- webhook;
- split;
- refund;
- reconciliação;
- alteração de status.

Eventos duplicados não podem gerar:

- pagamentos duplicados;
- comissões duplicadas;
- transações duplicadas;
- créditos duplicados;
- refunds duplicados.


## 30. WEBHOOK

Fluxo desejado:

Webhook recebido
↓
Validar autenticidade
↓
Registrar evento
↓
Verificar idempotência
↓
Processar
↓
Consultar gateway quando necessário
↓
Atualizar Payment
↓
Atualizar Split
↓
Atualizar Ledger
↓
Auditar

Eventos repetidos devem ser tratados com segurança.


## 31. WEBHOOK EVENT

Eventos externos devem ser rastreáveis.

Registrar quando aplicável:

- ID externo;
- tipo;
- origem;
- status;
- tentativa;
- erro;
- timestamp.

Não armazenar dados sensíveis desnecessários.


## 32. REFUND

O sistema possui lógica de refund.

O modelo final deverá considerar:

- pagamento original;
- split original;
- valor reembolsado;
- valor restante;
- status;
- gateway;
- ID externo;
- idempotência.

Não permitir múltiplos refunds indevidos.


## 33. SIMULAÇÃO

Simulação de pagamento pode existir somente em:

development
test

Em staging e production:

credenciais ausentes devem resultar em erro.

Nunca utilizar pagamento simulado silenciosamente em produção.


## 34. SEGURANÇA FINANCEIRA

Nunca:

- armazenar cartão completo;
- armazenar CVV;
- armazenar secrets no código;
- imprimir tokens nos logs;
- retornar tokens pela API;
- confiar no valor enviado pelo frontend;
- confiar no percentual enviado pelo frontend.

Usar:

- variáveis de ambiente;
- secret management;
- HTTPS;
- RBAC;
- validação;
- auditoria;
- assinatura de webhook.


## 35. LOGS

Nunca registrar:

- senha;
- access token;
- refresh token;
- client secret;
- cartão;
- CVV;
- informações financeiras sensíveis desnecessárias.

Logs devem permitir diagnóstico sem comprometer segurança.


## 36. ESTABILIDADE DO BANCO

Existe histórico de problemas relacionados a conexão e pool do banco em produção.

Investigar:

- DATABASE_URL;
- host;
- porta;
- credenciais;
- limite de conexões;
- pool;
- timeout;
- quantidade de instâncias;
- concorrência;
- conexões abertas;
- infraestrutura.

Não aumentar timeout simplesmente para esconder a causa.


## 37. CI/CD

O pipeline deve validar:

Lint
↓
Typecheck
↓
Testes
↓
Build
↓
Migration check
↓
Deploy

Falhas críticas devem impedir o deploy.


## 38. PRODUÇÃO

Não utilizar em produção:

- código experimental;
- pagamento simulado;
- secrets no código;
- migration não testada;
- código sem testes;
- logs sensíveis.


## 39. FLUXO DE DEPLOY

Fluxo preferencial:

feature
↓
Pull Request
↓
CI
↓
Review
↓
Merge
↓
Staging
↓
Smoke Test
↓
Production


## 40. TESTES

Existem testes automatizados.

Existem testes relacionados a áreas como:

- autenticação;
- charging;
- pagamentos;
- refund;
- webhook;
- RBAC.

A cobertura precisa ser ampliada para o novo modelo financeiro.


## 41. TESTES FINANCEIROS NECESSÁRIOS

### Pagamento

- criação;
- aprovação;
- rejeição;
- pendência;
- cancelamento.

### Comissão

- percentual;
- valor;
- arredondamento;
- histórico.

### Split

- plataforma;
- operador;
- percentual;
- valor;
- status.

### Webhook

- evento válido;
- evento inválido;
- evento duplicado;
- evento fora de ordem;
- gateway indisponível.

### Refund

- parcial;
- total;
- duplicado;
- após split.

### Falhas

- timeout;
- gateway indisponível;
- token inválido;
- conta não autorizada;
- split rejeitado.


## 42. BUG FIX

Todo bug deve seguir:

1. reproduzir;
2. localizar causa;
3. identificar impacto;
4. criar ou atualizar teste;
5. corrigir;
6. executar teste específico;
7. executar regressão;
8. revisar diff;
9. documentar.


## 43. REGRA DE ESCOPO

Se o objetivo é corrigir um bug:

não aproveitar automaticamente para:

- trocar banco;
- reescrever arquitetura;
- atualizar dependências sem necessidade;
- criar módulos;
- refatorar áreas não relacionadas.

Alterar somente o necessário.


## 44. ANTI-DUPLICAÇÃO

Antes de criar qualquer:

- module;
- service;
- controller;
- DTO;
- entity;
- repository;
- adapter;

pesquisar o projeto inteiro.

Se já existir funcionalidade equivalente:

reutilizar ou evoluir.


## 45. ANTI-REESCRITA

Não substituir uma implementação existente apenas porque outra solução parece mais moderna.

Avaliar:

- estabilidade;
- compatibilidade;
- dependências;
- risco;
- custo;
- impacto financeiro;
- impacto comercial;
- rollback.


## 46. DOCUMENTAÇÃO

Documentos principais:

docs/PRD.md
docs/ARCHITECTURE.md
docs/BUSINESS_MODEL.md
docs/SECURITY.md
docs/TODO.md
docs/PRISMA_SCHEMA_PLAN.md
docs/CURRENT_STATE.md

Documentação histórica pode estar desatualizada.


## 47. PRD

PRD representa o que o produto deve fazer.

CURRENT_STATE representa o que realmente existe.

Não utilizar PRD para afirmar que algo está implementado quando não estiver.


## 48. TODO

Itens marcados como concluídos no TODO não são garantia de funcionamento.

A validação deve considerar:

- código;
- testes;
- execução;
- infraestrutura;
- comportamento real.


## 49. ANTIGRAVITY

O projeto possui:

.antigravity/
├── skill.md
├── rules.md
└── prompts/

As skills devem refletir o estado real.

Não instruir o agente a:

- migrar banco automaticamente;
- converter CUID para UUID;
- reescrever módulos;
- criar pagamentos fictícios;
- criar integrações paralelas.


## 50. CLASSIFICAÇÃO

As funcionalidades devem ser classificadas como:

IMPLEMENTADO
IMPLEMENTADO COM RISCO
PARCIAL
COM BUG
PENDENTE
OBSOLETO
FUTURO


## 51. PRIORIDADES P0

P0:

- estabilidade do banco;
- definição do banco oficial;
- pagamentos reais;
- Mercado Pago;
- Checkout Transparente;
- Split Payment;
- conta do operador;
- webhook;
- idempotência;
- refund;
- reconciliação;
- segurança financeira;
- testes financeiros.


## 52. PRIORIDADES P1

P1:

- atualização das skills;
- atualização da arquitetura;
- atualização do modelo financeiro;
- atualização do PRD;
- Decimal;
- CI/CD;
- observabilidade;
- testes de regressão.


## 53. PRIORIDADES P2

P2:

- limpeza documental;
- limpeza de artefatos;
- melhorias operacionais;
- observabilidade;
- otimizações.


## 54. PRIORIDADES P3

Somente depois da estabilização:

- novas funcionalidades;
- novos módulos;
- expansão;
- novas integrações;
- internacionalização;
- escala avançada.


## 55. NÃO ALTERAR AGORA

Sem decisão arquitetural específica, não realizar migração global de:

- CUID;
- banco;
- Prisma;
- OCPP;
- Charging;
- Wallet;
- Commission;
- Payment;
- autenticação;
- estrutura modular.


## 56. COMPATIBILIDADE

Alterações devem preservar, quando possível:

- APIs;
- frontend;
- mobile;
- banco;
- OCPP;
- integrações externas.

Breaking changes devem possuir plano específico.


## 57. OBSERVABILIDADE

O sistema deve permitir rastrear:

- erros;
- banco;
- OCPP;
- pagamentos;
- webhooks;
- splits;
- refunds;
- latência;
- infraestrutura.

Eventos financeiros devem ser rastreáveis por IDs internos e externos.


## 58. RECONCILIAÇÃO

A arquitetura financeira deverá permitir comparar:

Ledger interno
↓
Mercado Pago
↓
Movimentação externa

Identificar:

- pagamentos inexistentes;
- pagamentos duplicados;
- valores divergentes;
- splits divergentes;
- refunds divergentes;
- status divergentes;
- comissões divergentes.


## 59. AUDITORIA

Registrar operações financeiras relevantes:

- criação de pagamento;
- aprovação;
- rejeição;
- split;
- refund;
- alteração de comissão;
- alteração de conta;
- autorização Mercado Pago;
- reconexão;
- alteração de configurações financeiras.


## 60. COMISSÃO

A porcentagem da ConectoVolt deve ser configurável.

Fluxo:

Empresa
↓
Regra de comissão
↓
Percentual
↓
Pagamento
↓
Split

O percentual aplicado deve ser preservado no histórico.


## 61. REGRA FINANCEIRA FUNDAMENTAL

Exemplo:

Valor bruto: R$100,00
Comissão: 10%

ConectoVolt: R$10,00
Operador: R$90,00

Taxas do gateway, quando aplicáveis, devem ser representadas separadamente.

Não esconder taxas dentro da comissão sem regra definida.


## 62. ESTADOS FINANCEIROS

Estados internos devem ser claramente separados dos estados do gateway.

Exemplos:

CREATED
PENDING
APPROVED
AUTHORIZED
REJECTED
CANCELLED
REFUNDED
PARTIALLY_REFUNDED
FAILED

O mapeamento com o gateway deve ser explícito.


## 63. ESTADO GERAL ATUAL

### Estrutura

IMPLEMENTADO

### Backend

IMPLEMENTADO

### Frontend

IMPLEMENTADO

### Mobile

IMPLEMENTADO

### OCPP

IMPLEMENTADO

### Charging

IMPLEMENTADO

### Autenticação

IMPLEMENTADO

### Pagamentos

IMPLEMENTADO COM RISCO

### Comissão

IMPLEMENTADO COM RISCO

### Wallet

IMPLEMENTADO COM RISCO

### Checkout Transparente

PARCIAL

### Split Payment

PENDENTE

### Conta Mercado Pago do operador

PENDENTE

### Webhook

IMPLEMENTADO COM RISCO

### Refund

IMPLEMENTADO COM RISCO

### Reconciliação

PENDENTE

### Decimal

PENDENTE

### CI/CD

IMPLEMENTADO COM RISCO

### Documentação

IMPLEMENTADO COM RISCO


## 64. DECISÕES ATUAIS

Banco:
Manter infraestrutura atual. Não migrar sem decisão.

IDs:
Manter CUID.

ORM:
Manter Prisma.

Backend:
Manter NestJS.

Frontend:
Manter Next.js.

Mobile:
Manter Flutter.

OCPP:
Preservar implementação existente.

Pagamentos:
Evoluir módulo existente.

Mercado Pago:
Não criar integração paralela.

Wallet:
Manter e redefinir seu papel conforme arquitetura financeira.

Commission:
Manter e alinhar ao Split Payment.


## 65. PRINCÍPIO FINANCEIRO

Toda implementação financeira deve seguir:

Regra de negócio
↓
Modelo financeiro
↓
Backend
↓
Gateway
↓
Webhook
↓
Ledger
↓
Auditoria
↓
Testes
↓
Reconciliação


## 66. PRINCÍPIO DE ESTABILIDADE

Prioridade:

1. produção;
2. pagamentos;
3. banco;
4. charging;
5. OCPP;
6. autenticação;
7. APIs críticas;
8. frontend;
9. mobile;
10. melhorias secundárias.


## 67. PRINCÍPIO DE VENDABILIDADE

O núcleo comercial precisa permitir:

- cadastrar operadores;
- cadastrar estações;
- cadastrar carregadores;
- registrar sessões;
- cobrar usuários;
- distribuir valores;
- registrar comissão;
- gerar relatórios;
- operar com segurança;
- operar com estabilidade.


## 68. CRITÉRIO DE CONCLUSÃO

Uma tarefa não está concluída apenas porque compila.

Uma alteração crítica deve possuir:

Código
+
Testes
+
Regressão
+
Banco
+
Integração
+
Segurança
+
Documentação


## 69. CHECKLIST ANTES DE ALTERAR

[ ] Li CURRENT_STATE.md
[ ] Localizei implementação atual
[ ] Verifiquei funcionalidades existentes
[ ] Verifiquei dependências
[ ] Verifiquei testes
[ ] Verifiquei impacto no banco
[ ] Verifiquei impacto financeiro
[ ] Verifiquei frontend
[ ] Verifiquei mobile
[ ] Verifiquei OCPP
[ ] Defini escopo mínimo
[ ] Defini estratégia de testes


## 70. CHECKLIST APÓS ALTERAR

[ ] Código compilando
[ ] Testes passando
[ ] Regressão executada
[ ] Migration revisada
[ ] Segurança revisada
[ ] Logs revisados
[ ] Secrets protegidos
[ ] Não existem duplicações
[ ] Não foram alterados módulos sem necessidade
[ ] Documentação atualizada
[ ] CURRENT_STATE atualizado quando necessário


## 71. PRÓXIMAS FASES

FASE 1
Consolidar estado atual

FASE 2
Consolidar skills

FASE 3
Atualizar arquitetura

FASE 4
Atualizar modelo financeiro

FASE 5
Consolidar Payment Core

FASE 6
Mercado Pago

FASE 7
Checkout Transparente

FASE 8
Split Payment

FASE 9
Webhook + Idempotência

FASE 10
Refund

FASE 11
Reconciliação

FASE 12
Testes financeiros

FASE 13
Estabilização de produção

FASE 14
Atualização do PRD

FASE 15
Novas funcionalidades


## 72. REGRA FINAL

O ConectoVolt já possui código funcional.

Não tratar o projeto como projeto vazio.

Não reconstruir componentes existentes sem necessidade.

Não migrar banco sem aprovação.

Não alterar IDs sem aprovação.

Não criar módulos duplicados.

Não implementar pagamentos fictícios em produção.

Não confiar no frontend para decisões financeiras.

Não considerar documentação antiga como código executado.

Sempre analisar antes.

Sempre alterar o mínimo necessário.

Sempre testar.

Sempre preservar funcionalidades existentes.


## 73. OBJETIVO FINAL

O objetivo desta fase é transformar a base existente em um sistema confiável para operação comercial real.

Prioridade:

FUNCIONAR
↓
RECEBER
↓
DISTRIBUIR
↓
CONCILIAR
↓
AUDITAR
↓
ESCALAR