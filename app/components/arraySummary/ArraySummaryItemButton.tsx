import EditButton from "@digitalservicebund/icons/CreateOutlined";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import { useFetcher, useLocation } from "@remix-run/react";
import type { Translations } from "~/services/cms/index.server";
import { CSRFKey } from "~/services/security/csrfKey";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";

type Props = {
  readonly itemIndex: number;
  readonly category: string;
  readonly url: string;
  readonly initialInputUrl: string;
  readonly csrf: string;
  readonly translations?: Translations;
};

const ArraySummaryItemButton = ({
  itemIndex,
  category,
  url,
  initialInputUrl,
  csrf,
  translations = {},
}: Props) => {
  const editButtonText = getTranslationByKey(
    "arrayEditButtonLabel",
    translations,
  );
  const deleteButtonText = getTranslationByKey(
    "arrayDeleteButtonLabel",
    translations,
  );

  const { pathname } = useLocation();
  const fetcher = useFetcher();

  return (
    <ButtonContainer>
      <Button
        iconLeft={<EditButton />}
        look="tertiary"
        href={`${url}/${itemIndex}/${initialInputUrl}`}
      >
        {editButtonText}
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
          {deleteButtonText}
        </Button>
      </fetcher.Form>
    </ButtonContainer>
  );
};

export default ArraySummaryItemButton;
