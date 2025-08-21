<template>
  <section class="card">
    <div style="display:flex; gap:.5rem; justify-content:center; margin-bottom:1rem;">
      <button class="btn" :class="mode==='lightbox' ? 'btn-primary':'btn-outline'" @click="mode='lightbox'">גלריה</button>
      <button class="btn" :class="mode==='flipbook' ? 'btn-primary':'btn-outline'" @click="mode='flipbook'">Flipbook</button>
    </div>
    <GalleryLightbox v-if="mode==='lightbox'" />
    <GalleryFlipbook v-else />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import GalleryLightbox from '../components/GalleryLightbox.vue'
import GalleryFlipbook from '../components/GalleryFlipbook.vue'
const mode = ref('lightbox')
</script>
