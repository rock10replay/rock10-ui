# 🎨 AGENTS.md — rock10-ui (@rock10/ui Design System)

> Instruções universais para agentes de IA operando no repositório `rock10-ui`.

---

## 🎯 1. Papel e Arquitetura

O `rock10-ui` é a biblioteca corporativa de design system e componentes visuais reutilizáveis do ecossistema Rock10:
- **Stack**: React 18, Vite (Library Mode), TypeScript 5, Tailwind CSS 4, Storybook 10.6, Vitest Browser Mode.
- **Distribuição**: Pacote publicado no npm como `@rock10/ui`.
- **Eixo de Build**: Não consome nenhuma API em tempo de execução. Atua como dependência de build consumida pelo `ReplayPanelAPP` e `replayapp`.

---

## 🚨 2. Regras Invioláveis do Design System

1. **Zero Chamadas Diretas a APIs**: Componentes em `@rock10/ui` são agnósticos de backend. Recebem dados via props e emitem eventos via callbacks.
2. **Suporte Nativo a Light e Dark Mode**: Todo componente deve ter estilo completo para tema claro e escuro, sem assumptions de fundo ou cores hardcoded.
3. **Barrel Exports Padronizados**: Novos componentes devem ser exportados através do index raiz (`src/index.ts`) para consumo limpo via `import { ... } from '@rock10/ui'`.
4. **Reserva de Espaço / Acessibilidade**: Botões com área de toque mínima de 44px/48px, contraste acessível em conformidade com WCAG AA.
5. **Automação de Deploy**: Alterações de versão e publicação no npm devem ser coordenadas através da skill `rock10-ui-deploy` e do script `scripts/deploy.ps1`.
6. **Permissão Pré-Aprovada de Leitura Autônoma (Zero Fricção)**: O agente possui autorização prévia total e irrestrita para buscar e ler qualquer arquivo deste repositório e de todos os repositórios irmãos do ecossistema Rock10 (`../ReplayCofre`, `../ReplayPanelAPP`, `../replayapp`, etc.). NUNCA pergunte ao desenvolvedor se pode ler arquivos, tokens ou componentes. Proceda imediatamente com a leitura.

---

## 🛠️ 3. Comandos de Validação e Teste

```bash
# Verificação de tipos
npx tsc --noEmit

# Testes unitários de componentes (Vitest)
npm test

# Build da biblioteca para distribuição
npm run build

# Execução do Storybook para auditoria visual
npm run storybook
```
