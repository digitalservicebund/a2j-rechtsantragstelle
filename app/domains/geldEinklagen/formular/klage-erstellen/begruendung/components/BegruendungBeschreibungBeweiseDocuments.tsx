import { arrayIsNonEmpty } from "~/util/array";
import { type BegruendungBeschreibungAbschnitteProps } from "./BegruendungBeschreibungAbschnitte";
import { Icon } from "~/components/common/Icon";
import Button from "~/components/common/Button";
import { translations } from "~/services/translations/translations";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "./BegruendungBeschreibungUebersicht";

type BegruendungBeschreibungBeweiseDocumentsProps = {
  dokumenten: BegruendungBeschreibungAbschnitteProps["abschnitte"]["dokumenten"];
} & {
  itemIndexAbschnitte: number;
};

export const BegruendungBeschreibungBeweiseDocuments = ({
  dokumenten,
  itemIndexAbschnitte,
}: BegruendungBeschreibungBeweiseDocumentsProps) => {
  if (!arrayIsNonEmpty(dokumenten)) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      {dokumenten.map((dokument, dokumentIndex) => {
        const dokumentItemIndex = String(dokumentIndex);
        const editDocumentUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitte}/dokumenten/${dokumentItemIndex}/daten`;

        return (
          <div
            key={editDocumentUrl}
            className="flex md:flex-row flex-col gap-kern-space-default py-kern-space-default border-b border-kern-neutral-200"
          >
            <div className="flex md:flex-row flex-col items-start gap-kern-space-small flex-1 min-w-0">
              <Icon name="draft" className="shrink-0" />
              <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
                {dokument.beschreibung}
              </span>
            </div>
            <div className="flex items-center gap-kern-space-small shrink-0">
              <Button
                href={editDocumentUrl}
                look="secondary"
                aria-label={translations.arraySummary.arrayEditButtonLabel.de}
                iconLeft={
                  <Icon name="edit" className="fill-kern-action-default!" />
                }
              />
              <Button
                href={"/"}
                look="secondary"
                className="border-kern-feedback-danger!"
                aria-label={translations.arraySummary.arrayDeleteButtonLabel.de}
                iconLeft={
                  <Icon name="trash" className="fill-kern-feedback-danger!" />
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
