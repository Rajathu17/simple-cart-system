// ==========================================================================
// Default Catalog Data
// ==========================================================================
const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'AeroSound Pro Headphones',
    description: 'Active noise cancelling wireless headphones with 40h battery life and spatial audio.',
    price: 189.99,
    category: 'Electronics',
    rating: 4.8,
    reviews: 142,
    stock: 8,
    icon: 'headphones'
  },
  {
    id: 'p2',
    name: 'Chronos Smartwatch',
    description: 'Sleek AMOLED fitness watch with heart rate, SPO2 tracking, and offline GPS.',
    price: 149.50,
    category: 'Accessories',
    rating: 4.6,
    reviews: 98,
    stock: 12,
    icon: 'watch'
  },
  {
    id: 'p3',
    name: 'Tactile Keyboard Lite',
    description: '75% mechanical layout with hot-swappable tactile switches and dynamic RGB backlighting.',
    price: 79.99,
    category: 'Electronics',
    rating: 4.5,
    reviews: 64,
    stock: 5,
    icon: 'keyboard'
  },
  {
    id: 'p4',
    name: 'Vanguard Leather Wallet',
    description: 'Premium full-grain leather bi-fold wallet featuring RFID blocking security.',
    price: 45.00,
    category: 'Accessories',
    rating: 4.7,
    reviews: 110,
    stock: 15,
    icon: 'wallet'
  }
];

const CATEGORY_ICONS = {
  'Electronics': 'cpu',
  'Accessories': 'sparkles',
  'Apparel': 'shirt',
  'Fitness': 'activity',
  'Custom': 'package'
};

// ==========================================================================
// Application State
// ==========================================================================
const state = {
  catalog: [...DEFAULT_PRODUCTS],
  cart: [],
  appliedCoupon: null,
  theme: localStorage.getItem('theme') || 'dark'
};

const PROMO_CODES = {
  'SAVE10': { code: 'SAVE10', rate: 0.10 },
  'WELCOME20': { code: 'WELCOME20', rate: 0.20 },
  'MEGA50': { code: 'MEGA50', rate: 0.50 }
};

// ==========================================================================
// Toast Notification System
// ==========================================================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'check-circle';
  if (type === 'info') iconName = 'info';
  if (type === 'warning') iconName = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
    <button class="toast-close"><i data-lucide="x"></i></button>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  // Toast close button listener
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.animation = 'none'; // Clear animation
    toast.offsetHeight; // Trigger reflow
    toast.style.animation = 'slideInUp 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  });

  // Auto remove after 3.5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 3500);
}

// ==========================================================================
// Theme Logic
// ==========================================================================
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
    showToast(`Switched to ${state.theme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  });
}

// ==========================================================================
// Collapsible Custom Form Accordion
// ==========================================================================
function initAccordion() {
  const toggleBtn = document.getElementById('custom-form-toggle');
  const card = document.querySelector('.custom-product-card');
  
  if (toggleBtn && card) {
    toggleBtn.addEventListener('click', () => {
      card.classList.toggle('open');
    });
  }
}

// ==========================================================================
// Render Functions
// ==========================================================================
function renderCatalog() {
  const grid = document.getElementById('products-grid');
  const catalogCount = document.getElementById('catalog-count');
  const productBadge = document.getElementById('product-badge');
  
  if (!grid) return;
  
  catalogCount.textContent = state.catalog.length;
  productBadge.textContent = `${state.catalog.length} Items`;
  
  grid.innerHTML = state.catalog.map(product => {
    const isOutOfStock = product.stock <= 0;
    
    // Rating star generation (simplified)
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 >= 0.5 ? 1 : 0;
    
    return `
      <div class="product-card glass-panel" id="product-${product.id}">
        <div class="product-media">
          ${isOutOfStock ? `<div class="out-of-stock-overlay">Out of Stock</div>` : ''}
          <span class="product-category-tag">${product.category}</span>
          <div class="product-icon-container">
            <i data-lucide="${product.icon || 'package'}"></i>
          </div>
          <div class="product-rating" title="Rating: ${product.rating} stars">
            <i data-lucide="star"></i>
            <span>${product.rating.toFixed(1)}</span>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-footer">
            <div class="product-price-label">
              <span class="price-desc">Price</span>
              <span class="product-price">$${product.price.toFixed(2)}</span>
            </div>
            <button 
              class="btn btn-primary btn-add-cart" 
              data-id="${product.id}"
              title="Add ${product.name} to cart"
              ${isOutOfStock ? 'disabled' : ''}
            >
              <i data-lucide="shopping-cart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Re-compile icons
  lucide.createIcons();
  
  // Add Event Listeners to Add to Cart buttons
  grid.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = button.getAttribute('data-id');
      addToCart(id);
    });
  });
}

