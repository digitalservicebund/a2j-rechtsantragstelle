import { useFetcher, useLocation } from "react-router";
import KernButton from "~/components/kern/KernButton";
import type { KernHeadingProps } from "~/components/kern/KernHeading";
import { KernIcon } from "~/components/kern/common/KernIcon";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { translations } from "~/services/translations/translations";
import { KernStandaloneLink } from "../KernStandaloneLink";

type Props = {
  readonly itemIndex: number;
  readonly category: string;
  readonly editUrl: string;
  readonly csrf: string;
  readonly heading?: KernHeadingProps;
};

const DELETE_URL_ENDPOINT = "/action/delete-array-item";

const KernArraySummaryItemActions = ({
  itemIndex,
  category,
  editUrl,
  csrf,
  heading,
}: Props) => {
  const { pathname } = useLocation();
  const fetcher = useFetcher();
  const jsAvailable = useJsAvailable();
  const srHeadingText = heading ? `${heading.text} ` : "";

  return (
    <div className="flex gap-kern-space-small">
      <a
        href={editUrl}
        className="kern-link no-underline! flex align-center gap-kern-space-x-small!"
        aria-label={`${srHeadingText}${translations.arraySummary.arrayEditButtonLabel.de}`}
      >
        <KernIcon
          name="edit"
          className="text-kern-action-default self-center! mb-3!"
        />
        <span className="kern-body text-kern-action-default!">
          {translations.arraySummary.arrayEditButtonLabel.de}
        </span>
      </a>
      <fetcher.Form method="post" action={DELETE_URL_ENDPOINT}>
        <input type="hidden" name={CSRFKey} value={csrf} />
        <input type="hidden" name="pathnameArrayItem" value={pathname} />
        <input type="hidden" name="_jsEnabled" value={String(jsAvailable)} />
        <KernButton
          look="tertiary"
          iconLeft={
            <KernIcon name="trash" className="text-kern-action-default" />
          }
          name={category}
          value={itemIndex}
          textClassName="no-underline! font-normal!"
          type="submit"
          aria-label={`${srHeadingText}${translations.arraySummary.arrayDeleteButtonLabel.de}`}
        >
          {translations.arraySummary.arrayDeleteButtonLabel.de}
        </KernButton>
      </fetcher.Form>
    </div>
  );
};

export default KernArraySummaryItemActions;
