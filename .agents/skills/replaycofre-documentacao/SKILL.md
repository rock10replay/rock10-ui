---
name: replaycofre-documentacao
description: >-
  Protocolo global do ecossistema Rock10 para documentação contínua e estruturada no ReplayCofre.
  Acione sempre que implementar novas funcionalidades, alterar fluxos de negócio, criar telas/controllers,
  realizar correções importantes ou registrar decisões arquiteturais em qualquer projeto do ecossistema Rock10.
---

# 📖 Skill: Protocolo Global de Documentação no ReplayCofre

Esta skill define as diretrizes para manter o **ReplayCofre** perfeitamente atualizado a cada entrega em todos os projetos do ecossistema Rock10 (`ReplayAPI-PHP`, `ReplayPanelAPP`, `replayapp`, `rock10-ui`, `ReplayClienteGO`, `ReplayLiveModule`, `ReplayStoresApp`).

---

## 🎯 Gatilhos para Criação / Atualização de Notas

Você deve acionar a documentação no ReplayCofre imediatamente após:

### 1. Backend & Banco de Dados (`ReplayAPI-PHP` / `ReplayLiveModule` / `ReplayClienteGO`)
- **Novas Rotas / Controllers / Endpoints**:
  - Toda rota nova deve ser registrada em `ReplayCofre/02-Projetos/catalogo-controladores-replayapi-php.md`.
- **Alterações de Banco de Dados (MANDATÓRIO)**:
  - Toda criação ou modificação de tabelas, colunas, chaves estrangeiras ou índices **deve obrigatoriamente** acompanhar uma migration Phinx em `ReplayAPI-PHP/db/migrations/` com `up()` e `down()`.
- **Alteração de Regras de Negócio / Pagamentos / IoT**:
  - Modificações em lógica de cobrança (Asaas), faturamento, autenticação JWT, permissões, contratos de dados, buffers FFmpeg ou uploads R2.

### 2. Frontend Web & Mobile (`ReplayPanelAPP` / `replayapp` / `ReplayStoresApp`)
- **Nova Tela / Novo Componente / Novo Módulo**:
  - Criação de novas páginas em `src/master/pages/...`, `src/group/pages/...` ou `src/Pages/...`.
  - Novos modais complexos, wizards ou dashboards.
- **Alteração de Fluxo / Roteamento / Gating**:
  - Mudança no roteamento em `RootRouter.tsx`, `AppRoutes.tsx`, `GroupRoutes.tsx` ou guards de autenticação.
  - Atualização da lista de `RESERVED_SLUGS` em `reservedSlugs.ts`.
  - Alterações nas regras de visualização condicional por perfil de usuário ou módulos ativos do tenant (`GroupModuleRoute`).
- **Integração com Nova API / Service Layer**:
  - Novos services em `src/services/...` e atualização das tipagens TypeScript.
- **Design System `@rock10/ui`**:
  - Uso de novos componentes ou publicação de versão da biblioteca.

### 3. Decisões de Arquitetura (ADRs) e Correções de Bugs Complexos
- **Decisões de Arquitetura**: Padrões de código, escolhas de tecnologias, estratégias de cache, UX e persistência.
- **Bugs Difíceis / Postmortems**: Resolução de race conditions, vazamentos de memória, travamentos de socket, falhas de demuxer FFmpeg ou armadilhas de CSS/renderização.

---

## 📂 Mapa de Pastas do ReplayCofre

| Tipo de Conhecimento | Pasta Destino | Tipo no Frontmatter | Tag Principal |
| :--- | :--- | :--- | :--- |
| **Padrão de Código / Regra de Negócio / UX** | `03-Padroes/` | `padrao` | `#padrao/[categoria] #stack/[tech]` |
| **Decisão Arquitetural (ADR)** | `04-Decisoes/` | `decisao` | `#decisao/[categoria] #arquitetura` |
| **Bug Complexo / Postmortem Resolvido** | `08-Problemas/` | `problema` | `#problema/[modulo] #bug` |
| **Peculiaridades de Libs e Ferramentas** | `05-Stack/` | `stack` | `#stack/[nome-da-lib]` |
| **Preferência de Código / Convenção** | `06-Preferencias/` | `preferencia` | `#preferencia/[tema]` |
| **Ficha e Catálogo de Projeto** | `02-Projetos/` | `projeto` | `#projeto/[nome-projeto]` |
| **Log Diário de Sessão** | `07-Sessoes/` | `sessao` | `#sessao/execucao` |

---

## 📐 Estrutura Padrão de uma Nota

Toda nota técnica deve seguir o frontmatter padronizado:

```yaml
---
tipo: padrao
titulo: "Nome Autoexplicativo do Padrão"
tags:
  - padrao/financeiro
  - stack/php
criado: 2026-10-09
atualizado: 2026-10-09
aliases:
  - "Nome Alternativo"
---

# Nome do Padrão / Decisão

> [!PADRAO] (ou [!DECISAO] / [!PROBLEMA])
> Resumo executivo em 2-3 linhas explicando o contexto e a solução.

## 1. Contexto & Motivação
Explicação do problema ou requisito de negócio.

## 2. Solução Implementada & Código de Exemplo
Exemplo de código real e conciso.

## 3. Cuidados & Armadilhas
O que não fazer e pontos de atenção para novos desenvolvedores e IAs.
```

---

## 🚨 Regra de Ouro: Reindexação Imediata
Após criar qualquer nota em `03-Padroes/`, `04-Decisoes/`, `05-Stack/` ou `08-Problemas/`:
1. Abra o índice correspondente em `01-Indices/` (`INDICE-PADROES.md`, `INDICE-DECISOES.md`, etc.).
2. Adicione uma linha na tabela com o link `[[Nome-Da-Nota]]`, descrição e data.
