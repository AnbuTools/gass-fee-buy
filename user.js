// Load cart and display on page load
window.onload = function() {
    const savedNotice = localStorage.getItem('noticeText');
    if (savedNotice) {
        document.getElementById('notice-text').textContent = savedNotice;
    }

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    productList.innerHTML = '';
    cartItems.innerHTML = '';

    // Display products
    if (products.length > 0) {
        products.forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;">
                <p>${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${index})">Add to Cart</button>
            `;
            productList.appendChild(productDiv);
        });
    } else {
        productList.innerHTML = '<p>No products available.</p>';
    }

    // Display cart items
    if (cart.length > 0) {
        cart.forEach((item, index) => {
            const cartDiv = document.createElement('div');
            cartDiv.innerHTML = `
                <p>${item.name} - $${item.price} 
                <button class="add-to-cart-btn" onclick="removeFromCart(${index})">Remove</button>
                </p>
            `;
            cartItems.appendChild(cartDiv);
        });
    } else {
        cartItems.innerHTML = '<p>No items in cart.</p>';
    }
};

// Add product to cart
function addToCart(productIndex) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products[productIndex];

    if (!cart.some(item => item.name === product.name)) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
        window.onload(); // Reload to update cart display
    } else {
        alert(`${product.name} is already in your cart!`);
    }
}

// Remove product from cart
function removeFromCart(cartIndex) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const removedItem = cart[cartIndex];
    cart.splice(cartIndex, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${removedItem.name} removed from cart!`);
    window.onload(); // Reload to update cart display
}

// Place order
function placeOrder() {
    const userName = document.getElementById('user-name').value;
    const telegramUsername = document.getElementById('telegram-username').value;
    const userNumber = document.getElementById('user-number').value;
    const walletAddress = document.getElementById('wallet-address').value;

    if (userName && telegramUsername && userNumber && walletAddress) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length > 0) {
            const order = {
                userName: userName,
                telegramUsername: telegramUsername,
                userNumber: userNumber,
                walletAddress: walletAddress,
                cart: cart,
            };

            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.setItem('cart', JSON.stringify([])); // Clear cart after placing order

            alert('Order placed successfully!');
            displayOrderSummary(order); // Show order summary
        } else {
            alert('Please add items to your cart before placing an order.');
        }
    } else {
        alert('Please fill in all fields!');
    }
}

// Display order summary
function displayOrderSummary(order) {
    const orderSummary = document.getElementById('order-summary');
    let summaryHTML = `
        <h4>Order Summary</h4>
        <p><strong>Name:</strong> ${order.userName}</p>
        <p><strong>Telegram Username:</strong> ${order.telegramUsername}</p>
        <p><strong>Phone Number:</strong> ${order.userNumber}</p>
        <p><strong>Wallet Address:</strong> ${order.walletAddress}</p>
        <h5>Products in Order:</h5>
        <ul>
    `;

    order.cart.forEach(item => {
        summaryHTML += `
            <li>${item.name} - $${item.price}</li>
        `;
    });

    summaryHTML += '</ul>';
    orderSummary.innerHTML = summaryHTML;
}