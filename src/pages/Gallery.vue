<template>
	<div class="gallery-page">
		<!-- Page Header -->
		<header class="page-header animate-on-scroll fade-up">
			<span class="header-icon">📸</span>
			<h1 class="page-title">הגלריה שלנו</h1>
			<p class="page-subtitle">דפדפו באלבום היצירות שלנו</p>
		</header>

		<!-- Flipbook Gallery -->
		<div class="flipbook-wrapper animate-on-scroll fade-up">
			<div class="book-container" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
				<!-- The Book -->
				<div class="book" :class="{ 'mobile-mode': isMobile }">
					<!-- Book Spine - only on desktop -->
					<div class="book-spine" v-if="!isMobile">
						<span class="spine-text">מרגליתות</span>
					</div>

					<!-- Left Page - Desktop only -->
					<div class="left-page" v-if="!isMobile && bookOpened">
						<div class="page-content">
							<div class="image-frame" v-if="leftImage" @click="openLightbox(leftImage.index)">
								<img :src="leftImage.src" :alt="leftImage.title" />
								<div class="image-info">
									<h3>{{ leftImage.title }}</h3>
									<span class="image-category">{{ leftImage.categoryName }}</span>
								</div>
								<div class="image-number">{{ leftImage.index + 1 }}</div>
							</div>
							<div class="empty-page" v-else>
								<span>📖</span>
							</div>
						</div>
					</div>

					<!-- Right Page - Desktop only -->
					<div class="right-page" v-if="!isMobile && bookOpened">
						<div class="page-content">
							<div class="image-frame" v-if="rightImage" @click="openLightbox(rightImage.index)">
								<img :src="rightImage.src" :alt="rightImage.title" />
								<div class="image-info">
									<h3>{{ rightImage.title }}</h3>
									<span class="image-category">{{ rightImage.categoryName }}</span>
								</div>
								<div class="image-number">{{ rightImage.index + 1 }}</div>
							</div>
							<div class="empty-page" v-else>
								<span>📖</span>
							</div>
						</div>
					</div>

					<!-- Flipping Page Overlay - Desktop -->
					<div v-if="!isMobile && bookOpened && isFlipping" class="flipping-page" :class="flipDirection">
						<div class="flip-page-inner">
							<div class="flip-front"></div>
							<div class="flip-back"></div>
						</div>
					</div>

					<!-- Mobile Single Page -->
					<div v-if="isMobile && bookOpened" class="mobile-page">
						<div class="page-content">
							<div class="image-frame" v-if="mobileImage" @click="openLightbox(mobileImage.index)">
								<img :src="mobileImage.src" :alt="mobileImage.title" />
								<div class="image-info">
									<h3>{{ mobileImage.title }}</h3>
									<span class="image-category">{{ mobileImage.categoryName }}</span>
								</div>
								<div class="image-number">{{ mobileImage.index + 1 }}</div>
							</div>
						</div>

						<!-- Mobile Flip Overlay -->
						<div v-if="isFlipping" class="mobile-flip" :class="flipDirection"></div>
					</div>
					<!-- Book Cover -->
					<div class="book-cover" :class="{ 'is-open': bookOpened }" @click="!bookOpened && openBook()">
						<div class="cover-content">
							<span class="cover-icon">📸</span>
							<h2>אלבום התמונות</h2>
							<p>מרגליתות</p>
							<span class="cover-hint">לחצו לפתיחה</span>
						</div>
					</div>
				</div>

				<!-- Navigation -->
				<button class="nav-btn nav-prev" @click="prevPage" v-show="bookOpened">
					<span>❯</span>
				</button>

				<button class="nav-btn nav-next" @click="nextPage" v-show="bookOpened">
					<span>❮</span>
				</button>

				<!-- Open Book Button -->
				<button v-if="!bookOpened" class="open-book-btn" @click="openBook">פתחו את האלבום 📖</button>
			</div>

			<!-- Progress -->
			<div class="book-progress" v-show="bookOpened">
				<div class="progress-track">
					<div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
				</div>
				<span class="progress-text">
					{{ isMobile ? `תמונה ${currentPage + 1} מתוך ${totalImages}` : `עמוד ${currentPage + 1} מתוך ${totalPages}` }}
				</span>
			</div>

			<!-- Controls -->
			<div class="book-controls" v-show="bookOpened">
				<button class="control-btn" @click="toggleAutoPlay">
					<span>{{ isAutoPlaying ? '⏸️' : '▶️' }}</span>
					{{ isAutoPlaying ? 'עצור' : 'דפדוף אוטומטי' }}
				</button>

				<div class="speed-control">
					<span class="speed-label">מהירות:</span>
					<button
						v-for="s in [1, 2, 3, 4, 5]"
						:key="s"
						class="speed-btn"
						:class="{ active: speed === s }"
						@click="setSpeed(s)"
					>
						{{ s }}x
					</button>
				</div>

				<button class="control-btn" @click="closeBook">
					<span>📕</span>
					סגור אלבום
				</button>
			</div>

			<!-- Page Thumbnails -->
			<div class="page-thumbs" v-show="bookOpened">
				<button
					v-for="n in isMobile ? totalImages : totalPages"
					:key="n"
					class="thumb-btn"
					:class="{ active: currentPage === n - 1 }"
					@click="goToPage(n - 1)"
				>
					{{ n }}
				</button>
			</div>
		</div>

		<!-- Lightbox -->
		<Teleport to="body">
			<Transition name="fade">
				<div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
					<div class="lightbox-content" @click.stop>
						<button class="lightbox-close" @click="closeLightbox">✕</button>

						<button class="lightbox-nav prev" @click="lightboxPrev">❯</button>

						<div class="lightbox-image">
							<img :src="images[lightboxIndex]?.src" :alt="images[lightboxIndex]?.title" />
						</div>

						<button class="lightbox-nav next" @click="lightboxNext">❮</button>

						<div class="lightbox-info">
							<h3>{{ images[lightboxIndex]?.title }}</h3>
							<p>{{ images[lightboxIndex]?.description }}</p>
							<span class="lightbox-counter">{{ lightboxIndex + 1 }} / {{ images.length }}</span>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>

		<!-- CTA Section -->
		<section class="cta-section animate-on-scroll zoom-in">
			<div class="cta-card">
				<span class="cta-icon">✨</span>
				<h2>רוצים שניצור גם לכם?</h2>
				<p>כל עוגה ומאפה מותאמים אישית לפי בקשתכם</p>
				<div class="cta-buttons">
					<router-link to="/quote" class="cta-btn primary"> בקשת הצעת מחיר </router-link>
					<router-link to="/menu" class="cta-btn secondary"> לתפריט </router-link>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useHead } from '@vueuse/head';
