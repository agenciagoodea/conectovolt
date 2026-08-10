EV CHARGE PLATFORM
PRODUCT REQUIREMENTS DOCUMENT — PRD

Versão: 1.0.0
Status: Documento Mestre
Idioma: Português (Brasil)
Produto: EV Charge Platform


1. PROPÓSITO DO DOCUMENTO

Este documento define os requisitos de produto da EV Charge Platform.

O PRD é o documento mestre de requisitos do produto e deve ser utilizado como referência antes da implementação de qualquer funcionalidade relevante.

Todos os módulos, prompts, componentes, APIs, interfaces, integrações, processos operacionais e decisões de produto devem permanecer consistentes com este documento.

Quando existir conflito entre uma implementação e este PRD, o conflito deve ser identificado e resolvido antes da implementação continuar.


2. REGRA DE FONTE DE VERDADE

A hierarquia de referência do projeto deve ser:

1. docs/PRD.md
2. docs/ARCHITECTURE.md
3. docs/BUSINESS_MODEL.md
4. docs/SECURITY.md
5. Documentos específicos do domínio
6. Prompt específico do módulo
7. Implementação
8. Testes
9. Documentação operacional

Um prompt individual não deve introduzir uma funcionalidade importante que contradiga o PRD sem que o PRD seja atualizado.


3. VISÃO DO PRODUTO

A EV Charge Platform é uma plataforma digital para gestão, operação e utilização de infraestrutura de carregamento de veículos elétricos.

A plataforma conecta:

- Motoristas
- Veículos elétricos
- Estações de carregamento
- Carregadores
- Operadores
- Empresas
- Frotas
- Parceiros
- Sistemas de pagamento
- Infraestrutura de energia
- Sistemas externos

A plataforma deve funcionar como uma camada digital entre o usuário final, a operação comercial e a infraestrutura física de carregamento.


4. MISSÃO

Simplificar a experiência de carregamento de veículos elétricos e, ao mesmo tempo, fornecer aos operadores uma plataforma profissional para administrar, monitorar e monetizar sua infraestrutura.


5. OBJETIVOS PRINCIPAIS

A plataforma deve permitir:

1. Encontrar estações de carregamento.
2. Visualizar disponibilidade.
3. Visualizar informações dos carregadores.
4. Iniciar uma sessão de carregamento.
5. Acompanhar uma sessão em tempo real.
6. Finalizar uma sessão.
7. Processar pagamentos.
8. Emitir comprovantes e registros.
9. Consultar histórico.
10. Gerenciar veículos.
11. Gerenciar frotas.
12. Gerenciar estações.
13. Gerenciar carregadores.
14. Monitorar infraestrutura.
15. Gerenciar preços e tarifas.
16. Gerenciar clientes empresariais.
17. Administrar usuários e permissões.
18. Gerar relatórios.
19. Disponibilizar analytics.
20. Integrar hardware de carregamento.
21. Monitorar telemetria.
22. Detectar falhas.
23. Gerenciar manutenção.
24. Operar infraestrutura em produção.
25. Manter segurança e auditabilidade.
26. Permitir crescimento comercial.


6. PRINCÍPIOS DO PRODUTO

6.1 Confiabilidade

A EV Charge opera em um domínio de infraestrutura.

Indisponibilidade pode representar:

- perda de receita;
- indisponibilidade de carregamento;
- insatisfação do cliente;
- impacto operacional.

Confiabilidade deve ser prioridade.


6.2 Segurança

Segurança deve existir em todas as camadas:

- aplicação;
- API;
- banco de dados;
- identidade;
- pagamentos;
- infraestrutura;
- dispositivos;
- integrações.


6.3 Simplicidade

Os fluxos principais devem exigir o mínimo possível de etapas.


6.4 Escalabilidade

A arquitetura deve suportar crescimento sem necessidade de reescrever completamente o produto.


6.5 Observabilidade

Operações críticas devem ser monitoráveis, rastreáveis e auditáveis.


6.6 Interoperabilidade

Sempre que tecnicamente e comercialmente apropriado, a plataforma deve utilizar padrões e abstrações que permitam integração com múltiplos fabricantes e serviços.


7. PERFIS DE USUÁRIO

7.1 Motorista

Utiliza a plataforma para encontrar e utilizar carregadores.

Necessidades:

- Cadastro
- Login
- Perfil
- Veículo
- Busca de estações
- Disponibilidade
- Preço
- Carregamento
- Pagamento
- Histórico
- Notificações


7.2 Operador

Administra estações e carregadores.

Necessidades:

- Cadastro de estações
- Cadastro de carregadores
- Monitoramento
- Tarifas
- Sessões
- Receita
- Alertas
- Relatórios
- Manutenção


