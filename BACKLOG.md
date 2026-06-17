# PowerOver Motorsports — Backlog de Desenvolvimento

> Gerado em 2026-06-13 com base nas conversas de produto.

---

## 🔴 Crítico — Bloqueia vendas

| # | Tarefa | Contexto |
|---|--------|----------|
| C1 | **Token Melhor Envio expirado** | Token atual retorna "Unauthenticated." — renovar em melhorenvio.com.br/painel e atualizar `MELHORENVIO_TOKEN` no `.env` do backend |
| C2 | **Token MercadoPago real** | `.env` tem placeholder — substituir por token de produção e ativar provider no admin |
| C3 | **Métodos de pagamento no admin** | Ativar MercadoPago em Settings → Regions → Brasil |
| C4 | **Shipping Profiles nos produtos** | Vincular produtos ao "Default Shipping Profile" para que PAC/SEDEX apareçam no checkout |
| C5 | **Deploy em VPS** | Backend + storefront precisam estar no servidor para acesso público; domínio `poweroverloja.com.br` precisa apontar para o VPS |

---

## 🟠 Alta prioridade — Experiência do cliente

| # | Tarefa | Contexto |
|---|--------|----------|
| A1 | **Frete calculado no checkout (Melhor Envio real-time)** | Atualmente PAC/SEDEX são preço fixo. Construir um fulfillment provider plugin do Medusa que chame a API do Melhor Envio com CEP do cliente para preço exato |
| A2 | **Integração real do formulário de contato** | Atualmente é placeholder (`setEnviado(true)`). Integrar com e-mail (Resend/Nodemailer) ou CRM |
| A3 | **Estoque por produto no admin** | Vincular variantes ao "Estoque Brasil – Petrópolis RJ" para que o sistema rastreie disponibilidade |
| A4 | **Página de rastreamento de pedido** | Cliente precisa consultar status do pedido pós-compra |
| A5 | **E-mail transacional de confirmação de pedido** | Medusa tem templates de e-mail — configurar SMTP/Resend e ativar notificações |
| A6 | **WhatsApp/telefone real na página de contato** | Número e Instagram estão com placeholder `(21) 00000-0000` |

---

## 🟡 Média prioridade — Conversão e catálogo

| # | Tarefa | Contexto |
|---|--------|----------|
| M1 | **Preços reais ajustados** | Após fix de centavos, validar cada produto no admin — PAC/SEDEX flat ainda são estimativas (R$25/R$45) |
| M2 | **Dimensões e peso dos produtos** | Campos `weight`, `height`, `width`, `length` não preenchidos — o calculador de frete usa defaults genéricos |
| M3 | **Tagline de promoção (`metadata.promo_tag`)** | Badge verde implementado; popular no admin para produtos em destaque (ex: "Lançamento", "Mais vendido") |
| M4 | **Imagens de alta qualidade em todos os produtos** | Vários produtos com imagem única ou sem thumbnail |
| M5 | **Categorias Medusa corretas** | Subcategorias mostradas no sidebar são as do template (Shirts/Sweatshirts) — criar categorias reais no admin e vincular produtos |
| M6 | **SEO — títulos e descrições** | `metadata.title` e `metadata.description` padrão em inglês em várias páginas |
| M7 | **Página de política de trocas / devoluções** | Obrigatório pelo CDC brasileiro |
| M8 | **Página de termos de uso e privacidade (LGPD)** | Necessário para conformidade |

---

## 🟢 Melhorias — UX e design

| # | Tarefa | Contexto |
|---|--------|----------|
| U1 | **Frete calculado no checkout integrado ao Melhor Envio** | Ver A1 — versão mais completa com seleção de transportadora |
| U2 | **Filtro de preço funcional** | Sidebar tem radio de faixa de preço mas não filtra os produtos (param `price_min/max` não está conectado na query) |
| U3 | **Mobile responsive completo** | Layout foi feito desktop-first; testar e ajustar breakpoints mobile |
| U4 | **Galeria de produto com zoom** | Imagem principal sem zoom/lightbox |
| U5 | **Reviews / avaliações** | Seção de depoimentos na home é estática — integrar com sistema real (Yotpo, Judge.me) |
| U6 | **Wishlist / lista de desejos** | Comum em e-commerces de nicho |
| U7 | **Busca com autocomplete** | Search atual navega para `/store?q=` — adicionar dropdown de sugestões em tempo real |
| U8 | **Breadcrumb em categoria** | Página de categoria `/categories/drift` não tem breadcrumb |

---

## 🔵 Técnico — Infraestrutura

