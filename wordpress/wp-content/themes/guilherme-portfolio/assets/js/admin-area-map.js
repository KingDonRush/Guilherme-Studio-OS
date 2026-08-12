( () => {
	const openModal = ( id ) => {
		const modal = document.querySelector( `[data-gp-modal="${ id }"]` );

		if ( ! modal ) {
			return;
		}

		modal.hidden = false;
		modal.setAttribute( 'aria-hidden', 'false' );

		const focusTarget = modal.querySelector( 'input, select, textarea, button' );

		if ( focusTarget ) {
			focusTarget.focus();
		}
	};

	const closeModal = ( modal ) => {
		if ( ! modal ) {
			return;
		}

		modal.hidden = true;
		modal.setAttribute( 'aria-hidden', 'true' );
	};

	document.addEventListener( 'click', ( event ) => {
		const opener = event.target.closest( '[data-gp-modal-open]' );

		if ( opener ) {
			event.preventDefault();
			openModal( opener.getAttribute( 'data-gp-modal-open' ) );
			return;
		}

		const closer = event.target.closest( '[data-gp-modal-close]' );

		if ( closer ) {
			event.preventDefault();
			closeModal( closer.closest( '[data-gp-modal]' ) );
		}
	} );

	document.addEventListener( 'keydown', ( event ) => {
		if ( 'Escape' !== event.key ) {
			return;
		}

		document.querySelectorAll( '[data-gp-modal]:not([hidden])' ).forEach( closeModal );
	} );

	document.querySelectorAll( '[data-gp-area-search]' ).forEach( ( input ) => {
		input.addEventListener( 'input', () => {
			const needle = input.value.trim().toLowerCase();

			document.querySelectorAll( '[data-gp-area-row]' ).forEach( ( row ) => {
				const haystack = row.getAttribute( 'data-gp-area-name' ) || '';
				row.hidden = '' !== needle && ! haystack.includes( needle );
			} );
		} );
	} );

	document.querySelectorAll( '[data-gp-context-surface]' ).forEach( ( surface ) => {
		const panels = [ ...surface.querySelectorAll( '[data-gp-context-panel]' ) ];
		const cards = [ ...surface.querySelectorAll( '[data-gp-context-trigger]' ) ];
		let pinned = '';

		const showPanel = ( id ) => {
			panels.forEach( ( panel ) => {
				panel.hidden = panel.getAttribute( 'data-gp-context-panel' ) !== id;
			} );

			cards.forEach( ( card ) => {
				card.classList.toggle( 'is-selected', card.getAttribute( 'data-gp-context-trigger' ) === id );
			} );
		};

		cards.forEach( ( card ) => {
			const id = card.getAttribute( 'data-gp-context-trigger' );

			card.addEventListener( 'mouseenter', () => {
				if ( ! pinned ) {
					showPanel( id );
				}
			} );

			card.addEventListener( 'mouseleave', () => {
				if ( ! pinned ) {
					showPanel( 'area' );
				}
			} );

			card.addEventListener( 'focus', () => showPanel( id ) );
			card.addEventListener( 'click', ( event ) => {
				if ( event.target.closest( 'a, button, input, select, textarea' ) ) {
					return;
				}

				pinned = pinned === id ? '' : id;
				showPanel( pinned || 'area' );
			} );
		} );

		surface.addEventListener( 'keydown', ( event ) => {
			if ( 'Escape' !== event.key ) {
				return;
			}

			pinned = '';
			showPanel( 'area' );
		} );

		showPanel( 'area' );
	} );

	document.querySelectorAll( '[data-gp-tabset]' ).forEach( ( tabset ) => {
		const tabs = [ ...tabset.querySelectorAll( '[data-gp-tab]' ) ];
		const panels = [ ...tabset.querySelectorAll( '[data-gp-tab-panel]' ) ];

		const activate = ( id ) => {
			tabs.forEach( ( tab ) => {
				tab.classList.toggle( 'is-active', tab.getAttribute( 'data-gp-tab' ) === id );
			} );

			panels.forEach( ( panel ) => {
				panel.hidden = panel.getAttribute( 'data-gp-tab-panel' ) !== id;
			} );
		};

		tabs.forEach( ( tab ) => {
			tab.addEventListener( 'click', () => activate( tab.getAttribute( 'data-gp-tab' ) ) );
		} );

		if ( tabs[0] ) {
			activate( tabs[0].getAttribute( 'data-gp-tab' ) );
		}
	} );

	document.querySelectorAll( '[data-gp-page-grid]' ).forEach( ( grid ) => {
		const pageSize = 6;
		const cards = [ ...grid.querySelectorAll( '[data-gp-page-card]' ) ];
		const pager = grid.parentElement.querySelector( '[data-gp-page-pager]' );

		if ( ! pager || cards.length <= pageSize ) {
			return;
		}

		const previous = pager.querySelector( '[data-gp-page-prev]' );
		const next = pager.querySelector( '[data-gp-page-next]' );
		const count = pager.querySelector( '[data-gp-page-count]' );
		const total = Math.ceil( cards.length / pageSize );
		let current = 0;

		const renderPage = () => {
			cards.forEach( ( card, index ) => {
				card.hidden = Math.floor( index / pageSize ) !== current;
			} );

			count.textContent = `${ current + 1 } / ${ total }`;
			previous.disabled = 0 === current;
			next.disabled = current + 1 === total;
			pager.hidden = false;
		};

		previous.addEventListener( 'click', () => {
			current = Math.max( 0, current - 1 );
			renderPage();
		} );

		next.addEventListener( 'click', () => {
			current = Math.min( total - 1, current + 1 );
			renderPage();
		} );

		renderPage();
	} );
} )();