function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  if (!cartContainer) return;
  
  const totalItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItemsCount;
  
  if (state.cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty-state">
        <i data-lucide="shopping-bag" class="empty-icon"></i>
        <p>Your shopping cart is empty.</p>
        <span class="sub-text">Add items from the catalog to get started.</span>
      </div>
    `;
    checkoutBtn.disabled = true;
    lucide.createIcons();
    updateCalculations(0);
    return;
  }
  
  checkoutBtn.disabled = false;
  
  cartContainer.innerHTML = state.cart.map(item => {
    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-icon">
          <i data-lucide="${item.icon || 'package'}"></i>
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name" title="${item.name}">${item.name}</h4>
          <span class="cart-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <div class="cart-quantity-controls">
          <button class="qty-btn btn-minus" data-id="${item.id}" aria-label="Decrease quantity">
            <i data-lucide="minus"></i>
          </button>
          <span class="qty-number">${item.quantity}</span>
          <button class="qty-btn btn-plus" data-id="${item.id}" aria-label="Increase quantity">
            <i data-lucide="plus"></i>
          </button>
        </div>
        <button class="btn-delete" data-id="${item.id}" aria-label="Remove item">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
  }).join('');
  
  lucide.createIcons();
  
  // Attach Event Listeners to quantity controls and delete
  cartContainer.querySelectorAll('.btn-minus').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.getAttribute('data-id'), -1));
  });
  
  cartContainer.querySelectorAll('.btn-plus').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.getAttribute('data-id'), 1));
  });
  
  cartContainer.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
  });
  
  // Calculate Totals
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  updateCalculations(subtotal);
}

function updateCalculations(subtotal) {
  const subtotalEl = document.getElementById('summary-subtotal');
  const discountEl = document.getElementById('summary-discount');
  const discountRow = document.getElementById('summary-discount-row');
  const couponLabel = document.getElementById('active-coupon-label');
  const shippingEl = document.getElementById('summary-shipping');
  const taxEl = document.getElementById('summary-tax');
  const originalTotalEl = document.getElementById('summary-original-total');
  const totalEl = document.getElementById('summary-total');
  
  // Free Shipping Tracker
  const shippingTracker = document.getElementById('shipping-tracker-container');
  const trackerMessage = document.getElementById('shipping-tracker-message');
  const trackerPercent = document.getElementById('shipping-tracker-percent');
  const progressFill = document.getElementById('shipping-progress-bar');
  
  const SHIPPING_THRESHOLD = 100.00;
  
  // Progress calculations
  if (subtotal === 0) {
    progressFill.style.width = '0%';
    trackerPercent.textContent = '0%';
    trackerMessage.innerHTML = `Add <strong>$${SHIPPING_THRESHOLD.toFixed(2)}</strong> more for Free Shipping!`;
    shippingTracker.classList.remove('free-shipping');
  } else if (subtotal >= SHIPPING_THRESHOLD) {
    progressFill.style.width = '100%';
    trackerPercent.textContent = '100%';
    trackerMessage.innerHTML = `🎉 You qualify for <strong>Free Shipping!</strong>`;
    shippingTracker.classList.add('free-shipping');
  } else {
    const diff = SHIPPING_THRESHOLD - subtotal;
    const pct = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);
    progressFill.style.width = `${pct}%`;
    trackerPercent.textContent = `${Math.round(pct)}%`;
    trackerMessage.innerHTML = `Add <strong>$${diff.toFixed(2)}</strong> more for Free Shipping!`;
    shippingTracker.classList.remove('free-shipping');
  }
  
  // Calculations
  let discount = 0;
  if (state.appliedCoupon) {
    discount = subtotal * state.appliedCoupon.rate;
    discountRow.classList.remove('hidden');
    couponLabel.textContent = `${state.appliedCoupon.code} (${state.appliedCoupon.rate * 100}%)`;
    discountEl.textContent = `-$${discount.toFixed(2)}`;
  } else {
    discountRow.classList.add('hidden');
  }
  
  const shipping = (subtotal >= SHIPPING_THRESHOLD || subtotal === 0) ? 0.00 : 10.00;
  const taxableIncome = Math.max(subtotal - discount, 0);
  const tax = taxableIncome * 0.08; // 8% Tax
  const finalTotal = taxableIncome + shipping + tax;
  
  // Render
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${finalTotal.toFixed(2)}`;
  
  if (discount > 0) {
    const originalTotal = subtotal + shipping + (subtotal * 0.08);
    originalTotalEl.textContent = `$${originalTotal.toFixed(2)}`;
    originalTotalEl.classList.remove('hidden');
  } else {
    originalTotalEl.classList.add('hidden');
  }
}

