<template>
	<Teleport to="body">
		<Transition name="modal">
			<div v-if="show" class="modal-overlay" @click.self="$emit('close')">
				<div class="modal-content">
					<button class="modal-close" @click="$emit('close')">✕</button>

					<h3 class="modal-title">{{ product.name }}</h3>
					<p class="modal-description">{{ product.description }}</p>

					<!-- בחירת טעם -->
					<div v-if="product.flavors" class="option-section">
						<h4 class="option-title">בחרו טעם:</h4>
						<div class="flavors-grid">
							<button
								v-for="flavor in product.flavors"
								:key="flavor.id"
								class="flavor-btn"
								:class="{ active: selectedFlavor?.id === flavor.id }"
								@click="selectedFlavor = flavor"
							>
								<span class="flavor-icon">{{ flavor.icon }}</span>
								<span class="flavor-name">{{ flavor.name }}</span>
							</button>
						</div>
					</div>

					<!-- בחירת גודל -->
					<div v-if="product.sizes" class="option-section">
						<h4 class="option-title">בחרו גודל:</h4>
						<div class="sizes-list">
							<button
								v-for="size in product.sizes"
								:key="size.id"
								class="size-btn"
								:class="{ active: selectedSize?.id === size.id }"
								@click="selectedSize = size"
							>
								<div class="size-info">
									<span class="size-name">{{ size.name }}</span>
									<span class="size-note">{{ size.note }}</span>
								</div>
								<span class="size-price">₪{{ size.price }}</span>
							</button>
						</div>
					</div>

					<!-- בחירת כמות -->
					<div class="option-section">
						<h4 class="option-title">כמות:</h4>
						<div class="quantity-selector">
							<button class="qty-btn" @click="quantity > 1 && quantity--">-</button>
							<span class="qty-value">{{ quantity }}</span>
							<button class="qty-btn" @click="quantity++">+</button>
						</div>
						<p v-if="selectedSize?.minQty && quantity < selectedSize.minQty" class="min-qty-warning">
							⚠️ נדרש מינימום {{ selectedSize.minQty }} יחידות
						</p>
					</div>

					<!-- כפתור הוספה -->
					<button class="add-to-cart-btn" :disabled="!canAdd" @click="handleAdd">הוסף לסל - ₪{{ totalPrice }}</button>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
	show: Boolean,
	product: Object,
});

const emit = defineEmits(['close', 'add']);

const selectedFlavor = ref(null);
const selectedSize = ref(null);
const quantity = ref(1);

// איפוס כשפותחים מחדש
watch(
	() => props.show,
	newVal => {
		if (newVal) {
			selectedFlavor.value = null;
			selectedSize.value = null;
			quantity.value = 1;
		}
	},
);

const canAdd = computed(() => {
	if (props.product?.flavors && !selectedFlavor.value) return false;
	if (props.product?.sizes && !selectedSize.value) return false;
	if (selectedSize.value?.minQty && quantity.value < selectedSize.value.minQty) return false;
	return true;
});

const totalPrice = computed(() => {
	if (!selectedSize.value) return 0;
	return selectedSize.value.price * quantity.value;
});

const handleAdd = () => {
	if (!canAdd.value) return;

	emit('add', {
		product: props.product,
		flavor: selectedFlavor.value,
		size: selectedSize.value,
		quantity: quantity.value,
		totalPrice: totalPrice.value,
	});
};
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	z-index: 1000;
}

.modal-content {
	background: white;
	border-radius: 20px;
	padding: 2rem;
	max-width: 500px;
	width: 100%;
	max-height: 90vh;
	overflow-y: auto;
	position: relative;
}

.modal-close {
	position: absolute;
	top: 1rem;
	left: 1rem;
	width: 32px;
	height: 32px;
	border: none;
	background: #f0f0f0;
	border-radius: 50%;
	font-size: 1rem;
	cursor: pointer;
}

.modal-close:hover {
	background: #e0e0e0;
}

.modal-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin: 0 0 0.5rem 0;
}

.modal-description {
	color: #666;
	margin: 0 0 1.5rem 0;
}

.option-section {
	margin-bottom: 1.5rem;
}

.option-title {
	font-size: 1rem;
	font-weight: 700;
	margin: 0 0 0.75rem 0;
}

.flavors-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
	gap: 0.5rem;
}

.flavor-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
	padding: 0.75rem 0.5rem;
	border: 2px solid #f0f0f0;
	border-radius: 12px;
	background: white;
	cursor: pointer;
	transition: all 0.2s ease;
}

.flavor-btn:hover {
	border-color: #ffd6e7;
	background: #fff5f8;
}

.flavor-btn.active {
	border-color: #d34a6e;
	background: #fff5f8;
}

.flavor-icon {
	font-size: 1.5rem;
}

.flavor-name {
	font-size: 0.8rem;
	font-weight: 600;
}

.sizes-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.size-btn {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	border: 2px solid #f0f0f0;
	border-radius: 12px;
	background: white;
	cursor: pointer;
	text-align: right;
}

.size-btn:hover {
	border-color: #ffd6e7;
	background: #fff5f8;
}

.size-btn.active {
	border-color: #d34a6e;
	background: #fff5f8;
}

.size-info {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.size-name {
	font-weight: 700;
}

.size-note {
	font-size: 0.75rem;
	color: #999;
}

.size-price {
	font-weight: 700;
	font-size: 1.1rem;
	color: #d34a6e;
}

.quantity-selector {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
}

.qty-btn {
	width: 40px;
	height: 40px;
	border: 2px solid #d34a6e;
	border-radius: 10px;
	background: white;
	color: #d34a6e;
	font-size: 1.5rem;
	font-weight: bold;
	cursor: pointer;
}

.qty-btn:hover {
	background: #d34a6e;
	color: white;
}

.qty-value {
	font-size: 1.25rem;
	font-weight: 700;
	min-width: 40px;
	text-align: center;
}

.min-qty-warning {
	text-align: center;
	color: #e74c3c;
	font-size: 0.85rem;
	margin-top: 0.5rem;
}

.add-to-cart-btn {
	width: 100%;
	padding: 1rem;
	background: linear-gradient(135deg, #d34a6e, #ff8fab);
	color: white;
	border: none;
	border-radius: 12px;
	font-size: 1.1rem;
	font-weight: 700;
	cursor: pointer;
}

.add-to-cart-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(211, 74, 110, 0.4);
}

.add-to-cart-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
	transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
	transform: scale(0.9);
}
</style>
