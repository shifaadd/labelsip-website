/* =========================================
   LABELSIP — SCRIPT.JS
   PART 1: INITIAL SETUP
========================================= */

"use strict";


/* =========================================
   WEBSITE ELEMENTS
========================================= */

const screens = document.querySelectorAll(".screen");

const mobileMenuButton = document.getElementById(
    "mobile-menu-button"
);

const mobileNavigation = document.getElementById(
    "mobile-navigation"
);

const cartCount = document.getElementById(
    "cart-count"
);

const loader = document.getElementById(
    "page-loader"
);

const siteFooter = document.querySelector(".main-footer");


/* =========================================
   WEBSITE STATE
========================================= */

let currentScreen = "home";

let cart = [];

let wishlist = [];


/* =========================================
   COMMON STORAGE FUNCTIONS
========================================= */

function saveData(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.error("Storage error:", error);

    }

}


function getData(key, fallback = []) {

    try {

        const savedData = localStorage.getItem(key);

        return savedData
            ? JSON.parse(savedData)
            : fallback;

    } catch (error) {

        console.error("Storage reading error:", error);

        return fallback;

    }

}


/* =========================================
   LOAD SAVED CART AND WISHLIST
========================================= */

cart = getData("labelsip_cart", []);

wishlist = getData("labelsip_wishlist", []);


/* =========================================
   COMMON MESSAGE FUNCTION
========================================= */

function showMessage(message) {

    let messageBox = document.getElementById(
        "labelsip-message"
    );

    if (!messageBox) {

        messageBox = document.createElement("div");

        messageBox.id = "labelsip-message";

        messageBox.setAttribute("role", "status");

        document.body.appendChild(messageBox);

    }

    messageBox.textContent = message;

    messageBox.classList.add("show");

    clearTimeout(window.labelsipMessageTimer);

    window.labelsipMessageTimer = setTimeout(() => {

        messageBox.classList.remove("show");

    }, 3000);

}


/* =========================================
   UPDATE COPYRIGHT YEAR
========================================= */

const currentYear = document.getElementById(
    "current-year"
);

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}

















/* =========================================
   PART 2: FULL-SCREEN NAVIGATION
========================================= */


/* =========================================
   DISPLAY SELECTED SCREEN
========================================= */

function showScreen(screenId, updateHistory = true) {

    const targetScreen = document.getElementById(screenId);

    if (!targetScreen || !targetScreen.classList.contains("screen")) {

        showMessage("This page is not available yet.");

        return;

    }


    /* CLOSE MOBILE MENU */

    closeMobileMenu();
	// Reset page position whenever a new screen opens
window.scrollTo(0, 0);


    /* HIDE ALL OTHER SCREENS */

    screens.forEach(screen => {

        screen.style.display = "none";

        screen.style.opacity = "0";

    });


    /* SHOW SELECTED SCREEN */

	/* SHOW SELECTED SCREEN */

    targetScreen.style.display = screenId === "home" ? "flex" : "block";

    targetScreen.style.opacity = "0";

    requestAnimationFrame(() => {

        targetScreen.style.transition = "opacity 0.35s ease";

        targetScreen.style.opacity = "1";

    });


    currentScreen = screenId;

	/* Keep the mobile homepage as a single hero screen. */

if (siteFooter) {
    const isMobileHome =
        screenId === "home" &&
        window.matchMedia("(max-width: 768px)").matches;

    siteFooter.style.display = isMobileHome ? "none" : "";
}


    /* UPDATE NAVIGATION HIGHLIGHT */

    document.querySelectorAll(".nav-link").forEach(link => {

        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + screenId
        );

    });


    /* UPDATE ADDRESS BAR */

    if (updateHistory) {

        history.pushState(
            { screen: screenId },
            "",
            "#" + screenId
        );

    }


    /* RESET SCREEN SCROLL POSITION */

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

}


