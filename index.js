const humberger = document.querySelector('#humberger');
const navbar = document.querySelector('#navbar');
const closeBtn = document.querySelector('#close-btn');
const navLinks = document.querySelectorAll('.nav-links a');
const cartValue = document.querySelector('.cart-value');
const addCartButtons = document.querySelectorAll('.add-cart-btn');
const wishlistButtons = document.querySelectorAll('.wishlist-btn');
const foodCards = document.querySelectorAll('.food-card');
const cartList = document.querySelector('#cart-list');
const emptyCart = document.querySelector('#empty-cart');
const summaryItems = document.querySelector('#summary-items');
const summarySubtotal = document.querySelector('#summary-subtotal');
const summaryDelivery = document.querySelector('#summary-delivery');
const summaryTotal = document.querySelector('#summary-total');
const buyNowBtn = document.querySelector('#buy-now-btn');
const productModal = document.querySelector('#product-modal');
const productClose = document.querySelector('#product-close');
const detailImage = document.querySelector('#detail-image');
const detailCategory = document.querySelector('#detail-category');
const detailTitle = document.querySelector('#detail-title');
const detailDescription = document.querySelector('#detail-description');
const detailRating = document.querySelector('#detail-rating');
const detailPrice = document.querySelector('#detail-price');
const detailAddCart = document.querySelector('#detail-add-cart');
const relatedGrid = document.querySelector('#related-grid');
const CART_STORAGE_KEY = 'foodieCart';
const MENU_ITEMS = [
    {
        id: 'cheese-burger',
        name: 'Cheese Burger',
        price: 12.99,
        image: 'images/burger.png',
        description: 'Juicy grilled patty, melted cheese, fresh veggies, and signature sauce.',
        category: 'Burger',
        rating: '4.9',
        quantity: 1
    },
    {
        id: 'pepperoni-pizza',
        name: 'Pepperoni Pizza',
        price: 18.49,
        image: 'images/pizza.png',
        description: 'Crispy crust topped with mozzarella, pepperoni, herbs, and tomato sauce.',
        category: 'Pizza',
        rating: '4.8',
        quantity: 1
    },
    {
        id: 'chicken-roll',
        name: 'Chicken Roll',
        price: 10.25,
        image: 'images/chicken-roll.png',
        description: 'Tender chicken, crunchy veggies, creamy dressing, and soft wrap bread.',
        category: 'Roll',
        rating: '4.7',
        quantity: 1
    },
    {
        id: 'classic-lasagna',
        name: 'Classic Lasagna',
        price: 15.75,
        image: 'images/lasagna.png',
        description: 'Layered pasta, rich tomato sauce, creamy cheese, and Italian seasoning.',
        category: 'Pasta',
        rating: '4.9',
        quantity: 1
    },
    {
        id: 'creamy-spaghetti',
        name: 'Creamy Spaghetti',
        price: 13.50,
        image: 'images/spaghetti.png',
        description: 'Silky pasta tossed with creamy sauce, herbs, and parmesan cheese.',
        category: 'Italian',
        rating: '4.6',
        quantity: 1
    },
    {
        id: 'spring-rolls',
        name: 'Spring Rolls',
        price: 8.99,
        image: 'images/spring-roll.png',
        description: 'Crispy golden rolls packed with vegetables and served with tangy dip.',
        category: 'Snack',
        rating: '4.8',
        quantity: 1
    }
];
let activeProduct = null;

if (humberger && navbar && closeBtn) {
    function openNavbar() {
        navbar.classList.add('active');
        document.body.classList.add('menu-open');
        humberger.setAttribute('aria-expanded', 'true');
    }

    function closeNavbar() {
        navbar.classList.remove('active');
        document.body.classList.remove('menu-open');
        humberger.setAttribute('aria-expanded', 'false');
    }

    humberger.addEventListener('click', openNavbar);
    closeBtn.addEventListener('click', closeNavbar);

    navLinks.forEach((link) => {
        link.addEventListener('click', closeNavbar);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNavbar();
        }
    });
}

