import Button from "~/components/common/Button";
import { DeleteButton } from "~/components/common/DeleteButton";
import { Icon } from "~/components/common/Icon";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { EDIT_BUTTON_ID_PREFIX } from "~/services/array";
import { translations } from "~/services/translations/translations";
import { type KlageParteiVerhaeltnis } from "../../klageParties/klagePartySchemas";
import {
  getBaseProzessbevollmaechtigteUrl,
  getProzessbevollmaechtigteArrayName,
  getProzessbevollmaechtigteTranslations,
} from "../prozessbevollmaechtigteHelpers";
import {
  type BeklagteProzessbevollmaechtigte,
  type Prozessbevollmaechtigte as ProzessbevollmaechtigteData,
} from "../prozessbevollmaechtigteSchemas";
import { AdditionalPersonsList } from "~/domains/geldEinklagen/anwaltschaft/shared/prozessbevollmaechtigte/components/AdditionalPersonsList";

const ProzessbevollmaechtigteDetails = ({
  prozessbevollmaechtigte,
}: {
  prozessbevollmaechtigte:
    | ProzessbevollmaechtigteData[number]
    | BeklagteProzessbevollmaechtigte[number];
}) => (
  <div className="flex flex-col kern-body kern-body--default text-pretty">
    <span className="kern-body--bold">{prozessbevollmaechtigte.name}</span>
    <span>
      {translations.geldEinklagenAnwaltschaft.geschaeftszeichen.de}:{" "}
      {prozessbevollmaechtigte.geschaeftszeichen === ""
        ? translations.geldEinklagenAnwaltschaft.noGeschaeftszeichen.de
        : prozessbevollmaechtigte.geschaeftszeichen}
    </span>
    <span>
      {prozessbevollmaechtigte.strasse} {prozessbevollmaechtigte.hausnummer}
    </span>
    <span>
      {prozessbevollmaechtigte.plz} {prozessbevollmaechtigte.ort}
    </span>
    <span>{prozessbevollmaechtigte.land}</span>
    {prozessbevollmaechtigte.telefonnummer && (
      <span>{prozessbevollmaechtigte.telefonnummer}</span>
    )}
    {prozessbevollmaechtigte.email && (
      <span>{prozessbevollmaechtigte.email}</span>
    )}
    {"isProzessbevollmaechtigt" in prozessbevollmaechtigte &&
      prozessbevollmaechtigte.isProzessbevollmaechtigt === "on" && (
        <>
          <span className="kern-body--bold pt-kern-space-small">
            {
              translations.geldEinklagenAnwaltschaft
                .prozessbevollmaechtigtePerson.de
            }
          </span>
          <span>
            {translations.geldEinklagenAnwaltschaft.gesamteKanzlei.de}
          </span>
        </>
      )}

    {"anrede" in prozessbevollmaechtigte && (
      <>
        <span className="kern-body--bold pt-kern-space-small">
          {
            translations.geldEinklagenAnwaltschaft.prozessbevollmaechtigtePerson
              .de
          }
        </span>
        <span>
          {getFullPlaintiffName(
            prozessbevollmaechtigte.anrede,
            prozessbevollmaechtigte.titel,
            prozessbevollmaechtigte.vorname,
            prozessbevollmaechtigte.nachname,
          )}
        </span>
        {prozessbevollmaechtigte.berufsbezeichnung !== "" && (
          <span>({prozessbevollmaechtigte.berufsbezeichnung})</span>
        )}
      </>
    )}
  </div>
);

const Prozessbevollmaechtigte = ({
  prozessbevollmaechtigte,
  index,
  relationship,
  onDelete,
}: {
  readonly prozessbevollmaechtigte:
    | ProzessbevollmaechtigteData[number]
    | BeklagteProzessbevollmaechtigte[number];
  readonly index: number;
  readonly relationship: KlageParteiVerhaeltnis;
  readonly onDelete: () => Promise<void>;
}) => {
  const { deleteButtonLabel, deleteButtonTitle, deleteButtonDescription } =
    getProzessbevollmaechtigteTranslations(
      "isProzessbevollmaechtigt" in prozessbevollmaechtigte,
    );
  return (
    <div
      data-testid="prozessbevollmaechtigte"
      id={`${relationship}-prozessbevollmaechtigte-${index}`}
      tabIndex={-1}
    >
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-kern-space-large!">
        <div className="flex gap-kern-space-default justify-between items-center">
          <ProzessbevollmaechtigteDetails
            prozessbevollmaechtigte={prozessbevollmaechtigte}
          />
          <Button
            id={`${EDIT_BUTTON_ID_PREFIX}${getProzessbevollmaechtigteArrayName(relationship)}-${index}`}
            look="secondary"
            iconLeft={
              <Icon
                name="edit"
                className="size-kern-dimension-default text-kern-action-default"
              />
            }
            aria-label={`${prozessbevollmaechtigte.name} ${translations.arraySummary.arrayEditButtonLabel.de}`}
            href={`${getBaseProzessbevollmaechtigteUrl(relationship)}/${index}/${prozessbevollmaechtigte.type}-daten`}
            className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
          />
        </div>
        {prozessbevollmaechtigte.type === "berufsausuebungsgesellschaft" &&
          !(
            relationship === "beklagte" &&
            prozessbevollmaechtigte.isProzessbevollmaechtigt === "on"
          ) && (
            <AdditionalPersonsList
              berufsausuebungsgesellschaft={prozessbevollmaechtigte}
              parentArrayItemIndex={index}
              relationship={relationship}
            />
          )}
        <div className="flex justify-end">
          <DeleteButton
            label={`${deleteButtonLabel} ${translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}`}
            title={deleteButtonTitle}
            description={
              <div className="flex flex-col gap-kern-space-small">
                <p>{deleteButtonDescription}</p>
                <div className="flex gap-kern-space-small">
                  <Icon
                    name="business"
                    className="size-kern-dimension-default"
                  />
                  <p className="font-bold">{prozessbevollmaechtigte.name}</p>
                </div>
              </div>
            }
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Prozessbevollmaechtigte;
