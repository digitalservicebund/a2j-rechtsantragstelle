import _ from "lodash";
import { and } from "xstate";
import type { Flow } from "~/flows/flows.server";
import { getAbgabeStrings } from "~/flows/prozesskostenhilfeFormular/abgabe/stringReplacements";
import {
  couldLiveFromUnterhalt,
  unterhaltLeisteIch,
  type ProzesskostenhilfeAntragstellendePersonContext,
} from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/context";
import { getAntragstellendePersonStrings } from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/stringReplacements";
import { getProzesskostenhilfeAntragstellendePersonConfig } from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/xStateConfig";
import { finanzielleAngabenArrayConfig as pkhFormularFinanzielleAngabenArrayConfig } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/arrayConfiguration";
import { eigentumDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/eigentumDone";
import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import {
  finanzielleAngabeEinkuenfteGuards,
  partnerEinkuenfteGuards,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import { getProzesskostenhilfeEinkuenfteSubflow } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/xStateConfig";
import {
  nachueberpruefung,
  versandDigitalAnwalt,
  versandDigitalGericht,
  type ProzesskostenhilfeGrundvoraussetzungenContext,
} from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";
import { grundvoraussetzungenXstateConfig } from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/xStateConfig";
import { prozesskostenhilfePersoenlicheDatenDone } from "~/flows/prozesskostenhilfeFormular/persoenlicheDaten/doneFunctions";
import { rechtsschutzversicherungDone } from "~/flows/prozesskostenhilfeFormular/rechtsschutzversicherung/doneFunctions";
import { getProzesskostenhilfeRsvXstateConfig } from "~/flows/prozesskostenhilfeFormular/rechtsschutzversicherung/xstateConfig";
import { getFinanzielleAngabenPartnerSubflow } from "~/flows/shared/finanzielleAngaben/partner";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import {
  andereUnterhaltszahlungenDone,
  ausgabenDone,
  ausgabenZusammenfassungDone,
  eigentumZusammenfassungDone,
  kinderDone,
  partnerDone,
  prozesskostenhilfeFinanzielleAngabeDone,
} from "./finanzielleAngaben/doneFunctions";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import prozesskostenhilfeFormularFlow from "./flow.json";
import type { ProzesskostenhilfeGesetzlicheVertretung } from "./gesetzlicheVertretung/context";
import { hasGesetzlicheVertretungYes } from "./gesetzlicheVertretung/guards";
import { gesetzlicheVertretungXstateConfig } from "./gesetzlicheVertretung/xStateConfig";
import type { ProzesskostenhilfePersoenlicheDaten } from "./persoenlicheDaten/context";
import { getMissingInformationStrings } from "./stringReplacements";
import { finanzielleAngabenArrayConfig } from "../shared/finanzielleAngaben/arrayConfiguration";
import {
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../shared/stringReplacements";
import { getProzesskostenhilfePersoenlicheDatenXstateConfig } from "./persoenlicheDaten/xstateConfig";
import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "./rechtsschutzversicherung/context";

export const prozesskostenhilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(prozesskostenhilfeFormularFlow, {
    meta: {
      arrays: {
        ...finanzielleAngabenArrayConfig(
          "/prozesskostenhilfe/formular/finanzielle-angaben",
        ),
        ...pkhFormularFinanzielleAngabenArrayConfig(
          "/prozesskostenhilfe/formular/finanzielle-angaben",
        ),
      },
    },
    states: {
      start: { meta: { done: () => true } },
      grundvoraussetzungen: grundvoraussetzungenXstateConfig,
      "antragstellende-person":
        getProzesskostenhilfeAntragstellendePersonConfig({
          backToCallingFlow: [
            {
              guard: ({ context }) =>
                versandDigitalAnwalt({ context }) ||
                versandDigitalGericht({ context }),
              target:
                "#grundvorsaussetzungen.einreichung.hinweis-digital-einreichung",
            },
            "#grundvorsaussetzungen.einreichung.hinweis-papier-einreichung",
          ],
          nextFlowEntrypoint: [
            {
              guard: ({ context }) => nachueberpruefung({ context }),
              target: "#finanzielle-angaben",
            },
            "#rechtsschutzversicherung",
          ],
        }),
      rechtsschutzversicherung: getProzesskostenhilfeRsvXstateConfig({
        backToCallingFlow: [
          {
            guard: unterhaltLeisteIch,
            target: "#antragstellende-person.zwei-formulare",
          },
          {
            guard: ({ context }) => context.unterhaltsanspruch === "keine",
            target: "#antragstellende-person.unterhaltsanspruch",
          },
          {
            guard: and([
              ({ context }) => context.unterhaltsanspruch === "unterhalt",
              ({ context }) => context.livesPrimarilyFromUnterhalt === "no",
            ]),
            target: "#antragstellende-person.unterhalt-hauptsaechliches-leben",
          },
          {
            guard: and([
              ({ context }) => context.unterhaltsanspruch === "unterhalt",
              ({ context }) => context.livesPrimarilyFromUnterhalt === "yes",
            ]),
            target: "#antragstellende-person.eigenes-exemplar",
          },
          {
            guard: couldLiveFromUnterhalt,
            target: "#antragstellende-person.warum-keiner-unterhalt",
          },
          "#antragstellende-person.unterhalt-leben-frage",
        ],
        nextFlowEntrypoint: "#finanzielle-angaben",
      }),
      "finanzielle-angaben": _.merge(finanzielleAngabenFlow, {
        states: {
          einkuenfte: getProzesskostenhilfeEinkuenfteSubflow(einkuenfteDone),
          partner: _.merge(
            getFinanzielleAngabenPartnerSubflow(partnerDone, {
              backStep: "", // blank as we're overriding later
              playsNoRoleTarget: "#partner-einkuenfte",
              partnerNameTarget: "#partner-einkuenfte",
              partnerIncomeTarget: "#partner-einkuenfte",
              nextStep: "#kinder",
            }),
            // Need to override the default back step, as there's no way to interpolate a series of guards
            {
              states: {
                partnerschaft: {
                  on: {
                    BACK: [
                      {
                        guard: "hasFurtherIncome",
                        target: "#einkuenfte.weitere-einkuenfte.uebersicht",
                      },
                      "#einkuenfte.weitere-einkuenfte.frage",
                    ],
                  },
                },
                "partner-einkuenfte": _.merge(
                  getProzesskostenhilfeEinkuenfteSubflow(
                    einkuenfteDone,
                    "partner",
                  ),
                  {
                    states: {
                      "partner-besonders-ausgaben": {
                        on: {
                          BACK: [
                            {
                              guard: partnerEinkuenfteGuards.hasFurtherIncome,
                              target:
                                "#partner-weitere-einkuenfte.partner-uebersicht",
                            },
                            "#partner-weitere-einkuenfte",
                          ],
                          SUBMIT: [
                            {
                              guard: "partnerHasBesondersAusgabenYes",
                              target: "add-partner-besonders-ausgaben",
                            },
                            "#kinder",
                          ],
                        },
                      },
                      "add-partner-besonders-ausgaben": {
                        on: {
                          SUBMIT: "#kinder",
                          BACK: "partner-besonders-ausgaben",
                        },
                      },
                    },
                  },
                ),
              },
            },
          ),
          kinder: {
            meta: { done: kinderDone },
            states: {
              "kinder-frage": {
                on: {
                  BACK: [
                    {
                      guard: "hasPartnerschaftNo",
                      target: "#partner",
                    },
                    {
                      guard: "partnerEinkommenNo",
                      target: "#partner.partner-einkommen",
                    },
                    {
                      guard:
                        partnerEinkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen,
                      target:
                        "#partner-einkuenfte.partner-staatliche-leistungen",
                    },
                    {
                      guard: "partnerHasBesondersAusgabenYes",
                      target:
                        "#partner-einkuenfte.add-partner-besonders-ausgaben",
                    },
                    "#partner-einkuenfte.partner-besonders-ausgaben",
                  ],
                },
              },
            },
          },
          "andere-unterhaltszahlungen": {
            meta: { done: andereUnterhaltszahlungenDone },
          },
          eigentum: { meta: { done: eigentumDone } },
          "eigentum-zusammenfassung": {
            meta: { done: eigentumZusammenfassungDone },
          },
          ausgaben: { meta: { done: ausgabenDone } },
          "ausgaben-zusammenfassung": {
            meta: { done: ausgabenZusammenfassungDone },
          },
        },
      }),
      "gesetzliche-vertretung": gesetzlicheVertretungXstateConfig({
        backToCallingFlow: [
          {
            guard: finanzielleAngabeGuards.hasAusgabenEntriesYes,
            target: "#ausgaben-zusammenfassung",
          },
          {
            guard:
              finanzielleAngabeEinkuenfteGuards.staatlicheLeistungenIsBuergergeldAndEigentumDone,
            target:
              "#finanzielle-angaben.eigentum-zusammenfassung.zusammenfassung",
          },
          {
            guard:
              finanzielleAngabeEinkuenfteGuards.staatlicheLeistungenIsBuergergeld,
            target: "#finanzielle-angaben.eigentum.kraftfahrzeuge-frage",
          },
          {
            guard:
              finanzielleAngabeEinkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen,
            target: "#finanzielle-angaben.einkuenfte.staatliche-leistungen",
          },
          "#ausgaben.ausgaben-frage",
        ],
        nextFlowEntrypoint: "#persoenliche-daten",
      }),
      "persoenliche-daten": getProzesskostenhilfePersoenlicheDatenXstateConfig({
        backToCallingFlow: [
          {
            guard: ({ context }) => hasGesetzlicheVertretungYes({ context }),
            target: "#gesetzliche-vertretung.daten",
          },
          "#gesetzliche-vertretung",
        ],
        nextFlowEntrypoint: "#abgabe",
      }),
      abgabe: {
        id: "abgabe",
        initial: "ueberpruefung",
        meta: { done: () => false },
        states: {
          ueberpruefung: {
            on: {
              BACK: "#persoenliche-daten.beruf",
            },
            always: {
              guard: ({
                context,
              }: {
                context: ProzesskostenhilfeFormularContext;
              }) =>
                prozesskostenhilfeFinanzielleAngabeDone({ context }) &&
                (rechtsschutzversicherungDone({ context }) ||
                  context.formularArt === "nachueberpruefung") &&
                prozesskostenhilfePersoenlicheDatenDone({
                  context,
                }),
              target: "ende",
            },
          },
          ende: {
            on: {
              BACK: "#persoenliche-daten.beruf",
            },
          },
        },
      },
    },
  }),
  guards: {
    ...finanzielleAngabeGuards,
    ...finanzielleAngabeEinkuenfteGuards,
  },
  stringReplacements: (context: ProzesskostenhilfeFormularContext) => ({
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...getAntragstellendePersonStrings(context),
    ...eigentumZusammenfassungShowPartnerschaftWarnings(context),
    ...geldAnlagenStrings(context),
    ...getAbgabeStrings(context),
    ...getMissingInformationStrings(context),
  }),
} satisfies Flow;

export type ProzesskostenhilfeFormularContext =
  ProzesskostenhilfeGrundvoraussetzungenContext &
    ProzesskostenhilfeAntragstellendePersonContext &
    ProzesskostenhilfeRechtsschutzversicherungContext &
    ProzesskostenhilfeFinanzielleAngabenContext &
    ProzesskostenhilfeGesetzlicheVertretung &
    ProzesskostenhilfePersoenlicheDaten;
