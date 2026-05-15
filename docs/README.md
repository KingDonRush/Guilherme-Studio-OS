# WordPress Portfolio Workspace

This workspace exists to build a professional WordPress developer portfolio for
international opportunities.

The root is intentionally small:
- `AGENTS.md`;
- `.ai/`;
- `docs/`;
- `wordpress/`.

The work is organized into:
- a local WordPress lab in `wordpress/`;
- plugin repositories in `wordpress/wp-content/plugins/`;
- strategy and setup documentation in `docs/`;
- AI operating memory and MCP tooling in `.ai/`.

Key planning docs:
- `portfolio-strategy.md`: positioning and hiring strategy.
- `portfolio-systems-concept.md`: concept map for the portfolio pages/systems.
- `plugin-map.md`: plugin repositories and local paths.
- `roadmap.md`: phased execution plan.

Start with:

```bash
cd wordpress
cp .env.example .env
scripts/setup-wordpress.sh
```

Then open:

```text
http://localhost:8080
```

Default local credentials are defined in `.env.example`.