import { useScrollAnimation } from '../composables/useScrollAnimation';

useScrollAnimation();

useHead({
	title: 'גלריה | מרגליתות - מאפייה ביתית בבית שמש',
	meta: [
		{
			name: 'description',
			content: 'גלריה של עוגות, מאפים וקינוחים ממרגליתות - מאפייה ביתית בבית שמש',
		},
	],
});

// State
const bookOpened = ref(false);
const currentPage = ref(0);
const isAutoPlaying = ref(false);
const speed = ref(3);
const isMobile = ref(false);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const isFlipping = ref(false);
const flipDirection = ref('next'); // 'next' or 'prev'

let autoPlayInterval = null;
let touchStartX = 0;

// Categories
const categoryNames = {
	cakes: 'עוגות',
	cookies: 'עוגיות',
	bread: 'לחמים',
	dairy: 'חלביים',
	events: 'אירועים',
};

// Gallery Images
// Gallery Images
const galleryData = [
	{
		src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
		title: 'עוגת שוקולד מפנקת',
		category: 'cakes',
		description: 'עוגת שוקולד עשירה עם ציפוי גנאש',
	},
	{
		src: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800',
		title: 'עוגיות שוקולד צ׳יפס',
		category: 'cookies',
		description: 'עוגיות ביתיות עם שוקולד צ׳יפס בלגי',
	},
	{
		src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
		title: 'חלה לשבת',
		category: 'bread',
		description: 'חלה רכה וטרייה לשבת',
	},
	{
		src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
		title: 'עוגת גבינה',
		category: 'cakes',
		description: 'עוגת גבינה קרמית עם תותים',
	},
	{
		src: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800',
		title: 'מאפינס שוקולד',
		category: 'cakes',
		description: 'מאפינס שוקולד עם ליבה נוזלת',
	},
	{
		src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
		title: 'קרואסונים',
		category: 'bread',
		description: 'קרואסונים חמאתיים ופריכים',
	},
	{
		src: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
		title: 'עוגיות לינזר',
		category: 'cookies',
		description: 'עוגיות לינזר עם ריבה',
	},
	{
		src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
		title: 'עוגת יום הולדת',
		category: 'events',
		description: 'עוגה מעוצבת לאירוע מיוחד',
	},
	{
		src: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800',
		title: 'פיצה ביתית',
		category: 'dairy',
		description: 'פיצה עם גבינות וירקות טריים',
	},
	{
		src: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800',
		title: 'עוגת שכבות',
		category: 'cakes',
		description: 'עוגת שכבות מרשימה לאירועים',
	},
	{
		src: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
		title: 'עוגיות חמאה',
		category: 'cookies',
		description: 'עוגיות חמאה מעוצבות',
	},
	{
		src: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800',
		title: 'שולחן מתוקים',
		category: 'events',
		description: 'שולחן מתוקים לבר מצווה',
	},
];

