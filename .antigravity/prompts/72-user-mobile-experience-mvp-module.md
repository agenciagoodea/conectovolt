# PROMPT 72 — USER MOBILE EXPERIENCE MVP MODULE

## Contexto

Você está implementando o aplicativo mobile MVP da EV Charge Platform para usuários finais.

Este aplicativo será a principal interface entre motoristas e a rede de carregamento.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/USER_EXPERIENCE.md
- docs/CHARGING_SESSION.md
- docs/PAYMENTS.md

---

# Objetivo

Criar o aplicativo mobile para localizar, iniciar e gerenciar carregamentos elétricos.

---

# Plataforma

Criar suporte:

- iOS.
- Android.

Preparar arquitetura multiplataforma.

---

# Estrutura Mobile

Criar:

```
mobile/

src/

screens/

components/

services/

navigation/

state/

payments/

maps/

charging/

tests/

```

---

# Autenticação

Implementar:

- Cadastro.
- Login.
- Recuperação senha.
- Perfil usuário.

---

# Tela inicial

Criar:

Home Screen


Mostrar:

- Mapa.
- Estações próximas.
- Status carregadores.

---

# Mapa de carregadores

Criar:

Charging Map


Exibir:

- Localização.
- Distância.
- Disponibilidade.
- Potência.

---

# Busca estação

Permitir:

Filtros:

- Distância.
- Potência.
- Tipo conector.
- Preço.

---

# Detalhes estação

Mostrar:

- Endereço.
- Fotos.
- Horário.
- Carregadores.
- Tarifas.

---

# Iniciar recarga

Criar:

Start Charging Flow


Fluxo:

Selecionar carregador

↓

Confirmar

↓

Autorizar pagamento

↓

Iniciar sessão

---

# Tela recarga ativa

Mostrar:

- Energia consumida.
- Tempo.
- Potência.
- Valor atual.
- Status.

---

# Finalizar recarga

Permitir:

- Parar manualmente.
- Confirmar valor.
- Avaliar estação.

---

# Histórico

Criar:

Charging History


Mostrar:

- Sessões anteriores.
- Consumo.
- Pagamentos.
- Datas.

---

# Pagamentos

Integrar:

Payment Module


Permitir:

- Adicionar cartão.
- PIX.
- Carteira.
- Histórico.

---

# Perfil usuário

Criar:

Profile


Mostrar:

- Dados pessoais.
- Veículo.
- Preferências.
- Benefícios.

---

# Notificações

Criar:

Notification System


Enviar:

- Recarga iniciada.
- Recarga concluída.
- Falha.
- Promoções.

---

# Avaliação estação

Criar:

Rating System


Permitir:

- Nota.
- Comentário.
- Feedback.

---

# Estado offline

Preparar:

Offline Support


Permitir:

- Cache mapa.
- Histórico básico.

---

# Segurança

Implementar:

- Sessão segura.
- Proteção dados.
- Biometria.

---

# APIs utilizadas

Integrar:

GET

/stations


POST

/sessions/start


GET

/sessions/status


POST

/payments

---

# Testes

Validar:

- Cadastro usuário.
- Buscar estação.
- Iniciar recarga.
- Acompanhar sessão.
- Efetuar pagamento.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Usuário encontra carregador.

✅ Usuário inicia recarga pelo app.

✅ Usuário paga pelo aplicativo.

---

# Entrega

Informar:

1. Telas criadas.
2. Fluxos usuário.
3. Integrações.
4. Testes.
5. Próximo módulo recomendado.