import { createElement, Fragment, type ReactNode } from "react";
import type { GeldEinklagenAnwaltschaftUserData } from "../userData";
import type {
  Nebenantrag,
  SchmerzengeldNebenantrag,
} from "./hauptUndNebenantraegeSchemas";
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
  `${String.fromCodePoint(97 + index)}.`;

export const getNebenantragItemText = ({
  item,
  userData,
  hauptantragIndex,
  schmerzengeldantragIndex,
}: {
  userData: GeldEinklagenAnwaltschaftUserData;
} & (
  | {
      item: Nebenantrag;
      hauptantragIndex: number;
      schmerzengeldantragIndex?: never;
    }
  | {
      item: SchmerzengeldNebenantrag;
      hauptantragIndex?: never;
      schmerzengeldantragIndex: number;
    }
)): ReactNode => {
  const parentIndex = hauptantragIndex ?? schmerzengeldantragIndex;
  const hauptantrag =
    hauptantragIndex !== undefined
      ? userData.hauptantrag?.[hauptantragIndex]
      : userData.schmerzengeldantrag?.[schmerzengeldantragIndex];

  const beklagteNumbers = getSelectedPartyNumbers(
    userData.beklagten,
    hauptantrag?.beklagte,
  );

  const klagendeNumbers = getSelectedPartyNumbers(
    userData.klagenden,
    hauptantrag?.klagende,
  );

  if (!("type" in item) || item.type === "nebenantrag") {
    const nebenantrag =
      "schmerzengeldNebenantragArt" in item
        ? {
            nebenantragArt: item.schmerzengeldNebenantragArt,
            nebenantragBetrag: item.schmerzengeldNebenantragBetrag,
            nebenantragZinssatzInProzent:
              item.schmerzengeldNebenantragZinssatzInProzent,
            nebenantragZinsmethode: item.schmerzengeldNebenantragZinsmethode,
            nebenantragZinsbeginn: item.schmerzengeldNebenantragZinsbeginn,
            nebenantragZinsende: item.schmerzengeldNebenantragZinsende,
          }
        : item;
    const hasInterest =
      nebenantrag.nebenantragZinssatzInProzent !== undefined &&
      nebenantrag.nebenantragZinsmethode !== undefined;

    const interestText = hasInterest
      ? getInterestText({
          rate:
            nebenantrag.nebenantragZinssatzInProzent === ""
              ? undefined
              : nebenantrag.nebenantragZinssatzInProzent,
          method: nebenantrag.nebenantragZinsmethode,
          start: nebenantrag.nebenantragZinsbeginn,
          end: nebenantrag.nebenantragZinsende,
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
      createElement(
        "strong",
        null,
        nebenantragArtLabels[nebenantrag.nebenantragArt],
      ),
      " in Höhe von ",
      createElement("strong", null, nebenantrag.nebenantragBetrag),
      interestText
        ? createElement(
            Fragment,
            null,
            " nebst ",
            createElement(
              "strong",
              null,
              interestText.trim().replace(/^nebst\s+/i, ""),
            ),
          )
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
      `${parentIndex + 1})`,
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
    isSchmerzensgeldantrag: true,
    amountText: createElement(
      Fragment,
      null,
      "ein in das Ermessen des Gerichts gestelltes Schmerzensgeld zu zahlen, welches einen Betrag von ",
      createElement("strong", null, antrag?.mindestBetrag),
      " Euro nicht unterschreiten sollte",
    ),
  });
};

const getAntragText = ({
  antrag: hauptantrag,
  userData,
  amountText,
  isSchmerzensgeldantrag = false,
}: {
  antrag:
    | NonNullable<GeldEinklagenAnwaltschaftUserData["hauptantrag"]>[number]
    | NonNullable<
        GeldEinklagenAnwaltschaftUserData["schmerzengeldantrag"]
      >[number]
    | undefined;
  userData: GeldEinklagenAnwaltschaftUserData;
  amountText: ReactNode;
  isSchmerzensgeldantrag?: boolean;
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
        sinceRechtshaengigkeit: isSchmerzensgeldantrag,
      })
    : "";

  const hasZugUndZug =
    "zugUndZug" in hauptantrag && hauptantrag.zugUndZug === "on";

  const gegenleistung =
    "beschreibungDerGegenleistung" in hauptantrag
      ? hauptantrag.beschreibungDerGegenleistung
      : undefined;

  const formatNumbers = isSchmerzensgeldantrag
    ? (numbers: number[]) =>
        numbers
          .map((number, index) => {
            const separator =
              index === 0 ? "" : index === numbers.length - 1 ? " und " : ", ";
            return `${separator}zu ${number})`;
          })
          .join("")
    : formatPartyNumbers;

  return createElement(
    Fragment,
    null,
    createElement(
      "strong",
      null,
      isSchmerzensgeldantrag && beklagteNumbers.length === 1
        ? "Der Beklagte"
        : getBeklagteText(beklagteNumbers.length),
      " ",
      formatNumbers(beklagteNumbers),
    ),
    " ",
    getVerb(beklagteNumbers.length),
    " ",
    beklagteNumbers.length > 1 ? "als Gesamtschuldner " : "",
    isSchmerzensgeldantrag ? "verurteilt, an " : "verurteilt, ",
    createElement(
      "strong",
      null,
      isSchmerzensgeldantrag
        ? klagendeNumbers.length === 1
          ? "den Kläger"
          : "die Kläger"
        : getKlagendeText(klagendeNumbers.length),
      " ",
      formatNumbers(klagendeNumbers),
    ),
    " ",
    klagendeNumbers.length > 1 ? "als Gesamtgläubiger " : "",
    isSchmerzensgeldantrag ? "" : " ",
    amountText,
    interestText
      ? createElement(
          Fragment,
          null,
          isSchmerzensgeldantrag ? ", nebst " : " nebst ",
          createElement(
            "strong",
            null,
            interestText.trim().replace(/^nebst\s+/i, ""),
          ),
        )
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
