<template>
	<div class="about-page">
		<!-- Hero Section -->
		<header class="page-header animate-on-scroll fade-up">
			<span class="header-icon">💝</span>
			<h1 class="page-title">אודות מרגליתות</h1>
			<p class="page-subtitle">מאפייה ביתית עם אהבה מבית שמש</p>
		</header>

		<!-- Story Section -->
		<section class="story-section animate-on-scroll fade-up">
			<div class="story-card">
				<div class="owner-image">
					<img src="../assets/margalit.jpg" alt="מרגלית - הבעלים של מרגליתות" />
				</div>
				<h2>היי, אני מרגלית! 👋</h2>
				<p>
					אני מרגלית, אמא לילדים, ואוהבת לאפות מאז שאני זוכרת את עצמי. מה שהתחיל כתחביב הפך לתשוקה, והתשוקה הפכה למרגליתות.
				</p>
				<p>
					במרגליתות אנחנו מאמינים שטעם של בית מתחיל בחומרי גלם איכותיים, ניקיון ברמה הגבוהה ביותר, ואהבה גדולה למטבח. כל מוצר
					נאפה בעבודת יד, בטריות מקסימלית, ועם תשומת לב לכל פרט קטן.
				</p>
			</div>
		</section>

		<!-- Values Section -->
		<section class="values-section">
			<h2 class="section-title animate-on-scroll fade-up">הערכים שלנו</h2>
			<div class="values-grid">
				<div class="value-card animate-on-scroll fade-up delay-1">
					<span class="value-icon">🌿</span>
					<h3>חומרי גלם איכותיים</h3>
					<p>אנחנו משתמשים רק בחומרי הגלם הטובים ביותר - טריים ואיכותיים</p>
				</div>
				<div class="value-card animate-on-scroll fade-up delay-2">
					<span class="value-icon">✨</span>
					<h3>ניקיון ללא פשרות</h3>
					<p>המטבח שלנו נשמר תמיד נקי ומסודר ברמה הגבוהה ביותר</p>
				</div>
				<div class="value-card animate-on-scroll fade-up delay-3">
					<span class="value-icon">❤️</span>
					<h3>עבודת יד באהבה</h3>
					<p>כל מוצר מוכן בעבודת יד עם אהבה ותשומת לב לפרטים</p>
				</div>
				<div class="value-card animate-on-scroll fade-up delay-4">
					<span class="value-icon">✡️</span>
					<h3>כשרות מהדרין</h3>
					<p>כל חומרי הגלם שלנו בכשרות מהדרין ללא פשרות</p>
				</div>
			</div>
		</section>

		<!-- Kashrut Section -->
		<section class="kashrut-section animate-on-scroll fade-up">
			<div class="kashrut-card">
				<div class="kashrut-icon">✡️</div>
				<h2>כשרות והתאמות</h2>
				<div class="kashrut-content">
					<div class="kashrut-item">
						<span class="item-icon">✓</span>
						<span>כל חומרי הגלם בכשרות מהדרין</span>
					</div>
					<div class="kashrut-item">
						<span class="item-icon">✓</span>
						<span>התאמה לאלרגיות ורגישויות לפי בקשה מראש</span>
					</div>
					<div class="kashrut-item">
						<span class="item-icon">✓</span>
						<span>אפשרות למוצרים ללא גלוטן</span>
					</div>
					<div class="kashrut-item">
						<span class="item-icon">✓</span>
						<span>אפשרות למוצרים ללא סוכר</span>
					</div>
					<div class="kashrut-item">
						<span class="item-icon">✓</span>
						<span>אפשרות למוצרים טבעוניים</span>
					</div>
				</div>
			</div>
		</section>

		<!-- Services Section -->
		<section class="services-section animate-on-scroll fade-up">
			<h2 class="section-title">מה אנחנו מציעים</h2>
			<div class="services-grid">
				<div class="service-card">
					<span class="service-icon">🎂</span>
					<h3>אירועים</h3>
					<p>עוגות ומאפים לימי הולדת, בר/בת מצווה, בריתות וחינות</p>
				</div>
				<div class="service-card">
					<span class="service-icon">🕯️</span>
					<h3>שבתות וחגים</h3>
					<p>חלות, עוגות ומאפים מיוחדים לשבת ולחגים</p>
				</div>
				<div class="service-card">
					<span class="service-icon">👧</span>
					<h3>חוגי אפייה</h3>
					<p>חוגים לילדים בכל הגילאים - חוויה מתוקה ויצירתית</p>
				</div>
				<div class="service-card">
					<span class="service-icon">🚗</span>
					<h3>משלוחים</h3>
					<p>משלוחים לכל אזור בית שמש והסביבה</p>
				</div>
			</div>
		</section>

		<!-- Contact Section -->
		<section class="contact-section animate-on-scroll zoom-in">
			<div class="contact-card">
				<h2>רוצים להזמין?</h2>
				<p>אנחנו כאן בשבילכם!</p>
				<div class="contact-buttons">
					<a href="https://wa.me/972528460331" target="_blank" class="contact-btn whatsapp"> <span>💬</span> וואטסאפ </a>
					<a href="tel:0528460331" class="contact-btn phone"> <span>📱</span> 052-846-0331 </a>
					<router-link to="/menu" class="contact-btn menu"> <span>📋</span> לתפריט </router-link>
				</div>
				<div class="contact-address"><span>📍</span> שכונת המשקפיים, בית שמש</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { useHead } from '@vueuse/head';
import { useScrollAnimation } from '../composables/useScrollAnimation';

useScrollAnimation();

useHead({
	title: 'אודות | מרגליתות - מאפייה ביתית בבית שמש',
	meta: [
		{
			name: 'description',
			content: 'מרגליתות - מאפייה ביתית בבית שמש. חומרי גלם איכותיים, כשרות מהדרין, עבודת יד באהבה. משלוחים לכל האזור.',
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
