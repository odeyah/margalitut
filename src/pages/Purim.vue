<template>
	<div class="purim-page">
		<!-- LANGUAGE SWITCH -->
		<div class="lang-switch">
			<span class="lang-btn active">עברית</span>
			<router-link to="/purim-en" class="lang-btn">English</router-link>
		</div>

		<!-- HERO -->
		<section class="hero">
			<div class="hero-decoration">
				<span class="deco deco-1">🎭</span>
				<span class="deco deco-2">🍷</span>
				<span class="deco deco-3">🧁</span>
				<span class="deco deco-4">🎉</span>
			</div>
			<h1 class="hero-title">🎭 משלוחי מנות לפורים</h1>
			<p class="hero-subtitle">מרגליתות - משלוחי מנות מתוקים ומיוחדים לכל תקציב</p>
			<div class="deadline-banner">
				<span class="deadline-icon">⏰</span>
				<span>הזמנות עד 1.3.26 בשעה 16:00</span>
			</div>
		</section>

		<!-- TABS -->
		<div class="tabs">
			<button class="tab" :class="{ active: activeTab === 'packages' }" @click="activeTab = 'packages'">
				📦 חבילות מוכנות
			</button>
			<button class="tab" :class="{ active: activeTab === 'custom' }" @click="activeTab = 'custom'">🎨 הרכיבו בעצמכם</button>
		</div>

		<!-- PACKAGES TAB -->
		<section v-if="activeTab === 'packages'" class="packages-section">
			<!-- Budget Filter -->
			<div class="budget-filter">
				<span class="filter-label">סננו לפי תקציב:</span>
				<div class="budget-tags">
					<button
						v-for="budget in budgets"
						:key="budget.id"
						class="budget-tag"
						:class="{ active: selectedBudget === budget.id }"
						@click="selectedBudget = budget.id"
					>
						{{ budget.label }}
					</button>
				</div>
			</div>

			<!-- Packages Grid -->
			<div class="packages-grid">
				<div
					v-for="pkg in filteredPackages"
					:key="pkg.id"
					class="package-card"
					:class="{ popular: pkg.popular, selected: selectedPackage?.id === pkg.id }"
					@click="selectPackage(pkg)"
				>
					<span v-if="pkg.popular" class="popular-badge">🌟 פופולרי</span>
					<div class="package-image">
						<img v-if="pkg.image && pkg.image.startsWith('/')" :src="pkg.image" :alt="pkg.name" class="package-img" />
						<span v-else class="package-emoji">{{ pkg.image }}</span>
					</div>
					<h3 class="package-name">{{ pkg.name }}</h3>
					<p class="package-description">{{ pkg.description }}</p>
					<ul class="package-items">
						<li v-for="(item, i) in pkg.items" :key="i">{{ item }}</li>
					</ul>
					<div class="package-price">₪{{ pkg.price }}</div>
					<button class="select-btn" @click.stop="selectPackage(pkg)">
						{{ selectedPackage?.id === pkg.id ? '✓ נבחר' : 'בחירה' }}
					</button>
				</div>
			</div>
		</section>

		<!-- CUSTOM BUILDER TAB -->
		<section v-if="activeTab === 'custom'" class="custom-section">
			<p class="custom-intro">בחרו את המוצרים שאתם רוצים ובנו משלוח מנות בדיוק כמו שאתם אוהבים</p>

			<!-- Categories -->
			<div v-for="category in customCategories" :key="category.id" class="custom-category">
				<h3 class="category-title">{{ category.icon }} {{ category.name }}</h3>
				<div class="custom-items-grid">
					<div
						v-for="item in category.items"
						:key="item.id"
						class="custom-item"
						:class="{ selected: isItemSelected(item.id) }"
						@click="toggleItem(item)"
					>
						<span class="item-image">{{ item.image }}</span>
						<span class="item-name">{{ item.name }}</span>
						<span class="item-price">₪{{ item.price }}</span>
						<div v-if="isItemSelected(item.id)" class="item-qty" @click.stop>
							<button @click="decrementItem(item.id)">-</button>
							<span>{{ getItemQty(item.id) }}</span>
							<button @click="incrementItem(item.id)">+</button>
						</div>
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
					href="https://wa.me/972528460331?text=היי%20מרגלית!%20אני%20רוצה%20להזמין%20משלוח%20מנות%20לפורים"
					target="_blank"
					class="contact-link whatsapp"
					>💬 WhatsApp</a
				>
			</div>
		</section>

		<!-- FLOATING WHATSAPP -->
		<a
			href="https://wa.me/972528460331?text=היי%20מרגלית!%20אני%20רוצה%20להזמין%20משלוח%20מנות%20לפורים"
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

