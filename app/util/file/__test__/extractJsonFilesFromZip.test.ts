import { extractJsonFilesFromZip } from "~/util/file/extractJsonFilesFromZip";

afterEach(() => {
  vi.clearAllMocks();
});

describe("extractJsonFilesFromZip", () => {
  const consoleLogSpy = vi
    .spyOn(global.console, "log")
    .mockImplementation(() => vi.fn());

  it("extracts all json from .zip file", () => {
    const zipContent = extractJsonFilesFromZip(
      `${__dirname}/zipWithJsonFilesMacOS.zip`,
    );

    expect(zipContent).toStrictEqual({
      "test1.json": { testContent: [{ a: 1 }] },
      "test.json": { testContent: [{ a: 1 }] },
    });
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it("Fails on non-existing file", () => {
    expect(() => {
      extractJsonFilesFromZip(`notExisting.zip`);
    }).toThrow();
  });
});
