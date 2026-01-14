<template>
	<div class="product-card" :class="{ 'is-in-cart': isInCart }" @click="handleCardClick">
		<!-- Popular Badge -->
		<span v-if="product.popular" class="popular-badge"> ⭐ פופולרי </span>

		<!-- Product Image -->
		<div class="product-image">
			<!-- יש תמונה אמיתית -->
			<template v-if="product.image && product.image.startsWith('/')">
				<img :src="product.image" :alt="product.name" class="product-img img-default" loading="lazy" />
				<img
					v-if="product.hoverImage"
					:src="product.hoverImage"
					:alt="product.name"
					class="product-img img-hover"
					loading="lazy"
				/>
			</template>
			<!-- אין תמונה - placeholder -->
			<div v-else class="image-placeholder">
				<span class="placeholder-text">התמונה תעלה בקרוב...</span>
				<span class="placeholder-subtext">הטעם כבר כאן! 😋</span>
			</div>
		</div>

		<!-- Product Info -->
		<div class="product-info">
			<h4 class="product-name">{{ product.name }}</h4>
			<p class="product-description">{{ product.description }}</p>

			<div class="product-footer">
				<span class="product-price">₪{{ product.price }}</span>

				<!-- Add to Cart Button -->
				<div class="cart-actions" @click.stop>
					<template v-if="!isInCart">
						<button class="add-btn" @click="addToCart">
							<span class="add-icon">+</span>
							<span class="add-text">הוסף</span>
						</button>
					</template>
					<template v-else>
						<div class="quantity-controls">
							<button class="qty-btn minus" @click="decrementQuantity">−</button>
							<input
								type="number"
								class="qty-input"
								:value="cartQuantity"
								@change="updateQuantity($event)"
								@focus="$event.target.select()"
								min="1"
								max="99"
							/>
							<button class="qty-btn plus" @click="incrementQuantity">+</button>
						</div>
					</template>
				</div>
			</div>
		</div>

		<!-- Added Indicator -->
		<Transition name="pop">
			<div v-if="showAddedIndicator" class="added-indicator">✓ נוסף לעגלה</div>
		</Transition>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useOrderStore } from '../../stores/orderStore';
import { useUIStore } from '../../stores/uiStore';

const props = defineProps({
	product: {
		type: Object,
		required: true,
	},
});

const orderStore = useOrderStore();
const uiStore = useUIStore();
const showAddedIndicator = ref(false);

const isInCart = computed(() => {
	return orderStore.cart.some(item => item.id === props.product.id);
});

const cartQuantity = computed(() => {
	const item = orderStore.cart.find(item => item.id === props.product.id);
	return item?.quantity || 0;
});

const addToCart = () => {
	orderStore.addToCart(props.product, 1);
	showAddedIndicator.value = true;
	uiStore.showSuccess(`${props.product.name} נוסף לעגלה`);

	setTimeout(() => {
		showAddedIndicator.value = false;
	}, 1500);
};

const incrementQuantity = () => {
	orderStore.updateQuantity(props.product.id, cartQuantity.value + 1);
};

const decrementQuantity = () => {
	if (cartQuantity.value > 1) {
		orderStore.updateQuantity(props.product.id, cartQuantity.value - 1);
	} else {
		orderStore.removeFromCart(props.product.id);
	}
};

const updateQuantity = event => {
	const value = parseInt(event.target.value) || 1;
	const quantity = Math.max(1, Math.min(99, value));
	orderStore.updateQuantity(props.product.id, quantity);
};

const handleCardClick = () => {
	// Future: Open product modal with more details
};
</script>

<style scoped>
.product-card {
	position: relative;
	background: var(--bg-primary);
	border-radius: 16px;
	padding: 1.25rem;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
	cursor: pointer;
	border: 2px solid transparent;
}

.product-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-card.is-in-cart {
	border-color: var(--pink-primary);
	background: var(--pink-light);
}

/* Popular Badge */
.popular-badge {
	position: absolute;
	top: 0.75rem;
	right: 0.75rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	font-size: 0.7rem;
	font-weight: 700;
	padding: 0.3rem 0.6rem;
	border-radius: 20px;
	z-index: 2;
	box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
}

/* Product Image */
.product-image {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 150px;
	margin-bottom: 1rem;
	border-radius: 12px;
	overflow: hidden;
	background: var(--bg-secondary);
}