// State
const activeTab = ref('packages');
const selectedBudget = ref('all');
const selectedPackage = ref(null);
const customItems = ref([]);

// Budget tiers
const budgets = [
	{ id: 'all', label: 'הכל' },
	{ id: '20-50', label: '₪20-50' },
	{ id: '50-80', label: '₪50-80' },
	{ id: '81-110', label: '₪81-110' },
	{ id: '111-150', label: '₪111-150' },
	{ id: '150-200', label: '₪150-200' },
	{ id: '200+', label: '₪200+' },
];

// Ready Packages - 26 חבילות מחושבות
// מחירון: קאפקייק 8₪, עוגיות 45-55₪, עוגה 50-60₪, עוגה גדולה 70-95₪, יין קטן 5₪, יין גדול 35₪
// אריזה 10₪, אריזה מהודרת 20₪, שוקולד 10₪, שוקולד פרימיום 20₪, בונבוניירה 10₪, פירות יבשים 25₪
// חצי קילו גלידה 70₪, קילו גלידה 135₪
const packages = ref([
	// 20-50
	{
		id: 1,
		name: 'בייסיק',
		description: 'משלוח מנות קטן ומתוק',
		image: '🧁',
		price: 20,
		budget: '20-50',
		items: ['קאפקייק מעוצב', 'בקבוק יין קטן', 'אריזה עם בונבוניירה'],
	},
	{
		id: 2,
		name: 'מתוק קלאסי',
		description: 'שילוב מושלם של מתוק',
		image: '🍪',
		price: 40,
		budget: '20-50',
		items: ['2 קאפקייקס מעוצבים', 'בקבוק יין קטן', 'שוקולד', 'אריזה עם בונבוניירה'],
	},
	{
		id: 3,
		name: 'שמח ומתוק',
		description: 'חבילה שמחה לפורים',
		image: '🎉',
		price: 50,
		budget: '20-50',
		popular: true,
		items: ['3 קאפקייקס מעוצבים', 'בקבוק יין קטן', 'שוקולד', 'אריזה'],
	},
	// 50-80
	{
		id: 4,
		name: 'משפחתי',
		description: 'מושלם למשפחה',
		image: '👨‍👩‍👧‍👦',
		price: 65,
		budget: '50-80',
		items: ['עוגה', 'בקבוק יין קטן', 'אריזה'],
	},
	{
		id: 5,
		name: 'חגיגי',
		description: 'חגיגה של טעמים',
		image: '🎊',
		price: 80,
		budget: '50-80',
		popular: true,
		items: ['עוגה', 'בקבוק יין גדול', 'אריזה'],
	},
	// 81-110
	{
		id: 6,
		name: 'גלידה מתוקה',
		description: 'לאוהבי הגלידה',
		image: '🍦',
		price: 85,
		budget: '81-110',
		items: ['½ קילו גלידה ביתית', 'בקבוק יין קטן', 'אריזה'],
	},
	{
		id: 7,
		name: 'מלכותי',
		description: 'עוגה ועוגיות',
		image: '👑',
		price: 95,
		budget: '81-110',
		items: ['עוגה', 'מארז עוגיות', 'אריזה'],
	},
	{
		id: 8,
		name: 'פרימיום',
		description: 'איכות ללא פשרות',
		image: '⭐',
		price: 110,
		budget: '81-110',
		popular: true,
		items: ['עוגה', 'בקבוק יין גדול', 'שוקולד', 'אריזה מהודרת'],
	},
	// 111-150
	{
		id: 9,
		name: 'גלידה משפחתי',
		description: 'גלידה ויין לכל המשפחה',
		image: '🍦',
		price: 115,
		budget: '111-150',
		items: ['½ קילו גלידה ביתית', 'בקבוק יין גדול', 'אריזה'],
	},
	{
		id: 10,
		name: 'גרנד',
		description: 'עוגה גדולה ויין',
		image: '🏆',
		price: 120,
		budget: '111-150',
		items: ['עוגה גדולה', 'בקבוק יין גדול', 'אריזה'],
	},
	{
		id: 11,
		name: 'אקסקלוסיב',
		description: 'עוגה, עוגיות ויין',
		image: '💎',
		price: 130,
		budget: '111-150',
		popular: true,
		items: ['עוגה', 'מארז עוגיות', 'בקבוק יין גדול', 'אריזה'],
	},
	{
		id: 12,
		name: 'גלידה פרימיום',
		description: 'גלידה ועוגיות',
		image: '🍦',
		price: 130,
		budget: '111-150',
		items: ['½ קילו גלידה ביתית', 'מארז עוגיות', 'אריזה'],
	},
	{
		id: 13,
		name: 'VIP',
		description: 'עוגה גדולה ועוגיות',
		image: '🌟',
		price: 145,
		budget: '111-150',
		items: ['עוגה גדולה', 'מארז עוגיות פרימיום', 'אריזה מהודרת'],
	},
	{
		id: 14,
		name: 'גלידה גרנד',
		description: 'קילו גלידה ויין',
		image: '🍦',
		price: 150,
		budget: '111-150',
		popular: true,
		items: ['קילו גלידה ביתית', 'בקבוק יין קטן', 'אריזה'],
	},
	{
		id: 15,
		name: 'דה-לוקס',
		description: 'עוגה גדולה מפנקת',
		image: '✨',
		price: 150,
		budget: '111-150',
		items: ['עוגה גדולה', 'בקבוק יין גדול', 'שוקולד', 'אריזה מהודרת'],
	},
	// 150-200
	{
		id: 16,
		name: 'משפחה מורחבת',
		description: '2 עוגות ויין',
		image: '🏠',
		price: 160,
		budget: '150-200',
		items: ['2 עוגות', 'בקבוק יין גדול', 'אריזה'],
	},
	{
		id: 17,
		name: 'גלידה משפחה',
		description: 'קילו גלידה ויין גדול',
		image: '🍦',
		price: 175,
		budget: '150-200',
		items: ['קילו גלידה ביתית', 'בקבוק יין גדול', 'אריזה'],
	},
	{
		id: 18,
		name: 'רויאל',
		description: 'עוגה גדולה, עוגיות ויין',
		image: '👸',
		price: 180,
		budget: '150-200',
		popular: true,
		items: ['עוגה גדולה', 'מארז עוגיות פרימיום', 'בקבוק יין גדול', 'אריזה מהודרת'],
	},
	{
		id: 19,
		name: 'גלידה VIP',
		description: 'קילו גלידה ועוגיות',
		image: '🍦',
		price: 200,
		budget: '150-200',
		items: ['קילו גלידה ביתית', 'מארז עוגיות פרימיום', 'אריזה מהודרת'],
	},
	// 200+
	{
		id: 20,
		name: 'סופר VIP',
		description: 'עוגה גדולה מושלמת',
		image: '💫',
		price: 210,
		budget: '200+',
		items: ['עוגה גדולה פרימיום', 'מארז עוגיות פרימיום', 'בקבוק יין גדול', 'שוקולד פרימיום', 'אריזה מהודרת'],
	},
	{
		id: 21,
		name: 'מלכותי פלוס',
		description: '2 עוגות ועוגיות',
		image: '👑',
		price: 220,
		budget: '200+',
		items: ['2 עוגות', 'מארז עוגיות פרימיום', 'בקבוק יין גדול', 'אריזה מהודרת'],
	},
	{
		id: 22,
		name: 'גלידה רויאל',
		description: 'קילו גלידה, עוגה ויין',
		image: '🍦',
		price: 240,
		budget: '200+',
		items: ['קילו גלידה ביתית', 'עוגה', 'בקבוק יין גדול', 'אריזה מהודרת'],
	},
	{
		id: 23,
		name: 'אולטימטיבי',
		description: 'החבילה המושלמת',
		image: '🎭',
		price: 250,
		budget: '200+',
		popular: true,
		items: ['עוגה גדולה XL', 'מארז עוגיות פרימיום', 'בקבוק יין גדול', 'שוקולד פרימיום', 'פירות יבשים', 'אריזה מהודרת'],
	},
	{
		id: 24,
		name: 'גלידה אולטימטיבי',
		description: 'קילו גלידה, עוגה ועוגיות',
		image: '🍦',
		price: 275,
		budget: '200+',
		items: ['קילו גלידה ביתית', 'עוגה', 'מארז עוגיות פרימיום', 'בקבוק יין גדול', 'אריזה מהודרת'],
	},
	{
		id: 25,
		name: 'מארז עוגיות מלכותי',
		description: '7 סוגי עוגיות ונשיקות',
		image: '/specialEvents/Purim.jpeg',
		price: 275,
		budget: '200+',
		popular: true,
		items: ['מארז 7 סוגי עוגיות', 'נשיקות', 'בונבוניירה גדולה', 'בקבוק יין גדול'],
	},
	{
		id: 26,
		name: 'הכל כלול',
		description: 'הכי גדול שיש!',
		image: '🎁',
		price: 320,
		budget: '200+',
		items: ['עוגה גדולה XL', 'מארז עוגיות פרימיום', 'קילו גלידה ביתית', 'בקבוק יין גדול', 'אריזה מהודרת'],
	},
]);

