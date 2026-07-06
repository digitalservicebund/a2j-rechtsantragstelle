import { useFetcher } from "react-router";
import ArraySummaryItemActions from "~/components/content/arraySummary/ArraySummaryItemActions";
import Button from "~/components/common/Button";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import { Icon } from "~/components/common/Icon";
import { Badge } from "~/components/common/Badge";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { translations } from "~/services/translations/translations";
import type { ArrayConfigClient } from "~/services/array";
import type { ArrayData, BasicTypes } from "~/domains/userData";

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

function badgeLabel(depth: number, deceasedPersonName?: string): string | undefined {
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

type KindItem = Record<string, BasicTypes> & {
  kinder?: KindItem[];
};

type ItemWithPath = {
  item: KindItem;
  indexes: number[]; // full ancestor path from root, including own index
};

// base/i/inputUrl  or  base/i/kinder/j/inputUrl  etc.
function buildEditUrl(base: string, indexes: number[], inputUrl: string): string {
  const segs = [base];
  indexes.forEach((idx, d) => {
    segs.push(String(idx));
    if (d < indexes.length - 1) segs.push("kinder");
  });
  segs.push(inputUrl);
  return segs.join("/");
}

// Add a new child under parentIndexes:
//   [] → base/count/inputUrl
//   [i] → base/i/kinder/count/inputUrl
//   [i,j] → base/i/kinder/j/kinder/count/inputUrl
function buildAddUrl(
  base: string,
  parentIndexes: number[],
  count: number,
  inputUrl: string,
): string {
  const segs = [base];
  parentIndexes.forEach((idx) => {
    segs.push(String(idx));
    segs.push("kinder");
  });
  segs.push(String(count));
  segs.push(inputUrl);
  return segs.join("/");
}

// Pathname used by delete-array-item to locate the parent array:
//   [] → base  (top-level kinder)
//   [i] → base/i/kinder  (grandkinder of kind[i])
function buildDeletePathname(base: string, parentIndexes: number[]): string {
  if (parentIndexes.length === 0) return base;
  const segs = [base];
  parentIndexes.forEach((idx) => {
    segs.push(String(idx));
    segs.push("kinder");
  });
  return segs.join("/");
}

// "kinder" | "kinder#kinder" | "kinder#kinder#kinder" …
function kindCategory(depth: number): string {
  return Array(depth).fill("kinder").join("#");
}

type DescendantEntry = {
  item: KindItem;
  indexes: number[];
  directParentName: string;
};

// Resolve the array of candidate parents for a descendant at targetDepth from its
// full index path: navigate `.kinder` down the ancestor path (all but the last two
// physical indexes). Mirrors buildKinderParentOptions' navigation.
function parentArrayForDepth(
  items: KindItem[],
  indexes: number[],
  targetDepth: number,
): KindItem[] {
  const ancestorPath = indexes.slice(0, targetDepth - 2);
  return ancestorPath.reduce<KindItem[]>(
    (arr, idx) =>
      Array.isArray(arr[idx]?.kinder) ? (arr[idx].kinder as KindItem[]) : [],
    items,
  );
}

// Collect every item at targetDepth, paired with its parent's name. The parent is
// taken from the item's chosen `parentKindIndex` (authoritative), falling back to the
// physical tree parent when unset or when the index points at a missing or living
// member — mirroring the inheritance calc's reassignment.
export function collectDescendantsWithParentName(
  items: KindItem[],
  targetDepth: number,
): DescendantEntry[] {
  function traverse(
    currentItems: KindItem[],
    currentDepth: number,
    ancestorIndexes: number[],
    parentName: string,
  ): DescendantEntry[] {
    if (currentDepth === targetDepth) {
      return currentItems.map((item, itemIndex) => {
        const indexes = [...ancestorIndexes, itemIndex];
        const chosenIndex = item.parentKindIndex;
        const chosenParent =
          chosenIndex != null
            ? parentArrayForDepth(items, indexes, targetDepth)[
                Number(chosenIndex)
              ]
            : undefined;
        const chosenName =
          chosenParent?.isAlive === "no" ? chosenParent.name : undefined;
        return {
          item,
          indexes,
          directParentName: String(chosenName ?? parentName),
        };
      });
    }
    return currentItems.flatMap((item, itemIndex) =>
      traverse(
        Array.isArray(item.kinder) ? (item.kinder as KindItem[]) : [],
        currentDepth + 1,
        [...ancestorIndexes, itemIndex],
        String(item.name ?? ""),
      ),
    );
  }
  return traverse(items, 1, [], "");
}

// Collect every item at targetDepth with its full index path.
function collectAtDepth(
  items: KindItem[],
  targetDepth: number,
  currentDepth = 1,
  path: number[] = [],
): ItemWithPath[] {
  if (currentDepth === targetDepth) {
    return items.map((item, itemIndex) => ({ item, indexes: [...path, itemIndex] }));
  }
  return items.flatMap((item, itemIndex) => {
    const children = Array.isArray(item.kinder) ? (item.kinder as KindItem[]) : [];
    return collectAtDepth(children, targetDepth, currentDepth + 1, [...path, itemIndex]);
  });
}

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
  const itemIndex = indexes[indexes.length - 1];
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
            category={kindCategory(depth)}
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
  const firstDeadParentChildren = (firstDeadParent.item.kinder ?? []) as KindItem[];

  return (
    <div className="flex flex-col gap-kern-space-default">
      <h2 className="kern-title">{SECTION_TITLES[depth - 1]}</h2>
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
        {items.map((item, i) => (
          // oxlint-disable-next-line react/no-array-index-key
          <KindSummaryItem
            key={i}
            item={item}
            badgeLabel={level1Badge}
            actions={
              <ArraySummaryItemActions
                category={category}
                itemIndex={i}
                editUrl={buildEditUrl(url, [i], initialInputUrl)}
              />
            }
          />
        ))}
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
