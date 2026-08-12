# Services Listing Elementor Handoff

## Approved reference

- Mockup: `../02-approved/services-listing__desktop__approved.png`
- SHA-256: `bcad265a8f8a03add9835fb32efda06228d7af7ec969d7a9652df5ac1ca45316`

## Service rows

Use one reusable Grid Container per service.

Suggested desktop columns:

```text
number  | title and description | still-life image | action
13%     | 31%                   | 35%              | 21%
```

- Keep rows within one shared fixed-height token.
- Use `align-items: center`.
- Give the Image widget explicit dimensions and `object-fit: contain`.
- Set a media max-height so the image never increases the row.
- Use borders for row separators and the number divider.
- Keep orange numbers editable.
- Keep title, description and actions editable.
- Preserve only natural photographic contact shadows.
- Do not add overlay blue, card frames, rounded corners or solid shadows.

## Responsive intent

- Tablet: two bands, preserving number/title and image/action relationships.
- Mobile: natural stack with automatic height allowed.
- Do not use absolute positioning as the structural layout mechanism.