const images = galleryData.map((img, index) => ({
	...img,
	index,
	categoryName: categoryNames[img.category] || img.category,
}));

// Computed
const totalImages = computed(() => images.length);
const totalPages = computed(() => Math.ceil(images.length / 2));

const leftImage = computed(() => {
	const index = currentPage.value * 2;
	return images[index] || null;
});

const rightImage = computed(() => {
	const index = currentPage.value * 2 + 1;
	return images[index] || null;
});

const mobileImage = computed(() => {
	return images[currentPage.value] || null;
});

const progressPercent = computed(() => {
	if (isMobile.value) {
		return ((currentPage.value + 1) / totalImages.value) * 100;
	}
	return ((currentPage.value + 1) / totalPages.value) * 100;
});

// Methods
function checkMobile() {
	isMobile.value = window.innerWidth < 768;
}

function openBook() {
	bookOpened.value = true;
	currentPage.value = 0;
}

function closeBook() {
	bookOpened.value = false;
	currentPage.value = 0;
	stopAutoPlay();
}

function nextPage() {
	if (isFlipping.value) return;

	isFlipping.value = true;
	flipDirection.value = 'next';

	setTimeout(() => {
		const max = isMobile.value ? totalImages.value - 1 : totalPages.value - 1;
		if (currentPage.value < max) {
			currentPage.value++;
		} else {
			currentPage.value = 0;
		}
	}, 300);

	setTimeout(() => {
		isFlipping.value = false;
	}, 600);
}

function prevPage() {
	if (isFlipping.value) return;

	isFlipping.value = true;
	flipDirection.value = 'prev';

	setTimeout(() => {
		const max = isMobile.value ? totalImages.value - 1 : totalPages.value - 1;
		if (currentPage.value > 0) {
			currentPage.value--;
		} else {
			currentPage.value = max;
		}
	}, 300);

	setTimeout(() => {
		isFlipping.value = false;
	}, 600);
}

function goToPage(page) {
	if (isFlipping.value || page === currentPage.value) return;

	isFlipping.value = true;
	flipDirection.value = page > currentPage.value ? 'next' : 'prev';

	setTimeout(() => {
		currentPage.value = page;
	}, 300);

	setTimeout(() => {
		isFlipping.value = false;
	}, 600);
}

function setSpeed(s) {
	speed.value = s;
	if (isAutoPlaying.value) {
		startAutoPlay();
	}
}

