(() => {
	const page = document.querySelector('[data-case-page]');
	if (!page) {
		return;
	}

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const carousel = page.querySelector('[data-case-carousel]');

	if (carousel) {
		const tabs = Array.from(carousel.querySelectorAll('[data-evidence-tab]'));
		const slides = Array.from(carousel.querySelectorAll('[data-evidence-slide]'));
		const copies = Array.from(carousel.querySelectorAll('[data-evidence-copy]'));
		const previousButton = carousel.querySelector('[data-evidence-prev]');
		const nextButton = carousel.querySelector('[data-evidence-next]');
		let activeIndex = 0;

		const activate = (index, focus = false) => {
			activeIndex = (index + tabs.length) % tabs.length;

			tabs.forEach((tab, tabIndex) => {
				const active = tabIndex === activeIndex;
				tab.classList.toggle('is-active', active);
				tab.setAttribute('aria-selected', String(active));
				tab.tabIndex = active ? 0 : -1;
			});

			slides.forEach((slide, slideIndex) => {
				const active = slideIndex === activeIndex;
				slide.classList.toggle('is-active', active);
				slide.setAttribute('aria-hidden', String(!active));
			});

			copies.forEach((copy, copyIndex) => {
				const active = copyIndex === activeIndex;
				copy.classList.toggle('is-active', active);
				copy.setAttribute('aria-hidden', String(!active));
			});

			if (focus) {
				tabs[activeIndex]?.focus();
			}
		};

		tabs.forEach((tab, index) => {
			tab.addEventListener('click', () => activate(index));
			tab.addEventListener('keydown', (event) => {
				if ('ArrowRight' === event.key) {
					event.preventDefault();
					activate(activeIndex + 1, true);
				}

				if ('ArrowLeft' === event.key) {
					event.preventDefault();
					activate(activeIndex - 1, true);
				}
			});
		});

		previousButton?.addEventListener('click', () => activate(activeIndex - 1));
		nextButton?.addEventListener('click', () => activate(activeIndex + 1));

		activate(0);
	}

	const revealTargets = page.querySelectorAll('.section-reveal');
	if ('IntersectionObserver' in window && !reducedMotion) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
		);

		revealTargets.forEach((target) => observer.observe(target));
	} else {
		revealTargets.forEach((target) => target.classList.add('is-visible'));
	}
})();
