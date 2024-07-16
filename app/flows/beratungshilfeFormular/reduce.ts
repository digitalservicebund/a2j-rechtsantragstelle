import type { BeratungshilfeFormularContext } from ".";
import { geldanlageSchema } from "./finanzielleAngaben/models/geldanlage";

export function reduce(userdata: BeratungshilfeFormularContext) {
  const relevantUserdata = { ...userdata };

  relevantUserdata.geldanlagen = [];

  if (userdata.hasGeldanlage && userdata.geldanlagen) {
    userdata.geldanlagen.forEach((entry) => {
      const entryParsed = geldanlageSchema.safeParse(entry);
      if (entryParsed.success) {
        relevantUserdata.geldanlagen?.push(entryParsed.data);
      }
    });
  }

  return relevantUserdata;
}
