import { type GenericGuard, hasOptionalString } from "~/domains/guards.server";
import { type ProzesskostenhilfeWeitereAngabenUserData } from "./userData";

export const weitereAngabenDone: GenericGuard<
  ProzesskostenhilfeWeitereAngabenUserData
> = ({ context }) => hasOptionalString(context.weitereAngaben);
