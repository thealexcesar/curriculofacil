# Contexto para continuar o Currículo Fácil

Projeto: currículo builder estático (HTML/CSS/JS puro, sem build, sem framework, sem dependências), branch `develop`. Vai ser apresentado como projeto ligado ao ODS 8 (Trabalho Decente e Crescimento Econômico) neste fim de semana. Roda em `python3 -m http.server 8000` na raiz do projeto (não abrir o `index.html` direto do disco, os módulos JS quebram).

## O que já foi feito nesta sessão (nada commitado ainda)

7 features novas, todas com i18n (pt-BR/en/de):
1. Barra de progresso de preenchimento do currículo
2. Botão "A+" pra aumentar o tamanho do texto (acessibilidade)
3. Dicas de preenchimento (ícone de info + texto) nos campos de perfil, experiência e educação
4. Exportar/importar os dados do currículo como arquivo JSON (essencial pra quem usa computador compartilhado tipo CRAS/biblioteca)
5. Compartilhar resumo do currículo via WhatsApp (texto, não anexa PDF - o projeto não tem backend nem lib de PDF)
6. Segundo modelo visual de currículo ("Moderno", com faixa colorida no cabeçalho e marcador nos títulos de seção) além do "Clássico" original
7. Carta de apresentação: painel próprio fora do fluxo de 5 passos, com rascunho automático gerado a partir dos dados já preenchidos, e impressão isolada (não mistura com a impressão do currículo)

## Sistema de cor do currículo (trabalho mais recente)

- `#cv-preview` usa 3 CSS custom properties: `--cv-accent`, `--cv-accent-dark`, `--cv-accent-light`, setadas via JS inline (nunca fixas no CSS) em `js/components/preview/preview.component.js`, funções `initColorSwatches`/`applyColor`.
- Tanto o modelo Clássico quanto o Moderno respeitam a mesma cor escolhida (antes só o Moderno tinha cor customizável).
- 9 cores em quadradinhos clicáveis (`#color-swatches`, acima do preview): azul (padrão/original), grafite, azul-marinho, índigo, ameixa, vinho, ferrugem, teal escuro, verde. Todas escolhidas por ficarem escuras o bastante pra imprimir bem em preto-e-branco (requisito explícito - currículo pode ser impresso em impressora comum, sem cor).
- Persiste em `localStorage` (`curriculofacil_template_color`), separado da escolha de modelo (`curriculofacil_template`).

## Corretor ortográfico - CONCLUÍDO

Decisão: usar o corretor nativo do navegador (`spellcheck="true"`), não implementar nada customizado - contradiria o "zero dependências" do projeto e uma lib/API de dicionário custaria dinheiro ou precisaria de backend (mesmo motivo pelo qual sugestões de IA foram descartadas nesta sessão).

`spellcheck="true"` + `autocorrect="on"` (esse último é pro teclado do iOS respeitar explicitamente) adicionado em todos os 12 campos de texto livre: `#name`, `#job-title`, `#profile`, `.exp-title`/`.exp-company`/`.exp-description`, `.edu-degree`/`.edu-institution`/`.edu-description`, `.skill-input`, `#cl-company`, `#cl-body`. Não precisa em telefone, e-mail, LinkedIn, datas, selects.

## Entrada por voz - CONCLUÍDO

`js/services/voice-input.service.js` - usa a Web Speech API nativa do navegador (`SpeechRecognition`/`webkitSpeechRecognition`), gratuita, sem backend. Progressive enhancement: se o navegador não suportar (ex: Firefox), o botão de microfone simplesmente não aparece, nada quebra.

Escopo (decisão do usuário): só nos 4 campos de texto longo, não nos 12 campos totais - `#profile`, `.exp-description` (por item de experiência), `.edu-description` (por item de educação), `#cl-body` (carta de apresentação). Botão de microfone fica no canto inferior direito de cada campo (`.voice-btn`, posicionado via `.field { position: relative }` que já existia). Pulsa vermelho (`is-listening`, anima `opacity` - barato) enquanto ouve. Texto ditado é concatenado ao que já tinha no campo, dispara `input` event manualmente pra entrar no fluxo normal de auto-save/preview.

Idioma do reconhecimento segue `document.documentElement.lang` (pt-BR/en-US/de-DE).

**Nota pro usuário:** ele testou o `spellcheck="true"` e não viu o sublinhado vermelho no PC (Arch Linux) - expliquei que isso depende de o navegador ter o dicionário de PT-BR instalado (`chrome://settings/languages`), não é bug no código. Ainda não confirmou se resolveu.

## Pendências gerais

- Chave de tradução `template.color.brown` ficou órfã nos 3 `locales/*.json` (cor removida do HTML/JS, sobrou a tradução) - pode limpar.
- **Nada foi testado visualmente num navegador real** nesta sessão - validação foi só sintaxe (`node --check`, `json.load`). É por isso que a continuação precisa de screenshot: peça print de qualquer coisa quebrada (layout, cor, responsividade mobile) antes de tentar consertar no escuro.
