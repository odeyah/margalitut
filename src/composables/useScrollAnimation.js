import { onMounted, onUnmounted } from 'vue';

export function useScrollAnimation() {
	let observer = null;

	function initScrollAnimation() {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1,
		};

		observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('animate-in');
					// אפשר להפסיק לצפות אחרי שהאנימציה הופעלה
					observer.unobserve(entry.target);
				}
			});
		}, options);

		// מצא את כל האלמנטים עם class של animate-on-scroll
		const elements = document.querySelectorAll('.animate-on-scroll');
		elements.forEach(el => observer.observe(el));
	}

	function cleanup() {
		if (observer) {
			observer.disconnect();
		}
	}

	onMounted(() => {
		// המתן מעט לטעינת הדף
		setTimeout(initScrollAnimation, 100);
	});

	onUnmounted(() => {
		cleanup();
	});

	return {
		initScrollAnimation,
		cleanup,
	};
}
