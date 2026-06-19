# Instruções para Agentes IA - Site de Casamento Ana & João

## Visão Geral

Este é um site estático e funcional para gerenciar uma loja de presentes de casamento. O site foi criado para o casamento de Ana e João com tema de convite elegante com motivos florais verdes.

**Stack**: HTML puro + CSS vanilla + JavaScript vanilla (sem frameworks)
**Hospedagem**: Arquivos estáticos apenas - abra `index.html` no navegador
**Objetivo**: Permitir que convidados comprem presentes simbólicos e escolham pagamento via PIX ou cartão

---

## Estrutura do Projeto

```
ana-e-joao/
├── index.html          # Estrutura HTML com todas as seções
├── styles.css          # Estilo visual, tema e layout responsivo
├── script.js           # Lógica de carrinho, checkout, interatividade
└── images/             # Fotos do casal (capa.JPG) e placeholder
```

### Seções Principais (index.html)

- **Header**: Navegação sticky com marca A&J e botão carrinho
- **Hero**: Foto grande do casal, títulos em Biro Script Plus, data e local
- **Sobre**: Pequena história do casal e detalhes do evento
- **Presentes**: Grid de 6 itens simbólicos com preços
- **Carrinho**: Painel deslizante (drawer) para revisar seleções
- **Checkout**: Modal com opções PIX (com QR code gerado) e cartão de crédito
- **RSVP/FAQ**: Confirmação de presença e perguntas frequentes
- **Rodapé**: Mensagem de agradecimento

---

## Design & Tema Visual

### Paleta de Cores
```css
--primary: #1f4d1f          /* Verde floresta - destaque principal */
--bg: #ebe9e3               /* Bege claro - fundo */
--text: #2d3d2d             /* Verde escuro para textos */
--text-muted: #5a6d5a       /* Verde médio para textos secundários */
--secondary: #d4e4d0        /* Verde claro - fundos suaves */
--accent: #2d6d2d           /* Verde médio - acentos */
```

### Tipografia
- **Títulos (h1, h2, h3, h4)**: `Biro Script Plus` - fonte decorativa de assinatura
- **Corpo e UI**: `Cormorant Garamond` - serifada elegante
- **Ambas**: Importadas via Google Fonts

### Responsividade
- Breakpoint principal: 920px (reduz grid about)
- Breakpoint mobile: 720px (layout vertical, header em coluna)
- Drawer do carrinho ocupa 100% em mobile

---

## Funcionalidades Principais

### 1. Carrinho de Compras (`script.js`)

**Estrutura de dados**:
```javascript
const cart = {
  "product-id": {
    id: "product-id",
    name: "Nome",
    price: 123.45,
    quantity: 1
  }
}
```

**Funções principais**:
- `addToCart(productId)` - adiciona ao carrinho e abre drawer
- `changeQuantity(productId, action)` - incrementa/decrementa/remove
- `calculateTotal()` - soma preço × quantidade
- `updateCartCount()` - atualiza badge de itens

### 2. Checkout

**Opções de Pagamento**:
- **PIX**: Exibe chave PIX, gera QR code simples, total em reais
  - Função: `drawPixQrCode(total)` - cria SVG simulado de QR
  - Confirmação mostra mensagem de sucesso
- **Cartão**: Formulário com campos Nome, Número, Validade, CVC
  - Validação básica (campos preenchidos)
  - Mensagem de sucesso ao confirmar

**Fluxo**:
1. Clique em "Finalizar compra" → abre modal
2. Escolhe método (PIX ou cartão via radio button)
3. Preenche dados ou confirma PIX
4. Modal de sucesso, carrinho é esvaziado

### 3. Produtos

**Array de produtos** (linha 1-35 de `script.js`):
- Cada produto tem: `id`, `name`, `price`, `description`
- Renderizado no grid via `renderProducts()`
- Para adicionar: inserir novo objeto no array e recarregar página

---

## Como Fazer Mudanças Comuns

