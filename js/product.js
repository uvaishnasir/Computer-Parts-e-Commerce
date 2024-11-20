const cart = new Map();
document.addEventListener("DOMContentLoaded", function () {
  const headerCart = document.querySelector(".header-cart-link");
  const mobileCart = document.querySelector(".mobile-header-cart");
  const cartPanel = document.querySelector(".cart-panel");
  const cartItemsList = document.getElementById("cart-items");
  //toggle mobile navigation
  document.querySelector(".menu-toggle").addEventListener("click", () => {
    document.querySelector(".mobile-navigation").classList.toggle("active");
  });
  //close cart-panel
  document.getElementById("close-cart").addEventListener("click", () => {
    cartPanel.classList.remove("active");
    cartPanel.classList.remove("open");
  });
  //close cart by clicking outside the cart.
  document.addEventListener("click", (event) => {
    const isCartClick =
      headerCart.contains(event.target) ||
      cartPanel.contains(event.target) ||
      event.target.closest(".increase-quantity-btn") ||
      event.target.closest(".decrease-quantity-btn") ||
      event.target.closest(".delete-item-btn") ||
      event.target.closest(".add-to-cart");

    if (!isCartClick) {
      cartPanel.classList.remove("active");
    }
  });
  //Open cart-panel in desktop view
  headerCart.addEventListener("click", () => {
    cartPanel.classList.add("active");
    updateCart();
  });
  //Open cart-panel in mobile view
  mobileCart.addEventListener("click", () => {
    cartPanel.classList.add("open");
    updateCart();
  });

  //update cart count badge
  function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    const cartCountMobile = document.getElementById("cart-count-mobile");
    let totalItems = 0;

    cart.forEach((item) => (totalItems += item.quantity));
    cartCountElement.textContent = totalItems;
    cartCountMobile.textContent = totalItems;
  }
  //calculate subTotal of the cart
  function calculateSubtotal() {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.quantity * item.price;
    });
    return subtotal;
  }

  function updateCart() {
    updateCartCount();
    cartItemsList.innerHTML = "";
    if (cart.size === 0) {
      const emptyCartImg = document.createElement("img");
      emptyCartImg.src = "./assets/emptyCart.png";
      emptyCartImg.alt = "Empty Cart Image";
      emptyCartImg.style.width = "120px";
      emptyCartImg.style.display = "block";
      emptyCartImg.style.margin = "25px auto";

      const emptyMessage = document.createElement("div");
      emptyMessage.textContent = "SHOPPING CART IS EMPTY!";
      emptyMessage.style.textAlign = "center";

      cartItemsList.appendChild(emptyCartImg);
      cartItemsList.appendChild(emptyMessage);
    } else {
      cart.forEach((item, id) => {
        const li = document.createElement("li");
        li.classList.add("cart-item");
        li.innerHTML = `
          <div class="cart-item-info">
            <img src="${item.image}" alt="${item.alt}" class="cart-item-img" />
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">
                <span class="cart-item-mrp">$${item.mrp}</span>
                <span>$${item.price}</span>
                <span class="cart-item-discount">${item.discount}% OFF</span>
              </div>

              <div class="cart-item-offers">2 Offers Available</div>
            </div>
            <button class="delete-item-btn" data-id="${id}">
              <i class="bi bi-x-circle"></i>
            </button>
          </div>
          <div class="quantity-controls">
            <button class="decrease-quantity-btn" data-id="${id}">-</button>
            <div>${item.quantity}</div>
            <button class="increase-quantity-btn" data-id="${id}">+</button>
          </div>
        `;
        cartItemsList.appendChild(li);
      });

      // Updated Subtotal Section
      const subTotal = document.createElement("div");
      subTotal.classList.add("cart-subtotal");
      subTotal.innerHTML = `
        <div class="subtotal-row">
          <span class="delivery-charge-label">Delivery Charge:</span>
          <span class="delivery-charge">$0</span>
        </div>
        <div class="subtotal-row">
          <span>Subtotal:</span>
          <span class="subtotal-amount">$${calculateSubtotal()}</span>
        </div>
        <div class="delivery-note">Free delivery on orders over $50!</div>
        <div class="delivery-date">Estimated Delivery: 3-5 days</div>
      `;
      cartItemsList.appendChild(subTotal);

      // Checkout Button
      const checkoutBtn = document.createElement("button");
      checkoutBtn.textContent = "Proceed to Checkout";
      checkoutBtn.classList.add("checkout-btn");
      cartItemsList.appendChild(checkoutBtn);

      updateQuantityEventListeners();
    }
  }

  function updateQuantityEventListeners() {
    document.querySelectorAll(".increase-quantity-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"), 10);
        const cartItem = cart.get(productId);
        cartItem.quantity++;
        updateCart();
        const addToCartButton = document.querySelector(".add-to-cart-btn");
        addToCartButton.textContent = `${cartItem.quantity} added in cart`;
      });
    });

    document.querySelectorAll(".decrease-quantity-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"), 10);
        const cartItem = cart.get(productId);
        const addToCartButton = document.querySelector(".add-to-cart-btn");
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
          addToCartButton.textContent = `${cartItem.quantity} added in cart`;
        } else {
          cart.delete(productId);
          addToCartButton.textContent = "Add to Cart";
        }
        updateCart();
      });
    });

    document.querySelectorAll(".delete-item-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"), 10);
        cart.delete(productId);
        updateCart();
        const addToCartButton = document.querySelector(".add-to-cart-btn");
        addToCartButton.textContent = "Add to Cart";
      });
    });
  }

  // Add event on "Add to Cart" button
  const addToCartButton = document.querySelector(".add-to-cart-btn");
  addToCartButton.addEventListener("click", function () {
    const productId = 5; // Assuming the ID of the product is 5
    const productName = "ASUS ROG Strix Gaming Motherboard";
    const productPrice = 199;
    const mrp = 249;
    const discount = 20;
    const productImage = "assets/products/part5.png";
    const productAlt = "Motherboard";

    // Check if the product is already in the cart
    if (cart.has(productId)) {
      // If it exists, increase the quantity
      const cartItem = cart.get(productId);
      cartItem.quantity++;
    } else {
      // If it doesn't exist, add it with quantity 1
      cart.set(productId, {
        id: productId,
        name: productName,
        price: productPrice,
        mrp: mrp,
        discount: discount,
        image: productImage,
        alt: productAlt,
        quantity: 1,
      });
    }
    // Update the button text and cart display
    addToCartButton.textContent = `${
      cart.get(productId).quantity
    } added in cart`;
    updateCart();
  });
});
