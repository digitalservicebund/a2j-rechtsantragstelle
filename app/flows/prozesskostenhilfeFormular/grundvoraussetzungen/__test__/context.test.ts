import {
  formularIsNachueberpruefung,
  grundvoraussetzungenDone,
  verfahrenAnwalt,
  verfahrenSelbststaendig,
  versandDigitalAnwalt,
  versandDigitalGericht,
} from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";

describe("PKH Grundvoraussetzungen Context", () => {
  describe("guards", () => {
    describe("formularIsNachueberpruefung", () => {
      it("should return true if the user is making a nachueberpruefung", () => {
        expect(
          formularIsNachueberpruefung({
            context: { formularArt: "nachueberpruefung" },
          }),
        ).toBe(true);
      });

      it("should return false if the user hasn't answered the formular art question, or if the user is making a new application", () => {
        expect(
          formularIsNachueberpruefung({
            context: { formularArt: undefined },
          }),
        ).toBe(false);
        expect(
          formularIsNachueberpruefung({
            context: { formularArt: "erstantrag" },
          }),
        ).toBe(false);
      });
    });

    describe("verfahrenAnwalt", () => {
      it("should return true if the user is submitting the form to a lawyer", () => {
        expect(
          verfahrenAnwalt({
            context: {
              verfahrenArt: "verfahrenAnwalt",
            },
          }),
        ).toBe(true);
      });

      it("should return false if the user hasn't chosen a submission type or if the user is submitting the form themselves", () => {
        expect(
          verfahrenAnwalt({
            context: {
              verfahrenArt: undefined,
            },
          }),
        ).toBe(false);
        expect(
          verfahrenAnwalt({
            context: {
              verfahrenArt: "verfahrenSelbststaendig",
            },
          }),
        ).toBe(false);
      });
    });

    describe("verfahrenSelbststaendig", () => {
      it("should return true if the user is submitting the form themselves", () => {
        expect(
          verfahrenSelbststaendig({
            context: {
              verfahrenArt: "verfahrenSelbststaendig",
            },
          }),
        ).toBe(true);
      });

      it("should return false if the user hasn't chosen a submission type or if the user is submitting the form to a lawyer", () => {
        expect(
          verfahrenSelbststaendig({
            context: {
              verfahrenArt: undefined,
            },
          }),
        ).toBe(false);
        expect(
          verfahrenSelbststaendig({
            context: {
              verfahrenArt: "verfahrenAnwalt",
            },
          }),
        ).toBe(false);
      });
    });

    describe("versandDigitalAnwalt", () => {
      it("should return true if this is the user's first application, they're sending the form to a lawyer, and they wish to send it digitally", () => {
        expect(
          versandDigitalAnwalt({
            context: {
              formularArt: "erstantrag",
              verfahrenArt: "verfahrenAnwalt",
              versandArt: "digital",
            },
          }),
        ).toBe(true);
      });

      it("should return false if the user is making a nachueberpruefung", () => {
        expect(
          versandDigitalAnwalt({
            context: {
              formularArt: "nachueberpruefung",
            },
          }),
        ).toBe(false);
      });

      it("should return false if the user is sending the form themselves", () => {
        expect(
          versandDigitalAnwalt({
            context: {
              verfahrenArt: "verfahrenSelbststaendig",
            },
          }),
        ).toBe(false);
      });

      it("should return false if the user is sending the form in analog form", () => {
        expect(
          versandDigitalAnwalt({
            context: {
              versandArt: "analog",
            },
          }),
        ).toBe(false);
      });
    });

    describe("versandDigitalGericht", () => {
      it("should return true if the user is making a nachueberpruefung and wishes to send it digitally", () => {
        expect(
          versandDigitalGericht({
            context: {
              formularArt: "nachueberpruefung",
              versandArt: "digital",
            },
          }),
        ).toBe(true);
      });

      it("should return true if the user is filling out the form for the first time, by themselves, and wishes to send it digitally", () => {
        expect(
          versandDigitalGericht({
            context: {
              formularArt: "erstantrag",
              verfahrenArt: "verfahrenSelbststaendig",
              versandArt: "digital",
            },
          }),
        ).toBe(true);
      });

      it("should return false if the user is sending the form in analog form", () => {
        expect(
          versandDigitalGericht({
            context: {
              versandArt: "analog",
            },
          }),
        ).toBe(false);
      });

      it("should return false if the user is sending the form to a lawyer", () => {
        expect(
          versandDigitalGericht({
            context: {
              verfahrenArt: "verfahrenAnwalt",
            },
          }),
        ).toBe(false);
      });
    });
  });

  describe("grundvoraussetzungenDone", () => {
    it("should return true if the user has answered all questions pertaining to a digital Gericht submission", () => {
      expect(
        grundvoraussetzungenDone({
          context: {
            formularArt: "nachueberpruefung",
            versandArt: "digital",
          },
        }),
      ).toBe(true);
      expect(
        grundvoraussetzungenDone({
          context: {
            formularArt: "erstantrag",
            verfahrenArt: "verfahrenSelbststaendig",
            versandArt: "digital",
          },
        }),
      ).toBe(true);
    });
  });
});
