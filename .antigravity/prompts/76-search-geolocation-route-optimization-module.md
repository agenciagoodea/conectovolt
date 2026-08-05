# PROMPT 76 — SEARCH, GEOLOCATION & ROUTE OPTIMIZATION MODULE

## Contexto

Você está implementando o sistema de localização, busca e otimização de rotas da ConectoVolt.

Este módulo conecta motoristas às estações de carregamento disponíveis.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/USER_EXPERIENCE.md
- docs/CHARGING_CORE.md
- docs/ARCHITECTURE.md

---

# Objetivo

Criar um sistema inteligente para encontrar carregadores, calcular rotas e planejar recargas.

---

# Conceito

Localização usuário

↓

Busca estações

↓

Analisa rota

↓

Sugere carregamento

---

# Estrutura Backend

Criar:

```
modules/location-intelligence/

location.module.ts

location.controller.ts

location.service.ts

search/

maps/

routing/

geofencing/

recommendation/

tests/

```

---

# Serviço localização

Criar:

Location Service


Responsável:

- Coordenadas.
- Distâncias.
- Áreas.
- Proximidade.

---

# Busca de estações

Criar:

Charging Station Search Engine


Filtros:

- Distância.
- Potência.
- Preço.
- Disponibilidade.
- Conector.
- Avaliação.

---

# Geolocalização

Implementar:

Geo Database


Suportar:

- Latitude.
- Longitude.
- Busca raio.
- Áreas.

---

# Mapa inteligente

Criar:

Charging Map API


Retornar:

- Estações próximas.
- Status tempo real.
- Preços.
- Disponibilidade.

---

# Cálculo distância

Criar:

Distance Engine


Calcular:

- Distância usuário-estação.
- Tempo estimado.
- Melhor opção.

---

# Rotas

Criar:

Route Optimization Engine


Considerar:

- Origem.
- Destino.
- Autonomia veículo.
- Estações disponíveis.

---

# Planejamento viagem

Criar:

EV Trip Planner


Entrada:

- Destino.
- Modelo veículo.
- Bateria atual.

Saída:

- Rota.
- Paradas recarga.
- Tempo total.

---

# Recomendação inteligente

Criar:

Charging Recommendation AI


Sugerir:

- Melhor estação.
- Menor custo.
- Menor espera.
- Melhor rota.

---

# Geofencing

Criar:

Geo Rules


Permitir:

- Detectar chegada estação.
- Ofertas locais.
- Alertas proximidade.

---

# Banco de Dados

Criar:

## LocationIndex

Campos:

- station_id
- latitude
- longitude


---

## RoutePlan

Campos:

- user_id
- origin
- destination
- stations


---

# API

Criar:

GET

/locations/nearby


GET

/stations/search


POST

/routes/plan


GET

/recommendations/charging

---

# Integrações

Preparar:

- Serviços mapas.
- GPS.
- Navegação.

---

# Aplicativo Mobile

Adicionar:

- Mapa atualizado.
- Navegação.
- Rotas.
- Sugestões.

---

# Segurança

Garantir:

- Privacidade localização.
- Consentimento usuário.
- Proteção dados GPS.

---

# Testes

Validar:

- Buscar estação próxima.
- Calcular distância.
- Criar rota.
- Recomendar parada.

---

# Critério conclusão

O módulo está pronto quando:

✅ Usuário encontra carregadores.

✅ Sistema sugere melhor rota.

✅ Viagens podem ser planejadas.

---

# Entrega

Informar:

1. Sistema mapas.
2. Busca.
3. Rotas.
4. IA recomendação.
5. Próximo módulo recomendado.