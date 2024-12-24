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
    "maxCharacters": 21,
    "maxLineBreaks": 1
  },
  "unterschrftdesRechtspfegersderRechtspfegern": {
    "name": "Unterschr ft des Rechtspf egersder Rechtspf eger n",
    "maxCharacters": 54,
    "maxLineBreaks": 1
  },
  "berufErwerbstaetigkeit": {
    "name": "Beruf, Erwerbstätigkeit",
    "maxCharacters": 22,
    "maxLineBreaks": 1
  },
  "antragstellerNameVornameggfGeburtsname": {
    "name": "Antragsteller (Name, Vorname ggf Geburtsname)",
    "maxCharacters": 34,
    "maxLineBreaks": 1
  },
  "ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern": {
    "name": "Ich beantrage Beratungshilfe in folgender Angelegenheit (bitte Sachverhalt kurz erläutern)",
    "maxCharacters": 72,
    "maxLineBreaks": 4
  },
  "tagsueberTelefonischerreichbarunterNummer": {
    "name": "Tagsüber Telefonisch erreichbar unter Nummer",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "geschaeftsnummerdesAmtsgerichts": {
    "name": "Geschäftsnummer des Amtsgerichts",
    "maxCharacters": 16,
    "maxLineBreaks": 1
  },
  "namedesAmtsgerichts": {
    "name": "Name des Amtsgerichts",
    "maxCharacters": 18,
    "maxLineBreaks": 1
  },
  "geburtsdatumdesAntragstellers": {
    "name": "Geburtsdatum des Antragstellers",
    "maxCharacters": 9,
    "maxLineBreaks": 1
  },
  "familienstanddesAntragstellers": {
    "name": "Familienstand des Antragstellers",
    "maxCharacters": 9,
    "maxLineBreaks": 1
  },
  "anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers": {
    "name": "Anschrift Straße,Hausnummer,Postleitzahl,Wohnort des Antragstellers",
    "maxCharacters": 57,
    "maxLineBreaks": 1
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
    "maxCharacters": 10,
    "maxLineBreaks": 0
  },
  "c2Einkuenftenetto": {
    "name": "C2-Einkünfte, netto",
    "maxCharacters": 11,
    "maxLineBreaks": 0
  },
  "c3EinkuenftePartner": {
    "name": "C3-Einkünfte Partner"
  },
  "c4EinkuenftePartnernetto": {
    "name": "C4-Einkünfte, Partner, netto",
    "maxCharacters": 9,
    "maxLineBreaks": 0
  },
  "d1Wohnung": {
    "name": "D1-Wohnung",
    "maxCharacters": 6,
    "maxLineBreaks": 0
  },
  "d2Wohnkosten": {
    "name": "D2-Wohnkosten",
    "maxCharacters": 10,
    "maxLineBreaks": 0
  },
  "d3Teilwohnkosten": {
    "name": "D3-Teilwohnkosten",
    "maxCharacters": 2,
    "maxLineBreaks": 0
  },
  "d4Wohnungalleine": {
    "name": "D4-Wohnung, alleine"
  },
  "d5Wohnunggemeinsam": {
    "name": "D5-Wohnung, gemeinsam"
  },
  "d6WonungweiterePersonen": {
    "name": "D6-Wonung, weitere Personen",
    "maxCharacters": 6,
    "maxLineBreaks": 1
  },
  "e1Person1": {
    "name": "E1-Person1",
    "maxCharacters": 21,
    "maxLineBreaks": 1
  },
  "e1Person2": {
    "name": "E1-Person2",
    "maxCharacters": 21,
    "maxLineBreaks": 1
  },
  "e1Person3": {
    "name": "E1-Person3",
    "maxCharacters": 21,
    "maxLineBreaks": 1
  },
  "e1Person4": {
    "name": "E1-Person4",
    "maxCharacters": 21,
    "maxLineBreaks": 1
  },
  "e2Geburtsdatum": {
    "name": "E2-Geburtsdatum",
    "maxCharacters": 6,
    "maxLineBreaks": 1
  },
  "e2Geburtsdatum2": {
    "name": "E2-Geburtsdatum2",
    "maxCharacters": 6,
    "maxLineBreaks": 1
  },
  "e2Geburtsdatum3": {
    "name": "E2-Geburtsdatum3",
    "maxCharacters": 6,
    "maxLineBreaks": 1
  },
  "e2Geburtsdatum4": {
    "name": "E2-Geburtsdatum4",
    "maxCharacters": 6,
    "maxLineBreaks": 1
  },
  "e3Familienverhaeltnis": {
    "name": "E3-Familienverhältnis",
    "maxCharacters": 10,
    "maxLineBreaks": 1
  },
  "e3Familienverhaeltnis2": {
    "name": "E3-Familienverhältnis2",
    "maxCharacters": 10,
    "maxLineBreaks": 1
  },
  "e3Familienverhaeltnis3": {
    "name": "E3-Familienverhältnis3",
    "maxCharacters": 10,
    "maxLineBreaks": 1
  },
  "e3Familienverhaeltnis4": {
    "name": "E3-Familienverhältnis4",
    "maxCharacters": 10,
    "maxLineBreaks": 1
  },
  "e4Zahlung1": {
    "name": "E4-Zahlung1",
    "maxCharacters": 12,
    "maxLineBreaks": 1
  },
  "e4Zahlung2": {
    "name": "E4-Zahlung2",
    "maxCharacters": 12,
    "maxLineBreaks": 1
  },
  "e4Zahlung3": {
    "name": "E4-Zahlung3",
    "maxCharacters": 12,
    "maxLineBreaks": 1
  },
  "e4Zahlung4": {
    "name": "E4-Zahlung4",
    "maxCharacters": 12,
    "maxLineBreaks": 1
  },
  "e6Betrag1": {
    "name": "E6-Betrag1",
    "maxCharacters": 9,
    "maxLineBreaks": 1
  },
  "e6Betrag2": {
    "name": "E6-Betrag2",
    "maxCharacters": 9,
    "maxLineBreaks": 1
  },
  "e6Betrag3": {
    "name": "E6-Betrag3",
    "maxCharacters": 9,
    "maxLineBreaks": 1
  },
  "e6Betrag4": {
    "name": "E6-Betrag4",
    "maxCharacters": 9,
    "maxLineBreaks": 1
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
    "maxCharacters": 34,
    "maxLineBreaks": 5
  },
  "f4Kontostand": {
    "name": "F4-Kontostand",
    "maxCharacters": 13,
    "maxLineBreaks": 5
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
    "maxCharacters": 34,
    "maxLineBreaks": 3
  },
  "f8Verkehrswert": {
    "name": "F8-Verkehrswert",
    "maxCharacters": 13,
    "maxLineBreaks": 3
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
    "maxCharacters": 34,
    "maxLineBreaks": 2
  },
  "f12Verkehrswert": {
    "name": "F12-Verkehrswert",
    "maxCharacters": 13,
    "maxLineBreaks": 2
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
    "maxCharacters": 13,
    "maxLineBreaks": 4
  },
  "f15Bezeichnung": {
    "name": "F15-Bezeichnung",
    "maxCharacters": 34,
    "maxLineBreaks": 5
  },
  "g1VerpflichtungenN": {
    "name": "G1-VerpflichtungenN"
  },
  "g1VerpflichtungenJ": {
    "name": "G1-VerpflichtungenJ"
  },
  "g21": {
    "name": "G2-1",
    "maxCharacters": 11,
    "maxLineBreaks": 3
  },
  "g22": {
    "name": "G2-2",
    "maxCharacters": 11,
    "maxLineBreaks": 3
  },
  "g23": {
    "name": "G2-3",
    "maxCharacters": 11,
    "maxLineBreaks": 3
  },
  "g24": {
    "name": "G2-4",
    "maxCharacters": 11,
    "maxLineBreaks": 3
  },
  "g31": {
    "name": "G3-1",
    "maxCharacters": 10,
    "maxLineBreaks": 3
  },
  "g32": {
    "name": "G3-2",
    "maxCharacters": 10,
    "maxLineBreaks": 3
  },
  "g33": {
    "name": "G3-3",
    "maxCharacters": 10,
    "maxLineBreaks": 3
  },
  "g34": {
    "name": "G3-4",
    "maxCharacters": 10,
    "maxLineBreaks": 3
  },
  "g4Verwendungszweck2": {
    "name": "G4-Verwendungszweck2",
    "maxCharacters": 14,
    "maxLineBreaks": 3
  },
  "g4Verwendungszweck1": {
    "name": "G4-Verwendungszweck1",
    "maxCharacters": 14,
    "maxLineBreaks": 3
  },
  "g4Verwendungszweck3": {
    "name": "G4-Verwendungszweck3",
    "maxCharacters": 14,
    "maxLineBreaks": 3
  },
  "g4Verwendungszweck4": {
    "name": "G4-Verwendungszweck4",
    "maxCharacters": 14,
    "maxLineBreaks": 3
  },
  "g5Raten1": {
    "name": "G5-Raten1",
    "maxCharacters": 9,
    "maxLineBreaks": 3
  },
  "g5Raten3": {
    "name": "G5-Raten3",
    "maxCharacters": 9,
    "maxLineBreaks": 3
  },
  "g5Raten2": {
    "name": "G5-Raten2",
    "maxCharacters": 9,
    "maxLineBreaks": 3
  },
  "g5Raten4": {
    "name": "G5-Raten4",
    "maxCharacters": 9,
    "maxLineBreaks": 3
  },
  "g6Restschuld2": {
    "name": "G6-Restschuld2",
    "maxCharacters": 8,
    "maxLineBreaks": 3
  },
  "g6Restschuld3": {
    "name": "G6-Restschuld3",
    "maxCharacters": 8,
    "maxLineBreaks": 3
  },
  "g6Restschuld1": {
    "name": "G6-Restschuld1",
    "maxCharacters": 8,
    "maxLineBreaks": 3
  },
  "g6Restschuld4": {
    "name": "G6-Restschuld4",
    "maxCharacters": 8,
    "maxLineBreaks": 3
  },
  "g7Zahlung2": {
    "name": "G7-Zahlung2",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "g7Zahlung1": {
    "name": "G7-Zahlung1",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "g7Zahlung3": {
    "name": "G7-Zahlung3",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "g7Zahlung4": {
    "name": "G7-Zahlung4",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "g8ZahlungP2": {
    "name": "G8-ZahlungP2",
    "maxCharacters": 8,
    "maxLineBreaks": 3
  },
  "g8ZahlungP3": {
    "name": "G8-ZahlungP3",
    "maxCharacters": 8,
    "maxLineBreaks": 3
  },
  "g8ZahlungP1": {
    "name": "G8-ZahlungP1",
    "maxCharacters": 8,
    "maxLineBreaks": 3
  },
  "g8ZahlungP4": {
    "name": "G8-ZahlungP4",
    "maxCharacters": 8,
    "maxLineBreaks": 3
  },
  "g9SonstigeBelastungenN": {
    "name": "G9-Sonstige BelastungenN"
  },
  "g9SonstigeBelastungenJ": {
    "name": "G9-Sonstige BelastungenJ"
  },
  "g10Belastungen": {
    "name": "G10-Belastungen",
    "maxCharacters": 52,
    "maxLineBreaks": 8
  },
  "g11Zahlung": {
    "name": "G11-Zahlung",
    "maxCharacters": 8,
    "maxLineBreaks": 8
  },
  "g12ZahlungP": {
    "name": "G12-ZahlungP",
    "maxCharacters": 11,
    "maxLineBreaks": 6
  },
  "datumBeratung": {
    "name": "Datum, Beratung",
    "maxCharacters": 18,
    "maxLineBreaks": 0
  },
  "beratungsperson": {
    "name": "Beratungsperson",
    "maxCharacters": 75,
    "maxLineBreaks": 1
  },
  "ortDatum2": {
    "name": "Ort Datum 2",
    "maxCharacters": 21,
    "maxLineBreaks": 1
  },
  "unterschriftdesAntragstellersderAntragstellerin": {
    "name": "Unterschrift des Antragstellers der Antragstellerin",
    "maxCharacters": 54,
    "maxLineBreaks": 1
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
    "maxCharacters": 26,
    "maxLineBreaks": 1
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
