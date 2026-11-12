<template>
	<div class="about-page">
		<!-- Hero Section -->
		<header class="page-header animate-on-scroll fade-up">
			<span class="header-icon">💝</span>
			<h1 class="page-title">{{ pageTitle }}</h1>
			<p class="page-subtitle">{{ pageSubtitle }}</p>
		</header>

		<!-- Story Section -->
		<section v-if="lang === 'en'" class="story-section animate-on-scroll fade-up">
			<div class="story-card">
				<div class="owner-image">
					<img src="" alt="Marigail - owner of margalitut" />
				</div>
				<p>margalitut is a home bakery in Beit Shemesh and its surroundings, created out of a real love for baking, creativity, and people.</p>
				<p>My name is Margalit. I am a mother of two adult children, 44 years old, a kindergarten teacher and educator by profession, and I have loved baking and cooking since childhood. It all began in seventh grade, when I received a recipe booklet for Shavuot. From there, a deep connection to the world of baking began and has stayed with me ever since.</p>
				<p>Over the years, the kitchen became a place of calm, creativity, and self-expression. As an artist at heart, I bring thought, precision, and a lot of love to every cake, dessert, and pastry. Because for us, every product is not just another baked item—it is a special creation in its own right.</p>
				<p>The idea to open a home bakery came from home itself. The children, tasting the baked goods over and over, said: “You have to open a bakery!” In 2022, that dream became a reality, and margalitut was born.</p>
				<p>Since then, despite the challenges along the way, including moving homes during wartime, the business continues to grow and develop with love, while becoming an officially registered business.</p>
				<p>At margalitut, you’ll find a wide variety of products: homemade cakes, custom birthday cakes, special cookies and desserts, pizzas and savory pastries, alongside baking and craft workshops for children.</p>
				<p>We also have an excellent collection of recipes gathered over the years—some carry tradition and home-style flavor, like buns for Yom Kippur, holiday pastries for Passover, and airy festive sfinge for celebrations and Hanukkah.</p>
				<p>All products are prepared with high hygiene standards, quality ingredients, and careful aesthetics, all with one clear goal: to give you joy in every bite and make you want more.</p>
				<p>One thing that makes margalitut special is the combination of genuine homemade baking and personal service: you can order cakes and pastries in advance for events, Shabbat, and holidays, and in many cases we can also offer same-day or next-day solutions.</p>
				<p>margalitut continues to grow and develop out of love for the craft and for our customers, with the goal of making more people happy.</p>
				<p style="font-weight: bold; font-size: 1.2rem">margalitut — with love and quality</p>
			</div>
		</section>

		<section v-else class="story-section animate-on-scroll fade-up">
			<div class="story-card">
				<div class="owner-image">
					<img src="" alt="מרגלית - הבעלים של מרגליתות" />
				</div>
				<p>מרגליתות היא מאפייה ביתית באזור בית שמש והסביבה שנולדה מתוך אהבה אמיתית לאפייה, יצירה ואנשים.</p>
				<p>אני מרגלית, אמא לשני ילדים בוגרים, בת 44, גננת ומורה במקצועי ואוהבת לאפות ולבשל כבר מגיל צעיר. הכל התחיל בכיתה ז', כשקיבלתי חוברת מתכונים לחג השבועות. משם נוצר חיבור עמוק לעולם האפייה שמלווה אותי עד היום.</p>
				<p>עם השנים, המטבח הפך למקום של רוגע, יצירתיות והבעה אישית. כאומנית בנשמה, אני מביאה לכל עוגה, קינוח ולכל מאפה: חשיבה, דיוק והמון אהבה. כי אצלנו כל מוצר הוא לא "עוד עוגה", אלא יצירה מיוחדת בפני עצמה.</p>
				<p>הרעיון לפתוח מאפייה ביתית הגיע דווקא מהבית — הילדים, שטעמו שוב ושוב מהמאפים, אמרו: "את חייבת לפתוח מאפייה!" בשנת 2022 החלום הפך למציאות וכך נולדה מרגליתות.</p>
				<p>מאז, למרות האתגרים שבדרך, כולל מעבר דירה בתקופת המלחמה, העסק ממשיך לצמוח ולהתפתח באהבה גדולה, תוך תהליך להפוך לעסק רשמי.</p>
				<p>במרגליתות תמצאו מגוון רחב של מוצרים: עוגות ביתיות, עוגות יום הולדת מעוצבות, עוגיות מיוחדות וקינוחים, פיצות ומאפים מלוחים לצד חוגי אפייה ויצירה לילדים.</p>
				<p>למרגליתות אוסף מתכונים נהדרים שנאספו במשך שנים, חלקם נושאים מסורת וטעם של בית כמו לחמניות ליום כיפור, מאפים לפסח, וספינג אוורירי וחגיגי לשמחות, אירועים ולחנוכה.</p>
				<p>כל המוצרים נעשים בהקפדה על ניקיון ברמה גבוהה, שימוש בחומרי גלם איכותיים ואסתטיקה מוקפדת עם מטרה אחת ברורה: שתהנו מכל ביס ותרצו עוד.</p>
				<p>אחד הדברים שמייחדים את מרגליתות הוא השילוב בין אפייה ביתית אמיתית לשירות אישי: אפשר להזמין מראש עוגות ומאפים בהתאמה אישית לאירועים, שבתות וחגים ובמקרים רבים גם למצוא פתרונות להזמנות מהיום להיום.</p>
				<p>מרגליתות נמצאת בתהליך צמיחה והתפתחות מתוך אהבה למקצוע וללקוחות, עם שאיפה להמשיך לשמח עוד ועוד אנשים.</p>
				<p style="font-weight: bold; font-size: 1.2rem">מרגליתות - באהבה ובאיכות</p>
			</div>
		</section>

		<!-- Values Section -->
		<section class="values-section">
			<h2 class="section-title animate-on-scroll fade-up">{{ lang === 'en' ? 'Our Values' : 'הערכים שלנו' }}</h2>
			<div class="values-grid">
				<div class="value-card animate-on-scroll fade-up delay-1">
					<span class="value-icon">🌿</span>
					<h3>{{ lang === 'en' ? 'Quality ingredients' : 'חומרי גלם איכותיים' }}</h3>
					<p>{{ lang === 'en' ? 'We use only the best ingredients — fresh and premium.' : 'אנחנו משתמשים רק בחומרי הגלם הטובים ביותר — טריים ואיכותיים' }}</p>
				</div>
				<div class="value-card animate-on-scroll fade-up delay-2">
					<span class="value-icon">✨</span>
					<h3>{{ lang === 'en' ? 'Cleanliness without compromise' : 'ניקיון ללא פשרות' }}</h3>
					<p>{{ lang === 'en' ? 'Our kitchen is always kept impeccably clean and organized.' : 'המטבח שלנו נשמר תמיד נקי ומסודר ברמה הגבוהה ביותר' }}</p>
				</div>
				<div class="value-card animate-on-scroll fade-up delay-3">
					<span class="value-icon">❤️</span>
					<h3>{{ lang === 'en' ? 'Handmade with love' : 'עבודת יד באהבה' }}</h3>
					<p>{{ lang === 'en' ? 'Every product is made by hand with care and attention to detail.' : 'כל מוצר מוכן בעבודת יד עם אהבה ותשומת לב לפרטים' }}</p>
				</div>
				<div class="value-card animate-on-scroll fade-up delay-4">
					<span class="value-icon">✡️</span>
					<h3>{{ lang === 'en' ? 'Mehadrin kashrut' : 'כשרות מהדרין' }}</h3>
					<p>{{ lang === 'en' ? 'All our ingredients are kosher under strict supervision.' : 'כל חומרי הגלם שלנו בכשרות בד"ץ ללא פשרות' }}</p>
				</div>
			</div>
		</section>

		<section class="kashrut-section animate-on-scroll fade-up">
			<div class="kashrut-card">
				<div class="kashrut-icon">✡️</div>
				<h2>{{ lang === 'en' ? 'Kosher & Customization' : 'כשרות והתאמות' }}</h2>
				<div class="kashrut-content">
					<div class="kashrut-item"><span class="item-icon">✓</span><span>{{ lang === 'en' ? 'Home baking under mehadrin supervision' : 'אפייה ביתית בכשרות בד"ץ' }}</span></div>
					<div class="kashrut-item"><span class="item-icon">✓</span><span>{{ lang === 'en' ? 'Service areas: Beit Shemesh, Mateh Yehuda, Tzora, and Betar Illit' : 'אזור פעילות: בית שמש, מטה יהודה, צור הדסה וביתר' }}</span></div>
					<div class="kashrut-item"><span class="item-icon">✓</span><span>{{ lang === 'en' ? 'Dairy or pareve according to your needs' : 'חלבי או פרווה לפי הצורך' }}</span></div>
					<div class="kashrut-item"><span class="item-icon">✓</span><span>{{ lang === 'en' ? 'Gluten-free and sugar-free options available' : 'אפשרויות ללא סוכר וללא גלוטן' }}</span></div>
					<div class="kashrut-item"><span class="item-icon">✓</span><span>{{ lang === 'en' ? 'Personal service and customer satisfaction' : 'יחס אישי לשביעות רצון הלקוח' }}</span></div>
				</div>
			</div>
		</section>

		<section class="services-section animate-on-scroll fade-up">
			<h2 class="section-title">{{ lang === 'en' ? 'What We Offer' : 'מה אנחנו מציעים' }}</h2>
			<div class="services-grid">
				<div class="service-card"><span class="service-icon">🕯️</span><h3>{{ lang === 'en' ? 'Shabbat & Holidays' : 'שבתות וחגים' }}</h3><p>{{ lang === 'en' ? 'Challah, cakes, and special pastries for Shabbat and holidays — including traditional recipes.' : 'חלות, עוגות ומאפים מיוחדים לשבת ולחגים — כולל מתכונים מסורתיים' }}</p></div>
				<div class="service-card"><span class="service-icon">🎂</span><h3>{{ lang === 'en' ? 'Events' : 'אירועים' }}</h3><p>{{ lang === 'en' ? 'Cakes and pastries for birthdays, bar/bat mitzvahs, britot, and weddings.' : 'עוגות ומאפים לימי הולדת, בר/בת מצווה, בריתות וחינות' }}</p></div>
				<div class="service-card"><span class="service-icon">👧</span><h3>{{ lang === 'en' ? 'Baking Workshops' : 'חוגי אפייה' }}</h3><p>{{ lang === 'en' ? 'Workshops for children of all ages — a sweet and creative experience.' : 'חוגים לילדים בכל הגילאים — חוויה מתוקה ויצירתית' }}</p></div>
				<div class="service-card"><span class="service-icon">🚗</span><h3>{{ lang === 'en' ? 'Delivery' : 'משלוחים' }}</h3><p>{{ lang === 'en' ? 'Delivery to Beit Shemesh, Mateh Yehuda, and nearby communities.' : 'משלוחים לבית שמש, מטה יהודה, צור הדסה וביתר' }}</p></div>
			</div>
		</section>

		<section class="contact-section animate-on-scroll zoom-in">
			<div class="contact-card">
				<h2>{{ lang === 'en' ? 'Want to Order?' : 'רוצים להזמין?' }}</h2>
				<p>{{ lang === 'en' ? 'We are here for you!' : 'אנחנו כאן בשבילכם!' }}</p>
				<div class="contact-buttons">
					<a href="https://wa.me/972528460331" target="_blank" class="contact-btn whatsapp"> <span>💬</span> {{ lang === 'en' ? 'WhatsApp' : 'וואטסאפ' }} </a>
					<a href="tel:0528460331" class="contact-btn phone"> <span>📱</span> 052-846-0331 </a>
					<router-link to="/menu" class="contact-btn menu"> <span>📋</span> {{ lang === 'en' ? 'Menu' : 'לתפריט' }} </router-link>
				</div>
				<div class="contact-address"><span>📍</span> {{ lang === 'en' ? 'Shk. HaMashkifim, Beit Shemesh' : 'שכונת המשקפיים, בית שמש' }}</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { useHead } from '@vueuse/head';
