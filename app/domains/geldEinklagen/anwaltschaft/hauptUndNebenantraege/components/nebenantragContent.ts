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

export const getNebenantragItemText = ({
  item,
  type,
}: NebenantragItemData): string => {
  if (type === "nebenantrag") {

    const interestText = getInterestText({
    rate: item.nebenantragZinssatzInProzent,
    method: item.nebenantragZinsmethode,
    start: item.nebenantragZinsbeginn,
    end: item.nebenantragZinsende,
  });
  
    return `Die Beklagte(n) 2), zu 3), zu 4) und zu 6) wird(werden) als Gesamtschuldner verurteilt, 
    an die Klagende(n) zu 1), zu 3), zu 5) und zu 6) als Gesamtgläubiger ${item.nebenantragArt} 
    in Höhe von ${formatEuro(item.nebenantragBetrag)} Euro nebst Zinsen in Höhe von ${item.nebenantragZinssatzInProzent ? item.nebenantragZinssatzInProzent : ""}${interestText}.`;
  }

  if (item.annahmeverzugsFeststellung !== "on") {
    return "";
  }

  const date = formatSplitDate(item.annahmeverzugDatum);

  return `Feststellung des Annahmeverzugs${date ? ` seit dem ${date}` : ""}.`;
};
