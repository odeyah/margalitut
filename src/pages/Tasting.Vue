<template>
	<div class="tasting-page" :class="{ rtl: lang === 'he' }">
		<!-- HERO -->
		<section class="hero">
			<div class="hero-badge">🍓</div>
			<h1 class="hero-title">{{ t.title }}</h1>
			<p class="hero-subtitle">{{ t.subtitle }}</p>
			<div class="hero-buttons">
				<button class="btn primary" @click="goCheckout">
					<span class="btn-icon">🛒</span>
					{{ t.checkout }}
				</button>
				<button class="btn secondary" @click="goQuote">
					<span class="btn-icon">📋</span>
					{{ t.quote }}
				</button>
			</div>
		</section>

		<!-- PRODUCTS -->
		<section class="products-section">
			<h2 class="section-title">{{ t.productsTitle }}</h2>
			<div class="products-grid">
				<div v-for="p in products" :key="p.id" class="product-card" :class="{ 'in-cart': isInCart(p.id) }">
					<div class="product-image">
						<img :src="p.image" :alt="p.name" loading="lazy" />
						<span v-if="p.popular" class="popular-badge">⭐ {{ t.popular }}</span>
					</div>
					<div class="product-info">
						<h3 class="product-name">{{ p.name }}</h3>
						<p class="product-description">{{ p.description }}</p>
						<div class="product-footer">
							<span class="product-price">₪{{ p.price }}</span>
							<button v-if="!isInCart(p.id)" class="add-btn" @click="addToCart(p)"><span>+</span> {{ t.add }}</button>
							<div v-else class="quantity-controls">
								<button class="qty-btn" @click="decrementQty(p.id)">−</button>
								<span class="qty-value">{{ getQty(p.id) }}</span>
								<button class="qty-btn" @click="incrementQty(p.id)">+</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- FLOATING CART -->
		<Transition name="slide-up">
			<div v-if="cartItems.length > 0" class="floating-cart">
				<div class="cart-info">
					<span class="cart-count">{{ totalItems }} {{ t.items }}</span>
					<span class="cart-total">₪{{ totalPrice }}</span>
				</div>
				<button class="cart-btn" @click="goCheckout">{{ t.checkout }} →</button>
			</div>
		</Transition>

		<!-- CONTACT SECTION -->
		<section class="contact-section">
			<h2>{{ t.contactTitle }}</h2>
			<p>{{ t.contactText }}</p>
			<div class="contact-links">
				<a href="tel:0528460331" class="contact-link"> 📱 052-846-0331 </a>
				<a href="https://wa.me/972528460331" target="_blank" class="contact-link whatsapp"> 💬 WhatsApp </a>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const lang = computed(() => (route.query.lang === 'he' ? 'he' : 'en'));

const texts = {
	he: {
		title: 'תודה שהשתתפתם ביריד הטעימות! 💛',
		subtitle: 'שמחים שהכרתם את מרגליתות 🍓 הזמינו עכשיו או בקשו הצעת מחיר לאירוע.',
		productsTitle: 'המוצרים שלנו',
		add: 'הוסף',
		checkout: 'לתשלום',
		quote: 'הצעת מחיר לאירוע',
		popular: 'פופולרי',
		items: 'פריטים',
		contactTitle: 'שאלות? דברו איתנו!',
		contactText: 'נשמח לעזור בכל שאלה או בקשה מיוחדת',
	},
	en: {
		title: 'Thank you for visiting us! 💛',
		subtitle: 'We're so happy you discovered Margalitut 🍓 Order now or request a quote.',
		productsTitle: 'Our Products',
		add: 'Add',
		checkout: 'Checkout',
		quote: 'Event Quote',
		popular: 'Popular',
		items: 'items',
		contactTitle: 'Questions? Talk to us!',
		contactText: 'We\'re happy to help with any question or special request',
	},
};

const t = computed(() => texts[lang.value]);

