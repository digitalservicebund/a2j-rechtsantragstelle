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

type GrandkindItem = {
  name?: BasicTypes;
  isAlive?: BasicTypes;
};

type ElternteilKindItem = {
  name?: BasicTypes;
  isAlive?: BasicTypes;
  hatteKinder?: BasicTypes;
  kinder?: GrandkindItem[];
  parentElternteilIndex?: BasicTypes;
};

type ElternteilItem = {
  name?: BasicTypes;
  isAlive?: BasicTypes;
  hatteKinder?: BasicTypes;
  kinder?: ElternteilKindItem[];
};

type KindEntry = {
  kind: ElternteilKindItem;
  kindIndex: number;
  elternteilIndex: number;
  badgeLabel: string;
  kinderBase: string;
};

// The parent a sibling belongs to comes from its chosen `parentElternteilIndex`
// (0 / 1 / "both"), which is authoritative over the array it's physically stored in.
// A stale index pointing at a missing or living parent falls back to the physical
// parent — mirroring the inheritance calc's reassignment.
export function siblingBadgeLabel(
  kind: ElternteilKindItem,
  elternteile: ElternteilItem[],
  physicalName: string,
): string {
  const assigned = kind.parentElternteilIndex;
  if (assigned === "both") return "Kind von beiden Elternteilen";
  const assignedParent =
    assigned != null ? elternteile[Number(assigned)] : undefined;
  const assignedName =
    assignedParent?.isAlive === "no" ? assignedParent.name : undefined;
  return `Kind von ${String(assignedName ?? physicalName)}`;
}

type GrandkindEntry = {
  grandkind: GrandkindItem;
  grandkindIndex: number;
  elternteilIndex: number;
  kindIndex: number;
  kindName: string;
  grandkinderBase: string;
};

function collectKinder(elternteile: ElternteilItem[], url: string): KindEntry[] {
  return elternteile.flatMap((elternteil, elternteilIndex) => {
    if (elternteil.isAlive !== "no" || elternteil.hatteKinder !== "yes")
      return [];
    const elternteilName = String(elternteil.name ?? "");
    const kinderBase = `${url}/${elternteilIndex}/kinder`;
    return (elternteil.kinder ?? []).map((kind, kindIndex) => ({
      kind,
      kindIndex,
      elternteilIndex,
      badgeLabel: siblingBadgeLabel(kind, elternteile, elternteilName),
      kinderBase,
    }));
  });
}

