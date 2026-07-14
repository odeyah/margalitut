<template>
	<Teleport to="body">
		<Transition name="banner-fade">
			<div v-if="show" class="closed-overlay" @click.self="dismiss">
				<div class="closed-modal">
					<div class="closed-icon">🍓</div>
					<h2 class="closed-title">מרגליתות בהפסקה קצרה</h2>
					<p class="closed-text">
						אנחנו נעדרים זמנית מסיבות משפחתיות.<br />
						נחזור בקרוב עם כל המתוק שאתם אוהבים 🧁
					</p>
					<p class="closed-sub">ניתן לפנות בוואטסאפ לשאלות דחופות</p>
					<div class="closed-actions">
						<a href="https://wa.me/972528460331" target="_blank" class="whatsapp-btn"> 💬 וואטסאפ </a>
						<button class="dismiss-btn" @click="dismiss">הבנתי, המשך לאתר</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const show = ref(false);

onMounted(() => {
	// מציג את ההודעה בכל כניסה לאתר
	show.value = true;
});

const dismiss = () => {
	show.value = false;
};
</script>

<style scoped>
.closed-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(6px);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
}

.closed-modal {
	background: var(--bg-primary);
	border-radius: 24px;
	padding: 2.5rem 2rem;
	max-width: 420px;
	width: 100%;
	text-align: center;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	border: 2px solid var(--border-pink);
}

.closed-icon {
	font-size: 3.5rem;
	margin-bottom: 1rem;
}

.closed-title {
	font-size: 1.6rem;
	font-weight: 800;
	color: var(--text-primary);
	margin: 0 0 1rem 0;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.closed-text {
	font-size: 1.05rem;
	color: var(--text-secondary);
	line-height: 1.8;
	margin: 0 0 0.75rem 0;
}

.closed-sub {
	font-size: 0.9rem;
	color: var(--text-muted);
	margin: 0 0 1.75rem 0;
}

.closed-actions {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.whatsapp-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.875rem 1.5rem;
	background: #25d366;
	color: white;
	border-radius: 12px;
	font-weight: 700;
	font-size: 1rem;
	text-decoration: none;
	transition: all 0.3s ease;
}

.whatsapp-btn:hover {
	background: #1da851;
	transform: translateY(-2px);
}

.dismiss-btn {
	padding: 0.875rem 1.5rem;
	background: var(--bg-secondary);
	border: 2px solid var(--border-color);
	border-radius: 12px;
	font-size: 0.95rem;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.dismiss-btn:hover {
	border-color: var(--pink-primary);
	color: var(--pink-primary);
}

/* Transition */
.banner-fade-enter-active,
.banner-fade-leave-active {
	transition: opacity 0.4s ease;
}

.banner-fade-enter-from,
.banner-fade-leave-to {
	opacity: 0;
}

@media (max-width: 480px) {
	.closed-modal {
		padding: 2rem 1.5rem;
	}

	.closed-title {
		font-size: 1.35rem;
	}
}
</style>