### ✏️ Adicionar um novo presente
1. Abra `script.js`
2. No array `products`, adicione um novo objeto:
   ```javascript
   {
     id: "id-unico",
     name: "Nome do Presente",
     price: 150.0,
     description: "Descrição breve do que é o presente."
   }
   ```
3. Salve e recarregue a página

### 📝 Editar textos (hero, seções, etc)
- Abra `index.html` e edite diretamente o conteúdo das tags
- Títulos usam `<h1>`, `<h2>`, etc
- Exemplo: trocar "O casamento de Ana & João" no hero

### 🎨 Ajustar cores
- Abra `styles.css` no topo (`:root`)
- Altere as variáveis `--primary`, `--bg`, etc
- Todas as cores são CSS custom properties para fácil manutenção

### 📦 Trocar foto do casal
- Coloque nova imagem em `images/`
- Em `index.html`, mude o `src` da imagem hero:
  ```html
  <img src="images/nova-foto.jpg" alt="Foto do casal" />
  ```

### 🔗 Mudar data ou local do casamento
- Edite as ocorrências em `index.html`:
  - `<p class="brand-subtitle">` no header
  - `<span>` dentro de `.hero-meta`
  - Seção "Sobre" em `<strong>Data</strong>` e `<strong>Local</strong>`

### 💾 Integrar PIX/Cartão Real
- Função `confirmPixPayment()` (linha ~235): integrar com Mercado Pago, Stripe, etc
- Função `confirmCardPayment()` (linha ~243): validar e enviar para gateway
- Atualmente são fluxos simulados que mostram sucesso

---

## Convenções de Código

### Classes CSS
- `.section` - container das seções principais
- `.product-card` - card individual de produto
- `.cart-panel` - drawer do carrinho
- `.button-primary` / `.button-secondary` - botões
- `.hidden` - classe para esconder elementos (`display: none`)
- `.open` - classe para mostrar painel de carrinho

### IDs JavaScript (para seletores)
- `#cartButton` - botão do carrinho no header
- `#cartPanel` - drawer
- `#checkoutModal` - modal de pagamento
- `#productsGrid` - container dos produtos
- `#pixSection` / `#cardForm` - seções de pagamento

### Padrões de Evento
- Click em produtos → `addToCart()`
- Click em botões de quantidade → `changeQuantity()`
- Click em "Finalizar compra" → `openCheckout()`
- Mudança de radio button (PIX/Cartão) → `handlePaymentSelection()`

---

## Checklist para Novas Funcionalidades

Ao adicionar features, verifique:

- [ ] Testou em desktop (1200px+) e mobile (< 720px)?
- [ ] Mantém a paleta de cores verde/bege?
- [ ] Usa `Biro Script Plus` para títulos e `Cormorant Garamond` para corpo?
- [ ] CSS está bem organizado com media queries?
- [ ] Nomes de classes/IDs seguem convenção `.kebab-case`?
- [ ] Validações de formulário (se houver) dão feedback visual?
- [ ] Atualizações de total/quantidade são reativas no DOM?

---

## Próximas Melhorias Sugeridas

1. **Persistência**: Guardar carrinho em `localStorage` para não perder ao recarregar
2. **Backend**: Integrar API real para processar pagamentos PIX e cartão
3. **Admin**: Painel para gerenciar produtos, preços e pedidos
4. **Email**: Enviar confirmação de compra para o casal
5. **Analytics**: Rastrear cliques, adições ao carrinho, checkouts completos
6. **Countdown**: Timer até o casamento na seção hero
7. **Galeria**: Mais fotos do casal em slideshow
8. **Mapa**: Localização do evento no Google Maps

---

## Links Úteis

- Cores tema: Verde `#1f4d1f`, Bege `#ebe9e3`
- Fontes: [Google Fonts - Biro Script Plus](https://fonts.google.com/?query=biro), [Cormorant Garamond](https://fonts.google.com/?query=cormorant+garamond)
- Documentação HTML/CSS/JS: [MDN Web Docs](https://developer.mozilla.org)
