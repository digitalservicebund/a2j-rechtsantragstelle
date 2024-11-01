import EditButton from "@digitalservicebund/icons/CreateOutlined";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import { useFetcher, useLocation } from "@remix-run/react";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";

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

const ArraySummaryItemButton = ({
  itemIndex,
  category,
  editUrl,
  csrf,
  translations,
}: Props) => {
  const { pathname } = useLocation();
  const fetcher = useFetcher();

  return (
    <ButtonContainer className="pt-8">
      <Button iconLeft={<EditButton />} look="tertiary" href={editUrl}>
        {translations.arrayEditButtonLabel}
      </Button>
      {/* form method 'delete' isn't supported without js, see https://github.com/remix-run/remix/discussions/4420 */}
      <fetcher.Form method="post" action={pathname}>
        <input type="hidden" name={CSRFKey} value={csrf} />
        <input type="hidden" name="_action" value="delete" />
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
