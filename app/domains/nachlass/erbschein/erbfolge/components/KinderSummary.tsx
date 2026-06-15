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

type KindItem = Record<string, BasicTypes> & {
  kinder?: KindItem[];
};

function DeleteButton({
  category,
  itemIndex,
  pathnameArrayItem,
}: {
  category: string;
  itemIndex: number;
  pathnameArrayItem: string;
}) {
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
        name={category}
        value={itemIndex}
        textClassName="no-underline! font-normal!"
        type="submit"
      >
        {translations.arraySummary.arrayDeleteButtonLabel.de}
      </Button>
    </fetcher.Form>
  );
}

function KindCard({
  item,
  index,
  configuration,
}: {
  item: KindItem;
  index: number;
  configuration: ArrayConfigClient;
}) {
  const { url, initialInputUrl } = configuration;
  const name = String(item.name ?? "");
  const isAlive = String(item.isAlive ?? "yes");
  const editUrl = `${url}/${index}/${initialInputUrl}`;
  const grandchildren = Array.isArray(item.kinder)
    ? (item.kinder as KindItem[])
    : [];

  return (
    <div className="kern-summary">
      <div className="kern-summary__body bg-white!">
        <h3 className="kern-title">{name}</h3>
        <p className="kern-body">
          {isAlive === "no" ? "verstorben" : "lebend"}
        </p>
        <div className="flex gap-kern-space-small flex-wrap items-center">
          <ArraySummaryItemActions
            category="kinder"
            itemIndex={index}
            editUrl={editUrl}
          />
          {isAlive === "no" && (
            <Button
              look="primary"
              iconLeft={<Icon name="plus" className="text-white" />}
              href={`${url}/${index}/kinder/${grandchildren.length}/${initialInputUrl}`}
            >
              Enkel hinzufügen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function EnkelkinderSection({
  grandchildren,
  childIndex,
  configuration,
}: {
  grandchildren: KindItem[];
  childIndex: number;
  configuration: ArrayConfigClient;
}) {
  const { url, initialInputUrl } = configuration;
  const grandchildSummaryUrl = `${url}/${childIndex}/kinder`;

  return (
    <div className="flex flex-col gap-kern-space-default">
      <h2 className="kern-title">Enkelkinder</h2>
      {grandchildren.map((grandchild, j) => {
        const name = String(grandchild.name ?? "");
        const isAlive = String(grandchild.isAlive ?? "yes");
        const editUrl = `${grandchildSummaryUrl}/${j}/${initialInputUrl}`;

        return (
          <div key={j} className="kern-summary">
            <div className="kern-summary__body bg-white!">
              <h3 className="kern-title">{name}</h3>
              <p className="kern-body">
                {isAlive === "no" ? "verstorben" : "lebend"}
              </p>
              <div className="flex gap-kern-space-small flex-wrap items-center">
                <a
                  href={editUrl}
                  className="kern-link no-underline! hover:underline! flex align-center gap-kern-space-x-small!"
                >
                  <Icon
                    name="edit"
                    className="text-kern-action-default self-center! mb-3!"
                  />
                  <span className="kern-body text-kern-action-default!">
                    {translations.arraySummary.arrayEditButtonLabel.de}
                  </span>
                </a>
                <DeleteButton
                  category="kinder#kinder"
                  itemIndex={j}
                  pathnameArrayItem={grandchildSummaryUrl}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function KinderSummary({
  data,
  configuration,
  category,
}: {
  data: ArrayData;
  configuration: ArrayConfigClient;
  category: string;
}) {
  const { url, initialInputUrl, disableAddButton } = configuration;
  const items = data as KindItem[];

  const enkelkinderSections = items
    .map((item, index) => ({
      childIndex: index,
      grandchildren: Array.isArray(item.kinder)
        ? (item.kinder as KindItem[])
        : [],
    }))
    .filter(({ grandchildren }) => grandchildren.length > 0);

  return (
    <>
      <div className="flex flex-col gap-kern-space-default">
        <h2 className="kern-title">Kinder</h2>
        {items.map((item, index) => (
          <KindCard
            // oxlint-disable-next-line react/no-array-index-key
            key={index}
            item={item}
            index={index}
            configuration={configuration}
          />
        ))}
        <div>
          <Button
            look="primary"
            iconLeft={<Icon name="plus" className="text-white" />}
            href={`${url}/${items.length}/${initialInputUrl}`}
            disabled={disableAddButton}
            data-testid={`add-${category}`}
          >
            Kind hinzufügen
          </Button>
        </div>
      </div>

      {enkelkinderSections.map(({ childIndex, grandchildren }) => (
        <EnkelkinderSection
          // oxlint-disable-next-line react/no-array-index-key
          key={childIndex}
          grandchildren={grandchildren}
          childIndex={childIndex}
          configuration={configuration}
        />
      ))}
    </>
  );
}
