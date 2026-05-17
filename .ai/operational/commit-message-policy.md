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
vX.Y.Z - Practical Outcome / Resultado Pratico / Resultado Practico
```

Use this shape for major architectural releases:

```text
vX.Y.Z - Product Milestone (Technical Anchor) / Marco do Produto (Ancora Tecnica) / Hito del Producto (Ancla Tecnica)
```

Examples:

```text
v1.0.1 - Translation Updates & CPT Slug Button - Atualizacoes de Traducao e Correcao do Botao de Slugs dos CPTs
v2.0.0 - Modular Refactor (PSR-4 Architecture) / Refatoracao Modular (Arquitetura PSR-4)
v3.1.1 - Safer Cart Rendering / Renderizacao Mais Segura / Renderizacion Mas Segura
```

Do not use release titles that only say:

```text
release: publica v3.1.0
fix: rendering and ajax
chore: update files
```

## Release Body Format

Use trilingual release notes by default: English, Portuguese, and Spanish.

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

### Espanol
Un parrafo corto explicando el valor practico de la version.

- Bullet con impacto para usuario o implementador.
- Bullet con otro cambio practico.
- Bullet con detalle tecnico cuando ayuda a aclarar el cambio.

Capa tecnica: lista corta de sistemas, APIs, archivos o comportamientos afectados.

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

#### English
This patch improves <practical area> by <plain-language result>.

- Improved: what got better and why it matters.
- Fixed: what no longer breaks or confuses the workflow.
- Technical: exact systems touched, in one concise bullet.
- Verified: evidence command or QA path.

#### Portugues
Este patch melhora <area pratica> ao <resultado em linguagem simples>.

- Melhorado: o que ficou melhor e por que importa.
- Corrigido: o que nao quebra ou confunde mais o fluxo.
- Tecnico: sistemas exatos tocados, em um bullet conciso.
- Verificado: comando de evidencia ou caminho de QA.

#### Espanol
Este patch mejora <area practica> al <resultado en lenguaje simple>.

- Mejorado: que quedo mejor y por que importa.
- Corregido: que ya no rompe o confunde el flujo.
- Tecnico: sistemas exactos tocados, en un bullet conciso.
- Verificado: comando de evidencia o camino de QA.
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
ES: Una frase corta explicando el impacto para el producto o para el desarrollador.

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
ES: Alinea futuros commits y releases con el estilo mas fuerte de las primeras notas del SBP.
```

## Language Policy

Public releases, patch notes, and commit bodies default to English, Portuguese,
and Spanish.

The early Simple Budget Plugin pattern remains the voice reference: practical,
dynamic, and technical without becoming cold. The workspace language policy stays
trilingual so portfolio material can serve English-first review while preserving
Portuguese authorship and Spanish accessibility.

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
