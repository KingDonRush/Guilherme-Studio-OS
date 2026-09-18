# WordPress runtime inspection

`studio-wordpress-runtime.gif` records the Studio CLI against the existing local
WordPress installation. It shows HTTP health, running Compose services, and active
plugin names/versions. It does not depict client onboarding or site provisioning.

The adjacent `.cast` file is the original terminal recording. The GIF trims command
latency and preserves reading time. `jq` selects the fields shown in the commands;
no application responses were replaced. The `studio` shell function invokes the
built CLI entrypoint.

Captured on 2026-09-18. No Studio application code or canonical records were
changed for this recording.
