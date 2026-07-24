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

// Descendant section titles/labels indexed by (treeDepth - 2): siblings are treeDepth 2.
const SECTION_TITLES = [
  "Kinder von Elternteilen",
  "Enkelkinder von Elternteilen",
  "Urenkel von Elternteilen",
  "Ururenkel von Elternteilen",
  "Ururenurenkel von Elternteilen",
];

const ADD_LABELS = [
  "Kind hinzufügen",
  "Enkelkind hinzufügen",
  "Urenkel hinzufügen",
  "Ururenkel hinzufügen",
  "Ururenurenkel hinzufügen",
];

type SectionEntry = {
  item: KindItem;
  indexes: number[];
  badgeLabel: string;
};

// The parent a sibling belongs to comes from its chosen `parentElternteilIndex`
// (0 / 1 / "both"), which is authoritative over the array it's physically stored in.
// A stale index pointing at a missing or living parent falls back to the physical
// parent — mirroring the inheritance calc's reassignment.
export function siblingBadgeLabel(
  sibling: KindItem,
  elternteile: readonly KindItem[],
  physicalName: string,
): string {
  const assigned = sibling.parentElternteilIndex;
  if (assigned === "both") return "Kind von beiden Elternteilen";
  const assignedParent =
    assigned != null ? elternteile[Number(assigned)] : undefined;
  const assignedName =
    assignedParent?.isAlive === "no" ? assignedParent.name : undefined;
  return `Kind von ${String(assignedName ?? physicalName)}`;
}

// Level-1 siblings: badged by their chosen parent (parentElternteilIndex + "both").
function collectSiblings(elternteile: KindItem[]): SectionEntry[] {
  return elternteile.flatMap((parent, elternteilIndex) => {
    if (parent.isAlive !== "no" || parent.hatteKinder !== "yes") return [];
    const parentName = String(parent.name ?? "");
    return (parent.kinder ?? []).map((sibling, siblingIndex) => ({
      item: sibling,
      indexes: [elternteilIndex, siblingIndex],
      badgeLabel: siblingBadgeLabel(sibling, elternteile, parentName),
    }));
  });
}

