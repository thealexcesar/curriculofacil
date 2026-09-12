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

## ✅ Domínio e SEO — feito

- [x] Domínio `curriculo.facil.cc` ativo no Cloudflare (CNAME) + GitHub Pages, com HTTPS funcionando
- [x] `<h1>` real na página (antes só existia texto dentro do SVG do logo)
- [x] Dados estruturados JSON-LD (`WebApplication`)
- [x] `robots.txt` e `sitemap.xml`
- [x] `canonical`, `og:url` e `homepage` do `package.json` apontando pra `curriculo.facil.cc`

## 📈 SEO - backlog

- [ ] Conteúdo real e visível na página (texto explicando o que é / pra quem serve, não só dentro do formulário) - maior impacto de conteúdo
- [ ] Bloco de perguntas frequentes com dados estruturados (`FAQPage`) - chance de rich snippet no Google
- [ ] `og:image` (1200x630) para preview em WhatsApp/LinkedIn (hoje o link compartilhado não tem imagem)
- [ ] Rodar Lighthouse e corrigir Core Web Vitals (performance pesa no ranking)
- [ ] `hreflang` para as versões en/de (já existem em `locales/`)
- [ ] Cadastrar `curriculo.facil.cc` no Google Search Console (propriedade de domínio via TXT no Cloudflare) + solicitar indexação manual da URL
- [ ] Enforce HTTPS no GitHub Pages (liberar assim que o DNS check terminar)
- [ ] Divulgar o link (LinkedIn, grupos de RH/emprego, fórum da UNINTER) - backlinks pesam mais que qualquer ajuste de código pra ranking

## 🎓 Plano de ação - Apresentação UNINTER (Atividade Extensionista II)

- [ ] Agendar a oficina presencial (CRAS do Garcia, SINE ou escola estadual/municipal) em Blumenau - SC
- [ ] Montar o diagrama de metodologia/fluxo com cronograma e dias de duração de cada etapa (item M da nota, até 20 pontos)
- [ ] Planejar a coleta de evidências: fotos, lista de presença, depoimentos, declaração da instituição parceira (item R, até 20 pontos)
- [ ] Redigir o Trabalho Final (máx. 10 páginas): proposta ajustada + metodologia + resultados obtidos + considerações finais
- [ ] Usar `curriculo.facil.cc` como link ao vivo, mostrando a plataforma funcionando durante a oficina e na apresentação
