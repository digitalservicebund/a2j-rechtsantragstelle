import EditButton from "@digitalservicebund/icons/CreateOutlined";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import { useFetcher, useLocation } from "react-router";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";
import { useJsAvailable } from "../hooks/useJsAvailable";

type Props = {
  readonly itemIndex: number;
  readonly category: string;
  readonly editUrl: string;
  readonly csrf: string;
  readonly translations: {
    arrayEditButtonLabel: string;
    arrayDeleteButtonLabel: string;
  };
};

const DELETE_URL_ENDPOINT = "/action/delete-array-item";

const ArraySummaryItemButton = ({
  itemIndex,
  category,
  editUrl,
  csrf,
  translations,
}: Props) => {
  const { pathname } = useLocation();
  const fetcher = useFetcher();
  const jsAvailable = useJsAvailable();

  return (
    <ButtonContainer className="pt-8">
      <Button iconLeft={<EditButton />} look="tertiary" href={editUrl}>
        {translations.arrayEditButtonLabel}
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
          {translations.arrayDeleteButtonLabel}
        </Button>
      </fetcher.Form>
    </ButtonContainer>
  );
};

export default ArraySummaryItemButton;
