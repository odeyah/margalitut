<template>
	<section class="testimonials-section">
		<div class="section-header">
			<span class="section-icon">⭐</span>
			<h2 class="section-title">מה הלקוחות אומרים</h2>
			<p class="section-subtitle">הביקורות שלכם חשובות לנו</p>
		</div>

		<!-- Loading State -->
		<div v-if="isLoading" class="loading-state">
			<div class="loading-spinner"></div>
			<p>טוען ביקורות...</p>
		</div>

		<!-- If there are testimonials -->
		<template v-else-if="reviews.length > 0">
			<!-- Stats -->
			<div class="stats-row">
				<div class="stat-item">
					<span class="stat-number">{{ reviews.length }}</span>
					<span class="stat-label">ביקורות</span>
				</div>
				<div class="stat-item">
					<span class="stat-number">{{ averageRating }}</span>
					<span class="stat-label">דירוג ממוצע</span>
					<div class="stat-stars">{{ starsDisplay }}</div>
				</div>
			</div>

			<!-- Testimonials Carousel -->
			<div class="testimonials-container">
				<button class="nav-btn prev" @click="prevSlide" :disabled="currentIndex === 0">❯</button>

				<div class="testimonials-track">
					<div class="testimonials-slider" :style="{ transform: `translateX(${currentIndex * (100 / visibleCount)}%)` }">
						<div v-for="review in reviews" :key="review.id" class="testimonial-card">
							<div class="card-header">
								<div class="avatar">
									<span class="avatar-letter">{{ review.name.charAt(0) }}</span>
								</div>
								<div class="customer-info">
									<h4 class="customer-name">{{ review.name }}</h4>
									<span class="customer-location">{{ review.location || 'בית שמש' }}</span>
								</div>
								<div class="rating">
									<span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }"> ★ </span>
								</div>
							</div>

							<p class="testimonial-text">"{{ review.text }}"</p>

							<div class="card-footer">
								<span class="product-tag">{{ review.product }}</span>
								<span class="source-tag" v-if="review.source">
									<span class="source-icon">💬</span> {{ review.source }}
								</span>
							</div>
						</div>
					</div>
				</div>

				<button class="nav-btn next" @click="nextSlide" :disabled="currentIndex >= maxIndex">❮</button>
			</div>

			<!-- Dots -->
			<div class="dots" v-if="dotsCount > 1">
				<button
					v-for="n in dotsCount"
					:key="n"
					class="dot"
					:class="{ active: currentIndex === n - 1 }"
					@click="currentIndex = n - 1"
				></button>
			</div>
		</template>

		<!-- Empty State -->
		<template v-else>
			<div class="empty-state">
				<span class="empty-icon">🌟</span>
				<h3>היו הראשונים לדרג!</h3>
				<p>עדיין אין ביקורות. הזמינו מאיתנו ושתפו את החוויה שלכם</p>
			</div>
		</template>

		<!-- CTA - Add Review -->
		<div class="testimonials-cta">
			<button class="cta-btn primary" @click="openReviewModal"><span>✍️</span> הוסיפו ביקורת</button>
			<router-link to="/menu" class="cta-btn secondary"> לתפריט שלנו 🍰 </router-link>
		</div>

		<!-- Review Modal -->
		<Teleport to="body">
			<Transition name="fade">
				<div v-if="showReviewModal" class="modal-overlay" @click="closeReviewModal">
					<div class="modal-content" @click.stop>
						<button class="modal-close" @click="closeReviewModal">✕</button>

						<div class="modal-header">
							<span class="modal-icon">⭐</span>
							<h3>שתפו את החוויה שלכם</h3>
							<p>נשמח לשמוע מה חשבתם!</p>
						</div>

						<form @submit.prevent="submitReview" class="review-form">
							<!-- Rating -->
							<div class="form-group">
								<label class="form-label">דירוג *</label>
								<div class="rating-input">
									<button
										v-for="star in 5"
										:key="star"
										type="button"
										class="rating-star"
										:class="{ active: star <= newReview.rating }"
										@click="newReview.rating = star"
									>
										★
									</button>
								</div>
							</div>

							<!-- Name -->
							<div class="form-group">
								<label class="form-label">שם *</label>
								<input type="text" v-model="newReview.name" placeholder="השם שלכם" class="form-input" required />
							</div>

							<!-- Phone -->
							<div class="form-group">
								<label class="form-label">טלפון</label>
								<input type="tel" v-model="newReview.phone" placeholder="050-0000000" class="form-input" dir="ltr" />
							</div>

							<!-- Location -->
							<div class="form-group">
								<label class="form-label">מאיפה אתם?</label>
								<select v-model="newReview.location" class="form-input">
									<option value="">בחרו אזור</option>
									<option value="בית שמש">בית שמש</option>
									<option value="רמת בית שמש א'">רמת בית שמש א'</option>
									<option value="רמת בית שמש ב'">רמת בית שמש ב'</option>
									<option value="רמת בית שמש ג'">רמת בית שמש ג'</option>
									<option value="שכונת המשקפיים">שכונת המשקפיים</option>
									<option value="אחר">אחר</option>
								</select>
							</div>

							<!-- Product -->
							<div class="form-group">
								<label class="form-label">מה הזמנתם? *</label>
								<input
									type="text"
									v-model="newReview.product"
									placeholder="למשל: עוגת שמרים שוקולד"
									class="form-input"
									required
								/>
							</div>

							<!-- Review Text -->
							<div class="form-group">
								<label class="form-label">הביקורת שלכם *</label>
								<textarea
									v-model="newReview.text"
									placeholder="ספרו לנו על החוויה..."
									class="form-input form-textarea"
									rows="4"
									required
								></textarea>
							</div>

							<!-- Submit -->
							<button type="submit" class="submit-btn" :disabled="isSubmitting || !isFormValid">
								<span v-if="isSubmitting" class="loading-spinner small"></span>
								<span v-else>שליחת ביקורת ⭐</span>
							</button>
						</form>
					</div>
				</div>
			</Transition>
		</Teleport>

		<!-- Success Modal -->
		<Teleport to="body">
			<Transition name="fade">
				<div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
					<div class="modal-content success-modal" @click.stop>
						<span class="success-icon">🎉</span>
						<h3>תודה רבה!</h3>
						<p>הביקורת שלכם התקבלה ותפורסם לאחר אישור</p>
						<button class="close-btn" @click="showSuccessModal = false">סגור</button>
					</div>
				</div>
			</Transition>
		</Teleport>
	</section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getApprovedReviews, addReview } from '../../services/ordersService';
