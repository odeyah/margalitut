import { resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { useHead } from "@vueuse/head";
import { _ as _export_sfc } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
import "pinia";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "@emailjs/browser";
const _sfc_main = {
  __name: "NotFound",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "הדף לא נמצא | מרגליתות"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-found-page" }, _attrs))} data-v-ae6de7c5><div class="not-found-content" data-v-ae6de7c5><div class="illustration" data-v-ae6de7c5><span class="big-emoji" data-v-ae6de7c5>🍰</span><span class="crumbs crumb-1" data-v-ae6de7c5>✨</span><span class="crumbs crumb-2" data-v-ae6de7c5>🍪</span><span class="crumbs crumb-3" data-v-ae6de7c5>✨</span></div><h1 class="error-code" data-v-ae6de7c5>404</h1><h2 class="error-title" data-v-ae6de7c5>אופס! הדף נאכל...</h2><p class="error-message" data-v-ae6de7c5>נראה שהדף שחיפשת לא קיים או שמישהו כבר טעם אותו 😋</p><div class="action-buttons" data-v-ae6de7c5>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/",
        class: "btn btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="btn-icon" data-v-ae6de7c5${_scopeId}>🏠</span> חזרה לדף הבית `);
          } else {
            return [
              createVNode("span", { class: "btn-icon" }, "🏠"),
              createTextVNode(" חזרה לדף הבית ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: "/menu",
        class: "btn btn-secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="btn-icon" data-v-ae6de7c5${_scopeId}>📋</span> לתפריט `);
          } else {
            return [
              createVNode("span", { class: "btn-icon" }, "📋"),
              createTextVNode(" לתפריט ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="search-suggestion" data-v-ae6de7c5><p data-v-ae6de7c5>אולי תמצאו מה שחיפשתם כאן:</p><div class="quick-links" data-v-ae6de7c5>`);
      _push(ssrRenderComponent(_component_router_link, { to: "/menu/yeast-cakes" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`עוגות שמרים`);
          } else {
            return [
              createTextVNode("עוגות שמרים")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, { to: "/menu/cookies" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`עוגיות`);
          } else {
            return [
              createTextVNode("עוגיות")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, { to: "/menu/mixed-cakes" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`עוגות בחושות`);
          } else {
            return [
              createTextVNode("עוגות בחושות")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, { to: "/workshops" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`חוגי אפייה`);
          } else {
            return [
              createTextVNode("חוגי אפייה")
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
      _push(`</div></div><div class="contact-help" data-v-ae6de7c5><p data-v-ae6de7c5>צריכים עזרה?</p><a href="https://wa.me/972528460331" target="_blank" class="whatsapp-link" data-v-ae6de7c5><span data-v-ae6de7c5>💬</span> דברו איתנו בוואטסאפ </a></div></div><div class="decorations" data-v-ae6de7c5><span class="float-item f1" data-v-ae6de7c5>🥐</span><span class="float-item f2" data-v-ae6de7c5>🍓</span><span class="float-item f3" data-v-ae6de7c5>🧁</span><span class="float-item f4" data-v-ae6de7c5>🍫</span><span class="float-item f5" data-v-ae6de7c5>🥧</span></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/NotFound.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const NotFound = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ae6de7c5"]]);
export {
  NotFound as default
};
