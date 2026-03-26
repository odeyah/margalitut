<template>
	<div class="pesach-page">
		<!-- LANGUAGE SWITCH -->
		<div class="lang-switch">
			<span class="lang-btn active">עברית</span>
			<router-link to="/Pesach-en" class="lang-btn">English</router-link>
		</div>

		<!-- HERO -->
		<section class="hero">
			<div class="hero-decoration">
				<span class="deco deco-1">🍷</span>
				<span class="deco deco-2">🥜</span>
				<span class="deco deco-3">🍰</span>
				<span class="deco deco-4">✡️</span>
			</div>
			<h1 class="hero-title">🌾 מאפים כשרים לפסח</h1>
			<p class="hero-subtitle">מרגליתות - טעמים מיוחדים לחג החירות</p>

			<!-- Kosher Badges -->
			<div class="kosher-badges">
				<span class="badge">✓ כשר לפסח</span>
				<span class="badge">✓ ללא חשש קטניות</span>
				<span class="badge">✓ ללא חשש שרויה</span>
				<span class="badge">✓ ללא גלוטן</span>
			</div>

			<div class="deadline-banner">
				<span class="deadline-icon">⏰</span>
				<span>הזמנות עד 29.3.26 בשעה 16:00</span>
			</div>
		</section>

		<!-- PRODUCTS SECTION -->
		<section class="products-section">
			<!-- Cakes Category -->
			<div class="category">
				<h2 class="category-title">
					<span class="category-icon">🎂</span>
					עוגות כשרות לפסח
				</h2>
				<p class="category-description">עוגות עשירות מקמח שקדים ואגוזים, בשמן אגוזים איכותי</p>

				<div class="products-grid">
					<div
						v-for="product in cakes"
						:key="product.id"
						class="product-card"
						:class="{ selected: isProductSelected(product.id) }"
						@click="toggleProduct(product)"
					>
						<div class="product-image">
							<img v-if="product.image" :src="product.image" :alt="product.name" class="product-img" />
							<div v-else class="image-placeholder">
								<span class="placeholder-text">התמונה עוד לא כאן</span>
								<span class="placeholder-subtext">אבל הטעם כבר פה!</span>
							</div>
						</div>
						<div class="product-info">
							<h3 class="product-name">{{ product.name }}</h3>
							<p class="product-description">{{ product.description }}</p>
							<div class="product-tags">
								<span class="tag">ללא גלוטן</span>
								<span v-if="product.dairy" class="tag dairy">חלבי</span>
								<span v-else class="tag parve">פרווה</span>
							</div>
							<div class="product-price">₪{{ product.price }}</div>
						</div>
						<div v-if="isProductSelected(product.id)" class="product-qty" @click.stop>
							<button @click="decrementProduct(product.id)">-</button>
							<span>{{ getProductQty(product.id) }}</span>
							<button @click="incrementProduct(product.id)">+</button>
						</div>
						<button v-else class="add-btn" @click.stop="toggleProduct(product)">הוסף לסל</button>
					</div>
				</div>
			</div>

			<!-- Cookies Category -->
			<div class="category">
				<h2 class="category-title">
					<span class="category-icon">🍪</span>
					עוגיות כשרות לפסח
				</h2>
				<p class="category-description">מארזי עוגיות פריכות ומפנקות לכל המשפחה</p>

				<div class="products-grid">
					<div
						v-for="product in cookies"
						:key="product.id"
						class="product-card"
						:class="{ selected: isProductSelected(product.id) }"
						@click="toggleProduct(product)"
					>
						<div class="product-image">
							<img v-if="product.image" :src="product.image" :alt="product.name" class="product-img" />
							<div v-else class="image-placeholder">
								<span class="placeholder-text">התמונה עוד לא כאן</span>
								<span class="placeholder-subtext">אבל הטעם כבר פה!</span>
							</div>
						</div>
						<div class="product-info">
							<h3 class="product-name">{{ product.name }}</h3>
							<p class="product-description">{{ product.description }}</p>
							<div class="product-tags">
								<span class="tag">ללא גלוטן</span>
								<span v-if="product.dairy" class="tag dairy">חלבי</span>
								<span v-else class="tag parve">פרווה</span>
							</div>
							<div class="product-price">₪{{ product.price }}</div>
						</div>
						<div v-if="isProductSelected(product.id)" class="product-qty" @click.stop>
							<button @click="decrementProduct(product.id)">-</button>
							<span>{{ getProductQty(product.id) }}</span>
							<button @click="incrementProduct(product.id)">+</button>
						</div>
						<button v-else class="add-btn" @click.stop="toggleProduct(product)">הוסף לסל</button>
					</div>
				</div>
			</div>
		</section>

		<!-- ORDER SUMMARY -->
		<Transition name="slide-up">
			<div v-if="hasSelection" class="order-summary">
				<div class="summary-details">
					<span class="summary-count">{{ totalItems }} פריטים</span>
					<span class="summary-total">₪{{ totalPrice }}</span>
				</div>
				<button class="order-btn" @click="proceedToOrder">להזמנה →</button>
			</div>
		</Transition>

		<!-- DELIVERY INFO -->
		<section class="delivery-section">
			<h2>🚚 משלוחים ואיסוף</h2>
			<div class="delivery-options">
				<div class="delivery-option">
					<span class="option-icon">🏠</span>
					<h4>איסוף עצמי</h4>
					<p>משכונת המשקפיים, בית שמש - ללא עלות</p>
				</div>
				<div class="delivery-option">
					<span class="option-icon">🚗</span>
					<h4>משלוח</h4>
					<p>משלוחים לבית שמש והסביבה בתוספת תשלום</p>
				</div>
			</div>
		</section>

		<!-- CONTACT -->
		<section class="contact-section">
			<h2>שאלות?</h2>
			<p>נשמח לעזור!</p>
			<div class="contact-links">
				<a href="tel:0528460331" class="contact-link">📱 052-846-0331</a>
				<a
					href="https://wa.me/972528460331?text=היי%20מרגלית!%20אני%20רוצה%20להזמין%20מאפים%20לפסח"
					target="_blank"
					class="contact-link whatsapp"
					>💬 WhatsApp</a
				>
			</div>
		</section>

		<!-- FLOATING WHATSAPP -->
		<a
			href="https://wa.me/972528460331?text=היי%20מרגלית!%20אני%20רוצה%20להזמין%20מאפים%20לפסח"
			target="_blank"
			class="whatsapp-float"
		>
			<span>💬</span>
			<span>שאלות?</span>
		</a>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '../stores/orderStore';

