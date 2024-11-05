let products = [];
const cart = new Map();
const buttonReferences = new Map();
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
        // Wrap the inner HTML in an anchor tag
        productCard.innerHTML = `
          <a target="_blank" href="/Computer-Parts-e-Commerce/product.html" class="product-card-link">
            <div class="discount-badge">${discountPercentDisplay}% OFF</div>
            <img src="${product.image}" alt="${product.alt}" />
            <h3>${product.name}</h3>
            <p class="product-price">
              <span class="discounted-price">$${product.price}</span>
              <span class="original-price">$${originalPrice}</span>
            </p>
          </a>
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
          // Store the button reference
          buttonReferences.set(product.id, button);

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

  // function startSliding(productGrid) {
  //   const productCards = document.querySelectorAll(".product-card");
  //   let currentIndex = 0;
  //   let slideInterval;

  //   function slide() {
  //     productCards[currentIndex].classList.add("slide-out");
  //     currentIndex = (currentIndex + 1) % productCards.length;
  //     productGrid.style.transform = `translateX(-${currentIndex * 200}px)`;
  //     productCards[currentIndex].classList.add("slide-in");
  //     productCards[currentIndex].classList.remove("slide-in");
  //     if (currentIndex === 6) {
  //       productCards.forEach((card) => card.classList.remove("slide-out"));
  //     }
  //   }

  //   function startSlideShow() {
  //     slideInterval = setInterval(slide, 2000);
  //   }

  //   function stopSlideShow() {
  //     clearInterval(slideInterval);
  //   }

  //   // Start the slide show initially
  //   startSlideShow();

  //   // Add event listeners for hover
  //   productCards.forEach((card) => {
  //     card.addEventListener("mouseenter", stopSlideShow); // Pause on hover
  //     card.addEventListener("mouseleave", startSlideShow); // Resume on leave
  //   });
  // }

  // Cart toggle and update functions

  function startSliding(productGrid) {
    const productCards = document.querySelectorAll(".product-card");
    let currentIndex = 0;
    let slideInterval;

    // Duplicate the product cards to create a seamless loop
    productCards.forEach((card) => {
      const clone = card.cloneNode(true);
      productGrid.appendChild(clone);
    });

    function slide() {
      productGrid.style.transition = "transform 0.5s ease-in-out";
      productGrid.style.transform = `translateX(-${currentIndex * 224}px)`;

      currentIndex++;

      // When we reach the end of the original set of cards, reset back to the start
      if (currentIndex >= productCards.length) {
        setTimeout(() => {
          productGrid.style.transition = "none";
          productGrid.style.transform = "translateX(0)";
          currentIndex = 0;
        }, 2500); // Wait for the transition to finish before resetting
      }
    }

    function startSlideShow() {
      slideInterval = setInterval(slide, 2000);
    }

    function stopSlideShow() {
      clearInterval(slideInterval);
    }

    // Manual slide control
    document.querySelector(".left-button").addEventListener("click", () => {
      stopSlideShow(); // Pause automatic sliding on manual interaction
      currentIndex =
        (currentIndex - 1 + productCards.length) % productCards.length;
      productGrid.style.transition = "transform 0.5s ease-in-out";
      productGrid.style.transform = `translateX(-${currentIndex * 224}px)`;
      startSlideShow();
    });

    document.querySelector(".right-button").addEventListener("click", () => {
      stopSlideShow(); // Pause automatic sliding on manual interaction
      currentIndex = (currentIndex + 1) % productCards.length;
      productGrid.style.transition = "transform 0.5s ease-in-out";
      productGrid.style.transform = `translateX(-${currentIndex * 224}px)`;
      startSlideShow();
    });

    // Start the slide show initially
    startSlideShow();

    // Add event listeners for hover
    productCards.forEach((card) => {
      card.addEventListener("mouseenter", stopSlideShow); // Pause on hover
      card.addEventListener("mouseleave", startSlideShow); // Resume on leave
    });
  }

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
        // Update the button text based on quantity
        const buttonRef = buttonReferences.get(id);
        if (buttonRef) {
          buttonRef.textContent = `${item.quantity} added in Cart`;
        }
      });

      //Add checkout button and subTotal div.
      const subTotal = document.createElement("div");
      subTotal.classList.add("cart-subtotal");
      subTotal.innerHTML = `<span>Subtotal:</span><span>$${calculateSubtotal()}</span>`;
      cartItemsList.appendChild(subTotal);
      const checkoutBtn = document.createElement("button");
      checkoutBtn.textContent = "Checkout";
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
        // Update the button text for the cart item
        const buttonRef = buttonReferences.get(productId);
        if (buttonRef) {
          buttonRef.textContent = `${cartItem.quantity} added in Cart`;
        }

        updateCart();
      });
    });

    document.querySelectorAll(".decrease-quantity-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"), 10);
        const cartItem = cart.get(productId);
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
          // Update the button text for the cart item
          const buttonRef = buttonReferences.get(productId);
          if (buttonRef) {
            buttonRef.textContent = `${cartItem.quantity} added in Cart`;
          }
        } else {
          cart.delete(productId);
          // Also remove the button reference
          buttonReferences.delete(productId);
          // Reset the "Add to Cart" button text when quantity reaches zero
          const productCard = document.querySelector(
            `.product-card[data-id="${productId}"]`
          );
          const addToCartButton = productCard.querySelector(".add-to-cart");
          addToCartButton.textContent = "Add to Cart";
        }
        updateCart();
      });
    });

    document.querySelectorAll(".delete-item-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"), 10);
        cart.delete(productId);
        // Remove button reference
        buttonReferences.delete(productId);
        // Reset the "Add to Cart" button text when item is removed
        const productCard = document.querySelector(
          `.product-card[data-id="${productId}"]`
        );
        const addToCartButton = productCard.querySelector(".add-to-cart");
        addToCartButton.textContent = "Add to Cart";
        updateCart();
      });
    });
  }

  //auto-slider of images.
  function autoSlide() {
    const slider = document.querySelector(".slider");
    const slideWidth = slider.querySelector(".slide").offsetWidth;
    let slideInterval;

    function startSlideShow() {
      slideInterval = setInterval(() => {
        slider.scrollLeft += slideWidth;
        // Wrap back to the beginning if it reaches the end
        if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
          slider.scrollLeft = 0;
        }
      }, 2000);
    }

    function stopSlideShow() {
      clearInterval(slideInterval);
    }

    function slideLeft() {
      stopSlideShow();
      if (slider.scrollLeft <= 0) {
        slider.scrollLeft = slider.scrollWidth - slider.clientWidth;
      } else {
        slider.scrollLeft -= slideWidth;
      }
      startSlideShow();
    }

    function slideRight() {
      stopSlideShow();
      slider.scrollLeft += slideWidth;
      if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
        slider.scrollLeft = 0;
      }
      startSlideShow();
    }

    // Event listeners for the buttons
    document
      .querySelector(".hot-deals-left")
      .addEventListener("click", slideLeft);
    document
      .querySelector(".hot-deals-right")
      .addEventListener("click", slideRight);

    // Start the auto-slide
    startSlideShow();
  }

  // Initialize the slider functionality
  autoSlide();
});
