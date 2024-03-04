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

type ArraySummaryProps = {
  readonly arrayKey: string;
  readonly arrayData: ObjectType[];
  readonly translations?: Translations;
  readonly csrf: string;
};

const ArraySummary = ({
  arrayKey,
  arrayData,
  csrf,
  translations = {},
}: ArraySummaryProps) => {
  const addButtonText = translations["arrayAddButtonLabel"] ?? "Hinzufügen";
  const editButtonText = translations["arrayEditButtonLabel"] ?? "Bearbeiten";
  const deleteButtonText = translations["arrayDeleteButtonLabel"] ?? "Löschen";
  const titleHeading = lookupOrKey(`${arrayKey}.label.title`, translations);
  const subtitle = lookupOrKey(`${arrayKey}.label.subtitle`, translations);
  const description: string | undefined =
    translations[`${arrayKey}.description`];
  const { pathname } = useLocation();
  const deleteFetcher = useFetcher();

  const pathroot = pathname.slice(0, pathname.lastIndexOf("/"));
  const nextItemIndex = arrayData.length;
  const addButtonDestination = `${pathroot}/${arrayKey}/${nextItemIndex}?returnTo=${pathname}`;
  const emptyArrayFallbackString = "Das besitze ich nicht."; // TODO: Validate & move to strapi

  return (
    <div className="ds-stack-8 scroll-my-40 mb-24">
      <Heading text={titleHeading} tagName="h2" look="ds-heading-03-bold" />
      {description && <RichText markdown={description} />}
      <div className="space-y-32">
        {arrayData.map((element, index) => {
          const subtitleHeading = `${subtitle} ${index + 1}`;

          return (
            <div key={subtitleHeading} className="space-y-8 bg-white p-16">
              {Object.entries(element).map(([elementKey, elementValue]) => {
                return (
                  <div key={elementKey} className="first:pt-0 scroll-my-40">
                    <Heading
                      text={
                        translations[`${arrayKey}.${elementKey}`] ?? elementKey
                      }
                      tagName="h3"
                      look="ds-label-02-bold"
                    />
                    {translations[
                      `${arrayKey}.${elementKey}.${elementValue}`
                    ] ?? elementValue}
                  </div>
                );
              })}
              <ButtonContainer>
                <Button
                  iconLeft={<EditButton />}
                  look="tertiary"
                  href={`${arrayKey}/${index}?returnTo=${pathname}`}
                >
                  {editButtonText}
                </Button>
                {/* form method 'delete' isn't supported without js, see https://github.com/remix-run/remix/discussions/4420 */}
                <deleteFetcher.Form method="post" action={pathname}>
                  <input type="hidden" name={CSRFKey} value={csrf} />
                  <input type="hidden" name="_action" value="delete" />
                  <Button
                    look="tertiary"
                    iconLeft={<DeleteIcon />}
                    name={`${arrayKey}`}
                    value={`${index}`}
                    type="submit"
                  >
                    {deleteButtonText}
                  </Button>
                </deleteFetcher.Form>
              </ButtonContainer>
            </div>
          );
        })}
        {arrayData.length === 0 && (
          <div className="bg-white p-16 ds-label-02-bold">
            <strong>{emptyArrayFallbackString}</strong>
          </div>
        )}
      </div>
      <Button
        look="ghost"
        className="hover:shadow-none pl-0 pt-8"
        iconLeft={<AddButton />}
        href={addButtonDestination}
      >{`${subtitle} ${addButtonText}`}</Button>
    </div>
  );
};

export default ArraySummary;
