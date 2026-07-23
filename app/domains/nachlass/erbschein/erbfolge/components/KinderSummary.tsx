import { useFetcher } from "react-router";
import ArraySummaryItemActions from "~/components/content/arraySummary/ArraySummaryItemActions";
import Button from "~/components/common/Button";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import { Icon } from "~/components/common/Icon";
import { Badge } from "~/components/common/Badge";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { translations } from "~/services/translations/translations";
import type { ArrayConfigClient } from "~/services/array";
import type { ArrayData } from "~/domains/userData";
import type { KindItem } from "./types";
import { InlineNotice } from "~/components/content/InlineNotice";
import {
  buildAddUrl,
  buildDeletePathname,
  buildEditUrl,
  collectAtDepth,
  collectDeceasedParentNames,
  collectDescendantsWithParentName,
  deceasedParentsNoticeContent,
  deceasedParentsNoticeTitle,
  descendantCategory,
} from "./summaryTree";

const DELETE_URL_ENDPOINT = "/action/delete-array-item";

const SECTION_TITLES = [
  "Kinder",
  "Enkelkinder",
  "Urenkel",
  "Ururenkel",
  "Ururenurenkel",
];

const SINGULAR_TITLES = [
  "Kind",
  "Enkelkind",
  "Urenkel",
  "Ururenkel",
  "Ururenurenkel",
];

function badgeLabel(
  depth: number,
  deceasedPersonName?: string,
): string | undefined {
  if (!deceasedPersonName) return undefined;
  return `${SINGULAR_TITLES[depth - 1]} von ${deceasedPersonName}`;
}

const ADD_LABELS = [
  "Kind hinzufügen",
  "Enkelkind hinzufügen",
  "Urenkel hinzufügen",
  "Ururenkel hinzufügen",
  "Ururenurenkel hinzufügen",
];

