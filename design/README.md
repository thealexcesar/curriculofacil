# design/

Pasta de trabalho do redesign — entrada e saída do Claude Design.

## Como usar

1. Abra [`PROMPT-CLAUDE-DESIGN.md`](PROMPT-CLAUDE-DESIGN.md), copie o arquivo
   inteiro e cole no Claude Design.
2. O Claude Design devolve a auditoria e os mockups.
3. Baixe os arquivos que ele gerar **nesta pasta**, com estes nomes:

```
design/
├── 00-AUDITORIA.md        diagnóstico priorizado
├── 01-TOKENS.css          :root revisado + text-large + theme-dark
├── 02-COMPONENTES.md      redlines por componente
├── 03-RESPONSIVO.md       breakpoints definitivos
├── 04-TEMPLATES-CV.md     os 3 templates A4 + carta
├── 05-ACESSIBILIDADE.md   checklist acionável
├── 06-PLANO.md            ordem de implementação
└── mockups/               PNGs: <tela>-<largura>.png
```

4. Volte aqui e peça a implementação. Sugestão de pedido:

   > Li a auditoria em `design/`. Implemente os itens 1 a N do `06-PLANO.md`,
   > um commit por passo, sem quebrar a impressão A4.

## Contexto para quem for implementar

O prompt já documenta o estado atual do design (tokens, breakpoints, os 3
templates, o comportamento de impressão). Se o CSS mudar bastante, vale
atualizar as seções 3, 4 e 5 do prompt antes da próxima rodada de auditoria —
ele é a fonte de verdade que o designer lê.
