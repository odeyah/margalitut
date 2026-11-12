<template>
	<div class="faq-page">
		<header class="page-header">
			<span class="header-icon">❓</span>
			<h1 class="page-title">{{ lang === 'en' ? 'Frequently Asked Questions' : 'שאלות נפוצות' }}</h1>
			<p class="page-subtitle">
				{{ lang === 'en' ? 'Everything you wanted to know about margalitut' : 'כל מה שרצית לדעת על מרגליתות' }}
			</p>
		</header>

		<div class="search-section">
			<div class="search-box">
				<span class="search-icon">🔍</span>
				<input
					type="text"
					v-model="searchQuery"
					:placeholder="lang === 'en' ? 'Search a question...' : 'חיפוש שאלה...'"
					class="search-input"
				/>
				<button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
			</div>
		</div>

		<div class="categories-filter">
			<button
				v-for="category in categories"
				:key="category.id"
				class="filter-btn"
				:class="{ active: activeCategory === category.id }"
				@click="activeCategory = category.id"
			>
				<span class="filter-icon">{{ category.icon }}</span>
				<span class="filter-label">{{ category.name }}</span>
			</button>
		</div>

		<div class="faq-list">
			<TransitionGroup name="faq">
				<div v-for="item in filteredFAQ" :key="item.id" class="faq-item animate-on-scroll fade-up">
					<button class="faq-question" @click="toggleItem(item.id)">
						<span class="question-icon">{{ item.icon }}</span>
						<span class="question-text">{{ item.question }}</span>
						<span class="toggle-icon">{{ openItems.includes(item.id) ? '−' : '+' }}</span>
					</button>
					<Transition name="answer">
						<div v-if="openItems.includes(item.id)" class="faq-answer">
							<p v-html="item.answer"></p>
						</div>
					</Transition>
				</div>
			</TransitionGroup>

			<div v-if="filteredFAQ.length === 0" class="no-results">
				<span class="no-results-icon">🤔</span>
				<h3>{{ lang === 'en' ? 'No results found' : 'לא נמצאו תוצאות' }}</h3>
				<p>
					{{ lang === 'en' ? 'Try another search term or contact us directly.' : 'נסו לחפש במילים אחרות או צרו איתנו קשר' }}
				</p>
			</div>
		</div>

		<section class="contact-section">
			<div class="contact-card">
				<span class="contact-icon">💬</span>
				<h2>{{ lang === 'en' ? 'Still have questions?' : 'עדיין יש שאלות?' }}</h2>
				<p>
					{{ lang === 'en' ? 'We are here for you — feel free to reach out.' : 'אנחנו כאן בשבילכם! צרו קשר ונשמח לעזור' }}
				</p>
				<div class="contact-buttons">
					<a href="https://wa.me/972528460331" target="_blank" class="contact-btn whatsapp">
						<span>💬</span> {{ lang === 'en' ? 'WhatsApp' : 'וואטסאפ' }}
					</a>
					<a href="tel:0528460331" class="contact-btn phone"> <span>📱</span> 052-846-0331 </a>
					<a href="mailto:margalital3@gmail.com" class="contact-btn email">
						<span>📧</span> {{ lang === 'en' ? 'Email' : 'אימייל' }}
					</a>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useHead } from '@vueuse/head';
import { useRoute } from 'vue-router';
import { useScrollAnimation } from '../composables/useScrollAnimation';
useScrollAnimation();
const route = useRoute();
const searchQuery = ref('');
const activeCategory = ref('all');
const openItems = ref([]);
const lang = computed(() => (route.query.lang === 'en' ? 'en' : 'he'));

const categories = computed(() =>
	lang.value === 'en'
		? [
				{ id: 'all', name: 'All', icon: '📋' },
				{ id: 'orders', name: 'Orders', icon: '🛒' },
				{ id: 'delivery', name: 'Delivery', icon: '🚗' },
				{ id: 'products', name: 'Products', icon: '🍰' },
				{ id: 'payment', name: 'Payment', icon: '💳' },
				{ id: 'workshops', name: 'Workshops', icon: '👩‍🍳' },
				{ id: 'kashrut', name: 'Kosher', icon: '✡️' },
			]
		: [
				{ id: 'all', name: 'הכל', icon: '📋' },
				{ id: 'orders', name: 'הזמנות', icon: '🛒' },
				{ id: 'delivery', name: 'משלוחים', icon: '🚗' },
				{ id: 'products', name: 'מוצרים', icon: '🍰' },
				{ id: 'payment', name: 'תשלום', icon: '💳' },
				{ id: 'workshops', name: 'חוגים', icon: '👩‍🍳' },
				{ id: 'kashrut', name: 'כשרות', icon: '✡️' },
			],
);

