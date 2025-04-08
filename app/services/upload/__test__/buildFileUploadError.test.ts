import { buildFileUploadError } from "../buildFileUploadError";

describe("buildFileUploadError", () => {
  it("should format the validation error to what the frontend expects", () => {
    const errorResult = {
      error: {
        fieldErrors: {
          "belege[0].fileType": "Only PDF and TIFF files allowed",
        },
      },
      data: undefined,
      submittedData: {
        belege: [
          {
            fileType: "invalid",
          },
        ],
      },
    };
    const validationError = buildFileUploadError(errorResult, "belege[0]");

    expect(validationError.init?.status).toBe(422);
    expect(validationError.data).toEqual({
      fieldErrors: {
        ["belege[0]"]: "Only PDF and TIFF files allowed",
      },
      repopulateFields: {
        belege: [
          {
            fileType: "invalid",
          },
        ],
      },
    });
  });
});
