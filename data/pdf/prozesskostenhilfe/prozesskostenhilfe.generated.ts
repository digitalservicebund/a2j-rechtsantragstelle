import type { BooleanField, StringField } from "~/services/pdf/fileTypes";

export function getProzesskostenhilfeParameters(): ProzesskostenhilfePDF {
  return {
  "nameVornameggfGeburtsname": {
    "name": "Name Vorname ggf Geburtsname",
    "maxCharWidth": 55,
    "maxLines": 2
  },
  "berufErwerbstaetigkeit": {
    "name": "Beruf Erwerbstätigkeit",
    "maxCharWidth": 30,
    "maxLines": 2
  },
  "geburtsdatum": {
    "name": "Geburtsdatum",
    "maxCharWidth": 22,
    "maxLines": 2
  },
  "anschriftStrasseHausnummerPostleitzahlWohnort": {
    "name": "Anschrift Straße Hausnummer Postleitzahl Wohnort",
    "maxCharWidth": 87,
    "maxLines": 1
  },
  "sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon": {
    "name": "Sofern vorhanden Gesetzlicher Vertreter Name Vorname Anschrift Telefon",
    "maxCharWidth": 126,
    "maxLines": 1
  },
  "ja": {
    "name": "Ja"
  },
  "nein_3": {
    "name": "Nein_3"
  },
  "ja_2": {
    "name": "Ja_2"
  },
  "geburtsdatum1": {
    "name": "Geburts datum1",
    "maxCharWidth": 14,
    "maxLines": 2
  },
  "ja_4": {
    "name": "Ja_4"
  },
  "geburtsdatum2": {
    "name": "Geburts datum2",
    "maxCharWidth": 14,
    "maxLines": 2
  },
  "ja_5": {
    "name": "Ja_5"
  },
  "geburtsdatum3": {
    "name": "Geburts datum3",
    "maxCharWidth": 14,
    "maxLines": 2
  },
  "ja_6": {
    "name": "Ja_6"
  },
  "geburtsdatum4": {
    "name": "Geburts datum4",
    "maxCharWidth": 14,
    "maxLines": 2
  },
  "ja_7": {
    "name": "Ja_7"
  },
  "ja_8": {
    "name": "Ja_8"
  },
  "geburtsdatum5": {
    "name": "Geburts datum5",
    "maxCharWidth": 14,
    "maxLines": 2
  },
  "nein_10": {
    "name": "Nein_10"
  },
  "ja_9": {
    "name": "Ja_9"
  },
  "nein_11": {
    "name": "Nein_11"
  },
  "ja_10": {
    "name": "Ja_10"
  },
  "nein_12": {
    "name": "Nein_12"
  },
  "ja_11": {
    "name": "Ja_11"
  },
  "nein_13": {
    "name": "Nein_13"
  },
  "ja_12": {
    "name": "Ja_12"
  },
  "nein_14": {
    "name": "Nein_14"
  },
  "ja_13": {
    "name": "Ja_13"
  },
  "nein_15": {
    "name": "Nein_15"
  },
  "ja_14": {
    "name": "Ja_14"
  },
  "nein_16": {
    "name": "Nein_16"
  },
  "ja_15": {
    "name": "Ja_15"
  },
  "nein_17": {
    "name": "Nein_17"
  },
  "ja_16": {
    "name": "Ja_16"
  },
  "nein_18": {
    "name": "Nein_18"
  },
  "ja_17": {
    "name": "Ja_17"
  },
  "nein_19": {
    "name": "Nein_19"
  },
  "ja_18": {
    "name": "Ja_18"
  },
  "nein_20": {
    "name": "Nein_20"
  },
  "ja_19": {
    "name": "Ja_19"
  },
  "nein_21": {
    "name": "Nein_21"
  },
  "ja_20": {
    "name": "Ja_20"
  },
  "nein_22": {
    "name": "Nein_22"
  },
  "undefined_8": {
    "name": "undefined_8"
  },
  "nein_23": {
    "name": "Nein_23"
  },
  "ja_22": {
    "name": "Ja_22"
  },
  "nein_24": {
    "name": "Nein_24"
  },
  "ja_23": {
    "name": "Ja_23"
  },
  "nein_25": {
    "name": "Nein_25"
  },
  "ja_24": {
    "name": "Ja_24"
  },
  "nein_26": {
    "name": "Nein_26"
  },
  "ja_25": {
    "name": "Ja_25"
  },
  "nein_27": {
    "name": "Nein_27"
  },
  "ja_26": {
    "name": "Ja_26"
  },
  "nein_28": {
    "name": "Nein_28"
  },
  "ja_27": {
    "name": "Ja_27"
  },
  "nein_29": {
    "name": "Nein_29"
  },
  "ja_28": {
    "name": "Ja_28"
  },
  "nein_30": {
    "name": "Nein_30"
  },
  "ja_29": {
    "name": "Ja_29"
  },
  "nein_31": {
    "name": "Nein_31"
  },
  "ja_30": {
    "name": "Ja_30"
  },
  "nein_32": {
    "name": "Nein_32"
  },
  "ja_31": {
    "name": "Ja_31"
  },
  "nein_33": {
    "name": "Nein_33"
  },
  "ja_32": {
    "name": "Ja_32"
  },
  "nein_34": {
    "name": "Nein_34"
  },
  "ja_33": {
    "name": "Ja_33"
  },
  "nein_35": {
    "name": "Nein_35"
  },
  "ja_35": {
    "name": "Ja_35"
  },
  "steuernSolidaritaetszuschlag_2": {
    "name": "SteuernSolidaritätszuschlag_2",
    "maxCharWidth": 39,
    "maxLines": 2
  },
  "sozialversicherungsbeitraege_2": {
    "name": "Sozialversicherungsbeiträge_2",
    "maxCharWidth": 39,
    "maxLines": 2
  },
  "sonstigeVersicherungen": {
    "name": "Sonstige Versicherungen",
    "maxCharWidth": 38,
    "maxLines": 2
  },
  "nein_37": {
    "name": "Nein_37"
  },
  "ja_36": {
    "name": "Ja_36"
  },
  "nein_39": {
    "name": "Nein_39"
  },
  "ja_37": {
    "name": "Ja_37"
  },
  "nein_41": {
    "name": "Nein_41"
  },
  "ja_38": {
    "name": "Ja_38"
  },
  "nein_43": {
    "name": "Nein_43"
  },
  "ja_39": {
    "name": "Ja_39"
  },
  "nein_44": {
    "name": "Nein_44"
  },
  "ja_40": {
    "name": "Ja_40"
  },
  "nein_46": {
    "name": "Nein_46"
  },
  "ja_41": {
    "name": "Ja_41"
  },
  "undefined_10": {
    "name": "undefined_10"
  },
  "heizungskosten": {
    "name": "Heizungskosten",
    "maxCharWidth": 23,
    "maxLines": 1
  },
  "gesamtbetrag": {
    "name": "Gesamtbetrag",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "undefined_11": {
    "name": "undefined_11"
  },
  "undefined_12": {
    "name": "undefined_12"
  },
  "zinsenundTilgung": {
    "name": "Zinsen und Tilgung",
    "maxCharWidth": 25,
    "maxLines": 1
  },
  "heizungskosten_2": {
    "name": "Heizungskosten_2",
    "maxCharWidth": 24,
    "maxLines": 1
  },
  "gesamtbetrag_2": {
    "name": "Gesamtbetrag_2",
    "maxCharWidth": 22,
    "maxLines": 1
  },
  "restschuldinEUR": {
    "name": "Restschuld in EUR",
    "maxCharWidth": 22,
    "maxLines": 1
  },
  "restschuldinEUR_2": {
    "name": "Restschuld in EUR_2",
    "maxCharWidth": 22,
    "maxLines": 1
  },
  "restschuldinEUR_3": {
    "name": "Restschuld in EUR_3",
    "maxCharWidth": 22,
    "maxLines": 1
  },
  "anzahlderbeigefuegtenBelege": {
    "name": "Anzahl der beigefügten Belege",
    "maxCharWidth": 90,
    "maxLines": 1
  },
  "aufgenommenUnterschriftAmtsbezeichnung": {
    "name": "Aufgenommen UnterschriftAmtsbezeichnung",
    "maxCharWidth": 47,
    "maxLines": 2
  },
  "text2": {
    "name": "Text2",
    "maxCharWidth": 37,
    "maxLines": 1
  },
  "text3": {
    "name": "Text3",
    "maxCharWidth": 15,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro": {
    "name": "Monatliche Bruttoeinnahmen durch Nichtselbstständige Arbeit in Euro",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "1Nein": {
    "name": "1. Nein"
  },
  "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1": {
    "name": "1. Haben Sie andere Einnahmen, auch einmalige oder unregelmäßige Wenn Ja bitte Art Bezugszeitraum und Höhe angeben zB WeihnachtsUrlaubsgeld jährlich Steuererstattung jährlich BAföG mtlRow1",
    "maxCharWidth": 86,
    "maxLines": 2
  },
  "belegnummerB1": {
    "name": "Belegnummer B1",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerB2": {
    "name": "Belegnummer B2",
    "maxCharWidth": 8,
    "maxLines": 3
  },
  "belegnummerC": {
    "name": "BelegnummerC",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "angehoerigerNummereins": {
    "name": "Angehöriger Nummer eins",
    "maxCharWidth": 37,
    "maxLines": 2
  },
  "angehoerigerNummerzwei": {
    "name": "Angehöriger Nummer zwei",
    "maxCharWidth": 37,
    "maxLines": 2
  },
  "angehoerigerNummerdrei": {
    "name": "Angehöriger Nummer drei",
    "maxCharWidth": 37,
    "maxLines": 2
  },
  "angehoerigerNummervier": {
    "name": "Angehöriger Nummer vier",
    "maxCharWidth": 37,
    "maxLines": 2
  },
  "angehoerigerNummerfuenf": {
    "name": "Angehöriger Nummer fünf",
    "maxCharWidth": 37,
    "maxLines": 2
  },
  "verhaeltnis1": {
    "name": "Verhältnis1",
    "maxCharWidth": 12,
    "maxLines": 2
  },
  "verhaeltnis2": {
    "name": "Verhältnis2",
    "maxCharWidth": 12,
    "maxLines": 2
  },
  "verhaeltnis3": {
    "name": "Verhältnis3",
    "maxCharWidth": 12,
    "maxLines": 2
  },
  "verhaeltnis4": {
    "name": "Verhältnis4",
    "maxCharWidth": 12,
    "maxLines": 2
  },
  "verhaeltnis5": {
    "name": "Verhältnis5",
    "maxCharWidth": 12,
    "maxLines": 2
  },
  "monatsbetrag3": {
    "name": "Monatsbetrag3",
    "maxCharWidth": 21,
    "maxLines": 2
  },
  "monatsbetrag4": {
    "name": "Monatsbetrag4",
    "maxCharWidth": 21,
    "maxLines": 2
  },
  "monatsbetrag5": {
    "name": "Monatsbetrag5",
    "maxCharWidth": 21,
    "maxLines": 2
  },
  "eigeneEinnahmen1": {
    "name": "eigene Einnahmen1"
  },
  "monatsbetrag1": {
    "name": "Monatsbetrag1",
    "maxCharWidth": 21,
    "maxLines": 2
  },
  "monatsbetrag2": {
    "name": "Monatsbetrag2",
    "maxCharWidth": 21,
    "maxLines": 2
  },
  "eigeneEinnahmen2": {
    "name": "eigene Einnahmen2"
  },
  "eigeneEinnahmen3": {
    "name": "eigene Einnahmen3"
  },
  "eigeneEinnahmen4": {
    "name": "eigene Einnahmen4"
  },
  "eigeneEinnahmen5": {
    "name": "eigene Einnahmen5"
  },
  "betrag_1": {
    "name": "Betrag_1",
    "maxCharWidth": 13,
    "maxLines": 1
  },
  "betrag_2": {
    "name": "Betrag_2",
    "maxCharWidth": 13,
    "maxLines": 1
  },
  "betrag_3": {
    "name": "Betrag_3",
    "maxCharWidth": 13,
    "maxLines": 1
  },
  "betrag_4": {
    "name": "Betrag_4",
    "maxCharWidth": 13,
    "maxLines": 1
  },
  "betrag_5": {
    "name": "Betrag_5",
    "maxCharWidth": 13,
    "maxLines": 1
  },
  "belegnummerH1": {
    "name": "Belegnummer H1",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH2": {
    "name": "Belegnummer H2",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerH3": {
    "name": "Belegnummer H3",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH4": {
    "name": "Belegnummer H4",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH5": {
    "name": "Belegnummer H5",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH6": {
    "name": "Belegnummer H6",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH7": {
    "name": "Belegnummer H7",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH8": {
    "name": "Belegnummer H8",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerH9": {
    "name": "Belegnummer H9",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH10": {
    "name": "Belegnummer H10",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH11": {
    "name": "Belegnummer H11",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH12": {
    "name": "Belegnummer H12",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH13": {
    "name": "Belegnummer H13",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerH14": {
    "name": "Belegnummer H14",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerH16": {
    "name": "Belegnummer H16",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH17": {
    "name": "Belegnummer H17",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH18": {
    "name": "Belegnummer H18",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerH19": {
    "name": "Belegnummer H19",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerH20": {
    "name": "Belegnummer H20",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummer21": {
    "name": "Belegnummer 21",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH22": {
    "name": "Belegnummer H22",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH23": {
    "name": "Belegnummer H23",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH24": {
    "name": "Belegnummer H24",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH25": {
    "name": "Belegnummer H25",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH26": {
    "name": "Belegnummer H26",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH28": {
    "name": "Belegnummer H28",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "belegnummerH30": {
    "name": "Belegnummer H30",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerH31": {
    "name": "Belegnummer H31",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerC1": {
    "name": "Belegnummer C1",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerC2": {
    "name": "Belegnummer C2",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerC3": {
    "name": "Belegnummer C3",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerC4": {
    "name": "Belegnummer C4",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerC5": {
    "name": "Belegnummer C5",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro8": {
    "name": "Monatliche Bruttoeinnahmen durch Nichtselbstständige Arbeit in Euro8",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro9": {
    "name": "Monatliche Bruttoeinnahmen durch Nichtselbstständige Arbeit in Euro9",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro10": {
    "name": "Monatliche Bruttoeinnahmen durch Nichtselbstständige Arbeit in Euro10",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro11": {
    "name": "Monatliche Bruttoeinnahmen durch Nichtselbstständige Arbeit in Euro11",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro12": {
    "name": "Monatliche Bruttoeinnahmen durch Nichtselbstständige Arbeit in Euro12",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro13": {
    "name": "Monatliche Bruttoeinnahmen durch Nichtselbstständige Arbeit in Euro13",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "2HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow2": {
    "name": "2. Haben Sie andere Einnahmen  auch einmalige oder unregelmäßige Wenn Ja bitte Art Bezugszeitraum und Höhe angeben zB WeihnachtsUrlaubsgeld jährlich Steuererstattung jährlich BAföG mtlRow2",
    "maxCharWidth": 86,
    "maxLines": 2
  },
  "euroBrutto2": {
    "name": "Euro Brutto 2",
    "maxCharWidth": 30,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3": {
    "name": "Monatliche Bruttoeinnahmen durch Selbstständige Arbeit in Euro3",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchWohngeldinEuro7": {
    "name": "Monatliche Bruttoeinnahmen durch Wohngeld in Euro7",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchKindergeldIKinderzuschlaginEuro6": {
    "name": "Monatliche Bruttoeinnahmen durch KindergeldIKinderzuschlag in Euro6",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchKapitalvermoegeninEuro5": {
    "name": "Monatliche Bruttoeinnahmen durch Kapitalvermögen  in Euro5",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmendurchVermietungoderVerpachtunginEuro4": {
    "name": "Monatliche Bruttoeinnahmen durch Vermietung oder Verpachtung in Euro4",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben": {
    "name": "Hat Ihr Ehegatte/eingetragener Lebenspartner bzw. Ihre Ehegattin/eingetrageneLebenspartnerin andere Einnahmen? Bitte angeben",
    "maxCharWidth": 86,
    "maxLines": 2
  },
  "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben2": {
    "name": "Hat Ihr Ehegatte/eingetragener Lebenspartner bzw. Ihre Ehegattin/eingetrageneLebenspartnerin andere Einnahmen? Bitte angeben 2",
    "maxCharWidth": 86,
    "maxLines": 2
  },
  "euroBrutto3": {
    "name": "Euro Brutto 3",
    "maxCharWidth": 31,
    "maxLines": 1
  },
  "euroBrutto": {
    "name": "Euro Brutto",
    "maxCharWidth": 30,
    "maxLines": 1
  },
  "euroBrutto4": {
    "name": "Euro Brutto 4",
    "maxCharWidth": 31,
    "maxLines": 1
  },
  "steuernSolidaritaetszuschlag1": {
    "name": "SteuernSolidaritätszuschlag1",
    "maxCharWidth": 39,
    "maxLines": 2
  },
  "belegnummerI1": {
    "name": "Belegnummer I1",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerI2": {
    "name": "Belegnummer I2",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerI3": {
    "name": "Belegnummer I3",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerI4": {
    "name": "Belegnummer I4",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerI5": {
    "name": "Belegnummer I5",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerI6": {
    "name": "Belegnummer I6",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerI7": {
    "name": "Belegnummer I7",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerI8": {
    "name": "Belegnummer I8",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerI9": {
    "name": "Belegnummer I9",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerI10": {
    "name": "Belegnummer I10",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "sozialversicherungsbeitraege1": {
    "name": "Sozialversicherungsbeiträge1",
    "maxCharWidth": 39,
    "maxLines": 2
  },
  "monatlicheAbzuegeinEuro1": {
    "name": "Monatliche Abzüge in Euro1",
    "maxCharWidth": 13,
    "maxLines": 2
  },
  "monatlicheAbzuegeinEuro2": {
    "name": "Monatliche Abzüge in Euro2",
    "maxCharWidth": 13,
    "maxLines": 2
  },
  "monatlicheAbzuegeinEuro3": {
    "name": "Monatliche Abzüge in Euro3",
    "maxCharWidth": 13,
    "maxLines": 2
  },
  "monatlicheAbzuegeinEuro4": {
    "name": "Monatliche Abzüge in Euro4",
    "maxCharWidth": 13,
    "maxLines": 2
  },
  "sozialversicherungsbeitraegeEhegatte": {
    "name": "Sozialversicherungsbeiträge Ehegatte",
    "maxCharWidth": 39,
    "maxLines": 2
  },
  "steuernSolidaritaetszuschlag2": {
    "name": "SteuernSolidaritätszuschlag2",
    "maxCharWidth": 39,
    "maxLines": 2
  },
  "sonstigeVersicherungenEhegatte": {
    "name": "Sonstige Versicherungen Ehegatte",
    "maxCharWidth": 38,
    "maxLines": 2
  },
  "fahrtkostenEhegatte": {
    "name": "Fahrtkosten Ehegatte",
    "maxCharWidth": 39,
    "maxLines": 1
  },
  "sonstigewerbungskostenEhegatte": {
    "name": "Sonstige werbungskosten Ehegatte",
    "maxCharWidth": 39,
    "maxLines": 2
  },
  "monatlicheAbzuegeinEuro5": {
    "name": "Monatliche Abzüge in Euro5",
    "maxCharWidth": 13,
    "maxLines": 2
  },
  "monatlicheAbzuegeinEuro6": {
    "name": "Monatliche Abzüge in Euro6",
    "maxCharWidth": 13,
    "maxLines": 2
  },
  "monatlicheAbzuegeinEuro7": {
    "name": "Monatliche Abzüge in Euro7",
    "maxCharWidth": 13,
    "maxLines": 2
  },
  "monatlicheAbzuegeinEuro8": {
    "name": "Monatliche Abzüge in Euro8",
    "maxCharWidth": 13,
    "maxLines": 2
  },
  "monatlicheAbzuegeinEuro9": {
    "name": "Monatliche Abzüge in Euro9",
    "maxCharWidth": 13,
    "maxLines": 2
  },
  "monatlicheAbzuegeinEuro10": {
    "name": "Monatliche Abzüge in Euro10",
    "maxCharWidth": 13,
    "maxLines": 2
  },
  "artdesKontosKontoinhaberKreditinstitut": {
    "name": "Art des Kontos, Kontoinhaber, Kreditinstitut",
    "maxCharWidth": 77,
    "maxLines": 3
  },
  "groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten": {
    "name": "Größe, Anschrift/Grundbuchbezeichnung, Allein- oder Miteigentum, Zahl der Wohneinheiten",
    "maxCharWidth": 77,
    "maxLines": 3
  },
  "markeTypBaujahrAnschaffungsjahrAlleinoderMiteigentumKilometerstand": {
    "name": "Marke, Typ, Baujahr, Anschaffungsjahr, Allein- oder Miteigentum, Kilometerstand",
    "maxCharWidth": 77,
    "maxLines": 3
  },
  "bargeldbetraginEURBezeichnungderWertgegenstaendeAlleinoderMiteigentum": {
    "name": "Bargeldbetrag in EUR, Bezeichnung der Wertgegenstände, Allein- oder Miteigentum",
    "maxCharWidth": 77,
    "maxLines": 3
  },
  "versicherungVersicherungsnehmerDatumdesVertragesHandeltessichumeinezusaetzlicheAltersvorsorgegemEinkommensteuergesetzdiestaatlichgefoerdertwurdeRiesterRente": {
    "name": "Versicherung, Versicherungsnehmer, Datum des Vertrages/Handelt es sich um eine zusätzliche Altersvorsorge gem. Einkommensteuergesetz, die staatlich gefördert wurde („Riester-Rente“)?",
    "maxCharWidth": 77,
    "maxLines": 3
  },
  "bezeichnungAlleinoderMiteigentum": {
    "name": "Bezeichnung, Allein- oder Miteigentum",
    "maxCharWidth": 77,
    "maxLines": 3
  },
  "belegnummerI11": {
    "name": "Belegnummer I11",
    "maxCharWidth": 8,
    "maxLines": 3
  },
  "belegnummerI12": {
    "name": "Belegnummer I12",
    "maxCharWidth": 8,
    "maxLines": 3
  },
  "belegnummerI13": {
    "name": "Belegnummer I13",
    "maxCharWidth": 8,
    "maxLines": 3
  },
  "belegnummerI14": {
    "name": "Belegnummer I14",
    "maxCharWidth": 8,
    "maxLines": 3
  },
  "belegnummerI15": {
    "name": "Belegnummer I15",
    "maxCharWidth": 8,
    "maxLines": 3
  },
  "belegnummerI16": {
    "name": "Belegnummer I16",
    "maxCharWidth": 8,
    "maxLines": 3
  },
  "kontostand": {
    "name": "Kontostand",
    "maxCharWidth": 18,
    "maxLines": 2
  },
  "verkehrswert": {
    "name": "Verkehrswert",
    "maxCharWidth": 18,
    "maxLines": 3
  },
  "verkehrswert2": {
    "name": "Verkehrswert2",
    "maxCharWidth": 18,
    "maxLines": 2
  },
  "verkehrswert3": {
    "name": "Verkehrswert3",
    "maxCharWidth": 18,
    "maxLines": 2
  },
  "rueckkaufswert": {
    "name": "Rückkaufswert",
    "maxCharWidth": 18,
    "maxLines": 2
  },
  "gesamtgroessedesWohnraumsdenSiealleinodergemeinsammitanderenPersonenbewohnen": {
    "name": "Gesamtgröße des Wohnraums, den Sie allein oder gemeinsam mit anderen Personen bewohnen",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "belegnummerJ1": {
    "name": "Belegnummer J1",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "zahlderZimmer": {
    "name": "Zahl der Zimmer",
    "maxCharWidth": 24,
    "maxLines": 1
  },
  "personenanzahl": {
    "name": "Personenanzahl",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "belegnummerJ2": {
    "name": "Belegnummer J2",
    "maxCharWidth": 8,
    "maxLines": 1
  },
  "nutzenSiedenRaumalsMieteroderineinemaehnlichenNutzungsverhaeltnis": {
    "name": "Nutzen Sie den Raum als Mieter oder in einem ähnlichen Nutzungs-verhältnis?"
  },
  "mieteohneNebenkosten": {
    "name": "Miete ohne Nebenkosten",
    "maxCharWidth": 25,
    "maxLines": 1
  },
  "uebrigeNebenkosten": {
    "name": "Übrige Nebenkosten",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "belegnummerJ3": {
    "name": "Belegnummer J3",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "uebrigeNebenkosten2": {
    "name": "Übrige Nebenkosten2",
    "maxCharWidth": 22,
    "maxLines": 1
  },
  "ichalleinzahledavon2": {
    "name": "Ich allein zahle davon2",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "belegnummerJ4": {
    "name": "Belegnummer J4",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "genaueEinzelangabenzuderBelastungausFremdmittelnbeiNutzungalsMitEigentumerusw": {
    "name": "Genaue Einzelangaben zu der Belastung aus Fremdmitteln bei Nutzung als (Mit-)Eigentümer usw",
    "maxCharWidth": 74,
    "maxLines": 2
  },
  "genaueEinzelangabenzuderBelastungausFremdmittelnbeiNutzungalsMitEigentumerusw2": {
    "name": "Genaue Einzelangaben zu der Belastung aus Fremdmitteln bei Nutzung als (Mit-)Eigentümer usw2",
    "maxCharWidth": 74,
    "maxLines": 2
  },
  "belegnummerJ5": {
    "name": "Belegnummer J5",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerJ6": {
    "name": "Belegnummer J6",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerJ7": {
    "name": "Belegnummer J7",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerJ8": {
    "name": "Belegnummer J8",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerJ9": {
    "name": "Belegnummer J9",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerJ10": {
    "name": "Belegnummer J10",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "belegnummerJ11": {
    "name": "Belegnummer J11",
    "maxCharWidth": 8,
    "maxLines": 2
  },
  "restschuldinEuro": {
    "name": "Restschuld in Euro",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "monatlicheZinsenundTilgung": {
    "name": "Monatliche Zinsen und Tilgung",
    "maxCharWidth": 20,
    "maxLines": 1
  },
  "monatlicheZinsenundTilgung2": {
    "name": "Monatliche Zinsen und Tilgung2",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "restschuldinEuro2": {
    "name": "Restschuld in Euro2",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "sonstigeZahlungsverpflichtungen1": {
    "name": "Sonstige Zahlungsverpflichtungen1",
    "maxCharWidth": 50,
    "maxLines": 2
  },
  "sonstigeZahlungsverpflichtungen2": {
    "name": "Sonstige Zahlungsverpflichtungen2",
    "maxCharWidth": 50,
    "maxLines": 1
  },
  "sonstigeZahlungsverpflichtungen3": {
    "name": "Sonstige Zahlungsverpflichtungen3",
    "maxCharWidth": 50,
    "maxLines": 2
  },
  "monatlicheGesamtbelastung1": {
    "name": "Monatliche Gesamtbelastung1",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "monatlicheGesamtbelastung2": {
    "name": "Monatliche Gesamtbelastung2",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "monatlicheGesamtbelastung3": {
    "name": "Monatliche Gesamtbelastung3",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "ichalleinzahledavon3": {
    "name": "Ich allein zahle davon3",
    "maxCharWidth": 20,
    "maxLines": 1
  },
  "ichalleinzahledavon4": {
    "name": "Ich allein zahle davon4",
    "maxCharWidth": 20,
    "maxLines": 1
  },
  "ichalleinzahledavon5": {
    "name": "Ich allein zahle davon5",
    "maxCharWidth": 20,
    "maxLines": 1
  },
  "ichalleinzahledavon": {
    "name": "Ich allein zahle davon",
    "maxCharWidth": 21,
    "maxLines": 1
  },
  "ichalleinzahledavon6": {
    "name": "Ich allein zahle davon6",
    "maxCharWidth": 20,
    "maxLines": 1
  },
  "ichalleinzahledavon7": {
    "name": "Ich allein zahle davon7",
    "maxCharWidth": 20,
    "maxLines": 1
  },
  "besondereBelastungen": {
    "name": "Besondere Belastungen",
    "maxCharWidth": 96,
    "maxLines": 2
  },
  "besondereBelastungen2": {
    "name": "Besondere Belastungen2",
    "maxCharWidth": 95,
    "maxLines": 2
  },
  "ortundDatum": {
    "name": "Ort und Datum",
    "maxCharWidth": 35,
    "maxLines": 2
  },
  "verkehrswert4": {
    "name": "Verkehrswert4",
    "maxCharWidth": 17,
    "maxLines": 2
  },
  "hoehederKosten": {
    "name": "Höhe der Kosten",
    "maxCharWidth": 98,
    "maxLines": 1
  },
  "bezeichnungderVersicherung": {
    "name": "Bezeichnung der Versicherung",
    "maxCharWidth": 97,
    "maxLines": 2
  },
  "namedesUnterhaltspflichtingen": {
    "name": "Name des Unterhaltspflichtingen",
    "maxCharWidth": 97,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH1": {
    "name": "Monatliche BruttoeinnahmenH1",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH2": {
    "name": "Monatliche BruttoeinnahmenH2",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH3": {
    "name": "Monatliche BruttoeinnahmenH3",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH4": {
    "name": "Monatliche BruttoeinnahmenH4",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH5": {
    "name": "Monatliche BruttoeinnahmenH5",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH6": {
    "name": "Monatliche BruttoeinnahmenH6",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH7": {
    "name": "Monatliche BruttoeinnahmenH7",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH8": {
    "name": "Monatliche BruttoeinnahmenH8",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH9": {
    "name": "Monatliche BruttoeinnahmenH9",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH10": {
    "name": "Monatliche BruttoeinnahmenH10",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH11": {
    "name": "Monatliche BruttoeinnahmenH11",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "monatlicheBruttoeinnahmenH12": {
    "name": "Monatliche BruttoeinnahmenH12",
    "maxCharWidth": 11,
    "maxLines": 1
  },
  "bezeichnungOrtundGeschaeftsnummerdesGerichts": {
    "name": "Bezeichnung, Ort und Geschäftsnummer des Gerichts",
    "maxCharWidth": 63,
    "maxLines": 2
  },
  "neinichhabekeineAngehoerigendieIhnengegenubergesetzlichzurLeistungvonUnterhaltverpflichtetsind": {
    "name": "Nein, ich habe keine Angehörigen, die Ihnen gegenüber gesetzlich zur Leistung von Unterhalt verpflichtet sind"
  },
  "jaichhabeAngehoerigedieIhnengegenubergesetzlichzurLeistungvonUnterhaltverpflichtetsind": {
    "name": "Ja, ich habe Angehörige, die Ihnen gegenüber gesetzlich zur Leistung von Unterhalt verpflichtet sind"
  }
};
}

export type ProzesskostenhilfePDF = {
  "nameVornameggfGeburtsname": StringField;
  "berufErwerbstaetigkeit": StringField;
  "geburtsdatum": StringField;
  "anschriftStrasseHausnummerPostleitzahlWohnort": StringField;
  "sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon": StringField;
  "ja": BooleanField;
  "nein_3": BooleanField;
  "ja_2": BooleanField;
  "geburtsdatum1": StringField;
  "ja_4": BooleanField;
  "geburtsdatum2": StringField;
  "ja_5": BooleanField;
  "geburtsdatum3": StringField;
  "ja_6": BooleanField;
  "geburtsdatum4": StringField;
  "ja_7": BooleanField;
  "ja_8": BooleanField;
  "geburtsdatum5": StringField;
  "nein_10": BooleanField;
  "ja_9": BooleanField;
  "nein_11": BooleanField;
  "ja_10": BooleanField;
  "nein_12": BooleanField;
  "ja_11": BooleanField;
  "nein_13": BooleanField;
  "ja_12": BooleanField;
  "nein_14": BooleanField;
  "ja_13": BooleanField;
  "nein_15": BooleanField;
  "ja_14": BooleanField;
  "nein_16": BooleanField;
  "ja_15": BooleanField;
  "nein_17": BooleanField;
  "ja_16": BooleanField;
  "nein_18": BooleanField;
  "ja_17": BooleanField;
  "nein_19": BooleanField;
  "ja_18": BooleanField;
  "nein_20": BooleanField;
  "ja_19": BooleanField;
  "nein_21": BooleanField;
  "ja_20": BooleanField;
  "nein_22": BooleanField;
  "undefined_8": BooleanField;
  "nein_23": BooleanField;
  "ja_22": BooleanField;
  "nein_24": BooleanField;
  "ja_23": BooleanField;
  "nein_25": BooleanField;
  "ja_24": BooleanField;
  "nein_26": BooleanField;
  "ja_25": BooleanField;
  "nein_27": BooleanField;
  "ja_26": BooleanField;
  "nein_28": BooleanField;
  "ja_27": BooleanField;
  "nein_29": BooleanField;
  "ja_28": BooleanField;
  "nein_30": BooleanField;
  "ja_29": BooleanField;
  "nein_31": BooleanField;
  "ja_30": BooleanField;
  "nein_32": BooleanField;
  "ja_31": BooleanField;
  "nein_33": BooleanField;
  "ja_32": BooleanField;
  "nein_34": BooleanField;
  "ja_33": BooleanField;
  "nein_35": BooleanField;
  "ja_35": BooleanField;
  "steuernSolidaritaetszuschlag_2": StringField;
  "sozialversicherungsbeitraege_2": StringField;
  "sonstigeVersicherungen": StringField;
  "nein_37": BooleanField;
  "ja_36": BooleanField;
  "nein_39": BooleanField;
  "ja_37": BooleanField;
  "nein_41": BooleanField;
  "ja_38": BooleanField;
  "nein_43": BooleanField;
  "ja_39": BooleanField;
  "nein_44": BooleanField;
  "ja_40": BooleanField;
  "nein_46": BooleanField;
  "ja_41": BooleanField;
  "undefined_10": BooleanField;
  "heizungskosten": StringField;
  "gesamtbetrag": StringField;
  "undefined_11": BooleanField;
  "undefined_12": BooleanField;
  "zinsenundTilgung": StringField;
  "heizungskosten_2": StringField;
  "gesamtbetrag_2": StringField;
  "restschuldinEUR": StringField;
  "restschuldinEUR_2": StringField;
  "restschuldinEUR_3": StringField;
  "anzahlderbeigefuegtenBelege": StringField;
  "aufgenommenUnterschriftAmtsbezeichnung": StringField;
  "text2": StringField;
  "text3": StringField;
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro": StringField;
  "1Nein": BooleanField;
  "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1": StringField;
  "belegnummerB1": StringField;
  "belegnummerB2": StringField;
  "belegnummerC": StringField;
  "angehoerigerNummereins": StringField;
  "angehoerigerNummerzwei": StringField;
  "angehoerigerNummerdrei": StringField;
  "angehoerigerNummervier": StringField;
  "angehoerigerNummerfuenf": StringField;
  "verhaeltnis1": StringField;
  "verhaeltnis2": StringField;
  "verhaeltnis3": StringField;
  "verhaeltnis4": StringField;
  "verhaeltnis5": StringField;
  "monatsbetrag3": StringField;
  "monatsbetrag4": StringField;
  "monatsbetrag5": StringField;
  "eigeneEinnahmen1": BooleanField;
  "monatsbetrag1": StringField;
  "monatsbetrag2": StringField;
  "eigeneEinnahmen2": BooleanField;
  "eigeneEinnahmen3": BooleanField;
  "eigeneEinnahmen4": BooleanField;
  "eigeneEinnahmen5": BooleanField;
  "betrag_1": StringField;
  "betrag_2": StringField;
  "betrag_3": StringField;
  "betrag_4": StringField;
  "betrag_5": StringField;
  "belegnummerH1": StringField;
  "belegnummerH2": StringField;
  "belegnummerH3": StringField;
  "belegnummerH4": StringField;
  "belegnummerH5": StringField;
  "belegnummerH6": StringField;
  "belegnummerH7": StringField;
  "belegnummerH8": StringField;
  "belegnummerH9": StringField;
  "belegnummerH10": StringField;
  "belegnummerH11": StringField;
  "belegnummerH12": StringField;
  "belegnummerH13": StringField;
  "belegnummerH14": StringField;
  "belegnummerH16": StringField;
  "belegnummerH17": StringField;
  "belegnummerH18": StringField;
  "belegnummerH19": StringField;
  "belegnummerH20": StringField;
  "belegnummer21": StringField;
  "belegnummerH22": StringField;
  "belegnummerH23": StringField;
  "belegnummerH24": StringField;
  "belegnummerH25": StringField;
  "belegnummerH26": StringField;
  "belegnummerH28": StringField;
  "belegnummerH30": StringField;
  "belegnummerH31": StringField;
  "belegnummerC1": StringField;
  "belegnummerC2": StringField;
  "belegnummerC3": StringField;
  "belegnummerC4": StringField;
  "belegnummerC5": StringField;
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro8": StringField;
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro9": StringField;
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro10": StringField;
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro11": StringField;
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro12": StringField;
  "monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro13": StringField;
  "2HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow2": StringField;
  "euroBrutto2": StringField;
  "monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3": StringField;
  "monatlicheBruttoeinnahmendurchWohngeldinEuro7": StringField;
  "monatlicheBruttoeinnahmendurchKindergeldIKinderzuschlaginEuro6": StringField;
  "monatlicheBruttoeinnahmendurchKapitalvermoegeninEuro5": StringField;
  "monatlicheBruttoeinnahmendurchVermietungoderVerpachtunginEuro4": StringField;
  "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben": StringField;
  "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben2": StringField;
  "euroBrutto3": StringField;
  "euroBrutto": StringField;
  "euroBrutto4": StringField;
  "steuernSolidaritaetszuschlag1": StringField;
  "belegnummerI1": StringField;
  "belegnummerI2": StringField;
  "belegnummerI3": StringField;
  "belegnummerI4": StringField;
  "belegnummerI5": StringField;
  "belegnummerI6": StringField;
  "belegnummerI7": StringField;
  "belegnummerI8": StringField;
  "belegnummerI9": StringField;
  "belegnummerI10": StringField;
  "sozialversicherungsbeitraege1": StringField;
  "monatlicheAbzuegeinEuro1": StringField;
  "monatlicheAbzuegeinEuro2": StringField;
  "monatlicheAbzuegeinEuro3": StringField;
  "monatlicheAbzuegeinEuro4": StringField;
  "sozialversicherungsbeitraegeEhegatte": StringField;
  "steuernSolidaritaetszuschlag2": StringField;
  "sonstigeVersicherungenEhegatte": StringField;
  "fahrtkostenEhegatte": StringField;
  "sonstigewerbungskostenEhegatte": StringField;
  "monatlicheAbzuegeinEuro5": StringField;
  "monatlicheAbzuegeinEuro6": StringField;
  "monatlicheAbzuegeinEuro7": StringField;
  "monatlicheAbzuegeinEuro8": StringField;
  "monatlicheAbzuegeinEuro9": StringField;
  "monatlicheAbzuegeinEuro10": StringField;
  "artdesKontosKontoinhaberKreditinstitut": StringField;
  "groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten": StringField;
  "markeTypBaujahrAnschaffungsjahrAlleinoderMiteigentumKilometerstand": StringField;
  "bargeldbetraginEURBezeichnungderWertgegenstaendeAlleinoderMiteigentum": StringField;
  "versicherungVersicherungsnehmerDatumdesVertragesHandeltessichumeinezusaetzlicheAltersvorsorgegemEinkommensteuergesetzdiestaatlichgefoerdertwurdeRiesterRente": StringField;
  "bezeichnungAlleinoderMiteigentum": StringField;
  "belegnummerI11": StringField;
  "belegnummerI12": StringField;
  "belegnummerI13": StringField;
  "belegnummerI14": StringField;
  "belegnummerI15": StringField;
  "belegnummerI16": StringField;
  "kontostand": StringField;
  "verkehrswert": StringField;
  "verkehrswert2": StringField;
  "verkehrswert3": StringField;
  "rueckkaufswert": StringField;
  "gesamtgroessedesWohnraumsdenSiealleinodergemeinsammitanderenPersonenbewohnen": StringField;
  "belegnummerJ1": StringField;
  "zahlderZimmer": StringField;
  "personenanzahl": StringField;
  "belegnummerJ2": StringField;
  "nutzenSiedenRaumalsMieteroderineinemaehnlichenNutzungsverhaeltnis": BooleanField;
  "mieteohneNebenkosten": StringField;
  "uebrigeNebenkosten": StringField;
  "belegnummerJ3": StringField;
  "uebrigeNebenkosten2": StringField;
  "ichalleinzahledavon2": StringField;
  "belegnummerJ4": StringField;
  "genaueEinzelangabenzuderBelastungausFremdmittelnbeiNutzungalsMitEigentumerusw": StringField;
  "genaueEinzelangabenzuderBelastungausFremdmittelnbeiNutzungalsMitEigentumerusw2": StringField;
  "belegnummerJ5": StringField;
  "belegnummerJ6": StringField;
  "belegnummerJ7": StringField;
  "belegnummerJ8": StringField;
  "belegnummerJ9": StringField;
  "belegnummerJ10": StringField;
  "belegnummerJ11": StringField;
  "restschuldinEuro": StringField;
  "monatlicheZinsenundTilgung": StringField;
  "monatlicheZinsenundTilgung2": StringField;
  "restschuldinEuro2": StringField;
  "sonstigeZahlungsverpflichtungen1": StringField;
  "sonstigeZahlungsverpflichtungen2": StringField;
  "sonstigeZahlungsverpflichtungen3": StringField;
  "monatlicheGesamtbelastung1": StringField;
  "monatlicheGesamtbelastung2": StringField;
  "monatlicheGesamtbelastung3": StringField;
  "ichalleinzahledavon3": StringField;
  "ichalleinzahledavon4": StringField;
  "ichalleinzahledavon5": StringField;
  "ichalleinzahledavon": StringField;
  "ichalleinzahledavon6": StringField;
  "ichalleinzahledavon7": StringField;
  "besondereBelastungen": StringField;
  "besondereBelastungen2": StringField;
  "ortundDatum": StringField;
  "verkehrswert4": StringField;
  "hoehederKosten": StringField;
  "bezeichnungderVersicherung": StringField;
  "namedesUnterhaltspflichtingen": StringField;
  "monatlicheBruttoeinnahmenH1": StringField;
  "monatlicheBruttoeinnahmenH2": StringField;
  "monatlicheBruttoeinnahmenH3": StringField;
  "monatlicheBruttoeinnahmenH4": StringField;
  "monatlicheBruttoeinnahmenH5": StringField;
  "monatlicheBruttoeinnahmenH6": StringField;
  "monatlicheBruttoeinnahmenH7": StringField;
  "monatlicheBruttoeinnahmenH8": StringField;
  "monatlicheBruttoeinnahmenH9": StringField;
  "monatlicheBruttoeinnahmenH10": StringField;
  "monatlicheBruttoeinnahmenH11": StringField;
  "monatlicheBruttoeinnahmenH12": StringField;
  "bezeichnungOrtundGeschaeftsnummerdesGerichts": StringField;
  "neinichhabekeineAngehoerigendieIhnengegenubergesetzlichzurLeistungvonUnterhaltverpflichtetsind": BooleanField;
  "jaichhabeAngehoerigedieIhnengegenubergesetzlichzurLeistungvonUnterhaltverpflichtetsind": BooleanField;
};
