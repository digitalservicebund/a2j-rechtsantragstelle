import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { formatEuro, formatSplitDate, getInterestText } from "../utils";

type Hauptantrag = NonNullable<
  GeldEinklagenAnwaltschaftUserData["hauptantrag"]
>[number];

type Nebenantrag = NonNullable<Hauptantrag["nebenantrag"]>[number];

type Annahmeverzug = NonNullable<Hauptantrag["annahmeverzug"]>[number];

type NebenantragItemData =
  | {
      type: "nebenantrag";
      item: Nebenantrag;
    }
  | {
      type: "annahmeverzug";
      item: Annahmeverzug;
    };

const formatPartyNumbers = (numbers: number[]): string => {
  if (numbers.length === 0) return "";

  return numbers
    .map((number, index) => (index === 0 ? `${number})` : `zu ${number})`))
    .join(", ");
};

const getBeklagteText = (count: number): string =>
  count === 1 ? "Die Beklagte" : "Die Beklagten";

const getKlagendeText = (count: number): string =>
  count === 1 ? "die Klagende" : "die Klagenden";

const getVerb = (count: number): string => (count === 1 ? "wird" : "werden");

const getSelectedPartyNumbers = (
  parties: { id?: string }[] | undefined,
  selection: Record<string, string> | undefined,
): number[] =>
  (parties ?? []).flatMap((party, index) =>
    party.id && selection?.[party.id] === "on" ? [index + 1] : [],
  );

export const nebenantragArtLabels: Record<
  Nebenantrag["nebenantragArt"],
  string
> = {
  vorgerichtlicheAnwaltskosten: "vorgerichtlich angefallene Anwaltskosten",
  mahnkosten: "Mahnkosten",
  inkassokosten: "Inkassokosten",
  adressermittlungskosten: "Kosten der Adressermittlung",
  ruecklastschriftgebühren: "Rücklastschriftgebühren",
  pauschale: "Pauschale",
};

export const getNebenantragItemText = ({
  item,
  type,
  userData,
  hauptantragIndex,
}: NebenantragItemData & {
  userData: GeldEinklagenAnwaltschaftUserData;
  hauptantragIndex: number;
}): string => {
  if (type === "nebenantrag") {
    const hauptantrag = userData.hauptantrag?.[hauptantragIndex];
    console.log("Current Hauptantrag:", hauptantrag);

    const beklagteNumbers = getSelectedPartyNumbers(
      userData.beklagten,
      hauptantrag?.beklagte,
    );

    const klagendeNumbers = getSelectedPartyNumbers(
      userData.klagenden,
      hauptantrag?.klagende,
    );

    const interestText = getInterestText({
      rate: item.nebenantragZinssatzInProzent,
      method: item.nebenantragZinsmethode,
      start: item.nebenantragZinsbeginn,
      end: item.nebenantragZinsende,
    });

    return `${getBeklagteText(beklagteNumbers.length)} ${formatPartyNumbers(beklagteNumbers)}
  ${getVerb(beklagteNumbers.length)}
  ${beklagteNumbers.length > 1 ? "als Gesamtschuldner " : ""}
  verurteilt,
 ${getKlagendeText(klagendeNumbers.length)}
${formatPartyNumbers(klagendeNumbers)}
  ${nebenantragArtLabels[item.nebenantragArt]}
  in Höhe von ${formatEuro(item.nebenantragBetrag)} Euro nebst Zinsen in Höhe von ${
    item.nebenantragZinssatzInProzent ?? ""
  }${interestText} zu zahlen.`;
  }

  if (item.annahmeverzugsFeststellung !== "on") {
    return "";
  }

  const date = formatSplitDate(item.annahmeverzugDatum);

  return `Feststellung des Annahmeverzugs${date ? ` seit dem ${date}` : ""}.`;
};
