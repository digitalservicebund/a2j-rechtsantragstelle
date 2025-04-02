import type { Flow } from "~/domains/flows.server";
import { type KontopfaendungWegweiserContext } from "./context";
import {
  getPKontoStrings,
  getPrivilegierteForderungStrings,
  getErhoehungsbetragStrings,
  getKindergeldStrings,
  getWohngeldStrings,
  getEinmalSozialleistungStrings,
  getNachzahlungSozialUnter500Strings,
  getNachzahlungSozialMehr500Strings,
  getNachzahlungArbeitUnter500Strings,
  getNachzahlungArbeitMehr500Strings,
  getBuergergeldStrings,
  getGrundsicherungStrings,
  getAsylbewerberleistungStrings,
  getPflegegeldSelbstStrings,
  getPflegegeldFremdStrings,
  getBehordenschuldenStrings,
  getArbeitsentgeltEinmaligStrings,
  getSelbststaendigStrings,
  getAngestelltStrings,
  getKinderStrings,
} from "./stringReplacements";
import { kontopfaendungWegweiserXstateConfig } from "./xStateConfig";

export const kontopfaendungWegweiser = {
  flowType: "vorabCheck",
  config: kontopfaendungWegweiserXstateConfig,
  guards: {},
  stringReplacements: (userData: KontopfaendungWegweiserContext) => ({
    ...getPKontoStrings(userData),
    ...getPrivilegierteForderungStrings(userData),
    ...getErhoehungsbetragStrings(userData),
    ...getKindergeldStrings(userData),
    ...getWohngeldStrings(userData),
    ...getEinmalSozialleistungStrings(userData),
    ...getNachzahlungSozialUnter500Strings(userData),
    ...getNachzahlungSozialMehr500Strings(userData),
    ...getNachzahlungArbeitUnter500Strings(userData),
    ...getNachzahlungArbeitMehr500Strings(userData),
    ...getBuergergeldStrings(userData),
    ...getGrundsicherungStrings(userData),
    ...getAsylbewerberleistungStrings(userData),
    ...getPflegegeldSelbstStrings(userData),
    ...getPflegegeldFremdStrings(userData),
    ...getBehordenschuldenStrings(userData),
    ...getArbeitsentgeltEinmaligStrings(userData),
    ...getSelbststaendigStrings(userData),
    ...getAngestelltStrings(userData),
    ...getKinderStrings(userData),
  }),
} satisfies Flow;
