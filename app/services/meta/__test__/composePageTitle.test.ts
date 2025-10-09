import { describe, it, expect } from "vitest";
import { composePageTitle } from "../composePageTitle";
import type { StrapiMeta } from "~/services/cms/models/StrapiMeta";

describe("composePageTitle", () => {
  it("returns pageTitle and parent title separated by a dash when parent meta has a title", () => {
    const parentMeta: StrapiMeta = { title: "Parent Page" } as StrapiMeta;
    const result = composePageTitle("Child Page", parentMeta);
    expect(result).toBe("Child Page - Parent Page");
  });
});
