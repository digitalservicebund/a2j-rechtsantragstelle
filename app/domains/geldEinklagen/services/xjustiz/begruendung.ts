import {
  createBeweisNummerGenerator,
  createRollennummerGenerator,
  createUuidGenerator,
  ergonomics,
  reference,
  Rollenbezeichnung,
  type Beweis,
  type BeweisNummer,
  type Rollennummer,
  type ScopeToken,
  type UUID,
  type VortragZurBegruendetheitFuerZahlungsklage,
  type Zeuge,
} from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import z from "zod";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import {
  optionalTypeC,
  typeC,
} from "~/services/validation/xjustiz/brandedDatatypes";
import { personSchema, toZeuge } from "./beteiligte";

type Abschnitt = NonNullable<
  GeldEinklagenFormularUserData["abschnitte"]
>[number];
type Partei = "klagende" | "beklagte";

const PARTEIVERNEHMUNG: Record<Partei, { schlagwort: string; text: string }> = {
  klagende: {
    schlagwort: "Parteivernehmung klagende Partei",
    text: "Beweis angeboten durch Parteivernehmung der klagenden Partei.",
  },
  beklagte: {
    schlagwort: "Parteivernehmung beklagte Partei",
    text: "Beweis angeboten durch Parteivernehmung der beklagten Partei.",
  },
};

const beweismittelSchema = z.discriminatedUnion("art", [
  z.object({ art: z.literal("dokument") }),
  z.object({ art: z.literal("zeuge"), person: personSchema }),
  z.object({
    art: z.literal("partei"),
    partei: z.enum(["klagende", "beklagte"]),
  }),
]);

export const begruendungSchema = z.object({
  abschnitte: z.array(z.object({ schlagwort: typeC, text: typeC })).min(1),
  rechtlicheWuerdigung: optionalTypeC,
  beweise: z.array(
    z.object({
      schlagwort: typeC,
      text: typeC,
      abschnitte: z.array(z.number()),
      beweismittel: beweismittelSchema,
    }),
  ),
});

type Begruendung = z.output<typeof begruendungSchema>;
type BeweisEintrag = z.input<typeof begruendungSchema>["beweise"][number];

// Reused documents and persons carry a reference to their origin, so a copy
// shares the key of its origin and every Beweis is listed exactly once.
const collectBeweise = (abschnitte: Abschnitt[]) => {
  const beweise = new Map<string, BeweisEintrag>();
  let dokumentNummer = 0;

  const add = (
    key: string,
    abschnittIndex: number,
    create: () => Omit<BeweisEintrag, "abschnitte">,
  ) => {
    const vorhanden = beweise.get(key);
    if (!vorhanden) {
      beweise.set(key, { ...create(), abschnitte: [abschnittIndex] });
      return;
    }
    if (!vorhanden.abschnitte.includes(abschnittIndex))
      vorhanden.abschnitte.push(abschnittIndex);
  };

  abschnitte.forEach((abschnitt, abschnittIndex) => {
    (abschnitt.dokumenten ?? []).forEach((dokument, dokumentIndex) => {
      const key =
        dokument.dokumentReference || `${abschnittIndex}-${dokumentIndex}`;
      add(`dokument:${key}`, abschnittIndex, () => {
        dokumentNummer += 1;
        return {
          schlagwort: `Beweis K${dokumentNummer}`,
          text: dokument.beschreibung,
          beweismittel: { art: "dokument" },
        };
      });
    });

    (abschnitt.personen ?? []).forEach((person, personIndex) => {
      if (person.personAuswahl !== "anotherPerson") {
        const partei = person.personAuswahl;
        add(`partei:${partei}`, abschnittIndex, () => ({
          ...PARTEIVERNEHMUNG[partei],
          beweismittel: { art: "partei", partei },
        }));
        return;
      }
      const key = person.personReference || `${abschnittIndex}-${personIndex}`;
      const name = getFullPlaintiffName(
        person.anrede,
        person.title,
        person.vorname,
        person.nachname,
      );
      add(`person:${key}`, abschnittIndex, () => ({
        schlagwort: `Zeuge ${name}`,
        text: `Beweis angeboten durch Vernehmung von ${name} als Zeuge oder Zeugin.`,
        beweismittel: { art: "zeuge", person },
      }));
    });
  });

  return [...beweise.values()];
};

export const begruendungFromUserData = (
  userData: GeldEinklagenFormularUserData,
) => ({
  abschnitte: (userData.abschnitte ?? []).map((abschnitt, index) => ({
    schlagwort: `Sachverhalt ${index + 1}`,
    text: abschnitt.beschreibung,
  })),
  rechtlicheWuerdigung: userData.rechtlicheWuerdigung,
  beweise: collectBeweise(userData.abschnitte ?? []),
});