/* תמונות אמיתיות */
.product-img {
	width: 100%;
	height: 100%;
	object-fit: contain;
	transition: all 0.4s ease;
}

.img-default {
	position: absolute;
	inset: 0;
	opacity: 1;
}

.img-hover {
	position: absolute;
	inset: 0;
	opacity: 0;
}

.product-card:hover .img-default {
	opacity: 0;
	transform: scale(1.05);
}

.product-card:hover .img-hover {
	opacity: 1;
	transform: scale(1.05);
}

/* אם אין תמונת hover */
.product-card:hover .img-default:only-child {
	opacity: 1;
	transform: scale(1.1);
}

/* Placeholder - אין תמונה */
.image-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 1rem;
	height: 100%;
	background: linear-gradient(135deg, var(--pink-light) 0%, var(--bg-secondary) 100%);
}

.placeholder-text {
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--text-secondary);
	margin-bottom: 0.25rem;
}

.placeholder-subtext {
	font-size: 0.85rem;
	color: var(--pink-primary);
	font-weight: 500;
}

@keyframes pulse {
	0%,
	100% {
		transform: scale(1);
		opacity: 0.6;
	}
	50% {
		transform: scale(1.1);
		opacity: 0.8;
	}
}

.placeholder-text {
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--text-secondary);
	margin-bottom: 0.25rem;
}

.placeholder-subtext {
	font-size: 0.75rem;
	color: var(--pink-primary);
	font-weight: 500;
}

/* Product Info */
.product-info {
	text-align: center;
}

.product-name {
	font-size: 1rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
	line-height: 1.3;
}

.product-description {
	font-size: 0.8rem;
	color: var(--text-secondary);
	margin: 0 0 1rem 0;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* Product Footer */
.product-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
}

.product-price {
	font-size: 1.25rem;
	font-weight: 800;
	color: var(--pink-primary);
}

/* Cart Actions */
.cart-actions {
	flex-shrink: 0;
}

.add-btn {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.5rem 1rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border: none;
	border-radius: 25px;
	font-weight: 600;
	font-size: 0.85rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.add-btn:hover {
	transform: scale(1.05);
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
}

.add-icon {
	font-size: 1rem;
	font-weight: 700;
}

/* Quantity Controls */
.quantity-controls {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	background: var(--bg-primary);
	border: 2px solid var(--pink-primary);
	border-radius: 25px;
	padding: 0.25rem;
}

.qty-btn {
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--pink-light);
	border: none;
	border-radius: 50%;
	color: var(--pink-primary);
	font-size: 1rem;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s ease;
}

.qty-btn:hover {
	background: var(--pink-primary);
	color: white;
}

.qty-btn.minus:hover {
	background: #e74c3c;
}

.qty-input {
	width: 40px;
	height: 28px;
	border: none;
	background: transparent;
	text-align: center;
	font-size: 0.9rem;
	font-weight: 700;
	color: var(--text-primary);
	appearance: textfield;
	-moz-appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.qty-input:focus {
	outline: none;
}

/* Added Indicator */
.added-indicator {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	background: #27ae60;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 20px;
	font-size: 0.85rem;
	font-weight: 600;
	white-space: nowrap;
	margin-bottom: 0.5rem;
	box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
}

/* Pop Transition */
.pop-enter-active {
	animation: pop-in 0.3s ease;
}

.pop-leave-active {
	animation: pop-out 0.2s ease;
}

@keyframes pop-in {
	0% {
		opacity: 0;
		transform: translateX(-50%) scale(0.8) translateY(10px);
	}
	100% {
		opacity: 1;
		transform: translateX(-50%) scale(1) translateY(0);
	}
}

@keyframes pop-out {
	0% {
		opacity: 1;
		transform: translateX(-50%) scale(1);
	}
	100% {
		opacity: 0;
		transform: translateX(-50%) scale(0.8);
	}
}

/* Dark Mode */
.dark .product-card {
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.dark .product-card:hover {
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.dark .quantity-controls {
	background: var(--bg-secondary);
}

/* Responsive */
@media (max-width: 768px) {
	/* תמונות אמיתיות */
	.product-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: all 0.4s ease;
	}

	.product-emoji {
		font-size: 3rem;
	}

	.placeholder-text {
		font-size: 0.75rem;
	}
}
</style>
