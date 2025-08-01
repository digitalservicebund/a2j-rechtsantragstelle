import type { BooleanField, StringField } from "~/services/pdf/fileTypes";

export function getProzesskostenhilfeParameters(): ProzesskostenhilfePDF {
  return {
  "b1": {
    "name": "B1"
  },
  "b2": {
    "name": "B2"
  },
  "b3": {
    "name": "B3"
  },
  "b4": {
    "name": "B4"
  },
  "c1": {
    "name": "C1"
  },
  "c2": {
    "name": "C2"
  },
  "d1": {
    "name": "D1"
  },
  "d2": {
    "name": "D2"
  },
  "d3": {
    "name": "D3"
  },
  "d4": {
    "name": "D4"
  },
  "d5": {
    "name": "D5"
  },
  "d6": {
    "name": "D6"
  },
  "d7": {
    "name": "D7"
  },
  "d8": {
    "name": "D8"
  },
  "d9": {
    "name": "D9"
  },
  "d10": {
    "name": "D10"
  },
  "bezeichnungOrtundGeschaeftsnummerdesGerichts": {
    "name": "Bezeichnung, Ort und Geschäftsnummer des Gerichts",
    "maxCharacters": 47,
    "maxLineBreaks": 2
  },
  "nameVornameggfGeburtsname": {
    "name": "Name, Vorname, ggf. Geburtsname",
    "maxCharacters": 54,
    "maxLineBreaks": 2
  },
  "berufErwerbstaetigkeit": {
    "name": "Beruf, Erwerbstätigkeit",
    "maxCharacters": 30,
    "maxLineBreaks": 2
  },
  "geburtsdatum": {
    "name": "Geburtsdatum",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "familienstand": {
    "name": "Familienstand",
    "maxCharacters": 13,
    "maxLineBreaks": 2
  },
  "anschriftStrasseHausnummerPostleitzahlWohnort": {
    "name": "Anschrift (Straße, Hausnummer, Postleitzahl, Wohnort)",
    "maxCharacters": 87,
    "maxLineBreaks": 2
  },
  "tagsuebererreichbarunterNummer": {
    "name": "Tagsüber erreichbar unter Nummer",
    "maxCharacters": 36,
    "maxLineBreaks": 2
  },
  "sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon": {
    "name": "Sofern vorhanden: Gesetzlicher Vertreter (Name, Vorname, Anschrift, Telefon",
    "maxCharacters": 125,
    "maxLineBreaks": 2
  },
  "hoehederKosten": {
    "name": "Höhe der Kosten",
    "maxCharacters": 99,
    "maxLineBreaks": 2
  },
  "belegnummerB1": {
    "name": "Belegnummer B1",
    "maxCharacters": 6,
    "maxLineBreaks": 2
  },
  "bezeichnungderVersicherung": {
    "name": "Bezeichnung der Versicherung",
    "maxCharacters": 99,
    "maxLineBreaks": 2
  },
  "belegnummerB2": {
    "name": "Belegnummer B2",
    "maxCharacters": 6,
    "maxLineBreaks": 2
  },
  "namedesUnterhaltspflichtigen": {
    "name": "Name des Unterhaltspflichtigen",
    "maxCharacters": 99,
    "maxLineBreaks": 2
  },
  "belegnummerC": {
    "name": "Belegnummer C",
    "maxCharacters": 6,
    "maxLineBreaks": 2
  },
  "angehoerigerNr1": {
    "name": "Angehöriger Nr. 1",
    "maxCharacters": 35,
    "maxLineBreaks": 3
  },
  "angehoerigerNr2": {
    "name": "Angehöriger Nr. 2",
    "maxCharacters": 35,
    "maxLineBreaks": 3
  },
  "angehoerigerNr3": {
    "name": "Angehöriger Nr. 3",
    "maxCharacters": 35,
    "maxLineBreaks": 3
  },
  "angehoerigerNr4": {
    "name": "Angehöriger Nr. 4",
    "maxCharacters": 35,
    "maxLineBreaks": 3
  },
  "angehoerigerNr5": {
    "name": "Angehöriger Nr. 5",
    "maxCharacters": 35,
    "maxLineBreaks": 3
  },
  "geburtsdatum1": {
    "name": "Geburtsdatum 1",
    "maxCharacters": 13,
    "maxLineBreaks": 3
  },
  "verhaeltnis1": {
    "name": "Verhältnis 1",
    "maxCharacters": 11,
    "maxLineBreaks": 3
  },
  "monatsbetrag1": {
    "name": "Monatsbetrag 1",
    "maxCharacters": 20,
    "maxLineBreaks": 3
  },
  "betrag1": {
    "name": "Betrag 1",
    "maxCharacters": 14,
    "maxLineBreaks": 2
  },
  "belegnummerD1": {
    "name": "Belegnummer D1",
    "maxCharacters": 6,
    "maxLineBreaks": 3
  },
  "geburtsdatum2": {
    "name": "Geburtsdatum 2",
    "maxCharacters": 13,
    "maxLineBreaks": 3
  },
  "verhaeltnis2": {
    "name": "Verhältnis 2",
    "maxCharacters": 11,
    "maxLineBreaks": 3
  },
  "monatsbetrag2": {
    "name": "Monatsbetrag 2",
    "maxCharacters": 20,
    "maxLineBreaks": 3
  },
  "betrag2": {
    "name": "Betrag 2",
    "maxCharacters": 14,
    "maxLineBreaks": 2
  },
  "belegnummerD2": {
    "name": "Belegnummer D2",
    "maxCharacters": 6,
    "maxLineBreaks": 3
  },
  "geburtsdatum3": {
    "name": "Geburtsdatum 3",
    "maxCharacters": 13,
    "maxLineBreaks": 3
  },
  "verhaeltnis3": {
    "name": "Verhältnis 3",
    "maxCharacters": 11,
    "maxLineBreaks": 3
  },
  "monatsbetrag3": {
    "name": "Monatsbetrag 3",
    "maxCharacters": 20,
    "maxLineBreaks": 3
  },
  "betrag3": {
    "name": "Betrag 3",
    "maxCharacters": 14,
    "maxLineBreaks": 2
  },
  "belegnummerD3": {
    "name": "Belegnummer D3",
    "maxCharacters": 6,
    "maxLineBreaks": 3
  },
  "geburtsdatum4": {
    "name": "Geburtsdatum 4",
    "maxCharacters": 13,
    "maxLineBreaks": 3
  },
  "verhaeltnis4": {
    "name": "Verhältnis 4",
    "maxCharacters": 11,
    "maxLineBreaks": 3
  },
  "monatsbetrag4": {
    "name": "Monatsbetrag 4",
    "maxCharacters": 20,
    "maxLineBreaks": 3
  },
  "betrag4": {
    "name": "Betrag 4",
    "maxCharacters": 14,
    "maxLineBreaks": 2
  },
  "belegnummerD4": {
    "name": "Belegnummer D4",
    "maxCharacters": 6,
    "maxLineBreaks": 3
  },
  "geburtsdatum5": {
    "name": "Geburtsdatum 5",
    "maxCharacters": 13,
    "maxLineBreaks": 3
  },
  "verhaeltnis5": {
    "name": "Verhältnis 5",
    "maxCharacters": 11,
    "maxLineBreaks": 3
  },
  "monatsbetrag5": {
    "name": "Monatsbetrag 5",
    "maxCharacters": 20,
    "maxLineBreaks": 3
  },
  "betrag5": {
    "name": "Betrag 5",
    "maxCharacters": 14,
    "maxLineBreaks": 2
  },
  "belegnummerD5": {
    "name": "Belegnummer D5",
    "maxCharacters": 6,
    "maxLineBreaks": 3
  },
  "e1": {
    "name": "E1"
  },
  "e2": {
    "name": "E2"
  },
  "e13": {
    "name": "E13"
  },
  "e14": {
    "name": "E14"
  },
  "e3": {
    "name": "E3"
  },
  "e4": {
    "name": "E4"
  },
  "e15": {
    "name": "E15"
  },
  "e16": {
    "name": "E16"
  },
  "e5": {
    "name": "E5"
  },
  "e6": {
    "name": "E6"
  },
  "e17": {
    "name": "E17"
  },
  "e18": {
    "name": "E18"
  },
  "e7": {
    "name": "E7"
  },
  "e8": {
    "name": "E8"
  },
  "e19": {
    "name": "E19"
  },
  "e20": {
    "name": "E20"
  },
  "e9": {
    "name": "E9"
  },
  "e10": {
    "name": "E10"
  },
  "e21": {
    "name": "E21"
  },
  "e22": {
    "name": "E22"
  },
  "e11": {
    "name": "E11"
  },
  "e12": {
    "name": "E12"
  },
  "e23": {
    "name": "E23"
  },
  "e24": {
    "name": "E24"
  },
  "e25": {
    "name": "E25"
  },
  "e26": {
    "name": "E26"
  },
  "e27": {
    "name": "E27"
  },
  "e28": {
    "name": "E28"
  },
  "e39": {
    "name": "E39"
  },
  "e40": {
    "name": "E40"
  },
  "e29": {
    "name": "E29"
  },
  "e30": {
    "name": "E30"
  },
  "e41": {
    "name": "E41"
  },
  "e42": {
    "name": "E42"
  },
  "e31": {
    "name": "E31"
  },
  "e32": {
    "name": "E32"
  },
  "e43": {
    "name": "E43"
  },
  "e44": {
    "name": "E44"
  },
  "e33": {
    "name": "E33"
  },
  "e34": {
    "name": "E34"
  },
  "e45": {
    "name": "E45"
  },
  "e46": {
    "name": "E46"
  },
  "e35": {
    "name": "E35"
  },
  "e36": {
    "name": "E36"
  },
  "e47": {
    "name": "E47"
  },
  "e48": {
    "name": "E48"
  },
  "e37": {
    "name": "E37"
  },
  "e38": {
    "name": "E38"
  },
  "e49": {
    "name": "E49"
  },
  "e50": {
    "name": "E50"
  },
  "e51": {
    "name": "E51"
  },
  "e52": {
    "name": "E52"
  },
  "monatlicheBruttoeinnahmendurchnichtselbstaendigeArbeitinEuro": {
    "name": "Monatliche Bruttoeinnahmen durch nichtselbständige Arbeit in Euro",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE1": {
    "name": "Belegnummer E1",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchUnterhaltinEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Unterhalt in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE7": {
    "name": "Belegnummer E7",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchselbstaendigeArbeitGewerbebetriebLandundForstwirtschaftinEur": {
    "name": "Monatliche Bruttoeinnahmen durch selbständige Arbeit/Gewerbebetrieb/Land- und Forstwirtschaft in Eur",
    "maxCharacters": 13,
    "maxLineBreaks": 2
  },
  "belegnummerE2": {
    "name": "Belegnummer E2",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchRentePensioninEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Rente/Pension in Euro",
    "maxCharacters": 13,
    "maxLineBreaks": 2
  },
  "belegnummerE8": {
    "name": "Belegnummer E8",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchVermietungundVerpachtunginEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Vermietung und Verpachtung in Euro",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE3": {
    "name": "Belegnummer E3",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchArbeitslosengeldinEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Arbeitslosengeld in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE9": {
    "name": "Belegnummer E9",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchKapitalvermoegeninEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Kapitalvermögen in Euro",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE4": {
    "name": "Belegnummer E4",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchBuergergeldinEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Bürgergeld in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE10": {
    "name": "Belegnummer E10",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchKindergeldKinderzuschlaginEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Kindergeld/Kinderzuschlag in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE5": {
    "name": "Belegnummer E5",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchKrankengeldinEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Krankengeld in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE11": {
    "name": "Belegnummer E11",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchWohngeldinEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Wohngeld in Euro",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE6": {
    "name": "Belegnummer E6",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmendurchElterngeldinEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Elterngeld in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE12": {
    "name": "Belegnummer E12",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "andereEinnahmen1": {
    "name": "Andere Einnahmen 1",
    "maxCharacters": 85,
    "maxLineBreaks": 2
  },
  "bruttobezug1": {
    "name": "Bruttobezug 1",
    "maxCharacters": 30,
    "maxLineBreaks": 1
  },
  "belegnummerE13": {
    "name": "Belegnummer E13",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "andereEinnahmen2": {
    "name": "Andere Einnahmen 2",
    "maxCharacters": 85,
    "maxLineBreaks": 2
  },
  "bruttobezug2": {
    "name": "Bruttobezug 2",
    "maxCharacters": 30,
    "maxLineBreaks": 1
  },
  "belegnummerE14": {
    "name": "Belegnummer E14",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchnichtselbstaendigeArbeitinEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch nichtselbständige Arbeit in Euro",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE15": {
    "name": "Belegnummer E15",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchUnterhaltinEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch Unterhalt in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE21": {
    "name": "Belegnummer E21",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchselbstaendigeArbeitGewerbebetriebLandundFors": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch selbständige Arbeit/Gewerbebetrieb/Land- und Fors",
    "maxCharacters": 13,
    "maxLineBreaks": 2
  },
  "belegnummerE16": {
    "name": "Belegnummer E16",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchRentePensioninEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch Rente/Pension in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 2
  },
  "belegnummerE22": {
    "name": "Belegnummer E22",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchVermietungundVerpachtunginEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch Vermietung und Verpachtung in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE17": {
    "name": "Belegnummer E17",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchArbeitslosengeldinEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch Arbeitslosengeld in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE23": {
    "name": "Belegnummer E23",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchKapitalvermoegeninEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch Kapitalvermögen in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE18": {
    "name": "Belegnummer E18",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchBuergergeldinEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch Bürgergeld in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE24": {
    "name": "Belegnummer E24",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchKindergeldKinderzuschlaginEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch Kindergeld/Kinderzuschlag in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE19": {
    "name": "Belegnummer E19",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchKrankengeldinEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch Krankengeld in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE25": {
    "name": "Belegnummer E25",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchWohngeldinEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch Wohngeld in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE20": {
    "name": "Belegnummer E20",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "monatlicheBruttoeinnahmenPartnerPartnerindurchElterngeldinEuro": {
    "name": "Monatliche Bruttoeinnahmen Partner/Partnerin durch Elterngeld in Euro\r",
    "maxCharacters": 13,
    "maxLineBreaks": 1
  },
  "belegnummerE26": {
    "name": "Belegnummer E26",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "andereEinnahmenPartnerPartnerin1": {
    "name": "Andere Einnahmen Partner/Partnerin 1",
    "maxCharacters": 85,
    "maxLineBreaks": 2
  },
  "bruttobezugPartnerPartnerin1": {
    "name": "Bruttobezug Partner/Partnerin 1",
    "maxCharacters": 30,
    "maxLineBreaks": 1
  },
  "belegnummerE27": {
    "name": "Belegnummer E27",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "andereEinnahmenPartnerPartnerin2": {
    "name": "Andere Einnahmen Partner/Partnerin 2",
    "maxCharacters": 85,
    "maxLineBreaks": 2
  },
  "bruttobezugPartnerPartnerin2": {
    "name": "Bruttobezug Partner/Partnerin 2",
    "maxCharacters": 30,
    "maxLineBreaks": 1
  },
  "belegnummerE28": {
    "name": "Belegnummer E28",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "steuernSolidarzuschlag": {
    "name": "Steuern/Solidarzuschlag",
    "maxCharacters": 38,
    "maxLineBreaks": 3
  },
  "monatlicheAbzuegeinEurodurchSteuernSolidaritaetszuschlag": {
    "name": "Monatliche Abzüge in Euro durch Steuern/Solidaritätszuschlag",
    "maxCharacters": 12,
    "maxLineBreaks": 3
  },
  "belegnummerF1": {
    "name": "Belegnummer F1",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "steuernSolidarzuschlagPartnerPartnerin": {
    "name": "Steuern/Solidarzuschlag Partner/Partnerin",
    "maxCharacters": 38,
    "maxLineBreaks": 3
  },
  "monatlicheAbzuegeinEurodurchSteuernSolidaritaetszuschlagPartnerPartnerin": {
    "name": "Monatliche Abzüge in Euro durch Steuern/Solidaritätszuschlag Partner/Partnerin",
    "maxCharacters": 12,
    "maxLineBreaks": 3
  },
  "belegnummerF6": {
    "name": "Belegnummer F6",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "sozialversicherungsbeitraege": {
    "name": "Sozialversicherungsbeiträge",
    "maxCharacters": 38,
    "maxLineBreaks": 3
  },
  "monatlicheAbzuegeinEurodurchSozialversicherungsbeitraege": {
    "name": "Monatliche Abzüge in Euro durch Sozialversicherungsbeiträge",
    "maxCharacters": 12,
    "maxLineBreaks": 3
  },
  "belegnummerF2": {
    "name": "Belegnummer F2",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "sozialversicherungsbeitraegePartnerPartnerin": {
    "name": "Sozialversicherungsbeiträge Partner/Partnerin",
    "maxCharacters": 38,
    "maxLineBreaks": 3
  },
  "monatlicheAbzuegeinEurodurchSozialversicherungsbeitraegePartnerPartnerin": {
    "name": "Monatliche Abzüge in Euro durch Sozialversicherungsbeiträge Partner/Partnerin",
    "maxCharacters": 12,
    "maxLineBreaks": 3
  },
  "belegnummerF7": {
    "name": "Belegnummer F7",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "sonstigeVersicherungen": {
    "name": "Sonstige Versicherungen",
    "maxCharacters": 38,
    "maxLineBreaks": 3
  },
  "monatlicheAbzuegeinEurodurchSonstigeVersicherungen": {
    "name": "Monatliche Abzüge in Euro durch Sonstige Versicherungen",
    "maxCharacters": 12,
    "maxLineBreaks": 3
  },
  "belegnummerF3": {
    "name": "Belegnummer F3",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "sonstigeVersicherungenPartnerPartnerin": {
    "name": "Sonstige Versicherungen Partner/Partnerin",
    "maxCharacters": 38,
    "maxLineBreaks": 3
  },
  "monatlicheAbzuegeinEurodurchSonstigeVersicherungenPartnerPartnerin": {
    "name": "Monatliche Abzüge in Euro durch Sonstige Versicherungen Partner/Partnerin",
    "maxCharacters": 12,
    "maxLineBreaks": 3
  },
  "belegnummerF8": {
    "name": "Belegnummer F8",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "fahrtzurArbeitKostenfueroeffentlicheVerkehrsmittelodereinfacheEntfernungbeiKFZNutzung": {
    "name": "Fahrt zur Arbeit (Kosten für öffentliche Verkehrsmittel oder einfache Entfernung bei KFZ-Nutzung)",
    "maxCharacters": 38,
    "maxLineBreaks": 2
  },
  "monatlicheAbzuegeinEurodurchFahrtkosten": {
    "name": "Monatliche Abzüge in Euro durch Fahrtkosten",
    "maxCharacters": 12,
    "maxLineBreaks": 3
  },
  "belegnummerF4": {
    "name": "Belegnummer F4",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "fahrtzurArbeitKostenfueroeffentlicheVerkehrsmittelodereinfacheEntfernungbeiKFZNutzungPa": {
    "name": "Fahrt zur Arbeit (Kosten für öffentliche Verkehrsmittel oder einfache Entfernung bei KFZ-Nutzung) Pa",
    "maxCharacters": 38,
    "maxLineBreaks": 2
  },
  "monatlicheAbzuegeinEurodurchFahrtkostenPartnerPartnerin": {
    "name": "Monatliche Abzüge in Euro durch Fahrtkosten Partner/Partnerin",
    "maxCharacters": 12,
    "maxLineBreaks": 3
  },
  "belegnummerF9": {
    "name": "Belegnummer F9",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "sonstigeWerbungskostenBetriebsausgaben": {
    "name": "Sonstige Werbungskosten/Betriebsausgaben",
    "maxCharacters": 38,
    "maxLineBreaks": 3
  },
  "monatlicheAbzuegeinEurodurchSonstigeWerbungskostenBetriebsausgaben": {
    "name": "Monatliche Abzüge in Euro durch Sonstige Werbungskosten/Betriebsausgaben",
    "maxCharacters": 12,
    "maxLineBreaks": 3
  },
  "belegnummerF5": {
    "name": "Belegnummer F5",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "sonstigeWerbungskostenBetriebsausgabenPartnerPartnerin": {
    "name": "Sonstige Werbungskosten/Betriebsausgaben Partner/Partnerin",
    "maxCharacters": 38,
    "maxLineBreaks": 3
  },
  "monatlicheAbzuegeinEurodurchSonstigeWerbungskostenBetriebsausgabenPartnerPartnerin": {
    "name": "Monatliche Abzüge in Euro durch Sonstige Werbungskosten/Betriebsausgaben Partner/Partnerin",
    "maxCharacters": 12,
    "maxLineBreaks": 3
  },
  "belegnummerF10": {
    "name": "Belegnummer F10",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "g1": {
    "name": "G1"
  },
  "g2": {
    "name": "G2"
  },
  "g3": {
    "name": "G3"
  },
  "g4": {
    "name": "G4"
  },
  "g5": {
    "name": "G5"
  },
  "g6": {
    "name": "G6"
  },
  "g7": {
    "name": "G7"
  },
  "g8": {
    "name": "G8"
  },
  "g9": {
    "name": "G9"
  },
  "g10": {
    "name": "G10"
  },
  "g11": {
    "name": "G11"
  },
  "g12": {
    "name": "G12"
  },
  "artdesKontosKontoinhaberKreditinstitut": {
    "name": "Art des Kontos, Kontoinhaber, Kreditinstitut",
    "maxCharacters": 79,
    "maxLineBreaks": 3
  },
  "kontostand": {
    "name": "Kontostand",
    "maxCharacters": 18,
    "maxLineBreaks": 3
  },
  "belegnummerF11": {
    "name": "Belegnummer F11",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten": {
    "name": "Größe, Anschrift/Grundbuchbezeichnung, Allein- oder Miteigentum, Zahl der Wohneinheiten ",
    "maxCharacters": 79,
    "maxLineBreaks": 3
  },
  "verkehrswertGrundeigentum": {
    "name": "Verkehrswert Grundeigentum",
    "maxCharacters": 18,
    "maxLineBreaks": 3
  },
  "belegnummerF12": {
    "name": "Belegnummer F12",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "markeTypBaujahrAnschaffungsjahrAlleinoderMiteigentumKilometerstand": {
    "name": "Marke, Typ, Baujahr, Anschaffungsjahr, Allein- oder Miteigentum, Kilometerstand ",
    "maxCharacters": 79,
    "maxLineBreaks": 3
  },
  "verkehrswertKfz": {
    "name": "Verkehrswert Kfz",
    "maxCharacters": 18,
    "maxLineBreaks": 3
  },
  "belegnummerF13": {
    "name": "Belegnummer F13",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "bargeldbetraginEURBezeichnungderWertgegenstaendeAlleinoderMiteigentum": {
    "name": "Bargeldbetrag in EUR, Bezeichnung der Wertgegenstände, Allein- oder Miteigentum ",
    "maxCharacters": 79,
    "maxLineBreaks": 3
  },
  "verkehrswertBargeld": {
    "name": "Verkehrswert Bargeld",
    "maxCharacters": 18,
    "maxLineBreaks": 3
  },
  "belegnummerF14": {
    "name": "Belegnummer F14",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "versicherungVersicherungsnehmerDatumdesVertragesHandeltessichumeinezusaetzlicheAltersvor": {
    "name": "Versicherung, Versicherungsnehmer, Datum des Vertrages/Handelt es sich um eine zusätzliche Altersvor",
    "maxCharacters": 79,
    "maxLineBreaks": 3
  },
  "rueckkaufswert": {
    "name": "Rückkaufswert ",
    "maxCharacters": 18,
    "maxLineBreaks": 3
  },
  "belegnummerF15": {
    "name": "Belegnummer F15",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "bezeichnungAlleinoderMiteigentum": {
    "name": "Bezeichnung, Allein- oder Miteigentum ",
    "maxCharacters": 79,
    "maxLineBreaks": 3
  },
  "verkehrswertsonstigeVermoegenswerte": {
    "name": "Verkehrswert sonstige Vermögenswerte",
    "maxCharacters": 18,
    "maxLineBreaks": 3
  },
  "belegnummerF16": {
    "name": "Belegnummer F16",
    "maxCharacters": 7,
    "maxLineBreaks": 3
  },
  "h1": {
    "name": "H1"
  },
  "h2": {
    "name": "H2"
  },
  "h3": {
    "name": "H3"
  },
  "h4": {
    "name": "H4"
  },
  "1GesamtgroessedesWohnraumsdenSiealleinodergemeinsammitanderenPersonenbewohnen": {
    "name": "1. Gesamtgröße des Wohnraums, den Sie allein oder gemeinsam mit anderen Personen bewohnen",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "belegnummerH1": {
    "name": "Belegnummer H1",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "2ZahlderZimmer": {
    "name": "2. Zahl der Zimmer",
    "maxCharacters": 23,
    "maxLineBreaks": 2
  },
  "3AnzahlderPersonendiedenWohnrauminsgesamtbewohnen": {
    "name": "3. \u0007Anzahl der Personen, die den Wohnraum insgesamt bewohnen",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "belegnummerH2": {
    "name": "Belegnummer H2",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "wohnkostenalsMieterMieterinMieteohneNebenkosten": {
    "name": "Wohnkosten als Mieter/Mieterin - Miete ohne Nebenkosten",
    "maxCharacters": 24,
    "maxLineBreaks": 2
  },
  "wohnkostenalsMieterMieterinHeizungskosten": {
    "name": "Wohnkosten als Mieter/Mieterin - Heizungskosten",
    "maxCharacters": 23,
    "maxLineBreaks": 2
  },
  "wohnkostenalsMieterMieterinuebrigeNebenkosten": {
    "name": "Wohnkosten als Mieter/Mieterin - übrige Nebenkosten",
    "maxCharacters": 22,
    "maxLineBreaks": 2
  },
  "gesamtbetragalsMieterMieterin": {
    "name": "Gesamtbetrag als Mieter/Mieterin",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "ichalleinzahledavonalsMieterMieterin": {
    "name": "Ich allein zahle davon als Mieter/Mieterin",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "belegnummerH3": {
    "name": "Belegnummer H3",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "kostenalsEigentuemerEigentuemerinZinsenundTilgung": {
    "name": "Kosten als Eigentümer/Eigentümerin - Zinsen und Tilgung",
    "maxCharacters": 24,
    "maxLineBreaks": 2
  },
  "kostenalsEigentuemerEigentuemerinHeizungskosten": {
    "name": "Kosten als Eigentümer/Eigentümerin - Heizungskosten",
    "maxCharacters": 23,
    "maxLineBreaks": 2
  },
  "kostenalsEigentuemerEigentuemerinuebrigeNebenkosten": {
    "name": "Kosten als Eigentümer/Eigentümerin - übrige Nebenkosten",
    "maxCharacters": 22,
    "maxLineBreaks": 2
  },
  "gesamtbetragalsEigentuemerEigentuemerin": {
    "name": "Gesamtbetrag als Eigentümer/Eigentümerin",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "ichalleinzahledavonalsEigentuemerEigentuemerin": {
    "name": "Ich allein zahle davon als Eigentümer/Eigentümerin",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "belegnummerH4": {
    "name": "Belegnummer H4",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "genaueEinzelangabenzuderBelastungausFremdmittelnbeiNutzungalsMitEigentuemerusw1": {
    "name": "Genaue Einzelangaben zu der Belastung aus Fremdmitteln bei Nutzung als (Mit-)Eigentümer usw 1",
    "maxCharacters": 73,
    "maxLineBreaks": 2
  },
  "zinsenundTilgungmtl1": {
    "name": "Zinsen und Tilgung mtl. 1",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "zinsenundTilgungmtl2": {
    "name": "Zinsen und Tilgung mtl. 2",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "belegnummerH5": {
    "name": "Belegnummer H5",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "genaueEinzelangabenzuderBelastungausFremdmittelnbeiNutzungalsMitEigentuemerusw2": {
    "name": "Genaue Einzelangaben zu der Belastung aus Fremdmitteln bei Nutzung als (Mit-)Eigentümer usw 2",
    "maxCharacters": 73,
    "maxLineBreaks": 2
  },
  "belegnummerH6": {
    "name": "Belegnummer H6",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "sonstigeZahlungsverpflichtungen1": {
    "name": "Sonstige Zahlungsverpflichtungen 1",
    "maxCharacters": 49,
    "maxLineBreaks": 2
  },
  "restschuldinEuro1": {
    "name": "Restschuld in Euro 1",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "gesamtbelastungmtl1": {
    "name": "Gesamtbelastung mtl. 1",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "gesamtbelastungmtl2": {
    "name": "Gesamtbelastung mtl. 2",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "gesamtbelastungmtl3": {
    "name": "Gesamtbelastung mtl. 3",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "ichalleinzahledavonsonstigeZahlungsverpflichtungen1": {
    "name": "Ich allein zahle davon (sonstige Zahlungsverpflichtungen) 1",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "belegnummerI1": {
    "name": "Belegnummer I1",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "sonstigeZahlungsverpflichtungen2": {
    "name": "Sonstige Zahlungsverpflichtungen 2",
    "maxCharacters": 49,
    "maxLineBreaks": 2
  },
  "restschuldinEuro2": {
    "name": "Restschuld in Euro 2",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "ichalleinzahledavonsonstigeZahlungsverpflichtungen2": {
    "name": "Ich allein zahle davon (sonstige Zahlungsverpflichtungen) 2",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "belegnummerI2": {
    "name": "Belegnummer I2",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "sonstigeZahlungsverpflichtungen3": {
    "name": "Sonstige Zahlungsverpflichtungen 3",
    "maxCharacters": 49,
    "maxLineBreaks": 2
  },
  "ichalleinzahledavonsonstigeZahlungsverpflichtungen3": {
    "name": "Ich allein zahle davon (sonstige Zahlungsverpflichtungen) 3",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "belegnummerI3": {
    "name": "Belegnummer I3",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "besondereBelastungen1": {
    "name": "Besondere Belastungen 1",
    "maxCharacters": 95,
    "maxLineBreaks": 2
  },
  "ichalleinzahledavonbesondereBelastungen1": {
    "name": "Ich allein zahle davon (besondere Belastungen) 1",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "belegnummerJ1": {
    "name": "Belegnummer J1",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "besondereBelastungen2": {
    "name": "Besondere Belastungen 2",
    "maxCharacters": 95,
    "maxLineBreaks": 2
  },
  "ichalleinzahledavonbesondereBelastungen2": {
    "name": "Ich allein zahle davon (besondere Belastungen) 2",
    "maxCharacters": 20,
    "maxLineBreaks": 2
  },
  "belegnummerJ2": {
    "name": "Belegnummer J2",
    "maxCharacters": 7,
    "maxLineBreaks": 2
  },
  "anzahlderbeigefuegtenBelege": {
    "name": "Anzahl der beigefügten Belege",
    "maxCharacters": 89,
    "maxLineBreaks": 2
  },
  "ortDatum": {
    "name": "Ort, Datum",
    "maxCharacters": 34,
    "maxLineBreaks": 3
  },
  "restschuldinEurosonstigeZahlungsverpflichtungen1": {
    "name": "Restschuld in Euro (sonstige Zahlungsverpflichtungen) 1",
    "maxCharacters": 22,
    "maxLineBreaks": 2
  },
  "restschuldinEurosonstigeZahlungsverpflichtungen2": {
    "name": "Restschuld in Euro (sonstige Zahlungsverpflichtungen) 2",
    "maxCharacters": 22,
    "maxLineBreaks": 2
  },
  "restschuldinEurosonstigeZahlungsverpflichtungen3": {
    "name": "Restschuld in Euro (sonstige Zahlungsverpflichtungen) 3",
    "maxCharacters": 22,
    "maxLineBreaks": 2
  }
};
}

export type ProzesskostenhilfePDF = {
  "b1": BooleanField;
  "b2": BooleanField;
  "b3": BooleanField;
  "b4": BooleanField;
  "c1": BooleanField;
  "c2": BooleanField;
  "d1": BooleanField;
  "d2": BooleanField;
  "d3": BooleanField;
  "d4": BooleanField;
  "d5": BooleanField;
  "d6": BooleanField;
  "d7": BooleanField;
  "d8": BooleanField;
  "d9": BooleanField;
  "d10": BooleanField;
  "bezeichnungOrtundGeschaeftsnummerdesGerichts": StringField;
  "nameVornameggfGeburtsname": StringField;
  "berufErwerbstaetigkeit": StringField;
  "geburtsdatum": StringField;
  "familienstand": StringField;
  "anschriftStrasseHausnummerPostleitzahlWohnort": StringField;
  "tagsuebererreichbarunterNummer": StringField;
  "sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon": StringField;
  "hoehederKosten": StringField;
  "belegnummerB1": StringField;
  "bezeichnungderVersicherung": StringField;
  "belegnummerB2": StringField;
  "namedesUnterhaltspflichtigen": StringField;
  "belegnummerC": StringField;
  "angehoerigerNr1": StringField;
  "angehoerigerNr2": StringField;
  "angehoerigerNr3": StringField;
  "angehoerigerNr4": StringField;
  "angehoerigerNr5": StringField;
  "geburtsdatum1": StringField;
  "verhaeltnis1": StringField;
  "monatsbetrag1": StringField;
  "betrag1": StringField;
  "belegnummerD1": StringField;
  "geburtsdatum2": StringField;
  "verhaeltnis2": StringField;
  "monatsbetrag2": StringField;
  "betrag2": StringField;
  "belegnummerD2": StringField;
  "geburtsdatum3": StringField;
  "verhaeltnis3": StringField;
  "monatsbetrag3": StringField;
  "betrag3": StringField;
  "belegnummerD3": StringField;
  "geburtsdatum4": StringField;
  "verhaeltnis4": StringField;
  "monatsbetrag4": StringField;
  "betrag4": StringField;
  "belegnummerD4": StringField;
  "geburtsdatum5": StringField;
  "verhaeltnis5": StringField;
  "monatsbetrag5": StringField;
  "betrag5": StringField;
  "belegnummerD5": StringField;
  "e1": BooleanField;
  "e2": BooleanField;
  "e13": BooleanField;
  "e14": BooleanField;
  "e3": BooleanField;
  "e4": BooleanField;
  "e15": BooleanField;
  "e16": BooleanField;
  "e5": BooleanField;
  "e6": BooleanField;
  "e17": BooleanField;
  "e18": BooleanField;
  "e7": BooleanField;
  "e8": BooleanField;
  "e19": BooleanField;
  "e20": BooleanField;
  "e9": BooleanField;
  "e10": BooleanField;
  "e21": BooleanField;
  "e22": BooleanField;
  "e11": BooleanField;
  "e12": BooleanField;
  "e23": BooleanField;
  "e24": BooleanField;
  "e25": BooleanField;
  "e26": BooleanField;
  "e27": BooleanField;
  "e28": BooleanField;
  "e39": BooleanField;
  "e40": BooleanField;
  "e29": BooleanField;
  "e30": BooleanField;
  "e41": BooleanField;
  "e42": BooleanField;
  "e31": BooleanField;
  "e32": BooleanField;
  "e43": BooleanField;
  "e44": BooleanField;
  "e33": BooleanField;
  "e34": BooleanField;
  "e45": BooleanField;
  "e46": BooleanField;
  "e35": BooleanField;
  "e36": BooleanField;
  "e47": BooleanField;
  "e48": BooleanField;
  "e37": BooleanField;
  "e38": BooleanField;
  "e49": BooleanField;
  "e50": BooleanField;
  "e51": BooleanField;
  "e52": BooleanField;
  "monatlicheBruttoeinnahmendurchnichtselbstaendigeArbeitinEuro": StringField;
  "belegnummerE1": StringField;
  "monatlicheBruttoeinnahmendurchUnterhaltinEuro": StringField;
  "belegnummerE7": StringField;
  "monatlicheBruttoeinnahmendurchselbstaendigeArbeitGewerbebetriebLandundForstwirtschaftinEur": StringField;
  "belegnummerE2": StringField;
  "monatlicheBruttoeinnahmendurchRentePensioninEuro": StringField;
  "belegnummerE8": StringField;
  "monatlicheBruttoeinnahmendurchVermietungundVerpachtunginEuro": StringField;
  "belegnummerE3": StringField;
  "monatlicheBruttoeinnahmendurchArbeitslosengeldinEuro": StringField;
  "belegnummerE9": StringField;
  "monatlicheBruttoeinnahmendurchKapitalvermoegeninEuro": StringField;
  "belegnummerE4": StringField;
  "monatlicheBruttoeinnahmendurchBuergergeldinEuro": StringField;
  "belegnummerE10": StringField;
  "monatlicheBruttoeinnahmendurchKindergeldKinderzuschlaginEuro": StringField;
  "belegnummerE5": StringField;
  "monatlicheBruttoeinnahmendurchKrankengeldinEuro": StringField;
  "belegnummerE11": StringField;
  "monatlicheBruttoeinnahmendurchWohngeldinEuro": StringField;
  "belegnummerE6": StringField;
  "monatlicheBruttoeinnahmendurchElterngeldinEuro": StringField;
  "belegnummerE12": StringField;
  "andereEinnahmen1": StringField;
  "bruttobezug1": StringField;
  "belegnummerE13": StringField;
  "andereEinnahmen2": StringField;
  "bruttobezug2": StringField;
  "belegnummerE14": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchnichtselbstaendigeArbeitinEuro": StringField;
  "belegnummerE15": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchUnterhaltinEuro": StringField;
  "belegnummerE21": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchselbstaendigeArbeitGewerbebetriebLandundFors": StringField;
  "belegnummerE16": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchRentePensioninEuro": StringField;
  "belegnummerE22": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchVermietungundVerpachtunginEuro": StringField;
  "belegnummerE17": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchArbeitslosengeldinEuro": StringField;
  "belegnummerE23": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchKapitalvermoegeninEuro": StringField;
  "belegnummerE18": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchBuergergeldinEuro": StringField;
  "belegnummerE24": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchKindergeldKinderzuschlaginEuro": StringField;
  "belegnummerE19": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchKrankengeldinEuro": StringField;
  "belegnummerE25": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchWohngeldinEuro": StringField;
  "belegnummerE20": StringField;
  "monatlicheBruttoeinnahmenPartnerPartnerindurchElterngeldinEuro": StringField;
  "belegnummerE26": StringField;
  "andereEinnahmenPartnerPartnerin1": StringField;
  "bruttobezugPartnerPartnerin1": StringField;
  "belegnummerE27": StringField;
  "andereEinnahmenPartnerPartnerin2": StringField;
  "bruttobezugPartnerPartnerin2": StringField;
  "belegnummerE28": StringField;
  "steuernSolidarzuschlag": StringField;
  "monatlicheAbzuegeinEurodurchSteuernSolidaritaetszuschlag": StringField;
  "belegnummerF1": StringField;
  "steuernSolidarzuschlagPartnerPartnerin": StringField;
  "monatlicheAbzuegeinEurodurchSteuernSolidaritaetszuschlagPartnerPartnerin": StringField;
  "belegnummerF6": StringField;
  "sozialversicherungsbeitraege": StringField;
  "monatlicheAbzuegeinEurodurchSozialversicherungsbeitraege": StringField;
  "belegnummerF2": StringField;
  "sozialversicherungsbeitraegePartnerPartnerin": StringField;
  "monatlicheAbzuegeinEurodurchSozialversicherungsbeitraegePartnerPartnerin": StringField;
  "belegnummerF7": StringField;
  "sonstigeVersicherungen": StringField;
  "monatlicheAbzuegeinEurodurchSonstigeVersicherungen": StringField;
  "belegnummerF3": StringField;
  "sonstigeVersicherungenPartnerPartnerin": StringField;
  "monatlicheAbzuegeinEurodurchSonstigeVersicherungenPartnerPartnerin": StringField;
  "belegnummerF8": StringField;
  "fahrtzurArbeitKostenfueroeffentlicheVerkehrsmittelodereinfacheEntfernungbeiKFZNutzung": StringField;
  "monatlicheAbzuegeinEurodurchFahrtkosten": StringField;
  "belegnummerF4": StringField;
  "fahrtzurArbeitKostenfueroeffentlicheVerkehrsmittelodereinfacheEntfernungbeiKFZNutzungPa": StringField;
  "monatlicheAbzuegeinEurodurchFahrtkostenPartnerPartnerin": StringField;
  "belegnummerF9": StringField;
  "sonstigeWerbungskostenBetriebsausgaben": StringField;
  "monatlicheAbzuegeinEurodurchSonstigeWerbungskostenBetriebsausgaben": StringField;
  "belegnummerF5": StringField;
  "sonstigeWerbungskostenBetriebsausgabenPartnerPartnerin": StringField;
  "monatlicheAbzuegeinEurodurchSonstigeWerbungskostenBetriebsausgabenPartnerPartnerin": StringField;
  "belegnummerF10": StringField;
  "g1": BooleanField;
  "g2": BooleanField;
  "g3": BooleanField;
  "g4": BooleanField;
  "g5": BooleanField;
  "g6": BooleanField;
  "g7": BooleanField;
  "g8": BooleanField;
  "g9": BooleanField;
  "g10": BooleanField;
  "g11": BooleanField;
  "g12": BooleanField;
  "artdesKontosKontoinhaberKreditinstitut": StringField;
  "kontostand": StringField;
  "belegnummerF11": StringField;
  "groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten": StringField;
  "verkehrswertGrundeigentum": StringField;
  "belegnummerF12": StringField;
  "markeTypBaujahrAnschaffungsjahrAlleinoderMiteigentumKilometerstand": StringField;
  "verkehrswertKfz": StringField;
  "belegnummerF13": StringField;
  "bargeldbetraginEURBezeichnungderWertgegenstaendeAlleinoderMiteigentum": StringField;
  "verkehrswertBargeld": StringField;
  "belegnummerF14": StringField;
  "versicherungVersicherungsnehmerDatumdesVertragesHandeltessichumeinezusaetzlicheAltersvor": StringField;
  "rueckkaufswert": StringField;
  "belegnummerF15": StringField;
  "bezeichnungAlleinoderMiteigentum": StringField;
  "verkehrswertsonstigeVermoegenswerte": StringField;
  "belegnummerF16": StringField;
  "h1": BooleanField;
  "h2": BooleanField;
  "h3": BooleanField;
  "h4": BooleanField;
  "1GesamtgroessedesWohnraumsdenSiealleinodergemeinsammitanderenPersonenbewohnen": StringField;
  "belegnummerH1": StringField;
  "2ZahlderZimmer": StringField;
  "3AnzahlderPersonendiedenWohnrauminsgesamtbewohnen": StringField;
  "belegnummerH2": StringField;
  "wohnkostenalsMieterMieterinMieteohneNebenkosten": StringField;
  "wohnkostenalsMieterMieterinHeizungskosten": StringField;
  "wohnkostenalsMieterMieterinuebrigeNebenkosten": StringField;
  "gesamtbetragalsMieterMieterin": StringField;
  "ichalleinzahledavonalsMieterMieterin": StringField;
  "belegnummerH3": StringField;
  "kostenalsEigentuemerEigentuemerinZinsenundTilgung": StringField;
  "kostenalsEigentuemerEigentuemerinHeizungskosten": StringField;
  "kostenalsEigentuemerEigentuemerinuebrigeNebenkosten": StringField;
  "gesamtbetragalsEigentuemerEigentuemerin": StringField;
  "ichalleinzahledavonalsEigentuemerEigentuemerin": StringField;
  "belegnummerH4": StringField;
  "genaueEinzelangabenzuderBelastungausFremdmittelnbeiNutzungalsMitEigentuemerusw1": StringField;
  "zinsenundTilgungmtl1": StringField;
  "zinsenundTilgungmtl2": StringField;
  "belegnummerH5": StringField;
  "genaueEinzelangabenzuderBelastungausFremdmittelnbeiNutzungalsMitEigentuemerusw2": StringField;
  "belegnummerH6": StringField;
  "sonstigeZahlungsverpflichtungen1": StringField;
  "restschuldinEuro1": StringField;
  "gesamtbelastungmtl1": StringField;
  "gesamtbelastungmtl2": StringField;
  "gesamtbelastungmtl3": StringField;
  "ichalleinzahledavonsonstigeZahlungsverpflichtungen1": StringField;
  "belegnummerI1": StringField;
  "sonstigeZahlungsverpflichtungen2": StringField;
  "restschuldinEuro2": StringField;
  "ichalleinzahledavonsonstigeZahlungsverpflichtungen2": StringField;
  "belegnummerI2": StringField;
  "sonstigeZahlungsverpflichtungen3": StringField;
  "ichalleinzahledavonsonstigeZahlungsverpflichtungen3": StringField;
  "belegnummerI3": StringField;
  "besondereBelastungen1": StringField;
  "ichalleinzahledavonbesondereBelastungen1": StringField;
  "belegnummerJ1": StringField;
  "besondereBelastungen2": StringField;
  "ichalleinzahledavonbesondereBelastungen2": StringField;
  "belegnummerJ2": StringField;
  "anzahlderbeigefuegtenBelege": StringField;
  "ortDatum": StringField;
  "restschuldinEurosonstigeZahlungsverpflichtungen1": StringField;
  "restschuldinEurosonstigeZahlungsverpflichtungen2": StringField;
  "restschuldinEurosonstigeZahlungsverpflichtungen3": StringField;
};
