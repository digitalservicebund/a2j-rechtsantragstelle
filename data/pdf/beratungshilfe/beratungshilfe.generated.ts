import type { BooleanField, StringField } from "~/services/pdf/fileTypes";

export function getBeratungshilfeParameters(): BeratungshilfePDF {
  return {
  "bew": {
    "name": "Bew"
  },
  "e_2": {
    "name": "E_2"
  },
  "wohnkosten": {
    "name": "Wohnkosten"
  },
  "sonst": {
    "name": "Sonst"
  },
  "ortDatum_2": {
    "name": "Ort Datum_2",
    "maxCharWidth": 33,
    "maxLines": 1
  },
  "unterschrftdesRechtspfegersderRechtspfegern": {
    "name": "Unterschr ft des Rechtspf egersder Rechtspf eger n",
    "maxCharWidth": 82,
    "maxLines": 1
  },
  "berufErwerbstaetigkeit": {
    "name": "Beruf, Erwerbstätigkeit",
    "maxCharWidth": 33,
    "maxLines": 1
  },
  "antragstellerNameVornameggfGeburtsname": {
    "name": "Antragsteller (Name, Vorname ggf Geburtsname)",
    "maxCharWidth": 52,
    "maxLines": 1
  },
  "ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern": {
    "name": "Ich beantrage Beratungshilfe in folgender Angelegenheit (bitte Sachverhalt kurz erläutern)",
    "maxCharWidth": 109,
    "maxLines": 4
  },
  "tagsueberTelefonischerreichbarunterNummer": {
    "name": "Tagsüber Telefonisch erreichbar unter Nummer",
    "maxCharWidth": 20,
    "maxLines": 1
  },
  "geschaeftsnummerdesAmtsgerichts": {
    "name": "Geschäftsnummer des Amtsgerichts",
    "maxCharWidth": 25,
    "maxLines": 1
  },
  "namedesAmtsgerichts": {
    "name": "Name des Amtsgerichts",
    "maxCharWidth": 28,
    "maxLines": 1
  },
  "geburtsdatumdesAntragstellers": {
    "name": "Geburtsdatum des Antragstellers",
    "maxCharWidth": 14,
    "maxLines": 1
  },
  "familienstanddesAntragstellers": {
    "name": "Familienstand des Antragstellers",
    "maxCharWidth": 14,
    "maxLines": 1
  },
  "anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers": {
    "name": "Anschrift Straße,Hausnummer,Postleitzahl,Wohnort des Antragstellers",
    "maxCharWidth": 86,
    "maxLines": 1
  },
  "bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein": {
    "name": "B-In der vorliegenden Angelegenheit tritt keine Rechtsschutzversicherung ein"
  },
  "b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen": {
    "name": "B2- In dieser Angelegenheit besteht für mich nach meiner Kenntnis keine andere Möglichkeit, kostenlose Beratung und Vertretung in Anspruch zu nehmen"
  },
  "b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden": {
    "name": "B3-In dieser Angelegenheit ist mir bisher Beratungshilfe weder bewilligt noch versagt worden"
  },
  "b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt": {
    "name": "B4- In dieser Angelegenheit wird oder wurde von mir bisher kein gerichtliches Verfahren geführt"
  },
  "c1Einkuenftebrutto": {
    "name": "C1-Einkünfte, brutto",
    "maxCharWidth": 13,
    "maxLines": 1
  },
  "c2Einkuenftenetto": {
    "name": "C2-Einkünfte, netto",
    "maxCharWidth": 14,
    "maxLines": 1
  },
  "c3EinkuenftePartner": {
    "name": "C3-Einkünfte Partner"
  },
  "c4EinkuenftePartnernetto": {
    "name": "C4-Einkünfte, Partner, netto",
    "maxCharWidth": 14,
    "maxLines": 1
  },
  "d1Wohnung": {
    "name": "D1-Wohnung",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "d2Wohnkosten": {
    "name": "D2-Wohnkosten",
    "maxCharWidth": 13,
    "maxLines": 1
  },
  "d3Teilwohnkosten": {
    "name": "D3-Teilwohnkosten",
    "maxCharWidth": 3,
    "maxLines": 1
  },
  "d4Wohnungalleine": {
    "name": "D4-Wohnung, alleine"
  },
  "d5Wohnunggemeinsam": {
    "name": "D5-Wohnung, gemeinsam"
  },
  "d6WonungweiterePersonen": {
    "name": "D6-Wonung, weitere Personen",
    "maxCharWidth": 9,
    "maxLines": 1
  },
  "e1Person1": {
    "name": "E1-Person1",
    "maxCharWidth": 32,
    "maxLines": 1
  },
  "e1Person2": {
    "name": "E1-Person2",
    "maxCharWidth": 32,
    "maxLines": 1
  },
  "e1Person3": {
    "name": "E1-Person3",
    "maxCharWidth": 32,
    "maxLines": 1
  },
  "e1Person4": {
    "name": "E1-Person4",
    "maxCharWidth": 32,
    "maxLines": 1
  },
  "e2Geburtsdatum": {
    "name": "E2-Geburtsdatum",
    "maxCharWidth": 10,
    "maxLines": 1
  },
  "e2Geburtsdatum2": {
    "name": "E2-Geburtsdatum2",
    "maxCharWidth": 10,
    "maxLines": 1
  },
  "e2Geburtsdatum3": {
    "name": "E2-Geburtsdatum3",
    "maxCharWidth": 10,
    "maxLines": 1
  },
  "e2Geburtsdatum4": {
    "name": "E2-Geburtsdatum4",
    "maxCharWidth": 10,
    "maxLines": 1
  },
  "e3Familienverhaeltnis": {
    "name": "E3-Familienverhältnis",
    "maxCharWidth": 15,
    "maxLines": 1
  },
  "e3Familienverhaeltnis2": {
    "name": "E3-Familienverhältnis2",
    "maxCharWidth": 15,
    "maxLines": 1
  },
  "e3Familienverhaeltnis3": {
    "name": "E3-Familienverhältnis3",
    "maxCharWidth": 15,
    "maxLines": 1
  },
  "e3Familienverhaeltnis4": {
    "name": "E3-Familienverhältnis4",
    "maxCharWidth": 15,
    "maxLines": 1
  },
  "e4Zahlung1": {
    "name": "E4-Zahlung1",
    "maxCharWidth": 19,
    "maxLines": 1
  },
  "e4Zahlung2": {
    "name": "E4-Zahlung2",
    "maxCharWidth": 19,
    "maxLines": 1
  },
  "e4Zahlung3": {
    "name": "E4-Zahlung3",
    "maxCharWidth": 19,
    "maxLines": 1
  },
  "e4Zahlung4": {
    "name": "E4-Zahlung4",
    "maxCharWidth": 19,
    "maxLines": 1
  },
  "e6Betrag1": {
    "name": "E6-Betrag1",
    "maxCharWidth": 14,
    "maxLines": 1
  },
  "e6Betrag2": {
    "name": "E6-Betrag2",
    "maxCharWidth": 14,
    "maxLines": 1
  },
  "e6Betrag3": {
    "name": "E6-Betrag3",
    "maxCharWidth": 14,
    "maxLines": 1
  },
  "e6Betrag4": {
    "name": "E6-Betrag4",
    "maxCharWidth": 14,
    "maxLines": 1
  },
  "f1Konten1": {
    "name": "F1-Konten1"
  },
  "f1Konten2": {
    "name": "F1-Konten2"
  },
  "f2InhaberB": {
    "name": "F2-InhaberB"
  },
  "f1InhaberA": {
    "name": "F1-InhaberA"
  },
  "f2InhaberC": {
    "name": "F2-InhaberC"
  },
  "f3Bank1": {
    "name": "F3-Bank1",
    "maxCharWidth": 52,
    "maxLines": 4
  },
  "f4Kontostand": {
    "name": "F4-Kontostand",
    "maxCharWidth": 21,
    "maxLines": 5
  },
  "f5Grundeigentum1": {
    "name": "F5-Grundeigentum1"
  },
  "f5Grundeigentum2": {
    "name": "F5-Grundeigentum2"
  },
  "f6EigentuemerB": {
    "name": "F6-EigentümerB"
  },
  "f6EigentuemerA": {
    "name": "F6-EigentümerA"
  },
  "f6EigentuemerC": {
    "name": "F6-EigentümerC"
  },
  "f7Nutzungsart": {
    "name": "F7-Nutzungsart",
    "maxCharWidth": 52,
    "maxLines": 3
  },
  "f8Verkehrswert": {
    "name": "F8-Verkehrswert",
    "maxCharWidth": 21,
    "maxLines": 3
  },
  "f9Kraftfahrzeug1": {
    "name": "F9-Kraftfahrzeug1"
  },
  "f9Kraftfahrzeuge2": {
    "name": "F9-Kraftfahrzeuge2"
  },
  "f10KraftfahrzeugeA": {
    "name": "F10-KraftfahrzeugeA"
  },
  "f10KraftfahrzeugB": {
    "name": "F10-KraftfahrzeugB"
  },
  "f10KraftfahrzeugC": {
    "name": "F10-KraftfahrzeugC"
  },
  "f11Fahrzeugart": {
    "name": "F11-Fahrzeugart",
    "maxCharWidth": 52,
    "maxLines": 2
  },
  "f12Verkehrswert": {
    "name": "F12-Verkehrswert",
    "maxCharWidth": 21,
    "maxLines": 2
  },
  "f13Vermoegenswerte1": {
    "name": "F13-Vermögenswerte1"
  },
  "f13Vermoegenswerte2": {
    "name": "F13-Vermögenswerte2"
  },
  "f14InhaberA": {
    "name": "F14-InhaberA"
  },
  "f14InhaberB": {
    "name": "F14-InhaberB"
  },
  "f14VermoegenswerteC": {
    "name": "F14-VermögenswerteC"
  },
  "f16RueckkaufswertoderVerkehrswertinEUR": {
    "name": "F16-Rückkaufswert oder Verkehrswert in EUR",
    "maxCharWidth": 21,
    "maxLines": 4
  },
  "f15Bezeichnung": {
    "name": "F15-Bezeichnung",
    "maxCharWidth": 52,
    "maxLines": 4
  },
  "g1VerpflichtungenN": {
    "name": "G1-VerpflichtungenN"
  },
  "g1VerpflichtungenJ": {
    "name": "G1-VerpflichtungenJ"
  },
  "g21": {
    "name": "G2-1",
    "maxCharWidth": 17,
    "maxLines": 3
  },
  "g22": {
    "name": "G2-2",
    "maxCharWidth": 17,
    "maxLines": 3
  },
  "g23": {
    "name": "G2-3",
    "maxCharWidth": 17,
    "maxLines": 3
  },
  "g24": {
    "name": "G2-4",
    "maxCharWidth": 17,
    "maxLines": 3
  },
  "g31": {
    "name": "G3-1",
    "maxCharWidth": 16,
    "maxLines": 3
  },
  "g32": {
    "name": "G3-2",
    "maxCharWidth": 16,
    "maxLines": 3
  },
  "g33": {
    "name": "G3-3",
    "maxCharWidth": 16,
    "maxLines": 3
  },
  "g34": {
    "name": "G3-4",
    "maxCharWidth": 16,
    "maxLines": 3
  },
  "g4Verwendungszweck2": {
    "name": "G4-Verwendungszweck2",
    "maxCharWidth": 22,
    "maxLines": 3
  },
  "g4Verwendungszweck1": {
    "name": "G4-Verwendungszweck1",
    "maxCharWidth": 22,
    "maxLines": 3
  },
  "g4Verwendungszweck3": {
    "name": "G4-Verwendungszweck3",
    "maxCharWidth": 22,
    "maxLines": 3
  },
  "g4Verwendungszweck4": {
    "name": "G4-Verwendungszweck4",
    "maxCharWidth": 22,
    "maxLines": 3
  },
  "g5Raten1": {
    "name": "G5-Raten1",
    "maxCharWidth": 14,
    "maxLines": 3
  },
  "g5Raten3": {
    "name": "G5-Raten3",
    "maxCharWidth": 14,
    "maxLines": 3
  },
  "g5Raten2": {
    "name": "G5-Raten2",
    "maxCharWidth": 14,
    "maxLines": 3
  },
  "g5Raten4": {
    "name": "G5-Raten4",
    "maxCharWidth": 14,
    "maxLines": 3
  },
  "g6Restschuld2": {
    "name": "G6-Restschuld2",
    "maxCharWidth": 13,
    "maxLines": 3
  },
  "g6Restschuld3": {
    "name": "G6-Restschuld3",
    "maxCharWidth": 13,
    "maxLines": 3
  },
  "g6Restschuld1": {
    "name": "G6-Restschuld1",
    "maxCharWidth": 13,
    "maxLines": 3
  },
  "g6Restschuld4": {
    "name": "G6-Restschuld4",
    "maxCharWidth": 13,
    "maxLines": 3
  },
  "g7Zahlung2": {
    "name": "G7-Zahlung2",
    "maxCharWidth": 11,
    "maxLines": 3
  },
  "g7Zahlung1": {
    "name": "G7-Zahlung1",
    "maxCharWidth": 11,
    "maxLines": 3
  },
  "g7Zahlung3": {
    "name": "G7-Zahlung3",
    "maxCharWidth": 11,
    "maxLines": 3
  },
  "g7Zahlung4": {
    "name": "G7-Zahlung4",
    "maxCharWidth": 11,
    "maxLines": 3
  },
  "g8ZahlungP2": {
    "name": "G8-ZahlungP2",
    "maxCharWidth": 13,
    "maxLines": 3
  },
  "g8ZahlungP3": {
    "name": "G8-ZahlungP3",
    "maxCharWidth": 13,
    "maxLines": 3
  },
  "g8ZahlungP1": {
    "name": "G8-ZahlungP1",
    "maxCharWidth": 13,
    "maxLines": 3
  },
  "g8ZahlungP4": {
    "name": "G8-ZahlungP4",
    "maxCharWidth": 13,
    "maxLines": 3
  },
  "g9SonstigeBelastungenN": {
    "name": "G9-Sonstige BelastungenN"
  },
  "g9SonstigeBelastungenJ": {
    "name": "G9-Sonstige BelastungenJ"
  },
  "g10Belastungen": {
    "name": "G10-Belastungen",
    "maxCharWidth": 78,
    "maxLines": 7
  },
  "g11Zahlung": {
    "name": "G11-Zahlung",
    "maxCharWidth": 13,
    "maxLines": 7
  },
  "g12ZahlungP": {
    "name": "G12-ZahlungP",
    "maxCharWidth": 18,
    "maxLines": 5
  },
  "datumBeratung": {
    "name": "Datum, Beratung",
    "maxCharWidth": 28,
    "maxLines": 0
  },
  "beratungsperson": {
    "name": "Beratungsperson",
    "maxCharWidth": 113,
    "maxLines": 1
  },
  "ortDatum2": {
    "name": "Ort Datum 2",
    "maxCharWidth": 32,
    "maxLines": 2
  },
  "unterschriftdesAntragstellersderAntragstellerin": {
    "name": "Unterschrift des Antragstellers der Antragstellerin",
    "maxCharWidth": 82,
    "maxLines": 2
  },
  "e5Einnahmen2": {
    "name": "E5-Einnahmen2"
  },
  "e5Einnahmen3": {
    "name": "E5-Einnahmen3"
  },
  "e5Einnahmen1": {
    "name": "E5-Einnahmen1"
  },
  "e5Einnahmen4": {
    "name": "E5-Einnahmen4"
  },
  "postleitzahlOrt": {
    "name": "Postleitzahl Ort",
    "maxCharWidth": 39,
    "maxLines": 1
  }
};
}

export type BeratungshilfePDF = {
  "bew": BooleanField;
  "e_2": BooleanField;
  "wohnkosten": BooleanField;
  "sonst": BooleanField;
  "ortDatum_2": StringField;
  "unterschrftdesRechtspfegersderRechtspfegern": StringField;
  "berufErwerbstaetigkeit": StringField;
  "antragstellerNameVornameggfGeburtsname": StringField;
  "ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern": StringField;
  "tagsueberTelefonischerreichbarunterNummer": StringField;
  "geschaeftsnummerdesAmtsgerichts": StringField;
  "namedesAmtsgerichts": StringField;
  "geburtsdatumdesAntragstellers": StringField;
  "familienstanddesAntragstellers": StringField;
  "anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers": StringField;
  "bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein": BooleanField;
  "b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen": BooleanField;
  "b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden": BooleanField;
  "b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt": BooleanField;
  "c1Einkuenftebrutto": StringField;
  "c2Einkuenftenetto": StringField;
  "c3EinkuenftePartner": BooleanField;
  "c4EinkuenftePartnernetto": StringField;
  "d1Wohnung": StringField;
  "d2Wohnkosten": StringField;
  "d3Teilwohnkosten": StringField;
  "d4Wohnungalleine": BooleanField;
  "d5Wohnunggemeinsam": BooleanField;
  "d6WonungweiterePersonen": StringField;
  "e1Person1": StringField;
  "e1Person2": StringField;
  "e1Person3": StringField;
  "e1Person4": StringField;
  "e2Geburtsdatum": StringField;
  "e2Geburtsdatum2": StringField;
  "e2Geburtsdatum3": StringField;
  "e2Geburtsdatum4": StringField;
  "e3Familienverhaeltnis": StringField;
  "e3Familienverhaeltnis2": StringField;
  "e3Familienverhaeltnis3": StringField;
  "e3Familienverhaeltnis4": StringField;
  "e4Zahlung1": StringField;
  "e4Zahlung2": StringField;
  "e4Zahlung3": StringField;
  "e4Zahlung4": StringField;
  "e6Betrag1": StringField;
  "e6Betrag2": StringField;
  "e6Betrag3": StringField;
  "e6Betrag4": StringField;
  "f1Konten1": BooleanField;
  "f1Konten2": BooleanField;
  "f2InhaberB": BooleanField;
  "f1InhaberA": BooleanField;
  "f2InhaberC": BooleanField;
  "f3Bank1": StringField;
  "f4Kontostand": StringField;
  "f5Grundeigentum1": BooleanField;
  "f5Grundeigentum2": BooleanField;
  "f6EigentuemerB": BooleanField;
  "f6EigentuemerA": BooleanField;
  "f6EigentuemerC": BooleanField;
  "f7Nutzungsart": StringField;
  "f8Verkehrswert": StringField;
  "f9Kraftfahrzeug1": BooleanField;
  "f9Kraftfahrzeuge2": BooleanField;
  "f10KraftfahrzeugeA": BooleanField;
  "f10KraftfahrzeugB": BooleanField;
  "f10KraftfahrzeugC": BooleanField;
  "f11Fahrzeugart": StringField;
  "f12Verkehrswert": StringField;
  "f13Vermoegenswerte1": BooleanField;
  "f13Vermoegenswerte2": BooleanField;
  "f14InhaberA": BooleanField;
  "f14InhaberB": BooleanField;
  "f14VermoegenswerteC": BooleanField;
  "f16RueckkaufswertoderVerkehrswertinEUR": StringField;
  "f15Bezeichnung": StringField;
  "g1VerpflichtungenN": BooleanField;
  "g1VerpflichtungenJ": BooleanField;
  "g21": StringField;
  "g22": StringField;
  "g23": StringField;
  "g24": StringField;
  "g31": StringField;
  "g32": StringField;
  "g33": StringField;
  "g34": StringField;
  "g4Verwendungszweck2": StringField;
  "g4Verwendungszweck1": StringField;
  "g4Verwendungszweck3": StringField;
  "g4Verwendungszweck4": StringField;
  "g5Raten1": StringField;
  "g5Raten3": StringField;
  "g5Raten2": StringField;
  "g5Raten4": StringField;
  "g6Restschuld2": StringField;
  "g6Restschuld3": StringField;
  "g6Restschuld1": StringField;
  "g6Restschuld4": StringField;
  "g7Zahlung2": StringField;
  "g7Zahlung1": StringField;
  "g7Zahlung3": StringField;
  "g7Zahlung4": StringField;
  "g8ZahlungP2": StringField;
  "g8ZahlungP3": StringField;
  "g8ZahlungP1": StringField;
  "g8ZahlungP4": StringField;
  "g9SonstigeBelastungenN": BooleanField;
  "g9SonstigeBelastungenJ": BooleanField;
  "g10Belastungen": StringField;
  "g11Zahlung": StringField;
  "g12ZahlungP": StringField;
  "datumBeratung": StringField;
  "beratungsperson": StringField;
  "ortDatum2": StringField;
  "unterschriftdesAntragstellersderAntragstellerin": StringField;
  "e5Einnahmen2": BooleanField;
  "e5Einnahmen3": BooleanField;
  "e5Einnahmen1": BooleanField;
  "e5Einnahmen4": BooleanField;
  "postleitzahlOrt": StringField;
};
