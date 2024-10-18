let products = [];
let cart = [];
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
          cart.push(product);
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

  // Update cart items display
  function updateCart() {
    cartItemsElement.innerHTML = "";

    // Check if the cart is empty
    if (cart.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "Shopping cart is empty!";
      cartItemsElement.appendChild(emptyMessage);
    } else {
      cart.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price}`;
        cartItemsElement.appendChild(li);
      });
    }
  }
});