// Custom builder categories
// מחירון: קאפקייק 8₪, עוגיות 45-55₪, עוגה 50-60₪, עוגה גדולה 70-95₪, יין קטן 5₪, יין גדול 35₪
// אריזה 10₪, אריזה מהודרת 20₪, שוקולד 10₪, בונבוניירה 10₪, חצי קילו גלידה 70₪, קילו גלידה 135₪
const customCategories = [
	{
		id: 'icecream',
		name: 'גלידה ביתית',
		icon: '🍦',
		items: [
			{ id: 'ice1', name: '½ קילו גלידה', price: 70, image: '🍦' },
			{ id: 'ice2', name: 'קילו גלידה', price: 135, image: '🍦' },
		],
	},
	{
		id: 'cakes',
		name: 'עוגות',
		icon: '🎂',
		items: [
			{ id: 'c1', name: 'עוגה', price: 50, image: '🍰' },
			{ id: 'c2', name: 'עוגה פרימיום', price: 60, image: '🍰' },
			{ id: 'c3', name: 'עוגה גדולה', price: 70, image: '🎂' },
			{ id: 'c4', name: 'עוגה גדולה פרימיום', price: 85, image: '🎂' },
			{ id: 'c5', name: 'עוגה גדולה XL', price: 95, image: '🎂' },
		],
	},
	{
		id: 'cookies',
		name: 'עוגיות',
		icon: '🍪',
		items: [
			{ id: 'co1', name: 'מארז עוגיות', price: 45, image: '🍪' },
			{ id: 'co2', name: 'מארז עוגיות פרימיום', price: 55, image: '🍪' },
		],
	},
	{
		id: 'cupcakes',
		name: 'קאפקייקס',
		icon: '🧁',
		items: [
			{ id: 'cup1', name: 'קאפקייק מעוצב', price: 8, image: '🧁' },
			{ id: 'cup4', name: 'מארז 4 קאפקייקס', price: 30, image: '🧁' },
			{ id: 'cup6', name: 'מארז 6 קאפקייקס', price: 45, image: '🧁' },
		],
	},
	{
		id: 'drinks',
		name: 'משקאות',
		icon: '🍷',
		items: [
			{ id: 'd1', name: 'בקבוק יין קטן', price: 5, image: '🍷' },
			{ id: 'd2', name: 'בקבוק יין גדול', price: 35, image: '🍷' },
			{ id: 'd3', name: 'מיץ ענבים', price: 15, image: '🧃' },
		],
	},
	{
		id: 'extras',
		name: 'תוספות',
		icon: '🎁',
		items: [
			{ id: 'e1', name: 'שוקולד', price: 10, image: '🍫' },
			{ id: 'e2', name: 'שוקולד פרימיום', price: 20, image: '🍫' },
			{ id: 'e3', name: 'בונבוניירה', price: 10, image: '🍬' },
			{ id: 'e4', name: 'פירות יבשים', price: 25, image: '🥜' },
			{ id: 'e5', name: 'אריזה', price: 10, image: '🎀' },
			{ id: 'e6', name: 'אריזה מהודרת', price: 20, image: '🎁' },
		],
	},
];

