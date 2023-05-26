export interface Jmtd14VTErwerberPlzortk {
  ORT: string;
  GERBEH_LKZ: string;
  GERBEH_LG: string;
  PLZM_INFO: "Zustellbezirk";
  GERBEH_OLG: string;
  GERBEH_TYP_INFO: TypInfo;
  ANGELEGENHEIT_INFO: string;
  GERBEH_STAMM?: string;
  GERBEH_AG: string;
  PLZ: string;
  ORTK: string;
}

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

export interface Jmtd14VTErwerberGerbeh {
  PLZ_GROSSEMPFAENGER?: string;
  XJUSTIZID?: string;
  URL1?: string;
  AG: string;
  PLZ_ZUSTELLBEZIRK: string;
  OLG: string;
  TYP_INFO: TypInfo;
  EMAIL1?: string;
  ORT: string;
  STR_HNR: string;
  XML_SUPPORT: KammerFuerHandelssach;
  BEZEICHNUNG: string;
  LKZ: string;
  TEL?: string;
  LG: string;
  FAX?: string;
  ORTK: string;
  ERV_MAHN?: Erv;
  PLZ_POSTFACH?: string;
  POSTFACH?: string;
  ERV_ZIVIL?: Erv;
  ERV_FAMILIE?: Erv;
  AUT_MAHN_VERF_MERKMAL_INFO?: string;
  KAMMER_FUER_HANDELSSACH?: KammerFuerHandelssach;
  ERV_STRAF?: ErvStraf;
  ERV_GRUNDBUCH?: Erv;
  ERV_FG?: Erv;
  EMAIL2?: string;
  STAMM?: string;
  URL2?: string;
}

export type Erv = "J" | "N";
export type ErvStraf = "S" | "J";
export type KammerFuerHandelssach = "JA" | "NEIN";

export interface Jmtd14VTErwerberPlzstrn {
  HNR_BIS: string;
  HNR_MERKMAL_INFO: HnrMerkmalInfo;
  AG: string;
  HNR_VON: string;
  ANGELEGENHEIT_INFO: string;
  STRN: string;
  LKZ: string;
  OLG: string;
  LG: string;
  TYP_INFO: TypInfo;
  PLZ: string;
  ORTK: string;
}

export type HnrMerkmalInfo =
  | "fortlaufende Hausnummern"
  | "ungerade Hausnummern"
  | "gerade Hausnummern";
