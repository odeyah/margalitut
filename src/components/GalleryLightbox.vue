<template>
	<div>
		<div class="grid grid-3">
			<button v-for="(item, i) in images" :key="i" class="card gallery-card" @click="open(i)">
				<img :src="item.src" :alt="item.alt" class="gallery-img" />
				<p class="gallery-title">{{ item.title }}</p>
			</button>
		</div>

		<div v-if="active !== null" class="overlay" @click.self="active = null">
			<button class="nav" @click.stop="prev">‹</button>
			<div class="lightbox-content">
				<img :src="images[active].src" :alt="images[active].alt" />
				<p class="image-title">{{ images[active].title }}</p>
				<p v-if="images[active].description" class="image-description">{{ images[active].description }}</p>
			</div>
			<button class="nav" @click.stop="next">›</button>
			<button class="close" @click="active = null">×</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import g1 from '/gallery/gallary1.jpg';
import g2 from '/gallery/gallery2.jpeg';
import g3 from '/gallery/gallery3.jpeg';
import g4 from '/gallery/gallery4.jpeg';
import g5 from '/gallery/gallery5.jpg';
import g6 from '/gallery/gallery6.jpeg';
import g7 from '/gallery/gallery7.jpeg';
import g8 from '/gallery/gallery8.jpg';
import g9 from '/gallery/gallery9.jpeg';
import g10 from '/gallery/gallery10.jpeg';
import g11 from '/gallery/gallery11.jpeg';
import g12 from '/gallery/gallery12.jpeg';
import g13 from '/gallery/gallery13.jpeg';
import g14 from '/gallery/gallery14.jpeg';
import g15 from '/gallery/gallery15.jpeg';
import g16 from '/gallery/gallery16.jpeg';
import g17 from '/gallery/gallery17.jpeg';
import g18 from '/gallery/gallery18.jpeg';
import g19 from '/gallery/gallery19.jpeg';
import g20 from '/gallery/gallery20.jpeg';
import g21 from '/gallery/gallery21.jpeg';
import g22 from '/gallery/gallery22.jpeg';
import g23 from '/gallery/gallery23.jpeg';
import g24 from '/gallery/gallery24.jpeg';
import g25 from '/gallery/gallery25.jpg';
import g26 from '/gallery/galleryPesach.jpeg';
import g80 from '/gallery/gallery80.jpeg';
import g100 from '/gallery/gallery100.jpeg';

