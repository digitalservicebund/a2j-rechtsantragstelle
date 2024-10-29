import _ from "lodash";
import type { Flow } from "~/domains/flows.server";
import type { GeldEinklagenFormularContext } from "./context";
import geldEinklagenFormularFlow from "./flow.json";
import { guards } from "./guards";
import { type AllContexts } from "../../common";
import persoenlicheDatenFlow from "./persoenlicheDaten/flow.json";
import {
  gerichtskostenFromBetrag,
  gesamtKosten,
} from "../../shared/gerichtskosten";

export const geldEinklagenFormular = {
  cmsSlug: "form-flow-pages",
  stringReplacements: (context: AllContexts) => {
    if (!("forderung" in context && typeof context.forderung === "object"))
      return {};
    const gesamtForderung = gesamtKosten(context);
    const berechneteGerichtskosten = gerichtskostenFromBetrag(gesamtForderung);

    return {
      forderung1Betrag: context.forderung?.forderung1?.betrag,
      forderung1Title: context.forderung?.forderung1?.title,
      forderung2Betrag: context.forderung?.forderung2?.betrag,
      forderung2Title: context.forderung?.forderung2?.title,
      gesamtForderung: gesamtForderung.toString(),
      berechneteGerichtskosten: berechneteGerichtskosten.toString(),
    };
  },
  config: _.merge(geldEinklagenFormularFlow, {
    states: {
      "persoenliche-daten": _.merge(_.cloneDeep(persoenlicheDatenFlow), {
        meta: {
          done: ({ context }: { context: GeldEinklagenFormularContext }) =>
            Boolean(
              context.anzahl &&
                context.vorname &&
                context.nachname &&
                context.volljaehrig &&
                context.strasseHausnummer &&
                context.plz &&
                context.ort &&
                context.telefonnummer &&
                context.gesetzlicheVertretung &&
                context.bevollmaechtigtePerson,
            ),
        },
        states: {
          start: { on: { BACK: "#daten-uebernahme" } },
          "bevollmaechtigte-person": { on: { SUBMIT: "#gegenseite" } },
        },
      }),
      gegenseite: {
        meta: {
          done: ({ context }: { context: GeldEinklagenFormularContext }) =>
            Boolean(
              (context.gegenseite?.typ === "privatperson" &&
                context.gegenseite.privatperson?.vorname &&
                context.gegenseite.privatperson?.nachname &&
                context.gegenseite.privatperson?.strasseHausnummer &&
                context.gegenseite.privatperson?.plz &&
                context.gegenseite.privatperson?.ort &&
                context.gegenseite.privatperson?.telefonnummer &&
                context.gegenseite.privatperson?.bevollmaechtigtePerson &&
                context.gegenseite.privatperson?.vorname) ||
                (context.gegenseite?.typ === "unternehmen" &&
                  context.gegenseite.unternehmen?.name &&
                  context.gegenseite.unternehmen?.inhaber &&
                  context.gegenseite.unternehmen?.strasseHausnummer &&
                  context.gegenseite.unternehmen?.plz &&
                  context.gegenseite.unternehmen?.ort &&
                  context.gegenseite.unternehmen?.telefonnummer &&
                  context.gegenseite.unternehmen?.bevollmaechtigtePerson),
            ),
        },
      },
    },
  }),
  guards,
} satisfies Flow;
