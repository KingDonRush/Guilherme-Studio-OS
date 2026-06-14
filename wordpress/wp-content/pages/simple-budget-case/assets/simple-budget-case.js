(() => {
	const page = document.querySelector('[data-case-page]');
	if (!page) {
		return;
	}

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	page.addEventListener('pointermove', (event) => {
		if (reducedMotion) {
			return;
		}

		const x = Math.round((event.clientX / window.innerWidth) * 100);
		const y = Math.round((event.clientY / window.innerHeight) * 100);
		document.documentElement.style.setProperty('--mx', `${x}%`);
		document.documentElement.style.setProperty('--my', `${y}%`);
	});

	const carousel = document.querySelector('[data-case-carousel]');
	if (carousel) {
		const slides = Array.from(carousel.querySelectorAll('.case-slide'));
		const title = carousel.querySelector('[data-carousel-title]');
		const counter = carousel.querySelector('[data-carousel-counter]');
		const prev = carousel.querySelector('[data-carousel-prev]');
		const next = carousel.querySelector('[data-carousel-next]');
		let activeIndex = 0;

		const render = () => {
			slides.forEach((slide, index) => {
				const isActive = index === activeIndex;
				slide.classList.toggle('is-active', isActive);
				slide.setAttribute('aria-hidden', String(!isActive));
			});

			if (title) {
				title.textContent = slides[activeIndex]?.dataset.title || '';
			}

			if (counter) {
				counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
			}
		};

		prev?.addEventListener('click', () => {
			activeIndex = (activeIndex - 1 + slides.length) % slides.length;
			render();
		});

		next?.addEventListener('click', () => {
			activeIndex = (activeIndex + 1) % slides.length;
			render();
		});

		render();
	}

	const toast = document.querySelector('[data-quote-toast]');
	let quoteCount = 2;
	let toastTimer;

	document.addEventListener('click', (event) => {
		const button = event.target.closest('[data-add-item]');
		if (!button) {
			return;
		}

		quoteCount += 1;
		document.querySelectorAll('[data-quote-count]').forEach((target) => {
			target.textContent = String(quoteCount);
		});
		button.classList.add('is-added');
		button.textContent = 'Added';

		if (toast) {
			toast.classList.add('is-visible');
			window.clearTimeout(toastTimer);
			toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
		}
	});

	document.querySelectorAll('[data-accordion]').forEach((accordion) => {
		const items = Array.from(accordion.querySelectorAll('.accordion-item'));

		items.forEach((item) => {
			const trigger = item.querySelector('button');
			trigger?.addEventListener('click', () => {
				items.forEach((candidate) => {
					const isTarget = candidate === item;
					candidate.classList.toggle('is-open', isTarget);
					candidate.querySelector('button')?.setAttribute('aria-expanded', String(isTarget));
				});
			});
		});
	});

	const revealTargets = document.querySelectorAll('.section-reveal');
	if ('IntersectionObserver' in window && !reducedMotion) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

		revealTargets.forEach((target) => observer.observe(target));
	} else {
		revealTargets.forEach((target) => target.classList.add('is-visible'));
	}
})();