const images = [
	{
		src: g1,
		title: 'השולחן שלנו לפני שיוצאים למכירה',
		alt: 'שולחן מכירה של מרגליתות עם מוצרי אפייה ביתיים | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'הצצה לשולחן המכירה של מרגליתות לפני היציאה — מוצרים טריים ביתיים מוכנים ליום',
	},
	{
		src: g2,
		title: 'עוגת פאדג׳ מעוצבת',
		alt: 'עוגת פאדג׳ שוקולד מעוצבת | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'עוגת פאדג׳ שוקולד עשירה ומעוצבת בעבודת יד, מושלמת לאירועים מיוחדים',
	},
	{
		src: g3,
		title: 'כדורי גבינה בציפוי שוקולד',
		alt: 'כדורי גבינה בציפוי שוקולד ביתיים | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'כדורי גבינה קרמיים בציפוי שוקולד בלגי, קינוח ביתי עדין ומפנק',
	},
	{
		src: g4,
		title: 'קולאז׳ 1',
		alt: 'קולאז׳ מוצרי אפייה ביתיים | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'מבחר מוצרים ביתיים של מרגליתות — עוגות, מאפים וקינוחים לכל אירוע',
	},
	{
		src: g5,
		title: 'השולחן שלנו בהכנות לפני מכירה',
		alt: 'הכנות לפני מכירה במרגליתות | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'מאחורי הקלעים — הכנת השולחן לפני יום המכירה עם כל המוצרים הטריים',
	},
	{
		src: g6,
		title: 'עוגת יום הולדת דובי',
		alt: 'עוגת יום הולדת דובי מעוצבת לילדים | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'עוגת יום הולדת בעיצוב דובי מתוק, מוכנת בהתאמה אישית לילדים',
	},
	{
		src: g7,
		title: 'קולאז׳ פיצה שמרים ועוגיות',
		alt: 'פיצה ביתית שמרים ועוגיות | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'מגוון מוצרי מרגליתות — פיצה חלבית, מאפי שמרים ועוגיות ביתיות',
	},
	{
		src: g8,
		title: 'מגוון עוגיות למכירה',
		alt: 'מגוון עוגיות ביתיות למכירה | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'מבחר עוגיות ביתיות בטעמים ובעיצובים שונים, מוכנות בעבודת יד בכשרות בד"ץ',
	},
	{
		src: g9,
		title: 'עוגת גבינה פירות יער בצורת לב',
		alt: 'עוגת גבינה פירות יער בצורת לב | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'עוגת גבינה קרמית עם פירות יער טריים בעיצוב לב, מושלמת להפתעה',
	},
	{
		src: g10,
		title: 'חלת מפתח לכבוד שבת שאחרי פסח',
		alt: 'חלת מפתח ביתית לשבת שאחרי פסח | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'חלת מפתח מסורתית לשבת שאחרי פסח, נאפית בעבודת יד ברכות ואהבה',
	},
	{
		src: g11,
		title: 'מיקס עוגיות',
		alt: 'מיקס עוגיות ביתיות | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'מיקס עוגיות ביתיות בטעמים מגוונים, מושלם למשלוח מנות ולמתנות',
	},
	{
		src: g12,
		title: 'קולאז׳ שמרים',
		alt: 'קולאז׳ מאפי שמרים ביתיים | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'מגוון מאפי שמרים ביתיים — בובקות, רוגלך, שושנים ועוד',
	},
	{
		src: g13,
		title: 'עוגת בר מצווה',
		alt: 'עוגת בר מצווה מעוצבת | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'עוגת בר מצווה מעוצבת בהתאמה אישית, בעיצוב ייחודי לאירוע המיוחד',
	},
	{
		src: g14,
		title: 'פיצה ללא גלוטן',
		alt: 'פיצה ביתית ללא גלוטן | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'פיצה חלבית ביתית ללא גלוטן, טרייה וטעימה לרגישים לגלוטן',
	},
	{
		src: g15,
		title: 'פיצה מרגליתות',
		alt: 'פיצה חלבית ביתית מרגליתות | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'פיצה חלבית ביתית של מרגליתות עם בצק ביתי ורוטב טרי, בכשרות בד"ץ',
	},
	{
		src: g16,
		title: 'קולאז׳ שבועות',
		alt: 'מוצרי חג שבועות ביתיים | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'מגוון מוצרים חלביים מיוחדים לחג השבועות — עוגות גבינה, קינוחים ומאפים',
	},
	{
		src: g17,
		title: 'שבלול מנגולד גבינות',
		alt: 'שבלול מנגולד וגבינות ביתי | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'שבלול ביתי עם מילוי מנגולד טרי וגבינות, מאפה חלבי עשיר ומיוחד',
	},
	{
		src: g18,
		title: 'אירוע טעימות של מרגליתות',
		alt: 'אירוע טעימות מרגליתות | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'אירוע טעימות מיוחד של מרגליתות — הזדמנות לטעום מכל הטוב שיש',
	},
	{
		src: g19,
		title: 'ספינג לכבוד חנוכה',
		alt: 'ספינג חנוכה ביתי | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'ספינג אוורירי וחגיגי לכבוד חנוכה, מסורת מתוקה שמלווה את המשפחה',
	},
	{
		src: g20,
		title: 'אירוע טעימות של מרגליתות 2',
		alt: 'אירוע טעימות מרגליתות | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'עוד הצצה לאירוע הטעימות של מרגליתות — שפע מוצרים ביתיים טריים',
	},
	{
		src: g21,
		title: 'השולחן של מרגליתות לפני שיוצאים למכירה',
		alt: 'שולחן מכירה מרגליתות | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'השולחן המוכן של מרגליתות לפני יציאה למכירה — עמוס במוצרים טריים',
	},
	{
		src: g22,
		title: 'שולחן המכירה של מרגליתות',
		alt: 'שולחן המכירה של מרגליתות | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'שולחן המכירה של מרגליתות — מבחר עשיר של מוצרי אפייה ביתיים טריים',
	},
	{
		src: g23,
		title: 'חלות לכבוד שבת',
		alt: 'חלות שבת ביתיות | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'חלות שבת ביתיות רכות ואווריריות, נאפות בכל שבוע בטריות ואהבה',
	},
	{
		src: g24,
		title: 'גלידות במגוון טעמים',
		alt: 'גלידות ביתיות במגוון טעמים | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'גלידות ביתיות קרמיות במגוון טעמים, מוכנות עם חומרי גלם טבעיים',
	},
	{
		src: g25,
		title: 'עוגת גבינה גבוהה מעוצבת',
		alt: 'עוגת גבינה גבוהה מעוצבת | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'עוגת גבינה גבוהה ומרשימה בעיצוב אלגנטי, מושלמת לאירועים ולחגים',
	},
	{
		src: g26,
		title: 'קולאז׳ ללא גלוטן או לפסח',
		alt: 'מוצרים ללא גלוטן ולפסח | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'מגוון מוצרים ללא גלוטן ומוצרי פסח כשרים, בכשרות בד"ץ לכל המשפחה',
	},
	{
		src: g80,
		title: 'משלוח מנות לפורים',
		alt: 'משלוח מנות פורים ביתי | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'משלוח מנות לפורים עם עוגיות ומאפים ביתיים, ארוז בצורה חגיגית ומיוחדת',
	},
	{
		src: g100,
		title: 'שולחן המכירה של מרגליתות',
		alt: 'שולחן המכירה של מרגליתות | מרגליתות 🍓 – אפייה ביתית בבית שמש',
		description: 'שולחן המכירה של מרגליתות עמוס במוצרים ביתיים טריים לכל טעם',
	},
];

