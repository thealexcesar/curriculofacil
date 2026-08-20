# Auditoria e redesign do **Currículo Fácil** (mobile + desktop)

Você é um designer de produto sênior especializado em interfaces web acessíveis,
formulários longos e documentos para impressão. Quero uma **auditoria crítica de
design + proposta de melhorias** do meu app, cobrindo mobile e desktop, e no fim
um **conjunto de arquivos exportáveis** que eu vou baixar e implementar em código.

Leia todo o dossiê abaixo antes de propor qualquer coisa. Ele descreve o app
exatamente como ele está hoje: tokens reais, medidas reais, breakpoints reais.

---

## 1. O produto

**Currículo Fácil** — gerador de currículo em uma única página (SPA), 100% no
navegador. Nada vai para servidor: tudo fica no `localStorage` do usuário.

- URL: https://thealexcesar.github.io/curriculofacil/
- Versão: 0.2.0-beta
- Idioma: **somente pt-BR** (os documentos pessoais são brasileiros e não
  traduzem bem; a infra de i18n existe mas está reduzida a pt-BR)
- Origem: projeto de extensão universitária (UNINTER, ADS)

**Público-alvo real** — e isso deve guiar todas as decisões:

- Pessoas brasileiras procurando emprego, muitas de **baixa renda e baixa
  familiaridade digital**
- **Maioria absoluta acessa por celular Android de tela pequena**, muitas vezes
  em conexão ruim
- Muitos usuários mais velhos (daí o botão "A+" de aumentar texto)
- O resultado final costuma ser impresso numa **lan house / papelaria**, muitas
  vezes em **preto e branco** — o currículo tem que continuar legível sem cor
- O usuário provavelmente vai preencher **uma vez só**, com pressa, e não vai
  voltar para aprender a interface

**Restrições técnicas invioláveis** (a proposta precisa caber nisso):

- HTML + CSS puro + JavaScript vanilla (ES Modules). **Sem build, sem
  framework, sem npm, sem Tailwind, sem bundler.** Roda direto no GitHub Pages.
- Um único arquivo CSS (`css/style.css`, ~2.050 linhas) com custom properties.
- Uma única fonte externa: **Inter** (Google Fonts), com fallback local Arial
  ajustado via `@font-face` com `size-adjust`.
- Ícones: sprite SVG inline no próprio `index.html` (sem biblioteca de ícones).
- Componentes seguem um padrão factory: `{ element, getData, destroy }`, cada um
  com `*.component.js` + `*.template.js` (template literal de HTML).
- A impressão é feita com `window.print()` + `@media print` — não existe gerador
  de PDF. Então **o layout impresso é o mesmo DOM da tela**.

---

## 2. Estrutura da tela (o que existe hoje)

Ordem vertical dentro de `.app` (`max-width: 1100px`, `padding: 24px 16px`):

1. **`.app-header`** — logo SVG fixa de 280×60 (um "papel" azul `#1e3a8a` com um
   marcador ciano `#0ea5e9` + texto "curriculo" / "fácil"), e no canto superior
   direito, absoluto, o botão **"A+"** (toggle de texto grande, `aria-pressed`).
   Abaixo, `.app-subtitle`.
2. **`.steps-caption`** — texto "Passo X de 5 · Nome do passo". **Só aparece em
   ≤480px** (`display: none` acima disso).
3. **`.steps-nav`** — 5 `.step-item`, cada um com `.step-number` (círculo 36×36)
   + `.step-label`, separados por `.step-line`. Clicáveis. `overflow-x: auto`.
   Em ≤480px vira uma **barra segmentada** (5 barras de 6px, preenchidas até o
   passo atual); número, label e linha somem.
4. **`.progress-wrap`** — barra de progresso de preenchimento + label "0%".
5. **`.data-actions`** — dois botões pequenos: **Exportar** e **Importar** JSON.
6. **`.view-toggle`** — alterna **Formulário / Pré-visualização**. Só existe em
   ≤1023px (em desktop some, porque os dois painéis ficam lado a lado).
