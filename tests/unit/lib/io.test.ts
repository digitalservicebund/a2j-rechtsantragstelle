import { printFileReadError, normalizeFilepath } from "~/lib/io";

afterEach(() => {
  jest.clearAllMocks();
});

const consoleErrorSpy = jest
  .spyOn(global.console, "error")
  .mockImplementation(() => jest.fn());

describe("normalizeFilepath", () => {
  it("normalizes relative paths", () => {
    expect(normalizeFilepath("./relative")).toBe(`${process.cwd()}/relative`);
  });

  it("normalizes absolute paths", () => {
    expect(normalizeFilepath("/absolute")).toBe(`/absolute`);
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
