import { redirect } from "@remix-run/node";
// Permanent redirect after slug change, since the original URL is highly ranked
export const loader = () => redirect("/prozesskostenhilfe", 301);