function startAutoPlay() {
	stopAutoPlay();
	const interval = 3000 / speed.value;
	autoPlayInterval = setInterval(nextPage, interval);
}

function stopAutoPlay() {
	if (autoPlayInterval) {
		clearInterval(autoPlayInterval);
		autoPlayInterval = null;
	}
}

function toggleAutoPlay() {
	isAutoPlaying.value = !isAutoPlaying.value;
	if (isAutoPlaying.value) {
		startAutoPlay();
	} else {
		stopAutoPlay();
	}
}

// Lightbox
function openLightbox(index) {
	lightboxIndex.value = index;
	lightboxOpen.value = true;
	document.body.style.overflow = 'hidden';
}

function closeLightbox() {
	lightboxOpen.value = false;
	document.body.style.overflow = '';
}

function lightboxNext() {
	if (lightboxIndex.value < images.length - 1) {
		lightboxIndex.value++;
	} else {
		lightboxIndex.value = 0;
	}
}

function lightboxPrev() {
	if (lightboxIndex.value > 0) {
		lightboxIndex.value--;
	} else {
		lightboxIndex.value = images.length - 1;
	}
}

// Touch
function handleTouchStart(e) {
	touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
	if (!bookOpened.value) return;
	const diff = touchStartX - e.changedTouches[0].clientX;
	if (Math.abs(diff) > 50) {
		if (diff > 0) nextPage();
		else prevPage();
	}
}

// Keyboard
function handleKeydown(e) {
	if (lightboxOpen.value) {
		if (e.key === 'ArrowLeft') lightboxNext();
		if (e.key === 'ArrowRight') lightboxPrev();
		if (e.key === 'Escape') closeLightbox();
	} else if (bookOpened.value) {
		if (e.key === 'ArrowLeft') nextPage();
		if (e.key === 'ArrowRight') prevPage();
		if (e.key === ' ') {
			e.preventDefault();
			toggleAutoPlay();
		}
		if (e.key === 'Escape') closeBook();
	}
}

// Lifecycle
onMounted(() => {
	checkMobile();
	window.addEventListener('resize', checkMobile);
	document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
	stopAutoPlay();
	window.removeEventListener('resize', checkMobile);
	document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.gallery-page {
	max-width: 1200px;
	margin: 0 auto;
	padding-bottom: 2rem;
}

/* Page Header */
.page-header {
	text-align: center;
	margin-bottom: 2rem;
}

.header-icon {
	font-size: 3rem;
	display: block;
	margin-bottom: 0.5rem;
}

.page-title {
	font-size: 2.25rem;
	font-weight: 800;
	margin: 0 0 0.5rem 0;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.page-subtitle {
	font-size: 1.1rem;
	color: var(--text-secondary);
	margin: 0;
}

/* ========== FLIPBOOK ========== */
.flipbook-wrapper {
	margin-bottom: 3rem;
}

.book-container {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 500px;
	padding: 2rem;
}

.book {
	position: relative;
	width: 700px;
	height: 450px;
	display: flex;
}

/* Book Spine */
.book-spine {
	position: absolute;
	left: 50%;
	top: 0;
	width: 20px;
	height: 100%;
	background: linear-gradient(90deg, #5d4037 0%, #8d6e63 20%, #a1887f 50%, #8d6e63 80%, #5d4037 100%);
	transform: translateX(-50%);
	z-index: 50;
	border-radius: 2px;
	box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2);
}

.spine-text {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) rotate(-90deg);
	white-space: nowrap;
	font-size: 0.9rem;
	font-weight: 700;
	color: #fff8e1;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	letter-spacing: 2px;
}

/* Pages */
.left-page,
.right-page {
	position: absolute;
	width: calc(50% - 10px);
	height: 100%;
	background: #fffef9;
}

.left-page {
	left: 0;
	border-radius: 10px 0 0 10px;
	box-shadow: -5px 0 20px rgba(0, 0, 0, 0.15), inset 5px 0 15px rgba(0, 0, 0, 0.05);
}

.right-page {
	right: 0;
	border-radius: 0 10px 10px 0;
	box-shadow: 5px 0 20px rgba(0, 0, 0, 0.15), inset -5px 0 15px rgba(0, 0, 0, 0.05);
}

.page-content {
	width: 100%;
	height: 100%;
	padding: 15px;
}

.image-frame {
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 8px;
	overflow: hidden;
	cursor: pointer;
	background: #f5f5f5;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.image-frame img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.5s ease;
}

.image-frame:hover img {
	transform: scale(1.05);
}

.image-info {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 1rem;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
	color: white;
}

.image-info h3 {
	font-size: 1rem;
	font-weight: 700;
	margin: 0 0 0.25rem 0;
}

.image-category {
	font-size: 0.8rem;
	opacity: 0.8;
}

.image-number {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 28px;
	height: 28px;
	background: var(--pink-primary);
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.8rem;
	font-weight: 700;
}

.empty-page {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #fafafa, #f0f0f0);
	border-radius: 8px;
	font-size: 3rem;
	opacity: 0.3;
}

/* Book Cover */
.book-cover {
	position: absolute;
	width: calc(50% - 10px);
	height: 100%;
	right: 0;
	z-index: 200;
	cursor: pointer;
	transform-origin: left center;
	transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1), visibility 0s linear 0.8s, z-index 0s linear 0.4s;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	border-radius: 0 12px 12px 0;
	box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.3);
}