const hebrewFaqItems = [
	{
		id: 1,
		category: 'orders',
		icon: '📅',
		question: 'כמה זמן מראש צריך להזמין?',
		answer:
			'מומלץ להזמין <strong>לפחות 2-3 ימים מראש</strong>. לאירועים גדולים או עוגות מעוצבות מורכבות - מומלץ להזמין שבוע מראש. להזמנות דחופות - צרו קשר ונראה מה אפשר לעשות! 😊',
	},
	{
		id: 2,
		category: 'orders',
		icon: '📝',
		question: 'איך מזמינים?',
		answer:
			'אפשר להזמין דרך האתר, בוואטסאפ, או בטלפון. פשוט בחרו את המוצרים שאתם רוצים, הוסיפו לסל, ועברו לתשלום. קל ופשוט!',
	},
	{
		id: 3,
		category: 'orders',
		icon: '🔄',
		question: 'אפשר לבטל או לשנות הזמנה?',
		answer:
			'כן, אפשר לבטל או לשנות הזמנה <strong>עד 24 שעות לפני מועד האיסוף/משלוח</strong>. לאחר מכן, ייתכן שלא נוכל לבצע שינויים כי כבר התחלנו להכין את ההזמנה.',
	},
	{
		id: 10,
		category: 'delivery',
		icon: '🚗',
		question: 'לאן אתם מבצעים משלוחים?',
		answer:
			"אנחנו מבצעים משלוחים ל<strong>בית שמש וכל השכונות</strong> (כולל רמת בית שמש א', ב', ג'), ולישובים הסמוכים. לישובים רחוקים יותר - צרו קשר ונבדוק.",
	},
	{
		id: 20,
		category: 'products',
		icon: '🎂',
		question: 'אפשר להזמין עוגה בעיצוב אישי?',
		answer:
			'כן! אנחנו מתמחים בעוגות מעוצבות לימי הולדת, בר/בת מצווה, חתונות ואירועים. שלחו לנו את הרעיון שלכם ונשמח להגשים אותו!',
	},
	{
		id: 21,
		category: 'products',
		icon: '🌾',
		question: 'יש מוצרים ללא גלוטן?',
		answer:
			'כן! יש לנו <strong>מגוון מוצרים ללא גלוטן</strong> - עוגות, עוגיות ולחמים. כל המוצרים מוכנים בכלים נפרדים למניעת זיהום צולב.',
	},
	{
		id: 30,
		category: 'payment',
		icon: '💳',
		question: 'באילו אמצעי תשלום אפשר לשלם?',
		answer:
			'אנחנו מקבלים:<br>• <strong>Bit</strong> - 052-844-1093<br>• <strong>PayBox</strong> - 052-846-0331<br>• <strong>מזומן</strong> - בעת האיסוף/משלוח',
	},
	{
		id: 40,
		category: 'workshops',
		icon: '👧',
		question: 'לאיזה גילאים החוגים מתאימים?',
		answer:
			'יש לנו חוגים לכל הגילאים:<br>• <strong>גילאי 3.5-6</strong> - אפרוחי האפייה<br>• <strong>גילאי 6-9</strong> - שפים צעירים<br>• <strong>גילאי 9-12</strong> - אופים מקצועיים',
	},
	{
		id: 50,
		category: 'kashrut',
		icon: '✡️',
		question: 'מה הכשרות של המוצרים?',
		answer: 'כל המוצרים שלנו בכשרות <strong>מהדרין</strong>. אנחנו משתמשים רק בחומרי גלם עם הכשר מהדרין.',
	},
];