// ==========================================================================
// Cart Operations Actions
// ==========================================================================
function addToCart(productId) {
  const product = state.catalog.find(p => p.id === productId);
  if (!product) return;
  
  if (product.stock <= 0) {
    showToast(`Sorry, ${product.name} is out of stock.`, 'warning');
    return;
  }
  
  const cartItem = state.cart.find(item => item.id === productId);
  
  if (cartItem) {
    if (cartItem.quantity >= product.stock) {
      showToast(`Cannot add more. Limit of ${product.stock} reached (stock limit).`, 'warning');
      return;
    }
    cartItem.quantity++;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      category: product.category,
      icon: product.icon
    });
  }
  
  // Bounce animation for cart icon in header
  const cartIconBadge = document.getElementById('cart-count');
  if (cartIconBadge) {
    cartIconBadge.style.transform = 'scale(1.3)';
    cartIconBadge.style.transition = 'transform 0.15s ease';
    setTimeout(() => {
      cartIconBadge.style.transform = 'scale(1)';
    }, 150);
  }
  
  showToast(`Added ${product.name} to cart.`);
  renderCart();
}

function updateQuantity(productId, delta) {
  const cartItem = state.cart.find(item => item.id === productId);
  const product = state.catalog.find(p => p.id === productId);
  
  if (!cartItem || !product) return;
  
  const newQty = cartItem.quantity + delta;
  
  if (newQty <= 0) {
    removeFromCart(productId);
  } else if (newQty > product.stock) {
    showToast(`Only ${product.stock} units of ${product.name} are available.`, 'warning');
  } else {
    cartItem.quantity = newQty;
    renderCart();
  }
}

function removeFromCart(productId) {
  const itemIndex = state.cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;
  
  const item = state.cart[itemIndex];
  state.cart.splice(itemIndex, 1);
  showToast(`Removed ${item.name} from cart.`, 'info');
  renderCart();
}

