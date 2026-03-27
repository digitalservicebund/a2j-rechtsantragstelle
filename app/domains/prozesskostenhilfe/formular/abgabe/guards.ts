import type { GenericGuard } from "~/domains/guards.server";
import type { ProzesskostenhilfeFormularUserData } from "../userData";

export const readyForAbgabe: GenericGuard<
  ProzesskostenhilfeFormularUserData
> = ({ context }) =>
  !!context.pageData?.subflowDoneStates &&
  Object.entries(context.pageData.subflowDoneStates)
    .filter(([stepId]) => !stepId.startsWith("/abgabe"))
    .every(([, subflowDone]) => Boolean(subflowDone));