7.3 Gestor de Frota

Administra veículos e motoristas de uma frota.

Necessidades:

- Veículos
- Motoristas
- Sessões
- Gastos
- Relatórios
- Utilização


7.4 Cliente Empresarial

Utiliza a plataforma para operações corporativas.

Necessidades:

- Organização
- Usuários
- Permissões
- Veículos
- Frotas
- Cobrança
- Relatórios


7.5 Administrador da Plataforma

Responsável pela administração global.

Necessidades:

- Usuários
- Organizações
- Operadores
- Estações
- Dispositivos
- Configuração
- Segurança
- Auditoria
- Monitoramento


7.6 Suporte

Responsável pelo atendimento e investigação de problemas.

Deve poder consultar, conforme suas permissões:

- usuário;
- sessão;
- estação;
- carregador;
- pagamento;
- incidentes.


8. MODELO MULTI-TENANT

A plataforma deve suportar múltiplas organizações.

Entidades principais:

- Plataforma
- Organização
- Operador
- Empresa
- Frota
- Usuário
- Motorista
- Veículo
- Estação
- Carregador

Dados de diferentes organizações devem permanecer isolados.

O controle de acesso deve ocorrer em:

- API
- serviço
- camada de autorização
- banco de dados quando aplicável


9. DOMÍNIOS PRINCIPAIS

A plataforma deve ser organizada nos seguintes domínios:

Produto
UX/UI
Backend
Frontend
Mobile
Identidade
Usuários
Organizações
Veículos
Frotas
Estações
Carregadores
Sessões
Telemetria
Pagamentos
Faturamento
Receita
Analytics
Notificações
Suporte
Segurança
Compliance
DevOps
Cloud
Hardware
Administração
Documentação
Vendas
Customer Success
Marketing


10. IDENTIDADE E AUTENTICAÇÃO

A plataforma deve possuir:

- Cadastro
- Login
- Logout
- Recuperação de acesso
- Gestão de sessão
- MFA quando aplicável
- Controle de acesso
- Controle de permissões

As credenciais devem ser armazenadas de maneira segura.


11. AUTORIZAÇÃO E RBAC

A plataforma deve implementar controle baseado em funções.

Papéis mínimos:

- Motorista
- Gestor de Frota
- Operador
- Suporte
- Administrador
- Equipe Interna

Cada papel deve possuir permissões específicas.

O princípio do menor privilégio deve ser aplicado.


12. USUÁRIOS

O sistema deve permitir:

- criar usuário;
- atualizar usuário;
- desativar usuário;
- consultar perfil;
- gerenciar preferências;
- gerenciar dados de contato;
- excluir dados quando aplicável.


13. VEÍCULOS

Um usuário deve poder associar veículos à sua conta.

Informações podem incluir:

- fabricante;
- modelo;
- ano;
- identificador;
- compatibilidade;
- conector;
- informações de bateria quando disponíveis.


14. GESTÃO DE FROTAS

O sistema deve permitir:

- criar frota;
- gerenciar veículos;
- gerenciar motoristas;
- acompanhar carregamentos;
- analisar custos;
- consultar utilização;
- gerar relatórios.


15. ESTAÇÕES DE CARREGAMENTO

Operadores devem poder cadastrar estações.

Cada estação deve possuir, quando aplicável:

- identificador;
- nome;
- endereço;
- latitude;
- longitude;
- operador;
- carregadores;
- disponibilidade;
- tarifas;
- status operacional.


16. GESTÃO DE CARREGADORES

Cada equipamento físico deve possuir representação digital.

Informações:

- ID;
- fabricante;
- modelo;
- número de série;
- firmware;
- potência;
- conectores;
- localização;
- status.

Estados possíveis:

- Disponível
- Preparando
- Carregando
- Suspenso
- Finalizando
- Indisponível
- Com Falha
- Offline


17. INTEGRAÇÃO COM HARDWARE

A plataforma deve possuir uma camada de abstração para integração de equipamentos.

Essa camada deve permitir:

- registro;
- autenticação;
- comunicação;
- status;
- eventos;
- telemetria;
- comandos remotos;
- erros;
- configurações;
- atualização de firmware quando suportada.

A inclusão de um novo fabricante não deve exigir reescrever toda a plataforma.


18. OCPP E PROTOCOLOS

A arquitetura deve permitir integração com protocolos padronizados de carregamento, incluindo OCPP quando aplicável.

A implementação específica deve ser definida em:

docs/ARCHITECTURE.md

e nos módulos específicos de hardware.


19. TELEMETRIA

A plataforma deve receber e processar eventos de telemetria.

Exemplos:

