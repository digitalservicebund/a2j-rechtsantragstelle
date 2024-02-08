import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import ArrayElementEntry, {
  ArrayElementPropsSchema,
} from "./ArrayElementEntry";
import type { Translations } from "~/services/cms/index.server";
import RichText, { RichTextPropsSchema } from "./RichText";
import ButtonContainer from "./ButtonContainer";
import Button from "./Button";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import EditButton from "@digitalservicebund/icons/CreateOutlined";
import type { ArrayType } from "./PageContent";

export const ArraySummaryPropsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema,
  content: RichTextPropsSchema,
  arrayKey: z.string(),
  editButtonText: z.string(),
  deleteButtonText: z.string(),
  addButtonText: z.string(),
  items: z.array(ArrayElementPropsSchema),
});

type ArraySummaryProps = z.infer<typeof ArraySummaryPropsSchema>;
type ArraySummaryDataProps = {
  readonly sessionData?: ArrayType;
  readonly arrayData?: ArrayType;
  readonly translations?: Translations;
};

const ArraySummary = ({
  identifier,
  heading,
  content,
  arrayKey,
  editButtonText,
  deleteButtonText,
  addButtonText,
  items,
  translations,
  sessionData,
  arrayData,
}: ArraySummaryProps & ArraySummaryDataProps) => {
  console.log("arrayData", arrayData);
  return (
    <div className="ds-stack-8 scroll-my-40">
      {heading && <Heading {...heading} />}
      {content && <RichText {...content} />}
      {sessionData?.bankkonten.map((bankkonto, index) => {
        // TODO: create separate ArrayElement component
        return (
          <div key={index} className="ds-stack-32 bg-white p-16 pb-[24px]">
            {Object.entries(bankkonto).map((bankkontoEntry, index) => {
              return (
                <div key={index} className="first:pt-0 scroll-my-40">
                  <ArrayElementEntry
                    title={bankkontoEntry[0]}
                    elementKey={bankkontoEntry[1]}
                    translations={translations}
                    arrayKey={arrayKey}
                    sessionData={sessionData}
                    index={index}
                  />
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
