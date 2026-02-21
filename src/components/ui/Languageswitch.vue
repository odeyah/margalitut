<template>
	<div v-if="hasEnglishVersion" class="lang-switch">
		<router-link :to="hebrewPath" class="lang-btn" :class="{ active: !isEnglish }"> עברית </router-link>
		<router-link :to="englishPath" class="lang-btn" :class="{ active: isEnglish }"> English </router-link>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// מיפוי דפים עברית <-> אנגלית
const languageMap = {
	'/Purim': '/Purim-en',
	'/Purim-en': '/Purim',
	'/purim': '/purim-en',
	'/purim-en': '/purim',
	'/tasting': '/tasting?lang=en',
	'/tasting?lang=en': '/tasting',
};

const currentPath = computed(() => {
	// כולל query string אם יש
	if (route.query.lang) {
		return `${route.path}?lang=${route.query.lang}`;
	}
	return route.path;
});

const hasEnglishVersion = computed(() => {
	return languageMap.hasOwnProperty(currentPath.value) || languageMap.hasOwnProperty(route.path);
});

const isEnglish = computed(() => {
	return route.path.endsWith('-en') || route.query.lang === 'en';
});

const hebrewPath = computed(() => {
	// אם אנחנו באנגלית, תחזיר עברית
	if (isEnglish.value) {
		return languageMap[currentPath.value] || languageMap[route.path] || route.path;
	}
	return route.path;
});

const englishPath = computed(() => {
	// אם אנחנו בעברית, תחזיר אנגלית
	if (!isEnglish.value) {
		return languageMap[currentPath.value] || languageMap[route.path] || route.path;
	}
	return currentPath.value;
});
</script>

<style scoped>
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
</style>