- status;
- energia;
- potência;
- temperatura;
- erros;
- conectividade;
- estado da sessão.

Todos os eventos devem possuir timestamp e referência ao dispositivo.


20. SESSÕES DE CARREGAMENTO

Uma sessão representa uma operação de carregamento.

Deve possuir, quando aplicável:

- usuário;
- veículo;
- estação;
- carregador;
- início;
- fim;
- duração;
- energia;
- tarifa;
- valor;
- status.


21. FLUXO PRINCIPAL DO MOTORISTA

Login
↓
Buscar estação
↓
Selecionar estação
↓
Ver disponibilidade
↓
Selecionar carregador
↓
Ver preço
↓
Iniciar sessão
↓
Acompanhar carregamento
↓
Finalizar sessão
↓
Pagamento
↓
Comprovante
↓
Histórico

Esse é um dos fluxos críticos do produto.


22. DESCOBERTA DE ESTAÇÕES

O motorista deve poder visualizar estações através de:

- mapa;
- lista;
- localização;
- disponibilidade;
- potência;
- tipo de carregador;
- preço;
- distância.

Filtros devem ser implementados quando fizerem sentido para o MVP.


23. PREÇOS E TARIFAS

Operadores devem poder configurar preços conforme as regras comerciais aprovadas.

Modelos possíveis:

- por energia;
- por tempo;
- por sessão;
- assinatura;
- contrato corporativo.

O preço aplicável deve ser apresentado ao usuário antes da operação sempre que possível.


24. PAGAMENTOS

O sistema deve suportar:

- método de pagamento;
- autorização;
- cobrança;
- falha;
- confirmação;
- reembolso quando aplicável;
- histórico;
- comprovante.

Dados sensíveis de cartão não devem ser armazenados diretamente quando o provedor de pagamento puder realizar essa função de forma compatível.


25. FATURAMENTO

O sistema deve suportar:

- transações;
- faturas;
- cobranças;
- assinaturas quando aplicáveis;
- cobrança empresarial;
- status financeiro;
- histórico.


26. RECEITA

A plataforma deve disponibilizar informações como:

- receita bruta;
- receita líquida quando disponível;
- receita por estação;
- receita por operador;
- número de transações;
- ticket médio;
- evolução de receita.


27. EMPRESAS

Clientes empresariais devem possuir:

- organização;
- usuários;
- papéis;
- permissões;
- veículos;
- frotas;
- faturamento;
- relatórios.


28. DASHBOARD DO OPERADOR

O operador deve visualizar:

- estações;
- carregadores;
- disponibilidade;
- sessões ativas;
- energia;
- receita;
- alertas;
- falhas;
- utilização.


29. ADMINISTRAÇÃO

O painel administrativo deve permitir:

- usuários;
- organizações;
- operadores;
- estações;
- dispositivos;
- configurações;
- relatórios;
- segurança;
- auditoria.

Todas as ações administrativas relevantes devem ser registradas.


30. ANALYTICS

A plataforma deve fornecer indicadores de:

Usuários:

- usuários ativos;
- novos usuários;
- retenção;
- frequência.

Infraestrutura:

- disponibilidade;
- utilização;
- downtime;
- falhas.

Carregamento:

- sessões;
- energia;
- duração;
- valor médio.

Financeiro:

- receita;
- crescimento;
- transações.


31. RELATÓRIOS

Relatórios devem incluir, conforme o módulo:

- estações;
- carregadores;
- sessões;
- energia;
- receita;
- frotas;
- empresas;
- usuários.


32. ALERTAS

Alertas devem ser gerados para eventos relevantes.

Exemplos:

- carregador offline;
- falha de dispositivo;
- perda de comunicação;
- falha de pagamento;
- incidente de segurança;
- indisponibilidade crítica.

Alertas devem possuir severidade.


33. MANUTENÇÃO

O sistema deve registrar:

- equipamento;
- problema;
- data;
- responsável;
- resolução;
- status.

Histórico deve ser preservado.


34. CONTROLE REMOTO

Quando suportado pelo hardware e protocolo, operadores autorizados poderão:

- iniciar operação;
- finalizar operação;
- reiniciar dispositivo;
- alterar configurações;
- executar comandos disponíveis.

Comandos remotos devem ser autenticados, autorizados e auditados.


35. FIRMWARE

Quando suportado:

- controlar versões;
- registrar atualizações;
- monitorar resultado;
- manter histórico;
- permitir recuperação quando tecnicamente possível.


36. MANUTENÇÃO PREDITIVA

A arquitetura deve permitir evolução futura para:

- detecção de padrões;
- previsão de falhas;
- manutenção preventiva;
- análise de performance.

Essa capacidade não deve bloquear o MVP.