/* =========================================
   HANDLE ALL INTERNAL WEBSITE LINKS
========================================= */

document.addEventListener("click", function(event) {

    const link = event.target.closest('a[href^="#"]');

    if (!link) return;

    const targetId = link.getAttribute("href").substring(1);

    const target = document.getElementById(targetId);

    if (target && target.classList.contains("screen")) {

        event.preventDefault();

        showScreen(targetId);

    }

});


/* =========================================
   HANDLE BROWSER BACK AND FORWARD
========================================= */

window.addEventListener("popstate", function(event) {

    const screenId = event.state?.screen || "home";

    showScreen(screenId, false);

});


/* =========================================
   OPEN INITIAL SCREEN
========================================= */

function initializeNavigation() {

    const requestedScreen = window.location.hash.replace("#", "");

    if (
        requestedScreen &&
        document.getElementById(requestedScreen)?.classList.contains("screen")
    ) {

        showScreen(requestedScreen, false);

    } else {

        showScreen("home", false);

    }

}















/* =========================================
   PART 3: MOBILE NAVIGATION
========================================= */


/* =========================================
   OPEN MOBILE MENU
========================================= */

function openMobileMenu() {

    if (!mobileNavigation || !mobileMenuButton) return;

    mobileNavigation.classList.add("active");

    mobileMenuButton.classList.add("active");

    mobileMenuButton.setAttribute("aria-expanded", "true");

	mobileMenuButton.setAttribute("aria-label", "Close navigation");

}


/* =========================================
   CLOSE MOBILE MENU
========================================= */

function closeMobileMenu() {

    if (!mobileNavigation || !mobileMenuButton) return;

    mobileNavigation.classList.remove("active");

    mobileMenuButton.classList.remove("active");

    mobileMenuButton.setAttribute("aria-expanded", "false");

	mobileMenuButton.setAttribute("aria-label", "Open navigation");

}


/* =========================================
   MENU BUTTON CLICK
========================================= */

if (mobileMenuButton) {

    mobileMenuButton.addEventListener("click", function() {

        const isOpen = mobileNavigation.classList.contains("active");

        if (isOpen) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    });

}


/* =========================================
   CLOSE MENU AFTER CLICKING A LINK
========================================= */

if (mobileNavigation) {

    mobileNavigation.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", closeMobileMenu);

    });

}


/* =========================================
   CLOSE MENU WITH ESCAPE KEY
========================================= */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeMobileMenu();

    }

});







/* =========================================
   PART 4: SHOPPING CART AND DEMO PRICING
========================================= */

const products = {
    "300ml": { id: "300ml", name: "300 ML BOTTLE", image: "images/bottle-300ml.png" },
    "1litre": { id: "1litre", name: "1 LITRE BOTTLE", image: "images/bottle-1litre.png" }
};

function getBottlePrice(item) {
    if (item.id === "300ml" && item.branding === "yes") return 6.53;
    if (item.id === "300ml") return 6.00;
    return 12.00;
}

function money(value) {
    return "₹" + Number(value || 0).toFixed(2);
}

function saveCart() {
    saveData("labelsip_cart", cart);
}

function updateCartCount() {
    const totalQuantity = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    if (cartCount) cartCount.textContent = totalQuantity;
}

function addToCart(productId, quantity, branding = "no", brandingDetails = {}) {
    const product = products[productId];
    quantity = Number(quantity);

    if (!product) {
        showMessage("Product not found.");
        return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        showMessage("Please enter a valid quantity.");
        return;
    }

    const detailsKey = JSON.stringify(brandingDetails || {});

    const existingItem = cart.find(item =>
        item.id === productId &&
        (item.branding || "no") === branding &&
        JSON.stringify(item.brandingDetails || {}) === detailsKey
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            quantity,
            branding,
            brandingDetails: brandingDetails || {}
        });
    }

    saveCart();
    updateCartCount();
    renderCart();

    showMessage(product.name + " added to your cart.");
}

