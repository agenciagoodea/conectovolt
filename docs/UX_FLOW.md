# UX FLOW DOCUMENT

Projeto: EV Charge Platform

Versão: MVP 1.0

---

# Objetivo

Definir os fluxos de utilização da plataforma pelos três principais usuários:

1. Motorista
2. Operador de posto
3. Administrador da plataforma

---

# PERFIS DE USUÁRIO

---

# 1. MOTORISTA

Usuário que utiliza o aplicativo para realizar recargas.

Objetivo:

Encontrar um carregador, realizar uma recarga e pagar.

---

# Jornada do Motorista

## Primeiro acesso

Fluxo:

Abrir aplicativo

↓

Criar conta

↓

Confirmar telefone/email

↓

Cadastrar veículo

↓

Acessar mapa

---

# Cadastro

Campos:

- Nome
- Email
- Telefone
- Senha

Opcional:

- CPF
- Veículo

---

# Tela Inicial

Exibir:

- Mapa
- Postos próximos
- Status dos carregadores
- Distância
- Preço por kWh

---

# Encontrar Posto

Usuário:

Seleciona posto

↓

Visualiza detalhes

Informações:

- Nome
- Endereço
- Distância
- Carregadores disponíveis
- Potência
- Preço

---

# Iniciar Recarga

Fluxo:

Selecionar carregador

↓

Escanear QR Code

↓

Escolher veículo

↓

Confirmar início

↓

Sistema inicia sessão


Status:

CHARGING

---

# Durante Recarga

Mostrar:

- Energia consumida
- Tempo
- Valor parcial
- Status

---

# Finalizar Recarga

Fluxo:

Usuário encerra

↓

Sistema calcula valor

↓

Pagamento

↓

Recibo


---

# Histórico

Mostrar:

- Data
- Posto
- Energia
- Valor
- Status


---

# 2. OPERADOR

Empresa responsável pelos carregadores.

---

# Primeiro acesso

Fluxo:

Cadastro empresa

↓

Aprovação plataforma

↓

Criar usuário administrador

↓

Cadastrar posto

---

# Dashboard Operador

Mostrar:

- Receita
- Número de recargas
- Energia vendida
- Carregadores ativos
- Saldo disponível

---

# Gestão de Postos

Operador pode:

Criar posto

Editar posto

Visualizar posto

Desativar posto

---

# Cadastro de Posto

Campos:

- Nome
- Endereço
- Latitude
- Longitude
- Horário funcionamento

---

# Gestão de Carregadores

Operador pode:

Adicionar carregador

Visualizar status

Ver histórico

---

# Informações do Carregador

Mostrar:

- Modelo
- Potência
- Status
- Última comunicação
- Sessões realizadas


---

# Financeiro Operador

Mostrar:

- Receita bruta
- Comissão plataforma
- Saldo líquido
- Saques


Fluxo:

Recebe pagamento

↓

Sistema desconta comissão

↓

Saldo atualizado

↓

Solicita saque


---

# Relatórios Operador

Filtros:

- Dia
- Semana
- Mês

Dados:

- Recargas
- Receita
- Energia
- Clientes


---

# 3. ADMINISTRADOR DA PLATAFORMA

Responsável pelo SaaS.

---

# Dashboard Admin

Mostrar:

- Operadores cadastrados
- Postos ativos
- Carregadores online
- Recargas realizadas
- Receita plataforma

---

# Gestão de Operadores

Administrador pode:

Criar operador

Aprovar operador

Bloquear operador

Visualizar dados financeiros


---

# Comissão

Configurar:

- Percentual padrão
- Comissão por operador
- Regras futuras


---

# Financeiro Plataforma

Mostrar:

- Receita total
- Comissão acumulada
- Pagamentos
- Saques pendentes


---

# TELAS MVP

## Aplicativo Mobile

Obrigatório:

Login

Cadastro

Mapa

Lista de postos

Detalhes do posto

QR Code

Recarga ativa

Pagamento

Histórico

Perfil


---

## Painel Web

Obrigatório:

Login

Dashboard

Empresas

Usuários

Postos

Carregadores

Sessões

Financeiro

Relatórios

Configurações


---

# PRINCÍPIOS DE UX

Priorizar:

- Simplicidade
- Poucos cliques
- Informação clara
- Feedback imediato

---

# REGRAS

Toda ação financeira deve mostrar confirmação.

Toda recarga deve mostrar status em tempo real.

Toda falha deve apresentar mensagem clara.

O usuário nunca deve ficar sem saber o próximo passo.

---

# FUTURO

Não implementar no MVP:

- Chat
- Avaliação de posto
- Cashback
- Fidelidade
- IA de recomendação
