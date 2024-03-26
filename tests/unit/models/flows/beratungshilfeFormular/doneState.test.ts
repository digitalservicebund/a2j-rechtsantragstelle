import {
  grundvoraussetzungDone,
  type BeratungshilfeGrundvoraussetzungen,
} from "~/models/flows/beratungshilfeFormular/grundvoraussetzung/context";

describe("grundvoraussetzungDone", () => {
  it("tests all revelant fields", () => {
    expect(
      grundvoraussetzungDone({
        context: {
          rechtsschutzversicherung: "no",
          wurdeVerklagt: "no",
          klageEingereicht: "no",
          beratungshilfeBeantragt: "no",
          eigeninitiativeGrundvorraussetzung: "no",
        },
      }),
    ).toBeTruthy();
  });

  it("fail if any property is missing", () => {
    const validContext = {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
    } satisfies BeratungshilfeGrundvoraussetzungen;

    Object.keys(validContext).forEach((key) => {
      const { [key as keyof typeof validContext]: _, ...invalidContext } =
        validContext;
      expect(grundvoraussetzungDone({ context: invalidContext })).toBeFalsy();
      expect(
        grundvoraussetzungDone({ context: { ...validContext, [key]: "yes" } }),
      ).toBeFalsy();
    });
  });
});