import { sendReviewEmail } from '../../services/emailService';
import { useToastStore } from '../../stores/toastStore';

const toastStore = useToastStore();

const currentIndex = ref(0);
const visibleCount = ref(3);
const isLoading = ref(true);
const showReviewModal = ref(false);
const showSuccessModal = ref(false);
const isSubmitting = ref(false);

// ביקורות מ-Firebase
const reviews = ref([]);

// ביקורות התחלתיות מוואטסאפ (יוחלפו בביקורות מ-Firebase)
const initialReviews = [
	{
		id: 'wa1',
		name: 'Rabi Lary Shain.',
		location: 'שכונת המשקפיים',
		rating: 5,
		text: 'They are excelent!! כל הכבוד',
		product: 'ספינג',
		source: 'וואטסאפ',
		status: 'approved',
	},
	{
		id: 'wa2',
		name: 'Levi Blumenfeld.',
		location: 'שכונת המשקפיים',
		rating: 5,
		text: 'was mamash deliciouse! Thanks very much!',
		product: 'ספינג',
		source: 'וואטסאפ',
		status: 'approved',
	},
	{
		id: 'wa3',
		name: 'יוסי ל.',
		location: 'בית שמש',
		rating: 5,
		text: 'העוגיות הכי טעימות! הילדים מתים על השוקולד צ׳יפס. מזמינים כל שבוע',
		product: 'עוגיות שוקולד צ׳יפס',
		source: 'וואטסאפ',
		status: 'approved',
	},
	{
		id: 'wa4',
		name: 'רחל א.',
		location: "רמת בית שמש ב'",
		rating: 5,
		text: 'סוף סוף מצאתי עוגות ללא גלוטן טעימות! אי אפשר להבדיל מעוגה רגילה',
		product: 'עוגת שוקולד ללא גלוטן',
		source: 'וואטסאפ',
		status: 'approved',
	},
];

