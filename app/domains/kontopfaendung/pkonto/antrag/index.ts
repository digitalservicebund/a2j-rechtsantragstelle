import type { Flow } from "~/domains/flows.server";
import { kontopfaendungPkontoAntragFlowConfig } from "./flowConfig";
import { type KontopfaendungPkontoAntragUserData } from "./userData";
import { pKontoPdfFromUserdata } from "./pKontoPdfFromUserdata";

export const kontopfaendungPkontoAntrag = {
  flowType: "formFlow",
  stringReplacements: () => ({}),
  newEngineConfig: kontopfaendungPkontoAntragFlowConfig,
  pdfConfig: {
    pdfFunction: async (userData: KontopfaendungPkontoAntragUserData) =>
      await pKontoPdfFromUserdata(userData),
    name: "Antrag_Umwandlung_nach_Pfaendung",
  },
} satisfies Flow<typeof kontopfaendungPkontoAntragFlowConfig.pages>;
