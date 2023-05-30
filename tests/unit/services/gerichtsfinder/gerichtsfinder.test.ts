import {
  convertToKvJson,
  gerbehIndex,
  normalizeFilepath,
} from "~/services/gerichtsfinder/convertJsonDataTable";

describe("gerbehIndex", () => {
  it("generates a reproducable index", () => {
    expect(gerbehIndex("a", "b", "c", "d", "Finanzgericht")).toBe(
      gerbehIndex("a", "b", "c", "d", "Finanzgericht")
    );
  });

  it("generates different index for non-equal inputs", () => {
    expect(gerbehIndex("aa", "bb", "cc", "dd", "Finanzgericht")).not.toBe(
      gerbehIndex("a", "b", "c", "d", "Finanzgericht")
    );
  });
});

describe("normalizeFilepath", () => {
  it("normalizes relative paths", () => {
    expect(normalizeFilepath("./relative")).toBe(`${process.cwd()}/relative`);
  });

  it("normalizes absolute paths", () => {
    expect(normalizeFilepath("/absolute")).toBe(`/absolute`);
  });
});

describe("convertToKVJson", () => {
  it("exits without valid file path", () => {
    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((code?: number) => undefined as never);
    jest.spyOn(global.console, "error").mockImplementation(() => undefined);
    convertToKvJson("");
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
