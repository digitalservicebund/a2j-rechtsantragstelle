import { arrayIsNonEmpty } from "~/util/array";
import { type BegruendungBeschreibungAbschnitteProps } from "./BegruendungBeschreibungAbschnitte";
import { Icon } from "~/components/common/Icon";
import { type IconName } from "~/components/common/utils";
import Button from "~/components/common/Button";
import { translations } from "~/services/translations/translations";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "./BegruendungBeschreibungUebersicht";
import { useBegruendungBeschreibung } from "./useBegruendungBeschreibung";

type Props = {
  dokumenten: BegruendungBeschreibungAbschnitteProps["abschnitte"]["dokumenten"];
  personen: BegruendungBeschreibungAbschnitteProps["abschnitte"]["personen"];
} & {
  itemIndexAbschnitte: number;
};

type BeweisItemRowProps = {
  icon: IconName;
  editUrl: string;
  onDelete: () => void;
  children: React.ReactNode;
};

const BeweisItemRow = ({
  icon,
  editUrl,
  onDelete,
  children,
}: BeweisItemRowProps) => (
  <div className="flex md:flex-row flex-col gap-kern-space-default py-kern-space-default border-b border-kern-neutral-200">
    <div className="flex md:flex-row flex-col items-start gap-kern-space-small flex-1 min-w-0">
      <Icon name={icon} className="shrink-0" />
      {children}
    </div>
    <div className="flex items-center gap-kern-space-small shrink-0">
      <Button
        href={editUrl}
        look="secondary"
        aria-label={translations.arraySummary.arrayEditButtonLabel.de}
        iconLeft={<Icon name="edit" className="fill-kern-action-default!" />}
      />
      <Button
        type="button"
        look="secondary"
        className="border-kern-feedback-danger!"
        aria-label={translations.arraySummary.arrayDeleteButtonLabel.de}
        iconLeft={<Icon name="trash" className="fill-kern-feedback-danger!" />}
        onClick={onDelete}
      />
    </div>
  </div>
);

const renderPersonItem = (
  person: Exclude<
    BegruendungBeschreibungAbschnitteProps["abschnitte"]["personen"],
    undefined
  >[number],
) => {
  if (person.personAuswahl === "anotherPerson") {
    return (
      <div className="flex flex-col">
        <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
          {person.vorname} {person.nachname}
        </span>
        <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
          {person.strasse} {person.hausnummer}, {person.plz} {person.ort},{" "}
          {person.land}
        </span>
        {person.telefonnummer.length > 0 && (
          <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
            {person.telefonnummer}
          </span>
        )}
        {person.email.length > 0 && (
          <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
            {person.email}
          </span>
        )}
      </div>
    );
  }

  return (
    <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
      {person.personAuswahl === "beklagte"
        ? "Beklagte Person"
        : "Klagende Person"}
    </span>
  );
};

export const BegruendungBeschreibungBeweisItems = ({
  dokumenten,
  personen,
  itemIndexAbschnitte,
}: Props) => {
  const { onAbschnittDocumentDelete, onAbschnittPersonDelete } =
    useBegruendungBeschreibung();

  const hasDocumentItems = arrayIsNonEmpty(dokumenten);
  const hasPersonItems = arrayIsNonEmpty(personen);

  if (!hasDocumentItems && !hasPersonItems) {
    return null;
  }

  return (
    <div data-testid="beweis-items" className="flex flex-col w-full">
      {hasDocumentItems &&
        dokumenten.map((dokument, dokumentIndex) => {
          const dokumentItemIndex = String(dokumentIndex);
          const editDocumentUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitte}/dokumenten/${dokumentItemIndex}/daten`;

          return (
            <BeweisItemRow
              key={editDocumentUrl}
              icon="draft"
              editUrl={editDocumentUrl}
              onDelete={() =>
                onAbschnittDocumentDelete(
                  `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitte}/dokumenten`,
                  dokumentIndex,
                )
              }
            >
              <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
                {dokument.beschreibung}
              </span>
            </BeweisItemRow>
          );
        })}

      {hasPersonItems &&
        personen.map((person, personIndex) => {
          const personItemIndex = String(personIndex);
          const editPersonUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitte}/personen/${personItemIndex}/auswahl`;

          return (
            <BeweisItemRow
              key={editPersonUrl}
              icon="local-library"
              editUrl={editPersonUrl}
              onDelete={() =>
                onAbschnittPersonDelete(
                  `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitte}/personen`,
                  personIndex,
                )
              }
            >
              {renderPersonItem(person)}
            </BeweisItemRow>
          );
        })}
    </div>
  );
};
