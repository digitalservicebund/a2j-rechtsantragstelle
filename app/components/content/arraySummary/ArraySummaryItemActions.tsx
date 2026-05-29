import { useFetcher, useLocation } from "react-router";
import { Icon } from "~/components/common/Icon";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { translations } from "~/services/translations/translations";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import { type HeadingProps } from "~/components/common/Heading";
import Button from "~/components/common/Button";

type Props = {
  readonly itemIndex: number;
  readonly category: string;
  readonly editUrl: string;
  readonly heading?: HeadingProps;
};

const DELETE_URL_ENDPOINT = "/action/delete-array-item";

const ArraySummaryItemActions = ({
  itemIndex,
  category,
  editUrl,
  heading,
}: Props) => {
  const { pathname } = useLocation();
  const fetcher = useFetcher();
  const jsAvailable = useJsAvailable();
  const srHeadingText = heading ? `${heading.text} ` : "";

  return (
    <div className="flex md:flex-row flex-col gap-kern-space-small">
      <a
        href={editUrl}
        className="kern-link no-underline! hover:underline! flex align-center gap-kern-space-x-small! pr-16!"
        aria-label={`${srHeadingText}${translations.arraySummary.arrayEditButtonLabel.de}`}
      >
        <Icon
          name="edit"
          className="text-kern-action-default self-center! mb-3! forced-color-adjust-auto"
        />
        <span className="kern-body text-kern-action-default!">
          {translations.arraySummary.arrayEditButtonLabel.de}
        </span>
      </a>
      <fetcher.Form method="post" action={DELETE_URL_ENDPOINT}>
        <CsrfInput />
        <input type="hidden" name="pathnameArrayItem" value={pathname} />
        <input type="hidden" name="_jsEnabled" value={String(jsAvailable)} />
        <Button
          look="tertiary"
          iconLeft={<Icon name="trash" className="text-kern-action-default forced-color-adjust-auto"/>}
          name={category}
          value={itemIndex}
          textClassName="no-underline! font-normal!"
          type="submit"
          className="p-0!"
          aria-label={`${srHeadingText}${translations.arraySummary.arrayDeleteButtonLabel.de}`}
        >
          {translations.arraySummary.arrayDeleteButtonLabel.de}
        </Button>
      </fetcher.Form>
    </div>
  );
};

export default ArraySummaryItemActions;
