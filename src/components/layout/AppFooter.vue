<template>
	<footer class="footer">
		<!-- Wave Decoration -->
		<div class="footer-wave">
			<svg viewBox="0 0 1200 120" preserveAspectRatio="none">
				<path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
			</svg>
		</div>

		<div class="footer-content">
			<div class="container">
				<div class="footer-grid">
					<!-- Brand Section -->
					<div class="footer-section brand-section">
						<div class="brand">
							<span class="brand-logo">🍓</span>
							<span class="brand-name">מרגליתות</span>
						</div>
						<p class="brand-description">מאפייה ביתית עם אהבה למתוק ולחלבי. כל מוצר נאפה בעבודת יד מחומרי גלם איכותיים.</p>
						<div class="social-links">
							<a
								href="https://www.facebook.com/Margalitut/"
								target="_blank"
								class="social-link facebook"
								aria-label="פייסבוק"
							>
								<span class="social-icon">📘</span>
							</a>
							<a href="https://wa.me/972528460331" target="_blank" class="social-link whatsapp" aria-label="וואטסאפ">
								<span class="social-icon">💬</span>
							</a>
						</div>
					</div>

					<!-- Quick Links -->
					<div class="footer-section">
						<h4>ניווט מהיר</h4>
						<nav class="footer-nav">
							<router-link to="/">דף הבית</router-link>
							<router-link to="/menu">תפריט</router-link>
							<router-link to="/gallery">גלריה</router-link>
							<router-link to="/about">אודות</router-link>
							<router-link to="/my-orders">ההזמנות שלי</router-link>
							<router-link to="/quote">הצעת מחיר</router-link>
							<router-link to="/faq">שאלות נפוצות</router-link>
						</nav>
					</div>

					<!-- Contact Info -->
					<div class="footer-section">
						<h4 class="section-title">יצירת קשר</h4>
						<div class="contact-list">
							<a href="tel:0528460331" class="contact-item">
								<span class="contact-icon">📱</span>
								<span>052-846-0331</span>
							</a>
							<a href="mailto:margalitut@email.com" class="contact-item">
								<span class="contact-icon">✉️</span>
								<span>margalitut@email.com</span>
							</a>
							<div class="contact-item">
								<span class="contact-icon">📍</span>
								<span>בית שמש, ישראל</span>
							</div>
						</div>
					</div>

					<!-- Hours & Kosher -->
					<div class="footer-section">
						<h4 class="section-title">שעות פעילות</h4>
						<div class="hours-list">
							<div class="hours-item">
								<span class="day">ראשון - חמישי</span>
								<span class="time">09:00 - 19:00</span>
							</div>
							<div class="hours-item">
								<span class="day">שישי</span>
								<span class="time">09:00 - 14:00</span>
							</div>
							<div class="hours-item closed">
								<span class="day">שבת</span>
								<span class="time">סגור</span>
							</div>
						</div>
						<div class="kosher-badge">
							<span class="badge-icon">✡️</span>
							<span class="badge-text">כל הרכיבים בכשרות מהדרין</span>
						</div>
					</div>
				</div>

				<!-- Newsletter -->
				<div class="newsletter-section">
					<div class="newsletter-content">
						<div class="newsletter-text">
							<h4>הישארו מעודכנים!</h4>
							<p>הירשמו לקבלת עדכונים על מבצעים ומוצרים חדשים</p>
						</div>
						<form class="newsletter-form" @submit.prevent="handleSubscribe">
							<input type="email" v-model="email" placeholder="האימייל שלכם" class="newsletter-input" required />
							<button type="submit" class="newsletter-btn" :disabled="isSubscribing">
								{{ isSubscribing ? '...' : 'הרשמה' }}
							</button>
						</form>
					</div>
				</div>

				<!-- Bottom Bar -->
				<div class="footer-bottom">
					<div class="copyright">© {{ currentYear }} מרגליתות. כל הזכויות שמורות.</div>
					<div class="bottom-links">
						<a href="#" class="bottom-link">מדיניות פרטיות</a>
						<span class="separator">•</span>
						<a href="#" class="bottom-link">תנאי שימוש</a>
						<span class="separator">•</span>
						<a href="#" class="bottom-link">נגישות</a>
					</div>
					<div class="made-with">נבנה עם 💖 בישראל</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUIStore } from '../../stores/uiStore';

const uiStore = useUIStore();
const email = ref('');
const isSubscribing = ref(false);

const currentYear = computed(() => new Date().getFullYear());

const handleSubscribe = async () => {
	if (!email.value) return;

	isSubscribing.value = true;

	// Simulate API call
	await new Promise(resolve => setTimeout(resolve, 1000));

	uiStore.showSuccess('תודה! נרשמת בהצלחה לניוזלטר 🎉');
	email.value = '';
	isSubscribing.value = false;
};
</script>

<style scoped>
.footer {
	position: relative;
	margin-top: 4rem;
}

/* Wave Decoration */
.footer-wave {
	position: absolute;
	top: -60px;
	left: 0;
	right: 0;
	height: 60px;
	overflow: hidden;
}

.footer-wave svg {
	width: 100%;
	height: 100%;
	fill: var(--pink-light);
}

/* Footer Content */
.footer-content {
	background: var(--pink-light);
	padding: 3rem 0 0;
	transition: background 0.3s ease;
}

.footer-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 2.5rem;
	padding-bottom: 2.5rem;
	border-bottom: 1px solid var(--border-pink);
}

/* Brand Section */
.brand-section {
	max-width: 280px;
}

