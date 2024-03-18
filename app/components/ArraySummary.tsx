import Heading from "./Heading";
import type { Translations } from "~/services/cms/index.server";
import ButtonContainer from "./ButtonContainer";
import Button from "./Button";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import EditButton from "@digitalservicebund/icons/CreateOutlined";
import AddButton from "@digitalservicebund/icons/AddCircleOutlined";
import RichText from "./RichText";
import { useFetcher, useLocation } from "@remix-run/react";
import { lookupOrKey } from "~/util/lookupOrKey";
import type { ObjectType } from "~/models/flows/contexts";
import { CSRFKey } from "~/services/security/csrfKey";
import type { ArrayConfig } from "~/services/array";

type ArraySummaryProps = {
  readonly category: string;
  readonly arrayData: {
    data: ObjectType[];
    arrayConfiguration: ArrayConfig;
  };
  readonly translations?: Translations;
  readonly csrf: string;
};

const ArraySummary = ({
  category,
  arrayData,
  csrf,
  translations = {},
}: ArraySummaryProps) => {
  const addButtonText = translations["arrayAddButtonLabel"] ?? "Hinzufügen";
  const editButtonText = translations["arrayEditButtonLabel"] ?? "Bearbeiten";
  const deleteButtonText = translations["arrayDeleteButtonLabel"] ?? "Löschen";
  // TODO: Validate & move strings to strapi
  const emptyArrayFallbackString = "Das habe ich nicht.";
  const changeEntryString = "ändern";

  const titleHeading = lookupOrKey(`${category}.label.title`, translations);
  const subtitle = lookupOrKey(`${category}.label.subtitle`, translations);
  const description: string | undefined =
    translations[`${category}.description`];
  const { pathname } = useLocation();
  const fetcher = useFetcher();

  const nextItemIndex = String(arrayData.data.length);
  const { url } = arrayData.arrayConfiguration;
  return (
    <div className="ds-stack-8 scroll-my-40 mb-24">
      <Heading text={titleHeading} tagName="h2" look="ds-heading-03-bold" />
      {description && <RichText markdown={description} />}
      <div className="space-y-32">
        {arrayData.data.map((element, index) => {
          const subtitleHeading = `${subtitle} ${index + 1}`;

          return (
            <div key={subtitleHeading} className="space-y-8 bg-white p-16">
              {Object.entries(element).map(([elementKey, elementValue]) => {
                return (
                  <div key={elementKey} className="first:pt-0 scroll-my-40">
                    <Heading
                      text={
                        translations[`${category}.${elementKey}`] ?? elementKey
                      }
                      tagName="h3"
                      look="ds-label-02-bold"
                    />
                    {translations[
                      `${category}.${elementKey}.${elementValue}`
                    ] ?? elementValue}
                  </div>
                );
              })}
              <ButtonContainer>
                <Button
                  iconLeft={<EditButton />}
                  look="tertiary"
                  href={`${url}/${index}/${arrayData.arrayConfiguration.initialInputUrl}`}
                >
                  {editButtonText}
                </Button>
                {/* form method 'delete' isn't supported without js, see https://github.com/remix-run/remix/discussions/4420 */}
                <fetcher.Form method="post" action={pathname}>
                  <input type="hidden" name={CSRFKey} value={csrf} />
                  <input type="hidden" name="_action" value="delete" />
                  <Button
                    look="tertiary"
                    iconLeft={<DeleteIcon />}
                    name={category}
                    value={index}
                    type="submit"
                  >
                    {deleteButtonText}
                  </Button>
                </fetcher.Form>
              </ButtonContainer>
            </div>
          );
        })}
        {!arrayData.arrayConfiguration.statementValue &&
          arrayData.data.length === 0 && (
            <div
              className="bg-white p-16 ds-label-02-bold"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>{emptyArrayFallbackString}</strong>
              <Button
                look="ghost"
                className="hover:shadow-none pl-0 pt-8"
                iconLeft={<EditButton />}
                href={arrayData.arrayConfiguration.questionUrl}
              >
                {changeEntryString}
              </Button>
            </div>
          )}
      </div>
      {(arrayData.arrayConfiguration.statementValue ||
        arrayData.data.length > 0) && (
        <Button
          look="ghost"
          className="hover:shadow-none pl-0 pt-8"
          iconLeft={<AddButton />}
          href={`${url}/${Number(nextItemIndex)}/${arrayData.arrayConfiguration.initialInputUrl}`}
        >{`${subtitle} ${addButtonText}`}</Button>
      )}
    </div>
  );
};

export default ArraySummary;