const router = useRouter();
const orderStore = useOrderStore();

// Products data
// image: null = יציג placeholder, image: '/path/to/image.jpg' = יציג תמונה
const cakes = ref([
	{
		id: 'cake-1',
		name: 'עוגת שקדים שוקולד המלכה',
		description: 'עוגת שקדים עשירה בציפוי שוקולד מריר, ללא חשש שרויה',
		price: 75,
		image: '/pesach/chocletTheQ.jpeg',
		dairy: false,
		category: 'עוגות',
	},
	{
		id: 'cake-2',
		name: 'עוגת שוקולד אגוזים',
		description: 'עוגת שוקולד עשירה עם אגוזים קלויים, ללא חשש שרויה',
		price: 75,
		image: '/pesach/nutsPesachCake.jpeg',
		dairy: false,
		category: 'עוגות',
	},
	{
		id: 'cake-3',
		name: 'עוגת שקדים תפוז',
		description: 'עוגת שקדים עם ארומת תפוז טבעית, ללא חשש שרויה',
		price: 75,
		image: '/pesach/orangePesachCake.jpeg',
		dairy: false,
		category: 'עוגות',
	},
	{
		id: 'cake-4',
		name: 'עוגת תפוחים אגוזים',
		description: 'עוגה ביתית עם תפוחים טריים ואגוזים, ללא חשש שרויה',
		price: 75,
		image: '/pesach/appleNutsPesachCake.jpeg',
		dairy: false,
		category: 'עוגות',
	},
]);

