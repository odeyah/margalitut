<template>
	<div class="app" :class="{ 'menu-open': isMobileMenuOpen, dark: isDark }">
		<header class="header">
			<nav class="container nav-container">
				<router-link to="/" class="logo-link" @click="closeMobileMenu">
					<img :src="logo" alt="מרגליתות לוגו" class="logo-img" />
					<span class="logo-text">מרגליתות <span aria-hidden="true">🍓</span></span>
				</router-link>

				<!-- Right Side Actions -->
				<div class="nav-actions">
					<router-link v-if="englishPath" :to="englishPath" class="lang-btn" :title="isEnglishPage ? 'עברית' : 'English'">
						{{ isEnglishPage ? 'עב' : 'EN' }}
					</router-link>
					<SearchBar />
					<DarkModeToggle class="dark-toggle-desktop" />
					<CartButton />

					<button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="תפריט">
						<span class="hamburger" :class="{ active: isMobileMenuOpen }">
							<span></span>
							<span></span>
							<span></span>
						</span>
					</button>
				</div>

				<!-- Desktop Navigation -->
				<div class="nav-links-desktop">
					<router-link class="nav-link" to="/menu">תפריט</router-link>
					<router-link class="nav-link" to="/gallery">גלריה</router-link>
					<router-link class="nav-link" to="/about">אודות</router-link>
					<router-link class="nav-link" to="/my-orders">ההזמנות שלי</router-link>

					<!-- פסח - ישירות בתפריט הראשי -->
					<router-link class="nav-link nav-link-pesach" to="/Pesach">
						<span class="pesach-icon">🍷</span>
						פסח
					</router-link>

					<!-- תפריט חגים אחרים -->
					<div class="nav-dropdown">
						<span class="nav-link nav-link-dropdown">חגים 🎉</span>
						<div class="dropdown-menu">
							<router-link class="dropdown-item" to="/Purim">🎭 פורים</router-link>
						</div>
					</div>

					<router-link class="nav-link nav-link-primary" to="/quote">הצעת מחיר</router-link>
					<router-link class="nav-link" to="/faq">שאלות נפוצות</router-link>
				</div>
			</nav>
		</header>

		<!-- Mobile Menu -->
		<Transition name="slide-menu">
			<div v-if="isMobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
				<div class="mobile-menu" @click.stop>
					<router-link class="mobile-nav-link" to="/menu" @click="closeMobileMenu">תפריט</router-link>
					<router-link class="mobile-nav-link" to="/gallery" @click="closeMobileMenu">גלריה</router-link>
					<router-link class="mobile-nav-link" to="/about" @click="closeMobileMenu">אודות</router-link>
					<router-link class="mobile-nav-link" to="/my-orders" @click="closeMobileMenu">ההזמנות שלי</router-link>

					<!-- פסח - בולט במובייל -->
					<router-link class="mobile-nav-link mobile-nav-link-pesach" to="/Pesach" @click="closeMobileMenu">
						🍷 פסח
					</router-link>

					<!-- חגים במובייל -->
					<div class="mobile-nav-section">חגים 🎉</div>
					<router-link class="mobile-nav-link mobile-nav-link-sub" to="/Purim" @click="closeMobileMenu">
						🎭 פורים
					</router-link>

					<router-link class="mobile-nav-link mobile-nav-link-primary" to="/quote" @click="closeMobileMenu">
						הצעת מחיר
					</router-link>
					<router-link class="mobile-nav-link" to="/faq" @click="closeMobileMenu">שאלות נפוצות</router-link>
					<DarkModeToggle class="dark-toggle-mobile" />
				</div>
			</div>
		</Transition>

		<main class="main container">
			<router-view v-slot="{ Component, route }">
				<Transition :name="transitionName" mode="out-in">
					<component :is="Component" :key="route.path" />
				</Transition>
			</router-view>
		</main>

		<AppFooter />

		<!-- Global Components -->
		<CartDrawer />
		<NotificationToast />
		<ToastContainer />
		<WhatsAppButton />
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUIStore } from './stores/uiStore';
import { useDarkMode } from './composables/useDarkMode';
import NotificationToast from './components/ui/NotificationToast.vue';
import DarkModeToggle from './components/ui/DarkModeToggle.vue';
import AppFooter from './components/layout/AppFooter.vue';
import SearchBar from './components/ui/SearchBar.vue';
import ToastContainer from './components/ui/ToastContainer.vue';
import { CartDrawer, CartButton } from './components/cart';
import WhatsAppButton from './components/ui/WhatsAppButton.vue';
import logo from './assets/logo.png';

