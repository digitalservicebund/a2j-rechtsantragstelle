import Heading from "./Heading";
import type { Translations } from "~/services/cms/index.server";
import ButtonContainer from "./ButtonContainer";
import Button from "./Button";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import EditButton from "@digitalservicebund/icons/CreateOutlined";
import AddButton from "@digitalservicebund/icons/AddCircleOutlined";
import RichText from "./RichText";
import { Form } from "@remix-run/react";

type ArraySummaryProps = {
  readonly title: string;
  readonly description?: string;
  readonly linkTo: string;
  readonly arrayKey: string;
  readonly arrayData: ArrayType;
  readonly translations?: Translations;
};

type ArrayElement = Record<string, string | number | boolean>;
type ArrayType = ArrayElement[];
export type ArrayCollection = Record<string, ArrayType>;

const ArraySummary = ({
  title,
  description,
  linkTo,
  arrayKey,
  arrayData,
  translations = {},
}: ArraySummaryProps) => {
  const addButtonText = translations["arrayAddButtonLabel"] ?? "Hinzufügen";
  const editButtonText = translations["arrayEditButtonLabel"] ?? "Bearbeiten";
  const deleteButtonText = translations["arrayDeleteButtonLabel"] ?? "Löschen";
  const titleHeading =
    translations[`${arrayKey}.label.title`] ?? `${arrayKey}.label.title`;
  const subtitle =
    translations[`${arrayKey}.label.subtitle`] ?? `${arrayKey}.label.subtitle`;

  return (
    <div className="ds-stack-8 scroll-my-40">
      <Heading text={titleHeading} tagName="h2" look="ds-heading-03-bold" />
      {description && <RichText markdown={description} />}
      <div className="!mt-[32px]">
        {arrayData.map((element, index) => {
          const subtitleHeading = `${subtitle} ${index + 1}`;

          return (
            <div
              key={subtitleHeading}
              className="ds-stack-8 bg-white p-16 pb-[24px]"
            >
              {Object.entries(element).map(([elementKey, elementValue]) => {
                return (
                  <div key={elementKey} className="first:pt-0 scroll-my-40">
                    <Heading
                      text={
                        translations[`${arrayKey}.${elementKey}`] ?? elementKey
                      }
                      tagName="h4"
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
                  name={editButtonText}
                  value={"abort"}
                  type="submit"
                >
                  {editButtonText}
                </Button>
                <Form method="delete">
                  <Button
                    look="tertiary"
                    iconLeft={<DeleteIcon />}
                    name={`${arrayKey}`}
                    value={`${index}`}
                    type="submit"
                  >
                    {deleteButtonText}
                  </Button>
                </Form>
              </ButtonContainer>
            </div>
          );
        })}
      </div>
      <Button
        look="ghost"
        iconLeft={<AddButton />}
        href={`${linkTo}/${arrayKey}`}
      >{`${subtitle} ${addButtonText}`}</Button>
    </div>
  );
};

export default ArraySummary;