// טופס ביקורת חדשה
const newReview = ref({
	name: '',
	phone: '',
	location: '',
	product: '',
	text: '',
	rating: 0,
});

const isFormValid = computed(() => {
	return (
		newReview.value.rating > 0 &&
		newReview.value.name.trim() !== '' &&
		newReview.value.product.trim() !== '' &&
		newReview.value.text.trim() !== ''
	);
});

const averageRating = computed(() => {
	if (reviews.value.length === 0) return '0';
	const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
	return (sum / reviews.value.length).toFixed(1);
});

const starsDisplay = computed(() => {
	const avg = parseFloat(averageRating.value);
	return '⭐'.repeat(Math.round(avg));
});

const maxIndex = computed(() => {
	return Math.max(0, reviews.value.length - visibleCount.value);
});

const dotsCount = computed(() => {
	return Math.max(1, Math.ceil(reviews.value.length / visibleCount.value));
});

// טעינת ביקורות
async function loadReviews() {
	isLoading.value = true;
	try {
		const firebaseReviews = await getApprovedReviews();
		// שילוב ביקורות מ-Firebase עם ביקורות התחלתיות מוואטסאפ
		reviews.value = [...firebaseReviews, ...initialReviews];
	} catch (error) {
		console.error('Error loading reviews:', error);
		// אם נכשל, השתמש בביקורות מוואטסאפ
		reviews.value = initialReviews;
	} finally {
		isLoading.value = false;
	}
}

function openReviewModal() {
	showReviewModal.value = true;
	document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
	showReviewModal.value = false;
	document.body.style.overflow = '';
	resetForm();
}

function resetForm() {
	newReview.value = {
		name: '',
		phone: '',
		location: '',
		product: '',
		text: '',
		rating: 0,
	};
}

async function submitReview() {
	if (!isFormValid.value) return;

	isSubmitting.value = true;

	try {
		// שמירה ב-Firebase
		const reviewData = {
			...newReview.value,
			source: 'אתר',
		};

		await addReview(reviewData);

		// שליחת מייל
		sendReviewEmail(reviewData).catch(err => {
			console.error('Email failed:', err);
		});

		closeReviewModal();
		showSuccessModal.value = true;

		toastStore.success('הביקורת נשלחה בהצלחה! 🎉');
	} catch (error) {
		console.error('Error submitting review:', error);
		toastStore.error('שגיאה בשליחת הביקורת, נסו שוב');
	} finally {
		isSubmitting.value = false;
	}
}

function nextSlide() {
	if (currentIndex.value < maxIndex.value) {
		currentIndex.value++;
	}
}

function prevSlide() {
	if (currentIndex.value > 0) {
		currentIndex.value--;
	}
}

function updateVisibleCount() {
	if (window.innerWidth < 640) {
		visibleCount.value = 1;
	} else if (window.innerWidth < 1024) {
		visibleCount.value = 2;
	} else {
		visibleCount.value = 3;
	}
	if (currentIndex.value > maxIndex.value) {
		currentIndex.value = Math.max(0, maxIndex.value);
	}
}

// Auto slide
let autoSlideInterval = null;

function startAutoSlide() {
	if (reviews.value.length <= visibleCount.value) return;

	autoSlideInterval = setInterval(() => {
		if (currentIndex.value < maxIndex.value) {
			currentIndex.value++;
		} else {
			currentIndex.value = 0;
		}
	}, 5000);
}

function stopAutoSlide() {
	if (autoSlideInterval) {
		clearInterval(autoSlideInterval);
	}
}

