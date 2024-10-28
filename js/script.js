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
        // Calculate a random original price between 10% and 50% higher than the discounted price
        const discountPercentage = Math.random() * (50 - 10) + 10; // Random number between 10 and 50
        const originalPrice = (
          product.price *
          (1 + discountPercentage / 100)
        ).toFixed(2); // Original price
        const discountPercentDisplay = Math.round(discountPercentage);

        // Create product card with both prices
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.setAttribute("data-id", product.id);
        productCard.innerHTML = `
                <div class="discount-badge">${discountPercentDisplay}% OFF</div>
                <img src="${product.image}" alt="${product.alt}" />
                <h3>${product.name}</h3>
                <p class="product-price">
                <span class="discounted-price">$${product.price}</span>
                  <span class="original-price">$${originalPrice}</span>
                </p>
                <button class="add-to-cart">Add to Cart</button>
            `;
        productGrid.appendChild(productCard);
      });

      // Existing add-to-cart button functionality
      const addToCartButtons = document.querySelectorAll(".add-to-cart");
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const productId =
            this.closest(".product-card").getAttribute("data-id");
          const product = products.find((p) => p.id == productId);

          if (cart.has(product.id)) {
            const cartItem = cart.get(product.id);
            cartItem.quantity++;
          } else {
            cart.set(product.id, { ...product, quantity: 1 });
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

  let currentIndex = 0;
  const productCards = document.querySelectorAll(".product-card");
  function autoProductSlide() {
    productCards.forEach((card, index) => {
      card.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
    });

    currentIndex = (currentIndex + 1) % productCards.length;
  }

  // Adjust the interval to control sliding speed
  setInterval(autoProductSlide, 2000);

  // Get references to element of cat panel and header-cart-link and cart-items ul inside cart-panel
  const headerCart = document.querySelector(".header-cart-link");
  const mobileCart = document.querySelector(".mobile-header-cart");
  const cartPanel = document.querySelector(".cart-panel");
  const cartItemsList = document.getElementById("cart-items");

  // Menu toggle event listener
  document.querySelector(".menu-toggle").addEventListener("click", function () {
    const nav = document.querySelector(".mobile-navigation");
    nav.classList.toggle("active");
  });
  //close cart in both desktop and mobile view.
  document.getElementById("close-cart").addEventListener("click", function () {
    cartPanel.classList.remove("active"); // Hide the cart panel
    cartPanel.classList.remove("open");
  });
  // Event listener to toggle the cart
  headerCart.addEventListener("click", function () {
    cartPanel.classList.toggle("active"); // Toggle the active class
    updateCart();
  });
  // Event listener to toggle the cart in mobile
  mobileCart.addEventListener("click", function () {
    cartPanel.classList.add("open"); // Toggle the active class
    updateCart();
  });

  // Close cart when clicking outside of it (but exclude actions within the cart like increasing/decreasing/deleting items)
  document.addEventListener("click", function (event) {
    const isCartClick =
      headerCart.contains(event.target) || // Clicking on the header cart
      cartPanel.contains(event.target) || // Clicking inside the cart panel
      event.target.closest(".increase-quantity-btn") || // Clicking increase quantity
      event.target.closest(".decrease-quantity-btn") || // Clicking decrease quantity
      event.target.closest(".delete-item-btn") || //Clicking delete item
      event.target.closest(".add-to-cart"); // Clicking add to cart

    if (!isCartClick) {
      cartPanel.classList.remove("active"); // Close cart if it's an outside click
    }
  });

  // Update cart count
  function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    const cartCountMobile = document.getElementById("cart-count-mobile");
    let totalItems = 0;

    cart.forEach((item) => {
      totalItems += item.quantity; // Update total with quantity
    });
    cartCountElement.textContent = totalItems;
    cartCountMobile.textContent = totalItems; // Update the cart count on the mobile navigation bar
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
    updateCartCount();
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
      const emptyMessage = document.createElement("div");
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

  // Function to automatically slide through the products
  function autoSlide() {
    const slider = document.querySelector(".product-slider");
    const slideWidth = slider.querySelector(".slide").offsetWidth; // Get the width of one slide

    setInterval(() => {
      // Shift the slider left by one full slide width
      slider.scrollLeft += slideWidth;

      // If reached the end, reset to the start
      if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
        slider.scrollLeft = 0;
      }
    }, 2000); // Change slide every 2 seconds
  }
  // Initialize auto-slide for the product slider
  autoSlide();
});
