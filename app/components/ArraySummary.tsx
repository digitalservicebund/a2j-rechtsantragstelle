import Heading from "./Heading";
import type { Translations } from "~/services/cms/index.server";
import ButtonContainer from "./ButtonContainer";
import Button from "./Button";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import EditButton from "@digitalservicebund/icons/CreateOutlined";
import AddButton from "@digitalservicebund/icons/AddCircleOutlined";
import RichText from "./RichText";

type ArraySummaryProps = {
  readonly title: string;
  readonly description?: string;
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
  arrayKey,
  arrayData,
  translations = {},
}: ArraySummaryProps) => {
  const editButtonText = translations["arrayEditButtonLabel"] ?? "Bearbeiten";
  const deleteButtonText = translations["arrayDeleteButtonLabel"] ?? "Löschen";

  return (
    <div className="ds-stack-8 scroll-my-40">
      <Heading text={title} tagName="h2" look="ds-heading-03-bold" />
      {description && <RichText markdown={description} />}
      {arrayData.map((element) => {
        return (
          <div key={arrayKey} className="ds-stack-32 bg-white p-16 pb-[24px]">
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
                  {translations[`${arrayKey}.${elementKey}.${elementValue}`] ??
                    elementValue}
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
              <Button
                look="tertiary"
                iconLeft={<DeleteIcon />}
                name={editButtonText}
                value={"abort"}
              >
                {deleteButtonText}
              </Button>
            </ButtonContainer>
          </div>
        );
      })}
      <AddButton />
    </div>
  );
};

export default ArraySummary;
