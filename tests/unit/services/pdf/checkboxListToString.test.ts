import { CheckboxValue } from "~/components/inputs/Checkbox";
import { checkboxListToString } from "~/services/pdf/checkboxListToString";

describe("checkboxListToString()", () => {
  it("works for single entry", () => {
    expect(checkboxListToString({ a: "abc" }, { a: CheckboxValue.on })).toBe(
      "abc",
    );
  });

  it("works for multiple entries", () => {
    expect(
      checkboxListToString(
        { a: "abc", b: "jkl" },
        { a: CheckboxValue.on, b: CheckboxValue.on },
      ),
    ).toBe("abc, jkl");
  });

  it("returns empty string without options", () => {
    expect(checkboxListToString({})).toBe("");
  });

  it("skips entries without mapping", () => {
    expect(
      checkboxListToString({ a: "abc", b: "jkl" }, { a: CheckboxValue.on }),
    ).toBe("abc");
  });
});
