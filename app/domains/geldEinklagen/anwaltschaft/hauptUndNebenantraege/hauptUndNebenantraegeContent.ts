import { createElement, Fragment, type ReactNode } from "react";
import type { GeldEinklagenAnwaltschaftUserData } from "../userData";
import type { Nebenantrag } from "./hauptUndNebenantraegeSchemas";
import { getInterestText, formatSplitDate } from "./utils";

const formatPartyNumbers = (numbers: number[]): string => {
  if (numbers.length === 0) return "";

  return numbers
    .map((number, index) => (index === 0 ? `${number})` : `zu ${number})`))
    .join(", ");
};

export const getBeklagteText = (count: number): string =>
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

export const nebenantragArtLabels: Record<
  Extract<Nebenantrag, { nebenantragArt: string }>["nebenantragArt"],
  string
> = {
  vorgerichtlicheAnwaltskosten: "Vorgerichtlich Angefallene Anwaltskosten",
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
  userData,
  hauptantragIndex,
}: {
  item: Nebenantrag;
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

  if (item.type === "nebenantrag") {
    const hasInterest =
      item.nebenantragZinssatzInProzent !== undefined &&
      item.nebenantragZinsmethode !== undefined;

    const interestText = hasInterest
      ? getInterestText({
          rate:
            item.nebenantragZinssatzInProzent === ""
              ? undefined
              : item.nebenantragZinssatzInProzent,
          method: item.nebenantragZinsmethode,
          start: item.nebenantragZinsbeginn,
          end: item.nebenantragZinsende,
        })
      : "";

    return createElement(
      Fragment,
      null,
      createElement(
        "strong",
        null,
        getBeklagteText(beklagteNumbers.length),
        " zu ",
        formatPartyNumbers(beklagteNumbers),
      ),
      " ",
      getVerb(beklagteNumbers.length),
      " ",
      beklagteNumbers.length > 1 ? "als Gesamtschuldner " : "",
      "verurteilt, ",
      createElement(
        "strong",
        null,
        getKlagendeText(klagendeNumbers.length),
        " zu ",
        formatPartyNumbers(klagendeNumbers),
      ),
      " ",
      createElement("strong", null, nebenantragArtLabels[item.nebenantragArt]),
      " in Höhe von ",
      createElement("strong", null, item.nebenantragBetrag),
      hasInterest
        ? [
            " nebst ",
            createElement(
              "strong",
              null,
              interestText.trim().replace(/^nebst\s+/i, ""),
            ),
          ]
        : "",
    );
  }

  if (item.type === "annahmeverzug") {
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
  }
  return null;
};

export const getBezifferterAntragText = ({
  userData,
  hauptantragIndex,
}: {
  userData: GeldEinklagenAnwaltschaftUserData;
  hauptantragIndex: number;
}): ReactNode => {
  const hauptantrag = userData.hauptantrag?.[hauptantragIndex];

  return getAntragText({
    antrag: hauptantrag,
    userData,
    amountText: createElement(
      Fragment,
      null,
      "einen Betrag in Höhe von ",
      createElement("strong", null, `${hauptantrag?.betragForderung} Euro`),
    ),
  });
};

export const getUnbezifferterSchmerzensgeldantragText = ({
  userData,
  schmerzengeldantragIndex,
}: {
  userData: GeldEinklagenAnwaltschaftUserData;
  schmerzengeldantragIndex: number;
}): ReactNode => {
  const antrag = userData.schmerzengeldantrag?.[schmerzengeldantragIndex];

  return getAntragText({
    antrag,
    userData,
    amountText: createElement(
      Fragment,
      null,
      "ein angemessenes Schmerzensgeld in Höhe von mindestens ",
      createElement("strong", null, `${antrag?.mindestBetrag} Euro`),
    ),
  });
};

const getAntragText = ({
  antrag: hauptantrag,
  userData,
  amountText,
}: {
  antrag:
    | NonNullable<GeldEinklagenAnwaltschaftUserData["hauptantrag"]>[number]
    | NonNullable<
        GeldEinklagenAnwaltschaftUserData["schmerzengeldantrag"]
      >[number]
    | undefined;
  userData: GeldEinklagenAnwaltschaftUserData;
  amountText: ReactNode;
}): ReactNode => {
  if (!hauptantrag) return "";

  const beklagteNumbers = getSelectedPartyNumbers(
    userData.beklagten,
    hauptantrag.beklagte,
  );

  const klagendeNumbers = getSelectedPartyNumbers(
    userData.klagenden,
    hauptantrag.klagende,
  );

  const hasInterest =
    hauptantrag.zinssatzInProzent !== undefined &&
    hauptantrag.zinsmethode !== undefined;

  const interestText = hasInterest
    ? getInterestText({
        rate:
          hauptantrag.zinssatzInProzent === ""
            ? undefined
            : hauptantrag.zinssatzInProzent,
        method: hauptantrag.zinsmethode,
        start: hauptantrag.zinsbeginn,
        end: hauptantrag.zinsende,
      })
    : "";

  const hasZugUndZug =
    "zugUndZug" in hauptantrag && hauptantrag.zugUndZug === "on";

  const gegenleistung =
    "beschreibungDerGegenleistung" in hauptantrag
      ? hauptantrag.beschreibungDerGegenleistung
      : undefined;

  return createElement(
    Fragment,
    null,
    createElement(
      "strong",
      null,
      getBeklagteText(beklagteNumbers.length),
      " ",
      formatPartyNumbers(beklagteNumbers),
    ),
    " ",
    getVerb(beklagteNumbers.length),
    " ",
    beklagteNumbers.length > 1 ? "als Gesamtschuldner " : "",
    "verurteilt, ",
    createElement(
      "strong",
      null,
      getKlagendeText(klagendeNumbers.length),
      " ",
      formatPartyNumbers(klagendeNumbers),
    ),
    " ",
    klagendeNumbers.length > 1 ? "als Gesamtgläubiger " : "",
    " ",
    amountText,
    hasInterest
      ? [
          " nebst ",
          createElement(
            "strong",
            null,
            interestText.trim().replace(/^nebst\s+/i, ""),
          ),
        ]
      : "",
    hasZugUndZug
      ? [
          ", Zug-um-Zug",
          gegenleistung?.trim()
            ? [" gegen: ", createElement("strong", null, gegenleistung)]
            : "",
        ]
      : "",
    ".",
  );
};
