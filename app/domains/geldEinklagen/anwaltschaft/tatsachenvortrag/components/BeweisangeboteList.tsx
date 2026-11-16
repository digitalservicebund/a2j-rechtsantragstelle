import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { focusOnItem } from "~/domains/geldEinklagen/anwaltschaft/shared/focusOnItem";
import { useAbsaetze } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeContext";
import {
  type Beweis,
  beweismittelSchema,
  MAX_BEWEISE,
  type BeweisType,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { translations } from "~/services/translations/translations";
import {
  getBeweisBody,
  getBeweisTitle,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import {
  getBeweisCategory,
  type OrderedBeweis,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/beweisOrdering";
import Button from "~/components/common/Button";
import { ValidatedForm } from "@rvf/react-router";
import Select from "~/components/formElements/inputs/select/Select";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import { useLocation } from "react-router";
import { Icon } from "~/components/common/Icon";

const defaultValues: { type: BeweisType | undefined } = {
  type: undefined,
};

const addBeweisActionUrl = "/action/geld-einklagen/anwaltschaft/add-beweis";

const AddBeweis = ({
  absatzIndex,
  nextIndex,
}: {
  absatzIndex: number;
  nextIndex: number;
}) => {
  const { pathname } = useLocation();
  const beweisePathname = `${pathname}/${absatzIndex}/beweise`;
  return (
    <ValidatedForm
      schema={beweismittelSchema}
      defaultValues={defaultValues}
      method="post"
      action={addBeweisActionUrl}
      validationBehaviorConfig={{
        initial: "onSubmit",
        whenTouched: "onSubmit",
        whenSubmitted: "onSubmit",
      }}
      className="flex gap-kern-dimension-default justify-between"
    >
      <CsrfInput />
      <input type="hidden" name="nextIndex" value={nextIndex} />
      <input type="hidden" name="beweisePathname" value={beweisePathname} />
      <div className="flex-1">
        <Select
          name="type"
          options={beweismittelSchema.shape.type.options.map((value) => ({
            value,
            text: translations.beweismittel[value].de,
            preSelected: false,
          }))}
          placeholder={
            translations.geldEinklagenAnwaltschaft.beweismittelPlaceholder.de
          }
          errorMessages={[
            {
              code: "required",
              text: translations.select.selectionRequired.de,
            },
          ]}
        />
      </div>
      <Button
        look="secondary"
        type="submit"
        disabled={nextIndex >= MAX_BEWEISE}
        aria-disabled={nextIndex >= MAX_BEWEISE}
      >
        {translations.geldEinklagenAnwaltschaft.addBeweisButton.de}
      </Button>
    </ValidatedForm>
  );
};

const BeweisDeletionDescription = ({
  beweis,
  documentNumber,
}: {
  beweis: Beweis;
  documentNumber: number | undefined;
}) => {
  const isDocument = getBeweisCategory(beweis.type) === "document";
  const beweisBody = getBeweisBody(beweis);
  return (
    <div className="flex flex-col gap-kern-space-small">
      <p>
        {isDocument
          ? translations.geldEinklagenAnwaltschaft
              .beweisangebotDeletionDescription.de
          : translations.geldEinklagenAnwaltschaft
              .additionalPersonDeletionDescription.de}
      </p>
      <div className="flex gap-kern-space-small items-start">
        <Icon
          name={isDocument ? "draft" : "person"}
          className="size-kern-dimension-default"
        />
        <div className="flex flex-col">
          <p className="font-bold">
            {getBeweisTitle(beweis.type, documentNumber)}
          </p>
          <p>
            {typeof beweisBody === "string" && beweisBody.length > 100
              ? beweisBody.substring(0, 100) + "..."
              : beweisBody}
          </p>
        </div>
      </div>
    </div>
  );
};

export const BeweisangeboteList = ({
  beweise,
  absatzArrayIndex,
}: {
  beweise: OrderedBeweis[];
  absatzArrayIndex: number;
}) => {
  const { absaetzeBaseUrl, absaetzeArrayName } = useAbsaetze();
  const beweiseBaseUrl = `${absaetzeBaseUrl}/${absatzArrayIndex}/beweise`;
  const beweisIdPrefix = `absatz-${absatzArrayIndex}-beweis-`;
  const deleteArrayItem = useDeleteArrayItem(
    `${absaetzeArrayName}#beweise`,
    beweiseBaseUrl,
    focusOnItem(beweisIdPrefix),
  );
  const nextItemIndex = beweise.length;
  return (
    <NestedArrayItemList
      heading={translations.geldEinklagenAnwaltschaft.beweisangeboteTitle.de}
      headingSuffix={translations.geldEinklagenAnwaltschaft.optionalSuffix.de}
      headingId={`absatz-${absatzArrayIndex}-beweisangebote`}
      subtitle={
        translations.geldEinklagenAnwaltschaft.beweisangeboteSubtitle.de
      }
      items={beweise.map(({ beweis, sourceIndex, documentNumber }) => ({
        key: `absatz-${absatzArrayIndex}-beweisangebote-${sourceIndex}`,
        id: `absatz-${absatzArrayIndex}-beweisangebote-${sourceIndex}`,
        content: (
          <div className="flex gap-kern-space-small items-start">
            <Icon
              name={
                getBeweisCategory(beweis.type) === "document"
                  ? "draft"
                  : "person"
              }
            />
            <div className="flex flex-col">
              <span className="kern-body--bold">
                {getBeweisTitle(beweis.type, documentNumber, true)}
              </span>
              <span>{getBeweisBody(beweis, true)}</span>
            </div>
          </div>
        ),
        editButton: {
          ariaLabel: `${translations.geldEinklagenAnwaltschaft.beweis.de} ${translations.arraySummary.arrayEditButtonLabel.de}`, // TODO: fix label
          href: `${beweiseBaseUrl}/${sourceIndex}/${beweis.type}-daten`,
        },
        deleteButton: {
          title:
            getBeweisCategory(beweis.type) === "document"
              ? translations.geldEinklagenAnwaltschaft
                  .beweisangebotDeletionTitle.de
              : translations.geldEinklagenAnwaltschaft
                  .beweisangebotPersonDeletionTitle.de,
          description: (
            <BeweisDeletionDescription
              beweis={beweis}
              documentNumber={documentNumber}
            />
          ),
          onDelete: () => deleteArrayItem(sourceIndex),
        },
      }))}
      additionalComponents={
        <AddBeweis absatzIndex={absatzArrayIndex} nextIndex={nextItemIndex} />
      }
    />
  );
};
