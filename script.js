const products = [
  { id: 'conjunto-panelas', name: 'Conjunto de panelas', price: 349.00, description: 'Para fazer as marmitas da semana' },
  { id: 'kitchenaid', name: 'Kitchenaid', price: 288.00, description: 'Cota para o noivo ter a tão sonhada Batedeira orbital da Kitchenaid' },
  { id: 'passagem-argentina', name: 'Passagem para Argentina', price: 563.00, description: 'Para que os noivos não precisem ir de carona' },
  { id: 'aliancas', name: 'Alianças de Casamento', price: 178.00, description: 'Ajude no símbolo da nossa união' },
  { id: 'lava-seca', name: 'Lava e seca', price: 290.00, description: 'Cota para a noiva ter a tão sonhada Lava e seca' },
  { id: 'aquecedor', name: 'Aquecedor', price: 124.00, description: 'Contra o frio de Curitiba' },
  { id: 'cobertor', name: 'Cobertor', price: 159.00, description: 'Para a noiva que está sempre coberta de razão' },
  { id: 'primeiro-lugar-fila', name: 'Primeiro lugar na fila', price: 411.00, description: 'Privilégio de se servir por primeiro no buffet do casamento' },
  { id: 'sorte-no-amor', name: 'Sorte no amor', price: 99.00, description: 'Lugar prioritário para pegar o buquê da noiva' },
  { id: 'luminaria', name: 'Luminária', price: 197.00, description: 'Abajur para sala de estar' },
  { id: 'aspirador-robo', name: 'Aspirador robô', price: 280.00, description: 'Diminua as crises de rinite do noivo' },
  { id: 'limpador-vapor', name: 'Limpador a vapor', price: 155.00, description: 'Garanta a limpeza do nosso box' },
  { id: 'cozinha-nova', name: 'Cozinha nova', price: 299.00, description: 'Cota para reformar nossa cozinha' },
  { id: 'geladeira', name: 'Geladeira', price: 699.00, description: 'Cota para garantir a cerveja gelada para as visitas' },
  { id: 'ingresso-orquestra', name: 'Ingresso para Orquestra', price: 396.00, description: 'Espetáculo da Orquestra de Buenos Aires no Teatro Colón' },
  { id: 'show-tango', name: 'Show de Tango', price: 530.00, description: 'Jantar, open bar e show de tango argentino' },
  { id: 'viagem-salta', name: 'Viagem em Salta', price: 255.00, description: 'Visita ao deserto de Sal na Argentina' },
  { id: 'passeio-unico', name: 'Passeio único', price: 355.00, description: 'Passeio para Colina de 14 cores na Argentina' },
  { id: 'bons-vinhos', name: 'Bons vinhos', price: 210.00, description: 'Degustação em vinícola argentina' },
  { id: 'delta-del-tigre', name: 'Delta del Tigre', price: 335.00, description: 'Passeio de barco por Buenos Aires' },
  { id: 'jantar-romantico', name: 'Jantar Romântico', price: 370.00, description: 'Jantar romântico na primeira noite de lua de mel' },
  { id: 'bons-drinks', name: 'Bons drinks', price: 102.00, description: 'Drinks em Puerto Madero' },
  { id: 'visita-museu', name: 'Visita ao Museu', price: 115.00, description: 'Ingresso pra ver o Abaporu no MALBA' },
  { id: 'visita-bombonera', name: 'Visita a La Bombonera', price: 202.00, description: 'Ingressos para conhecer o estádio e secar os hermanos' },
  { id: 'cafe-da-tarde', name: 'Café da Tarde', price: 108.00, description: 'Empanadas argentinas e café' }
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
const guestNameInput = document.getElementById("guestName");

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
        <button type="button" data-product-id="${product.id}" class="add-to-cart-btn">Adicionar</button>
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
  if (guestNameInput) guestNameInput.value = "";
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

// Helper: TLV builder
function tlv(id, value){
  const v = String(value);
  const len = String(v.length).padStart(2,'0');
  return id + len + v;
}

// CRC16-CCITT (XModem/CCITT-FALSE) with poly 0x1021, initial 0xFFFF
function crc16Ccitt(str){
  let crc = 0xFFFF;
  for(let i=0;i<str.length;i++){
    crc ^= str.charCodeAt(i) << 8;
    for(let j=0;j<8;j++){
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4,'0');
}

function buildEMVPixPayload(pixKey, merchantName='ANA E JOAO', merchantCity='CAMPO LARGO', amount){
  // EMV PIX payload for dynamic QR codes with amount
  const gui = tlv('00','BR.GOV.BCB.PIX');
  const key = tlv('01',pixKey);
  const mai = tlv('26', gui + key);

  const merchantCategory = tlv('52','0000');
  const currency = tlv('53','986'); // BRL
  // Format amount as decimal: "1.50" not "1,50"
  const amountField = amount ? tlv('54', amount.toFixed(2).replace(',', '.')) : '';
  const country = tlv('58','BR');
  const mName = tlv('59', merchantName.substring(0,25).toUpperCase());
  const mCity = tlv('60', merchantCity.substring(0,15).toUpperCase());
  
  // Unique ID for this transaction (required by many banks)
  const txnId = tlv('62', tlv('05', Math.random().toString(36).substr(2, 8).toUpperCase()));

  let payload = '';
  payload += tlv('00','01'); // payload format indicator
  payload += tlv('01','12'); // point of initiation - dynamic (contains amount)
  payload += mai;
  payload += merchantCategory;
  payload += currency;
  if(amountField) payload += amountField;
  payload += country;
  payload += mName;
  payload += mCity;
  payload += txnId;

  // CRC16 checksum
  payload += '6304'; // tag 63, length 04
  const crc = crc16Ccitt(payload);
  payload += crc;
  return payload;
}

function updatePixSection() {
  const total = calculateTotal();
  pixTotal.textContent = formatCurrency(total);
  const pixTotalStep = document.getElementById("pixTotalStep");
  if (pixTotalStep) pixTotalStep.textContent = formatCurrency(total);
  if (!pixQrImage) return;
  const pixKey = document.getElementById('pixKey') ? document.getElementById('pixKey').textContent.trim() : '09723193957';
  const payload = buildEMVPixPayload(pixKey, 'ANA E JOAO', 'CAMPO LARGO', total);
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
  pixQrImage.src = qrApi;
  pixQrImage.style.display = 'block';
}

// remove drawPixQrCode - static image used


function confirmPixPayment() {
  const name = guestNameInput ? guestNameInput.value.trim() : "";
  if (!name) {
    alert("Por favor, digite seu nome antes de confirmar.");
    guestNameInput.focus();
    return;
  }
  showSuccessMessage(name, calculateTotal());
}

function buildOrderText() {
  const items = Object.values(cart);
  if (items.length === 0) return "";
  const name = guestNameInput ? guestNameInput.value.trim() : "Convidado";
  const lines = items.map(item => `- ${item.name} x${item.quantity} (${formatCurrency(item.price * item.quantity)})`);
  const total = formatCurrency(calculateTotal());
  const pixKey = document.getElementById("pixKey").textContent.trim();
  const message = `Olá Ana e João! 💚\n\nAqui é ${name}. Acabei de separar um presente para vocês:\n${lines.join("\n")}\nTotal: ${total}\n\nChave PIX que usei: ${pixKey}\n\nSegue o comprovante aqui! Que Deus abençoe muito o casamento de vocês! 🙏`;
  return message;
}

function sendOrderWhatsApp() {
  const number = '5541997273744';
  const name = guestNameInput ? guestNameInput.value.trim() : "";
  if (!name) {
    alert("Por favor, digite seu nome antes de enviar.");
    if (guestNameInput) guestNameInput.focus();
    return;
  }
  const text = buildOrderText();
  if (!text) {
    alert('Adicione pelo menos um item ao carrinho antes de enviar por WhatsApp.');
    return;
  }
  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  showSuccessMessage(name, calculateTotal());
}

function showSuccessMessage(guestName, total) {
  const totalInfo = formatCurrency(total);
  const nameEl = document.getElementById("successName");
  if (nameEl) nameEl.textContent = guestName;
  const textEl = document.getElementById("successText");
  if (textEl) {
    textEl.textContent = `Seu presente de ${totalInfo} vai ajudar a construir o lar que estamos sonhando juntos. Que possamos celebrar muitos momentos especiais ao seu lado. Com todo o nosso carinho, Ana & João. 💚`;
  }
  pixSection.classList.add("hidden");
  if (checkoutHeaderTitle) {
    checkoutHeaderTitle.textContent = "Obrigado!";
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

// Attach smaller add-to-cart interaction: replace button content with icon on small screens
function enhanceAddButtons(){
  document.querySelectorAll('.add-to-cart-btn').forEach(btn=>{
    // keep text on larger screens, add icon for small
    function adapt(){
      if(window.innerWidth < 480){
        btn.textContent = '';
        btn.classList.add('has-icon');
        btn.innerHTML = '<span class="add-icon">+</span>';
      } else {
        btn.classList.remove('has-icon');
        // find product name from dataset to make label concise
        btn.textContent = 'Adicionar';
      }
    }
    adapt();
    window.addEventListener('resize', adapt);
  });
}

// call after DOM ready
window.addEventListener('load', ()=>{ enhanceAddButtons(); });
updateCartCount();
renderCart();
initializeEvents();
// Countdown to wedding (20 Sep 2026)
(function setupCountdown(){
  const el = document.getElementById('countdown');
  if(!el) return;
  function update(){
    const target = new Date('2026-09-20T00:00:00');
    const now = new Date();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days*(1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff -= hours*(1000*60*60);
    const minutes = Math.floor(diff / (1000*60));
    el.textContent = `${days} dias • ${hours}h ${minutes}m até o grande dia`;
  }
  update();
  setInterval(update, 60*1000);
})();
