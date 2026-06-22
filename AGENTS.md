# Instruções para Agentes IA - Site de Casamento Ana & João

## Visão Geral

Site estático para loja de presentes de casamento. Tema elegante com motivos florais verdes.

**Stack**: HTML + CSS + JavaScript vanilla
**Hospedagem**: Arquivos estáticos — abra `index.html` no navegador

---

## Estrutura do Projeto

```
ana-e-joao/
├── index.html       # Estrutura HTML com todas as seções
├── styles.css       # Estilo visual completo (com overrides incorporados)
├── script.js        # Lógica de carrinho, checkout, interatividade
├── AGENTS.md        # Este arquivo
├── fonts/           # Fontes locais (Revive80Signature, Quick Signature)
└── images/          # Fotos do casal, ícones, ilustrações
```

### Seções Principais (index.html)

- **Header**: Navegação sticky
- **Hero**: Foto do casal, títulos, countdown, data
- **Sobre**: História do casal
- **Localização**: Endereço, mapa, trajes, horários
- **Presentes**: Grid de 25 itens simbólicos com preços
- **Carrinho**: Drawer deslizante com quantidades e total
- **Checkout**: Modal PIX com QR code dinâmico e chave copiável
- **RSVP**: Confirmação via WhatsApp
- **FAQ**: Accordion de perguntas frequentes
- **Rodapé**: Agradecimento

---

## Design & Tema Visual

### Paleta de Cores
```css
--primary: #1f4d1f       /* Verde floresta */
--bg: #ebe9e3            /* Bege claro */
--text: #2d3d2d          /* Verde escuro */
--text-muted: #5a6d5a    /* Verde médio */
--secondary: #d4e4d0     /* Verde claro */
--accent: #2d6d2d        /* Verde médio */
```

### Tipografia
- **Títulos principais**: `Revive80Signature` (fonte local em `fonts/`)
- **Títulos secundários**: `Cormorant Garamond` (Google Fonts)
- **Corpo**: `Cormorant Garamond`
- **Fallback**: `Great Vibes` (Google Fonts)

### Responsividade
- Breakpoint: 920px (layout tablets)
- Breakpoint: 720px (mobile)

---

## Funcionalidades Principais

### Carrinho (`script.js`)
- Carrinho em objeto `{ id: { id, name, price, quantity } }`
- Persistência via `localStorage`
- Funções: `addToCart()`, `changeQuantity()`, `calculateTotal()`, `renderCart()`

### Checkout PIX
- Gera payload EMV PIX com CRC16
- QR code via `api.qrserver.com`
- Copiar chave PIX com feedback visual
- Envio do pedido por WhatsApp
- Chave PIX: `09723193957`

### Produtos
- Array `products` com 25 itens
- Renderizados em grid via `renderProducts()`
- 5 colunas em desktop, 3 em tablet, 2 em mobile

---

## Convenções de Código

### Classes CSS
- `.section` — container de seções
- `.product-card` — card de produto
- `.cart-panel` — drawer do carrinho
- `.button-primary` / `.button-secondary` — botões
- `.hidden` — `display: none`
- `.open` / `.active` — estados visuais

### IDs JavaScript
- `#cartButton`, `#cartPanel`, `#checkoutModal`, `#productsGrid`, `#pixSection`

---

## Checklist para Novas Funcionalidades

- [ ] Testou em desktop (1200px+) e mobile (< 720px)?
- [ ] Mantém a paleta de cores verde/bege?
- [ ] Usa `Revive80Signature` para títulos e `Cormorant Garamond` para corpo?
- [ ] Nomes de classes/IDs seguem `.kebab-case`?
- [ ] Validações de formulário dão feedback visual?
- [ ] Atualizações de total/quantidade são reativas no DOM?

---

## Chave PIX

**Chave:** `09723193957`  
Atualizar em: `index.html` (span#pixKey) e `script.js` (fallback em `updatePixSection`)
