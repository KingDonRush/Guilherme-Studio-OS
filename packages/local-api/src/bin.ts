#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { serveLocalApi } from "./index.js";

const panelDist = fileURLToPath(new URL("../../../apps/panel/dist", import.meta.url));
const { token, url } = await serveLocalApi({ panelDist });

console.log(JSON.stringify({ url, token }, null, 2));
