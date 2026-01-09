# Gerichtsfinder Service

## Quickstart

## How to update

- Copy the `.zip` file to the root of the project
- Run `pnpm run update:courtData <NAME_OF_THE_ZIP>`
- Run `pnpm run update:URLs`
- Discard/remove your `.zip` file before commiting!

## Data Exploration

`UpdateR2510.zip`:

```
.
├── TD14-Erwerber-Dokumentation-V2.pdf
├── TD14-Erwerber-Technik-V2.pdf
├── Thumbs.db
└── Version2
    ├── DDL
    ├── INSERT-Format
    ├── JSON-Format
    └── SQL-LOADER-Format
```

### Formate

1. SQL INSERT
2. JSON
3. Oracle Loader Format

## Tabellen

### PLZORTK

- Beschreibung: Mapping aller PLZ -> zuständigen Justizbehörden
- Items: 982406

<details>
<summary>Data example JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json (241.4 mb):</summary>

```json
{
  "JMTD14_VT_ERWERBER_PLZORTK": [
    {
      "ORT": "Dresden",
      "GERBEH_LKZ": "22",
      "GERBEH_LG": "03",
      "PLZM_INFO": "Zustellbezirk",
      "GERBEH_OLG": "1",
      "GERBEH_TYP_INFO": "Zivilgericht - Amtsgericht",
      "ANGELEGENHEIT_INFO": "Anweisung des Standesamts zur Vornahme einer Amtshandlung",
      "GERBEH_STAMM": "00",
      "GERBEH_AG": "02",
      "PLZ": "01067",
      "ORTK": "DRESDEN"
    },
    {
      "ORT": "Dresden",
      "GERBEH_LKZ": "22",
      "GERBEH_LG": "03",
      "PLZM_INFO": "Zustellbezirk",
      "GERBEH_OLG": "1",
      "GERBEH_TYP_INFO": "Zivilgericht - Amtsgericht",
      "ANGELEGENHEIT_INFO": "Änderung des Vornamens und Feststellung der Geschlechtszugehörigkeit nach dem Transsexuellengesetz",
      "GERBEH_STAMM": "00",
      "GERBEH_AG": "02",
      "PLZ": "01067",
      "ORTK": "DRESDEN"
    }
  ]
}
```

</details>

### GERBEH

- Beschreibung: Postalische Infos zu Justizbehörden (inkl ob sie am elektronischem Rechtsverkehr teilnehmen)
- Items: 3002

<details>
<summary>Data Example JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json (1.4 mb):</summary>

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
    },
    {
      "XJUSTIZID": "D6263",
      "URL1": "www.bundesfinanzhof.de",
      "AG": "00",
      "PLZ_ZUSTELLBEZIRK": "81675",
      "OLG": "0",
      "TYP_INFO": "Finanzgericht",
      "PLZ_POSTFACH": "81629",
      "POSTFACH": "86 02 40",
      "EMAIL1": "bundesfinanzhof@bfh.bund.de",
      "ORT": "München",
      "STR_HNR": "Ismaninger Straße 109",
      "XML_SUPPORT": "NEIN",
      "BEZEICHNUNG": "Bundesfinanzhof",
      "LKZ": "00",
      "TEL": "089 9231-0",
      "LG": "00",
      "FAX": "089 9231-201",
      "ORTK": "MUENCHEN",
      "ERV_MAHN": "J"
    }
  ]
}
```

</details>

### PLZ_NEU

- Beschreibung: Liste von Orten deren PLZ sich geändert hat
- Items: 2646

<details>
<summary>Data example JMTD14_VT_ERWERBER_PLZNEU_DATA_TABLE.json (458 kb):</summary>

```json
{
  "JMTD14_VT_ERWERBER_PLZNEU": [
    {
      "GRUND_INFO": "PLZ/ORTK hat eine neue PLZ oder eine neue Ortsbezeichnung",
      "PLZ_ALT": "01465",
      "ORTK_ALT": "LANGEBRUECK",
      "PLZ": "01465",
      "ORTK": "DRESDEN"
    },
    {
      "GRUND_INFO": "PLZ/ORTK hat eine neue PLZ oder eine neue Ortsbezeichnung",
      "PLZ_ALT": "01465",
      "ORTK_ALT": "SCHOENBORN",
      "PLZ": "01465",
      "ORTK": "DRESDEN"
    }
  ]
}
```

</details>

### PLZSTRN

- Beschreibung: Spezialzuordnung für Straßen, bei denen unterschiedliche Zuständigkeiten gelten (zB Hausnummern oder Straßenseiten)
- Items: 83284

<details>
<summary>Data example JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json (20.7 mb):</summary>

```json
{
  "JMTD14_VT_ERWERBER_PLZSTRN": [
    {
      "HNR_BIS": "001",
      "HNR_MERKMAL_INFO": "fortlaufende Hausnummern",
      "AG": "09",
      "HNR_VON": "001",
      "ANGELEGENHEIT_INFO": "SMALL-CLAIMS Allgemein",
      "STRN": "LICHTENBERGER STR.",
      "LKZ": "11",
      "OLG": "1",
      "LG": "01",
      "TYP_INFO": "Zivilgericht - Amtsgericht",
      "PLZ": "10178",
      "ORTK": "BERLIN"
    },
    {
      "HNR_BIS": "001",
      "HNR_MERKMAL_INFO": "fortlaufende Hausnummern",
      "AG": "09",
      "HNR_VON": "001",
      "ANGELEGENHEIT_INFO": "Zustellersuchen eingehend",
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