import { useScrollAnimation } from '../composables/useScrollAnimation';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

useScrollAnimation();

const route = useRoute();
const lang = computed(() => (route.query.lang === 'en' ? 'en' : 'he'));

const pageTitle = computed(() => (lang.value === 'en' ? 'About margalitut' : 'אודות מרגליתות'));
const pageSubtitle = computed(() =>
	lang.value === 'en' ? 'A home bakery with love from Beit Shemesh' : 'מאפייה ביתית עם אהבה מבית שמש',
);

useHead({
	title: lang.value === 'en' ? 'About | margalitut Bakery' : 'אודות | מרגליתות - מאפייה ביתית בבית שמש',
	meta: [
		{
			name: 'description',
			content:
				lang.value === 'en'
					? 'margalitut - A home bakery in Beit Shemesh. All ingredients are Mehadrin kosher, handmade with love. Delivery to Beit Shemesh, Mateh Yehuda and surrounding areas.'
					: 'מרגליתות - מאפייה ביתית בבית שמש. כל הרכיבים בכשרות מהדרין, עבודת יד באהבה. משלוחים לבית שמש, מטה יהודה, צור הדסה וביתר.',
		},
	],
});
</script>

<style scoped>
.about-page {
	max-width: 900px;
	margin: 0 auto;
}

