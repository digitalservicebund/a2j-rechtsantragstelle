import { hasGesetzlicheVertretungYes } from "~/domains/prozesskostenhilfe/formular/gesetzlicheVertretung/guards";
import { prozesskostenhilfePersoenlicheDatenDone } from "~/domains/prozesskostenhilfe/formular/persoenlicheDaten/doneFunctions";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { type Config } from "~/services/flow/server/buildFlowController";

export const persoenlicheDatenXstateConfig = {
  id: "persoenliche-daten",
  initial: "start",
  meta: {
    done: prozesskostenhilfePersoenlicheDatenDone,
  },
  states: {
    start: {
      on: {
        SUBMIT: "name",
        BACK: [
          {
            guard: hasGesetzlicheVertretungYes,
            target: "#gesetzliche-vertretung.daten",
          },
          "#gesetzliche-vertretung",
        ],
      },
    },
    name: {
      on: {
        BACK: "start",
        SUBMIT: "geburtsdatum",
      },
    },
    geburtsdatum: {
      on: {
        BACK: "name",
        SUBMIT: "plz",
      },
    },
    plz: {
      on: {
        BACK: "geburtsdatum",
        SUBMIT: "adresse",
      },
    },
    adresse: {
      on: {
        BACK: "plz",
        SUBMIT: "telefonnummer",
      },
    },
    telefonnummer: {
      on: {
        BACK: "adresse",
        SUBMIT: "beruf",
      },
    },
    beruf: {
      on: {
        BACK: "telefonnummer",
        SUBMIT: "#weitere-angaben",
      },
    },
  },
} satisfies Config<ProzesskostenhilfeFormularUserData>;
