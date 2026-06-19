const products = [
  {
    id: "champagne",
    name: "Brinde de Champagne",
    price: 180.0,
    description: "Nos ajude a celebrar com um brinde elegante após a cerimônia.",
  },
  {
    id: "jantar",
    name: "Jantar romântico",
    price: 260.0,
    description: "Contribua para a experiência gastronômica especial do casal.",
  },
  {
    id: "decoracao",
    name: "Decoração floral",
    price: 220.0,
    description: "Ajude a compor o cenário com flores, velas e luz suave.",
  },
  {
    id: "lua",
    name: "Lua de mel",
    price: 540.0,
    description: "Um gesto para deixar a lua de mel ainda mais inesquecível.",
  },
  {
    id: "casahref",
    name: "Lar dos sonhos",
    price: 320.0,
    description: "Contribuição para mobiliar o novo lar com carinho.",
  },
  {
    id: "gastronomia",
    name: "Experiência gastronômica",
    price: 210.0,
    description: "Ajude a reservar uma experiência culinária exclusiva para o casal.",
  },
];

const cart = {};
try {
  const saved = JSON.parse(localStorage.getItem("wedding_cart"));
  if (saved && typeof saved === "object") {
    Object.assign(cart, saved);
  }
} catch (e) {
  console.error("Error loading cart from localStorage", e);
}

function saveCart() {
  localStorage.setItem("wedding_cart", JSON.stringify(cart));
}

const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const cartButton = document.getElementById("cartButton");
const closeCartButton = document.getElementById("closeCartButton");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutModal = document.getElementById("checkoutModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalButton = document.getElementById("closeModalButton");
const checkoutHeaderTitle = document.querySelector(".checkout-header h3");
const pixSection = document.getElementById("pixSection");
const pixTotal = document.getElementById("pixTotal");
const pixQrImage = document.getElementById("pixQrImage");
const confirmPixButton = document.getElementById("confirmPixButton");
const sendWhatsAppButton = document.getElementById("sendWhatsAppButton");
const successMessage = document.getElementById("successMessage");
const closeSuccessButton = document.getElementById("closeSuccessButton");

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function renderProducts() {
  productsGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <span class="price">${formatCurrency(product.price)}</span>
        <button type="button" data-product-id="${product.id}">Adicionar ao carrinho</button>
      </article>
    `
    )
    .join("");
}

function updateCartCount() {
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function calculateTotal() {
  return Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const items = Object.values(cart);
  if (items.length === 0) {
    cartItems.innerHTML = '<p class="empty-state">Seu carrinho está vazio. Adicione um presente para continuar.</p>';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  cartItems.innerHTML = items
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <div class="item-meta">
            <span>${formatCurrency(item.price)}</span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
          </div>
          <div class="quantity-controls">
            <button type="button" data-action="decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-id="${item.id}">+</button>
          </div>
        </div>
        <button type="button" data-action="remove" data-id="${item.id}" class="close-button">×</button>
      </div>
    `
    )
    .join("");

  cartTotal.textContent = formatCurrency(calculateTotal());
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  if (!cart[productId]) {
    cart[productId] = { ...product, quantity: 0 };
  }
  cart[productId].quantity += 1;
  updateCartCount();
  renderCart();
  saveCart();
  openCart();
}

function changeQuantity(productId, action) {
  if (!cart[productId]) return;

  if (action === "increase") {
    cart[productId].quantity += 1;
  }
  if (action === "decrease") {
    cart[productId].quantity -= 1;
  }
  if (action === "remove" || cart[productId].quantity <= 0) {
    delete cart[productId];
  }

  updateCartCount();
  renderCart();
  saveCart();
}

function openCart() {
  cartPanel.classList.add("open");
  modalBackdrop.classList.add("active");
}

function closeCart() {
  cartPanel.classList.remove("open");
  if (!checkoutModal.classList.contains("active")) {
    modalBackdrop.classList.remove("active");
  }
}

function openCheckout() {
  if (Object.values(cart).length === 0) {
    alert("Adicione pelo menos um presente ao carrinho antes de finalizar.");
    return;
  }
  checkoutModal.classList.add("active");
  modalBackdrop.classList.add("active");
  checkoutModal.setAttribute("aria-hidden", "false");
  updatePixSection();
  successMessage.classList.add("hidden");
  pixSection.classList.remove("hidden");
  
  if (checkoutHeaderTitle) {
    checkoutHeaderTitle.textContent = "Pagamento via PIX";
  }
}

function closeCheckout() {
  checkoutModal.classList.remove("active");
  checkoutModal.setAttribute("aria-hidden", "true");
  if (!cartPanel.classList.contains("open")) {
    modalBackdrop.classList.remove("active");
  }
}