const cookies = ref([
	{
		id: 'cookie-1',
		name: 'עוגיות שקדים',
		description: 'מארז עוגיות שקדים פריכות ועדינות, ללא חשש שרויה',
		price: 65,
		image: '/pesach/almondsPesach.jpeg',
		dairy: true,
		category: 'עוגיות',
	},
	{
		id: 'cookie-2',
		name: 'עוגיות שוקוציפס',
		description: 'מארז עוגיות עם שוקולד ציפס בלגי, ללא חשש שרויה',
		price: 55,
		image: '/pesach/pesachChoclateChips.jpeg',
		dairy: false,
		category: 'עוגיות',
	},
	{
		id: 'cookie-3',
		name: 'עוגיות קינמון אגוזים',
		description: 'מארז עוגיות קינמון עם אגוזים קלויים, ללא חשש שרויה',
		price: 55,
		image: '/pesach/cinamonNuts.jpeg',
		dairy: false,
		category: 'עוגיות',
	},
	{
		id: 'cookie-4',
		name: 'מגולגלות תמרים',
		description: 'מארז עוגיות מגולגלות תמרים, ללא חשש שרויה ללא סוכר',
		price: 70,
		image: '/cookies/dateRolls.jpeg',
		dairy: false,
		category: 'עוגיות',
	},
]);

// Selected products state
const selectedProducts = ref({});

// Check if product is selected
const isProductSelected = productId => {
	return selectedProducts.value[productId] && selectedProducts.value[productId].qty > 0;
};

// Get product quantity
const getProductQty = productId => {
	return selectedProducts.value[productId]?.qty || 0;
};

// Toggle product selection
const toggleProduct = product => {
	if (isProductSelected(product.id)) {
		delete selectedProducts.value[product.id];
	} else {
		selectedProducts.value[product.id] = {
			...product,
			qty: 1,
		};
	}
};

// Increment product quantity
const incrementProduct = productId => {
	if (selectedProducts.value[productId]) {
		selectedProducts.value[productId].qty++;
	}
};

// Decrement product quantity
const decrementProduct = productId => {
	if (selectedProducts.value[productId]) {
		if (selectedProducts.value[productId].qty > 1) {
			selectedProducts.value[productId].qty--;
		} else {
			delete selectedProducts.value[productId];
		}
	}
};

// Computed properties
const hasSelection = computed(() => {
	return Object.keys(selectedProducts.value).length > 0;
});

const totalItems = computed(() => {
	return Object.values(selectedProducts.value).reduce((sum, item) => sum + item.qty, 0);
});

const totalPrice = computed(() => {
	return Object.values(selectedProducts.value).reduce((sum, item) => sum + item.price * item.qty, 0);
});

// Proceed to order
const proceedToOrder = () => {
	// Convert selected products to cart items
	const cartItems = Object.values(selectedProducts.value).map(item => ({
		id: item.id,
		name: item.name,
		price: item.price,
		quantity: item.qty,
		category: item.category,
		notes: 'כשר לפסח - ללא קטניות, ללא שרויה, ללא גלוטן',
	}));

	// Add to order store
	orderStore.setItems(cartItems);

	// Navigate to checkout
	router.push('/checkout?src=pesach');
};
</script>

<style scoped>
.pesach-page {
	max-width: 1000px;
	margin: 0 auto;
	padding: 1.5rem;
	padding-bottom: 100px;
	direction: rtl;
}

