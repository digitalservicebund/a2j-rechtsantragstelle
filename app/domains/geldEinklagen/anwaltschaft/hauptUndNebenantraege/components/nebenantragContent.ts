import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { createElement, Fragment, type ReactNode } from "react";
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

const getBefindenText = (count: number): string =>
  count === 1 ? "befindet" : "befinden";

const getVerb = (count: number): string => (count === 1 ? "wird" : "werden");

const getSelectedPartyNumbers = (
  parties: Array<{ id?: string }> | undefined,
  selection: Record<string, string> | undefined,
): number[] =>
  (parties ?? []).flatMap((party, index) =>
    party.id && selection?.[party.id] === "on" ? [index + 1] : [],
  );

const nebenantragArtLabels: Record<Nebenantrag["nebenantragArt"], string> = {
  vorgerichtlicheAnwaltskosten: "vorgerichtlich angefallene Anwaltskosten",
  mahnkosten: "Mahnkosten",
  inkassokosten: "Inkassokosten",
  adressermittlungskosten: "Kosten der Adressermittlung",
  ruecklastschriftgebühren: "Rücklastschriftgebühren",
  pauschale: "Pauschale",
};

export const getAlphabeticalEnumeration = (index: number): string =>
  `${String.fromCharCode(97 + index)}.`;

export const getNebenantragItemText = ({
  item,
  type,
  userData,
  hauptantragIndex,
}: NebenantragItemData & {
  userData: GeldEinklagenAnwaltschaftUserData;
  hauptantragIndex: number;
}): ReactNode => {
  const hauptantrag = userData.hauptantrag?.[hauptantragIndex];
  const beklagteNumbers = getSelectedPartyNumbers(
    userData.beklagten,
    hauptantrag?.beklagte,
  );

  const klagendeNumbers = getSelectedPartyNumbers(
    userData.klagenden,
    hauptantrag?.klagende,
  );

  if (type === "nebenantrag") {
    const interestText = getInterestText({
      rate: item.nebenantragZinssatzInProzent,
      method: item.nebenantragZinsmethode,
      start: item.nebenantragZinsbeginn,
      end: item.nebenantragZinsende,
    });

    return createElement(
      Fragment,
      null,
      getBeklagteText(beklagteNumbers.length),
      " ",
      formatPartyNumbers(beklagteNumbers),
      " ",
      getVerb(beklagteNumbers.length),
      " ",
      beklagteNumbers.length > 1 ? "als Gesamtschuldner " : "",
      "verurteilt, ",
      getKlagendeText(klagendeNumbers.length),
      " ",
      formatPartyNumbers(klagendeNumbers),
      " ",
      createElement("strong", null, nebenantragArtLabels[item.nebenantragArt]),
      " in Höhe von ",
      createElement(
        "strong",
        null,
        `${formatEuro(item.nebenantragBetrag)} Euro`,
      ),
      " nebst Zinsen in Höhe von ",
      createElement(
        "strong",
        null,
        item.nebenantragZinssatzInProzent ?? "",
        interestText,
      ),
      " zu zahlen.",
    );
  }
  if (item.annahmeverzugsFeststellung !== "on") {
    return "";
  }

  const date = formatSplitDate(item.annahmeverzugDatum);

  return createElement(
    Fragment,
    null,
    "Es wird festgestellt, dass sich ",
    getBeklagteText(beklagteNumbers.length).toLowerCase(),
    " ",
    formatPartyNumbers(beklagteNumbers),
    " mit der Annahme der im Antrag zu ",
    `${hauptantragIndex + 1})`,
    " genannten Gegenleistung",
    date ? ` seit dem ${date}` : "",
    " in ",
    createElement("strong", null, "Annahmeverzug"),
    " ",
    getBefindenText(beklagteNumbers.length),
    ".",
  );
};
