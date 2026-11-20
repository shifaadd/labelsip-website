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

if (getData("labelsip_cart_pricing_version", "") !== "box-pricing-2026-11") {
    cart = [];
    saveData("labelsip_cart", cart);
    saveData("labelsip_cart_pricing_version", "box-pricing-2026-11");
}

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
    "300ml": {
        id: "300ml",
        name: "300 ML BOTTLE",
        image: "images/bottle-300ml.png",
        pricePerBox: 190,
        bottlesPerBox: 30,
        moq: 250
    },
    "500ml": {
        id: "500ml",
        name: "500 ML BOTTLE",
        image: "images/bottle-500ml.png",
        pricePerBox: 200,
        bottlesPerBox: 24,
        moq: 40
    },
    "1litre": {
        id: "1litre",
        name: "1 LITRE BOTTLE",
        image: "images/bottle-1litre.png",
        pricePerBox: 195,
        bottlesPerBox: 12,
        moq: 40
    }
};

function money(amount) {
    return "₹" + Number(amount).toFixed(2);
}

function getBottlePrice(item) {
    return products[item.id]?.pricePerBox || 0;
}

function getMinimumBoxes(productId) {
    return products[productId]?.moq || 0;
}

function validateBoxQuantity(productId, quantity, showNotice = true) {
    const moq = getMinimumBoxes(productId);
    if (!Number.isInteger(quantity) || quantity < 0) {
        if (showNotice) showMessage("Please enter a valid number of boxes.");
        return false;
    }
    if (quantity > 0 && quantity < moq) {
        if (showNotice) showMessage("Minimum order for " + products[productId].name + " is " + moq + " boxes. Please enter " + moq + " boxes or more.");
        return false;
    }
    return true;
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

    if (!validateBoxQuantity(productId, quantity)) return;
    if (quantity === 0) return;

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

    const nextQuantity = Number(item.quantity) + change;
    const moq = getMinimumBoxes(item.id);

    if (nextQuantity < moq) {
        showMessage("Minimum order for " + item.name + " is " + moq + " boxes. Use Remove to remove this size from your cart.");
        return;
    }

    item.quantity = nextQuantity;

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
        price.textContent = money(unitPrice) + " per box";

        const lineTotal = document.createElement("p");
        lineTotal.className = "cart-line-total";
        lineTotal.textContent =
            "Boxes: " + item.quantity + " · Line total: " + money(unitPrice * Number(item.quantity));

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
    const total = cart.reduce(
        (sum, item) =>
            sum + getBottlePrice(item) * Number(item.quantity || 0),
        0
    );

    const subtotalNode = document.getElementById("cart-subtotal");
    const grandNode = document.getElementById("cart-grand-total");

    if (subtotalNode) subtotalNode.textContent = money(total);
    if (grandNode) grandNode.textContent = money(total);
}

/* CONNECT EXISTING PRODUCT-DETAIL ADD-TO-CART BUTTONS */

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function() {
        const productId = this.dataset.product;
       const suffix = {
    "300ml": "300",
    "500ml": "500",
    "1litre": "1litre"
}[productId];

        const quantityInput = document.getElementById(
            "quantity-" + suffix + "-detail"
        );

        const brandingSelect = document.getElementById(
            "branding-" + suffix + "-detail"
        );

        const quantity = Number(quantityInput?.value);

        if (!validateBoxQuantity(productId, quantity)) return;
        if (quantity === 0) {
            showMessage("Please enter the number of boxes you want to order.");
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

        showScreen("checkout");
    });
}






/* =========================================
   LABELSIP: SHARED SHOP BRANDING WORKFLOW
========================================= */

let shopOrderDraft = getData("labelsip_shop_draft", {
    quantity300: 250,
    quantity500: 40,
    quantity1L: 40,
    brandingOption: "none"
});

let savedBrandingDetails = getData("labelsip_branding_details", {});
let pendingBrandingOrder = null;


/* GET SELECTED BRANDING SIZES */

function getBrandedSizes(option) {
    if (!option || option === "none") return [];

    return option.split(",");
}


/* UPDATE SHOP SUMMARY */

