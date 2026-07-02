import { useFetcher } from "react-router";
import ArraySummaryItemActions from "~/components/content/arraySummary/ArraySummaryItemActions";
import Button from "~/components/common/Button";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import { Icon } from "~/components/common/Icon";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { translations } from "~/services/translations/translations";
import type { ArrayConfigClient } from "~/services/array";
import type { ArrayData, BasicTypes } from "~/domains/userData";

const DELETE_URL_ENDPOINT = "/action/delete-array-item";

type ElternteilItem = Record<string, BasicTypes>;

function DeleteButton({
  itemIndex,
  pathnameArrayItem,
}: Readonly<{
  itemIndex: number;
  pathnameArrayItem: string;
}>) {
  const fetcher = useFetcher();
  const jsAvailable = useJsAvailable();

  return (
    <fetcher.Form method="post" action={DELETE_URL_ENDPOINT}>
      <CsrfInput />
      <input type="hidden" name="pathnameArrayItem" value={pathnameArrayItem} />
      <input type="hidden" name="_jsEnabled" value={String(jsAvailable)} />
      <Button
        look="tertiary"
        iconLeft={<Icon name="trash" className="text-kern-action-default" />}
        name="elternteile"
        value={itemIndex}
        textClassName="no-underline! font-normal!"
        type="submit"
      >
        {translations.arraySummary.arrayDeleteButtonLabel.de}
      </Button>
    </fetcher.Form>
  );
}

export function ElternteilSummary({
  data,
  configuration,
}: Readonly<{
  data: ArrayData;
  configuration: ArrayConfigClient;
}>) {
  const { url, initialInputUrl, disableAddButton } = configuration;
  const items = data as ElternteilItem[];

  return (
    <div className="flex flex-col gap-kern-space-default">
      <h2 className="kern-title">Elternteile</h2>
      {items.map((item, index) => {
        const name = String(item.name ?? "");
        const isAlive = String(item.isAlive ?? "yes");
        const editUrl = `${url}/${index}/${initialInputUrl}`;

        return (
          <div key={name} className="kern-summary">
            <div className="kern-summary__body bg-white!">
              <h3 className="kern-title">{name}</h3>
              <p className="kern-body">
                {isAlive === "no" ? "verstorben" : "lebend"}
              </p>
              <div className="flex gap-kern-space-small flex-wrap items-center">
                <ArraySummaryItemActions
                  category="elternteile"
                  itemIndex={index}
                  editUrl={editUrl}
                />
                <DeleteButton itemIndex={index} pathnameArrayItem={url} />
              </div>
            </div>
          </div>
        );
      })}
      <div>
        <Button
          look="primary"
          iconLeft={<Icon name="plus" className="text-white" />}
          href={`${url}/${items.length}/${initialInputUrl}`}
          disabled={disableAddButton}
          data-testid="add-elternteile"
        >
          Elternteil hinzufügen
        </Button>
      </div>
    </div>
  );
}
