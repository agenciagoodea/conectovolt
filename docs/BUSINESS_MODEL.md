# BUSINESS MODEL

Projeto: ConectoVolt

Versão: 1.0

---

# Objetivo

A ConectoVolt é uma plataforma SaaS que conecta operadores de postos de recarga e motoristas.

Além da gestão dos carregadores, a plataforma intermedia os pagamentos e recebe uma comissão sobre cada recarga realizada.

---

# Modelo de Receita

A plataforma NÃO cobra mensalidade obrigatória.

A receita principal será baseada em comissão por transação.

Exemplo:

Valor da Recarga: R$ 100,00

Comissão da Plataforma: 5%

Operador recebe: R$ 95,00

Plataforma recebe: R$ 5,00

---

# Fluxo Financeiro

Motorista

↓

App ConectoVolt

↓

Gateway de Pagamento

↓

Pagamento Aprovado

↓

Plataforma registra a transação

↓

Calcula comissão

↓

Atualiza saldo do operador

↓

Disponibiliza saque

---

# Perfis do Sistema

## Super Admin

Responsável pela plataforma.

Pode:

- Gerenciar operadores
- Definir comissão padrão
- Aprovar operadores
- Visualizar todas as transações
- Configurar gateways
- Gerenciar planos futuros

---

## Operador

Empresa dona dos carregadores.

Pode:

- Cadastrar postos
- Cadastrar carregadores
- Definir tarifas
- Visualizar recargas
- Visualizar extrato
- Solicitar saque
- Gerenciar equipe

---

## Motorista

Usuário final.

Pode:

- Localizar postos
- Iniciar recarga
- Encerrar recarga
- Efetuar pagamento
- Visualizar histórico
- Favoritar postos

---

# Modelo de Comissão

A comissão poderá ser:

- Percentual (%)
- Valor fixo
- Mista (futuro)

No MVP utilizaremos apenas percentual.

---

# Saques

O operador poderá solicitar saque do saldo disponível.

Status:

- Solicitado
- Em análise
- Processando
- Pago
- Cancelado

---

# Fluxo da Recarga

1. Motorista encontra um posto.
2. Escaneia o QR Code ou seleciona o carregador.
3. Inicia a recarga.
4. O sistema acompanha a sessão.
5. A recarga é finalizada.
6. O pagamento é processado.
7. A comissão é calculada.
8. O saldo do operador é atualizado.
9. O histórico fica disponível para ambas as partes.

---

# MVP

O MVP terá:

- Comissão percentual
- PIX
- Cartão de crédito
- Dashboard financeiro
- Extrato
- Histórico de transações

---

# Futuro

- Assinaturas
- Cupons
- Cashback
- Programa de fidelidade
- Split avançado
- White Label
- API pública