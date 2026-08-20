# Plano — Currículo Fácil

## ✅ Já construído (sessão anterior, ainda sem commit)

- [x] Barra de progresso de preenchimento
- [x] Botão "A+" (aumentar tamanho do texto)
- [x] Dicas de preenchimento (campos de perfil, experiência, educação)
- [x] Exportar/importar dados como JSON
- [x] Compartilhar resumo via WhatsApp
- [x] Segundo modelo visual ("Moderno") + sistema de 9 cores
- [x] Carta de apresentação (painel próprio + rascunho automático)
- [x] Corretor ortográfico nativo (`spellcheck`) — depende do navegador ter dicionário PT-BR instalado, não é bug
- [x] Entrada por voz (Web Speech API)

## 🔧 Corrigido nesta sessão

- [x] Contraste de texto abaixo do mínimo de acessibilidade (WCAG AA)
- [x] `<main>` ausente na página (landmark de acessibilidade)
- [x] Botão "A+" com aria-label que não incluía o texto visível
- [x] Voice input falhava em silêncio (sem feedback quando dava erro) — agora mostra aviso e loga no console
- [x] `package.json` criado com `version: 0.1.0`

## ⏳ Pendente / a verificar

- [ ] Confirmar se o corretor ortográfico sublinha erros (checar dicionário PT-BR em `chrome://settings/languages`)
- [ ] Testar entrada por voz em `http://localhost:8000` (não `0.0.0.0`) com microfone de verdade
- [ ] Testar tudo visualmente num navegador real — nada foi validado visualmente ainda, só sintaxe
- [ ] Limpar chave de tradução órfã `template.color.brown` nos 3 `locales/*.json` (cor foi removida, tradução ficou)
- [ ] Revisar botão de compartilhar WhatsApp — em navegadores com Web Share API ele abre o menu de compartilhar genérico do sistema, não vai direto pro WhatsApp (a decidir se isso é problema ou não)

## 🚀 Deploy (por último, só depois de tudo testado)

- [ ] Commitar tudo (conventional commits)
- [ ] Merge `develop` → `main`
- [ ] Push pro remoto
- [ ] Conferir/configurar o build automático do GitHub Pages (hoje não tem `.github/workflows/` — o deploy provavelmente é direto por branch, não por Actions; a confirmar em Settings → Pages)
