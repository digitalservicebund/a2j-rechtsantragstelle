import * as navStatesEigentum from "~/flows/beratungshilfeFormular/finanzielleAngaben/navStatesEigentum";
import { eigentumZusammenfassungDone } from "../eigentumZusammenfassungDone";

describe("eigentumZusammenfassungDone", () => {
  it("passes with all sub-flows done", () => {
    vi.spyOn(navStatesEigentum, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "wertsachenDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "kraftfahrzeugeDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeTruthy();
  });

  it("fails with bankkonto not done", () => {
    vi.spyOn(navStatesEigentum, "bankKontoDone").mockReturnValue(false);
    vi.spyOn(navStatesEigentum, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with geldanlagen not done", () => {
    vi.spyOn(navStatesEigentum, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "geldanlagenDone").mockReturnValue(false);
    vi.spyOn(navStatesEigentum, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with grundeigentum not done", () => {
    vi.spyOn(navStatesEigentum, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "grundeigentumDone").mockReturnValue(false);
    vi.spyOn(navStatesEigentum, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with kraftfahrzeug not done", () => {
    vi.spyOn(navStatesEigentum, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "kraftfahrzeugeDone").mockReturnValue(false);
    vi.spyOn(navStatesEigentum, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with wertsachen not done", () => {
    vi.spyOn(navStatesEigentum, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(navStatesEigentum, "wertsachenDone").mockReturnValue(false);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });
});
