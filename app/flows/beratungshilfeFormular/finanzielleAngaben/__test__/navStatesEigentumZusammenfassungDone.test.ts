import * as navStates from "~/flows/shared/finanzielleAngaben/navStates";
import { eigentumZusammenfassungDone } from "../navStatesEigentumZusammenfassungDone";

describe("eigentumZusammenfassungDone", () => {
  it("passes with all sub-flows done", () => {
    vi.spyOn(navStates, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(navStates, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(navStates, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(navStates, "wertsachenDone").mockReturnValue(true);
    vi.spyOn(navStates, "kraftfahrzeugeDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeTruthy();
  });

  it("fails with bankkonto not done", () => {
    vi.spyOn(navStates, "bankKontoDone").mockReturnValue(false);
    vi.spyOn(navStates, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(navStates, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(navStates, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(navStates, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with geldanlagen not done", () => {
    vi.spyOn(navStates, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(navStates, "geldanlagenDone").mockReturnValue(false);
    vi.spyOn(navStates, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(navStates, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(navStates, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with grundeigentum not done", () => {
    vi.spyOn(navStates, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(navStates, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(navStates, "grundeigentumDone").mockReturnValue(false);
    vi.spyOn(navStates, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(navStates, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with kraftfahrzeug not done", () => {
    vi.spyOn(navStates, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(navStates, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(navStates, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(navStates, "kraftfahrzeugeDone").mockReturnValue(false);
    vi.spyOn(navStates, "wertsachenDone").mockReturnValue(true);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with wertsachen not done", () => {
    vi.spyOn(navStates, "bankKontoDone").mockReturnValue(true);
    vi.spyOn(navStates, "geldanlagenDone").mockReturnValue(true);
    vi.spyOn(navStates, "grundeigentumDone").mockReturnValue(true);
    vi.spyOn(navStates, "kraftfahrzeugeDone").mockReturnValue(true);
    vi.spyOn(navStates, "wertsachenDone").mockReturnValue(false);

    expect(eigentumZusammenfassungDone({ context: {} })).toBeFalsy();
  });
});
