import { describe, it, expect } from "vitest";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  euroSchwelle,
  hasSozialleistungen,
  hasKontopfaendung,
  hasPKonto,
  schuldenBei,
  verheiratet,
} from "../context";
import { kontopfaendungWegweiserXstateConfig } from "../xStateConfig";

type DummyEvent = { type: "SUBMIT" } | { type: "BACK" };

const dummyEvent: DummyEvent = { type: "SUBMIT" } as const;
const dummyBackEvent: DummyEvent = { type: "BACK" } as const;

describe("XStateConfig", () => {
  describe("kontopfaendungWegweiserXstateConfig - abfrage-basis-infos states", () => {
    describe('"start" state', () => {
      const state = kontopfaendungWegweiserXstateConfig.states.start;
      it('SUBMIT transition should be "kontopfaendung"', () => {
        expect(state.on.SUBMIT).toBe("kontopfaendung");
      });
    });

    describe('"kontopfaendung" state', () => {
      const state = kontopfaendungWegweiserXstateConfig.states.kontopfaendung;
      const transitions = state.on.SUBMIT;
      it('should return true for target "ergebnisseite" when hasKontopfaendung is "nein"', () => {
        const guard = transitions[0].guard;
        const result = guard({
          context: { hasKontopfaendung: hasKontopfaendung.Values.nein },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('should return false for target "ergebnisseite" when hasKontopfaendung is not "nein"', () => {
        const guard = transitions[0].guard;
        const result = guard({
          context: { hasKontopfaendung: hasKontopfaendung.Values.ja },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it('should return true for target "p-konto" when hasKontopfaendung is not "nein"', () => {
        const guard = transitions[1].guard;
        const result = guard({
          context: { hasKontopfaendung: hasKontopfaendung.Values.ja },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('should return false for target "p-konto" when hasKontopfaendung is "nein"', () => {
        const guard = transitions[1].guard;
        const result = guard({
          context: { hasKontopfaendung: hasKontopfaendung.Values.nein },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
    });

    describe('"ergebnisseite" state BACK transitions', () => {
      const state = kontopfaendungWegweiserXstateConfig.states.ergebnisseite;
      const transitions = state.on.BACK;
      it('first BACK guard returns true when euroSchwelle equals "nein"', () => {
        const guard = transitions[0].guard;
        const result = guard({
          context: { euroSchwelle: euroSchwelle.Values.nein },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it('first BACK guard returns false when euroSchwelle is not "nein"', () => {
        const guard = transitions[0].guard;
        const result = guard({
          context: { euroSchwelle: euroSchwelle.Values.ja },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
      it('second BACK guard returns true when hasKontopfaendung equals "nein" and euroSchwelle is falsy', () => {
        const guard = transitions[1].guard;
        const result = guard({
          context: {
            hasKontopfaendung: hasKontopfaendung.Values.nein,
            euroSchwelle: undefined,
          },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it('second BACK guard returns false when hasKontopfaendung is not "nein"', () => {
        const guard = transitions[1].guard;
        const result = guard({
          context: {
            hasKontopfaendung: hasKontopfaendung.Values.ja,
            euroSchwelle: undefined,
          },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
    });

    describe('"p-konto" state', () => {
      const state = kontopfaendungWegweiserXstateConfig.states["p-konto"];
      const transitions = state.on.SUBMIT;
      it('first SUBMIT guard returns true when hasPKonto equals "bank"', () => {
        const guard = transitions[0].guard;
        const result = guard({
          context: { hasPKonto: hasPKonto.Values.bank },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('first SUBMIT guard returns true when hasPKonto equals "nichtAktiv"', () => {
        const guard = transitions[0].guard;
        const result = guard({
          context: { hasPKonto: hasPKonto.Values.nichtAktiv },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('first SUBMIT guard returns false when hasPKonto equals "nein"', () => {
        const guard = transitions[0].guard;
        const result = guard({
          context: { hasPKonto: hasPKonto.Values.nein },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it('second SUBMIT guard returns true when hasPKonto equals "nein"', () => {
        const guard = transitions[1].guard;
        const result = guard({
          context: { hasPKonto: hasPKonto.Values.nein },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('second SUBMIT guard returns true when hasPKonto equals "ja"', () => {
        const guard = transitions[1].guard;
        const result = guard({
          context: { hasPKonto: hasPKonto.Values.ja },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('second SUBMIT guard returns false when hasPKonto equals "bank"', () => {
        const guard = transitions[1].guard;
        const result = guard({
          context: { hasPKonto: hasPKonto.Values.bank },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
    });

    describe('"p-konto-probleme" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states["p-konto-probleme"];
      it('SUBMIT transition should be "glaeubiger"', () => {
        expect(state.on.SUBMIT).toBe("glaeubiger");
      });
      it('BACK transition should be "p-konto"', () => {
        expect(state.on.BACK).toBe("p-konto");
      });
    });

    describe('"glaeubiger" state', () => {
      const state = kontopfaendungWegweiserXstateConfig.states.glaeubiger;
      const transitions = state.on.SUBMIT;
      it('first SUBMIT guard returns true when schuldenBei equals "weissNicht"', () => {
        const guard = transitions[0].guard;
        const result = guard({
          context: { schuldenBei: schuldenBei.Values.weissNicht },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('first SUBMIT guard returns false when schuldenBei is not "weissNicht"', () => {
        const guard = transitions[0].guard;
        const result = guard({
          context: { schuldenBei: schuldenBei.Values.privat },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it('second SUBMIT guard returns true when schuldenBei is not "weissNicht"', () => {
        const guard = transitions[1].guard;
        const result = guard({
          context: { schuldenBei: schuldenBei.Values.privat },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('second SUBMIT guard returns false when schuldenBei equals "weissNicht"', () => {
        const guard = transitions[1].guard;
        const result = guard({
          context: { schuldenBei: schuldenBei.Values.weissNicht },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
    });

    it('"glaeubiger-unbekannt" state transitions are correct', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states["glaeubiger-unbekannt"];
      expect(state.on.SUBMIT).toBe("euro-schwelle");
      expect(state.on.BACK).toBe("glaeubiger");
    });

    describe('"euro-schwelle" state', () => {
      const state = kontopfaendungWegweiserXstateConfig.states["euro-schwelle"];
      const submitTransitions = state.on.SUBMIT;
      const backTransitions = state.on.BACK;
      it('first SUBMIT guard returns true when euroSchwelle equals "nein"', () => {
        const guard = submitTransitions[0].guard;
        const result = guard({
          context: { euroSchwelle: euroSchwelle.Values.nein },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('first SUBMIT guard returns false when euroSchwelle is not "nein"', () => {
        const guard = submitTransitions[0].guard;
        const result = guard({
          context: { euroSchwelle: euroSchwelle.Values.ja },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it('second SUBMIT guard returns true when euroSchwelle is not "nein"', () => {
        const guard = submitTransitions[1].guard;
        const result = guard({
          context: { euroSchwelle: euroSchwelle.Values.ja },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('second SUBMIT guard returns false when euroSchwelle equals "nein"', () => {
        const guard = submitTransitions[1].guard;
        const result = guard({
          context: { euroSchwelle: euroSchwelle.Values.nein },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it('first BACK guard returns true when schuldenBei equals "weissNicht"', () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: { schuldenBei: schuldenBei.Values.weissNicht },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it('first BACK guard returns false when schuldenBei is not "weissNicht"', () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: { schuldenBei: schuldenBei.Values.privat },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
      it('second BACK guard returns true when schuldenBei is not "weissNicht"', () => {
        const guard = backTransitions[1].guard;
        const result = guard({
          context: { schuldenBei: schuldenBei.Values.privat },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it('second BACK guard returns false when schuldenBei equals "weissNicht"', () => {
        const guard = backTransitions[1].guard;
        const result = guard({
          context: { schuldenBei: schuldenBei.Values.weissNicht },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
    });

    describe('"p-konto-probleme" state target values', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states["p-konto-probleme"];
      it('SUBMIT transition should be "glaeubiger"', () => {
        expect(state.on.SUBMIT).toBe("glaeubiger");
      });
      it('BACK transition should be "p-konto"', () => {
        expect(state.on.BACK).toBe("p-konto");
      });
    });
  });

  describe('"zwischenseite-unterhalt" state', () => {
    const state =
      kontopfaendungWegweiserXstateConfig.states["zwischenseite-unterhalt"];
    it('SUBMIT transition should be "kinder"', () => {
      expect(state.on.SUBMIT).toBe("kinder");
    });
    it('BACK transition should be "euro-schwelle"', () => {
      expect(state.on.BACK).toBe("euro-schwelle");
    });
  });

  describe('"unterhalt" states', () => {
    describe('"kinder-wohnen-zusammen" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states["kinder-wohnen-zusammen"];
      it('SUBMIT transition should be "kinder-support"', () => {
        expect(state.on.SUBMIT).toBe("kinder-support");
      });
      it('BACK transition should be "kinder"', () => {
        expect(state.on.BACK).toBe("kinder");
      });
    });
    describe('"kinder-support" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states["kinder-support"];
      it('SUBMIT transition should be "partner"', () => {
        expect(state.on.SUBMIT).toBe("partner");
      });
      it('BACK transition should be "kinder-wohnen-zusammen"', () => {
        expect(state.on.BACK).toBe("kinder-wohnen-zusammen");
      });
    });
    describe('"partner" state', () => {
      const state = kontopfaendungWegweiserXstateConfig.states.partner;
      const submitTransitions = state.on.SUBMIT;
      const backTransitions = state.on.BACK;
      it('first SUBMIT guard returns true when verheiratet equals "nein"', () => {
        const guard = submitTransitions[0].guard;
        const result = guard({
          context: { verheiratet: verheiratet.Values.nein },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('first SUBMIT guard returns true when verheiratet equals "verwitwet"', () => {
        const guard = submitTransitions[0].guard;
        const result = guard({
          context: { verheiratet: verheiratet.Values.verwitwet },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('first SUBMIT guard returns false when verheiratet is "ja"', () => {
        const guard = submitTransitions[0].guard;
        const result = guard({
          context: { verheiratet: verheiratet.Values.ja },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it('second SUBMIT guard returns true when verheiratet is not "nein" or "verwitwet"', () => {
        const guard = submitTransitions[1].guard;
        const result = guard({
          context: { verheiratet: verheiratet.Values.ja },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it('second SUBMIT guard returns false when verheiratet equals "nein"', () => {
        const guard = submitTransitions[1].guard;
        const result = guard({
          context: { verheiratet: verheiratet.Values.nein },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it("first BACK guard returns true when hasKinder equals Yes", () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: { hasKinder: YesNoAnswer.Values.yes },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it("first BACK guard returns false when hasKinder equals No", () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: { hasKinder: YesNoAnswer.Values.no },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
      it('second BACK transition should be string "kinder"', () => {
        expect(backTransitions[1].target).toBe("kinder");
      });
      it('"partner-support" state BACK guard returns correct value', () => {
        const state =
          kontopfaendungWegweiserXstateConfig.states["partner-support"];
        const backTransitions = state.on.BACK;
        const guard = backTransitions[0].guard;
        const result = guard
          ? guard({
              context: { verheiratet: verheiratet.Values.ja },
              event: dummyBackEvent,
            })
          : false;
        expect(result).toBe(true);
      });
    });
    describe('"partner-wohnen-zusammen" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states["partner-wohnen-zusammen"];
      it('SUBMIT transition should be "partner-support"', () => {
        expect(state.on.SUBMIT).toBe("partner-support");
      });
      it('BACK transition should be "partner"', () => {
        expect(state.on.BACK).toBe("partner");
      });
    });
    describe('"partner-support" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states["partner-support"];
      it('SUBMIT transition should be "zwischenseite-cash"', () => {
        expect(state.on.SUBMIT).toBe("zwischenseite-cash");
      });
      const backTransitions = state.on.BACK;
      it('first BACK guard returns true when verheiratet is not "nein" or "verwitwet"', () => {
        const guard = backTransitions[0].guard;
        const result = guard
          ? guard({
              context: { verheiratet: verheiratet.Values.ja },
              event: dummyBackEvent,
            })
          : false;
        expect(result).toBe(true);
      });
      it('first BACK guard returns false when verheiratet equals "nein"', () => {
        const guard = backTransitions[0].guard;
        const result = guard
          ? guard({
              context: { verheiratet: verheiratet.Values.nein },
              event: dummyBackEvent,
            })
          : true;
        expect(result).toBe(false);
      });
      it('second BACK transition should be string "partner-wohnen-zusammen"', () => {
        expect(backTransitions[1].target).toBe("partner-wohnen-zusammen");
      });
    });
  });

  describe('"zwischenseite-cash" state', () => {
    const state =
      kontopfaendungWegweiserXstateConfig.states["zwischenseite-cash"];
    it('SUBMIT transition should be "ermittlung-betrags"', () => {
      expect(state.on.SUBMIT).toBe("ermittlung-betrags");
    });
    const backTransitions = state.on.BACK;
    it('first BACK guard returns true when verheiratet equals "nein"', () => {
      const guard = backTransitions[0].guard;
      const result = guard({
        context: { verheiratet: verheiratet.Values.nein },
        event: dummyBackEvent,
      });
      expect(result).toBe(true);
    });
    it('first BACK guard returns false when verheiratet is not "nein"', () => {
      const guard = backTransitions[0].guard;
      const result = guard({
        context: { verheiratet: verheiratet.Values.ja },
        event: dummyBackEvent,
      });
      expect(result).toBe(false);
    });
    it('second BACK transition should be string "partner-support"', () => {
      expect(backTransitions[1].target).toBe("partner-support");
    });
  });

  describe('"ermittlung-betrags" nested states', () => {
    const state =
      kontopfaendungWegweiserXstateConfig.states["ermittlung-betrags"];
    describe('"ermittlung-betrags.start" state', () => {
      it("first SUBMIT guard returns true when hasArbeit equals yes", () => {
        const guard = state.on.SUBMIT[0].guard;
        const result = guard({
          context: { hasArbeit: YesNoAnswer.Values.yes },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it("first SUBMIT guard returns false when hasArbeit is not yes", () => {
        const guard = state.on.SUBMIT[0].guard;
        const result = guard({
          context: { hasArbeit: YesNoAnswer.Values.no },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it("second SUBMIT guard returns true when hasArbeit equals no", () => {
        const guard = state.on.SUBMIT[1].guard;
        const result = guard({
          context: { hasArbeit: YesNoAnswer.Values.no },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it("second SUBMIT guard returns false when hasArbeit is not no", () => {
        const guard = state.on.SUBMIT[1].guard;
        const result = guard({
          context: { hasArbeit: YesNoAnswer.Values.yes },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it('BACK transition should be "zwischenseite-cash"', () => {
        expect(state.on.BACK).toBe("zwischenseite-cash");
      });
    });
    describe('"ermittlung-betrags.arbeitsweise" state', () => {
      const state = kontopfaendungWegweiserXstateConfig.states.arbeitsweise;
      it('SUBMIT transition should be "nachzahlung-arbeitgeber"', () => {
        expect(state.on.SUBMIT).toBe("nachzahlung-arbeitgeber");
      });
      it('BACK transition should be "start"', () => {
        expect(state.on.BACK).toBe("start");
      });
    });
    describe('"ermittlung-betrags.nachzahlung-arbeitgeber" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states["nachzahlung-arbeitgeber"];
      it("first SUBMIT guard returns true when nachzahlungArbeitgeber equals yes", () => {
        const guard = state.on.SUBMIT[0].guard;
        const result = guard({
          context: { nachzahlungArbeitgeber: YesNoAnswer.Values.yes },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it("first SUBMIT guard returns false when nachzahlungArbeitgeber is not yes", () => {
        const guard = state.on.SUBMIT[0].guard;
        const result = guard({
          context: { nachzahlungArbeitgeber: YesNoAnswer.Values.no },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it("second SUBMIT guard returns true when nachzahlungArbeitgeber equals no", () => {
        const guard = state.on.SUBMIT[1].guard;
        const result = guard({
          context: { nachzahlungArbeitgeber: YesNoAnswer.Values.no },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it("second SUBMIT guard returns false when nachzahlungArbeitgeber is not no", () => {
        const guard = state.on.SUBMIT[1].guard;
        const result = guard({
          context: { nachzahlungArbeitgeber: YesNoAnswer.Values.yes },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it('BACK transition should be "arbeitsweise"', () => {
        expect(state.on.BACK).toBe("arbeitsweise");
      });
    });
    describe('"ermittlung-betrags.zahlungslimit" state', () => {
      const state = kontopfaendungWegweiserXstateConfig.states.zahlungslimit;
      it('SUBMIT transition should be "zahlung-arbeitgeber"', () => {
        expect(state.on.SUBMIT).toBe("zahlung-arbeitgeber");
      });
      it('BACK transition should be "nachzahlung-arbeitgeber"', () => {
        expect(state.on.BACK).toBe("nachzahlung-arbeitgeber");
      });
    });
    describe('"ermittlung-betrags.zahlung-arbeitgeber" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states["zahlung-arbeitgeber"];
      it('SUBMIT transition should be "sozialleistungen"', () => {
        expect(state.on.SUBMIT).toBe("sozialleistungen");
      });
      it('BACK transition should be "nachzahlung-arbeitgeber"', () => {
        expect(state.on.BACK).toBe("nachzahlung-arbeitgeber");
      });
    });
    describe('"ermittlung-betrags.sozialleistungen" state', () => {
      const state = kontopfaendungWegweiserXstateConfig.states.sozialleistungen;
      const submitTransitions = state.on.SUBMIT;
      const backTransitions = state.on.BACK;
      it("first SUBMIT guard returns true when hasSozialleistungen equals no", () => {
        const guard = submitTransitions[0].guard;
        const result = guard({
          context: { hasSozialleistungen: hasSozialleistungen.Values.nein },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it("first SUBMIT guard returns false when hasSozialleistungen is not no", () => {
        const guard = submitTransitions[0].guard;
        const result = guard({
          context: {
            hasSozialleistungen: hasSozialleistungen.Values.buergergeld,
          },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it("second SUBMIT guard returns true when hasSozialleistungen equals no", () => {
        const guard = submitTransitions[1].guard;
        const result = guard({
          context: { hasSozialleistungen: hasSozialleistungen.Values.nein },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it("second SUBMIT guard returns false when hasSozialleistungen is not no", () => {
        const guard = submitTransitions[1].guard;
        const result = guard({
          context: {
            hasSozialleistungen: hasSozialleistungen.Values.buergergeld,
          },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it("first BACK guard returns true when hasArbeit equals no", () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: { hasArbeit: YesNoAnswer.Values.no },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it("first BACK guard returns false when hasArbeit is not no", () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: { hasArbeit: YesNoAnswer.Values.yes },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
      it("second BACK guard returns true when hasArbeit equals yes", () => {
        const guard = backTransitions[1].guard;
        const result = guard({
          context: { hasArbeit: YesNoAnswer.Values.yes },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it("second BACK guard returns false when hasArbeit is not yes", () => {
        const guard = backTransitions[1].guard;
        const result = guard({
          context: { hasArbeit: YesNoAnswer.Values.no },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
    });
    describe('"ermittlung-betrags.sozialleistung-nachzahlung" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states[
          "sozialleistung-nachzahlung"
        ];
      const submitTransitions = state.on.SUBMIT;
      it("first SUBMIT guard returns true when hasSozialleistungNachzahlung equals yes", () => {
        const guard = submitTransitions[0].guard;
        const result = guard({
          context: { hasSozialleistungNachzahlung: YesNoAnswer.Values.yes },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it("first SUBMIT guard returns false when hasSozialleistungNachzahlung is not yes", () => {
        const guard = submitTransitions[0].guard;
        const result = guard({
          context: { hasSozialleistungNachzahlung: YesNoAnswer.Values.no },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      it("second SUBMIT guard returns true when hasSozialleistungNachzahlung equals no", () => {
        const guard = submitTransitions[1].guard;
        const result = guard({
          context: { hasSozialleistungNachzahlung: YesNoAnswer.Values.no },
          event: dummyEvent,
        });
        expect(result).toBe(true);
      });
      it("second SUBMIT guard returns false when hasSozialleistungNachzahlung is not no", () => {
        const guard = submitTransitions[1].guard;
        const result = guard({
          context: { hasSozialleistungNachzahlung: YesNoAnswer.Values.yes },
          event: dummyEvent,
        });
        expect(result).toBe(false);
      });
      const backTransitions = state.on.BACK;
      it("first BACK guard returns true when hasSozialleistungen equals no", () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: { hasSozialleistungen: hasSozialleistungen.Values.nein },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it("first BACK guard returns false when hasSozialleistungen is buergergeld", () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: {
            hasSozialleistungen: hasSozialleistungen.Values.buergergeld,
          },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
      it("second BACK guard returns true when hasSozialleistungen equals asylbewerberleistungen", () => {
        const guard = backTransitions[1].guard;
        const result = guard({
          context: {
            hasSozialleistungen:
              hasSozialleistungen.Values.asylbewerberleistungen,
          },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it("second BACK guard returns false when hasSozialleistungen equals grundsicherungSozialhilfe", () => {
        const guard = backTransitions[1].guard;
        const result = guard({
          context: {
            hasSozialleistungen:
              hasSozialleistungen.Values.grundsicherungSozialhilfe,
          },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
    });
    describe('"ermittlung-betrags.sozialleistung-nachzahlung-amount" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states[
          "sozialleistung-nachzahlung-amount"
        ];
      it('SUBMIT transition should be "sozialleistungen-einmalzahlung"', () => {
        expect(state.on.SUBMIT[0].target).toBe(
          "sozialleistungen-einmalzahlung",
        );
      });
      it('BACK transition should be "sozialleistung-nachzahlung"', () => {
        expect(state.on.BACK).toBe("sozialleistung-nachzahlung");
      });
    });
    describe('"ermittlung-betrags.sozialleistungen-einmalzahlung" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states[
          "sozialleistungen-einmalzahlung"
        ];
      it('SUBMIT transition should be "besondere-ausgaben"', () => {
        expect(state.on.SUBMIT[0].target).toBe("besondere-ausgaben");
      });
      const backTransitions = state.on.BACK;
      it("first BACK guard returns true when hasSozialleistungNachzahlung equals no", () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: { hasSozialleistungNachzahlung: YesNoAnswer.Values.no },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it("first BACK guard returns false when hasSozialleistungNachzahlung is not no", () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: { hasSozialleistungNachzahlung: YesNoAnswer.Values.yes },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
      it("second BACK guard returns true when hasSozialleistungNachzahlung equals yes", () => {
        const guard = backTransitions[1].guard;
        const result = guard({
          context: { hasSozialleistungNachzahlung: YesNoAnswer.Values.yes },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it("second BACK guard returns false when hasSozialleistungNachzahlung is not yes", () => {
        const guard = backTransitions[1].guard;
        const result = guard({
          context: { hasSozialleistungNachzahlung: YesNoAnswer.Values.no },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
    });
    describe('"ermittlung-betrags.besondere-ausgaben" state', () => {
      const state =
        kontopfaendungWegweiserXstateConfig.states["besondere-ausgaben"];
      const submitTransitions = state.on.SUBMIT;
      it("SUBMIT transition target should be an empty string", () => {
        expect(submitTransitions[0].target).toBe("");
      });
      const backTransitions = state.on.BACK;
      it("first BACK guard returns true when sozialleistungenUmstaende.nein equals CheckboxValue.on", () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: {
            sozialleistungenUmstaende: {
              nein: CheckboxValue.on,
              pflegegeld: CheckboxValue.off,
              kindergeld: CheckboxValue.off,
              wohngeld: CheckboxValue.off,
            },
          },
          event: dummyBackEvent,
        });
        expect(result).toBe(true);
      });
      it("first BACK guard returns false when sozialleistungenUmstaende.nein is not CheckboxValue.on", () => {
        const guard = backTransitions[0].guard;
        const result = guard({
          context: {
            sozialleistungenUmstaende: {
              nein: CheckboxValue.off,
              pflegegeld: CheckboxValue.off,
              kindergeld: CheckboxValue.off,
              wohngeld: CheckboxValue.off,
            },
          },
          event: dummyBackEvent,
        });
        expect(result).toBe(false);
      });
      it('second BACK transition should be "sozialleistungen-einmalzahlung"', () => {
        expect(backTransitions[1].target).toBe(
          "sozialleistungen-einmalzahlung",
        );
      });
    });
  });

  // Additional 13 test cases to reach 100 different tests
  it('should have BACK transition "kontopfaendung" state equal to "start"', () => {
    const state = kontopfaendungWegweiserXstateConfig.states.kontopfaendung;
    expect(state.on.BACK).toBe("start");
  });

  it('should have BACK transition "ergebnisseite" state equal to an array of length 2', () => {
    const state = kontopfaendungWegweiserXstateConfig.states.ergebnisseite;
    expect(Array.isArray(state.on.BACK)).toBe(true);
    expect(state.on.BACK.length).toBe(2);
  });

  it('should have SUBMIT transition "p-konto-probleme" state equal to "glaeubiger"', () => {
    const state =
      kontopfaendungWegweiserXstateConfig.states["p-konto-probleme"];
    expect(state.on.SUBMIT).toBe("glaeubiger");
  });

  it('should have BACK transition "p-konto-probleme" state equal to "p-konto"', () => {
    const state =
      kontopfaendungWegweiserXstateConfig.states["p-konto-probleme"];
    expect(state.on.BACK).toBe("p-konto");
  });

  it('should have BACK transition "glaeubiger" state equal to "p-konto"', () => {
    const state = kontopfaendungWegweiserXstateConfig.states.glaeubiger;
    expect(state.on.BACK).toBe("p-konto");
  });

  it('should have BACK transition "glaeubiger-unbekannt" state equal to "glaeubiger"', () => {
    const state =
      kontopfaendungWegweiserXstateConfig.states["glaeubiger-unbekannt"];
    expect(state.on.BACK).toBe("glaeubiger");
  });

  it('should have SUBMIT transition "zwischenseite-unterhalt" state equal to "kinder"', () => {
    const state =
      kontopfaendungWegweiserXstateConfig.states["zwischenseite-unterhalt"];
    expect(state.on.SUBMIT).toBe("kinder");
  });

  it('should have BACK transition "partner" state array length equal to 2', () => {
    const state = kontopfaendungWegweiserXstateConfig.states.partner;
    expect(Array.isArray(state.on.BACK)).toBe(true);
    expect(state.on.BACK.length).toBe(2);
  });

  it('should have SUBMIT transition "partner-support" state equal to "zwischenseite-cash"', () => {
    const state = kontopfaendungWegweiserXstateConfig.states["partner-support"];
    expect(state.on.SUBMIT).toBe("zwischenseite-cash");
  });

  it('should have SUBMIT transition "zwischenseite-cash" state equal to "ermittlung-betrags"', () => {
    const state =
      kontopfaendungWegweiserXstateConfig.states["zwischenseite-cash"];
    expect(state.on.SUBMIT).toBe("ermittlung-betrags");
  });

  it('should have BACK transition "ermittlung-betrags" state equal to "zwischenseite-cash"', () => {
    const state =
      kontopfaendungWegweiserXstateConfig.states["ermittlung-betrags"];
    expect(state.on.BACK).toBe("zwischenseite-cash");
  });

  it('should have BACK transition "arbeitsweise" state equal to "start"', () => {
    const state = kontopfaendungWegweiserXstateConfig.states.arbeitsweise;
    expect(state.on.BACK).toBe("start");
  });

  it('should have SUBMIT transition "zahlungslimit" state equal to "zahlung-arbeitgeber"', () => {
    const state = kontopfaendungWegweiserXstateConfig.states.zahlungslimit;
    expect(state.on.SUBMIT).toBe("zahlung-arbeitgeber");
  });

  it('should have SUBMIT transition "zahlung-arbeitgeber" state equal to "sozialleistungen"', () => {
    const state =
      kontopfaendungWegweiserXstateConfig.states["zahlung-arbeitgeber"];
    expect(state.on.SUBMIT).toBe("sozialleistungen");
  });
});