type Ids<NachrichtenScope> = {
  readonly letzteUuid: UUID<NachrichtenScope>;
  readonly rollennummerKlaeger: Rollennummer<
    NachrichtenScope,
    (typeof Rollenbezeichnung)["Kläger(in)"]
  >;
  readonly rollennummerBeklagter: Rollennummer<
    NachrichtenScope,
    (typeof Rollenbezeichnung)["Beklagte(r)"]
  >;
};

// One Vortrag per Abschnitt and one per Beweis, as agreed with the court comm
// team. Each Beweis Vortrag links back to the Abschnitte that offer it.
// Generators memoize next() per predecessor, so every identifier chains from
// the previously generated one to stay unique.
export function composeBegruendung<NachrichtenScope>(
  scope: ScopeToken<NachrichtenScope>,
  begruendung: Begruendung,
  ids: Ids<NachrichtenScope>,
) {
  const uuid = createUuidGenerator(scope);
  const rollennummer = createRollennummerGenerator(scope);
  const beweisNummer = createBeweisNummerGenerator(scope);

  let vorherigeUuid = ids.letzteUuid;
  const nextUuid = () => (vorherigeUuid = uuid.next(vorherigeUuid));

  let vorherigeRollennummer: Rollennummer<NachrichtenScope> =
    ids.rollennummerBeklagter;
  let vorherigeBeweisNummer: BeweisNummer<NachrichtenScope> | undefined;
  const nextBeweisNummer = () =>
    (vorherigeBeweisNummer = vorherigeBeweisNummer
      ? beweisNummer.next(vorherigeBeweisNummer)
      : beweisNummer.first());

  const zeugen: Array<Zeuge<NachrichtenScope>> = [];

  const toBeweis = (
    beweismittel: Begruendung["beweise"][number]["beweismittel"],
  ): Beweis<NachrichtenScope> | undefined => {
    switch (beweismittel.art) {
      case "dokument":
        return undefined;
      case "zeuge": {
        const rollennummerZeuge = rollennummer.next(
          vorherigeRollennummer,
          Rollenbezeichnung["Zeuge (Zeugin)"],
        );
        vorherigeRollennummer = rollennummerZeuge;
        zeugen.push(toZeuge(rollennummerZeuge, beweismittel.person));
        return ergonomics.zeuge(scope, nextBeweisNummer(), rollennummerZeuge);
      }
      case "partei":
        return ergonomics.parteivernehmung(
          scope,
          nextBeweisNummer(),
          beweismittel.partei === "klagende"
            ? ids.rollennummerKlaeger
            : ids.rollennummerBeklagter,
        );
    }
  };

  const abschnittIDs = begruendung.abschnitte.map(() => nextUuid());

  const beweisEintraege = begruendung.beweise.map((eintrag) => {
    const beweis = toBeweis(eintrag.beweismittel);
    const vortrag: VortragZurBegruendetheitFuerZahlungsklage<NachrichtenScope> =
      {
        schlagwort: eintrag.schlagwort,
        vortragsID: nextUuid(),
        ausfuehrungen: {
          inhalt: { tatsachenvortragSachverhaltsbeschreibung: eintrag.text },
          refBeweisNummer: beweis ? [reference(beweis.beweisNummer)] : [],
        },
        fremdeVortragsID: eintrag.abschnitte.map(
          (index) => abschnittIDs[index],
        ),
      };
    return { abschnitte: eintrag.abschnitte, beweis, vortrag };
  });

  const [ersterAbschnitt, ...weitereAbschnitte] = begruendung.abschnitte.map(
    (
      abschnitt,
      index,
    ): VortragZurBegruendetheitFuerZahlungsklage<NachrichtenScope> => ({
      schlagwort: abschnitt.schlagwort,
      vortragsID: abschnittIDs[index],
      ausfuehrungen: {
        inhalt: {
          tatsachenvortragSachverhaltsbeschreibung: abschnitt.text,
          rechtlicheWuerdigung:
            index === 0 ? begruendung.rechtlicheWuerdigung : undefined,
        },
        refBeweisNummer: beweisEintraege.flatMap(({ abschnitte, beweis }) =>
          beweis && abschnitte.includes(index)
            ? [reference(beweis.beweisNummer)]
            : [],
        ),
      },
    }),
  );

  const vortraege: [
    VortragZurBegruendetheitFuerZahlungsklage<NachrichtenScope>,
    ...Array<VortragZurBegruendetheitFuerZahlungsklage<NachrichtenScope>>,
  ] = [
    ersterAbschnitt,
    ...weitereAbschnitte,
    ...beweisEintraege.map(({ vortrag }) => vortrag),
  ];

  return {
    zeugen,
    beweise: beweisEintraege.flatMap(({ beweis }) => (beweis ? [beweis] : [])),
    vortraege,
  };
}