function removeCartItem(index) {
    if (index < 0 || index >= cart.length) return;

    cart.splice(index, 1);

    saveCart();
    updateCartCount();
    renderCart();

    showMessage("Product removed from cart.");
}

function changeCartItemQuantity(index, change) {
    const item = cart[index];

    if (!item) return;

    item.quantity = Number(item.quantity) + change;

    if (item.quantity <= 0) {
        removeCartItem(index);
        return;
    }

    saveCart();
    updateCartCount();
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (!cart.length) {
        cartItems.innerHTML =
            '<p class="empty-message">Your shopping cart is currently empty.</p>';

        updateOrderSummary();
        return;
    }

    cart.forEach((item, index) => {
        const productElement = document.createElement("article");
        productElement.className = "cart-product";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;
        image.width = 100;
        image.height = 110;

        const details = document.createElement("div");
        details.className = "cart-product-details";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const brandingInfo = document.createElement("p");
        const hasBranding = item.branding === "yes";

        brandingInfo.className = "cart-branding-status";
        brandingInfo.textContent = hasBranding
            ? "With custom branding" +
              (item.brandingDetails?.businessName
                  ? " · " + item.brandingDetails.businessName
                  : "")
            : "Without custom branding";

        const unitPrice = getBottlePrice(item);

        const price = document.createElement("p");
        price.className = "cart-unit-price";
        price.textContent = money(unitPrice) + " per bottle";

        const lineTotal = document.createElement("p");
        lineTotal.className = "cart-line-total";
        lineTotal.textContent =
            "Line total: " + money(unitPrice * Number(item.quantity));

        const controls = document.createElement("div");
        controls.className = "cart-controls";

        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", "Decrease quantity");
        decrease.addEventListener("click", () =>
            changeCartItemQuantity(index, -1)
        );

        const quantity = document.createElement("span");
        quantity.className = "cart-quantity-value";
        quantity.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.type = "button";
        increase.textContent = "+";
        increase.setAttribute("aria-label", "Increase quantity");
        increase.addEventListener("click", () =>
            changeCartItemQuantity(index, 1)
        );

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove";
        remove.className = "cart-remove-button";
        remove.addEventListener("click", () => removeCartItem(index));

        controls.append(decrease, quantity, increase, remove);
        details.append(title, brandingInfo, price, lineTotal, controls);
        productElement.append(image, details);

        cartItems.appendChild(productElement);
    });

    updateOrderSummary();
}

function updateOrderSummary() {
    const subtotal = cart.reduce(
        (sum, item) =>
            sum + getBottlePrice(item) * Number(item.quantity || 0),
        0
    );

    const distance = document.getElementById("delivery-distance");

    const delivery =
        distance && distance.value !== ""
            ? Number(distance.value)
            : null;

    const subtotalNode = document.getElementById("cart-subtotal");
    const deliveryNode = document.getElementById("cart-delivery");
    const grandNode = document.getElementById("cart-grand-total");

    if (subtotalNode) {
        subtotalNode.textContent = money(subtotal);
    }

    if (deliveryNode) {
        deliveryNode.textContent =
            delivery === null ? "Select distance" : money(delivery);
    }

    if (grandNode) {
        grandNode.textContent =
            money(subtotal + (delivery === null ? 0 : delivery));
    }
}

/* DELIVERY DISTANCE SELECTION */

const deliveryDistance = document.getElementById("delivery-distance");

if (deliveryDistance) {
    deliveryDistance.value = getData("labelsip_delivery_distance", "");

    deliveryDistance.addEventListener("change", function() {
        saveData("labelsip_delivery_distance", this.value);
        updateOrderSummary();
    });
}

