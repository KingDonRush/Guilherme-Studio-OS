# Filter Controller TASK-082: range visual QA

Date: 2026-06-04

## Goal

Validate the range slider style pass in a real WordPress + Elementor frontend
page, not only through PHP/JS/static checks.

## Fixture

- Temporary Elementor page: `339`
- URL used during QA: `http://localhost:8080/?page_id=339`
- Cleanup: deleted with `./scripts/wp.sh post delete 339 --force`
- Fixture widgets:
  - `eit-filter-controller` range, horizontal orientation, dashed track
  - `eit-filter-controller` range, vertical orientation, segmented track
  - HTML listing target with `.eit-range-qa-listing` and `.eit-range-qa-item`

The fixture was created only in the local database so it would not become a
repository artifact.

## Browser Evidence

Chrome headless screenshots:

- Desktop: `/tmp/eit-range-desktop.png`
- Mobile: `/tmp/eit-range-mobile.png`

Commands:

```bash
/usr/bin/google-chrome --headless=new --disable-gpu --no-sandbox --window-size=1440,1100 --virtual-time-budget=3000 --screenshot=/tmp/eit-range-desktop.png "http://localhost:8080/?page_id=339&cachebust=082b"
/usr/bin/google-chrome --headless=new --disable-gpu --no-sandbox --window-size=390,1000 --virtual-time-budget=3000 --screenshot=/tmp/eit-range-mobile.png "http://localhost:8080/?page_id=339&cachebust=082b"
```

## Findings

- The horizontal dashed range rendered correctly in desktop and mobile.
- The first vertical pass was not good enough: labels and ticks still behaved
  like a horizontal scale.
- The second vertical pass fixed the slider axis but still left ticks in a
  horizontal grid and clipped mobile number inputs.
- Final CSS fix makes vertical labels/ticks follow the vertical axis and keeps
  the numeric inputs wide enough on mobile.

## Code Adjustments

Touched file:

- `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css`

Adjustment:

- Gave `.eit-range--vertical` explicit grid areas for values, labels, sliders,
  and ticks.
- Inverted vertical labels/ticks so max is visually at the top and min at the
  bottom.
- Forced vertical ticks to `display: flex` when ticks are enabled.
- Added a minimum width for vertical numeric inputs to avoid clipped values on
  narrow screens.

## Verification

Passed:

- `curl -s -o /tmp/eit-range-qa.html -w "%{http_code} %{size_download}\n" "http://localhost:8080/?page_id=339"` returned `200 38087`
- Browser screenshots generated for desktop and mobile
- Visual inspection of both screenshots
- `composer validate --strict`
- `find . -path ./vendor -prune -o -name "*.php" -exec php -l {} +`
- `node --check assets/js/eit-frontend.js`
- `node --check assets/js/eit-editor.js`
- `git diff --check` in the root repo
- `git diff --check` in the plugin repo

## Remaining Gap

This verifies frontend rendering, not the Elementor editor panel interaction.
The next editor-specific pass should open the widget inside Elementor and test
the cadenced controls after switching filter types in the repeater.
