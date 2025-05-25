const products = [
  {
    id: 1,
    name: 'Classic T-Shirt',
    price: 499,
    img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=150&q=80',
    description: 'Comfortable cotton t-shirt, perfect for everyday wear.'
  },
  {
    id: 2,
    name: 'Blue Denim Jeans',
    price: 999,
    img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=150&q=80',
    description: 'Stylish and durable blue jeans with a slim fit design.'
  },
  {
    id: 3,
    name: 'Sporty Sneakers',
    price: 1499,
    img: 'https://images.unsplash.com/photo-1528701800489-2f30f5be5f6a?auto=format&fit=crop&w=150&q=80',
    description: 'Lightweight sneakers made for comfort and style.'
  },
  {
    id: 4,
    name: 'Travel Backpack',
    price: 799,
    img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=150&q=80',
    description: 'Spacious backpack with multiple compartments for travel.'
  }
];

const productList = document.getElementById('productList');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts(filter = '') {
  productList.innerHTML = '';
  products
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>₹${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(card);
    });
}

function addToCart(productId) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.qty += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x${item.qty}
      <button onclick="removeFromCart(${item.id})">❌</button>
    `;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  renderProducts(e.target.value);
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Checkout successful! Thank you for your purchase.');
  cart = [];
  updateCart();
});

document.getElementById('voiceSearchBtn').addEventListener('click', () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-IN';
  recognition.start();
  recognition.onresult = (e) => {
    const voiceText = e.results[0][0].transcript;
    document.getElementById('searchInput').value = voiceText;
    renderProducts(voiceText);
  };
});

renderProducts();
updateCart();