/* CONNECT EXISTING PRODUCT-DETAIL ADD-TO-CART BUTTONS */

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function() {
        const productId = this.dataset.product;
        const suffix = productId === "300ml" ? "300" : "1litre";

        const quantityInput = document.getElementById(
            "quantity-" + suffix + "-detail"
        );

        const brandingSelect = document.getElementById(
            "branding-" + suffix + "-detail"
        );

        const quantity = Number(quantityInput?.value);

        if (!Number.isInteger(quantity) || quantity < 1) {
            showMessage("Please enter a valid quantity.");
            return;
        }

        if (!brandingSelect || !brandingSelect.value) {
            showMessage("Please choose a branding option.");
            return;
        }

        const details = brandingSelect.value === "yes"
            ? (savedBrandingDetails || {})
            : {};

        if (brandingSelect.value === "yes" && !details.businessName) {
            pendingBrandingOrder = {
                mode: "detail",
                productId,
                quantity,
                returnScreen: currentScreen
            };

            showScreen("branding");
            showMessage("Please save your branding details first.");
            return;
        }

        addToCart(productId, quantity, brandingSelect.value, details);
        showScreen("cart");
    });
});

/* CART CHECKOUT BUTTON */

const checkoutButton = document.getElementById("checkout-button");

if (checkoutButton) {
    checkoutButton.addEventListener("click", function() {
        if (!cart.length) {
            showMessage("Your cart is empty.");
            return;
        }

        const selectedDistance =
            document.getElementById("delivery-distance")?.value;

        if (!selectedDistance) {
            showMessage("Please select your delivery distance first.");
            document.getElementById("delivery-distance")?.focus();
            return;
        }

        showScreen("checkout");
    });
}








/* =========================================
   LABELSIP: SHARED SHOP BRANDING WORKFLOW
========================================= */

let shopOrderDraft = getData("labelsip_shop_draft", { quantity300: 0, quantity1L: 0, brandingOption: "none" });
let savedBrandingDetails = getData("labelsip_branding_details", {});
let pendingBrandingOrder = null;

function updateShopOrderBar() {
    const quantity300 = Number(
        document.getElementById("quantity-300")?.value || 0
    );

    const quantity1L = Number(
        document.getElementById("quantity-1litre")?.value || 0
    );

    const total = quantity300 + quantity1L;
    const option = document.getElementById("shop-branding-option")?.value || "none";

    const countDisplay = document.getElementById("shop-selected-count");
    const summary300 = document.getElementById("shop-summary-300");
    const summary1L = document.getElementById("shop-summary-1l");
    const summaryBranding = document.getElementById("shop-summary-branding");

    if (countDisplay) {
        countDisplay.textContent = total + (
            total === 1
                ? " bottle selected for order"
                : " bottles selected for order"
        );
    }

    if (summary300) summary300.textContent = quantity300;
    if (summary1L) summary1L.textContent = quantity1L;

    if (summaryBranding) {
        summaryBranding.textContent = ({
            none: "No branding",
            "300ml": "300 ml only",
            "1litre": "1 litre only",
            both: "Both sizes"
        })[option] || "No branding";
    }
}


function restoreShopDraft() {
    const q300 = document.getElementById("quantity-300");
    const q1L = document.getElementById("quantity-1litre");
    const option = document.getElementById("shop-branding-option");
    if (q300) q300.value = shopOrderDraft.quantity300 ?? 0;
    if (q1L) q1L.value = shopOrderDraft.quantity1L ?? 0;
    if (option) option.value = shopOrderDraft.brandingOption || "none";
	updateShopOrderBar();
}

function captureShopDraft() {
    shopOrderDraft = {
        quantity300: Number(document.getElementById("quantity-300")?.value || 0),
        quantity1L: Number(document.getElementById("quantity-1litre")?.value || 0),
        brandingOption: document.getElementById("shop-branding-option")?.value || "none"
    };

    saveData("labelsip_shop_draft", shopOrderDraft);

    updateShopOrderBar();
}


["quantity-300", "quantity-1litre", "shop-branding-option"].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.addEventListener("input", captureShopDraft);
    if (field) field.addEventListener("change", captureShopDraft);
});
restoreShopDraft();


