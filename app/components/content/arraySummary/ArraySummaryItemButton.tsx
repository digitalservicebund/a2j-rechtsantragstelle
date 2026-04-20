import type { HeadingProps } from "~/components/common/Heading";
import EditButton from "@digitalservicebund/icons/CreateOutlined";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import { useFetcher, useLocation } from "react-router";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { translations } from "~/services/translations/translations";
import { Csrf } from "~/components/formElements/Csrf";

type Props = {
  readonly itemIndex: number;
  readonly category: string;
  readonly editUrl: string;
  readonly heading?: HeadingProps;
};

const DELETE_URL_ENDPOINT = "/action/delete-array-item";

const ArraySummaryItemButton = ({
  itemIndex,
  category,
  editUrl,
  heading,
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
        <Csrf />
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
    </ButtonContainer>
  );
};

export default ArraySummaryItemButton;
