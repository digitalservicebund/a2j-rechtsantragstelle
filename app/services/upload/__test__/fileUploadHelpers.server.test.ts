import { deleteUserFile } from "../fileUploadHelpers.server";

vi.mock("~/services/externalDataStorage/userFileS3Helpers", () => ({
  deleteUserFileFromS3: vi.fn(),
}));

describe("fileUploadHelpers.server", () => {
  describe("deleteUserFile", () => {
    it("should delete item from userData", async () => {
      const actual = await deleteUserFile(
        "test[0]",
        null,
        { test: [{ savedFileKey: "someValue" }] },
        "/beratungshilfe/antrag",
      );
      expect(actual).toStrictEqual({ test: [] });
    });

    const invalidUserDataMocks = [{}, { test: [] }, { test: [{}] }];
    invalidUserDataMocks.forEach((userDataMock) => {
      it(`should return undefined for invalid userData ${JSON.stringify(userDataMock)}`, async () => {
        const actual = await deleteUserFile(
          "test[0]",
          null,
          userDataMock,
          "/beratungshilfe/antrag",
        );
        expect(actual).toBe(undefined);
      });
    });
  });
});