/* Page Header */
.page-header {
	text-align: center;
	margin-bottom: 3rem;
}

.header-icon {
	font-size: 3.5rem;
	display: block;
	margin-bottom: 1rem;
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

/* Story Section */
.story-section {
	margin-bottom: 3rem;
}

.story-card {
	background: var(--bg-primary);
	border-radius: 24px;
	padding: 2.5rem;
	box-shadow: var(--card-shadow);
	text-align: center;
}

.story-icon {
	font-size: 3rem;
	margin-bottom: 1rem;
}

.story-card h2 {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 1rem 0;
}

.story-card p {
	font-size: 1.05rem;
	color: var(--text-secondary);
	line-height: 1.8;
	margin: 0 0 1rem 0;
}

.story-card p:last-child {
	margin-bottom: 0;
}

/* Section Title */
.section-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	text-align: center;
	margin: 0 0 2rem 0;
}

/* Values Section */
.values-section {
	margin-bottom: 3rem;
}

.values-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1.5rem;
}

.value-card {
	background: var(--bg-primary);
	border-radius: 20px;
	padding: 2rem;
	text-align: center;
	box-shadow: var(--card-shadow);
	transition: all 0.3s ease;
}

.value-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.value-icon {
	font-size: 2.5rem;
	display: block;
	margin-bottom: 1rem;
}