const products = computed(() => [
	{
		id: 1,
		name: lang.value === 'he' ? 'עוגת שמרים' : 'Yeast Cake',
		description: lang.value === 'he' ? 'עוגת שמרים טרייה ורכה' : 'Fresh and soft yeast cake',
		price: 50,
		image: '/images/yeast.jpg',
		popular: true,
	},
	{
		id: 2,
		name: lang.value === 'he' ? 'בראוניז עשיר' : 'Rich Brownies',
		description: lang.value === 'he' ? 'בראוניז שוקולד עשיר ולח' : 'Rich and moist chocolate brownies',
		price: 55,
		image: '/images/brownies.jpg',
	},
	{
		id: 3,
		name: lang.value === 'he' ? 'קופסת עוגיות' : 'Cookie Box',
		description: lang.value === 'he' ? 'מבחר עוגיות טריות' : 'Assorted fresh cookies',
		price: 45,
		image: '/images/cookies.jpg',
	},
	{
		id: 4,
		name: lang.value === 'he' ? 'קיש ביתי' : 'Homemade Quiche',
		description: lang.value === 'he' ? 'קיש טרי במילויים לבחירה' : 'Fresh quiche with your choice of filling',
		price: 65,
		image: '/images/quiche.jpg',
		popular: true,
	},
	{
		id: 5,
		name: lang.value === 'he' ? 'פיצה ביתית' : 'Homemade Pizza',
		description: lang.value === 'he' ? 'פיצה ביתית עם תוספות' : 'Homemade pizza with toppings',
		price: 60,
		image: '/images/pizza.jpg',
	},
	{
		id: 6,
		name: lang.value === 'he' ? 'מארז מתנה' : 'Premium Gift Box',
		description: lang.value === 'he' ? 'מארז מפנק במיוחד' : 'Special pampering gift box',
		price: 250,
		image: '/images/gift.jpg',
	},
]);

// Cart state
const cartItems = ref([]);

const isInCart = (id) => cartItems.value.some(item => item.id === id);
const getQty = (id) => cartItems.value.find(item => item.id === id)?.qty || 0;

const totalItems = computed(() => cartItems.value.reduce((sum, item) => sum + item.qty, 0));
const totalPrice = computed(() => cartItems.value.reduce((sum, item) => sum + (item.price * item.qty), 0));

function addToCart(product) {
	const existing = cartItems.value.find(item => item.id === product.id);
	if (existing) {
		existing.qty++;
	} else {
		cartItems.value.push({ ...product, qty: 1 });
	}
}

function incrementQty(id) {
	const item = cartItems.value.find(item => item.id === id);
	if (item) item.qty++;
}

function decrementQty(id) {
	const item = cartItems.value.find(item => item.id === id);
	if (item) {
		if (item.qty > 1) {
			item.qty--;
		} else {
			cartItems.value = cartItems.value.filter(i => i.id !== id);
		}
	}
}

function goCheckout() {
	localStorage.setItem('tasting-cart', JSON.stringify(cartItems.value));
	router.push('/checkout?src=tasting');
}

function goQuote() {
	router.push('/quote?src=tasting');
}
</script>

<style scoped>
.tasting-page {
	max-width: 1000px;
	margin: 0 auto;
	padding: 1.5rem;
	padding-bottom: 100px;
}

.tasting-page.rtl {
	direction: rtl;
}

/* HERO */
.hero {
	text-align: center;
	padding: 2.5rem 1.5rem;
	background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
	border-radius: 24px;
	margin-bottom: 2rem;
}

.hero-badge {
	font-size: 3rem;
	margin-bottom: 1rem;
	animation: bounce 2s infinite;
}

@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}

.hero-title {
	font-size: 1.75rem;
	font-weight: 800;
	color: #333;
	margin: 0 0 0.75rem 0;
}

.hero-subtitle {
	font-size: 1.1rem;
	color: #666;
	margin: 0 0 1.5rem 0;
	line-height: 1.6;
}

.hero-buttons {
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 1.5rem;
	border-radius: 12px;
	font-weight: 700;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
	border: none;
}

.btn.primary {
	background: linear-gradient(135deg, #d89c2b, #f4b942);
	color: white;
	box-shadow: 0 4px 15px rgba(216, 156, 43, 0.3);
}

.btn.primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(216, 156, 43, 0.4);
}

.btn.secondary {
	background: white;
	color: #333;
	border: 2px solid #e0e0e0;
}

.btn.secondary:hover {
	border-color: #d89c2b;
	background: #fffbf0;
}

.btn-icon {
	font-size: 1.1rem;
}

