import { type DropdownOption } from "~/services/cms/models/formElements/StrapiDropdown";
import { translations } from "~/services/translations/translations";

export const BOTH_PARENTS_VALUE = "both";

type ParentEntry = {
  name?: string;
  isAlive?: string;
  hatteKinder?: string;
};

type NavigableEntry = ParentEntry & { kinder?: NavigableEntry[] };

export function buildParentOptions(
  parents: ParentEntry[] | undefined,
): DropdownOption[] {
  if (!parents) return [];
  return parents
    .map((parent, index) => ({ parent, index }))
    .filter(
      ({ parent }) => parent.isAlive === "no" && parent.hatteKinder === "yes",
    )
    .map(({ parent, index }) => ({
      value: String(index),
      text: parent.name ?? "",
      preSelected: false,
    }));
}

// Options for the elternteile parent select (which parent a sibling belongs to).
// Lists the dead parents by index, and — once both parents have been entered —
// a "Beide Elternteile" option for full siblings (child of both parents).
export function buildElternteilParentOptions(
  elternteile: ParentEntry[] | undefined,
): DropdownOption[] {
  if (!elternteile) return [];
  const options: DropdownOption[] = elternteile
    .map((parent, index) => ({ parent, index }))
    .filter(({ parent }) => parent.isAlive === "no")
    .map(({ parent, index }) => ({
      value: String(index),
      text: parent.name ?? "",
      preSelected: false,
    }));
  if (elternteile.length === 2) {
    options.push({
      value: BOTH_PARENTS_VALUE,
      text: translations.select.bothParents.de,
      preSelected: false,
    });
  }
  return options;
}

// Navigates the nested kinder tree to find the correct parent array for a
// parentKindIndex select field at any depth.
// kinder#kinder#parentKindIndex (depth 2) → rootKinder itself (no navigation)
// kinder#kinder#kinder#parentKindIndex (depth 3) → rootKinder[ancestorIndex].kinder
// Each extra "kinder#" prefix requires following one more ancestorIndex.
export function buildKinderParentOptions(
  rootKinder: NavigableEntry[] | undefined,
  fieldName: string,
  arrayIndexes: number[],
): DropdownOption[] {
  const ancestorIndexesToFollow = arrayIndexes.slice(
    0,
    fieldName.split("#").length - 3,
  );
  const parentKinder = ancestorIndexesToFollow.reduce(
    (kinder, ancestorIndex) => kinder?.[ancestorIndex]?.kinder,
    rootKinder as NavigableEntry[] | undefined,
  );
  return buildParentOptions(parentKinder);
}

// When only one option is available, preselect it so the user isn't forced to
// pick the sole choice (e.g. a single dead parent).
function preselectIfSingle(options: DropdownOption[]): DropdownOption[] {
  if (options.length !== 1) return options;
  return [{ ...options[0], preSelected: true }];
}

// Resolves the dropdown options for any dynamic-select field in this flow.
// Handles both the flat elternteile case and the nested kinder tree case.
export function resolveParentOptions(
  fieldName: string,
  userData: Record<string, unknown>,
  arrayIndexes: number[],
): DropdownOption[] {
  if (
    fieldName.startsWith("kinder#") &&
    fieldName.endsWith("#parentKindIndex")
  ) {
    return preselectIfSingle(
      buildKinderParentOptions(
        userData.kinder as NavigableEntry[] | undefined,
        fieldName,
        arrayIndexes,
      ),
    );
  }
  if (fieldName === "elternteile#kinder#parentElternteilIndex") {
    return preselectIfSingle(
      buildElternteilParentOptions(
        userData.elternteile as ParentEntry[] | undefined,
      ),
    );
  }
  const parentArrayName = fieldName.split("#")[0];
  return preselectIfSingle(
    buildParentOptions(userData[parentArrayName] as ParentEntry[] | undefined),
  );
}
