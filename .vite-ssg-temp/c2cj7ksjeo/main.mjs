import { createHead } from "@unhead/vue/server";
import { defineComponent, ref, onMounted, createSSRApp, computed, useSSRContext, mergeProps, unref, resolveComponent, withCtx, createTextVNode, createVNode, createBlock, openBlock, toDisplayString, watch, resolveDynamicComponent, Transition, Fragment, createCommentVNode, onUnmounted, reactive } from "vue";
import { createRouter, createMemoryHistory, useRoute, useRouter, createWebHistory } from "vue-router";
import { defineStore, createPinia } from "pinia";
import { ssrRenderTeleport, ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderVNode, ssrLooseContain, ssrLooseEqual, ssrRenderSlot } from "vue/server-renderer";
import { getFirestore, query, collection, where, getDocs, addDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import emailjs from "@emailjs/browser";
import { useHead } from "@vueuse/head";
const ClientOnly = defineComponent({
  setup(props, { slots }) {
    const mounted = ref(false);
    onMounted(() => mounted.value = true);
    return () => {
      if (!mounted.value)
        return slots.placeholder && slots.placeholder({});
      return slots.default && slots.default({});
    };
  }
});
function ViteSSG(App2, routerOptions, fn, options) {
  const {
    transformState,
    registerComponents = true,
    useHead: useHead2 = true,
    rootContainer = "#app"
  } = {};
  async function createApp$1(routePath) {
    const app2 = createSSRApp(App2);
    let head;
    if (useHead2) {
      app2.use(head = createHead());
    }
    const router = createRouter({
      history: createMemoryHistory(routerOptions.base),
      ...routerOptions
    });
    const { routes: routes2 } = routerOptions;
    if (registerComponents)
      app2.component("ClientOnly", ClientOnly);
    const appRenderCallbacks = [];
    const onSSRAppRendered = (cb) => appRenderCallbacks.push(cb);
    const triggerOnSSRAppRendered = () => {
      return Promise.all(appRenderCallbacks.map((cb) => cb()));
    };
    const context = {
      app: app2,
      head,
      isClient: false,
      router,
      routes: routes2,
      onSSRAppRendered,
      triggerOnSSRAppRendered,
      initialState: {},
      transformState,
      routePath
    };
    await (fn == null ? void 0 : fn(context));
    app2.use(router);
    let entryRoutePath;
    let isFirstRoute = true;
    router.beforeEach((to, from, next) => {
      if (isFirstRoute || entryRoutePath && entryRoutePath === to.path) {
        isFirstRoute = false;
        entryRoutePath = to.path;
        to.meta.state = context.initialState;
      }
      next();
    });
    {
      const route = context.routePath ?? "/";
      router.push(route);
      await router.isReady();
      context.initialState = router.currentRoute.value.meta.state || {};
    }
    const initialState = context.initialState;
    return {
      ...context,
      initialState
    };
  }
  return createApp$1;
}
const useUIStore = defineStore("ui", () => {
  const isMobileMenuOpen = ref(false);
  const isCartDrawerOpen = ref(false);
  const isModalOpen = ref(false);
  const modalContent = ref(null);
  const notifications = ref([]);
  const isDarkMode = ref(false);
  const isGlobalLoading = ref(false);
  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    if (isMobileMenuOpen.value) {
      isCartDrawerOpen.value = false;
    }
  }
  function openMobileMenu() {
    isMobileMenuOpen.value = true;
    isCartDrawerOpen.value = false;
  }
  function closeMobileMenu() {
    isMobileMenuOpen.value = false;
  }
  function toggleCartDrawer() {
    isCartDrawerOpen.value = !isCartDrawerOpen.value;
    if (isCartDrawerOpen.value) {
      isMobileMenuOpen.value = false;
    }
  }
  function openCartDrawer() {
    isCartDrawerOpen.value = true;
    isMobileMenuOpen.value = false;
  }
  function closeCartDrawer() {
    isCartDrawerOpen.value = false;
  }
  function openModal(content) {
    modalContent.value = content;
    isModalOpen.value = true;
  }
  function closeModal() {
    isModalOpen.value = false;
    modalContent.value = null;
  }
  function addNotification(notification) {
    const id = Date.now();
    const newNotification = {
      id,
      type: notification.type || "info",
      message: notification.message,
      duration: notification.duration || 4e3
    };
    notifications.value.push(newNotification);
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    return id;
  }
  function removeNotification(id) {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }
  function clearAllNotifications() {
    notifications.value = [];
  }
  function showSuccess(message2, duration = 4e3) {
    return addNotification({ type: "success", message: message2, duration });
  }
  function showError(message2, duration = 5e3) {
    return addNotification({ type: "error", message: message2, duration });
  }
  function showWarning(message2, duration = 4e3) {
    return addNotification({ type: "warning", message: message2, duration });
  }
  function showInfo(message2, duration = 4e3) {
    return addNotification({ type: "info", message: message2, duration });
  }
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value;
  }
  function setDarkMode(value) {
    isDarkMode.value = value;
  }
  function setGlobalLoading(value) {
    isGlobalLoading.value = value;
  }
  function closeAll() {
    isMobileMenuOpen.value = false;
    isCartDrawerOpen.value = false;
    isModalOpen.value = false;
  }
  return {
    // State
    isMobileMenuOpen,
    isCartDrawerOpen,
    isModalOpen,
    modalContent,
    notifications,
    isDarkMode,
    isGlobalLoading,
    // Mobile Menu Actions
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    // Cart Drawer Actions
    toggleCartDrawer,
    openCartDrawer,
    closeCartDrawer,
    // Modal Actions
    openModal,
    closeModal,
    // Notification Actions
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    // Theme Actions
    toggleDarkMode,
    setDarkMode,
    // Loading Actions
    setGlobalLoading,
    // General
    closeAll
  };
});
const isDark = ref(false);
function useDarkMode() {
  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    updateTheme();
  };
  const setDarkMode = (value) => {
    isDark.value = value;
    updateTheme();
  };
  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  const initTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      isDark.value = saved === "dark";
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    updateTheme();
  };
  onMounted(() => {
    initTheme();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        isDark.value = e.matches;
        updateTheme();
      }
    });
  });
  return {
    isDark,
    toggleDarkMode,
    setDarkMode
  };
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$D = {
  __name: "NotificationToast",
  __ssrInlineRender: true,
  setup(__props) {
    const uiStore = useUIStore();
    const notifications = computed(() => uiStore.notifications);
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ"
    };
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div${ssrRenderAttrs({
          name: "toast",
          class: "toast-container"
        })} data-v-695fa0bd>`);
        ssrRenderList(notifications.value, (notification) => {
          _push2(`<div class="${ssrRenderClass([`toast-${notification.type}`, "toast"])}" data-v-695fa0bd><span class="toast-icon" data-v-695fa0bd>${ssrInterpolate(icons[notification.type])}</span><span class="toast-message" data-v-695fa0bd>${ssrInterpolate(notification.message)}</span><button class="toast-close" data-v-695fa0bd>×</button><div class="toast-progress" style="${ssrRenderStyle({ animationDuration: `${notification.duration}ms` })}" data-v-695fa0bd></div></div>`);
        });
        _push2(`</div>`);
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/NotificationToast.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const NotificationToast = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["__scopeId", "data-v-695fa0bd"]]);
const _sfc_main$C = {
  __name: "DarkModeToggle",
  __ssrInlineRender: true,
  setup(__props) {
    const { isDark: isDark2 } = useDarkMode();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: "dark-mode-toggle",
        "aria-label": unref(isDark2) ? "מצב בהיר" : "מצב כהה"
      }, _attrs))} data-v-5315c5ee><span class="${ssrRenderClass([{ dark: unref(isDark2) }, "toggle-track"])}" data-v-5315c5ee><span class="toggle-icon sun" data-v-5315c5ee>☀️</span><span class="toggle-icon moon" data-v-5315c5ee>🌙</span><span class="${ssrRenderClass([{ dark: unref(isDark2) }, "toggle-thumb"])}" data-v-5315c5ee></span></span></button>`);
    };
  }
};
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/DarkModeToggle.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const DarkModeToggle = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["__scopeId", "data-v-5315c5ee"]]);
const _sfc_main$B = {
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    useUIStore();
    const email = ref("");
    const isSubscribing = ref(false);
    const currentYear = computed(() => (/* @__PURE__ */ new Date()).getFullYear());
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-33c9880d><div class="footer-wave" data-v-33c9880d><svg viewBox="0 0 1200 120" preserveAspectRatio="none" data-v-33c9880d><path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" data-v-33c9880d></path></svg></div><div class="footer-content" data-v-33c9880d><div class="container" data-v-33c9880d><div class="footer-grid" data-v-33c9880d><div class="footer-section brand-section" data-v-33c9880d><div class="brand" data-v-33c9880d><span class="brand-logo" data-v-33c9880d>🍓</span><span class="brand-name" data-v-33c9880d>מרגליתות</span></div><p class="brand-description" data-v-33c9880d>מאפייה ביתית עם אהבה למתוק ולחלבי. כל מוצר נאפה בעבודת יד מחומרי גלם איכותיים.</p><div class="social-links" data-v-33c9880d><a href="https://www.facebook.com/Margalitut/" target="_blank" class="social-link facebook" aria-label="פייסבוק" data-v-33c9880d><span class="social-icon" data-v-33c9880d>📘</span></a><a href="https://wa.me/972528460331" target="_blank" class="social-link whatsapp" aria-label="וואטסאפ" data-v-33c9880d><span class="social-icon" data-v-33c9880d>💬</span></a></div></div><div class="footer-section" data-v-33c9880d><h4 data-v-33c9880d>ניווט מהיר</h4><nav class="footer-nav" data-v-33c9880d>`);
      _push(ssrRenderComponent(_component_router_link, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`דף הבית`);
          } else {
            return [
              createTextVNode("דף הבית")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, { to: "/menu" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`תפריט`);
          } else {
            return [
              createTextVNode("תפריט")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, { to: "/gallery" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`גלריה`);
          } else {
            return [
              createTextVNode("גלריה")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, { to: "/about" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`אודות`);
          } else {
            return [
              createTextVNode("אודות")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, { to: "/my-orders" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`ההזמנות שלי`);
          } else {
            return [
              createTextVNode("ההזמנות שלי")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, { to: "/quote" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`הצעת מחיר`);
          } else {
            return [
              createTextVNode("הצעת מחיר")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, { to: "/faq" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`שאלות נפוצות`);
          } else {
            return [
              createTextVNode("שאלות נפוצות")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div><div class="footer-section" data-v-33c9880d><h4 class="section-title" data-v-33c9880d>יצירת קשר</h4><div class="contact-list" data-v-33c9880d><a href="tel:0528460331" class="contact-item" data-v-33c9880d><span class="contact-icon" data-v-33c9880d>📱</span><span data-v-33c9880d>052-846-0331</span></a><a href="mailto:margalitut@email.com" class="contact-item" data-v-33c9880d><span class="contact-icon" data-v-33c9880d>✉️</span><span data-v-33c9880d>margalitut@email.com</span></a><div class="contact-item" data-v-33c9880d><span class="contact-icon" data-v-33c9880d>📍</span><span data-v-33c9880d>בית שמש, ישראל</span></div></div></div><div class="footer-section" data-v-33c9880d><h4 class="section-title" data-v-33c9880d>שעות פעילות</h4><div class="hours-list" data-v-33c9880d><div class="hours-item" data-v-33c9880d><span class="day" data-v-33c9880d>ראשון - חמישי</span><span class="time" data-v-33c9880d>09:00 - 19:00</span></div><div class="hours-item" data-v-33c9880d><span class="day" data-v-33c9880d>שישי</span><span class="time" data-v-33c9880d>09:00 - 14:00</span></div><div class="hours-item closed" data-v-33c9880d><span class="day" data-v-33c9880d>שבת</span><span class="time" data-v-33c9880d>סגור</span></div></div><div class="kosher-badge" data-v-33c9880d><span class="badge-icon" data-v-33c9880d>✡️</span><span class="badge-text" data-v-33c9880d>כל הרכיבים בכשרות מהדרין</span></div></div></div><div class="newsletter-section" data-v-33c9880d><div class="newsletter-content" data-v-33c9880d><div class="newsletter-text" data-v-33c9880d><h4 data-v-33c9880d>הישארו מעודכנים!</h4><p data-v-33c9880d>הירשמו לקבלת עדכונים על מבצעים ומוצרים חדשים</p></div><form class="newsletter-form" data-v-33c9880d><input type="email"${ssrRenderAttr("value", email.value)} placeholder="האימייל שלכם" class="newsletter-input" required data-v-33c9880d><button type="submit" class="newsletter-btn"${ssrIncludeBooleanAttr(isSubscribing.value) ? " disabled" : ""} data-v-33c9880d>${ssrInterpolate(isSubscribing.value ? "..." : "הרשמה")}</button></form></div></div><div class="footer-bottom" data-v-33c9880d><div class="copyright" data-v-33c9880d>© ${ssrInterpolate(currentYear.value)} מרגליתות. כל הזכויות שמורות.</div><div class="bottom-links" data-v-33c9880d><a href="#" class="bottom-link" data-v-33c9880d>מדיניות פרטיות</a><span class="separator" data-v-33c9880d>•</span><a href="#" class="bottom-link" data-v-33c9880d>תנאי שימוש</a><span class="separator" data-v-33c9880d>•</span><a href="#" class="bottom-link" data-v-33c9880d>נגישות</a></div><div class="made-with" data-v-33c9880d>נבנה עם 💖 בישראל</div></div></div></div></footer>`);
    };
  }
};
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/layout/AppFooter.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const AppFooter = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["__scopeId", "data-v-33c9880d"]]);
const useMenuStore = defineStore("menu", () => {
  const categories = ref([
    {
      id: "yeast-cakes",
      name: "עוגות שמרים",
      image: "/cakes/shmarim/yeast.jpeg",
      hoverImage: "/cakes/shmarim/cinamonBobka.jpeg",
      description: "עוגות שמרים טריות ורכות",
      color: "#F4A460",
      tips: [
        { icon: "🌡️", title: "טמפרטורת החדר", text: "עוגות שמרים יוצאות הכי טוב כשכל החומרים בטמפרטורת החדר" },
        { icon: "⏰", title: "זמן תפיחה", text: "תנו לבצק לתפוח במקום חמים עד שהוא מכפיל את גודלו" },
        { icon: "🧈", title: "חמאה רכה", text: "השתמשו בחמאה רכה אך לא מומסת לקבלת מרקם מושלם" },
        { icon: "❄️", title: "אחסון", text: "ניתן להקפיא עוגות שמרים עד 3 חודשים. חממו בתנור לפני הגשה" }
      ]
    },
    {
      id: "mixed-cakes",
      name: "עוגות בחושות",
      image: "/cakes/mapelCake.jpeg",
      hoverImage: "/cakes/lemon.jpeg",
      description: "עוגות בחושות ביתיות ועשירות",
      color: "#DDA0DD",
      tips: [
        { icon: "🥚", title: "ביצים בטמפרטורת החדר", text: "ביצים בטמפרטורת החדר מתערבבות טוב יותר ונותנות מרקם אחיד" },
        { icon: "🎚️", title: "לא לערבב יותר מדי", text: "ערבבו רק עד שהמרכיבים מתחברים - ערבוב יתר יוצר עוגה קשה" },
        { icon: "🧪", title: "בדיקת קיסם", text: "העוגה מוכנה כשקיסם שנכנס למרכז יוצא נקי או עם פירורים יבשים" },
        { icon: "🕐", title: "קירור", text: "תנו לעוגה להתקרר 10 דקות בתבנית לפני הוצאה" }
      ]
    },
    {
      id: "cookies",
      name: "עוגיות",
      image: "/cookies/jamflower.jpeg",
      hoverImage: "/cookies/almonds.jpeg",
      description: "עוגיות פריכות וטעימות",
      color: "#D2691E",
      tips: [
        { icon: "❄️", title: "קירור הבצק", text: "קררו את הבצק 30 דקות לפני אפייה - העוגיות ישמרו על צורתן" },
        { icon: "📏", title: "גודל אחיד", text: "השתמשו בכף גלידה לעוגיות בגודל אחיד שנאפות באותו זמן" },
        { icon: "🍫", title: "שוקולד צ׳יפס", text: "הוסיפו את השוקולד צ׳יפס בסוף הערבוב כדי לא לרסק אותו" },
        {
          icon: "⏱️",
          title: "זמן אפייה",
          text: "עוגיות ממשיכות להתקשות אחרי שיוצאות מהתנור - הוציאו כשהן עדיין רכות במרכז"
        }
      ]
    },
    {
      id: "breads",
      name: "לחמים",
      image: "/bread/rolls.jpeg",
      hoverImage: "/bread/chalakosmin2.png",
      description: "לחמים טריים מהתנור",
      color: "#DEB887",
      tips: [
        { icon: "💧", title: "לחות", text: "הוסיפו קערת מים לתנור בזמן האפייה לקבלת קרום פריך" },
        { icon: "🌡️", title: "חימום מוקדם", text: "חממו את התנור היטב 20 דקות לפני הכנסת הלחם" },
        { icon: "👂", title: "בדיקת מוכנות", text: "הלחם מוכן כשמקישים עליו מלמטה ושומעים צליל חלול" },
        { icon: "🔪", title: "חיתוך", text: "המתינו לפחות 15 דקות לפני חיתוך כדי שהלחות תתפזר" }
      ]
    },
    {
      id: "sugar-free",
      name: "ללא סוכר",
      image: "/cookies/dateRolls.jpeg",
      hoverImage: "",
      description: "מתוקים בריאים ללא סוכר",
      color: "#90EE90",
      tips: [
        { icon: "🍌", title: "תחליפי סוכר טבעיים", text: "בננות בשלות, תמרים ודבש הם תחליפים טבעיים מצוינים" },
        { icon: "🥄", title: "סטיביה", text: "סטיביה מתוקה פי 200 מסוכר - השתמשו בכמות קטנה מאוד" },
        { icon: "🍎", title: "רסק תפוחים", text: "רסק תפוחים מוסיף מתיקות טבעית ולחות לאפייה" },
        { icon: "⚖️", title: "התאמת מרקם", text: "אפייה ללא סוכר עשויה להיות יבשה יותר - הוסיפו שמן או יוגורט" }
      ]
    },
    {
      id: "gluten-free",
      name: "ללא גלוטן",
      image: "/pesach/pesachChoclateNuts.jpeg",
      hoverImage: "/cakes/birthdayCakes/glutenfreebirthday.jpg",
      description: "אפייה ללא גלוטן",
      color: "#F0E68C",
      tips: [
        { icon: "🥣", title: "תערובת קמחים", text: "שלבו כמה סוגי קמחים ללא גלוטן לקבלת מרקם טוב יותר" },
        { icon: "🥚", title: "יותר ביצים", text: "הוסיפו ביצה נוספת למתכון - זה עוזר לקשור את הבצק" },
        { icon: "⏰", title: "זמן מנוחה", text: "תנו לבצק לנוח 30 דקות לפני אפייה - הקמחים סופגים נוזלים" },
        { icon: "🧹", title: "נקיון", text: "ודאו שכל הכלים נקיים מגלוטן למניעת זיהום צולב" }
      ]
    },
    {
      id: "vegan",
      name: "טבעוני",
      image: "/bread/chalakosmin.png",
      hoverImage: "/bread/garlicRolls.png",
      description: "מאפים טבעוניים ללא מוצרי בעלי חיים",
      color: "#98FB98",
      tips: [
        { icon: "🍌", title: "תחליף ביצים", text: "בננה מועכת, רסק תפוחים או פשתן טחון עם מים מחליפים ביצים" },
        { icon: "🥛", title: "חלב צמחי", text: "חלב שקדים, סויה או קוקוס עובדים מצוין באפייה" },
        { icon: "🧈", title: "שמנים", text: "שמן קוקוס או מרגרינה טבעונית מחליפים חמאה" },
        { icon: "🍫", title: "שוקולד", text: "בדקו שהשוקולד מריר ללא חלב - רוב השוקולד המריר טבעוני" }
      ]
    },
    {
      id: "ice-cream",
      name: "גלידות",
      image: "/desserts/icecream.jpg",
      hoverImage: "/desserts/icecreamTrikolad.jpeg",
      description: "גלידות ביתיות בטעמים מיוחדים",
      color: "#FFB6C1",
      tips: [
        { icon: "❄️", title: "הקפאה נכונה", text: "הוציאו את הגלידה מהמקפיא 10 דקות לפני הגשה לקבלת מרקם קרמי" },
        { icon: "🥄", title: "כלי הגשה", text: "טבלו את כף הגלידה במים חמים לכדורים חלקים יותר" },
        { icon: "🍯", title: "מניעת גבישי קרח", text: "הוסיפו כף דבש או סירופ לתערובת למניעת גבישי קרח" },
        { icon: "📦", title: "אחסון", text: "כסו את הגלידה בנייר פרגמנט לפני סגירת המכסה למניעת גבישים" }
      ]
    },
    {
      id: "dairy-meals",
      name: "ארוחות חלביות",
      image: "/milkMeals/shablul.jpeg",
      hoverImage: "/milkMeals/pizza.jpeg",
      description: "ארוחות חלביות טריות וטעימות",
      color: "#FFA07A",
      hasSubcategories: true,
      tips: [
        { icon: "🧀", title: "גבינות", text: "שלבו כמה סוגי גבינות לקבלת טעם עשיר ומורכב יותר" },
        { icon: "🌡️", title: "טמפרטורה", text: "הגישו פסטות ופיצות מיד - הן הכי טעימות כשהן חמות" },
        { icon: "🥗", title: "סלטים", text: "הוסיפו את הרוטב רק לפני ההגשה כדי שהסלט יישאר פריך" },
        { icon: "🍕", title: "פיצה ביתית", text: "חממו את התנור למקסימום והשתמשו באבן אפייה לתחתית פריכה" }
      ]
    },
    {
      id: "birthday-cakes",
      name: "עוגות יום הולדת חגים ואירועים",
      image: "/cakes/birthdayCakes/birthdaycake.png",
      hoverImage: "/cakes/birthdayCakes/kidsbirthday.jpg",
      description: "עוגות מעוצבות ליום הולדת חגים ואירועים מיוחדים",
      color: "#FF69B4",
      tips: [
        { icon: "📅", title: "הזמנה מראש", text: "מומלץ להזמין לפחות 5-7 ימים מראש לעוגות מעוצבות" },
        { icon: "🎨", title: "התאמה אישית", text: "אפשר להתאים צבעים, כיתוב ועיצוב לפי בקשה" },
        { icon: "🚗", title: "משלוח", text: "עוגות קומות מומלץ לאסוף עצמאית או במשלוח מיוחד" },
        { icon: "❄️", title: "אחסון", text: "יש לאחסן במקרר ולהוציא שעה לפני ההגשה" }
      ]
    },
    {
      id: "events",
      name: "מגשי אירועים",
      image: "/desserts/baklawa.jpeg",
      hoverImage: "/desserts/icecream.jpg",
      description: "מגשי קינוחים מזרחיים מרשימים לאירועים, חתונות ומשפחה",
      color: "#DAA520",
      tips: [
        { icon: "📅", title: "הזמנה מראש", text: "מומלץ להזמין מגשי אירועים לפחות 3-5 ימים מראש" },
        { icon: "🍽️", title: "כמות מומלצת", text: "בדקו את כמות היחידות במגש כדי להתאים לגודל האירוע" },
        { icon: "🎉", title: "גיוון טעמים", text: "שלבו כמה מגשים שונים לאירוח מגוון ועשיר" },
        { icon: "❄️", title: "אחסון", text: "מגשים מטוגנים מומלץ להגיש ביום ההזמנה לטריות מקסימלית" }
      ]
    },
    {
      id: "baking-workshops",
      name: "חוגי אפייה",
      image: "/margalitaf1.jpeg",
      hoverImage: "/margalitaf2.jpeg",
      color: "#d34a6e",
      description: "חוגי אפייה לילדים בכל הגילאים",
      isExternal: false
    }
  ]);
  const dairySubcategories = ref([
    { id: "pizzas", name: "פיצות", image: "/milkMeals/pizza.jpeg", hoverImage: "/milkMeals/glutenfreePizza.jpg" },
    { id: "quiches", name: "קישים", image: "/milkMeals/quiche.jpg", hoverImage: "/milkMeals/sweetPotato.jpeg" },
    { id: "salads", name: "סלטים", image: "/milkMeals/salad.jpeg", hoverImage: "/milkMeals/saladHover.jpeg" },
    { id: "pastas", name: "פסטות", image: "/milkMeals/ravioli.jpeg", hoverImage: "/milkMeals/pastaHover.jpeg" }
  ]);
  const products = ref([
    // עוגות שמרים
    {
      id: 1,
      name: "שמרים שוקולד",
      category: "yeast-cakes",
      price: 70,
      image: "/cakes/shmarim/bobka.jpeg",
      description: "בובקה שוקולד ביתית עם שכבות שוקולד בלגי עשיר ונמס. עוגת שמרים רכה ולחה אפויה טרייה במאפיית מרגליתות בית שמש. מושלמת לשבת, לאירועים ולמתנה",
      popular: true
    },
    {
      id: 2,
      name: "שמרים קינמון",
      category: "yeast-cakes",
      price: 70,
      image: "/cakes/shmarim/cinamonBobka.jpeg",
      description: "בובקה קינמון קלאסית עם סוכר חום וקינמון ציילוני אמיתי. עוגת שמרים ביתית רכה עם ניחוח שממלא את הבית. טעם של שבת ישראלית - מאפיית מרגליתות בית שמש"
    },
    {
      id: 3,
      name: "קראנץ גבינה",
      category: "yeast-cakes",
      price: 75,
      image: "/cakes/shmarim/chease.jpg",
      description: "קראנץ גבינה מתוקה עם בצק שמרים רך ושכבות מילוי גבינה קרמי עשיר. עוגת שמרים חלבית מושלמת לארוחת בוקר שישי ושבת. מאפיית מרגליתות בית שמש",
      popular: true
    },
    {
      id: 4,
      name: "קראנץ תפוחים",
      category: "yeast-cakes",
      price: 75,
      image: "/cakes/shmarim/apple.jpeg",
      description: "קראנץ תפוחים ביתי עם תפוחי עץ טריים, קינמון וסוכר חום. עוגת שמרים עם מילוי פירות טבעי בטעם של בית סבתא. מאפיית מרגליתות בית שמש - אפייה טרייה",
      popular: true
    },
    {
      id: 6,
      name: "שמרים פרג",
      category: "yeast-cakes",
      price: 75,
      image: "",
      description: "עוגת שמרים פרג מסורתית עם מילוי פרג אמיתי ועשיר. מתכון משפחתי מקורי מדור לדור בטעם נוסטלגי של פעם. מאפיית מרגליתות בית שמש"
    },
    // {
    // 	id: 8,
    // 	name: 'שמרים תותים וקוקוס',
    // 	category: 'yeast-cakes',
    // 	price: 75,
    // 	image: '',
    // 	description:
    // 		'עוגת שמרים במילוי תותים וקוקוס טרופי - שילוב מרענן ומיוחד. עוגה קייצית ומפנקת בטעם פירותי. מאפיית מרגליתות בית שמש - טעם ייחודי',
    // },
    // {
    // 	id: 10,
    // 	name: 'שמרים חלבה שוקולד',
    // 	category: 'yeast-cakes',
    // 	price: 70,
    // 	image: '',
    // 	description:
    // 		'עוגת שמרים במילוי חלבה טחינה ושוקולד מריר - שילוב ישראלי מקורי של טעמים מזרחיים. עוגה ייחודית בטעם של הבית. מאפיית מרגליתות בית שמש',
    // },
    // {
    // 	id: 11,
    // 	name: 'שמרים בטעם נוטלה',
    // 	category: 'yeast-cakes',
    // 	price: 75,
    // 	image: '',
    // 	description:
    // 		'בובקה עם ממרח בטעם נוטלה שוקולד אגוזים עשיר וקרמי. עוגת שמרים אהובה על ילדים ומבוגרים. פינוק מתוק לכל המשפחה - מאפיית מרגליתות בית שמש',
    // },
    {
      id: 12,
      name: "רוגלך שוקולד/קינמון",
      category: "yeast-cakes",
      price: 75,
      image: "/cakes/shmarim/cinimonRogalach.jpg",
      description: "רוגלך ביתי במילוי שוקולד או קינמון לבחירה - מגש כ-12 יחידות. בצק שמרים רך עם מילוי עשיר. מושלם לאירוח ולשבת - מאפיית מרגליתות בית שמש"
    },
    {
      id: 13,
      name: "שבלולי קינמון/שוקולד",
      category: "yeast-cakes",
      price: 75,
      image: "/cakes/shmarim/cinamenRolls.jpeg",
      description: "שבלולי קינמון או שוקולד - סינבון ביתי אמיתי כמו בבית קפה. מגש כ-9 שבלולים עם בצק רך וציפוי קרם מתוק. מאפיית מרגליתות בית שמש"
    },
    {
      id: 14,
      name: "שושני גבינה",
      category: "yeast-cakes",
      price: 60,
      image: "/cakes/shmarim/CheaseSnails.png",
      description: "שושני גבינה מתוקה בצורת פרח יפהפה עם בצק שמרים רך ומילוי גבינה קרמית. מגש מרשים לאירוח, לשבת ולחגים. מאפיית מרגליתות בית שמש"
    },
    {
      id: 15,
      name: "קוראסון שוקולד אמיתי",
      category: "yeast-cakes",
      price: 65,
      image: "/cakes/shmarim/croassant.jpeg",
      description: "קרואסון שוקולד צרפתי אותנטי עם שוקולד בלגי אמיתי בפנים. בצק חמאה שכבות פריך ורך כמו בקונדיטוריה בפריז. מאפיית מרגליתות בית שמש"
    },
    // עוגות בחושות
    // {
    // 	id: 17,
    // 	name: 'פס שוקולד עשיר',
    // 	category: 'mixed-cakes',
    // 	price: 45,
    // 	image: '',
    // 	description:
    // 		'עוגת שוקולד כהה עשירה ולחה במיוחד - מתכון סודי של מאפיית מרגליתות. עוגת שוקולד ביתית שנמסה בפה, מושלמת לשבת ולאירועים. בית שמש',
    // 	popular: true,
    // },
    {
      id: 18,
      name: "מאפינס גבינה אוכמניות",
      category: "mixed-cakes",
      price: 65,
      image: "/cakes/blueberrysMafins.jpeg",
      description: "מאפינס גבינה אוכמניות טריים - מארז 5 יחידות. מאפינס רכים ולחים עם אוכמניות אמיתיות בפנים. מושלם לארוחת בוקר ולילדים - מאפיית מרגליתות בית שמש"
    },
    {
      id: 19,
      name: "בראוניז שוקולד גבינה",
      category: "mixed-cakes",
      price: 70,
      image: "/cakes/cheseBrounies.png",
      description: "בראוניז שוקולד עם שכבת גבינה מארבל מרהיבה - שילוב מושלם של שוקולד כהה וגבינה קרמית. קינוח יוקרתי לאירועים - מאפיית מרגליתות בית שמש"
    },
    {
      id: 20,
      name: "פס לימון נדיר",
      category: "mixed-cakes",
      price: 65,
      image: "/cakes/lemon.jpeg",
      description: "עוגת לימון ביתית רעננה עם גלייז לימון חמצמץ וניחוח הדרים. עוגה קלילה מושלמת לקיץ ולאירוח קליל. מאפיית מרגליתות בית שמש"
    },
    {
      id: 33,
      name: "פס תפוז",
      category: "mixed-cakes",
      price: 55,
      image: "/cakes/orangeCake.jpeg",
      description: "עוגת תפוז ביתית רעננה עם גלייז תפוז מתקתק וניחוח הדרים. עוגה קלילה מושלמת לקיץ ולאירוח קליל. מאפיית מרגליתות בית שמש"
    },
    {
      id: 21,
      name: "סולת תפוז",
      category: "mixed-cakes",
      price: 65,
      image: "/cakes/soletTapuz.jpeg",
      description: "עוגת סולת תפוז חלבית עסיסית בסגנון מרוקאי מסורתי. סירופ תפוזים עשיר נספג בפנים ויוצר עוגה רווית ומפנקת. מאפיית מרגליתות בית שמש"
    },
    {
      id: 22,
      name: "עוגת פירות יבשים",
      category: "mixed-cakes",
      price: 70,
      image: "/cakes/dryedFrutesCake.jpeg",
      description: "עוגת פירות יבשים עשירה עם תאנים, תמרים, משמש ואגוזים. עוגה חגיגית מושלמת לטו בשבט, לראש השנה ולכל אירוע. מאפיית מרגליתות בית שמש"
    },
    {
      id: 23,
      name: "קראמבל קפה",
      category: "mixed-cakes",
      price: 80,
      image: "/cakes/cafeCrambelNuts.png",
      description: "עוגת קראמבל קפה. 3 שכבות של עוגה: קפה קרם קפה וקראמבל אגוזים. מושלמת לצד קפה של בוקר או אחר הצהריים. מאפיית מרגליתות בית שמש"
    },
    {
      id: 24,
      name: "פאי פיצוחים",
      category: "mixed-cakes",
      price: 80,
      image: "/cakes/payPitzuchim.png",
      description: "פאי פיצוחים עשיר עם פקאן, אגוזי מלך ושקדים בקרמל ביתי. עוגה אמריקאית קלאסית - קינוח חגיגי לאירועים ולחגים. מאפיית מרגליתות בית שמש"
    },
    {
      id: 25,
      name: "גבינה אוכמניות / פירות יער",
      category: "mixed-cakes",
      price: 300,
      image: "/cakes/cheaseBeries.jpeg",
      description: 'עוגת גבינה אפויה קרמית עם שכבת אוכמניות טריות - קוטר 24 ס"מ, כ-12 מנות. עוגת גבינה יוקרתית לאירועים ולימי הולדת. מאפיית מרגליתות בית שמש'
    },
    {
      id: 26,
      name: "עוגה אנגלית חלבית",
      category: "mixed-cakes",
      price: 75,
      image: "/cakes/englishCake.jpg",
      description: "עוגה אנגלית חלבית קלאסית עם קליפות הדרים מסוכרות בסגנון בריטי מקורי. מושלמת לתה אחר הצהריים ולאירוח. מאפיית מרגליתות בית שמש"
    },
    {
      id: 27,
      name: "מייפל אגוזים",
      category: "mixed-cakes",
      price: 60,
      image: "/cakes/mapelCake.jpeg",
      description: "עוגת מייפל ביתית עם אגוזי מלך קלויים - עוגה רכה ולחה בטעם מייפל עדין. פינוק סתווי מושלם לכל המשפחה. מאפיית מרגליתות בית שמש"
    },
    {
      id: 28,
      name: "מייפל טבעי ואגוזים",
      category: "mixed-cakes",
      price: 65,
      image: "/cakes/mapelCake.jpeg",
      description: "עוגת מייפל פרימיום עם סירופ מייפל טבעי 100% מקנדה ואגוזים. גרסה יוקרתית בטעם עשיר ומיוחד לחובבי מייפל אמיתיים. מאפיית מרגליתות בית שמש"
    },
    // {
    // 	id: 29,
    // 	name: 'עוגת טו בשבט',
    // 	category: 'mixed-cakes',
    // 	price: 70,
    // 	image: '',
    // 	description:
    // 		'עוגת שוקולד מעוצבת לטו בשבט עם פירות יבשים ואגוזים. עוגה חגיגית לחג האילנות - מתאימה לכיתות, למשפחות ולמתנות. מאפיית מרגליתות בית שמש',
    // },
    // {
    // 	id: 30,
    // 	name: 'דמקה שכבות גבינה',
    // 	category: 'mixed-cakes',
    // 	price: 80,
    // 	image: '',
    // 	description:
    // 		'עוגת דמקה מרשימה עם שכבות גבינה ושוקולד בדוגמת שחמט. עוגה מיוחדת ויפהפיה לאירועים - כ-12 מנות. מאפיית מרגליתות בית שמש',
    // },
    {
      id: 31,
      name: "גבינה פירורים",
      category: "mixed-cakes",
      price: 300,
      image: "/cakes/cheasecake.jpeg",
      description: "עוגת גבינה אפויה ישראלית קלאסית עם שכבת פירורים חמאתית פריכה. טעם נוסטלגי של פעם *לא כולל אותיות - עוגת גבינה ביתית אמיתית. מאפיית מרגליתות בית שמש"
    },
    {
      id: 32,
      name: "גבינה קרה",
      category: "mixed-cakes",
      price: 65,
      image: "/cakes/cheseChoclateCake.png",
      description: "עוגת פס גבינה קרה קלילה בציפוי גנאש שוקולד מריר - ללא אפייה. עוגה קרמית ומרעננת מושלמת לקיץ ולאירוח. מאפיית מרגליתות בית שמש"
    },
    {
      id: 34,
      name: "גבינה אוריאו",
      category: "mixed-cakes",
      price: 300,
      image: "/cakes/oreoChese.jpeg",
      description: 'עוגת גלידה גבינה אוריאו מפנקת - קוטר 24 ס"מ, כ-12 מנות. עוגת גבינה קרמית עם עוגיות אוריאו מעל ובפנים. פינוק אמריקאי - מאפיית מרגליתות בית שמש'
    },
    {
      id: 35,
      name: "סופלה שוקולד",
      category: "mixed-cakes",
      price: 50,
      image: "/cakes/sofle.jpeg",
      description: "סופלה שוקולד ביתי - מארז 5 יחידות. לבבות שוקולד עם מרכז נוזלי וחם שנמס בפה. קינוח רומנטי ומרשים לאירועים. מאפיית מרגליתות בית שמש"
    },
    {
      id: 36,
      name: "בראוניז",
      category: "mixed-cakes",
      price: 55,
      image: "/cakes/brounies.jpg",
      description: "בראוניז שוקולד קלאסיים עשירים ולחים עם שוקולד בלגי איכותי - מגש כ-9 חתיכות. מתכון אמריקאי מושלם לחובבי שוקולד. מאפיית מרגליתות בית שמש"
    },
    {
      id: 38,
      name: "פס תפוחים ואגוזים",
      category: "mixed-cakes",
      price: 80,
      image: "/cakes/appleNuts.jpeg",
      description: "עוגת פס תפוחים אגוזים וקינמון - מאפיית מרגליתות בית שמש"
    },
    // עוגיות
    {
      id: 41,
      name: "מופלאות שוקולד צ'יפס",
      category: "cookies",
      price: 60,
      image: "/cookies/chocoChip.jpeg",
      description: "עוגיות שוקולד צ'יפס ביתיות פריכות עם שוקולד בלגי איכותי בנדיבות. כ-11 עוגיות אמריקאיות כמו בבית קפה - נמכרות כמו לחמניות חמות. מאפיית מרגליתות בית שמש",
      popular: true
    },
    {
      id: 43,
      name: "שוקולד צ'יפס תות מקורי",
      category: "cookies",
      price: 70,
      image: "",
      description: "עוגיות שוקולד צ'יפס עם תותים מיובשים - שילוב מיוחד ומקורי שלא תמצאו במקום אחר. עוגיות פרימיום מושלמות למתנה ולאירוח. מאפיית מרגליתות בית שמש",
      popular: true
    },
    {
      id: 45,
      name: "עוגיות חמאה פקאן",
      category: "cookies",
      price: 70,
      image: "/cookies/pekancookies.jpeg",
      description: "עוגיות חמאה פריכות עם אגוזי פקאן קלויים בסגנון צרפתי יוקרתי. כ-10 עוגיות חמאה איכותיות לאירוח מיוחד ולמתנות. מאפיית מרגליתות בית שמש"
    },
    {
      id: 46,
      name: "סהרוני שקדים",
      category: "cookies",
      price: 70,
      image: "/cookies/almonds.jpeg",
      description: "עוגיות סהרוני שקדים פריכות בצורת ירח עם אבקת סוכר עדינה. עוגיות חג קלאסיות שנמסות בפה - מתכון אירופאי מסורתי. מאפיית מרגליתות בית שמש"
    },
    // {
    // 	id: 47,
    // 	name: 'עוגיות בריאות',
    // 	category: 'cookies',
    // 	price: 60,
    // 	image: '',
    // 	description:
    // 		'עוגיות בריאות עם שיבולת שועל, דבש טבעי וזרעים מזינים. עוגיות טעימות ומזינות לארוחת עשר ולילדים - בריא וטעים ביחד. מאפיית מרגליתות בית שמש',
    // },
    {
      id: 48,
      name: "פרח ריבה",
      category: "cookies",
      price: 60,
      image: "/cookies/jamflower.jpeg",
      description: "עוגיות פרח ריבה - עוגיות חמאה פריכות בצורת פרח עם ריבת תות באמצע. עוגיות קלאסיות צבעוניות ויפות לאירוח ולילדים. מאפיית מרגליתות בית שמש",
      popular: true
    },
    {
      id: 49,
      name: "מגולגלות תמרים ללא סוכר",
      category: ["cookies", "sugar-free"],
      price: 60,
      image: "/cookies/dateRolls.jpeg",
      description: "מגולגלות תמרים ללא סוכר מוסף - עוגיות מעמול פריכות במילוי תמרים טבעי. מתאימות לסוכרתיים ולדיאטה - טעם מלא בלי סוכר. מאפיית מרגליתות בית שמש"
    },
    {
      id: 50,
      name: "קוקילידה",
      category: "cookies",
      price: 14,
      image: "/cookies/cookilida.jpeg",
      description: "קוקילידה ביתית - עוגיית קוקוס שוקולד גדולה ופריכה ליחידה. עוגייה נוסטלגית בטעם של פעם שמזכירה את הילדות. מאפיית מרגליתות בית שמש"
    },
    {
      id: 51,
      name: "חיתוכיות תות תפוח",
      category: "cookies",
      price: 60,
      image: "/cookies/appleBars.jpeg",
      description: "חיתוכיות שכבות עם ריבת תות ותפוח מרעננת. עוגיות פריכות וטעימות - מגש מארח מושלם לאירוח ולשבת. מאפיית מרגליתות בית שמש"
    },
    {
      id: 52,
      name: "עוגיות לוקום",
      category: "cookies",
      price: 70,
      image: "/cookies/rachtLokemCokies.jpg",
      description: "עוגיות רחת לוקום - כ-10 עוגיות חמאה עדינות עם קוביות לוקום ורדים. עוגיות מזרחיות אלגנטיות בטעם מיוחד וייחודי. מאפיית מרגליתות בית שמש"
    },
    // {
    // 	id: 53,
    // 	name: 'עוגיות קוקוס ושוקולד',
    // 	category: 'cookies',
    // 	price: 50,
    // 	image: '',
    // 	description:
    // 		"עוגיות קוקוס פריכות עם שוקולד צ'יפס - שילוב טרופי ושוקולדי מנצח. עוגיות אהובות על ילדים ומבוגרים. מאפיית מרגליתות בית שמש",
    // },
    // {
    // 	id: 55,
    // 	name: 'שומשומיות',
    // 	category: 'cookies',
    // 	price: 50,
    // 	image: '',
    // 	description:
    // 		'שומשומיות ביתיות פריכות - עוגיות שומשום מסורתיות בסגנון מזרחי. עוגיות בריאות ומזינות במתכון של סבתא. מאפיית מרגליתות בית שמש',
    // },
    {
      id: 56,
      name: "ריפאת",
      category: "cookies",
      price: 50,
      image: "/cookies/rifat.jpeg",
      description: "ריפאת - עוגיות קוקוס וקונדנס מילק מסורתיות שנמסות בפה. עוגיות מרוקאיות קלאסיות במתכון משפחתי מקורי. מאפיית מרגליתות בית שמש"
    },
    {
      id: 57,
      name: "אצבעות פילו במגוון מילויים",
      category: "cookies",
      price: 50,
      image: "",
      description: "אצבעות פילו פריכות - 5 יח׳ במילוי חלבה, שקדים או אגוזים לבחירה, בזיגוג מייפל או סילאן. קינוח מזרחי מפנק. מאפיית מרגליתות בית שמש"
    },
    // {
    // 	id: 58,
    // 	name: 'לימוניות',
    // 	category: 'cookies',
    // 	price: 50,
    // 	image: '',
    // 	description:
    // 		'עוגיות לימון רעננות עם גלייז לימון חמצמץ בטעם הדרים. עוגיות קייציות מרעננות מושלמות לאחר הצהריים. מאפיית מרגליתות בית שמש',
    // },
    {
      id: 59,
      name: "עוגיות קפה ארומטיות",
      category: "cookies",
      price: 50,
      image: "/cookies/coffeCookies.jpeg",
      description: "עוגיות קפה ארומטיות עם אספרסו אמיתי - עוגיות לאוהבי קפה עם ניחוח וטעם קפה עשיר. מושלמות לצד קפה. מאפיית מרגליתות בית שמש"
    },
    {
      id: 60,
      name: "מושלגות פרג",
      category: "cookies",
      price: 50,
      image: "/cookies/Pereg.jpg",
      description: "עוגיות פרג מושלגות באבקת סוכר עדינה - עוגיות פרג מסורתיות בסגנון אירופאי קלאסי. עוגיות חורפיות מפנקות. מאפיית מרגליתות בית שמש"
    },
    {
      id: 61,
      name: "מגולגלות חלבה",
      category: "cookies",
      price: 65,
      image: "/cookies/megulgalutHalva.jpg",
      description: "מגולגלות חלבה פריכות - עוגיות מעמול במילוי חלבה טחינה עשירה שנמסות בפה. עוגיות ישראליות מקוריות בטעם של הבית. מאפיית מרגליתות בית שמש"
    },
    // {
    // 	id: 62,
    // 	name: 'עוגיות אגוזים קינמון',
    // 	category: 'cookies',
    // 	price: 60,
    // 	image: '',
    // 	description:
    // 		'עוגיות אגוזים וקינמון חורפיות עם אגוזי מלך קלויים וקינמון ארומטי. ניחוח ביתי חם מושלם לחורף. מאפיית מרגליתות בית שמש',
    // },
    {
      id: 64,
      name: "חיתוכיות חמאת בוטנים",
      category: "cookies",
      price: 45,
      image: "/cookies/peanuts.jpeg",
      description: "חיתוכיות חמאת בוטנים ושוקולד - שילוב אמריקאי קלאסי ואהוב. עוגיות עשירות בחלבון - פינוק לכל המשפחה. מאפיית מרגליתות בית שמש"
    },
    {
      id: 65,
      name: "גבינה ניו יורק",
      category: "mixed-cakes",
      price: 320,
      image: "/cakes/newYork.jpeg",
      description: 'עוגת גבינת שמנת קרמית מפנקת - קוטר 26 ס"מ, כ-20 מנות. עוגת גבינה קרמית עם תחתית עוגיות בחמאה או לוטוס ומגוון ציפויים לבחירתכם: פירות יער, ריבת חלב, לוטוס, גנאש... פינוק אמריקאי - מאפיית מרגליתות בית שמש'
    },
    {
      id: 66,
      name: "באקלאווה",
      category: "cookies",
      price: 80,
      image: "/cakes/baqlawa.jpg",
      description: "באקלאווה ביתית מסורתית - כ-30 יחידות. שכבות פילו פריכות במילוי אגוזים וסירופ דבש עשיר. קינוח מזרחי קלאסי לאירועים ולחגים. מאפיית מרגליתות בית שמש"
    },
    // לחמים
    {
      id: 70,
      name: "מארז לחמניות הבית לבן",
      category: ["vegan", "breads"],
      price: 30,
      image: "/bread/rolls.jpeg",
      description: "לחמניות ביתיות טריות מקמח לבן - מארז 5 יח׳. לחמניות רכות מושלמות לסנדוויצ׳ים והמבורגר ביתי. אפייה טרייה יומית במאפיית מרגליתות בית שמש",
      popular: true
    },
    {
      id: 71,
      name: "חלה",
      category: ["vegan", "breads"],
      price: 30,
      image: "/bread/chala.jpeg",
      description: "חלה ביתית לשבת - חלה קלועה רכה וטרייה מקמח איכותי. מתכון מסורתי משפחתי מדור לדור. ניחוח של ערב שבת ישראלי - מאפיית מרגליתות בית שמש"
    },
    {
      id: 72,
      name: "מארז לחמניות הבית כוסמין 80%",
      category: ["vegan", "breads"],
      price: 35,
      image: "/bread/rolls.jpeg",
      description: "לחמניות כוסמין 80% בריאות - מארז 5 יח׳. לחמניות מקמח מלא עשירות בסיבים תזונתיים וויטמינים. לחם בריא וטעים לכל משפחה - אפייה ביתית בבית שמש"
    },
    {
      id: 73,
      name: "חלת כוסמין 80%",
      category: ["vegan", "breads"],
      price: 35,
      image: "/bread/chalaKosmin3.png",
      description: "חלת כוסמין 80% בריאה לשבת - חלה מקמח מלא עם ערך תזונתי גבוה. חלה טעימה ובריאה בלי פשרות על הטעם. מאפיית מרגליתות בית שמש"
    },
    {
      id: 74,
      name: "לחמניות שום כוסמין 80%",
      category: ["vegan", "breads"],
      price: 40,
      image: "/bread/garlicRolls.png",
      description: "לחמניות שום בריאות מכוסמין 80% - מארז 5 יח'. לחמניות ארומטיות בטעם שום ועשבי תיבול טריים. מושלמות לצד מרק, פסטה או סלט - מבית שמש"
    },
    // {
    // 	id: 75,
    // 	name: 'פיתה זעתר ושומשום',
    // 	category: ['vegan', 'breads'],
    // 	price: 12,
    // 	image: '',
    // 	description:
    // 		'פיתה ביתית טרייה עם זעתר ושומשום - תיבול ישראלי אותנטי. פיתה רכה מושלמת לארוחת בוקר ישראלית עם חומוס, לבנה וסלט. מאפיית מרגליתות',
    // },
    {
      id: 76,
      name: "לחמניות שום",
      category: ["vegan", "breads"],
      price: 80,
      image: "/bread/garlicBread1.jpg",
      description: "לחמניות שום ביתיות ארומטיות - מארז 5 יח׳. לחמניות רכות בטעם שום עשיר וחמאתי. מושלמות לצד פסטה איטלקית, מרקים וסלטים - מבית שמש"
    },
    {
      id: 77,
      name: "לחמניות מתוקות",
      category: "breads",
      price: 45,
      image: "/bread/sweetRools.png",
      description: "לחמניות מתוקות עם צימוקים עסיסיים - מארז 5 יח׳. לחמניות רכות ומתוקות בסגנון ביתי לארוחת בוקר מפנקת. אהובות על ילדים - מאפיית מרגליתות בית שמש"
    },
    {
      id: 78,
      name: "חלה מתוקה",
      category: "breads",
      price: 45,
      image: "/bread/sweetRools.png",
      description: "חלה מתוקה עם צימוקים עסיסיים. חלה רכה ומתוקה בסגנון ביתי לארוחת בוקר מפנקת. אהובות על ילדים - מאפיית מרגליתות בית שמש"
    },
    // ==================== ללא סוכר ====================
    // {
    // 	id: 81,
    // 	name: 'עוגיות שיבולת שועל ללא סוכר',
    // 	category: ['cookies', 'sugar-free'],
    // 	price: 65,
    // 	image: '',
    // 	description:
    // 		'עוגיות שיבולת שועל בריאות ללא סוכר מוסף - ממותקות בדבש טבעי וזרעים. עוגיות מזינות לסוכרתיים, לדיאטה ולכל המשפחה. מאפיית מרגליתות בית שמש',
    // },
    // {
    // 	id: 82,
    // 	name: 'פס גבינה אפויה ללא סוכר',
    // 	category: ['cookies', 'sugar-free'],
    // 	price: 75,
    // 	image: '',
    // 	description:
    // 		'עוגת גבינה אפויה ללא סוכר מוסף - עוגת גבינה קרמית ועשירה מתאימה לסוכרתיים ולדיאטה. כל הטעם בלי הסוכר. מאפיית מרגליתות בית שמש',
    // },
    // {
    // 	id: 83,
    // 	name: 'פס גבינה קרה ללא סוכר',
    // 	category: ['cakes', 'sugar-free'],
    // 	price: 95,
    // 	image: '',
    // 	description:
    // 		'עוגת גבינה קרה ללא סוכר מוסף - קינוח קליל וקרמי לסוכרתיים, לדיאטה ולמודעים לבריאות. טעם מלא בלי פשרות. מאפיית מרגליתות בית שמש',
    // },
    // ==================== ללא גלוטן ====================
    {
      id: 90,
      name: "פס שוקולד עשיר",
      category: ["gluten-free", "mixed-cakes"],
      price: 75,
      image: "/pesach/chocletTheQ.jpeg",
      description: "עוגת שוקולד ללא גלוטן על בסיס קמח שקדים איכותי. עוגה עשירה ולחה לצליאקים ולרגישים לגלוטן. טעם מלא כמו עוגה רגילה. מאפיית מרגליתות בית שמש"
    },
    {
      id: 91,
      name: "עוגיות קינמון אגוזים",
      category: ["gluten-free", "cookies"],
      price: 65,
      image: "/pesach/cinamonNuts.jpeg",
      description: "עוגיות קוקוס ללא גלוטן - עוגיות פריכות מאגוזים וקינמון. מתאימות לצליאקים ולרגישים לגלוטן. מאפיית מרגליתות בית שמש"
    },
    // {
    // 	id: 92,
    // 	name: 'פס גבינה',
    // 	category: ['gluten-free', 'cakes'],
    // 	price: 95,
    // 	image: '',
    // 	description:
    // 		'עוגת גבינה אפויה ללא גלוטן - עוגת גבינה קרמית על בסיס שקדים. מתאימה לצליאקים ולרגישים לגלוטן. טעימה כמו הרגיל. מאפיית מרגליתות בית שמש',
    // },
    {
      id: 93,
      name: "שוקולד אגוזים",
      category: ["gluten-free", "mixed-cakes"],
      price: 95,
      image: "/pesach/nutsPesachCake.jpeg",
      description: "עוגת גבינה אפויה ללא גלוטן - עוגת גבינה קרמית על בסיס שקדים. מתאימה לצליאקים ולרגישים לגלוטן. טעימה כמו הרגיל. מאפיית מרגליתות בית שמש"
    },
    {
      id: 95,
      name: "עוגיות שקדים",
      category: ["gluten-free", "cookies"],
      price: 65,
      image: "/pesach/almondsPesach.jpeg",
      description: "עוגיות שקדים ללא גלוטן - עוגיות פריכות משקדים. מתאימות לצליאקים ולרגישים לגלוטן. מאפיית מרגליתות בית שמש"
    },
    {
      id: 96,
      name: "עוגיות שוקולד ציפס",
      category: ["gluten-free", "cookies"],
      price: 65,
      image: "/pesach/pesachChoclateChips.jpeg",
      description: "עוגיות שוקולד ציפס ללא גלוטן - עוגיות פריכות משקדים. מתאימות לצליאקים ולרגישים לגלוטן. מאפיית מרגליתות בית שמש"
    },
    // ==================== טבעוני ====================
    // {
    // 	id: 100,
    // 	name: 'עוגיות טבעוניות',
    // 	category: ['vegan', 'cookies'],
    // 	price: 70,
    // 	image: '',
    // 	description:
    // 		'עוגיות שוקולד טבעוניות - עוגיות טעימות ללא ביצים וללא חלב. מתאימות לטבעונים ולרגישים ללקטוז. מתכון ייחודי של מאפיית מרגליתות בית שמש',
    // },
    // {
    // 	id: 101,
    // 	name: 'מאפינס טבעוניים',
    // 	category: ['vegan', 'mixed-cakes'],
    // 	price: 70,
    // 	image: '',
    // 	description:
    // 		'מאפינס אוכמניות טבעוניים - מאפינס רכים ולחים ללא מוצרי חלב וביצים. טעימים כמו מאפינס רגילים. מתאימים לטבעונים. מאפיית מרגליתות בית שמש',
    // },
    // גלידות
    {
      id: 110,
      name: "וניל",
      category: ["ice-cream", "gluten-free"],
      price: 130,
      image: "/desserts/icecream.jpg",
      description: "גלידת וניל ביתית קילו - גלידה איטלקית קרמית בטעם וניל מדגסקר קלאסי. ללא חומרים משמרים, ללא גלוטן. מאפיית מרגליתות בית שמש",
      popular: true
    },
    {
      id: 111,
      name: "שוקולד",
      category: ["ice-cream", "gluten-free"],
      price: 130,
      image: "/desserts/icecream.jpg",
      description: "גלידת שוקולד בלגי ביתית קילו - גלידה איטלקית עשירה בטעם שוקולד כהה אינטנסיבי. לחובבי שוקולד אמיתיים. מאפיית מרגליתות בית שמש"
    },
    {
      id: 112,
      name: "תות שמנת",
      category: ["ice-cream", "gluten-free"],
      price: 130,
      image: "/desserts/icecream.jpg",
      description: "גלידת תות שמנת ביתית קילו - גלידה קרמית עם תותים טריים אמיתיים. גלידה פירותית אהובה על ילדים ומבוגרים. מאפיית מרגליתות בית שמש"
    },
    {
      id: 113,
      name: "אוראו",
      category: "ice-cream",
      price: 130,
      image: "/desserts/icecreamOreo.jpg",
      description: "גלידת אוראו ביתית קילו - גלידה איטלקית קרמית עם פיסות עוגיות אוריאו פריכות. גלידה חגיגית לכל המשפחה. מאפיית מרגליתות בית שמש"
    },
    {
      id: 114,
      name: "מנגו",
      category: ["ice-cream", "gluten-free"],
      price: 130,
      image: "/desserts/icecream.jpg",
      description: "גלידת מנגו טרופית ביתית קילו - גלידה מרעננת בטעם מנגו טרי ואקזוטי. גלידה קייצית מושלמת לימים חמים. מאפיית מרגליתות בית שמש"
    },
    {
      id: 115,
      name: "לימון",
      category: ["ice-cream", "gluten-free"],
      price: 130,
      image: "/desserts/icecreamLemon.jpg",
      description: "גלידת לימון ביתית קילו - סורבה איטלקי מרענן בטעם לימון חמצמץ וקליל. גלידה קייצית מושלמת לקינוח מרענן. מאפיית מרגליתות בית שמש"
    },
    {
      id: 116,
      name: "לוטוס",
      category: "ice-cream",
      price: 130,
      image: "/desserts/icecreamLotus.jpg",
      description: "גלידת לוטוס ביתית קילו - גלידה קרמית בטעם ביסקוויט לוטוס בלגי עם פיסות עוגיות פריכות. טעם ממכר. מאפיית מרגליתות בית שמש"
    },
    {
      id: 117,
      name: "רבע לשבע",
      category: "ice-cream",
      price: 130,
      image: "/desserts/icecreamReva.jpg",
      description: "גלידת רבע לשבע ביתית קילו - גלידה נוסטלגית בטעם השוקולד הישראלי האהוב. טעם של ילדות לכל המשפחה. מאפיית מרגליתות בית שמש"
    },
    {
      id: 118,
      name: "דובאי",
      category: "ice-cream",
      price: 130,
      image: "/desserts/icecream.jpg",
      description: "גלידת דובאי פרימיום ביתית קילו - גלידה יוקרתית בטעם פיסטוק וקדאיף בהשראה מזרחית. טעם מיוחד וייחודי. מאפיית מרגליתות בית שמש"
    },
    {
      id: 119,
      name: "טריקולד",
      category: ["ice-cream", "gluten-free"],
      price: 130,
      image: "/desserts/icecreamTrikolad.jpeg",
      description: "גלידת טריפל שוקולד ביתית קילו - גלידה אינטנסיבית עם 3 סוגי שוקולד עשירים. לחובבי שוקולד אמיתיים בלבד. מאפיית מרגליתות בית שמש"
    },
    {
      id: 120,
      name: "פירות יער",
      category: ["ice-cream", "gluten-free"],
      price: 130,
      image: "/desserts/icecreamBerrys.jpg",
      description: "גלידת פירות יער ביתית קילו - גלידה פירותית עם תותים, אוכמניות ופטל טריים. גלידה מרעננת וטעימה. מאפיית מרגליתות בית שמש"
    },
    {
      id: 121,
      name: "תפוז",
      category: ["ice-cream", "gluten-free"],
      price: 130,
      image: "/desserts/icecream.jpg",
      description: "גלידת תפוז ביתית קילו - סורבה איטלקי מרענן בטעם תפוז טבעי והדרים. גלידה קייצית קלילה ומרעננת. מאפיית מרגליתות בית שמש"
    },
    {
      id: 122,
      name: "ריבת חלב",
      category: ["ice-cream", "gluten-free"],
      price: 130,
      image: "/desserts/icecream.jpg",
      description: "גלידת ריבת חלב ביתית קילו - גלידת שמנת מרעננת בטעם ריבת חלב. גלידה קייצית קלילה ומרעננת. מאפיית מרגליתות בית שמש"
    },
    {
      id: 123,
      name: "לימונענע",
      category: ["ice-cream", "gluten-free"],
      price: 130,
      image: "/desserts/icecream.jpg",
      description: "גלידת לימונענע ביתית קילו - גלידת שמנת מרעננת בטעם לימונענע. גלידה קייצית קלילה ומרעננת. מאפיית מרגליתות בית שמש"
    },
    // פיצות
    {
      id: 125,
      name: "פיצה הבית",
      category: "dairy-meals",
      subcategory: "pizzas",
      price: 80,
      image: "/milkMeals/pizza.jpeg",
      description: "פיצה ביתית איטלקית עם רוטב עגבניות טרי, מוצרלה נמשכת + 2 תוספות לבחירה. בצק טרי יומי אפוי בתנור ביתי. מאפיית מרגליתות בית שמש",
      popular: true
    },
    {
      id: 126,
      name: "פיצה ללא גלוטן",
      category: ["dairy-meals", "gluten-free"],
      subcategory: "pizzas",
      price: 95,
      image: "/milkMeals/glutenfreePizza.jpg",
      description: "פיצה ביתית איטלקית ללא גלוטן עם רוטב עגבניות טרי, מוצרלה נמשכת + 2 תוספות לבחירה. בצק טרי יומי אפוי בתנור ביתי. מאפיית מרגליתות בית שמש",
      popular: true
    },
    // קישים
    {
      id: 130,
      name: "קיש",
      category: "dairy-meals",
      subcategory: "quiches",
      price: 200,
      image: "/milkMeals/qish.jpg",
      description: 'קיש ביתי טרי בטעמים לבחירה - בטטה, ברוקולי, תרד, פטריות או מנגולד. קיש מושלם לאירוח קוטר 24 ס"מ, לארוחת בוקר ולשבת. מאפיית מרגליתות בית שמש מינימום הזמנה: 2 יחידות',
      popular: false,
      hasOptions: true,
      flavors: [
        { id: "sweet-potato", name: "בטטה", icon: "🍠" },
        { id: "broccoli", name: "ברוקולי", icon: "🥦" },
        { id: "spinach", name: "תרד", icon: "🥬" },
        { id: "mushrooms", name: "פטריות", icon: "🍄" },
        { id: "mangold", name: "מנגולד", icon: "🌿" }
      ]
    },
    // בורקס
    // {
    // 	id: 150,
    // 	name: 'מאפינס גבינות',
    // 	category: 'dairy-meals',
    // 	subcategory: 'borax',
    // 	price: 12,
    // 	image: '',
    // 	description: 'מאפים מלוחים אישיים במילוי גבינות איכותיות. אפויים עד להזהבה מושלמת. מאפיית מרגליתות בית שמש',
    // },
    // {
    // 	id: 151,
    // 	name: 'מאפה עלים בצל ופטריות',
    // 	category: 'dairy-meals',
    // 	subcategory: 'borax',
    // 	price: 85,
    // 	image: '',
    // 	description: 'קליעת בצק עלים פריכה עם מילוי בצל ופטריות, אפוי. מאפיית מרגליתות בית שמש',
    // },
    {
      id: 152,
      name: "שבלול פילו גדול",
      category: "dairy-meals",
      subcategory: "borax",
      price: 180,
      image: "/milkMeals/filoroll.jpeg",
      description: 'שבלול פילו גדול ומרשים במילוי גבינות עשיר מנגולד או תרד - מאפה פילו פריך לאירוח. קוטר 26 ס"מ מתאים לכ-8 מנות, מושלם לארוחת בוקר שישי ושבת. מאפיית מרגליתות בית שמש'
    },
    {
      id: 153,
      name: "שבלול פילו בינוני",
      category: "dairy-meals",
      subcategory: "borax",
      price: 140,
      image: "/milkMeals/filorollMid.jpeg",
      description: "שבלול פילו בינוני במילוי גבינות עשיר עם מנגולד או תרד - מאפה פילו פריך לאירוח. מתאים לכ-6 מנות, מושלם לארוחת בוקר שישי ושבת. מאפיית מרגליתות בית שמש"
    },
    {
      id: 154,
      name: "סלט גדול",
      category: "dairy-meals",
      subcategory: "salads",
      price: 180,
      image: "/milkMeals/salad.jpeg",
      description: "מגוון סלטים צבעוניים ורעננים לבחירתכם. יווני או כרוב או בורגול או טונה או חלומי מאפיית מרגליתות בית שמש מינימום הזמנה: 2 יחידות",
      popular: false,
      hasOptions: true,
      flavors: [
        { id: "greek", name: "יווני", icon: "🍠" },
        { id: "cabage", name: "כרוב", icon: "🥦" },
        { id: "borgul", name: "בורגול/קינואה", icon: "🥬" },
        { id: "tuna", name: "טונה", icon: "🍄" },
        { id: "halumi", name: "חלומי", icon: "🌿" }
      ]
    },
    // פסטות
    {
      id: 160,
      name: "רביולי אלפרדו",
      category: "dairy-meals",
      subcategory: "pastas",
      price: 180,
      image: "/milkMeals/ravioli.jpeg",
      description: "רביולי גבינה ברוטב אלפרדו ביתי - 400 גרם פסטה איטלקית ברוטב שמנת ופרמזן קרמי. מתאים לכ-3-5 סועדים. מאפיית מרגליתות בית שמש",
      popular: true,
      hasAddOns: true,
      addOns: [{ id: "cheese-cream", name: "תוספת הקרמת גבינה צהובה", price: 20 }]
    },
    // {
    // 	id: 161,
    // 	name: 'רביולי עגבניות',
    // 	category: 'dairy-meals',
    // 	subcategory: 'pastas',
    // 	price: 180,
    // 	image: '/milkMeals/ravioli.jpeg',
    // 	description:
    // 		'רביולי גבינה ברוטב עגבניות ביתי - 400 גרם פסטה איטלקית קלאסית ברוטב עגבניות טרי. מתאים לכ-3-5 סועדים. מאפיית מרגליתות בית שמש',
    // 	hasAddOns: true,
    // 	addOns: [{ id: 'cheese-cream', name: 'תוספת הקרמת גבינה צהובה', price: 20 }],
    // },
    // {
    // 	id: 162,
    // 	name: 'רביולי פסטו',
    // 	category: 'dairy-meals',
    // 	subcategory: 'pastas',
    // 	price: 180,
    // 	image: '/milkMeals/ravioli.jpeg',
    // 	description:
    // 		'רביולי גבינה ברוטב פסטו טרי - 400 גרם פסטה איטלקית ברוטב בזיליקום ואגוזי צנובר. פסטה ירוקה ורעננת. מאפיית מרגליתות בית שמש',
    // 	hasAddOns: true,
    // 	addOns: [{ id: 'cheese-cream', name: 'תוספת הקרמת גבינה צהובה', price: 20 }],
    // },
    // {
    // 	id: 163,
    // 	name: 'דג סלמון שלם בפסטו ושקדים',
    // 	category: 'dairy-meals',
    // 	subcategory: 'pastas',
    // 	price: 350,
    // 	image: '',
    // 	description: 'דג סלמון שלם בפסטו ושקדים מעוצב - כ1.5 ק"ג. מאפיית מרגליתות בית שמש',
    // },
    {
      id: 164,
      name: "פלטת ירקות",
      category: "dairy-meals",
      subcategory: "salads",
      price: 300,
      image: "/milkMeals/vegetables.jpeg",
      description: "פלטת ירקות טריים מעוצבת. מגוון ירקות עונתיים צבעוניים. פלטה מרשימה ובריאה לאירועים, למסיבות ולארוח אורחים. מעוצבת בדיוק בקו העיצוב של מאפיית מרגליתות בית שמש."
    },
    {
      id: 165,
      name: "פלטת פירות",
      category: "dairy-meals",
      subcategory: "salads",
      price: 300,
      image: "/milkMeals/fruitplatter.jpeg",
      description: "פלטת פירות מעוצבת. מגוון פירות עונתיים צבעוניים. פלטה מרשימה ובריאה לאירועים, למסיבות ולארוח אורחים. מעוצבת בדיוק בקו העיצוב של מאפיית מרגליתות בית שמש."
    },
    // {
    // 	id: 166,
    // 	name: 'תפוח אדמה מוקרם',
    // 	category: 'dairy-meals',
    // 	subcategory: 'pastas',
    // 	price: 150,
    // 	image: '',
    // 	description:
    // 		'תפוח אדמה מוקרם ברוטב שמנת, פיטריות וערמונים. תפוח אדמה טרי מוקרם דק וגולדי, משולב ברוטב שמנת קרמי עשיר עם פיטריות טריות וערמונים המוסיפים טעם עדין. מנה חגיגית ומרשימה לאירוח ולימי חג. מתאים לכ-6 סועדים. מאפיית מרגליתות בית שמש',
    // 	hasAddOns: true,
    // 	addOns: [{ id: 'cheese-cream', name: 'תוספת הקרמת גבינה צהובה', price: 20 }],
    // },
    // מגשי אירועים
    {
      id: 170,
      name: "קינוחי כוסות מעוצבים חלבי",
      category: "events",
      subcategory: "events",
      price: 300,
      image: "/desserts/cupdeserts.jpeg",
      description: "קינוחי כוסות מעוצבים לאירועים - 25 כוסות ב-2-3 טעמים. קינוחים מיני אלגנטיים לבר מתוקים, חתונות, בר/בת מצווה ואירועים. מאפיית מרגליתות בית שמש"
    },
    // {
    // 	id: 171,
    // 	name: 'פקעות בוטנים',
    // 	category: 'events',
    // 	subcategory: 'events',
    // 	price: 280,
    // 	image: '',
    // 	description:
    // 		'פקעות בוטנים מרוקאיות מסורתיות - כ-40 יחידות. עוגיות חגיגיות במילוי בוטנים עשיר. מושלם למימונה, לחינה ולאירועים משפחתיים. מאפיית מרגליתות בית שמש',
    // },
    // {
    // 	id: 172,
    // 	name: 'מקרוד',
    // 	category: 'events',
    // 	subcategory: 'events',
    // 	price: 240,
    // 	image: '',
    // 	description:
    // 		'מקרוד מרוקאי מסורתי - כ-30 יחידות. עוגיות סולת ממולאות תמרים, מטוגנות וטבולות בדבש טבעי. קינוח מסורתי למימונה ולחגים. מאפיית מרגליתות בית שמש',
    // },
    {
      id: 173,
      name: "אצבעות פילו שקדים בדבש",
      category: "events",
      subcategory: "events",
      price: 200,
      image: "",
      description: "אצבעות פילו פריכות בדבש - כ-25 יחידות. אצבעות פילו זהובות במילוי שקדים או חלבה או אגוזים וסירופ דבש עשיר. קינוח מזרחי מפנק לאירועים. מאפיית מרגליתות בית שמש"
    },
    {
      id: 174,
      name: "סיגר מטוגן במילוי",
      category: "events",
      subcategory: "events",
      price: 200,
      image: "/desserts/sigars.jpeg",
      description: "סיגרים מרוקאיים במילוי שקדים/ אגוזים/ קוקוס - כ-20 יחידות. סיגרי פילו מטוגנים זהובים במילוי שקדים או אגוזים או קוקוס. קינוח חגיגי למימונה ולאירועים. מאפיית מרגליתות בית שמש"
    },
    {
      id: 177,
      name: "ספינג",
      category: "events",
      subcategory: "events",
      price: 180,
      image: "/desserts/sfing.jpeg",
      description: "מגש ספינג מרוקאי מסורתי - כ-32 יחידות. כדורי בצק מטוגנים זהובים בסירופ דבש מתוק. קינוח מסורתי לחנוכה, למימונה ולאירועים. מאפיית מרגליתות בית שמש"
    },
    {
      id: 178,
      name: "באקלאווה",
      category: "events",
      subcategory: "events",
      price: 210,
      image: "/desserts/baklawa.jpeg",
      description: "באקלאווה ביתית מסורתית - כ-30 יחידות. שכבות פילו פריכות במילוי אגוזים וסירופ דבש עשיר. קינוח מזרחי קלאסי לאירועים ולחגים. מאפיית מרגליתות בית שמש"
    },
    // עוגות יום הולדת ואירועים
    {
      id: 190,
      name: "עוגת יום הולדת קלאסית",
      category: "birthday-cakes",
      price: 300,
      image: "/cakes/birthdayCakes/choclateBirthday.jpeg",
      description: "עוגת יום הולדת קלאסית - עוגת שכבות עם קרם וניל ופירות טריים. עוגה ל-10 מנות מושלמת לימי הולדת לילדים ולמבוגרים. הזמנת עוגות בבית שמש - מאפיית מרגליתות",
      popular: true
    },
    {
      id: 191,
      name: "עוגת יום הולדת בצורות",
      category: "birthday-cakes",
      price: 350,
      image: "/cakes/birthdayCakes/kidsbirthday.jpg",
      description: "עוגת שוקולד ליום הולדת - עוגת שכבות שוקולד עשירה עם גנאש בלגי. עוגה ל-20 מנות לאוהבי שוקולד. הזמנת עוגות יום הולדת בבית שמש - מאפיית מרגליתות",
      popular: true
    },
    //{
    // 	id: 192,
    // 	name: 'עוגת ממתקים',
    // 	category: 'birthday-cakes',
    // 	price: 350,
    // 	image: '',
    // 	description:
    // 		'עוגת ממתקים מעוצבת - עוגה צבעונית מכוסה בממתקים וסוכריות. עוגה מרשימה ומושכת עין ליום הולדת לילדים. הזמנת עוגות מעוצבות בבית שמש - מאפיית מרגליתות',
    // },
    // {
    // 	id: 193,
    // 	name: 'עוגת טו בשבט מעוצבת',
    // 	category: 'birthday-cakes',
    // 	price: 250,
    // 	image: '',
    // 	description:
    // 		'עוגת טו בשבט מעוצבת - עוגת שוקולד בעיצוב פירות וטבע לחג האילנות. עוגה חגיגית לגנים, לכיתות ולמשפחות. הזמנת עוגות לחגים בבית שמש - מאפיית מרגליתות',
    // },
    // {
    // 	id: 194,
    // 	name: 'עוגת מספר',
    // 	category: 'birthday-cakes',
    // 	price: 220,
    // 	image: '',
    // 	description:
    // 		'עוגת מספר מעוצבת - עוגה בצורת מספר הגיל עם קרם, פירות ומקרונים. עוגת יום הולדת אינסטגרמית ומרשימה. הזמנת עוגות מספר בבית שמש - מאפיית מרגליתות',
    // 	popular: true,
    // },
    {
      id: 195,
      name: "עוגת בת/בר מצווה",
      category: "birthday-cakes",
      price: 350,
      image: "/cakes/birthdayCakes/birthdaycake.png",
      description: "עוגת בר מצווה / בת מצווה מעוצבת - עוגה ל-20 מנות בעיצוב אישי מרשים. עוגה חגיגית לאירוע המשפחתי הגדול. הזמנת עוגות לבר מצווה בבית שמש - מאפיית מרגליתות"
    },
    {
      id: 196,
      name: "עוגת יום הולדת ללא גלוטן",
      category: ["birthday-cakes", "gluten-free"],
      price: 350,
      image: "/cakes/birthdayCakes/glutenfreebirthday.jpg",
      description: "עוגת יום הולדת ללא גלוטן מקמח שקדים עוגה מעולה טעימה ויוקרתית כ-30 מנות. עיצוב לפי בקשה. הזמנת עוגות יום הולדת ללא גלוטן בבית שמש - מאפיית מרגליתות"
    },
    // {
    // 	id: 197,
    // 	name: 'קאפקייקס מעוצבים (12 יח)',
    // 	category: 'birthday-cakes',
    // 	price: 120,
    // 	image: '',
    // 	description:
    // 		'קאפקייקס מעוצבים - 12 יחידות בעיצוב לפי נושא לבחירה. קאפקייקס ליום הולדת, למסיבות ולאירועים. צבעים ועיצוב אישי. מאפיית מרגליתות בית שמש',
    // },
    {
      id: 198,
      name: "עוגת גבינה ליום הולדת",
      category: "birthday-cakes",
      price: 160,
      image: "/cakes/cheasecake.jpeg",
      description: "עוגת גבינה ליום הולדת - עוגת גבינה אפויה קרמית ל-10 מנות עם ציפוי פירות טריים. עוגה קלילה לאוהבי גבינה. הזמנת עוגות בבית שמש - מאפיית מרגליתות"
    },
    {
      id: 199,
      name: "עוגה מעוצבת בהתאמה אישית",
      category: "birthday-cakes",
      price: 280,
      image: "/cakes/birthdayCakes/eventcake.jpeg",
      description: "עוגה מעוצבת בהתאמה אישית - עוגה בעיצוב ייחודי לפי דמיון ובקשה. צרו קשר לתיאום פרטים, טעמים ועיצוב. הזמנת עוגות מיוחדות בבית שמש - מאפיית מרגליתות",
      popular: true
    },
    {
      id: 200,
      name: "עוגה סיום מסכת",
      category: "birthday-cakes",
      price: 280,
      image: "/cakes/birthdayCakes/siyummasechetcake.jpeg",
      description: "עוגה מעוצבת בהתאמה אישית - עוגה בעיצוב ייחודי לפי דמיון ובקשה. צרו קשר לתיאום פרטים, טעמים ועיצוב. הזמנת עוגות מיוחדות בבית שמש - מאפיית מרגליתות",
      popular: true
    },
    // ==================== חוגי אפייה ====================
    {
      id: 210,
      name: "חוג אפייה לגילאי 3.5-12",
      category: "baking-workshops",
      price: 0,
      image: "/margalitaf1.jpeg",
      description: "חוג אפייה מקצועי לילדים בקבוצות גיל מותאמות - גילאי 3.5-12. הילדים לומדים לאפות מתוך הנאה, יצירתיות ועצמאות. כל קבוצה מותאמת לרמת הגיל עם מתכונים מיוחדים. חוג שבועי במרגליטף מבית מרגליתות",
      popular: true
    },
    {
      id: 211,
      name: "חוג בישול לגילאי 9-12",
      category: "baking-workshops",
      price: 0,
      image: "/margalitaf2.jpeg",
      description: "חוג בישול לילדים גדולים גילאי 9-12 - לומדים טכניקות בישול אמיתיות, מתכונים מורכבים יותר ועצמאות במטבח. הילדים יוצאים עם מיומנויות שיישמשו אותם לכל החיים. חוג שבועי במרגליטף מבית מרגליתות"
    },
    {
      id: 212,
      name: "יצירה בעקבות סיפור לגילאי 4-9",
      category: "baking-workshops",
      price: 0,
      image: "/margalitaf1.jpeg",
      description: "חוג יצירה ייחודי לגילאי 4-9 שמשלב סיפור ודמיון עם יצירה ביד. כל מפגש מתחיל בסיפור קסום שממנו הילדים יוצרים יצירת אמנות משלהם. חוג מפתח יצירתיות, ריכוז ואהבה לאמנות. במרגליטף מבית מרגליתות"
    },
    {
      id: 213,
      name: "חוג אוריגמי וקיפולי מפיות לגילאי 6-12",
      category: "baking-workshops",
      price: 0,
      image: "/margalitaf2.jpeg",
      description: "חוג אוריגמי וקיפולי מפיות לילדים גילאי 6-12 - אמנות קיפול הנייר היפנית שמפתחת סבלנות, ריכוז וקואורדינציה עדינה. מדגמים פשוטים ועד מורכבים לפי הרמה. חוג מרגיע ומאתגר בו-זמנית. במרגליטף מבית מרגליתות"
    }
  ]);
  const getProductsByCategory = computed(() => {
    return (categoryId) => products.value.filter((p) => {
      if (Array.isArray(p.category)) {
        return p.category.includes(categoryId);
      }
      return p.category === categoryId;
    });
  });
  const getProductsBySubcategory = computed(() => {
    return (subcategoryId) => products.value.filter((p) => p.subcategory === subcategoryId);
  });
  const getPopularByCategory = computed(() => {
    return (categoryId, limit = 4) => {
      const categoryProducts = products.value.filter((p) => {
        if (Array.isArray(p.category)) {
          return p.category.includes(categoryId);
        }
        return p.category === categoryId;
      });
      const popular = categoryProducts.filter((p) => p.popular);
      const others = categoryProducts.filter((p) => !p.popular);
      return [...popular, ...others].slice(0, limit);
    };
  });
  const popularProducts = computed(() => {
    return products.value.filter((p) => p.popular);
  });
  const getCategoryPreview = computed(() => {
    return categories.value.map((category) => ({
      ...category,
      products: getPopularByCategory.value(category.id, 5)
    }));
  });
  function searchProducts(query2) {
    if (!query2 || query2.trim() === "") return [];
    const searchTerm = query2.trim().toLowerCase();
    return products.value.filter((product) => {
      const productCategories = Array.isArray(product.category) ? product.category : [product.category];
      if (productCategories.includes("baking-workshops")) return false;
      return product.name.toLowerCase().includes(searchTerm) || product.description && product.description.toLowerCase().includes(searchTerm);
    }).map((product) => {
      const categoryId = Array.isArray(product.category) ? product.category[0] : product.category;
      const category = categories.value.find((c) => c.id === categoryId);
      return {
        ...product,
        categoryId: product.category,
        categoryName: (category == null ? void 0 : category.name) || ""
      };
    });
  }
  function getCategoryById(categoryId) {
    return categories.value.find((cat) => cat.id === categoryId);
  }
  function getProductById(productId) {
    const product = products.value.find((p) => p.id === productId);
    if (product) {
      return {
        ...product,
        categoryId: product.category
      };
    }
    return null;
  }
  return {
    categories,
    products,
    dairySubcategories,
    getProductsByCategory,
    getProductsBySubcategory,
    getPopularByCategory,
    popularProducts,
    getCategoryPreview,
    searchProducts,
    getCategoryById,
    getProductById
  };
});
const _sfc_main$A = {
  __name: "SearchBar",
  __ssrInlineRender: true,
  setup(__props) {
    const menuStore = useMenuStore();
    const isExpanded = ref(false);
    const searchQuery = ref("");
    ref(null);
    const filteredProducts = computed(() => {
      if (!searchQuery.value.trim()) return [];
      return menuStore.searchProducts(searchQuery.value);
    });
    function getCategoryName(categoryId) {
      const category = menuStore.getCategoryById(categoryId);
      return (category == null ? void 0 : category.name) || "";
    }
    function closeSearch() {
      isExpanded.value = false;
      searchQuery.value = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["search-wrapper", { expanded: isExpanded.value }]
      }, _attrs))} data-v-5b952610><div class="search-container" data-v-5b952610>`);
      if (!isExpanded.value) {
        _push(`<button class="search-toggle" data-v-5b952610><span class="search-icon" data-v-5b952610>🔍</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="search-box" style="${ssrRenderStyle(isExpanded.value ? null : { display: "none" })}" data-v-5b952610><span class="search-icon" data-v-5b952610>🔍</span><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="חיפוש מוצרים..." class="search-input" data-v-5b952610>`);
      if (searchQuery.value) {
        _push(`<button class="clear-btn" data-v-5b952610>✕</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="close-btn" data-v-5b952610>✕</button></div></div>`);
      if (isExpanded.value && searchQuery.value && filteredProducts.value.length > 0) {
        _push(`<div class="search-results" data-v-5b952610><div class="results-header" data-v-5b952610><span data-v-5b952610>${ssrInterpolate(filteredProducts.value.length)} תוצאות</span></div><div class="results-list" data-v-5b952610><!--[-->`);
        ssrRenderList(filteredProducts.value.slice(0, 8), (product) => {
          _push(ssrRenderComponent(_component_router_link, {
            key: product.id,
            to: `/menu/${product.categoryId}?highlight=${product.id}`,
            class: "result-item",
            onClick: closeSearch
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="result-image" data-v-5b952610${_scopeId}>`);
                if (product.image) {
                  _push2(`<img${ssrRenderAttr("src", product.image)}${ssrRenderAttr("alt", product.name)} data-v-5b952610${_scopeId}>`);
                } else {
                  _push2(`<span class="result-image-placeholder" data-v-5b952610${_scopeId}>📦</span>`);
                }
                _push2(`</div><div class="result-info" data-v-5b952610${_scopeId}><span class="result-name" data-v-5b952610${_scopeId}>${ssrInterpolate(product.name)}</span><span class="result-category" data-v-5b952610${_scopeId}>${ssrInterpolate(getCategoryName(product.categoryId))}</span></div><span class="result-price" data-v-5b952610${_scopeId}>₪${ssrInterpolate(product.price)}</span>`);
              } else {
                return [
                  createVNode("div", { class: "result-image" }, [
                    product.image ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: product.image,
                      alt: product.name
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                      key: 1,
                      class: "result-image-placeholder"
                    }, "📦"))
                  ]),
                  createVNode("div", { class: "result-info" }, [
                    createVNode("span", { class: "result-name" }, toDisplayString(product.name), 1),
                    createVNode("span", { class: "result-category" }, toDisplayString(getCategoryName(product.categoryId)), 1)
                  ]),
                  createVNode("span", { class: "result-price" }, "₪" + toDisplayString(product.price), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
        if (filteredProducts.value.length > 8) {
          _push(ssrRenderComponent(_component_router_link, {
            to: "/menu",
            class: "view-all-btn",
            onClick: closeSearch
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` צפייה בכל ${ssrInterpolate(filteredProducts.value.length)} התוצאות `);
              } else {
                return [
                  createTextVNode(" צפייה בכל " + toDisplayString(filteredProducts.value.length) + " התוצאות ", 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (isExpanded.value && searchQuery.value && filteredProducts.value.length === 0) {
        _push(`<div class="search-results no-results" data-v-5b952610><span class="no-results-icon" data-v-5b952610>🔍</span><p data-v-5b952610>לא נמצאו מוצרים עבור &quot;${ssrInterpolate(searchQuery.value)}&quot;</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/menu",
          class: "browse-link",
          onClick: closeSearch
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` לצפייה בתפריט המלא `);
            } else {
              return [
                createTextVNode(" לצפייה בתפריט המלא ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (isExpanded.value) {
        _push(`<div class="search-overlay" data-v-5b952610></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/SearchBar.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const SearchBar = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["__scopeId", "data-v-5b952610"]]);
const useToastStore = defineStore("toast", () => {
  const toasts = ref([]);
  let nextId = 0;
  function addToast(message2, type = "success", duration = 3e3) {
    const id = nextId++;
    toasts.value.push({
      id,
      message: message2,
      type,
      // success, error, warning, info
      duration
    });
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }
  function removeToast(id) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }
  function success(message2, duration = 3e3) {
    return addToast(message2, "success", duration);
  }
  function error(message2, duration = 4e3) {
    return addToast(message2, "error", duration);
  }
  function warning(message2, duration = 3500) {
    return addToast(message2, "warning", duration);
  }
  function info(message2, duration = 3e3) {
    return addToast(message2, "info", duration);
  }
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
});
const _sfc_main$z = {
  __name: "ToastContainer",
  __ssrInlineRender: true,
  setup(__props) {
    const toastStore = useToastStore();
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="toast-container" data-v-6711645a><!--[-->`);
        ssrRenderList(unref(toastStore).toasts, (toast) => {
          _push2(`<div class="${ssrRenderClass([toast.type, "toast"])}" data-v-6711645a><span class="toast-icon" data-v-6711645a>`);
          if (toast.type === "success") {
            _push2(`<!--[-->✓<!--]-->`);
          } else if (toast.type === "error") {
            _push2(`<!--[-->✕<!--]-->`);
          } else if (toast.type === "warning") {
            _push2(`<!--[-->⚠<!--]-->`);
          } else {
            _push2(`<!--[-->ℹ<!--]-->`);
          }
          _push2(`</span><span class="toast-message" data-v-6711645a>${ssrInterpolate(toast.message)}</span><button class="toast-close" data-v-6711645a>✕</button><div class="toast-progress" style="${ssrRenderStyle({ animationDuration: toast.duration + "ms" })}" data-v-6711645a></div></div>`);
        });
        _push2(`<!--]--></div>`);
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/ToastContainer.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const ToastContainer = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["__scopeId", "data-v-6711645a"]]);
const firebaseConfig = {
  apiKey: "AIzaSyDKgaceD3l-uFdbiz4Ose_uhCFW1a4a_l0",
  authDomain: "margalitut.firebaseapp.com",
  projectId: "margalitut",
  storageBucket: "margalitut.firebasestorage.app",
  messagingSenderId: "77219137608",
  appId: "1:77219137608:web:2017ab65c2dc5c77a2b07d",
  measurementId: "G-PLGDHJ0T5S"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const ORDERS_COLLECTION = "orders";
async function createOrder(orderData) {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      status: "pending",
      // pending, confirmed, preparing, ready, delivered, cancelled
      paymentStatus: orderData.paymentMethod === "cash" ? "pending" : "awaiting",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}
async function getAllOrders() {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all orders:", error);
    throw error;
  }
}
async function checkCouponUsage(couponCode, phone) {
  try {
    const phoneQuery = query(
      collection(db, "coupon_usage"),
      where("couponCode", "==", couponCode.toUpperCase()),
      where("phone", "==", phone)
    );
    const phoneSnapshot = await getDocs(phoneQuery);
    return { used: !phoneSnapshot.empty };
  } catch (error) {
    console.error("Error checking coupon usage:", error);
    return { used: false };
  }
}
async function saveCouponUsage(couponCode, phone, orderId) {
  try {
    await addDoc(collection(db, "coupon_usage"), {
      couponCode: couponCode.toUpperCase(),
      phone,
      orderId,
      usedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error saving coupon usage:", error);
    return false;
  }
}
async function getApprovedReviews() {
  try {
    const q = query(collection(db, "reviews"), where("status", "==", "approved"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting reviews:", error);
    return [];
  }
}
async function getAllReviews() {
  try {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all reviews:", error);
    return [];
  }
}
const SERVICE_ID = "service_44th385";
const TEMPLATE_ID = "template_76chmaa";
const PUBLIC_KEY = "bGF3UY6_byYkOW7CT";
emailjs.init(PUBLIC_KEY);
async function sendOrderEmail(order) {
  var _a;
  try {
    const itemsList = order.items.map((item) => `• ${item.name} x${item.quantity} - ₪${item.price * item.quantity}`).join("\n");
    let deliveryInfo = "";
    if (order.delivery.option === "pickup") {
      deliveryInfo = "🏠 איסוף עצמי משכונת המשקפיים, בית שמש";
    } else {
      deliveryInfo = `🚗 משלוח ל: ${order.customer.address}
`;
      deliveryInfo += `ישוב: ${((_a = order.delivery.location) == null ? void 0 : _a.name) || ""}
`;
      if (order.delivery.price) {
        deliveryInfo += `מחיר משלוח: ₪${order.delivery.price}`;
      } else if (order.delivery.requiresCall) {
        deliveryInfo += `מחיר משלוח: ייקבע בטלפון`;
      }
    }
    let dateTime = "";
    if (order.date) dateTime += `תאריך: ${order.date}
`;
    if (order.time) dateTime += `שעה: ${order.time}`;
    if (!dateTime) dateTime = "לא צוין";
    const paymentLabels = {
      bit: "💙 Bit",
      paybox: "📦 PayBox",
      cash: "💵 מזומן"
    };
    let deliveryFee = "חינם";
    if (order.delivery.option === "delivery") {
      if (order.deliveryFee > 0) {
        deliveryFee = `₪${order.deliveryFee}`;
      } else if (order.delivery.requiresCall) {
        deliveryFee = "ייקבע בטלפון";
      }
    }
    const templateParams = {
      order_id: order.orderId,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      customer_email: order.customer.email || "לא צוין",
      delivery_info: deliveryInfo,
      date_time: dateTime,
      items_list: itemsList,
      subtotal: order.subtotal,
      delivery_fee: deliveryFee,
      total: order.total,
      payment_method: paymentLabels[order.payment.method] || order.payment.method,
      special_requests: order.specialRequests || "אין"
    };
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log("Email sent successfully:", response);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
const useOrderStore = defineStore("order", () => {
  function loadCartFromStorage() {
    try {
      const saved = localStorage.getItem("margalitut_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }
  function saveCartToStorage(cartData) {
    try {
      localStorage.setItem("margalitut_cart", JSON.stringify(cartData));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }
  const cart = ref(loadCartFromStorage());
  const appliedCoupon = ref(null);
  const couponError = ref("");
  const couponSuccess = ref("");
  const availableCoupons = ref([
    {
      code: "TASTING5",
      type: "percent",
      value: 5,
      minOrder: 40,
      description: "5% הנחה למשתתפי יריד הטעימות",
      active: true,
      expiresAt: /* @__PURE__ */ new Date("2025-02-18T20:00:00")
      // יום רביעי 20:00
    },
    {
      code: "WELCOME10",
      type: "percent",
      // percent או fixed
      value: 10,
      minOrder: 50,
      description: "10% הנחה על ההזמנה הראשונה",
      active: true
    },
    {
      code: "SWEET20",
      type: "fixed",
      value: 20,
      minOrder: 100,
      description: "₪20 הנחה בהזמנה מעל ₪100",
      active: true
    },
    {
      code: "FAMILY10",
      type: "percent",
      value: 10,
      minOrder: 200,
      description: "10% הנחה בהזמנה מעל ₪200",
      active: true
    },
    {
      code: "FREEDELIVERY",
      type: "freeDelivery",
      value: 0,
      minOrder: 250,
      description: "משלוח חינם בהזמנה מעל ₪250",
      active: true
    }
  ]);
  const customerInfo = ref({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: ""
  });
  const orderDate = ref("");
  const orderTime = ref("");
  const specialRequests = ref("");
  const orderHistory = ref([]);
  const isLoading = ref(false);
  const currentStep = ref(1);
  const lastOrder = ref(null);
  const deliveryOption = ref("pickup");
  const selectedLocation = ref("");
  const locations = ref([
    // אזור 1 - ₪20
    { id: "hamishkafayim", name: "המשקפיים", zone: 1, price: 20 },
    { id: "ramat-a", name: "רמת בית שמש א'", zone: 1, price: 20 },
    { id: "ramat-b", name: "רמת בית שמש ב'", zone: 1, price: 20 },
    { id: "ramat-c", name: "רמת בית שמש ג'", zone: 1, price: 20 },
    { id: "ramat-d", name: "רמת בית שמש ד'", zone: 1, price: 20 },
    { id: "ramat-e", name: "רמת בית שמש ה' (נווה שמיר)", zone: 1, price: 20 },
    // אזור 2 - ₪40
    { id: "merkaz", name: "מרכז העיר בית שמש", zone: 2, price: 40 },
    { id: "givat-saret", name: "גבעת שרת", zone: 2, price: 40 },
    { id: "tzora", name: "צרעה", zone: 2, price: 40 },
    { id: "zanoach", name: "זנוח", zone: 2, price: 40 },
    { id: "neve-michael", name: "נווה מיכאל", zone: 2, price: 40 },
    { id: "machseya", name: "מחסיה", zone: 2, price: 40 },
    { id: "yishi", name: "ישעי", zone: 2, price: 40 },
    { id: "zecharya", name: "זכריה", zone: 2, price: 40 },
    { id: "netiv-halamed", name: 'נתיב הל"ה', zone: 2, price: 40 },
    // אזור 3 - ייקבע בטלפון
    { id: "tzur-hadasa", name: "צור הדסה", zone: 3, price: null, requiresCall: true },
    { id: "kfar-uriya", name: "כפר אוריה", zone: 3, price: null, requiresCall: true },
    { id: "beit-meir", name: "בית מאיר", zone: 3, price: null, requiresCall: true },
    { id: "jerusalem", name: "ירושלים", zone: 3, price: null, requiresCall: true },
    { id: "modiin", name: "מודיעין", zone: 3, price: null, requiresCall: true },
    { id: "other", name: "אחר...", zone: 3, price: null, requiresCall: true }
  ]);
  const deliveryZones = ref([
    { id: 1, name: "אזור 1 - בית שמש", description: "שכונות בית שמש", price: 20, icon: "🏠" },
    { id: 2, name: "אזור 2 - סביבה קרובה", description: "ישובים סמוכים", price: 40, icon: "🚗" },
    { id: 3, name: "אזור 3 - רחוק", description: "מחיר ייקבע בטלפון", price: null, icon: "📞", requiresCall: true }
  ]);
  const paymentMethod = ref("");
  const paymentMethods = ref([
    {
      id: "bit",
      name: "Bit",
      description: "תשלום מהיר ומאובטח",
      icon: "💙",
      phone: "0524441093",
      link: "https://www.bitpay.co.il/app/me/0524441093",
      instructions: "לחצו על הכפתור או שלחו תשלום למספר 0524441093"
    },
    {
      id: "paybox",
      name: "PayBox",
      description: "תשלום דרך פייבוקס",
      icon: "📦",
      phone: "0528460331",
      link: "https://payboxapp.page.link/iChLPfvwFW4rGqDK6",
      instructions: "לחצו על הכפתור או שלחו תשלום למספר 0528460331"
    },
    {
      id: "cash",
      name: "מזומן",
      description: "תשלום במעמד המסירה",
      icon: "💵",
      instructions: "התשלום יתבצע בעת קבלת ההזמנה"
    }
  ]);
  const cartTotal = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  });
  const cartItemCount = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0);
  });
  const selectedLocationData = computed(() => {
    return locations.value.find((loc) => loc.id === selectedLocation.value);
  });
  const deliveryPrice = computed(() => {
    if (deliveryOption.value === "pickup") return 0;
    if (!selectedLocationData.value) return 0;
    return selectedLocationData.value.price || 0;
  });
  const deliveryRequiresCall = computed(() => {
    if (deliveryOption.value === "pickup") return false;
    if (!selectedLocationData.value) return false;
    return selectedLocationData.value.requiresCall || false;
  });
  const selectedDeliveryZone = computed(() => {
    if (!selectedLocationData.value) return null;
    return deliveryZones.value.find((z) => z.id === selectedLocationData.value.zone);
  });
  const orderTotal = computed(() => {
    return cartTotal.value + deliveryPrice.value;
  });
  const couponDiscount = computed(() => {
    if (!appliedCoupon.value) return 0;
    const coupon = appliedCoupon.value;
    if (coupon.type === "percent") {
      return Math.round(cartTotal.value * (coupon.value / 100));
    } else if (coupon.type === "fixed") {
      return coupon.value;
    } else if (coupon.type === "freeDelivery") {
      return deliveryPrice.value;
    }
    return 0;
  });
  const finalTotal = computed(() => {
    let total = orderTotal.value - couponDiscount.value;
    return Math.max(total, 0);
  });
  const selectedPaymentMethod = computed(() => {
    return paymentMethods.value.find((m) => m.id === paymentMethod.value);
  });
  const isCartEmpty = computed(() => cart.value.length === 0);
  const canProceedToCheckout = computed(() => !isCartEmpty.value);
  const canProceedToPayment = computed(() => {
    const hasCustomerInfo = customerInfo.value.name && customerInfo.value.phone;
    const hasDeliveryChoice = deliveryOption.value === "pickup" || deliveryOption.value === "delivery" && selectedLocation.value;
    const hasAddress = deliveryOption.value === "pickup" || customerInfo.value.address;
    return hasCustomerInfo && hasDeliveryChoice && hasAddress;
  });
  const canCompleteOrder = computed(() => {
    return canProceedToPayment.value && paymentMethod.value;
  });
  const zone1Locations = computed(() => locations.value.filter((loc) => loc.zone === 1));
  const zone2Locations = computed(() => locations.value.filter((loc) => loc.zone === 2));
  const zone3Locations = computed(() => locations.value.filter((loc) => loc.zone === 3));
  function addToCart(product, quantity = 1) {
    const toastStore = useToastStore();
    const existingItem = cart.value.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
      toastStore.success(`הכמות עודכנה: ${product.name} (${existingItem.quantity})`);
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
      toastStore.success(`${product.name} נוסף לסל 🛒`);
    }
  }
  function removeFromCart(productId) {
    const toastStore = useToastStore();
    const item = cart.value.find((item2) => item2.id === productId);
    cart.value = cart.value.filter((item2) => item2.id !== productId);
    if (item) {
      toastStore.info(`${item.name} הוסר מהסל`);
    }
  }
  function updateQuantity(productId, quantity) {
    const item = cart.value.find((item2) => item2.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }
  function clearCart() {
    const toastStore = useToastStore();
    cart.value = [];
    localStorage.removeItem("margalitut_cart");
    toastStore.info("הסל רוקן");
  }
  function setCustomerInfo(info) {
    customerInfo.value = { ...customerInfo.value, ...info };
  }
  function setDeliveryOption(option) {
    deliveryOption.value = option;
    if (option === "pickup") {
      selectedLocation.value = "";
    }
  }
  function setSelectedLocation(locationId) {
    selectedLocation.value = locationId;
    const location = locations.value.find((loc) => loc.id === locationId);
    if (location) {
      customerInfo.value.city = location.name;
    }
  }
  function setPaymentMethod(method) {
    paymentMethod.value = method;
  }
  function setStep(step) {
    currentStep.value = step;
  }
  function nextStep() {
    if (currentStep.value < 5) {
      currentStep.value++;
    }
  }
  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  }
  function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 4);
    return `MRG-${timestamp}-${random}`.toUpperCase();
  }
  function generateWhatsAppMessage() {
    var _a, _b;
    const orderId = ((_a = lastOrder.value) == null ? void 0 : _a.orderId) || generateOrderId();
    let message2 = `🍓 *הזמנה חדשה ממרגליתות*
`;
    message2 += `📋 מספר הזמנה: ${orderId}

`;
    message2 += `👤 *פרטי לקוח:*
`;
    message2 += `שם: ${customerInfo.value.name}
`;
    message2 += `טלפון: ${customerInfo.value.phone}
`;
    if (customerInfo.value.email) {
      message2 += `אימייל: ${customerInfo.value.email}
`;
    }
    message2 += `
`;
    message2 += `📦 *אופן קבלה:*
`;
    if (deliveryOption.value === "pickup") {
      message2 += `איסוף עצמי משכונת המשקפיים, בית שמש
`;
    } else {
      const location = selectedLocationData.value;
      message2 += `משלוח ל: ${customerInfo.value.address}
`;
      message2 += `ישוב: ${(location == null ? void 0 : location.name) || customerInfo.value.city}
`;
      if (location) {
        if (location.price) {
          message2 += `מחיר משלוח: ₪${location.price}
`;
        } else {
          message2 += `מחיר משלוח: ייקבע בטלפון
`;
        }
      }
    }
    message2 += `
`;
    if (orderDate.value || orderTime.value) {
      message2 += `📅 *מועד מבוקש:*
`;
      if (orderDate.value) message2 += `תאריך: ${orderDate.value}
`;
      if (orderTime.value) message2 += `שעה: ${orderTime.value}
`;
      message2 += `
`;
    }
    message2 += `🛒 *פריטים:*
`;
    cart.value.forEach((item) => {
      message2 += `• ${item.name} x${item.quantity} - ₪${item.price * item.quantity}
`;
    });
    message2 += `
`;
    message2 += `💰 *סיכום:*
`;
    message2 += `סה"כ מוצרים: ₪${cartTotal.value}
`;
    if (deliveryOption.value === "delivery" && deliveryPrice.value > 0) {
      message2 += `משלוח: ₪${deliveryPrice.value}
`;
    }
    if (deliveryRequiresCall.value) {
      message2 += `משלוח: ייקבע בטלפון
`;
    }
    message2 += `*סה"כ לתשלום: ₪${orderTotal.value}${deliveryRequiresCall.value ? " + משלוח" : ""}*

`;
    message2 += `💳 *אמצעי תשלום:* ${((_b = selectedPaymentMethod.value) == null ? void 0 : _b.name) || ""}
`;
    if (specialRequests.value) {
      message2 += `
📝 *הערות:*
${specialRequests.value}
`;
    }
    return { message: message2, orderId };
  }
  function getWhatsAppLink() {
    const { message: message2 } = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message2);
    return `https://wa.me/972528460331?text=${encodedMessage}`;
  }
  async function submitOrder() {
    const toastStore = useToastStore();
    isLoading.value = true;
    try {
      const orderId = generateOrderId();
      const orderData = {
        orderId,
        items: [...cart.value],
        customer: { ...customerInfo.value },
        delivery: {
          option: deliveryOption.value,
          location: selectedLocationData.value ? { ...selectedLocationData.value } : null,
          price: hasFreeDelivery.value ? 0 : deliveryPrice.value,
          requiresCall: deliveryRequiresCall.value && !hasFreeDelivery.value
        },
        payment: {
          method: paymentMethod.value
        },
        coupon: appliedCoupon.value ? {
          code: appliedCoupon.value.code,
          discount: couponDiscount.value
        } : null,
        date: orderDate.value,
        time: orderTime.value,
        specialRequests: specialRequests.value,
        subtotal: cartTotal.value,
        deliveryFee: hasFreeDelivery.value ? 0 : deliveryPrice.value,
        discount: couponDiscount.value,
        total: finalTotal.value
      };
      const savedOrder = await createOrder(orderData);
      if (appliedCoupon.value) {
        await saveCouponUsage(appliedCoupon.value.code, customerInfo.value.phone, savedOrder.id);
      }
      sendOrderEmail(orderData).catch((err) => {
        console.error("Email notification failed:", err);
      });
      lastOrder.value = savedOrder;
      orderHistory.value.unshift(savedOrder);
      saveOrderToLocalStorage(savedOrder);
      currentStep.value = 5;
      toastStore.success("ההזמנה נשלחה בהצלחה! 🎉", 5e3);
      return savedOrder;
    } catch (error) {
      console.error("Order submission failed:", error);
      toastStore.error("שגיאה בשליחת ההזמנה, נסו שוב");
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  function saveOrderToLocalStorage(order) {
    try {
      const phone = order.customer.phone;
      const storageKey = `orders_${phone}`;
      const existingOrders = JSON.parse(localStorage.getItem(storageKey) || "[]");
      existingOrders.unshift({
        id: order.id,
        orderId: order.orderId,
        total: order.total,
        status: order.status,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      localStorage.setItem(storageKey, JSON.stringify(existingOrders.slice(0, 20)));
    } catch (error) {
      console.error("Failed to save order to localStorage:", error);
    }
  }
  function getOrdersFromLocalStorage(phone) {
    try {
      const storageKey = `orders_${phone}`;
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch (error) {
      console.error("Failed to get orders from localStorage:", error);
      return [];
    }
  }
  function resetOrder() {
    clearCart();
    customerInfo.value = { name: "", phone: "", email: "", address: "", city: "" };
    deliveryOption.value = "pickup";
    selectedLocation.value = "";
    paymentMethod.value = "";
    orderDate.value = "";
    orderTime.value = "";
    specialRequests.value = "";
    currentStep.value = 1;
    lastOrder.value = null;
  }
  watch(
    cart,
    (newCart) => {
      saveCartToStorage(newCart);
    },
    { deep: true }
  );
  async function applyCoupon(code) {
    const toastStore = useToastStore();
    couponError.value = "";
    couponSuccess.value = "";
    if (!code || code.trim() === "") {
      couponError.value = "נא להזין קוד קופון";
      return false;
    }
    const coupon = availableCoupons.value.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!coupon) {
      couponError.value = "קוד הקופון לא תקין";
      return false;
    }
    if (cartTotal.value < coupon.minOrder) {
      couponError.value = `הקופון תקף להזמנה מעל ₪${coupon.minOrder}`;
      return false;
    }
    if (!customerInfo.value.phone) {
      couponError.value = "נא להזין מספר טלפון קודם";
      return false;
    }
    const usage = await checkCouponUsage(code, customerInfo.value.phone);
    if (usage.used) {
      couponError.value = "הקופון כבר נוצל עם מספר טלפון זה";
      return false;
    }
    appliedCoupon.value = coupon;
    couponSuccess.value = coupon.description;
    toastStore.success(`🎫 ${coupon.description}`);
    return true;
  }
  function removeCoupon() {
    appliedCoupon.value = null;
    couponError.value = "";
    couponSuccess.value = "";
  }
  const hasFreeDelivery = computed(() => {
    var _a;
    return ((_a = appliedCoupon.value) == null ? void 0 : _a.type) === "freeDelivery";
  });
  return {
    // State
    cart,
    customerInfo,
    orderDate,
    orderTime,
    specialRequests,
    orderHistory,
    isLoading,
    currentStep,
    lastOrder,
    deliveryOption,
    selectedLocation,
    locations,
    deliveryZones,
    paymentMethod,
    paymentMethods,
    // Getters
    cartTotal,
    cartItemCount,
    selectedLocationData,
    deliveryPrice,
    deliveryRequiresCall,
    selectedDeliveryZone,
    orderTotal,
    selectedPaymentMethod,
    isCartEmpty,
    canProceedToCheckout,
    canProceedToPayment,
    canCompleteOrder,
    zone1Locations,
    zone2Locations,
    zone3Locations,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCustomerInfo,
    setDeliveryOption,
    setSelectedLocation,
    setPaymentMethod,
    setStep,
    nextStep,
    prevStep,
    generateWhatsAppMessage,
    getWhatsAppLink,
    submitOrder,
    resetOrder,
    getOrdersFromLocalStorage,
    // Coupons
    appliedCoupon,
    couponError,
    couponSuccess,
    couponDiscount,
    finalTotal,
    hasFreeDelivery,
    applyCoupon,
    removeCoupon
  };
});
const _sfc_main$y = {
  __name: "CartDrawer",
  __ssrInlineRender: true,
  setup(__props) {
    const orderStore = useOrderStore();
    const uiStore = useUIStore();
    const isOpen = computed(() => uiStore.isCartDrawerOpen);
    const cart = computed(() => orderStore.cart);
    const cartTotal = computed(() => orderStore.cartTotal);
    const cartItemCount = computed(() => orderStore.cartItemCount);
    const isCartEmpty = computed(() => orderStore.isCartEmpty);
    const closeCart = () => {
      uiStore.closeCartDrawer();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      ssrRenderTeleport(_push, (_push2) => {
        if (isOpen.value) {
          _push2(`<div class="cart-overlay" data-v-9f0099f7></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (isOpen.value) {
          _push2(`<div class="cart-drawer" data-v-9f0099f7><div class="cart-header" data-v-9f0099f7><h2 class="cart-title" data-v-9f0099f7><span class="cart-icon" data-v-9f0099f7>🛒</span> העגלה שלי `);
          if (cartItemCount.value > 0) {
            _push2(`<span class="cart-badge" data-v-9f0099f7>${ssrInterpolate(cartItemCount.value)}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</h2><button class="close-btn" data-v-9f0099f7>✕</button></div>`);
          if (isCartEmpty.value) {
            _push2(`<div class="cart-empty" data-v-9f0099f7><span class="empty-icon" data-v-9f0099f7>🛒</span><h3 data-v-9f0099f7>העגלה ריקה</h3><p data-v-9f0099f7>הוסיפו מוצרים מהתפריט</p>`);
            _push2(ssrRenderComponent(_component_router_link, {
              to: "/menu",
              class: "browse-btn",
              onClick: closeCart
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(` לתפריט `);
                } else {
                  return [
                    createTextVNode(" לתפריט ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div>`);
          } else {
            _push2(`<div class="cart-content" data-v-9f0099f7><div class="cart-items" data-v-9f0099f7><!--[-->`);
            ssrRenderList(cart.value, (item) => {
              _push2(`<div class="cart-item" data-v-9f0099f7><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="item-thumb" data-v-9f0099f7><div class="item-details" data-v-9f0099f7><h4 class="item-name" data-v-9f0099f7>${ssrInterpolate(item.name)}</h4><span class="item-price" data-v-9f0099f7>₪${ssrInterpolate(item.price)} ליחידה</span></div><div class="item-actions" data-v-9f0099f7><div class="quantity-controls" data-v-9f0099f7><button class="qty-btn minus" data-v-9f0099f7>−</button><input type="number" class="qty-input"${ssrRenderAttr("value", item.quantity)} min="1" max="99" data-v-9f0099f7><button class="qty-btn plus" data-v-9f0099f7>+</button></div><span class="item-total" data-v-9f0099f7>₪${ssrInterpolate(item.price * item.quantity)}</span></div><button class="remove-btn" title="הסר מהעגלה" data-v-9f0099f7>🗑️</button></div>`);
            });
            _push2(`<!--]--></div><div class="cart-summary" data-v-9f0099f7><div class="summary-row" data-v-9f0099f7><span data-v-9f0099f7>סה&quot;כ מוצרים (${ssrInterpolate(cartItemCount.value)})</span><span class="summary-value" data-v-9f0099f7>₪${ssrInterpolate(cartTotal.value)}</span></div><div class="summary-row delivery-note" data-v-9f0099f7><span data-v-9f0099f7>🚗 משלוח</span><span class="summary-value" data-v-9f0099f7>ייקבע בהמשך</span></div><div class="summary-row total" data-v-9f0099f7><span data-v-9f0099f7>סה&quot;כ לתשלום</span><span class="summary-value" data-v-9f0099f7>₪${ssrInterpolate(cartTotal.value)}+</span></div></div><div class="cart-actions" data-v-9f0099f7>`);
            _push2(ssrRenderComponent(_component_router_link, {
              to: "/checkout",
              class: "checkout-btn",
              onClick: closeCart
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`<span data-v-9f0099f7${_scopeId}>מעבר לתשלום</span><span class="btn-arrow" data-v-9f0099f7${_scopeId}>←</span>`);
                } else {
                  return [
                    createVNode("span", null, "מעבר לתשלום"),
                    createVNode("span", { class: "btn-arrow" }, "←")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`<button class="continue-btn" data-v-9f0099f7>המשך בקניות</button></div></div>`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/cart/CartDrawer.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const CartDrawer = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["__scopeId", "data-v-9f0099f7"]]);
const _sfc_main$x = {
  __name: "CartButton",
  __ssrInlineRender: true,
  setup(__props) {
    const orderStore = useOrderStore();
    useUIStore();
    const isAnimating = ref(false);
    const cartItemCount = computed(() => orderStore.cartItemCount);
    const cartTotal = computed(() => orderStore.cartTotal);
    watch(cartItemCount, (newVal, oldVal) => {
      if (newVal > oldVal) {
        isAnimating.value = true;
        setTimeout(() => {
          isAnimating.value = false;
        }, 500);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: ["cart-button", { "has-items": cartItemCount.value > 0, "is-animating": isAnimating.value }]
      }, _attrs))} data-v-cdcaacfd><span class="cart-icon" data-v-cdcaacfd>🛒</span>`);
      if (cartItemCount.value > 0) {
        _push(`<span class="cart-count" data-v-cdcaacfd>${ssrInterpolate(cartItemCount.value > 99 ? "99+" : cartItemCount.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (cartItemCount.value > 0) {
        _push(`<span class="cart-total" data-v-cdcaacfd> ₪${ssrInterpolate(cartTotal.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
    };
  }
};
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/cart/CartButton.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const CartButton = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["__scopeId", "data-v-cdcaacfd"]]);
const phoneNumber = "972528460331";
const message = "היי מרגליתות! 🍰 אשמח לשמוע פרטים נוספים";
const _sfc_main$w = {
  __name: "WhatsAppButton",
  __ssrInlineRender: true,
  setup(__props) {
    const isHovered = ref(false);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: whatsappLink,
        target: "_blank",
        class: "whatsapp-float",
        "aria-label": "שלחו לנו הודעה בוואטסאפ"
      }, _attrs))} data-v-06d49679><span class="whatsapp-icon" data-v-06d49679><svg viewBox="0 0 32 32" fill="currentColor" data-v-06d49679><path d="M16.004 0C7.169 0 0 7.169 0 16.004c0 2.825.736 5.584 2.135 8.017L.075 32l8.208-2.033a15.93 15.93 0 007.721 1.97C24.835 31.937 32 24.768 32 15.933 32 7.169 24.839 0 16.004 0zm0 29.294c-2.59 0-5.122-.695-7.333-2.01l-.526-.312-5.453 1.43 1.456-5.32-.343-.544a13.26 13.26 0 01-2.037-7.034c0-7.347 5.977-13.324 13.324-13.324 7.347 0 13.324 5.977 13.324 13.324-.072 7.347-6.049 13.39-13.412 13.39zm7.333-9.975c-.4-.2-2.379-1.175-2.75-1.304-.371-.129-.643-.2-.914.2-.271.4-1.05 1.304-1.293 1.575-.243.271-.486.3-.886.1-.4-.2-1.693-.624-3.222-1.988-1.193-1.064-1.993-2.379-2.236-2.779-.243-.4-.029-.614.186-.814.186-.186.4-.486.6-.729.2-.243.271-.414.4-.686.129-.271.071-.514-.029-.714-.1-.2-.914-2.193-1.25-3.007-.329-.786-.671-.671-.914-.686h-.786c-.271 0-.714.1-1.086.5-.371.4-1.421 1.386-1.421 3.379s1.457 3.922 1.657 4.193c.2.271 2.864 4.379 6.95 6.136.971.421 1.729.671 2.321.857.971.314 1.857.271 2.557.171.779-.114 2.379-.971 2.721-1.907.343-.943.343-1.75.243-1.921-.1-.171-.371-.271-.771-.471z" data-v-06d49679></path></svg></span>`);
      if (isHovered.value) {
        _push(`<span class="whatsapp-tooltip" data-v-06d49679> שלחו לנו הודעה 💬 </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="whatsapp-pulse" data-v-06d49679></span></a>`);
    };
  }
};
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/WhatsAppButton.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const WhatsAppButton = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["__scopeId", "data-v-06d49679"]]);
const logo = "/assets/logo-CbLXBLT5.png";
const siteUrl = "https://margalitut.co.il";
const _sfc_main$v = {
  __name: "App",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const canonicalUrl = computed(() => `${siteUrl}${route.path === "/" ? "" : route.path}`);
    const pageDescription = computed(() => {
      if (route.query.lang === "en") {
        return "margalitut bakery in Beit Shemesh offers custom cakes, pastries, breads, vegan and gluten-free treats, and delivery across Beit Shemesh and nearby communities.";
      }
      return "מרגליתות - מאפייה ביתית בבית שמש עם עוגות מעוצבות, מאפים טריים, לחמים, קינוחים, מתכונים טבעוניים וללא גלוטן ומשלוחים לכל האזור.";
    });
    const pageKeywords = computed(() => {
      if (route.query.lang === "en") {
        return "Beit Shemesh bakery, custom cakes, pastries, gluten free bakery, vegan desserts, artisan breads, local bakery, cake delivery";
      }
      return "מאפייה בבית שמש, עוגות מעוצבות, מאפים, לחמים, קינוחים, מאפה ללא גלוטן, טבעוני, משלוח בית שמש, חוגי אפייה";
    });
    useHead({
      meta: [
        { name: "description", content: pageDescription },
        { name: "keywords", content: pageKeywords },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
        { name: "author", content: "מרגליתות" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "מרגליתות" },
        { property: "og:title", content: "מרגליתות | מאפייה ביתית בבית שמש" },
        { property: "og:description", content: pageDescription },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: `${siteUrl}/og-image.jpg` },
        { property: "og:locale", content: route.query.lang === "en" ? "en_US" : "he_IL" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "מרגליתות | מאפייה ביתית בבית שמש" },
        { name: "twitter:description", content: pageDescription },
        { name: "twitter:image", content: `${siteUrl}/og-image.jpg` }
      ],
      link: [
        { rel: "canonical", href: canonicalUrl },
        { rel: "alternate", hreflang: "he", href: canonicalUrl },
        {
          rel: "alternate",
          hreflang: "en",
          href: computed(() => `${siteUrl}${route.path}${route.path.includes("?") ? "" : "?lang=en"}`)
        }
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Bakery",
            name: "מרגליתות",
            alternateName: "margalitut",
            description: 'מאפייה ביתית בבית שמש המתמחה בעוגות מעוצבות, קינוחים ומאפים טריים בכשרות בד"ץ',
            url: siteUrl,
            telephone: "+972528460331",
            address: {
              "@type": "PostalAddress",
              streetAddress: "שכונת המשקפיים",
              addressLocality: "בית שמש",
              addressCountry: "IL"
            },
            areaServed: ["בית שמש", "מטה יהודה", "צור הדסה", "ביתר עילית"],
            servesCuisine: "מאפייה",
            priceRange: "₪₪",
            image: `${siteUrl}/og-image.jpg`,
            sameAs: ["https://wa.me/972528460331"]
          })
        }
      ]
    });
    const uiStore = useUIStore();
    const { isDark: isDark2 } = useDarkMode();
    const pageLanguage = computed(() => route.query.lang === "en" ? "en" : "he");
    const pageDirection = computed(() => pageLanguage.value === "en" ? "ltr" : "rtl");
    const navLabels = {
      he: { menu: "תפריט", gallery: "גלריה", about: "אודות", orders: "ההזמנות שלי", quote: "הצעת מחיר", faq: "שאלות נפוצות" },
      en: { menu: "Menu", gallery: "Gallery", about: "About", orders: "My Orders", quote: "Quote", faq: "FAQ" }
    };
    const navMenu = computed(() => navLabels[pageLanguage.value].menu);
    const navGallery = computed(() => navLabels[pageLanguage.value].gallery);
    const navAbout = computed(() => navLabels[pageLanguage.value].about);
    const navOrders = computed(() => navLabels[pageLanguage.value].orders);
    const navQuote = computed(() => navLabels[pageLanguage.value].quote);
    const navFAQ = computed(() => navLabels[pageLanguage.value].faq);
    const isMobileMenuOpen = computed(() => uiStore.isMobileMenuOpen);
    const previousPath = ref("");
    const transitionName = ref("fade");
    const closeMobileMenu = () => uiStore.closeMobileMenu();
    const pagesWithEnglish = {
      "/": "/?lang=en",
      "/Purim": "/Purim-en",
      "/Purim-en": "/Purim",
      "/Pesach": "/Pesach-en",
      "/Pesach-en": "/Pesach",
      "/tasting": "/tasting?lang=en"
    };
    const isEnglishPage = computed(() => {
      return route.path.includes("-en") || route.query.lang === "en";
    });
    const englishPath = computed(() => {
      const currentPath = route.path;
      if (currentPath.includes("-en")) return currentPath.replace("-en", "");
      if (route.query.lang === "en") return currentPath;
      if (pagesWithEnglish[currentPath]) return pagesWithEnglish[currentPath];
      return null;
    });
    const routeOrder = ["/", "/menu", "/gallery", "/about", "/quote", "/checkout"];
    watch(
      () => route.path,
      (newPath, oldPath) => {
        const newIndex = routeOrder.indexOf(newPath);
        const oldIndex = routeOrder.indexOf(oldPath || "/");
        if (newIndex > oldIndex) transitionName.value = "slide-left";
        else if (newIndex < oldIndex) transitionName.value = "slide-right";
        else transitionName.value = "fade";
        previousPath.value = oldPath;
        closeMobileMenu();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      const _component_router_view = resolveComponent("router-view");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["app", { "menu-open": isMobileMenuOpen.value, dark: unref(isDark2) }],
        dir: pageDirection.value,
        lang: pageLanguage.value
      }, _attrs))} data-v-ab524e24><header class="header" data-v-ab524e24><nav class="container nav-container" data-v-ab524e24>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/",
        class: "logo-link",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(logo))} alt="מרגליתות לוגו" class="logo-img" data-v-ab524e24${_scopeId}><span class="logo-text" data-v-ab524e24${_scopeId}>מרגליתות <span aria-hidden="true" data-v-ab524e24${_scopeId}>🍓</span></span>`);
          } else {
            return [
              createVNode("img", {
                src: unref(logo),
                alt: "מרגליתות לוגו",
                class: "logo-img"
              }, null, 8, ["src"]),
              createVNode("span", { class: "logo-text" }, [
                createTextVNode("מרגליתות "),
                createVNode("span", { "aria-hidden": "true" }, "🍓")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="nav-actions" data-v-ab524e24>`);
      if (englishPath.value) {
        _push(ssrRenderComponent(_component_router_link, {
          to: englishPath.value,
          class: "lang-switch-btn",
          title: isEnglishPage.value ? "עברית" : "English"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="lang-icon" data-v-ab524e24${_scopeId}>🌐</span>`);
            } else {
              return [
                createVNode("span", { class: "lang-icon" }, "🌐")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(SearchBar, null, null, _parent));
      _push(ssrRenderComponent(DarkModeToggle, { class: "dark-toggle-desktop" }, null, _parent));
      _push(ssrRenderComponent(unref(CartButton), null, null, _parent));
      _push(`<button class="mobile-menu-btn" aria-label="תפריט" data-v-ab524e24><span class="${ssrRenderClass([{ active: isMobileMenuOpen.value }, "hamburger"])}" data-v-ab524e24><span data-v-ab524e24></span><span data-v-ab524e24></span><span data-v-ab524e24></span></span></button></div><div class="nav-links-desktop" data-v-ab524e24>`);
      _push(ssrRenderComponent(_component_router_link, {
        class: "nav-link",
        to: "/menu"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(navMenu.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(navMenu.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        class: "nav-link",
        to: "/gallery"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(navGallery.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(navGallery.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        class: "nav-link",
        to: "/about"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(navAbout.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(navAbout.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        class: "nav-link",
        to: "/my-orders"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(navOrders.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(navOrders.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        class: "nav-link nav-link-primary",
        to: "/quote"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(navQuote.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(navQuote.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        class: "nav-link",
        to: "/faq"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(navFAQ.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(navFAQ.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></nav></header>`);
      if (isMobileMenuOpen.value) {
        _push(`<div class="mobile-menu-overlay" data-v-ab524e24><div class="mobile-menu" data-v-ab524e24>`);
        _push(ssrRenderComponent(_component_router_link, {
          class: "mobile-nav-link",
          to: "/menu",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(navMenu.value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(navMenu.value), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_router_link, {
          class: "mobile-nav-link",
          to: "/gallery",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(navGallery.value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(navGallery.value), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_router_link, {
          class: "mobile-nav-link",
          to: "/about",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(navAbout.value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(navAbout.value), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_router_link, {
          class: "mobile-nav-link",
          to: "/my-orders",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(navOrders.value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(navOrders.value), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_router_link, {
          class: "mobile-nav-link mobile-nav-link-primary",
          to: "/quote",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(navQuote.value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(navQuote.value), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_router_link, {
          class: "mobile-nav-link",
          to: "/faq",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(navFAQ.value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(navFAQ.value), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(DarkModeToggle, { class: "dark-toggle-mobile" }, null, _parent));
        if (englishPath.value) {
          _push(`<div class="mobile-lang-wrapper" data-v-ab524e24>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: englishPath.value,
            class: "mobile-lang-btn",
            onClick: closeMobileMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="lang-icon" data-v-ab524e24${_scopeId}>🌐</span> ${ssrInterpolate(isEnglishPage.value ? "עברית" : "English")}`);
              } else {
                return [
                  createVNode("span", { class: "lang-icon" }, "🌐"),
                  createTextVNode(" " + toDisplayString(isEnglishPage.value ? "עברית" : "English"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="main container" data-v-ab524e24>`);
      _push(ssrRenderComponent(_component_router_view, null, {
        default: withCtx(({ Component, route: route2 }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(``);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(Component), {
              key: route2.path
            }, null), _parent2, _scopeId);
          } else {
            return [
              createVNode(Transition, {
                name: transitionName.value,
                mode: "out-in"
              }, {
                default: withCtx(() => [
                  (openBlock(), createBlock(resolveDynamicComponent(Component), {
                    key: route2.path
                  }))
                ]),
                _: 2
              }, 1032, ["name"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(ssrRenderComponent(unref(CartDrawer), null, null, _parent));
      _push(ssrRenderComponent(NotificationToast, null, null, _parent));
      _push(ssrRenderComponent(ToastContainer, null, null, _parent));
      _push(ssrRenderComponent(WhatsAppButton, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-ab524e24"]]);
const _sfc_main$u = {
  __name: "CategoryCard",
  __ssrInlineRender: true,
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const menuStore = useMenuStore();
    const productsCount = computed(() => {
      return menuStore.getProductsByCategory(props.category.id).length;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(ssrRenderComponent(_component_router_link, mergeProps({
        to: __props.category.id === "baking-workshops" ? "/workshops" : `/menu/${__props.category.id}`,
        class: "category-card"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-background" data-v-18d33e06${_scopeId}></div><div class="card-content" data-v-18d33e06${_scopeId}><div class="card-image" data-v-18d33e06${_scopeId}>`);
            if (__props.category.image && __props.category.image.startsWith("/")) {
              _push2(`<!--[--><img${ssrRenderAttr("src", __props.category.image)}${ssrRenderAttr("alt", __props.category.name)} class="category-img img-default" loading="lazy" data-v-18d33e06${_scopeId}>`);
              if (__props.category.hoverImage) {
                _push2(`<img${ssrRenderAttr("src", __props.category.hoverImage)}${ssrRenderAttr("alt", __props.category.name)} class="category-img img-hover" loading="lazy" data-v-18d33e06${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(`<div class="image-placeholder" data-v-18d33e06${_scopeId}><span class="placeholder-text" data-v-18d33e06${_scopeId}>התמונה תעלה בקרוב...</span><span class="placeholder-subtext" data-v-18d33e06${_scopeId}>הטעם כבר כאן! 😋</span></div>`);
            }
            _push2(`</div><h3 class="card-title" data-v-18d33e06${_scopeId}>${ssrInterpolate(__props.category.name)}</h3><p class="card-description" data-v-18d33e06${_scopeId}>${ssrInterpolate(__props.category.description)}</p><div class="card-footer" data-v-18d33e06${_scopeId}><span class="products-count" data-v-18d33e06${_scopeId}>${ssrInterpolate(productsCount.value)} מוצרים</span><span class="card-arrow" data-v-18d33e06${_scopeId}>←</span></div></div><div class="card-shine" data-v-18d33e06${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", { class: "card-background" }),
              createVNode("div", { class: "card-content" }, [
                createVNode("div", { class: "card-image" }, [
                  __props.category.image && __props.category.image.startsWith("/") ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode("img", {
                      src: __props.category.image,
                      alt: __props.category.name,
                      class: "category-img img-default",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"]),
                    __props.category.hoverImage ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: __props.category.hoverImage,
                      alt: __props.category.name,
                      class: "category-img img-hover",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                  ], 64)) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "image-placeholder"
                  }, [
                    createVNode("span", { class: "placeholder-text" }, "התמונה תעלה בקרוב..."),
                    createVNode("span", { class: "placeholder-subtext" }, "הטעם כבר כאן! 😋")
                  ]))
                ]),
                createVNode("h3", { class: "card-title" }, toDisplayString(__props.category.name), 1),
                createVNode("p", { class: "card-description" }, toDisplayString(__props.category.description), 1),
                createVNode("div", { class: "card-footer" }, [
                  createVNode("span", { class: "products-count" }, toDisplayString(productsCount.value) + " מוצרים", 1),
                  createVNode("span", { class: "card-arrow" }, "←")
                ])
              ]),
              createVNode("div", { class: "card-shine" })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/menu/CategoryCard.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const CategoryCard = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["__scopeId", "data-v-18d33e06"]]);
const _sfc_main$t = {
  __name: "ProductOptionsModal",
  __ssrInlineRender: true,
  props: {
    show: Boolean,
    product: Object
  },
  emits: ["close", "add"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const selectedFlavor = ref(null);
    const selectedSize = ref(null);
    const quantity = ref(1);
    watch(
      () => props.show,
      (newVal) => {
        if (newVal) {
          selectedFlavor.value = null;
          selectedSize.value = null;
          quantity.value = 1;
        }
      }
    );
    const canAdd = computed(() => {
      var _a, _b, _c;
      if (((_a = props.product) == null ? void 0 : _a.flavors) && !selectedFlavor.value) return false;
      if (((_b = props.product) == null ? void 0 : _b.sizes) && !selectedSize.value) return false;
      if (((_c = selectedSize.value) == null ? void 0 : _c.minQty) && quantity.value < selectedSize.value.minQty) return false;
      return true;
    });
    const totalPrice = computed(() => {
      if (!selectedSize.value) return 0;
      return selectedSize.value.price * quantity.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        var _a;
        if (__props.show) {
          _push2(`<div class="modal-overlay" data-v-49298ec8><div class="modal-content" data-v-49298ec8><button class="modal-close" data-v-49298ec8>✕</button><h3 class="modal-title" data-v-49298ec8>${ssrInterpolate(__props.product.name)}</h3><p class="modal-description" data-v-49298ec8>${ssrInterpolate(__props.product.description)}</p>`);
          if (__props.product.flavors) {
            _push2(`<div class="option-section" data-v-49298ec8><h4 class="option-title" data-v-49298ec8>בחרו טעם:</h4><div class="flavors-grid" data-v-49298ec8><!--[-->`);
            ssrRenderList(__props.product.flavors, (flavor) => {
              var _a2;
              _push2(`<button class="${ssrRenderClass([{ active: ((_a2 = selectedFlavor.value) == null ? void 0 : _a2.id) === flavor.id }, "flavor-btn"])}" data-v-49298ec8><span class="flavor-icon" data-v-49298ec8>${ssrInterpolate(flavor.icon)}</span><span class="flavor-name" data-v-49298ec8>${ssrInterpolate(flavor.name)}</span></button>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.product.sizes) {
            _push2(`<div class="option-section" data-v-49298ec8><h4 class="option-title" data-v-49298ec8>בחרו גודל:</h4><div class="sizes-list" data-v-49298ec8><!--[-->`);
            ssrRenderList(__props.product.sizes, (size) => {
              var _a2;
              _push2(`<button class="${ssrRenderClass([{ active: ((_a2 = selectedSize.value) == null ? void 0 : _a2.id) === size.id }, "size-btn"])}" data-v-49298ec8><div class="size-info" data-v-49298ec8><span class="size-name" data-v-49298ec8>${ssrInterpolate(size.name)}</span><span class="size-note" data-v-49298ec8>${ssrInterpolate(size.note)}</span></div><span class="size-price" data-v-49298ec8>₪${ssrInterpolate(size.price)}</span></button>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="option-section" data-v-49298ec8><h4 class="option-title" data-v-49298ec8>כמות:</h4><div class="quantity-selector" data-v-49298ec8><button class="qty-btn" data-v-49298ec8>-</button><span class="qty-value" data-v-49298ec8>${ssrInterpolate(quantity.value)}</span><button class="qty-btn" data-v-49298ec8>+</button></div>`);
          if (((_a = selectedSize.value) == null ? void 0 : _a.minQty) && quantity.value < selectedSize.value.minQty) {
            _push2(`<p class="min-qty-warning" data-v-49298ec8> ⚠️ נדרש מינימום ${ssrInterpolate(selectedSize.value.minQty)} יחידות </p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><button class="add-to-cart-btn"${ssrIncludeBooleanAttr(!canAdd.value) ? " disabled" : ""} data-v-49298ec8>הוסף לסל - ₪${ssrInterpolate(totalPrice.value)}</button></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/ProductOptionsModal.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const ProductOptionsModal = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-49298ec8"]]);
const _sfc_main$s = {
  __name: "ProductModal",
  __ssrInlineRender: true,
  props: { product: Object },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    function onKeydown(e) {
      if (e.key === "Escape") emit("close");
    }
    onMounted(() => window.addEventListener("keydown", onKeydown));
    onUnmounted(() => window.removeEventListener("keydown", onKeydown));
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.product) {
          _push2(`<div class="modal-overlay" data-v-d8a7faca><div class="modal-container" dir="rtl" data-v-d8a7faca><button class="modal-close" data-v-d8a7faca>✕</button><div class="modal-image-wrap" data-v-d8a7faca>`);
          if (__props.product.image && __props.product.image.startsWith("/")) {
            _push2(`<img${ssrRenderAttr("src", __props.product.image)}${ssrRenderAttr("alt", __props.product.name)} class="modal-image" data-v-d8a7faca>`);
          } else {
            _push2(`<div class="modal-placeholder" data-v-d8a7faca><span data-v-d8a7faca>התמונה תעלה בקרוב... 😋</span></div>`);
          }
          _push2(`</div><div class="modal-body" data-v-d8a7faca>`);
          if (__props.product.popular) {
            _push2(`<span class="modal-badge" data-v-d8a7faca>⭐ פופולרי</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<h2 class="modal-title" data-v-d8a7faca>${ssrInterpolate(__props.product.name)}</h2><p class="modal-description" data-v-d8a7faca>${ssrInterpolate(__props.product.description)}</p><div class="modal-footer" data-v-d8a7faca>`);
          if (__props.product.price > 0) {
            _push2(`<span class="modal-price" data-v-d8a7faca>₪${ssrInterpolate(__props.product.price)}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/ProductModal.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const ProductModal = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-d8a7faca"]]);
const _sfc_main$r = {
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const orderStore = useOrderStore();
    const uiStore = useUIStore();
    const showAddedIndicator = ref(false);
    const showOptionsModal = ref(false);
    const showProductModal = ref(false);
    const isInCart = computed(() => {
      return orderStore.cart.some((item) => item.id === props.product.id);
    });
    const cartQuantity = computed(() => {
      const item = orderStore.cart.find((item2) => item2.id === props.product.id);
      return (item == null ? void 0 : item.quantity) || 0;
    });
    const handleOptionsAdd = (data) => {
      var _a, _b, _c, _d, _e, _f;
      const customProduct = {
        id: `${props.product.id}-${((_a = data.flavor) == null ? void 0 : _a.id) || "default"}-${((_b = data.size) == null ? void 0 : _b.id) || "default"}-${Date.now()}`,
        baseProductId: props.product.id,
        name: `${props.product.name} ${((_c = data.flavor) == null ? void 0 : _c.name) || ""} ${((_d = data.size) == null ? void 0 : _d.name) || ""}`.trim(),
        price: ((_e = data.size) == null ? void 0 : _e.price) || props.product.price,
        image: ((_f = data.flavor) == null ? void 0 : _f.icon) || props.product.image,
        flavor: data.flavor,
        size: data.size
      };
      orderStore.addToCart(customProduct, data.quantity);
      showOptionsModal.value = false;
      showAddedIndicator.value = true;
      uiStore.showSuccess(`${customProduct.name} נוסף לעגלה`);
      setTimeout(() => {
        showAddedIndicator.value = false;
      }, 1500);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["product-card", { "is-in-cart": isInCart.value }]
      }, _attrs))} data-v-c371d913>`);
      if (__props.product.popular) {
        _push(`<span class="popular-badge" data-v-c371d913> ⭐ פופולרי </span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.product.hasOptions) {
        _push(`<span class="options-badge" data-v-c371d913>בחירת אפשרויות</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="product-image" data-v-c371d913>`);
      if (__props.product.image && __props.product.image.startsWith("/")) {
        _push(`<!--[--><img${ssrRenderAttr("src", __props.product.image)}${ssrRenderAttr("alt", __props.product.name)} class="product-img img-default" loading="lazy" data-v-c371d913>`);
        if (__props.product.hoverImage) {
          _push(`<img${ssrRenderAttr("src", __props.product.hoverImage)}${ssrRenderAttr("alt", __props.product.name)} class="product-img img-hover" loading="lazy" data-v-c371d913>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<div class="image-placeholder" data-v-c371d913><span class="placeholder-text" data-v-c371d913>התמונה תעלה בקרוב...</span><span class="placeholder-subtext" data-v-c371d913>הטעם כבר כאן! 😋</span></div>`);
      }
      _push(`</div><div class="product-info" data-v-c371d913><h4 class="product-name" data-v-c371d913>${ssrInterpolate(__props.product.name)}</h4><p class="product-description" data-v-c371d913>${ssrInterpolate(__props.product.description)}</p><div class="product-footer" data-v-c371d913><span class="product-price" data-v-c371d913>₪${ssrInterpolate(__props.product.price)}</span><div class="cart-actions" data-v-c371d913>`);
      if (__props.product.hasOptions) {
        _push(`<button class="add-btn options-btn" data-v-c371d913><span class="add-text" data-v-c371d913>בחר אפשרויות</span></button>`);
      } else if (!isInCart.value) {
        _push(`<button class="add-btn" data-v-c371d913><span class="add-icon" data-v-c371d913>+</span><span class="add-text" data-v-c371d913>הוסף</span></button>`);
      } else {
        _push(`<div class="quantity-controls" data-v-c371d913><button class="qty-btn minus" data-v-c371d913>−</button><input type="number" class="qty-input"${ssrRenderAttr("value", cartQuantity.value)} min="1" max="99" data-v-c371d913><button class="qty-btn plus" data-v-c371d913>+</button></div>`);
      }
      _push(`</div></div></div>`);
      if (showAddedIndicator.value) {
        _push(`<div class="added-indicator" data-v-c371d913>✓ נוסף לעגלה</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(ProductOptionsModal, {
        show: showOptionsModal.value,
        product: __props.product,
        onClose: ($event) => showOptionsModal.value = false,
        onAdd: handleOptionsAdd
      }, null, _parent));
      _push(ssrRenderComponent(ProductModal, {
        product: showProductModal.value ? __props.product : null,
        onClose: ($event) => showProductModal.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/menu/ProductCard.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const ProductCard = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-c371d913"]]);
const _sfc_main$q = {
  __name: "CategorySection",
  __ssrInlineRender: true,
  props: {
    category: {
      type: Object,
      required: true
    },
    limit: {
      type: Number,
      default: 4
    }
  },
  setup(__props) {
    const props = __props;
    const menuStore = useMenuStore();
    const displayProducts = computed(() => {
      return menuStore.getPopularByCategory(props.category.id, props.limit);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "category-section" }, _attrs))} data-v-0cbaed3a><div class="section-header" data-v-0cbaed3a><div class="header-content" data-v-0cbaed3a><span class="section-icon" data-v-0cbaed3a>${ssrInterpolate(__props.category.icon)}</span><div class="header-text" data-v-0cbaed3a><h2 class="section-title" data-v-0cbaed3a>${ssrInterpolate(__props.category.name)}</h2><p class="section-description" data-v-0cbaed3a>${ssrInterpolate(__props.category.description)}</p></div></div>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: `/menu/${__props.category.id}`,
        class: "view-all-btn"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` צפה בהכל <span class="btn-arrow" data-v-0cbaed3a${_scopeId}>←</span>`);
          } else {
            return [
              createTextVNode(" צפה בהכל "),
              createVNode("span", { class: "btn-arrow" }, "←")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="products-grid" data-v-0cbaed3a><!--[-->`);
      ssrRenderList(displayProducts.value, (product, index) => {
        _push(ssrRenderComponent(ProductCard, {
          key: product.id,
          product,
          style: { animationDelay: `${index * 100}ms` },
          class: "product-item"
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: `/menu/${__props.category.id}`,
        class: "view-more-mobile"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` עוד ב${ssrInterpolate(__props.category.name)} <span class="arrow" data-v-0cbaed3a${_scopeId}>←</span>`);
          } else {
            return [
              createTextVNode(" עוד ב" + toDisplayString(__props.category.name) + " ", 1),
              createVNode("span", { class: "arrow" }, "←")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/menu/CategorySection.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const CategorySection = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-0cbaed3a"]]);
const _sfc_main$p = {
  __name: "CategoryTips",
  __ssrInlineRender: true,
  props: {
    tips: {
      type: Array,
      default: () => []
    },
    categoryName: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.tips && __props.tips.length > 0) {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "tips-section" }, _attrs))} data-v-72541a31><div class="tips-header" data-v-72541a31><span class="tips-icon" data-v-72541a31>💡</span><h3 class="tips-title" data-v-72541a31>טיפים ל${ssrInterpolate(__props.categoryName)}</h3></div><div class="tips-grid" data-v-72541a31><!--[-->`);
        ssrRenderList(__props.tips, (tip, index) => {
          _push(`<article class="tip-card" style="${ssrRenderStyle({ animationDelay: `${index * 100}ms` })}" data-v-72541a31><span class="tip-icon" data-v-72541a31>${ssrInterpolate(tip.icon)}</span><div class="tip-content" data-v-72541a31><h4 class="tip-title" data-v-72541a31>${ssrInterpolate(tip.title)}</h4><p class="tip-text" data-v-72541a31>${ssrInterpolate(tip.text)}</p></div></article>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/menu/CategoryTips.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const CategoryTips = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-72541a31"]]);
const _sfc_main$o = {
  __name: "TestimonialsSection",
  __ssrInlineRender: true,
  setup(__props) {
    useToastStore();
    const currentIndex = ref(0);
    const visibleCount = ref(3);
    const isLoading = ref(true);
    const showReviewModal = ref(false);
    const showSuccessModal = ref(false);
    const isSubmitting = ref(false);
    const reviews = ref([]);
    const initialReviews = [
      {
        id: "wa1",
        name: "Rabi Lary Shain.",
        location: "שכונת המשקפיים",
        rating: 5,
        text: "They are excelent!! כל הכבוד",
        product: "ספינג",
        source: "וואטסאפ",
        status: "approved"
      },
      {
        id: "wa2",
        name: "Levi Blumenfeld.",
        location: "שכונת המשקפיים",
        rating: 5,
        text: "was mamash deliciouse! Thanks very much!",
        product: "ספינג",
        source: "וואטסאפ",
        status: "approved"
      },
      {
        id: "wa3",
        name: "יוסי ל.",
        location: "בית שמש",
        rating: 5,
        text: "העוגיות הכי טעימות! הילדים מתים על השוקולד צ׳יפס. מזמינים כל שבוע",
        product: "עוגיות שוקולד צ׳יפס",
        source: "וואטסאפ",
        status: "approved"
      },
      {
        id: "wa4",
        name: "רחל א.",
        location: "רמת בית שמש ב'",
        rating: 5,
        text: "סוף סוף מצאתי עוגות ללא גלוטן טעימות! אי אפשר להבדיל מעוגה רגילה",
        product: "עוגת שוקולד ללא גלוטן",
        source: "וואטסאפ",
        status: "approved"
      }
    ];
    const newReview = ref({
      name: "",
      phone: "",
      location: "",
      product: "",
      text: "",
      rating: 0
    });
    const isFormValid = computed(() => {
      return newReview.value.rating > 0 && newReview.value.name.trim() !== "" && newReview.value.product.trim() !== "" && newReview.value.text.trim() !== "";
    });
    const averageRating = computed(() => {
      if (reviews.value.length === 0) return "0";
      const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
      return (sum / reviews.value.length).toFixed(1);
    });
    const starsDisplay = computed(() => {
      const avg = parseFloat(averageRating.value);
      return "⭐".repeat(Math.round(avg));
    });
    const maxIndex = computed(() => {
      return Math.max(0, reviews.value.length - visibleCount.value);
    });
    const dotsCount = computed(() => {
      return Math.max(1, Math.ceil(reviews.value.length / visibleCount.value));
    });
    async function loadReviews() {
      isLoading.value = true;
      try {
        const firebaseReviews = await getApprovedReviews();
        reviews.value = [...firebaseReviews, ...initialReviews];
      } catch (error) {
        console.error("Error loading reviews:", error);
        reviews.value = initialReviews;
      } finally {
        isLoading.value = false;
      }
    }
    function updateVisibleCount() {
      if (window.innerWidth < 640) {
        visibleCount.value = 1;
      } else if (window.innerWidth < 1024) {
        visibleCount.value = 2;
      } else {
        visibleCount.value = 3;
      }
      if (currentIndex.value > maxIndex.value) {
        currentIndex.value = Math.max(0, maxIndex.value);
      }
    }
    let autoSlideInterval = null;
    function startAutoSlide() {
      if (reviews.value.length <= visibleCount.value) return;
      autoSlideInterval = setInterval(() => {
        if (currentIndex.value < maxIndex.value) {
          currentIndex.value++;
        } else {
          currentIndex.value = 0;
        }
      }, 5e3);
    }
    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    }
    onMounted(async () => {
      updateVisibleCount();
      window.addEventListener("resize", updateVisibleCount);
      await loadReviews();
      startAutoSlide();
    });
    onUnmounted(() => {
      window.removeEventListener("resize", updateVisibleCount);
      stopAutoSlide();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "testimonials-section" }, _attrs))} data-v-ccda6792><div class="section-header" data-v-ccda6792><span class="section-icon" data-v-ccda6792>⭐</span><h2 class="section-title" data-v-ccda6792>מה הלקוחות אומרים</h2><p class="section-subtitle" data-v-ccda6792>הביקורות שלכם חשובות לנו</p></div>`);
      if (isLoading.value) {
        _push(`<div class="loading-state" data-v-ccda6792><div class="loading-spinner" data-v-ccda6792></div><p data-v-ccda6792>טוען ביקורות...</p></div>`);
      } else if (reviews.value.length > 0) {
        _push(`<!--[--><div class="stats-row" data-v-ccda6792><div class="stat-item" data-v-ccda6792><span class="stat-number" data-v-ccda6792>${ssrInterpolate(reviews.value.length)}</span><span class="stat-label" data-v-ccda6792>ביקורות</span></div><div class="stat-item" data-v-ccda6792><span class="stat-number" data-v-ccda6792>${ssrInterpolate(averageRating.value)}</span><span class="stat-label" data-v-ccda6792>דירוג ממוצע</span><div class="stat-stars" data-v-ccda6792>${ssrInterpolate(starsDisplay.value)}</div></div></div><div class="testimonials-container" data-v-ccda6792><button class="nav-btn prev"${ssrIncludeBooleanAttr(currentIndex.value === 0) ? " disabled" : ""} data-v-ccda6792>❯</button><div class="testimonials-track" data-v-ccda6792><div class="testimonials-slider" style="${ssrRenderStyle({ transform: `translateX(${currentIndex.value * (100 / visibleCount.value)}%)` })}" data-v-ccda6792><!--[-->`);
        ssrRenderList(reviews.value, (review) => {
          _push(`<div class="testimonial-card" data-v-ccda6792><div class="card-header" data-v-ccda6792><div class="avatar" data-v-ccda6792><span class="avatar-letter" data-v-ccda6792>${ssrInterpolate(review.name.charAt(0))}</span></div><div class="customer-info" data-v-ccda6792><h4 class="customer-name" data-v-ccda6792>${ssrInterpolate(review.name)}</h4><span class="customer-location" data-v-ccda6792>${ssrInterpolate(review.location || "בית שמש")}</span></div><div class="rating" data-v-ccda6792><!--[-->`);
          ssrRenderList(5, (star) => {
            _push(`<span class="${ssrRenderClass([{ filled: star <= review.rating }, "star"])}" data-v-ccda6792> ★ </span>`);
          });
          _push(`<!--]--></div></div><p class="testimonial-text" data-v-ccda6792>&quot;${ssrInterpolate(review.text)}&quot;</p><div class="card-footer" data-v-ccda6792><span class="product-tag" data-v-ccda6792>${ssrInterpolate(review.product)}</span>`);
          if (review.source) {
            _push(`<span class="source-tag" data-v-ccda6792><span class="source-icon" data-v-ccda6792>💬</span> ${ssrInterpolate(review.source)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div><button class="nav-btn next"${ssrIncludeBooleanAttr(currentIndex.value >= maxIndex.value) ? " disabled" : ""} data-v-ccda6792>❮</button></div>`);
        if (dotsCount.value > 1) {
          _push(`<div class="dots" data-v-ccda6792><!--[-->`);
          ssrRenderList(dotsCount.value, (n) => {
            _push(`<button class="${ssrRenderClass([{ active: currentIndex.value === n - 1 }, "dot"])}" data-v-ccda6792></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<div class="empty-state" data-v-ccda6792><span class="empty-icon" data-v-ccda6792>🌟</span><h3 data-v-ccda6792>היו הראשונים לדרג!</h3><p data-v-ccda6792>עדיין אין ביקורות. הזמינו מאיתנו ושתפו את החוויה שלכם</p></div>`);
      }
      _push(`<div class="testimonials-cta" data-v-ccda6792><button class="cta-btn primary" data-v-ccda6792><span data-v-ccda6792>✍️</span> הוסיפו ביקורת</button>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/menu",
        class: "cta-btn secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` לתפריט שלנו 🍰 `);
          } else {
            return [
              createTextVNode(" לתפריט שלנו 🍰 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (showReviewModal.value) {
          _push2(`<div class="modal-overlay" data-v-ccda6792><div class="modal-content" data-v-ccda6792><button class="modal-close" data-v-ccda6792>✕</button><div class="modal-header" data-v-ccda6792><span class="modal-icon" data-v-ccda6792>⭐</span><h3 data-v-ccda6792>שתפו את החוויה שלכם</h3><p data-v-ccda6792>נשמח לשמוע מה חשבתם!</p></div><form class="review-form" data-v-ccda6792><div class="form-group" data-v-ccda6792><label class="form-label" data-v-ccda6792>דירוג *</label><div class="rating-input" data-v-ccda6792><!--[-->`);
          ssrRenderList(5, (star) => {
            _push2(`<button type="button" class="${ssrRenderClass([{ active: star <= newReview.value.rating }, "rating-star"])}" data-v-ccda6792> ★ </button>`);
          });
          _push2(`<!--]--></div></div><div class="form-group" data-v-ccda6792><label class="form-label" data-v-ccda6792>שם *</label><input type="text"${ssrRenderAttr("value", newReview.value.name)} placeholder="השם שלכם" class="form-input" required data-v-ccda6792></div><div class="form-group" data-v-ccda6792><label class="form-label" data-v-ccda6792>טלפון</label><input type="tel"${ssrRenderAttr("value", newReview.value.phone)} placeholder="050-0000000" class="form-input" dir="ltr" data-v-ccda6792></div><div class="form-group" data-v-ccda6792><label class="form-label" data-v-ccda6792>מאיפה אתם?</label><select class="form-input" data-v-ccda6792><option value="" data-v-ccda6792${ssrIncludeBooleanAttr(Array.isArray(newReview.value.location) ? ssrLooseContain(newReview.value.location, "") : ssrLooseEqual(newReview.value.location, "")) ? " selected" : ""}>בחרו אזור</option><option value="בית שמש" data-v-ccda6792${ssrIncludeBooleanAttr(Array.isArray(newReview.value.location) ? ssrLooseContain(newReview.value.location, "בית שמש") : ssrLooseEqual(newReview.value.location, "בית שמש")) ? " selected" : ""}>בית שמש</option><option value="רמת בית שמש א&#39;" data-v-ccda6792${ssrIncludeBooleanAttr(Array.isArray(newReview.value.location) ? ssrLooseContain(newReview.value.location, "רמת בית שמש א'") : ssrLooseEqual(newReview.value.location, "רמת בית שמש א'")) ? " selected" : ""}>רמת בית שמש א&#39;</option><option value="רמת בית שמש ב&#39;" data-v-ccda6792${ssrIncludeBooleanAttr(Array.isArray(newReview.value.location) ? ssrLooseContain(newReview.value.location, "רמת בית שמש ב'") : ssrLooseEqual(newReview.value.location, "רמת בית שמש ב'")) ? " selected" : ""}>רמת בית שמש ב&#39;</option><option value="רמת בית שמש ג&#39;" data-v-ccda6792${ssrIncludeBooleanAttr(Array.isArray(newReview.value.location) ? ssrLooseContain(newReview.value.location, "רמת בית שמש ג'") : ssrLooseEqual(newReview.value.location, "רמת בית שמש ג'")) ? " selected" : ""}>רמת בית שמש ג&#39;</option><option value="שכונת המשקפיים" data-v-ccda6792${ssrIncludeBooleanAttr(Array.isArray(newReview.value.location) ? ssrLooseContain(newReview.value.location, "שכונת המשקפיים") : ssrLooseEqual(newReview.value.location, "שכונת המשקפיים")) ? " selected" : ""}>שכונת המשקפיים</option><option value="אחר" data-v-ccda6792${ssrIncludeBooleanAttr(Array.isArray(newReview.value.location) ? ssrLooseContain(newReview.value.location, "אחר") : ssrLooseEqual(newReview.value.location, "אחר")) ? " selected" : ""}>אחר</option></select></div><div class="form-group" data-v-ccda6792><label class="form-label" data-v-ccda6792>מה הזמנתם? *</label><input type="text"${ssrRenderAttr("value", newReview.value.product)} placeholder="למשל: עוגת שמרים שוקולד" class="form-input" required data-v-ccda6792></div><div class="form-group" data-v-ccda6792><label class="form-label" data-v-ccda6792>הביקורת שלכם *</label><textarea placeholder="ספרו לנו על החוויה..." class="form-input form-textarea" rows="4" required data-v-ccda6792>${ssrInterpolate(newReview.value.text)}</textarea></div><button type="submit" class="submit-btn"${ssrIncludeBooleanAttr(isSubmitting.value || !isFormValid.value) ? " disabled" : ""} data-v-ccda6792>`);
          if (isSubmitting.value) {
            _push2(`<span class="loading-spinner small" data-v-ccda6792></span>`);
          } else {
            _push2(`<span data-v-ccda6792>שליחת ביקורת ⭐</span>`);
          }
          _push2(`</button></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (showSuccessModal.value) {
          _push2(`<div class="modal-overlay" data-v-ccda6792><div class="modal-content success-modal" data-v-ccda6792><span class="success-icon" data-v-ccda6792>🎉</span><h3 data-v-ccda6792>תודה רבה!</h3><p data-v-ccda6792>הביקורת שלכם התקבלה ותפורסם לאחר אישור</p><button class="close-btn" data-v-ccda6792>סגור</button></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</section>`);
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/home/TestimonialsSection.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const TestimonialsSection = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-ccda6792"]]);
function useScrollAnimation() {
  let observer = null;
  function initScrollAnimation() {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, options);
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
  }
  function cleanup() {
    if (observer) {
      observer.disconnect();
    }
  }
  onMounted(() => {
    setTimeout(initScrollAnimation, 100);
  });
  onUnmounted(() => {
    cleanup();
  });
  return {
    initScrollAnimation,
    cleanup
  };
}
const _sfc_main$n = {
  __name: "Home",
  __ssrInlineRender: true,
  setup(__props) {
    useScrollAnimation();
    const route = useRoute();
    const lang = computed(() => route.query.lang === "en" ? "en" : "he");
    const translations = {
      he: {
        heroWelcome: "ברוכים הבאים ל",
        heroSubtitle: "מאפייה ביתית עם אהבה למתוק ולחלבי: עוגות, עוגיות, לחמים, גלידות וארוחות חלביות — הכול טרי, נקי וטעים.",
        badgeKosher: "כל הרכיבים בכשרות מהדרין",
        badgeHomemade: "אפייה ביתית",
        badgeHandmade: "עבודת יד",
        btnMenu: "לתפריט",
        btnQuote: "בקשת הצעת מחיר",
        categoriesTitle: "הקטגוריות שלנו",
        categoriesSubtitle: "גלו את כל המטעמים שלנו",
        popularTitle: "הפופולריים שלנו",
        popularSubtitle: "המוצרים הכי אהובים על הלקוחות",
        viewAll: "צפו בכל התפריט",
        whyTitle: "למה מרגליתות?",
        feature1Title: "רכיבים איכותיים",
        feature1Text: "כל הרכיבים שלנו בכשרות מהדרין, טריים ואיכותיים",
        feature2Title: "עבודת יד",
        feature2Text: "כל מוצר מוכן בעבודת יד עם אהבה ותשומת לב לפרטים",
        feature3Title: "ניקיון ברמה גבוהה",
        feature3Text: "המטבח שלנו נשמר תמיד נקי ומסודר ברמה הגבוהה ביותר",
        feature4Title: "התאמה אישית",
        feature4Text: "מתאימים לכל צורך: ללא גלוטן, ללא סוכר, טבעוני",
        feature5Title: "משלוחים",
        feature5Text: "משלוחים לכל אזור בית שמש והסביבה",
        ctaTitle: "מתכננים אירוע?",
        ctaText: "ימי הולדת, בריתות, חינות, שבתות ואירועים - נשמח להכין עבורכם הזמנה מיוחדת!",
        ctaBtn: "דברו איתנו"
      },
      en: {
        heroWelcome: "Welcome to",
        heroSubtitle: "A home bakery with a love for dairy sweets: cakes, cookies, breads, ice creams and dairy meals — all fresh, clean and delicious.",
        badgeKosher: "All ingredients are Mehadrin kosher",
        badgeHomemade: "Home baked",
        badgeHandmade: "Handcrafted",
        btnMenu: "Our Menu",
        btnQuote: "Request a Quote",
        categoriesTitle: "Our Categories",
        categoriesSubtitle: "Explore all our treats",
        popularTitle: "Our Favorites",
        popularSubtitle: "Customers' most loved products",
        viewAll: "View Full Menu",
        whyTitle: "Why margalitut?",
        feature1Title: "Quality Ingredients",
        feature1Text: "All our ingredients are Mehadrin kosher, fresh and top quality",
        feature2Title: "Handcrafted",
        feature2Text: "Every product is made by hand with love and attention to detail",
        feature3Title: "Highest Cleanliness",
        feature3Text: "Our kitchen is always kept clean and organized to the highest standard",
        feature4Title: "Customization",
        feature4Text: "Adapted to any need: gluten-free, sugar-free, vegan",
        feature5Title: "Delivery",
        feature5Text: "Delivering to all areas of Beit Shemesh and surroundings",
        ctaTitle: "Planning an Event?",
        ctaText: "Birthdays, brises, henna nights, Shabbat and celebrations — we would love to create something special for you!",
        ctaBtn: "Get in Touch"
      }
    };
    const t = computed(() => translations[lang.value]);
    useHead({
      title: "מרגליתות - מאפייה ביתית בבית שמש",
      meta: [
        {
          name: "description",
          content: "תפריט מרגליתות - עוגות שמרים, עוגות בחושות, עוגיות, לחמים, מאפים ללא גלוטן, טבעוניים ועוד. משלוחים לבית שמש."
        }
      ]
    });
    const menuStore = useMenuStore();
    const categories = computed(() => menuStore.categories);
    const popularProducts = computed(() => menuStore.popularProducts.slice(0, 8));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home-page" }, _attrs))} data-v-7c2b4d63><section class="hero-section animate-on-scroll fade-up" data-v-7c2b4d63><div class="hero-background" data-v-7c2b4d63><div class="hero-shape shape-1" data-v-7c2b4d63></div><div class="hero-shape shape-2" data-v-7c2b4d63></div><div class="hero-shape shape-3" data-v-7c2b4d63></div></div><div class="hero-content" data-v-7c2b4d63><div class="hero-text" data-v-7c2b4d63><h1 class="hero-title" data-v-7c2b4d63>${ssrInterpolate(t.value.heroWelcome)} `);
      if (lang.value === "he") {
        _push(`<span class="brand-name" data-v-7c2b4d63>מרגליתות🍓</span>`);
      } else {
        _push(`<span class="brand-name" data-v-7c2b4d63>Margalitut <span class="hero-emoji" data-v-7c2b4d63>🍓</span> מרגליתות</span>`);
      }
      _push(`</h1><p class="hero-subtitle" data-v-7c2b4d63>${ssrInterpolate(t.value.heroSubtitle)}</p><div class="hero-badges" data-v-7c2b4d63><span class="badge" data-v-7c2b4d63><span class="badge-icon" data-v-7c2b4d63>✡️</span> ${ssrInterpolate(t.value.badgeKosher)}</span><span class="badge" data-v-7c2b4d63><span class="badge-icon" data-v-7c2b4d63>🏠</span> ${ssrInterpolate(t.value.badgeHomemade)}</span><span class="badge" data-v-7c2b4d63><span class="badge-icon" data-v-7c2b4d63>❤️</span> ${ssrInterpolate(t.value.badgeHandmade)}</span></div><div class="hero-actions" data-v-7c2b4d63>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/menu",
        class: "btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-7c2b4d63${_scopeId}>${ssrInterpolate(t.value.btnMenu)}</span><span class="btn-arrow" data-v-7c2b4d63${_scopeId}>←</span>`);
          } else {
            return [
              createVNode("span", null, toDisplayString(t.value.btnMenu), 1),
              createVNode("span", { class: "btn-arrow" }, "←")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: "/quote",
        class: "btn-secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t.value.btnQuote)}`);
          } else {
            return [
              createTextVNode(toDisplayString(t.value.btnQuote), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="hero-image" data-v-7c2b4d63><img${ssrRenderAttr("src", unref(logo))} alt="מרגליתות לוגו" class="logo-img" data-v-7c2b4d63><div class="floating-items" data-v-7c2b4d63><span class="floating-item item-1" data-v-7c2b4d63>🍰</span><span class="floating-item item-2" data-v-7c2b4d63>🍪</span><span class="floating-item item-3" data-v-7c2b4d63>🍕</span><span class="floating-item item-4" data-v-7c2b4d63>🍦</span></div></div></div></section><section class="categories-section" data-v-7c2b4d63><div class="section-header animate-on-scroll fade-up" data-v-7c2b4d63><h2 class="section-title" data-v-7c2b4d63>${ssrInterpolate(t.value.categoriesTitle)}</h2><p class="section-subtitle" data-v-7c2b4d63>${ssrInterpolate(t.value.categoriesSubtitle)}</p></div><div class="categories-grid" data-v-7c2b4d63><!--[-->`);
      ssrRenderList(categories.value, (category, index) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: category.id,
          to: `/menu/${category.id}`,
          class: ["category-preview animate-on-scroll zoom-in", `delay-${index % 5 + 1}`],
          style: { "--category-color": category.color }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="category-image-wrapper" data-v-7c2b4d63${_scopeId}>`);
              if (category.image) {
                _push2(`<img${ssrRenderAttr("src", category.image)}${ssrRenderAttr("alt", category.name)} class="category-image" data-v-7c2b4d63${_scopeId}>`);
              } else {
                _push2(`<span class="category-icon" data-v-7c2b4d63${_scopeId}>${ssrInterpolate(category.icon)}</span>`);
              }
              _push2(`</div><span class="category-name" data-v-7c2b4d63${_scopeId}>${ssrInterpolate(category.name)}</span>`);
            } else {
              return [
                createVNode("div", { class: "category-image-wrapper" }, [
                  category.image ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: category.image,
                    alt: category.name,
                    class: "category-image"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                    key: 1,
                    class: "category-icon"
                  }, toDisplayString(category.icon), 1))
                ]),
                createVNode("span", { class: "category-name" }, toDisplayString(category.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section><section class="popular-section" data-v-7c2b4d63><div class="section-header animate-on-scroll fade-up" data-v-7c2b4d63><h2 class="section-title" data-v-7c2b4d63>⭐ ${ssrInterpolate(t.value.popularTitle)}</h2><p class="section-subtitle" data-v-7c2b4d63>${ssrInterpolate(t.value.popularSubtitle)}</p></div><div class="products-grid" data-v-7c2b4d63><!--[-->`);
      ssrRenderList(popularProducts.value, (product, index) => {
        _push(`<div class="${ssrRenderClass([`delay-${index % 5 + 1}`, "animate-on-scroll fade-up"])}" data-v-7c2b4d63>`);
        _push(ssrRenderComponent(unref(ProductCard), { product }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="section-action animate-on-scroll fade-up" data-v-7c2b4d63>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/menu",
        class: "view-all-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t.value.viewAll)} <span class="link-arrow" data-v-7c2b4d63${_scopeId}>←</span>`);
          } else {
            return [
              createTextVNode(toDisplayString(t.value.viewAll) + " ", 1),
              createVNode("span", { class: "link-arrow" }, "←")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="features-section" data-v-7c2b4d63><div class="section-header animate-on-scroll fade-up" data-v-7c2b4d63><h2 class="section-title" data-v-7c2b4d63>${ssrInterpolate(t.value.whyTitle)}</h2></div><div class="features-grid" data-v-7c2b4d63><div class="feature-card animate-on-scroll fade-up delay-1" data-v-7c2b4d63><span class="feature-icon" data-v-7c2b4d63>🌿</span><h3 class="feature-title" data-v-7c2b4d63>${ssrInterpolate(t.value.feature1Title)}</h3><p class="feature-text" data-v-7c2b4d63>${ssrInterpolate(t.value.feature1Text)}</p></div><div class="feature-card animate-on-scroll fade-up delay-2" data-v-7c2b4d63><span class="feature-icon" data-v-7c2b4d63>👩‍🍳</span><h3 class="feature-title" data-v-7c2b4d63>${ssrInterpolate(t.value.feature2Title)}</h3><p class="feature-text" data-v-7c2b4d63>${ssrInterpolate(t.value.feature2Text)}</p></div><div class="feature-card animate-on-scroll fade-up delay-3" data-v-7c2b4d63><span class="feature-icon" data-v-7c2b4d63>✨</span><h3 class="feature-title" data-v-7c2b4d63>${ssrInterpolate(t.value.feature3Title)}</h3><p class="feature-text" data-v-7c2b4d63>${ssrInterpolate(t.value.feature3Text)}</p></div><div class="feature-card animate-on-scroll fade-up delay-4" data-v-7c2b4d63><span class="feature-icon" data-v-7c2b4d63>🎂</span><h3 class="feature-title" data-v-7c2b4d63>${ssrInterpolate(t.value.feature4Title)}</h3><p class="feature-text" data-v-7c2b4d63>${ssrInterpolate(t.value.feature4Text)}</p></div><div class="feature-card animate-on-scroll fade-up delay-5" data-v-7c2b4d63><span class="feature-icon" data-v-7c2b4d63>🚗</span><h3 class="feature-title" data-v-7c2b4d63>${ssrInterpolate(t.value.feature5Title)}</h3><p class="feature-text" data-v-7c2b4d63>${ssrInterpolate(t.value.feature5Text)}</p></div></div></section><div class="animate-on-scroll fade-up" data-v-7c2b4d63>`);
      _push(ssrRenderComponent(TestimonialsSection, null, null, _parent));
      _push(`</div><section class="cta-section animate-on-scroll zoom-in" data-v-7c2b4d63><div class="cta-card" data-v-7c2b4d63><div class="cta-content" data-v-7c2b4d63><span class="cta-icon" data-v-7c2b4d63>🎉</span><h2 class="cta-title" data-v-7c2b4d63>${ssrInterpolate(t.value.ctaTitle)}</h2><p class="cta-text" data-v-7c2b4d63>${ssrInterpolate(t.value.ctaText)}</p>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/quote",
        class: "cta-btn"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t.value.ctaBtn)} <span class="btn-arrow" data-v-7c2b4d63${_scopeId}>←</span>`);
          } else {
            return [
              createTextVNode(toDisplayString(t.value.ctaBtn) + " ", 1),
              createVNode("span", { class: "btn-arrow" }, "←")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="cta-decoration" data-v-7c2b4d63><span class="deco-item deco-1" data-v-7c2b4d63>🧁</span><span class="deco-item deco-2" data-v-7c2b4d63>🎂</span><span class="deco-item deco-3" data-v-7c2b4d63>🍰</span></div></div></section></div>`);
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Home.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const Home = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-7c2b4d63"]]);
const _sfc_main$m = {
  __name: "Menu",
  __ssrInlineRender: true,
  setup(__props) {
    useScrollAnimation();
    const route = useRoute();
    const lang = computed(() => route.query.lang === "en" ? "en" : "he");
    const translations = {
      he: {
        title: "התפריט שלנו",
        subtitle: "כל המאפים והמטעמים שלנו, מחולקים לקטגוריות",
        categories: "קטגוריות",
        preview: "טעימות מהתפריט",
        notFound: "לא מצאתם מה שחיפשתם?",
        custom: "אנחנו מכינים גם הזמנות מיוחדות לפי בקשה",
        quote: "בקשת הצעת מחיר"
      },
      en: {
        title: "Our Menu",
        subtitle: "All our baked goods and treats, organized by categories",
        categories: "Categories",
        preview: "Menu Highlights",
        notFound: "Didn't find what you're looking for?",
        custom: "We also prepare special custom orders",
        quote: "Request a Quote"
      }
    };
    const t = computed(() => translations[lang.value]);
    useHead({
      title: lang.value === "en" ? "Menu | margalitut Bakery" : "תפריט | מרגליתות - מאפייה ביתית בבית שמש",
      meta: [
        {
          name: "description",
          content: lang.value === "en" ? "margalitut Menu - yeast cakes, layer cakes, cookies, breads, gluten-free and vegan baked goods. Delivery in Beit Shemesh." : "תפריט מרגליתות - עוגות שמרים, עוגות בחושות, עוגיות, לחמים, מאפים ללא גלוטן, טבעוניים ועוד. משלוחים לבית שמש."
        }
      ]
    });
    const menuStore = useMenuStore();
    const categories = computed(() => menuStore.categories);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "menu-page" }, _attrs))} data-v-0f9334f0><header class="page-header animate-on-scroll fade-up" data-v-0f9334f0><h1 class="page-title" data-v-0f9334f0>${ssrInterpolate(t.value.title)}</h1><p class="page-subtitle" data-v-0f9334f0>${ssrInterpolate(t.value.subtitle)}</p></header><section class="categories-section" data-v-0f9334f0><h2 class="section-title animate-on-scroll fade-up" data-v-0f9334f0>${ssrInterpolate(t.value.categories)}</h2><div class="categories-grid" data-v-0f9334f0><!--[-->`);
      ssrRenderList(categories.value, (category, index) => {
        _push(ssrRenderComponent(unref(CategoryCard), {
          key: category.id,
          category,
          class: ["animate-on-scroll fade-up", `delay-${index % 5 + 1}`]
        }, null, _parent));
      });
      _push(`<!--]--></div></section><div class="divider animate-on-scroll zoom-in" data-v-0f9334f0><span class="divider-icon" data-v-0f9334f0>🍰</span></div><section class="previews-section" data-v-0f9334f0><h2 class="section-title" data-v-0f9334f0>${ssrInterpolate(t.value.preview)}</h2><!--[-->`);
      ssrRenderList(categories.value, (category) => {
        _push(ssrRenderComponent(unref(CategorySection), {
          key: category.id,
          category,
          limit: 5
        }, null, _parent));
      });
      _push(`<!--]--></section><section class="cta-section" data-v-0f9334f0><div class="cta-content" data-v-0f9334f0><span class="cta-icon" data-v-0f9334f0>🎂</span><h3 class="cta-title" data-v-0f9334f0>${ssrInterpolate(t.value.notFound)}</h3><p class="cta-text" data-v-0f9334f0>${ssrInterpolate(t.value.custom)}</p>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/quote",
        class: "cta-btn"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t.value.quote)}`);
          } else {
            return [
              createTextVNode(toDisplayString(t.value.quote), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Menu.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const Menu = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-0f9334f0"]]);
const _sfc_main$l = {
  __name: "MenuCategory",
  __ssrInlineRender: true,
  props: ["categoryId"],
  setup(__props) {
    const props = __props;
    const menuStore = useMenuStore();
    useRouter();
    const category = computed(() => menuStore.getCategoryById(props.categoryId));
    useHead({
      title: computed(() => {
        var _a;
        return `${((_a = category.value) == null ? void 0 : _a.name) || "קטגוריה"} | מרגליתות - מאפייה ביתית`;
      }),
      meta: [
        {
          name: "description",
          content: computed(() => {
            var _a;
            return `${((_a = category.value) == null ? void 0 : _a.description) || ""} - מרגליתות מאפייה ביתית בבית שמש. משלוחים לכל האזור.`;
          })
        }
      ]
    });
    const route = useRoute();
    const activeSubcategory = ref("all");
    const showPopularOnly = ref(false);
    const sortBy = ref("default");
    const subcategories = computed(() => {
      return menuStore.dairySubcategories;
    });
    const products = computed(() => {
      return menuStore.getProductsByCategory(route.params.categoryId);
    });
    const filteredProducts = computed(() => {
      var _a;
      let result = [...products.value];
      if (((_a = category.value) == null ? void 0 : _a.hasSubcategories) && activeSubcategory.value !== "all") {
        result = result.filter((p) => p.subcategory === activeSubcategory.value);
      }
      if (showPopularOnly.value) {
        result = result.filter((p) => p.popular);
      }
      switch (sortBy.value) {
        case "price-low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          result.sort((a, b) => b.price - a.price);
          break;
        case "name":
          result.sort((a, b) => a.name.localeCompare(b.name, "he"));
          break;
        default:
          result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      }
      return result;
    });
    const resetFilters = () => {
      activeSubcategory.value = "all";
      showPopularOnly.value = false;
      sortBy.value = "default";
    };
    watch(
      () => route.params.categoryId,
      () => {
        resetFilters();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_router_link = resolveComponent("router-link");
      if (category.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "category-page" }, _attrs))} data-v-a065a09c><nav class="breadcrumb" data-v-a065a09c>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/menu",
          class: "breadcrumb-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`תפריט`);
            } else {
              return [
                createTextVNode("תפריט")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="breadcrumb-separator" data-v-a065a09c>/</span><span class="breadcrumb-current" data-v-a065a09c>${ssrInterpolate(category.value.name)}</span></nav><header class="page-header" style="${ssrRenderStyle({ "--category-color": category.value.color })}" data-v-a065a09c><div class="header-background" data-v-a065a09c></div><div class="header-content" data-v-a065a09c><span class="header-icon" data-v-a065a09c>${ssrInterpolate(category.value.icon)}</span><div class="header-text" data-v-a065a09c><h1 class="page-title" data-v-a065a09c>${ssrInterpolate(category.value.name)}</h1><p class="page-subtitle" data-v-a065a09c>${ssrInterpolate(category.value.description)}</p><span class="products-count" data-v-a065a09c>${ssrInterpolate(products.value.length)} מוצרים</span></div></div></header>`);
        if (category.value.hasSubcategories) {
          _push(`<div class="subcategories-section" data-v-a065a09c><div class="subcategories-tabs" data-v-a065a09c><button class="${ssrRenderClass([{ active: activeSubcategory.value === "all" }, "subcategory-tab"])}" data-v-a065a09c> הכל </button><!--[-->`);
          ssrRenderList(subcategories.value, (sub) => {
            _push(`<button class="${ssrRenderClass([{ active: activeSubcategory.value === sub.id }, "subcategory-tab"])}" data-v-a065a09c><span class="tab-icon" data-v-a065a09c>${ssrInterpolate(sub.icon)}</span> ${ssrInterpolate(sub.name)}</button>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="filters-bar" data-v-a065a09c><div class="filter-group" data-v-a065a09c><button class="${ssrRenderClass([{ active: showPopularOnly.value }, "filter-btn"])}" data-v-a065a09c> ⭐ פופולריים </button></div><div class="sort-group" data-v-a065a09c><label class="sort-label" data-v-a065a09c>מיון:</label><select class="sort-select" data-v-a065a09c><option value="default" data-v-a065a09c${ssrIncludeBooleanAttr(Array.isArray(sortBy.value) ? ssrLooseContain(sortBy.value, "default") : ssrLooseEqual(sortBy.value, "default")) ? " selected" : ""}>ברירת מחדל</option><option value="price-low" data-v-a065a09c${ssrIncludeBooleanAttr(Array.isArray(sortBy.value) ? ssrLooseContain(sortBy.value, "price-low") : ssrLooseEqual(sortBy.value, "price-low")) ? " selected" : ""}>מחיר: נמוך לגבוה</option><option value="price-high" data-v-a065a09c${ssrIncludeBooleanAttr(Array.isArray(sortBy.value) ? ssrLooseContain(sortBy.value, "price-high") : ssrLooseEqual(sortBy.value, "price-high")) ? " selected" : ""}>מחיר: גבוה לנמוך</option><option value="name" data-v-a065a09c${ssrIncludeBooleanAttr(Array.isArray(sortBy.value) ? ssrLooseContain(sortBy.value, "name") : ssrLooseEqual(sortBy.value, "name")) ? " selected" : ""}>לפי שם</option></select></div></div><div class="products-section" data-v-a065a09c><div${ssrRenderAttrs({
          name: "products",
          class: "products-grid"
        })} data-v-a065a09c>`);
        ssrRenderList(filteredProducts.value, (product) => {
          _push(ssrRenderComponent(unref(ProductCard), {
            key: product.id,
            product
          }, null, _parent));
        });
        _push(`</div>`);
        if (filteredProducts.value.length === 0) {
          _push(`<div class="empty-state" data-v-a065a09c><span class="empty-icon" data-v-a065a09c>🔍</span><h3 data-v-a065a09c>לא נמצאו מוצרים</h3><p data-v-a065a09c>נסו לשנות את הסינון</p><button class="reset-btn" data-v-a065a09c>איפוס סינון</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="back-section" data-v-a065a09c><button type="button" class="back-link" data-v-a065a09c><span class="back-arrow" data-v-a065a09c>→</span> חזרה לתפריט </button></div>`);
        if ((_a = category.value) == null ? void 0 : _a.tips) {
          _push(ssrRenderComponent(unref(CategoryTips), {
            tips: category.value.tips,
            categoryName: category.value.name
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-found" }, _attrs))} data-v-a065a09c><span class="not-found-icon" data-v-a065a09c>😕</span><h2 data-v-a065a09c>הקטגוריה לא נמצאה</h2><button type="button" class="back-btn" data-v-a065a09c>חזרה לתפריט</button></div>`);
      }
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/MenuCategory.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const MenuCategory = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-a065a09c"]]);
const g1 = "/gallery/gallary1.webp";
const g2 = "/gallery/gallery2.webp";
const g3 = "/gallery/gallery3.webp";
const g4 = "/gallery/gallery4.webp";
const g5 = "/gallery/gallery5.webp";
const g6 = "/gallery/gallery6.webp";
const g7 = "/gallery/gallery7.webp";
const g8 = "/gallery/gallery8.webp";
const g9 = "/gallery/gallery9.webp";
const g10 = "/gallery/gallery10.webp";
const g11 = "/gallery/gallery11.webp";
const g12 = "/gallery/gallery12.webp";
const g13 = "/gallery/gallery13.webp";
const g14 = "/gallery/gallery14.webp";
const g15 = "/gallery/gallery15.webp";
const g16 = "/gallery/gallery16.webp";
const g17 = "/gallery/gallery17.webp";
const g18 = "/gallery/gallery18.webp";
const g19 = "/gallery/gallery19.webp";
const g20 = "/gallery/gallery20.webp";
const g21 = "/gallery/gallery21.webp";
const g22 = "/gallery/gallery22.webp";
const g23 = "/gallery/gallery23.webp";
const g24 = "/gallery/gallery24.webp";
const g25 = "/gallery/gallery25.webp";
const g26 = "/gallery/galleryPesach.webp";
const g80 = "/gallery/gallery80.webp";
const g100 = "/gallery/gallery100.webp";
const _sfc_main$k = {
  __name: "Gallery",
  __ssrInlineRender: true,
  setup(__props) {
    useScrollAnimation();
    const route = useRoute();
    const lang = computed(() => route.query.lang === "en" ? "en" : "he");
    const galleryTitle = computed(() => lang.value === "en" ? "Our Gallery" : "הגלריה שלנו");
    const gallerySubtitle = computed(() => lang.value === "en" ? "Browse through our creations" : "דפדפו באלבום היצירות שלנו");
    computed(() => lang.value === "en" ? "Photo Album" : "אלבום התמונות");
    computed(() => lang.value === "en" ? "margalitut" : "מרגליתות");
    computed(() => lang.value === "en" ? "Click to open" : "לחצו לפתיחה");
    computed(() => lang.value === "en" ? "Photo" : "תמונה");
    useHead({
      title: lang.value === "en" ? "Gallery | margalitut Bakery" : "גלריה | מרגליתות - מאפייה ביתית בבית שמש",
      meta: [
        {
          name: "description",
          content: lang.value === "en" ? "Gallery of cakes, baked goods and treats from margalitut - a home bakery in Beit Shemesh" : "גלריה של עוגות, מאפים וקינוחים ממרגליתות - מאפייה ביתית בבית שמש"
        }
      ]
    });
    const bookOpened = ref(false);
    const currentPage = ref(0);
    const isAutoPlaying = ref(false);
    const speed = ref(3);
    const isMobile = ref(false);
    const lightboxOpen = ref(false);
    const lightboxIndex = ref(0);
    const isFlipping = ref(false);
    const flipDirection = ref("next");
    let autoPlayInterval = null;
    const galleryData = [
      {
        src: g1,
        title: "השולחן שלנו לפני שיוצאים למכירה",
        alt: "שולחן מכירה עם מוצרי אפייה ביתיים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "הצצה לשולחן המכירה של מרגליתות — מוצרים טריים ביתיים מוכנים ליום"
      },
      {
        src: g2,
        title: "עוגת פאדג׳ מעוצבת",
        alt: "עוגת פאדג׳ שוקולד מעוצבת בעבודת יד | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "עוגת פאדג׳ שוקולד עשירה ומעוצבת בעבודת יד, מושלמת לאירועים מיוחדים"
      },
      {
        src: g3,
        title: "כדורי גבינה בציפוי שוקולד",
        alt: "כדורי גבינה בציפוי שוקולד בלגי | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "כדורי גבינה קרמיים בציפוי שוקולד בלגי, קינוח ביתי עדין ומפנק"
      },
      {
        src: g4,
        title: "קולאז׳ 1",
        alt: "מבחר מוצרי אפייה ביתיים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "מבחר מוצרים ביתיים של מרגליתות — עוגות, מאפים וקינוחים לכל אירוע"
      },
      {
        src: g5,
        title: "השולחן שלנו בהכנות לפני מכירה",
        alt: "הכנות לפני יום מכירה במרגליתות | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "מאחורי הקלעים — הכנת השולחן לפני יום המכירה עם כל המוצרים הטריים"
      },
      {
        src: g6,
        title: "עוגת יום הולדת דובי",
        alt: "עוגת יום הולדת דובי מעוצבת לילדים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "עוגת יום הולדת בעיצוב דובי מתוק, מוכנת בהתאמה אישית לילדים"
      },
      {
        src: g7,
        title: "קולאז׳ פיצה שמרים ועוגיות",
        alt: "פיצה ביתית מאפי שמרים ועוגיות | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "מגוון מוצרי מרגליתות — פיצה חלבית, מאפי שמרים ועוגיות ביתיות"
      },
      {
        src: g8,
        title: "מגוון עוגיות למכירה",
        alt: "מגוון עוגיות ביתיות כשרות למכירה | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: 'מבחר עוגיות ביתיות בטעמים ובעיצובים שונים, מוכנות בעבודת יד בכשרות בד"ץ'
      },
      {
        src: g9,
        title: "עוגת גבינה פירות יער בצורת לב",
        alt: "עוגת גבינה פירות יער בצורת לב | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "עוגת גבינה קרמית עם פירות יער טריים בעיצוב לב, מושלמת להפתעה רומנטית"
      },
      {
        src: g10,
        title: "חלת מפתח לכבוד שבת שאחרי פסח",
        alt: "חלת מפתח מסורתית לשבת שאחרי פסח | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "חלת מפתח מסורתית לשבת שאחרי פסח, נאפית בעבודת יד ברכות ואהבה"
      },
      {
        src: g11,
        title: "מיקס עוגיות",
        alt: "מיקס עוגיות ביתיות בטעמים שונים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "מיקס עוגיות ביתיות בטעמים מגוונים, מושלם למשלוח מנות ולמתנות"
      },
      {
        src: g12,
        title: "קולאז׳ שמרים",
        alt: "מאפי שמרים ביתיים — בובקות רוגלך ושושנים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "מגוון מאפי שמרים ביתיים — בובקות, רוגלך, שושנים ועוד"
      },
      {
        src: g13,
        title: "עוגת בר מצווה",
        alt: "עוגת בר מצווה מעוצבת בהתאמה אישית | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "עוגת בר מצווה מעוצבת בהתאמה אישית, בעיצוב ייחודי לאירוע המיוחד"
      },
      {
        src: g14,
        title: "פיצה ללא גלוטן",
        alt: "פיצה חלבית ביתית ללא גלוטן | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "פיצה חלבית ביתית ללא גלוטן, טרייה וטעימה לרגישים לגלוטן"
      },
      {
        src: g15,
        title: "פיצה מרגליתות",
        alt: "פיצה חלבית ביתית עם בצק ביתי | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: 'פיצה חלבית ביתית של מרגליתות עם בצק ביתי ורוטב טרי, בכשרות בד"ץ'
      },
      {
        src: g16,
        title: "קולאז׳ שבועות",
        alt: "מוצרים חלביים לחג השבועות | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "מגוון מוצרים חלביים מיוחדים לחג השבועות — עוגות גבינה, קינוחים ומאפים"
      },
      {
        src: g17,
        title: "שבלול מנגולד גבינות",
        alt: "שבלול מנגולד וגבינות ביתי | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "שבלול ביתי עם מילוי מנגולד טרי וגבינות, מאפה חלבי עשיר ומיוחד"
      },
      {
        src: g18,
        title: "אירוע טעימות של מרגליתות",
        alt: "אירוע טעימות מרגליתות בית שמש | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "אירוע טעימות מיוחד של מרגליתות — הזדמנות לטעום מכל הטוב שיש"
      },
      {
        src: g19,
        title: "ספינג לכבוד חנוכה",
        alt: "ספינג חנוכה ביתי אוורירי | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "ספינג אוורירי וחגיגי לכבוד חנוכה, מסורת מתוקה שמלווה את המשפחה"
      },
      {
        src: g20,
        title: "אירוע טעימות של מרגליתות 2",
        alt: "אירוע טעימות מרגליתות מבחר מוצרים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "עוד הצצה לאירוע הטעימות של מרגליתות — שפע מוצרים ביתיים טריים"
      },
      {
        src: g21,
        title: "השולחן של מרגליתות לפני שיוצאים למכירה",
        alt: "שולחן מכירה מלא במוצרים ביתיים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "השולחן המוכן של מרגליתות לפני יציאה למכירה — עמוס במוצרים טריים"
      },
      {
        src: g22,
        title: "שולחן המכירה של מרגליתות",
        alt: "שולחן מכירה מרגליתות עם מבחר מוצרים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "שולחן המכירה של מרגליתות — מבחר עשיר של מוצרי אפייה ביתיים טריים"
      },
      {
        src: g23,
        title: "חלות לכבוד שבת",
        alt: "חלות שבת ביתיות רכות ואווריריות | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "חלות שבת ביתיות רכות ואווריריות, נאפות בכל שבוע בטריות ואהבה"
      },
      {
        src: g24,
        title: "גלידות במגוון טעמים",
        alt: "גלידות ביתיות קרמיות במגוון טעמים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "גלידות ביתיות קרמיות במגוון טעמים, מוכנות עם חומרי גלם טבעיים"
      },
      {
        src: g25,
        title: "עוגת גבינה גבוהה מעוצבת",
        alt: "עוגת גבינה גבוהה ומרשימה לאירועים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "עוגת גבינה גבוהה ומרשימה בעיצוב אלגנטי, מושלמת לאירועים ולחגים"
      },
      {
        src: g26,
        title: "קולאז׳ ללא גלוטן או לפסח",
        alt: "מוצרים ללא גלוטן ומוצרי פסח כשרים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: 'מגוון מוצרים ללא גלוטן ומוצרי פסח כשרים, בכשרות בד"ץ לכל המשפחה'
      },
      {
        src: g80,
        title: "משלוח מנות לפורים",
        alt: "משלוח מנות פורים עם עוגיות ומאפים ביתיים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "משלוח מנות לפורים עם עוגיות ומאפים ביתיים, ארוז בצורה חגיגית ומיוחדת"
      },
      {
        src: g100,
        title: "שולחן המכירה של מרגליתות",
        alt: "שולחן המכירה של מרגליתות עמוס במוצרים | מרגליתות 🍓 – אפייה ביתית בבית שמש",
        description: "שולחן המכירה של מרגליתות עמוס במוצרים ביתיים טריים לכל טעם"
      }
    ];
    const images = galleryData.map((img, index) => ({ ...img, index }));
    const totalImages = computed(() => images.length);
    const totalPages = computed(() => Math.ceil(images.length / 2));
    const leftImage = computed(() => {
      const index = currentPage.value * 2;
      return images[index] || null;
    });
    const rightImage = computed(() => {
      const index = currentPage.value * 2 + 1;
      return images[index] || null;
    });
    const mobileImage = computed(() => {
      return images[currentPage.value] || null;
    });
    const progressPercent = computed(() => {
      if (isMobile.value) {
        return (currentPage.value + 1) / totalImages.value * 100;
      }
      return (currentPage.value + 1) / totalPages.value * 100;
    });
    function checkMobile() {
      isMobile.value = window.innerWidth < 768;
    }
    function closeBook() {
      bookOpened.value = false;
      currentPage.value = 0;
      stopAutoPlay();
    }
    function nextPage() {
      if (isFlipping.value) return;
      isFlipping.value = true;
      flipDirection.value = "next";
      setTimeout(() => {
        const max = isMobile.value ? totalImages.value - 1 : totalPages.value - 1;
        if (currentPage.value < max) {
          currentPage.value++;
        } else {
          currentPage.value = 0;
        }
      }, 300);
      setTimeout(() => {
        isFlipping.value = false;
      }, 600);
    }
    function prevPage() {
      if (isFlipping.value) return;
      isFlipping.value = true;
      flipDirection.value = "prev";
      setTimeout(() => {
        const max = isMobile.value ? totalImages.value - 1 : totalPages.value - 1;
        if (currentPage.value > 0) {
          currentPage.value--;
        } else {
          currentPage.value = max;
        }
      }, 300);
      setTimeout(() => {
        isFlipping.value = false;
      }, 600);
    }
    function startAutoPlay() {
      stopAutoPlay();
      const interval = Math.max(1500, 3e3 / speed.value) + 600;
      autoPlayInterval = setInterval(nextPage, interval);
    }
    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }
    function toggleAutoPlay() {
      isAutoPlaying.value = !isAutoPlaying.value;
      if (isAutoPlaying.value) {
        startAutoPlay();
      } else {
        stopAutoPlay();
      }
    }
    function closeLightbox() {
      lightboxOpen.value = false;
      document.body.style.overflow = "";
    }
    function lightboxNext() {
      if (lightboxIndex.value < images.length - 1) {
        lightboxIndex.value++;
      } else {
        lightboxIndex.value = 0;
      }
    }
    function lightboxPrev() {
      if (lightboxIndex.value > 0) {
        lightboxIndex.value--;
      } else {
        lightboxIndex.value = images.length - 1;
      }
    }
    function handleKeydown(e) {
      if (lightboxOpen.value) {
        if (e.key === "ArrowLeft") lightboxNext();
        if (e.key === "ArrowRight") lightboxPrev();
        if (e.key === "Escape") closeLightbox();
      } else if (bookOpened.value) {
        if (e.key === "ArrowLeft") nextPage();
        if (e.key === "ArrowRight") prevPage();
        if (e.key === " ") {
          e.preventDefault();
          toggleAutoPlay();
        }
        if (e.key === "Escape") closeBook();
      }
    }
    onMounted(() => {
      checkMobile();
      window.addEventListener("resize", checkMobile);
      document.addEventListener("keydown", handleKeydown);
    });
    onUnmounted(() => {
      stopAutoPlay();
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("keydown", handleKeydown);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gallery-page" }, _attrs))} data-v-5b0bea59><header class="page-header animate-on-scroll fade-up" data-v-5b0bea59><span class="header-icon" data-v-5b0bea59>📸</span><h1 class="page-title" data-v-5b0bea59>${ssrInterpolate(galleryTitle.value)}</h1><p class="page-subtitle" data-v-5b0bea59>${ssrInterpolate(gallerySubtitle.value)}</p></header><div class="flipbook-wrapper animate-on-scroll fade-up" data-v-5b0bea59><div class="book-container" data-v-5b0bea59><div class="${ssrRenderClass([{ "mobile-mode": isMobile.value }, "book"])}" data-v-5b0bea59>`);
      if (!isMobile.value) {
        _push(`<div class="book-spine" data-v-5b0bea59><span class="spine-text" data-v-5b0bea59>מרגליתות</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isMobile.value && bookOpened.value) {
        _push(`<div class="left-page" data-v-5b0bea59><div class="page-content" data-v-5b0bea59>`);
        if (leftImage.value) {
          _push(`<div class="image-frame" data-v-5b0bea59><img${ssrRenderAttr("src", leftImage.value.src)}${ssrRenderAttr("alt", leftImage.value.title)} loading="lazy" data-v-5b0bea59><div class="image-number" data-v-5b0bea59>${ssrInterpolate(leftImage.value.index + 1)}</div></div>`);
        } else {
          _push(`<div class="empty-page" data-v-5b0bea59><span data-v-5b0bea59>📖</span></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isMobile.value && bookOpened.value) {
        _push(`<div class="right-page" data-v-5b0bea59><div class="page-content" data-v-5b0bea59>`);
        if (rightImage.value) {
          _push(`<div class="image-frame" data-v-5b0bea59><img${ssrRenderAttr("src", rightImage.value.src)}${ssrRenderAttr("alt", rightImage.value.title)} loading="lazy" data-v-5b0bea59><div class="image-number" data-v-5b0bea59>${ssrInterpolate(rightImage.value.index + 1)}</div></div>`);
        } else {
          _push(`<div class="empty-page" data-v-5b0bea59><span data-v-5b0bea59>📖</span></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isMobile.value && bookOpened.value && isFlipping.value) {
        _push(`<div class="${ssrRenderClass([flipDirection.value, "flipping-page"])}" data-v-5b0bea59><div class="flip-page-inner" data-v-5b0bea59><div class="flip-front" data-v-5b0bea59></div><div class="flip-back" data-v-5b0bea59></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isMobile.value && bookOpened.value) {
        _push(`<div class="mobile-page" data-v-5b0bea59><div class="page-content" data-v-5b0bea59>`);
        if (mobileImage.value) {
          _push(`<div class="image-frame" data-v-5b0bea59><img${ssrRenderAttr("src", mobileImage.value.src)}${ssrRenderAttr("alt", mobileImage.value.title)} loading="lazy" data-v-5b0bea59><div class="image-number" data-v-5b0bea59>${ssrInterpolate(mobileImage.value.index + 1)}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (isFlipping.value) {
          _push(`<div class="${ssrRenderClass([flipDirection.value, "mobile-flip"])}" data-v-5b0bea59></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([{ "is-open": bookOpened.value }, "book-cover"])}" data-v-5b0bea59><div class="cover-content" data-v-5b0bea59><span class="cover-icon" data-v-5b0bea59>📸</span><h2 data-v-5b0bea59>אלבום התמונות</h2><p data-v-5b0bea59>מרגליתות</p><span class="cover-hint" data-v-5b0bea59>לחצו לפתיחה</span></div></div></div><button class="nav-btn nav-prev" style="${ssrRenderStyle(bookOpened.value ? null : { display: "none" })}" data-v-5b0bea59><span data-v-5b0bea59>❯</span></button><button class="nav-btn nav-next" style="${ssrRenderStyle(bookOpened.value ? null : { display: "none" })}" data-v-5b0bea59><span data-v-5b0bea59>❮</span></button>`);
      if (!bookOpened.value) {
        _push(`<button class="open-book-btn" data-v-5b0bea59>פתחו את האלבום 📖</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="book-progress" style="${ssrRenderStyle(bookOpened.value ? null : { display: "none" })}" data-v-5b0bea59><div class="progress-track" data-v-5b0bea59><div class="progress-fill" style="${ssrRenderStyle({ width: progressPercent.value + "%" })}" data-v-5b0bea59></div></div><span class="progress-text" data-v-5b0bea59>${ssrInterpolate(isMobile.value ? `תמונה ${currentPage.value + 1} מתוך ${totalImages.value}` : `עמוד ${currentPage.value + 1} מתוך ${totalPages.value}`)}</span></div><div class="book-controls" style="${ssrRenderStyle(bookOpened.value ? null : { display: "none" })}" data-v-5b0bea59><button class="control-btn" data-v-5b0bea59><span data-v-5b0bea59>${ssrInterpolate(isAutoPlaying.value ? "⏸️" : "▶️")}</span> ${ssrInterpolate(isAutoPlaying.value ? "עצור" : "דפדוף אוטומטי")}</button><div class="speed-control" data-v-5b0bea59><span class="speed-label" data-v-5b0bea59>מהירות:</span><!--[-->`);
      ssrRenderList([1, 2, 3, 4, 5], (s) => {
        _push(`<button class="${ssrRenderClass([{ active: speed.value === s }, "speed-btn"])}" data-v-5b0bea59>${ssrInterpolate(s)}x </button>`);
      });
      _push(`<!--]--></div><button class="control-btn" data-v-5b0bea59><span data-v-5b0bea59>📕</span> סגור אלבום </button></div><div class="page-thumbs" style="${ssrRenderStyle(bookOpened.value ? null : { display: "none" })}" data-v-5b0bea59><!--[-->`);
      ssrRenderList(isMobile.value ? totalImages.value : totalPages.value, (n) => {
        _push(`<button class="${ssrRenderClass([{ active: currentPage.value === n - 1 }, "thumb-btn"])}" data-v-5b0bea59>${ssrInterpolate(n)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b, _c, _d;
        if (lightboxOpen.value) {
          _push2(`<div class="lightbox" data-v-5b0bea59><div class="lightbox-content" data-v-5b0bea59><button class="lightbox-close" data-v-5b0bea59>✕</button><button class="lightbox-nav prev" data-v-5b0bea59>❯</button><div class="lightbox-image" data-v-5b0bea59><img${ssrRenderAttr("src", (_a = unref(images)[lightboxIndex.value]) == null ? void 0 : _a.src)}${ssrRenderAttr("alt", (_b = unref(images)[lightboxIndex.value]) == null ? void 0 : _b.title)} data-v-5b0bea59></div><button class="lightbox-nav next" data-v-5b0bea59>❮</button><div class="lightbox-info" data-v-5b0bea59><h3 data-v-5b0bea59>${ssrInterpolate((_c = unref(images)[lightboxIndex.value]) == null ? void 0 : _c.title)}</h3><p data-v-5b0bea59>${ssrInterpolate((_d = unref(images)[lightboxIndex.value]) == null ? void 0 : _d.description)}</p><span class="lightbox-counter" data-v-5b0bea59>${ssrInterpolate(lightboxIndex.value + 1)} / ${ssrInterpolate(unref(images).length)}</span></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<section class="cta-section animate-on-scroll zoom-in" data-v-5b0bea59><div class="cta-card" data-v-5b0bea59><span class="cta-icon" data-v-5b0bea59>✨</span><h2 data-v-5b0bea59>רוצים שניצור גם לכם?</h2><p data-v-5b0bea59>כל עוגה ומאפה מותאמים אישית לפי בקשתכם</p><div class="cta-buttons" data-v-5b0bea59>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/quote",
        class: "cta-btn primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` בקשת הצעת מחיר `);
          } else {
            return [
              createTextVNode(" בקשת הצעת מחיר ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: "/menu",
        class: "cta-btn secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` לתפריט `);
          } else {
            return [
              createTextVNode(" לתפריט ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section></div>`);
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Gallery.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const Gallery = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-5b0bea59"]]);
const _sfc_main$j = {
  __name: "About",
  __ssrInlineRender: true,
  setup(__props) {
    useScrollAnimation();
    const route = useRoute();
    const lang = computed(() => route.query.lang === "en" ? "en" : "he");
    const pageTitle = computed(() => lang.value === "en" ? "About margalitut" : "אודות מרגליתות");
    const pageSubtitle = computed(
      () => lang.value === "en" ? "A home bakery with love from Beit Shemesh" : "מאפייה ביתית עם אהבה מבית שמש"
    );
    useHead({
      title: lang.value === "en" ? "About | margalitut Bakery" : "אודות | מרגליתות - מאפייה ביתית בבית שמש",
      meta: [
        {
          name: "description",
          content: lang.value === "en" ? "margalitut - A home bakery in Beit Shemesh. All ingredients are Mehadrin kosher, handmade with love. Delivery to Beit Shemesh, Mateh Yehuda and surrounding areas." : "מרגליתות - מאפייה ביתית בבית שמש. כל הרכיבים בכשרות מהדרין, עבודת יד באהבה. משלוחים לבית שמש, מטה יהודה, צור הדסה וביתר."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "about-page" }, _attrs))} data-v-e328760c><header class="page-header animate-on-scroll fade-up" data-v-e328760c><span class="header-icon" data-v-e328760c>💝</span><h1 class="page-title" data-v-e328760c>${ssrInterpolate(pageTitle.value)}</h1><p class="page-subtitle" data-v-e328760c>${ssrInterpolate(pageSubtitle.value)}</p></header><section class="story-section animate-on-scroll fade-up" data-v-e328760c><div class="story-card" data-v-e328760c><div class="owner-image" data-v-e328760c><img${ssrRenderAttr("src", "")} alt="מרגלית - הבעלים של מרגליתות" data-v-e328760c></div><p data-v-e328760c>מרגליתות היא מאפייה ביתית באזור בית שמש והסביבה שנולדה מתוך אהבה אמיתית לאפייה, יצירה ואנשים.</p><p data-v-e328760c> אני מרגלית, אמא לשני ילדים בוגרים, בת 44, גננת ומורה במקצועי ואוהבת לאפות ולבשל כבר מגיל צעיר. הכל התחיל בכיתה ז&#39;, כשקיבלתי חוברת מתכונים לחג השבועות... משם נוצר חיבור עמוק לעולם האפייה שמלווה אותי עד היום. </p><p data-v-e328760c> עם השנים, המטבח הפך למקום של רוגע, יצירתיות והבעה אישית. <br data-v-e328760c> כאומנית בנשמה, אני מביאה לכל עוגה, קינוח ולכל מאפה: חשיבה, דיוק והמון אהבה. <br data-v-e328760c> כי אצלנו כל מוצר הוא לא &quot;עוד עוגה&quot;, אלא יצירה מיוחדת בפני עצמה. </p><p data-v-e328760c> הרעיון לפתוח מאפייה ביתית הגיע דווקא מהבית — הילדים, שטעמו שוב ושוב מהמאפים, אמרו: <br data-v-e328760c>&quot;את חייבת לפתוח מאפייה!&quot;<br data-v-e328760c> בשנת 2022 החלום הפך למציאות וכך נולדה מרגליתות. </p><p data-v-e328760c> מאז, למרות האתגרים שבדרך, כולל מעבר דירה בתקופת המלחמה, העסק ממשיך לצמוח ולהתפתח באהבה גדולה, תוך תהליך להפוך לעסק רשמי. </p><p data-v-e328760c> במרגליתות תמצאו מגוון רחב של מוצרים: עוגות ביתיות, עוגות יום הולדת מעוצבות, עוגיות מיוחדות וקינוחים, פיצות ומאפים מלוחים לצד חוגי אפייה ויצירה לילדים. </p><p data-v-e328760c> למרגליתות אוסף מתכונים נהדרים שנאספו במשך שנים, חלקם נושאים מסורת וטעם של בית כמו לחמניות לצאת יום כיפור, מופלטות לצאת הפסח, וספינג אוורירי וחגיגי לשמחות, אירועים ולחג החנוכה. </p><p data-v-e328760c> כל המוצרים נעשים בהקפדה על ניקיון ברמה גבוהה, שימוש בחומרי גלם איכותיים ואסתטיקה מוקפדת עם מטרה אחת ברורה: שתהנו מכל ביס ותרצו עוד. </p><p data-v-e328760c> אחד הדברים שמייחדים את מרגליתות הוא השילוב בין אפייה ביתית אמיתית לשירות אישי: אפשר להזמין מראש עוגות ומאפים בהתאמה אישית לאירועים, שבתות וחגים ובמקרים רבים גם למצוא פתרונות להזמנות מהיום להיום. </p><p data-v-e328760c>מרגליתות נמצאת בתהליך צמיחה והתפתחות מתוך אהבה למקצוע וללקוחות, עם שאיפה להמשיך לשמח עוד ועוד אנשים.</p><p style="${ssrRenderStyle({ "font-weight": "bold", "font-size": "1.2rem" })}" data-v-e328760c>מרגליתות - באהבה ובאיכות</p></div></section><section class="values-section" data-v-e328760c><h2 class="section-title animate-on-scroll fade-up" data-v-e328760c>הערכים שלנו</h2><div class="values-grid" data-v-e328760c><div class="value-card animate-on-scroll fade-up delay-1" data-v-e328760c><span class="value-icon" data-v-e328760c>🌿</span><h3 data-v-e328760c>חומרי גלם איכותיים</h3><p data-v-e328760c>אנחנו משתמשים רק בחומרי הגלם הטובים ביותר — טריים ואיכותיים</p></div><div class="value-card animate-on-scroll fade-up delay-2" data-v-e328760c><span class="value-icon" data-v-e328760c>✨</span><h3 data-v-e328760c>ניקיון ללא פשרות</h3><p data-v-e328760c>המטבח שלנו נשמר תמיד נקי ומסודר ברמה הגבוהה ביותר</p></div><div class="value-card animate-on-scroll fade-up delay-3" data-v-e328760c><span class="value-icon" data-v-e328760c>❤️</span><h3 data-v-e328760c>עבודת יד באהבה</h3><p data-v-e328760c>כל מוצר מוכן בעבודת יד עם אהבה ותשומת לב לפרטים</p></div><div class="value-card animate-on-scroll fade-up delay-4" data-v-e328760c><span class="value-icon" data-v-e328760c>✡️</span><h3 data-v-e328760c>כשרות מהדרין</h3><p data-v-e328760c>כל חומרי הגלם שלנו בכשרות בד&quot;ץ ללא פשרות</p></div></div></section><section class="kashrut-section animate-on-scroll fade-up" data-v-e328760c><div class="kashrut-card" data-v-e328760c><div class="kashrut-icon" data-v-e328760c>✡️</div><h2 data-v-e328760c>כשרות והתאמות</h2><div class="kashrut-content" data-v-e328760c><div class="kashrut-item" data-v-e328760c><span class="item-icon" data-v-e328760c>✓</span><span data-v-e328760c>אפייה ביתית בכשרות בד&quot;ץ</span></div><div class="kashrut-item" data-v-e328760c><span class="item-icon" data-v-e328760c>✓</span><span data-v-e328760c>אזור פעילות: בית שמש, מטה יהודה, צור הדסה וביתר</span></div><div class="kashrut-item" data-v-e328760c><span class="item-icon" data-v-e328760c>✓</span><span data-v-e328760c>חלבי או פרווה לפי הצורך</span></div><div class="kashrut-item" data-v-e328760c><span class="item-icon" data-v-e328760c>✓</span><span data-v-e328760c>אפשרויות ללא סוכר וללא גלוטן</span></div><div class="kashrut-item" data-v-e328760c><span class="item-icon" data-v-e328760c>✓</span><span data-v-e328760c>יחס אישי לשביעות רצון הלקוח</span></div></div></div></section><section class="services-section animate-on-scroll fade-up" data-v-e328760c><h2 class="section-title" data-v-e328760c>מה אנחנו מציעים</h2><div class="services-grid" data-v-e328760c><div class="service-card" data-v-e328760c><span class="service-icon" data-v-e328760c>🕯️</span><h3 data-v-e328760c>שבתות וחגים</h3><p data-v-e328760c>חלות, עוגות ומאפים מיוחדים לשבת ולחגים — כולל מתכונים מסורתיים</p></div><div class="service-card" data-v-e328760c><span class="service-icon" data-v-e328760c>🎂</span><h3 data-v-e328760c>אירועים</h3><p data-v-e328760c>עוגות ומאפים לימי הולדת, בר/בת מצווה, בריתות וחינות</p></div><div class="service-card" data-v-e328760c><span class="service-icon" data-v-e328760c>👧</span><h3 data-v-e328760c>חוגי אפייה</h3><p data-v-e328760c>חוגים לילדים בכל הגילאים — חוויה מתוקה ויצירתית</p></div><div class="service-card" data-v-e328760c><span class="service-icon" data-v-e328760c>🚗</span><h3 data-v-e328760c>משלוחים</h3><p data-v-e328760c>משלוחים לבית שמש, מטה יהודה, צור הדסה וביתר</p></div></div></section><section class="contact-section animate-on-scroll zoom-in" data-v-e328760c><div class="contact-card" data-v-e328760c><h2 data-v-e328760c>רוצים להזמין?</h2><p data-v-e328760c>אנחנו כאן בשבילכם!</p><div class="contact-buttons" data-v-e328760c><a href="https://wa.me/972528460331" target="_blank" class="contact-btn whatsapp" data-v-e328760c><span data-v-e328760c>💬</span> וואטסאפ </a><a href="tel:0528460331" class="contact-btn phone" data-v-e328760c><span data-v-e328760c>📱</span> 052-846-0331 </a>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/menu",
        class: "contact-btn menu"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-e328760c${_scopeId}>📋</span> לתפריט `);
          } else {
            return [
              createVNode("span", null, "📋"),
              createTextVNode(" לתפריט ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="contact-address" data-v-e328760c><span data-v-e328760c>📍</span> שכונת המשקפיים, בית שמש</div></div></section></div>`);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/About.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const About = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-e328760c"]]);
const _sfc_main$i = {
  __name: "ProgressSteps",
  __ssrInlineRender: true,
  props: {
    steps: {
      type: Array,
      required: true
    },
    currentStep: {
      type: Number,
      default: 1
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  emits: ["step-click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const progressWidth = computed(() => {
      const totalSteps = props.steps.length;
      const progress = (props.currentStep - 1) / (totalSteps - 1) * 100;
      return `${Math.min(100, Math.max(0, progress))}%`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "progress-steps" }, _attrs))} data-v-b8b514c7><div class="progress-track" data-v-b8b514c7><div class="progress-fill" style="${ssrRenderStyle({ width: progressWidth.value })}" data-v-b8b514c7></div></div><div class="steps-container" data-v-b8b514c7><!--[-->`);
      ssrRenderList(__props.steps, (step, index) => {
        _push(`<div class="${ssrRenderClass([{
          "step-completed": index + 1 < __props.currentStep,
          "step-active": index + 1 === __props.currentStep,
          "step-pending": index + 1 > __props.currentStep
        }, "step"])}" data-v-b8b514c7><div class="step-indicator" data-v-b8b514c7>`);
        if (index + 1 < __props.currentStep) {
          _push(`<span class="step-check" data-v-b8b514c7>✓</span>`);
        } else {
          _push(`<span class="step-number" data-v-b8b514c7>${ssrInterpolate(index + 1)}</span>`);
        }
        _push(`<div class="step-pulse" data-v-b8b514c7></div></div><div class="step-content" data-v-b8b514c7><div class="step-title" data-v-b8b514c7>${ssrInterpolate(step.title)}</div>`);
        if (step.subtitle) {
          _push(`<div class="step-subtitle" data-v-b8b514c7>${ssrInterpolate(step.subtitle)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/ProgressSteps.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const ProgressSteps = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-b8b514c7"]]);
const _sfc_main$h = {
  __name: "AnimatedButton",
  __ssrInlineRender: true,
  props: {
    variant: {
      type: String,
      default: "primary",
      validator: (v) => ["primary", "secondary", "outline", "ghost"].includes(v)
    },
    size: {
      type: String,
      default: "md",
      validator: (v) => ["sm", "md", "lg"].includes(v)
    },
    loading: Boolean,
    disabled: Boolean,
    icon: String
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: ["animated-btn", `btn-${__props.variant}`, `btn-${__props.size}`, { "btn-loading": __props.loading, "btn-disabled": __props.disabled }],
        disabled: __props.disabled || __props.loading
      }, _attrs))} data-v-e6903b93><span class="btn-bg" data-v-e6903b93></span><span class="btn-content" data-v-e6903b93>`);
      if (__props.loading) {
        _push(`<span class="spinner" data-v-e6903b93></span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.icon && !__props.loading) {
        _push(`<span class="btn-icon" data-v-e6903b93>${ssrInterpolate(__props.icon)}</span>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span><span class="btn-shine" data-v-e6903b93></span></button>`);
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/AnimatedButton.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const AnimatedButton = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-e6903b93"]]);
const _sfc_main$g = {
  __name: "StepProducts",
  __ssrInlineRender: true,
  setup(__props) {
    const orderStore = useOrderStore();
    const menuStore = useMenuStore();
    const categories = ["הכל", "עוגות שמרים", "עוגות בחושות", "עוגיות", "לחמים", "גלידות", "ארוחות חלביות"];
    const activeCategory = ref("הכל");
    const filteredProducts = computed(() => {
      if (activeCategory.value === "הכל") {
        return menuStore.products;
      }
      const categoryMap = {
        "עוגות שמרים": "yeast-cakes",
        "עוגות בחושות": "mixed-cakes",
        עוגיות: "cookies",
        לחמים: "breads",
        גלידות: "ice-cream",
        "ארוחות חלביות": "dairy-meals"
      };
      const categoryId = categoryMap[activeCategory.value];
      return menuStore.getProductsByCategory(categoryId);
    });
    const cartItemCount = computed(() => orderStore.cartItemCount);
    const cartTotal = computed(() => orderStore.cartTotal);
    const isSelected = (productId) => {
      return orderStore.cart.some((item) => item.id === productId);
    };
    const getQuantity = (productId) => {
      const item = orderStore.cart.find((item2) => item2.id === productId);
      return (item == null ? void 0 : item.quantity) || 0;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "products-step" }, _attrs))} data-v-b4be7c1c><h3 class="step-title" data-v-b4be7c1c>בחירת מוצרים</h3><p class="step-description" data-v-b4be7c1c>בחרו את המוצרים שתרצו להזמין</p><div class="category-tabs" data-v-b4be7c1c><!--[-->`);
      ssrRenderList(categories, (category) => {
        _push(`<button class="${ssrRenderClass([{ active: activeCategory.value === category }, "category-tab"])}" data-v-b4be7c1c>${ssrInterpolate(category)}</button>`);
      });
      _push(`<!--]--></div><div${ssrRenderAttrs({
        name: "products",
        class: "products-grid"
      })} data-v-b4be7c1c>`);
      ssrRenderList(filteredProducts.value, (product) => {
        _push(`<div class="${ssrRenderClass([{ selected: isSelected(product.id) }, "product-card"])}" data-v-b4be7c1c><div class="product-image-container" data-v-b4be7c1c>`);
        if (product.image && product.image.startsWith("/")) {
          _push(`<img${ssrRenderAttr("src", product.image)}${ssrRenderAttr("alt", product.name)} class="product-img" loading="lazy" data-v-b4be7c1c>`);
        } else {
          _push(`<div class="image-placeholder" data-v-b4be7c1c><span class="placeholder-text" data-v-b4be7c1c>התמונה עוד לא זמינה</span><span class="placeholder-subtext" data-v-b4be7c1c>אבל הטעם כבר פה! 😋</span></div>`);
        }
        _push(`</div><div class="product-info" data-v-b4be7c1c><div class="product-name" data-v-b4be7c1c>${ssrInterpolate(product.name)}</div><div class="product-price" data-v-b4be7c1c>₪${ssrInterpolate(product.price)}</div></div>`);
        if (isSelected(product.id)) {
          _push(`<div class="product-quantity" data-v-b4be7c1c><button class="qty-btn" data-v-b4be7c1c>-</button><span class="qty-value" data-v-b4be7c1c>${ssrInterpolate(getQuantity(product.id))}</span><button class="qty-btn" data-v-b4be7c1c>+</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="product-check" data-v-b4be7c1c>`);
        if (isSelected(product.id)) {
          _push(`<span data-v-b4be7c1c>✓</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (product.popular) {
          _push(`<span class="popular-badge" data-v-b4be7c1c>פופולרי</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`</div>`);
      if (cartItemCount.value > 0) {
        _push(`<div class="cart-summary" data-v-b4be7c1c><div class="summary-content" data-v-b4be7c1c><span class="summary-count" data-v-b4be7c1c>${ssrInterpolate(cartItemCount.value)} פריטים</span><span class="summary-total" data-v-b4be7c1c>סה&quot;כ: ₪${ssrInterpolate(cartTotal.value)}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/form/StepProducts.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const StepProducts = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-b4be7c1c"]]);
const validators = {
  required: (value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return value !== null && value !== void 0;
  },
  email: (value) => {
    if (!value) return true;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value);
  },
  phone: (value) => {
    if (!value) return true;
    const pattern = /^[\d\-\+\s\(\)]{9,15}$/;
    return pattern.test(value.replace(/\s/g, ""));
  },
  minLength: (min) => (value) => {
    if (!value) return true;
    return value.length >= min;
  },
  maxLength: (max) => (value) => {
    if (!value) return true;
    return value.length <= max;
  },
  min: (minVal) => (value) => {
    if (value === "" || value === null) return true;
    return Number(value) >= minVal;
  },
  max: (maxVal) => (value) => {
    if (value === "" || value === null) return true;
    return Number(value) <= maxVal;
  },
  pattern: (regex) => (value) => {
    if (!value) return true;
    return regex.test(value);
  }
};
const errorMessages = {
  required: "שדה חובה",
  email: "כתובת אימייל לא תקינה",
  phone: "מספר טלפון לא תקין",
  minLength: (min) => `מינימום ${min} תווים`,
  maxLength: (max) => `מקסימום ${max} תווים`,
  min: (min) => `ערך מינימלי: ${min}`,
  max: (max) => `ערך מקסימלי: ${max}`,
  pattern: "פורמט לא תקין"
};
function useFormValidation(schema) {
  const errors = reactive({});
  const touched = reactive({});
  const isSubmitting = ref(false);
  const submitCount = ref(0);
  Object.keys(schema).forEach((field) => {
    errors[field] = [];
    touched[field] = false;
  });
  const validateField = (fieldName, value) => {
    var _a;
    const rules = schema[fieldName];
    if (!rules) return [];
    const fieldErrors = [];
    for (const rule of rules) {
      let isValid2 = true;
      let message2 = "";
      if (typeof rule === "string") {
        isValid2 = ((_a = validators[rule]) == null ? void 0 : _a.call(validators, value)) ?? true;
        message2 = errorMessages[rule];
      } else if (typeof rule === "object") {
        const [ruleName, param] = Object.entries(rule)[0];
        const validator = validators[ruleName];
        if (typeof validator === "function") {
          const validatorFn = validator(param);
          isValid2 = typeof validatorFn === "function" ? validatorFn(value) : validatorFn;
          message2 = typeof errorMessages[ruleName] === "function" ? errorMessages[ruleName](param) : errorMessages[ruleName];
        }
      } else if (typeof rule === "function") {
        const result = rule(value);
        if (typeof result === "string") {
          isValid2 = false;
          message2 = result;
        } else {
          isValid2 = result;
          message2 = "ערך לא תקין";
        }
      }
      if (!isValid2) {
        fieldErrors.push(message2);
      }
    }
    errors[fieldName] = fieldErrors;
    return fieldErrors;
  };
  const validateAll = (formData) => {
    let isValid2 = true;
    for (const fieldName of Object.keys(schema)) {
      const value = formData[fieldName];
      touched[fieldName] = true;
      const fieldErrors = validateField(fieldName, value);
      if (fieldErrors.length > 0) {
        isValid2 = false;
      }
    }
    return isValid2;
  };
  const handleBlur = (fieldName, value) => {
    touched[fieldName] = true;
    validateField(fieldName, value);
  };
  const handleChange = (fieldName, value) => {
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  };
  const resetValidation = () => {
    Object.keys(schema).forEach((field) => {
      errors[field] = [];
      touched[field] = false;
    });
    submitCount.value = 0;
  };
  const isValid = computed(() => {
    return Object.values(errors).every((fieldErrors) => fieldErrors.length === 0);
  });
  const hasErrors = computed(() => {
    return Object.values(errors).some((fieldErrors) => fieldErrors.length > 0);
  });
  const getFieldError = (fieldName) => {
    var _a;
    return touched[fieldName] && ((_a = errors[fieldName]) == null ? void 0 : _a[0]);
  };
  const isFieldValid = (fieldName) => {
    var _a;
    return touched[fieldName] && ((_a = errors[fieldName]) == null ? void 0 : _a.length) === 0;
  };
  return {
    errors,
    touched,
    isSubmitting,
    submitCount,
    isValid,
    hasErrors,
    validateField,
    validateAll,
    handleBlur,
    handleChange,
    resetValidation,
    getFieldError,
    isFieldValid
  };
}
const validationSchemas = {
  customerInfo: {
    name: ["required", { minLength: 2 }],
    phone: ["required", "phone"],
    email: ["required", "email"],
    address: []
  }
};
const _sfc_main$f = {
  __name: "AnimatedInput",
  __ssrInlineRender: true,
  props: {
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    type: { type: String, default: "text" },
    icon: String,
    required: Boolean,
    disabled: Boolean,
    error: String,
    isValid: Boolean,
    showValidation: { type: Boolean, default: true },
    rows: { type: Number, default: 4 }
  },
  emits: ["update:modelValue", "focus", "blur"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(null);
    const focused = ref(false);
    const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasValue = computed(() => {
      return props.modelValue !== "" && props.modelValue !== null && props.modelValue !== void 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["input-wrapper", { focused: focused.value, "has-value": hasValue.value, "has-error": __props.error, "is-valid": __props.isValid }]
      }, _attrs))} data-v-76a100af>`);
      if (__props.label) {
        _push(`<label${ssrRenderAttr("for", inputId)} class="input-label" data-v-76a100af>${ssrInterpolate(__props.label)} `);
        if (__props.required) {
          _push(`<span class="required-mark" data-v-76a100af>*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="input-container" data-v-76a100af>`);
      if (__props.icon) {
        _push(`<span class="input-icon" data-v-76a100af>${ssrInterpolate(__props.icon)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.type !== "textarea") {
        _push(`<input${ssrRenderAttr("id", inputId)}${ssrRenderAttr("type", __props.type)}${ssrRenderAttr("value", __props.modelValue)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} class="input-field" data-v-76a100af>`);
      } else {
        _push(`<textarea${ssrRenderAttr("id", inputId)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrRenderAttr("rows", __props.rows)} class="input-field textarea" data-v-76a100af>${ssrInterpolate(__props.modelValue)}</textarea>`);
      }
      if (__props.isValid && __props.showValidation) {
        _push(`<span class="validation-icon valid" data-v-76a100af>✓</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.error && __props.showValidation) {
        _push(`<span class="validation-icon invalid" data-v-76a100af>!</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.error) {
        _push(`<span class="error-message" data-v-76a100af>${ssrInterpolate(__props.error)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="focus-line" data-v-76a100af></div></div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/AnimatedInput.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const AnimatedInput = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-76a100af"]]);
const _sfc_main$e = {
  __name: "StepDetails",
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {
    const orderStore = useOrderStore();
    const validation = useFormValidation(validationSchemas.customerInfo);
    const form = reactive({
      name: "",
      phone: "",
      email: "",
      address: ""
    });
    onMounted(() => {
      if (orderStore.customerInfo.name) form.name = orderStore.customerInfo.name;
      if (orderStore.customerInfo.phone) form.phone = orderStore.customerInfo.phone;
      if (orderStore.customerInfo.email) form.email = orderStore.customerInfo.email;
      if (orderStore.customerInfo.address) form.address = orderStore.customerInfo.address;
    });
    watch(
      form,
      (newForm) => {
        orderStore.setCustomerInfo(newForm);
      },
      { deep: true }
    );
    __expose({
      validate: () => validation.validateAll(form)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "details-step" }, _attrs))} data-v-9e664487><h3 class="step-title" data-v-9e664487>פרטי הלקוח</h3><p class="step-description" data-v-9e664487>מלאו את הפרטים ליצירת קשר</p><form class="details-form" data-v-9e664487><div class="form-row" data-v-9e664487>`);
      _push(ssrRenderComponent(AnimatedInput, {
        modelValue: form.name,
        "onUpdate:modelValue": ($event) => form.name = $event,
        label: "שם מלא",
        placeholder: "שם פרטי ומשפחה",
        icon: "👤",
        required: "",
        error: unref(validation).getFieldError("name"),
        "is-valid": unref(validation).isFieldValid("name"),
        onBlur: ($event) => unref(validation).handleBlur("name", form.name)
      }, null, _parent));
      _push(`</div><div class="form-grid" data-v-9e664487>`);
      _push(ssrRenderComponent(AnimatedInput, {
        modelValue: form.phone,
        "onUpdate:modelValue": ($event) => form.phone = $event,
        label: "טלפון",
        placeholder: "050-0000000",
        type: "tel",
        icon: "📱",
        required: "",
        error: unref(validation).getFieldError("phone"),
        "is-valid": unref(validation).isFieldValid("phone"),
        onBlur: ($event) => unref(validation).handleBlur("phone", form.phone)
      }, null, _parent));
      _push(ssrRenderComponent(AnimatedInput, {
        modelValue: form.email,
        "onUpdate:modelValue": ($event) => form.email = $event,
        label: "אימייל",
        placeholder: "you@example.com",
        type: "email",
        icon: "✉️",
        required: "",
        error: unref(validation).getFieldError("email"),
        "is-valid": unref(validation).isFieldValid("email"),
        onBlur: ($event) => unref(validation).handleBlur("email", form.email)
      }, null, _parent));
      _push(`</div><div class="form-row" data-v-9e664487>`);
      _push(ssrRenderComponent(AnimatedInput, {
        modelValue: form.address,
        "onUpdate:modelValue": ($event) => form.address = $event,
        label: "כתובת למשלוח (אופציונלי)",
        placeholder: "עיר, רחוב ומספר",
        icon: "📍"
      }, null, _parent));
      _push(`</div></form><div class="form-tips" data-v-9e664487><div class="tip" data-v-9e664487><span class="tip-icon" data-v-9e664487>💡</span><span class="tip-text" data-v-9e664487>נחזור אליכם תוך 24 שעות עם הצעת מחיר</span></div></div></div>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/form/StepDetails.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const StepDetails = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-9e664487"]]);
const _sfc_main$d = {
  __name: "StepReview",
  __ssrInlineRender: true,
  emits: ["edit-step"],
  setup(__props) {
    const orderStore = useOrderStore();
    const customerInfo = computed(() => orderStore.customerInfo);
    const cart = computed(() => orderStore.cart);
    const cartItemCount = computed(() => orderStore.cartItemCount);
    const cartTotal = computed(() => orderStore.cartTotal);
    const orderDate = computed({
      get: () => orderStore.orderDate,
      set: (value) => orderStore.orderDate = value
    });
    const specialRequests = computed({
      get: () => orderStore.specialRequests,
      set: (value) => orderStore.specialRequests = value
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "review-step" }, _attrs))} data-v-24a0585b><h3 class="step-title" data-v-24a0585b>סיכום הזמנה</h3><p class="step-description" data-v-24a0585b>בדקו את ההזמנה לפני שליחה</p><div class="review-sections" data-v-24a0585b><div class="review-section" data-v-24a0585b><div class="section-header" data-v-24a0585b><span class="section-icon" data-v-24a0585b>👤</span><h4 data-v-24a0585b>פרטי לקוח</h4><button class="edit-btn" data-v-24a0585b>ערוך</button></div><div class="section-content" data-v-24a0585b><div class="info-row" data-v-24a0585b><span class="info-label" data-v-24a0585b>שם:</span><span class="info-value" data-v-24a0585b>${ssrInterpolate(customerInfo.value.name)}</span></div><div class="info-row" data-v-24a0585b><span class="info-label" data-v-24a0585b>טלפון:</span><span class="info-value" data-v-24a0585b>${ssrInterpolate(customerInfo.value.phone)}</span></div><div class="info-row" data-v-24a0585b><span class="info-label" data-v-24a0585b>אימייל:</span><span class="info-value" data-v-24a0585b>${ssrInterpolate(customerInfo.value.email)}</span></div>`);
      if (customerInfo.value.address) {
        _push(`<div class="info-row" data-v-24a0585b><span class="info-label" data-v-24a0585b>כתובת:</span><span class="info-value" data-v-24a0585b>${ssrInterpolate(customerInfo.value.address)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="review-section" data-v-24a0585b><div class="section-header" data-v-24a0585b><span class="section-icon" data-v-24a0585b>🛒</span><h4 data-v-24a0585b>מוצרים (${ssrInterpolate(cartItemCount.value)})</h4><button class="edit-btn" data-v-24a0585b>ערוך</button></div><div class="section-content" data-v-24a0585b><div${ssrRenderAttrs({
        name: "cart-item",
        class: "cart-items"
      })} data-v-24a0585b>`);
      ssrRenderList(cart.value, (item) => {
        _push(`<div class="cart-item" data-v-24a0585b><span class="item-emoji" data-v-24a0585b>${ssrInterpolate(item.image)}</span><div class="item-details" data-v-24a0585b><div class="item-name" data-v-24a0585b>${ssrInterpolate(item.name)}</div><div class="item-meta" data-v-24a0585b><span class="item-qty" data-v-24a0585b>${ssrInterpolate(item.quantity)} יח&#39;</span><span class="item-price" data-v-24a0585b>₪${ssrInterpolate(item.price * item.quantity)}</span></div></div></div>`);
      });
      _push(`</div></div></div><div class="review-section" data-v-24a0585b><div class="section-header" data-v-24a0585b><span class="section-icon" data-v-24a0585b>📝</span><h4 data-v-24a0585b>פרטים נוספים</h4></div><div class="section-content" data-v-24a0585b><div class="form-field" data-v-24a0585b><label data-v-24a0585b>תאריך מבוקש (אופציונלי)</label><input type="date"${ssrRenderAttr("value", orderDate.value)} class="date-input" data-v-24a0585b></div><div class="form-field" data-v-24a0585b><label data-v-24a0585b>הערות מיוחדות</label><textarea rows="3" placeholder="אלרגיות, העדפות, כמויות מיוחדות..." class="notes-input" data-v-24a0585b>${ssrInterpolate(specialRequests.value)}</textarea></div></div></div><div class="total-section" data-v-24a0585b><div class="total-row" data-v-24a0585b><span data-v-24a0585b>סה&quot;כ מוצרים:</span><span data-v-24a0585b>₪${ssrInterpolate(cartTotal.value)}</span></div><div class="total-row total-final" data-v-24a0585b><span data-v-24a0585b>סה&quot;כ לתשלום (משוער):</span><span class="total-price" data-v-24a0585b>₪${ssrInterpolate(cartTotal.value)}</span></div><p class="total-note" data-v-24a0585b>* המחיר הסופי יאושר בהצעת המחיר</p></div></div></div>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/form/StepReview.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const StepReview = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-24a0585b"]]);
const _sfc_main$c = {
  __name: "StepSuccess",
  __ssrInlineRender: true,
  emits: ["new-order"],
  setup(__props) {
    const router = useRouter();
    const orderStore = useOrderStore();
    const orderId = computed(() => {
      const lastOrder = orderStore.orderHistory[0];
      return (lastOrder == null ? void 0 : lastOrder.id) || Date.now();
    });
    const goHome = () => {
      router.push("/");
    };
    const getConfettiStyle = (n) => {
      const colors = ["#d34a6e", "#ffd700", "#ff8fab", "#667eea", "#27ae60"];
      return {
        "--delay": `${Math.random() * 0.5}s`,
        "--rotation": `${Math.random() * 360}deg`,
        "--x-end": `${(Math.random() - 0.5) * 200}px`,
        "--y-end": `${Math.random() * 150 + 50}px`,
        backgroundColor: colors[n % colors.length]
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "success-step" }, _attrs))} data-v-0f41f51e><div class="success-animation" data-v-0f41f51e><div class="checkmark-circle" data-v-0f41f51e><svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" data-v-0f41f51e><circle class="checkmark-bg" cx="26" cy="26" r="25" fill="none" data-v-0f41f51e></circle><path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" data-v-0f41f51e></path></svg></div><div class="confetti" data-v-0f41f51e><!--[-->`);
      ssrRenderList(20, (n) => {
        _push(`<span class="confetti-piece" style="${ssrRenderStyle(getConfettiStyle(n))}" data-v-0f41f51e></span>`);
      });
      _push(`<!--]--></div></div><h2 class="success-title" data-v-0f41f51e>ההזמנה נשלחה בהצלחה! 🎉</h2><p class="success-message" data-v-0f41f51e> תודה רבה על ההזמנה!<br data-v-0f41f51e> נחזור אליך תוך 24 שעות עם הצעת מחיר. </p><div class="order-reference" data-v-0f41f51e><span class="ref-label" data-v-0f41f51e>מספר הזמנה:</span><span class="ref-number" data-v-0f41f51e>#${ssrInterpolate(orderId.value)}</span></div><div class="success-actions" data-v-0f41f51e>`);
      _push(ssrRenderComponent(AnimatedButton, {
        variant: "primary",
        onClick: ($event) => _ctx.$emit("new-order")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` הזמנה חדשה `);
          } else {
            return [
              createTextVNode(" הזמנה חדשה ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(AnimatedButton, {
        variant: "outline",
        onClick: goHome
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` חזרה לדף הבית `);
          } else {
            return [
              createTextVNode(" חזרה לדף הבית ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="contact-info" data-v-0f41f51e><p data-v-0f41f51e>שאלות? צרו קשר:</p><a href="tel:0528460331" class="contact-link" data-v-0f41f51e>📱 052-846-0331</a></div></div>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/form/StepSuccess.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const StepSuccess = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-0f41f51e"]]);
const _sfc_main$b = {
  __name: "MultiStepForm",
  __ssrInlineRender: true,
  setup(__props) {
    const orderStore = useOrderStore();
    const uiStore = useUIStore();
    const stepDetailsRef = ref(null);
    const transitionDirection = ref("forward");
    const steps = [
      { title: "בחירת מוצרים", subtitle: "מה תרצו להזמין?" },
      { title: "פרטי לקוח", subtitle: "ליצירת קשר" },
      { title: "סיכום", subtitle: "אישור הזמנה" }
    ];
    const currentStep = computed(() => orderStore.currentStep);
    const isLoading = computed(() => orderStore.isLoading);
    computed(() => {
      return transitionDirection.value === "forward" ? "slide-left" : "slide-right";
    });
    const canProceed = computed(() => {
      if (currentStep.value === 1) {
        return orderStore.cartItemCount > 0;
      }
      if (currentStep.value === 2) {
        const info = orderStore.customerInfo;
        return info.name && info.phone && info.email;
      }
      if (currentStep.value === 3) {
        return orderStore.canProceedToCheckout;
      }
      return true;
    });
    const goToStep = (step) => {
      if (step < currentStep.value) {
        transitionDirection.value = "backward";
        orderStore.setStep(step);
      }
    };
    const nextStep = async () => {
      var _a;
      if (currentStep.value === 2 && ((_a = stepDetailsRef.value) == null ? void 0 : _a.validate)) {
        const isValid = stepDetailsRef.value.validate();
        if (!isValid) {
          uiStore.showError("אנא מלאו את כל השדות הנדרשים");
          return;
        }
      }
      transitionDirection.value = "forward";
      orderStore.nextStep();
    };
    const prevStep = () => {
      transitionDirection.value = "backward";
      orderStore.prevStep();
    };
    const submitOrder = async () => {
      try {
        await orderStore.submitOrder();
        uiStore.showSuccess("ההזמנה נשלחה בהצלחה!");
      } catch (error) {
        uiStore.showError("שגיאה בשליחת ההזמנה. נסו שוב.");
      }
    };
    const handleNewOrder = () => {
      orderStore.resetOrder();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "multi-step-form" }, _attrs))} data-v-c5a34f7a>`);
      if (currentStep.value < 4) {
        _push(ssrRenderComponent(ProgressSteps, {
          steps,
          "current-step": currentStep.value,
          clickable: true,
          onStepClick: goToStep
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="form-container" data-v-c5a34f7a>`);
      if (currentStep.value === 1) {
        _push(ssrRenderComponent(StepProducts, { key: "step1" }, null, _parent));
      } else if (currentStep.value === 2) {
        _push(ssrRenderComponent(StepDetails, {
          key: "step2",
          ref_key: "stepDetailsRef",
          ref: stepDetailsRef
        }, null, _parent));
      } else if (currentStep.value === 3) {
        _push(ssrRenderComponent(StepReview, {
          key: "step3",
          onEditStep: goToStep
        }, null, _parent));
      } else if (currentStep.value === 4) {
        _push(ssrRenderComponent(StepSuccess, {
          key: "step4",
          onNewOrder: handleNewOrder
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (currentStep.value < 4) {
        _push(`<div class="form-navigation" data-v-c5a34f7a>`);
        if (currentStep.value > 1) {
          _push(ssrRenderComponent(AnimatedButton, {
            variant: "outline",
            onClick: prevStep
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` חזרה `);
              } else {
                return [
                  createTextVNode(" חזרה ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="nav-spacer" data-v-c5a34f7a></div>`);
        if (currentStep.value < 3) {
          _push(ssrRenderComponent(AnimatedButton, {
            variant: "primary",
            disabled: !canProceed.value,
            onClick: nextStep
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` המשך `);
              } else {
                return [
                  createTextVNode(" המשך ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (currentStep.value === 3) {
          _push(ssrRenderComponent(AnimatedButton, {
            variant: "primary",
            loading: isLoading.value,
            disabled: !canProceed.value,
            onClick: submitOrder
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(isLoading.value ? "שולח..." : "שליחת הזמנה")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(isLoading.value ? "שולח..." : "שליחת הזמנה"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/form/MultiStepForm.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const MultiStepForm = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-c5a34f7a"]]);
const _sfc_main$a = {
  __name: "Quote",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const lang = computed(() => route.query.lang === "en" ? "en" : "he");
    const translations = {
      he: {
        title: "בקשת הצעת מחיר",
        subtitle: "בחרו מוצרים, מלאו פרטים, ונחזור אליכם עם הצעה"
      },
      en: {
        title: "Request a Quote",
        subtitle: "Select products, fill in your details, and we will get back to you with an offer"
      }
    };
    const t = computed(() => translations[lang.value]);
    useHead({
      title: lang.value === "en" ? "Quote | margalitut Bakery" : "בקשת הצעת מחיר | מרגליתות",
      meta: [
        {
          name: "description",
          content: lang.value === "en" ? "Request a custom quote from margalitut Bakery for your special event" : "בקשת הצעת מחיר ממרגליתות - עוגות מעוצבות, הזמנות מיוחדות לאירועים"
        }
      ]
    });
    useOrderStore();
    onMounted(() => {
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "quote-page" }, _attrs))} data-v-1771591a><div class="page-header" data-v-1771591a><h1 class="page-title" data-v-1771591a>${ssrInterpolate(t.value.title)}</h1><p class="page-subtitle" data-v-1771591a>${ssrInterpolate(t.value.subtitle)}</p></div>`);
      _push(ssrRenderComponent(MultiStepForm, null, null, _parent));
      _push(ssrRenderComponent(NotificationToast, null, null, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Quote.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const Quote = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-1771591a"]]);
const _sfc_main$9 = {
  __name: "CouponInput",
  __ssrInlineRender: true,
  setup(__props) {
    useToastStore();
    const orderStore = useOrderStore();
    const isOpen = ref(false);
    const couponCode = ref("");
    const isLoading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "coupon-section" }, _attrs))} data-v-d3366c00><div class="coupon-header" data-v-d3366c00><span class="coupon-icon" data-v-d3366c00>🎫</span><span class="coupon-title" data-v-d3366c00>יש לך קוד קופון?</span><span class="${ssrRenderClass([{ open: isOpen.value }, "coupon-toggle"])}" data-v-d3366c00>❮</span></div>`);
      if (isOpen.value) {
        _push(`<div class="coupon-content" data-v-d3366c00>`);
        if (unref(orderStore).appliedCoupon) {
          _push(`<div class="coupon-applied" data-v-d3366c00><div class="applied-info" data-v-d3366c00><span class="applied-icon" data-v-d3366c00>✓</span><div class="applied-details" data-v-d3366c00><span class="applied-code" data-v-d3366c00>${ssrInterpolate(unref(orderStore).appliedCoupon.code)}</span><span class="applied-desc" data-v-d3366c00>${ssrInterpolate(unref(orderStore).appliedCoupon.description)}</span></div><span class="applied-discount" data-v-d3366c00> -₪${ssrInterpolate(unref(orderStore).couponDiscount)}</span></div><button class="remove-btn" data-v-d3366c00>הסר</button></div>`);
        } else {
          _push(`<div class="coupon-form" data-v-d3366c00><div class="input-wrapper" data-v-d3366c00><input type="text"${ssrRenderAttr("value", couponCode.value)} placeholder="הזינו קוד קופון" class="${ssrRenderClass([{ error: unref(orderStore).couponError }, "coupon-input"])}" dir="ltr" data-v-d3366c00><button class="apply-btn"${ssrIncludeBooleanAttr(!couponCode.value || isLoading.value) ? " disabled" : ""} data-v-d3366c00>`);
          if (isLoading.value) {
            _push(`<span class="loading-spinner small" data-v-d3366c00></span>`);
          } else {
            _push(`<span data-v-d3366c00>החל</span>`);
          }
          _push(`</button></div>`);
          if (unref(orderStore).couponError) {
            _push(`<p class="error-message" data-v-d3366c00><span class="error-icon" data-v-d3366c00>⚠️</span> ${ssrInterpolate(unref(orderStore).couponError)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(orderStore).couponSuccess) {
            _push(`<p class="success-message" data-v-d3366c00><span class="success-icon" data-v-d3366c00>✓</span> ${ssrInterpolate(unref(orderStore).couponSuccess)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/checkout/CouponInput.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const CouponInput = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-d3366c00"]]);
const _sfc_main$8 = {
  __name: "Checkout",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "תפריט | מרגליתות - מאפייה ביתית בבית שמש",
      meta: [
        {
          name: "description",
          content: "תפריט מרגליתות - עוגות שמרים, עוגות בחושות, עוגיות, לחמים, מאפים ללא גלוטן, טבעוניים ועוד. משלוחים לבית שמש."
        }
      ]
    });
    const orderStore = useOrderStore();
    useUIStore();
    const currentStep = ref(1);
    const lastOrderId = ref("");
    const cart = computed(() => orderStore.cart);
    const cartTotal = computed(() => orderStore.cartTotal);
    const isCartEmpty = computed(() => orderStore.isCartEmpty);
    const paymentMethods = computed(() => orderStore.paymentMethods);
    const deliveryPrice = computed(() => orderStore.deliveryPrice);
    const deliveryRequiresCall = computed(() => orderStore.deliveryRequiresCall);
    const orderTotal = computed(() => orderStore.orderTotal);
    const selectedPaymentMethod = computed(() => orderStore.selectedPaymentMethod);
    computed(() => orderStore.selectedLocationData);
    const isLoading = computed(() => orderStore.isLoading);
    const canCompleteOrder = computed(() => orderStore.canCompleteOrder);
    const zone1Locations = computed(() => orderStore.zone1Locations);
    const zone2Locations = computed(() => orderStore.zone2Locations);
    const zone3Locations = computed(() => orderStore.zone3Locations);
    const customerInfo = computed({
      get: () => orderStore.customerInfo,
      set: (val) => orderStore.setCustomerInfo(val)
    });
    const deliveryOption = computed({
      get: () => orderStore.deliveryOption,
      set: (val) => orderStore.setDeliveryOption(val)
    });
    const selectedLocation = computed({
      get: () => orderStore.selectedLocation,
      set: (val) => orderStore.setSelectedLocation(val)
    });
    const paymentMethod = computed({
      get: () => orderStore.paymentMethod,
      set: (val) => orderStore.setPaymentMethod(val)
    });
    const orderDate = computed({
      get: () => orderStore.orderDate,
      set: (val) => {
        orderStore.orderDate = val;
      }
    });
    const orderTime = computed({
      get: () => orderStore.orderTime,
      set: (val) => {
        orderStore.orderTime = val;
      }
    });
    const specialRequests = computed({
      get: () => orderStore.specialRequests,
      set: (val) => {
        orderStore.specialRequests = val;
      }
    });
    const steps = [
      { id: 1, title: "פרטים" },
      { id: 2, title: "משלוח" },
      { id: 3, title: "תשלום" }
    ];
    const minDate = computed(() => {
      const today = /* @__PURE__ */ new Date();
      return today.toISOString().split("T")[0];
    });
    const canProceedStep1 = computed(() => {
      return customerInfo.value.name && customerInfo.value.phone;
    });
    const canProceedStep2 = computed(() => {
      if (deliveryOption.value === "pickup") return true;
      if (deliveryOption.value === "delivery") {
        return selectedLocation.value && customerInfo.value.address;
      }
      return false;
    });
    const resetOrder = () => {
      orderStore.resetOrder();
      currentStep.value = 1;
    };
    const getConfettiStyle = (n) => {
      const colors = ["#d34a6e", "#ffd700", "#ff8fab", "#667eea", "#27ae60"];
      return {
        "--delay": `${Math.random() * 0.5}s`,
        "--rotation": `${Math.random() * 360}deg`,
        "--x-end": `${(Math.random() - 0.5) * 200}px`,
        "--y-end": `${Math.random() * 150 + 50}px`,
        backgroundColor: colors[n % colors.length]
      };
    };
    watch(isCartEmpty, (empty) => {
      if (empty && currentStep.value < 4) {
        currentStep.value = 1;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "checkout-page" }, _attrs))} data-v-6a6783cf>`);
      if (isCartEmpty.value) {
        _push(`<div class="empty-cart" data-v-6a6783cf><span class="empty-icon" data-v-6a6783cf>🛒</span><h2 data-v-6a6783cf>העגלה ריקה</h2><p data-v-6a6783cf>הוסיפו מוצרים מהתפריט כדי להמשיך</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/menu",
          class: "browse-btn"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` לתפריט <span class="btn-arrow" data-v-6a6783cf${_scopeId}>←</span>`);
            } else {
              return [
                createTextVNode(" לתפריט "),
                createVNode("span", { class: "btn-arrow" }, "←")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="checkout-content" data-v-6a6783cf><header class="page-header" data-v-6a6783cf><h1 class="page-title" data-v-6a6783cf>השלמת הזמנה</h1><p class="page-subtitle" data-v-6a6783cf>מלאו את הפרטים ובחרו אופן תשלום</p></header><div class="progress-bar" data-v-6a6783cf><!--[-->`);
        ssrRenderList(steps, (step, index) => {
          _push(`<div class="${ssrRenderClass([{
            active: currentStep.value === index + 1,
            completed: currentStep.value > index + 1
          }, "progress-step"])}" data-v-6a6783cf><span class="step-number" data-v-6a6783cf>`);
          if (currentStep.value > index + 1) {
            _push(`<span data-v-6a6783cf>✓</span>`);
          } else {
            _push(`<span data-v-6a6783cf>${ssrInterpolate(index + 1)}</span>`);
          }
          _push(`</span><span class="step-title" data-v-6a6783cf>${ssrInterpolate(step.title)}</span></div>`);
        });
        _push(`<!--]--></div><div class="checkout-grid" data-v-6a6783cf><div class="checkout-form" data-v-6a6783cf><div style="${ssrRenderStyle(currentStep.value === 1 ? null : { display: "none" })}" class="form-step" data-v-6a6783cf><h2 class="step-heading" data-v-6a6783cf><span class="heading-icon" data-v-6a6783cf>👤</span> פרטי לקוח </h2><div class="form-group" data-v-6a6783cf><label class="form-label" data-v-6a6783cf>שם מלא *</label><input type="text"${ssrRenderAttr("value", customerInfo.value.name)} class="form-input" placeholder="הכניסו את שמכם" required data-v-6a6783cf></div><div class="form-group" data-v-6a6783cf><label class="form-label" data-v-6a6783cf>טלפון *</label><input type="tel"${ssrRenderAttr("value", customerInfo.value.phone)} class="form-input" placeholder="050-0000000" dir="ltr" required data-v-6a6783cf></div><div class="form-group" data-v-6a6783cf><label class="form-label" data-v-6a6783cf>אימייל</label><input type="email"${ssrRenderAttr("value", customerInfo.value.email)} class="form-input" placeholder="your@email.com" dir="ltr" data-v-6a6783cf></div><button class="next-btn"${ssrIncludeBooleanAttr(!canProceedStep1.value) ? " disabled" : ""} data-v-6a6783cf> המשך לבחירת משלוח <span class="btn-arrow" data-v-6a6783cf>←</span></button></div><div style="${ssrRenderStyle(currentStep.value === 2 ? null : { display: "none" })}" class="form-step" data-v-6a6783cf><h2 class="step-heading" data-v-6a6783cf><span class="heading-icon" data-v-6a6783cf>🚗</span> אופן קבלה </h2><div class="delivery-options" data-v-6a6783cf><label class="${ssrRenderClass([{ selected: deliveryOption.value === "pickup" }, "delivery-option"])}" data-v-6a6783cf><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(deliveryOption.value, "pickup")) ? " checked" : ""} value="pickup" data-v-6a6783cf><span class="option-icon" data-v-6a6783cf>🏠</span><div class="option-content" data-v-6a6783cf><span class="option-title" data-v-6a6783cf>איסוף עצמי</span><span class="option-desc" data-v-6a6783cf>איסוף משכונת המשקפיים, בית שמש</span><span class="option-price free" data-v-6a6783cf>חינם</span></div><span class="option-check" data-v-6a6783cf>✓</span></label><label class="${ssrRenderClass([{ selected: deliveryOption.value === "delivery" }, "delivery-option"])}" data-v-6a6783cf><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(deliveryOption.value, "delivery")) ? " checked" : ""} value="delivery" data-v-6a6783cf><span class="option-icon" data-v-6a6783cf>🚗</span><div class="option-content" data-v-6a6783cf><span class="option-title" data-v-6a6783cf>משלוח עד הבית</span><span class="option-desc" data-v-6a6783cf>משלוח לכתובת שתבחרו</span><span class="option-price" data-v-6a6783cf>החל מ-₪20</span></div><span class="option-check" data-v-6a6783cf>✓</span></label></div>`);
        if (deliveryOption.value === "delivery") {
          _push(`<div class="location-selection" data-v-6a6783cf><h3 class="section-subtitle" data-v-6a6783cf>בחרו את הישוב/שכונה:</h3><div class="zone-group" data-v-6a6783cf><div class="zone-header zone-1" data-v-6a6783cf><span class="zone-icon" data-v-6a6783cf>🏠</span><span class="zone-title" data-v-6a6783cf>בית שמש - ₪20</span></div><div class="locations-grid" data-v-6a6783cf><!--[-->`);
          ssrRenderList(zone1Locations.value, (location) => {
            _push(`<label class="${ssrRenderClass([{ selected: selectedLocation.value === location.id }, "location-option"])}" data-v-6a6783cf><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(selectedLocation.value, location.id)) ? " checked" : ""}${ssrRenderAttr("value", location.id)} data-v-6a6783cf><span class="location-name" data-v-6a6783cf>${ssrInterpolate(location.name)}</span><span class="location-check" data-v-6a6783cf>✓</span></label>`);
          });
          _push(`<!--]--></div></div><div class="zone-group" data-v-6a6783cf><div class="zone-header zone-2" data-v-6a6783cf><span class="zone-icon" data-v-6a6783cf>🚗</span><span class="zone-title" data-v-6a6783cf>סביבה קרובה - ₪40</span></div><div class="locations-grid" data-v-6a6783cf><!--[-->`);
          ssrRenderList(zone2Locations.value, (location) => {
            _push(`<label class="${ssrRenderClass([{ selected: selectedLocation.value === location.id }, "location-option"])}" data-v-6a6783cf><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(selectedLocation.value, location.id)) ? " checked" : ""}${ssrRenderAttr("value", location.id)} data-v-6a6783cf><span class="location-name" data-v-6a6783cf>${ssrInterpolate(location.name)}</span><span class="location-check" data-v-6a6783cf>✓</span></label>`);
          });
          _push(`<!--]--></div></div><div class="zone-group" data-v-6a6783cf><div class="zone-header zone-3" data-v-6a6783cf><span class="zone-icon" data-v-6a6783cf>📞</span><span class="zone-title" data-v-6a6783cf>אזורים נוספים - מחיר ייקבע בטלפון</span></div><div class="locations-grid" data-v-6a6783cf><!--[-->`);
          ssrRenderList(zone3Locations.value, (location) => {
            _push(`<label class="${ssrRenderClass([{ selected: selectedLocation.value === location.id }, "location-option"])}" data-v-6a6783cf><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(selectedLocation.value, location.id)) ? " checked" : ""}${ssrRenderAttr("value", location.id)} data-v-6a6783cf><span class="location-name" data-v-6a6783cf>${ssrInterpolate(location.name)}</span><span class="location-check" data-v-6a6783cf>✓</span></label>`);
          });
          _push(`<!--]--></div></div><div class="address-section" data-v-6a6783cf><div class="form-group" data-v-6a6783cf><label class="form-label" data-v-6a6783cf>כתובת מלאה (רחוב ומספר) *</label><input type="text"${ssrRenderAttr("value", customerInfo.value.address)} class="form-input" placeholder="לדוגמה: רחוב הזית 15, דירה 3" data-v-6a6783cf></div></div>`);
          if (deliveryRequiresCall.value) {
            _push(`<div class="call-notice" data-v-6a6783cf><span class="notice-icon" data-v-6a6783cf>📞</span><div class="notice-content" data-v-6a6783cf><strong data-v-6a6783cf>שימו לב!</strong><p data-v-6a6783cf>מחיר המשלוח לאזור זה ייקבע בשיחה טלפונית לאחר ביצוע ההזמנה.</p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="datetime-section" data-v-6a6783cf><h3 class="section-subtitle" data-v-6a6783cf>מתי תרצו לקבל?</h3><div class="datetime-grid" data-v-6a6783cf><div class="form-group" data-v-6a6783cf><label class="form-label" data-v-6a6783cf>תאריך</label><input type="date"${ssrRenderAttr("value", orderDate.value)} class="form-input"${ssrRenderAttr("min", minDate.value)} data-v-6a6783cf></div><div class="form-group" data-v-6a6783cf><label class="form-label" data-v-6a6783cf>שעה מועדפת</label><select class="form-input" data-v-6a6783cf><option value="" data-v-6a6783cf${ssrIncludeBooleanAttr(Array.isArray(orderTime.value) ? ssrLooseContain(orderTime.value, "") : ssrLooseEqual(orderTime.value, "")) ? " selected" : ""}>בחרו שעה</option><option value="09:00-11:00" data-v-6a6783cf${ssrIncludeBooleanAttr(Array.isArray(orderTime.value) ? ssrLooseContain(orderTime.value, "09:00-11:00") : ssrLooseEqual(orderTime.value, "09:00-11:00")) ? " selected" : ""}>09:00-11:00</option><option value="11:00-13:00" data-v-6a6783cf${ssrIncludeBooleanAttr(Array.isArray(orderTime.value) ? ssrLooseContain(orderTime.value, "11:00-13:00") : ssrLooseEqual(orderTime.value, "11:00-13:00")) ? " selected" : ""}>11:00-13:00</option><option value="13:00-15:00" data-v-6a6783cf${ssrIncludeBooleanAttr(Array.isArray(orderTime.value) ? ssrLooseContain(orderTime.value, "13:00-15:00") : ssrLooseEqual(orderTime.value, "13:00-15:00")) ? " selected" : ""}>13:00-15:00</option><option value="15:00-17:00" data-v-6a6783cf${ssrIncludeBooleanAttr(Array.isArray(orderTime.value) ? ssrLooseContain(orderTime.value, "15:00-17:00") : ssrLooseEqual(orderTime.value, "15:00-17:00")) ? " selected" : ""}>15:00-17:00</option><option value="17:00-19:00" data-v-6a6783cf${ssrIncludeBooleanAttr(Array.isArray(orderTime.value) ? ssrLooseContain(orderTime.value, "17:00-19:00") : ssrLooseEqual(orderTime.value, "17:00-19:00")) ? " selected" : ""}>17:00-19:00</option><option value="19:00-21:00" data-v-6a6783cf${ssrIncludeBooleanAttr(Array.isArray(orderTime.value) ? ssrLooseContain(orderTime.value, "19:00-21:00") : ssrLooseEqual(orderTime.value, "19:00-21:00")) ? " selected" : ""}>19:00-21:00</option></select></div></div></div><div class="form-group" data-v-6a6783cf><label class="form-label" data-v-6a6783cf>הערות להזמנה</label><textarea class="form-input form-textarea" placeholder="בקשות מיוחדות, אלרגיות, הנחיות למשלוח..." rows="3" data-v-6a6783cf>${ssrInterpolate(specialRequests.value)}</textarea></div><div class="step-actions" data-v-6a6783cf><button class="back-btn" data-v-6a6783cf><span class="btn-arrow" data-v-6a6783cf>→</span> חזרה </button><button class="next-btn"${ssrIncludeBooleanAttr(!canProceedStep2.value) ? " disabled" : ""} data-v-6a6783cf> המשך לתשלום <span class="btn-arrow" data-v-6a6783cf>←</span></button></div></div><div style="${ssrRenderStyle(currentStep.value === 3 ? null : { display: "none" })}" class="form-step" data-v-6a6783cf><h2 class="step-heading" data-v-6a6783cf><span class="heading-icon" data-v-6a6783cf>💳</span> בחירת אמצעי תשלום </h2><div class="payment-options" data-v-6a6783cf><!--[-->`);
        ssrRenderList(paymentMethods.value, (method) => {
          _push(`<label class="${ssrRenderClass([{ selected: paymentMethod.value === method.id }, "payment-option"])}" data-v-6a6783cf><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(paymentMethod.value, method.id)) ? " checked" : ""}${ssrRenderAttr("value", method.id)} data-v-6a6783cf><span class="payment-icon" data-v-6a6783cf>${ssrInterpolate(method.icon)}</span><div class="payment-content" data-v-6a6783cf><span class="payment-name" data-v-6a6783cf>${ssrInterpolate(method.name)}</span><span class="payment-desc" data-v-6a6783cf>${ssrInterpolate(method.description)}</span></div><span class="payment-check" data-v-6a6783cf>✓</span></label>`);
        });
        _push(`<!--]--></div>`);
        if (selectedPaymentMethod.value) {
          _push(`<div class="payment-instructions" data-v-6a6783cf><div class="${ssrRenderClass([paymentMethod.value, "instructions-card"])}" data-v-6a6783cf><h4 data-v-6a6783cf><span data-v-6a6783cf>${ssrInterpolate(selectedPaymentMethod.value.icon)}</span> הוראות תשלום - ${ssrInterpolate(selectedPaymentMethod.value.name)}</h4><p data-v-6a6783cf>${ssrInterpolate(selectedPaymentMethod.value.instructions)}</p>`);
          if (selectedPaymentMethod.value.link) {
            _push(`<!--[--><div class="payment-amount" data-v-6a6783cf> סכום לתשלום: <strong data-v-6a6783cf>₪${ssrInterpolate(orderTotal.value)}${ssrInterpolate(deliveryRequiresCall.value ? " + משלוח" : "")}</strong></div><a${ssrRenderAttr("href", selectedPaymentMethod.value.link)} target="_blank" class="payment-link-btn" data-v-6a6783cf><span data-v-6a6783cf>לחצו כאן לתשלום ב-${ssrInterpolate(selectedPaymentMethod.value.name)}</span><span class="btn-arrow" data-v-6a6783cf>←</span></a><p class="payment-phone" data-v-6a6783cf> או שלחו תשלום למספר: <strong dir="ltr" data-v-6a6783cf>${ssrInterpolate(selectedPaymentMethod.value.phone)}</strong></p><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          if (paymentMethod.value === "cash") {
            _push(`<div class="cash-note" data-v-6a6783cf><span class="note-icon" data-v-6a6783cf>ℹ️</span><span data-v-6a6783cf>התשלום יתבצע במזומן בעת קבלת ההזמנה</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="step-actions" data-v-6a6783cf><button class="back-btn" data-v-6a6783cf><span class="btn-arrow" data-v-6a6783cf>→</span> חזרה </button><button class="submit-btn"${ssrIncludeBooleanAttr(!canCompleteOrder.value || isLoading.value) ? " disabled" : ""} data-v-6a6783cf>`);
        if (isLoading.value) {
          _push(`<span class="loading-spinner" data-v-6a6783cf></span>`);
        } else {
          _push(`<span data-v-6a6783cf> שליחת הזמנה במייל <span class="btn-icon" data-v-6a6783cf>📱</span></span>`);
        }
        _push(`</button></div></div><div style="${ssrRenderStyle(currentStep.value === 4 ? null : { display: "none" })}" class="form-step success-step" data-v-6a6783cf><div class="success-animation" data-v-6a6783cf><div class="success-circle" data-v-6a6783cf><span class="success-check" data-v-6a6783cf>✓</span></div><div class="confetti" data-v-6a6783cf><!--[-->`);
        ssrRenderList(20, (n) => {
          _push(`<span class="confetti-piece" style="${ssrRenderStyle(getConfettiStyle(n))}" data-v-6a6783cf></span>`);
        });
        _push(`<!--]--></div></div><h2 class="success-title" data-v-6a6783cf>ההזמנה נשלחה בהצלחה! 🎉</h2><p class="success-message" data-v-6a6783cf> תודה רבה על ההזמנה!<br data-v-6a6783cf> נחזור אליכם בהקדם לאישור. </p><div class="order-summary-card" data-v-6a6783cf><div class="summary-row" data-v-6a6783cf><span data-v-6a6783cf>מספר הזמנה:</span><strong data-v-6a6783cf>${ssrInterpolate(lastOrderId.value)}</strong></div><div class="summary-row" data-v-6a6783cf><span data-v-6a6783cf>סה&quot;כ לתשלום:</span><strong data-v-6a6783cf>₪${ssrInterpolate(orderTotal.value)}${ssrInterpolate(deliveryRequiresCall.value ? " + משלוח" : "")}</strong></div><div class="summary-row" data-v-6a6783cf><span data-v-6a6783cf>אמצעי תשלום:</span><strong data-v-6a6783cf>${ssrInterpolate((_a = selectedPaymentMethod.value) == null ? void 0 : _a.name)}</strong></div></div>`);
        if (paymentMethod.value !== "cash") {
          _push(`<div class="payment-reminder" data-v-6a6783cf><span class="reminder-icon" data-v-6a6783cf>💡</span><div class="reminder-content" data-v-6a6783cf><strong data-v-6a6783cf>לא לשכוח לשלם!</strong><p data-v-6a6783cf>לחצו על הכפתור למטה לביצוע התשלום</p><a${ssrRenderAttr("href", (_b = selectedPaymentMethod.value) == null ? void 0 : _b.link)} target="_blank" class="reminder-btn" data-v-6a6783cf> לתשלום ב-${ssrInterpolate((_c = selectedPaymentMethod.value) == null ? void 0 : _c.name)}</a></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="success-actions" data-v-6a6783cf>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/menu",
          class: "new-order-btn",
          onClick: resetOrder
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` להזמנה חדשה `);
            } else {
              return [
                createTextVNode(" להזמנה חדשה ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_router_link, {
          to: "/",
          class: "home-btn"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` לדף הבית `);
            } else {
              return [
                createTextVNode(" לדף הבית ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="contact-footer" data-v-6a6783cf><p data-v-6a6783cf>שאלות? צרו קשר:</p><a href="tel:0528460331" class="contact-link" data-v-6a6783cf>📱 052-846-0331</a></div></div></div>`);
        if (currentStep.value < 4) {
          _push(`<div class="order-summary" data-v-6a6783cf><div class="summary-card" data-v-6a6783cf><h3 class="summary-title" data-v-6a6783cf><span data-v-6a6783cf>🛒</span> סיכום הזמנה </h3><div class="summary-items" data-v-6a6783cf><!--[-->`);
          ssrRenderList(cart.value, (item) => {
            _push(`<div class="summary-item" data-v-6a6783cf><span class="item-emoji" data-v-6a6783cf>${ssrInterpolate(item.image)}</span><div class="item-info" data-v-6a6783cf><span class="item-name" data-v-6a6783cf>${ssrInterpolate(item.name)}</span><span class="item-qty" data-v-6a6783cf>x${ssrInterpolate(item.quantity)}</span></div><span class="item-price" data-v-6a6783cf>₪${ssrInterpolate(item.price * item.quantity)}</span></div>`);
          });
          _push(`<!--]--></div>`);
          _push(ssrRenderComponent(CouponInput, null, null, _parent));
          _push(`<div class="summary-totals" data-v-6a6783cf><div class="total-row" data-v-6a6783cf><span data-v-6a6783cf>סה&quot;כ מוצרים</span><span data-v-6a6783cf>₪${ssrInterpolate(cartTotal.value)}</span></div><div class="total-row" data-v-6a6783cf><span data-v-6a6783cf>משלוח</span>`);
          if (deliveryOption.value === "pickup") {
            _push(`<span class="free-delivery" data-v-6a6783cf>חינם</span>`);
          } else if (unref(orderStore).hasFreeDelivery) {
            _push(`<span class="free-delivery" data-v-6a6783cf>חינם (קופון)</span>`);
          } else if (deliveryPrice.value > 0) {
            _push(`<span data-v-6a6783cf>₪${ssrInterpolate(deliveryPrice.value)}</span>`);
          } else if (deliveryRequiresCall.value) {
            _push(`<span class="call-note" data-v-6a6783cf>ייקבע בטלפון</span>`);
          } else {
            _push(`<span data-v-6a6783cf>-</span>`);
          }
          _push(`</div>`);
          if (unref(orderStore).appliedCoupon) {
            _push(`<div class="total-row discount-row" data-v-6a6783cf><span data-v-6a6783cf> הנחה (${ssrInterpolate(unref(orderStore).appliedCoupon.code)}) </span><span class="discount-value" data-v-6a6783cf>-₪${ssrInterpolate(unref(orderStore).couponDiscount)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="total-row final" data-v-6a6783cf><span data-v-6a6783cf>סה&quot;כ לתשלום</span><span class="final-price" data-v-6a6783cf> ₪${ssrInterpolate(unref(orderStore).finalTotal)} `);
          if (deliveryRequiresCall.value && !unref(orderStore).hasFreeDelivery) {
            _push(`<span class="plus-delivery" data-v-6a6783cf>+</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span></div></div><button class="edit-cart-btn" data-v-6a6783cf>✏️ עריכת עגלה</button></div><div class="trust-badges" data-v-6a6783cf><div class="badge" data-v-6a6783cf><span class="badge-icon" data-v-6a6783cf>✡️</span><span data-v-6a6783cf>כל הרכיבים בכשרות מהדרין</span></div><div class="badge" data-v-6a6783cf><span class="badge-icon" data-v-6a6783cf>🔒</span><span data-v-6a6783cf>תשלום מאובטח</span></div><div class="badge" data-v-6a6783cf><span class="badge-icon" data-v-6a6783cf>💬</span><span data-v-6a6783cf>תמיכה בוואטסאפ</span></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Checkout.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const Checkout = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-6a6783cf"]]);
const _sfc_main$7 = {
  __name: "Admin",
  __ssrInlineRender: true,
  setup(__props) {
    useToastStore();
    const reviews = ref([]);
    const activeTab = ref("orders");
    const reviewFilter = ref("all");
    const isLoggedIn = ref(false);
    const isLoggingIn = ref(false);
    const email = ref("");
    const password = ref("");
    const loginError = ref("");
    const userEmail = ref("");
    const orders = ref([]);
    const isLoading = ref(false);
    const currentFilter = ref("all");
    const searchQuery = ref("");
    let unsubscribeAuth = null;
    const statusFilters = [
      { value: "all", label: "הכל", icon: "📋" },
      { value: "pending", label: "ממתינות", icon: "⏳" },
      { value: "confirmed", label: "אושרו", icon: "✅" },
      { value: "preparing", label: "בהכנה", icon: "👨‍🍳" },
      { value: "ready", label: "מוכנות", icon: "📦" },
      { value: "delivered", label: "נמסרו", icon: "🚗" },
      { value: "cancelled", label: "בוטלו", icon: "❌" }
    ];
    const filteredOrders = computed(() => {
      let result = orders.value;
      if (currentFilter.value !== "all") {
        result = result.filter((order) => order.status === currentFilter.value);
      }
      if (searchQuery.value) {
        const query2 = searchQuery.value.toLowerCase();
        result = result.filter(
          (order) => {
            var _a, _b, _c, _d, _e;
            return ((_b = (_a = order.customer) == null ? void 0 : _a.name) == null ? void 0 : _b.toLowerCase().includes(query2)) || ((_d = (_c = order.customer) == null ? void 0 : _c.phone) == null ? void 0 : _d.includes(query2)) || ((_e = order.orderId) == null ? void 0 : _e.toLowerCase().includes(query2));
          }
        );
      }
      return result;
    });
    const pendingOrders = computed(() => orders.value.filter((o) => o.status === "pending"));
    const preparingOrders = computed(() => orders.value.filter((o) => o.status === "preparing"));
    const completedToday = computed(() => {
      const today = (/* @__PURE__ */ new Date()).toDateString();
      return orders.value.filter((o) => {
        var _a, _b, _c;
        const orderDate = ((_c = (_b = (_a = o.createdAt) == null ? void 0 : _a.toDate) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.toDateString()) || "";
        return orderDate === today && o.status === "delivered";
      });
    });
    const todayRevenue = computed(() => {
      const today = (/* @__PURE__ */ new Date()).toDateString();
      return orders.value.filter((o) => {
        var _a, _b, _c;
        const orderDate = ((_c = (_b = (_a = o.createdAt) == null ? void 0 : _a.toDate) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.toDateString()) || "";
        return orderDate === today && o.paymentStatus === "paid";
      }).reduce((sum, o) => sum + (o.total || 0), 0);
    });
    async function loadReviews() {
      try {
        reviews.value = await getAllReviews();
      } catch (error) {
        console.error("Error loading reviews:", error);
      }
    }
    const filteredReviews = computed(() => {
      if (reviewFilter.value === "all") return reviews.value;
      return reviews.value.filter((r) => r.status === reviewFilter.value);
    });
    const reviewCounts = computed(() => ({
      all: reviews.value.length,
      pending: reviews.value.filter((r) => r.status === "pending").length,
      approved: reviews.value.filter((r) => r.status === "approved").length,
      rejected: reviews.value.filter((r) => r.status === "rejected").length
    }));
    async function loadOrders() {
      isLoading.value = true;
      try {
        orders.value = await getAllOrders();
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        isLoading.value = false;
      }
    }
    function getFilterCount(filter) {
      if (filter === "all") return orders.value.length;
      return orders.value.filter((o) => o.status === filter).length;
    }
    function getStatusLabel(status) {
      const labels = {
        pending: "ממתין",
        confirmed: "אושר",
        preparing: "בהכנה",
        ready: "מוכן",
        delivered: "נמסר",
        cancelled: "בוטל"
      };
      return labels[status] || status;
    }
    function getPaymentLabel(method) {
      const labels = {
        bit: "💙 Bit",
        paybox: "📦 PayBox",
        cash: "💵 מזומן"
      };
      return labels[method] || method;
    }
    function getPaymentStatusLabel(status) {
      const labels = {
        pending: "לא שולם",
        awaiting: "ממתין",
        paid: "שולם ✓"
      };
      return labels[status] || status;
    }
    function formatDate(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat("he-IL", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    }
    onMounted(() => {
      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          isLoggedIn.value = true;
          userEmail.value = user.email;
          await loadOrders();
          await loadReviews();
        } else {
          isLoggedIn.value = false;
          userEmail.value = "";
        }
      });
    });
    onUnmounted(() => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))} data-v-f77573b3>`);
      if (!isLoggedIn.value) {
        _push(`<div class="login-screen" data-v-f77573b3><div class="login-card" data-v-f77573b3><h1 class="login-title" data-v-f77573b3>🔐 כניסת מנהל</h1><p class="login-subtitle" data-v-f77573b3>הכניסו את פרטי ההתחברות</p><div class="form-group" data-v-f77573b3><label class="form-label" data-v-f77573b3>אימייל</label><input type="email"${ssrRenderAttr("value", email.value)} class="form-input" placeholder="admin@margalitut.co.il" dir="ltr" data-v-f77573b3></div><div class="form-group" data-v-f77573b3><label class="form-label" data-v-f77573b3>סיסמה</label><input type="password"${ssrRenderAttr("value", password.value)} class="form-input" placeholder="••••••••" dir="ltr" data-v-f77573b3></div><button class="login-btn"${ssrIncludeBooleanAttr(!email.value || !password.value || isLoggingIn.value) ? " disabled" : ""} data-v-f77573b3>`);
        if (isLoggingIn.value) {
          _push(`<span class="loading-spinner small" data-v-f77573b3></span>`);
        } else {
          _push(`<span data-v-f77573b3>כניסה</span>`);
        }
        _push(`</button>`);
        if (loginError.value) {
          _push(`<p class="login-error" data-v-f77573b3>${ssrInterpolate(loginError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="admin-dashboard" data-v-f77573b3><header class="admin-header" data-v-f77573b3><div class="header-right" data-v-f77573b3><h1 class="admin-title" data-v-f77573b3>📋 לוח בקרה</h1></div><div class="header-left" data-v-f77573b3><span class="user-email" data-v-f77573b3>${ssrInterpolate(userEmail.value)}</span><button class="refresh-btn"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-f77573b3><span class="${ssrRenderClass({ spinning: isLoading.value })}" data-v-f77573b3>🔄</span> רענן </button><button class="logout-btn" data-v-f77573b3>יציאה</button></div></header><div class="main-tabs" data-v-f77573b3><button class="${ssrRenderClass([{ active: activeTab.value === "orders" }, "main-tab"])}" data-v-f77573b3><span class="tab-icon" data-v-f77573b3>📦</span><span class="tab-label" data-v-f77573b3>הזמנות</span>`);
        if (pendingOrders.value.length > 0) {
          _push(`<span class="tab-badge" data-v-f77573b3>${ssrInterpolate(pendingOrders.value.length)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button><button class="${ssrRenderClass([{ active: activeTab.value === "reviews" }, "main-tab"])}" data-v-f77573b3><span class="tab-icon" data-v-f77573b3>⭐</span><span class="tab-label" data-v-f77573b3>ביקורות</span>`);
        if (reviewCounts.value.pending > 0) {
          _push(`<span class="tab-badge" data-v-f77573b3>${ssrInterpolate(reviewCounts.value.pending)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button></div><div style="${ssrRenderStyle(activeTab.value === "orders" ? null : { display: "none" })}" class="orders-tab" data-v-f77573b3><div class="stats-grid" data-v-f77573b3><div class="stat-card" data-v-f77573b3><span class="stat-icon" data-v-f77573b3>📦</span><div class="stat-content" data-v-f77573b3><span class="stat-value" data-v-f77573b3>${ssrInterpolate(pendingOrders.value.length)}</span><span class="stat-label" data-v-f77573b3>ממתינות</span></div></div><div class="stat-card" data-v-f77573b3><span class="stat-icon" data-v-f77573b3>👨‍🍳</span><div class="stat-content" data-v-f77573b3><span class="stat-value" data-v-f77573b3>${ssrInterpolate(preparingOrders.value.length)}</span><span class="stat-label" data-v-f77573b3>בהכנה</span></div></div><div class="stat-card" data-v-f77573b3><span class="stat-icon" data-v-f77573b3>✅</span><div class="stat-content" data-v-f77573b3><span class="stat-value" data-v-f77573b3>${ssrInterpolate(completedToday.value.length)}</span><span class="stat-label" data-v-f77573b3>הושלמו היום</span></div></div><div class="stat-card" data-v-f77573b3><span class="stat-icon" data-v-f77573b3>💰</span><div class="stat-content" data-v-f77573b3><span class="stat-value" data-v-f77573b3>₪${ssrInterpolate(todayRevenue.value)}</span><span class="stat-label" data-v-f77573b3>הכנסות היום</span></div></div></div><div class="filters-bar" data-v-f77573b3><div class="filter-tabs" data-v-f77573b3><!--[-->`);
        ssrRenderList(statusFilters, (filter) => {
          _push(`<button class="${ssrRenderClass([{ active: currentFilter.value === filter.value }, "filter-tab"])}" data-v-f77573b3><span class="filter-icon" data-v-f77573b3>${ssrInterpolate(filter.icon)}</span><span class="filter-label" data-v-f77573b3>${ssrInterpolate(filter.label)}</span><span class="filter-count" data-v-f77573b3>${ssrInterpolate(getFilterCount(filter.value))}</span></button>`);
        });
        _push(`<!--]--></div><div class="search-box" data-v-f77573b3><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="חיפוש לפי שם או טלפון..." class="search-input" data-v-f77573b3><span class="search-icon" data-v-f77573b3>🔍</span></div></div><div class="orders-list" data-v-f77573b3>`);
        if (isLoading.value) {
          _push(`<div class="loading-state" data-v-f77573b3><span class="loading-spinner" data-v-f77573b3></span><p data-v-f77573b3>טוען הזמנות...</p></div>`);
        } else if (filteredOrders.value.length === 0) {
          _push(`<div class="empty-state" data-v-f77573b3><span class="empty-icon" data-v-f77573b3>📭</span><h3 data-v-f77573b3>אין הזמנות</h3><p data-v-f77573b3>לא נמצאו הזמנות בקטגוריה זו</p></div>`);
        } else {
          _push(`<div${ssrRenderAttrs({
            name: "order-list",
            class: "orders-container"
          })} data-v-f77573b3>`);
          ssrRenderList(filteredOrders.value, (order) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
            _push(`<div class="${ssrRenderClass([[`status-${order.status}`], "order-card"])}" data-v-f77573b3><div class="order-header" data-v-f77573b3><div class="order-id" data-v-f77573b3><span class="id-label" data-v-f77573b3>הזמנה</span><span class="id-value" data-v-f77573b3>#${ssrInterpolate(order.orderId || order.id.slice(-6))}</span></div><div class="order-time" data-v-f77573b3>${ssrInterpolate(formatDate(order.createdAt))}</div><div class="${ssrRenderClass([order.status, "order-status"])}" data-v-f77573b3>${ssrInterpolate(getStatusLabel(order.status))}</div></div><div class="order-customer" data-v-f77573b3><div class="customer-name" data-v-f77573b3><span class="icon" data-v-f77573b3>👤</span> ${ssrInterpolate((_a = order.customer) == null ? void 0 : _a.name)}</div><a${ssrRenderAttr("href", `tel:${(_b = order.customer) == null ? void 0 : _b.phone}`)} class="customer-phone" data-v-f77573b3><span class="icon" data-v-f77573b3>📱</span> ${ssrInterpolate((_c = order.customer) == null ? void 0 : _c.phone)}</a><a${ssrRenderAttr("href", `https://wa.me/972${(_e = (_d = order.customer) == null ? void 0 : _d.phone) == null ? void 0 : _e.replace(/^0/, "")}`)} target="_blank" class="whatsapp-link" data-v-f77573b3> 💬 וואטסאפ </a></div><div class="order-delivery" data-v-f77573b3>`);
            if (((_f = order.delivery) == null ? void 0 : _f.option) === "pickup") {
              _push(`<span class="delivery-badge pickup" data-v-f77573b3> 🏠 איסוף עצמי </span>`);
            } else {
              _push(`<span class="delivery-badge delivery" data-v-f77573b3> 🚗 משלוח - ${ssrInterpolate((_h = (_g = order.delivery) == null ? void 0 : _g.location) == null ? void 0 : _h.name)} `);
              if ((_i = order.delivery) == null ? void 0 : _i.price) {
                _push(`<span data-v-f77573b3>(₪${ssrInterpolate((_j = order.delivery) == null ? void 0 : _j.price)})</span>`);
              } else if ((_k = order.delivery) == null ? void 0 : _k.requiresCall) {
                _push(`<span data-v-f77573b3>(לתאם מחיר)</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</span>`);
            }
            if ((_l = order.customer) == null ? void 0 : _l.address) {
              _push(`<span class="delivery-address" data-v-f77573b3> 📍 ${ssrInterpolate((_m = order.customer) == null ? void 0 : _m.address)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="order-items" data-v-f77573b3><!--[-->`);
            ssrRenderList(order.items, (item) => {
              _push(`<div class="order-item" data-v-f77573b3><span class="item-emoji" data-v-f77573b3>${ssrInterpolate(item.image)}</span><span class="item-name" data-v-f77573b3>${ssrInterpolate(item.name)}</span><span class="item-qty" data-v-f77573b3>x${ssrInterpolate(item.quantity)}</span><span class="item-price" data-v-f77573b3>₪${ssrInterpolate(item.price * item.quantity)}</span></div>`);
            });
            _push(`<!--]--></div>`);
            if (order.specialRequests) {
              _push(`<div class="order-notes" data-v-f77573b3><span class="notes-icon" data-v-f77573b3>📝</span><span class="notes-text" data-v-f77573b3>${ssrInterpolate(order.specialRequests)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            if (order.date || order.time) {
              _push(`<div class="order-datetime" data-v-f77573b3>`);
              if (order.date) {
                _push(`<span class="datetime-item" data-v-f77573b3> 📅 ${ssrInterpolate(order.date)}</span>`);
              } else {
                _push(`<!---->`);
              }
              if (order.time) {
                _push(`<span class="datetime-item" data-v-f77573b3> 🕐 ${ssrInterpolate(order.time)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="order-footer" data-v-f77573b3><div class="order-total" data-v-f77573b3><span class="total-label" data-v-f77573b3>סה&quot;כ:</span><span class="total-value" data-v-f77573b3>₪${ssrInterpolate(order.total)}</span></div><div class="payment-info" data-v-f77573b3><span class="payment-method" data-v-f77573b3>${ssrInterpolate(getPaymentLabel((_n = order.payment) == null ? void 0 : _n.method))}</span><span class="${ssrRenderClass([order.paymentStatus, "payment-status"])}" data-v-f77573b3>${ssrInterpolate(getPaymentStatusLabel(order.paymentStatus))}</span></div><div class="status-actions" data-v-f77573b3><select${ssrRenderAttr("value", order.status)} class="status-select" data-v-f77573b3><option value="pending" data-v-f77573b3>ממתין</option><option value="confirmed" data-v-f77573b3>אושר</option><option value="preparing" data-v-f77573b3>בהכנה</option><option value="ready" data-v-f77573b3>מוכן</option><option value="delivered" data-v-f77573b3>נמסר</option><option value="cancelled" data-v-f77573b3>בוטל</option></select><select${ssrRenderAttr("value", order.paymentStatus)} class="payment-select" data-v-f77573b3><option value="pending" data-v-f77573b3>לא שולם</option><option value="awaiting" data-v-f77573b3>ממתין לתשלום</option><option value="paid" data-v-f77573b3>שולם</option></select></div></div></div>`);
          });
          _push(`</div>`);
        }
        _push(`</div></div><div style="${ssrRenderStyle(activeTab.value === "reviews" ? null : { display: "none" })}" class="reviews-tab" data-v-f77573b3><div class="reviews-filter" data-v-f77573b3><!--[-->`);
        ssrRenderList([
          { id: "all", label: "הכל", icon: "📋" },
          { id: "pending", label: "ממתינות", icon: "⏳" },
          { id: "approved", label: "מאושרות", icon: "✓" },
          { id: "rejected", label: "נדחו", icon: "✕" }
        ], (filter) => {
          _push(`<button class="${ssrRenderClass([{ active: reviewFilter.value === filter.id }, "filter-btn"])}" data-v-f77573b3><span data-v-f77573b3>${ssrInterpolate(filter.icon)}</span><span data-v-f77573b3>${ssrInterpolate(filter.label)}</span><span class="count" data-v-f77573b3>(${ssrInterpolate(reviewCounts.value[filter.id])})</span></button>`);
        });
        _push(`<!--]--></div><div class="reviews-list" data-v-f77573b3>`);
        if (filteredReviews.value.length === 0) {
          _push(`<div class="empty-state" data-v-f77573b3><span class="empty-icon" data-v-f77573b3>⭐</span><h3 data-v-f77573b3>אין ביקורות</h3><p data-v-f77573b3>אין ביקורות להצגה</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(filteredReviews.value, (review) => {
          var _a, _b;
          _push(`<div class="${ssrRenderClass([review.status, "review-card"])}" data-v-f77573b3><div class="review-header" data-v-f77573b3><div class="reviewer-info" data-v-f77573b3><div class="avatar" data-v-f77573b3><span data-v-f77573b3>${ssrInterpolate(((_a = review.name) == null ? void 0 : _a.charAt(0)) || "?")}</span></div><div class="info" data-v-f77573b3><h4 data-v-f77573b3>${ssrInterpolate(review.name)}</h4><span class="location" data-v-f77573b3>${ssrInterpolate(review.location || "לא צוין")}</span></div></div><div class="review-rating" data-v-f77573b3><!--[-->`);
          ssrRenderList(5, (star) => {
            _push(`<span class="${ssrRenderClass([{ filled: star <= review.rating }, "star"])}" data-v-f77573b3>★</span>`);
          });
          _push(`<!--]--></div></div><div class="review-meta" data-v-f77573b3><span class="meta-item" data-v-f77573b3><span class="meta-icon" data-v-f77573b3>📦</span> ${ssrInterpolate(review.product || "לא צוין")}</span><span class="meta-item" data-v-f77573b3><span class="meta-icon" data-v-f77573b3>📱</span> ${ssrInterpolate(review.phone || "לא צוין")}</span><span class="meta-item" data-v-f77573b3><span class="meta-icon" data-v-f77573b3>💬</span> ${ssrInterpolate(review.source || "אתר")}</span></div><p class="review-text" data-v-f77573b3>&quot;${ssrInterpolate(review.text)}&quot;</p><div class="review-footer" data-v-f77573b3><span class="review-date" data-v-f77573b3>${ssrInterpolate(((_b = review.createdAt) == null ? void 0 : _b.toDate) ? review.createdAt.toDate().toLocaleDateString("he-IL") : "לא ידוע")}</span><span class="${ssrRenderClass([review.status, "status-badge"])}" data-v-f77573b3>${ssrInterpolate(review.status === "pending" ? "ממתין" : review.status === "approved" ? "מאושר" : "נדחה")}</span></div><div class="review-actions" data-v-f77573b3>`);
          if (review.status !== "approved") {
            _push(`<button class="action-btn approve" data-v-f77573b3> ✓ אשר </button>`);
          } else {
            _push(`<!---->`);
          }
          if (review.status !== "rejected") {
            _push(`<button class="action-btn reject" data-v-f77573b3> ✕ דחה </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="action-btn delete" data-v-f77573b3>🗑️ מחק</button></div></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Admin.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Admin = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-f77573b3"]]);
const _sfc_main$6 = {
  __name: "MyOrders",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "תפריט | מרגליתות - מאפייה ביתית בבית שמש",
      meta: [
        {
          name: "description",
          content: "תפריט מרגליתות - עוגות שמרים, עוגות בחושות, עוגיות, לחמים, מאפים ללא גלוטן, טבעוניים ועוד. משלוחים לבית שמש."
        }
      ]
    });
    useRouter();
    useOrderStore();
    const phoneNumber2 = ref("");
    const orderIdSearch = ref("");
    const orders = ref([]);
    const isLoading = ref(false);
    const isSearched = ref(false);
    const searchMode = ref("phone");
    const isValidPhone = computed(() => {
      const cleaned = phoneNumber2.value.replace(/\D/g, "");
      return cleaned.length >= 9 && cleaned.length <= 10;
    });
    function getStatusIcon(status) {
      const icons = {
        pending: "⏳",
        confirmed: "✅",
        preparing: "👨‍🍳",
        ready: "📦",
        delivered: "🚗",
        cancelled: "❌"
      };
      return icons[status] || "📋";
    }
    function getStatusLabel(status) {
      const labels = {
        pending: "ממתין לאישור",
        confirmed: "אושר",
        preparing: "בהכנה",
        ready: "מוכן לאיסוף/משלוח",
        delivered: "נמסר",
        cancelled: "בוטל"
      };
      return labels[status] || status;
    }
    function getPaymentLabel(method) {
      const labels = {
        bit: "💙 Bit",
        paybox: "📦 PayBox",
        cash: "💵 מזומן"
      };
      return labels[method] || method;
    }
    function getPaymentStatusLabel(status) {
      const labels = {
        pending: "לא שולם",
        awaiting: "ממתין לתשלום",
        paid: "שולם ✓"
      };
      return labels[status] || status;
    }
    function formatDate(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat("he-IL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "my-orders-page" }, _attrs))} data-v-717095ab><header class="page-header" data-v-717095ab><h1 class="page-title" data-v-717095ab>📜 ההזמנות שלי</h1><p class="page-subtitle" data-v-717095ab>צפייה בהיסטוריית ההזמנות</p></header>`);
      if (!isSearched.value) {
        _push(`<div class="phone-search" data-v-717095ab><div class="search-card" data-v-717095ab><h2 data-v-717095ab>חיפוש הזמנות</h2><p data-v-717095ab>מצאו את ההזמנות שלכם</p><div class="search-tabs" data-v-717095ab><button class="${ssrRenderClass([{ active: searchMode.value === "phone" }, "tab-btn"])}" data-v-717095ab> 🔍 לפי טלפון </button><button class="${ssrRenderClass([{ active: searchMode.value === "order" }, "tab-btn"])}" data-v-717095ab> 📋 לפי מספר הזמנה </button></div><div class="form-group" data-v-717095ab><input type="tel"${ssrRenderAttr("value", phoneNumber2.value)} class="form-input" placeholder="מספר טלפון" dir="ltr" data-v-717095ab></div>`);
        if (searchMode.value === "order") {
          _push(`<div class="form-group" data-v-717095ab><input type="text"${ssrRenderAttr("value", orderIdSearch.value)} class="form-input" placeholder="מספר הזמנה (לדוגמה: MRG-ABC123)" dir="ltr" data-v-717095ab></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="search-btn"${ssrIncludeBooleanAttr(!isValidPhone.value || isLoading.value) ? " disabled" : ""} data-v-717095ab>`);
        if (isLoading.value) {
          _push(`<span class="loading-spinner small" data-v-717095ab></span>`);
        } else {
          _push(`<span data-v-717095ab>${ssrInterpolate(searchMode.value === "order" ? "חפש הזמנה" : "הצג כל ההזמנות")} <span class="btn-icon" data-v-717095ab>🔍</span></span>`);
        }
        _push(`</button></div></div>`);
      } else {
        _push(`<div class="orders-section" data-v-717095ab><div class="section-header" data-v-717095ab><div class="header-info" data-v-717095ab><span class="phone-display" data-v-717095ab>📱 ${ssrInterpolate(phoneNumber2.value)}</span><span class="orders-count" data-v-717095ab>${ssrInterpolate(orders.value.length)} הזמנות</span></div><button class="change-phone-btn" data-v-717095ab>שינוי מספר</button></div>`);
        if (isLoading.value) {
          _push(`<div class="loading-state" data-v-717095ab><span class="loading-spinner" data-v-717095ab></span><p data-v-717095ab>טוען הזמנות...</p></div>`);
        } else if (orders.value.length === 0) {
          _push(`<div class="empty-state" data-v-717095ab><span class="empty-icon" data-v-717095ab>📭</span><h3 data-v-717095ab>לא נמצאו הזמנות</h3><p data-v-717095ab>לא מצאנו הזמנות עבור מספר זה</p>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: "/menu",
            class: "order-btn"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` להזמנה ראשונה 🍓 `);
              } else {
                return [
                  createTextVNode(" להזמנה ראשונה 🍓 ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="orders-list" data-v-717095ab><!--[-->`);
          ssrRenderList(orders.value, (order) => {
            var _a, _b, _c, _d, _e;
            _push(`<div class="${ssrRenderClass([[`status-${order.status}`], "order-card"])}" data-v-717095ab><div class="order-header" data-v-717095ab><div class="order-id" data-v-717095ab><span class="id-label" data-v-717095ab>הזמנה</span><span class="id-value" data-v-717095ab>#${ssrInterpolate(order.orderId || ((_a = order.id) == null ? void 0 : _a.slice(-6)))}</span></div><div class="${ssrRenderClass([order.status, "order-status"])}" data-v-717095ab><span class="status-icon" data-v-717095ab>${ssrInterpolate(getStatusIcon(order.status))}</span> ${ssrInterpolate(getStatusLabel(order.status))}</div></div><div class="order-date" data-v-717095ab>📅 ${ssrInterpolate(formatDate(order.createdAt))}</div><div class="order-items" data-v-717095ab><!--[-->`);
            ssrRenderList(order.items, (item) => {
              _push(`<div class="order-item" data-v-717095ab><span class="item-emoji" data-v-717095ab>${ssrInterpolate(item.image)}</span><span class="item-name" data-v-717095ab>${ssrInterpolate(item.name)}</span><span class="item-qty" data-v-717095ab>x${ssrInterpolate(item.quantity)}</span><span class="item-price" data-v-717095ab>₪${ssrInterpolate(item.price * item.quantity)}</span></div>`);
            });
            _push(`<!--]--></div><div class="order-delivery" data-v-717095ab>`);
            if (((_b = order.delivery) == null ? void 0 : _b.option) === "pickup") {
              _push(`<span class="delivery-badge pickup" data-v-717095ab> 🏠 איסוף עצמי </span>`);
            } else {
              _push(`<span class="delivery-badge delivery" data-v-717095ab> 🚗 משלוח - ${ssrInterpolate((_d = (_c = order.delivery) == null ? void 0 : _c.location) == null ? void 0 : _d.name)}</span>`);
            }
            _push(`</div>`);
            if (order.date || order.time) {
              _push(`<div class="requested-date" data-v-717095ab>`);
              if (order.date) {
                _push(`<span data-v-717095ab>📆 ${ssrInterpolate(order.date)}</span>`);
              } else {
                _push(`<!---->`);
              }
              if (order.time) {
                _push(`<span data-v-717095ab>🕐 ${ssrInterpolate(order.time)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="order-footer" data-v-717095ab><div class="order-total" data-v-717095ab><span class="total-label" data-v-717095ab>סה&quot;כ:</span><span class="total-value" data-v-717095ab>₪${ssrInterpolate(order.total)}</span></div><div class="payment-info" data-v-717095ab><span class="payment-method" data-v-717095ab>${ssrInterpolate(getPaymentLabel((_e = order.payment) == null ? void 0 : _e.method))}</span><span class="${ssrRenderClass([order.paymentStatus, "payment-status"])}" data-v-717095ab>${ssrInterpolate(getPaymentStatusLabel(order.paymentStatus))}</span></div></div><button class="reorder-btn" data-v-717095ab>🔄 הזמנה חוזרת</button></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`<div class="new-order-cta" data-v-717095ab>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/menu",
          class: "new-order-btn"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` להזמנה חדשה 🍓 `);
            } else {
              return [
                createTextVNode(" להזמנה חדשה 🍓 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/MyOrders.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const MyOrders = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-717095ab"]]);
const _sfc_main$5 = {
  __name: "BakingWorkshops",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "תפריט | מרגליתות - מאפייה ביתית בבית שמש",
      meta: [
        {
          name: "description",
          content: "תפריט מרגליתות - עוגות שמרים, עוגות בחושות, עוגיות, לחמים, מאפים ללא גלוטן, טבעוניים ועוד. משלוחים לבית שמש."
        }
      ]
    });
    const inquiry = ref({
      parentName: "",
      phone: "",
      childName: "",
      ageGroup: "",
      notes: ""
    });
    const isSubmitting = ref(false);
    const showSuccess = ref(false);
    const whatsappLink = computed(() => {
      let message2 = "🍓 היי, אשמח לשמוע פרטים על חוגי האפייה";
      if (inquiry.value.ageGroup) {
        message2 += ` לגילאי ${inquiry.value.ageGroup}`;
      }
      return `https://wa.me/972528460331?text=${encodeURIComponent(message2)}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "workshops-page" }, _attrs))} data-v-dcb18337><section class="hero-section" data-v-dcb18337><div class="hero-content" data-v-dcb18337><span class="hero-icon" data-v-dcb18337>👩‍🍳</span><h1 class="hero-title" data-v-dcb18337>חוגי אפייה לילדים</h1><p class="hero-subtitle" data-v-dcb18337> חוויה מתוקה ויצירתית לילדים שלכם!<br data-v-dcb18337> לומדים להכין עוגות, עוגיות ומאפים טעימים </p></div><div class="hero-decoration" data-v-dcb18337><span class="floating-emoji e1" data-v-dcb18337>🧁</span><span class="floating-emoji e2" data-v-dcb18337>🍪</span><span class="floating-emoji e3" data-v-dcb18337>🎂</span><span class="floating-emoji e4" data-v-dcb18337>🍰</span></div></section><section class="age-groups-section" data-v-dcb18337><h2 class="section-title" data-v-dcb18337>בחרו קבוצת גיל</h2><p class="section-subtitle" data-v-dcb18337>החוגים מותאמים לכל גיל עם פעילויות מתאימות</p><div class="age-groups-grid" data-v-dcb18337><div class="age-card" data-v-dcb18337><div class="age-icon" data-v-dcb18337>👶</div><div class="age-range" data-v-dcb18337>3.5-6</div><h3 class="age-title" data-v-dcb18337>אפרוחי האפייה</h3><p class="age-description" data-v-dcb18337>פעילויות אפייה פשוטות וכיפיות, עיצוב עוגיות, משחקים עם בצק ויצירה מתוקה</p><ul class="age-features" data-v-dcb18337><li data-v-dcb18337>🍪 עוגיות מעוצבות</li><li data-v-dcb18337>🧁 קאפקייקס צבעוניים</li><li data-v-dcb18337>🎨 קישוט בסוכריות</li><li data-v-dcb18337>👐 משחק עם בצק</li></ul><div class="age-meta" data-v-dcb18337><span class="duration" data-v-dcb18337>⏱️ 60 דקות</span><span class="group-size" data-v-dcb18337>👥 עד 8 ילדים</span></div><button class="age-btn" data-v-dcb18337>לפרטים נוספים</button></div><div class="age-card featured" data-v-dcb18337><div class="featured-badge" data-v-dcb18337>הכי פופולרי ⭐</div><div class="age-icon" data-v-dcb18337>🧒</div><div class="age-range" data-v-dcb18337>6-9</div><h3 class="age-title" data-v-dcb18337>שפים צעירים</h3><p class="age-description" data-v-dcb18337>לומדים טכניקות אפייה אמיתיות, מכינים עוגות ומאפים מרשימים</p><ul class="age-features" data-v-dcb18337><li data-v-dcb18337>🎂 עוגות שכבות</li><li data-v-dcb18337>🥐 מאפים מעוצבים</li><li data-v-dcb18337>🍫 עבודה עם שוקולד</li><li data-v-dcb18337>📖 מתכונים לקחת הביתה</li></ul><div class="age-meta" data-v-dcb18337><span class="duration" data-v-dcb18337>⏱️ 75 דקות</span><span class="group-size" data-v-dcb18337>👥 עד 10 ילדים</span></div><button class="age-btn" data-v-dcb18337>לפרטים נוספים</button></div><div class="age-card" data-v-dcb18337><div class="age-icon" data-v-dcb18337>👧</div><div class="age-range" data-v-dcb18337>9-12</div><h3 class="age-title" data-v-dcb18337>אופים מקצועיים</h3><p class="age-description" data-v-dcb18337>טכניקות מתקדמות, מתכונים מאתגרים והכנה לעולם הקונדיטוריה</p><ul class="age-features" data-v-dcb18337><li data-v-dcb18337>🎂 עוגות מעוצבות</li><li data-v-dcb18337>🍰 טארטים וקינוחים</li><li data-v-dcb18337>🧁 קישוט מקצועי</li><li data-v-dcb18337>👨‍🍳 טכניקות שף</li></ul><div class="age-meta" data-v-dcb18337><span class="duration" data-v-dcb18337>⏱️ 90 דקות</span><span class="group-size" data-v-dcb18337>👥 עד 10 ילדים</span></div><button class="age-btn" data-v-dcb18337>לפרטים נוספים</button></div></div></section><section class="included-section" data-v-dcb18337><h2 class="section-title" data-v-dcb18337>מה כולל החוג?</h2><div class="included-grid" data-v-dcb18337><div class="included-item" data-v-dcb18337><span class="included-icon" data-v-dcb18337>🥣</span><h4 data-v-dcb18337>חומרי גלם</h4><p data-v-dcb18337>כל החומרים והמרכיבים כלולים במחיר</p></div><div class="included-item" data-v-dcb18337><span class="included-icon" data-v-dcb18337>👩‍🍳</span><h4 data-v-dcb18337>הדרכה מקצועית</h4><p data-v-dcb18337>מדריכה מנוסה עם המון סבלנות</p></div><div class="included-item" data-v-dcb18337><span class="included-icon" data-v-dcb18337>📦</span><h4 data-v-dcb18337>לקחת הביתה</h4><p data-v-dcb18337>כל ילד לוקח את היצירות שלו הביתה</p></div><div class="included-item" data-v-dcb18337><span class="included-icon" data-v-dcb18337>🎉</span><h4 data-v-dcb18337>חוויה מתוקה</h4><p data-v-dcb18337>כיף, יצירתיות והרבה טעימות!</p></div></div></section><section class="contact-section" data-v-dcb18337><div class="contact-card" data-v-dcb18337><h2 data-v-dcb18337>רוצים לשמוע עוד?</h2><p data-v-dcb18337>השאירו פרטים ונחזור אליכם עם כל המידע</p><form class="contact-form" data-v-dcb18337><div class="form-row" data-v-dcb18337><div class="form-group" data-v-dcb18337><label class="form-label" data-v-dcb18337>שם ההורה</label><input type="text"${ssrRenderAttr("value", inquiry.value.parentName)} class="form-input" placeholder="שם מלא" required data-v-dcb18337></div><div class="form-group" data-v-dcb18337><label class="form-label" data-v-dcb18337>טלפון</label><input type="tel"${ssrRenderAttr("value", inquiry.value.phone)} class="form-input" placeholder="050-0000000" dir="ltr" required data-v-dcb18337></div></div><div class="form-row" data-v-dcb18337><div class="form-group" data-v-dcb18337><label class="form-label" data-v-dcb18337>שם הילד/ה</label><input type="text"${ssrRenderAttr("value", inquiry.value.childName)} class="form-input" placeholder="שם הילד/ה" data-v-dcb18337></div><div class="form-group" data-v-dcb18337><label class="form-label" data-v-dcb18337>גיל</label><select class="form-input" data-v-dcb18337><option value="" data-v-dcb18337${ssrIncludeBooleanAttr(Array.isArray(inquiry.value.ageGroup) ? ssrLooseContain(inquiry.value.ageGroup, "") : ssrLooseEqual(inquiry.value.ageGroup, "")) ? " selected" : ""}>בחרו קבוצת גיל</option><option value="3.5-6" data-v-dcb18337${ssrIncludeBooleanAttr(Array.isArray(inquiry.value.ageGroup) ? ssrLooseContain(inquiry.value.ageGroup, "3.5-6") : ssrLooseEqual(inquiry.value.ageGroup, "3.5-6")) ? " selected" : ""}>3.5-6 - אפרוחי האפייה</option><option value="6-9" data-v-dcb18337${ssrIncludeBooleanAttr(Array.isArray(inquiry.value.ageGroup) ? ssrLooseContain(inquiry.value.ageGroup, "6-9") : ssrLooseEqual(inquiry.value.ageGroup, "6-9")) ? " selected" : ""}>6-9 - שפים צעירים</option><option value="9-12" data-v-dcb18337${ssrIncludeBooleanAttr(Array.isArray(inquiry.value.ageGroup) ? ssrLooseContain(inquiry.value.ageGroup, "9-12") : ssrLooseEqual(inquiry.value.ageGroup, "9-12")) ? " selected" : ""}>9-12 - אופים מקצועיים</option></select></div></div><div class="form-group" data-v-dcb18337><label class="form-label" data-v-dcb18337>הערות</label><textarea class="form-input form-textarea" placeholder="שאלות, בקשות מיוחדות..." rows="3" data-v-dcb18337>${ssrInterpolate(inquiry.value.notes)}</textarea></div><button type="submit" class="submit-btn"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} data-v-dcb18337>`);
      if (isSubmitting.value) {
        _push(`<span class="loading-spinner small" data-v-dcb18337></span>`);
      } else {
        _push(`<span data-v-dcb18337> שליחה <span class="btn-icon" data-v-dcb18337>📩</span></span>`);
      }
      _push(`</button></form><div class="whatsapp-alternative" data-v-dcb18337><span data-v-dcb18337>או פנו אלינו ישירות:</span><a${ssrRenderAttr("href", whatsappLink.value)} target="_blank" class="whatsapp-btn" data-v-dcb18337><span class="wa-icon" data-v-dcb18337>💬</span> וואטסאפ </a><a href="tel:0528460331" class="phone-btn" data-v-dcb18337><span class="phone-icon" data-v-dcb18337>📱</span> 052-846-0331 </a></div></div></section>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (showSuccess.value) {
          _push2(`<div class="success-modal-overlay" data-v-dcb18337><div class="success-modal" data-v-dcb18337><span class="success-icon" data-v-dcb18337>✅</span><h3 data-v-dcb18337>תודה רבה!</h3><p data-v-dcb18337>קיבלנו את הפנייה שלכם ונחזור אליכם בהקדם.</p><button class="close-btn" data-v-dcb18337>סגור</button></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/BakingWorkshops.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const BakingWorkshops = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-dcb18337"]]);
const _sfc_main$4 = {
  __name: "Tasting",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const lang = computed(() => route.query.lang === "he" ? "he" : "en");
    const texts = {
      he: {
        title: "תודה שהשתתפתם ביריד הטעימות! 💛",
        subtitle: "שמחים שהכרתם את מרגליתות 🍓 הזמינו עכשיו או בקשו הצעת מחיר לאירוע.",
        quoteSubtitle: "האתר שלנו בהקמה",
        productsTitle: "המוצרים שלנו",
        add: "הוסף",
        checkout: "לתשלום",
        quote: "הצעת מחיר לאירוע",
        popular: "פופולרי",
        items: "פריטים",
        contactTitle: "שאלות? דברו איתנו!",
        contactText: "נשמח לעזור בכל שאלה או בקשה מיוחדת"
      },
      en: {
        title: "Thank you for visiting us at the tasting fair! 💛",
        subtitle: "We are so happy you discovered Margalitut 🍓 Order now or request an event quote.",
        quoteSubtitle: "Our website is under construction",
        productsTitle: "Our Products",
        add: "Add",
        checkout: "Checkout",
        quote: "Event Quote",
        popular: "Popular",
        items: "items",
        contactTitle: "Questions? Talk to us!",
        contactText: "We're happy to help with any question or special request"
      }
    };
    const t = computed(() => texts[lang.value]);
    const products = computed(() => [
      {
        id: 1,
        name: lang.value === "he" ? "שמרים שוקולד" : "choclate Yeast",
        description: lang.value === "he" ? "עוגת שמרים טרייה ורכה" : "Fresh and soft yeast cake",
        price: 60,
        image: "/cakes/shmarim/yeast.jpeg",
        popular: true
      },
      {
        id: 2,
        name: lang.value === "he" ? "מייפל אגוזים" : "maple and nuts",
        description: lang.value === "he" ? "עוגת מייפל אגוזים" : "maple and nuts cake",
        price: 60,
        image: "/cakes/mapel cake.jpeg"
      },
      {
        id: 3,
        name: lang.value === "he" ? "שוקולד ציפס" : "chocolate chips",
        description: lang.value === "he" ? "עוגיות שוקולד ציפס" : "chocolate chips cookies",
        price: 50,
        image: "/cookies/chocoChip.jpeg"
      },
      {
        id: 4,
        name: lang.value === "he" ? "חיתוכיות תות תפוח" : "strawberry apple bars",
        description: lang.value === "he" ? "חיתוכיות תות תפוח" : "strawberry and apple bars",
        price: 55,
        image: "/cookies/appleBars.jpeg"
      },
      {
        id: 5,
        name: lang.value === "he" ? "מגולגלות תמרים" : "date rolls",
        description: lang.value === "he" ? "מגולגלות תמרים" : "date rolls",
        price: 55,
        image: "/cookies/dateRolls.jpeg",
        popular: true
      },
      {
        id: 6,
        name: lang.value === "he" ? "משלוח מנות פרימיום" : "Premium Mishloach Manot",
        description: lang.value === "he" ? "משלוח מנות פרימיום לפורים" : "Premium Purim Mishloach Manot",
        price: 275,
        image: "/specialEvents/Purim.jpeg"
      }
    ]);
    const cartItems = ref([]);
    const isInCart = (id) => cartItems.value.some((item) => item.id === id);
    const getQty = (id) => {
      var _a;
      return ((_a = cartItems.value.find((item) => item.id === id)) == null ? void 0 : _a.qty) || 0;
    };
    const totalItems = computed(() => cartItems.value.reduce((sum, item) => sum + item.qty, 0));
    const totalPrice = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0));
    const isPromoActive = computed(() => {
      const now = /* @__PURE__ */ new Date();
      const start = /* @__PURE__ */ new Date("2026-02-17T20:00:00");
      const end = /* @__PURE__ */ new Date("2026-02-18T22:00:00");
      return now >= start && now <= end;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["tasting-page", { rtl: lang.value === "he" }]
      }, _attrs))} data-v-be16a292>`);
      if (isPromoActive.value) {
        _push(`<div class="promo-banner" data-v-be16a292><span class="promo-icon" data-v-be16a292>🎉</span><div class="promo-text" data-v-be16a292><strong data-v-be16a292>מבצע מיוחד למשתתפי הטעימות!</strong><span data-v-be16a292>הזינו קוד <code data-v-be16a292>TASTING5</code> לקבלת 5% הנחה</span></div><span class="promo-expires" data-v-be16a292>בתוקף עד יום רביעי 22:00</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="hero" data-v-be16a292><div class="hero-badge" data-v-be16a292>🍓</div><h1 class="hero-title" data-v-be16a292>${ssrInterpolate(t.value.title)}</h1><p class="hero-subtitle" data-v-be16a292>${ssrInterpolate(t.value.subtitle)}</p><p class="quote-subtitle" data-v-be16a292>${ssrInterpolate(t.value.quoteSubtitle)}</p><br data-v-be16a292><div class="hero-buttons" data-v-be16a292><button class="btn primary" data-v-be16a292><span class="btn-icon" data-v-be16a292>🛒</span> ${ssrInterpolate(t.value.checkout)}</button><button class="btn secondary" data-v-be16a292><span class="btn-icon" data-v-be16a292>📋</span> ${ssrInterpolate(t.value.quote)}</button></div></section><section class="why-section" data-v-be16a292><div class="why-grid" data-v-be16a292><div class="why-card" data-v-be16a292><span class="why-icon" data-v-be16a292>🏠</span><h3 data-v-be16a292>${ssrInterpolate(lang.value === "he" ? "ביתי ואותנטי" : "Homemade")}</h3><p data-v-be16a292>${ssrInterpolate(lang.value === "he" ? "הכל נאפה בבית עם אהבה" : "Everything baked at home with love")}</p></div><div class="why-card" data-v-be16a292><span class="why-icon" data-v-be16a292>✨</span><h3 data-v-be16a292>${ssrInterpolate(lang.value === "he" ? "טרי ונקי" : "Fresh & Clean")}</h3><p data-v-be16a292>${ssrInterpolate(lang.value === "he" ? "רכיבים איכותיים בכשרות מהדרין" : "Quality ingredients, Mehadrin kosher")}</p></div><div class="why-card" data-v-be16a292><span class="why-icon" data-v-be16a292>❤️</span><h3 data-v-be16a292>${ssrInterpolate(lang.value === "he" ? "עבודת יד" : "Handcrafted")}</h3><p data-v-be16a292>${ssrInterpolate(lang.value === "he" ? "תשומת לב לכל פרט" : "Attention to every detail")}</p></div></div></section><section class="products-section" data-v-be16a292><h2 class="section-title" data-v-be16a292>${ssrInterpolate(t.value.productsTitle)}</h2><div class="products-grid" data-v-be16a292><!--[-->`);
      ssrRenderList(products.value, (p) => {
        _push(`<div class="${ssrRenderClass([{ "in-cart": isInCart(p.id) }, "product-card"])}" data-v-be16a292><div class="product-image" data-v-be16a292><img${ssrRenderAttr("src", p.image)}${ssrRenderAttr("alt", p.name)} loading="lazy" data-v-be16a292>`);
        if (p.popular) {
          _push(`<span class="popular-badge" data-v-be16a292>⭐ ${ssrInterpolate(t.value.popular)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="product-info" data-v-be16a292><h3 class="product-name" data-v-be16a292>${ssrInterpolate(p.name)}</h3><p class="product-description" data-v-be16a292>${ssrInterpolate(p.description)}</p><div class="product-footer" data-v-be16a292><span class="product-price" data-v-be16a292>₪${ssrInterpolate(p.price)}</span>`);
        if (!isInCart(p.id)) {
          _push(`<button class="add-btn" data-v-be16a292><span data-v-be16a292>+</span> ${ssrInterpolate(t.value.add)}</button>`);
        } else {
          _push(`<div class="quantity-controls" data-v-be16a292><button class="qty-btn" data-v-be16a292>−</button><span class="qty-value" data-v-be16a292>${ssrInterpolate(getQty(p.id))}</span><button class="qty-btn" data-v-be16a292>+</button></div>`);
        }
        _push(`</div></div></div>`);
      });
      _push(`<!--]--></div></section>`);
      if (cartItems.value.length > 0) {
        _push(`<div class="floating-cart" data-v-be16a292><div class="cart-info" data-v-be16a292><span class="cart-count" data-v-be16a292>${ssrInterpolate(totalItems.value)} ${ssrInterpolate(t.value.items)}</span><span class="cart-total" data-v-be16a292>₪${ssrInterpolate(totalPrice.value)}</span></div><button class="cart-btn" data-v-be16a292>${ssrInterpolate(t.value.checkout)} →</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="contact-section" data-v-be16a292><h2 data-v-be16a292>${ssrInterpolate(t.value.contactTitle)}</h2><p data-v-be16a292>${ssrInterpolate(t.value.contactText)}</p><div class="contact-links" data-v-be16a292><a href="tel:0528460331" class="contact-link" data-v-be16a292> 📱 052-846-0331 </a><a href="https://wa.me/972528460331" target="_blank" class="contact-link whatsapp" data-v-be16a292> 💬 WhatsApp </a></div></section><a href="https://wa.me/972528460331?text=היי%20מרגלית!%20הגעתי%20מיריד%20הטעימות%20ויש%20לי%20שאלה" target="_blank" class="whatsapp-float" data-v-be16a292><span class="whatsapp-icon" data-v-be16a292>💬</span><span class="whatsapp-text" data-v-be16a292>${ssrInterpolate(lang.value === "he" ? "שאלות?" : "Questions?")}</span></a></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Tasting.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const Tasting = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-be16a292"]]);
const _sfc_main$3 = {
  __name: "Purim",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const activeTab = ref("packages");
    const selectedBudget = ref("all");
    const selectedPackage = ref(null);
    const customItems = ref([]);
    const budgets = [
      { id: "all", label: "הכל" },
      { id: "20-50", label: "₪20-50" },
      { id: "50-80", label: "₪50-80" },
      { id: "81-110", label: "₪81-110" },
      { id: "111-150", label: "₪111-150" },
      { id: "150-200", label: "₪150-200" },
      { id: "200+", label: "₪200+" }
    ];
    const packages = ref([
      // 20-50
      {
        id: 1,
        name: "בייסיק",
        description: "משלוח מנות קטן ומתוק",
        image: null,
        price: 20,
        budget: "20-50",
        items: ["קאפקייק מעוצב", "בקבוק יין קטן", "אריזה עם בונבוניירה"]
      },
      {
        id: 2,
        name: "מתוק קלאסי",
        description: "שילוב מושלם של מתוק",
        image: null,
        price: 40,
        budget: "20-50",
        items: ["2 קאפקייקס מעוצבים", "בקבוק יין קטן", "שוקולד", "אריזה עם בונבוניירה"]
      },
      {
        id: 3,
        name: "שמח ומתוק",
        description: "חבילה שמחה לפורים",
        image: null,
        price: 50,
        budget: "20-50",
        popular: true,
        items: ["3 קאפקייקס מעוצבים", "בקבוק יין קטן", "שוקולד", "אריזה"]
      },
      // 50-80
      {
        id: 4,
        name: "משפחתי",
        description: "מושלם למשפחה",
        image: null,
        price: 65,
        budget: "50-80",
        items: ["עוגה", "בקבוק יין קטן", "אריזה"]
      },
      {
        id: 5,
        name: "חגיגי",
        description: "חגיגה של טעמים",
        image: null,
        price: 80,
        budget: "50-80",
        popular: true,
        items: ["עוגה", "בקבוק יין גדול", "אריזה"]
      },
      // 81-110
      {
        id: 6,
        name: "גלידה מתוקה",
        description: "לאוהבי הגלידה",
        image: null,
        price: 85,
        budget: "81-110",
        items: ["½ קילו גלידה ביתית", "בקבוק יין קטן", "אריזה"]
      },
      {
        id: 7,
        name: "מלכותי",
        description: "עוגה ועוגיות",
        image: null,
        price: 95,
        budget: "81-110",
        items: ["עוגה", "מארז עוגיות", "אריזה"]
      },
      {
        id: 8,
        name: "פרימיום",
        description: "איכות ללא פשרות",
        image: null,
        price: 110,
        budget: "81-110",
        popular: true,
        items: ["עוגה", "בקבוק יין גדול", "שוקולד", "אריזה מהודרת"]
      },
      // 111-150
      {
        id: 9,
        name: "גלידה משפחתי",
        description: "גלידה ויין לכל המשפחה",
        image: null,
        price: 115,
        budget: "111-150",
        items: ["½ קילו גלידה ביתית", "בקבוק יין גדול", "אריזה"]
      },
      {
        id: 10,
        name: "גרנד",
        description: "עוגה גדולה ויין",
        image: null,
        price: 120,
        budget: "111-150",
        items: ["עוגה גדולה", "בקבוק יין גדול", "אריזה"]
      },
      {
        id: 11,
        name: "אקסקלוסיב",
        description: "עוגה, עוגיות ויין",
        image: null,
        price: 130,
        budget: "111-150",
        popular: true,
        items: ["עוגה", "מארז עוגיות", "בקבוק יין גדול", "אריזה"]
      },
      {
        id: 12,
        name: "גלידה פרימיום",
        description: "גלידה ועוגיות",
        image: null,
        price: 130,
        budget: "111-150",
        items: ["½ קילו גלידה ביתית", "מארז עוגיות", "אריזה"]
      },
      {
        id: 13,
        name: "VIP",
        description: "עוגה גדולה ועוגיות",
        image: null,
        price: 145,
        budget: "111-150",
        items: ["עוגה גדולה", "מארז עוגיות פרימיום", "אריזה מהודרת"]
      },
      {
        id: 14,
        name: "גלידה גרנד",
        description: "קילו גלידה ויין",
        image: null,
        price: 150,
        budget: "111-150",
        popular: true,
        items: ["קילו גלידה ביתית", "בקבוק יין קטן", "אריזה"]
      },
      {
        id: 15,
        name: "דה-לוקס",
        description: "עוגה גדולה מפנקת",
        image: null,
        price: 150,
        budget: "111-150",
        items: ["עוגה גדולה", "בקבוק יין גדול", "שוקולד", "אריזה מהודרת"]
      },
      // 150-200
      {
        id: 16,
        name: "משפחה מורחבת",
        description: "2 עוגות ויין",
        image: null,
        price: 160,
        budget: "150-200",
        items: ["2 עוגות", "בקבוק יין גדול", "אריזה"]
      },
      {
        id: 17,
        name: "גלידה משפחה",
        description: "קילו גלידה ויין גדול",
        image: null,
        price: 175,
        budget: "150-200",
        items: ["קילו גלידה ביתית", "בקבוק יין גדול", "אריזה"]
      },
      {
        id: 18,
        name: "רויאל",
        description: "עוגה גדולה, עוגיות ויין",
        image: null,
        price: 180,
        budget: "150-200",
        popular: true,
        items: ["עוגה גדולה", "מארז עוגיות פרימיום", "בקבוק יין גדול", "אריזה מהודרת"]
      },
      {
        id: 19,
        name: "גלידה VIP",
        description: "קילו גלידה ועוגיות",
        image: null,
        price: 200,
        budget: "150-200",
        items: ["קילו גלידה ביתית", "מארז עוגיות פרימיום", "אריזה מהודרת"]
      },
      // 200+
      {
        id: 20,
        name: "סופר VIP",
        description: "עוגה גדולה מושלמת",
        image: null,
        price: 210,
        budget: "200+",
        items: ["עוגה גדולה פרימיום", "מארז עוגיות פרימיום", "בקבוק יין גדול", "שוקולד פרימיום", "אריזה מהודרת"]
      },
      {
        id: 21,
        name: "מלכותי פלוס",
        description: "2 עוגות ועוגיות",
        image: null,
        price: 220,
        budget: "200+",
        items: ["2 עוגות", "מארז עוגיות פרימיום", "בקבוק יין גדול", "אריזה מהודרת"]
      },
      {
        id: 22,
        name: "גלידה רויאל",
        description: "קילו גלידה, עוגה ויין",
        image: null,
        price: 240,
        budget: "200+",
        items: ["קילו גלידה ביתית", "עוגה", "בקבוק יין גדול", "אריזה מהודרת"]
      },
      {
        id: 23,
        name: "אולטימטיבי",
        description: "החבילה המושלמת",
        image: null,
        price: 250,
        budget: "200+",
        popular: true,
        items: ["עוגה גדולה XL", "מארז עוגיות פרימיום", "בקבוק יין גדול", "שוקולד פרימיום", "פירות יבשים", "אריזה מהודרת"]
      },
      {
        id: 24,
        name: "גלידה אולטימטיבי",
        description: "קילו גלידה, עוגה ועוגיות",
        image: null,
        price: 275,
        budget: "200+",
        items: ["קילו גלידה ביתית", "עוגה", "מארז עוגיות פרימיום", "בקבוק יין גדול", "אריזה מהודרת"]
      },
      {
        id: 25,
        name: "מארז עוגיות מלכותי",
        description: "7 סוגי עוגיות ונשיקות",
        image: null,
        price: 275,
        budget: "200+",
        popular: true,
        items: ["מארז 7 סוגי עוגיות", "נשיקות", "בונבוניירה גדולה", "בקבוק יין גדול"]
      },
      {
        id: 26,
        name: "הכל כלול",
        description: "הכי גדול שיש!",
        image: null,
        price: 320,
        budget: "200+",
        items: ["עוגה גדולה XL", "מארז עוגיות פרימיום", "קילו גלידה ביתית", "בקבוק יין גדול", "אריזה מהודרת"]
      }
    ]);
    const customCategories = [
      {
        id: "icecream",
        name: "גלידה ביתית",
        icon: "🍦",
        items: [
          { id: "ice1", name: "½ קילו גלידה", price: 70, image: null },
          { id: "ice2", name: "קילו גלידה", price: 135, image: null }
        ]
      },
      {
        id: "cakes",
        name: "עוגות",
        icon: "🎂",
        items: [
          { id: "c1", name: "עוגה", price: 50, image: null },
          { id: "c2", name: "עוגה פרימיום", price: 60, image: null },
          { id: "c3", name: "עוגה גדולה", price: 70, image: null },
          { id: "c4", name: "עוגה גדולה פרימיום", price: 85, image: null },
          { id: "c5", name: "עוגה גדולה XL", price: 95, image: null }
        ]
      },
      {
        id: "cookies",
        name: "עוגיות",
        icon: "🍪",
        items: [
          { id: "co1", name: "מארז עוגיות", price: 45, image: null },
          { id: "co2", name: "מארז עוגיות פרימיום", price: 55, image: null },
          { id: "co3", name: "מארז עוגיות גדול", price: 65, image: null },
          { id: "co4", name: "מארז עוגיות גדול פרימיום", price: 75, image: null },
          { id: "haman1", name: "אוזני המן", price: 50, image: null },
          { id: "haman2", name: "אוזני המן ללא סוכר", price: 55, image: null }
        ]
      },
      {
        id: "cupcakes",
        name: "קאפקייקס",
        icon: "🧁",
        items: [
          { id: "cup1", name: "קאפקייק מעוצב", price: 8, image: null },
          { id: "cup4", name: "מארז 4 קאפקייקס", price: 30, image: null },
          { id: "cup6", name: "מארז 6 קאפקייקס", price: 45, image: null }
        ]
      },
      {
        id: "drinks",
        name: "משקאות",
        icon: "🍷",
        items: [
          { id: "d1", name: "בקבוק יין קטן", price: 5, image: null },
          { id: "d2", name: "בקבוק יין גדול", price: 35, image: null },
          { id: "d3", name: "מיץ ענבים", price: 15, image: null }
        ]
      },
      {
        id: "extras",
        name: "תוספות",
        icon: "🎁",
        items: [
          { id: "e1", name: "שוקולד", price: 10, image: null },
          { id: "e2", name: "שוקולד פרימיום", price: 20, image: null },
          { id: "e3", name: "בונבוניירה", price: 10, image: null },
          { id: "e4", name: "פירות יבשים", price: 25, image: null },
          { id: "e5", name: "אריזה", price: 10, image: null },
          { id: "e6", name: "אריזה מהודרת", price: 20, image: null }
        ]
      }
    ];
    const filteredPackages = computed(() => {
      if (selectedBudget.value === "all") {
        return packages.value;
      }
      return packages.value.filter((p) => p.budget === selectedBudget.value);
    });
    const hasSelection = computed(() => {
      return selectedPackage.value || customItems.value.length > 0;
    });
    const totalItems = computed(() => {
      if (activeTab.value === "packages" && selectedPackage.value) {
        return 1;
      }
      return customItems.value.reduce((sum, item) => sum + item.qty, 0);
    });
    const totalPrice = computed(() => {
      if (activeTab.value === "packages" && selectedPackage.value) {
        return selectedPackage.value.price;
      }
      return customItems.value.reduce((sum, item) => sum + item.price * item.qty, 0);
    });
    const isItemSelected = (id) => {
      return customItems.value.some((item) => item.id === id);
    };
    const getItemQty = (id) => {
      const item = customItems.value.find((item2) => item2.id === id);
      return (item == null ? void 0 : item.qty) || 0;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "purim-page" }, _attrs))} data-v-65b58a22><div class="lang-switch" data-v-65b58a22><span class="lang-btn active" data-v-65b58a22>עברית</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/purim-en",
        class: "lang-btn"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`English`);
          } else {
            return [
              createTextVNode("English")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><section class="hero" data-v-65b58a22><div class="hero-decoration" data-v-65b58a22><span class="deco deco-1" data-v-65b58a22>🎭</span><span class="deco deco-2" data-v-65b58a22>🍷</span><span class="deco deco-3" data-v-65b58a22>🧁</span><span class="deco deco-4" data-v-65b58a22>🎉</span></div><h1 class="hero-title" data-v-65b58a22>🎭 משלוחי מנות לפורים</h1><p class="hero-subtitle" data-v-65b58a22>מרגליתות - משלוחי מנות מתוקים ומיוחדים לכל תקציב</p><div class="deadline-banner" data-v-65b58a22><span class="deadline-icon" data-v-65b58a22>⏰</span><span data-v-65b58a22>הזמנות עד 1.3.26 בשעה 16:00</span></div></section><div class="tabs" data-v-65b58a22><button class="${ssrRenderClass([{ active: activeTab.value === "packages" }, "tab"])}" data-v-65b58a22> 📦 חבילות מוכנות </button><button class="${ssrRenderClass([{ active: activeTab.value === "custom" }, "tab"])}" data-v-65b58a22> 🎨 הרכיבו בעצמכם </button></div>`);
      if (activeTab.value === "packages") {
        _push(`<section class="packages-section" data-v-65b58a22><div class="budget-filter" data-v-65b58a22><span class="filter-label" data-v-65b58a22>סננו לפי תקציב:</span><div class="budget-tags" data-v-65b58a22><!--[-->`);
        ssrRenderList(budgets, (budget) => {
          _push(`<button class="${ssrRenderClass([{ active: selectedBudget.value === budget.id }, "budget-tag"])}" data-v-65b58a22>${ssrInterpolate(budget.label)}</button>`);
        });
        _push(`<!--]--></div></div><div class="packages-grid" data-v-65b58a22><!--[-->`);
        ssrRenderList(filteredPackages.value, (pkg) => {
          var _a, _b;
          _push(`<div class="${ssrRenderClass([{ popular: pkg.popular, selected: ((_a = selectedPackage.value) == null ? void 0 : _a.id) === pkg.id }, "package-card"])}" data-v-65b58a22>`);
          if (pkg.popular) {
            _push(`<span class="popular-badge" data-v-65b58a22>🌟 פופולרי</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="package-image" data-v-65b58a22>`);
          if (pkg.image) {
            _push(`<img${ssrRenderAttr("src", pkg.image)}${ssrRenderAttr("alt", pkg.name)} class="pkg-img" data-v-65b58a22>`);
          } else {
            _push(`<div class="image-placeholder" data-v-65b58a22><span class="placeholder-text" data-v-65b58a22>התמונה עוד לא כאן</span><span class="placeholder-subtext" data-v-65b58a22>אבל הטעם כבר פה!</span></div>`);
          }
          _push(`</div><h3 class="package-name" data-v-65b58a22>${ssrInterpolate(pkg.name)}</h3><p class="package-description" data-v-65b58a22>${ssrInterpolate(pkg.description)}</p><ul class="package-items" data-v-65b58a22><!--[-->`);
          ssrRenderList(pkg.items, (item, i) => {
            _push(`<li data-v-65b58a22>${ssrInterpolate(item)}</li>`);
          });
          _push(`<!--]--></ul><div class="package-price" data-v-65b58a22>₪${ssrInterpolate(pkg.price)}</div><button class="select-btn" data-v-65b58a22>${ssrInterpolate(((_b = selectedPackage.value) == null ? void 0 : _b.id) === pkg.id ? "✓ נבחר" : "בחירה")}</button></div>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "custom") {
        _push(`<section class="custom-section" data-v-65b58a22><p class="custom-intro" data-v-65b58a22>בחרו את המוצרים שאתם רוצים ובנו משלוח מנות בדיוק כמו שאתם אוהבים</p><!--[-->`);
        ssrRenderList(customCategories, (category) => {
          _push(`<div class="custom-category" data-v-65b58a22><h3 class="category-title" data-v-65b58a22>${ssrInterpolate(category.icon)} ${ssrInterpolate(category.name)}</h3><div class="custom-items-grid" data-v-65b58a22><!--[-->`);
          ssrRenderList(category.items, (item) => {
            _push(`<div class="${ssrRenderClass([{ selected: isItemSelected(item.id) }, "custom-item"])}" data-v-65b58a22><div class="item-image-container" data-v-65b58a22>`);
            if (item.image) {
              _push(`<img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="item-img" data-v-65b58a22>`);
            } else {
              _push(`<div class="item-image-placeholder" data-v-65b58a22><span class="placeholder-mini-text" data-v-65b58a22>בקרוב תמונה</span></div>`);
            }
            _push(`</div><span class="item-name" data-v-65b58a22>${ssrInterpolate(item.name)}</span><span class="item-price" data-v-65b58a22>₪${ssrInterpolate(item.price)}</span>`);
            if (isItemSelected(item.id)) {
              _push(`<div class="item-qty" data-v-65b58a22><button data-v-65b58a22>-</button><span data-v-65b58a22>${ssrInterpolate(getItemQty(item.id))}</span><button data-v-65b58a22>+</button></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></section>`);
      } else {
        _push(`<!---->`);
      }
      if (hasSelection.value) {
        _push(`<div class="order-summary" data-v-65b58a22><div class="summary-details" data-v-65b58a22><span class="summary-count" data-v-65b58a22>${ssrInterpolate(totalItems.value)} פריטים</span><span class="summary-total" data-v-65b58a22>₪${ssrInterpolate(totalPrice.value)}</span></div><button class="order-btn" data-v-65b58a22> להזמנה → </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="delivery-section" data-v-65b58a22><h2 data-v-65b58a22>🚚 משלוחים ואיסוף</h2><div class="delivery-options" data-v-65b58a22><div class="delivery-option" data-v-65b58a22><span class="option-icon" data-v-65b58a22>🏠</span><h4 data-v-65b58a22>איסוף עצמי</h4><p data-v-65b58a22>משכונת המשקפיים, בית שמש - ללא עלות</p></div><div class="delivery-option" data-v-65b58a22><span class="option-icon" data-v-65b58a22>🚗</span><h4 data-v-65b58a22>משלוח</h4><p data-v-65b58a22>משלוחים לבית שמש והסביבה בתוספת תשלום</p></div></div></section><section class="contact-section" data-v-65b58a22><h2 data-v-65b58a22>שאלות?</h2><p data-v-65b58a22>נשמח לעזור!</p><div class="contact-links" data-v-65b58a22><a href="tel:0528460331" class="contact-link" data-v-65b58a22>📱 052-846-0331</a><a href="https://wa.me/972528460331?text=היי%20מרגלית!%20אני%20רוצה%20להזמין%20משלוח%20מנות%20לפורים" target="_blank" class="contact-link whatsapp" data-v-65b58a22>💬 WhatsApp</a></div></section><a href="https://wa.me/972528460331?text=היי%20מרגלית!%20אני%20רוצה%20להזמין%20משלוח%20מנות%20לפורים" target="_blank" class="whatsapp-float" data-v-65b58a22><span data-v-65b58a22>💬</span><span data-v-65b58a22>שאלות?</span></a></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Purim.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Purim = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-65b58a22"]]);
const _sfc_main$2 = {
  __name: "PurimEn",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const activeTab = ref("packages");
    const selectedBudget = ref("all");
    const selectedPackage = ref(null);
    const customItems = ref([]);
    const budgets = [
      { id: "all", label: "All" },
      { id: "20-50", label: "₪20-50" },
      { id: "50-80", label: "₪50-80" },
      { id: "81-110", label: "₪81-110" },
      { id: "111-150", label: "₪111-150" },
      { id: "150-200", label: "₪150-200" },
      { id: "200+", label: "₪200+" }
    ];
    const packages = ref([
      // 20-50
      {
        id: 1,
        name: "Basic",
        description: "Small & sweet gift package",
        image: null,
        price: 20,
        budget: "20-50",
        items: ["Decorated cupcake", "Small wine bottle", "Gift box with treats"]
      },
      {
        id: 2,
        name: "Sweet Classic",
        description: "Perfect sweet combination",
        image: null,
        price: 40,
        budget: "20-50",
        items: ["2 Decorated cupcakes", "Small wine bottle", "Chocolate", "Gift box with treats"]
      },
      {
        id: 3,
        name: "Happy & Sweet",
        description: "Joyful Purim package",
        image: null,
        price: 50,
        budget: "20-50",
        popular: true,
        items: ["3 Decorated cupcakes", "Small wine bottle", "Chocolate", "Gift box"]
      },
      // 50-80
      {
        id: 4,
        name: "Family",
        description: "Perfect for families",
        image: null,
        price: 65,
        budget: "50-80",
        items: ["Cake", "Small wine bottle", "Gift box"]
      },
      {
        id: 5,
        name: "Festive",
        description: "A celebration of flavors",
        image: null,
        price: 80,
        budget: "50-80",
        popular: true,
        items: ["Cake", "Large wine bottle", "Gift box"]
      },
      // 81-110
      {
        id: 6,
        name: "Sweet Ice Cream",
        description: "For ice cream lovers",
        image: null,
        price: 85,
        budget: "81-110",
        items: ["½ kg Homemade ice cream", "Small wine bottle", "Gift box"]
      },
      {
        id: 7,
        name: "Royal",
        description: "Cake & cookies",
        image: null,
        price: 95,
        budget: "81-110",
        items: ["Cake", "Cookie box", "Gift box"]
      },
      {
        id: 8,
        name: "Premium",
        description: "Quality without compromise",
        image: null,
        price: 110,
        budget: "81-110",
        popular: true,
        items: ["Cake", "Large wine bottle", "Chocolate", "Elegant gift box"]
      },
      // 111-150
      {
        id: 9,
        name: "Ice Cream Family",
        description: "Ice cream & wine for the family",
        image: null,
        price: 115,
        budget: "111-150",
        items: ["½ kg Homemade ice cream", "Large wine bottle", "Gift box"]
      },
      {
        id: 10,
        name: "Grand",
        description: "Large cake & wine",
        image: null,
        price: 120,
        budget: "111-150",
        items: ["Large cake", "Large wine bottle", "Gift box"]
      },
      {
        id: 11,
        name: "Exclusive",
        description: "Cake, cookies & wine",
        image: null,
        price: 130,
        budget: "111-150",
        popular: true,
        items: ["Cake", "Cookie box", "Large wine bottle", "Gift box"]
      },
      {
        id: 12,
        name: "Ice Cream Premium",
        description: "Ice cream & cookies",
        image: null,
        price: 130,
        budget: "111-150",
        items: ["½ kg Homemade ice cream", "Cookie box", "Gift box"]
      },
      {
        id: 13,
        name: "VIP",
        description: "Large cake & cookies",
        image: null,
        price: 145,
        budget: "111-150",
        items: ["Large cake", "Premium cookie box", "Elegant gift box"]
      },
      {
        id: 14,
        name: "Ice Cream Grand",
        description: "1kg ice cream & wine",
        image: null,
        price: 150,
        budget: "111-150",
        popular: true,
        items: ["1 kg Homemade ice cream", "Small wine bottle", "Gift box"]
      },
      {
        id: 15,
        name: "Deluxe",
        description: "Indulgent large cake",
        image: null,
        price: 150,
        budget: "111-150",
        items: ["Large cake", "Large wine bottle", "Chocolate", "Elegant gift box"]
      },
      // 150-200
      {
        id: 16,
        name: "Extended Family",
        description: "2 cakes & wine",
        image: null,
        price: 160,
        budget: "150-200",
        items: ["2 Cakes", "Large wine bottle", "Gift box"]
      },
      {
        id: 17,
        name: "Ice Cream Family XL",
        description: "1kg ice cream & large wine",
        image: null,
        price: 175,
        budget: "150-200",
        items: ["1 kg Homemade ice cream", "Large wine bottle", "Gift box"]
      },
      {
        id: 18,
        name: "Royal Plus",
        description: "Large cake, cookies & wine",
        image: null,
        price: 180,
        budget: "150-200",
        popular: true,
        items: ["Large cake", "Premium cookie box", "Large wine bottle", "Elegant gift box"]
      },
      {
        id: 19,
        name: "Ice Cream VIP",
        description: "1kg ice cream & cookies",
        image: null,
        price: 200,
        budget: "150-200",
        items: ["1 kg Homemade ice cream", "Premium cookie box", "Elegant gift box"]
      },
      // 200+
      {
        id: 20,
        name: "Super VIP",
        description: "Ultimate large cake package",
        image: null,
        price: 210,
        budget: "200+",
        items: ["Premium large cake", "Premium cookie box", "Large wine bottle", "Premium chocolate", "Elegant gift box"]
      },
      {
        id: 21,
        name: "Royal Deluxe",
        description: "2 cakes & cookies",
        image: null,
        price: 220,
        budget: "200+",
        items: ["2 Cakes", "Premium cookie box", "Large wine bottle", "Elegant gift box"]
      },
      {
        id: 22,
        name: "Ice Cream Royal",
        description: "1kg ice cream, cake & wine",
        image: null,
        price: 240,
        budget: "200+",
        items: ["1 kg Homemade ice cream", "Cake", "Large wine bottle", "Elegant gift box"]
      },
      {
        id: 23,
        name: "Ultimate",
        description: "The perfect package",
        image: null,
        price: 250,
        budget: "200+",
        popular: true,
        items: [
          "XL Large cake",
          "Premium cookie box",
          "Large wine bottle",
          "Premium chocolate",
          "Dried fruits",
          "Elegant gift box"
        ]
      },
      {
        id: 24,
        name: "Ice Cream Ultimate",
        description: "1kg ice cream, cake & cookies",
        image: null,
        price: 275,
        budget: "200+",
        items: ["1 kg Homemade ice cream", "Cake", "Premium cookie box", "Large wine bottle", "Elegant gift box"]
      },
      {
        id: 25,
        name: "Royal Cookie Collection",
        description: "7 types of cookies & meringues",
        image: null,
        price: 275,
        budget: "200+",
        popular: true,
        items: ["7 Types of cookies box", "Meringues", "Large treat box", "Large wine bottle"]
      },
      {
        id: 26,
        name: "All Inclusive",
        description: "The biggest package!",
        image: null,
        price: 320,
        budget: "200+",
        items: ["XL Large cake", "Premium cookie box", "1 kg Homemade ice cream", "Large wine bottle", "Elegant gift box"]
      }
    ]);
    const customCategories = [
      {
        id: "icecream",
        name: "Homemade Ice Cream",
        icon: "🍦",
        items: [
          { id: "ice1", name: "½ kg Ice Cream", price: 70, image: null },
          { id: "ice2", name: "1 kg Ice Cream", price: 135, image: null }
        ]
      },
      {
        id: "cakes",
        name: "Cakes",
        icon: "🎂",
        items: [
          { id: "c1", name: "Cake", price: 50, image: null },
          { id: "c2", name: "Premium Cake", price: 60, image: null },
          { id: "c3", name: "Large Cake", price: 70, image: null },
          { id: "c4", name: "Premium Large Cake", price: 85, image: null },
          { id: "c5", name: "XL Large Cake", price: 95, image: null }
        ]
      },
      {
        id: "cookies",
        name: "Cookies",
        icon: "🍪",
        items: [
          { id: "co1", name: "Cookie Box", price: 45, image: null },
          { id: "co2", name: "Premium Cookie Box", price: 55, image: null },
          { id: "co3", name: "Large Cookie Box", price: 65, image: null },
          { id: "co4", name: "Large Premium Cookie Box", price: 75, image: null },
          { id: "haman1", name: "Hamantaschen", price: 50, image: null },
          { id: "haman2", name: "Sugar-Free Hamantaschen", price: 55, image: null }
        ]
      },
      {
        id: "cupcakes",
        name: "Cupcakes",
        icon: "🧁",
        items: [
          { id: "cup1", name: "Decorated Cupcake", price: 8, image: null },
          { id: "cup4", name: "4 Cupcakes Box", price: 30, image: null },
          { id: "cup6", name: "6 Cupcakes Box", price: 45, image: null }
        ]
      },
      {
        id: "drinks",
        name: "Drinks",
        icon: "🍷",
        items: [
          { id: "d1", name: "Small Wine Bottle", price: 5, image: null },
          { id: "d2", name: "Large Wine Bottle", price: 35, image: null },
          { id: "d3", name: "Grape Juice", price: 15, image: null }
        ]
      },
      {
        id: "extras",
        name: "Extras",
        icon: "🎁",
        items: [
          { id: "e1", name: "Chocolate", price: 10, image: null },
          { id: "e2", name: "Premium Chocolate", price: 20, image: null },
          { id: "e3", name: "Treats", price: 10, image: null },
          { id: "e4", name: "Dried Fruits", price: 25, image: null },
          { id: "e5", name: "Gift Box", price: 10, image: null },
          { id: "e6", name: "Elegant Gift Box", price: 20, image: null }
        ]
      }
    ];
    const filteredPackages = computed(() => {
      if (selectedBudget.value === "all") {
        return packages.value;
      }
      return packages.value.filter((p) => p.budget === selectedBudget.value);
    });
    const hasSelection = computed(() => {
      return selectedPackage.value || customItems.value.length > 0;
    });
    const totalItems = computed(() => {
      if (activeTab.value === "packages" && selectedPackage.value) {
        return 1;
      }
      return customItems.value.reduce((sum, item) => sum + item.qty, 0);
    });
    const totalPrice = computed(() => {
      if (activeTab.value === "packages" && selectedPackage.value) {
        return selectedPackage.value.price;
      }
      return customItems.value.reduce((sum, item) => sum + item.price * item.qty, 0);
    });
    const isItemSelected = (id) => {
      return customItems.value.some((item) => item.id === id);
    };
    const getItemQty = (id) => {
      const item = customItems.value.find((item2) => item2.id === id);
      return (item == null ? void 0 : item.qty) || 0;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "purim-page purim-page-en" }, _attrs))} data-v-c004f0cf><div class="lang-switch" data-v-c004f0cf>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/purim",
        class: "lang-btn"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`עברית`);
          } else {
            return [
              createTextVNode("עברית")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="lang-btn active" data-v-c004f0cf>English</span></div><section class="hero" data-v-c004f0cf><div class="hero-decoration" data-v-c004f0cf><span class="deco deco-1" data-v-c004f0cf>🎭</span><span class="deco deco-2" data-v-c004f0cf>🍷</span><span class="deco deco-3" data-v-c004f0cf>🧁</span><span class="deco deco-4" data-v-c004f0cf>🎉</span></div><h1 class="hero-title" data-v-c004f0cf>🎭 Purim Mishloach Manot</h1><p class="hero-subtitle" data-v-c004f0cf>Margalitut - Sweet &amp; special gift packages for every budget</p><div class="deadline-banner" data-v-c004f0cf><span class="deadline-icon" data-v-c004f0cf>⏰</span><span data-v-c004f0cf>Orders until March 1st, 4:00 PM</span></div></section><div class="tabs" data-v-c004f0cf><button class="${ssrRenderClass([{ active: activeTab.value === "packages" }, "tab"])}" data-v-c004f0cf> 📦 Ready Packages </button><button class="${ssrRenderClass([{ active: activeTab.value === "custom" }, "tab"])}" data-v-c004f0cf> 🎨 Build Your Own </button></div>`);
      if (activeTab.value === "packages") {
        _push(`<section class="packages-section" data-v-c004f0cf><div class="budget-filter" data-v-c004f0cf><span class="filter-label" data-v-c004f0cf>Filter by budget:</span><div class="budget-tags" data-v-c004f0cf><!--[-->`);
        ssrRenderList(budgets, (budget) => {
          _push(`<button class="${ssrRenderClass([{ active: selectedBudget.value === budget.id }, "budget-tag"])}" data-v-c004f0cf>${ssrInterpolate(budget.label)}</button>`);
        });
        _push(`<!--]--></div></div><div class="packages-grid" data-v-c004f0cf><!--[-->`);
        ssrRenderList(filteredPackages.value, (pkg) => {
          var _a, _b;
          _push(`<div class="${ssrRenderClass([{ popular: pkg.popular, selected: ((_a = selectedPackage.value) == null ? void 0 : _a.id) === pkg.id }, "package-card"])}" data-v-c004f0cf>`);
          if (pkg.popular) {
            _push(`<span class="popular-badge" data-v-c004f0cf>🌟 Popular</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="package-image" data-v-c004f0cf>`);
          if (pkg.image) {
            _push(`<img${ssrRenderAttr("src", pkg.image)}${ssrRenderAttr("alt", pkg.name)} class="pkg-img" data-v-c004f0cf>`);
          } else {
            _push(`<div class="image-placeholder" data-v-c004f0cf><span class="placeholder-text" data-v-c004f0cf>Picture coming soon</span><span class="placeholder-subtext" data-v-c004f0cf>But the taste is already here!</span></div>`);
          }
          _push(`</div><h3 class="package-name" data-v-c004f0cf>${ssrInterpolate(pkg.name)}</h3><p class="package-description" data-v-c004f0cf>${ssrInterpolate(pkg.description)}</p><ul class="package-items" data-v-c004f0cf><!--[-->`);
          ssrRenderList(pkg.items, (item, i) => {
            _push(`<li data-v-c004f0cf>${ssrInterpolate(item)}</li>`);
          });
          _push(`<!--]--></ul><div class="package-price" data-v-c004f0cf>₪${ssrInterpolate(pkg.price)}</div><button class="select-btn" data-v-c004f0cf>${ssrInterpolate(((_b = selectedPackage.value) == null ? void 0 : _b.id) === pkg.id ? "✓ Selected" : "Select")}</button></div>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "custom") {
        _push(`<section class="custom-section" data-v-c004f0cf><p class="custom-intro" data-v-c004f0cf>Choose the products you want and build a mishloach manot exactly how you like it</p><!--[-->`);
        ssrRenderList(customCategories, (category) => {
          _push(`<div class="custom-category" data-v-c004f0cf><h3 class="category-title" data-v-c004f0cf>${ssrInterpolate(category.icon)} ${ssrInterpolate(category.name)}</h3><div class="custom-items-grid" data-v-c004f0cf><!--[-->`);
          ssrRenderList(category.items, (item) => {
            _push(`<div class="${ssrRenderClass([{ selected: isItemSelected(item.id) }, "custom-item"])}" data-v-c004f0cf><div class="item-image-container" data-v-c004f0cf>`);
            if (item.image) {
              _push(`<img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="item-img" data-v-c004f0cf>`);
            } else {
              _push(`<div class="item-image-placeholder" data-v-c004f0cf><span class="placeholder-mini-text" data-v-c004f0cf>Photo soon</span></div>`);
            }
            _push(`</div><span class="item-name" data-v-c004f0cf>${ssrInterpolate(item.name)}</span><span class="item-price" data-v-c004f0cf>₪${ssrInterpolate(item.price)}</span>`);
            if (isItemSelected(item.id)) {
              _push(`<div class="item-qty" data-v-c004f0cf><button data-v-c004f0cf>-</button><span data-v-c004f0cf>${ssrInterpolate(getItemQty(item.id))}</span><button data-v-c004f0cf>+</button></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></section>`);
      } else {
        _push(`<!---->`);
      }
      if (hasSelection.value) {
        _push(`<div class="order-summary" data-v-c004f0cf><div class="summary-details" data-v-c004f0cf><span class="summary-count" data-v-c004f0cf>${ssrInterpolate(totalItems.value)} items</span><span class="summary-total" data-v-c004f0cf>₪${ssrInterpolate(totalPrice.value)}</span></div><button class="order-btn" data-v-c004f0cf>Order Now →</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="delivery-section" data-v-c004f0cf><h2 data-v-c004f0cf>🚚 Delivery &amp; Pickup</h2><div class="delivery-options" data-v-c004f0cf><div class="delivery-option" data-v-c004f0cf><span class="option-icon" data-v-c004f0cf>🏠</span><h4 data-v-c004f0cf>Self Pickup</h4><p data-v-c004f0cf>From Mishkafayim neighborhood, Beit Shemesh - Free</p></div><div class="delivery-option" data-v-c004f0cf><span class="option-icon" data-v-c004f0cf>🚗</span><h4 data-v-c004f0cf>Delivery</h4><p data-v-c004f0cf>Delivery to Beit Shemesh area for additional fee</p></div></div></section><section class="contact-section" data-v-c004f0cf><h2 data-v-c004f0cf>Questions?</h2><p data-v-c004f0cf>We&#39;re happy to help!</p><div class="contact-links" data-v-c004f0cf><a href="tel:0528460331" class="contact-link" data-v-c004f0cf>📱 052-846-0331</a><a href="https://wa.me/972528460331?text=Hi%20Margalit!%20I%20want%20to%20order%20Mishloach%20Manot%20for%20Purim" target="_blank" class="contact-link whatsapp" data-v-c004f0cf>💬 WhatsApp</a></div></section><a href="https://wa.me/972528460331?text=Hi%20Margalit!%20I%20want%20to%20order%20Mishloach%20Manot%20for%20Purim" target="_blank" class="whatsapp-float" data-v-c004f0cf><span data-v-c004f0cf>💬</span><span data-v-c004f0cf>Questions?</span></a></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/PurimEn.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const PurimEn = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-c004f0cf"]]);
const _sfc_main$1 = {
  __name: "Pesach",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useOrderStore();
    const cakes = ref([
      {
        id: "cake-1",
        name: "עוגת שקדים שוקולד המלכה לפסח",
        description: "עוגת שקדים עשירה בציפוי שוקולד מריר לפסח, ללא חשש שרויה",
        price: 75,
        image: "/pesach/chocletTheQ.jpeg",
        dairy: false,
        category: "עוגות"
      },
      {
        id: "cake-2",
        name: "עוגת שוקולד אגוזים לפסח",
        description: "עוגת שוקולד עשירה עם אגוזים קלויים לפסח, ללא חשש שרויה",
        price: 75,
        image: "/pesach/nutsPesachCake.jpeg",
        dairy: false,
        category: "עוגות"
      },
      {
        id: "cake-3",
        name: "עוגת שקדים תפוז לפסח",
        description: "עוגת שקדים עם ארומת תפוז טבעית לפסח, ללא חשש שרויה",
        price: 75,
        image: "/pesach/orangePesachCake.jpeg",
        dairy: false,
        category: "עוגות"
      },
      {
        id: "cake-4",
        name: "עוגת תפוחים אגוזים לפסח",
        description: "עוגה ביתית עם תפוחים טריים ואגוזים לפסח, ללא חשש שרויה",
        price: 75,
        image: "/pesach/appleNutsPesachCake.jpeg",
        dairy: false,
        category: "עוגות"
      }
    ]);
    const cookies = ref([
      {
        id: "cookie-1",
        name: "עוגיות שקדים לפסח",
        description: "מארז עוגיות שקדים פריכות ועדינות לפסח, ללא חשש שרויה",
        price: 65,
        image: "/pesach/almondsPesach.jpeg",
        dairy: true,
        category: "עוגיות"
      },
      {
        id: "cookie-2",
        name: "עוגיות שוקוציפס לפסח",
        description: "מארז עוגיות עם שוקולד ציפס בלגי לפסח, ללא חשש שרויה",
        price: 55,
        image: "/pesach/pesachChoclateChips.jpeg",
        dairy: false,
        category: "עוגיות"
      },
      {
        id: "cookie-3",
        name: "עוגיות קינמון אגוזים לפסח",
        description: "מארז עוגיות קינמון עם אגוזים קלויים לפסח, ללא חשש שרויה",
        price: 55,
        image: "/pesach/cinamonNuts.jpeg",
        dairy: false,
        category: "עוגיות"
      },
      {
        id: "cookie-4",
        name: "מגולגלות תמרים לפסח",
        description: "מארז עוגיות מגולגלות תמרים לפסח, ללא חשש שרויה ללא סוכר",
        price: 70,
        image: "/cookies/dateRolls.jpeg",
        dairy: false,
        category: "עוגיות"
      }
    ]);
    const selectedProducts = ref({});
    const isProductSelected = (productId) => {
      return selectedProducts.value[productId] && selectedProducts.value[productId].qty > 0;
    };
    const getProductQty = (productId) => {
      var _a;
      return ((_a = selectedProducts.value[productId]) == null ? void 0 : _a.qty) || 0;
    };
    const hasSelection = computed(() => {
      return Object.keys(selectedProducts.value).length > 0;
    });
    const totalItems = computed(() => {
      return Object.values(selectedProducts.value).reduce((sum, item) => sum + item.qty, 0);
    });
    const totalPrice = computed(() => {
      return Object.values(selectedProducts.value).reduce((sum, item) => sum + item.price * item.qty, 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pesach-page" }, _attrs))} data-v-9588ad77><div class="lang-switch" data-v-9588ad77><span class="lang-btn active" data-v-9588ad77>עברית</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/Pesach-en",
        class: "lang-btn"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`English`);
          } else {
            return [
              createTextVNode("English")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><section class="hero" data-v-9588ad77><div class="hero-decoration" data-v-9588ad77><span class="deco deco-1" data-v-9588ad77>🍷</span><span class="deco deco-2" data-v-9588ad77>🥜</span><span class="deco deco-3" data-v-9588ad77>🍰</span><span class="deco deco-4" data-v-9588ad77>✡️</span></div><h1 class="hero-title" data-v-9588ad77>🌾 מאפים כשרים לפסח</h1><p class="hero-subtitle" data-v-9588ad77>מרגליתות - טעמים מיוחדים לחג החירות</p><div class="kosher-badges" data-v-9588ad77><span class="badge" data-v-9588ad77>✓ כשר לפסח</span><span class="badge" data-v-9588ad77>✓ ללא חשש קטניות</span><span class="badge" data-v-9588ad77>✓ ללא חשש שרויה</span><span class="badge" data-v-9588ad77>✓ ללא גלוטן</span></div><div class="deadline-banner" data-v-9588ad77><span class="deadline-icon" data-v-9588ad77>⏰</span><span data-v-9588ad77>הזמנות עד 29.3.26 בשעה 16:00</span></div></section><section class="products-section" data-v-9588ad77><div class="category" data-v-9588ad77><h2 class="category-title" data-v-9588ad77><span class="category-icon" data-v-9588ad77>🎂</span> עוגות כשרות לפסח </h2><p class="category-description" data-v-9588ad77>עוגות עשירות מקמח שקדים ואגוזים, בשמן אגוזים איכותי</p><div class="products-grid" data-v-9588ad77><!--[-->`);
      ssrRenderList(cakes.value, (product) => {
        _push(`<div class="${ssrRenderClass([{ selected: isProductSelected(product.id) }, "product-card"])}" data-v-9588ad77><div class="product-image" data-v-9588ad77>`);
        if (product.image) {
          _push(`<img${ssrRenderAttr("src", product.image)}${ssrRenderAttr("alt", product.name)} class="product-img" data-v-9588ad77>`);
        } else {
          _push(`<div class="image-placeholder" data-v-9588ad77><span class="placeholder-text" data-v-9588ad77>התמונה עוד לא כאן</span><span class="placeholder-subtext" data-v-9588ad77>אבל הטעם כבר פה!</span></div>`);
        }
        _push(`</div><div class="product-info" data-v-9588ad77><h3 class="product-name" data-v-9588ad77>${ssrInterpolate(product.name)}</h3><p class="product-description" data-v-9588ad77>${ssrInterpolate(product.description)}</p><div class="product-tags" data-v-9588ad77><span class="tag" data-v-9588ad77>ללא גלוטן</span>`);
        if (product.dairy) {
          _push(`<span class="tag dairy" data-v-9588ad77>חלבי</span>`);
        } else {
          _push(`<span class="tag parve" data-v-9588ad77>פרווה</span>`);
        }
        _push(`</div><div class="product-price" data-v-9588ad77>₪${ssrInterpolate(product.price)}</div></div>`);
        if (isProductSelected(product.id)) {
          _push(`<div class="product-qty" data-v-9588ad77><button data-v-9588ad77>-</button><span data-v-9588ad77>${ssrInterpolate(getProductQty(product.id))}</span><button data-v-9588ad77>+</button></div>`);
        } else {
          _push(`<button class="add-btn" data-v-9588ad77>הוסף לסל</button>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="category" data-v-9588ad77><h2 class="category-title" data-v-9588ad77><span class="category-icon" data-v-9588ad77>🍪</span> עוגיות כשרות לפסח </h2><p class="category-description" data-v-9588ad77>מארזי עוגיות פריכות ומפנקות לכל המשפחה</p><div class="products-grid" data-v-9588ad77><!--[-->`);
      ssrRenderList(cookies.value, (product) => {
        _push(`<div class="${ssrRenderClass([{ selected: isProductSelected(product.id) }, "product-card"])}" data-v-9588ad77><div class="product-image" data-v-9588ad77>`);
        if (product.image) {
          _push(`<img${ssrRenderAttr("src", product.image)}${ssrRenderAttr("alt", product.name)} class="product-img" data-v-9588ad77>`);
        } else {
          _push(`<div class="image-placeholder" data-v-9588ad77><span class="placeholder-text" data-v-9588ad77>התמונה עוד לא כאן</span><span class="placeholder-subtext" data-v-9588ad77>אבל הטעם כבר פה!</span></div>`);
        }
        _push(`</div><div class="product-info" data-v-9588ad77><h3 class="product-name" data-v-9588ad77>${ssrInterpolate(product.name)}</h3><p class="product-description" data-v-9588ad77>${ssrInterpolate(product.description)}</p><div class="product-tags" data-v-9588ad77><span class="tag" data-v-9588ad77>ללא גלוטן</span>`);
        if (product.dairy) {
          _push(`<span class="tag dairy" data-v-9588ad77>חלבי</span>`);
        } else {
          _push(`<span class="tag parve" data-v-9588ad77>פרווה</span>`);
        }
        _push(`</div><div class="product-price" data-v-9588ad77>₪${ssrInterpolate(product.price)}</div></div>`);
        if (isProductSelected(product.id)) {
          _push(`<div class="product-qty" data-v-9588ad77><button data-v-9588ad77>-</button><span data-v-9588ad77>${ssrInterpolate(getProductQty(product.id))}</span><button data-v-9588ad77>+</button></div>`);
        } else {
          _push(`<button class="add-btn" data-v-9588ad77>הוסף לסל</button>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></section>`);
      if (hasSelection.value) {
        _push(`<div class="order-summary" data-v-9588ad77><div class="summary-details" data-v-9588ad77><span class="summary-count" data-v-9588ad77>${ssrInterpolate(totalItems.value)} פריטים</span><span class="summary-total" data-v-9588ad77>₪${ssrInterpolate(totalPrice.value)}</span></div><button class="order-btn" data-v-9588ad77>להזמנה →</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="delivery-section" data-v-9588ad77><h2 data-v-9588ad77>🚚 משלוחים ואיסוף</h2><div class="delivery-options" data-v-9588ad77><div class="delivery-option" data-v-9588ad77><span class="option-icon" data-v-9588ad77>🏠</span><h4 data-v-9588ad77>איסוף עצמי</h4><p data-v-9588ad77>משכונת המשקפיים, בית שמש - ללא עלות</p></div><div class="delivery-option" data-v-9588ad77><span class="option-icon" data-v-9588ad77>🚗</span><h4 data-v-9588ad77>משלוח</h4><p data-v-9588ad77>משלוחים לבית שמש והסביבה בתוספת תשלום</p></div></div></section><section class="contact-section" data-v-9588ad77><h2 data-v-9588ad77>שאלות?</h2><p data-v-9588ad77>נשמח לעזור!</p><div class="contact-links" data-v-9588ad77><a href="tel:0528460331" class="contact-link" data-v-9588ad77>📱 052-846-0331</a><a href="https://wa.me/972528460331?text=היי%20מרגלית!%20אני%20רוצה%20להזמין%20מאפים%20לפסח" target="_blank" class="contact-link whatsapp" data-v-9588ad77>💬 WhatsApp</a></div></section><a href="https://wa.me/972528460331?text=היי%20מרגלית!%20אני%20רוצה%20להזמין%20מאפים%20לפסח" target="_blank" class="whatsapp-float" data-v-9588ad77><span data-v-9588ad77>💬</span><span data-v-9588ad77>שאלות?</span></a></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Pesach.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Pesach = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9588ad77"]]);
const _sfc_main = {
  __name: "PesachEn",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useOrderStore();
    const cakes = ref([
      {
        id: "cake-1",
        name: "Queen Almond Chocolate Cake",
        description: "Rich almond cake with dark chocolate coating, non-gebrochts",
        price: 85,
        image: null,
        dairy: false,
        category: "Cakes"
      },
      {
        id: "cake-2",
        name: "Chocolate Walnut Cake",
        description: "Rich chocolate cake with roasted walnuts, non-gebrochts",
        price: 80,
        image: null,
        dairy: false,
        category: "Cakes"
      },
      {
        id: "cake-3",
        name: "Almond Orange Cake",
        description: "Almond cake with natural orange flavor, non-gebrochts",
        price: 80,
        image: null,
        dairy: false,
        category: "Cakes"
      },
      {
        id: "cake-4",
        name: "Apple Walnut Cake",
        description: "Homestyle cake with fresh apples and walnuts, non-gebrochts",
        price: 75,
        image: null,
        dairy: false,
        category: "Cakes"
      }
    ]);
    const cookies = ref([
      {
        id: "cookie-1",
        name: "Almond Cookies",
        description: "Box of crispy and delicate almond cookies, non-gebrochts",
        price: 55,
        image: null,
        dairy: true,
        category: "Cookies"
      },
      {
        id: "cookie-2",
        name: "Chocolate Chip Cookies",
        description: "Box of cookies with Belgian chocolate chips, non-gebrochts",
        price: 50,
        image: null,
        dairy: false,
        category: "Cookies"
      },
      {
        id: "cookie-3",
        name: "Cinnamon Walnut Cookies",
        description: "Box of cinnamon cookies with roasted walnuts, non-gebrochts",
        price: 50,
        image: null,
        dairy: false,
        category: "Cookies"
      }
    ]);
    const selectedProducts = ref({});
    const isProductSelected = (productId) => {
      return selectedProducts.value[productId] && selectedProducts.value[productId].qty > 0;
    };
    const getProductQty = (productId) => {
      var _a;
      return ((_a = selectedProducts.value[productId]) == null ? void 0 : _a.qty) || 0;
    };
    const hasSelection = computed(() => {
      return Object.keys(selectedProducts.value).length > 0;
    });
    const totalItems = computed(() => {
      return Object.values(selectedProducts.value).reduce((sum, item) => sum + item.qty, 0);
    });
    const totalPrice = computed(() => {
      return Object.values(selectedProducts.value).reduce((sum, item) => sum + item.price * item.qty, 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pesach-page pesach-page-en" }, _attrs))} data-v-fb79c28b><div class="lang-switch" data-v-fb79c28b>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/Pesach",
        class: "lang-btn"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`עברית`);
          } else {
            return [
              createTextVNode("עברית")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="lang-btn active" data-v-fb79c28b>English</span></div><section class="hero" data-v-fb79c28b><div class="hero-decoration" data-v-fb79c28b><span class="deco deco-1" data-v-fb79c28b>🍷</span><span class="deco deco-2" data-v-fb79c28b>🥜</span><span class="deco deco-3" data-v-fb79c28b>🍰</span><span class="deco deco-4" data-v-fb79c28b>✡️</span></div><h1 class="hero-title" data-v-fb79c28b>🌾 Kosher for Passover Baked Goods</h1><p class="hero-subtitle" data-v-fb79c28b>Margalitut - Special Flavors for the Festival of Freedom</p><div class="kosher-badges" data-v-fb79c28b><span class="badge" data-v-fb79c28b>✓ Kosher for Passover</span><span class="badge" data-v-fb79c28b>✓ Kitniyot Free</span><span class="badge" data-v-fb79c28b>✓ Non-Gebrochts</span><span class="badge" data-v-fb79c28b>✓ Gluten Free</span></div><div class="deadline-banner" data-v-fb79c28b><span class="deadline-icon" data-v-fb79c28b>⏰</span><span data-v-fb79c28b>Orders until March 29th, 4:00 PM</span></div></section><section class="products-section" data-v-fb79c28b><div class="category" data-v-fb79c28b><h2 class="category-title" data-v-fb79c28b><span class="category-icon" data-v-fb79c28b>🎂</span> Passover Cakes </h2><p class="category-description" data-v-fb79c28b>Rich cakes made with almond and nut flour, using premium nut oil</p><div class="products-grid" data-v-fb79c28b><!--[-->`);
      ssrRenderList(cakes.value, (product) => {
        _push(`<div class="${ssrRenderClass([{ selected: isProductSelected(product.id) }, "product-card"])}" data-v-fb79c28b><div class="product-image" data-v-fb79c28b>`);
        if (product.image) {
          _push(`<img${ssrRenderAttr("src", product.image)}${ssrRenderAttr("alt", product.name)} class="product-img" data-v-fb79c28b>`);
        } else {
          _push(`<div class="image-placeholder" data-v-fb79c28b><span class="placeholder-text" data-v-fb79c28b>Picture coming soon</span><span class="placeholder-subtext" data-v-fb79c28b>But the taste is already here!</span></div>`);
        }
        _push(`</div><div class="product-info" data-v-fb79c28b><h3 class="product-name" data-v-fb79c28b>${ssrInterpolate(product.name)}</h3><p class="product-description" data-v-fb79c28b>${ssrInterpolate(product.description)}</p><div class="product-tags" data-v-fb79c28b><span class="tag" data-v-fb79c28b>Gluten Free</span>`);
        if (product.dairy) {
          _push(`<span class="tag dairy" data-v-fb79c28b>Dairy</span>`);
        } else {
          _push(`<span class="tag parve" data-v-fb79c28b>Parve</span>`);
        }
        _push(`</div><div class="product-price" data-v-fb79c28b>₪${ssrInterpolate(product.price)}</div></div>`);
        if (isProductSelected(product.id)) {
          _push(`<div class="product-qty" data-v-fb79c28b><button data-v-fb79c28b>-</button><span data-v-fb79c28b>${ssrInterpolate(getProductQty(product.id))}</span><button data-v-fb79c28b>+</button></div>`);
        } else {
          _push(`<button class="add-btn" data-v-fb79c28b>Add to Cart</button>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="category" data-v-fb79c28b><h2 class="category-title" data-v-fb79c28b><span class="category-icon" data-v-fb79c28b>🍪</span> Passover Cookies </h2><p class="category-description" data-v-fb79c28b>Crispy and delicious cookie boxes for the whole family</p><div class="products-grid" data-v-fb79c28b><!--[-->`);
      ssrRenderList(cookies.value, (product) => {
        _push(`<div class="${ssrRenderClass([{ selected: isProductSelected(product.id) }, "product-card"])}" data-v-fb79c28b><div class="product-image" data-v-fb79c28b>`);
        if (product.image) {
          _push(`<img${ssrRenderAttr("src", product.image)}${ssrRenderAttr("alt", product.name)} class="product-img" data-v-fb79c28b>`);
        } else {
          _push(`<div class="image-placeholder" data-v-fb79c28b><span class="placeholder-text" data-v-fb79c28b>Picture coming soon</span><span class="placeholder-subtext" data-v-fb79c28b>But the taste is already here!</span></div>`);
        }
        _push(`</div><div class="product-info" data-v-fb79c28b><h3 class="product-name" data-v-fb79c28b>${ssrInterpolate(product.name)}</h3><p class="product-description" data-v-fb79c28b>${ssrInterpolate(product.description)}</p><div class="product-tags" data-v-fb79c28b><span class="tag" data-v-fb79c28b>Gluten Free</span>`);
        if (product.dairy) {
          _push(`<span class="tag dairy" data-v-fb79c28b>Dairy</span>`);
        } else {
          _push(`<span class="tag parve" data-v-fb79c28b>Parve</span>`);
        }
        _push(`</div><div class="product-price" data-v-fb79c28b>₪${ssrInterpolate(product.price)}</div></div>`);
        if (isProductSelected(product.id)) {
          _push(`<div class="product-qty" data-v-fb79c28b><button data-v-fb79c28b>-</button><span data-v-fb79c28b>${ssrInterpolate(getProductQty(product.id))}</span><button data-v-fb79c28b>+</button></div>`);
        } else {
          _push(`<button class="add-btn" data-v-fb79c28b>Add to Cart</button>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></section>`);
      if (hasSelection.value) {
        _push(`<div class="order-summary" data-v-fb79c28b><div class="summary-details" data-v-fb79c28b><span class="summary-count" data-v-fb79c28b>${ssrInterpolate(totalItems.value)} items</span><span class="summary-total" data-v-fb79c28b>₪${ssrInterpolate(totalPrice.value)}</span></div><button class="order-btn" data-v-fb79c28b>Order Now →</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="delivery-section" data-v-fb79c28b><h2 data-v-fb79c28b>🚚 Delivery &amp; Pickup</h2><div class="delivery-options" data-v-fb79c28b><div class="delivery-option" data-v-fb79c28b><span class="option-icon" data-v-fb79c28b>🏠</span><h4 data-v-fb79c28b>Self Pickup</h4><p data-v-fb79c28b>From Mishkafayim neighborhood, Beit Shemesh - Free</p></div><div class="delivery-option" data-v-fb79c28b><span class="option-icon" data-v-fb79c28b>🚗</span><h4 data-v-fb79c28b>Delivery</h4><p data-v-fb79c28b>Delivery to Beit Shemesh area for additional fee</p></div></div></section><section class="contact-section" data-v-fb79c28b><h2 data-v-fb79c28b>Questions?</h2><p data-v-fb79c28b>We&#39;re happy to help!</p><div class="contact-links" data-v-fb79c28b><a href="tel:0528460331" class="contact-link" data-v-fb79c28b>📱 052-846-0331</a><a href="https://wa.me/972528460331?text=Hi%20Margalit!%20I%20want%20to%20order%20Passover%20baked%20goods" target="_blank" class="contact-link whatsapp" data-v-fb79c28b>💬 WhatsApp</a></div></section><a href="https://wa.me/972528460331?text=Hi%20Margalit!%20I%20want%20to%20order%20Passover%20baked%20goods" target="_blank" class="whatsapp-float" data-v-fb79c28b><span data-v-fb79c28b>💬</span><span data-v-fb79c28b>Questions?</span></a></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/PesachEn.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PesachEn = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fb79c28b"]]);
const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/menu", name: "menu", component: Menu },
  { path: "/menu/:categoryId", name: "menu-category", component: MenuCategory, props: true },
  { path: "/gallery", name: "gallery", component: Gallery },
  { path: "/about", name: "about", component: About },
  { path: "/quote", name: "quote", component: Quote },
  { path: "/checkout", name: "checkout", component: Checkout },
  { path: "/admin", name: "admin", component: Admin },
  { path: "/my-orders", name: "my-orders", component: MyOrders },
  { path: "/workshops", name: "workshops", component: BakingWorkshops },
  { path: "/tasting", name: "tasting", component: Tasting },
  { path: "/purim", name: "purim", component: Purim },
  { path: "/purim-en", name: "purim-en", component: PurimEn },
  { path: "/Pesach", name: "pesach", component: Pesach },
  { path: "/Pesach-en", name: "pesach-en", component: PesachEn },
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("./assets/NotFound-CLE_gV3i.js") },
  { path: "/faq", name: "faq", component: () => import("./assets/FAQ-DieUhNu6.js") }
];
createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: "smooth" };
  }
});
const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior: (to, from, saved) => saved || { top: 0 }
  },
  ({ app: app2, initialState }) => {
    const pinia = createPinia();
    app2.use(pinia);
    initialState.pinia = pinia.state.value;
  }
);
export {
  _export_sfc as _,
  createApp,
  useScrollAnimation as u
};
