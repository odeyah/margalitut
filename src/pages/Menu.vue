<template>
	<div class="menu-page">
		<!-- Page Header -->
		<header class="page-header animate-on-scroll fade-up">
			<h1 class="page-title">{{ t.title }}</h1>
			<p class="page-subtitle">{{ t.subtitle }}</p>
		</header>

		<!-- Categories Grid -->
		<section class="categories-section">
			<h2 class="section-title animate-on-scroll fade-up">{{ t.categories }}</h2>
			<div class="categories-grid">
				<CategoryCard
					v-for="(category, index) in categories"
					:key="category.id"
					:category="category"
					class="animate-on-scroll fade-up"
					:class="`delay-${(index % 5) + 1}`"
				/>
			</div>
		</section>

		<!-- Divider -->
		<div class="divider animate-on-scroll zoom-in">
			<span class="divider-icon">🍰</span>
		</div>

		<!-- Category Previews -->
		<section class="previews-section">
			<h2 class="section-title">{{ t.preview }}</h2>

			<CategorySection v-for="category in categories" :key="category.id" :category="category" :limit="5" />
		</section>

		<!-- Call to Action -->
		<section class="cta-section">
			<div class="cta-content">
				<span class="cta-icon">🎂</span>
				<h3 class="cta-title">{{ t.notFound }}</h3>
				<p class="cta-text">{{ t.custom }}</p>
				<router-link to="/quote" class="cta-btn"> {{ t.quote }} </router-link>
			</div>
		</section>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '../stores/menuStore';
import { CategoryCard, CategorySection } from '../components/menu';
import { useHead } from '@vueuse/head';
import { useScrollAnimation } from '../composables/useScrollAnimation';
useScrollAnimation();

const route = useRoute();
const lang = computed(() => (route.query.lang === 'en' ? 'en' : 'he'));

const translations = {
	he: {
		title: 'התפריט שלנו',
		subtitle: 'כל המאפים והמטעמים שלנו, מחולקים לקטגוריות',
		categories: 'קטגוריות',
		preview: 'טעימות מהתפריט',
		notFound: 'לא מצאתם מה שחיפשתם?',
		custom: 'אנחנו מכינים גם הזמנות מיוחדות לפי בקשה',
		quote: 'בקשת הצעת מחיר',
	},
	en: {
		title: 'Our Menu',
		subtitle: 'All our baked goods and treats, organized by categories',
		categories: 'Categories',
		preview: 'Menu Highlights',
		notFound: "Didn't find what you're looking for?",
		custom: 'We also prepare special custom orders',
		quote: 'Request a Quote',
	},
};

const t = computed(() => translations[lang.value]);

useHead({
	title: lang.value === 'en' ? 'Menu | Margalitot Bakery' : 'תפריט | מרגליתות - מאפייה ביתית בבית שמש',
	meta: [
		{
			name: 'description',
			content:
				lang.value === 'en'
					? 'Margalitot Menu - yeast cakes, layer cakes, cookies, breads, gluten-free and vegan baked goods. Delivery in Beit Shemesh.'
					: 'תפריט מרגליתות - עוגות שמרים, עוגות בחושות, עוגיות, לחמים, מאפים ללא גלוטן, טבעוניים ועוד. משלוחים לבית שמש.',
		},
	],
});

const menuStore = useMenuStore();
const categories = computed(() => menuStore.categories);
</script>

<style scoped>
.menu-page {
	max-width: 1200px;
	margin: 0 auto;
}

/* Page Header */
.page-header {
	text-align: center;
	margin-bottom: 2.5rem;
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

/* Section Titles */
.section-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 1.5rem 0;
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.section-title::after {
	content: '';
	flex: 1;
	height: 2px;
	background: linear-gradient(90deg, var(--border-pink), transparent);
	border-radius: 1px;
}

/* Categories Section */
.categories-section {
	margin-bottom: 3rem;
}

/* Categories Grid */
.categories-grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 1.5rem;
	margin-bottom: 4rem;
}

/* Tablet */
@media (max-width: 1024px) {
	.categories-grid {
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
	}
}

/* Mobile */
@media (max-width: 600px) {
	.categories-grid {
		grid-template-columns: 1fr;
		gap: 1rem;
	}
}

/* Divider */
.divider {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 3rem 0;
	position: relative;
}

.divider::before,
.divider::after {
	content: '';
	flex: 1;
	height: 2px;
	background: linear-gradient(90deg, transparent, var(--border-pink), transparent);
}

.divider-icon {
	font-size: 2rem;
	padding: 0 1.5rem;
	animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-8px);
	}
}

/* Previews Section */
.previews-section {
	margin-bottom: 3rem;
}

/* CTA Section */
.cta-section {
	margin: 4rem 0 2rem;
}

.cta-content {
	text-align: center;
	padding: 3rem 2rem;
	background: linear-gradient(135deg, var(--pink-light), var(--bg-primary));
	border-radius: 24px;
	border: 2px solid var(--border-pink);
}

.cta-icon {
	font-size: 3.5rem;
	display: block;
	margin-bottom: 1rem;
}

.cta-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.cta-text {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
}

.cta-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 2rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border-radius: 30px;
	font-weight: 700;
	font-size: 1rem;
	text-decoration: none;
	transition: all 0.3s ease;
	box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
}

.cta-btn:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 30px rgba(255, 107, 157, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
	.page-title {
		font-size: 1.75rem;
	}

	.page-subtitle {
		font-size: 1rem;
	}

	.categories-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.section-title {
		font-size: 1.25rem;
	}

	.cta-content {
		padding: 2rem 1.5rem;
	}

	.cta-icon {
		font-size: 2.5rem;
	}

	.cta-title {
		font-size: 1.25rem;
	}
}

@media (max-width: 480px) {
	.categories-grid {
		grid-template-columns: 1fr;
	}
}
</style>