// Computed
const filteredPackages = computed(() => {
	if (selectedBudget.value === 'all') {
		return packages.value;
	}
	return packages.value.filter(p => p.budget === selectedBudget.value);
});

const hasSelection = computed(() => {
	return selectedPackage.value || customItems.value.length > 0;
});

const totalItems = computed(() => {
	if (activeTab.value === 'packages' && selectedPackage.value) {
		return 1;
	}
	return customItems.value.reduce((sum, item) => sum + item.qty, 0);
});

const totalPrice = computed(() => {
	if (activeTab.value === 'packages' && selectedPackage.value) {
		return selectedPackage.value.price;
	}
	return customItems.value.reduce((sum, item) => sum + item.price * item.qty, 0);
});

// Methods
const selectPackage = pkg => {
	if (selectedPackage.value?.id === pkg.id) {
		selectedPackage.value = null;
	} else {
		selectedPackage.value = pkg;
		customItems.value = [];
	}
};

const isItemSelected = id => {
	return customItems.value.some(item => item.id === id);
};

const getItemQty = id => {
	const item = customItems.value.find(item => item.id === id);
	return item?.qty || 0;
};

const toggleItem = item => {
	const existing = customItems.value.find(i => i.id === item.id);
	if (existing) {
		customItems.value = customItems.value.filter(i => i.id !== item.id);
	} else {
		customItems.value.push({ ...item, qty: 1 });
		selectedPackage.value = null;
	}
};