7. **`main.layout`** — grid. `1fr` por padrão; `1fr 1fr` a partir de 1024px.
   - **`.form-panel`** (superfície branca, `radius: 12px`, `padding: 24px`,
     `shadow-sm`) — contém as 5 `section.step-section` (só a `.active` é
     exibida, com uma animação `fadeUp` de 200ms) e a `.form-nav` (Voltar /
     Avançar / Concluir) presa no fim do painel, com borda superior.
   - **`.preview-panel`** (superfície `#f9fafb`) — `.preview-header` (label
     "Pré-visualização" + botões **WhatsApp** e **Imprimir**), o
     **`.template-switcher`** (label + 3 botões de template + uma linha com um
     `input[type=range]` de matiz e um botão de reset) e a
     `.cv-preview-wrapper` com a folha A4.
8. **`.cover-letter-toggle`** — botão largura total que abre o painel da
   **carta de apresentação** (`#cover-letter-panel`), que repete a mesma
   estrutura `.layout` > `.form-panel` + `.preview-panel`.
9. **`.app-footer`** — uma linha de texto sobre os ODS da ONU.

### Os 5 passos do formulário

1. **Dados pessoais** — foto opcional (thumb + botões escolher/remover), nome,
   cargo (com **autocomplete sobre ~2.460 ocupações da CBO**), e-mail, telefone
   (com checkbox de WhatsApp e botão "adicionar telefone"), cidade, LinkedIn,
   Instagram, site, categoria de CNH (`select`), registro profissional, e um
   `<details>` recolhível com RG e CPF.
2. **Perfil profissional** — um card de sugestão (`.profession-suggestion`) que
   aparece quando a profissão digitada tem sugestão pronta, com botões "usar" e
   "dispensar"; `textarea` de 8 linhas com contador `0/400` e uma dica.
