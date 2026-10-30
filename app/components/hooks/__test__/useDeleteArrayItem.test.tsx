import { renderHook } from "@testing-library/react";
import { useRevalidator, useRouteLoaderData } from "react-router";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { getArrayDataFromFormData } from "~/services/session.server/arrayDeletion";
import { useDeleteArrayItem } from "../useDeleteArrayItem";

vi.mock("react-router", () => ({
  useRevalidator: vi.fn(),
  useRouteLoaderData: vi.fn(),
}));

const revalidate = vi.fn().mockResolvedValue(undefined);
const fetchMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useRouteLoaderData).mockReturnValue({ csrf: "test-csrf" });
  vi.mocked(useRevalidator).mockReturnValue({ revalidate, state: "idle" });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useDeleteArrayItem", () => {
  it.each([
    [
      "sonstigeNebenUndProzessantraege",
      "/geld-einklagen/anwaltschaft/sonstige-neben-und-prozessantraege/antrag",
    ],
    [
      "klagendeProzessbevollmaechtigte",
      "/geld-einklagen/anwaltschaft/klagende-partei/prozessbevollmaechtigte",
    ],
    [
      "beklagteProzessbevollmaechtigte",
      "/geld-einklagen/anwaltschaft/beklagte-partei/prozessbevollmaechtigte",
    ],
  ])(
    "deletes %s using the existing endpoint and revalidates",
    async (arrayName, pathname) => {
      fetchMock.mockResolvedValue(new Response("success"));
      const { result } = renderHook(() =>
        useDeleteArrayItem(arrayName, pathname),
      );
      await result.current(2);

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
        "/action/delete-array-item",
        {
          method: "post",
          body: expect.any(FormData),
        },
      );
      const body = fetchMock.mock.calls[0][1].body as FormData;
      expect(body.get("pathnameArrayItem")).toBe(pathname);
      expect(body.get(arrayName)).toBe("2");
      expect(body.get("_jsEnabled")).toBe("true");
      expect(body.get(CSRFKey)).toBe("test-csrf");
      const parsed = getArrayDataFromFormData(body);
      expect(parsed.isOk).toBe(true);
      if (parsed.isOk) {
        expect(parsed.value).toMatchObject({
          arrayName,
          index: 2,
          flowId: "/geld-einklagen/anwaltschaft",
          arrayIndexes: [],
        });
      }
      expect(revalidate).toHaveBeenCalledOnce();
    },
  );

  it.each([403, 422, 500])(
    "rejects HTTP %s without revalidating",
    async (status) => {
      fetchMock.mockResolvedValue(new Response(null, { status }));
      const { result } = renderHook(() =>
        useDeleteArrayItem("items", "/geld-einklagen/anwaltschaft"),
      );
      await expect(result.current(0)).rejects.toThrow(
        `Array item deletion failed (${status})`,
      );
      expect(revalidate).not.toHaveBeenCalled();
    },
  );

  it("calls the focus callback after revalidation", async () => {
    const calls: string[] = [];
    revalidate.mockImplementationOnce(async () => {
      calls.push("revalidate");
    });
    const focusFunction = vi.fn((index: number) => {
      calls.push(`focus:${index}`);
    });
    fetchMock.mockResolvedValue(new Response("success"));
    const { result } = renderHook(() =>
      useDeleteArrayItem("items", "/items", focusFunction),
    );

    await result.current(2);

    expect(calls).toEqual(["revalidate", "focus:2"]);
    expect(focusFunction).toHaveBeenCalledExactlyOnceWith(2);
  });

  it("propagates network errors without revalidating", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useDeleteArrayItem("items", ""));
    await expect(result.current(0)).rejects.toThrow("Network error");
    expect(revalidate).not.toHaveBeenCalled();
  });
});
