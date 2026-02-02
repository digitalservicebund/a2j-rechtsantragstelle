import { type BeratungshilfePersoenlicheDatenUserData } from "~/domains/beratungshilfe/formular/persoenlicheDaten/userData";
import { type BeratungshilfeAbgabeUserData } from "./abgabe/userData";
import { type BeratungshilfeAnwaltlicheVertretungUserData } from "./anwaltlicheVertretung/userData";
import { type BeratungshilfeFinanzielleAngabenUserData } from "./finanzielleAngaben/userData";
import { type BeratungshilfeGrundvoraussetzungenUserData } from "./grundvoraussetzung/userData";
import { type BeratungshilfeRechtsproblemUserData } from "./rechtsproblem/userData";
import { type BeratungshilfeWeitereAngabenUserData } from "./weitereAngaben/userData";

export type BeratungshilfeFormularUserData =
  BeratungshilfeGrundvoraussetzungenUserData &
    BeratungshilfeRechtsproblemUserData &
    BeratungshilfeAnwaltlicheVertretungUserData &
    BeratungshilfeFinanzielleAngabenUserData &
    BeratungshilfePersoenlicheDatenUserData &
    BeratungshilfeWeitereAngabenUserData &
    BeratungshilfeAbgabeUserData & {
      pageData?: {
        arrayIndexes: number[];
      };
    };
