import {
  createFortlaufendeNummerGenerator,
  createRollennummerGenerator,
  createUuidGenerator,
  datatypeA,
  datatypeB,
  datatypeC,
  datatypeE,
  ergonomics,
  Geschlecht,
  Rollenbezeichnung,
  verifyZahlungsklage,
  zahlungsklage,
  type Beklagter,
  type Gerichte,
  type Klaeger,
  type ScopeToken,
} from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import z from "zod";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { parseCurrencyStringDE } from "~/services/validation/money/formatCents";

type StandardSchemaV1<Input, Output> = {
  readonly "~standard": {
    readonly validate: (
      value: unknown,
    ) => StandardSchemaResult<Output> | Promise<StandardSchemaResult<Output>>;
  };
  readonly _input?: Input;
};

type StandardSchemaResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | { readonly issues: ReadonlyArray<{ readonly message: string }> };

function convertStandardSchemaToZod<Input, Output>(
  schema: StandardSchemaV1<Input, Output>,
): z.ZodType<Output, Input> {
  return z.any().transform((input: unknown, context) => {
    const result = schema["~standard"].validate(input);
    if (result instanceof Promise)
      throw new Error("Asynchronous schemas are not supported");
    if (result.issues) {
      result.issues.forEach((issue) => context.addIssue(issue.message));
      return z.NEVER;
    }
    return result.value;
  }) as unknown as z.ZodType<Output, Input>;
}

const typeA = convertStandardSchemaToZod(datatypeA);
const typeB = convertStandardSchemaToZod(datatypeB);
const typeC = convertStandardSchemaToZod(datatypeC);

const xjustizScalarsSchema = z.object({
  klagendePersonVorname: typeA,
  klagendePersonNachname: typeA,
  klagendePersonStrasse: typeB,
  klagendePersonHausnummer: typeB,
  klagendePersonPlz: typeC,
  klagendePersonOrt: typeB,
  beklagteVorname: typeA,
  beklagteNachname: typeA,
  beklagteStrasse: typeB,
  beklagteHausnummer: typeB,
  beklagtePlz: typeC,
  beklagteOrt: typeB,
});

const anredeToGeschlecht = (anrede?: string) => {
  if (anrede === "herr") return Geschlecht["männlich"];
  if (anrede === "frau") return Geschlecht["weiblich"];
  return Geschlecht["unbekannt"];
};

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
  const scalars = xjustizScalarsSchema.safeParse(userData);
  if (!scalars.success) return { ok: false as const, issues: scalars.error };

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

  const person = scalars.data;

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

      const klaeger = {
        rolle: [
          {
            rollennummer: rollennummerKlaeger,
            rollenbezeichnung: Rollenbezeichnung["Kläger(in)"],
          },
        ],
        beteiligter: {
          auswahlBeteiligter: {
            natuerlichePerson: {
              vollerName: {
                vorname: person.klagendePersonVorname,
                nachname: person.klagendePersonNachname,
              },
              geschlecht: anredeToGeschlecht(userData.klagendePersonAnrede),
              anschrift: [
                {
                  strasse: person.klagendePersonStrasse,
                  hausnummer: person.klagendePersonHausnummer,
                  postleitzahl: person.klagendePersonPlz,
                  ort: person.klagendePersonOrt,
                },
              ],
            },
          },
        },
      } satisfies Klaeger<NachrichtenScope>;

      const beklagter = {
        rolle: [
          {
            rollennummer: rollennummerBeklagter,
            rollenbezeichnung: Rollenbezeichnung["Beklagte(r)"],
          },
        ],
        beteiligter: {
          auswahlBeteiligter: {
            natuerlichePerson: {
              vollerName: {
                vorname: person.beklagteVorname,
                nachname: person.beklagteNachname,
              },
              geschlecht: anredeToGeschlecht(userData.beklagteAnrede),
              anschrift: [
                {
                  strasse: person.beklagteStrasse,
                  hausnummer: person.beklagteHausnummer,
                  postleitzahl: person.beklagtePlz,
                  ort: person.beklagteOrt,
                },
              ],
            },
          },
        },
      } satisfies Beklagter<NachrichtenScope>;

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
            beteiligung: [klaeger, beklagter],
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
                    refBeweisNummer: [],
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
