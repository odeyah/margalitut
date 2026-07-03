<template>
	<div>
		<div class="grid grid-3">
			<button v-for="(img, i) in images" :key="i" class="card" @click="open(i)" style="padding: 0">
				<img :src="img" :alt="'תמונה ' + (i + 1)" style="display: block; width: 100%; border-radius: 14px" />
			</button>
		</div>

		<div v-if="active !== null" class="overlay" @click.self="active = null">
			<button class="nav" @click.stop="prev">‹</button>
			<img :src="images[active]" :alt="'תמונה מוגדלת ' + (active + 1)" />
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
	g1,
	g2,
	g3,
	g4,
	g5,
	g6,
	g7,
	g8,
	g9,
	g10,
	g11,
	g12,
	g13,
	g14,
	g15,
	g16,
	g17,
	g18,
	g19,
	g20,
	g21,
	g22,
	g23,
	g24,
	g25,
	g26,
	g80,
	g100,
];

const active = ref(null);
const open = i => (active.value = i);
const prev = () => (active.value = (active.value + images.length - 1) % images.length);
const next = () => (active.value = (active.value + 1) % images.length);
</script>

<style scoped>
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
}
.overlay img {
	max-width: 90vw;
	max-height: 85vh;
	border-radius: 12px;
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
