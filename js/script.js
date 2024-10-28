let products = [];
const cart = new Map();

document.addEventListener("DOMContentLoaded", function () {
  const productGrid = document.querySelector(".product-grid");
  const errorMessage = document.getElementById("error-message");

  // Fetch products from the products.json file
  fetch("products.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((fetchedProducts) => {
      products = fetchedProducts;
      if (products.length === 0)
        throw new Error("No products found in the JSON.");

      products.forEach((product) => {
        const discountPercentage = Math.random() * (50 - 10) + 10;
        const originalPrice = (
          product.price *
          (1 + discountPercentage / 100)
        ).toFixed(2);
        const discountPercentDisplay = Math.round(discountPercentage);

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

      startSliding(productGrid);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      if (errorMessage) {
        errorMessage.textContent =
          "Failed to load products, please try again later.";
      }
    });

  // Start single-item sliding effect for products
  function startSliding(productGrid) {
    const productCards = document.querySelectorAll(".product-card");
    let currentIndex = 0;

    setInterval(() => {
      // Start slide-out animation for the current card
      productCards[currentIndex].classList.add("slide-out");
      // Update the index and apply the translation for sliding
      currentIndex = (currentIndex + 1) % productCards.length;

      // Apply the translation for sliding
      productGrid.style.transform = `translateX(-${currentIndex * 200}px)`;

      // Start slide-in animation for the next card
      productCards[currentIndex].classList.add("slide-in");
      // Remove the slide-in class after the animation completes
      productCards[currentIndex].classList.remove("slide-in");
      // Reset slide-out classes when we loop back to the beginning
      if (currentIndex === 0) {
        productCards.forEach((card) => card.classList.remove("slide-out"));
      }
    }, 2000); // Keep the interval consistent for a smooth effect
  }

  // Cart toggle and update functions
  const headerCart = document.querySelector(".header-cart-link");
  const mobileCart = document.querySelector(".mobile-header-cart");
  const cartPanel = document.querySelector(".cart-panel");
  const cartItemsList = document.getElementById("cart-items");

  document.querySelector(".menu-toggle").addEventListener("click", () => {
    document.querySelector(".mobile-navigation").classList.toggle("active");
  });

  document.getElementById("close-cart").addEventListener("click", () => {
    cartPanel.classList.remove("active");
    cartPanel.classList.remove("open");
  });

  headerCart.addEventListener("click", () => {
    cartPanel.classList.toggle("active");
    updateCart();
  });

  mobileCart.addEventListener("click", () => {
    cartPanel.classList.add("open");
    updateCart();
  });

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

  function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    const cartCountMobile = document.getElementById("cart-count-mobile");
    let totalItems = 0;

    cart.forEach((item) => (totalItems += item.quantity));
    cartCountElement.textContent = totalItems;
    cartCountMobile.textContent = totalItems;
  }

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
        cartItemsList.appendChild(li);
      });

      const subTotal = document.createElement("div");
      subTotal.classList.add("cart-subtotal");
      subTotal.innerHTML = `<span>Subtotal:</span><span>$${calculateSubtotal()}</span>`;
      cartItemsList.appendChild(subTotal);

      updateQuantityEventListeners();
    }
  }

  function updateQuantityEventListeners() {
    document.querySelectorAll(".increase-quantity-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        const cartItem = cart.get(productId);
        cartItem.quantity++;
        updateCart();
      });
    });

    document.querySelectorAll(".decrease-quantity-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        const cartItem = cart.get(productId);
        if (cartItem.quantity > 1) cartItem.quantity--;
        else cart.delete(productId);
        updateCart();
      });
    });

    document.querySelectorAll(".delete-item-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        cart.delete(productId);
        updateCart();
      });
    });
  }

  //auto-slider of images.
  function autoSlide() {
    const slider = document.querySelector(".slider");
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
  // Initialize auto-slide for the slider
  autoSlide();
});
