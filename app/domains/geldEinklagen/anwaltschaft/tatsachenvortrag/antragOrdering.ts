import {
  type Hauptantraege,
  type Nebenantrag,
  type Schmerzensgeldantrag,
  type SchmerzengeldNebenantrag,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
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
  // Stable link to `vortraege[].antragId`. Undefined until the first Vortrag.
  antragId: string | undefined;
  dataPath: string | undefined;
  kind: AntragKind;
  title: string;
  isNebenantrag: boolean;
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

const numberedAntragArrays = [
  "hauptantrag",
  "schmerzengeldantrag",
  "sonstigeAntraege",
] as const;

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

const getHauptantragTitle = (
  antrag: Hauptantraege | Schmerzensgeldantrag,
  antragNumber: number,
) =>
  getTitleWithSchlagwort(
    `${
      "betragForderung" in antrag
        ? strings.bezifferterZahlungsantragHeadline.de
        : strings.unbezifferterZahlungsantragHeadline.de
    } ${antragNumber}`,
    antrag.internesSchlagwortForderung,
  );

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
): OrderedAntrag[] => {
  const result: OrderedAntrag[] = [];

  const addHauptantraege = (
    arrayName: "hauptantrag" | "schmerzengeldantrag",
    antraege: Array<Hauptantraege | Schmerzensgeldantrag>,
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
        title: getHauptantragTitle(antrag, antragNumber),
        isNebenantrag: false,
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
        });
      }
    }
  };

  addHauptantraege("hauptantrag", userData.hauptantrag ?? []);
  addHauptantraege("schmerzengeldantrag", userData.schmerzengeldantrag ?? []);

  for (const { antragId, title } of getProzessantraege(userData)) {
    result.push({
      key: antragId,
      antragId,
      dataPath: undefined,
      kind: "prozessantrag",
      title,
      isNebenantrag: false,
    });
  }

  for (const [index, antrag] of (userData.sonstigeAntraege ?? []).entries()) {
    const antragNumber = getAntragNumber(userData, "sonstigeAntraege", index);
    const dataPath = `sonstigeAntraege.${index}`;
    result.push({
      key: dataPath,
      antragId: antrag.id || undefined,
      dataPath,
      kind: "sonstigerAntrag",
      title: getTitleWithSchlagwort(
        `${strings.sonstigerAntrag.de} ${antragNumber}`,
        antrag.internesSchlagwort,
      ),
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
