import { createElement, Fragment, type ReactNode } from "react";
import type { GeldEinklagenAnwaltschaftUserData } from "../userData";
import type {
  Nebenantrag,
  SchmerzengeldNebenantrag,
} from "./hauptUndNebenantraegeSchemas";
import { getOrderedKlageParties } from "../shared/klageParties/klagePartyOrdering";
import type { KlageParteiVerhaeltnis } from "../shared/klageParties/klagePartySchemas";
import { getInterestText, formatSplitDate } from "./utils";
import { translations } from "~/services/translations/translations";

const formatPartyNumbers = (numbers: number[]): string => {
  return numbers
    .map((number, index) => {
      const separator =
        index === 0 ? "" : index === numbers.length - 1 ? " und " : ", ";
      return `${separator}${index === 0 ? "" : "zu "}${number})`;
    })
    .join("");
};

const formatNumbers = (numbers: number[]) =>
  numbers.length > 0 ? `zu ${formatPartyNumbers(numbers)}` : "";

export const getBeklagteText = (count: number): string =>
  count === 1 ? "Der Beklagte" : "Die Beklagten";

export const getKlagendeText = (count: number): string =>
  count === 1 ? "den Kläger" : "die Kläger";

export const getBefindenText = (count: number): string =>
  count === 1 ? "befindet" : "befinden";

export const getVerb = (count: number): string =>
  count === 1 ? "wird" : "werden";

const getSelectedPartyNumbers = (
  userData: GeldEinklagenAnwaltschaftUserData,
  relationship: KlageParteiVerhaeltnis,
  selection: Record<string, string> | undefined,
): number[] =>
  getOrderedKlageParties(userData, relationship).flatMap(
    ({ partei, displayIndex }) =>
      partei.id && selection?.[partei.id] === "on" ? [displayIndex + 1] : [],
  );

export const nebenantragArtLabels: Record<
  Extract<Nebenantrag, { nebenantragArt: string }>["nebenantragArt"],
  string
> = {
  vorgerichtlicheAnwaltskosten: "vorgerichtlich angefallene Anwaltskosten",
  mahnkosten: "Mahnkosten",
  inkassokosten: "Inkassokosten",
  adressermittlungskosten: "Adressermittlungkosten",
  ruecklastschriftgebühren: "Rücklastschriftgebühren",
  pauschale: "eine Pauschale gemäß § 288 Absatz 5 Satz 1 BGB",
};

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
    userData,
    "beklagte",
    hauptantrag?.beklagte,
  );

  const klagendeNumbers = getSelectedPartyNumbers(
    userData,
    "klagende",
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
        "a",
        null,
        getBeklagteText(beklagteNumbers.length),
        " zu ",
        formatPartyNumbers(beklagteNumbers),
      ),
      " ",
      getVerb(beklagteNumbers.length),
      " ",
      beklagteNumbers.length > 1 ? "als Gesamtschuldner " : "",
      "verurteilt",
      createElement(
        "a",
        null,
        " an, ",
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
      createElement(
        "strong",
        null,
        `${nebenantrag.nebenantragBetrag} ${translations.currency.euro.de}`,
      ),
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
      " zu zahlen.",
    );
  }

  if (item.type === "annahmeverzug") {
    const date = formatSplitDate(item.annahmeverzugDatum);

    return createElement(
      Fragment,
      null,
      "Es wird festgestellt, dass sich ",
      getBeklagteText(beklagteNumbers.length).replace(/^./, (letter) =>
        letter.toLowerCase(),
      ),
      " zu ",
      formatPartyNumbers(beklagteNumbers),
      " mit der Annahme der im Antrag zu ",
      `${parentIndex + 1})`,
      " genannten Gegenleistung",
      date
        ? createElement(
            Fragment,
            null,
            createElement("strong", null, ` seit dem ${date}`),
          )
        : "",
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
      createElement(
        "strong",
        null,
        `${hauptantrag?.betragForderung} ${translations.currency.euro.de}`,
      ),
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
      "ein in das Ermessen des Gerichts gestelltes ",
      createElement("strong", null, "Schmerzensgeld"),
      " zu zahlen, welches einen Betrag von ",
      createElement("strong", null, antrag?.mindestBetrag),
      " ",
      createElement("strong", null, translations.currency.euro.de),
      " nicht unterschreiten sollte",
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
    userData,
    "beklagte",
    hauptantrag.beklagte,
  );

  const klagendeNumbers = getSelectedPartyNumbers(
    userData,
    "klagende",
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
    beklagteNumbers.length > 1
      ? createElement("strong", null, "als Gesamtschuldner ")
      : "",
    "verurteilt an, ",
    createElement(
      "strong",
      null,
      isSchmerzensgeldantrag
        ? klagendeNumbers.length === 1
          ? "der Kläger"
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
      ? createElement(
          Fragment,
          null,
          createElement("strong", null, " Zug-um-Zug"),
          gegenleistung?.trim()
            ? createElement(
                Fragment,
                null,
                " gegen ",
                createElement("strong", null, gegenleistung),
              )
            : "",
        )
      : "",
    isSchmerzensgeldantrag ? "" : " zu zahlen",
    ".",
  );
};
