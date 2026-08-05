# PROMPT 103 — PRODUCT POLISH & UX/UI FINALIZATION MODULE

## Contexto

Você está finalizando a experiência de usuário da EV Charge Platform antes do lançamento comercial.

O objetivo é garantir uma experiência premium, simples e profissional para usuários, operadores e administradores.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/USER_EXPERIENCE.md
- docs/MVP.md
- docs/BRAND.md

---

# Objetivo

Refinar todas as interfaces da plataforma para uma experiência comercial de alta qualidade.

---

# Áreas de experiência

Criar melhorias para:

- Aplicativo motorista.
- Dashboard operador.
- Painel administrador.
- Portal parceiros.

---

# Design System

Criar:

EV Charge Design System


Definir:

- Cores oficiais.
- Tipografia.
- Componentes.
- Botões.
- Cards.
- Formulários.
- Ícones.

---

# Experiência motorista

O aplicativo deve permitir:

## Entrada

- Cadastro simples.
- Login rápido.
- Recuperação acesso.


## Descoberta

- Encontrar carregadores.
- Ver disponibilidade.
- Visualizar preço.


## Recarga

- Iniciar sessão.
- Acompanhar consumo.
- Finalizar pagamento.


## Pós-recarga

- Histórico.
- Recibo.
- Avaliação.

---

# Experiência operador

Dashboard deve mostrar:

- Estações.
- Status carregadores.
- Receita.
- Sessões.
- Alertas.

Criar:

Visão rápida operacional.

---

# Experiência administrador

Criar:

Admin Control Center


Permitir:

- Gestão usuários.
- Gestão operadores.
- Relatórios.
- Configurações.

---

# UX Writing

Criar:

Interface Language


Definir:

- Mensagens claras.
- Estados vazios.
- Mensagens erro.
- Confirmações.

---

# Acessibilidade

Implementar:

- Contraste adequado.
- Navegação simples.
- Textos legíveis.
- Suporte dispositivos diferentes.

---

# Performance interface

Otimizar:

- Tempo carregamento.
- Navegação.
- Imagens.
- Componentes.

---

# Design responsivo

Garantir:

- Mobile.
- Tablet.
- Desktop.

---

# Testes UX

Criar:

User Testing


Validar:

- Cadastro.
- Busca estação.
- Recarga.
- Pagamento.
- Relatórios.

---

# Feedback usuário

Criar:

UX Feedback System


Coletar:

- Dificuldades.
- Sugestões.
- Satisfação.

---

# Métricas experiência

Medir:

- Tempo para completar ação.
- Erros usuário.
- Conversão.
- Retenção.

---

# Banco de Dados

Criar:

## UserExperienceEvent

Campos:

- user_id
- action
- timestamp


---

## Feedback

Campos:

- user_id
- rating
- comment

---

# API

Criar:

POST

/experience/feedback


GET

/experience/metrics


GET

/design/components

---

# Segurança

Garantir:

- Dados usuário protegidos.
- Controle acesso.
- Privacidade.

---

# Testes finais

Validar:

- Fluxo completo usuário.
- Fluxo operador.
- Fluxo administrador.

---

# Critério conclusão

O módulo está pronto quando:

✅ Produto possui aparência profissional.

✅ Usuários conseguem usar sem treinamento.

✅ Experiência está pronta para venda.

---

# Entrega

Informar:

1. Design system.
2. Melhorias UX.
3. Testes realizados.
4. Métricas experiência.
5. Próximo módulo recomendado.