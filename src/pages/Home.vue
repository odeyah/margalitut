<template>
  <section class="card" style="display:grid; gap:1rem; align-items:center;">
    <div>
      <h1 style="margin:0 0 .4rem 0; font-size:2rem;">ברוכים הבאים למרגליתות 🍓</h1>
      <p style="margin:0 0 1rem 0;">
        מאפייה ביתית עם אהבה למתוק ולחלבי: עוגות, עוגיות, פיצה פאי, קישים וסלטים —
        הכול טרי, נקי וטעים.
      </p>
      <div style="display:flex; gap:.6rem; flex-wrap:wrap;">
        <router-link to="/menu" class="btn btn-primary">לתפריט</router-link>
        <router-link to="/gallery" class="btn btn-outline">לגלריה</router-link>
      </div>
    </div>
    <img :src="hero" alt="קאפקייק תות" style="width:180px; margin-inline:auto;" />
  </section>
</template>

<script setup>
import hero from '../assets/logo.png'
</script>
