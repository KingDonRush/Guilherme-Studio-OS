# Mina Forma WordPress Production Assets

This folder is the source-of-truth production WebP set for the Mina Forma demo.

Runtime mirror:

```text
wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/
```

Use the runtime mirror during WordPress implementation, but treat this pack
folder as the organized asset reference.

Checksum manifest:

```text
../manifests/wordpress-webp-sha256.txt
```

Rules:

- only optimized WebP or legitimate SVG belongs here;
- raw PNG/imagegen sources belong in `../sources/`;
- full-page mockups belong in `../mockups/`;
- update the checksum manifest after adding or replacing production assets.
