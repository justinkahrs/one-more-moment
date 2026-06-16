
// State
let currentProduct = null;
let selectedOptions = {}; // { Color: "Black", Size: "L" }
let currentQty = 1;
let currentGalleryImages = [];
let currentImageUrl = "";

function getImageUrl(image) {
    return image?.url || image?.transformedUrl || "";
}

function getModalImageEl() {
    return document.getElementById("modal-image");
}

function setModalImage(imageUrl) {
    const modalImage = getModalImageEl();
    if(!modalImage) return;

    currentImageUrl = imageUrl || "";
    modalImage.src = currentImageUrl;
}

function getGalleryImages(product, variant = null) {
    const seen = new Set();
    const gallery = [];
    const imageGroups = [
        ...(variant?.images ? [variant.images] : []),
        ...(product?.images ? [product.images] : []),
    ];

    imageGroups.forEach((images) => {
        images.forEach((image) => {
            const imageUrl = getImageUrl(image);
            if(!imageUrl || seen.has(imageUrl)) return;

            seen.add(imageUrl);
            gallery.push({
                url: imageUrl,
                alt: product?.name || "Product image",
            });
        });
    });

    return gallery;
}

function renderModalThumbnails(preferredImageUrl = "") {
    const container = document.getElementById("modal-thumbnails");
    if(!container) return;

    container.innerHTML = "";

    if(!currentGalleryImages.length) {
        container.classList.add("hidden");
        setModalImage("");
        return;
    }

    container.classList.toggle("hidden", currentGalleryImages.length <= 1);

    const nextImageUrl =
        preferredImageUrl && currentGalleryImages.some((image) => image.url === preferredImageUrl)
            ? preferredImageUrl
            : currentGalleryImages[0].url;

    setModalImage(nextImageUrl);

    currentGalleryImages.forEach((image, index) => {
        const thumbBtn = document.createElement("button");
        thumbBtn.type = "button";
        thumbBtn.className =
            image.url === currentImageUrl
                ? "h-16 w-16 overflow-hidden rounded-xl border-2 border-[#D9776E] bg-white p-0 shadow-sm"
                : "h-16 w-16 overflow-hidden rounded-xl border border-[#2B2B40]/15 bg-white p-0 opacity-80 transition hover:opacity-100";
        thumbBtn.setAttribute("aria-label", `Show image ${index + 1} of ${currentGalleryImages.length}`);
        if(image.url === currentImageUrl) {
            thumbBtn.setAttribute("aria-current", "page");
        }

        thumbBtn.addEventListener("click", () => {
            renderModalThumbnails(image.url);
        });

        const thumbImage = document.createElement("img");
        thumbImage.src = image.url;
        thumbImage.alt = image.alt;
        thumbImage.className = "h-full w-full object-cover";

        thumbBtn.appendChild(thumbImage);
        container.appendChild(thumbBtn);
    });
}

function syncModalGallery(variant = null) {
    currentGalleryImages = getGalleryImages(currentProduct, variant);
    renderModalThumbnails(currentImageUrl);
}

document.addEventListener("DOMContentLoaded", () => {
    // Open Modal Triggers
    document.addEventListener("click", (event) => {
        const btn = event.target instanceof Element
            ? event.target.closest(".open-product-modal")
            : null;
        if(!btn) return;

        const productId = btn.dataset.id;
        openProductModal(productId);
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


    // Reset State
    selectedOptions = {};
    currentQty = 1;
    currentGalleryImages = [];
    currentImageUrl = "";
    document.getElementById("modal-qty").value = 1;

    // Render Basic Info
    document.getElementById("modal-title").innerText = currentProduct.name;
    syncModalGallery();
    
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
             
             // Auto-select first one
             // Also check if we already have a selection for this group
             const groupKey = label.toLowerCase();
             if(selectedOptions[groupKey] === undefined) {
                 btn.classList.add("btn-active", "bg-[#D9776E]", "text-white", "border-[#D9776E]");
                 selectedOptions[groupKey] = val;
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
    parent.querySelectorAll(".btn").forEach(b => b.classList.remove("btn-active", "bg-[#D9776E]", "text-white", "border-[#D9776E]"));
    
    // 2. Select clicked
    clickedBtn.classList.add("btn-active", "bg-[#D9776E]", "text-white", "border-[#D9776E]");
    
    updateModalState();
}

function getSelectedVariant() {
    if(!currentProduct) return null;
    
    return currentProduct.variants.find(v => {
        const attrs = v.attributes || {};
        
        // Check if every selected option matches this variant's attribute
        for(const [key, val] of Object.entries(selectedOptions)) {
             // Find matching key in attrs (case-insensitive)
             const attrKey = Object.keys(attrs).find(k => k.toLowerCase() === key.toLowerCase());
             
             if(!attrKey) return false; // Attribute group missing in this variant
             
             const vAttr = attrs[attrKey]; 
             const vVal = vAttr?.name || vAttr;
             
             if(vVal !== val) return false;
        }
        
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
         syncModalGallery(variant);
         
    } else {
        addBtn.disabled = true;
        addBtn.innerText = allSelected ? "Unavailable" : "Select Options";
        syncModalGallery();
        // Keep main product price or show range?
    }
}

window.updateModalQty = (change) => {
    let newQty = currentQty + change;
    if(newQty < 1) newQty = 1;
    currentQty = newQty;
    document.getElementById("modal-qty").value = newQty;
};
