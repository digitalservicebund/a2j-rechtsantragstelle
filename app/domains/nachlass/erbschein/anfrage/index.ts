import { type Flow } from "~/domains/flows.server";
import {
  getAngehoerigeStrings,
  getAntragstellendePersonCourtStrings,
  getBeguenstigteStrings,
  getEhepartnerName,
  getVerstorbeneName,
  getVerstorbenePersonCourtStrings,
  getVerstorbenePostcodeCity,
  getVerstorbeneStreetnameHousenumber,
} from "~/domains/nachlass/erbschein/anfrage/stringReplacements";
import { type ErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { type ErbscheinErbfolgeUserData } from "~/domains/nachlass/erbschein/erbfolge/userData";
import { getParentIndexSummaryOverride } from "~/domains/nachlass/erbschein/shared/summaryFieldOverride";
import { copyAntragstellendePersonData } from "~/domains/nachlass/services/copyAntragstellendePersonData";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { erbscheinAnfrageFlowConfig } from "./flowConfig";
import { migrateElternteil, migrateKind } from "./personMigration";

export const erbscheinAnfrage = {
  flowType: "formFlow",
  config: {
    states: {},
  },
  migration: {
    source: "/erbschein/erbfolge",
    sortedFields: [
      "verstorbeneVorname",
      "verstorbeneNachname",
      "verstorbeneFamilienstand",
      "ehepartnerVorname",
      "ehepartnerNachname",
      "ehepartnerStaatsangehoerigkeit",
      "hasEhevertrag",
      "kinder",
      "elternteile",
    ],
    migrationDataMerger: (
      sourceData: ErbscheinErbfolgeUserData,
    ): ErbscheinAnfrageUserData => {
      return {
        verstorbeneVorname: sourceData.verstorbeneVorname ?? "",
        verstorbeneNachname: sourceData.verstorbeneNachname ?? "",
        verstorbeneFamilienstand: sourceData.familienstand,
        ehepartnerVorname: sourceData.ehepartnerVorname ?? "",
        ehepartnerNachname: sourceData.ehepartnerNachname ?? "",
        ...(sourceData.ehepartnerStaatsangehoerigkeit === "nurDeutsch"
          ? { ehepartnerStaatsangehoerigkeit: "Deutsch" }
          : {}),
        ...(sourceData.ehevertrag && sourceData.ehevertrag !== "unknown"
          ? { hasEhevertrag: sourceData.ehevertrag }
          : {}),
        testamentArt: sourceData.testamentArt ?? "none",
        hatteKinder: sourceData.hatteKinder,
        ...(sourceData.kinder && {
          kinder: sourceData.kinder.map(migrateKind),
        }),
        ...(sourceData.elternteile && {
          elternteile: sourceData.elternteile.map(migrateElternteil),
        }),
      };
    },
    buttonUrl: "/erbschein/erbfolge",
  },
  asyncFlowActions: {
    "/antragstellende-person/verhaeltnis": copyAntragstellendePersonData,
  },
  stringReplacements: (context: ErbscheinAnfrageUserData) => ({
    ...getVerstorbeneName(context),
    ...getVerstorbeneStreetnameHousenumber(context),
    ...getVerstorbenePostcodeCity(context),
    ...getEhepartnerName(context),
    ...getBeguenstigteStrings(context),
    ...getAngehoerigeStrings(context),
    ...getVerstorbenePersonCourtStrings(context),
    ...getAntragstellendePersonCourtStrings(context),
  }),
  summaryFieldOverride: getParentIndexSummaryOverride,
  newEngineConfig: erbscheinAnfrageFlowConfig,
} satisfies Flow<PageConfigMap>;
