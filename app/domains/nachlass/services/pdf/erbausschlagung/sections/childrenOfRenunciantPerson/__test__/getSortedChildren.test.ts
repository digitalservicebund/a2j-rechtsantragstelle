import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { getSortedChildren } from "../getSortedChildren";

describe("getSortedChildren", () => {
  it("should sort children by birth date in descending order", () => {
    const children = [
      {
        vorname: "Child 1",
        nachname: "Mustermann",
        wohnortBeiAntragsteller: "yes",
        geburtsdatum: { day: "01", month: "01", year: "2000" },
      },
      {
        vorname: "Child 2",
        nachname: "Mustermann",
        wohnortBeiAntragsteller: "yes",
        geburtsdatum: { day: "01", month: "01", year: "2010" },
      },
      {
        vorname: "Child 3",
        nachname: "Mustermann",
        wohnortBeiAntragsteller: "yes",
        geburtsdatum: { day: "01", month: "01", year: "1990" },
      },
    ] satisfies Exclude<
      NachlassErbausschlagungAnfrageUserData["kinder"],
      undefined
    >;

    const sortedChildren = getSortedChildren(children);

    expect(sortedChildren[0].vorname).toBe("Child 2");
    expect(sortedChildren[1].vorname).toBe("Child 1");
    expect(sortedChildren[2].vorname).toBe("Child 3");
  });
});
