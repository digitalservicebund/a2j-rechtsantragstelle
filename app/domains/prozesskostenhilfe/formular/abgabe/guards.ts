import { type GenericGuard } from "~/domains/guards.server";
import { prozesskostenhilfeFinanzielleAngabeDone } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/doneFunctions";
import { prozesskostenhilfeGesetzlicheVertretungDone } from "~/domains/prozesskostenhilfe/formular/gesetzlicheVertretung/doneFunctions";
import { isNachueberpruefung } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/guards";
import { prozesskostenhilfePersoenlicheDatenDone } from "~/domains/prozesskostenhilfe/formular/persoenlicheDaten/doneFunctions";
import { rechtsschutzversicherungDone } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/doneFunctions";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

export const readyForAbgabe: GenericGuard<
  ProzesskostenhilfeFormularUserData
> = ({ context }) =>
  prozesskostenhilfeFinanzielleAngabeDone({ context }) &&
  prozesskostenhilfeGesetzlicheVertretungDone({ context }) &&
  (rechtsschutzversicherungDone({ context }) ||
    context.formularArt === "nachueberpruefung") &&
  prozesskostenhilfePersoenlicheDatenDone({
    context,
  });

export const fileUploadRelevant: GenericGuard<
  ProzesskostenhilfeFormularUserData
> = ({ context }) =>
  isNachueberpruefung({ context }) && context.versandArt === "digital";
