# Gerichtsfinder Service

## Quickstart

Die Gerichtsdaten müssen erst konvertiert werden, siehe shell script `convert_sql_data.sh`.
Dieses list die gegebene .zip datei ein und schreibt postgres-kompatible .sql Dateien nach `./pg_init`.
Diese werden zum Befüllen der postgres Datenbank benutzt (Hinweis: Der erste Start dauert ca 2-3 Minuten)

Beispiel:

```shell
./convert_sql_data.sh path/to/Updates.zip
docker compose up
```

pgadmin interface: `http://localhost:15433/browser/`

## Data Exploration

`UpdateR2305.zip`:

```
- Information zu Version2.pdf
- TD14-Erwerber-Dokumentation-V2.pdf
- TD14-Erwerber-Technik-V2.pdf
- JMTD14.20230427-200002.Create_All.log
- Ordner: DDL
- Ordner: INSERT-Format
- Ordner: JSON-Format
- Ordner: SQL-LOADER-Format
```

### Formate

1. SQL INSERT
2. JSON
3. Oracle Loader Format

### Einspielen in SQL DB

Jeder Schritt ist für alle 4 Tabelle (`PLZORTK`, `GERBEH`, `PLZSTRN`, `PLZNEU`) zu wiederholen. Für jeden Schritt gibt es bereits im Order `DDL/` bereitgestellte Skripte:

1. Erstellung der Tabelle (`CREATE TABLE`): `JMTD14_VT_ERWERBER_{TABELLE}.sql`
2. Laden der Daten (`INSERT`): `JMTD14_VT_ERWERBER_{TABELLE}_DATA_TABLE.sql`
3. Optional: Laden der Indizes (`CREATE UNIQUE INDEX`): `JMTD14_VT_ERWERBER_{TABELLE}_PK.sql`
4. Optional: Laden der Constraints (`ALTER TABLE`): `JMTD14_VT_ERWERBER_{TABELLE}_CONSTRAINT.sql`

### Converting to postgres

`npm run main`

1.  replace VARCHAR2(400 CHAR) -> VARCHAR(400)

## Tabellen

### PLZORTK

- Beschreibung: Mapping aller PLZ -> zuständigen Justizbehörden
- Items: 943380

<details>
<summary>JSON Layout JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json (241.4 mb)</summary>

```typescript
export interface Jmtd14VTErwerberPlzortk {
  ORT: string;
  GERBEH_LKZ: string;
  GERBEH_LG: string;
  PLZM_INFO: "Zustellbezirk";
  GERBEH_OLG: GerbehOlg;
  GERBEH_TYP_INFO: GerbehTypInfo;
  ANGELEGENHEIT_INFO: string;
  GERBEH_STAMM?: GerbehStamm;
  GERBEH_AG: string;
  PLZ: string;
  ORTK: string;
}

export type GerbehTypInfo =
  | "Staatsanwaltschaft"
  | "Mahngericht"
  | "Insolvenzgericht"
  | "Zivilgericht - Amtsgericht"
  | "Zivilgericht - Landgericht"
  | "Verfassungsgericht"
  | "Verwaltungsgericht"
  | "Finanzgericht"
  | "Arbeitsgericht"
  | "Sozialgericht"
  | "Handels-/ Genossenschaftsregister"
  | "Vereinsregister"
  | "Zentrales Vollstreckungsgericht"
  | "Partnerschaftsregister"
  | "ZVG Gericht"
  | "Grundbuchamt"
  | "Zivilgericht - Oberlandesgericht"
  | "Zivilgericht - Bund"
  | "Ministerium"
  | "Sonstige Justizbehörde";

export type GerbehOlg = "00" | "01" | "02" | "03";
export type GerbehStamm =
  | "00"
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10";
```

</details>

<details>
<summary>Data example</summary>

