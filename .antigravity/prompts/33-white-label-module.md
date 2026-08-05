# PROMPT 33 — WHITE LABEL & BRAND CUSTOMIZATION MODULE

## Contexto

Você está implementando o módulo White Label da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/API.md
- docs/DATABASE.md

---

# Objetivo

Permitir que empresas utilizem a plataforma com identidade visual própria.

---

# Conceito

Plataforma principal

↓

Configuração White Label

↓

Marca personalizada

↓

Aplicativo e painel personalizados

---

# Estrutura Backend

Criar:

```
modules/white-label/

white-label.module.ts

white-label.controller.ts

white-label.service.ts

themes/

domains/

settings/

tests/

```

---

# Banco de Dados

Criar:

## BrandConfiguration

Campos:

- id
- company_id
- brand_name
- logo_url
- primary_color
- secondary_color
- favicon_url
- created_at

---

# Personalização

Permitir configurar:

## Marca

- Nome da empresa.
- Logo.
- Ícone.


## Cores

- Cor principal.
- Cor secundária.
- Tema.


## Comunicação

- Nome exibido.
- Emails.
- Mensagens.

---

# Domínio personalizado

Preparar:

Custom Domain


Exemplo:

recarga.empresa.com


Campos:

- domain
- company_id
- status

---

# Frontend Web

Criar:

Sistema de tema dinâmico.


Carregar:

- Logo.
- Cores.
- Nome.


Aplicar em:

- Login.
- Dashboard.
- Relatórios.

---

# Aplicativo Mobile

Preparar:

Configuração dinâmica.

Permitir:

- Nome aplicativo.
- Logo.
- Splash screen.
- Tema.

---

# Configuração Admin

Criar:

/admin/white-label


Permitir:

- Criar marca.
- Editar.
- Ativar.

---

# Operador

Criar:

/operator/branding


Permitir:

Visualizar identidade configurada.

---

# Assets

Criar:

Storage para:

- Logos.
- Imagens.
- Ícones.

Integrar:

Storage Module.

---

# Segurança

Garantir:

Cada empresa acessa somente sua configuração.

---

# API

Criar:

GET

/branding


POST

/branding


PATCH

/branding


GET

/theme

---

# Cache

Preparar:

Cache Redis

para carregamento rápido do tema.

---

# Testes

Validar:

- Criar marca.
- Aplicar tema.
- Alterar logo.
- Domínio personalizado.
- Isolamento entre empresas.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Empresa consegue personalizar plataforma.

✅ Usuário final vê identidade correta.

✅ Sistema suporta múltiplas marcas.

---

# Entrega

Informar:

1. Arquivos criados.
2. Personalizações disponíveis.
3. APIs.
4. Como testar.
5. Próximo módulo recomendado.
```

---

## Estado atual do produto

Agora temos uma plataforma que pode atender:

```text
id="s6k2mq"
ConectoVolt
    |
    |---- Operadores de postos
    |
    |---- Empresas de frota
    |
    |---- Parceiros API
    |
    |---- Marcas White Label
```

Esse é um modelo próximo de empresas de infraestrutura de recarga como serviço.

---

# Próximo passo

## PASSO 44 — AI ASSISTANT & AUTOMATION MODULE

Vamos adicionar inteligência artificial:

- assistente para operadores;
- análise automática;
- recomendações;
- suporte inteligente;
- previsão de falhas;
- geração de relatórios por comando.

Esse será o módulo que diferencia sua plataforma.