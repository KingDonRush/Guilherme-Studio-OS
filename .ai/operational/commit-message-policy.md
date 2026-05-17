# Git Message, Release, And Patch Notes Policy

## Source Of Truth

The preferred style comes from the early Simple Budget Plugin releases,
especially:

- `v1.0.0 - Simple Budget Plugin (SBP) - WordPress + Elementor`
- `v1.0.1 - Translation Updates & CPT Slug Button - Atualizacoes de Traducao e
  Correcao do Botao de Slugs dos CPTs`
- `v2.0.0 - Modular Refactor (PSR-4 Architecture) / Refatoracao Modular
  (Arquitetura PSR-4)`

Those releases worked because they were not just technical logs. They explained
what changed, why it mattered, and which technical layer was affected.

Use that as the public portfolio standard.

## Voice

Commits, releases, and patch notes must not read like cold internal bookkeeping.

They should be:

- clear enough for a developer to trust;
- simple enough for a non-specialist reviewer to understand;
- specific enough to prove real engineering work;
- warm enough to feel like a product update;
- technical only where the detail helps explain the value or risk.

Avoid generic logs like:

```text
PT-BR
- Refatora renderizacao.
- Ajusta AJAX.
```

Prefer impact-first notes:

```text
### English
This update makes the cart rendering more reliable and easier to validate across
Elementor layouts.

- Keeps the visible cart closer to the editor preview.
- Hardens AJAX handling so quote actions fail more predictably.
- Adds reproducible verification through `scripts/verify.sh`.

Technical layer: rendering, AJAX, Elementor preview consistency, CI smoke checks.
```

## Release Titles

Release titles matter. They must describe the practical milestone, not only the
technical commit type.

Use this shape for normal releases:

```text
vX.Y.Z - Practical Outcome - Resultado Pratico
```

Use this shape for major architectural releases:

```text
vX.Y.Z - Product Milestone (Technical Anchor) / Marco do Produto (Ancora Tecnica)
```

Examples:

```text
v1.0.1 - Translation Updates & CPT Slug Button - Atualizacoes de Traducao e Correcao do Botao de Slugs dos CPTs
v2.0.0 - Modular Refactor (PSR-4 Architecture) / Refatoracao Modular (Arquitetura PSR-4)
v3.1.1 - Safer Cart Rendering & Reproducible Checks - Renderizacao Mais Segura e Validacao Reproduzivel
```

Do not use release titles that only say:

```text
release: publica v3.1.0
fix: rendering and ajax
chore: update files
```

## Release Body Format

Use bilingual release notes by default: English and Portuguese.

The standard structure is:

```markdown
## <icon> <Project Name> - Release vX.Y.Z

### English
One short paragraph explaining the practical value of the release.

- Bullet with user-facing or implementer-facing impact.
- Bullet with another practical change.
- Bullet with technical detail only when it clarifies the change.

Technical layer: concise list of affected systems, APIs, files, or behaviors.

---

### Portugues
Um paragrafo curto explicando o valor pratico da versao.

- Bullet com impacto para usuario ou implementador.
- Bullet com outra mudanca pratica.
- Bullet com detalhe tecnico quando ele esclarece a mudanca.

Camada tecnica: lista curta de sistemas, APIs, arquivos ou comportamentos afetados.

---

### Verification
- `command used`
- Browser, WP-CLI, PHPUnit, Playwright, or manual QA evidence.

**Full Changelog**: compare-url
```

Use icons sparingly. They can give the release a recognizable product voice, but
they must not replace substance.

Suggested icons:

- `🚀` first stable release or major product milestone;
- `🧾` quote/budget/product-flow release;
- `🧩` integration or Elementor capability release;
- `🛡️` security or hardening release;
- `🧰` tooling, verification, or developer-experience release.

## Patch Notes Format

Patch notes should be more dynamic than raw commits, but shorter than full
releases.

Use:

```markdown
### vX.Y.Z - Short Outcome

This patch improves <practical area> by <plain-language result>.

- Improved: what got better and why it matters.
- Fixed: what no longer breaks or confuses the workflow.
- Technical: exact systems touched, in one concise bullet.
- Verified: evidence command or QA path.
```

Patch notes must answer:

1. What changed?
2. Why should anyone care?
3. What technical layer was touched?
4. How was it verified?

## Commit Message Format

Use commits for engineering traceability, not full marketing copy.

Default shape:

```text
type(scope): practical outcome / resultado pratico

EN-US: One short sentence explaining the product or developer impact.
PT-BR: Uma frase curta explicando o impacto para o produto ou para o desenvolvedor.

Technical:
- Specific subsystem, behavior, file family, or API touched.

Verification:
- `command` or "Not run: reason".
```

The subject can keep conventional commit types, but the text after the colon
should describe the outcome instead of only naming the mechanical edit.

Good:

```text
fix(cart): keep modal width stable on responsive layouts / estabiliza largura do modal responsivo
```

Weak:

```text
fix: update css
```

For tiny documentation-only commits, the body may be shorter:

```text
docs: record release note policy / registra politica de notas de versao

EN-US: Aligns future commits and releases with the stronger early SBP patch-note style.
PT-BR: Alinha commits e releases futuros ao estilo mais forte das primeiras notas do SBP.
```

## Language Policy

Public releases and patch notes default to English + Portuguese because that is
the stronger Simple Budget Plugin pattern.

Spanish is optional, not mandatory, unless the specific project or user request
asks for trilingual communication.

If a repository already has a stricter language policy for a branch or release,
follow the stricter local rule and keep the same impact-first voice.

## Scope

This policy applies to:

- root repository commits;
- plugin repository commits;
- theme repository commits;
- GitHub release titles and bodies;
- changelog entries;
- patch notes;
- future portfolio repositories.

Do not rewrite old public upstream history only to change style. For unpublished
local commits, amend or squash them into this format when practical.
