import { updateSession } from "~/services/session.server";
import { type Session } from "react-router";
import { arrayIsNonEmpty } from "~/util/array";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../formular/klage-erstellen/userData";
import { getPageAndFlowDataFromPathname } from "~/services/flow/getPageAndFlowDataFromPathname";

type Abschnitte = Exclude<
  GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
  undefined
>;

type Dokument = Exclude<Abschnitte[number]["dokumenten"], undefined>[number];

const getReferencedDocument = (
  abschnitte: Abschnitte,
  reference: string,
): Dokument | undefined => {
  const [sourceAbschnittIndex, sourceDokumentIndex] = reference
    .split("-")
    .map(Number);

  return abschnitte[sourceAbschnittIndex]?.dokumenten?.[sourceDokumentIndex];
};

export const copyOrRemoveReferenceDocuments = async (
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

  const indexAbschnitt = arrayIndexes[0];
  const reuseBeweiseDokument = abschnitte[indexAbschnitt]?.reuseBeweiseDokument;

  if (!reuseBeweiseDokument) {
    return;
  }

  let dokumenten = abschnitte[indexAbschnitt].dokumenten ?? [];

  for (const [reference, value] of Object.entries(reuseBeweiseDokument)) {
    const alreadyCopied = dokumenten.some(
      (dokument) => dokument.dokumentReference === reference,
    );

    if (value === "on" && !alreadyCopied) {
      const referencedDocument = getReferencedDocument(abschnitte, reference);
      if (referencedDocument) {
        dokumenten = [
          ...dokumenten,
          {
            beschreibung: referencedDocument.beschreibung,
            dokumentReference: reference,
          },
        ];
      }
    }

    if (value === "off" && alreadyCopied) {
      dokumenten = dokumenten.filter(
        (dokument) => dokument.dokumentReference !== reference,
      );
    }
  }

  const updatedAbschnitte = [...abschnitte];
  updatedAbschnitte[indexAbschnitt] = {
    ...updatedAbschnitte[indexAbschnitt],
    dokumenten,
  };

  // Replace the array wholesale instead of deep-merging, so removed
  // (shrunk) entries actually disappear rather than lingering from the
  // previously stored (longer) array.
  updateSession(flowSession, { abschnitte: updatedAbschnitte }, (_, newData) =>
    Array.isArray(newData) ? newData : undefined,
  );
};