function updateShopOrderBar() {
    const quantity300 = Number(document.getElementById("quantity-300")?.value || 0);
    const quantity500 = Number(document.getElementById("quantity-500")?.value || 0);
    const quantity1L = Number(document.getElementById("quantity-1litre")?.value || 0);

    const total = quantity300 + quantity500 + quantity1L;

    const option = document.getElementById("shop-branding-option")?.value || "none";

    const countDisplay = document.getElementById("shop-selected-count");
    const summary300 = document.getElementById("shop-summary-300");
    const summary500 = document.getElementById("shop-summary-500");
    const summary1L = document.getElementById("shop-summary-1l");
    const summaryBranding = document.getElementById("shop-summary-branding");

    if (countDisplay) {
        countDisplay.textContent = total + (
            total === 1
                ? " box selected for order"
                : " boxes selected for order"
        );
    }

    if (summary300) summary300.textContent = quantity300;
    if (summary500) summary500.textContent = quantity500;
    if (summary1L) summary1L.textContent = quantity1L;

    if (summaryBranding) {
        const labels = getBrandedSizes(option).map(size => ({
            "300ml": "300 ml",
            "500ml": "500 ml",
            "1litre": "1 litre"
        })[size]).filter(Boolean);

        summaryBranding.textContent = labels.length
            ? labels.join(" + ")
            : "No branding";
    }
}


/* RESTORE SAVED SHOP SELECTION */

function restoreShopDraft() {
    const q300 = document.getElementById("quantity-300");
    const q500 = document.getElementById("quantity-500");
    const q1L = document.getElementById("quantity-1litre");
    const option = document.getElementById("shop-branding-option");

    const quantity300 = Number(shopOrderDraft.quantity300);
    const quantity500 = Number(shopOrderDraft.quantity500);
    const quantity1L = Number(shopOrderDraft.quantity1L);

    shopOrderDraft.quantity300 =
        Number.isInteger(quantity300) && quantity300 >= 250 ? quantity300 : 250;

    shopOrderDraft.quantity500 =
        Number.isInteger(quantity500) && quantity500 >= 40 ? quantity500 : 40;

    shopOrderDraft.quantity1L =
        Number.isInteger(quantity1L) && quantity1L >= 40 ? quantity1L : 40;

    if (q300) q300.value = shopOrderDraft.quantity300;
    if (q500) q500.value = shopOrderDraft.quantity500;
    if (q1L) q1L.value = shopOrderDraft.quantity1L;

    if (option) option.value = shopOrderDraft.brandingOption || "none";

    saveData("labelsip_shop_draft", shopOrderDraft);
    updateShopOrderBar();
}


/* SAVE SHOP SELECTION */

function captureShopDraft() {
    shopOrderDraft = {
        quantity300: Number(document.getElementById("quantity-300")?.value || 0),
        quantity500: Number(document.getElementById("quantity-500")?.value || 0),
        quantity1L: Number(document.getElementById("quantity-1litre")?.value || 0),
        brandingOption: document.getElementById("shop-branding-option")?.value || "none"
    };

    saveData("labelsip_shop_draft", shopOrderDraft);
    updateShopOrderBar();
}


/* CONNECT SHOP INPUTS */

const shopQuantityRules = {
    "quantity-300": { productId: "300ml", label: "300 ml" },
    "quantity-500": { productId: "500ml", label: "500 ml" },
    "quantity-1litre": { productId: "1litre", label: "1 litre" }
};

[
    "quantity-300",
    "quantity-500",
    "quantity-1litre",
    "shop-branding-option"
].forEach(id => {
    const field = document.getElementById(id);

    if (field) {
        field.addEventListener("input", captureShopDraft);

        field.addEventListener("change", function() {
            const rule = shopQuantityRules[id];

            if (rule) {
                const minimum = getMinimumBoxes(rule.productId);
                const quantity = Number(this.value);

                if (!Number.isInteger(quantity) || quantity < minimum) {
                    this.value = minimum;

                    showMessage(
                        "Minimum order for " + rule.label + " is " +
                        minimum + " boxes. Please enter " +
                        minimum + " boxes or more."
                    );
                }
            }

            captureShopDraft();
        });
    }
});

