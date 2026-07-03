<template>
	<Teleport to="body">
		<Transition name="modal-fade">
			<div v-if="product" class="modal-overlay" @click.self="$emit('close')">
				<div class="modal-container" dir="rtl">
					<button class="modal-close" @click="$emit('close')">✕</button>

					<div class="modal-image-wrap">
						<img
							v-if="product.image && product.image.startsWith('/')"
							:src="product.image"
							:alt="product.name"
							class="modal-image"
						/>
						<div v-else class="modal-placeholder">
							<span>התמונה תעלה בקרוב... 😋</span>
						</div>
					</div>

					<div class="modal-body">
						<span v-if="product.popular" class="modal-badge">⭐ פופולרי</span>
						<h2 class="modal-title">{{ product.name }}</h2>
						<p class="modal-description">{{ product.description }}</p>
						<div class="modal-footer">
							<span v-if="product.price > 0" class="modal-price">₪{{ product.price }}</span>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({ product: Object });
const emit = defineEmits(['close']);

function onKeydown(e) {
	if (e.key === 'Escape') emit('close');
}
onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.65);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	padding: 1rem;
}

.modal-container {
	background: var(--bg-primary);
	border-radius: 20px;
	max-width: 480px;
	width: 100%;
	max-height: 90vh;
	overflow-y: auto;
	position: relative;
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.modal-close {
	position: absolute;
	top: 12px;
	left: 12px;
	background: rgba(0, 0, 0, 0.18);
	border: none;
	border-radius: 50%;
	width: 36px;
	height: 36px;
	font-size: 15px;
	cursor: pointer;
	z-index: 2;
	color: white;
	transition: background 0.2s;
}
.modal-close:hover {
	background: rgba(0, 0, 0, 0.35);
}

.modal-image-wrap {
	width: 100%;
	aspect-ratio: 4/3;
	overflow: hidden;
	border-radius: 20px 20px 0 0;
	background: var(--bg-secondary);
}
.modal-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.modal-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--text-secondary);
	font-size: 0.9rem;
}

.modal-body {
	padding: 1.5rem;
}

.modal-badge {
	display: inline-block;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	font-size: 0.7rem;
	font-weight: 700;
	padding: 0.25rem 0.6rem;
	border-radius: 20px;
	margin-bottom: 0.6rem;
}

.modal-title {
	font-size: 1.4rem;
	font-weight: 800;
	color: var(--text-primary);
	margin: 0 0 0.75rem 0;
}

.modal-description {
	font-size: 0.95rem;
	line-height: 1.75;
	color: var(--text-secondary);
	margin: 0 0 1.25rem 0;
	white-space: pre-line;
}

.modal-footer {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.modal-price {
	font-size: 1.5rem;
	font-weight: 800;
	color: var(--pink-primary);
}

/* אנימציה */
.modal-fade-enter-active,
.modal-fade-leave-active {
	transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
	opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
	transition: transform 0.25s ease;
}
.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
	transform: scale(0.93) translateY(12px);
}

@media (max-width: 480px) {
	.modal-container {
		border-radius: 16px;
	}
	.modal-image-wrap {
		border-radius: 16px 16px 0 0;
	}
	.modal-body {
		padding: 1.25rem;
	}
	.modal-title {
		font-size: 1.2rem;
	}
}
</style>
