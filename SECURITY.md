# Security Policy

## Public Repository Boundary

Everything committed to this repository must be safe for public disclosure.
Never commit credentials, API tokens, OAuth secrets, passwords, private keys,
session cookies, recovery codes, real client records, contracts, invoices,
private communications, or confidential application and prospect data.

Use `.env.example` files only for placeholder names and non-secret local
defaults. Real values belong in ignored local configuration or a protected
secret store.

## Reporting a Vulnerability or Exposed Secret

Do not open a public issue containing a vulnerability detail or secret. Use
GitHub private vulnerability reporting when it is available for this
repository. If a credential may have been exposed, revoke or rotate it first;
deleting it from the latest commit is not sufficient because Git retains
history.