const route = useRoute();
const uiStore = useUIStore();
const { isDark } = useDarkMode();

const isMobileMenuOpen = computed(() => uiStore.isMobileMenuOpen);
const previousPath = ref('');
const transitionName = ref('fade');

const toggleMobileMenu = () => uiStore.toggleMobileMenu();
const closeMobileMenu = () => uiStore.closeMobileMenu();

const pagesWithEnglish = {
	'/Purim': '/Purim-en',
	'/Purim-en': '/Purim',
	'/Pesach': '/Pesach-en',
	'/Pesach-en': '/Pesach',
	'/tasting': '/tasting?lang=en',
};

const isEnglishPage = computed(() => {
	return route.path.includes('-en') || route.query.lang === 'en';
});

const englishPath = computed(() => {
	const currentPath = route.path;
	if (currentPath.includes('-en')) return currentPath.replace('-en', '');
	if (route.query.lang === 'en') return currentPath;
	if (pagesWithEnglish[currentPath]) return pagesWithEnglish[currentPath];
	return null;
});

const routeOrder = ['/', '/menu', '/gallery', '/about', '/quote', '/checkout'];

watch(
	() => route.path,
	(newPath, oldPath) => {
		const newIndex = routeOrder.indexOf(newPath);
		const oldIndex = routeOrder.indexOf(oldPath || '/');

		if (newIndex > oldIndex) transitionName.value = 'slide-left';
		else if (newIndex < oldIndex) transitionName.value = 'slide-right';
		else transitionName.value = 'fade';

		previousPath.value = oldPath;
		closeMobileMenu();
	},
);
</script>

<style>
/* Global Styles */
* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

:root {
	--bg-primary: #fff;
	--bg-secondary: #f8f9fa;
	--bg-gradient: linear-gradient(135deg, #fff5f8 0%, #fff 50%, #f8f9fa 100%);
	--text-primary: #333;
	--text-secondary: #666;
	--text-muted: #999;
	--border-color: #f0f0f0;
	--border-pink: #ffd6e7;
	--pink-primary: #d34a6e;
	--pink-secondary: #ff8fab;
	--pink-light: #fff5f8;
	--card-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
	--header-bg: rgba(255, 255, 255, 0.95);
	--pesach-gold: #c9973a;
	--pesach-light: #fdf6e3;
}

.dark {
	--bg-primary: #1a1a2e;
	--bg-secondary: #16213e;
	--bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%);
	--text-primary: #f0f0f0;
	--text-secondary: #b0b0b0;
	--text-muted: #707070;
	--border-color: #2d2d44;
	--border-pink: #4a3040;
	--pink-primary: #d34a6e;
	--pink-secondary: #ff8fab;
	--pink-light: #2d2035;
	--card-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	--header-bg: rgba(26, 26, 46, 0.95);
	--pesach-gold: #d4a843;
	--pesach-light: #2a2010;
}

body {
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	background: var(--bg-gradient);
	min-height: 100vh;
	direction: rtl;
	color: var(--text-primary);
	transition:
		background 0.3s ease,
		color 0.3s ease;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
}

a {
	color: inherit;
	text-decoration: none;
}

.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.6rem 1.2rem;
	border-radius: 10px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	border: none;
}

