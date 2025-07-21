import { isFinanciallyEligibleForBerH } from "~/domains/beratungshilfe/formular/abgabe/isFinanciallyEligibleForBerH";
import { getRechtsproblemStrings } from "~/domains/beratungshilfe/formular/rechtsproblem/stringReplacements";
import type { Flow } from "~/domains/flows.server";
import { type AbgabeUserData } from "~/domains/shared/formular/abgabe/userData";
import { type WeitereAngabenUserData } from "~/domains/shared/formular/weitereAngaben/userData";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { type DokumenteUserData } from "./abgabe/dokumente/userData";
import { type BeratungshilfeAnwaltlicheVertretungUserData } from "./anwaltlicheVertretung/userData";
import { type BeratungshilfeFinanzielleAngabenUserData } from "./finanzielleAngaben/userData";
import { type BeratungshilfeGrundvoraussetzungenUserData } from "./grundvoraussetzung/userData";
import { type BeratungshilfePersoenlicheDatenUserData } from "./persoenlicheDaten/userData";
import { type BeratungshilfeRechtsproblemUserData } from "./rechtsproblem/userData";
import {
  getAmtsgerichtStrings,
  getStaatlicheLeistungenStrings,
  getAnwaltStrings,
  getMissingInformationStrings,
  ausgabenStrings,
  weiteresEinkommenStrings,
  eigentumZusammenfassungShowTotalWorthWarnings,
  getWeitereDokumenteStrings,
} from "./stringReplacements";
import { beratungshilfeXstateConfig } from "./xstateConfig";
import {
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../../shared/formular/stringReplacements";

export const beratungshilfeFormularUserData = {
  flowType: "formFlow",
  config: beratungshilfeXstateConfig,
  guards: {},
  stringReplacements: (context: BeratungshilfeFormularUserData) => ({
    ...getAmtsgerichtStrings(context),
    ...getStaatlicheLeistungenStrings(context),
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...getAnwaltStrings(context),
    ...getRechtsproblemStrings(context),
    ...eigentumZusammenfassungShowPartnerschaftWarnings(context),
    ...eigentumZusammenfassungShowTotalWorthWarnings(context),
    ...getMissingInformationStrings(context),
    ...ausgabenStrings(context),
    ...geldAnlagenStrings(context),
    ...weiteresEinkommenStrings(context),
    ...getWeitereDokumenteStrings(context),
  }),
  asyncFlowActions: {
    "/abgabe/art": (request, userData) =>
      Promise.resolve(
        sendCustomAnalyticsEvent({
          request,
          eventName: "financial eligibility calculated",
          properties: {
            isEligible: isFinanciallyEligibleForBerH({ context: userData }),
          },
        }),
      ),
  },
} satisfies Flow;

export type BeratungshilfeFormularUserData =
  BeratungshilfeGrundvoraussetzungenUserData &
    BeratungshilfeAnwaltlicheVertretungUserData &
    BeratungshilfeRechtsproblemUserData &
    BeratungshilfeFinanzielleAngabenUserData &
    BeratungshilfePersoenlicheDatenUserData &
    WeitereAngabenUserData &
    AbgabeUserData &
    DokumenteUserData;
