import { arrayIsNonEmpty } from "~/util/array";
import { type BegruendungBeschreibungAbschnitteProps } from "./BegruendungBeschreibungAbschnitte";
import { Icon } from "~/components/common/Icon";
import Button from "~/components/common/Button";
import { translations } from "~/services/translations/translations";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "./BegruendungBeschreibungUebersicht";
import { useBegruendungBeschreibung } from "./useBegruendungBeschreibung";
import { BeweisItemRow } from "./BeweisItemRow";
import capitalize from "lodash/capitalize";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { Badge } from "~/components/content/Badge";
import { useRef } from "react";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { DeleteDialog } from "./DeleteDialog";
import classNames from "classnames";

type Props = {
  dokumenten: BegruendungBeschreibungAbschnitteProps["abschnitt"]["dokumenten"];
  personen: BegruendungBeschreibungAbschnitteProps["abschnitt"]["personen"];
} & {
  itemIndexAbschnitt: number;
};

const editButtonLabelLowercase =
  translations.arraySummary.arrayEditButtonLabel.de.toLowerCase();
const deleteButtonLabelLowercase =
  translations.arraySummary.arrayDeleteButtonLabel.de.toLowerCase();

export const hasPersonDetails = (
  person: Exclude<Pick<Props, "personen">["personen"], undefined>[number],
) => {
  return (
    person.personAuswahl === "anotherPerson" &&
    objectKeysNonEmpty(person, [
      "vorname",
      "nachname",
      "strasse",
      "hausnummer",
      "plz",
      "ort",
      "land",
    ])
  );
};

const renderArialLabelForDocumentItem = ({
  beschreibung,
}: Exclude<Pick<Props, "dokumenten">["dokumenten"], undefined>[number]) => {
  const firstTenWords = beschreibung.split(" ").slice(0, 10).join(" ");

  return {
    editButtonLabel: `${translations.geldEinklagen.begruendungBeschreibungBeweiseDocumentButtonArialLabel.de} ${editButtonLabelLowercase}: ${firstTenWords} ${translations.geldEinklagen.begruendungBeschreibungBeweiseDocumentButtonArialLabelSuffix.de}`,
    deleteButtonLabel: `${translations.geldEinklagen.begruendungBeschreibungBeweiseDocumentButtonArialLabel.de} ${deleteButtonLabelLowercase}: ${firstTenWords} ${translations.geldEinklagen.begruendungBeschreibungBeweiseDocumentButtonArialLabelSuffix.de}`,
  };
};

const renderArialLabelForPersonItem = (
  person: Exclude<Pick<Props, "personen">["personen"], undefined>[number],
) => {
  if (person.personAuswahl === "anotherPerson") {
    if (!hasPersonDetails(person)) {
      return {
        editButtonLabel: `${translations.geldEinklagen.begruendungBeschreibungBeweisePersonWithMissingDetails.de} ${editButtonLabelLowercase}`,
        deleteButtonLabel: `${translations.geldEinklagen.begruendungBeschreibungBeweisePersonWithMissingDetails.de} ${deleteButtonLabelLowercase}`,
      };
    }

    return {
      editButtonLabel: `${person.vorname} ${person.nachname} ${editButtonLabelLowercase}`,
      deleteButtonLabel: `${person.vorname} ${person.nachname} ${deleteButtonLabelLowercase}`,
    };
  }

  if (person.personAuswahl === "beklagte") {
    return {
      editButtonLabel: `${translations.geldEinklagen.begruendungBeschreibungBeweiseBeklagteButtonArialLabel.de} ${editButtonLabelLowercase}`,
      deleteButtonLabel: `${translations.geldEinklagen.begruendungBeschreibungBeweiseBeklagteButtonArialLabel.de} ${deleteButtonLabelLowercase}`,
    };
  }

  return {
    editButtonLabel: `${translations.geldEinklagen.begruendungBeschreibungBeweiseKlagendenButtonArialLabel.de} ${editButtonLabelLowercase}`,
    deleteButtonLabel: `${translations.geldEinklagen.begruendungBeschreibungBeweiseKlagendenButtonArialLabel.de} ${deleteButtonLabelLowercase}`,
  };
};

type ItemButtonsProps = {
  editUrl: string;
  onDelete: () => void;
  ariaLabel: {
    editButtonLabel: string;
    deleteButtonLabel: string;
  };
  shouldRenderEditButton?: boolean;
  deleteDialogTitle: string;
  deleteDialogDescription: React.ReactNode;
};

