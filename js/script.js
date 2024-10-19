let products = [];
let cart = new Map(); // Key: product ID, Value: { product details and quantity }

document.addEventListener("DOMContentLoaded", function () {
  const cartBtn = document.getElementById("cart-btn");
  const closeCartBtn = document.getElementById("close-cart");
  const cartElement = document.getElementById("cart");
  const cartItemsElement = document.getElementById("cart-items");
  const productGrid = document.getElementById("product-grid");

  // Fetch products from the JSON file
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

      // Now attach event listeners to dynamically created "Add to Cart" buttons
      const addToCartButtons = document.querySelectorAll(".add-to-cart");
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const productId =
            this.closest(".product-card").getAttribute("data-id");
          const product = products.find((p) => p.id == productId);

          // Check if item already exists in the cart
          if (cart.has(product.id)) {
            // If it exists, increment the quantity
            const cartItem = cart.get(product.id);
            cartItem.quantity++;
          } else {
            // If not, add the product with quantity 1
            cart.set(product.id, { ...product, quantity: 1 });
          }
          updateCart();
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });

  // Open Cart
  cartBtn.addEventListener("click", () => {
    cartElement.classList.add("open");
    updateCart();
  });
  // Close Cart
  closeCartBtn.addEventListener("click", () => {
    cartElement.classList.remove("open");
  });

  function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    let totalItems = 0;

    cart.forEach((item) => {
      totalItems += item.quantity; // Update total with quantity
    });
    cartCountElement.textContent = totalItems;
  }

  // Update cart items to display
  function updateCart() {
    cartItemsElement.innerHTML = "";
    // Check if the cart is empty
    if (cart.size === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "Shopping cart is empty!";
      cartItemsElement.appendChild(emptyMessage);
    } else {
      cart.forEach((item, id) => {
        const li = document.createElement("li");
        li.classList.add("cart-item");
        // Add product image and name
        li.innerHTML = `
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.alt}" class="cart-item-img" />
          ${item.name} - $${item.quantity * item.price}
          <button class="delete-item-btn" data-id="${id}">
            <span class="material-icons">delete</span>
          </button>
        </div>
        <div class="quantity-controls">
          <button class="decrease-quantity-btn" data-id="${id}">-</button>
          <div>${item.quantity}</div>
          <button class="increase-quantity-btn" data-id="${id}">+</button>
        </div>
        `;
        cartItemsElement.appendChild(li);
      });
    }

    // Add event listener to all delete buttons
    const deleteButtons = document.querySelectorAll(".delete-item-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        cart.delete(parseInt(id)); // Remove item from cart array
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
          cart.delete(parseInt(id)); // Remove item from cart array if quantity is 1
        }
        updateCart();
      });
    });
    updateCartCount(); // Update the cart count whenever the cart is updated
  }
});
