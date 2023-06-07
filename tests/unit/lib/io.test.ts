import { printFileReadError } from "~/lib/io";

afterEach(() => {
  jest.clearAllMocks();
});

const consoleErrorSpy = jest
  .spyOn(global.console, "error")
  .mockImplementation(() => jest.fn());

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
