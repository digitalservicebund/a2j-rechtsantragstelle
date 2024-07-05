import { normalizePropertyName } from "../normalizePropertyName";

describe("normalizePropertyName", () => {
  it("normalizes property names correctly", () => {
    expect(normalizePropertyName("Äpfel")).toBe("aepfel");
    expect(normalizePropertyName("österreich")).toBe("oesterreich");
    expect(normalizePropertyName("Müller-Straße")).toBe("muellerStrasse");
    expect(normalizePropertyName("Müller_Straße")).toBe("mueller_Strasse");
    expect(normalizePropertyName("süß")).toBe("suess");
  });

  it("handles empty strings", () => {
    expect(normalizePropertyName("")).toBe("");
  });

  it("handles strings with no special characters", () => {
    expect(normalizePropertyName("apple")).toBe("apple");
    expect(normalizePropertyName("1234")).toBe("1234");
    expect(normalizePropertyName("CamelCase")).toBe("camelCase");
  });

  it("handles strings with only special characters", () => {
    expect(normalizePropertyName("@#$%^&*()")).toBe("");
  });

  it("handles long strings", () => {
    const longString = "äöü".repeat(10);
    const normalized = "aeoeue".repeat(10);
    expect(normalizePropertyName(longString)).toBe(normalized);
  });
});
