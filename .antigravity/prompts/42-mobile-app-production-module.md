# PROMPT 42 — MOBILE APP FINALIZATION & APP STORE READINESS MODULE

## Contexto

Você está preparando o aplicativo mobile da ConectoVolt para produção.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/UX_FLOW.md
- docs/API.md
- docs/SECURITY.md

---

# Objetivo

Preparar o aplicativo motorista para lançamento oficial nas lojas Android e iOS.

---

# Estrutura Mobile

Revisar:

```
mobile/

authentication/

map/

charging/

payments/

wallet/

profile/

notifications/

support/

settings/

```

---

# Experiência do usuário

Garantir:

## Primeiro acesso

Fluxo:

Download

↓

Cadastro

↓

Validação telefone/email

↓

Adicionar pagamento

↓

Encontrar carregador

---

# Tela inicial

Criar:

Home Dashboard


Mostrar:

- Mapa.
- Postos próximos.
- Última recarga.
- Saldo.
- Favoritos.

---

# Mapa de carregadores

Otimizar:

- Carregamento rápido.
- Clustering.
- Filtro.

Filtros:

- Distância.
- Potência.
- Preço.
- Disponibilidade.

---

# Fluxo de recarga

Garantir:

```
Escolher posto

↓

Escolher carregador

↓

Conectar veículo

↓

Iniciar sessão

↓

Acompanhar consumo

↓

Finalizar

↓

Pagamento
```

---

# Pagamentos mobile

Validar:

- Cartão.
- PIX.
- Carteira.
- Histórico.

---

# Segurança mobile

Implementar:

- Token seguro.
- Biometria.
- Proteção sessão.
- Criptografia dados locais.

---

# Performance

Otimizar:

- Tempo abertura app.
- Uso memória.
- Consumo bateria.
- Cache.

---

# Offline Mode

Preparar:

Permitir visualizar:

- Últimos postos.
- Histórico.
- Dados básicos.

---

# Notificações Push

Criar:

Eventos:

## Recarga iniciada

## Recarga finalizada

## Pagamento aprovado

## Promoções

## Alertas favoritos

---

# Deep Links

Criar:

Exemplo:

Usuário recebe link:

"Carregar neste posto"

↓

Abre aplicativo automaticamente.

---

# Analytics Mobile

Adicionar:

Eventos:

- Cadastro realizado.
- Busca posto.
- Início recarga.
- Pagamento.
- Erro.

---

# Testes

Criar:

## Teste funcional

Validar:

- Cadastro.
- Login.
- Recarga.
- Pagamento.


## Teste dispositivos

Android:

- Diferentes versões.


iOS:

- Diferentes modelos.

---

# Publicação Android

Preparar:

- Nome aplicativo.
- Ícone.
- Screenshots.
- Política privacidade.
- Versão release.

---

# Publicação iOS

Preparar:

- App Store Connect.
- Certificados.
- Descrição.
- Screenshots.
- Revisão Apple.

---

# Configuração Produção

Alterar:

Ambiente:

DEVELOPMENT

para:

PRODUCTION


Configurar:

- API URL.
- Chaves pagamento.
- Push.
- Analytics.

---

# Monitoramento

Integrar:

Crash Reporting.

Registrar:

- Erros.
- Falhas.
- Performance.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Aplicativo funciona em produção.

✅ Usuário consegue fazer uma recarga completa.

✅ Publicação nas lojas está preparada.

---

# Entrega

Informar:

1. Ajustes realizados.
2. Testes executados.
3. Configuração produção.
4. Checklist publicação.
5. Próximo módulo recomendado.