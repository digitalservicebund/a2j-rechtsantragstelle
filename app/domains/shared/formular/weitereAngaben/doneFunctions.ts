import { type GenericGuard, hasOptionalString } from "~/domains/guards.server";
import { type WeitereAngabenUserData } from "~/domains/shared/formular/weitereAngaben/userData";

export const weitereAngabenDone: GenericGuard<WeitereAngabenUserData> = ({
  context,
}) => hasOptionalString(context.weitereAngaben);
