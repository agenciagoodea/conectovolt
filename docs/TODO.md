# TODO - EV CHARGE PLATFORM

Versão: MVP 1.0

Status:
🟡 Em Desenvolvimento

---

# COMO UTILIZAR

Este documento controla todas as tarefas do projeto.

Regra:

- Executar uma tarefa por vez.
- Marcar como concluída após teste.
- Não pular etapas.
- Não criar funcionalidades fora do escopo MVP.

Legenda:

⬜ Pendente

🟡 Em andamento

✅ Concluído

---

# FASE 01 — PREPARAÇÃO DO PROJETO

## Estrutura inicial

✅ Criar repositório Git

✅ Criar estrutura de pastas

✅ Configurar README

✅ Configurar variáveis de ambiente

✅ Configurar Docker inicial

✅ Configurar banco PostgreSQL

✅ Configurar Prisma ORM


---

# FASE 02 — BANCO DE DADOS

## Modelagem inicial

✅ Criar schema Prisma

✅ Criar tabela Users

✅ Criar tabela Roles

✅ Criar tabela Companies

✅ Criar tabela Stations

✅ Criar tabela Chargers

✅ Criar tabela Connectors

✅ Criar tabela Vehicles

✅ Criar tabela Charging Sessions

✅ Criar tabela Tariffs

✅ Criar tabela Payments

✅ Criar tabela Commissions

✅ Criar tabela Wallets

✅ Criar tabela Transactions


---

# FASE 03 — BACKEND BASE

## Configuração NestJS

✅ Criar projeto NestJS

✅ Configurar Prisma

✅ Configurar PostgreSQL

✅ Configurar Swagger

✅ Configurar tratamento global de erros

✅ Configurar validação DTO

✅ Configurar logs


---

# FASE 04 — AUTENTICAÇÃO

## Usuários

✅ Cadastro

✅ Login

✅ Logout

✅ Refresh Token

✅ Recuperação de senha

✅ Controle de permissões


Perfis:

✅ Super Admin

✅ Operador

✅ Funcionário

✅ Cliente


---

# FASE 05 — GESTÃO DA OPERAÇÃO

## Empresas

✅ CRUD Empresas

✅ Aprovação/Rejeição (PENDING → ACTIVE/INACTIVE)


## Postos

✅ CRUD Postos

✅ Cadastro localização

✅ Filtros (status, city, company_id)


## Carregadores

✅ CRUD Carregadores

✅ Status online/offline/error

✅ CRUD Conectores (TYPE2, CCS, CHADEMO)


## Tarifas

✅ Criar tarifas

✅ Definir preço kWh

✅ Ativar/desativar tarifas


## Veículos

✅ CRUD Veículos (vinculado ao usuário autenticado)


---

# FASE 06 — SESSÃO DE RECARGA

## Controle da recarga

✅ Criar sessão

✅ Iniciar recarga

✅ Atualizar consumo (tempo real WebSocket)

✅ Finalizar recarga

✅ Calcular valor (baseado na tarifa)

✅ Registrar histórico (com paginacao)


Dados obrigatorios:

✅ Cliente

✅ Posto

✅ Carregador

✅ Conector

✅ Energia

✅ Tempo (duracao)

✅ Valor (calculado automaticamente)



---

# FASE 07 — OCPP

## Integração inicial

✅ Criar Gateway OCPP (WebSocket na porta 3001)

✅ Receber conexão do carregador

✅ Registrar equipamento (auto-create charger/station/company)

✅ Heartbeat

✅ StatusNotification (atualiza status charger + connector)

✅ Iniciar transação (StartTransaction -> cria ChargingSession)

✅ Finalizar transação (StopTransaction -> finaliza + calcula valor)


---

# FASE 08 — PAGAMENTOS

## Gateway

✅ Integrar PIX (Mercado Pago + modo simulação)

✅ Integrar cartão (Mercado Pago + modo simulação)

✅ Registrar pagamento


## Comissão

✅ Criar regra percentual (5% default)

✅ Calcular comissão (automática ao aprovar pagamento)

✅ Atualizar carteira operador (crédito automático)

✅ Registrar receita plataforma


---

# FASE 09 — FINANCEIRO

## Operador

✅ Extrato (transações)

✅ Saldo disponível (carteira)

✅ Solicitar saque


## Plataforma

✅ Receita total (dashboard admin)

✅ Comissão recebida

✅ Relatórios financeiros


---

# FASE 10 — DASHBOARD ADMINISTRATIVO

## Indicadores

✅ Receita (total + comissão)

✅ Recargas (total + por operador)

✅ kWh consumido

✅ Usuários ativos

✅ Postos ativos

✅ Carregadores online

✅ Saldo disponível (operador)


---

# FASE 11 — FRONTEND WEB

## Painel Administrativo

✅ Criar projeto Next.js (Tailwind + App Router)

✅ Layout principal (sidebar + header)

✅ Login (JWT + refresh token automático)

✅ Dashboard (admin: receita, operadores, postos / operador: receita, sessoes)

✅ Empresas (listar, criar, aprovar, rejeitar)

✅ Postos (listar, criar com geolocalizacao)

✅ Carregadores (listar, criar, status online/offline)

✅ Financeiro (saldo, saque, extrato)

✅ Relatórios (comissoes, receita bruta, repasses)


---

# FASE 12 — APLICATIVO MOBILE

## Cliente

✅ Criar projeto Flutter (Clean Architecture + Riverpod + GoRouter)

✅ Login

✅ Cadastro

✅ Lista de postos (com cards detalhados)

✅ Detalhe do posto (com carregadores disponíveis)

✅ Iniciar recarga (timer real + atualização de consumo)

✅ Pagamento (PIX com QR Code + copy/paste)

✅ Histórico (lista com status, energia, valor)


---

# FASE 13 — TESTES

✅ Testes backend (36 testes em 5 suites)

✅ Testes API (auth, charging, payments via NestJS Testing)

✅ Testes pagamento (PIX, approve, refund, webhook)

✅ Testes recarga (start, update, stop, validações)

✅ Testes RBAC (RolesGuard)


---

# FASE 14 — PRODUÇÃO

✅ Criar servidor (Dockerfile backend + frontend)

✅ Configurar domínio (nginx reverso)

✅ Configurar SSL (script auto-generate)

✅ Deploy backend (docker-compose.prod.yml)

✅ Deploy frontend (Dockerfile + nginx)

✅ Publicar aplicativo (Flutter APK config)

✅ Monitoramento (health endpoint /api/v1/health)

✅ Script de deploy automatizado (deploy.sh)


---

# IDEIAS FUTURAS

Não implementar no MVP.

⬜ Cashback

⬜ Assinaturas

⬜ White Label

⬜ IA de previsão

⬜ Tarifação dinâmica

⬜ Programa de fidelidade

⬜ API pública

⬜ OCPP 2.0.1 completo
