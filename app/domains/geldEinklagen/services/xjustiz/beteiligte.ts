import {
  createBeweisNummerGenerator,
  createRollennummerGenerator,
  datatypeA,
  datatypeB,
  datatypeC,
  ergonomics,
  Geschlecht,
  Rollenbezeichnung,
  Staaten,
  type Beweis,
  type BeweisNummer,
  type NatuerlichePerson,
  type Rollennummer,
  type ScopeToken,
  type Zeuge,
} from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import z from "zod";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";

type ParseResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | { readonly issues: ReadonlyArray<{ readonly message: string }> };

// Turns an xJustiz datatype into a zod schema that outputs its branded type.
const branded = <Output>(parse: (value: string) => ParseResult<Output>) =>
  z.string().transform((value, ctx) => {
    const result = parse(value);
    if (!result.issues) return result.value;
    result.issues.forEach((issue) => ctx.addIssue(issue.message));
    return z.NEVER;
  });

const typeA = branded(datatypeA);
const typeB = branded(datatypeB);
const typeC = branded(datatypeC);
const optionalTypeC = z.preprocess(
  (value) => (value === "" ? undefined : value),
  typeC.optional(),
);

const personSchema = z.object({
  anrede: z.string().optional(),
  title: optionalTypeC,
  vorname: typeA,
  nachname: typeA,
  strasse: typeB,
  hausnummer: typeB,
  plz: typeC,
  ort: typeB,
  land: z.string().optional(),
  telefonnummer: optionalTypeC,
  email: optionalTypeC,
});

type Person = z.output<typeof personSchema>;

export const beteiligteSchema = z.object({
  klaeger: personSchema,
  beklagter: personSchema,
  zeugen: z.array(personSchema),
});

type BeweisPerson = NonNullable<
  NonNullable<GeldEinklagenFormularUserData["abschnitte"]>[number]["personen"]
>[number];

// Reused persons are copies carrying a personReference to their origin, so
// only originals are collected to list every witness exactly once.
const collectZeugen = (userData: GeldEinklagenFormularUserData) =>
  (userData.abschnitte ?? [])
    .flatMap((abschnitt) => abschnitt.personen ?? [])
    .filter(
      (
        person,
      ): person is Extract<BeweisPerson, { personAuswahl: "anotherPerson" }> =>
        person.personAuswahl === "anotherPerson" && !person.personReference,
    );

export const beteiligteFromUserData = (
  userData: GeldEinklagenFormularUserData,
) => ({
  klaeger: {
    anrede: userData.klagendePersonAnrede,
    vorname: userData.klagendePersonVorname,
    nachname: userData.klagendePersonNachname,
    strasse: userData.klagendePersonStrasse,
    hausnummer: userData.klagendePersonHausnummer,
    plz: userData.klagendePersonPlz,
    ort: userData.klagendePersonOrt,
  },
  beklagter: {
    anrede: userData.beklagteAnrede,
    vorname: userData.beklagteVorname,
    nachname: userData.beklagteNachname,
    strasse: userData.beklagteStrasse,
    hausnummer: userData.beklagteHausnummer,
    plz: userData.beklagtePlz,
    ort: userData.beklagteOrt,
  },
  zeugen: collectZeugen(userData),
});

const anredeToGeschlecht = (anrede?: string) => {
  if (anrede === "herr") return Geschlecht["männlich"];
  if (anrede === "frau") return Geschlecht["weiblich"];
  return Geschlecht["unbekannt"];
};

const landToStaat = (land?: string) =>
  land && land in Staaten ? Staaten[land as keyof typeof Staaten] : undefined;

const toNatuerlichePerson = (person: Person): NatuerlichePerson => {
  const telekommunikation = [
    ...(person.email ? [ergonomics.email(person.email)] : []),
    ...(person.telefonnummer ? [ergonomics.telefon(person.telefonnummer)] : []),
  ];
  return {
    vollerName: {
      vorname: person.vorname,
      nachname: person.nachname,
      titel: person.title,
    },
    geschlecht: anredeToGeschlecht(person.anrede),
    anschrift: [
      {
        strasse: person.strasse,
        hausnummer: person.hausnummer,
        postleitzahl: person.plz,
        ort: person.ort,
        staat: landToStaat(person.land),
      },
    ],
    telekommunikation:
      telekommunikation.length > 0 ? telekommunikation : undefined,
  };
};

export const toBeteiligung = <Nummer, Bezeichnung>(
  rollennummer: Nummer,
  rollenbezeichnung: Bezeichnung,
  person: Person,
) => ({
  rolle: [{ rollennummer, rollenbezeichnung }] as [
    { rollennummer: Nummer; rollenbezeichnung: Bezeichnung },
  ],
  beteiligter: {
    auswahlBeteiligter: { natuerlichePerson: toNatuerlichePerson(person) },
  },
});

// Generators memoize next() per predecessor, so each Zeuge must chain from
// the previously generated Rollennummer/BeweisNummer to get a unique one.
export function composeZeugen<NachrichtenScope>(
  scope: ScopeToken<NachrichtenScope>,
  letzteRollennummer: Rollennummer<NachrichtenScope>,
  zeugen: Person[],
) {
  const rollennummer = createRollennummerGenerator(scope);
  const beweisNummer = createBeweisNummerGenerator(scope);
  const beteiligungen: Array<Zeuge<NachrichtenScope>> = [];
  const beweise: Array<Beweis<NachrichtenScope>> = [];

  let vorherigeRollennummer = letzteRollennummer;
  let vorherigeBeweisNummer: BeweisNummer<NachrichtenScope> | undefined;

  for (const zeuge of zeugen) {
    const rollennummerZeuge = rollennummer.next(
      vorherigeRollennummer,
      Rollenbezeichnung["Zeuge (Zeugin)"],
    );
    const nummer = vorherigeBeweisNummer
      ? beweisNummer.next(vorherigeBeweisNummer)
      : beweisNummer.first();

    beteiligungen.push(
      toBeteiligung(
        rollennummerZeuge,
        Rollenbezeichnung["Zeuge (Zeugin)"],
        zeuge,
      ),
    );
    beweise.push(ergonomics.zeuge(scope, nummer, rollennummerZeuge));

    vorherigeRollennummer = rollennummerZeuge;
    vorherigeBeweisNummer = nummer;
  }

  return { beteiligungen, beweise };
}
