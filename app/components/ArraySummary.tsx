import Heading from "./Heading";
import ArrayElementEntry from "./ArrayElementEntry";
import type { Translations } from "~/services/cms/index.server";
import ButtonContainer from "./ButtonContainer";
import Button from "./Button";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import EditButton from "@digitalservicebund/icons/CreateOutlined";
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

// const ArraySummary = ({
//   title,

// }: ArraySummaryProps) => {
//   return (<div>{title}</div>)
// }

const ArraySummary = ({
  title,
  description,
  arrayKey,
  arrayData,
  translations,
}: ArraySummaryProps) => {
  const editButtonText = "Bearbeiten"
  const deleteButtonText = "Löschen"
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
                  {elementKey}
                  {elementValue}
                  {/* <ArrayElementEntry
                    title={elementKey}
                    elementKey={elementKey[1]}
                    translations={translations}
                    arrayKey={arrayKey}
                    sessionData={sessionData}
                    index={index}
                  /> */}
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
                type="submit"
              >
                {deleteButtonText}
              </Button>
            </ButtonContainer>
          </div>
        );
      })}
    </div>
  );
};

export default ArraySummary;
