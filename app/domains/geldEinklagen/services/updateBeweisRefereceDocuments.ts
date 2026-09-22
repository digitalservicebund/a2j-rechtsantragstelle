import { type Session } from "react-router";
import { updateSession } from "~/services/session.server";
import { getPageAndFlowDataFromPathname } from "~/services/flow/getPageAndFlowDataFromPathname";
import { arrayIsNonEmpty } from "~/util/array";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../formular/klage-erstellen/userData";
import { getDokumentLocationsWithReference } from "./deleteBeweisDokumentReference";

type Abschnitte = Exclude<
  GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
  undefined
>;

export const updateBeweisReferenceDocuments = async (
  request: Request,
  userData: GeldEinklagenFormularKlageErstellenUserData,
  flowSession: Session,
) => {
  const { pathname } = new URL(request.url.replaceAll(".data", ""));
  const { arrayIndexes } = getPageAndFlowDataFromPathname(pathname);

  const abschnitte = userData.abschnitte;

  if (!arrayIsNonEmpty(arrayIndexes) || !arrayIsNonEmpty(abschnitte)) {
    return;
  }

  const [abschnittIndex, dokumentIndex] = arrayIndexes;
  const currentDokument =
    abschnitte[abschnittIndex]?.dokumenten?.[dokumentIndex];

  if (!currentDokument) {
    return;
  }

  // A copy points at the original via `dokumentReference`; the original is its own reference.
  const mainReference =
    currentDokument.dokumentReference ?? `${abschnittIndex}-${dokumentIndex}`;
  const [mainAbschnittIndex, mainDokumentIndex] = mainReference
    .split("-")
    .map(Number);

  // Every other place holding this same document: the original itself, and any
  // other abschnitt that reuses it.
  const relatedLocations = [
    { abschnittIndex: mainAbschnittIndex, dokumentIndex: mainDokumentIndex },
    ...getDokumentLocationsWithReference(abschnitte, mainReference),
  ].filter(
    (location) =>
      location.abschnittIndex !== abschnittIndex ||
      location.dokumentIndex !== dokumentIndex,
  );

  if (!arrayIsNonEmpty(relatedLocations)) {
    return;
  }

  const updatedAbschnitte: Abschnitte = structuredClone(abschnitte);

  relatedLocations.forEach((location) => {
    const dokument =
      updatedAbschnitte[location.abschnittIndex]?.dokumenten?.[
        location.dokumentIndex
      ];

    if (dokument) {
      dokument.beschreibung = currentDokument.beschreibung;
    }
  });

  updateSession(flowSession, { abschnitte: updatedAbschnitte }, (_, newData) =>
    Array.isArray(newData) ? newData : undefined,
  );
};
