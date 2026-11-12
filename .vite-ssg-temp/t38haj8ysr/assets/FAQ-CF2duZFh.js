import { ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { useHead } from "@vueuse/head";
import { useRoute } from "vue-router";
import { _ as _export_sfc, u as useScrollAnimation } from "../main.mjs";
import "@unhead/vue/server";
import "pinia";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "@emailjs/browser";
const _sfc_main = {
  __name: "FAQ",
  __ssrInlineRender: true,
  setup(__props) {
    useScrollAnimation();
    const route = useRoute();
    const searchQuery = ref("");
    const activeCategory = ref("all");
    const openItems = ref([]);
    const lang = computed(() => route.query.lang === "en" ? "en" : "he");
    const categories = computed(
      () => lang.value === "en" ? [
        { id: "all", name: "All", icon: "📋" },
        { id: "orders", name: "Orders", icon: "🛒" },
        { id: "delivery", name: "Delivery", icon: "🚗" },
        { id: "products", name: "Products", icon: "🍰" },
        { id: "payment", name: "Payment", icon: "💳" },
        { id: "workshops", name: "Workshops", icon: "👩‍🍳" },
        { id: "kashrut", name: "Kosher", icon: "✡️" }
      ] : [
        { id: "all", name: "הכל", icon: "📋" },
        { id: "orders", name: "הזמנות", icon: "🛒" },
        { id: "delivery", name: "משלוחים", icon: "🚗" },
        { id: "products", name: "מוצרים", icon: "🍰" },
        { id: "payment", name: "תשלום", icon: "💳" },
        { id: "workshops", name: "חוגים", icon: "👩‍🍳" },
        { id: "kashrut", name: "כשרות", icon: "✡️" }
      ]
    );
    const hebrewFaqItems = [
      {
        id: 1,
        category: "orders",
        icon: "📅",
        question: "כמה זמן מראש צריך להזמין?",
        answer: "מומלץ להזמין <strong>לפחות 2-3 ימים מראש</strong>. לאירועים גדולים או עוגות מעוצבות מורכבות - מומלץ להזמין שבוע מראש. להזמנות דחופות - צרו קשר ונראה מה אפשר לעשות! 😊"
      },
      {
        id: 2,
        category: "orders",
        icon: "📝",
        question: "איך מזמינים?",
        answer: "אפשר להזמין דרך האתר, בוואטסאפ, או בטלפון. פשוט בחרו את המוצרים שאתם רוצים, הוסיפו לסל, ועברו לתשלום. קל ופשוט!"
      },
      {
        id: 3,
        category: "orders",
        icon: "🔄",
        question: "אפשר לבטל או לשנות הזמנה?",
        answer: "כן, אפשר לבטל או לשנות הזמנה <strong>עד 24 שעות לפני מועד האיסוף/משלוח</strong>. לאחר מכן, ייתכן שלא נוכל לבצע שינויים כי כבר התחלנו להכין את ההזמנה."
      },
      {
        id: 10,
        category: "delivery",
        icon: "🚗",
        question: "לאן אתם מבצעים משלוחים?",
        answer: "אנחנו מבצעים משלוחים ל<strong>בית שמש וכל השכונות</strong> (כולל רמת בית שמש א', ב', ג'), ולישובים הסמוכים. לישובים רחוקים יותר - צרו קשר ונבדוק."
      },
      {
        id: 20,
        category: "products",
        icon: "🎂",
        question: "אפשר להזמין עוגה בעיצוב אישי?",
        answer: "כן! אנחנו מתמחים בעוגות מעוצבות לימי הולדת, בר/בת מצווה, חתונות ואירועים. שלחו לנו את הרעיון שלכם ונשמח להגשים אותו!"
      },
      {
        id: 21,
        category: "products",
        icon: "🌾",
        question: "יש מוצרים ללא גלוטן?",
        answer: "כן! יש לנו <strong>מגוון מוצרים ללא גלוטן</strong> - עוגות, עוגיות ולחמים. כל המוצרים מוכנים בכלים נפרדים למניעת זיהום צולב."
      },
      {
        id: 30,
        category: "payment",
        icon: "💳",
        question: "באילו אמצעי תשלום אפשר לשלם?",
        answer: "אנחנו מקבלים:<br>• <strong>Bit</strong> - 052-844-1093<br>• <strong>PayBox</strong> - 052-846-0331<br>• <strong>מזומן</strong> - בעת האיסוף/משלוח"
      },
      {
        id: 40,
        category: "workshops",
        icon: "👧",
        question: "לאיזה גילאים החוגים מתאימים?",
        answer: "יש לנו חוגים לכל הגילאים:<br>• <strong>גילאי 3.5-6</strong> - אפרוחי האפייה<br>• <strong>גילאי 6-9</strong> - שפים צעירים<br>• <strong>גילאי 9-12</strong> - אופים מקצועיים"
      },
      {
        id: 50,
        category: "kashrut",
        icon: "✡️",
        question: "מה הכשרות של המוצרים?",
        answer: "כל המוצרים שלנו בכשרות <strong>מהדרין</strong>. אנחנו משתמשים רק בחומרי גלם עם הכשר מהדרין."
      }
    ];
    const englishFaqItems = [
      {
        id: 1,
        category: "orders",
        icon: "📅",
        question: "How far in advance should I order?",
        answer: "We recommend ordering <strong>at least 2–3 days in advance</strong>. For large events or more complex custom cakes, we suggest ordering a week ahead. For urgent requests, please contact us and we will see what we can do."
      },
      {
        id: 2,
        category: "orders",
        icon: "📝",
        question: "How do I place an order?",
        answer: "You can order through the website, WhatsApp, or by phone. Simply choose the products you want, add them to the cart, and proceed to payment."
      },
      {
        id: 3,
        category: "orders",
        icon: "🔄",
        question: "Can I cancel or change my order?",
        answer: "Yes — you can cancel or change an order <strong>up to 24 hours before pickup or delivery</strong>. After that, changes may not be possible because production has already begun."
      },
      {
        id: 10,
        category: "delivery",
        icon: "🚗",
        question: "Where do you deliver?",
        answer: "We deliver throughout <strong>Beit Shemesh and nearby neighborhoods</strong>, including Ramat Beit Shemesh and surrounding communities. For farther locations, please contact us to check availability."
      },
      {
        id: 20,
        category: "products",
        icon: "🎂",
        question: "Can I order a custom-designed cake?",
        answer: "Yes! We specialize in custom cakes for birthdays, bar/bat mitzvahs, weddings, and special events. Send us your idea and we would be happy to bring it to life."
      },
      {
        id: 21,
        category: "products",
        icon: "🌾",
        question: "Do you offer gluten-free products?",
        answer: "Yes! We have a <strong>selection of gluten-free products</strong> including cakes, cookies, and breads. They are prepared with separate tools to reduce cross-contamination."
      },
      {
        id: 30,
        category: "payment",
        icon: "💳",
        question: "What payment methods do you accept?",
        answer: "We accept:<br>• <strong>Bit</strong> - 052-844-1093<br>• <strong>PayBox</strong> - 052-846-0331<br>• <strong>Cash</strong> - on pickup or delivery"
      },
      {
        id: 40,
        category: "workshops",
        icon: "👧",
        question: "What age groups are the workshops for?",
        answer: "We have workshops for all ages:<br>• <strong>3.5–6 years</strong> - Little bakers<br>• <strong>6–9 years</strong> - Young chefs<br>• <strong>9–12 years</strong> - Junior bakers"
      },
      {
        id: 50,
        category: "kashrut",
        icon: "✡️",
        question: "What is the kashrut standard?",
        answer: "All of our products are made under <strong>mehadrin kosher</strong> standards, using ingredients with strict kosher certification."
      }
    ];
    const faqItems = computed(() => lang.value === "en" ? englishFaqItems : hebrewFaqItems);
    useHead({
      title: lang.value === "en" ? "FAQ | margalitut Bakery" : "שאלות נפוצות | מרגליתות - מאפייה ביתית בבית שמש",
      meta: [
        {
          name: "description",
          content: lang.value === "en" ? "Frequently asked questions about ordering, delivery, kosher certification, custom cakes, workshops, and bakery products from margalitut in Beit Shemesh." : "שאלות נפוצות על הזמנות, משלוחים, כשרות, עוגות מעוצבות, חוגי אפייה ומאפים בבית שמש. כל מה שצריך לדעת לפני להזמין ממרגליתות."
        },
        {
          name: "keywords",
          content: lang.value === "en" ? "FAQ bakery Beit Shemesh, delivery, custom cakes, workshops, kosher bakery, order cake" : "שאלות נפוצות מאפייה בית שמש, משלוחים בית שמש, עוגות מעוצבות, חוגי אפייה, מאפייה כשרה, הזמנת עוגה"
        }
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.value.slice(0, 8).map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
              }
            }))
          })
        }
      ]
    });
    const filteredFAQ = computed(() => {
      let items = faqItems.value;
      if (activeCategory.value !== "all") {
        items = items.filter((item) => item.category === activeCategory.value);
      }
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        items = items.filter((item) => item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query));
      }
      return items;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "faq-page" }, _attrs))} data-v-89010e29><header class="page-header" data-v-89010e29><span class="header-icon" data-v-89010e29>❓</span><h1 class="page-title" data-v-89010e29>${ssrInterpolate(lang.value === "en" ? "Frequently Asked Questions" : "שאלות נפוצות")}</h1><p class="page-subtitle" data-v-89010e29>${ssrInterpolate(lang.value === "en" ? "Everything you wanted to know about margalitut" : "כל מה שרצית לדעת על מרגליתות")}</p></header><div class="search-section" data-v-89010e29><div class="search-box" data-v-89010e29><span class="search-icon" data-v-89010e29>🔍</span><input type="text"${ssrRenderAttr("value", searchQuery.value)}${ssrRenderAttr("placeholder", lang.value === "en" ? "Search a question..." : "חיפוש שאלה...")} class="search-input" data-v-89010e29>`);
      if (searchQuery.value) {
        _push(`<button class="clear-btn" data-v-89010e29>✕</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="categories-filter" data-v-89010e29><!--[-->`);
      ssrRenderList(categories.value, (category) => {
        _push(`<button class="${ssrRenderClass([{ active: activeCategory.value === category.id }, "filter-btn"])}" data-v-89010e29><span class="filter-icon" data-v-89010e29>${ssrInterpolate(category.icon)}</span><span class="filter-label" data-v-89010e29>${ssrInterpolate(category.name)}</span></button>`);
      });
      _push(`<!--]--></div><div class="faq-list" data-v-89010e29><!--[-->`);
      ssrRenderList(filteredFAQ.value, (item) => {
        _push(`<div class="faq-item animate-on-scroll fade-up" data-v-89010e29><button class="faq-question" data-v-89010e29><span class="question-icon" data-v-89010e29>${ssrInterpolate(item.icon)}</span><span class="question-text" data-v-89010e29>${ssrInterpolate(item.question)}</span><span class="toggle-icon" data-v-89010e29>${ssrInterpolate(openItems.value.includes(item.id) ? "−" : "+")}</span></button>`);
        if (openItems.value.includes(item.id)) {
          _push(`<div class="faq-answer" data-v-89010e29><p data-v-89010e29>${item.answer ?? ""}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      if (filteredFAQ.value.length === 0) {
        _push(`<div class="no-results" data-v-89010e29><span class="no-results-icon" data-v-89010e29>🤔</span><h3 data-v-89010e29>${ssrInterpolate(lang.value === "en" ? "No results found" : "לא נמצאו תוצאות")}</h3><p data-v-89010e29>${ssrInterpolate(lang.value === "en" ? "Try another search term or contact us directly." : "נסו לחפש במילים אחרות או צרו איתנו קשר")}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><section class="contact-section" data-v-89010e29><div class="contact-card" data-v-89010e29><span class="contact-icon" data-v-89010e29>💬</span><h2 data-v-89010e29>${ssrInterpolate(lang.value === "en" ? "Still have questions?" : "עדיין יש שאלות?")}</h2><p data-v-89010e29>${ssrInterpolate(lang.value === "en" ? "We are here for you — feel free to reach out." : "אנחנו כאן בשבילכם! צרו קשר ונשמח לעזור")}</p><div class="contact-buttons" data-v-89010e29><a href="https://wa.me/972528460331" target="_blank" class="contact-btn whatsapp" data-v-89010e29><span data-v-89010e29>💬</span> ${ssrInterpolate(lang.value === "en" ? "WhatsApp" : "וואטסאפ")}</a><a href="tel:0528460331" class="contact-btn phone" data-v-89010e29><span data-v-89010e29>📱</span> 052-846-0331 </a><a href="mailto:margalital3@gmail.com" class="contact-btn email" data-v-89010e29><span data-v-89010e29>📧</span> ${ssrInterpolate(lang.value === "en" ? "Email" : "אימייל")}</a></div></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/FAQ.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FAQ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-89010e29"]]);
export {
  FAQ as default
};