const incrementItem = id => {
	const item = customItems.value.find(i => i.id === id);
	if (item) item.qty++;
};

const decrementItem = id => {
	const item = customItems.value.find(i => i.id === id);
	if (item) {
		if (item.qty > 1) {
			item.qty--;
		} else {
			customItems.value = customItems.value.filter(i => i.id !== id);
		}
	}
};

const proceedToOrder = () => {
	const orderStore = useOrderStore();
	orderStore.clearCart();

	if (activeTab.value === 'packages' && selectedPackage.value) {
		orderStore.addToCart(
			{
				id: `purim-pkg-${selectedPackage.value.id}`,
				name: `משלוח מנות "${selectedPackage.value.name}"`,
				price: selectedPackage.value.price,
				image: selectedPackage.value.image,
			},
			1,
		);
	} else {
		customItems.value.forEach(item => {
			orderStore.addToCart(
				{
					id: `purim-custom-${item.id}`,
					name: item.name,
					price: item.price,
					image: item.image,
				},
				item.qty,
			);
		});
	}

	router.push('/checkout?src=purim');
};
</script>

<style scoped>
.purim-page {
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
	background: #d34a6e;
	color: white;
}

/* HERO */
.hero {
	text-align: center;
	padding: 2.5rem 1.5rem;
	background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
	border-radius: 24px;
	margin-bottom: 2rem;
	position: relative;
	overflow: hidden;
}

