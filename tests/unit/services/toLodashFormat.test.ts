import { toLodashFormat } from "~/util/arrayVariable";

describe("toLodashFormat", () => {
  it("leaves strings without hash", () => {
    expect(toLodashFormat("a.b.c")).toBe("a.b.c");
  });
  it("interpolates hashes for the provided indicies", () => {
    expect(toLodashFormat("a.b#c", [1])).toBe("a.b[1].c");
    expect(toLodashFormat("a.b#c#d", [1, 0])).toBe("a.b[1].c[0].d");
  });
  it("throws an error if hashCount and indiciesCount don't match", () => {
    expect(() => toLodashFormat("a#b")).toThrow();
    expect(() => toLodashFormat("a.b", [0])).toThrow();
  });
});
