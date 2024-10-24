let products = [];
let cart = new Map(); // Key: product ID, Value: { product details and quantity }

document.addEventListener("DOMContentLoaded", function () {
  // Product grid container
  const productGrid = document.getElementById("product-grid");

  // Fetch products from the products.JSON file
  fetch("products.json")
    .then((response) => response.json())
    .then((fetchedProducts) => {
      products = fetchedProducts; // Store fetched products in the global array
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.setAttribute("data-id", product.id);
        productCard.innerHTML = `
                <img src="${product.image}" alt="${product.alt}" />
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button class="add-to-cart">Add to Cart</button>
            `;
        productGrid.appendChild(productCard);
      });

      // Attach event listeners to dynamically created "Add to Cart" buttons
      const addToCartButtons = document.querySelectorAll(".add-to-cart");
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const productId =
            this.closest(".product-card").getAttribute("data-id");
          const product = products.find((p) => p.id == productId);

          // Check if item already exists in the cart
          if (cart.has(product.id)) {
            const cartItem = cart.get(product.id);
            cartItem.quantity++;
          } else {
            cart.set(product.id, { ...product, quantity: 1 }); // Add new product with quantity 1
          }
          const cartItem = cart.get(product.id);
          button.textContent = `${cartItem.quantity} added in Cart`;
          updateCart();
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      document.getElementById("error-message").textContent =
        "Failed to load products, please try again later.";
    });

  // Menu toggle event listener
  document.querySelector(".menu-toggle").addEventListener("click", function () {
    const nav = document.querySelector(".mobile-navigation");
    nav.classList.toggle("active");
  });

  // Get references to element of cat panel and header-cart-link and cart-items ul inside cart-panel
  const headerCart = document.querySelector(".header-cart-link");
  const cartPanel = document.querySelector(".cart-panel");
  const cartItemsList = document.getElementById("cart-items");

  document.getElementById("close-cart").addEventListener("click", function () {
    cartPanel.classList.remove("active"); // Hide the cart panel
  });

  // Event listener to toggle the cart
  headerCart.addEventListener("click", function () {
    cartPanel.classList.toggle("active"); // Toggle the active class
    updateCart();
  });

  // Close cart when clicking outside of it (but exclude actions within the cart like increasing/decreasing/deleting items)
  document.addEventListener("click", function (event) {
    const isCartClick =
      headerCart.contains(event.target) || // Clicking on the header cart
      cartPanel.contains(event.target) || // Clicking inside the cart panel
      event.target.closest(".increase-quantity-btn") || // Clicking increase quantity
      event.target.closest(".decrease-quantity-btn") || // Clicking decrease quantity
      event.target.closest(".delete-item-btn"); // Clicking delete item

    if (!isCartClick) {
      cartPanel.classList.remove("active"); // Close cart if it's an outside click
    }
  });

  // Update cart count
  function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    let totalItems = 0;

    cart.forEach((item) => {
      totalItems += item.quantity; // Update total with quantity
    });
    cartCountElement.textContent = totalItems;
  }

  // Calculate subtotal
  function calculateSubtotal() {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.quantity * item.price;
    });
    return subtotal;
  }

  // Update cart items to display
  function updateCart() {
    updateCartCount(); // Update the cart count whenever the cart is updated

    // Clear the cart items list before updating
    cartItemsList.innerHTML = "";

    // Check if the cart is empty
    if (cart.size === 0) {
      // Create and add the empty cart image only if it doesn't exist
      const emptyCartImg = document.createElement("img");
      emptyCartImg.src = "./assets/emptyCart.png";
      emptyCartImg.alt = "Empty Cart Image";
      emptyCartImg.style.width = "120px";
      emptyCartImg.style.display = "block";
      emptyCartImg.style.margin = "25px auto";

      // Create and add the empty message
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "SHOPPING CART IS EMPTY!";
      emptyMessage.style.textAlign = "center"; // Center the message

      cartItemsList.appendChild(emptyCartImg); // Append the image first
      cartItemsList.appendChild(emptyMessage); // Then append the message
    } else {
      cart.forEach((item, id) => {
        const li = document.createElement("li");
        li.classList.add("cart-item");

        // Add product image and name
        li.innerHTML = `
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.alt}" class="cart-item-img" />
          ${item.name} - $${item.price}
          <button class="delete-item-btn" data-id="${id}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="quantity-controls">
          <button class="decrease-quantity-btn" data-id="${id}">-</button>
          <div>${item.quantity}</div>
          <button class="increase-quantity-btn" data-id="${id}">+</button>
        </div>
      `;
        cartItemsList.appendChild(li); // Append each item to the list
      });

      // Subtotal container
      const subTotal = document.createElement("div");
      subTotal.classList.add("cart-subtotal");
      const subTotalLabel = document.createElement("span");
      subTotalLabel.textContent = "Subtotal:";
      const subTotalValue = document.createElement("span");
      subTotalValue.textContent = "$" + calculateSubtotal();

      // Append both spans to the subtotal container
      subTotal.appendChild(subTotalLabel);
      subTotal.appendChild(subTotalValue);
      cartItemsList.appendChild(subTotal);

      // Checkout button
      const checkoutBtn = document.createElement("button");
      checkoutBtn.textContent = "Checkout";
      checkoutBtn.classList.add("checkout-btn");
      cartItemsList.appendChild(checkoutBtn);
    }

    // Add event listener to all delete buttons
    const deleteButtons = document.querySelectorAll(".delete-item-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        cart.delete(parseInt(id)); // Remove item from cart
        updateCart(); // Update the cart display
      });
    });

    // Add event listeners to increase quantity buttons
    const increaseButtons = document.querySelectorAll(".increase-quantity-btn");
    increaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const cartItem = cart.get(parseInt(id));
        cartItem.quantity++;
        updateCart();
      });
    });

    // Add event listeners to decrease quantity buttons
    const decreaseButtons = document.querySelectorAll(".decrease-quantity-btn");
    decreaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const cartItem = cart.get(parseInt(id));
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
        } else {
          cart.delete(parseInt(id)); // Remove item from cart if quantity is 1
        }
        updateCart();
      });
    });
  }
});
