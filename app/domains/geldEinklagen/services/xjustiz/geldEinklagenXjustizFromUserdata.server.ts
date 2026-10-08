// oxlint-disable-next-line no-unassigned-import
import "~/services/xjustiz/installTemporalPolyfill.server";
import {
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
  type Beklagter,
  type Gerichte,
  type Klaeger,
  type ScopeToken,
} from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { parseCurrencyStringDE } from "~/services/validation/money/formatCents";
import {
  beteiligteFromUserData,
  beteiligteSchema,
  composeZeugen,
  toBeteiligung,
} from "./beteiligte";

type CompositionInput = {
  readonly userData: GeldEinklagenFormularUserData;
  readonly gericht: Gerichte;
  readonly baseUrl: string;
};

export async function geldEinklagenXjustizFromUserdata({
  userData,
  gericht,
  baseUrl,
}: CompositionInput) {
  const beteiligte = beteiligteSchema.safeParse(
    beteiligteFromUserData(userData),
  );
  if (!beteiligte.success)
    return { ok: false as const, issues: beteiligte.error };

  const forderungInEuro = parseCurrencyStringDE(userData.forderungGesamtbetrag);

  const sachantragText = datatypeE(
    `Die beklagte Partei wird verurteilt, an die klagende Partei ${userData.forderungGesamtbetrag} EUR zu zahlen.`,
  );
  if (sachantragText.issues)
    return { ok: false as const, issues: sachantragText.issues };

  const begruendungText = datatypeC(
    (userData.abschnitte ?? []).map((a) => a.beschreibung).join("\n\n"),
  );
  if (begruendungText.issues)
    return { ok: false as const, issues: begruendungText.issues };

  return zahlungsklage(
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

      const klaeger = toBeteiligung(
        rollennummerKlaeger,
        Rollenbezeichnung["Kläger(in)"],
        beteiligte.data.klaeger,
      ) satisfies Klaeger<NachrichtenScope>;

      const beklagter = toBeteiligung(
        rollennummerBeklagter,
        Rollenbezeichnung["Beklagte(r)"],
        beteiligte.data.beklagter,
      ) satisfies Beklagter<NachrichtenScope>;

      const zeugen = composeZeugen(
        scope,
        rollennummerBeklagter,
        beteiligte.data.zeugen,
      );

      const sachanspruch = ergonomics.antragAufAnwaltskosten(
        scope,
        fortlaufendeNummer.first("Anspruch"),
        rollennummerKlaeger,
        rollennummerBeklagter,
        ergonomics.geldbetrag(forderungInEuro),
        sachantragText.value,
      ).antragSonstige.anspruch[0];

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
}
