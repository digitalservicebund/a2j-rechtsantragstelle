import { extractJsonFilesFromZip } from "~/util/file/extractJsonFilesFromZip";

afterEach(() => {
  jest.clearAllMocks();
});

describe("extractJsonFilesFromZip", () => {
  const consoleLogSpy = jest
    .spyOn(global.console, "log")
    .mockImplementation(() => jest.fn());

  it("extracts all json from .zip file", () => {
    const zipContent = extractJsonFilesFromZip(
      `${__dirname}/zipWithJsonFilesMacOS.zip`,
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
