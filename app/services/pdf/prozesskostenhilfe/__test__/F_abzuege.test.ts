import {
  mapVersicherungsArt,
  versicherungMapping,
} from "~/services/pdf/prozesskostenhilfe/F_abzuege";

describe("F_abzuege", () => {
  describe("mapVersicherungArt", () => {
    it('should return the sonstigeArt if versicherung.art is "sonstige"', () => {
      const sonstigeArt = "Some kind of Versicherung";
      expect(
        mapVersicherungsArt({
          art: "sonstige",
          sonstigeArt: sonstigeArt,
          beitrag: "100",
        }),
      ).toBe(sonstigeArt);
    });

    it.each(Object.entries(versicherungMapping))(
      "should return %s given a versicherungArt of %s",
      (versicherungArt, versicherungName) => {
        expect(
          mapVersicherungsArt({
            art: versicherungArt as keyof typeof versicherungMapping,
            beitrag: "100",
          }),
        ).toBe(versicherungName);
      },
    );
  });
});
