# Commit Message Policy

## Rule

All new commits created for this workspace must carry the same intent in three
languages:

- Portuguese;
- Spanish;
- English.

GitHub does not provide automatic multilingual commit-message fields. The
adaptation is to write the message directly in the commit.

## Format

Use a trilingual subject:

```text
type: mensagem em portugues / mensaje en espanol / message in English
```

Then add a body with one line per language:

```text
PT: Mensagem em portugues.
ES: Mensaje en espanol.
EN: Message in English.
```

## Example

```text
docs: atualiza guia de setup / actualiza guia de setup / update setup guide

PT: Atualiza o guia de setup local do WordPress.
ES: Actualiza la guia de setup local de WordPress.
EN: Updates the local WordPress setup guide.
```

## Scope

This applies to:

- root repository commits;
- plugin repository commits;
- theme repository commits;
- future portfolio repository commits.

Do not rewrite old public upstream history only to translate commit messages.
For unpublished local commits, amend or rebase them into this format.

