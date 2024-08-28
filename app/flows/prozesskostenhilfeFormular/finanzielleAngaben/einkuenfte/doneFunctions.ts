import type { ProzesskostenhilfeFinanzielleAngabenGuard } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/doneFunctions";
import {
  hasStaatlicheLeistungen,
  notEmployed,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";

export const einkuenfteDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) => hasStaatlicheLeistungen({ context }) || !notEmployed({ context }); /* ||
    arrayIsNonEmpty(context.arbeitsausgaben) ||
    arrayIsNonEmpty(context.weitereEinkuenfte); */