function getCartItems() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveCartItems(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartCounter(items);
}

function getCartCount(items = getCartItems()) {
    return items.reduce((total, item) => total + item.quantity, 0);
}

function updateCartCounter(items = getCartItems()) {
    if (cartValue) {
        cartValue.textContent = getCartCount(items);
    }
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function getProductId(name) {
    return name.toLowerCase().replaceAll(' ', '-');
}

function getFoodDetailsFromCard(card) {
    const name = card.querySelector('h3').textContent.trim();
    const priceText = card.querySelector('.food-bottom strong').textContent.replace('$', '').trim();
    const image = card.querySelector('.food-image img').getAttribute('src');
    const description = card.querySelector('.food-info p').textContent.trim();
    const category = card.querySelector('.food-meta span:first-child').textContent.trim();
    const rating = card.querySelector('.food-meta span:last-child').textContent.replace(/[^\d.]/g, '').trim();

    return {
        id: getProductId(name),
        name,
        price: Number(priceText),
        image,
        description,
        category,
        rating: rating || '4.8',
        quantity: 1
    };
}

function getFoodDetails(button) {
    return getFoodDetailsFromCard(button.closest('.food-card'));
}

function addFoodToCart(food) {
    const cartItems = getCartItems();
    const existingItem = cartItems.find((item) => item.id === food.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push(food);
    }

    saveCartItems(cartItems);
}

function getProductPool() {
    if (foodCards.length > 0) {
        return [...foodCards].map((card) => getFoodDetailsFromCard(card));
    }

    return MENU_ITEMS;
}

function renderRelatedProducts(product) {
    if (!relatedGrid) {
        return;
    }

    const relatedProducts = getProductPool()
        .filter((item) => item.id !== product.id)
        .slice(0, 3);

    relatedGrid.innerHTML = '';

    if (relatedProducts.length === 0) {
        relatedGrid.innerHTML = '<p class="no-related">No other dishes added yet.</p>';
        return;
    }

    relatedProducts.forEach((item) => {
        const relatedCard = document.createElement('button');
        relatedCard.type = 'button';
        relatedCard.className = 'related-card';
        relatedCard.dataset.id = item.id;
        relatedCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <span>${formatPrice(item.price)}</span>
            </div>
        `;
        relatedGrid.appendChild(relatedCard);
    });
}

function openProductDetail(product) {
    if (!productModal) {
        return;
    }

    activeProduct = {
        ...product,
        category: product.category || 'Popular',
        rating: product.rating || '4.8',
        quantity: 1
    };

    detailImage.src = activeProduct.image;
    detailImage.alt = activeProduct.name;
    detailCategory.textContent = activeProduct.category;
    detailTitle.textContent = activeProduct.name;
    detailDescription.textContent = activeProduct.description;
    detailRating.textContent = activeProduct.rating;
    detailPrice.textContent = formatPrice(activeProduct.price);
    detailAddCart.classList.remove('added');
    detailAddCart.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';

    renderRelatedProducts(activeProduct);

    productModal.classList.add('active');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('detail-open');
}

function closeProductDetail() {
    if (!productModal) {
        return;
    }

    productModal.classList.remove('active');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('detail-open');
}

function renderCheckoutCart() {
    if (!cartList) {
        return;
    }

    const cartItems = getCartItems();
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const delivery = cartItems.length > 0 ? 2.99 : 0;
    const total = subtotal + delivery;

    cartList.innerHTML = '';

    if (cartItems.length === 0) {
        emptyCart.style.display = 'grid';
        cartList.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartList.style.display = 'grid';

        cartItems.forEach((item) => {
            const cartItem = document.createElement('article');
            cartItem.className = 'cart-item';
            cartItem.dataset.id = item.id;
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <strong>${formatPrice(item.price)}</strong>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Decrease ${item.name} quantity">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" data-action="increase" data-id="${item.id}" aria-label="Increase ${item.name} quantity">+</button>
                    </div>
                    <button type="button" class="remove-item" data-action="remove" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i>
                        Remove
                    </button>
                </div>
            `;
            cartList.appendChild(cartItem);
        });
    }

    if (summaryItems) {
        summaryItems.textContent = getCartCount(cartItems);
    }

    if (summarySubtotal) {
        summarySubtotal.textContent = formatPrice(subtotal);
    }

    if (summaryDelivery) {
        summaryDelivery.textContent = formatPrice(delivery);
    }

    if (summaryTotal) {
        summaryTotal.textContent = formatPrice(total);
    }

    if (buyNowBtn) {
        buyNowBtn.disabled = cartItems.length === 0;
    }
}