```json
{
  "JMTD14_VT_ERWERBER_PLZORTK": [
    {
      "ORT": "Dresden",
      "GERBEH_LKZ": "22",
      "GERBEH_LG": "03",
      "PLZM_INFO": "Zustellbezirk",
      "GERBEH_OLG": "1",
      "GERBEH_TYP_INFO": "Staatsanwaltschaft",
      "ANGELEGENHEIT_INFO": "Angelegenheiten der Staatsanwaltschaften",
      "GERBEH_STAMM": "00",
      "GERBEH_AG": "00",
      "PLZ": "01067",
      "ORTK": "DRESDEN"
    },
    {
      "ORT": "Dresden",
      "GERBEH_LKZ": "23",
      "GERBEH_LG": "03",
      "PLZM_INFO": "Zustellbezirk",
      "GERBEH_OLG": "1",
      "GERBEH_TYP_INFO": "Mahngericht",
      "ANGELEGENHEIT_INFO": "Mahnverfahren",
      "GERBEH_STAMM": "00",
      "GERBEH_AG": "90",
      "PLZ": "01067",
      "ORTK": "DRESDEN"
    }
  ]
}
```

</details>

### GERBEH

- Beschreibung: Postalische Infos zu Justizbehörden (inkl ob sie am elektronischem Rechtsverkehr teilnehmen)
- Items: 2896

<details>
<summary>JSON Layout JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json (1.4 mb)</summary>

```typescript
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
  URL2?: Url2;
}

export type Erv = "J" | "N";
export type ErvStraf = "S" | "J";
export type KammerFuerHandelssach = "NEIN" | "JA";
export type TypInfo =
  | "Arbeitsgericht"
  | "Finanzgericht"
  | "Ministerium"
  | "Sonstige Justizbehörde"
  | "Sozialgericht"
  | "Staatsanwaltschaft"
  | "Verfassungsgericht"
  | "Verwaltungsgericht"
  | "Zivilgericht - Bund"
  | "Justizvollzugsanstalt"
  | "Zivilgericht - Oberlandesgericht"
  | "Führungsaufsichtsstelle"
  | "Zivilgericht - Landgericht"
  | "Handels-/ Genossenschaftsregister"
  | "Insolvenzgericht"
  | "Vereinsregister"
  | "Zivilgericht - Amtsgericht"
  | "ZVG Gericht"
  | "Zentrales Vollstreckungsgericht"
  | "Mahngericht"
  | "Grundbuchamt"
  | "Nachlassgericht"
  | "Partnerschaftsregister"
  | "Schiffsregister"
  | "Ambulante soziale Dienste der Justiz"
  | "Zivilgericht - Bundesland";

export type Url2 =
  | "www.justiz.bayern.de"
  | "www.justiz-bayern.de"
  | "www.berlin.de/sen/justiz"
  | "www.lsg.berlin.brandenburg.de"
  | "www.berlin.de/sen/justiz/"
  | "www.sg-cottbus.brandenburg.de"
  | "www.sg-frankfurt-oder.brandenburg.de"
  | "www.sg-neuruppin.brandenburg.de";
```

</details>

<details>
<summary>Data Example</summary>

```json
{
  "JMTD14_VT_ERWERBER_GERBEH": [
    {
      "PLZ_GROSSEMPFAENGER": "99113",
      "XJUSTIZID": "Y6010",
      "URL1": "www.bundesarbeitsgericht.de",
      "AG": "00",
      "PLZ_ZUSTELLBEZIRK": "99084",
      "OLG": "0",
      "TYP_INFO": "Arbeitsgericht",
      "EMAIL1": "bag@bundesarbeitsgericht.de",
      "ORT": "Erfurt",
      "STR_HNR": "Hugo-Preuß-Platz 1",
      "XML_SUPPORT": "NEIN",
      "BEZEICHNUNG": "Bundesarbeitsgericht",
      "LKZ": "00",
      "TEL": "0361 2636-0",
      "LG": "00",
      "FAX": "0361 2636-2000",
      "ORTK": "ERFURT",
      "ERV_MAHN": "J"
    }
  ]
}
```

