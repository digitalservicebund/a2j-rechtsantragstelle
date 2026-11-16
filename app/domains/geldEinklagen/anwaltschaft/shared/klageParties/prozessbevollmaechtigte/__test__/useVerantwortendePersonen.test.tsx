import { act, renderHook } from "@testing-library/react";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { useVerantwortendePersonen } from "../useVerantwortendePersonen";
import { gesellschaft } from "./fixtures";

vi.mock("~/components/hooks/useDeleteArrayItem", () => ({
  useDeleteArrayItem: vi.fn(),
}));

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

describe("useVerantwortendePersonen", () => {
  it("selects the persons and deletes using the parent and person indices", async () => {
    const { result } = renderHook(() =>
      useVerantwortendePersonen(gesellschaft, 3),
    );
    const baseUrl = `/geld-einklagen/anwaltschaft/klagende-partei/prozessbevollmaechtigte/3/verantwortende-personen`;
    expect(result.current.personsArray).toBe(
      gesellschaft["verantwortende-personen"],
    );
    expect(result.current.nextItemIndex).toBe(
      gesellschaft["verantwortende-personen"].length,
    );
    expect(result.current.baseAdditionalPersonUrl).toBe(baseUrl);
    expect(result.current.additionalPersonIdPrefix).toBe(
      `klagende-prozessbevollmaechtigte-3-verantwortende-personen`,
    );
    expect(useDeleteArrayItem).toHaveBeenCalledWith(
      `klagendeProzessbevollmaechtigte#verantwortende-personen`,
      baseUrl,
      expect.any(Function),
    );
    const onDelete = result.current.deleteAdditionalPerson(1);
    expect(deleteArrayItem).toHaveBeenCalledExactlyOnceWith(1);
    await onDelete;
  });

  it("starts an empty array at index zero", () => {
    const company = { ...gesellschaft, "verantwortende-personen": [] };
    const { result } = renderHook(() => useVerantwortendePersonen(company, 0));
    expect(result.current.personsArray).toEqual([]);
    expect(result.current.nextItemIndex).toBe(0);
  });

  it("restores focus after editing and clears the stored index", () => {
    const { result, unmount } = renderHook(() =>
      useVerantwortendePersonen(gesellschaft, 2),
    );
    result.current.onEditAdditionalPerson(1)();
    const target = addFocusTarget(
      `${result.current.additionalPersonIdPrefix}-1`,
    );
    unmount();
    renderHook(() => useVerantwortendePersonen(gesellschaft, 2));
    act(() => vi.runAllTimers());
    expect(target).toHaveFocus();
    expect(sessionStorage).toHaveLength(0);
  });

  it("does not restore focus in another parent representative", () => {
    const { result, unmount } = renderHook(() =>
      useVerantwortendePersonen(gesellschaft, 2),
    );
    result.current.onEditAdditionalPerson(0)();
    const target = addFocusTarget(
      `${result.current.additionalPersonIdPrefix}-0`,
    );
    unmount();
    renderHook(() => useVerantwortendePersonen(gesellschaft, 1));
    act(() => vi.runAllTimers());
    expect(target).not.toHaveFocus();
    expect(sessionStorage).toHaveLength(1);
  });

  it("preserves focus when no edit is pending", () => {
    const target = addFocusTarget("existing-focus");
    target.focus();
    renderHook(() => useVerantwortendePersonen(gesellschaft, 0));
    act(() => vi.runAllTimers());
    expect(target).toHaveFocus();
  });

  it("cancels pending focus restoration on unmount", () => {
    const { result, unmount } = renderHook(() =>
      useVerantwortendePersonen(gesellschaft, 0),
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
        useVerantwortendePersonen(gesellschaft, 2),
      );
      const focusAfterDeletion = vi
        .mocked(useDeleteArrayItem)
        .mock.calls.at(-1)?.[2];
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
      const deletion = result.current.deleteAdditionalPerson(1);
      act(() => vi.advanceTimersByTime(100));
      expect(target).not.toHaveFocus();
      finishDeletion();
      await deletion;
      focusAfterDeletion?.(1);
      act(() => vi.advanceTimersByTime(99));
      expect(target).not.toHaveFocus();
      act(() => vi.advanceTimersByTime(1));
      expect(target).toHaveFocus();
    },
  );

  it("propagates deletion failures without moving focus", async () => {
    const { result } = renderHook(() =>
      useVerantwortendePersonen(gesellschaft, 0),
    );
    const target = addFocusTarget(
      `${result.current.additionalPersonIdPrefix}-add`,
    );
    deleteArrayItem.mockRejectedValueOnce(new Error("Deletion failed"));
    await expect(result.current.deleteAdditionalPerson(0)).rejects.toThrow(
      "Deletion failed",
    );
    act(() => vi.runAllTimers());
    expect(target).not.toHaveFocus();
  });
});
