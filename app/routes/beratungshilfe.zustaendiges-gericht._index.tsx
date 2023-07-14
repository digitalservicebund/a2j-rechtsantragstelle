import { redirect } from "@remix-run/node";

export const loader = () =>
  redirect("/beratungshilfe/zustaendiges-gericht/suche");
