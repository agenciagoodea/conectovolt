# PROMPT 73 — OPERATOR MANAGEMENT DASHBOARD MVP MODULE

## Contexto

Você está implementando o painel administrativo para operadores de estações de carregamento da EV Charge Platform.

Este módulo permite que empresas gerenciem sua infraestrutura de recarga.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/CHARGING_CORE.md
- docs/PRICING.md
- docs/PAYMENTS.md

---

# Objetivo

Criar um dashboard completo para operadores administrarem estações, carregadores, tarifas e receitas.

---

# Conceito

Operador

↓

Gerencia estações

↓

Monitora carregadores

↓

Recebe receita

---

# Estrutura Frontend

Criar:

```
operator-dashboard/

screens/

stations/

chargers/

sessions/

pricing/

finance/

analytics/

settings/

tests/

```

---

# Autenticação operador

Implementar:

- Login operador.
- Permissões.
- Multiusuário.

---

# Dashboard principal

Criar:

Operator Home


Mostrar:

- Estações ativas.
- Carregadores online.
- Sessões atuais.
- Receita.

---

# Gestão estações

Criar:

Station Management


Permitir:

- Criar estação.
- Editar dados.
- Alterar status.
- Visualizar localização.

---

# Gestão carregadores

Criar:

Charger Management


Mostrar:

- Status.
- Potência.
- Conectores.
- Histórico falhas.

---

# Monitoramento tempo real

Criar:

Live Operations


Mostrar:

- Sessões ativas.
- Energia consumida.
- Alertas.

---

# Gestão tarifas

Integrar:

Pricing Module


Permitir:

- Criar tarifa.
- Alterar preço.
- Criar promoções.

---

# Gestão usuários

Mostrar:

- Clientes utilizando estação.
- Histórico.
- Avaliações.

---

# Financeiro operador

Criar:

Revenue Dashboard


Mostrar:

- Receita diária.
- Receita mensal.
- Repasse.
- Taxas plataforma.

---

# Relatórios

Criar:

Operator Reports


Relatórios:

- Utilização.
- Energia.
- Receita.
- Disponibilidade.

---

# Alertas

Criar:

Operations Alerts


Exemplos:

- Carregador offline.
- Falha equipamento.
- Baixa utilização.

---

# Configurações

Criar:

Operator Settings


Permitir:

- Equipe.
- Permissões.
- Dados empresa.

---

# APIs utilizadas

Integrar:

GET

/stations


GET

/chargers/status


GET

/sessions


GET

/revenue


POST

/tariffs

---

# Segurança

Implementar:

- Controle por operador.
- Isolamento dados.
- Auditoria.

---

# Testes

Validar:

- Criar estação.
- Gerenciar carregador.
- Alterar tarifa.
- Visualizar receita.
- Receber alerta.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Operador consegue administrar sua rede.

✅ Dados operacionais aparecem em tempo real.

✅ Receita pode ser acompanhada.

---

# Entrega

Informar:

1. Dashboard criado.
2. Telas.
3. APIs.
4. Segurança.
5. Próximo módulo recomendado.