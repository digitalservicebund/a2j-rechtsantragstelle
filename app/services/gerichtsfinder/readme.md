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
    }
  ]
}
```

</details>

### PLZ_NEU

- Beschreibung: Liste von Orten deren PLZ sich geändert hat
- Items: 3063

<details>
<summary>Data example JMTD14_VT_ERWERBER_PLZNEU_DATA_TABLE.json (458 kb):</summary>

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
<summary>Data example JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json (20.7 mb):</summary>

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