// Deeper levels (nieces/nephews and below): badged by their direct parent, resolved
// through parentKindIndex like the kinder line.
function collectDeeper(
  elternteile: KindItem[],
  treeDepth: number,
): SectionEntry[] {
  return collectDescendantsWithParentName(elternteile, treeDepth).map(
    ({ item, indexes, directParentName }) => ({
      item,
      indexes,
      badgeLabel: `Kind von ${directParentName}`,
    }),
  );
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

function PersonSummaryItem({
  name,
  isAlive,
  hatteKinder,
  badgeLabel,
  actions,
}: Readonly<{
  name: string;
  isAlive: string;
  hatteKinder?: string;
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
            <dd className="kern-description-list-item__value">{name}</dd>
          </div>
          <div className="kern-description-list-item">
            <dt className="kern-description-list-item__key">
              Lebte zum Todeszeitpunkt?
            </dt>
            <dd className="kern-description-list-item__value">
              {isAlive === "yes" ? "Ja" : "Nein"}
            </dd>
          </div>
          {isAlive === "no" && (
            <div className="kern-description-list-item">
              <dt className="kern-description-list-item__key">
                Hatte weitere Kinder?
              </dt>
              <dd className="kern-description-list-item__value">
                {hatteKinder === "yes" ? "Ja" : "Nein"}
              </dd>
            </div>
          )}
        </dl>
        {actions}
      </div>
    </div>
  );
}

function InlineActions({
  editUrl,
  category,
  itemIndex,
  pathnameArrayItem,
}: Readonly<{
  editUrl: string;
  category: string;
  itemIndex: number;
  pathnameArrayItem: string;
}>) {
  return (
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
        category={category}
        itemIndex={itemIndex}
        pathnameArrayItem={pathnameArrayItem}
      />
    </div>
  );
}

function AddButton({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) {
  return (
    <div>
      <Button
        look="secondary"
        iconLeft={<Icon name="plus" className="text-kern-action-default" />}
        href={href}
      >
        {children}
      </Button>
    </div>
  );
}

// One flat section for a descendant depth (siblings at treeDepth 2, deeper below).
// Shown only when a dead parent-with-kids exists at the previous level; the single
// add button targets that first dead parent's next slot, and the form's parent select
// lets the user attribute the new person to the right parent.
function DescendantSection({
  elternteile,
  treeDepth,
  url,
  initialInputUrl,
}: Readonly<{
  elternteile: KindItem[];
  treeDepth: number;
  url: string;
  initialInputUrl: string;
}>) {
  const firstDeadParent = collectAtDepth(elternteile, treeDepth - 1).find(
    ({ item }) => item.isAlive === "no" && item.hatteKinder === "yes",
  );
  if (!firstDeadParent) return null;

  const entries =
    treeDepth === 2
      ? collectSiblings(elternteile)
      : collectDeeper(elternteile, treeDepth);
  const category = descendantCategory("elternteile", treeDepth);
  const firstDeadParentChildren = firstDeadParent.item.kinder ?? [];

  return (
    <div className="flex flex-col gap-kern-space-default">
      <h2 className="kern-title">{SECTION_TITLES[treeDepth - 2]}</h2>
      <InlineNotice
        title={deceasedParentsNoticeTitle}
        tagName="p"
        look="info"
        nested
        content={deceasedParentsNoticeContent(
          collectDeceasedParentNames(elternteile, treeDepth - 1),
        )}
      />
      {entries.map(({ item, indexes, badgeLabel }) => (
        <PersonSummaryItem
          key={indexes.join("-")}
          name={String(item.name ?? "")}
          isAlive={String(item.isAlive ?? "yes")}
          hatteKinder={item.hatteKinder ? String(item.hatteKinder) : undefined}
          badgeLabel={badgeLabel}
          actions={
            <InlineActions
              editUrl={buildEditUrl(url, indexes, initialInputUrl)}
              category={category}
              itemIndex={indexes.at(-1) ?? 0}
              pathnameArrayItem={buildDeletePathname(url, indexes.slice(0, -1))}
            />
          }
        />
      ))}
      <AddButton
        href={buildAddUrl(
          url,
          firstDeadParent.indexes,
          firstDeadParentChildren.length,
          initialInputUrl,
        )}
      >
        {ADD_LABELS[treeDepth - 2]}
      </AddButton>
    </div>
  );
}

export function ElternteilSummary({
  data,
  configuration,
  deceasedPersonName,
}: Readonly<{
  data: ArrayData;
  configuration: ArrayConfigClient;
  deceasedPersonName?: string;
}>) {
  const { url, initialInputUrl } = configuration;
  const elternteile = data as KindItem[];

  return (
    <>
      {/* Root — Elternteile (the deceased's two parents) */}
      <div className="flex flex-col gap-kern-space-default">
        <h2 className="kern-title">Elternteile</h2>
        {elternteile.map((elternteil, elternteilIndex) => {
          const editUrl = buildEditUrl(url, [elternteilIndex], initialInputUrl);
          return (
            <PersonSummaryItem
              key={editUrl}
              name={String(elternteil.name ?? "")}
              isAlive={String(elternteil.isAlive ?? "yes")}
              hatteKinder={
                elternteil.hatteKinder
                  ? String(elternteil.hatteKinder)
                  : undefined
              }
              badgeLabel={
                deceasedPersonName
                  ? `Elternteil von ${deceasedPersonName}`
                  : undefined
              }
              actions={
                <ArraySummaryItemActions
                  category="elternteile"
                  itemIndex={elternteilIndex}
                  editUrl={editUrl}
                />
              }
            />
          );
        })}
        {elternteile.length < 2 && (
          <AddButton
            href={buildAddUrl(url, [], elternteile.length, initialInputUrl)}
          >
            Elternteil hinzufügen
          </AddButton>
        )}
      </div>

      {/* Descendant levels: siblings (treeDepth 2) down to level 5 (treeDepth 6) */}
      {[2, 3, 4, 5, 6].map((treeDepth) => (
        <DescendantSection
          key={treeDepth}
          elternteile={elternteile}
          treeDepth={treeDepth}
          url={url}
          initialInputUrl={initialInputUrl}
        />
      ))}
    </>
  );
}
