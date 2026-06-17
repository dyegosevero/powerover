# Central de Ajuda — PowerOver Motorsports Loja

> **Para quem é este documento**
> - Vendedor/gestor que opera a loja no dia a dia
> - Agente de IA que auxilia o cliente a gerenciar a loja
> - Criação de vídeos tutoriais e treinamento da equipe
>
> **Stack:** Medusa.js v2 (backend) + Next.js 15 (storefront) — Turborepo monorepo
> **Admin:** `https://admin.powerover.com.br` (ou `http://76.13.225.174:9000/app`)
> **Loja:** `https://www.powerover.com.br`
> **Servidor:** VPS `76.13.225.174`, acesso SSH `root@76.13.225.174`

---

## ÍNDICE

1. [Visão Geral da Plataforma](#1-visão-geral-da-plataforma)
2. [Configuração Inicial (do zero)](#2-configuração-inicial-do-zero)
3. [Gestão de Produtos](#3-gestão-de-produtos)
4. [Gestão de Pedidos](#4-gestão-de-pedidos)
5. [Clientes e Contas](#5-clientes-e-contas)
6. [Pagamentos — MercadoPago](#6-pagamentos--mercadopago)
7. [Frete — Melhor Envio](#7-frete--melhor-envio)
8. [Estoque](#8-estoque)
9. [Categorias e Coleções](#9-categorias-e-coleções)
10. [Configurações da Região e Impostos](#10-configurações-da-região-e-impostos)
11. [Admin — Painel Completo](#11-admin--painel-completo)
12. [Operação Diária (Checklist)](#12-operação-diária-checklist)
13. [Deploy e Manutenção do Servidor](#13-deploy-e-manutenção-do-servidor)
14. [Troubleshooting — Problemas Comuns](#14-troubleshooting--problemas-comuns)
15. [Glossário Técnico](#15-glossário-técnico)

---

## 1. Visão Geral da Plataforma

### O que é o Medusa.js?
Medusa é a "engine" da loja — é o sistema que guarda produtos, pedidos, clientes e pagamentos. Pense nele como o cérebro invisível. Você acessa ele pelo **painel admin** em `http://76.13.225.174:9000/app`.

### O que é o Next.js (storefront)?
É a "vitrine" — o site que o cliente vê em `https://www.powerover.com.br`. Ele conversa com o Medusa nos bastidores.

### Como os dois se conectam?
```
Cliente acessa a loja (Next.js porta 3000/8000)
        ↓
Next.js faz chamadas para a API do Medusa (porta 9000)
        ↓
Medusa responde com produtos, preços, estoque, etc.
        ↓
Next.js exibe as informações para o cliente
```

### Onde fica cada coisa no servidor?
| O quê | Caminho no VPS | Porta |
|-------|---------------|-------|
| Backend (Medusa) | `/var/www/powerover-backend` | 9000 |
| Storefront (Next.js) | `/var/www/powerover-storefront` | 8000 |
| Banco de dados | Supabase (nuvem) | — |
| Painel admin | `http://IP:9000/app` | 9000 |

---

## 2. Configuração Inicial (do zero)

> **Para vídeo tutorial:** Mostre cada passo com print da tela. Este é o roteiro completo para configurar a loja do zero.

### 2.1 Primeiro acesso ao Admin

1. Abra o navegador e acesse: `http://76.13.225.174:9000/app`
2. Login: `admin@powerover.com.br`
3. Senha: (a definida na criação — se não souber, contate o desenvolvedor para reset)
4. Você verá o Dashboard com visão geral de pedidos e receita

### 2.2 Configurar a Região Brasil

A região define moeda, países atendidos e métodos de envio.

**Caminho:** Admin → Settings (engrenagem ⚙️) → Regions

1. Clique na região "Brazil" (ou crie se não existir: + Add Region)
2. Confirme:
   - **Name:** Brazil
   - **Currency:** BRL (Real Brasileiro)
   - **Countries:** BR (Brasil)
   - **Tax Rate:** 0 (impostos já inclusos no preço, ou configurar conforme necessário)
3. Salve

### 2.3 Ativar o MercadoPago

**⚠️ PENDENTE: necessita token de produção**

**Caminho:** Admin → Settings → Regions → Brazil → Payment Providers

1. Clique em "+ Add Payment Provider"
2. Selecione **MercadoPago**
3. Certifique-se de que o `MERCADOPAGO_ACCESS_TOKEN` no arquivo `.env` do backend no servidor está preenchido com o token de PRODUÇÃO (não sandbox)

**Como obter o token MercadoPago:**
1. Acesse `painel.mercadopago.com.br`
2. Vá em Seu Negócio → Configurações → Gestão e administração → Credenciais
3. Escolha **Produção** (não teste/sandbox)
4. Copie o **Access Token** (começa com `APP_USR-...`)
5. Cole no VPS: `nano /var/www/powerover-backend/.env` → linha `MERCADOPAGO_ACCESS_TOKEN=`
6. Reinicie o backend: `pm2 restart powerover-backend`

### 2.4 Configurar o Melhor Envio

**⚠️ PENDENTE: token atual está expirado**

**Como renovar o token:**
1. Acesse `melhorenvio.com.br/painel`
2. Vá em Integrações → Tokens de Acesso
3. Gere um novo token (selecione todos os escopos necessários: `cart-read`, `cart-write`, `shipping-calculate`)
4. Copie o token Bearer
5. No VPS: `nano /var/www/powerover-backend/.env` → linha `MELHORENVIO_TOKEN=`
6. Reinicie: `pm2 restart powerover-backend`

**CEP de Origem** (já configurado, verificar):
- Variável: `MELHORENVIO_CEP_ORIGEM` no `.env` do backend
- Deve ser o CEP do armazém em Petrópolis – RJ

### 2.5 Configurar Perfil de Envio (Shipping Profile)

Sem isso, os produtos não têm frete calculado no checkout.

**Caminho:** Admin → Settings → Shipping Profiles

1. Confirme que existe um perfil "Default Shipping Profile"
2. Se não existir: clique + Create → Name: "Peças Padrão" → Save
3. Os produtos precisam ser vinculados a este perfil (ver seção 3.7)

### 2.6 Configurar Opções de Frete

**Caminho:** Admin → Settings → Regions → Brazil → Shipping Options

As opções já configuradas:
| Nome | Preço | Tipo |
|------|-------|------|
| PAC | R$ 25,00 | Fixo (temporário) |
| SEDEX | R$ 45,00 | Fixo (temporário) |
| Retirada em Mãos | Grátis | Pickup |

> Quando o Melhor Envio estiver funcionando, o cálculo será dinâmico por CEP do cliente.

### 2.7 Criar Estoque Padrão

**Caminho:** Admin → Settings → Locations & Warehouses

1. Verifique se existe "Estoque Brasil – Petrópolis RJ"
2. Se não: + Add Location → Nome: "Estoque Brasil – Petrópolis RJ" → Endereço completo → Save
3. Vincule ao Sales Channel "Default Sales Channel"

---

## 3. Gestão de Produtos

### 3.1 Criar um Produto Novo

**Caminho:** Admin → Products → + Create Product

**Campos obrigatórios:**
- **Title:** Nome do produto (ex: "Kit Ângulo BMW E36 Completo")
- **Description:** Descrição técnica detalhada (materiais, compatibilidade, instruções básicas)
- **Thumbnail:** Foto principal (mínimo 800×800px, fundo branco ou neutro)

**Campos importantes para frete:**
- **Weight:** Peso em gramas (ex: 2500 para 2,5kg)
- **Height / Width / Length:** Dimensões em milímetros da embalagem
- **⚠️ Se não preencher:** o calculador de frete usará dimensões genéricas e o preço pode ser impreciso

**Campos de organização:**
- **Category:** Selecionar a categoria correta (Suspensão, Câmbio, Kit Ângulo...)
- **Collection:** Opcional — agrupa produtos em coleções temáticas
- **Tags:** Adicione `bmw` ou `chevette` para que os filtros de carro funcionem na loja

**Metadata especiais (campo avançado):**
- `promo_tag`: Texto que aparece como badge verde no card do produto
  - Exemplos: `Lançamento`, `Mais Vendido`, `Frete Grátis`, `Kit Completo`

### 3.2 Adicionar Variantes

Variantes são versões diferentes do mesmo produto (tamanho, cor, material).

**Exemplo:** Kit Ângulo pode ter variante "Completo" e "Só Braços"

**Caminho:** Na página do produto → aba Variants → + Add Variant

1. Defina o título da opção (ex: "Versão")
2. Adicione os valores (ex: "Completo", "Braços Avulsos")
3. Para cada variante: defina preço em BRL e SKU único

### 3.3 Definir Preços

**Dentro do produto → Variants → clique na variante**

1. Clique em "+ Add Price"
2. Selecione a região "Brazil"
3. Digite o valor em **reais** (ex: `1990.00` para R$ 1.990,00)
4. Save

> **Importante:** O sistema armazena em centavos internamente. A loja divide por 100 automaticamente. Sempre confira como aparece na vitrine após salvar.

### 3.4 Adicionar Imagens

**Caminho:** Página do produto → Media

- Clique em "Upload" e selecione as fotos
- Arraste para reordenar (a primeira é a thumbnail)
- Recomendado: mínimo 3 fotos (frontal, detalhe, instalada no carro)
- Formatos aceitos: JPG, PNG, WebP
- Tamanho recomendado: 1200×1200px

### 3.5 Publicar o Produto

Por padrão, produtos são criados como **rascunho** e não aparecem na loja.

**Para publicar:**
- Na página do produto → canto superior direito → status "Draft" → alterar para "Published"
- Ou na lista de produtos, marque e use a ação em lote "Publish"

### 3.6 Tags para Filtro de Carro

A loja tem filtro por carro (BMW E36 / Chevette). Para que funcione:

**Na página do produto → Tags:**
- Adicione `bmw` para produtos compatíveis com BMW E36
- Adicione `chevette` para produtos compatíveis com Chevette
- Produtos sem tag aparecem nos dois filtros

### 3.7 Vincular ao Perfil de Envio

**Caminho:** Página do produto → Shipping → Shipping Profile

- Selecione "Default Shipping Profile" (ou o perfil criado)
- **Se não vincular:** o produto pode não aparecer as opções de frete no checkout

### 3.8 Editar Produto Existente

**Caminho:** Admin → Products → clique no produto

- Todos os campos são editáveis
- Alterações são salvas individualmente por seção (botão "Save" em cada bloco)
- A publicação na loja é quase imediata (alguns segundos de cache)

### 3.9 Arquivar / Remover Produto

- Para tirar temporariamente da loja: mude status para "Draft"
- Para remover permanentemente: botão "Delete" (⚠️ não pode ser desfeito)

---

## 4. Gestão de Pedidos

### 4.1 Ver Pedidos

**Caminho:** Admin → Orders

A lista mostra:
- Número do pedido (`#PO-001`, etc.)
- Data e hora
- Cliente (nome e e-mail)
- Valor total
- Status do pedido
- Status do pagamento

**Filtros úteis:**
- Por status: Pendente, Processando, Enviado, Entregue, Cancelado
- Por data
- Por cliente

### 4.2 Status dos Pedidos

| Status | O que significa | O que fazer |
|--------|----------------|-------------|
| **Pending** | Aguardando pagamento | Aguardar confirmação do MercadoPago |
| **Processing** | Pagamento confirmado | Separar e embalar o produto |
| **Shipped** | Enviado | Registrar código de rastreio |
| **Delivered** | Entregue | Nenhuma ação necessária |
| **Canceled** | Cancelado | Verificar motivo, processar reembolso se necessário |
| **Requires Action** | Problema — atenção! | Abrir o pedido e verificar o alerta |

### 4.3 Processar um Pedido (passo a passo)

**Quando o pagamento é aprovado:**

1. Você receberá notificação (e-mail ou via admin)
2. Abra o pedido no admin
3. Verifique os itens, endereço de entrega e método de envio escolhido
4. **Separe e embale** o produto
5. **Gere a etiqueta** no Melhor Envio (acesse `melhorenvio.com.br/painel` com o CEP de destino do pedido)
6. **Poste** nos Correios ou transportadora
7. No admin → pedido → clique em "Mark as Shipped"
8. Insira o **código de rastreio** (ex: `AA123456789BR`)
9. Salve — o cliente receberá notificação automática (quando e-mail transacional estiver configurado)

### 4.4 Adicionar Código de Rastreio

**Caminho:** Admin → Orders → [pedido] → Fulfillments → Add Tracking Number

1. Digite o código de rastreio
2. Selecione a transportadora (Correios, JadLog, etc.)
3. Save

### 4.5 Cancelar um Pedido

**Caminho:** Admin → Orders → [pedido] → ... → Cancel Order

- Só é possível cancelar pedidos que **ainda não foram enviados**
- Após cancelamento, o reembolso deve ser processado manualmente no MercadoPago

### 4.6 Processar Reembolso

**Caminho:** Admin → Orders → [pedido] → Refund

1. Selecione os itens a reembolsar (total ou parcial)
2. Adicione o motivo
3. Clique em "Create Refund"
4. O Medusa tentará reembolsar automaticamente via MercadoPago
5. Confirme no painel do MercadoPago que o estorno foi processado

---

## 5. Clientes e Contas

### 5.1 Ver Clientes

**Caminho:** Admin → Customers

Lista de todos os clientes cadastrados com:
- Nome, e-mail
- Número de pedidos
- Valor total gasto
- Data de cadastro

### 5.2 Ver Detalhes do Cliente

Clique no cliente para ver:
- Informações de contato
- Endereços cadastrados
- Histórico de pedidos
- Segmentos de cliente

### 5.3 Criar Cliente Manualmente

**Caminho:** Admin → Customers → + Create Customer

Útil para cadastrar clientes que compram presencialmente ou por WhatsApp.

### 5.4 Grupos de Clientes

**Caminho:** Admin → Customers → Groups

Permite criar grupos para:
- Oferecer preços especiais (desconto de atacado)
- Segmentar comunicações
- Aplicar promoções específicas

---

## 6. Pagamentos — MercadoPago

### 6.1 Como Funciona o Fluxo de Pagamento

```
Cliente finaliza compra
        ↓
Loja cria preferência de pagamento no MercadoPago
        ↓
Cliente é redirecionado para pagar (cartão/Pix/boleto)
        ↓
MercadoPago notifica a loja via webhook
        ↓
Loja atualiza status do pedido para "Processing"
```

### 6.2 Verificar Pagamentos

Para confirmar se um pagamento foi aprovado:
1. **No admin:** Pedido → Payment → Status deve mostrar "Paid"
2. **No MercadoPago:** `painel.mercadopago.com.br` → Atividades

### 6.3 Testar Pagamentos (Sandbox)

Para testes sem dinheiro real:
1. Use o token de **teste** (não produção) no `.env`
2. Use os cartões de teste do MercadoPago: `4509 9535 6623 3704` (aprovado)
3. Em produção, **nunca use cartões de teste**

### 6.4 Pix via MercadoPago

O Pix é processado automaticamente pelo MercadoPago quando ativado. O cliente vê o QR Code na tela de pagamento. A confirmação é quase instantânea.

### 6.5 Problemas com Pagamento

**Pagamento não confirmado:**
- Verifique o webhook URL está correto no painel MercadoPago
- URL do webhook: `https://www.powerover.com.br/api/mercadopago/webhook` (ou conforme configurado)
- Verifique o `MERCADOPAGO_WEBHOOK_SECRET` no `.env`

---

## 7. Frete — Melhor Envio

### 7.1 Como Funciona

Quando o cliente insere o CEP na página do produto ou no checkout:
1. A loja chama a API do Melhor Envio com o CEP destino e as dimensões do produto
2. Melhor Envio retorna as opções disponíveis (PAC, SEDEX, transportadoras)
3. O cliente vê os preços e prazos reais

### 7.2 Calculadora na Página do Produto

A calculadora aparece na página de cada produto. Se mostrar erro "Erro ao consultar transportadoras":
- Verifique se o token está válido (seção 2.4)
- Verifique se o `MELHORENVIO_CEP_ORIGEM` está preenchido no `.env`

### 7.3 Preencher Dimensões dos Produtos

Para cálculo de frete preciso, cada produto precisa ter:
- **Peso** (weight): em gramas. Ex: 2500 = 2,5kg
- **Altura** (height): em milímetros. Ex: 50 = 5cm
- **Largura** (width): em milímetros. Ex: 150 = 15cm
- **Comprimento** (length): em milímetros. Ex: 300 = 30cm

**Sem essas informações:** o sistema usa valores padrão (300g, 5×15×20cm) que podem não refletir o frete real.

### 7.4 Gerar Etiquetas no Melhor Envio

Após vender:
1. Acesse `melhorenvio.com.br/painel`
2. Vá em Carrinho de Fretes → Adicionar ao Carrinho
3. Insira CEP origem (Petrópolis) e destino (endereço do pedido)
4. Selecione PAC ou SEDEX
5. Pague a etiqueta (débito em saldo do Melhor Envio)
6. Imprima e cole na embalagem

### 7.5 Recarregar Saldo no Melhor Envio

O Melhor Envio funciona com saldo pré-pago para etiquetas.
- Acesse `melhorenvio.com.br/painel` → Saldo → Adicionar Saldo
- Pague via Pix ou cartão

---

## 8. Estoque

### 8.1 Ver Estoque Atual

**Caminho:** Admin → Inventory

Lista todos os itens com:
- SKU do produto
- Quantidade em estoque
- Localização (estoque Petrópolis)

### 8.2 Atualizar Estoque

**Caminho:** Admin → Inventory → [item] → Manage Locations

1. Selecione o local (Estoque Brasil – Petrópolis RJ)
2. Altere a quantidade
3. Save

**Ou via produto:**
Admin → Products → [produto] → Variants → [variante] → Inventory

### 8.3 Alerta de Estoque Baixo

Por enquanto, o Medusa não envia alertas automáticos. Recomendação:
- Revise o estoque toda segunda-feira (ver checklist seção 12)
- Defina mentalmente o ponto de reposição para cada produto

### 8.4 Produto Fora de Estoque

Quando o estoque chega a 0:
- O botão "Adicionar ao Carrinho" é substituído por "Fora de Estoque" automaticamente
- O produto continua visível na loja (para SEO e wishlist)
- Para esconder: mude status para Draft

---

## 9. Categorias e Coleções

### 9.1 Diferença entre Categoria e Coleção

| Categoria | Coleção |
|-----------|---------|
| Organização permanente (Suspensão, Câmbio) | Agrupamento temático temporário |
| URL: `/categories/suspensao` | URL: `/collections/lancamentos-2026` |
| Hierárquica (pai/filho) | Plana |
| Filtro na sidebar da loja | Aparece no footer |

### 9.2 Criar Categoria

**Caminho:** Admin → Categories → + Create Category

1. **Name:** Nome que o cliente verá (ex: "Suspensão")
2. **Handle:** URL amigável, sem espaços (ex: `suspensao`) — gerado automaticamente
3. **Parent Category:** Deixe vazio para categoria principal, ou selecione pai para subcategoria
4. **Description:** Texto opcional que aparece no topo da página de categoria
5. **Status:** Active para aparecer na loja

**Categorias recomendadas para PowerOver:**
- Suspensão
  - Coilovers
  - Amortecedores
  - Molas
- Câmbio
  - Sequential
  - Dog Box
  - Alavancas
- Kit Ângulo
  - BMW E36
  - Chevette
- Peças Avulsas

### 9.3 Vincular Produto à Categoria

**Opção 1 — Via produto:**
Admin → Products → [produto] → Categories → selecione a categoria → Save

**Opção 2 — Via categoria:**
Admin → Categories → [categoria] → Products → Add Products

### 9.4 Criar Coleção

**Caminho:** Admin → Collections → + Create Collection

Exemplos de uso:
- "Lançamentos 2026"
- "Mais Vendidos"
- "Kits para Drift"

---

## 10. Configurações da Região e Impostos

### 10.1 Verificar Configuração da Região

**Caminho:** Admin → Settings → Regions → Brazil

Confirme:
- Currency: BRL
- Countries: BR
- Payment Providers: MercadoPago ativo
- Shipping Options: PAC, SEDEX, Retirada

### 10.2 Configurar Impostos

**Caminho:** Admin → Settings → Tax Regions → Brazil

Por padrão o sistema usa 0% (preço final já inclui impostos). Se precisar calcular impostos separados:
1. Adicione a alíquota (ex: 12% ICMS)
2. Defina se o imposto é inclusivo (já no preço) ou exclusivo (somado ao preço)

> Para MEI e pequenas empresas, é comum usar preço final sem imposto separado na loja.

---

## 11. Admin — Painel Completo

### 11.1 Navegação Principal

| Menu | O que faz |
|------|-----------|
| **Dashboard** | Visão geral — pedidos recentes, receita, estatísticas |
| **Orders** | Todos os pedidos — ver, processar, cancelar, reembolsar |
| **Products** | Catálogo completo — criar, editar, publicar produtos |
| **Categories** | Organização do catálogo |
| **Collections** | Grupos temáticos |
| **Customers** | Cadastro de clientes |
| **Inventory** | Controle de estoque |
| **Discounts** | Cupons e promoções |
| **Gift Cards** | Vales-presente |
| **Pricing** | Listas de preços especiais |
| **Settings** | Configurações gerais (regiões, envio, pagamento, usuários) |

### 11.2 Criar Desconto/Cupom

**Caminho:** Admin → Discounts → + Create Discount

**Tipos:**
- **Percentage:** Desconto em % (ex: 10% off)
- **Fixed Amount:** Valor fixo (ex: R$ 50 off)
- **Free Shipping:** Frete grátis

**Configurações:**
- **Code:** Código que o cliente digita (ex: `DRIFT10`)
- **Usage limit:** Quantidade máxima de usos
- **Valid dates:** Período de validade
- **Minimum cart value:** Valor mínimo do carrinho

### 11.3 Criar Usuário Admin

**Caminho:** Admin → Settings → Users → + Invite User

- Insira o e-mail do novo usuário
- O usuário receberá um e-mail para definir senha
- Papel disponível: Member (acesso total ao admin)

### 11.4 Chave de API Pública (Publishable Key)

Usada pelo storefront para se comunicar com o backend.

**Caminho:** Admin → Settings → API Key Management

- Guarde a chave `pk_...`
- Ela deve estar em `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` no `.env` do storefront

---

## 12. Operação Diária (Checklist)

### Rotina Diária (toda manhã)

```
[ ] Abrir Admin → Orders → filtrar por "Pending" (aguardando pagamento)
[ ] Para cada pedido pago: separar produto, gerar etiqueta, postar
[ ] Marcar pedidos como "Shipped" e inserir código de rastreio
[ ] Verificar se há mensagens no formulário de contato (/contato)
[ ] Verificar saldo do Melhor Envio (repor se necessário)
```

### Rotina Semanal (toda segunda-feira)

```
[ ] Revisar estoque de todos os produtos no Admin → Inventory
[ ] Repor produtos com estoque < 3 unidades
[ ] Verificar produtos "Pending" há mais de 48h (possível problema de pagamento)
[ ] Checar métricas: receita da semana, produtos mais vendidos
[ ] Atualizar fotos ou descrições de produtos se necessário
```

### Rotina Mensal

```
[ ] Exportar relatório de pedidos (Admin → Orders → Export)
[ ] Conferir conciliação com extrato MercadoPago
[ ] Revisar preços dos produtos (ajuste por custo, câmbio, concorrência)
[ ] Atualizar badge de promoção (metadata.promo_tag) em produtos em destaque
[ ] Verificar token do Melhor Envio (expira periodicamente)
```

---

## 13. Deploy e Manutenção do Servidor

> **⚠️ Esta seção é técnica — normalmente executada pelo desenvolvedor**

### 13.1 Acessar o Servidor

```bash
ssh root@76.13.225.174
# Senha: Fg8L?6EpWBYwh5qD7#
```

### 13.2 Verificar Status dos Serviços

```bash
pm2 status
# Deve mostrar:
# powerover-backend   → online
# powerover-storefront → online
```

### 13.3 Ver Logs em Tempo Real

```bash
# Logs do backend (Medusa)
pm2 logs powerover-backend

# Logs do storefront (Next.js)
pm2 logs powerover-storefront
```

### 13.4 Reiniciar Serviços

```bash
# Reiniciar backend (após mudar .env)
pm2 restart powerover-backend

# Reiniciar storefront
pm2 restart powerover-storefront

# Reiniciar tudo
pm2 restart all
```

### 13.5 Atualizar Variáveis de Ambiente

As variáveis de ambiente ficam no arquivo `.env` de cada serviço:

```bash
# Backend
nano /var/www/powerover-backend/.env

# Storefront
nano /var/www/powerover-storefront/.env
```

Após editar, sempre reinicie o serviço correspondente.

### 13.6 Variáveis de Ambiente Importantes

**Backend (`/var/www/powerover-backend/.env`):**
```
DATABASE_URL=            # URL do Supabase (não alterar)
MERCADOPAGO_ACCESS_TOKEN= # Token de produção do MercadoPago
MERCADOPAGO_WEBHOOK_SECRET= # Secret do webhook
MELHORENVIO_TOKEN=       # Bearer token do Melhor Envio
MELHORENVIO_CEP_ORIGEM=  # CEP do armazém (Petrópolis)
STORE_CORS=              # Domínios permitidos para a loja
ADMIN_CORS=              # Domínios permitidos para o admin
JWT_SECRET=              # Secret para tokens de autenticação
```

**Storefront (`/var/www/powerover-storefront/.env`):**
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=  # URL do backend (http://76.13.225.174:9000)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY= # Chave pública do admin
NEXT_PUBLIC_BASE_URL=    # URL pública da loja
NODE_ENV=production
```

### 13.7 Deploy de Nova Versão do Storefront

```bash
# No computador local (na pasta do projeto)
cd /Users/[usuario]/www/poweroverloja/backend/apps/storefront

# Build
npm run build

# Enviar para o servidor
rsync -avz --delete .next/ root@76.13.225.174:/var/www/powerover-storefront/.next/
rsync -avz public/ root@76.13.225.174:/var/www/powerover-storefront/public/
rsync -avz next.config.js root@76.13.225.174:/var/www/powerover-storefront/

# Reiniciar no servidor
ssh root@76.13.225.174 "pm2 restart powerover-storefront"
```

### 13.8 Backup do Banco de Dados

O banco de dados fica no Supabase (nuvem). Para fazer backup manual:
1. Acesse `app.supabase.com`
2. Selecione o projeto PowerOver
3. Settings → Database → Backups
4. Clique em "Download Backup"

---

## 14. Troubleshooting — Problemas Comuns

### "Produto não aparece na loja"

**Verificar:**
1. Admin → Products → Status do produto é "Published"? (não Draft)
2. O produto está vinculado ao Sales Channel correto?
   - Admin → Products → [produto] → Sales Channels → deve incluir "Default Sales Channel"
3. Há erros no console do servidor? `pm2 logs powerover-storefront`

### "Frete não calcula / mostra erro"

**Verificar:**
1. Token do Melhor Envio válido? Teste: `curl -H "Authorization: Bearer SEU_TOKEN" https://melhorenvio.com.br/api/v2/me/shipment/calculate`
2. Se retornar `{"message":"Unauthenticated."}` → token expirado → renovar (seção 2.4)
3. CEP de origem preenchido? `MELHORENVIO_CEP_ORIGEM` no `.env`

### "Pagamento não funciona"

**Verificar:**
1. Token MercadoPago é de PRODUÇÃO (não sandbox)?
2. MercadoPago está ativado na região Brasil? (Admin → Settings → Regions → Brazil → Payment Providers)
3. Há erros no log? `pm2 logs powerover-backend | grep -i mercado`

### "Cliente não consegue se cadastrar ou fazer login"

**Verificar:**
1. CORS configurado? O domínio `https://www.powerover.com.br` está em `AUTH_CORS` no `.env` do backend?
2. Reiniciar backend: `pm2 restart powerover-backend`

### "Imagens dos produtos não aparecem"

**Verificar:**
1. A URL da imagem está no formato `http://76.13.225.174:9000/...`?
2. O `next.config.js` tem o hostname `76.13.225.174` na lista de imagens permitidas?
3. O backend está online? `pm2 status`

### "Admin inacessível"

```bash
ssh root@76.13.225.174
pm2 status
# Se powerover-backend está offline:
pm2 start powerover-backend
# Verifique logs de erro:
pm2 logs powerover-backend --lines 50
```

### "Loja fora do ar"

```bash
ssh root@76.13.225.174
pm2 status
# Se powerover-storefront está offline:
pm2 start powerover-storefront
pm2 logs powerover-storefront --lines 50
```

### "Preço aparece errado na loja"

- Verifique o preço no admin — está em BRL? (ex: `1990.00` = R$1.990,00)
- O sistema armazena em centavos internamente. Se salvou `199000` ao invés de `1990`, o preço exibido será R$199.000,00

---

## 15. Glossário Técnico

| Termo | Significado |
|-------|-------------|
| **Admin** | Painel de controle da loja — onde você gerencia tudo |
| **API** | Interface de comunicação entre o backend e o storefront |
| **Backend** | O servidor "invisível" que guarda os dados (Medusa.js) |
| **Storefront** | O site que o cliente vê (Next.js) |
| **SKU** | Código único que identifica cada produto/variante |
| **Sales Channel** | Canal de vendas — a loja online tem um canal padrão |
| **Region** | Configuração de moeda, impostos e países atendidos |
| **Shipping Profile** | Perfil de envio que define quais opções de frete um produto tem |
| **Fulfillment** | O processo de separar, embalar e enviar um pedido |
| **Webhook** | Notificação automática que o MercadoPago envia quando um pagamento é aprovado |
| **CORS** | Configuração de segurança que define quais domínios podem acessar a API |
| **PM2** | Gerenciador de processos no servidor — mantém os serviços rodando |
| **VPS** | Servidor virtual privado onde a loja está hospedada |
| **CEP de Origem** | CEP do armazém — ponto de partida para cálculo de frete |
| **Bearer Token** | Chave de acesso para APIs externas (Melhor Envio, MercadoPago) |
| **`.env`** | Arquivo de configuração com senhas e tokens — nunca compartilhe |
| **Draft** | Produto rascunho — não visível na loja |
| **Published** | Produto publicado — visível na loja |
| **Variant** | Variação de um produto (tamanho, cor, versão) |
| **Metadata** | Informações extras que você pode adicionar a produtos (ex: `promo_tag`) |
| **LGPD** | Lei Geral de Proteção de Dados — lei brasileira de privacidade |
| **CDC** | Código de Defesa do Consumidor — lei que rege trocas e devoluções |

---

## Apêndice A — Contatos Úteis

| Serviço | Site | Para quê |
|---------|------|----------|
| **Supabase** | app.supabase.com | Banco de dados, backups |
| **MercadoPago** | painel.mercadopago.com.br | Pagamentos, estornos, credenciais |
| **Melhor Envio** | melhorenvio.com.br/painel | Fretes, etiquetas, saldo, tokens |
| **Hostinger/VPS** | hpanel.hostinger.com | Servidor, DNS, renovação |
| **Desenvolvedor** | dyego@efkz.com.br | Suporte técnico |

---

## Apêndice B — Roteiro para Vídeos Tutoriais

### Vídeo 1 — "Como adicionar um produto" (5-8 min)
1. Abrir admin, ir em Products
2. Clicar + Create Product
3. Preencher título, descrição, preço
4. Fazer upload de fotos
5. Definir peso e dimensões
6. Adicionar tag do carro (bmw ou chevette)
7. Vincular à categoria
8. Publicar
9. Conferir como aparece na loja

### Vídeo 2 — "Como processar um pedido" (5-7 min)
1. Mostrar notificação de pedido novo
2. Abrir o pedido no admin
3. Verificar dados do cliente e endereço
4. Gerar etiqueta no Melhor Envio
5. Embalar e postar
6. Marcar como enviado + inserir código de rastreio
7. Mostrar que o cliente recebe notificação

### Vídeo 3 — "Como atualizar o estoque" (3-4 min)
1. Admin → Inventory
2. Encontrar o produto
3. Atualizar quantidade
4. Mostrar como aparece "Fora de Estoque" na loja

### Vídeo 4 — "Como criar um cupom de desconto" (4-5 min)
1. Admin → Discounts → + Create
2. Definir tipo (% ou valor fixo)
3. Criar código personalizado
4. Definir validade e limite de uso
5. Testar o cupom na loja

### Vídeo 5 — "Configuração inicial completa" (15-20 min)
1. Primeiro acesso ao admin
2. Configurar região Brasil e moeda BRL
3. Adicionar token MercadoPago
4. Adicionar token Melhor Envio
5. Criar perfil de envio
6. Criar primeiro produto
7. Fazer um pedido teste

---

*Documento gerado em 2026-06-14 — PowerOver Motorsports · Desenvolvido por Dyego / Coletivo Efkz!*
*Para atualizar este documento, contate o desenvolvedor ou edite diretamente o arquivo `CENTRAL-DE-AJUDA.md` na raiz do projeto.*
