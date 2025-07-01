import { filterFormData } from "../filterFormData";

describe("filterFormData", () => {
  it("creates a object with data", () => {
    const formData = new FormData();
    formData.append("a", "1");
    formData.append("b", "2");
    expect(Array.from(filterFormData(formData).entries())).toEqual([
      ["a", "1"],
      ["b", "2"],
    ]);
  });

  it("filters out entries starting with underscore", () => {
    const formData = new FormData();
    formData.append("a", "1");
    formData.append("_b", "2");
    expect(filterFormData(formData).get("a")).toEqual("1");
  });

  it("filters out repeated entries", () => {
    const formData = new FormData();
    formData.append("a", "1");
    formData.append("a", "2");
    expect(filterFormData(formData).get("a")).toEqual("2");
  });
});
