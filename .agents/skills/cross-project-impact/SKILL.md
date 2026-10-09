---
name: cross-project-impact
description: >-
  Protocolo de avaliação de impacto cruzado entre os repositórios do ecossistema Rock10.
  Acione sempre que alterar endpoints na ReplayAPI-PHP, atualizar a biblioteca @rock10/ui, alterar protocolos do
  ReplayLiveModule ou modificar schemas do banco de dados para evitar quebras em cascata nos frontends e clientes de borda.
---

# 🌐 Skill: Cross-Project Impact (Avaliação de Impacto Cruzado)

Esta skill define o protocolo para **identificar e mitigar impactos em cascata** entre os múltiplos repositórios do Rock10.

No ecossistema Rock10, **nenhum repositório opera isolado**: alterações de contratos na API ou no Design System impactam diretamente aplicações consumidoras em produção.

---

## 🎯 Por Que Executar Esta Skill?
1. **Contratos da API**: Alterar o nome de um campo ou remover uma propriedade em `ReplayAPI-PHP` quebra silenciosamente telas do `ReplayPanelAPP` ou `replayapp`.
2. **Atualização do Design System**: Mudar propriedades de componentes em `@rock10/ui` sem testar os dois frontends gera erros de compilação TypeScript no deploy.
3. **Protocolo Live / WebSocket**: Modificar mensagens no `ReplayLiveModule` exige paridade estrita com o backend e o hook `useLiveStatus` do painel.

---

## 🗺️ Matriz Canônica de Dependências Cruzadas

```text
                           ┌───────────────────────────┐
                           │   rock10-ui (@rock10/ui)  │
                           └─────────────┬─────────────┘
                                         │ Consumo UI/Tokens
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
     ┌───────────────────────┐                       ┌───────────────────────┐
     │    ReplayPanelAPP     │                       │       replayapp       │
     │     (Master/Group)    │                       │   (Atleta / Torcedor) │
     └───────────┬───────────┘                       └───────────┬───────────┘
                 │ Consome /api/master/*                         │ Consome /api/*
                 │ Consome /api/group/{slug}/*                   │ Consome /api/student/*
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                           ┌───────────────────────────┐
                           │       ReplayAPI-PHP       │
                           │     (Hub de Runtime)      │
                           └─────────────┬─────────────┘
                                         ▲
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
   ┌─────────────┴─────────────┐                   ┌─────────────┴─────────────┐
   │      ReplayClienteGO      │                   │     ReplayLiveModule      │
   │  (Upload R2 & Config)     │                   │   (Hub VPS & Live Agent)  │
   └───────────────────────────┘                   └───────────────────────────┘
```

---

## 🔄 Fluxo de Análise Passo a Passo

### 1. Se a alteração for na `ReplayAPI-PHP`:
1. Identifique a rota modificada (ex: `GET /group/{slug}/live/contas` ou `POST /api/videos`).
2. Busque consumidores em repositórios irmãos nos diretórios do ecossistema:
   - Em `ReplayPanelAPP/src/services/` e `src/hooks/`
   - Em `replayapp/src/services/`
3. Se a rota alterou payloads, adicione compatibilidade retroativa ou atualize os serviços consumidores.
4. Atualize o `openapi.json` e o catálogo `ReplayCofre/02-Projetos/catalogo-controladores-replayapi-php.md`.

### 2. Se a alteração for no `rock10-ui`:
1. Identifique os componentes modificados (ex: `Button`, `Select`, `ThemeToggle`).
2. Verifique se props obrigatórias foram adicionadas ou renomeadas.
3. Em `ReplayPanelAPP` e `replayapp`, execute:
   ```bash
   npx tsc --noEmit
   ```
4. Garanta que ambos os projetos continuam compilando perfeitamente.

### 3. Se a alteração for no `ReplayLiveModule` ou `ReplayClienteGO`:
1. Verifique payloads de telemetria WebSocket e status de canais.
2. Certifique-se de que o backend `ReplayAPI-PHP` (`internal/live-status`) e os frontends compreendem o formato da mensagem.