.value-card h3 {
	font-size: 1.1rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.value-card p {
	font-size: 0.95rem;
	color: var(--text-secondary);
	margin: 0;
	line-height: 1.5;
}

/* Kashrut Section */
.kashrut-section {
	margin-bottom: 3rem;
}

.kashrut-card {
	background: linear-gradient(135deg, var(--pink-light), var(--bg-primary));
	border: 2px solid var(--border-pink);
	border-radius: 24px;
	padding: 2.5rem;
	text-align: center;
}

.kashrut-icon {
	font-size: 3rem;
	margin-bottom: 1rem;
}

.kashrut-card h2 {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 1.5rem 0;
}

.kashrut-content {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	max-width: 400px;
	margin: 0 auto;
}

.kashrut-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	text-align: right;
}

.kashrut-item .item-icon {
	width: 24px;
	height: 24px;
	background: #48bb78;
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.8rem;
	font-weight: 700;
	flex-shrink: 0;
}

.kashrut-item span:last-child {
	color: var(--text-primary);
	font-size: 1rem;
}

/* Services Section */
.services-section {
	margin-bottom: 3rem;
}

.services-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1.5rem;
}

.service-card {
	background: var(--bg-primary);
	border-radius: 20px;
	padding: 2rem;
	text-align: center;
	box-shadow: var(--card-shadow);
	transition: all 0.3s ease;
}

.service-card:hover {
	transform: translateY(-5px);
}

.service-icon {
	font-size: 2.5rem;
	display: block;
	margin-bottom: 1rem;
}

.service-card h3 {
	font-size: 1.1rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.service-card p {
	font-size: 0.95rem;
	color: var(--text-secondary);
	margin: 0;
	line-height: 1.5;
}

/* Contact Section */
.contact-section {
	margin-bottom: 2rem;
}

.contact-card {
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	border-radius: 24px;
	padding: 3rem 2rem;
	text-align: center;
	color: white;
}

.contact-card h2 {
	font-size: 1.75rem;
	font-weight: 700;
	margin: 0 0 0.5rem 0;
}

.contact-card > p {
	font-size: 1.1rem;
	opacity: 0.9;
	margin: 0 0 1.5rem 0;
}

.contact-buttons {
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
	margin-bottom: 1.5rem;
}

.contact-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	border-radius: 25px;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
}

.contact-btn.whatsapp {
	background: white;
	color: #25d366;
}

.contact-btn.phone {
	background: white;
	color: var(--pink-primary);
}

.contact-btn.menu {
	background: rgba(255, 255, 255, 0.2);
	color: white;
	border: 2px solid white;
}

.contact-btn:hover {
	transform: translateY(-3px);
}

.contact-address {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	font-size: 1rem;
	opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
	.page-title {
		font-size: 1.75rem;
	}

	.values-grid,
	.services-grid {
		grid-template-columns: 1fr;
	}

	.story-card,
	.kashrut-card {
		padding: 2rem 1.5rem;
	}

	.contact-buttons {
		flex-direction: column;
	}

	.contact-btn {
		justify-content: center;
	}
}

/* Owner Image */
.owner-image {
	width: 150px;
	height: 150px;
	margin: 0 auto 1.5rem;
	border-radius: 50%;
	overflow: hidden;
	border: 4px solid var(--pink-primary);
	box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
}

.owner-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