3. **Experiência** — lista dinâmica de itens (cargo, empresa, datas, "emprego
   atual", descrição) + botão "adicionar".
4. **Formação** — mesma estrutura (curso, instituição, datas, "em andamento").
5. **Habilidades e idiomas** — chips de habilidade (input + botão, vira `.chip`)
   e linhas de idioma (nome livre + nível em `select`).

---

## 3. Design tokens atuais (`:root` em `css/style.css`)

```css
/* Marca */
--color-primary:          #1e3a8a;   --color-primary-hover:   #1e40af;
--color-primary-light:    #eff6ff;   --color-primary-text:    #1d4ed8;
--color-secondary:        #6b7280;   --color-secondary-hover: #4b5563;
--color-accent:           #0ea5e9;   --color-accent-hover:    #0284c7;

/* Feedback */
--color-success: #16a34a;  --color-danger: #dc2626;
--color-warning: #d97706;  --color-info:   #2563eb;
/* cada um com -hover, -light e -text */

/* Neutros */
--color-bg:            #f3f4f6;   --color-surface:     #ffffff;
--color-surface-alt:   #f9fafb;   --color-border:      #e5e7eb;
--color-border-strong: #d1d5db;

/* Texto */
--color-text: #111827;  --color-text-secondary: #4b5563;
--color-text-muted: #5c626e;  --color-text-placeholder: #9ca3af;

/* Foco */
--color-focus-ring: rgba(14,165,233,.30);  --border-focus: var(--color-accent);

/* Raio */    4 / 6 / 8 / 12 / 16 / 9999px
/* Sombra */  xs 0 1px 2px .05 · sm 0 1px 4px .08 · md 0 4px 12px .10 · lg 0 8px 32px .12
/* Espaço */  4 8 12 16 20 24 32 40 48px
/* Tipografia */
--font-family: 'Inter', 'Inter fallback', sans-serif;
--font-size-xs: 11px; sm: 13px; md: 14px; lg: 16px; xl: 18px; 2xl: 22px; 3xl: 28px;
--cv-preview-font-size: 10pt;  --cl-preview-font-size: 10.5pt;
pesos 400 / 500 / 600 / 700 · line-height 1.25 / 1.5 / 1.75
/* Transição */ .10s / .2s / .3s ease + bounce cubic-bezier(.34,1.56,.64,1)
```

**Modo texto grande** (`html.text-large`, ligado pelo botão "A+") redefine toda
a escala tipográfica de uma vez: xs 16, sm 18, md 20, lg 22, xl 25, 2xl 31,
3xl 39px, e o currículo vai a 11pt.

**Modo escuro**: existe um bloco `.theme-dark` completo **comentado** no CSS,
nunca ligado. Nunca houve toggle de tema na interface.

**Botões**: `.btn` = inline-flex, `padding: 10px 20px`, `radius: 8px`, 14px,
peso 500. Variantes sólidas `primary` / `secondary` (cinza sólido, não outline —
decisão consciente: botão clicável esmaecido parece desabilitado) / `success`,
mais `.btn-sm` (8px 14px, 13px) e `.btn-whatsapp` (branco com borda, hover verde
`#25D366`).

**Campos**: `padding: 10px 12px`, borda 1px `#e5e7eb`, raio 8px, e
**`font-size: 16px` obrigatório** — abaixo disso o Safari iOS dá zoom automático
no foco. Foco = borda ciano + `box-shadow: 0 0 0 3px` do focus ring. Estados
`.is-valid` / `.is-invalid` mudam só a cor da borda. Todo input de texto tem um
botão "×" (`.input-clear-btn`) absoluto à direita para limpar de uma vez.

---

## 4. A folha A4 (o produto real que o usuário leva)

`.cv-preview` é uma folha **fixa de 794×1123px** (A4 a 96dpi), `position:
absolute`, com `padding: 57px 66px`. Um JS (`scaleCvPreview()`) mede a largura
do `.cv-preview-wrapper` e aplica `transform: scale(...)` para caber, ajustando
a altura do wrapper. Ou seja: **no celular o A4 inteiro é reduzido por escala** —
o texto do currículo aparece minúsculo, sem zoom, sem rolagem horizontal.

Linguagem visual dos 3 templates (modelada em currículos de referência):
sem sombra nenhuma dentro da folha, **fios de 1px em vez de caixas**, títulos de
seção em caixa alta com `letter-spacing`, e a cor de destaque usada só em pontos
pequenos e deliberados (um fio, um ponto, o cargo) — nunca em áreas preenchidas,
para não morrer na impressão em P&B.

- **Clássico** — coluna única. Único destaque: o fio de 2px sob o cabeçalho.
- **Moderno** — faixa de 14px na cor de destaque no topo da folha, nome 25pt em
  caixa alta, cargo em caixa alta com `letter-spacing: .18em`, e um **trilho de
  linha do tempo** (linha vertical + ponto por item) em Experiência e Formação;
  chips de habilidade arredondados na cor de destaque.
- **Executivo** (sidebar) — duas colunas flex: sidebar de 196px (foto redonda
  104px, contato, documentos, habilidades, idiomas) separada por um fio; coluna
  principal com nome, perfil, experiência, formação. Títulos da sidebar em 8,5pt
  com um "tique" de 22×2px na cor de destaque acima de cada um.

**Cor de destaque**: o usuário escolhe pelo `input[type=range]` de matiz. Só a
matiz é exposta — saturação (0.62) e luminosidade (0.26) são fixas, para que
**qualquer escolha já passe em WCAG AA (4.5:1) sobre branco**. O primeiro trecho
do gradiente é um grafite neutro `#374151` (10,3:1), que é o padrão de fábrica.

**Carta de apresentação** — folha separada com cara de papel timbrado: nome
pequeno (12pt) no topo, fio, destinatário, data, corpo justificado com
`white-space: pre-wrap`; imprime isolada via `body[data-print-target="letter"]`.

---

## 5. Comportamento responsivo atual (é só isto, não há mais nada)

| Breakpoint | O que muda |
|---|---|
| `≥1024px` | `.layout` vira 2 colunas (formulário \| pré-visualização); `.view-toggle` some |
| `≤1023px` | Aparece o `.view-toggle` Formulário/Pré-visualização; as classes `.layout--show-form` / `.layout--show-preview` escondem um dos painéis |
| `≤480px` | `.app` padding cai para 16/12px; `.form-panel` para 16px; steps viram barra segmentada + `.steps-caption`; `.field-row` vira 1 coluna; ações do `.preview-header` viram botões de largura total empilhados; `.skill-input-row` empilha |

Não existe nenhum breakpoint entre 481px e 1023px além do toggle — ou seja,
**tablet e celular grande usam o layout "de desktop" dos passos** (5 círculos de
36px + rótulos + linhas) dentro de uma coluna só.

**Impressão**: `@page A4 portrait, margin 15mm`; tudo com `.no-print` some; o
`.form-panel` some; a folha perde a escala e vira `position: relative; width:
100%`; as variáveis de padding da folha são zeradas porque a margem passa a vir
do `@page`.

---

## 6. Acessibilidade — estado atual

- Lighthouse: Performance 95 · **Acessibilidade 94** · Boas práticas 78 · SEO 100
- Contraste já corrigido para WCAG AA em texto de interface
- `aria-live` no caption dos passos; combobox com `role="combobox"`,
  `aria-expanded`, `aria-controls`; `.visually-hidden` para rótulos de ícone
- Botão "A+" com `aria-pressed`
- `spellcheck` nativo em todos os campos livres
- **Não existe**: modo escuro, `prefers-reduced-motion`, skip link, foco visível
  customizado em botões (só nos campos), teclado testado ponta a ponta

---

## 7. O que eu já desconfio que está errado (confirme, refute ou aprofunde)

1. No celular, a pré-visualização é um A4 encolhido por `transform: scale()` —
   ilegível. O usuário não consegue conferir o que vai imprimir.
2. A logo SVG tem largura fixa de 280px e disputa espaço com o botão "A+"
   posicionado em absoluto — em telas de 320-360px isso deve estar espremido.
3. O botão **Imprimir** (a ação mais importante do app) mora dentro do
   `.preview-header`. No celular, se o usuário estiver na aba "Formulário", ele
   simplesmente **não vê** o botão principal.
4. Entre 481px e 1023px os 5 círculos numerados + rótulos podem estourar.
5. O `.form-panel` é um cartão só, muito longo no passo 1 (14 campos), sem
   agrupamento visual ou hierarquia entre "essencial" e "opcional".
6. O seletor de matiz por `range` é bonito, mas é uma metáfora difícil para o
   público-alvo. Provavelmente pede uma alternativa (amostras + "mais cores").
7. Falta um estado inicial/onboarding: quem abre o app pela primeira vez cai
   direto num formulário em branco, sem entender o que vai receber no fim.
8. A hierarquia da barra superior tem 4 blocos concorrendo (header, passos,
   progresso, exportar/importar) antes de o usuário chegar no primeiro campo.

Não se limite a essa lista. Quero também o que eu **não** enxerguei.

---

## 8. O que eu quero de você

Uma auditoria **priorizada e implementável**, não um moodboard. Especificamente:

1. **Diagnóstico** — problemas reais, cada um com: severidade (crítico / alto /
   médio / baixo), quem é prejudicado, e em qual viewport aparece.
2. **Proposta visual** — mockups das telas-chave, em **duas larguras: 375px
   (celular) e 1440px (desktop)**:
   - Passo 1 do formulário (o mais denso)
   - Passo 3 (lista dinâmica de experiências)
   - Pré-visualização no celular (sua solução para o problema do A4 encolhido)
   - Desktop com os dois painéis lado a lado
   - Os 3 templates de currículo redesenhados (Clássico, Moderno, Executivo)
   - O painel da carta de apresentação
3. **Sistema de design revisado** — paleta, escala tipográfica, espaçamento,
   raios, sombras, estados. **Entregue como custom properties CSS**, mantendo os
   nomes de token que já existem sempre que possível, e marcando claramente
   quais valores mudaram. Inclua uma **proposta de modo escuro** funcional (o
   bloco já existe comentado no CSS, quero ligar).
4. **Especificação responsiva** — quais breakpoints devem existir e o que muda
   em cada um. Se for para adicionar um breakpoint de tablet, diga exatamente
   o quê.
5. **Acessibilidade** — o que falta para chegar em 100 no Lighthouse e, mais
   importante, o que falta para uma pessoa de 55 anos com pouca visão conseguir
   usar isso no celular. Considere alvos de toque, `prefers-reduced-motion`,
   foco visível, ordem de tabulação.
6. **Plano de implementação** — a mudança quebrada em passos pequenos e
   independentes, ordenados por (impacto ÷ esforço), cada um dizendo em qual
   arquivo mexe (`css/style.css`, `index.html`, ou qual `*.template.js`).

**Regras da proposta:**

- Nada que exija framework, build, dependência ou fonte extra. Se propuser uma
  segunda fonte, ela tem que ser do Google Fonts e você tem que justificar o
  custo de carregamento.
- **Preserve os nomes de classe existentes** (`.form-panel`, `.cv-preview`,
  `.step-item`, `.btn-primary`...). Se algum precisar mudar, liste
  explicitamente `nome-antigo → nome-novo`, porque cada um está referenciado em
  JavaScript.
- Tudo que aparece na folha A4 precisa continuar **legível impresso em P&B** e
  paginar corretamente. Não proponha fundos coloridos grandes na folha.
- Não presuma conexão rápida nem aparelho potente: nada de animação pesada,
  `backdrop-filter` em tela cheia ou imagem decorativa grande.
- O idioma de toda a interface é **português do Brasil**.

---

## 9. Formato de entrega (importante — eu vou baixar isso)

No fim, gere os arquivos abaixo como **artefatos separados e baixáveis**, com
exatamente estes nomes, porque eles vão para a pasta `design/` do repositório e
serão lidos por um agente de código que vai implementar:

| Arquivo | Conteúdo |
|---|---|
| `00-AUDITORIA.md` | Diagnóstico completo, tabela priorizada com severidade, viewport e arquivo afetado |
| `01-TOKENS.css` | Bloco `:root` revisado + `html.text-large` + `.theme-dark`, comentando o que mudou e por quê. Precisa ser **CSS válido, pronto para colar** |
| `02-COMPONENTES.md` | Redlines por componente: botões, campos, chips, cards, navegação de passos, toggle de visualização, switcher de template. Com medidas em px |
| `03-RESPONSIVO.md` | Breakpoints definitivos e o que muda em cada um, com os blocos `@media` já escritos |
| `04-TEMPLATES-CV.md` | Especificação dos 3 templates + carta: tipografia em pt, espaçamentos, uso da cor de destaque, comportamento na impressão |
| `05-ACESSIBILIDADE.md` | Checklist acionável, cada item dizendo o que muda no HTML/CSS |
| `06-PLANO.md` | Passos de implementação ordenados por impacto ÷ esforço, com arquivo alvo e critério de "pronto" para cada um |
| `mockups/*.png` | Exporte cada mockup separadamente, nomeado pela tela e pela largura — ex.: `passo-1-375.png`, `passo-1-1440.png`, `preview-mobile-375.png`, `template-moderno-A4.png` |

Nos arquivos `.md`, sempre que citar CSS, escreva CSS real em bloco de código —
não descreva em prosa. Cada recomendação precisa ser específica o bastante para
alguém aplicar sem te perguntar nada.

Comece pela auditoria: mostre que entendeu o app antes de desenhar.