function collectGrandkinder(allKinder: KindEntry[]): GrandkindEntry[] {
  return allKinder.flatMap(
    ({ kind, kindIndex, elternteilIndex, kinderBase }) => {
      if (kind.isAlive !== "no" || kind.hatteKinder !== "yes") return [];
      const kindName = String(kind.name ?? "");
      const grandkinderBase = `${kinderBase}/${kindIndex}/kinder`;
      return (kind.kinder ?? []).map((grandkind, grandkindIndex) => ({
        grandkind,
        grandkindIndex,
        elternteilIndex,
        kindIndex,
        kindName,
        grandkinderBase,
      }));
    },
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
  badgeLabel,
  actions,
}: Readonly<{
  name: string;
  isAlive: string;
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
  const elternteile = data as ElternteilItem[];

  const allKinder = collectKinder(elternteile, url);
  const allGrandkinder = collectGrandkinder(allKinder);

  // First dead parent with hatteKinder=yes — drives level-2 section visibility and add-button URL
  const firstDeadParent = elternteile
    .map((elternteil, elternteilIndex) => ({ elternteil, elternteilIndex }))
    .find(
      ({ elternteil }) =>
        elternteil.isAlive === "no" && elternteil.hatteKinder === "yes",
    );

  // First dead kind with hatteKinder=yes — drives level-3 section visibility and add-button URL
  const firstDeadKind = allKinder.find(
    ({ kind }) => kind.isAlive === "no" && kind.hatteKinder === "yes",
  );

  const kinderAddUrl = firstDeadParent
    ? `${url}/${firstDeadParent.elternteilIndex}/kinder/${(firstDeadParent.elternteil.kinder ?? []).length}/${initialInputUrl}`
    : null;

  const grandkinderAddUrl = firstDeadKind
    ? `${firstDeadKind.kinderBase}/${firstDeadKind.kindIndex}/kinder/${(firstDeadKind.kind.kinder ?? []).length}/${initialInputUrl}`
    : null;

  return (
    <>
      {/* Level 1 — Elternteile */}
      <div className="flex flex-col gap-kern-space-default">
        <h2 className="kern-title">Elternteile</h2>
        {elternteile.map((elternteil, elternteilIndex) => (
          // oxlint-disable-next-line react/no-array-index-key
          <PersonSummaryItem
            key={elternteilIndex}
            name={String(elternteil.name ?? "")}
            isAlive={String(elternteil.isAlive ?? "yes")}
            badgeLabel={
              deceasedPersonName
                ? `Elternteil von ${deceasedPersonName}`
                : undefined
            }
            actions={
              <ArraySummaryItemActions
                category="elternteile"
                itemIndex={elternteilIndex}
                editUrl={`${url}/${elternteilIndex}/${initialInputUrl}`}
              />
            }
          />
        ))}
        {elternteile.length < 2 && (
          <AddButton href={`${url}/${elternteile.length}/${initialInputUrl}`}>
            Elternteil hinzufügen
          </AddButton>
        )}
      </div>

      {/* Level 2 — All kinder from all dead parents, flat */}
      {firstDeadParent && (
        <div className="flex flex-col gap-kern-space-default">
          <h2 className="kern-title">Kinder von Elternteilen</h2>
          {allKinder.map(
            ({ kind, kindIndex, elternteilIndex, badgeLabel, kinderBase }) => (
              // oxlint-disable-next-line react/no-array-index-key
              <PersonSummaryItem
                key={`${elternteilIndex}-${kindIndex}`}
                name={String(kind.name ?? "")}
                isAlive={String(kind.isAlive ?? "yes")}
                badgeLabel={badgeLabel}
                actions={
                  <InlineActions
                    editUrl={`${kinderBase}/${kindIndex}/${initialInputUrl}`}
                    category="elternteile#kinder"
                    itemIndex={kindIndex}
                    pathnameArrayItem={kinderBase}
                  />
                }
              />
            ),
          )}
          {kinderAddUrl && (
            <AddButton href={kinderAddUrl}>Kind hinzufügen</AddButton>
          )}
        </div>
      )}

      {/* Level 3 — All grandkinder from all dead kinder, flat */}
      {firstDeadKind && (
        <div className="flex flex-col gap-kern-space-default">
          <h2 className="kern-title">Enkelkinder von Elternteilen</h2>
          {allGrandkinder.map(
            ({
              grandkind,
              grandkindIndex,
              elternteilIndex,
              kindIndex,
              kindName,
              grandkinderBase,
            }) => (
              // oxlint-disable-next-line react/no-array-index-key
              <PersonSummaryItem
                key={`${elternteilIndex}-${kindIndex}-${grandkindIndex}`}
                name={String(grandkind.name ?? "")}
                isAlive={String(grandkind.isAlive ?? "yes")}
                badgeLabel={`Kind von ${kindName}`}
                actions={
                  <InlineActions
                    editUrl={`${grandkinderBase}/${grandkindIndex}/${initialInputUrl}`}
                    category="elternteile#kinder#kinder"
                    itemIndex={grandkindIndex}
                    pathnameArrayItem={grandkinderBase}
                  />
                }
              />
            ),
          )}
          {grandkinderAddUrl && (
            <AddButton href={grandkinderAddUrl}>Kind hinzufügen</AddButton>
          )}
        </div>
      )}
    </>
  );
}