onMounted(async () => {
	updateVisibleCount();
	window.addEventListener('resize', updateVisibleCount);
	await loadReviews();
	startAutoSlide();
});

onUnmounted(() => {
	window.removeEventListener('resize', updateVisibleCount);
	stopAutoSlide();
});
</script>

<style scoped>
.testimonials-section {
	padding: 3rem 0;
}

/* Section Header */
.section-header {
	text-align: center;
	margin-bottom: 2rem;
}

.section-icon {
	font-size: 2.5rem;
	display: block;
	margin-bottom: 0.5rem;
}

.section-title {
	font-size: 1.75rem;
	font-weight: 800;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.section-subtitle {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0;
}

/* Loading State */
.loading-state {
	text-align: center;
	padding: 3rem;
}

.loading-spinner {
	width: 40px;
	height: 40px;
	border: 3px solid var(--border-color);
	border-top-color: var(--pink-primary);
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin: 0 auto 1rem;
}

.loading-spinner.small {
	width: 20px;
	height: 20px;
	border-width: 2px;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

/* Empty State */
.empty-state {
	text-align: center;
	padding: 3rem 2rem;
	background: linear-gradient(135deg, var(--pink-light), var(--bg-primary));
	border-radius: 24px;
	margin-bottom: 2rem;
}

.empty-icon {
	font-size: 4rem;
	display: block;
	margin-bottom: 1rem;
	animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
}

.empty-state h3 {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.empty-state p {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0;
}

/* Stats */
.stats-row {
	display: flex;
	justify-content: center;
	gap: 3rem;
	margin-bottom: 2.5rem;
	flex-wrap: wrap;
}

.stat-item {
	text-align: center;
}

.stat-number {
	display: block;
	font-size: 2rem;
	font-weight: 800;
	color: var(--pink-primary);
}

.stat-label {
	font-size: 0.9rem;
	color: var(--text-secondary);
}

.stat-stars {
	font-size: 0.8rem;
	margin-top: 0.25rem;
}

/* Testimonials Container */
.testimonials-container {
	position: relative;
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.testimonials-track {
	flex: 1;
	overflow: hidden;
}

.testimonials-slider {
	display: flex;
	gap: 1.5rem;
	transition: transform 0.5s ease;
}

/* Navigation Buttons */
.nav-btn {
	width: 44px;
	height: 44px;
	background: var(--bg-primary);
	border: 2px solid var(--border-color);
	border-radius: 50%;
	font-size: 1.25rem;
	color: var(--text-primary);
	cursor: pointer;
	transition: all 0.3s ease;
	flex-shrink: 0;
}

.nav-btn:hover:not(:disabled) {
	border-color: var(--pink-primary);
	color: var(--pink-primary);
}

.nav-btn:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

/* Testimonial Card */
.testimonial-card {
	flex: 0 0 calc((100% - 3rem) / 3);
	background: var(--bg-primary);
	border-radius: 20px;
	padding: 1.5rem;
	box-shadow: var(--card-shadow);
	transition: all 0.3s ease;
	border: 2px solid transparent;
}

.testimonial-card:hover {
	border-color: var(--pink-light);
	transform: translateY(-5px);
	box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.card-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 1rem;
}

.avatar {
	width: 48px;
	height: 48px;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.avatar-letter {
	color: white;
	font-size: 1.25rem;
	font-weight: 700;
}

.customer-info {
	flex: 1;
}

.customer-name {
	font-size: 1rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0;
}

.customer-location {
	font-size: 0.8rem;
	color: var(--text-muted);
}

.rating {
	display: flex;
	gap: 2px;
}

.star {
	font-size: 1rem;
	color: var(--border-color);
}

.star.filled {
	color: #fbbf24;
}

.testimonial-text {
	font-size: 0.95rem;
	color: var(--text-secondary);
	line-height: 1.7;
	margin: 0 0 1rem 0;
	font-style: italic;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.product-tag {
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--pink-primary);
	background: var(--pink-light);
	padding: 0.3rem 0.75rem;
	border-radius: 15px;
}

.source-tag {
	font-size: 0.75rem;
	color: var(--text-muted);
	display: flex;
	align-items: center;
	gap: 0.25rem;
}

/* Dots */
.dots {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	margin-bottom: 2rem;
}

.dot {
	width: 10px;
	height: 10px;
	background: var(--border-color);
	border: none;
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.3s ease;
}

.dot.active {
	background: var(--pink-primary);
	width: 30px;
	border-radius: 5px;
}

/* CTA */
.testimonials-cta {
	text-align: center;
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.cta-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 2rem;
	border-radius: 30px;
	font-weight: 700;
	text-decoration: none;
	transition: all 0.3s ease;
	cursor: pointer;
	border: none;
	font-size: 1rem;
}

.cta-btn.primary {
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
}

.cta-btn.primary:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 30px rgba(255, 107, 157, 0.4);
}

.cta-btn.secondary {
	background: var(--bg-primary);
	color: var(--pink-primary);
	border: 2px solid var(--pink-primary);
}

.cta-btn.secondary:hover {
	background: var(--pink-light);
	transform: translateY(-3px);
}

/* Modal */
.modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
	padding: 1rem;
}

.modal-content {
	background: var(--bg-primary);
	border-radius: 24px;
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
	width: 36px;
	height: 36px;
	background: var(--bg-secondary);
	border: none;
	border-radius: 50%;
	font-size: 1.25rem;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.modal-close:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

.modal-header {
	text-align: center;
	margin-bottom: 1.5rem;
}

.modal-icon {
	font-size: 3rem;
	display: block;
	margin-bottom: 0.5rem;
}

.modal-header h3 {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.25rem 0;
}

.modal-header p {
	color: var(--text-secondary);
	margin: 0;
}

/* Review Form */
.review-form {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.form-label {
	font-weight: 600;
	font-size: 0.95rem;
	color: var(--text-primary);
}

.form-input {
	padding: 0.875rem 1rem;
	background: var(--bg-secondary);
	border: 2px solid transparent;
	border-radius: 12px;
	font-size: 1rem;
	color: var(--text-primary);
	transition: all 0.3s ease;
}

.form-input:focus {
	outline: none;
	border-color: var(--pink-primary);
	background: var(--bg-primary);
}

.form-textarea {
	resize: vertical;
	min-height: 100px;
}

/* Rating Input */
.rating-input {
	display: flex;
	gap: 0.5rem;
}

.rating-star {
	font-size: 2rem;
	background: none;
	border: none;
	color: var(--border-color);
	cursor: pointer;
	transition: all 0.2s ease;
}

.rating-star:hover,
.rating-star.active {
	color: #fbbf24;
	transform: scale(1.1);
}

/* Submit Button */
.submit-btn {
	padding: 1rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border: none;
	border-radius: 12px;
	font-size: 1.1rem;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.submit-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

/* Success Modal */
.success-modal {
	text-align: center;
	padding: 3rem 2rem;
}

.success-icon {
	font-size: 4rem;
	display: block;
	margin-bottom: 1rem;
}

.success-modal h3 {
	font-size: 1.5rem;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.success-modal p {
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
}

.close-btn {
	padding: 0.75rem 2rem;
	background: var(--pink-primary);
	color: white;
	border: none;
	border-radius: 25px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.close-btn:hover {
	background: var(--pink-secondary);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
	.testimonial-card {
		flex: 0 0 calc((100% - 1.5rem) / 2);
	}
}

@media (max-width: 768px) {
	.stats-row {
		gap: 2rem;
	}

	.stat-number {
		font-size: 1.5rem;
	}

	.nav-btn {
		display: none;
	}

	.testimonials-container {
		padding: 0 1rem;
	}
}

@media (max-width: 640px) {
	.testimonial-card {
		flex: 0 0 100%;
	}

	.section-title {
		font-size: 1.5rem;
	}

	.modal-content {
		padding: 1.5rem;
	}
}
</style>
