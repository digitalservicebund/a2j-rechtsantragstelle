import AddButton from "@digitalservicebund/icons/Add";
import type { HeadingProps } from "~/components/common/Heading";
import EditButton from "@digitalservicebund/icons/CreateOutlined";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import { useFetcher, useLocation } from "react-router";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { translations } from "~/services/translations/translations";
import { type ArrayConfigServer } from "~/services/array";
import type { ArrayData, BasicTypes } from "~/domains/userData";

type Props = {
  readonly itemIndex: number;
  readonly category: string;
  readonly editUrl: string;
  readonly csrf: string;
  readonly heading?: HeadingProps;
  readonly items: Record<string, BasicTypes | ArrayData>;
  readonly nestedArrays?: Record<string, ArrayConfigServer>;
};

type PropsNestedArrayButton = Pick<
  ArrayConfigServer,
  "url" | "initialInputUrl"
> & {
  itemIndex: number;
  category: string;
  items: Record<string, BasicTypes | ArrayData>;
};

const AddNestedArrayButton = ({
  initialInputUrl,
  url,
  itemIndex,
  category,
  items,
}: PropsNestedArrayButton) => {
  const nestedArrayItems = items[category] as ArrayData | undefined;
  const currentNestedArrayLength = nestedArrayItems
    ? nestedArrayItems.length
    : 0;
  const itemIndexAdjusted = String(currentNestedArrayLength);

  return (
    <Button
      look="primary"
      size="small"
      className={`hover:shadow-none`}
      iconLeft={<AddButton />}
      href={`${url}/${itemIndex}/${itemIndexAdjusted}/${initialInputUrl}`}
    >
      {"NESTED ARRAY BUTTON"}
    </Button>
  );
};

const DELETE_URL_ENDPOINT = "/action/delete-array-item";

const ArraySummaryItemButton = ({
  itemIndex,
  category,
  editUrl,
  csrf,
  heading,
  nestedArrays,
  items,
}: Props) => {
  const { pathname } = useLocation();
  const fetcher = useFetcher();
  const jsAvailable = useJsAvailable();
  const srHeadingText = heading ? (
    <span className="sr-only">{heading.text}&nbsp;</span>
  ) : null;

  return (
    <ButtonContainer className="pt-8">
      <Button iconLeft={<EditButton />} look="tertiary" href={editUrl}>
        {srHeadingText}
        {translations.arraySummary.arrayEditButtonLabel.de}
      </Button>
      {/* form method 'delete' isn't supported without js, see https://github.com/remix-run/remix/discussions/4420 */}
      <fetcher.Form method="post" action={DELETE_URL_ENDPOINT}>
        <input type="hidden" name={CSRFKey} value={csrf} />
        <input type="hidden" name="pathnameArrayItem" value={pathname} />
        <input type="hidden" name="_jsEnabled" value={String(jsAvailable)} />
        <Button
          look="tertiary"
          iconLeft={<DeleteIcon />}
          name={category}
          value={itemIndex}
          type="submit"
        >
          {srHeadingText}
          {translations.arraySummary.arrayDeleteButtonLabel.de}
        </Button>
      </fetcher.Form>

      {nestedArrays &&
        Object.entries(nestedArrays).map(
          ([nestedArrayKey, nestedArrayConfig]) => (
            <AddNestedArrayButton
              key={nestedArrayKey}
              itemIndex={itemIndex}
              url={nestedArrayConfig.url}
              items={items}
              category={nestedArrayKey}
              initialInputUrl={nestedArrayConfig.initialInputUrl}
            />
          ),
        )}
    </ButtonContainer>
  );
};

export default ArraySummaryItemButton;
