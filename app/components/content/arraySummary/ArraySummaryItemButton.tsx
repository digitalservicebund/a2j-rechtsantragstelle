import EditButton from "@digitalservicebund/icons/CreateOutlined";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import { useFetcher, useLocation } from "react-router";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { translations } from "~/services/translations/translations";
import { CsrfInput } from "~/components/formElements/CsrfInput";
import KernButtonContainer from "~/components/kern/KernButtonContainer";
import KernButton from "~/components/kern/KernButton";
import { type KernHeadingProps } from "~/components/kern/KernHeading";

type Props = {
  readonly itemIndex: number;
  readonly category: string;
  readonly editUrl: string;
  readonly heading?: KernHeadingProps;
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
    <KernButtonContainer className="pt-8">
      <KernButton iconLeft={<EditButton />} look="tertiary" href={editUrl}>
        {srHeadingText}
        {translations.arraySummary.arrayEditButtonLabel.de}
      </KernButton>
      {/* form method 'delete' isn't supported without js, see https://github.com/remix-run/remix/discussions/4420 */}
      <fetcher.Form method="post" action={DELETE_URL_ENDPOINT}>
        <CsrfInput />
        <input type="hidden" name="pathnameArrayItem" value={pathname} />
        <input type="hidden" name="_jsEnabled" value={String(jsAvailable)} />
        <KernButton
          look="tertiary"
          iconLeft={<DeleteIcon />}
          name={category}
          value={itemIndex}
          type="submit"
        >
          {srHeadingText}
          {translations.arraySummary.arrayDeleteButtonLabel.de}
        </KernButton>
      </fetcher.Form>
    </KernButtonContainer>
  );
};

export default ArraySummaryItemButton;