.btn-primary {
	background: linear-gradient(135deg, var(--pink-primary) 0%, var(--pink-secondary) 100%);
	color: white;
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

.btn-primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.btn-outline {
	background: var(--bg-primary);
	border: 2px solid var(--border-pink);
	color: var(--pink-primary);
}

.btn-outline:hover {
	background: var(--pink-light);
	border-color: var(--pink-primary);
}

.card {
	background: var(--bg-primary);
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: var(--card-shadow);
	transition:
		background 0.3s ease,
		box-shadow 0.3s ease;
}

.grid {
	display: grid;
	gap: 1.5rem;
}
.grid-2 {
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.grid-3 {
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
</style>

<style scoped>
/* Header */
.header {
	position: sticky;
	top: 0;
	background: var(--header-bg);
	backdrop-filter: blur(10px);
	box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
	z-index: 100;
	transition: background 0.3s ease;
}

.nav-container {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem 1rem;
}

.logo-link {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.logo-img {
	height: 48px;
	width: auto;
}

.logo-text {
	font-size: 1.4rem;
	font-weight: 800;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

/* Desktop Navigation */
.nav-links-desktop {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-inline-start: auto;
}

.nav-link {
	padding: 0.5rem 1rem;
	border-radius: 10px;
	font-weight: 600;
	color: var(--text-secondary);
	transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
	color: var(--pink-primary);
	background: var(--pink-light);
}

/* פסח - קישור ייחודי */
.nav-link-pesach {
	display: inline-flex;
	align-items: center;
	gap: 0.3rem;
	color: var(--pesach-gold) !important;
	background: var(--pesach-light);
	border: 1.5px solid color-mix(in srgb, var(--pesach-gold) 30%, transparent);
	font-weight: 700;
	padding: 0.45rem 0.9rem;
	border-radius: 10px;
	transition: all 0.3s ease;
}

.nav-link-pesach:hover,
.nav-link-pesach.router-link-active {
	background: var(--pesach-gold);
	color: white !important;
	border-color: var(--pesach-gold);
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(201, 151, 58, 0.3);
}

.pesach-icon {
	font-size: 1rem;
}

.nav-link-primary {
	background: linear-gradient(135deg, var(--pink-primary) 0%, var(--pink-secondary) 100%);
	color: white !important;
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

.nav-link-primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

/* Nav Actions */
.nav-actions {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.lang-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: var(--pink-light);
	color: var(--pink-primary);
	font-weight: 700;
	font-size: 0.75rem;
	transition: all 0.3s ease;
}

.lang-btn:hover {
	background: var(--pink-primary);
	color: white;
	transform: scale(1.05);
}

.dark-toggle-desktop {
	display: block;
}
.dark-toggle-mobile {
	display: none;
	margin-top: 1rem;
}

.mobile-menu-btn {
	display: none;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
}

.hamburger {
	display: flex;
	flex-direction: column;
	gap: 5px;
	width: 24px;
}

.hamburger span {
	display: block;
	height: 3px;
	background: var(--pink-primary);
	border-radius: 3px;
	transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
	transform: rotate(45deg) translate(6px, 6px);
}
.hamburger.active span:nth-child(2) {
	opacity: 0;
}
.hamburger.active span:nth-child(3) {
	transform: rotate(-45deg) translate(6px, -6px);
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 9998;
}

.mobile-menu {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	width: 280px;
	background: linear-gradient(135deg, #d34a6e 0%, #ff8fab 100%);
	padding: 100px 1.5rem 2rem;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	z-index: 9999;
	overflow-y: auto;
}

.mobile-nav-link {
	width: 100%;
	text-align: center;
	padding: 1rem 1.5rem;
	font-size: 1.1rem;
	font-weight: 700;
	color: white;
	background: rgba(255, 255, 255, 0.15);
	border-radius: 12px;
	transition: all 0.3s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
	background: rgba(255, 255, 255, 0.3);
}

/* פסח במובייל - בולט */
.mobile-nav-link-pesach {
	background: rgba(201, 151, 58, 0.4) !important;
	border: 1.5px solid rgba(255, 220, 120, 0.5);
	color: #fff5cc !important;
	font-size: 1.15rem;
}

.mobile-nav-link-pesach:hover,
.mobile-nav-link-pesach.router-link-active {
	background: rgba(201, 151, 58, 0.65) !important;
}

.mobile-nav-link-primary {
	background: white !important;
	color: #d34a6e !important;
	margin-top: 0.5rem;
}

/* Slide Menu Transition */
.slide-menu-enter-active,
.slide-menu-leave-active {
	transition: all 0.3s ease;
}
.slide-menu-enter-from,
.slide-menu-leave-to {
	opacity: 0;
}
.slide-menu-enter-from .mobile-menu,
.slide-menu-leave-to .mobile-menu {
	transform: translateX(100%);
}

/* Main Content */
.main {
	padding: 1.5rem 1rem 3rem;
	min-height: calc(100vh - 200px);
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
	transition: all 0.4s ease;
}

.slide-left-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}
.slide-left-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
.slide-right-enter-from {
	opacity: 0;
	transform: translateX(30px);
}
.slide-right-leave-to {
	opacity: 0;
	transform: translateX(-30px);
}

/* ========== Mobile Responsive ========== */
@media (max-width: 768px) {
	.nav-links-desktop {
		display: none;
	}
	.mobile-menu-btn {
		display: block;
	}
	.dark-toggle-desktop {
		display: none;
	}
	.dark-toggle-mobile {
		display: flex;
		justify-content: center;
	}
	.nav-actions {
		margin-inline-start: auto;
		gap: 0.25rem;
	}
	.logo-text {
		font-size: 1.1rem;
	}
	.logo-img {
		height: 40px;
	}
	.lang-btn {
		width: 30px;
		height: 30px;
		font-size: 0.65rem;
	}
	.app.menu-open {
		overflow: hidden;
	}
}

@media (max-width: 400px) {
	.nav-actions {
		gap: 0.15rem;
	}
	.logo-text {
		font-size: 1rem;
	}
	.logo-img {
		height: 36px;
	}
}

/* ========== Dark Mode ========== */
.dark .mobile-menu {
	background: linear-gradient(135deg, #2d2035 0%, #1a1a2e 100%);
}

.dark .mobile-nav-link {
	background: rgba(255, 255, 255, 0.1);
}

.dark .mobile-nav-link:hover,
.dark .mobile-nav-link.router-link-active {
	background: rgba(255, 255, 255, 0.2);
}

.dark .mobile-nav-link-primary {
	background: #d34a6e !important;
	color: white !important;
}

/* Dropdown Menu */
.nav-dropdown {
	position: relative;
}
.nav-link-dropdown {
	cursor: pointer;
}

.dropdown-menu {
	position: absolute;
	top: 100%;
	right: 0;
	background: var(--bg-primary);
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	padding: 0.5rem;
	min-width: 150px;
	opacity: 0;
	visibility: hidden;
	transform: translateY(10px);
	transition: all 0.3s ease;
	z-index: 200;
}

.nav-dropdown:hover .dropdown-menu {
	opacity: 1;
	visibility: visible;
	transform: translateY(0);
}

.dropdown-item {
	display: block;
	padding: 0.75rem 1rem;
	border-radius: 8px;
	font-weight: 600;
	color: var(--text-secondary);
	transition: all 0.2s ease;
}

.dropdown-item:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

/* Mobile Sections */
.mobile-nav-section {
	width: 100%;
	text-align: center;
	padding: 0.75rem 1rem;
	font-size: 0.9rem;
	font-weight: 700;
	color: rgba(255, 255, 255, 0.7);
	margin-top: 0.5rem;
	border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-nav-link-sub {
	background: rgba(255, 255, 255, 0.1) !important;
	font-size: 1rem;
	padding: 0.75rem 1.5rem;
}

.mobile-nav-link-sub:hover,
.mobile-nav-link-sub.router-link-active {
	background: rgba(255, 255, 255, 0.25) !important;
}
</style>
