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
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
        img.style.width = "40px";
        img.style.height = "30px";
        img.style.marginRight = "10px";

        // Append image to the list item
        li.appendChild(img);

        // Add the item name and price
        li.appendChild(
          document.createTextNode(`${item.name} - $${item.price}`)
        );

        cartItemsElement.appendChild(li);
      });
    }
  }
  function updateCart() {
    cartItemsElement.innerHTML = "";

    // Check if the cart is empty
    if (cart.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "Shopping cart is empty!";
      cartItemsElement.appendChild(emptyMessage);
    } else {
      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("cart-item");

        // Add product image and name
        li.innerHTML = `
          <img src="${item.image}" alt="${item.alt}" class="cart-item-img" />
          ${item.name} - $${item.price}
          <button class="delete-item-btn" data-index="${index}">&#x2715;</button>
        `;

        cartItemsElement.appendChild(li);
      });
    }

    // Add event listener to all delete buttons
    const deleteButtons = document.querySelectorAll(".delete-item-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        cart.splice(index, 1); // Remove item from cart array
        updateCart(); // Update the cart display
      });
    });
  }
});
