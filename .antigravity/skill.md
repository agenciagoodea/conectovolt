Sim. Abaixo está o conteúdo **completo e pronto para salvar como `skill.txt`**, correspondente ao **PASSO 2 — Corrigir a `skill.md` do Antigravity**.

```text
CONECTOVOLT — ANTIGRAVITY SKILL
VERSÃO CONSOLIDADA — PASSO 2
STATUS: SKILL OPERACIONAL
IDIOMA: PORTUGUÊS DO BRASIL

============================================================
1. OBJETIVO
============================================================

Esta skill define como o Antigravity deve analisar, modificar,
corrigir, testar e documentar o projeto ConectoVolt.

O objetivo principal desta skill é impedir decisões baseadas em
documentação histórica, suposições ou instruções conflitantes.

O Antigravity deve trabalhar sobre o código REAL existente.

PRINCÍPIO FUNDAMENTAL:

NÃO RECONSTRUIR O SISTEMA.
NÃO MIGRAR TECNOLOGIAS SEM APROVAÇÃO.
NÃO DUPLICAR FUNCIONALIDADES.
NÃO REALIZAR ALTERAÇÕES DESTRUTIVAS.
NÃO ASSUMIR QUE DOCUMENTAÇÃO ANTIGA REPRESENTA O CÓDIGO ATUAL.

A prioridade é:

ESTABILIZAR
→ CONSOLIDAR
→ CORRIGIR
→ TESTAR
→ DOCUMENTAR
→ VENDER


============================================================
2. FONTE DE VERDADE
============================================================

Antes de realizar qualquer alteração, o Antigravity deve consultar
as fontes disponíveis.

Ordem de prioridade:

1. Código-fonte atual.
2. Banco/schema/migrations efetivamente utilizados.
3. docs/CURRENT_STATE.md.
4. docs/ARCHITECTURE.md.
5. docs/BUSINESS_MODEL.md.
6. docs/PRD.md.
7. .antigravity/rules.md.
8. .antigravity/skill.md.
9. Documentação histórica.
10. Prompts antigos.

REGRA:

Quando houver conflito entre documentação e código, o código atual
deve ser investigado antes de qualquer decisão.

O Antigravity NÃO deve:

- assumir que a documentação antiga está correta;
- assumir que o código está errado;
- executar migrações automaticamente;
- substituir arquitetura automaticamente;
- criar uma nova implementação sem pesquisar a existente.


============================================================
3. CURRENT_STATE.md É O DOCUMENTO OPERACIONAL
============================================================

O arquivo:

docs/CURRENT_STATE.md

representa o estado atual conhecido do sistema.

Antes de modificar arquitetura, banco, pagamentos, autenticação,
OCPP ou qualquer módulo crítico, o Antigravity deve consultar
CURRENT_STATE.md.

Se CURRENT_STATE.md estiver desatualizado em relação ao código:

1. identificar a divergência;
2. não realizar alteração destrutiva;
3. registrar a divergência;
4. validar o comportamento real;
5. atualizar a documentação quando apropriado.


============================================================
4. REGRA CONTRA CONFLITO DE BANCO
============================================================

ATENÇÃO:

Existem referências históricas a:

- PostgreSQL;
- MySQL;
- SQLite.

O Antigravity NÃO deve migrar o sistema automaticamente para
PostgreSQL.

O Antigravity NÃO deve assumir que PostgreSQL é o banco oficial
somente porque aparece em documentação antiga.

O Antigravity deve verificar:

- DATABASE_URL;
- schema Prisma;
- migrations;
- configuração do ambiente;
- docker-compose;
- CI/CD;
- infraestrutura;
- código de conexão;
- banco utilizado em produção.

ESTADO ATUAL:

A infraestrutura conhecida está orientada para MySQL/MariaDB e
existem referências a SQLite no código/schema.

Portanto:

NÃO MIGRAR PARA POSTGRESQL.

NÃO TROCAR O BANCO.

NÃO ALTERAR O PROVIDER DO PRISMA.

NÃO EXECUTAR MIGRAÇÃO GLOBAL.

Qualquer migração de banco precisa de:

- justificativa;
- análise;
- plano;
- backup;
- migration;
- testes;
- rollback;
- aprovação explícita.


============================================================
5. REGRA CONTRA UUID × CUID
============================================================

O código atual utiliza CUID em diversos modelos.

Exemplo:

@default(cuid())

Existem referências históricas a UUID.

ESTADO ATUAL:

CUID é considerado o padrão existente.

O Antigravity NÃO deve:

- converter CUID para UUID;
- recriar IDs;
- alterar primary keys;
- alterar foreign keys;
- criar migration para troca de identificadores;
- modificar relacionamentos somente para adequar documentação antiga.

Se existir necessidade real de migração para UUID:

1. identificar motivo;
2. avaliar impacto;
3. avaliar dados existentes;
4. planejar migration;
5. criar estratégia de rollback;
6. testar;
7. solicitar aprovação.


============================================================
6. REGRA CONTRA ALTERAÇÕES DESTRUTIVAS
============================================================

O Antigravity nunca deve realizar alterações destrutivas sem
confirmação explícita.

Considerar destrutivo:

- DROP TABLE;
- DROP COLUMN;
- apagar dados;
- recriar banco;
- resetar banco de produção;
- apagar migrations;
- alterar primary key;
- alterar foreign key com risco de perda;
- truncar tabelas;
- db reset;
- migração irreversível;
- alteração de provider;
- alteração estrutural sem backup.

Nunca executar:

prisma migrate reset

em produção.

Nunca utilizar:

prisma db push

como estratégia de alteração estrutural de produção sem
avaliação explícita.

Sempre preferir migrations versionadas e revisadas.


============================================================
7. REGRA CONTRA DUPLICAÇÃO
============================================================

Antes de criar qualquer funcionalidade:

1. pesquisar o repositório;
2. localizar módulos existentes;
3. localizar services;
4. localizar controllers;
5. localizar DTOs;
6. localizar repositories;
7. localizar integrações;
8. localizar testes.

Pesquisar inclusive por nomes semelhantes.

O Antigravity NÃO deve criar:

novo módulo de pagamentos

se já existir:

payments

O Antigravity deve evoluir a implementação existente quando ela
for adequada.

Não criar uma segunda arquitetura paralela somente porque a atual
precisa de correção.


============================================================
8. REGRA CONTRA REESCRITA
============================================================

O fato de uma implementação existente não estar perfeita NÃO
significa que ela deve ser reescrita.

Antes de reescrever:

- identificar problema;
- identificar causa;
- avaliar impacto;
- avaliar dependências;
- avaliar consumidores;
- verificar testes;
- verificar produção;
- determinar se correção incremental resolve.

Preferir:

CORREÇÃO INCREMENTAL

em vez de:

REESCRITA GLOBAL.


============================================================
9. REGRA DE ESCOPO
============================================================

Quando o usuário solicitar correção de um bug específico, o
Antigravity deve trabalhar no menor escopo possível.

NÃO aproveitar automaticamente uma correção para:

- migrar banco;
- trocar ORM;
- trocar framework;
- alterar autenticação;
- reescrever frontend;
- reescrever backend;
- alterar OCPP;
- criar novos módulos;
- atualizar dependências não relacionadas.

Se uma mudança adicional for tecnicamente necessária:

1. explicar por quê;
2. indicar o impacto;
3. separar a alteração;
4. testar.


============================================================
10. REGRA DE ANÁLISE ANTES DA IMPLEMENTAÇÃO
============================================================

Antes de editar qualquer arquivo:

1. entender o objetivo;
2. consultar CURRENT_STATE.md;
3. consultar arquitetura;
4. localizar implementação existente;
5. verificar dependências;
6. verificar banco;
7. verificar testes;
8. verificar consumidores;
9. determinar escopo mínimo;
10. somente então implementar.


============================================================
11. REGRA DE PAGAMENTOS
============================================================

Pagamentos são componentes críticos.

O sistema possui implementação relacionada a:

- Mercado Pago;
- pagamentos;
- PIX;
- cartão;
- webhook;
- refund;
- comissão;
- Wallet.

O Antigravity NÃO deve criar uma integração paralela de pagamentos
sem antes avaliar:

backend/src/modules/payments

A implementação existente deve ser tratada como base.

A arquitetura financeira deve ser evoluída de forma incremental.


============================================================
12. MERCADO PAGO
============================================================

O Mercado Pago é uma integração financeira crítica.

Modelo comercial desejado:

CLIENTE
↓
CHECKOUT
↓
MERCADO PAGO
├── CONECTOVOLT
└── OPERADOR

Exemplo:

Pagamento = R$100,00
Comissão = 10%

ConectoVolt = R$10,00
Operador = R$90,00

O percentual é definido pelo backend.

O frontend NÃO é autoridade financeira.


============================================================
13. CHECKOUT TRANSPARENTE
============================================================

A implementação de Checkout Transparente deve ser segura.

Deve considerar:

- criação da cobrança;
- identificação do pagador;
- tokenização;
- método de pagamento;
- parcelas;
- valor;
- comissão;
- recebedor;
- status;
- webhook;
- idempotência;
- refund;
- tratamento de erro.

Nunca armazenar:

- número completo de cartão;
- CVV;
- dados sensíveis desnecessários.


============================================================
14. SPLIT PAYMENT
============================================================

O modelo desejado é:

VALOR BRUTO
↓
COMISSÃO CONECTOVOLT
↓
VALOR OPERADOR

Exemplo:

R$100,00
↓
10%
↓
R$10,00 ConectoVolt
R$90,00 operador

IMPORTANTE:

Comissão interna NÃO é necessariamente equivalente a Split
Payment real.

O Antigravity deve distinguir:

COMISSÃO INTERNA

de:

SPLIT FINANCEIRO EXECUTADO PELO GATEWAY.


============================================================
15. CONTA DO OPERADOR
============================================================

O sistema deverá permitir relacionamento entre:

EMPRESA
↓
CONTA DO PROVEDOR
↓
MERCADO PAGO

A arquitetura poderá envolver:

- OAuth;
- account ID;
- access token;
- refresh token;
- expiração;
- autorização;
- revogação;
- reconexão.

Credenciais sensíveis devem ser protegidas.

Nunca colocar secrets no código-fonte.

Nunca retornar tokens sensíveis pela API.


============================================================
16. PAYMENT CORE
============================================================

A arquitetura financeira deve separar conceitos:

Payment
PaymentSplit
PaymentProviderAccount
FinancialTransaction
Commission
Wallet
WebhookEvent
Refund
Reconciliation

Não colocar toda a lógica financeira dentro de uma única entidade.


============================================================
17. PAYMENT
============================================================

Payment representa a cobrança.

Deve permitir rastrear:

- valor bruto;
- moeda;
- status;
- usuário;
- empresa;
- sessão;
- gateway;
- ID externo;
- referência;
- idempotência;
- timestamps.


============================================================
18. PAYMENT SPLIT
============================================================

PaymentSplit representa a distribuição financeira.

Deve permitir rastrear:

- recebedor;
- percentual;
- valor;
- status;
- referência externa;
- gateway;
- timestamps.


============================================================
19. COMMISSION
============================================================

A comissão representa a parcela da ConectoVolt.

Exemplo:

Pagamento = R$100,00
Percentual = 10%
Comissão = R$10,00
Operador = R$90,00

O percentual aplicado deve ser preservado no histórico.

Alterar a regra futura não pode modificar pagamentos antigos.


============================================================
20. WALLET
============================================================

Wallet deve ser tratada como camada financeira interna.

Pode representar:

- ledger;
- extrato;
- saldo contábil;
- histórico;
- conciliação.

Não assumir que Wallet representa dinheiro fisicamente custodiado
pela ConectoVolt.


============================================================
21. VALORES MONETÁRIOS
============================================================

Existem campos financeiros utilizando Float.

Isso é considerado dívida técnica.

Para novas funcionalidades financeiras:

NÃO usar Float como representação principal de dinheiro.

Preferir:

Decimal

com regras explícitas de:

- precisão;
- escala;
- arredondamento;
- comparação.


============================================================
22. IDEMPOTÊNCIA
============================================================

Operações financeiras devem ser idempotentes.

Isso inclui:

- pagamento;
- webhook;
- split;
- refund;
- reconciliação.

Eventos duplicados NÃO podem gerar:

- pagamento duplicado;
- comissão duplicada;
- split duplicado;
- refund duplicado;
- transação duplicada.


============================================================
23. WEBHOOK
============================================================

Fluxo esperado:

WEBHOOK
↓
VALIDAÇÃO
↓
REGISTRO
↓
IDEMPOTÊNCIA
↓
PROCESSAMENTO
↓
CONSULTA AO GATEWAY
↓
ATUALIZAÇÃO DO PAYMENT
↓
ATUALIZAÇÃO DO SPLIT
↓
LEDGER
↓
AUDITORIA

Nunca confiar cegamente no payload recebido.


============================================================
24. REFUND
============================================================

Refund deve ser relacionado ao pagamento original.

Considerar:

- refund total;
- refund parcial;
- valor já reembolsado;
- valor restante;
- split;
- gateway;
- ID externo;
- idempotência.

Não permitir reembolso duplicado.


============================================================
25. PAGAMENTO SIMULADO
============================================================

Simulação pode existir em:

development
test

Não permitir fallback silencioso em:

production

Se credenciais reais estiverem ausentes em produção:

GERAR ERRO.

NUNCA SIMULAR PAGAMENTO REAL.


============================================================
26. SEGURANÇA
============================================================

Nunca:

- armazenar senha em texto puro;
- armazenar CVV;
- armazenar cartão completo;
- expor secrets;
- registrar tokens em logs;
- confiar em valores do frontend;
- confiar em percentuais enviados pelo frontend.

Sempre utilizar:

- validação;
- autenticação;
- autorização;
- RBAC;
- HTTPS;
- secrets;
- auditoria;
- idempotência.


============================================================
27. LOGS
============================================================

Logs não podem conter:

- passwords;
- access tokens;
- refresh tokens;
- client secrets;
- CVV;
- cartão;
- secrets;
- informações financeiras sensíveis desnecessárias.


============================================================
28. BUG FIX
============================================================

Todo bug deve seguir:

REPRODUZIR
↓
IDENTIFICAR CAUSA
↓
IDENTIFICAR IMPACTO
↓
CRIAR/ATUALIZAR TESTE
↓
CORRIGIR
↓
TESTAR
↓
REGRESSÃO
↓
REVISAR DIFF
↓
DOCUMENTAR


============================================================
29. TESTES
============================================================

Não considerar uma tarefa concluída somente porque o código compila.

Sempre que possível executar:

- lint;
- typecheck;
- testes unitários;
- testes de integração;
- testes E2E quando aplicáveis;
- build.

Alterações financeiras exigem testes específicos.


============================================================
30. BANCO E TESTES
============================================================

Antes de alterar schema:

- verificar migrations;
- verificar banco;
- verificar ambiente;
- verificar dados;
- verificar código dependente.

Depois:

- executar migration em ambiente seguro;
- testar;
- verificar rollback;
- verificar integridade.


============================================================
31. OCPP
============================================================

OCPP é crítico.

Alterações não podem quebrar:

- conexão;
- status;
- charging;
- telemetria;
- comandos;
- sessão.

Se uma alteração financeira afetar Charging/OCPP:

criar testes de regressão.


============================================================
32. API
============================================================

Ao modificar uma API existente:

verificar:

- frontend;
- mobile;
- integrações;
- consumers;
- DTOs;
- autenticação;
- permissões;
- testes.

Não remover ou alterar contratos sem avaliar impacto.


============================================================
33. FRONTEND
============================================================

O frontend apresenta dados.

Não deve ser autoridade para:

- valor final;
- comissão;
- split;
- saldo;
- regras financeiras.

Valores críticos devem ser recalculados/validados no backend.


============================================================
34. MOBILE
============================================================

Alterações no backend devem considerar impacto no aplicativo Flutter.

Não quebrar APIs consumidas pelo mobile sem plano de migração.


============================================================
35. CI/CD
============================================================

Sempre que possível:

Lint
↓
Typecheck
↓
Tests
↓
Build
↓
Migration Check
↓
Deploy

Não ignorar falhas críticas para realizar deploy.


============================================================
36. PRODUÇÃO
============================================================

Produção exige:

- credenciais corretas;
- pagamentos reais;
- migrations controladas;
- logs seguros;
- testes;
- health checks;
- rollback.

Não utilizar:

- código experimental;
- pagamento fake;
- banco reset;
- secrets no código.


============================================================
37. ALTERAÇÕES DE DEPENDÊNCIAS
============================================================

Não atualizar dependências apenas por estarem desatualizadas.

Antes de atualizar:

- verificar motivo;
- verificar breaking changes;
- verificar compatibilidade;
- verificar impacto;
- executar testes.


============================================================
38. NOVAS FUNCIONALIDADES
============================================================

Antes de implementar:

1. procurar funcionalidade existente;
2. identificar módulo correto;
3. avaliar arquitetura;
4. definir impacto;
5. implementar;
6. testar;
7. documentar.


============================================================
39. ARQUIVOS HISTÓRICOS
============================================================

Arquivos antigos, logs, prompts e documentação histórica não devem
ser tratados como instruções superiores ao código atual.

Não apagar automaticamente.

Primeiro identificar se ainda são utilizados.


============================================================
40. DOCUMENTAÇÃO
============================================================

Quando uma alteração modificar o comportamento real do sistema,
avaliar atualização de:

- CURRENT_STATE.md;
- ARCHITECTURE.md;
- BUSINESS_MODEL.md;
- PRD.md;
- regras;
- skills.

Documentação deve refletir o sistema real.


============================================================
41. REGRA DE MODIFICAÇÃO MÍNIMA
============================================================

Preferir:

MENOR ALTERAÇÃO NECESSÁRIA

em vez de:

MAIOR REFACTOR POSSÍVEL.


============================================================
42. REGRA DE RASTREABILIDADE
============================================================

Alterações críticas devem permitir responder:

- o que mudou?
- por quê?
- onde?
- qual impacto?
- qual teste?
- qual risco?
- como reverter?


============================================================
43. CHECKLIST ANTES DA ALTERAÇÃO
============================================================

[ ] Consultei CURRENT_STATE.md
[ ] Localizei a implementação existente
[ ] Pesquisei funcionalidades duplicadas
[ ] Verifiquei dependências
[ ] Verifiquei banco
[ ] Verifiquei migrations
[ ] Verifiquei testes
[ ] Verifiquei impacto financeiro
[ ] Verifiquei impacto em APIs
[ ] Verifiquei frontend
[ ] Verifiquei mobile
[ ] Verifiquei OCPP
[ ] Defini escopo mínimo


============================================================
44. CHECKLIST APÓS A ALTERAÇÃO
============================================================

[ ] Código compilando
[ ] Typecheck passando
[ ] Lint passando
[ ] Testes passando
[ ] Regressão executada
[ ] Migration revisada
[ ] Segurança revisada
[ ] Logs revisados
[ ] Secrets protegidos
[ ] Nenhuma funcionalidade duplicada
[ ] Nenhuma alteração desnecessária
[ ] Documentação atualizada


============================================================
45. COMPORTAMENTO OBRIGATÓRIO EM CASO DE INCERTEZA
============================================================

Se o Antigravity não tiver certeza:

NÃO INVENTAR.

NÃO ASSUMIR.

NÃO MIGRAR.

NÃO APAGAR.

NÃO REESCREVER.

NÃO CRIAR ARQUITETURA PARALELA.

Deve:

1. investigar o código;
2. pesquisar referências;
3. verificar configuração;
4. verificar documentação;
5. identificar a incerteza;
6. explicar o risco;
7. solicitar decisão quando necessário.


============================================================
46. REGRA DE SEGURANÇA ABSOLUTA
============================================================

Nunca realizar automaticamente:

- reset de banco;
- drop de tabela;
- drop de coluna;
- alteração de provider;
- migração PostgreSQL;
- conversão CUID → UUID;
- remoção de módulos existentes;
- alteração destrutiva de dados;
- pagamento real com dados simulados;
- exposição de secrets.


============================================================
47. PRINCÍPIO FINAL
============================================================

O ConectoVolt já possui uma base de código existente.

O Antigravity deve agir como:

ANALISTA
+
ARQUITETO
+
DESENVOLVEDOR
+
REVISOR

e não como um gerador que reconstrói o sistema inteiro a cada
solicitação.

Sempre:

ANALISAR
→
PESQUISAR
→
PLANEJAR
→
ALTERAR
→
TESTAR
→
REVISAR
→
DOCUMENTAR.


============================================================
48. OBJETIVO COMERCIAL
============================================================

A prioridade do produto é chegar a uma operação comercial estável.

O núcleo deve permitir:

- cadastrar empresas;
- cadastrar estações;
- cadastrar carregadores;
- registrar sessões;
- cobrar clientes;
- receber pagamentos;
- calcular comissão;
- distribuir valores;
- registrar transações;
- realizar refunds;
- reconciliar pagamentos;
- auditar operações.


============================================================
49. PRINCÍPIO FINAL DO PASSO 2
============================================================

Esta skill existe principalmente para eliminar conflitos históricos
e impedir que o Antigravity tome decisões arquiteturais incorretas.

CONFLITOS RESOLVIDOS:

PostgreSQL × MySQL/SQLite
→ NÃO MIGRAR AUTOMATICAMENTE.
→ Verificar ambiente real.
→ Estado atual orientado a MySQL/MariaDB.

UUID × CUID
→ MANTER CUID.
→ Não migrar sem aprovação.

Arquitetura financeira
→ Evoluir implementação existente.
→ Não criar pagamentos paralelos.
→ Separar Payment, Split, Commission, Wallet, Ledger, Refund e
  Reconciliation.

Alterações destrutivas
→ PROIBIDAS sem aprovação explícita.

Funcionalidades existentes
→ PESQUISAR PRIMEIRO.
→ Reutilizar/evoluir.
→ Não duplicar.

PRINCÍPIO:

O CÓDIGO ATUAL É A REALIDADE.
A DOCUMENTAÇÃO DEVE SER ATUALIZADA PARA REFLETIR A REALIDADE.
A SKILL DEVE IMPEDIR QUE O AGENTE VOLTE A DECISÕES HISTÓRICAS.


============================================================
FIM DA SKILL
============================================================
```