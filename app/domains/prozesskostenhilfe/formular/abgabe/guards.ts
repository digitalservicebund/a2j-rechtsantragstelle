import { type GenericGuard } from "~/domains/guards.server";
import { prozesskostenhilfeFormular } from "~/domains/prozesskostenhilfe/formular";
import { isNachueberpruefung } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/guards";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { allValidatedStatesDone } from "~/services/flow/reduceExcludedStatesToId";

export const readyForAbgabe: GenericGuard<
  ProzesskostenhilfeFormularUserData
> = ({ context }) => {
  return allValidatedStatesDone(prozesskostenhilfeFormular.config, context);
};

export const fileUploadRelevant: GenericGuard<
  ProzesskostenhilfeFormularUserData
> = ({ context }) =>
  isNachueberpruefung({ context }) && context.versandArt === "digital";
