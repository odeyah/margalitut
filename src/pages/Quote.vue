<template>
	<section class="quote-page">
		<div class="page-header">
			<h1 class="page-title">{{ t.title }}</h1>
			<p class="page-subtitle">{{ t.subtitle }}</p>
		</div>

		<MultiStepForm />

		<NotificationToast />
	</section>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '../stores/orderStore';
import MultiStepForm from '../components/form/MultiStepForm.vue';
import NotificationToast from '../components/ui/NotificationToast.vue';
import { useHead } from '@vueuse/head';

const route = useRoute();
const lang = computed(() => (route.query.lang === 'en' ? 'en' : 'he'));

const translations = {
	he: {
		title: 'בקשת הצעת מחיר',
		subtitle: 'בחרו מוצרים, מלאו פרטים, ונחזור אליכם עם הצעה',
	},
	en: {
		title: 'Request a Quote',
		subtitle: 'Select products, fill in your details, and we will get back to you with an offer',
	},
};

const t = computed(() => translations[lang.value]);

useHead({
	title: lang.value === 'en' ? 'Quote | margalitut Bakery' : 'בקשת הצעת מחיר | מרגליתות',
	meta: [
		{
			name: 'description',
			content:
				lang.value === 'en'
					? 'Request a custom quote from margalitut Bakery for your special event'
					: 'בקשת הצעת מחיר ממרגליתות - עוגות מעוצבות, הזמנות מיוחדות לאירועים',
		},
	],
});

const orderStore = useOrderStore();

onMounted(() => {
	// Uncomment if you want to reset on each visit:
	// orderStore.resetOrder()
});
</script>

<style scoped>
.quote-page {
	max-width: 1000px;
	margin: 0 auto;
	padding: 1rem;
}

.page-header {
	text-align: center;
	margin-bottom: 2rem;
}

.page-title {
	font-size: 2rem;
	font-weight: 700;
	color: #333;
	margin: 0 0 0.5rem 0;
	background: linear-gradient(135deg, #d34a6e, #ff8fab);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.page-subtitle {
	color: #666;
	font-size: 1.1rem;
	margin: 0;
}
</style>
