# PROMPT 17 — MOBILE CHARGING FLOW

## Contexto

Você está implementando o fluxo de recarga no aplicativo motorista da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/UX_FLOW.md
- docs/API.md
- docs/DATABASE.md

---

# Objetivo

Criar o fluxo completo para o motorista iniciar, acompanhar e finalizar uma recarga.

---

# Fluxo principal

Usuário:

Seleciona carregador

↓

Seleciona veículo

↓

Confirma início

↓

Sistema cria sessão

↓

Acompanha consumo

↓

Finaliza

↓

Pagamento

---

# Estrutura

Criar:

```
features/charging/

data/

models/

repositories/


presentation/

pages/

widgets/

controllers/

```

---

# Tela Seleção de Veículo

Route:

/charging/select-vehicle


Mostrar:

Lista de veículos cadastrados.


Cada item:

- Marca.
- Modelo.
- Placa.
- Bateria.


Ação:

Selecionar.

---

# QR Code

Criar preparação para:

Scanner QR.


Biblioteca:

mobile_scanner


Fluxo:

Usuário aponta câmera.

↓

Identifica carregador.

↓

Abre sessão.


---

# Tela Confirmar Recarga

Route:

/charging/confirm


Mostrar:

- Posto.
- Carregador.
- Conector.
- Potência.
- Preço kWh.
- Veículo selecionado.


Botão:

"Iniciar Recarga"

---

# Iniciar sessão

Consumir API:

POST

/charging/start


Enviar:

```json
{
"charger_id":"uuid",
"connector_id":"uuid",
"vehicle_id":"uuid"
}
```

---

# Tela Recarga Ativa

Route:

/charging/active


Mostrar em tempo real:

## Status

CARREGANDO


## Dados:

- Tempo.
- Energia consumida.
- Valor parcial.
- Potência atual.


---

# Atualização

Preparar arquitetura para:

WebSocket


Futuro:

Eventos:

ChargingUpdated


---

# Finalizar recarga

Botão:

"Finalizar"


Confirmar:

"Tem certeza que deseja encerrar?"


Consumir:

POST

/charging/:id/stop


---

# Resultado da recarga

Mostrar:

- Energia total.
- Tempo.
- Valor final.


Botão:

"Continuar para pagamento"

---

# Pagamento

Redirecionar:

/payment


Enviar:

session_id


---

# Estados

Criar:

INITIAL

SELECTING

STARTING

CHARGING

FINISHING

COMPLETED

ERROR

---

# Tratamento de erros

Exibir:

Carregador ocupado.

Falha comunicação.

Sessão indisponível.

Erro pagamento.

---

# UX

Prioridades:

- Botão iniciar destacado.
- Informações simples.
- Usuário sempre sabe o próximo passo.
- Evitar telas complexas.

---

# Segurança

Obrigatório:

- Validar sessão do usuário.
- Nunca permitir iniciar sessão de outro usuário.
- Confirmar dados no backend.

---

# Testes

Validar:

- Selecionar veículo.
- Criar sessão.
- Atualizar consumo.
- Finalizar.
- Exibir valor correto.

---

# Critério de conclusão

Fluxo pronto quando:

✅ Usuário inicia recarga.

✅ Usuário acompanha consumo.

✅ Usuário finaliza.

✅ Sistema gera valor para pagamento.

---

# Entrega

Informar:

1. Arquivos criados.
2. APIs utilizadas.
3. Como testar.
4. Próximo módulo recomendado.