import {
  type Hauptantrag,
  type Nebenantrag,
  type Schmerzensgeldantrag,
  type SchmerzengeldNebenantrag,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import { hauptantraegeTypes as numberedAntragArrays } from "~/domains/geldEinklagen/anwaltschaft/services/antragHelpers";
import { nebenantragArtLabels } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeContent";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";

type AntragKind =
  | "zahlungsantrag"
  | "schmerzensgeldantrag"
  | "nebenantrag"
  | "prozessantrag"
  | "sonstigerAntrag";

export type OrderedAntrag = {
  // Identifies the Antrag within the current user data.
  // Dot-notation for normal Anträge (e.g. arrayName.index.subArray.index)
  // Fixed antragId for Prozessanträge (e.g. "muendlicheVerhandlung").
  key: string;
  // Stable link to `vortraege[].antragId`, assigned when the Antrag is saved.
  antragId: string | undefined;
  dataPath: string | undefined;
  kind: AntragKind;
  title: string;
  shortTitle?: string;
  isNebenantrag: boolean;
  antragNumber?: number;
};

export type AntraegeUserData = Pick<
  GeldEinklagenAnwaltschaftUserData,
  | "hauptantrag"
  | "schmerzengeldantrag"
  | "muendlicheVerhandlung"
  | "videoverhandlung"
  | "versaeumnisurteil"
  | "sonstigeAntraege"
>;

const strings = translations.geldEinklagenAnwaltschaft;

/**
 * Converts an index within one of the numbered Antrag arrays into the Antrag
 * number shared across Zahlungs-, Schmerzensgeld- and Sonstige Anträge.
 */
export const getAntragNumber = (
  userData: Pick<AntraegeUserData, (typeof numberedAntragArrays)[number]>,
  arrayName: (typeof numberedAntragArrays)[number],
  index: number,
) =>
  numberedAntragArrays
    .slice(0, numberedAntragArrays.indexOf(arrayName))
    .reduce((offset, name) => offset + (userData[name]?.length ?? 0), 0) +
  index +
  1;

const getTitleWithSchlagwort = (title: string, schlagwort?: string) =>
  schlagwort ? `${title} (${schlagwort})` : title;

/**
 * Title of a Zahlungs-, Schmerzensgeld- or Sonstiger Antrag by its position, so
 * it also works for an item that is only just being added.
 */
export const getNumberedAntragTitle = (
  userData: Pick<AntraegeUserData, (typeof numberedAntragArrays)[number]>,
  arrayName: (typeof numberedAntragArrays)[number],
  index: number,
  withSchlagwort?: boolean,
  /**
   * If true, returns the full version of the title
   * example: "Bezifferter Zahlungsantrag 1" instead of "Zahlungsantrag 1"
   */
  fullFormat?: boolean,
) => {
  const antragNumber = getAntragNumber(userData, arrayName, index);
  if (arrayName === "sonstigeAntraege") {
    return withSchlagwort
      ? getTitleWithSchlagwort(
          `${strings.sonstigerAntrag.de} ${antragNumber}`,
          userData.sonstigeAntraege?.[index]?.internesSchlagwort,
        )
      : `${strings.sonstigerAntrag.de} ${antragNumber}`;
  }
  const zahlungsantragHeadline = fullFormat
    ? translations.geldEinklagenAnwaltschaft.bezifferterZahlungsantrag.de
    : translations.geldEinklagenAnwaltschaft.zahlungsantrag.de;
  const schmerzensgeldHeadline = fullFormat
    ? translations.geldEinklagenAnwaltschaft.unbezifferterSchmerzensgeldantrag
        .de
    : translations.geldEinklagenAnwaltschaft.schmerzensgeldantrag.de;
  const headline =
    arrayName === "hauptantrag"
      ? zahlungsantragHeadline
      : schmerzensgeldHeadline;

  return withSchlagwort
    ? getTitleWithSchlagwort(
        `${headline} ${antragNumber}`,
        userData[arrayName]?.[index]?.internesSchlagwortForderung,
      )
    : `${headline} ${antragNumber}`;
};

export const getAbsatzSubtitle = (antrag: OrderedAntrag | undefined) => {
  if (!antrag) return "";
  switch (antrag.kind) {
    case "zahlungsantrag":
      return `(zum ${antrag.title.replace("Bezifferter", "bezifferten")})`;
    case "schmerzensgeldantrag":
      return `(zum ${antrag.title.replace("Unbezifferter", "unbezifferten")})`;
    case "nebenantrag":
      return `(zum ${antrag.title})`;
    case "prozessantrag":
      return `(${antrag.title.includes("Ausführung") ? "zur" : "zum"} ${antrag.title.replace("Prozessuale", "prozessualen")})`;
    case "sonstigerAntrag":
      return `(zum ${antrag.title.replace("Sonstiger", "sonstigen")})`;
  }
};

export const getNebenantragTitle = (
  nebenantrag: Nebenantrag | SchmerzengeldNebenantrag,
  parentAntragNumber: number,
) => {
  const isAnnahmeverzug =
    "type" in nebenantrag && nebenantrag.type === "annahmeverzug";
  const title = isAnnahmeverzug
    ? strings.feststellungsantrag.de
    : strings.nebenantrag.de;

  let nebenantragTypeInfo: string;
  if ("schmerzengeldNebenantragArt" in nebenantrag) {
    nebenantragTypeInfo =
      nebenantragArtLabels[nebenantrag.schmerzengeldNebenantragArt];
  } else if (nebenantrag.type === "annahmeverzug") {
    nebenantragTypeInfo = strings.annahmeverzug.de;
  } else {
    nebenantragTypeInfo = nebenantragArtLabels[nebenantrag.nebenantragArt];
  }

  return `${title} ${strings.zuAntrag.de} ${parentAntragNumber} - ${nebenantragTypeInfo}`;
};

const getProzessantraege = (
  userData: AntraegeUserData,
): Array<{ antragId: string; title: string }> => {
  const prozessantrag = (label: string) =>
    `${strings.prozessantrag.de} – ${label}`;
  return [
    userData.muendlicheVerhandlung === "on" && {
      antragId: "muendlicheVerhandlung",
      title: prozessantrag(strings.muendlicheVerhandlungTitle.de),
    },
    userData.videoverhandlung === "yes" && {
      antragId: "videoverhandlung",
      title: prozessantrag(strings.videoverhandlungTitle.de),
    },
    userData.videoverhandlung === "no" && {
      antragId: "bedenkenVideoverhandlung",
      title: `${strings.prozessualeAusfuehrung.de} – ${strings.bedenkenVideoverhandlungTitle.de}`,
    },
    userData.versaeumnisurteil === "on" && {
      antragId: "versaeumnisurteil",
      title: prozessantrag(strings.versaeumnisurteilTitle.de),
    },
  ].filter((antrag) => antrag !== false);
};

/**
 * Single source of truth for the order of Anträge throughout the Klageschrift:
 * Zahlungsanträge (+ Nebenanträge) → Schmerzensgeldanträge (+ Nebenanträge)
 * → Prozessanträge → Sonstige Anträge. Zahlungs-, Schmerzensgeld- and
 * Sonstige Anträge share one Antrag numbering; Prozessanträge are unnumbered.
 */
export const getOrderedAntraege = (
  userData: AntraegeUserData,
  withSchlagwort?: boolean,
): OrderedAntrag[] => {
  const result: OrderedAntrag[] = [];

  const addHauptantraege = (
    arrayName: "hauptantrag" | "schmerzengeldantrag",
    antraege: Array<Hauptantrag | Schmerzensgeldantrag>,
  ) => {
    for (const [index, antrag] of antraege.entries()) {
      const antragNumber = getAntragNumber(userData, arrayName, index);
      const dataPath = `${arrayName}.${index}`;
      result.push({
        key: dataPath,
        antragId: antrag.id || undefined,
        dataPath,
        kind:
          arrayName === "hauptantrag"
            ? "zahlungsantrag"
            : "schmerzensgeldantrag",
        title: getNumberedAntragTitle(
          userData,
          arrayName,
          index,
          withSchlagwort,
          true,
        ),
        shortTitle: getNumberedAntragTitle(
          userData,
          arrayName,
          index,
          withSchlagwort,
        ),
        isNebenantrag: false,
        antragNumber,
      });
      for (const [nebenIndex, nebenantrag] of (
        antrag.nebenantraege ?? []
      ).entries()) {
        const nebenDataPath = `${dataPath}.nebenantraege.${nebenIndex}`;
        result.push({
          key: nebenDataPath,
          antragId: nebenantrag.id || undefined,
          dataPath: nebenDataPath,
          kind: "nebenantrag",
          title: getNebenantragTitle(nebenantrag, antragNumber),
          isNebenantrag: true,
          antragNumber,
        });
      }
    }
  };

  addHauptantraege("hauptantrag", userData.hauptantrag ?? []);
  addHauptantraege("schmerzengeldantrag", userData.schmerzengeldantrag ?? []);

  for (const [index, antrag] of (userData.sonstigeAntraege ?? []).entries()) {
    const dataPath = `sonstigeAntraege.${index}`;
    const title = getNumberedAntragTitle(
      userData,
      "sonstigeAntraege",
      index,
      withSchlagwort,
    );
    result.push({
      key: dataPath,
      antragId: antrag.id || undefined,
      dataPath,
      kind: "sonstigerAntrag",
      title,
      shortTitle: title,
      isNebenantrag: false,
      antragNumber: getAntragNumber(userData, "sonstigeAntraege", index),
    });
  }

  for (const { antragId, title } of getProzessantraege(userData)) {
    result.push({
      key: antragId,
      antragId,
      dataPath: undefined,
      kind: "prozessantrag",
      title,
      shortTitle: title,
      isNebenantrag: false,
    });
  }

  return result;
};

export const getVortragIndex = (
  userData: Pick<GeldEinklagenAnwaltschaftUserData, "vortraege">,
  antragId: string | undefined,
) =>
  antragId === undefined
    ? -1
    : (userData.vortraege ?? []).findIndex(
        (vortrag) => vortrag.antragId === antragId,
      );