/* PRODUCTS */
.products-section {
	margin-bottom: 2rem;
}

.section-title {
	font-size: 1.5rem;
	font-weight: 700;
	text-align: center;
	margin-bottom: 1.5rem;
	color: #333;
}

.products-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 1.25rem;
}

.product-card {
	background: white;
	border-radius: 16px;
	overflow: hidden;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
	transition: all 0.3s ease;
	border: 2px solid transparent;
}

.product-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-card.in-cart {
	border-color: #d89c2b;
	background: #fffbf0;
}

.product-image {
	position: relative;
	height: 180px;
	overflow: hidden;
}

.product-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
	transform: scale(1.05);
}

.popular-badge {
	position: absolute;
	top: 0.75rem;
	right: 0.75rem;
	background: linear-gradient(135deg, #d89c2b, #f4b942);
	color: white;
	font-size: 0.75rem;
	font-weight: 700;
	padding: 0.3rem 0.75rem;
	border-radius: 20px;
}

.product-info {
	padding: 1.25rem;
}

.product-name {
	font-size: 1.1rem;
	font-weight: 700;
	margin: 0 0 0.5rem 0;
	color: #333;
}

.product-description {
	font-size: 0.875rem;
	color: #666;
	margin: 0 0 1rem 0;
	line-height: 1.4;
}

.product-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.product-price {
	font-size: 1.25rem;
	font-weight: 800;
	color: #d89c2b;
}

.add-btn {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.5rem 1rem;
	background: linear-gradient(135deg, #d89c2b, #f4b942);
	color: white;
	border: none;
	border-radius: 25px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.add-btn:hover {
	transform: scale(1.05);
	box-shadow: 0 4px 15px rgba(216, 156, 43, 0.4);
}

.quantity-controls {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: white;
	border: 2px solid #d89c2b;
	border-radius: 25px;
	padding: 0.25rem;
}

.qty-btn {
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fff8e1;
	border: none;
	border-radius: 50%;
	color: #d89c2b;
	font-size: 1rem;
	font-weight: 700;
	cursor: pointer;
}

.qty-btn:hover {
	background: #d89c2b;
	color: white;
}

.qty-value {
	min-width: 24px;
	text-align: center;
	font-weight: 700;
}

/* FLOATING CART */
.floating-cart {
	position: fixed;
	bottom: 1.5rem;
	left: 50%;
	transform: translateX(-50%);
	background: linear-gradient(135deg, #d89c2b, #f4b942);
	color: white;
	padding: 1rem 1.5rem;
	border-radius: 16px;
	display: flex;
	align-items: center;
	gap: 1.5rem;
	box-shadow: 0 8px 30px rgba(216, 156, 43, 0.4);
	z-index: 100;
}

.cart-info {
	display: flex;
	flex-direction: column;
}

.cart-count {
	font-size: 0.85rem;
	opacity: 0.9;
}

.cart-total {
	font-size: 1.25rem;
	font-weight: 800;
}

.cart-btn {
	background: white;
	color: #d89c2b;
	padding: 0.75rem 1.25rem;
	border: none;
	border-radius: 10px;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s ease;
}

.cart-btn:hover {
	transform: scale(1.05);
}

/* CONTACT */
.contact-section {
	text-align: center;
	padding: 2rem;
	background: #f8f9fa;
	border-radius: 16px;
}

.contact-section h2 {
	margin: 0 0 0.5rem 0;
	font-size: 1.25rem;
}

.contact-section p {
	color: #666;
	margin: 0 0 1.25rem 0;
}

.contact-links {
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.contact-link {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.25rem;
	background: white;
	border-radius: 10px;
	text-decoration: none;
	color: #333;
	font-weight: 600;
	transition: all 0.2s ease;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.contact-link:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-link.whatsapp {
	background: #25d366;
	color: white;
}

/* TRANSITIONS */
.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
	opacity: 0;
	transform: translateX(-50%) translateY(20px);
}

/* RESPONSIVE */
@media (max-width: 600px) {
	.hero-title {
		font-size: 1.5rem;
	}

	.products-grid {
		grid-template-columns: 1fr;
	}

	.floating-cart {
		left: 1rem;
		right: 1rem;
		transform: none;
	}
}
</style>
