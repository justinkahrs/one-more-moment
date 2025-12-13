
const STOREFRONT_BASE_URL = "https://storefront-api.fourthwall.com/v1";
let cartId = localStorage.getItem("omm-cart-id");
let cart = { items: [] }; // Local cache of cart state

// Helper to get headers
function getHeaders() {
  const token = window.OMM_STOREFRONT_TOKEN;
  if (!token) {
    console.error("Storefront Token not found!");
    return {};
  }
  return {
    "Content-Type": "application/json",
  };
}

// Helper to construct URL with token
function getUrl(path) {
  const token = window.OMM_STOREFRONT_TOKEN;
  return `${STOREFRONT_BASE_URL}${path}?storefront_token=${token}`;
}

async function fetchCart() {
  if (!cartId) return;
  try {
    const res = await fetch(getUrl(`/carts/${cartId}`));
    if (res.ok) {
      cart = await res.json();
      updateCartUI();
    } else if (res.status === 404) {
      // Cart expired or invalid
      localStorage.removeItem("omm-cart-id");
      cartId = null;
      cart = { items: [] };
      updateCartUI();
    }
  } catch (e) {
    console.error("Error fetching cart:", e);
  }
}

async function createCart() {
  try {
    const res = await fetch(getUrl("/carts"), {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ items: [] }),
    });
    if (res.ok) {
      const data = await res.json();
      cartId = data.id;
      localStorage.setItem("omm-cart-id", cartId);
      cart = data;
      return true;
    }
  } catch (e) {
    console.error("Error creating cart:", e);
  }
  return false;
}

async function addToCartAPI(variantId, quantity = 1) {
  if (!cartId) {
    await createCart();
  }
  if (!cartId) return; // Failed to create

  try {
    const res = await fetch(getUrl(`/carts/${cartId}/add`), {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        items: [{ variantId, quantity }],
      }),
    });
    if (res.ok) {
      cart = await res.json();
      updateCartUI();
      openCart();
    } else {
      console.error("Failed to add to cart", await res.text());
      alert("Failed to add item. Please try again.");
    }
  } catch (e) {
    console.error("Error adding to cart:", e);
  }
}

async function updateItemAPI(variantId, quantity) {
  if (!cartId) return;

  try {
    let url = `/carts/${cartId}/change`;
    let body = { items: [{ variantId, quantity }] };

    if (quantity <= 0) {
       url = `/carts/${cartId}/remove`;
       body = { items: [{ variantId }] };
    }

    const res = await fetch(getUrl(url), {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (res.ok) {
      cart = await res.json();
      updateCartUI();
    }
  } catch (e) {
    console.error("Error updating item:", e);
  }
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCountBadge = document.getElementById("cart-count");
  const cartTotalEl = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartCountBadge || !cartTotalEl) return;

  // Calculate total quantity
  const totalCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cartCountBadge.textContent = totalCount;

  // Calculate total price (Storefront API returns unitPrice in object)
  // Cart response structure usually has a total, or we calculate it.
  // Let's check the items.
  // Flatten items for display
  const items = cart.items;

  if (items.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="text-center text-gray-500 mt-10">Your cart is empty.</p>';
      cartTotalEl.textContent = "$0.00";
  } else {
    let total = 0;
    cartItemsContainer.innerHTML = items
      .map((item, index) => {
        const variant = item.variant;
        const price = variant.unitPrice?.value || 0;
        const currency = variant.unitPrice?.currency || "USD";
        total += price * item.quantity;
        
        return `
                <div class="flex items-center gap-4 bg-base-200 p-3 rounded-lg">
                    ${variant.images?.[0]?.url ? `<img src="${variant.images[0].url}" class="w-16 h-16 object-cover rounded" />` : ""}
                    <div class="flex-1">
                        <h3 class="font-bold text-sm">${variant.name || variant.product?.name}</h3>
                        <p class="text-sm text-gray-600">$${price} ${currency}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="btn btn-xs btn-circle" onclick="window.updateQty('${variant.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn btn-xs btn-circle" onclick="window.updateQty('${variant.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
            `;
      })
      .join("");
      
      // If API provides total, usage that (not seen in schema snippet, assume local calc for now)
      cartTotalEl.textContent = `$${total.toFixed(2)}`;
  }
}

// Global exposure for inline onclick
window.updateQty = (variantId, newQty) => {
  updateItemAPI(variantId, newQty);
};

// --- Initialization ---

document.addEventListener("DOMContentLoaded", () => {
    // Buttons
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
        btn.addEventListener("click", () => {
            const variantId = btn.dataset.variantId;
            if(variantId) {
                addToCartAPI(variantId, 1);
            } else {
                alert("Product has no variants available!");
            }
        });
    });

    // Drawer Logic
    const drawer = document.getElementById("cart-drawer");
    const drawerContent = document.getElementById("cart-content");
    const overlay = document.getElementById("cart-overlay");
    const closeBtn = document.getElementById("close-cart");
    const openBtn = document.getElementById("open-cart-btn");
    const checkoutBtn = document.getElementById("checkout-btn");

    window.openCart = () => {
        drawer.classList.remove("hidden");
        setTimeout(() => drawerContent.classList.remove("translate-x-full"), 10);
    };

    function closeCart() {
        drawerContent.classList.add("translate-x-full");
        setTimeout(() => drawer.classList.add("hidden"), 300);
    }

    if (openBtn) openBtn.addEventListener("click", window.openCart);
    if (closeBtn) closeBtn.addEventListener("click", closeCart);
    if (overlay) overlay.addEventListener("click", closeCart);
    
    // Checkout
    if(checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if(!cartId) return;
            
            // Construct Checkout URL
            // Pattern: https://<domain>/checkout/?cartCurrency=<code >&cartId=<id>
            const shopUrl = window.OMM_SHOP_URL; 
            const baseUrl = shopUrl.startsWith("http") ? shopUrl : `https://${shopUrl}`;
            
            // Get currency from first item or default to USD
            const currency = cart.items?.[0]?.variant?.unitPrice?.currency || "USD";
            
            const checkoutUrl = `${baseUrl}/checkout/?cartCurrency=${currency}&cartId=${cartId}`;
            
            window.location.href = checkoutUrl;
        });
    }

    // Initial Fetch
    fetchCart();
    
    // Expose Add to Cart for Modal
    window.OMM_ADD_TO_CART = addToCartAPI;
});