/* SHOP QUANTITY STEPPER BUTTONS */

document.querySelectorAll("[data-quantity-change]").forEach(button => {
    button.addEventListener("click", function() {
        const input = document.getElementById(
            this.dataset.quantityChange
        );

        if (!input) return;

        const current = Math.max(0, Number(input.value) || 0);
        const change = Number(this.dataset.change) || 0;

        input.value = Math.max(0, current + change);

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    });
});


/* =========================================
   OPEN BRANDING FORM WHEN CUSTOMER SELECTS
   A BRANDING OPTION IN BUILD YOUR ORDER
========================================= */

const shopBrandingOption = document.getElementById(
    "shop-branding-option"
);

if (shopBrandingOption) {

    shopBrandingOption.addEventListener("change", function() {

        captureShopDraft();

        const option = this.value;

        const quantity300 = shopOrderDraft.quantity300;
        const quantity1L = shopOrderDraft.quantity1L;

        const successNotice = document.getElementById(
            "shop-branding-success"
        );

        if (successNotice) {
            successNotice.hidden = true;
        }

        // No branding: stay on Shop.
        if (option === "none") {
            pendingBrandingOrder = null;
            return;
        }

        // Check the selected bottle quantities.
        if (
            (option === "300ml" && quantity300 < 1) ||
            (option === "1litre" && quantity1L < 1) ||
            (option === "both" &&
                (quantity300 < 1 || quantity1L < 1))
        ) {
            showMessage(
                "Please enter the quantity for every selected bottle size first."
            );

            this.value = "none";
            captureShopDraft();
            return;
        }

        pendingBrandingOrder = {
            mode: "shop",
            returnScreen: "shop"
        };

        showScreen("branding");

    });

}

function startBranding(productId) {
    const isBuilder = currentScreen === "shop";
    if (isBuilder) {
        captureShopDraft();
        const option = shopOrderDraft.brandingOption;
        const wants300 = option === "300ml" || option === "both";
        const wants1L = option === "1litre" || option === "both";
        if (!wants300 && !wants1L) {
            showMessage("No branding is selected for this order."); return;
        }
        if ((wants300 && shopOrderDraft.quantity300 < 1) || (wants1L && shopOrderDraft.quantity1L < 1)) {
            showMessage("Enter a quantity for every bottle size selected for branding."); return;
        }
        pendingBrandingOrder = { mode: "shop", returnScreen: "shop" };
    } else {
        const suffix = productId === "300ml" ? "300" : "1litre";
        const select = document.getElementById("branding-" + suffix + "-detail");
        const qty = Number(document.getElementById("quantity-" + suffix + "-detail")?.value);
        if (!select || select.value !== "yes") { showMessage("Select Yes for custom branding first."); return; }
        if (!Number.isInteger(qty) || qty < 1) { showMessage("Please enter a valid quantity first."); return; }
        pendingBrandingOrder = { mode: "detail", productId, quantity: qty, returnScreen: currentScreen };
    }
    showScreen("branding");
}

const addSelectedButton = document.getElementById("add-selected-products");
if (addSelectedButton) {
    addSelectedButton.addEventListener("click", function() {
        captureShopDraft();
        const { quantity300, quantity1L, brandingOption } = shopOrderDraft;
        if (!Number.isInteger(quantity300) || !Number.isInteger(quantity1L) || quantity300 < 0 || quantity1L < 0) {
            showMessage("Please enter valid quantities."); return;
        }
        if (quantity300 === 0 && quantity1L === 0) { showMessage("Please select at least one product."); return; }
        const brand300 = brandingOption === "300ml" || brandingOption === "both";
        const brand1L = brandingOption === "1litre" || brandingOption === "both";
        if ((brand300 && quantity300 === 0) || (brand1L && quantity1L === 0)) {
            showMessage("Your branding choice includes a bottle size with zero quantity."); return;
        }
        if ((brand300 || brand1L) && !savedBrandingDetails.businessName) {
            pendingBrandingOrder = { mode: "shop", returnScreen: "shop" };
            showScreen("branding");
            showMessage("Fill in your branding details once, then return to add your products."); return;
        }
        if (quantity300 > 0) addToCart("300ml", quantity300, brand300 ? "yes" : "no", brand300 ? savedBrandingDetails : {});
        if (quantity1L > 0) addToCart("1litre", quantity1L, brand1L ? "yes" : "no", brand1L ? savedBrandingDetails : {});
        shopOrderDraft = { quantity300: 0, quantity1L: 0, brandingOption: "none" };
        saveData("labelsip_shop_draft", shopOrderDraft); restoreShopDraft();
        showScreen("cart");
    });
}




















