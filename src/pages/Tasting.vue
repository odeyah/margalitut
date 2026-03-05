<template>
	<div class="tasting-page" :class="{ rtl: lang === 'he' }">
		<!-- SALE BANNER -->
		<div v-if="isPromoActive" class="promo-banner">
			<span class="promo-icon">🎉</span>
			<div class="promo-text">
				<strong>מבצע מיוחד למשתתפי הטעימות!</strong>
				<span>הזינו קוד <code>TASTING5</code> לקבלת 5% הנחה</span>
			</div>
			<span class="promo-expires">בתוקף עד יום רביעי 22:00</span>
		</div>
		<!-- HERO -->
		<section class="hero">
			<div class="hero-badge">🍓</div>
			<h1 class="hero-title">{{ t.title }}</h1>
			<p class="hero-subtitle">{{ t.subtitle }}</p>
			<p class="quote-subtitle">{{ t.quoteSubtitle }}</p>
			<br />
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

		<!-- WHY MARGALITUT -->
		<section class="why-section">
			<div class="why-grid">
				<div class="why-card">
					<span class="why-icon">🏠</span>
					<h3>{{ lang === 'he' ? 'ביתי ואותנטי' : 'Homemade' }}</h3>
					<p>{{ lang === 'he' ? 'הכל נאפה בבית עם אהבה' : 'Everything baked at home with love' }}</p>
				</div>
				<div class="why-card">
					<span class="why-icon">✨</span>
					<h3>{{ lang === 'he' ? 'טרי ונקי' : 'Fresh & Clean' }}</h3>
					<p>{{ lang === 'he' ? 'רכיבים איכותיים בכשרות מהדרין' : 'Quality ingredients, Mehadrin kosher' }}</p>
				</div>
				<div class="why-card">
					<span class="why-icon">❤️</span>
					<h3>{{ lang === 'he' ? 'עבודת יד' : 'Handcrafted' }}</h3>
					<p>{{ lang === 'he' ? 'תשומת לב לכל פרט' : 'Attention to every detail' }}</p>
				</div>
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
		<!-- FLOATING WHATSAPP -->
		<a
			href="https://wa.me/972528460331?text=היי%20מרגלית!%20הגעתי%20מיריד%20הטעימות%20ויש%20לי%20שאלה"
			target="_blank"
			class="whatsapp-float"
		>
			<span class="whatsapp-icon">💬</span>
			<span class="whatsapp-text">{{ lang === 'he' ? 'שאלות?' : 'Questions?' }}</span>
		</a>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '../stores/orderStore';

const route = useRoute();
const router = useRouter();

const lang = computed(() => (route.query.lang === 'he' ? 'he' : 'en'));

const texts = {
	he: {
		title: 'תודה שהשתתפתם ביריד הטעימות! 💛',
		subtitle: 'שמחים שהכרתם את מרגליתות 🍓 הזמינו עכשיו או בקשו הצעת מחיר לאירוע.',
		quoteSubtitle: 'האתר שלנו בהקמה',
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
		title: 'Thank you for visiting us at the tasting fair! 💛',
		subtitle: 'We are so happy you discovered Margalitut 🍓 Order now or request an event quote.',
		quoteSubtitle: 'Our website is under construction',
		productsTitle: 'Our Products',
		add: 'Add',
		checkout: 'Checkout',
		quote: 'Event Quote',
		popular: 'Popular',
		items: 'items',
		contactTitle: 'Questions? Talk to us!',
		contactText: "We're happy to help with any question or special request",
	},
};

const t = computed(() => texts[lang.value]);

const products = computed(() => [
	{
		id: 1,
		name: lang.value === 'he' ? 'שמרים שוקולד' : 'choclate Yeast',
		description: lang.value === 'he' ? 'עוגת שמרים טרייה ורכה' : 'Fresh and soft yeast cake',
		price: 60,
		image: '/cakes/shmarim/yeast.jpeg',
		popular: true,
	},
	{
		id: 2,
		name: lang.value === 'he' ? 'מייפל אגוזים' : 'maple and nuts',
		description: lang.value === 'he' ? 'עוגת מייפל אגוזים' : 'maple and nuts cake',
		price: 60,
		image: '/cakes/mapel cake.jpeg',
	},
	{
		id: 3,
		name: lang.value === 'he' ? 'שוקולד ציפס' : 'chocolate chips',
		description: lang.value === 'he' ? 'עוגיות שוקולד ציפס' : 'chocolate chips cookies',
		price: 50,
		image: '/cookies/chocoChip.jpeg',
	},
	{
		id: 4,
		name: lang.value === 'he' ? 'חיתוכיות תות תפוח' : 'strawberry apple bars',
		description: lang.value === 'he' ? 'חיתוכיות תות תפוח' : 'strawberry and apple bars',
		price: 55,
		image: '/cookies/appleBars.jpeg',
	},
	{
		id: 5,
		name: lang.value === 'he' ? 'מגולגלות תמרים' : 'date rolls',
		description: lang.value === 'he' ? 'מגולגלות תמרים' : 'date rolls',
		price: 55,
		image: '/cookies/dateRolls.jpeg',
		popular: true,
	},
	{
		id: 6,
		name: lang.value === 'he' ? 'משלוח מנות פרימיום' : 'Premium Mishloach Manot',
		description: lang.value === 'he' ? 'משלוח מנות פרימיום לפורים' : 'Premium Purim Mishloach Manot',
		price: 275,
		image: '/specialEvents/Purim.jpeg',
	},
]);
const testimonials = [
	{
		name: 'Rabi Lary Shain',
		text: 'They are excelent!! כל הכבוד',
		product: 'ספינג',
	},
	{
		name: 'Levi Blumenfeld',
		text: 'Was mamash deliciouse! Thanks very much!',
		product: 'ספינג',
	},
	{
		name: 'יוסי ל.',
		text: 'העוגיות הכי טעימות! הילדים מתים על השוקולד צ׳יפס',
		product: 'עוגיות שוקולד צ׳יפס',
	},
	{
		name: 'רחל א.',
		text: 'סוף סוף מצאתי עוגות ללא גלוטן טעימות!',
		product: 'עוגת שוקולד ללא גלוטן',
	},
];
// Cart state
const cartItems = ref([]);

