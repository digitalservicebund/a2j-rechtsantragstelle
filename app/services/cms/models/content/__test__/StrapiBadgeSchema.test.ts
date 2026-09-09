import z from "zod";
import { StrapiBadgeSchema } from "../StrapiBadge";

describe("StrapiBadgeSchema", () => {
  it("should fail in case content is missing", () => {
    const undefinedContent = {
      content: undefined,
      __component: "page.badge",
      id: 1,
    };

    expect(z.validate(StrapiBadgeSchema, undefinedContent)).toBe(false);
  });

  it("should fail in case content is null", () => {
    const nullContent = {
      content: null,
      __component: "page.badge",
      id: 1,
    };

    expect(z.validate(StrapiBadgeSchema, nullContent)).toBe(false);
  });

  it("should pass with valid data", () => {
    const validContent = {
      content: "someContent",
      __component: "page.badge",
      id: 1,
    };

    expect(z.validate(StrapiBadgeSchema, validContent)).toBe(true);
  });
});
