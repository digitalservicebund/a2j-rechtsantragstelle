import * as sharedDoneFunctions from "~/domains/shared/finanzielleAngaben/doneFunctions";
import * as doneFunctions from "../doneFunctions";
import { eigentumZusammenfassungDone } from "../eigentumZusammenfassungDone";

describe("eigentumZusammenfassungDone", () => {
  it("passes with all sub-flows done", () => {
    vi.spyOn(sharedDoneFunctions, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "wertsachenDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "kraftfahrzeugeDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeTruthy();
  });

  it("fails with bankkonto not done", () => {
    vi.spyOn(sharedDoneFunctions, "bankKontoDone").mockReturnValue(false);
    vi.spyOn(doneFunctions, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with geldanlagen not done", () => {
    vi.spyOn(sharedDoneFunctions, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "geldanlagenDone").mockReturnValue(false);
    vi.spyOn(doneFunctions, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with grundeigentum not done", () => {
    vi.spyOn(sharedDoneFunctions, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "grundeigentumDone").mockReturnValue(false);
    vi.spyOn(doneFunctions, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with kraftfahrzeug not done", () => {
    vi.spyOn(sharedDoneFunctions, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "kraftfahrzeugeDone").mockReturnValue(false);
    vi.spyOn(doneFunctions, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with wertsachen not done", () => {
    vi.spyOn(sharedDoneFunctions, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(doneFunctions, "wertsachenDone").mockReturnValue(false);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });
});
