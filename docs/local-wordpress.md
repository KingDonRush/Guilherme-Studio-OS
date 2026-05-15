# Local WordPress Setup

## Requirements

- Docker;
- Docker Compose;
- git;
- Node/npm for MCP tooling.

## Setup

1. Copy the local environment file:

```bash
cd wordpress
cp .env.example .env
```

2. Start and install WordPress:

```bash
scripts/setup-wordpress.sh
```

3. Open the local site:

```text
http://localhost:8080
```

## What The Script Does

- starts MySQL and WordPress;
- waits for WordPress to respond;
- installs WordPress if it is not already installed;
- installs and activates Elementor from the WordPress.org plugin directory;
- activates local portfolio plugins when their folders are present.

## Useful Commands

```bash
docker compose ps
scripts/wp.sh plugin list
scripts/wp.sh theme list
scripts/wp.sh elementor system-info
```

## Notes

WordPress core files are generated into `wordpress/` and ignored by git.
Plugin source should live in `wordpress/wp-content/plugins/`.

## Elementor CSS And Local Permissions

Elementor writes generated page CSS into:

```text
wordpress/wp-content/uploads/elementor/css/
```

In Docker, WordPress runs as `www-data`. If `uploads/` is owned only by the host
user, Elementor can enqueue URLs such as `post-7.css` without being able to
create the files. The browser then receives redirects or HTML instead of CSS,
which makes pages look unstyled.

`scripts/setup-wordpress.sh` fixes this by creating the upload/cache folders,
assigning them to `www-data`, flushing Elementor CSS, and letting the next page
load regenerate the CSS files.

If the page looks unstyled again, run:

```bash
cd wordpress
docker compose exec -T -u root wordpress \
  chown -R www-data:www-data /var/www/html/wp-content/uploads /var/www/html/wp-content/upgrade
scripts/wp.sh elementor flush_css
```

Then reload `http://localhost:8080`.
