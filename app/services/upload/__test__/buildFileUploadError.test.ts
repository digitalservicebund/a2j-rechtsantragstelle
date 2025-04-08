import { buildFileUploadError } from "../buildFileUploadError";

describe("buildFileUploadError", () => {
  it("should format the validation error to what the frontend expects", async () => {
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
    expect(validationError.ok).toBe(false);
    expect(validationError.status).toBe(422);
    const responseData = await validationError.json();
    expect(responseData).toEqual({
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
