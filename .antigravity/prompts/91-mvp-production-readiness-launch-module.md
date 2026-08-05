# PROMPT 91 — MVP PRODUCTION READINESS & LAUNCH MODULE

## Contexto

Você está preparando a EV Charge Platform para lançamento comercial.

O objetivo agora é transformar o sistema desenvolvido em uma aplicação estável, segura e pronta para receber clientes reais.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/ARCHITECTURE.md
- docs/BUSINESS_MODEL.md
- docs/SECURITY.md

---

# Objetivo

Preparar a EV Charge Platform para ambiente de produção e primeiros clientes pagantes.

---

# Escopo MVP

Garantir funcionamento dos módulos:

## Usuário

- Cadastro.
- Login.
- Perfil.
- Veículo.
- Histórico.


## Estações

- Cadastro carregadores.
- Disponibilidade.
- Sessões.


## Operador

- Dashboard.
- Gestão estações.
- Tarifas.
- Receita.


## Pagamento

- Cobrança.
- Histórico.
- Recibos.


## Administração

- Gestão usuários.
- Gestão operadores.
- Relatórios.

---

# Auditoria arquitetura

Revisar:

- Backend.
- Frontend.
- Banco dados.
- APIs.
- Integrações.

Identificar:

- Falhas.
- Gargalos.
- Dependências.

---

# Ambiente produção

Criar:

```
environment/

development

staging

production
```

---

# Infraestrutura

Preparar:

- Servidores.
- Banco produção.
- Storage.
- Backup.
- Monitoramento.

---

# Deploy

Criar:

Pipeline CI/CD


Processo:

Código

↓

Testes

↓

Build

↓

Deploy

↓

Monitoramento

---

# Segurança produção

Implementar:

- HTTPS.
- Secrets management.
- Firewall.
- Controle acesso.
- Logs.

---

# Monitoramento

Criar:

System Monitoring


Acompanhar:

- CPU.
- Memória.
- Banco.
- APIs.
- Erros.

---

# Logs

Criar:

Centralized Logging


Registrar:

- Erros.
- Eventos.
- Ações críticas.

---

# Backup

Criar:

Backup Strategy


Definir:

- Frequência.
- Retenção.
- Recuperação.

---

# Testes finais

Executar:

## Teste usuário

Validar:

Cadastro.
Pagamento.
Recarga.


## Teste operador

Validar:

Estação.
Tarifa.
Relatórios.


## Teste administrador

Validar:

Controle.
Permissões.

---

# Documentação

Criar:

## Técnica

- Arquitetura.
- APIs.
- Deploy.


## Usuário

- Manual aplicativo.


## Operador

- Manual operação.

---

# Preparação comercial

Criar:

## Plano piloto

Definir:

- Primeiros clientes.
- Região inicial.
- Número estações.


## Modelo venda

Preparar:

- Mensalidade SaaS.
- Comissão recarga.
- Plano enterprise.

---

# Métricas lançamento

Monitorar:

- Usuários ativos.
- Sessões.
- Receita.
- Falhas.
- Retenção.

---

# Critério conclusão

O módulo está pronto quando:

✅ Plataforma roda em produção.

✅ Clientes conseguem usar.

✅ Operadores conseguem vender recarga.

✅ Sistema possui monitoramento.

---

# Entrega

Informar:

1. Status produção.
2. Testes realizados.
3. Infraestrutura.
4. Pendências.
5. Plano lançamento.