restoreShopDraft();




/* SHOP QUANTITY STEPPER BUTTONS */

document.querySelectorAll("[data-quantity-change]").forEach(button => {
    button.addEventListener("click", function() {
        const input = document.getElementById(this.dataset.quantityChange);

        if (!input) return;

        const current = Math.max(0, Number(input.value) || 0);
        const change = Number(this.dataset.change) || 0;
        const step = Number(input.step) || 1;

        input.value = Math.max(0, current + (change * step));

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    });
});


/* OPEN BRANDING FORM */

const shopBrandingOption = document.getElementById("shop-branding-option");

if (shopBrandingOption) {
    shopBrandingOption.addEventListener("change", function() {
        captureShopDraft();

        const selectedSizes = getBrandedSizes(this.value);

        const successNotice = document.getElementById("shop-branding-success");

        if (successNotice) successNotice.hidden = true;

        if (!selectedSizes.length) {
            pendingBrandingOrder = null;
            return;
        }

        const quantities = {
            "300ml": shopOrderDraft.quantity300,
            "500ml": shopOrderDraft.quantity500,
            "1litre": shopOrderDraft.quantity1L
        };

        const missingQuantity = selectedSizes.some(size => quantities[size] < 1);

        if (missingQuantity) {
            showMessage("Please enter a quantity for every bottle size selected for branding.");

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


/* START BRANDING */

function startBranding(productId) {
    const isBuilder = currentScreen === "shop";

    if (isBuilder) {
        captureShopDraft();

        const selectedSizes = getBrandedSizes(shopOrderDraft.brandingOption);

        if (!selectedSizes.length) {
            showMessage("No branding is selected for this order.");
            return;
        }

        const quantities = {
            "300ml": shopOrderDraft.quantity300,
            "500ml": shopOrderDraft.quantity500,
            "1litre": shopOrderDraft.quantity1L
        };

        if (selectedSizes.some(size => quantities[size] < 1)) {
            showMessage("Enter a quantity for every bottle size selected for branding.");
            return;
        }

        pendingBrandingOrder = {
            mode: "shop",
            returnScreen: "shop"
        };

    } else {
        const suffix = {
            "300ml": "300",
            "500ml": "500",
            "1litre": "1litre"
        }[productId];

        const select = document.getElementById("branding-" + suffix + "-detail");

        const qty = Number(
            document.getElementById("quantity-" + suffix + "-detail")?.value
        );

        if (!select || select.value !== "yes") {
            showMessage("Select Yes for custom branding first.");
            return;
        }

        if (!validateBoxQuantity(productId, qty) || qty === 0) {
            if (qty === 0) showMessage("Please enter the number of boxes first.");
            return;
        }

        pendingBrandingOrder = {
            mode: "detail",
            productId,
            quantity: qty,
            returnScreen: currentScreen
        };
    }

    showScreen("branding");
}


/* ADD SELECTED PRODUCTS TO CART */

const addSelectedButton = document.getElementById("add-selected-products");

if (addSelectedButton) {
    addSelectedButton.addEventListener("click", function() {
        captureShopDraft();

        const {
            quantity300,
            quantity500,
            quantity1L,
            brandingOption
        } = shopOrderDraft;

        const quantities = {
            "300ml": quantity300,
            "500ml": quantity500,
            "1litre": quantity1L
        };

        for (const productId of Object.keys(quantities)) {
            if (!validateBoxQuantity(productId, quantities[productId])) return;
        }

        if (Object.values(quantities).every(q => q === 0)) {
            showMessage("Please select at least one product.");
            return;
        }

        const brandedSizes = getBrandedSizes(brandingOption);

        if (brandedSizes.some(size => quantities[size] < 1)) {
            showMessage("Your branding choice includes a bottle size with zero quantity.");
            return;
        }

        if (brandedSizes.length && !savedBrandingDetails.businessName) {
            pendingBrandingOrder = {
                mode: "shop",
                returnScreen: "shop"
            };

            showScreen("branding");
            showMessage("Fill in your branding details once, then return to add your products.");
            return;
        }

        Object.keys(quantities).forEach(productId => {
            const quantity = quantities[productId];

            if (quantity > 0) {
                const isBranded = brandedSizes.includes(productId);

                addToCart(
                    productId,
                    quantity,
                    isBranded ? "yes" : "no",
                    isBranded ? savedBrandingDetails : {}
                );
            }
        });

        shopOrderDraft = {
    quantity300: 250,
    quantity500: 40,
    quantity1L: 40,
    brandingOption: "none"
};

        saveData("labelsip_shop_draft", shopOrderDraft);

        restoreShopDraft();
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

        const suffix = {
            "300ml": "300",
            "500ml": "500",
            "1litre": "1litre"
        }[productId];

        if (currentScreen === "shop") {
            quantity = Number(
                document.getElementById("quantity-" + suffix)?.value || 0
            );
        } else if (currentScreen === "cart") {
            quantity = Number(
                cart.find(item => item.id === productId)?.quantity || 0
            );
        } else {
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
   PART 8: CHECKOUT FORM → WHATSAPP
========================================= */

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault();

        if (cart.length === 0) {
            showMessage("Please add products to your cart.");
            return;
        }

        const businessName = document.getElementById("checkout-business").value.trim();
        const customerName = document.getElementById("checkout-customer").value.trim();
        const phone = document.getElementById("checkout-phone").value.trim();
        const email = document.getElementById("checkout-email").value.trim();
        const address = document.getElementById("checkout-address").value.trim();
        const notes = document.getElementById("checkout-notes").value.trim();

        if (!businessName || !customerName || !phone || !address) {
            showMessage("Please complete all required details.");
            return;
        }

        // Calculate total using the price per box.
        const subtotal = cart.reduce(
            (sum, item) =>
                sum + getBottlePrice(item) * Number(item.quantity || 0),
            0
        );

        const grandTotal = subtotal;

        // Build WhatsApp order message.
        let message = `*LABELSIP — NEW ORDER*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

        message += `*CUSTOMER DETAILS*\n`;
        message += `Business Name: ${businessName}\n`;
        message += `Contact Person: ${customerName}\n`;
        message += `Phone: ${phone}\n`;

        if (email) message += `Email: ${email}\n`;

        message += `Delivery Address: ${address}\n\n`;
        message += `*ORDER ITEMS (BOXES)*\n`;

        cart.forEach(item => {
            const pricePerBox = getBottlePrice(item);
            const lineTotal = pricePerBox * Number(item.quantity);

            message += `• ${item.name}\n`;
            message += `  Boxes: ${item.quantity}\n`;
            message += `  Price per box: ${money(pricePerBox)}\n`;
            message += `  Line total: ${money(lineTotal)}\n`;
        });

        message += `\n*ORDER SUMMARY*\n`;
        message += `*GRAND TOTAL: ${money(grandTotal)}*\n`;
        message += `GST and delivery charges are included in the box prices.\n\n`;

        // CUSTOM BRANDING — ONLY IF SELECTED
        const brandedItems = cart.filter(item => item.branding === "yes");

        if (brandedItems.length > 0) {
            message += `*CUSTOM BRANDING DETAILS*\n`;

            brandedItems.forEach(item => {
                const details = item.brandingDetails || {};

                message += `\nBottle: ${item.name}\n`;
                message += `Branding: Yes\n`;
                message += `Business Name: ${details.businessName || businessName}\n`;
                message += `Label Style: ${details.labelStyle || "Not specified"}\n`;
                message += `Instructions: ${details.notes || "None"}\n`;
                message += `Logo: ${details.logoFileName || "Not uploaded"}\n`;
            });

            message += `\n`;
        }

        // ORDER NOTES
        if (notes) {
            message += `*CUSTOMER ORDER NOTES*\n${notes}\n\n`;
        }

        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `Order received through LabelSip website`;

        // Owner's WhatsApp number
        const ownerWhatsApp = "917996866953";

        // Open WhatsApp with the complete order
        const whatsappURL =
            `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(message)}`;

        window.location.href = whatsappURL;
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
