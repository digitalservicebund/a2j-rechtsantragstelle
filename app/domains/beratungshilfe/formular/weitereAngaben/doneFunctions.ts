import { type GenericGuard, hasOptionalString } from "~/domains/guards.server";
import { type BeratungshilfeWeitereAngabenUserData } from "./userData";

export const weitereAngabenDone: GenericGuard<
  BeratungshilfeWeitereAngabenUserData
> = ({ context }) => hasOptionalString(context.weitereAngaben);
