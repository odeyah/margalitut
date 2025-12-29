<template>
	<Teleport to="body">
		<div class="toast-container">
			<TransitionGroup name="toast">
				<div
					v-for="toast in toastStore.toasts"
					:key="toast.id"
					class="toast"
					:class="toast.type"
					@click="toastStore.removeToast(toast.id)"
				>
					<span class="toast-icon">
						<template v-if="toast.type === 'success'">✓</template>
						<template v-else-if="toast.type === 'error'">✕</template>
						<template v-else-if="toast.type === 'warning'">⚠</template>
						<template v-else>ℹ</template>
					</span>
					<span class="toast-message">{{ toast.message }}</span>
					<button class="toast-close" @click.stop="toastStore.removeToast(toast.id)">✕</button>
					<div class="toast-progress" :style="{ animationDuration: toast.duration + 'ms' }"></div>
				</div>
			</TransitionGroup>
		</div>
	</Teleport>
</template>

<script setup>
import { useToastStore } from '../../stores/toastStore';

const toastStore = useToastStore();
</script>

<style scoped>
.toast-container {
	position: fixed;
	top: 90px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 9999;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	max-width: 90%;
	width: 400px;
}

.toast {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 1rem 1.25rem;
	background: var(--bg-primary);
	border-radius: 12px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	position: relative;
	overflow: hidden;
	border-right: 4px solid;
}

.toast.success {
	border-color: #48bb78;
}

.toast.error {
	border-color: #f56565;
}

.toast.warning {
	border-color: #ed8936;
}

.toast.info {
	border-color: #4299e1;
}

.toast-icon {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.9rem;
	font-weight: 700;
	flex-shrink: 0;
}

.toast.success .toast-icon {
	background: #c6f6d5;
	color: #276749;
}

.toast.error .toast-icon {
	background: #fed7d7;
	color: #c53030;
}

.toast.warning .toast-icon {
	background: #feebc8;
	color: #c05621;
}

.toast.info .toast-icon {
	background: #bee3f8;
	color: #2b6cb0;
}

.toast-message {
	flex: 1;
	font-size: 0.95rem;
	font-weight: 500;
	color: var(--text-primary);
	line-height: 1.4;
}

.toast-close {
	background: none;
	border: none;
	color: var(--text-muted);
	font-size: 1rem;
	cursor: pointer;
	padding: 0.25rem;
	opacity: 0.6;
	transition: opacity 0.2s ease;
}

.toast-close:hover {
	opacity: 1;
}

/* Progress Bar */
.toast-progress {
	position: absolute;
	bottom: 0;
	right: 0;
	height: 3px;
	background: currentColor;
	opacity: 0.3;
	animation: progress linear forwards;
}

.toast.success .toast-progress {
	color: #48bb78;
}

.toast.error .toast-progress {
	color: #f56565;
}

.toast.warning .toast-progress {
	color: #ed8936;
}

.toast.info .toast-progress {
	color: #4299e1;
}

@keyframes progress {
	from {
		width: 100%;
	}
	to {
		width: 0%;
	}
}

/* Transitions */
.toast-enter-active {
	animation: toastIn 0.3s ease;
}

.toast-leave-active {
	animation: toastOut 0.3s ease;
}

@keyframes toastIn {
	from {
		opacity: 0;
		transform: translateY(-20px) scale(0.95);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

@keyframes toastOut {
	from {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
	to {
		opacity: 0;
		transform: translateY(-20px) scale(0.95);
	}
}

/* Mobile */
@media (max-width: 480px) {
	.toast-container {
		top: 80px;
		width: calc(100% - 2rem);
		left: 1rem;
		transform: none;
	}

	.toast {
		padding: 0.875rem 1rem;
	}
}
</style>
