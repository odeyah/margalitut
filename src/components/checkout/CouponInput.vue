<template>
	<div class="coupon-section">
		<div class="coupon-header" @click="isOpen = !isOpen">
			<span class="coupon-icon">🎫</span>
			<span class="coupon-title">יש לך קוד קופון?</span>
			<span class="coupon-toggle" :class="{ open: isOpen }">❮</span>
		</div>

		<Transition name="slide">
			<div v-if="isOpen" class="coupon-content">
				<!-- אם יש קופון מוחל -->
				<div v-if="orderStore.appliedCoupon" class="coupon-applied">
					<div class="applied-info">
						<span class="applied-icon">✓</span>
						<div class="applied-details">
							<span class="applied-code">{{ orderStore.appliedCoupon.code }}</span>
							<span class="applied-desc">{{ orderStore.appliedCoupon.description }}</span>
						</div>
						<span class="applied-discount"> -₪{{ orderStore.couponDiscount }} </span>
					</div>
					<button class="remove-btn" @click="orderStore.removeCoupon()">הסר</button>
				</div>

				<!-- טופס הזנת קופון -->
				<div v-else class="coupon-form">
					<div class="input-wrapper">
						<input
							type="text"
							v-model="couponCode"
							placeholder="הזינו קוד קופון"
							class="coupon-input"
							:class="{ error: orderStore.couponError }"
							@keyup.enter="applyCoupon"
							dir="ltr"
						/>
						<button class="apply-btn" @click="applyCoupon" :disabled="!couponCode || isLoading">
							<span v-if="isLoading" class="loading-spinner small"></span>
							<span v-else>החל</span>
						</button>
					</div>

					<!-- הודעת שגיאה -->
					<Transition name="fade">
						<p v-if="orderStore.couponError" class="error-message">
							<span class="error-icon">⚠️</span>
							{{ orderStore.couponError }}
						</p>
					</Transition>

					<!-- הודעת הצלחה -->
					<Transition name="fade">
						<p v-if="orderStore.couponSuccess" class="success-message">
							<span class="success-icon">✓</span>
							{{ orderStore.couponSuccess }}
						</p>
					</Transition>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useOrderStore } from '../../stores/orderStore';
import { useToastStore } from '../../stores/toastStore';

const toastStore = useToastStore();
const orderStore = useOrderStore();

const isOpen = ref(false);
const couponCode = ref('');
const isLoading = ref(false);

async function applyCoupon() {
	if (!couponCode.value) return;
	isLoading.value = true;
	const success = await orderStore.applyCoupon(couponCode.value);
	if (success) {
		couponCode.value = '';
	} else if (orderStore.couponError) {
		toastStore.error(orderStore.couponError);
	}
	isLoading.value = false;
}
</script>

<style scoped>
.coupon-section {
	background: var(--bg-primary);
	border-radius: 16px;
	border: 2px dashed var(--border-color);
	overflow: hidden;
	margin-bottom: 1.5rem;
}

.coupon-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 1rem 1.25rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.coupon-header:hover {
	background: var(--bg-secondary);
}

.coupon-icon {
	font-size: 1.25rem;
}

.coupon-title {
	flex: 1;
	font-weight: 600;
	color: var(--text-primary);
}

.coupon-toggle {
	font-size: 0.9rem;
	color: var(--text-secondary);
	transition: transform 0.3s ease;
	transform: rotate(-90deg);
}

.coupon-toggle.open {
	transform: rotate(90deg);
}

.coupon-content {
	padding: 0 1.25rem 1.25rem;
}

/* Form */
.coupon-form {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.input-wrapper {
	display: flex;
	gap: 0.5rem;
}

.coupon-input {
	flex: 1;
	padding: 0.875rem 1rem;
	background: var(--bg-secondary);
	border: 2px solid transparent;
	border-radius: 12px;
	font-size: 1rem;
	font-weight: 600;
	text-transform: uppercase;
	color: var(--text-primary);
	letter-spacing: 1px;
	transition: all 0.3s ease;
}

.coupon-input:focus {
	outline: none;
	border-color: var(--pink-primary);
	background: var(--bg-primary);
}

.coupon-input.error {
	border-color: #e74c3c;
}

.coupon-input::placeholder {
	text-transform: none;
	letter-spacing: 0;
	font-weight: 400;
	color: var(--text-muted);
}

.apply-btn {
	padding: 0.875rem 1.5rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border: none;
	border-radius: 12px;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.3s ease;
	min-width: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.apply-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
}

.apply-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

/* Messages */
.error-message,
.success-message {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1rem;
	border-radius: 10px;
	font-size: 0.9rem;
	font-weight: 500;
	margin: 0;
}

.error-message {
	background: #fee;
	color: #c53030;
}

.success-message {
	background: #f0fff4;
	color: #276749;
}

.dark .error-message {
	background: rgba(254, 178, 178, 0.1);
}

.dark .success-message {
	background: rgba(154, 230, 180, 0.1);
}

/* Applied Coupon */
.coupon-applied {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	background: linear-gradient(135deg, #f0fff4, #c6f6d5);
	border-radius: 12px;
	border: 2px solid #68d391;
}

.dark .coupon-applied {
	background: linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(72, 187, 120, 0.2));
}

.applied-info {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex: 1;
}

.applied-icon {
	width: 28px;
	height: 28px;
	background: #48bb78;
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	font-size: 0.9rem;
}

.applied-details {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

.applied-code {
	font-weight: 700;
	font-size: 1rem;
	color: var(--text-primary);
}

.applied-desc {
	font-size: 0.85rem;
	color: var(--text-secondary);
}

.applied-discount {
	font-weight: 700;
	font-size: 1.1rem;
	color: #276749;
}

.remove-btn {
	padding: 0.5rem 1rem;
	background: transparent;
	border: 1px solid #e53e3e;
	color: #e53e3e;
	border-radius: 8px;
	font-weight: 600;
	font-size: 0.85rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.remove-btn:hover {
	background: #e53e3e;
	color: white;
}

/* Loading Spinner */
.loading-spinner.small {
	width: 18px;
	height: 18px;
	border: 2px solid rgba(255, 255, 255, 0.3);
	border-top-color: white;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
	transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Responsive */
@media (max-width: 480px) {
	.input-wrapper {
		flex-direction: column;
	}

	.apply-btn {
		width: 100%;
	}

	.coupon-applied {
		flex-direction: column;
		text-align: center;
	}

	.applied-info {
		flex-direction: column;
	}
}
</style>
