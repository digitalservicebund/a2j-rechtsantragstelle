import { normalizeFilepath, extractJsonFilesFromZip } from "~/lib/io";

afterEach(() => {
  jest.clearAllMocks();
});

describe("normalizeFilepath", () => {
  it("normalizes relative paths", () => {
    expect(normalizeFilepath("./relative")).toBe(`${process.cwd()}/relative`);
  });

  it("normalizes absolute paths", () => {
    expect(normalizeFilepath("/absolute")).toBe(`/absolute`);
  });
});

describe("extractJsonFilesFromZip", () => {
  const consoleLogSpy = jest
    .spyOn(global.console, "log")
    .mockImplementation(() => jest.fn());

  it("extracts all json from .zip file", () => {
    const zipContent = extractJsonFilesFromZip(
      `${__dirname}/zipWithJsonFilesMacOS.zip`
    );

    expect(zipContent).toStrictEqual({
      "test1.json": { testContent: [{ a: 1 }] },
      "test.json": { testContent: [{ a: 1 }] },
    });
    expect(consoleLogSpy).toBeCalled();
  });

  it("Fails on non-existing file", () => {
    expect(() => {
      extractJsonFilesFromZip(`notExisting.zip`);
    }).toThrow();
  });
});
