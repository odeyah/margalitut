import { ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { useHead } from "@vueuse/head";
import { _ as _export_sfc, u as useScrollAnimation } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
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
    const searchQuery = ref("");
    const activeCategory = ref("all");
    const openItems = ref([]);
    const categories = [
      { id: "all", name: "הכל", icon: "📋" },
      { id: "orders", name: "הזמנות", icon: "🛒" },
      { id: "delivery", name: "משלוחים", icon: "🚗" },
      { id: "products", name: "מוצרים", icon: "🍰" },
      { id: "payment", name: "תשלום", icon: "💳" },
      { id: "workshops", name: "חוגים", icon: "👩‍🍳" },
      { id: "kashrut", name: "כשרות", icon: "✡️" }
    ];
    const faqItems = ref([
      // הזמנות
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
        id: 4,
        category: "orders",
        icon: "📦",
        question: "מה הכמות המינימלית להזמנה?",
        answer: "אין כמות מינימלית להזמנה! אפשר להזמין אפילו מוצר אחד. למשלוחים יש מינימום של ₪50."
      },
      // משלוחים
      {
        id: 10,
        category: "delivery",
        icon: "🚗",
        question: "לאן אתם מבצעים משלוחים?",
        answer: "אנחנו מבצעים משלוחים ל<strong>בית שמש וכל השכונות</strong> (כולל רמת בית שמש א', ב', ג'), ולישובים הסמוכים. לישובים רחוקים יותר - צרו קשר ונבדוק."
      },
      {
        id: 11,
        category: "delivery",
        icon: "💰",
        question: "כמה עולה משלוח?",
        answer: "מחיר המשלוח תלוי במיקום:<br>• <strong>בית שמש ישנה ורמת בית שמש א'</strong> - ₪20<br>• <strong>רמת בית שמש ב' וג'</strong> - ₪25<br>• <strong>ישובים סמוכים</strong> - ₪35"
      },
      {
        id: 12,
        category: "delivery",
        icon: "⏰",
        question: "מתי מגיע המשלוח?",
        answer: "המשלוחים מתבצעים בין השעות <strong>09:00-21:00</strong> בימים א'-ה', וביום שישי עד 14:00. נתאם אתכם שעה משוערת."
      },
      {
        id: 13,
        category: "delivery",
        icon: "🏠",
        question: "אפשר לאסוף עצמי?",
        answer: "בטח! איסוף עצמי מ<strong>שכונת המשקפיים, בית שמש</strong>. יש לתאם מראש שעת איסוף. איסוף עצמי ללא עלות!"
      },
      // מוצרים
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
        id: 22,
        category: "products",
        icon: "🌱",
        question: "יש מוצרים טבעוניים?",
        answer: 'בטח! יש לנו מבחר מוצרים טבעוניים - עוגות, עוגיות ומאפים ללא ביצים ומוצרי חלב. בדקו בקטגוריה "טבעוני" בתפריט.'
      },
      {
        id: 23,
        category: "products",
        icon: "🍬",
        question: "יש מוצרים ללא סוכר?",
        answer: "כן! יש לנו מוצרים ממותקים בתחליפי סוכר טבעיים כמו תמרים, דבש וסטיביה. מושלם לסוכרתיים או למי ששומר על תזונה בריאה."
      },
      {
        id: 24,
        category: "products",
        icon: "❄️",
        question: "איך לשמור על המוצרים?",
        answer: "רוב המוצרים נשמרים <strong>3-4 ימים בטמפרטורת החדר</strong> או <strong>שבוע במקרר</strong>. עוגות שמרים אפשר להקפיא עד 3 חודשים!"
      },
      // תשלום
      {
        id: 30,
        category: "payment",
        icon: "💳",
        question: "באילו אמצעי תשלום אפשר לשלם?",
        answer: "אנחנו מקבלים:<br>• <strong>Bit</strong> - 052-844-1093<br>• <strong>PayBox</strong> - 052-846-0331<br>• <strong>מזומן</strong> - בעת האיסוף/משלוח"
      },
      {
        id: 31,
        category: "payment",
        icon: "🧾",
        question: "מתי משלמים?",
        answer: "התשלום מתבצע <strong>לפני האיסוף/משלוח</strong>. ב-Bit או PayBox - מיד אחרי ההזמנה. במזומן - בעת קבלת המוצרים."
      },
      {
        id: 32,
        category: "payment",
        icon: "🎫",
        question: "יש הנחות או מבצעים?",
        answer: "כן! עקבו אחרינו בפייסבוק ובוואטסאפ לעדכונים על מבצעים. יש גם קודי קופון להנחות - שווה לבדוק בעמוד הבית!"
      },
      // חוגים
      {
        id: 40,
        category: "workshops",
        icon: "👧",
        question: "לאיזה גילאים החוגים מתאימים?",
        answer: "יש לנו חוגים לכל הגילאים:<br>• <strong>גילאי 3.5-6</strong> - אפרוחי האפייה<br>• <strong>גילאי 6-9</strong> - שפים צעירים<br>• <strong>גילאי 9-12</strong> - אופים מקצועיים"
      },
      {
        id: 41,
        category: "workshops",
        icon: "📍",
        question: "איפה מתקיימים החוגים?",
        answer: "החוגים מתקיימים <strong>בשכונת המשקפיים, בית שמש</strong>. אפשר גם להזמין סדנה פרטית לימי הולדת או אירועים!"
      },
      {
        id: 42,
        category: "workshops",
        icon: "🥣",
        question: "מה כולל החוג?",
        answer: "כל חוג כולל: <strong>חומרי גלם</strong>, <strong>הדרכה מקצועית</strong>, והילדים לוקחים את מה שהכינו הביתה! המון כיף ויצירתיות 🎉"
      },
      // כשרות
      {
        id: 50,
        category: "kashrut",
        icon: "✡️",
        question: "מה הכשרות של המוצרים?",
        answer: "כל המוצרים שלנו בכשרות <strong>מהדרין</strong>. אנחנו משתמשים רק בחומרי גלם עם הכשר מהדרין."
      },
      {
        id: 51,
        category: "kashrut",
        icon: "🥛",
        question: "המוצרים חלביים או פרווה?",
        answer: "רוב המוצרים שלנו <strong>פרווה</strong>. יש לנו גם מוצרים חלביים. ויש גם מוצרים טבעוניים. המידע מופיע בתיאור כל מוצר."
      },
      {
        id: 52,
        category: "kashrut",
        icon: "🧹",
        question: "איך מבטיחים ניקיון וכשרות?",
        answer: "המטבח שלנו נשמר <strong>נקי ומסודר ברמה הגבוהה ביותר</strong>. אנחנו מקפידים על הפרדה בין מוצרים שונים ועל שימוש בכלים נפרדים למוצרים ללא גלוטן."
      }
    ]);
    useHead({
      title: "שאלות נפוצות | מרגליתות - מאפייה ביתית בבית שמש",
      meta: [
        {
          name: "description",
          content: "שאלות נפוצות על הזמנות, משלוחים, כשרות, עוגות מעוצבות, חוגי אפייה ומאפים בבית שמש. כל מה שצריך לדעת לפני להזמין ממרגליתות."
        },
        {
          name: "keywords",
          content: "שאלות נפוצות מאפייה בית שמש, משלוחים בית שמש, עוגות מעוצבות, חוגי אפייה, מאפייה כשרה, הזמנת עוגה"
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "faq-page" }, _attrs))} data-v-f74e6886><header class="page-header" data-v-f74e6886><span class="header-icon" data-v-f74e6886>❓</span><h1 class="page-title" data-v-f74e6886>שאלות נפוצות</h1><p class="page-subtitle" data-v-f74e6886>כל מה שרצית לדעת על מרגליתות</p></header><div class="search-section" data-v-f74e6886><div class="search-box" data-v-f74e6886><span class="search-icon" data-v-f74e6886>🔍</span><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="חיפוש שאלה..." class="search-input" data-v-f74e6886>`);
      if (searchQuery.value) {
        _push(`<button class="clear-btn" data-v-f74e6886>✕</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="categories-filter" data-v-f74e6886><!--[-->`);
      ssrRenderList(categories, (category) => {
        _push(`<button class="${ssrRenderClass([{ active: activeCategory.value === category.id }, "filter-btn"])}" data-v-f74e6886><span class="filter-icon" data-v-f74e6886>${ssrInterpolate(category.icon)}</span><span class="filter-label" data-v-f74e6886>${ssrInterpolate(category.name)}</span></button>`);
      });
      _push(`<!--]--></div><div class="faq-list" data-v-f74e6886><!--[-->`);
      ssrRenderList(filteredFAQ.value, (item) => {
        _push(`<div class="faq-item animate-on-scroll fade-up" data-v-f74e6886><button class="faq-question" data-v-f74e6886><span class="question-icon" data-v-f74e6886>${ssrInterpolate(item.icon)}</span><span class="question-text" data-v-f74e6886>${ssrInterpolate(item.question)}</span><span class="toggle-icon" data-v-f74e6886>${ssrInterpolate(openItems.value.includes(item.id) ? "−" : "+")}</span></button>`);
        if (openItems.value.includes(item.id)) {
          _push(`<div class="faq-answer" data-v-f74e6886><p data-v-f74e6886>${item.answer ?? ""}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      if (filteredFAQ.value.length === 0) {
        _push(`<div class="no-results" data-v-f74e6886><span class="no-results-icon" data-v-f74e6886>🤔</span><h3 data-v-f74e6886>לא נמצאו תוצאות</h3><p data-v-f74e6886>נסו לחפש במילים אחרות או צרו איתנו קשר</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><section class="contact-section" data-v-f74e6886><div class="contact-card" data-v-f74e6886><span class="contact-icon" data-v-f74e6886>💬</span><h2 data-v-f74e6886>עדיין יש שאלות?</h2><p data-v-f74e6886>אנחנו כאן בשבילכם! צרו קשר ונשמח לעזור</p><div class="contact-buttons" data-v-f74e6886><a href="https://wa.me/972528460331" target="_blank" class="contact-btn whatsapp" data-v-f74e6886><span data-v-f74e6886>💬</span> וואטסאפ </a><a href="tel:0528460331" class="contact-btn phone" data-v-f74e6886><span data-v-f74e6886>📱</span> 052-846-0331 </a><a href="mailto:margalital3@gmail.com" class="contact-btn email" data-v-f74e6886><span data-v-f74e6886>📧</span> אימייל </a></div></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/FAQ.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FAQ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f74e6886"]]);
export {
  FAQ as default
};
