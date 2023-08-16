// from https://github.com/remix-run/remix/issues/5162#issuecomment-1400748264

import crypto from "node:crypto";
export const generateNonce = () => crypto.randomBytes(16).toString("hex");
