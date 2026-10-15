import { flowRoutes, vorabcheckRoutes } from "../flowRoutes";

describe("flowRoutes", () => {
  it("should return the correct routes", () => {
    expect(flowRoutes("BHA")).toEqual([
      {
        file: "routes/shared/formular.ts",
        id: "flowBHA",
        path: "*",
      },
      {
        file: "routes/shared/pdfDownloadLoader.ts",
        id: "pdfBHA",
        path: "download/pdf",
      },
    ]);
  });
});

describe("vorabcheckRoutes", () => {
  it("should return the correct routes", () => {
    expect(vorabcheckRoutes("BHA")).toEqual([
      {
        file: "routes/shared/vorabcheck.ts",
        id: "flowBHA",
        path: "*",
      },
      {
        file: "routes/shared/result.ts",
        id: "resBHA",
        path: "ergebnis/*",
      },
    ]);
  });
});
