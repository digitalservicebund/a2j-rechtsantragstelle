import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { kontopfaendungPkontoAntragPages } from "./pages";
import { addLeadingSlashToPageSchemas } from "~/services/flow/addLeadingSlashToPageConfig";

const kontopfaendungPkontoAntragPagesWithLeadingSlash =
  addLeadingSlashToPageSchemas(kontopfaendungPkontoAntragPages);

export const kontopfaendungPkontoAntragFlowConfig = compileFlow({
  pages: kontopfaendungPkontoAntragPagesWithLeadingSlash,
  initialStep: "start",
  transitions: {
    start: "grundvoraussetzungenDatenverarbeitung",
    grundvoraussetzungenDatenverarbeitung: [
      {
        guard: (context) => context.datenverarbeitungZustimmung === "on",
        target: "bestehendesPkonto",
      },
    ],
    bestehendesPkonto: [
      {
        guard: (context) => context.bestehendesPkonto === "yes",
        target: "ende",
      },
      {
        guard: (context) => context.bestehendesPkonto === "no",
        target: "bankdatenEinleitung",
      },
    ],
    ende: null,
    bankdatenEinleitung: "bankdatenKontodaten",
    bankdatenKontodaten: [
      {
        guard: (context) => objectKeysNonEmpty(context, ["iban", "bankName"]),
        target: "kontoinhaberName",
      },
    ],
    kontoinhaberName: "kontoinhaberAnschrift",
    kontoinhaberAnschrift: [
      {
        guard: (context) =>
          objectKeysNonEmpty(context, [
            "kontoinhaberStrasseHausnummer",
            "kontoinhaberPlz",
            "kontoinhaberOrt",
          ]),
        target: "kontakt",
      },
    ],
    kontakt: "zusammenfassung",
    zusammenfassung: "ergebnis",
    ergebnis: null,
  },
}) as CompiledFlow<PageConfigMap>;