/* =========================================
   PART 5: WISHLIST
========================================= */


/* =========================================
   SAVE WISHLIST
========================================= */

function saveWishlist() {

    saveData("labelsip_wishlist", wishlist);

}


/* =========================================
   ADD PRODUCT TO WISHLIST
========================================= */


function addToWishlist(productId, quantity = 1) {

    const product = products[productId];

    if (!product) return;

    const existing = wishlist.find(item => item.id === productId);

    if (existing) {
        existing.quantity = quantity;
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            image: product.image,
            quantity: quantity
        });
    }

    saveWishlist();
    renderWishlist();
    showMessage("Product added to wishlist.");
}



/* =========================================
   REMOVE FROM WISHLIST
========================================= */

function removeFromWishlist(productId) {

    wishlist = wishlist.filter(item => {

        return item.id !== productId;

    });


    saveWishlist();

    renderWishlist();

}



/* =========================================
   TOGGLE PREMIUM WISHLIST HEART
========================================= */

function toggleWishlist(productId, button) {

    const alreadySaved = wishlist.some(item => item.id === productId);

    if (alreadySaved) {
        removeFromWishlist(productId);
        showMessage("Product removed from wishlist.");
    } else {

        let quantity = 0;

        if (currentScreen === "shop") {
            const inputId = productId === "300ml"
                ? "quantity-300"
                : "quantity-1litre";

            quantity = Number(document.getElementById(inputId)?.value || 0);

        } else if (currentScreen === "cart") {
            quantity = Number(cart.find(item => item.id === productId)?.quantity || 0);

        } else {
            const suffix = productId === "300ml" ? "300" : "1litre";

            quantity = Number(
                document.getElementById("quantity-" + suffix + "-detail")?.value || 0
            );
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            showMessage("Please enter a quantity before adding to wishlist.");
            return;
        }

        addToWishlist(productId, quantity);
    }

    updateWishlistButtons();
}


/* RESTORE HEART APPEARANCE */

function updateWishlistButtons() {
    document.querySelectorAll(".wishlist-toggle").forEach(button => {
        const productId = button.dataset.product;
        const isSaved = wishlist.some(item => item.id === productId);

        button.classList.toggle("active", isSaved);
        button.textContent = isSaved ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(isSaved));
    });
}

updateWishlistButtons();




/* =========================================
   DISPLAY WISHLIST
========================================= */

