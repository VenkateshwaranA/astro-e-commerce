import express from "express";
import { handler as ssrHandler } from "./dist/server/entry.mjs";

const app = express();
// Change this based on your astro.config.mjs, `base` option.
// They should match. The default value is "/".
console.log("Entry server");
const base = "/";
app.use(base, express.static("dist/client/"));
app.use(ssrHandler);

app.listen(3001);
