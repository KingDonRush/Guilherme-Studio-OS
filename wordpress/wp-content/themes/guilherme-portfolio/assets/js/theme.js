(function () {
	const root = document.documentElement;

	document.addEventListener(
		'pointermove',
		(event) => {
			root.style.setProperty('--mx', `${event.clientX}px`);
			root.style.setProperty('--my', `${event.clientY}px`);
		},
		{ passive: true }
	);

	const header = document.querySelector('[data-site-header]');
	if (header) {
		const onScroll = () => {
			header.toggleAttribute('data-scrolled', window.scrollY > 24);
		};

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
	}

	const showcase = document.querySelector('[data-project-showcase]');
	if (!showcase) {
		return;
	}

	const panels = Array.from(showcase.querySelectorAll('[data-project-panel]'));
	const triggers = Array.from(showcase.querySelectorAll('[data-project-trigger]'));
	const tabs = Array.from(showcase.querySelectorAll('[data-project-tab]'));
	const counter = showcase.querySelector('[data-project-counter]');
	const rail = showcase.querySelector('[data-project-rail]');
	const track = showcase.querySelector('[data-project-track]');
	const previousButton = showcase.querySelector('[data-project-prev]');
	const nextButton = showcase.querySelector('[data-project-next]');
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	let activeType = 'plugin';
	let isMoving = false;
	let touchStartX = 0;

	function activateProject(index) {
		const panel = panels.find((item) => Number(item.dataset.projectPanel) === index);
		if (!panel) {
			return;
		}

		panels.forEach((item) => {
			const active = item === panel;
			item.hidden = !active;
			item.classList.toggle('is-active', active);
		});

		triggers.forEach((item) => {
			const active = Number(item.dataset.projectTrigger) === index;
			item.classList.toggle('is-active', active);
			item.setAttribute('aria-pressed', active ? 'true' : 'false');
		});

		if (counter) {
			counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')}`;
		}
	}

	function visibleTriggers() {
		return Array.from(track.querySelectorAll(`[data-project-trigger][data-project-type="${activeType}"]`));
	}

	function finishMovement(animation, callback) {
		if (!animation) {
			callback();
			return;
		}

		isMoving = true;
		animation.finished
			.catch(() => {})
			.finally(() => {
				callback();
				isMoving = false;
			});
	}

	function moveForward(target) {
		const visible = visibleTriggers();
		const targetPosition = visible.indexOf(target);

		if (isMoving || targetPosition < 1) {
			if (targetPosition === 0) {
				activateProject(Number(target.dataset.projectTrigger));
			}
			return;
		}

		const distance = target.offsetLeft - visible[0].offsetLeft;
		const preceding = visible.slice(0, targetPosition);
		activateProject(Number(target.dataset.projectTrigger));

		const animation = reducedMotion.matches
			? null
			: track.animate(
					[
						{ transform: 'translateX(0)' },
						{ transform: `translateX(-${distance}px)` },
					],
					{
						duration: 260,
						easing: 'cubic-bezier(.22, 1, .36, 1)',
					}
				);

		finishMovement(animation, () => {
			preceding.forEach((item) => track.append(item));
		});
	}

	function movePrevious() {
		const visible = visibleTriggers();
		const target = visible.at(-1);

		if (isMoving || visible.length < 2 || !target) {
			return;
		}

		track.prepend(target);
		const nextItem = visible[0];
		const distance = nextItem.offsetLeft - target.offsetLeft;
		activateProject(Number(target.dataset.projectTrigger));

		const animation = reducedMotion.matches
			? null
			: track.animate(
					[
						{ transform: `translateX(-${distance}px)` },
						{ transform: 'translateX(0)' },
					],
					{
						duration: 260,
						easing: 'cubic-bezier(.22, 1, .36, 1)',
					}
				);

		finishMovement(animation, () => {});
	}

	function moveNext() {
		const visible = visibleTriggers();

		if (visible.length > 1) {
			moveForward(visible[1]);
		}
	}

	function activateCategory(type) {
		activeType = type;

		tabs.forEach((tab) => {
			const active = tab.dataset.projectTab === type;
			tab.classList.toggle('is-active', active);
			tab.setAttribute('aria-selected', active ? 'true' : 'false');
		});

		triggers.forEach((trigger) => {
			trigger.hidden = trigger.dataset.projectType !== type;
		});

		triggers.forEach((trigger) => track.append(trigger));

		const first = visibleTriggers()[0];
		if (first) {
			activateProject(Number(first.dataset.projectTrigger));
		}

		const hasMultipleProjects = visibleTriggers().length > 1;
		previousButton.disabled = !hasMultipleProjects;
		nextButton.disabled = !hasMultipleProjects;
	}

	triggers.forEach((trigger) => {
		trigger.addEventListener('click', () => moveForward(trigger));
	});

	tabs.forEach((tab) => {
		tab.addEventListener('click', () => activateCategory(tab.dataset.projectTab));
	});

	previousButton.addEventListener('click', movePrevious);
	nextButton.addEventListener('click', moveNext);

	showcase.addEventListener('keydown', (event) => {
		if (!event.target.closest('[data-project-trigger], [data-project-prev], [data-project-next]')) {
			return;
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			movePrevious();
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			moveNext();
		}
	});

	rail.addEventListener(
		'touchstart',
		(event) => {
			touchStartX = event.changedTouches[0].clientX;
		},
		{ passive: true }
	);

	rail.addEventListener(
		'touchend',
		(event) => {
			const distance = event.changedTouches[0].clientX - touchStartX;

			if (Math.abs(distance) < 42) {
				return;
			}

			if (distance < 0) {
				moveNext();
			} else {
				movePrevious();
			}
		},
		{ passive: true }
	);

	activateCategory('plugin');
})();