.book-cover.is-open {
	transform: rotateY(-180deg);
	visibility: hidden;
	z-index: -1;
}

.cover-content {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
	text-align: center;
	padding: 2rem;
	backface-visibility: hidden;
}

.cover-icon {
	font-size: 4rem;
	margin-bottom: 1rem;
	filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.cover-content h2 {
	font-size: 1.75rem;
	font-weight: 800;
	margin: 0 0 0.5rem 0;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.cover-content p {
	font-size: 1.1rem;
	margin: 0 0 2rem 0;
	opacity: 0.9;
}

.cover-hint {
	font-size: 0.9rem;
	padding: 0.5rem 1rem;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 20px;
	animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
	0%,
	100% {
		opacity: 0.7;
		transform: scale(1);
	}
	50% {
		opacity: 1;
		transform: scale(1.05);
	}
}

/* Mobile Page */
.mobile-page {
	position: absolute;
	width: 100%;
	height: 100%;
	background: #fffef9;
	border-radius: 12px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

/* Navigation */
.nav-btn {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 55px;
	height: 55px;
	background: var(--bg-primary);
	border: 3px solid var(--pink-primary);
	border-radius: 50%;
	font-size: 1.5rem;
	color: var(--pink-primary);
	cursor: pointer;
	transition: all 0.3s ease;
	z-index: 300;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	display: flex;
	align-items: center;
	justify-content: center;
}

.nav-btn:hover {
	background: var(--pink-primary);
	color: white;
	transform: translateY(-50%) scale(1.1);
}

.nav-prev {
	right: calc(50% + 380px);
}
.nav-next {
	left: calc(50% + 380px);
}

.open-book-btn {
	position: absolute;
	bottom: 20px;
	left: 50%;
	transform: translateX(-50%);
	padding: 1rem 2rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border: none;
	border-radius: 30px;
	font-size: 1.1rem;
	font-weight: 700;
	cursor: pointer;
	z-index: 300;
	box-shadow: 0 4px 20px rgba(255, 107, 157, 0.4);
	transition: all 0.3s ease;
}

.open-book-btn:hover {
	transform: translateX(-50%) scale(1.05);
}

/* Progress */
.book-progress {
	max-width: 500px;
	margin: 1.5rem auto;
	text-align: center;
}

.progress-track {
	height: 6px;
	background: var(--border-color);
	border-radius: 3px;
	overflow: hidden;
	margin-bottom: 0.5rem;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, var(--pink-primary), var(--pink-secondary));
	border-radius: 3px;
	transition: width 0.3s ease;
}

.progress-text {
	font-size: 0.9rem;
	color: var(--text-secondary);
}

/* Controls */
.book-controls {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1.5rem;
	flex-wrap: wrap;
	margin-bottom: 1.5rem;
}

.control-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.25rem;
	background: var(--bg-primary);
	border: 2px solid var(--border-color);
	border-radius: 25px;
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--text-primary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.control-btn:hover {
	border-color: var(--pink-primary);
	color: var(--pink-primary);
}

.speed-control {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.speed-label {
	font-size: 0.9rem;
	color: var(--text-secondary);
}

.speed-btn {
	width: 36px;
	height: 36px;
	background: var(--bg-secondary);
	border: 2px solid transparent;
	border-radius: 50%;
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.speed-btn:hover {
	border-color: var(--pink-primary);
}

.speed-btn.active {
	background: var(--pink-primary);
	color: white;
}

/* Page Thumbs */
.page-thumbs {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.thumb-btn {
	width: 36px;
	height: 36px;
	background: var(--bg-primary);
	border: 2px solid var(--border-color);
	border-radius: 8px;
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.thumb-btn:hover {
	border-color: var(--pink-primary);
	color: var(--pink-primary);
}

.thumb-btn.active {
	background: var(--pink-primary);
	border-color: var(--pink-primary);
	color: white;
}

/* Lightbox */
.lightbox {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.95);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 3000;
	padding: 2rem;
}

.lightbox-content {
	position: relative;
	max-width: 90vw;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.lightbox-image img {
	max-width: 100%;
	max-height: 75vh;
	border-radius: 12px;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox-close {
	position: absolute;
	top: -50px;
	right: 0;
	width: 44px;
	height: 44px;
	background: white;
	border: none;
	border-radius: 50%;
	font-size: 1.25rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.lightbox-close:hover {
	background: var(--pink-primary);
	color: white;
}

.lightbox-nav {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 50px;
	height: 50px;
	background: white;
	border: none;
	border-radius: 50%;
	font-size: 1.25rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.lightbox-nav:hover {
	background: var(--pink-primary);
	color: white;
}

.lightbox-nav.prev {
	right: -70px;
}
.lightbox-nav.next {
	left: -70px;
}

.lightbox-info {
	text-align: center;
	color: white;
	margin-top: 1.5rem;
}

.lightbox-info h3 {
	font-size: 1.25rem;
	font-weight: 700;
	margin: 0 0 0.5rem 0;
}

.lightbox-info p {
	font-size: 1rem;
	opacity: 0.8;
	margin: 0 0 0.5rem 0;
}

.lightbox-counter {
	font-size: 0.9rem;
	opacity: 0.6;
}

/* CTA Section */
.cta-section {
	margin: 2rem 0;
}

.cta-card {
	text-align: center;
	padding: 3rem 2rem;
	background: linear-gradient(135deg, var(--pink-light), var(--bg-primary));
	border-radius: 24px;
	border: 2px solid var(--border-pink);
}

.cta-icon {
	font-size: 3rem;
	display: block;
	margin-bottom: 1rem;
}

.cta-card h2 {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.cta-card > p {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
}

.cta-buttons {
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

/* Transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Mobile Mode */
.book.mobile-mode {
	width: 100%;
	max-width: 350px;
	height: 450px;
}

.book.mobile-mode .book-cover {
	width: 100%;
	border-radius: 12px;
}

.book.mobile-mode .book-cover.is-open {
	transform: translateX(100%);
	opacity: 0;
}
/* ========== FLIP ANIMATION ========== */
.flipping-page {
	position: absolute;
	width: calc(50% - 10px);
	height: 100%;
	right: 0;
	z-index: 100;
	transform-style: preserve-3d;
	transform-origin: left center;
	pointer-events: none;
}

.flipping-page.next {
	animation: flipNext 0.6s ease-in-out;
}

.flipping-page.prev {
	animation: flipPrev 0.6s ease-in-out;
}

.flip-page-inner {
	position: relative;
	width: 100%;
	height: 100%;
	transform-style: preserve-3d;
}

.flip-front,
.flip-back {
	position: absolute;
	width: 100%;
	height: 100%;
	backface-visibility: hidden;
	border-radius: 0 10px 10px 0;
}

.flip-front {
	background: linear-gradient(to left, #fffef9, #f5f0e6);
	box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1), inset 10px 0 30px rgba(0, 0, 0, 0.05);
}

.flip-back {
	background: linear-gradient(to right, #fffef9, #f5f0e6);
	transform: rotateY(180deg);
	box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1), inset -10px 0 30px rgba(0, 0, 0, 0.05);
}

@keyframes flipNext {
	0% {
		transform: rotateY(0deg);
		box-shadow: -5px 0 20px rgba(0, 0, 0, 0.2);
	}
	50% {
		box-shadow: -20px 0 40px rgba(0, 0, 0, 0.3);
	}
	100% {
		transform: rotateY(-180deg);
		box-shadow: 5px 0 20px rgba(0, 0, 0, 0.2);
	}
}

@keyframes flipPrev {
	0% {
		transform: rotateY(-180deg);
		box-shadow: 5px 0 20px rgba(0, 0, 0, 0.2);
	}
	50% {
		box-shadow: -20px 0 40px rgba(0, 0, 0, 0.3);
	}
	100% {
		transform: rotateY(0deg);
		box-shadow: -5px 0 20px rgba(0, 0, 0, 0.2);
	}
}

/* Mobile Flip */
.mobile-flip {
	position: absolute;
	inset: 0;
	background: linear-gradient(to right, #fffef9, #f5f0e6);
	border-radius: 12px;
	z-index: 100;
	pointer-events: none;
}

.mobile-flip.next {
	animation: mobileFlipNext 0.5s ease-in-out;
	transform-origin: left center;
}

.mobile-flip.prev {
	animation: mobileFlipPrev 0.5s ease-in-out;
	transform-origin: right center;
}

@keyframes mobileFlipNext {
	0% {
		transform: translateX(0) rotateY(0);
		opacity: 1;
	}
	100% {
		transform: translateX(-100%) rotateY(-30deg);
		opacity: 0;
	}
}

@keyframes mobileFlipPrev {
	0% {
		transform: translateX(0) rotateY(0);
		opacity: 1;
	}
	100% {
		transform: translateX(100%) rotateY(30deg);
		opacity: 0;
	}
}

/* Add perspective to book for 3D effect */
.book {
	position: relative;
	width: 700px;
	height: 450px;
	display: flex;
	perspective: 2000px;
}

.book.mobile-mode {
	perspective: 1500px;
}
/* Responsive */
@media (max-width: 900px) {
	.book {
		width: 600px;
		height: 400px;
	}
	.nav-prev {
		right: calc(50% + 320px);
	}
	.nav-next {
		left: calc(50% + 320px);
	}
}

@media (max-width: 768px) {
	.book-container {
		min-height: 500px;
		padding: 1rem;
	}

	.nav-btn {
		width: 45px;
		height: 45px;
		font-size: 1.2rem;
	}

	.nav-prev {
		right: auto;
		left: 10px;
	}

	.nav-next {
		left: auto;
		right: 10px;
	}

	.book-controls {
		gap: 0.75rem;
	}

	.control-btn {
		padding: 0.6rem 1rem;
		font-size: 0.85rem;
	}

	.speed-control {
		width: 100%;
		justify-content: center;
	}

	.lightbox-nav {
		display: none;
	}

	.page-title {
		font-size: 1.75rem;
	}
}

@media (max-width: 480px) {
	.book.mobile-mode {
		height: 400px;
	}

	.page-content {
		padding: 10px;
	}

	.image-number {
		width: 24px;
		height: 24px;
		font-size: 0.7rem;
	}

	.cover-content h2 {
		font-size: 1.25rem;
	}

	.open-book-btn {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
	}

	.thumb-btn {
		width: 32px;
		height: 32px;
		font-size: 0.8rem;
	}
}
</style>