</details>

### PLZ_NEU

- Beschreibung: Liste von Orten deren PLZ sich geändert hat
- Items: 3063

<details>
<summary>JSON Layout JMTD14_VT_ERWERBER_PLZNEU_DATA_TABLE.json (458 kb):</summary>

```typescript
export type GrundInfo =
  | "PLZ/ORTK hat eine neue PLZ oder eine neue Ortsbezeichnung"
  | "Die richtige Schreibweise für diese PLZ/ORTK";

export interface Jmtd14VTErwerberPlzneu {
  GRUND_INFO: GrundInfo;
  PLZ_ALT: string;
  ORTK_ALT: string;
  PLZ: string;
  ORTK: string;
}
```

</details>

<details>
<summary>Data example</summary>

```json
{
  "JMTD14_VT_ERWERBER_PLZSTRN": [
    {
      "HNR_BIS": "001",
      "HNR_MERKMAL_INFO": "fortlaufende Hausnummern",
      "AG": "07",
      "HNR_VON": "001",
      "ANGELEGENHEIT_INFO": "Beweisaufnahme ersuchtes Gericht",
      "STRN": "LICHTENBERGER STR.",
      "LKZ": "11",
      "OLG": "1",
      "LG": "01",
      "TYP_INFO": "Zivilgericht - Amtsgericht",
      "PLZ": "10178",
      "ORTK": "BERLIN"
    }
  ]
}
```

</details>

### PLZSTRN

- Beschreibung: Spezialzuordnung für Straßen, bei denen unterschiedliche Zuständigkeiten gelten (zB Hausnummern oder Straßenseiten)
- Items: 78738
- Unique PLZs: 93

<details>
<summary>JSON Layout JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json (20.7 mb):</summary>

```typescript
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
  ORTK: Ortk;
}

export type HnrMerkmalInfo =
  | "fortlaufende Hausnummern"
  | "ungerade Hausnummern"
  | "gerade Hausnummern";

export type Ortk =
  | "BERLIN"
  | "FREIENWALDE"
  | "HAMBURG"
  | "HAMFELDE"
  | "KOETHEL"
  | "BREMEN"
  | "WUPPERTAL"
  | "ESSEN"
  | "DUISBURG"
  | "IGELSBACH"
  | "STUTTGART"
  | "REUTLINGEN";

export type TypInfo =
  | "Zivilgericht - Amtsgericht"
  | "Finanzgericht"
  | "Verwaltungsgericht"
  | "Handels-/ Genossenschaftsregister"
  | "Insolvenzgericht"
  | "Zivilgericht - Landgericht"
  | "Mahngericht"
  | "Partnerschaftsregister"
  | "Sozialgericht"
  | "Staatsanwaltschaft"
  | "Vereinsregister"
  | "Verfassungsgericht"
  | "Zentrales Vollstreckungsgericht"
  | "ZVG Gericht"
  | "Arbeitsgericht"
  | "Zivilgericht - Oberlandesgericht"
  | "Zivilgericht - Bund"
  | "Ministerium"
  | "Sonstige Justizbehörde"
  | "Grundbuchamt"
  | "Nachlassgericht";
```

</details>

<details>
<summary>Data example</summary>

```json
{
  "JMTD14_VT_ERWERBER_PLZSTRN": [
    {
      "HNR_BIS": "001",
      "HNR_MERKMAL_INFO": "fortlaufende Hausnummern",
      "AG": "07",
      "HNR_VON": "001",
      "ANGELEGENHEIT_INFO": "Beweisaufnahme ersuchtes Gericht",
      "STRN": "LICHTENBERGER STR.",
      "LKZ": "11",
      "OLG": "1",
      "LG": "01",
      "TYP_INFO": "Zivilgericht - Amtsgericht",
      "PLZ": "10178",
      "ORTK": "BERLIN"
    }
  ]
}
```

</details>
