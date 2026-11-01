import { ViteSSG } from 'vite-ssg';
import { createPinia } from 'pinia';
import App from './App.vue';
import { routes } from './router';
import './styles/main.css';

export const createApp = ViteSSG(
	App,
	{
		routes,
		scrollBehavior: (to, from, saved) => saved || { top: 0 },
	},
	({ app, initialState }) => {
		const pinia = createPinia();
		app.use(pinia);
		if (import.meta.env.SSR) initialState.pinia = pinia.state.value;
		else pinia.state.value = initialState.pinia || {};
	},
);
