<template>
	<div class="faq-page">
		<!-- Hero Section -->
		<header class="page-header">
			<span class="header-icon">❓</span>
			<h1 class="page-title">שאלות נפוצות</h1>
			<p class="page-subtitle">כל מה שרצית לדעת על מרגליתות</p>
		</header>

		<!-- Search -->
		<div class="search-section">
			<div class="search-box">
				<span class="search-icon">🔍</span>
				<input type="text" v-model="searchQuery" placeholder="חיפוש שאלה..." class="search-input" />
				<button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
			</div>
		</div>

		<!-- Categories Filter -->
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

		<!-- FAQ List -->
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

			<!-- No Results -->
			<div v-if="filteredFAQ.length === 0" class="no-results">
				<span class="no-results-icon">🤔</span>
				<h3>לא נמצאו תוצאות</h3>
				<p>נסו לחפש במילים אחרות או צרו איתנו קשר</p>
			</div>
		</div>

		<!-- Still Have Questions -->
		<section class="contact-section">
			<div class="contact-card">
				<span class="contact-icon">💬</span>
				<h2>עדיין יש שאלות?</h2>
				<p>אנחנו כאן בשבילכם! צרו קשר ונשמח לעזור</p>
				<div class="contact-buttons">
					<a href="https://wa.me/972528460331" target="_blank" class="contact-btn whatsapp"> <span>💬</span> וואטסאפ </a>
					<a href="tel:0528460331" class="contact-btn phone"> <span>📱</span> 052-846-0331 </a>
					<a href="mailto:margalital3@gmail.com" class="contact-btn email"> <span>📧</span> אימייל </a>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useScrollAnimation } from '../composables/useScrollAnimation';
useScrollAnimation();
const searchQuery = ref('');
const activeCategory = ref('all');
const openItems = ref([]);

const categories = [
	{ id: 'all', name: 'הכל', icon: '📋' },
	{ id: 'orders', name: 'הזמנות', icon: '🛒' },
	{ id: 'delivery', name: 'משלוחים', icon: '🚗' },
	{ id: 'products', name: 'מוצרים', icon: '🍰' },
	{ id: 'payment', name: 'תשלום', icon: '💳' },
	{ id: 'workshops', name: 'חוגים', icon: '👩‍🍳' },
	{ id: 'kashrut', name: 'כשרות', icon: '✡️' },
];

