import {
  Anspruchsart,
  createFortlaufendeNummerGenerator,
  createRollennummerGenerator,
  createUuidGenerator,
  datatypeC,
  datatypeE,
  ergonomics,
  reference,
  Rollenbezeichnung,
  verifyZahlungsklage,
  zahlungsklage,
  type AnspruchFuerZahlungsklage,
  type Gerichte,
  type ScopeToken,
} from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import z from "zod";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { parseCurrencyStringDE } from "~/services/validation/money/formatCents";
import { installTemporalPolyfill } from "~/services/xjustiz/installTemporalPolyfill.server";
import {
  beteiligteFromUserData,
  beteiligteSchema,
  composeZeugen,
  toBeklagter,
  toKlaeger,
} from "./beteiligte";

type CompositionInput = {
  readonly userData: GeldEinklagenFormularUserData;
  readonly gericht: Gerichte;
  readonly baseUrl: string;
};

const invalidUserData = (issues: unknown) => ({
  ok: false as const,
  reason: "invalidUserData" as const,
  issues,
});

export async function geldEinklagenXjustizFromUserdata({
  userData,
  gericht,
  baseUrl,
}: CompositionInput) {
  installTemporalPolyfill();

  const beteiligte = beteiligteSchema.safeParse(
    beteiligteFromUserData(userData),
  );
  if (!beteiligte.success)
    return invalidUserData(z.treeifyError(beteiligte.error));

  const forderungInEuro = parseCurrencyStringDE(userData.forderungGesamtbetrag);

  const sachantragText = datatypeE(
    `Die beklagte Partei wird verurteilt, an die klagende Partei ${userData.forderungGesamtbetrag} EUR zu zahlen.`,
  );
  if (sachantragText.issues) return invalidUserData(sachantragText.issues);

  const begruendungText = datatypeC(
    (userData.abschnitte ?? []).map((a) => a.beschreibung).join("\n\n"),
  );
  if (begruendungText.issues) return invalidUserData(begruendungText.issues);

  const result = await zahlungsklage(
    <NachrichtenScope>(scope: ScopeToken<NachrichtenScope>) => {
      const uuid = createUuidGenerator(scope);
      const rollennummer = createRollennummerGenerator(scope);
      const fortlaufendeNummer = createFortlaufendeNummerGenerator(scope);

      const eigeneNachrichtenID = uuid.first();
      const vortragsID = uuid.next(eigeneNachrichtenID);

      const rollennummerKlaeger = rollennummer.first(
        Rollenbezeichnung["Kläger(in)"],
      );
      const rollennummerBeklagter = rollennummer.next(
        rollennummerKlaeger,
        Rollenbezeichnung["Beklagte(r)"],
      );

      const klaeger = toKlaeger(rollennummerKlaeger, beteiligte.data.klaeger);
      const beklagter = toBeklagter(
        rollennummerBeklagter,
        beteiligte.data.beklagter,
      );

      const zeugen = composeZeugen(
        scope,
        rollennummerBeklagter,
        beteiligte.data.zeugen,
      );

      const sachanspruch = {
        fortlaufendeNummer: fortlaufendeNummer.first("Anspruch"),
        anspruchssteller: [{ refRollennummer: reference(rollennummerKlaeger) }],
        anspruchsgegner: [
          { refRollennummer: reference(rollennummerBeklagter) },
        ],
        anspruchsart: Anspruchsart.Zahlung,
        wertAnspruch: ergonomics.geldbetrag(forderungInEuro),
      } satisfies AnspruchFuerZahlungsklage<NachrichtenScope>;

      return verifyZahlungsklage(scope, {
        nachrichtenkopf: ergonomics.nachrichtenkopf(
          scope,
          eigeneNachrichtenID,
          klaeger,
          gericht,
        ),
        grunddaten: {
          verfahrensdaten: {
            beteiligung: [klaeger, beklagter, ...zeugen.beteiligungen],
          },
        },
        inhaltsdaten: {
          antraege: {
            sachantraege: {
              inhalt: sachantragText.value,
              anspruch: [sachanspruch],
            },
            nebenantraegeZinsen: undefined,
            auswahlSonstigeAntraege: [ergonomics.antragAufVersaeumnisurteil()],
          },
          beweis: zeugen.beweise.length > 0 ? zeugen.beweise : undefined,
          auswahlBegruendetheit: {
            anderesKlageverfahren: {
              vortrag: [
                {
                  schlagwort: datatypeC("Begruendung").value,
                  vortragsID,
                  ausfuehrungen: {
                    inhalt: {
                      tatsachenvortragSachverhaltsbeschreibung:
                        begruendungText.value,
                    },
                    refBeweisNummer: zeugen.beweise.map((beweis) =>
                      reference(beweis.beweisNummer),
                    ),
                  },
                },
              ],
            },
          },
        },
      });
    },
    { baseUrl },
  );

  return result.ok
    ? result
    : { ok: false as const, reason: "xjustizToolsFailed" as const };
}