.hero-decoration {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.deco {
	position: absolute;
	font-size: 2rem;
	opacity: 0.3;
	animation: float 3s ease-in-out infinite;
}

.deco-1 {
	top: 10%;
	left: 10%;
	animation-delay: 0s;
}
.deco-2 {
	top: 20%;
	right: 10%;
	animation-delay: 0.5s;
}
.deco-3 {
	bottom: 20%;
	left: 15%;
	animation-delay: 1s;
}
.deco-4 {
	bottom: 10%;
	right: 15%;
	animation-delay: 1.5s;
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
	color: #333;
	margin: 0 0 0.75rem 0;
	position: relative;
}

.hero-subtitle {
	font-size: 1.1rem;
	color: #666;
	margin: 0 0 1.5rem 0;
	position: relative;
}

.deadline-banner {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	background: #e74c3c;
	color: white;
	border-radius: 50px;
	font-weight: 700;
	position: relative;
}

.deadline-icon {
	font-size: 1.25rem;
}

/* TABS */
.tabs {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 2rem;
	background: #f5f5f5;
	padding: 0.5rem;
	border-radius: 16px;
}

.tab {
	flex: 1;
	padding: 1rem;
	border: none;
	background: transparent;
	border-radius: 12px;
	font-weight: 700;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.tab:hover {
	background: rgba(255, 255, 255, 0.5);
}

.tab.active {
	background: white;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	color: #d34a6e;
}

/* BUDGET FILTER */
.budget-filter {
	margin-bottom: 1.5rem;
}

.filter-label {
	display: block;
	font-weight: 600;
	margin-bottom: 0.75rem;
	color: #333;
}

.budget-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.budget-tag {
	padding: 0.5rem 1rem;
	border: 2px solid #e0e0e0;
	background: white;
	border-radius: 25px;
	font-weight: 600;
	font-size: 0.9rem;
	cursor: pointer;
	transition: all 0.2s ease;
}

.budget-tag:hover {
	border-color: #d34a6e;
}

.budget-tag.active {
	background: #d34a6e;
	border-color: #d34a6e;
	color: white;
}

/* PACKAGES GRID */
.packages-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 1.5rem;
}

.package-card {
	background: white;
	border-radius: 20px;
	padding: 1.5rem;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	border: 2px solid transparent;
}

.package-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.package-card.selected {
	border-color: #d34a6e;
	background: #fff5f8;
}

.package-card.popular {
	border-color: #ffd700;
}

.popular-badge {
	position: absolute;
	top: -10px;
	right: 1rem;
	background: linear-gradient(135deg, #ffd700, #ffb347);
	color: #333;
	padding: 0.3rem 0.75rem;
	border-radius: 20px;
	font-size: 0.8rem;
	font-weight: 700;
}

.package-image {
	font-size: 3rem;
	text-align: center;
	margin-bottom: 1rem;
}

.package-name {
	font-size: 1.25rem;
	font-weight: 700;
	margin: 0 0 0.5rem 0;
	text-align: center;
}

.package-description {
	font-size: 0.9rem;
	color: #666;
	text-align: center;
	margin: 0 0 1rem 0;
}

.package-items {
	list-style: none;
	padding: 0;
	margin: 0 0 1rem 0;
	font-size: 0.85rem;
	color: #555;
}

.package-items li {
	padding: 0.3rem 0;
	border-bottom: 1px dashed #eee;
}

.package-items li:last-child {
	border-bottom: none;
}

.package-items li::before {
	content: '✓ ';
	color: #27ae60;
}

.package-price {
	font-size: 1.5rem;
	font-weight: 800;
	color: #d34a6e;
	text-align: center;
	margin-bottom: 1rem;
}

.select-btn {
	width: 100%;
	padding: 0.75rem;
	background: linear-gradient(135deg, #d34a6e, #ff8fab);
	color: white;
	border: none;
	border-radius: 12px;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.3s ease;
}

.select-btn:hover {
	transform: scale(1.02);
}

.package-card.selected .select-btn {
	background: #27ae60;
}

/* CUSTOM BUILDER */
.custom-section {
	padding: 1rem 0;
}

.custom-intro {
	text-align: center;
	color: #666;
	margin-bottom: 2rem;
}

.custom-category {
	margin-bottom: 2rem;
}

.category-title {
	font-size: 1.1rem;
	font-weight: 700;
	margin: 0 0 1rem 0;
	padding-bottom: 0.5rem;
	border-bottom: 2px solid #f0f0f0;
}

.custom-items-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	gap: 1rem;
}

.custom-item {
	background: white;
	border-radius: 12px;
	padding: 1rem;
	text-align: center;
	cursor: pointer;
	transition: all 0.2s ease;
	border: 2px solid #f0f0f0;
}

.custom-item:hover {
	border-color: #ffd6e7;
}

.custom-item.selected {
	border-color: #d34a6e;
	background: #fff5f8;
}

.item-image {
	font-size: 2rem;
	display: block;
	margin-bottom: 0.5rem;
}

.item-name {
	font-size: 0.85rem;
	font-weight: 600;
	display: block;
	margin-bottom: 0.25rem;
}

.item-price {
	font-size: 0.9rem;
	font-weight: 700;
	color: #d34a6e;
}

.item-qty {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	margin-top: 0.5rem;
}

.item-qty button {
	width: 24px;
	height: 24px;
	border: 1px solid #d34a6e;
	background: white;
	border-radius: 6px;
	color: #d34a6e;
	font-weight: bold;
	cursor: pointer;
}

.item-qty button:hover {
	background: #d34a6e;
	color: white;
}

.item-qty span {
	font-weight: 700;
	min-width: 20px;
}

/* ORDER SUMMARY */
.order-summary {
	position: fixed;
	bottom: 1.5rem;
	left: 50%;
	transform: translateX(-50%);
	background: linear-gradient(135deg, #d34a6e, #ff8fab);
	color: white;
	padding: 1rem 1.5rem;
	border-radius: 16px;
	display: flex;
	align-items: center;
	gap: 1.5rem;
	box-shadow: 0 8px 30px rgba(211, 74, 110, 0.4);
	z-index: 100;
}

.summary-details {
	display: flex;
	flex-direction: column;
}

.summary-count {
	font-size: 0.85rem;
	opacity: 0.9;
}

.summary-total {
	font-size: 1.25rem;
	font-weight: 800;
}

.order-btn {
	background: white;
	color: #d34a6e;
	padding: 0.75rem 1.25rem;
	border: none;
	border-radius: 10px;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s ease;
}

.order-btn:hover {
	transform: scale(1.05);
}

/* DELIVERY SECTION */
.delivery-section {
	margin-top: 3rem;
	text-align: center;
}

.delivery-section h2 {
	font-size: 1.5rem;
	margin-bottom: 1.5rem;
}

.delivery-options {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
}

.delivery-option {
	background: white;
	padding: 1.5rem;
	border-radius: 16px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.option-icon {
	font-size: 2rem;
	display: block;
	margin-bottom: 0.5rem;
}

.delivery-option h4 {
	margin: 0 0 0.5rem 0;
	font-size: 1.1rem;
}

.delivery-option p {
	margin: 0;
	font-size: 0.9rem;
	color: #666;
}

/* CONTACT */
.contact-section {
	margin-top: 2rem;
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
	margin: 0 0 1rem 0;
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
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	transition: all 0.2s ease;
}

.contact-link:hover {
	transform: translateY(-2px);
}

.contact-link.whatsapp {
	background: #25d366;
	color: white;
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

	.packages-grid {
		grid-template-columns: 1fr;
	}

	.custom-items-grid {
		grid-template-columns: repeat(2, 1fr);
	}

	.order-summary {
		left: 1rem;
		right: 1rem;
		transform: none;
	}

	.tabs {
		flex-direction: column;
	}

	.whatsapp-float {
		bottom: 6rem;
		left: 1rem;
	}
}
</style>
