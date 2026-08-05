# PROMPT 15 — MOBILE APP SETUP

## Contexto

Você está implementando o aplicativo mobile da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/UX_FLOW.md
- docs/API.md
- docs/BUSINESS_MODEL.md

---

# Objetivo

Criar o aplicativo do motorista para utilização dos postos de recarga.

---

# Tecnologia

Utilizar:

Framework:

Flutter


Linguagem:

Dart


Arquitetura:

Clean Architecture


Gerenciamento de estado:

Riverpod


HTTP:

Dio


Rotas:

Go Router


Armazenamento:

Secure Storage

---

# Estrutura

Criar:

```
mobile/

lib/

core/

config/

network/

storage/

features/


auth/

home/

stations/

charging/

vehicles/

payments/

profile/


shared/

widgets/

```

---

# Configuração

Criar:

.env


Com:

API_URL=

GOOGLE_MAPS_KEY=

---

# Autenticação

Implementar:

- Login.
- Cadastro.
- Logout.
- Persistência de sessão.

---

# Fluxo inicial

Usuário abre app:

↓

Tela Splash

↓

Verificar sessão

↓

Login ou Home

---

# Navegação principal

Criar Bottom Navigation:

1. Início

2. Mapa

3. Recargas

4. Perfil

---

# Telas MVP

Criar:

## Login

Campos:

- Email
- Senha


Ações:

Entrar

Criar conta


---

## Cadastro

Campos:

- Nome
- Email
- Telefone
- Senha

---

## Home

Mostrar:

- Saudação usuário.
- Postos próximos.
- Última recarga.

---

## Mapa

Mostrar:

- Localização atual.
- Postos próximos.
- Status dos carregadores.

---

## Detalhe do posto

Mostrar:

- Nome.
- Endereço.
- Distância.
- Carregadores disponíveis.
- Preço kWh.


Botão:

Iniciar recarga.

---

## Veículos

Usuário pode:

- Adicionar veículo.
- Editar veículo.
- Selecionar veículo.


---

## Recarga ativa

Mostrar:

- Energia consumida.
- Tempo.
- Valor atual.
- Status.


---

## Pagamento

Mostrar:

- Valor final.
- Método.
- Confirmação.

---

## Histórico

Mostrar:

- Data.
- Posto.
- Energia.
- Valor.

---

# Comunicação API

Criar:

services/api_client.dart


Responsável por:

- Token JWT.
- Headers.
- Erros.
- Timeout.

---

# Design

Priorizar:

- Simplicidade.
- Poucas etapas.
- Botões claros.
- Boa leitura.

---

# Segurança

Obrigatório:

- Guardar token seguro.
- Nunca salvar senha.
- Validar sessão expirada.

---

# Testes

Validar:

- Login.
- Cadastro.
- Buscar postos.
- Criar veículo.
- Iniciar recarga.
- Consultar histórico.

---

# Critério de conclusão

O setup está pronto quando:

✅ Aplicativo abre.

✅ Navegação funciona.

✅ Login funciona.

✅ API está conectada.

✅ Estrutura está pronta para telas.

---

# Entrega

Informar:

1. Estrutura criada.
2. Dependências instaladas.
3. Como executar.
4. Como testar.
5. Próximo módulo recomendado.