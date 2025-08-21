<template>
  <div>
    <div class="grid grid-3">
      <button v-for="(img, i) in images" :key="i" class="card" @click="open(i)" style="padding:0;">
        <img :src="img" :alt="'תמונה '+(i+1)" style="display:block; width:100%; border-radius:14px;">
      </button>
    </div>

    <div v-if="active !== null" class="overlay" @click.self="active=null">
      <button class="nav" @click.stop="prev">‹</button>
      <img :src="images[active]" :alt="'תמונה מוגדלת '+(active+1)">
      <button class="nav" @click.stop="next">›</button>
      <button class="close" @click="active=null">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import g1 from '../assets/gallery/1.jpg'
import g2 from '../assets/gallery/2.jpg'
import g3 from '../assets/gallery/3.jpg'
import g4 from '../assets/gallery/4.jpg'
import g5 from '../assets/gallery/5.jpg'
import g6 from '../assets/gallery/6.jpg'

const images = [g1,g2,g3,g4,g5,g6]
const active = ref(null)
const open = (i) => active.value = i
const prev = () => active.value = (active.value + images.length - 1) % images.length
const next = () => active.value = (active.value + 1) % images.length
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.65);
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; justify-items:center;
  padding: 1rem; z-index: 100;
}
.overlay img { max-width: 90vw; max-height: 85vh; border-radius: 12px; }
.nav { background: white; border: none; font-size: 2rem; padding: .5rem .8rem; border-radius: 12px; cursor: pointer; }
.close { position: absolute; top: 12px; inset-inline-start: 12px; background: white; border: none; font-size: 1.6rem; border-radius: 12px; padding: .2rem .6rem; cursor: pointer; }
</style>
