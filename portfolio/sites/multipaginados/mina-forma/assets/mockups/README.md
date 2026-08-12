# Mina Forma Mockup Workspaces

New mockup work is organized by route under `routes/`.

```text
routes/<route>/
├── manifest.yaml
├── 00-contract/
├── 01-runs/
├── 02-approved/
└── 03-handoff/
```

Use `_templates/` to start a route workspace. Do not add new numbered
experiments directly to this directory.

Legacy route mockups remain at the root until their route receives an explicit
migration. The Services listing history has already moved to
`routes/services-listing/`. Its root `mina-forma-services-listing-mockup-final.png`
is a compatibility alias and remains byte-identical to the approved file.

Status belongs in the route manifest, not only in the filename.