const active = ref(null);
const open = i => (active.value = i);
const prev = () => (active.value = (active.value + images.length - 1) % images.length);
const next = () => (active.value = (active.value + 1) % images.length);
</script>

<style scoped>
.gallery-card {
	padding: 0;
	display: flex;
	flex-direction: column;
	cursor: pointer;
	background: var(--bg-primary);
}

.gallery-img {
	display: block;
	width: 100%;
	border-radius: 14px 14px 0 0;
}

.gallery-title {
	padding: 0.6rem 0.75rem;
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--text-primary);
	text-align: center;
	margin: 0;
}

.overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.65);
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	justify-items: center;
	padding: 1rem;
	z-index: 100;
	gap: 1rem;
}

.overlay img {
	max-width: 90vw;
	max-height: 70vh;
	border-radius: 12px;
}

.lightbox-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}

.image-title {
	font-size: 1.1rem;
	font-weight: 700;
	color: white;
	text-align: center;
	margin: 0;
}

.image-description {
	font-size: 0.9rem;
	color: rgba(255, 255, 255, 0.85);
	text-align: center;
	margin: 0;
	max-width: 500px;
	font-weight: 400;
}

.nav {
	background: white;
	border: none;
	font-size: 2rem;
	padding: 0.5rem 0.8rem;
	border-radius: 12px;
	cursor: pointer;
}

.close {
	position: absolute;
	top: 12px;
	inset-inline-start: 12px;
	background: white;
	border: none;
	font-size: 1.6rem;
	border-radius: 12px;
	padding: 0.2rem 0.6rem;
	cursor: pointer;
}
</style>