function DeleteButton({
  category,
  itemIndex,
  pathnameArrayItem,
}: Readonly<{
  category: string;
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

function KindSummaryItem({
  item,
  badgeLabel,
  actions,
}: Readonly<{
  item: KindItem;
  badgeLabel?: string;
  actions: React.ReactNode;
}>) {
  return (
    <div className="kern-summary">
      <div className="kern-summary__body bg-white!">
        {badgeLabel && (
          <div className="w-fit">
            <Badge icon="group">{badgeLabel}</Badge>
          </div>
        )}
        <dl className="kern-description-list">
          <div className="kern-description-list-item">
            <dt className="kern-description-list-item__key">Name</dt>
            <dd className="kern-description-list-item__value">
              {String(item.name ?? "")}
            </dd>
          </div>
          <div className="kern-description-list-item">
            <dt className="kern-description-list-item__key">
              Lebte zum Todeszeitpunkt?
            </dt>
            <dd className="kern-description-list-item__value">
              {item.isAlive === "yes" ? "Ja" : "Nein"}
            </dd>
          </div>
          {item.isAlive === "no" && (
            <div className="kern-description-list-item">
              <dt className="kern-description-list-item__key">
                Hatte weitere Kinder?
              </dt>
              <dd className="kern-description-list-item__value">
                {item.hatteKinder === "yes" ? "Ja" : "Nein"}
              </dd>
            </div>
          )}
        </dl>
        {actions}
      </div>
    </div>
  );
}

function DescendantRow({
  item,
  indexes,
  depth,
  baseUrl,
  initialInputUrl,
  badgeLabel,
}: Readonly<{
  item: KindItem;
  indexes: number[];
  depth: number;
  baseUrl: string;
  initialInputUrl: string;
  badgeLabel?: string;
}>) {
  const itemIndex = indexes.at(-1) ?? 0;
  const parentIndexes = indexes.slice(0, -1);

  const editUrl = buildEditUrl(baseUrl, indexes, initialInputUrl);

  return (
    <KindSummaryItem
      item={item}
      badgeLabel={badgeLabel}
      actions={
        <div className="flex md:flex-row flex-col gap-kern-space-small">
          <a
            href={editUrl}
            className="kern-link no-underline! hover:underline! flex align-center gap-kern-space-x-small! pr-16!"
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
            category={descendantCategory("kinder", depth)}
            itemIndex={itemIndex}
            pathnameArrayItem={buildDeletePathname(baseUrl, parentIndexes)}
          />
        </div>
      }
    />
  );
}

// Flat section for any descendant depth — one add button, dynamic parent select on form.
function FlatDescendantSection({
  depth,
  items,
  baseUrl,
  initialInputUrl,
}: Readonly<{
  depth: number;
  items: KindItem[];
  baseUrl: string;
  initialInputUrl: string;
}>) {
  const firstDeadParent = collectAtDepth(items, depth - 1).find(
    ({ item }) => item.isAlive === "no" && item.hatteKinder === "yes",
  );

  if (!firstDeadParent) return null;

  const descendants = collectDescendantsWithParentName(items, depth);
  const firstDeadParentChildren = (firstDeadParent.item.kinder ??
    []) as KindItem[];

  return (
    <div className="flex flex-col gap-kern-space-default">
      <h2 className="kern-title">{SECTION_TITLES[depth - 1]}</h2>
      <InlineNotice
        title={deceasedParentsNoticeTitle}
        tagName="p"
        look="info"
        nested
        content={deceasedParentsNoticeContent(
          collectDeceasedParentNames(items, depth - 1),
        )}
      />
      {descendants.map(({ item, indexes, directParentName }) => (
        <DescendantRow
          key={indexes.join("-")}
          item={item}
          indexes={indexes}
          depth={depth}
          baseUrl={baseUrl}
          initialInputUrl={initialInputUrl}
          badgeLabel={`Kind von ${directParentName}`}
        />
      ))}
      <div>
        <Button
          look="secondary"
          iconLeft={<Icon name="plus" className="text-kern-action-default" />}
          href={buildAddUrl(
            baseUrl,
            firstDeadParent.indexes,
            firstDeadParentChildren.length,
            initialInputUrl,
          )}
        >
          {ADD_LABELS[depth - 1]}
        </Button>
      </div>
    </div>
  );
}

export function KinderSummary({
  data,
  configuration,
  category,
  deceasedPersonName,
}: Readonly<{
  data: ArrayData;
  configuration: ArrayConfigClient;
  category: string;
  deceasedPersonName?: string;
}>) {
  const { url, initialInputUrl, disableAddButton } = configuration;
  const items = data as KindItem[];
  const level1Badge = badgeLabel(1, deceasedPersonName);

  return (
    <>
      {/* Level 1 — Kinder */}
      <div className="flex flex-col gap-kern-space-default">
        <h2 className="kern-title">{SECTION_TITLES[0]}</h2>
        {items.map((item, itemIndex) => {
          const editUrl = buildEditUrl(url, [itemIndex], initialInputUrl);
          return (
            <KindSummaryItem
              key={editUrl}
              item={item}
              badgeLabel={level1Badge}
              actions={
                <ArraySummaryItemActions
                  category={category}
                  itemIndex={itemIndex}
                  editUrl={editUrl}
                />
              }
            />
          );
        })}
        <div>
          <Button
            look="secondary"
            iconLeft={<Icon name="plus" className="text-kern-action-default" />}
            href={buildAddUrl(url, [], items.length, initialInputUrl)}
            disabled={disableAddButton}
            data-testid={`add-${category}`}
          >
            {ADD_LABELS[0]}
          </Button>
        </div>
      </div>

      {/* Levels 2–5 — flat list per depth, single add button, dynamic parent select on form */}
      {[2, 3, 4, 5].map((depth) => (
        <FlatDescendantSection
          key={depth}
          depth={depth}
          items={items}
          baseUrl={url}
          initialInputUrl={initialInputUrl}
        />
      ))}
    </>
  );
}