const englishFaqItems = [
	{
		id: 1,
		category: 'orders',
		icon: '📅',
		question: 'How far in advance should I order?',
		answer:
			'We recommend ordering <strong>at least 2–3 days in advance</strong>. For large events or more complex custom cakes, we suggest ordering a week ahead. For urgent requests, please contact us and we will see what we can do.',
	},
	{
		id: 2,
		category: 'orders',
		icon: '📝',
		question: 'How do I place an order?',
		answer:
			'You can order through the website, WhatsApp, or by phone. Simply choose the products you want, add them to the cart, and proceed to payment.',
	},
	{
		id: 3,
		category: 'orders',
		icon: '🔄',
		question: 'Can I cancel or change my order?',
		answer:
			'Yes — you can cancel or change an order <strong>up to 24 hours before pickup or delivery</strong>. After that, changes may not be possible because production has already begun.',
	},
	{
		id: 10,
		category: 'delivery',
		icon: '🚗',
		question: 'Where do you deliver?',
		answer:
			'We deliver throughout <strong>Beit Shemesh and nearby neighborhoods</strong>, including Ramat Beit Shemesh and surrounding communities. For farther locations, please contact us to check availability.',
	},
	{
		id: 20,
		category: 'products',
		icon: '🎂',
		question: 'Can I order a custom-designed cake?',
		answer:
			'Yes! We specialize in custom cakes for birthdays, bar/bat mitzvahs, weddings, and special events. Send us your idea and we would be happy to bring it to life.',
	},
	{
		id: 21,
		category: 'products',
		icon: '🌾',
		question: 'Do you offer gluten-free products?',
		answer:
			'Yes! We have a <strong>selection of gluten-free products</strong> including cakes, cookies, and breads. They are prepared with separate tools to reduce cross-contamination.',
	},
	{
		id: 30,
		category: 'payment',
		icon: '💳',
		question: 'What payment methods do you accept?',
		answer:
			'We accept:<br>• <strong>Bit</strong> - 052-844-1093<br>• <strong>PayBox</strong> - 052-846-0331<br>• <strong>Cash</strong> - on pickup or delivery',
	},
	{
		id: 40,
		category: 'workshops',
		icon: '👧',
		question: 'What age groups are the workshops for?',
		answer:
			'We have workshops for all ages:<br>• <strong>3.5–6 years</strong> - Little bakers<br>• <strong>6–9 years</strong> - Young chefs<br>• <strong>9–12 years</strong> - Junior bakers',
	},
	{
		id: 50,
		category: 'kashrut',
		icon: '✡️',
		question: 'What is the kashrut standard?',
		answer:
			'All of our products are made under <strong>mehadrin kosher</strong> standards, using ingredients with strict kosher certification.',
	},
];

const faqItems = computed(() => (lang.value === 'en' ? englishFaqItems : hebrewFaqItems));

useHead({
	title: lang.value === 'en' ? 'FAQ | margalitut Bakery' : 'שאלות נפוצות | מרגליתות - מאפייה ביתית בבית שמש',
	meta: [
		{
			name: 'description',
			content:
				lang.value === 'en'
					? 'Frequently asked questions about ordering, delivery, kosher certification, custom cakes, workshops, and bakery products from margalitut in Beit Shemesh.'
					: 'שאלות נפוצות על הזמנות, משלוחים, כשרות, עוגות מעוצבות, חוגי אפייה ומאפים בבית שמש. כל מה שצריך לדעת לפני להזמין ממרגליתות.',
		},
		{
			name: 'keywords',
			content:
				lang.value === 'en'
					? 'FAQ bakery Beit Shemesh, delivery, custom cakes, workshops, kosher bakery, order cake'
					: 'שאלות נפוצות מאפייה בית שמש, משלוחים בית שמש, עוגות מעוצבות, חוגי אפייה, מאפייה כשרה, הזמנת עוגה',
		},
	],
	script: [
		{
			type: 'application/ld+json',
			children: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: faqItems.value.slice(0, 8).map(item => ({
					'@type': 'Question',
					name: item.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: item.answer
							.replace(/<[^>]+>/g, '')
							.replace(/\s+/g, ' ')
							.trim(),
					},
				})),
			}),
		},
	],
});

const filteredFAQ = computed(() => {
	let items = faqItems.value;

	// סינון לפי קטגוריה
	if (activeCategory.value !== 'all') {
		items = items.filter(item => item.category === activeCategory.value);
	}

	// סינון לפי חיפוש
	if (searchQuery.value.trim()) {
		const query = searchQuery.value.toLowerCase();
		items = items.filter(item => item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query));
	}

	return items;
});

function toggleItem(id) {
	const index = openItems.value.indexOf(id);
	if (index > -1) {
		openItems.value.splice(index, 1);
	} else {
		openItems.value.push(id);
	}
}
</script>

<style scoped>
.faq-page {
	max-width: 800px;
	margin: 0 auto;
}

/* Header */
.page-header {
	text-align: center;
	margin-bottom: 2rem;
}

.header-icon {
	font-size: 3rem;
	display: block;
	margin-bottom: 0.5rem;
}