.brand {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.brand-logo {
	font-size: 2rem;
}

.brand-name {
	font-size: 1.5rem;
	font-weight: 800;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.brand-description {
	color: var(--text-secondary);
	font-size: 0.95rem;
	line-height: 1.6;
	margin-bottom: 1.25rem;
}

/* Social Links */
.social-links {
	display: flex;
	gap: 0.75rem;
}

.social-link {
	width: 42px;
	height: 42px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-primary);
	border-radius: 12px;
	transition: all 0.3s ease;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.social-link:hover {
	transform: translateY(-3px);
	box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
}

.social-link.facebook:hover {
	background: #1877f2;
}

.social-link.facebook:hover .social-icon {
	filter: brightness(10);
}

.social-link.whatsapp:hover {
	background: #25d366;
}

.social-link.whatsapp:hover .social-icon {
	filter: brightness(10);
}

.social-icon {
	font-size: 1.25rem;
}

/* Section Titles */
.section-title {
	font-size: 1.1rem;
	font-weight: 700;
	color: var(--text-primary);
	margin-bottom: 1.25rem;
	position: relative;
	padding-bottom: 0.5rem;
}

.section-title::after {
	content: '';
	position: absolute;
	bottom: 0;
	right: 0;
	width: 40px;
	height: 3px;
	background: linear-gradient(90deg, var(--pink-primary), var(--pink-secondary));
	border-radius: 2px;
}

/* Footer Nav */
.footer-nav {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.footer-link {
	color: var(--text-secondary);
	font-size: 0.95rem;
	transition: all 0.3s ease;
	display: inline-flex;
	align-items: center;
}

.footer-link::before {
	content: '←';
	margin-left: 0.5rem;
	opacity: 0;
	transform: translateX(5px);
	transition: all 0.3s ease;
}

.footer-link:hover {
	color: var(--pink-primary);
}

.footer-link:hover::before {
	opacity: 1;
	transform: translateX(0);
}

/* Contact List */
.contact-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.contact-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	color: var(--text-secondary);
	font-size: 0.95rem;
	transition: color 0.3s ease;
}

a.contact-item:hover {
	color: var(--pink-primary);
}

.contact-icon {
	font-size: 1.1rem;
}

/* Hours List */
.hours-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin-bottom: 1.25rem;
}

.hours-item {
	display: flex;
	justify-content: space-between;
	font-size: 0.9rem;
}

.hours-item .day {
	color: var(--text-secondary);
}

.hours-item .time {
	font-weight: 600;
	color: var(--text-primary);
}

.hours-item.closed .time {
	color: #e74c3c;
}

/* Kosher Badge */
.kosher-badge {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.6rem 1rem;
	background: linear-gradient(135deg, #fff9e6, #fff5d6);
	border: 2px solid #ffd700;
	border-radius: 25px;
	font-size: 0.9rem;
	font-weight: 600;
	color: #8b6914;
	box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
}

.dark .kosher-badge {
	background: linear-gradient(135deg, #3d3520, #2d2815);
	border-color: #b8960b;
	color: #ffd700;
}

.badge-icon {
	font-size: 1.1rem;
}

/* Newsletter Section */
.newsletter-section {
	padding: 2rem 0;
	border-bottom: 1px solid var(--border-pink);
}

.newsletter-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 2rem;
	flex-wrap: wrap;
}

.newsletter-text h4 {
	font-size: 1.2rem;
	font-weight: 700;
	color: var(--text-primary);
	margin-bottom: 0.25rem;
}

.newsletter-text p {
	color: var(--text-secondary);
	font-size: 0.9rem;
}

.newsletter-form {
	display: flex;
	gap: 0.75rem;
	flex: 1;
	max-width: 400px;
}

.newsletter-input {
	flex: 1;
	padding: 0.75rem 1rem;
	border: 2px solid var(--border-pink);
	border-radius: 12px;
	background: var(--bg-primary);
	font-size: 1rem;
	color: var(--text-primary);
	transition: all 0.3s ease;
}

.newsletter-input:focus {
	outline: none;
	border-color: var(--pink-primary);
}

.newsletter-input::placeholder {
	color: var(--text-muted);
}

.newsletter-btn {
	padding: 0.75rem 1.5rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border: none;
	border-radius: 12px;
	font-weight: 600;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
	white-space: nowrap;
}

.newsletter-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
}

.newsletter-btn:disabled {
	opacity: 0.7;
	cursor: wait;
}

/* Footer Bottom */
.footer-bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 1rem;
	padding: 1.5rem 0;
}

.copyright {
	color: var(--text-secondary);
	font-size: 0.9rem;
}

.bottom-links {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.bottom-link {
	color: var(--text-secondary);
	font-size: 0.85rem;
	transition: color 0.3s ease;
}

.bottom-link:hover {
	color: var(--pink-primary);
}

.separator {
	color: var(--text-muted);
	font-size: 0.75rem;
}

.made-with {
	color: var(--text-secondary);
	font-size: 0.9rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
	.footer-grid {
		grid-template-columns: 1fr;
		text-align: center;
	}

	.brand-section {
		max-width: 100%;
	}

	.brand {
		justify-content: center;
	}

	.social-links {
		justify-content: center;
	}

	.section-title::after {
		right: 50%;
		transform: translateX(50%);
	}

	.footer-nav {
		align-items: center;
	}

	.contact-list {
		align-items: center;
	}

	.hours-item {
		justify-content: center;
		gap: 1rem;
	}

	.kosher-badge {
		margin: 0 auto;
	}

	.newsletter-content {
		flex-direction: column;
		text-align: center;
	}

	.newsletter-form {
		width: 100%;
		max-width: 100%;
		flex-direction: column;
	}

	.newsletter-btn {
		width: 100%;
	}

	.footer-bottom {
		flex-direction: column;
		text-align: center;
	}
}
</style>