function renderWishlist() {

    const wishlistContainer = document.getElementById("wishlist-items");

    if (!wishlistContainer) return;

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistContainer.textContent = "Your wishlist is currently empty.";
        return;
    }

    wishlist.forEach(item => {

        const card = document.createElement("div");
        card.className = "wishlist-product";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;
        image.width = 100;

        const title = document.createElement("h3");
        title.textContent = item.name;

        const quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + (item.quantity || 1);

        const moveButton = document.createElement("button");
        moveButton.type = "button";
        moveButton.textContent = "MOVE TO CART";
        moveButton.className = "button button-primary";

        moveButton.addEventListener("click", () => {

            addToCart(item.id, item.quantity || 1, "no", {});

            removeFromWishlist(item.id);

            showScreen("cart");

            showMessage("Product moved to cart.");
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "REMOVE";

        removeButton.addEventListener("click", () => {
            removeFromWishlist(item.id);
        });

        card.append(image, title, quantity, moveButton, removeButton);

        wishlistContainer.appendChild(card);

    });

}



/* =========================================
   WISHLIST INITIAL DISPLAY
========================================= */

renderWishlist();







/* =========================================
   PART 6: BRANDING FORM
========================================= */

const brandingForm = document.getElementById("branding-form");
if (brandingForm) {
    brandingForm.addEventListener("submit", function(event) {
        event.preventDefault();
        if (!pendingBrandingOrder) { showMessage("Please start branding from your order."); return; }
        const businessName = document.getElementById("business-name").value.trim();
        const logoFile = document.getElementById("logo-upload").files[0];
        const labelStyle = document.getElementById("label-style").value;
        const notes = document.getElementById("branding-notes").value.trim();
        if (!businessName) { showMessage("Please enter your business name."); return; }
        if (logoFile) {
            if (!["image/png", "image/jpeg", "image/svg+xml"].includes(logoFile.type)) {
                showMessage("Please upload PNG, JPG or SVG."); return;
            }
            if (logoFile.size > 5 * 1024 * 1024) { showMessage("Logo must be below 5 MB."); return; }
        }
        savedBrandingDetails = { businessName, labelStyle, notes, logoFileName: logoFile ? logoFile.name : "" };
        saveData("labelsip_branding_details", savedBrandingDetails);
        
		const completedOrder = pendingBrandingOrder;

const returnScreen = completedOrder.returnScreen || "shop";

pendingBrandingOrder = null;

showScreen(returnScreen);

if (completedOrder.mode === "shop") {

    restoreShopDraft();

    const successNotice = document.getElementById(
        "shop-branding-success"
    );

    if (successNotice) {

        successNotice.textContent =
            "Your branding details successfully added.";

        successNotice.hidden = false;

    }

}

showMessage("Your branding details are saved successfully!");
		
    });
}


/* =========================================
   CUSTOMER LOGIN AND REGISTRATION
========================================= */

const customerLoginForm = document.getElementById("login-form");

if (customerLoginForm) {
    customerLoginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        showMessage(
            "Customer login will be available after secure account setup."
        );
    });
}

const customerRegisterForm = document.getElementById("register-form");

if (customerRegisterForm) {
    customerRegisterForm.addEventListener("submit", function(event) {
        event.preventDefault();

        showMessage(
            "Account creation will be available after secure account setup."
        );
    });
}


/* =========================================
   PART 7: CONTACT FORM
========================================= */

const contactForm = document.getElementById("contact-form");


if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const name = document.getElementById(
            "contact-name"
        ).value.trim();


        const phone = document.getElementById(
            "contact-phone"
        ).value.trim();


        const email = document.getElementById(
            "contact-email"
        ).value.trim();


        const message = document.getElementById(
            "contact-message"
        ).value.trim();


        if (!name || !phone || !message) {

            showMessage("Please complete all required fields.");

            return;

        }


        if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {

            showMessage("Please enter a valid phone number.");

            return;

        }


        const contactDetails = {

            name: name,

            phone: phone,

            email: email,

            message: message

        };


        console.log(
            "Contact enquiry demonstration:",
            contactDetails
        );


        showMessage(
            "Form checked. Enquiry sending will be connected to the backend later."
        );

        contactForm.reset();

    });

}










/* =========================================
   PART 8: CHECKOUT FORM
========================================= */

const checkoutForm = document.getElementById("checkout-form");