37. NOTIFICAÇÕES

A plataforma poderá utilizar:

- push;
- e-mail;
- notificações internas.

Eventos importantes devem ser comunicados de acordo com as preferências do usuário.


38. SUPORTE AO CLIENTE

O sistema deve permitir investigação de:

- conta;
- carregamento;
- pagamento;
- estação;
- carregador;
- problemas operacionais.

O suporte deve possuir acesso limitado ao necessário.


39. SEGURANÇA

Requisitos mínimos:

- autenticação segura;
- autorização;
- RBAC;
- MFA quando aplicável;
- criptografia;
- proteção de segredos;
- logs;
- auditoria;
- rate limiting;
- validação de entrada;
- monitoramento.


40. CYBERSECURITY

A plataforma deve possuir capacidade de:

- detecção de ameaças;
- gestão de vulnerabilidades;
- monitoramento;
- resposta a incidentes;
- auditoria;
- testes de segurança.

Fluxo:

Detecção
↓
Contenção
↓
Investigação
↓
Correção
↓
Recuperação
↓
Documentação


41. PRIVACIDADE E LGPD

A plataforma deve ser projetada considerando a legislação aplicável, incluindo a LGPD no Brasil.

Deve suportar, quando aplicável:

- consentimento;
- acesso;
- correção;
- exclusão;
- retenção;
- proteção de dados.


42. AUDITORIA

Eventos críticos devem ser auditáveis.

Exemplos:

- login;
- alteração de permissões;
- alteração financeira;
- comando em carregador;
- alteração de configuração;
- ação administrativa.

Registro mínimo:

- ator;
- ação;
- recurso;
- timestamp.


43. INFRAESTRUTURA CLOUD

Devem existir ambientes separados:

Development
Staging
Production

A infraestrutura deve ser reproduzível.


44. DEVOPS

O processo de desenvolvimento deve suportar:

Código
↓
Testes
↓
Validação
↓
Build
↓
Deploy
↓
Monitoramento

Deve existir capacidade de rollback.


45. CI/CD

Deploys devem ser:

- controlados;
- rastreáveis;
- repetíveis;
- testados.


46. OBSERVABILIDADE

Produção deve possuir:

- métricas;
- logs;
- tracing quando aplicável;
- health checks;
- alertas.


47. BACKUP

Dados críticos devem possuir:

- backup;
- retenção;
- rotina de recuperação;
- testes de restauração.


48. DISASTER RECOVERY

Deve existir plano para:

- falha de infraestrutura;
- perda de dados;
- indisponibilidade;
- recuperação de serviços.


49. PERFORMANCE

Monitorar:

- APIs;
- banco de dados;
- frontend;
- mobile;
- sessões;
- pagamentos;
- eventos de hardware.


50. ESCALABILIDADE

A arquitetura deve suportar crescimento em:

- usuários;
- estações;
- carregadores;
- sessões;
- transações;
- telemetria;
- organizações.


51. MOBILE

O aplicativo móvel deve suportar:

- autenticação;
- perfil;
- veículos;
- estações;
- carregamento;
- pagamentos;
- histórico;
- notificações.


52. WEB

A aplicação web deve suportar:

- operadores;
- empresas;
- frotas;
- administração;
- relatórios;
- analytics.


53. API

APIs devem possuir:

- autenticação;
- autorização;
- validação;
- versionamento;
- rate limiting;
- tratamento de erros;
- documentação.


54. IDEMPOTÊNCIA

Operações que possam ser repetidas devem evitar efeitos duplicados.

Especialmente:

- pagamentos;
- sessões;
- comandos;
- webhooks;
- integrações.


55. FALHAS DE TERCEIROS

Integrações externas devem possuir, quando apropriado:

- timeout;
- retry;
- circuit breaker;
- fallback;
- logging.


56. QUALIDADE DOS DADOS

Dados críticos devem manter:

- consistência;
- integridade;
- rastreabilidade;
- timestamp;
- histórico.

Dados financeiros e de carregamento não devem ser silenciosamente sobrescritos.


57. UX/UI

O produto deve possuir:

- navegação clara;
- componentes consistentes;
- estados de carregamento;
- estados vazios;
- mensagens de erro;
- feedback de sucesso;
- acessibilidade;
- responsividade.


58. DESIGN SYSTEM

O produto deve manter consistência entre:

- aplicativo;
- web;
- dashboards;
- componentes administrativos.


59. DOCUMENTAÇÃO

Devem existir:

- documentação do usuário;
- documentação do operador;
- documentação administrativa;
- documentação técnica;
- documentação de API;
- FAQ;
- treinamento.


60. ONBOARDING

Fluxo empresarial:

Contrato
↓
Configuração
↓
Integração
↓
Treinamento
↓
Go-Live
↓
Monitoramento
↓
Customer Success


61. CUSTOMER SUCCESS

Deve existir acompanhamento de:

- ativação;
- utilização;
- satisfação;
- problemas;
- retenção;
- expansão.


62. VENDAS

A plataforma deve suportar processos comerciais para:

- motoristas;
- operadores;
- frotas;
- empresas;
- parceiros.


63. MARKETING

A estratégia de marketing deve estar alinhada ao posicionamento definido para a EV Charge.

O marketing não deve alterar requisitos funcionais do produto sem aprovação.


64. PARCEIROS

A plataforma deve permitir evolução para integrações com:

- fabricantes;
- empresas de energia;
- empresas de tecnologia;
- montadoras;
- sistemas corporativos;
- outros operadores.


65. API E ECOSSISTEMA

A arquitetura deve permitir futura expansão para:

- APIs externas;
- integrações empresariais;
- marketplace de APIs;
- parceiros estratégicos.


66. MODELO DE DADOS PRINCIPAL

Entidades principais:

User
Organization
Operator
Enterprise
Fleet
Driver
Vehicle
Station
ChargingDevice
ChargingSession
TelemetryEvent
Payment
Invoice
Subscription
MaintenanceRecord
Alert
SecurityEvent
AuditLog
Deployment
Incident


67. EVENTOS DO PRODUTO

Eventos importantes incluem:

- usuário cadastrado;
- login;
- estação pesquisada;
- estação selecionada;
- carregador selecionado;
- sessão iniciada;
- sessão atualizada;
- sessão finalizada;
- pagamento iniciado;
- pagamento concluído;
- pagamento falhou;
- dispositivo ficou offline;
- incidente criado.


68. FLUXO CRÍTICO END-TO-END

Usuário
↓
Autenticação
↓
Busca estação
↓
Seleciona estação
↓
Seleciona carregador
↓
Consulta preço
↓
Inicia sessão
↓
Hardware confirma operação
↓
Telemetria
↓
Usuário acompanha
↓
Sessão finalizada
↓
Pagamento
↓
Comprovante
↓
Histórico

Esse fluxo deve possuir testes automatizados e end-to-end.


69. FLUXO DO OPERADOR

Login
↓
Organização
↓
Estação
↓
Carregador
↓
Configuração
↓
Monitoramento
↓
Sessões
↓
Receita
↓
Analytics
↓
Relatórios


70. FLUXO DE INFRAESTRUTURA

Carregador
↓
Comunicação
↓
Gateway/Connector
↓
Backend
↓
Processamento
↓
Banco
↓
Analytics
↓
Dashboard


71. FLUXO DE DEPLOY

Código
↓
Pull Request
↓
Testes
↓
Análise de qualidade
↓
Segurança
↓
Build
↓
Staging
↓
Validação
↓
Produção
↓
Monitoramento


72. TRATAMENTO DE ERROS

Erros devem:

- ser registrados;
- possuir contexto;
- possuir rastreabilidade;
- não expor informações sensíveis;
- apresentar mensagem adequada ao usuário.


73. INCIDENTES

Prioridades:

P0 — Crítico
P1 — Alto
P2 — Médio
P3 — Baixo

P0 pode incluir:

- indisponibilidade geral;
- falha de pagamentos;
- falha generalizada de carregamento;
- incidente de segurança grave;
- perda de dados.


74. MÉTRICAS DE PRODUTO

Indicadores principais:

Produto:

- usuários ativos;
- sessões;
- retenção;
- conversão.

Infraestrutura:

- uptime;
- disponibilidade;
- utilização;
- falhas.

Financeiro:

- receita;
- transações;
- ticket médio;
- crescimento.

Operação:

- incidentes;
- tempo de resolução;
- chamados;
- disponibilidade.


75. MVP

O MVP deve priorizar o mínimo necessário para uma operação comercial real.

Prioridades:

1. Identidade.
2. Usuários.
3. Organizações.
4. Estações.
5. Carregadores.
6. Sessões.
7. Hardware.
8. Pagamentos.
9. Histórico.
10. Operador.
11. Administração.
12. Segurança.
13. Infraestrutura de produção.
14. Monitoramento.


76. FORA DO ESCOPO INICIAL

Não devem bloquear o primeiro lançamento, salvo necessidade comercial específica:

- expansão global;
- IA avançada;
- blockchain;
- marketplace complexo;
- digital twins;
- otimização avançada de rede;
- funcionalidades experimentais.


77. EVOLUÇÕES FUTURAS

Possíveis evoluções:

- IA para mobilidade;
- manutenção preditiva;
- previsão de demanda;
- otimização energética;
- API marketplace;
- expansão internacional;
- inteligência avançada para frotas;
- integração com smart grid.


78. CRITÉRIOS DE ACEITE DO PRODUTO

O produto deve ser considerado funcional quando:

- usuário consegue se cadastrar;
- usuário consegue localizar estação;
- usuário consegue iniciar sessão;
- sessão é processada;
- hardware comunica corretamente;
- telemetria é recebida;
- sessão pode ser encerrada;
- pagamento pode ser processado;
- histórico é registrado;
- operador consegue administrar estação;
- operador consegue visualizar carregadores;
- administrador consegue gerenciar plataforma.


79. CRITÉRIOS DE SEGURANÇA

Antes de produção:

- autenticação funcional;
- autorização funcional;
- RBAC validado;
- dados protegidos;
- segredos protegidos;
- logs ativos;
- auditoria ativa;
- vulnerabilidades críticas corrigidas.


80. CRITÉRIOS DE INFRAESTRUTURA

Antes de produção:

- cloud operacional;
- CI/CD funcional;
- staging disponível;
- produção disponível;
- monitoramento ativo;
- alertas ativos;
- backup configurado;
- recuperação testada;
- rollback disponível.


81. CRITÉRIOS DE HARDWARE

Antes de produção:

- dispositivo consegue conectar;
- autenticação funciona;
- status é recebido;
- eventos são processados;
- sessão é sincronizada;
- erros são registrados;
- comandos autorizados funcionam;
- telemetria chega corretamente.


82. CRITÉRIOS FINANCEIROS

Antes de produção:

- pagamento funcional;
- tratamento de falhas;
- histórico;
- comprovante;
- reconciliação;
- auditoria.


83. CRITÉRIOS OPERACIONAIS

Antes de produção:

- suporte disponível;
- documentação disponível;
- processo de incidentes;
- treinamento;
- onboarding;
- monitoramento;
- plano de recuperação.


84. GO / NO-GO

A decisão de lançamento deve ser formal.

GO quando:

- produto funciona;
- hardware funciona;
- pagamentos funcionam;
- segurança está validada;
- infraestrutura está pronta;
- suporte está pronto;
- cliente piloto validou.

NO-GO quando houver:

- falha crítica;
- vulnerabilidade crítica;
- perda de dados;
- pagamento quebrado;
- carregamento indisponível;
- ausência de recuperação operacional.


85. LANÇAMENTO

O lançamento deve seguir:

Validação
↓
Piloto
↓
Correções
↓
Go-Live
↓
Monitoramento
↓
Customer Success
↓
Escala


86. PRIMEIROS 90 DIAS

Dias 1–30:

- estabilidade;
- operação;
- correção de problemas;
- feedback.

Dias 31–60:

- aquisição;
- retenção;
- melhoria do produto;
- expansão controlada.

Dias 61–90:

- escala;
- vendas;
- casos de sucesso;
- otimização.


87. GOVERNANÇA DE PRODUTO

Alterações relevantes devem registrar:

- mudança;
- motivo;
- impacto;
- módulos afetados;
- aprovação;
- data.


88. TESTES

Cada módulo relevante deve possuir:

- testes unitários;
- testes de integração;
- testes de API;
- testes de segurança;
- testes end-to-end quando aplicável.

Fluxos críticos devem ser testados antes de produção.


89. REGRA PARA O ANTIGRAVITY

Antes de implementar qualquer módulo, o agente deve:

1. Ler docs/PRD.md.
2. Ler a arquitetura relevante.
3. Ler as regras de negócio.
4. Ler os requisitos de segurança.
5. Ler o prompt específico.
6. Inspecionar o código existente.
7. Identificar funcionalidades já implementadas.
8. Evitar duplicação.
9. Implementar somente o necessário.
10. Executar testes.
11. Atualizar documentação quando necessário.

O agente não deve reescrever funcionalidades existentes sem justificativa.


90. REGRA CONTRA IMPLEMENTAÇÃO DESNECESSÁRIA

Não implementar uma funcionalidade somente porque ela pode ser tecnicamente interessante.

Prioridade:

Necessidade do cliente
↓
Requisito do PRD
↓
Valor comercial
↓
Segurança
↓
Confiabilidade
↓
Implementação


91. MAPEAMENTO DOS PROMPTS

Os prompts 001–108 representam a decomposição operacional do projeto.

Eles devem ser tratados como instruções de implementação especializadas.

O PRD continua sendo a referência principal de produto.


92. MÓDULOS 001–092

Os módulos iniciais representam a fundação funcional, técnica, operacional e comercial da plataforma.

