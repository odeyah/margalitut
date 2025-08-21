<template>
  <div class="book card">
    <div class="page" v-for="(img, i) in images" :key="i" :class="{active: i === index}">
      <img :src="img" :alt="'עמוד '+(i+1)" />
    </div>
    <div class="controls">
      <button class="btn btn-outline" @click="prev" :disabled="index===0">עמוד קודם</button>
      <span>{{ index+1 }} / {{ images.length }}</span>
      <button class="btn btn-primary" @click="next" :disabled="index===images.length-1">עמוד הבא</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import g1 from '../assets/gallery/1.jpg'
import g2 from '../assets/gallery/2.jpg'
import g3 from '../assets/gallery/3.jpg'
import g4 from '../assets/gallery/4.jpg'

const images = [g1,g2,g3,g4]
const index = ref(0)
const prev = () => index.value = Math.max(0, index.value - 1)
const next = () => index.value = Math.min(images.length - 1, index.value + 1)
</script>

<style scoped>
.book { display: grid; gap: .8rem; }
.page {
  position: relative; height: 420px; overflow: hidden;
  perspective: 1000px; border-radius: 16px;
}
.page img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transform-origin: left;
  transition: transform .6s ease, box-shadow .6s ease;
  box-shadow: 0 10px 25px rgba(0,0,0,.08);
}
.page:not(.active) img { transform: rotateY(-12deg) scale(.98); filter: saturate(.9) brightness(.95); }
.controls { display: flex; align-items: center; justify-content: center; gap: .8rem; }
</style>
