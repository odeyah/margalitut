<template>
	<div class="book card">
		<div class="page" v-for="(img, i) in images" :key="i" :class="{ active: i === index }">
			<img :src="img" :alt="'עמוד ' + (i + 1)" />
		</div>
		<div class="controls">
			<button class="btn btn-outline" @click="prev" :disabled="index === 0">עמוד קודם</button>
			<span>{{ index + 1 }} / {{ images.length }}</span>
			<button class="btn btn-primary" @click="next" :disabled="index === images.length - 1">עמוד הבא</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import g1 from '/gallery/gallery1.jpg';
import g2 from '/gallery/gallery2.jpg';
import g3 from '/gallery/gallery3.jpg';
import g4 from '/gallery/gallery4.jpg';
import g5 from '/gallery/gallery5.jpg';
import g6 from '/gallery/gallery6.jpg';
import g7 from '/gallery/gallery7.jpg';
import g8 from '/gallery/gallery8.jpg';
import g9 from '/gallery/gallery9.jpg';
import g10 from '/gallery/gallery10.jpg';
import g11 from '/gallery/gallery11.jpg';
import g12 from '/gallery/gallery12.jpg';
import g13 from '/gallery/gallery13.jpg';
import g14 from '/gallery/gallery14.jpg';
import g15 from '/gallery/gallery15.jpg';
import g16 from '/gallery/gallery16.jpg';
import g17 from '/gallery/gallery17.jpg';
import g18 from '/gallery/gallery18.jpg';
import g19 from '/gallery/gallery19.jpg';
import g20 from '/gallery/gallery20.jpg';
import g21 from '/gallery/gallery21.jpg';
import g22 from '/gallery/gallery22.jpg';
import g23 from '/gallery/gallery23.jpg';
import g24 from '/gallery/gallery24.jpg';
import g25 from '/gallery/gallery25.jpg';
import g26 from '/gallery/galleryPesach.jpg';
import g80 from '/gallery/gallery80.jpg';
import g100 from '/gallery/gallery100.jpg';

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
const index = ref(0);
const prev = () => (index.value = Math.max(0, index.value - 1));
const next = () => (index.value = Math.min(images.length - 1, index.value + 1));
</script>

<style scoped>
.book {
	display: grid;
	gap: 0.8rem;
}
.page {
	position: relative;
	height: 420px;
	overflow: hidden;
	perspective: 1000px;
	border-radius: 16px;
}
.page img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	transform-origin: left;
	transition:
		transform 0.6s ease,
		box-shadow 0.6s ease;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}
.page:not(.active) img {
	transform: rotateY(-12deg) scale(0.98);
	filter: saturate(0.9) brightness(0.95);
}
.controls {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.8rem;
}
</style>