if (checkoutForm) {

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();


        if (cart.length === 0) {

            showMessage("Please add products to your cart.");

            return;

        }


        const businessName = document.getElementById(
            "checkout-business"
        ).value.trim();


        const customerName = document.getElementById(
            "checkout-customer"
        ).value.trim();


        const phone = document.getElementById(
            "checkout-phone"
        ).value.trim();


        const email = document.getElementById(
            "checkout-email"
        ).value.trim();


        const address = document.getElementById(
            "checkout-address"
        ).value.trim();


        const notes = document.getElementById(
            "checkout-notes"
        ).value.trim();


        if (!businessName || !customerName || !phone || !address) {

            showMessage("Please complete all required details.");

            return;

        }


        const checkoutDetails = {

            businessName: businessName,

            customerName: customerName,

            phone: phone,

            email: email,

            address: address,

            notes: notes,

            products: cart

        };


        console.log(
            "Checkout demonstration:",
            checkoutDetails
        );


        showMessage(
            "Details validated. Real order submission will be enabled after backend connection."
        );

    });

}


/* =========================================
   PART 9: ORDER STATUS LOOKUP
========================================= */

const orderLookupForm = document.getElementById(
    "order-lookup-form"
);


if (orderLookupForm) {

    orderLookupForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const orderNumber = document.getElementById(
            "order-number"
        ).value.trim();


        const phone = document.getElementById(
            "order-phone"
        ).value.trim();


        const result = document.getElementById(
            "order-result"
        );


        if (!orderNumber || !phone) {

            showMessage("Enter your order number and phone number.");

            return;

        }


        if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {

            showMessage("Please enter a valid phone number.");

            return;

        }


        result.textContent =
            "Order tracking will be available after the secure database connection is completed.";


        showMessage("Order lookup form checked.");

    });

}








/* =========================================
   PART 10: ADMIN LOGIN FORM
========================================= */

const adminLoginForm = document.getElementById(
    "admin-login-form"
);


if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const email = document.getElementById(
            "admin-email"
        ).value.trim();


        const password = document.getElementById(
            "admin-password"
        ).value;


        if (!email || !password) {

            showMessage("Enter your admin login details.");

            return;

        }


        showMessage(
            "Secure admin authentication will be connected through Supabase."
        );

    });

}


/* =========================================
   PART 11: PAYMENT RECEIPT BUTTON
========================================= */

const receiptButton = document.getElementById(
    "download-receipt"
);


if (receiptButton) {

    receiptButton.addEventListener("click", function() {

        showMessage(
            "Payment receipts will be available after payment verification and backend setup."
        );

    });

}


/* =========================================
   PART 12: INVOICE BUTTON
========================================= */

const invoiceButton = document.getElementById(
    "download-invoice"
);


if (invoiceButton) {

    invoiceButton.addEventListener("click", function() {

        showMessage(
            "Invoices will be generated after the real order system is connected."
        );

    });

}











/* =========================================
   PART 13: WEBSITE INITIALIZATION
========================================= */


/* =========================================
   INITIALIZE CART
========================================= */

function initializeCart() {

    updateCartCount();

    renderCart();

}


/* =========================================
   INITIALIZE WISHLIST
========================================= */

function initializeWishlist() {

    renderWishlist();

}


/* =========================================
   INITIALIZE WEBSITE
========================================= */

function initializeWebsite() {

    initializeNavigation();

    initializeCart();

    initializeWishlist();


    console.log(
        "LabelSip frontend initialized successfully."
    );

}


/* =========================================
   REMOVE PAGE LOADER
========================================= */

function hidePageLoader() {

    if (!loader) return;

    loader.style.opacity = "0";

    loader.style.transition = "opacity 0.5s ease";


    setTimeout(() => {

        loader.style.display = "none";

    }, 300);

}


/* =========================================
   START WEBSITE
========================================= */

document.addEventListener("DOMContentLoaded", function() {

    initializeWebsite();

});


/* =========================================
   LOADER SAFETY
========================================= */

window.addEventListener("load", function() {

    hidePageLoader();

});


/* =========================================
   LOADER BACKUP
========================================= */

setTimeout(function() {

    hidePageLoader();

}, 4000);
