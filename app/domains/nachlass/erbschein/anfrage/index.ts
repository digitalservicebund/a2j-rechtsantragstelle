import { type Flow } from "~/domains/flows.server";
import { erbscheinAnfrageFlowConfig } from "./flowConfig";
import { type ErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import {
  getAmtsgerichtStrings,
  getAngehoerigeStrings,
  getBeguenstigteStrings,
  getEhepartnerName,
  getVerstorbeneName,
  getVerstorbenePostcodeCity,
  getVerstorbeneStreetnameHousenumber,
} from "~/domains/nachlass/erbschein/anfrage/stringReplacements";
import { type ErbscheinErbfolgeUserData } from "~/domains/nachlass/erbschein/erbfolge/userData";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { migrateElternteil, migrateKind } from "./personMigration";
import { getParentIndexSummaryOverride } from "~/domains/nachlass/erbschein/shared/summaryFieldOverride";
import { copyAntragstellendePersonData } from "~/domains/nachlass/services/copyAntragstellendePersonData";

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
    ...getAmtsgerichtStrings(context),
  }),
  summaryFieldOverride: getParentIndexSummaryOverride,
  newEngineConfig: erbscheinAnfrageFlowConfig,
} satisfies Flow<PageConfigMap>;
