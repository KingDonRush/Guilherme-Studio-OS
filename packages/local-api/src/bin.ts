#!/usr/bin/env node
import { serveLocalApi } from "./index.js";

const panelDist = new URL("../../../apps/panel/dist", import.meta.url).pathname;
const { token, url } = await serveLocalApi({ panelDist });

console.log(JSON.stringify({ url, token }, null, 2));
