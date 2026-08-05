# PROMPT 16 — MOBILE MAP + STATIONS

## Contexto

Você está implementando o módulo de mapa e localização do aplicativo motorista da EV Charge Platform.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/UX_FLOW.md
- docs/API.md

---

# Objetivo

Criar a experiência de encontrar postos de recarga próximos.

---

# Funcionalidade principal

O usuário deve conseguir:

- Ver sua localização.
- Encontrar postos próximos.
- Visualizar disponibilidade.
- Escolher onde carregar.

---

# Tecnologia

Utilizar:

Mapa:

Google Maps Flutter


Localização:

Geolocator


Estado:

Riverpod


API:

Dio


---

# Estrutura

Criar:

```
features/stations/

data/

models/

repositories/


presentation/

pages/

widgets/

controllers/

```

---

# Tela Mapa

Criar:

Route:

/map


---

# Elementos da tela

## Mapa

Mostrar:

- Localização atual.
- Marcadores dos postos.
- Área próxima.


---

# Marcadores

Cada posto deve exibir:

Status:

🟢 Disponível

🟡 Poucos carregadores

🔴 Indisponível


---

# Busca

Adicionar:

Campo:

"Buscar posto"


Filtros:

- Distância.
- Disponibilidade.
- Potência.

---

# Card inferior do posto

Ao clicar no marcador:

Abrir Bottom Sheet:

Mostrar:

- Nome do posto.
- Distância.
- Endereço.
- Quantidade carregadores.
- Status.


Botão:

"Ver detalhes"

---

# Tela Detalhe do Posto

Route:

/stations/:id


Mostrar:

## Informações:

- Nome.
- Endereço.
- Horário.
- Distância.


## Carregadores:

Lista:

- Potência.
- Tipo conector.
- Status.
- Preço kWh.


---

# Botão principal

Criar:

"Iniciar Recarga"


Fluxo:

Selecionar posto

↓

Selecionar carregador

↓

Selecionar veículo

↓

Iniciar sessão

---

# API

Consumir:

GET

/stations


GET

/stations/:id


---

# Modelo Station Mobile

Criar:

```dart
class Station {

String id;

String name;

String address;

double latitude;

double longitude;

List<Charger> chargers;

}

```

---

# Estados

Criar:

Loading:

Mapa com skeleton.


Erro:

Mensagem:

"Não foi possível carregar os postos."


Sem postos:

"Não encontramos carregadores próximos."

---

# Permissões

Solicitar:

Localização GPS.


Caso negado:

Permitir busca manual.

---

# UX

Prioridades:

- Abrir mapa rapidamente.
- Botão grande.
- Poucos passos.
- Informações essenciais.

---

# Testes

Validar:

- Permissão GPS.
- Mostrar localização.
- Buscar postos.
- Abrir detalhes.
- Ver carregadores disponíveis.

---

# Critério de conclusão

A funcionalidade está pronta quando:

✅ Usuário vê postos próximos.

✅ Consegue abrir detalhes.

✅ Consegue escolher carregador.

✅ Está pronto para iniciar recarga.

---

# Entrega

Informar:

1. Arquivos criados.
2. APIs utilizadas.
3. Como testar.
4. Próximo módulo recomendado.