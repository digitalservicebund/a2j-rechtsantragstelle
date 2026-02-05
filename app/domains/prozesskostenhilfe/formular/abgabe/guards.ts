import type { GenericGuard } from "~/domains/guards.server";
import type { ProzesskostenhilfeFormularUserData } from "../userData";
import { isNachueberpruefung } from "../grundvoraussetzungen/guards";

export const fileUploadRelevant: GenericGuard<
  ProzesskostenhilfeFormularUserData
> = ({ context }) =>
  isNachueberpruefung({ context }) && context.versandArt === "digital";

export const readyForAbgabe: GenericGuard<
  ProzesskostenhilfeFormularUserData
> = ({ context }) =>
  !!context.pageData?.subflowDoneStates &&
  Object.values(context.pageData.subflowDoneStates).every(Boolean);