| # | Tarefa | Contexto |
|---|--------|----------|
| T1 | **Nginx + PM2 no VPS** | Configurar processo manager e reverse proxy para backend (porta 9000) e storefront (porta 8000) |
| T2 | **SSL com Certbot** | HTTPS obrigatório para produção e para MercadoPago |
| T3 | **Variáveis de ambiente de produção** | Separar `.env.production` de `.env.development` |
| T4 | **Redis para produção** | Atualmente usa fake-redis (in-memory) — instalar Redis para jobs e cache |
| T5 | **Backup automático do banco (Supabase)** | Verificar se o plano Supabase atual inclui backups point-in-time |
| T6 | **CI/CD básico** | GitHub Actions para deploy automático no push para `main` |
| T7 | **Domínio configurado** | `poweroverloja.com.br` apontando para VPS via DNS |
| T8 | **Admin em subdomínio protegido** | `admin.poweroverloja.com.br` com autenticação e HTTPS |

---

## 📝 Notas de progresso (loop autônomo — 2026-06-14)

### Sessão 2 — itens concluídos sem interação do usuário
- **U2** ✅ Filtro de preço funcional: `price_min`/`price_max` agora são lidos da URL, passados pelo StoreTemplate e aplicados no PaginatedProducts com `filterByPrice()`. RefinementList corrigido para single push e estado sincronizado com URL (sem useState, derivado de searchParams).
- **M6** ✅ SEO categoria: metadata deixou de dizer "Medusa Store", agora é `{nome} | PowerOver Motorsports` com description em PT-BR.
- **M7** ✅ Página `/politica-de-trocas` criada — CDC 7 dias, prazos de defeito, condições, custos de envio, reembolso.
- **M8** ✅ Página `/termos-de-uso` criada — LGPD completo, dados coletados, direitos do titular, cookies, propriedade intelectual.
- **Footer** ✅ Links "Trocas e Devoluções", "Termos de Uso", "Privacidade (LGPD)" e "Fale Conosco" adicionados na coluna Legal.
- **U8** já estava implementado (breadcrumb na categoria funcionando).
- **Central de Ajuda** ✅ `/CENTRAL-DE-AJUDA.md` criado — guia completo de configuração, operação diária, troubleshooting e base de conhecimento para agente IA.

### Sessão 3 — itens concluídos
- **C1** ✅ Melhor Envio funcionando — token pessoal OAuth com shipping-calculate, CEP origem 83408280 (Colombo/PR), 14 transportadoras retornando
- **A2** ✅ Formulário de contato integrado — endpoint `/store/contato` envia e-mail real via Resend para contato@powerover.com.br
- **A4** ✅ Página `/rastreamento` criada — rastreia via Melhor Envio API + fallback Correios, link no footer
- **U4** ✅ Galeria com zoom/lightbox — clique na imagem abre fullscreen com navegação por setas e teclado
- **U7** ✅ Search autocomplete — dropdown com thumbnail, título e preço dos produtos em tempo real
- **Admin email templates** ✅ — painel em `/admin/email-templates` com editor HTML, preview live e envio de teste
- **Resend module** — comentado no medusa-config.ts (precisa `npm install resend` no VPS antes de reativar)

### Pendente (requer ação do usuário)
- C2: Token MercadoPago real → painel.mercadopago.com.br → Credenciais de Produção
- C3: Ativar MercadoPago no admin → Settings → Regions → Brasil → Payment Providers
- C4: Vincular produtos ao Default Shipping Profile no admin
- A6: Número real de WhatsApp — atualizar em `/contato/page.tsx` (linha "41) 99999-9999") e no footer

---

## ✅ Concluído nesta sessão

- [x] Moeda BRL adicionada como padrão na store
- [x] Localização "Estoque Brasil – Petrópolis RJ" criada e vinculada ao Sales Channel
- [x] Shipping options: PAC (R$25), SEDEX (R$45), Retirada (grátis) configurados
- [x] Service Zone Brasil com geo_zone cobrindo todo o país
- [x] Preços corrigidos (divisão por 100 — centavos → reais)
- [x] Locale PT-BR na formatação de moeda
- [x] Sidebar da loja com categorias, subcategorias, faixa de preço e ordenação (radio buttons)
- [x] Grid 3 colunas na loja
- [x] Botão "Adicionar ao carrinho" / "Selecionar opções" nos cards
- [x] Tagline de promoção via `metadata.promo_tag`
- [x] CTA section redesenhada com gradiente dark premium + glow verde
- [x] Search funcional no navbar (navega para `/store?q=`)
- [x] Paleta de cores PowerOver com tokens CSS (`:root`)
- [x] Efeito shine nos botões via `.po-btn`
- [x] Página 404 em PT-BR com logo
- [x] Página /contato com formulário
- [x] ImageGallery com miniaturas
- [x] Breadcrumb na página de produto
- [x] Admin user criado: admin@powerover.com.br