const ItemButtons = ({
  editUrl,
  onDelete,
  ariaLabel,
  shouldRenderEditButton = true,
  deleteDialogTitle,
  deleteDialogDescription,
}: ItemButtonsProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const jsAvailable = useJsAvailable();

  const onDeleteClicked = () => {
    if (!jsAvailable) {
      onDelete();
      return;
    }

    dialogRef.current?.showModal();
  };

  return (
    <>
      <Button
        href={editUrl}
        look="secondary"
        className="w-full"
        hidden={!shouldRenderEditButton}
        aria-label={ariaLabel.editButtonLabel}
        iconLeft={<Icon name="edit" className="fill-kern-action-default!" />}
      />
      <Button
        type="button"
        look="secondary"
        aria-haspopup="dialog"
        className="border-kern-feedback-danger! w-full"
        aria-label={ariaLabel.deleteButtonLabel}
        iconLeft={<Icon name="trash" className="fill-kern-feedback-danger!" />}
        onClick={onDeleteClicked}
      />
      <DeleteDialog
        title={deleteDialogTitle}
        description={deleteDialogDescription}
        onClickDelete={onDelete}
        closeSurvey={() => dialogRef.current?.close()}
        dialogRef={dialogRef}
      />
    </>
  );
};

export const renderPersonItem = (
  person: Exclude<
    BegruendungBeschreibungAbschnitteProps["abschnitt"]["personen"],
    undefined
  >[number],
) => {
  if (person.personAuswahl === "anotherPerson") {
    if (!hasPersonDetails(person)) {
      return (
        <Badge
          icon="warning"
          variant="warning"
          className="py-kern-space-small! px-kern-space-default! border-2!"
        >
          {
            translations.geldEinklagen
              .begruendungBeschreibungBeweisePersonNotFilled.de
          }
        </Badge>
      );
    }

    const anrede = person.anrede === "none" ? "" : capitalize(person.anrede);

    return (
      <div className="flex flex-col">
        <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
          {anrede} {person.title} {person.vorname} {person.nachname}
        </span>
        <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
          {person.strasse} {person.hausnummer}, {person.plz} {person.ort},{" "}
          {person.land}
        </span>
        {objectKeysNonEmpty(person, ["telefonnummer"]) && (
          <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
            {person.telefonnummer}
          </span>
        )}
        {objectKeysNonEmpty(person, ["email"]) && (
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
  itemIndexAbschnitt,
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
          const editDocumentUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/dokumenten/${dokumentItemIndex}/daten`;
          const contentDescription = (
            <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
              {dokument.beschreibung}
            </span>
          );

          const deleteDialogDescription = (
            <>
              <span>
                {
                  translations.geldEinklagen
                    .begruendungBeschreibungBeweiseDeleteDialogDocumentDescription
                    .de
                }
              </span>
              <div
                className={classNames(
                  "flex sm:flex-row flex-col items-start gap-kern-space-small flex-1 min-w-0",
                )}
              >
                <Icon name="draft" className="shrink-0" />
                {contentDescription}
              </div>
            </>
          );

          return (
            <BeweisItemRow
              key={editDocumentUrl}
              icon="draft"
              classNameParent="border-b border-kern-neutral-200"
              content={contentDescription}
              buttons={
                <ItemButtons
                  editUrl={editDocumentUrl}
                  onDelete={() =>
                    onAbschnittDocumentDelete(
                      `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/dokumenten`,
                      itemIndexAbschnitt,
                      dokumentIndex,
                    )
                  }
                  ariaLabel={renderArialLabelForDocumentItem(dokument)}
                  deleteDialogTitle={
                    translations.geldEinklagen
                      .begruendungBeschreibungBeweiseDocumentDeleteDialogTitle
                      .de
                  }
                  deleteDialogDescription={deleteDialogDescription}
                />
              }
            />
          );
        })}

      {hasPersonItems &&
        personen.map((person, personIndex) => {
          const personItemIndex = String(personIndex);

          const shouldRenderEditButton =
            person.personAuswahl === "anotherPerson";

          const editPersonUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/personen/${personItemIndex}/daten`;
          const hasDetails = hasPersonDetails(person);
          const contentDescription = renderPersonItem(person);

          const deleteDialogDescription = (
            <>
              <span>
                {
                  translations.geldEinklagen
                    .begruendungBeschreibungBeweiseDeleteDialogPersonDescription
                    .de
                }
              </span>
              <div
                className={classNames(
                  "flex sm:flex-row flex-col items-start gap-kern-space-small flex-1 min-w-0",
                )}
              >
                <Icon name="person" className="shrink-0" />
                {contentDescription}
              </div>
            </>
          );

          return (
            <BeweisItemRow
              key={editPersonUrl}
              icon="person"
              classNameParent="border-b border-kern-neutral-200"
              classNameChild={hasDetails ? "" : "sm:items-center!"}
              content={contentDescription}
              buttons={
                <ItemButtons
                  editUrl={editPersonUrl}
                  onDelete={() =>
                    onAbschnittPersonDelete(
                      `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/personen`,
                      itemIndexAbschnitt,
                      personIndex,
                    )
                  }
                  ariaLabel={renderArialLabelForPersonItem(person)}
                  shouldRenderEditButton={shouldRenderEditButton}
                  deleteDialogTitle={
                    translations.geldEinklagen
                      .begruendungBeschreibungBeweisePersonDeleteDialogTitle.de
                  }
                  deleteDialogDescription={deleteDialogDescription}
                />
              }
            />
          );
        })}
    </div>
  );
};
