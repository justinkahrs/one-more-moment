
// State
let currentProduct = null;
let selectedOptions = {}; // { Color: "Black", Size: "L" }
let currentQty = 1;

document.addEventListener("DOMContentLoaded", () => {
    // Open Modal Triggers
    document.querySelectorAll(".open-product-modal").forEach(btn => {
        btn.addEventListener("click", () => {
             const productId = btn.dataset.id;
             openProductModal(productId);
        });
    });

    // Add to Cart Button in Modal
    const addBtn = document.getElementById("modal-add-btn");
    if(addBtn) {
        addBtn.addEventListener("click", () => {
            if(addBtn.disabled) return;
            
            const variant = getSelectedVariant();
            if(variant) {
                // Call cart.js global function or directly logic
                // cart.js should expose addToCartAPI globally or we create a custom event?
                // cart.js exposes nothing globally except updateQty/openCart currently.
                // Let's assume we can access addToCartAPI if we expose it, OR we duplicate specific logic
                // Better: expose `window.OMM_ADD_TO_CART(variantId, qty)` in cart.js
                
                if(window.OMM_ADD_TO_CART) {
                    window.OMM_ADD_TO_CART(variant.id, currentQty);
                    document.getElementById("product_modal").close();
                } else {
                    console.error("OMM_ADD_TO_CART not found");
                }
            }
        });
    }
});

function openProductModal(productId) {
    const products = window.OMM_PRODUCTS || [];
    currentProduct = products.find(p => p.id === productId);
    
    if(!currentProduct) return;

    console.log("[ProductModal] Opening product:", currentProduct.name);
    console.log("[ProductModal] Variants count:", currentProduct.variants?.length);

    // Reset State
    selectedOptions = {};
    currentQty = 1;
    document.getElementById("modal-qty").value = 1;

    // Render Basic Info
    document.getElementById("modal-title").innerText = currentProduct.name;
    const img = currentProduct.images?.[0]?.url || "";
    document.getElementById("modal-image").src = img;
    
    // Render Options
    renderOptions(currentProduct);
    
    // Update Price / Button State
    updateModalState();

    // Open Dialog
    document.getElementById("product_modal").showModal();
}

function renderOptions(product) {
    const container = document.getElementById("modal-options");
    container.innerHTML = "";
    
    console.log("[ProductModal] Rendering options for variants:", product.variants);

    const attributesMap = {}; 
    
    product.variants?.forEach(v => {
        const attrs = v.attributes;
        if(!attrs) return;
        
        for(const key in attrs) {
            if(key.toLowerCase() === 'description') continue;
            
            const valObj = attrs[key]; 
            const valName = valObj.name || valObj; 
            
            // Normalize Key to Title Case
            const label = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
            
            if(!attributesMap[label]) attributesMap[label] = new Set();
            attributesMap[label].add(valName);
        }
    });
    
    console.log("[ProductModal] Computed Attributes Map:", attributesMap);

    // Generate UI
    for(const [label, values] of Object.entries(attributesMap)) {
         if(values.size === 0) continue;
         
         const wrapper = document.createElement("div");
         wrapper.className = "space-y-2";
         
         const title = document.createElement("h4");
         title.className = "font-bold text-sm uppercase tracking-wide opacity-75";
         title.innerText = label;
         wrapper.appendChild(title);
         
         const choicesDiv = document.createElement("div");
         choicesDiv.className = "flex flex-wrap gap-2";
         
         values.forEach(val => {
             const btn = document.createElement("button");
             btn.className = "btn btn-outline btn-sm";
             btn.innerText = val;
             btn.dataset.group = label;
             btn.dataset.value = val;
             
             // Auto-select if single option
             if(values.size === 1) {
                 btn.classList.add("btn-active");
                 selectedOptions[label.toLowerCase()] = val; 
             }
             
             btn.onclick = () => selectOption(label, val, btn);
             
             choicesDiv.appendChild(btn);
         });
         
         wrapper.appendChild(choicesDiv);
         container.appendChild(wrapper);
    }
}

function selectOption(group, value, clickedBtn) {
    // Update State
    selectedOptions[group.toLowerCase()] = value;
    
    // Visual Update
    // 1. Deselect siblings
    const parent = clickedBtn.parentNode;
    parent.querySelectorAll(".btn").forEach(b => b.classList.remove("btn-active", "btn-primary"));
    
    // 2. Select clicked
    clickedBtn.classList.add("btn-active", "btn-primary");
    
    updateModalState();
}

function getSelectedVariant() {
    if(!currentProduct) return null;
    
    // Find variant that matches ALL selected options
    // Assuming we need all option keys present in attributesMap (calculated implicitly)
    // Actually, we iterate variants and check if they include the selected entries
    
    return currentProduct.variants.find(v => {
        const attrs = v.attributes || {};
        // Check if every selected option matches this variant's attribute
        for(const [key, val] of Object.entries(selectedOptions)) {
             const vAttr = attrs[key]; // { name: "Black" }
             const vVal = vAttr?.name || vAttr;
             if(vVal !== val) return false;
        }
        
        // Ensure we selected ALL required attributes for this product?
        // Simple check: if variant has attribute keys that define it, do we have them?
        // For now, loose matching: if it matches what we selected, it's a candidate.
        // We might want to prioritise "Select all options" validation.
        return true;
    });
}

function updateModalState() {
    const variant = getSelectedVariant();
    const priceEl = document.getElementById("modal-price");
    const addBtn = document.getElementById("modal-add-btn");
    
    // Count how many attribute groups exist in DOM
    const totalGroups = document.querySelectorAll("#modal-options > div").length;
    const selectedCount = Object.keys(selectedOptions).length;
    const allSelected = totalGroups === selectedCount;

    if(allSelected && variant) {
         // Update Price
         const p = variant.unitPrice;
         priceEl.innerText = `$${p.value} ${p.currency}`;
         
         // Enable Button
         addBtn.disabled = false;
         addBtn.innerText = "Add to Cart";
         
         // Update Image if variant has specific image?
         if(variant.images?.[0]?.url) {
             document.getElementById("modal-image").src = variant.images[0].url;
         }
         
    } else {
        addBtn.disabled = true;
        addBtn.innerText = allSelected ? "Unavailable" : "Select Options";
        // Keep main product price or show range?
    }
}

window.updateModalQty = (change) => {
    let newQty = currentQty + change;
    if(newQty < 1) newQty = 1;
    currentQty = newQty;
    document.getElementById("modal-qty").value = newQty;
};