const faqItems = ref([
	// הזמנות
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
		id: 4,
		category: 'orders',
		icon: '📦',
		question: 'מה הכמות המינימלית להזמנה?',
		answer: 'אין כמות מינימלית להזמנה! אפשר להזמין אפילו מוצר אחד. למשלוחים יש מינימום של ₪50.',
	},

	// משלוחים
	{
		id: 10,
		category: 'delivery',
		icon: '🚗',
		question: 'לאן אתם מבצעים משלוחים?',
		answer:
			"אנחנו מבצעים משלוחים ל<strong>בית שמש וכל השכונות</strong> (כולל רמת בית שמש א', ב', ג'), ולישובים הסמוכים. לישובים רחוקים יותר - צרו קשר ונבדוק.",
	},
	{
		id: 11,
		category: 'delivery',
		icon: '💰',
		question: 'כמה עולה משלוח?',
		answer:
			"מחיר המשלוח תלוי במיקום:<br>• <strong>בית שמש ישנה ורמת בית שמש א'</strong> - ₪20<br>• <strong>רמת בית שמש ב' וג'</strong> - ₪25<br>• <strong>ישובים סמוכים</strong> - ₪35<br>• משלוח חינם בהזמנה מעל ₪200!",
	},
	{
		id: 12,
		category: 'delivery',
		icon: '⏰',
		question: 'מתי מגיע המשלוח?',
		answer:
			"המשלוחים מתבצעים בין השעות <strong>09:00-21:00</strong> בימים א'-ה', וביום שישי עד 14:00. נתאם אתכם שעה משוערת.",
	},
	{
		id: 13,
		category: 'delivery',
		icon: '🏠',
		question: 'אפשר לאסוף עצמי?',
		answer: 'בטח! איסוף עצמי מ<strong>שכונת המשקפיים, בית שמש</strong>. יש לתאם מראש שעת איסוף. איסוף עצמי ללא עלות!',
	},

	// מוצרים
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
		id: 22,
		category: 'products',
		icon: '🌱',
		question: 'יש מוצרים טבעוניים?',
		answer: 'בטח! יש לנו מבחר מוצרים טבעוניים - עוגות, עוגיות ומאפים ללא ביצים ומוצרי חלב. בדקו בקטגוריה "טבעוני" בתפריט.',
	},
	{
		id: 23,
		category: 'products',
		icon: '🍬',
		question: 'יש מוצרים ללא סוכר?',
		answer:
			'כן! יש לנו מוצרים ממותקים בתחליפי סוכר טבעיים כמו תמרים, דבש וסטיביה. מושלם לסוכרתיים או למי ששומר על תזונה בריאה.',
	},
	{
		id: 24,
		category: 'products',
		icon: '❄️',
		question: 'איך לשמור על המוצרים?',
		answer:
			'רוב המוצרים נשמרים <strong>3-4 ימים בטמפרטורת החדר</strong> או <strong>שבוע במקרר</strong>. עוגות שמרים אפשר להקפיא עד 3 חודשים!',
	},

	// תשלום
	{
		id: 30,
		category: 'payment',
		icon: '💳',
		question: 'באילו אמצעי תשלום אפשר לשלם?',
		answer:
			'אנחנו מקבלים:<br>• <strong>Bit</strong> - 052-844-1093<br>• <strong>PayBox</strong> - 052-846-0331<br>• <strong>מזומן</strong> - בעת האיסוף/משלוח',
	},
	{
		id: 31,
		category: 'payment',
		icon: '🧾',
		question: 'מתי משלמים?',
		answer: 'התשלום מתבצע <strong>לפני האיסוף/משלוח</strong>. ב-Bit או PayBox - מיד אחרי ההזמנה. במזומן - בעת קבלת המוצרים.',
	},
	{
		id: 32,
		category: 'payment',
		icon: '🎫',
		question: 'יש הנחות או מבצעים?',
		answer: 'כן! עקבו אחרינו בפייסבוק ובוואטסאפ לעדכונים על מבצעים. יש גם קודי קופון להנחות - שווה לבדוק בעמוד הבית!',
	},

	// חוגים
	{
		id: 40,
		category: 'workshops',
		icon: '👧',
		question: 'לאיזה גילאים החוגים מתאימים?',
		answer:
			'יש לנו חוגים לכל הגילאים:<br>• <strong>גילאי 3.5-6</strong> - אפרוחי האפייה<br>• <strong>גילאי 6-9</strong> - שפים צעירים<br>• <strong>גילאי 9-12</strong> - אופים מקצועיים',
	},
	{
		id: 41,
		category: 'workshops',
		icon: '📍',
		question: 'איפה מתקיימים החוגים?',
		answer: 'החוגים מתקיימים <strong>בשכונת המשקפיים, בית שמש</strong>. אפשר גם להזמין סדנה פרטית לימי הולדת או אירועים!',
	},
	{
		id: 42,
		category: 'workshops',
		icon: '🥣',
		question: 'מה כולל החוג?',
		answer:
			'כל חוג כולל: <strong>חומרי גלם</strong>, <strong>הדרכה מקצועית</strong>, והילדים לוקחים את מה שהכינו הביתה! המון כיף ויצירתיות 🎉',
	},

	// כשרות
	{
		id: 50,
		category: 'kashrut',
		icon: '✡️',
		question: 'מה הכשרות של המוצרים?',
		answer: 'כל המוצרים שלנו בכשרות <strong>מהדרין</strong>. אנחנו משתמשים רק בחומרי גלם עם הכשר מהדרין.',
	},
	{
		id: 51,
		category: 'kashrut',
		icon: '🥛',
		question: 'המוצרים חלביים או פרווה?',
		answer: 'רוב המוצרים שלנו <strong>חלביים</strong>. יש לנו גם מוצרים טבעוניים שהם פרווה. המידע מופיע בתיאור כל מוצר.',
	},
	{
		id: 52,
		category: 'kashrut',
		icon: '🧹',
		question: 'איך מבטיחים ניקיון וכשרות?',
		answer:
			'המטבח שלנו נשמר <strong>נקי ומסודר ברמה הגבוהה ביותר</strong>. אנחנו מקפידים על הפרדה בין מוצרים שונים ועל שימוש בכלים נפרדים למוצרים ללא גלוטן.',
	},
]);

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
	gap: 0.4rem;
	padding: 0.6rem 1rem;
	background: var(--bg-primary);
	border: 2px solid transparent;
	border-radius: 25px;
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	white-space: nowrap;
	transition: all 0.3s ease;
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
