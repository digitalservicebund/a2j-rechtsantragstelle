/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const { createRequestHandler } = require("@remix-run/express");
const path = require("path");
/* eslint-enable @typescript-eslint/no-var-requires */

const BUILD_DIR = path.join(process.cwd(), "build");
const app = express();

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" }),
);
// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

const port = process.env.PORT || 3000;

app.all(
  "*",
  createRequestHandler({
    build: require(BUILD_DIR),
  }),
);

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