function updateItemQuantity(id, action) {
    const cartItems = getCartItems();
    const item = cartItems.find((cartItem) => cartItem.id === id);

    if (!item) {
        return;
    }

    if (action === 'increase') {
        item.quantity += 1;
    }

    if (action === 'decrease') {
        item.quantity -= 1;
    }

    const updatedItems = cartItems.filter((cartItem) => cartItem.quantity > 0);
    saveCartItems(updatedItems);
    renderCheckoutCart();
}

function removeCartItem(id) {
    const updatedItems = getCartItems().filter((item) => item.id !== id);
    saveCartItems(updatedItems);
    renderCheckoutCart();
}

updateCartCounter();
renderCheckoutCart();

addCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
        addFoodToCart(getFoodDetails(button));

        button.classList.add('added');
        button.innerHTML = '<i class="fa-solid fa-check"></i> Added';

        setTimeout(() => {
            button.classList.remove('added');
            button.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
        }, 1200);
    });
});

foodCards.forEach((card) => {
    card.addEventListener('click', (event) => {
        if (event.target.closest('button')) {
            return;
        }

        openProductDetail(getFoodDetailsFromCard(card));
    });
});

if (cartList) {
    cartList.addEventListener('click', (event) => {
        const button = event.target.closest('button');

        if (button) {
            const id = button.dataset.id;
            const action = button.dataset.action;

            if (action === 'remove') {
                removeCartItem(id);
            }

            if (action === 'increase' || action === 'decrease') {
                updateItemQuantity(id, action);
            }

            return;
        }

        const cartItem = event.target.closest('.cart-item');

        if (cartItem) {
            const selectedItem = getCartItems().find((item) => item.id === cartItem.dataset.id);
            const selectedProduct = getProductPool().find((item) => item.id === cartItem.dataset.id);

            if (selectedItem) {
                openProductDetail({
                    ...selectedProduct,
                    ...selectedItem,
                    category: selectedProduct?.category || selectedItem.category,
                    rating: selectedProduct?.rating || selectedItem.rating
                });
            }
        }
    });
}

if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
        if (getCartItems().length === 0) {
            return;
        }

        alert('Your order has been placed successfully!');
        saveCartItems([]);
        renderCheckoutCart();
    });
}

wishlistButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const icon = button.querySelector('i');

        button.classList.toggle('active');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    });
});

if (productClose) {
    productClose.addEventListener('click', closeProductDetail);
}

if (productModal) {
    productModal.addEventListener('click', (event) => {
        if (event.target === productModal) {
            closeProductDetail();
        }
    });
}

if (relatedGrid) {
    relatedGrid.addEventListener('click', (event) => {
        const relatedCard = event.target.closest('.related-card');

        if (!relatedCard) {
            return;
        }

        const selectedProduct = getProductPool().find((item) => item.id === relatedCard.dataset.id);

        if (selectedProduct) {
            openProductDetail(selectedProduct);
        }
    });
}

if (detailAddCart) {
    detailAddCart.addEventListener('click', () => {
        if (!activeProduct) {
            return;
        }

        addFoodToCart(activeProduct);
        renderCheckoutCart();
        detailAddCart.classList.add('added');
        detailAddCart.innerHTML = '<i class="fa-solid fa-check"></i> Added';

        setTimeout(() => {
            detailAddCart.classList.remove('added');
            detailAddCart.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
        }, 1200);
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeProductDetail();
    }
});
