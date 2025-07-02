import { redirect } from "react-router";
import { action } from "~/routes/beratungshilfe.zustaendiges-gericht.auswahl.$PLZ";

const mockRedirect = vi.fn();
vi.mock("react-router");
vi.mocked(redirect).mockImplementation(mockRedirect);

describe("Zuständiges Gericht Auswahl action", () => {
  it("should return a validationResult if the formData fails validation", async () => {
    const formData = new FormData();
    formData.append("street", "");
    formData.append("houseNumber", "12");
    const request = new Request("http://localhost:3000", {
      method: "post",
      body: formData,
    });
    const actionResponse = await action({ request, params: {}, context: {} });
    expect(actionResponse).toHaveProperty("init.status", 422);
    expect(actionResponse).toHaveProperty("data.fieldErrors");
  });

  it("should redirect to the ergebnisseite in the case of a valid form", async () => {
    const formData = new FormData();
    formData.append("street", "strasse");
    formData.append("houseNumber", "12");
    const request = new Request("http://localhost:3000", {
      method: "post",
      body: formData,
    });
    await action({
      request,
      params: {
        PLZ: "12345",
      },
      context: {},
    });
    expect(mockRedirect).toHaveBeenCalledWith(
      "/beratungshilfe/zustaendiges-gericht/ergebnis/12345/strasse/12",
    );
  });
});
