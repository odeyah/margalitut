<template>
	<section v-if="tips && tips.length > 0" class="tips-section">
		<div class="tips-header">
			<span class="tips-icon">💡</span>
			<h3 class="tips-title">טיפים ל{{ categoryName }}</h3>
		</div>

		<div class="tips-grid">
			<article v-for="(tip, index) in tips" :key="index" class="tip-card" :style="{ animationDelay: `${index * 100}ms` }">
				<span class="tip-icon">{{ tip.icon }}</span>
				<div class="tip-content">
					<h4 class="tip-title">{{ tip.title }}</h4>
					<p class="tip-text">{{ tip.text }}</p>
				</div>
			</article>
		</div>
	</section>
</template>

<script setup>
defineProps({
	tips: {
		type: Array,
		default: () => [],
	},
	categoryName: {
		type: String,
		default: '',
	},
});
</script>

<style scoped>
.tips-section {
	margin: 3rem 0;
	padding: 2rem;
	background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary));
	border-radius: 24px;
	border: 1px solid var(--border-color);
}

.tips-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 1.5rem;
}

.tips-icon {
	font-size: 1.75rem;
}

.tips-title {
	font-size: 1.35rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0;
}

.tips-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1.25rem;
}

.tip-card {
	display: flex;
	gap: 1rem;
	padding: 1.25rem;
	background: var(--bg-primary);
	border-radius: 16px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
	animation: fadeInUp 0.5s ease forwards;
	opacity: 0;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(15px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.tip-card:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.tip-icon {
	font-size: 2rem;
	flex-shrink: 0;
}

.tip-content {
	flex: 1;
}

.tip-title {
	font-size: 1rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.4rem 0;
}

.tip-text {
	font-size: 0.9rem;
	color: var(--text-secondary);
	margin: 0;
	line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
	.tips-section {
		padding: 1.5rem;
	}

	.tips-grid {
		grid-template-columns: 1fr;
	}
}
</style>
