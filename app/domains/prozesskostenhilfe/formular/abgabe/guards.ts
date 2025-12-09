import { type GenericGuard } from "~/domains/guards.server";
import { prozesskostenhilfeFormular } from "~/domains/prozesskostenhilfe/formular";
import { isNachueberpruefung } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/guards";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { buildFlowController } from "~/services/flow/server/buildFlowController";

export const readyForAbgabe: GenericGuard<
  ProzesskostenhilfeFormularUserData
> = ({ context }) => {
  // Need to strip off 'abgabe' lest we infinitely recurse
  const stepStates = buildFlowController({
    config: {
      ...prozesskostenhilfeFormular.config,
      states: {
        ...prozesskostenhilfeFormular.config.states,
        abgabe: {
          id: "abgabe",
        },
      },
    },
    data: context,
  }).stepStates();
  return stepStates
    .filter((stepState) => stepState.isReachable)
    .every((stepState) => stepState.isDone);
};

export const fileUploadRelevant: GenericGuard<
  ProzesskostenhilfeFormularUserData
> = ({ context }) =>
  isNachueberpruefung({ context }) && context.versandArt === "digital";