/* LANGUAGE SWITCH */
.lang-switch {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.lang-btn {
	padding: 0.5rem 1rem;
	border-radius: 20px;
	font-weight: 600;
	font-size: 0.9rem;
	text-decoration: none;
	color: #666;
	background: #f0f0f0;
	transition: all 0.2s ease;
}

.lang-btn:hover {
	background: #e0e0e0;
}

.lang-btn.active {
	background: #8b4513;
	color: white;
}

/* HERO */
.hero {
	text-align: center;
	padding: 2rem 1rem;
	background: linear-gradient(135deg, #fdf5e6, #faebd7);
	border-radius: 24px;
	margin-bottom: 2rem;
	position: relative;
	overflow: hidden;
}

.hero-decoration {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
}

.deco {
	position: absolute;
	font-size: 2rem;
	opacity: 0.3;
	animation: float 4s ease-in-out infinite;
}

.deco-1 {
	top: 10%;
	right: 10%;
	animation-delay: 0s;
}
.deco-2 {
	top: 20%;
	left: 15%;
	animation-delay: 1s;
}
.deco-3 {
	bottom: 20%;
	right: 15%;
	animation-delay: 2s;
}
.deco-4 {
	bottom: 15%;
	left: 10%;
	animation-delay: 3s;
}

@keyframes float {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	50% {
		transform: translateY(-10px) rotate(5deg);
	}
}

.hero-title {
	font-size: 2rem;
	font-weight: 800;
	color: #8b4513;
	margin: 0 0 0.5rem 0;
	position: relative;
}

.hero-subtitle {
	font-size: 1.1rem;
	color: #a0522d;
	margin: 0 0 1.5rem 0;
	position: relative;
}

/* Kosher Badges */
.kosher-badges {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
	position: relative;
}

.badge {
	background: white;
	color: #2e7d32;
	padding: 0.4rem 0.8rem;
	border-radius: 20px;
	font-size: 0.85rem;
	font-weight: 600;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.deadline-banner {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	background: linear-gradient(135deg, #8b4513, #a0522d);
	color: white;
	padding: 0.75rem 1.5rem;
	border-radius: 30px;
	font-weight: 700;
	position: relative;
}

.deadline-icon {
	font-size: 1.2rem;
}

/* PRODUCTS SECTION */
.products-section {
	margin-bottom: 2rem;
}

.category {
	margin-bottom: 2.5rem;
}

.category-title {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 1.5rem;
	font-weight: 700;
	color: #8b4513;
	margin: 0 0 0.5rem 0;
}

.category-icon {
	font-size: 1.75rem;
}

.category-description {
	color: #666;
	margin: 0 0 1.5rem 0;
	font-size: 0.95rem;
}

/* Products Grid */
.products-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 1.5rem;
}

.product-card {
	background: white;
	border-radius: 20px;
	padding: 1.25rem;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
	cursor: pointer;
	transition: all 0.3s ease;
	border: 2px solid transparent;
	display: flex;
	flex-direction: column;
}

.product-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-card.selected {
	border-color: #8b4513;
	background: #fdf5e6;
}

.product-image {
	height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1rem;
	border-radius: 12px;
	overflow: hidden;
	flex-shrink: 0;
}

.product-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 12px;
}

.image-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 1rem;
	background: linear-gradient(135deg, #fdf5e6, #f8f8f8);
	border-radius: 12px;
	width: 100%;
	height: 100%;
}

.placeholder-text {
	font-size: 0.75rem;
	color: #bbb;
	margin-bottom: 0.2rem;
}

.placeholder-subtext {
	font-size: 0.8rem;
	color: #8b4513;
	font-weight: 600;
}

.product-info {
	flex-grow: 1;
}

.product-name {
	font-size: 1.1rem;
	font-weight: 700;
	margin: 0 0 0.5rem 0;
	color: #333;
}

.product-description {
	font-size: 0.85rem;
	color: #666;
	margin: 0 0 0.75rem 0;
	line-height: 1.4;
}

.product-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem;
	margin-bottom: 0.75rem;
}

.tag {
	font-size: 0.7rem;
	padding: 0.25rem 0.5rem;
	border-radius: 12px;
	font-weight: 600;
}

.tag:not(.dairy):not(.parve) {
	background: #e8f5e9;
	color: #2e7d32;
}

.tag.dairy {
	background: #e3f2fd;
	color: #1565c0;
}

.tag.parve {
	background: #fff3e0;
	color: #e65100;
}

.product-price {
	font-size: 1.3rem;
	font-weight: 800;
	color: #8b4513;
	margin-bottom: 0.75rem;
}

.add-btn {
	width: 100%;
	padding: 0.75rem;
	background: linear-gradient(135deg, #8b4513, #a0522d);
	color: white;
	border: none;
	border-radius: 12px;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.3s ease;
	margin-top: auto;
}

.add-btn:hover {
	transform: scale(1.02);
	box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
}

.product-qty {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	margin-top: auto;
	padding: 0.5rem;
	background: #fdf5e6;
	border-radius: 12px;
}

.product-qty button {
	width: 36px;
	height: 36px;
	border: none;
	border-radius: 50%;
	background: #8b4513;
	color: white;
	font-size: 1.2rem;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s ease;
}

.product-qty button:hover {
	background: #a0522d;
	transform: scale(1.1);
}

.product-qty span {
	font-size: 1.2rem;
	font-weight: 700;
	color: #8b4513;
	min-width: 30px;
	text-align: center;
}

/* ORDER SUMMARY */
.order-summary {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: white;
	padding: 1rem 1.5rem;
	box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 50;
}

.summary-details {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.summary-count {
	font-size: 0.9rem;
	color: #666;
}

.summary-total {
	font-size: 1.5rem;
	font-weight: 800;
	color: #8b4513;
}

.order-btn {
	padding: 1rem 2rem;
	background: linear-gradient(135deg, #8b4513, #a0522d);
	color: white;
	border: none;
	border-radius: 12px;
	font-weight: 700;
	font-size: 1.1rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.order-btn:hover {
	transform: scale(1.05);
	box-shadow: 0 4px 20px rgba(139, 69, 19, 0.4);
}

/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
	transform: translateY(100%);
	opacity: 0;
}

/* DELIVERY SECTION */
.delivery-section {
	background: linear-gradient(135deg, #fdf5e6, #faebd7);
	border-radius: 20px;
	padding: 2rem;
	margin-bottom: 2rem;
	text-align: center;
}

.delivery-section h2 {
	font-size: 1.5rem;
	color: #8b4513;
	margin: 0 0 1.5rem 0;
}

.delivery-options {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
}

.delivery-option {
	background: white;
	padding: 1.5rem;
	border-radius: 16px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.option-icon {
	font-size: 2rem;
	display: block;
	margin-bottom: 0.75rem;
}

.delivery-option h4 {
	font-size: 1.1rem;
	color: #8b4513;
	margin: 0 0 0.5rem 0;
}

.delivery-option p {
	font-size: 0.9rem;
	color: #666;
	margin: 0;
}

/* CONTACT SECTION */
.contact-section {
	text-align: center;
	padding: 2rem;
	background: white;
	border-radius: 20px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
	margin-bottom: 2rem;
}

.contact-section h2 {
	font-size: 1.5rem;
	color: #8b4513;
	margin: 0 0 0.5rem 0;
}

.contact-section p {
	color: #666;
	margin: 0 0 1.5rem 0;
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
	padding: 0.75rem 1.5rem;
	background: #fdf5e6;
	color: #8b4513;
	border-radius: 30px;
	font-weight: 600;
	transition: all 0.3s ease;
}

.contact-link:hover {
	background: #8b4513;
	color: white;
	transform: translateY(-2px);
}

.contact-link.whatsapp {
	background: #25d366;
	color: white;
}

.contact-link.whatsapp:hover {
	background: #128c7e;
}

/* FLOATING WHATSAPP */
.whatsapp-float {
	position: fixed;
	bottom: 90px;
	left: 20px;
	background: #25d366;
	color: white;
	padding: 0.75rem 1.25rem;
	border-radius: 30px;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-weight: 600;
	box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
	transition: all 0.3s ease;
	z-index: 40;
}

.whatsapp-float:hover {
	transform: scale(1.05);
	box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
}

/* RESPONSIVE */
@media (max-width: 768px) {
	.hero-title {
		font-size: 1.5rem;
	}

	.hero-subtitle {
		font-size: 1rem;
	}

	.kosher-badges {
		gap: 0.4rem;
	}

	.badge {
		font-size: 0.75rem;
		padding: 0.3rem 0.6rem;
	}

	.products-grid {
		grid-template-columns: 1fr;
	}

	.category-title {
		font-size: 1.25rem;
	}

	.order-summary {
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}

	.summary-details {
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}

	.order-btn {
		width: 100%;
	}

	.whatsapp-float {
		bottom: 160px;
	}
}
</style>
