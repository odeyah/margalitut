<template>
  <div>
    <header class="sticky">
      <nav class="container" style="display:flex; align-items:center; gap:1rem; padding:.6rem 0;">
        <img :src="logo" alt="מרגליתות לוגו" style="height:48px; width:auto;" />
        <router-link to="/" style="font-size:1.4rem; font-weight:800;">
          מרגליתות <span aria-hidden="true">🍓</span>
        </router-link>
        <div style="margin-inline-start:auto; display:flex; gap:.8rem; flex-wrap:wrap;">
          <router-link class="btn btn-outline" to="/menu">תפריט</router-link>
          <router-link class="btn btn-outline" to="/gallery">גלריה</router-link>
          <router-link class="btn btn-outline" to="/about">אודות</router-link>
          <router-link class="btn btn-primary" to="/quote">בקשת הצעת מחיר</router-link>
        </div>
      </nav>
    </header>

    <main class="container" style="padding:1.25rem 1rem 3rem;">
      <router-view />
    </main>

    <footer class="container" style="padding:2rem 1rem 3rem; text-align:center; opacity:.9;">
      <div style="font-weight:700;">מרגליתות • מאפייה ביתית</div>
      <div>אפשרות כשרות | עוגות ועוגיות לפי הזמנה</div>
      <div style="margin-top:.5rem;">טלפון: <a href="tel:0528460331">052-846-0331</a></div>
    </footer>
  </div>
</template>

<script setup>
import logo from './assets/logo.png'
</script>