// ==========================================================================
// Coupon Code Processing
// ==========================================================================
function initCouponHandler() {
  const applyBtn = document.getElementById('apply-coupon-btn');
  const removeBtn = document.getElementById('remove-coupon-btn');
  const input = document.getElementById('coupon-code');
  
  if (!applyBtn || !input) return;
  
  // Apply coupon click handler
  applyBtn.addEventListener('click', () => {
    const rawCode = input.value.trim().toUpperCase();
    
    if (!rawCode) {
      showToast('Please enter a coupon code.', 'warning');
      return;
    }
    
    if (PROMO_CODES[rawCode]) {
      state.appliedCoupon = PROMO_CODES[rawCode];
      input.classList.remove('invalid');
      input.classList.add('valid');
      showToast(`Coupon ${rawCode} applied! Saved ${state.appliedCoupon.rate * 100}% on subtotal.`);
      renderCart();
    } else {
      input.classList.remove('valid');
      input.classList.add('invalid');
      showToast(`Invalid coupon code: "${rawCode}"`, 'warning');
    }
  });
  
  // Remove coupon click handler
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      if (state.appliedCoupon) {
        const removedCode = state.appliedCoupon.code;
        state.appliedCoupon = null;
        input.value = '';
        input.classList.remove('valid', 'invalid');
        showToast(`Coupon ${removedCode} removed.`, 'info');
        renderCart();
      }
    });
  }
  
  // Bind chips click handlers
  document.querySelectorAll('.coupon-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const code = chip.getAttribute('data-code');
      input.value = code;
      
      // Auto-submit coupon when chip is clicked
      state.appliedCoupon = PROMO_CODES[code];
      input.classList.remove('invalid');
      input.classList.add('valid');
      showToast(`Coupon ${code} applied via quick-link!`);
      renderCart();
    });
  });
}

// ==========================================================================
// Custom Product Addition Form
// ==========================================================================
function initCustomProductForm() {
  const form = document.getElementById('custom-product-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameEl = document.getElementById('custom-name');
    const priceEl = document.getElementById('custom-price');
    const categoryEl = document.getElementById('custom-category');
    
    const name = nameEl.value.trim();
    const price = parseFloat(priceEl.value);
    const category = categoryEl.value;
    
    if (!name || isNaN(price) || price <= 0) {
      showToast('Please check the input values.', 'warning');
      return;
    }
    
    const id = `p_custom_${Date.now()}`;
    const icon = CATEGORY_ICONS[category] || 'package';
    
    const newProduct = {
      id,
      name,
      description: `Custom ${category.toLowerCase()} item added by the user. Ready for simulation checkout.`,
      price,
      category,
      rating: 5.0,
      reviews: 1,
      stock: 10, // Default generous stock
      icon
    };
    
    state.catalog.push(newProduct);
    showToast(`Added custom product "${name}" to the catalog!`);
    
    // Reset Form
    form.reset();
    
    // Collapse catalog card after adding
    document.querySelector('.custom-product-card').classList.remove('open');
    
    // Rerender Catalog
    renderCatalog();
  });
}

// ==========================================================================
// Mock Checkout Modal Logic
// ==========================================================================
function initCheckoutModal() {
  const checkoutBtn = document.getElementById('checkout-btn');
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const doneBtn = document.getElementById('modal-done-btn');
  
  if (!checkoutBtn || !modal) return;
  
  checkoutBtn.addEventListener('click', () => {
    // Fill receipt details
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPaid = document.getElementById('summary-total').textContent;
    const couponStr = state.appliedCoupon ? `${state.appliedCoupon.code} (${state.appliedCoupon.rate * 100}% Off)` : 'None';
    
    document.getElementById('receipt-items-count').textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
    document.getElementById('receipt-discount-applied').textContent = couponStr;
    document.getElementById('receipt-total-paid').textContent = totalPaid;
    
    // Open Modal
    modal.classList.remove('hidden');
  });
  
  const closeModal = () => {
    modal.classList.add('hidden');
    // Success flow - Clear cart after mock checkout completed
    state.cart = [];
    state.appliedCoupon = null;
    
    // Reset Coupon Form state UI
    const input = document.getElementById('coupon-code');
    if (input) {
      input.value = '';
      input.classList.remove('valid', 'invalid');
    }
    
    showToast('Simulated order completed. Cart cleared.', 'info');
    renderCart();
  };
  
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);
}

// ==========================================================================
// Initialization Point
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAccordion();
  initCouponHandler();
  initCustomProductForm();
  initCheckoutModal();
  
  // Render
  renderCatalog();
  renderCart();
});
