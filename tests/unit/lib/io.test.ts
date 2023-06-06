import { printFileReadError, loadJsonFromFile } from "~/lib/io";

afterEach(() => {
  jest.clearAllMocks();
});

const consoleErrorSpy = jest
  .spyOn(global.console, "error")
  .mockImplementation(() => jest.fn());

describe("loadJsonFromFile", () => {
  it("loads content from a json file", () => {
    expect(loadJsonFromFile(`${__dirname}/test.json`)).toStrictEqual({
      testContent: [{ a: 1 }],
    });
  });

  it("returns an empty object for invalid paths", () => {
    expect(loadJsonFromFile(`not_existing_file.json`)).toStrictEqual({});
  });

  it("returns an empty object for malformed files", () => {
    expect(loadJsonFromFile(`${__dirname}/malformed.json`)).toStrictEqual({});
  });

  it("communicates an error for invalid path", () => {
    loadJsonFromFile(`not_existing_file.json`);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});

describe("handleIOError", () => {
  it("prints file not found error", () => {
    printFileReadError({
      code: "ENOENT",
      message: "irrelevant",
    });

    expect(consoleErrorSpy.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("File not found"),
        expect.any(String),
      ])
    );
  });

  it("prints malformed file error", () => {
    printFileReadError({
      code: "irrelevant",
      message: "irrelevant",
    });

    expect(consoleErrorSpy.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Error reading file"),
        expect.any(String),
      ])
    );
  });
});