.page-title {
	font-size: 2.25rem;
	font-weight: 800;
	margin: 0 0 0.5rem 0;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.page-subtitle {
	font-size: 1.1rem;
	color: var(--text-secondary);
	margin: 0;
}

/* Search */
.search-section {
	margin-bottom: 1.5rem;
}

.search-box {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	background: var(--bg-primary);
	border: 2px solid var(--border-color);
	border-radius: 30px;
	padding: 0.75rem 1.25rem;
	transition: all 0.3s ease;
}

.search-box:focus-within {
	border-color: var(--pink-primary);
	box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
}

.search-icon {
	font-size: 1.25rem;
}

.search-input {
	flex: 1;
	border: none;
	background: transparent;
	font-size: 1rem;
	color: var(--text-primary);
	outline: none;
}

.search-input::placeholder {
	color: var(--text-muted);
}

.clear-btn {
	background: var(--bg-secondary);
	border: none;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	font-size: 0.8rem;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.clear-btn:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

/* Categories Filter */
.categories-filter {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 2rem;
	overflow-x: auto;
	padding-bottom: 0.5rem;
}

.filter-btn {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	padding: 0.5rem 0.85rem;
	background: var(--bg-primary);
	border: 2px solid transparent;
	border-radius: 25px;
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	white-space: nowrap;
	transition: all 0.3s ease;
	flex-shrink: 0;
}

.filter-btn:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

.filter-btn.active {
	background: var(--pink-light);
	border-color: var(--pink-primary);
	color: var(--pink-primary);
}

.filter-icon {
	font-size: 1rem;
}

/* FAQ List */
.faq-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 3rem;
}

.faq-item {
	background: var(--bg-primary);
	border-radius: 16px;
	box-shadow: var(--card-shadow);
	overflow: hidden;
	transition: all 0.3s ease;
}

.faq-item:hover {
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.faq-item.open {
	box-shadow: 0 8px 25px rgba(255, 107, 157, 0.15);
}

.faq-question {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1.25rem;
	background: transparent;
	border: none;
	cursor: pointer;
	text-align: right;
	transition: all 0.3s ease;
}

.faq-item.open .faq-question {
	background: var(--pink-light);
}

.question-icon {
	font-size: 1.5rem;
	flex-shrink: 0;
}

.question-text {
	flex: 1;
	font-size: 1.05rem;
	font-weight: 600;
	color: var(--text-primary);
	line-height: 1.4;
}

.toggle-icon {
	width: 28px;
	height: 28px;
	background: var(--bg-secondary);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
	font-weight: 700;
	color: var(--pink-primary);
	flex-shrink: 0;
	transition: all 0.3s ease;
}

.faq-item.open .toggle-icon {
	background: var(--pink-primary);
	color: white;
}

.faq-answer {
	padding: 0 1.25rem 1.25rem;
	padding-right: 4rem;
}

.faq-answer p {
	font-size: 1rem;
	color: var(--text-secondary);
	line-height: 1.7;
	margin: 0;
}

.faq-answer :deep(strong) {
	color: var(--text-primary);
	font-weight: 600;
}

/* Answer Transition */
.answer-enter-active,
.answer-leave-active {
	transition: all 0.3s ease;
}

.answer-enter-from,
.answer-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* FAQ Transition */
.faq-enter-active,
.faq-leave-active {
	transition: all 0.3s ease;
}

.faq-enter-from,
.faq-leave-to {
	opacity: 0;
	transform: translateY(20px);
}

.faq-move {
	transition: transform 0.3s ease;
}

/* No Results */
.no-results {
	text-align: center;
	padding: 3rem;
	background: var(--bg-primary);
	border-radius: 20px;
}

.no-results-icon {
	font-size: 3rem;
	display: block;
	margin-bottom: 1rem;
}

.no-results h3 {
	font-size: 1.25rem;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.no-results p {
	color: var(--text-secondary);
	margin: 0;
}

/* Contact Section */
.contact-section {
	margin-bottom: 2rem;
}

.contact-card {
	text-align: center;
	padding: 2.5rem;
	background: linear-gradient(135deg, var(--pink-light), var(--bg-primary));
	border-radius: 24px;
	border: 2px solid var(--border-pink);
}

.contact-icon {
	font-size: 3rem;
	display: block;
	margin-bottom: 1rem;
}

.contact-card h2 {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.contact-card p {
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
}

.contact-buttons {
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.contact-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	border-radius: 25px;
	font-weight: 600;
	font-size: 0.95rem;
	text-decoration: none;
	transition: all 0.3s ease;
}

.contact-btn.whatsapp {
	background: #25d366;
	color: white;
}

.contact-btn.whatsapp:hover {
	background: #128c7e;
	transform: translateY(-2px);
}

.contact-btn.phone {
	background: var(--pink-primary);
	color: white;
}

.contact-btn.phone:hover {
	background: var(--pink-secondary);
	transform: translateY(-2px);
}

.contact-btn.email {
	background: var(--bg-primary);
	color: var(--text-primary);
	border: 2px solid var(--border-color);
}

.contact-btn.email:hover {
	border-color: var(--pink-primary);
	color: var(--pink-primary);
	transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
	.page-title {
		font-size: 1.75rem;
	}

	.faq-answer {
		padding-right: 1.25rem;
	}

	.contact-buttons {
		flex-direction: column;
	}

	.contact-btn {
		justify-content: center;
	}
}

@media (max-width: 480px) {
	.filter-btn {
		padding: 0.5rem 0.75rem;
		font-size: 0.85rem;
	}

	.filter-label {
		display: none;
	}

	.filter-icon {
		font-size: 1.25rem;
	}

	.question-text {
		font-size: 0.95rem;
	}
}
</style>
