export type Jmtd14VTErwerberPlzortk = {
  ANGELEGENHEIT_INFO: string;
  GERBEH_AG: string;
  GERBEH_LG: string;
  GERBEH_LKZ: string;
  GERBEH_OLG: string;
  GERBEH_STAMM?: string;
  GERBEH_TYP_INFO: TypInfo;
  ORT: string;
  ORTK: string;
  PLZ: string;
  PLZM_INFO: "Zustellbezirk";
};

export type TypInfo =
  | "Ambulante soziale Dienste der Justiz"
  | "Arbeitsgericht"
  | "Finanzgericht"
  | "Führungsaufsichtsstelle"
  | "Grundbuchamt"
  | "Handels-/ Genossenschaftsregister"
  | "Insolvenzgericht"
  | "Justizvollzugsanstalt"
  | "Mahngericht"
  | "Ministerium"
  | "Nachlassgericht"
  | "Partnerschaftsregister"
  | "Schiffsregister"
  | "Sonstige Justizbehörde"
  | "Sozialgericht"
  | "Staatsanwaltschaft"
  | "Vereinsregister"
  | "Verfassungsgericht"
  | "Verwaltungsgericht"
  | "Zentrales Vollstreckungsgericht"
  | "Zivilgericht - Amtsgericht"
  | "Zivilgericht - Bund"
  | "Zivilgericht - Bundesland"
  | "Zivilgericht - Landgericht"
  | "Zivilgericht - Oberlandesgericht"
  | "ZVG Gericht";

export type Jmtd14VTErwerberGerbeh = {
  AG: string;
  AUT_MAHN_VERF_MERKMAL_INFO?: string;
  BEZEICHNUNG: string;
  EMAIL1?: string;
  EMAIL2?: string;
  ERV_FAMILIE?: JaNeinShort;
  ERV_FG?: JaNeinShort;
  ERV_GRUNDBUCH?: JaNeinShort;
  ERV_MAHN?: JaNeinShort;
  ERV_STRAF?: ErvStraf;
  ERV_ZIVIL?: JaNeinShort;
  FAX?: string;
  KAMMER_FUER_HANDELSSACH?: JaNeinLong;
  LG: string;
  LKZ: string;
  OLG: string;
  ORT: string;
  ORTK: string;
  PLZ_GROSSEMPFAENGER?: string;
  PLZ_POSTFACH?: string;
  PLZ_ZUSTELLBEZIRK: string;
  POSTFACH?: string;
  STAMM?: string;
  STR_HNR: string;
  TEL?: string;
  TYP_INFO: TypInfo;
  URL1?: string;
  URL2?: string;
  XJUSTIZID?: string;
  XML_SUPPORT: JaNeinLong;
};

type JaNeinShort = "J" | "N";
type ErvStraf = "S" | JaNeinShort;
type JaNeinLong = "JA" | "NEIN";

export type Jmtd14VTErwerberPlzstrn = {
  AG: string;
  ANGELEGENHEIT_INFO: string;
  HNR_BIS: string;
  HNR_MERKMAL_INFO: HnrMerkmalInfo;
  HNR_VON: string;
  LG: string;
  LKZ: string;
  OLG: string;
  ORTK: string;
  PLZ: string;
  STRN: string;
  TYP_INFO: TypInfo;
};

type HnrMerkmalInfo =
  | "fortlaufende Hausnummern"
  | "ungerade Hausnummern"
  | "gerade Hausnummern";
