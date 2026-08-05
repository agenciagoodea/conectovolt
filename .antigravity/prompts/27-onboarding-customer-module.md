# PROMPT 27 — ONBOARDING & CUSTOMER MANAGEMENT MODULE

## Contexto

Você está implementando o módulo de entrada e gerenciamento de clientes da ConectoVolt.

Antes de iniciar:

Leia:

- .antigravity/skill.md
- .antigravity/rules.md
- docs/BUSINESS_MODEL.md
- docs/UX_FLOW.md
- docs/API.md

---

# Objetivo

Criar o fluxo completo para cadastrar empresas operadoras e colocá-las em operação.

---

# Conceito

Novo cliente:

Cadastro

↓

Validação

↓

Aprovação

↓

Configuração

↓

Operação

---

# Estrutura Backend

Criar:

```
modules/onboarding/

onboarding.module.ts

onboarding.controller.ts

onboarding.service.ts

steps/

documents/

approvals/

tests/

```

---

# Cadastro de empresa

Endpoint:

POST

/onboarding/company


Dados:

- Razão social.
- Nome fantasia.
- CNPJ.
- Email.
- Telefone.
- Endereço.
- Responsável.

---

# Status onboarding

Criar enum:

```
PENDING

DOCUMENT_REVIEW

APPROVED

ACTIVE

REJECTED
```

---

# Documentos

Permitir envio:

- Documento empresa.
- Contrato.
- Comprovantes.

Criar:

CompanyDocument


Campos:

- id
- company_id
- type
- file_url
- status
- created_at

---

# Aprovação administrativa

Criar:

Admin Review


Administrador pode:

- Aprovar.
- Reprovar.
- Solicitar correção.

---

# Primeiro acesso

Após aprovação:

Criar automaticamente:

- Usuário administrador da empresa.
- Plano inicial.
- Configuração padrão.

---

# Wizard de configuração

Criar etapas:

## Etapa 1

Dados empresa.


## Etapa 2

Criar primeiro posto.


## Etapa 3

Adicionar carregador.


## Etapa 4

Configurar preços.


## Etapa 5

Ativar operação.

---

# Frontend Web

Criar:

Admin:

/admin/onboarding


Mostrar:

- Empresas pendentes.
- Documentos.
- Aprovações.


Operador:

/operator/setup


Mostrar:

Checklist inicial.

---

# Checklist operador

Criar componente:

SetupProgress


Itens:

☐ Empresa cadastrada

☐ Posto criado

☐ Carregador conectado

☐ Preço configurado

☐ Operação ativa

---

# Notificações

Integrar:

Notification Module


Enviar:

Empresa aprovada.

Documento pendente.

Posto ativado.

---

# Segurança

Validar:

Somente ADMIN aprova empresas.

Operador vê somente sua configuração.

---

# Testes

Validar:

- Cadastro empresa.
- Upload documento.
- Aprovação.
- Criação usuário.
- Ativação.

---

# Critério de conclusão

O módulo está pronto quando:

✅ Uma nova empresa consegue entrar na plataforma.

✅ Admin consegue aprovar.

✅ Cliente consegue iniciar operação.

---

# Entrega

Informar:

1. Arquivos criados.
2. Fluxo implementado.
3. Endpoints.
4. Como testar.
5. Próximo módulo recomendado.