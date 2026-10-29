import { act, renderHook } from "@testing-library/react";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { useAdditionalPersons } from "../useAdditionalPersons";
import { type Berufsausuebungsgesellschaft } from "../prozessbevollmaechtigteSchemas";
import { gesellschaft } from "./fixtures";

vi.mock("~/components/hooks/useDeleteArrayItem", () => ({
  useDeleteArrayItem: vi.fn(),
}));

const individualRepresentatives = {
  ...gesellschaft,
  isProzessbevollmaechtigt: "off",
  "prozessbevollmaechtigte-personen": [
    {
      ...gesellschaft.signaturangaben[0],
      anrede: "frau",
      namedInSignature: "off",
    },
  ],
} satisfies Berufsausuebungsgesellschaft;

const deleteArrayItem = vi.fn<ReturnType<typeof useDeleteArrayItem>>();

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  sessionStorage.clear();
  deleteArrayItem.mockResolvedValue(undefined);
  vi.mocked(useDeleteArrayItem).mockReturnValue(deleteArrayItem);
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  sessionStorage.clear();
  document.body.replaceChildren();
});

const addFocusTarget = (id: string) => {
  const element = document.createElement("div");
  element.id = id;
  element.tabIndex = -1;
  document.body.append(element);
  return element;
};

describe("useAdditionalPersons", () => {
  describe.each(["klagende", "beklagte"] as const)("%s", (relationship) => {
    it.each([
      [gesellschaft, "signaturangaben", gesellschaft.signaturangaben],
      [
        individualRepresentatives,
        "prozessbevollmaechtigte-personen",
        individualRepresentatives["prozessbevollmaechtigte-personen"],
      ],
      [
        { ...individualRepresentatives, isProzessbevollmaechtigt: undefined },
        "prozessbevollmaechtigte-personen",
        individualRepresentatives["prozessbevollmaechtigte-personen"],
      ],
    ] as const)(
      "selects the persons and deletes using the parent and person indices",
      async (company, arrayName, persons) => {
        const { result } = renderHook(() =>
          useAdditionalPersons(company, relationship, 3),
        );
        const baseUrl = `/geld-einklagen/anwaltschaft/${relationship}-partei/prozessbevollmaechtigte/3/${arrayName}`;
        expect(result.current.personsArray).toBe(persons);
        expect(result.current.nextItemIndex).toBe(persons.length);
        expect(result.current.baseAdditionalPersonUrl).toBe(baseUrl);
        expect(useDeleteArrayItem).toHaveBeenCalledWith(
          `${relationship}Prozessbevollmaechtigte#${arrayName}`,
        );
        const onDelete = result.current.deleteAdditionalPerson(1);
        expect(deleteArrayItem).not.toHaveBeenCalled();
        await onDelete();
        expect(deleteArrayItem).toHaveBeenCalledExactlyOnceWith(baseUrl, 1);
      },
    );
  });

  it.each([
    { ...gesellschaft, signaturangaben: [] },
    { ...individualRepresentatives, "prozessbevollmaechtigte-personen": [] },
  ])("starts an empty array at index zero", (company) => {
    const { result } = renderHook(() =>
      useAdditionalPersons(company, "klagende", 0),
    );
    expect(result.current.personsArray).toEqual([]);
    expect(result.current.nextItemIndex).toBe(0);
  });

  it("restores focus after editing and clears the stored index", () => {
    const { result, unmount } = renderHook(() =>
      useAdditionalPersons(gesellschaft, "klagende", 2),
    );
    result.current.onEditAdditionalPerson(1)();
    const target = addFocusTarget(
      `${result.current.additionalPersonIdPrefix}-1`,
    );
    unmount();
    renderHook(() => useAdditionalPersons(gesellschaft, "klagende", 2));
    act(() => vi.runAllTimers());
    expect(target).toHaveFocus();
    expect(sessionStorage).toHaveLength(0);
  });

  it("does not restore focus in another party or parent representative", () => {
    const { result, unmount } = renderHook(() =>
      useAdditionalPersons(gesellschaft, "klagende", 2),
    );
    result.current.onEditAdditionalPerson(0)();
    const target = addFocusTarget(
      `${result.current.additionalPersonIdPrefix}-0`,
    );
    unmount();
    renderHook(() => useAdditionalPersons(gesellschaft, "beklagte", 2));
    renderHook(() => useAdditionalPersons(gesellschaft, "klagende", 1));
    act(() => vi.runAllTimers());
    expect(target).not.toHaveFocus();
    expect(sessionStorage).toHaveLength(1);
  });

  it("preserves focus when no edit is pending", () => {
    const target = addFocusTarget("existing-focus");
    target.focus();
    renderHook(() => useAdditionalPersons(gesellschaft, "klagende", 0));
    act(() => vi.runAllTimers());
    expect(target).toHaveFocus();
  });

  it("cancels pending focus restoration on unmount", () => {
    const { result, unmount } = renderHook(() =>
      useAdditionalPersons(gesellschaft, "klagende", 0),
    );
    result.current.onEditAdditionalPerson(0)();
    const target = addFocusTarget(
      `${result.current.additionalPersonIdPrefix}-0`,
    );
    unmount();
    act(() => vi.runAllTimers());
    expect(target).not.toHaveFocus();
  });

  it.each(["1", "0", "add"])(
    "focuses %s after deletion, falling back from next to previous to add",
    async (suffix) => {
      const { result } = renderHook(() =>
        useAdditionalPersons(gesellschaft, "klagende", 2),
      );
      act(() => vi.runAllTimers());
      const prefix = result.current.additionalPersonIdPrefix;
      const add = addFocusTarget(`${prefix}-add`);
      const previous = suffix !== "add" ? addFocusTarget(`${prefix}-0`) : add;
      const target = suffix === "1" ? addFocusTarget(`${prefix}-1`) : previous;
      let finishDeletion: () => void = vi.fn();
      deleteArrayItem.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          finishDeletion = resolve;
        }),
      );
      const deletion = result.current.deleteAdditionalPerson(1)();
      act(() => vi.advanceTimersByTime(100));
      expect(target).not.toHaveFocus();
      finishDeletion();
      await deletion;
      act(() => vi.advanceTimersByTime(99));
      expect(target).not.toHaveFocus();
      act(() => vi.advanceTimersByTime(1));
      expect(target).toHaveFocus();
    },
  );

  it("propagates deletion failures without moving focus", async () => {
    const { result } = renderHook(() =>
      useAdditionalPersons(gesellschaft, "klagende", 0),
    );
    const target = addFocusTarget(
      `${result.current.additionalPersonIdPrefix}-add`,
    );
    deleteArrayItem.mockRejectedValueOnce(new Error("Deletion failed"));
    await expect(result.current.deleteAdditionalPerson(0)()).rejects.toThrow(
      "Deletion failed",
    );
    act(() => vi.runAllTimers());
    expect(target).not.toHaveFocus();
  });
});