Eles devem ser interpretados em conjunto com os seguintes domínios:

- Produto
- UX/UI
- Backend
- Frontend
- Mobile
- Identidade
- Usuários
- Organizações
- Estações
- Sessões
- Pagamentos
- Frotas
- Analytics
- Administração
- Operações
- Vendas
- Marketing
- Financeiro
- Segurança
- Compliance
- Documentação

Nenhum módulo inicial deve ser implementado isoladamente sem verificar suas dependências.


93. MÓDULO 093 — PILOTO E PRIMEIRA IMPLEMENTAÇÃO DE CLIENTE

Objetivos:

- preparar cliente piloto;
- configurar organização;
- configurar estações;
- configurar usuários;
- validar operação;
- acompanhar primeiros usuários;
- coletar feedback.

Critério:

Cliente piloto deve conseguir operar o sistema em ambiente controlado.


94. MÓDULO 094 — CUSTOMER SUCCESS E ESCALA OPERACIONAL

Objetivos:

- onboarding;
- acompanhamento;
- suporte;
- retenção;
- expansão.

Indicadores:

- ativação;
- utilização;
- satisfação;
- retenção;
- expansão.


95. MÓDULO 095 — ESCALA DE VENDAS E CANAIS

Objetivos:

- estruturar vendas;
- canais;
- parceiros;
- aquisição;
- pipeline comercial.


96. MÓDULO 096 — INVESTIMENTO E ESCALA DA EMPRESA

Objetivos:

- preparação para investidores;
- indicadores;
- documentação;
- estrutura de crescimento.

Esse módulo não deve bloquear o MVP.


97. MÓDULO 097 — CONTRATOS EMPRESARIAIS E VENDAS ENTERPRISE

Objetivos:

- contratos;
- clientes grandes;
- propostas;
- requisitos corporativos;
- onboarding empresarial.


98. MÓDULO 098 — EXCELÊNCIA OPERACIONAL E GESTÃO INTERNA

Objetivos:

- processos;
- responsabilidades;
- indicadores;
- operações internas;
- melhoria contínua.


99. MÓDULO 099 — OPERAÇÕES FINANCEIRAS E GESTÃO DE RECEITA

Objetivos:

- cobrança;
- receita;
- conciliação;
- relatórios;
- acompanhamento financeiro.


100. MÓDULO 100 — JURÍDICO, COMPLIANCE E RISCO

Objetivos:

- compliance;
- documentação;
- riscos;
- contratos;
- proteção jurídica;
- governança.


101. MÓDULO 101 — MARCA, MARKETING E POSICIONAMENTO

Objetivos:

- identidade;
- posicionamento;
- comunicação;
- marketing;
- aquisição.


102. MÓDULO 102 — DATA PLATFORM E ANALYTICS OPERACIONAL

Objetivos:

- dados;
- métricas;
- analytics;
- relatórios;
- indicadores operacionais.


103. MÓDULO 103 — POLIMENTO DO PRODUTO E UX/UI

Objetivos:

- refinamento visual;
- experiência;
- consistência;
- acessibilidade;
- responsividade;
- redução de fricção.


104. MÓDULO 104 — DOCUMENTAÇÃO E TREINAMENTO

Objetivos:

- documentação técnica;
- documentação do usuário;
- treinamento;
- operação;
- suporte.


105. MÓDULO 105 — PRONTIDÃO FINAL PARA LANÇAMENTO

Objetivos:

- validar produto;
- validar operação;
- validar infraestrutura;
- validar segurança;
- validar suporte;
- validar cliente piloto.

Deve produzir decisão:

GO

ou

NO-GO


106. MÓDULO 106 — DEVOPS, CLOUD E CONFIABILIDADE

Objetivos:

- infraestrutura cloud;
- ambientes;
- CI/CD;
- deploy;
- rollback;
- monitoramento;
- logs;
- observabilidade;
- backup;
- disaster recovery;
- escalabilidade.

Estrutura esperada:

Código
↓
CI
↓
Testes
↓
Build
↓
Deploy
↓
Monitoramento
↓
Recuperação


107. MÓDULO 107 — CYBERSECURITY E PROTEÇÃO CONTRA AMEAÇAS

Objetivos:

- segurança de identidade;
- MFA;
- RBAC;
- segurança API;
- criptografia;
- secrets management;
- threat detection;
- vulnerability management;
- incident response;
- auditoria.

Estrutura:

Detecção
↓
Contenção
↓
Investigação
↓
Correção
↓
Recuperação


108. MÓDULO 108 — INTEGRAÇÃO DE HARDWARE E GESTÃO DE DISPOSITIVOS

Objetivos:

- conectar carregadores;
- registrar dispositivos;
- receber telemetria;
- monitorar status;
- executar comandos;
- controlar firmware;
- gerenciar manutenção;
- detectar falhas.

Estrutura:

Carregador
↓
Protocolo
↓
Connector
↓
EV Charge
↓
Telemetria
↓
Analytics
↓
Operador


109. RELAÇÃO ENTRE OS MÓDULOS

Os módulos devem ser implementados respeitando dependências.

A sequência conceitual é:

PRD
↓
Arquitetura
↓
Fundação técnica
↓
Identidade
↓
Usuários
↓
Organizações
↓
Estações
↓
Carregadores
↓
Sessões
↓
Hardware
↓
Pagamentos
↓
Analytics
↓
Operação
↓
Segurança
↓
DevOps
↓
Piloto
↓
Lançamento

A ordem exata de execução deve ser determinada após a auditoria do código existente.


110. ARQUITETURA DE REFERÊNCIA

A arquitetura deve possuir, conforme necessidade:

Aplicação Mobile
        │
Aplicação Web
        │
        ▼
API / Backend
        │
 ┌──────┼─────────────┐
 ▼      ▼             ▼
Dados   Serviços     Integrações
        │             │
        │             ├── Pagamentos
        │             ├── Mapas
        │             ├── Notificações
        │             └── Hardware
        │
        ▼
Banco de Dados
        │
        ▼
Analytics / Observabilidade

A arquitetura detalhada deve permanecer em:

docs/ARCHITECTURE.md


111. SEGURANÇA DA ARQUITETURA

Segurança deve existir em:

Usuário
↓
Autenticação
↓
Autorização
↓
API
↓
Serviços
↓
Banco
↓
Infraestrutura
↓
Dispositivos


112. REGRAS DE IMPLEMENTAÇÃO

Antes de criar código:

- verificar se funcionalidade já existe;
- verificar PRD;
- verificar arquitetura;
- verificar regras;
- verificar segurança;
- verificar dependências.

Não duplicar entidades, serviços ou APIs existentes.


113. REGRA DE ALTERAÇÃO DO PRD

Quando surgir um requisito novo:

1. Identificar necessidade.
2. Verificar se está no escopo.
3. Avaliar impacto.
4. Atualizar PRD.
5. Atualizar arquitetura se necessário.
6. Atualizar prompt afetado.
7. Implementar.
8. Testar.
9. Documentar.


114. CRITÉRIO FINAL DE CONCLUSÃO

A EV Charge estará pronta para seu primeiro lançamento comercial quando:

- usuários conseguem utilizar o produto;
- estações estão operacionais;
- carregadores estão integrados;
- sessões funcionam;
- pagamentos funcionam;
- histórico funciona;
- operadores conseguem administrar infraestrutura;
- empresas conseguem utilizar os recursos corporativos necessários;
- segurança está validada;
- infraestrutura está monitorada;
- backups estão configurados;
- recuperação foi testada;
- suporte está preparado;
- documentação existe;
- cliente piloto foi validado;
- não existem bloqueadores críticos.


115. DEFINIÇÃO FINAL DO PRODUTO

A EV Charge Platform deve ser:

- confiável;
- segura;
- simples;
- escalável;
- observável;
- comercialmente útil;
- preparada para integração com infraestrutura física.

O objetivo do projeto não é implementar todas as funcionalidades possíveis.

O objetivo é criar uma plataforma de carregamento elétrico funcional, segura e comercialmente utilizável.


116. REGRA FINAL PARA O ANTIGRAVITY

Ao receber qualquer prompt de implementação da EV Charge:

1. Leia docs/PRD.md
2. Leia docs/ARCHITECTURE.md
3. Leia as regras aplicáveis
4. Leia o prompt solicitado
5. Inspecione o código existente
6. Mapeie dependências
7. Implemente
8. Teste
9. Valide contra o PRD
10. Documente

Nunca presumir que o repositório está vazio.

Nunca recriar uma funcionalidade existente sem necessidade.

Nunca ignorar segurança.

Nunca implementar uma funcionalidade crítica sem testes.

Nunca considerar uma funcionalidade concluída apenas porque o código foi criado.


117. DEFINIÇÃO DE "PRONTO"

Uma funcionalidade somente será considerada pronta quando:

- código implementado;
- integração realizada;
- testes executados;
- erros críticos resolvidos;
- segurança validada quando aplicável;
- documentação atualizada;
- comportamento validado contra o PRD.


118. VERSÃO DO DOCUMENTO

Versão atual:

1.0.0

Status:

MASTER PRODUCT REQUIREMENTS DOCUMENT

Idioma:

Português (Brasil)

Produto:

EV Charge Platform


FIM DO PRD