function updatePixSection() {
  const total = calculateTotal();
  pixTotal.textContent = formatCurrency(total);
  // Use static QR image; no per-value QR generation
  if (pixQrImage) {
    pixQrImage.style.display = 'block';
  }
}

// remove drawPixQrCode - static image used


function confirmPixPayment() {
  showSuccessMessage("PIX", calculateTotal());
}

function buildOrderText() {
  const items = Object.values(cart);
  if (items.length === 0) return "";
  const lines = items.map(item => `- ${item.name} x${item.quantity} (${formatCurrency(item.price * item.quantity)})`);
  const total = formatCurrency(calculateTotal());
  const pixKey = document.getElementById("pixKey").textContent.trim();
  const message = `Olá Ana & João - Pedido:\n${lines.join("\n")}\nTotal: ${total}\nChave PIX: ${pixKey}\n\nEnviei comprovante aqui assim que pagar. Obrigado!`;
  return message;
}

function sendOrderWhatsApp() {
  const number = '5541997273744'; // número fornecido
  const text = buildOrderText();
  if (!text) {
    alert('Adicione pelo menos um item ao carrinho antes de enviar por WhatsApp.');
    return;
  }
  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function confirmCardPayment() {
  const name = document.getElementById("cardName").value.trim();
  const number = document.getElementById("cardNumber").value.trim();
  const expiry = document.getElementById("cardExpiry").value.trim();
  const cvc = document.getElementById("cardCvc").value.trim();

  if (!name || !number || !expiry || !cvc) {
    alert("Preencha todos os dados do cartão para continuar.");
    return;
  }

  showSuccessMessage("cartão", calculateTotal());
}

function showSuccessMessage(method, total) {
  const totalInfo = formatCurrency(total);
  successMessage.querySelector("h4").textContent = "Obrigado!";
  successMessage.querySelector("p").textContent = `Seu presente via ${method} no valor de ${totalInfo} foi registrado. Muito obrigado por estar conosco.`;
  pixSection.classList.add("hidden");
  cardForm.classList.add("hidden");
  
  if (paymentOptionsContainer) {
    paymentOptionsContainer.classList.add("hidden");
  }
  if (checkoutHeaderTitle) {
    checkoutHeaderTitle.textContent = "Pagamento Confirmado!";
  }
  
  successMessage.classList.remove("hidden");
  clearCart();
}

function clearCart() {
  for (const key in cart) {
    delete cart[key];
  }
  updateCartCount();
  renderCart();
  saveCart();
}

function handleWindowScroll() {
  const backToTopButton = document.getElementById("backToTopButton");
  if (!backToTopButton) return;
  if (window.scrollY > 300) {
    backToTopButton.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
  }
}

function initializeEvents() {
  productsGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-product-id]");
    if (!button) return;
    addToCart(button.dataset.productId);
  });

  cartItems.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) return;
    const id = actionButton.dataset.id;
    const action = actionButton.dataset.action;
    changeQuantity(id, action);
  });

  cartButton.addEventListener("click", openCart);
  closeCartButton.addEventListener("click", closeCart);
  checkoutButton.addEventListener("click", openCheckout);
  closeModalButton.addEventListener("click", closeCheckout);
  
  modalBackdrop.addEventListener("click", () => {
    closeCheckout();
    closeCart();
  });
  
  checkoutModal.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
      closeCheckout();
    }
  });

  const copyPixKeyButton = document.getElementById("copyPixKeyButton");
  if (copyPixKeyButton) {
    copyPixKeyButton.addEventListener("click", () => {
      const keyText = document.getElementById("pixKey").textContent;
      navigator.clipboard.writeText(keyText).then(() => {
        const originalText = copyPixKeyButton.textContent;
        copyPixKeyButton.textContent = "Copiado!";
        copyPixKeyButton.style.background = "var(--secondary)";
        setTimeout(() => {
          copyPixKeyButton.textContent = originalText;
          copyPixKeyButton.style.background = "";
        }, 2000);
      }).catch(err => {
        console.error("Failed to copy key: ", err);
      });
    });
  }

  const backToTopButton = document.getElementById("backToTopButton");
  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  window.addEventListener("scroll", handleWindowScroll);
  confirmPixButton.addEventListener("click", confirmPixPayment);
  if (sendWhatsAppButton) {
    sendWhatsAppButton.addEventListener('click', sendOrderWhatsApp);
  }
  closeSuccessButton.addEventListener("click", closeCheckout);
}

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

renderProducts();
updateCartCount();
renderCart();
initializeEvents();
