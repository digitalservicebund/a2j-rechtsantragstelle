import { redirect } from "react-router";
// Permanent redirect after slug change, since the original URL is highly ranked
export const loader = () => redirect("/prozesskostenhilfe", 301);
