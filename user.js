// Load data when page loads
window.onload = function () {
    // Load notice from Firebase
    database.ref("notice").on("value", (snapshot) => {
      const noticeData = snapshot.val();
      if (noticeData) {
        document.getElementById("notice-text").textContent = noticeData.text;
      }
    });
  
    loadProducts();
    loadCart();
  };
  
  // Function to load products from Firebase
  function loadProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
  
    database.ref("products").on("value", (snapshot) => {
      const products = snapshot.val();
  
      if (products) {
        Object.keys(products).forEach((key) => {
          const product = products[key];
          const productDiv = document.createElement("div");
          productDiv.classList.add("product");
          productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;">
            <p>${product.description}</p>
            <button class="add-to-cart-btn" onclick="addToCart('${key}')">Add to Cart</button>
          `;
          productList.appendChild(productDiv);
        });
      } else {
        productList.innerHTML = "<p>No products available.</p>";
      }
    });
  }
  
  // Function to add a product to the cart
  function addToCart(productId) {
    database.ref("products/" + productId).once("value", (snapshot) => {
      const product = snapshot.val();
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
      if (!cart.some((item) => item.name === product.name)) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
      } else {
        alert(`${product.name} is already in your cart!`);
      }
    });
  }
  
  // Function to place an order
  function placeOrder() {
    const userName = document.getElementById("user-name").value;
    const telegramUsername = document.getElementById("telegram-username").value;
    const userNumber = document.getElementById("user-number").value;
    const walletAddress = document.getElementById("wallet-address").value;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    if (userName && telegramUsername && userNumber && walletAddress && cart.length > 0) {
      const order = {
        userName: userName,
        telegramUsername: telegramUsername,
        userNumber: userNumber,
        walletAddress: walletAddress,
        cart: cart,
      };
  
      const newOrderRef = database.ref("orders").push();
      newOrderRef.set(order);
  
      localStorage.setItem("cart", JSON.stringify([])); // Clear cart
      alert("Order placed successfully!");
    } else {
      alert("Please fill in all fields and add items to your cart!");
    }
  }
  
