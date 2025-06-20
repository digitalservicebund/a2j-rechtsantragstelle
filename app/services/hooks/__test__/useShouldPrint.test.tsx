// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useShouldPrint } from "../useShouldPrint";

describe("useShouldPrint", () => {
  it("returns true if print is a search param", () => {
    const { result } = renderHook(() => useShouldPrint(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/?print"]}>{children}</MemoryRouter>
      ),
    });
    expect(result.current).toBe(true);
  });

  it("returns false otherwise", () => {
    const { result } = renderHook(() => useShouldPrint(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
      ),
    });
    expect(result.current).toBe(false);
  });
});