const isInCart = id => cartItems.value.some(item => item.id === id);
const getQty = id => cartItems.value.find(item => item.id === id)?.qty || 0;

const totalItems = computed(() => cartItems.value.reduce((sum, item) => sum + item.qty, 0));
const totalPrice = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0));
const isPromoActive = computed(() => {
	const now = new Date();
	const start = new Date('2026-02-17T20:00:00'); // מתחילת היום
	const end = new Date('2026-02-18T22:00:00'); // עד מחר 22:00
	return now >= start && now <= end;
});
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
	const orderStore = useOrderStore();
	orderStore.clearCart();

	cartItems.value.forEach(item => {
		orderStore.addToCart(
			{
				id: item.id,
				name: item.name,
				price: item.price,
				image: item.image,
			},
			item.qty,
		);
	});

	router.push('/checkout');
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
	object-fit: contain;
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
.promo-banner {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1.5rem;
	background: linear-gradient(135deg, #d34a6e, #ff8fab);
	color: white;
	border-radius: 12px;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;
	justify-content: center;
	text-align: center;
}

.promo-icon {
	font-size: 1.5rem;
}

.promo-text {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.promo-text code {
	background: rgba(255, 255, 255, 0.2);
	padding: 0.2rem 0.5rem;
	border-radius: 4px;
	font-weight: 700;
}

.promo-expires {
	font-size: 0.85rem;
	opacity: 0.9;
}
/* TESTIMONIALS */
.testimonials-section {
	margin-bottom: 2rem;
}

.section-title {
	font-size: 1.5rem;
	font-weight: 700;
	text-align: center;
	margin-bottom: 1.5rem;
	color: var(--text-primary, #333);
}

.testimonials-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 1rem;
}

.testimonial-card {
	background: var(--bg-primary, white);
	border-radius: 12px;
	padding: 1.25rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.testimonial-text {
	font-size: 0.95rem;
	color: var(--text-secondary, #666);
	margin: 0 0 1rem 0;
	line-height: 1.6;
	font-style: italic;
}

.testimonial-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.testimonial-name {
	font-weight: 600;
	font-size: 0.9rem;
	color: var(--text-primary, #333);
}

.testimonial-product {
	font-size: 0.8rem;
	color: var(--pink-primary, #d34a6e);
	background: var(--pink-light, #fff0f5);
	padding: 0.2rem 0.6rem;
	border-radius: 12px;
}
/* WHY SECTION */
.why-section {
	margin-bottom: 2rem;
}

.why-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;
}

.why-card {
	text-align: center;
	padding: 1.5rem 1rem;
	background: var(--bg-primary, white);
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.why-icon {
	font-size: 2rem;
	display: block;
	margin-bottom: 0.5rem;
}

.why-card h3 {
	font-size: 1rem;
	font-weight: 700;
	margin: 0 0 0.25rem 0;
	color: var(--text-primary, #333);
}

.why-card p {
	font-size: 0.85rem;
	color: var(--text-secondary, #666);
	margin: 0;
}

@media (max-width: 600px) {
	.why-grid {
		grid-template-columns: 1fr;
	}
}
/* FLOATING WHATSAPP */
.whatsapp-float {
	position: fixed;
	bottom: 5rem;
	left: 1.5rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.25rem;
	background: #25d366;
	color: white;
	border-radius: 50px;
	text-decoration: none;
	font-weight: 600;
	box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
	z-index: 50;
	transition: all 0.3s ease;
}

.whatsapp-float:hover {
	transform: scale(1.05);
	box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
}

.whatsapp-icon {
	font-size: 1.25rem;
}

.whatsapp-text {
	font-size: 0.9rem;
}

@media (max-width: 600px) {
	.whatsapp-float {
		bottom: 6rem;
		left: 1rem;
		padding: 0.6rem 1rem;
	}
}
.quote-subtitle {
	font-size: 0.95rem;
	color: #e74c3c;
	font-weight: 600;
	margin: 0 0 1rem 0;
}
</style>
