<template>
  <section class="card" style="max-width:720px; margin:0 auto;">
    <h2 style="margin-top:0;">בקשת הצעת מחיר</h2>
    <form @submit.prevent="submit">
      <div class="grid grid-2">
        <label class="card">
          שם מלא
          <input v-model="form.name" required placeholder="שם פרטי ומשפחה" />
        </label>
        <label class="card">
          טלפון
          <input v-model="form.phone" required placeholder="050-0000000" />
        </label>
      </div>
      <div class="grid grid-2">
        <label class="card">
          אימייל
          <input type="email" v-model="form.email" required placeholder="you@example.com" />
        </label>
        <label class="card">
          תאריך מבוקש (לא חובה)
          <input type="date" v-model="form.date" />
        </label>
      </div>
      <label class="card">
        מוצרים מבוקשים
        <select v-model="form.items" multiple size="6">
          <option>עוגת תות גבינה</option>
          <option>עוגת שוקולד</option>
          <option>עוגיות שוקולד צ'יפס</option>
          <option>פיצה פאי</option>
          <option>קיש תרד</option>
          <option>סלט יווני</option>
        </select>
      </label>
      <label class="card">
        הודעה
        <textarea v-model="form.message" rows="4" placeholder="הערות, כמויות, אלרגיות וכו'"></textarea>
      </label>

      <div style="display:flex; gap:.6rem; align-items:center;">
        <button class="btn btn-primary" :disabled="loading">{{ loading ? 'שולח…' : 'שליחה' }}</button>
        <span v-if="success" style="color:green;">הבקשה נשלחה! נחזור אליך עם הצעת מחיר.</span>
        <span v-if="error" style="color:crimson;">שגיאה בשליחה. נסה שוב.</span>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

// TODO: החליף לכתובת ה-Web App שלך מ-Google Apps Script
const GAS_WEB_APP_URL = 'PASTE_YOUR_APPS_SCRIPT_WEBAPP_URL_HERE'

const form = reactive({
  name: '',
  phone: '',
  email: '',
  date: '',
  items: [],
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref(false)

const submit = async () => {
  loading.value = true; success.value = false; error.value = false
  try {
    const res = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (!res.ok) throw new Error('Bad status')
    success.value = true
    // איפוס חלקי
    form.message = ''
  } catch (e) {
    error.value = true
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
input, select, textarea {
  width: 100%; padding: .6rem .8rem; border-radius: 10px; border: 1px solid #ffd6e7; background:#fff;
}
label.card { gap: .5rem; display: grid; }
</style>
