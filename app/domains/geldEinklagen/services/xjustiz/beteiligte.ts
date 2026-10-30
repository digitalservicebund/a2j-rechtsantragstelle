import {
  createBeweisNummerGenerator,
  createRollennummerGenerator,
  ergonomics,
  Geschlecht,
  Rollenbezeichnung,
  Staaten,
  type Beklagter,
  type Beweis,
  type BeweisNummer,
  type Klaeger,
  type NatuerlichePerson,
  type Rollennummer,
  type ScopeToken,
  type Zeuge,
} from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import z from "zod";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  optionalTypeC,
  typeA,
  typeB,
  typeC,
  typeD,
} from "~/services/validation/xjustiz/brandedDatatypes";

const anschriftShape = {
  strasse: typeB,
  hausnummer: typeB,
  plz: typeC,
  ort: typeB,
  land: z.string().optional(),
};

const personSchema = z.object({
  anrede: z.string().optional(),
  title: optionalTypeC,
  vorname: typeA,
  nachname: typeA,
  ...anschriftShape,
  telefonnummer: optionalTypeC,
  email: optionalTypeC,
});

const organisationSchema = z.object({
  name: typeD,
  ...anschriftShape,
});

const beklagteSchema = z.discriminatedUnion("art", [
  personSchema.extend({ art: z.literal("person") }),
  organisationSchema.extend({ art: z.literal("organisation") }),
]);

type Person = z.output<typeof personSchema>;
type Anschrift = z.output<z.ZodObject<typeof anschriftShape>>;
type Beklagte = z.output<typeof beklagteSchema>;

export const beteiligteSchema = z.object({
  klaeger: personSchema,
  beklagter: beklagteSchema,
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

const beklagteFromUserData = (userData: GeldEinklagenFormularUserData) => {
  const anschrift = {
    strasse: userData.beklagteStrasse,
    hausnummer: userData.beklagteHausnummer,
    plz: userData.beklagtePlz,
    ort: userData.beklagteOrt,
  };
  if (userData.gegenWenBeklagen === "organisation")
    return {
      art: "organisation",
      name: userData.beklagteNameOrganisation,
      ...anschrift,
    };
  return {
    art: "person",
    anrede: userData.beklagteAnrede,
    vorname: userData.beklagteVorname,
    nachname: userData.beklagteNachname,
    ...anschrift,
  };
};

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
    telefonnummer: userData.klagendeTelefonnummer,
    email: userData.klagendeEmail,
  },
  beklagter: beklagteFromUserData(userData),
  zeugen: collectZeugen(userData),
});

const anredeToGeschlecht = (anrede?: string) => {
  if (anrede === "herr") return Geschlecht["männlich"];
  if (anrede === "frau") return Geschlecht["weiblich"];
  return Geschlecht["unbekannt"];
};

const isStaat = (land: string): land is keyof typeof Staaten =>
  Object.hasOwn(Staaten, land);

const landToStaat = (land?: string) =>
  land !== undefined && isStaat(land) ? Staaten[land] : undefined;

const toAnschrift = (anschrift: Anschrift) => ({
  strasse: anschrift.strasse,
  hausnummer: anschrift.hausnummer,
  postleitzahl: anschrift.plz,
  ort: anschrift.ort,
  staat: landToStaat(anschrift.land),
});

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
    anschrift: [toAnschrift(person)],
    telekommunikation:
      telekommunikation.length > 0 ? telekommunikation : undefined,
  };
};

export const toKlaeger = <NachrichtenScope>(
  rollennummer: Rollennummer<
    NachrichtenScope,
    (typeof Rollenbezeichnung)["Kläger(in)"]
  >,
  person: Person,
): Klaeger<NachrichtenScope> => ({
  rolle: [{ rollennummer, rollenbezeichnung: Rollenbezeichnung["Kläger(in)"] }],
  beteiligter: {
    auswahlBeteiligter: { natuerlichePerson: toNatuerlichePerson(person) },
  },
});

// The profile has no gesetzliche Vertretung for a Beklagte, so it is left out.
export const toBeklagter = <NachrichtenScope>(
  rollennummer: Rollennummer<
    NachrichtenScope,
    (typeof Rollenbezeichnung)["Beklagte(r)"]
  >,
  beklagte: Beklagte,
): Beklagter<NachrichtenScope> => {
  const rolle = [
    { rollennummer, rollenbezeichnung: Rollenbezeichnung["Beklagte(r)"] },
  ] satisfies Beklagter<NachrichtenScope>["rolle"];

  if (beklagte.art === "organisation")
    return {
      rolle,
      beteiligter: {
        auswahlBeteiligter: {
          organisation: {
            bezeichnung: { bezeichnungAktuell: beklagte.name },
            anschrift: [toAnschrift(beklagte)],
          },
        },
      },
    };
  return {
    rolle,
    beteiligter: {
      auswahlBeteiligter: { natuerlichePerson: toNatuerlichePerson(beklagte) },
    },
  };
};

const toZeuge = <NachrichtenScope>(
  rollennummer: Rollennummer<
    NachrichtenScope,
    (typeof Rollenbezeichnung)["Zeuge (Zeugin)"]
  >,
  person: Person,
): Zeuge<NachrichtenScope> => ({
  rolle: [
    { rollennummer, rollenbezeichnung: Rollenbezeichnung["Zeuge (Zeugin)"] },
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

    beteiligungen.push(toZeuge(rollennummerZeuge, zeuge));
    beweise.push(ergonomics.zeuge(scope, nummer, rollennummerZeuge));

    vorherigeRollennummer = rollennummerZeuge;
    vorherigeBeweisNummer = nummer;
  }

  return { beteiligungen, beweise };
}
