<template>
	<div class="not-found-page">
		<div class="not-found-content">
			<!-- Animated Illustration -->
			<div class="illustration">
				<span class="big-emoji">🍰</span>
				<span class="crumbs crumb-1">✨</span>
				<span class="crumbs crumb-2">🍪</span>
				<span class="crumbs crumb-3">✨</span>
			</div>

			<!-- Error Code -->
			<h1 class="error-code">404</h1>

			<!-- Message -->
			<h2 class="error-title">אופס! הדף נאכל...</h2>
			<p class="error-message">נראה שהדף שחיפשת לא קיים או שמישהו כבר טעם אותו 😋</p>

			<!-- Action Buttons -->
			<div class="action-buttons">
				<router-link to="/" class="btn btn-primary">
					<span class="btn-icon">🏠</span>
					חזרה לדף הבית
				</router-link>
				<router-link to="/menu" class="btn btn-secondary">
					<span class="btn-icon">📋</span>
					לתפריט
				</router-link>
			</div>

			<!-- Search Suggestion -->
			<div class="search-suggestion">
				<p>אולי תמצאו מה שחיפשתם כאן:</p>
				<div class="quick-links">
					<router-link to="/menu/yeast-cakes">עוגות שמרים</router-link>
					<router-link to="/menu/cookies">עוגיות</router-link>
					<router-link to="/menu/mixed-cakes">עוגות בחושות</router-link>
					<router-link to="/workshops">חוגי אפייה</router-link>
					<router-link to="/about">אודות</router-link>
				</div>
			</div>

			<!-- Contact -->
			<div class="contact-help">
				<p>צריכים עזרה?</p>
				<a href="https://wa.me/972528460331" target="_blank" class="whatsapp-link"> <span>💬</span> דברו איתנו בוואטסאפ </a>
			</div>
		</div>

		<!-- Floating Decorations -->
		<div class="decorations">
			<span class="float-item f1">🥐</span>
			<span class="float-item f2">🍓</span>
			<span class="float-item f3">🧁</span>
			<span class="float-item f4">🍫</span>
			<span class="float-item f5">🥧</span>
		</div>
	</div>
</template>

<script setup>
import { useHead } from '@vueuse/head';

useHead({
	title: 'הדף לא נמצא | מרגליתות',
});
</script>

<style scoped>
.not-found-page {
	min-height: calc(100vh - 160px);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	position: relative;
	overflow: hidden;
}

.not-found-content {
	text-align: center;
	max-width: 500px;
	position: relative;
	z-index: 2;
}

/* Illustration */
.illustration {
	position: relative;
	margin-bottom: 1.5rem;
}

.big-emoji {
	font-size: 6rem;
	display: block;
	animation: bounce 2s ease-in-out infinite;
}

.crumbs {
	position: absolute;
	font-size: 1.5rem;
	animation: float 3s ease-in-out infinite;
}

.crumb-1 {
	top: 0;
	right: 30%;
	animation-delay: 0s;
}

.crumb-2 {
	top: 30%;
	left: 25%;
	animation-delay: 0.5s;
}

.crumb-3 {
	bottom: 10%;
	right: 25%;
	animation-delay: 1s;
}

@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-15px);
	}
}

@keyframes float {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
		opacity: 0.7;
	}
	50% {
		transform: translateY(-10px) rotate(10deg);
		opacity: 1;
	}
}

/* Error Code */
.error-code {
	font-size: 5rem;
	font-weight: 900;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	margin: 0;
	line-height: 1;
}

/* Messages */
.error-title {
	font-size: 1.75rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 1rem 0 0.5rem;
}

.error-message {
	font-size: 1.1rem;
	color: var(--text-secondary);
	margin: 0 0 2rem;
	line-height: 1.6;
}

/* Action Buttons */
.action-buttons {
	display: flex;
	gap: 1rem;
	justify-content: center;
	margin-bottom: 2.5rem;
	flex-wrap: wrap;
}

.btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 1.75rem;
	border-radius: 30px;
	font-weight: 700;
	font-size: 1rem;
	text-decoration: none;
	transition: all 0.3s ease;
}

.btn-primary {
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
}

.btn-primary:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 30px rgba(255, 107, 157, 0.4);
}

.btn-secondary {
	background: var(--bg-primary);
	color: var(--pink-primary);
	border: 2px solid var(--pink-primary);
}

.btn-secondary:hover {
	background: var(--pink-light);
	transform: translateY(-3px);
}

.btn-icon {
	font-size: 1.1rem;
}

/* Search Suggestion */
.search-suggestion {
	margin-bottom: 2rem;
}

.search-suggestion p {
	font-size: 0.95rem;
	color: var(--text-secondary);
	margin-bottom: 0.75rem;
}

.quick-links {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: center;
}

.quick-links a {
	padding: 0.5rem 1rem;
	background: var(--bg-secondary);
	border-radius: 20px;
	font-size: 0.9rem;
	font-weight: 500;
	color: var(--text-primary);
	text-decoration: none;
	transition: all 0.3s ease;
}

.quick-links a:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

/* Contact Help */
.contact-help {
	padding-top: 1.5rem;
	border-top: 1px dashed var(--border-color);
}

.contact-help p {
	font-size: 0.9rem;
	color: var(--text-muted);
	margin-bottom: 0.5rem;
}

.whatsapp-link {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	color: #25d366;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
}

.whatsapp-link:hover {
	transform: scale(1.05);
}

/* Floating Decorations */
.decorations {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 1;
}

.float-item {
	position: absolute;
	font-size: 2rem;
	opacity: 0.2;
	animation: floatAround 6s ease-in-out infinite;
}

.f1 {
	top: 10%;
	right: 10%;
	animation-delay: 0s;
}
.f2 {
	top: 20%;
	left: 15%;
	animation-delay: 1s;
}
.f3 {
	bottom: 30%;
	right: 15%;
	animation-delay: 2s;
}
.f4 {
	bottom: 15%;
	left: 10%;
	animation-delay: 3s;
}
.f5 {
	top: 40%;
	right: 5%;
	animation-delay: 4s;
}

@keyframes floatAround {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	25% {
		transform: translateY(-15px) rotate(5deg);
	}
	75% {
		transform: translateY(10px) rotate(-5deg);
	}
}

/* Responsive */
@media (max-width: 480px) {
	.big-emoji {
		font-size: 4rem;
	}

	.error-code {
		font-size: 4rem;
	}

	.error-title {
		font-size: 1.5rem;
	}

	.action-buttons {
		flex-direction: column;
	}

	.btn {
		width: 100%;
		justify-content: center;
	}
}
</style>
