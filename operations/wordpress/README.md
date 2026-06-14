# WordPress Runtime Mounts

The portfolio WordPress runtime is frozen during Studio OS V1. Product
repositories live outside `wordpress/` under `products/<slug>/repository`.

Use both Compose files when the runtime must see the product plugins:

```bash
docker compose \
  -f wordpress/docker-compose.yml \
  -f operations/wordpress/docker-compose.products.yml \
  up -d
```

The override mounts product repositories back into the expected WordPress plugin
paths without copying plugin source into the WordPress runtime.
