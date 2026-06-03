import { action } from "~/routes/beratungshilfe.zustaendiges-gericht.auswahl.$PLZ";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";
import { assertResponse, assertValidationError } from "./isResponse";

const mockURLObject = new URL("http://localhost:3000/");

describe("Zuständiges Gericht Auswahl action", () => {
  it("should return a validationResult if the formData fails validation", async () => {
    const formData = new FormData();
    formData.append("street", "");
    formData.append("houseNumber", "12");
    const request = new Request("http://localhost:3000", {
      method: "post",
      body: formData,
    });
    const response = await action(
      mockRouteArgsFromRequest(request, mockURLObject),
    );
    assertValidationError(response);
    expect(response.init?.status).toBe(422);
    expect(response.data.fieldErrors).toEqual({ street: "required" });
  });

  it("should redirect to the ergebnisseite in the case of a valid form", async () => {
    const formData = new FormData();
    formData.append("street", "strasse");
    formData.append("houseNumber", "12");
    const request = new Request("http://localhost:3000", {
      method: "post",
      body: formData,
    });
    const response = await action(
      mockRouteArgsFromRequest(request, mockURLObject, { PLZ: "12345" }),
    );
    assertResponse(response);
    expect(response.headers.get("Location")).toEqual(
      "/beratungshilfe/zustaendiges-gericht/ergebnis/12345/strasse/12",
    );
  });
});
