<template>
	<a
		:href="whatsappLink"
		target="_blank"
		class="whatsapp-float"
		aria-label="שלחו לנו הודעה בוואטסאפ"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
	>
		<span class="whatsapp-icon">
			<svg viewBox="0 0 32 32" fill="currentColor">
				<path
					d="M16.004 0C7.169 0 0 7.169 0 16.004c0 2.825.736 5.584 2.135 8.017L.075 32l8.208-2.033a15.93 15.93 0 007.721 1.97C24.835 31.937 32 24.768 32 15.933 32 7.169 24.839 0 16.004 0zm0 29.294c-2.59 0-5.122-.695-7.333-2.01l-.526-.312-5.453 1.43 1.456-5.32-.343-.544a13.26 13.26 0 01-2.037-7.034c0-7.347 5.977-13.324 13.324-13.324 7.347 0 13.324 5.977 13.324 13.324-.072 7.347-6.049 13.39-13.412 13.39zm7.333-9.975c-.4-.2-2.379-1.175-2.75-1.304-.371-.129-.643-.2-.914.2-.271.4-1.05 1.304-1.293 1.575-.243.271-.486.3-.886.1-.4-.2-1.693-.624-3.222-1.988-1.193-1.064-1.993-2.379-2.236-2.779-.243-.4-.029-.614.186-.814.186-.186.4-.486.6-.729.2-.243.271-.414.4-.686.129-.271.071-.514-.029-.714-.1-.2-.914-2.193-1.25-3.007-.329-.786-.671-.671-.914-.686h-.786c-.271 0-.714.1-1.086.5-.371.4-1.421 1.386-1.421 3.379s1.457 3.922 1.657 4.193c.2.271 2.864 4.379 6.95 6.136.971.421 1.729.671 2.321.857.971.314 1.857.271 2.557.171.779-.114 2.379-.971 2.721-1.907.343-.943.343-1.75.243-1.921-.1-.171-.371-.271-.771-.471z"
				/>
			</svg>
		</span>
		<Transition name="tooltip">
			<span v-if="isHovered" class="whatsapp-tooltip"> שלחו לנו הודעה 💬 </span>
		</Transition>
		<span class="whatsapp-pulse"></span>
	</a>
</template>

<script setup>
import { ref } from 'vue';

const isHovered = ref(false);

const phoneNumber = '972528460331';
const message = 'היי מרגליתות! 🍰 אשמח לשמוע פרטים נוספים';
const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
</script>

<style scoped>
.whatsapp-float {
	position: fixed;
	bottom: 25px;
	left: 25px;
	width: 60px;
	height: 60px;
	background: #25d366;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
	z-index: 999;
	transition: all 0.3s ease;
	text-decoration: none;
}

.whatsapp-float:hover {
	transform: scale(1.1);
	box-shadow: 0 6px 25px rgba(37, 211, 102, 0.5);
}

.whatsapp-icon {
	width: 32px;
	height: 32px;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
}

.whatsapp-icon svg {
	width: 100%;
	height: 100%;
}

/* Tooltip */
.whatsapp-tooltip {
	position: absolute;
	right: calc(100% + 15px);
	background: var(--bg-primary);
	color: var(--text-primary);
	padding: 0.6rem 1rem;
	border-radius: 10px;
	font-size: 0.9rem;
	font-weight: 600;
	white-space: nowrap;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	pointer-events: none;
}

.whatsapp-tooltip::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 100%;
	transform: translateY(-50%);
	border: 8px solid transparent;
	border-left-color: var(--bg-primary);
}

/* Pulse Animation */
.whatsapp-pulse {
	position: absolute;
	width: 100%;
	height: 100%;
	background: #25d366;
	border-radius: 50%;
	animation: pulse 2s ease-out infinite;
	z-index: -1;
}

@keyframes pulse {
	0% {
		transform: scale(1);
		opacity: 0.5;
	}
	100% {
		transform: scale(1.5);
		opacity: 0;
	}
}

/* Tooltip Transition */
.tooltip-enter-active,
.tooltip-leave-active {
	transition: all 0.3s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
	opacity: 0;
	transform: translateX(10px);
}

/* Responsive */
@media (max-width: 768px) {
	.whatsapp-float {
		bottom: 20px;
		left: 20px;
		width: 55px;
		height: 55px;
	}

	.whatsapp-icon {
		width: 28px;
		height: 28px;
	}

	.whatsapp-tooltip {
		display: none;
	}
}

/* Hide on checkout/admin pages */
.checkout-page .whatsapp-float,
.admin-page .whatsapp-float {
	display: none;
}
</style>
