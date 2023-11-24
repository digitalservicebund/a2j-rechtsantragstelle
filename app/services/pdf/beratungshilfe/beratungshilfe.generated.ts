// To parse this data:
//
//   import { Convert, BeratungshilfePDF } from "./file";
//
//   const beratungshilfePDF = Convert.toBeratungshilfePDF(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface BeratungshilfePDF {
  anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers?: StringField;
  antragstellerNameVornameggfGeburtsname?: StringField;
  b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen?: BooleanField;
  b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden?: BooleanField;
  b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt?: BooleanField;
  beratungsperson?: StringField;
  berufErwerbstaetigkeit?: StringField;
  bew?: BooleanField;
  bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein?: BooleanField;
  c1Einkuenftebrutto?: StringField;
  c2Einkuenftenetto?: StringField;
  c3EinkuenftePartner?: BooleanField;
  c4EinkuenftePartnernetto?: StringField;
  d1Wohnung?: StringField;
  d2Wohnkosten?: StringField;
  d3Teilwohnkosten?: StringField;
  d4Wohnungalleine?: BooleanField;
  d5Wohnunggemeinsam?: BooleanField;
  d6WonungweiterePersonen?: StringField;
  datumBeratung?: StringField;
  e1Person1?: StringField;
  e1Person2?: StringField;
  e1Person3?: StringField;
  e1Person4?: StringField;
  e2?: BooleanField;
  e2Geburtsdatum?: StringField;
  e2Geburtsdatum2?: StringField;
  e2Geburtsdatum3?: StringField;
  e2Geburtsdatum4?: StringField;
  e3Familienverhaeltnis?: StringField;
  e3Familienverhaeltnis2?: StringField;
  e3Familienverhaeltnis3?: StringField;
  e3Familienverhaeltnis4?: StringField;
  e4Zahlung1?: StringField;
  e4Zahlung2?: StringField;
  e4Zahlung3?: StringField;
  e4Zahlung4?: StringField;
  e5Einnahmen1?: BooleanField;
  e5Einnahmen2?: BooleanField;
  e5Einnahmen3?: BooleanField;
  e5Einnahmen4?: BooleanField;
  e6Betrag1?: StringField;
  e6Betrag2?: StringField;
  e6Betrag3?: StringField;
  e6Betrag4?: StringField;
  f10KraftfahrzeugB?: BooleanField;
  f10KraftfahrzeugC?: BooleanField;
  f10KraftfahrzeugeA?: BooleanField;
  f11Fahrzeugart?: StringField;
  f12Verkehrswert?: StringField;
  f13Vermoegenswerte1?: BooleanField;
  f13Vermoegenswerte2?: BooleanField;
  f14InhaberA?: BooleanField;
  f14InhaberB?: BooleanField;
  f14VermoegenswerteC?: BooleanField;
  f15Bezeichnung?: StringField;
  f16RueckkaufswertoderVerkehrswertinEUR?: StringField;
  f1InhaberA?: BooleanField;
  f1Konten1?: BooleanField;
  f1Konten2?: BooleanField;
  f2InhaberB?: BooleanField;
  f2InhaberC?: BooleanField;
  f3Bank1?: StringField;
  f4Kontostand?: StringField;
  f5Grundeigentum1?: BooleanField;
  f5Grundeigentum2?: BooleanField;
  f6EigentuemerA?: BooleanField;
  f6EigentuemerB?: BooleanField;
  f6EigentuemerC?: BooleanField;
  f7Nutzungsart?: StringField;
  f8Verkehrswert?: StringField;
  f9Kraftfahrzeug1?: BooleanField;
  f9Kraftfahrzeuge2?: BooleanField;
  familienstanddesAntragstellers?: StringField;
  g10Belastungen?: StringField;
  g11Zahlung?: StringField;
  g12ZahlungP?: StringField;
  g1VerpflichtungenJ?: BooleanField;
  g1VerpflichtungenN?: BooleanField;
  g21?: StringField;
  g22?: StringField;
  g23?: StringField;
  g24?: StringField;
  g31?: StringField;
  g32?: StringField;
  g33?: StringField;
  g34?: StringField;
  g4Verwendungszweck1?: StringField;
  g4Verwendungszweck2?: StringField;
  g4Verwendungszweck3?: StringField;
  g4Verwendungszweck4?: StringField;
  g5Raten1?: StringField;
  g5Raten2?: StringField;
  g5Raten3?: StringField;
  g5Raten4?: StringField;
  g6Restschuld1?: StringField;
  g6Restschuld2?: StringField;
  g6Restschuld3?: StringField;
  g6Restschuld4?: StringField;
  g7Zahlung1?: StringField;
  g7Zahlung2?: StringField;
  g7Zahlung3?: StringField;
  g7Zahlung4?: StringField;
  g8ZahlungP1?: StringField;
  g8ZahlungP2?: StringField;
  g8ZahlungP3?: StringField;
  g8ZahlungP4?: StringField;
  g9SonstigeBelastungenJ?: BooleanField;
  g9SonstigeBelastungenN?: BooleanField;
  geburtsdatumdesAntragstellers?: StringField;
  geschaeftsnummerdesAmtsgerichts?: StringField;
  ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern?: StringField;
  namedesAmtsgerichts?: StringField;
  ortDatum2?: StringField;
  postleitzahlOrt?: StringField;
  sonst?: BooleanField;
  tagsueberTelefonischerreichbarunterNummer?: StringField;
  unterschrftdesRechtspfegersderRechtspfegern?: StringField;
  unterschriftdesAntragstellersderAntragstellerin?: StringField;
  wohnkosten?: BooleanField;
}

export interface StringField {
  name?: string;
  value?: string;
}

export interface BooleanField {
  name?: string;
  value?: boolean;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toBeratungshilfePDF(json: string): BeratungshilfePDF {
    return cast(JSON.parse(json), r("BeratungshilfePDF"));
  }

  public static beratungshilfePDFToJson(value: BeratungshilfePDF): string {
    return JSON.stringify(uncast(value, r("BeratungshilfePDF")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      val,
    )}`,
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = "",
  parent: any = "",
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent,
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props")
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  BeratungshilfePDF: o(
    [
      {
        json: "AnschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers",
        js: "anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "AntragstellerNameVornameggfGeburtsname",
        js: "antragstellerNameVornameggfGeburtsname",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "B2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen",
        js: "b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "B3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden",
        js: "b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "B4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt",
        js: "b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "Beratungsperson",
        js: "beratungsperson",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "BerufErwerbstaetigkeit",
        js: "berufErwerbstaetigkeit",
        typ: u(undefined, r("StringField")),
      },
      { json: "Bew", js: "bew", typ: u(undefined, r("BooleanField")) },
      {
        json: "BIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein",
        js: "bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "C1Einkuenftebrutto",
        js: "c1Einkuenftebrutto",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "C2Einkuenftenetto",
        js: "c2Einkuenftenetto",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "C3EinkuenftePartner",
        js: "c3EinkuenftePartner",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "C4EinkuenftePartnernetto",
        js: "c4EinkuenftePartnernetto",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "D1Wohnung",
        js: "d1Wohnung",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "D2Wohnkosten",
        js: "d2Wohnkosten",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "D3Teilwohnkosten",
        js: "d3Teilwohnkosten",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "D4Wohnungalleine",
        js: "d4Wohnungalleine",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "D5Wohnunggemeinsam",
        js: "d5Wohnunggemeinsam",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "D6WonungweiterePersonen",
        js: "d6WonungweiterePersonen",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "DatumBeratung",
        js: "datumBeratung",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E1Person1",
        js: "e1Person1",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E1Person2",
        js: "e1Person2",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E1Person3",
        js: "e1Person3",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E1Person4",
        js: "e1Person4",
        typ: u(undefined, r("StringField")),
      },
      { json: "E2", js: "e2", typ: u(undefined, r("BooleanField")) },
      {
        json: "E2Geburtsdatum",
        js: "e2Geburtsdatum",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E2Geburtsdatum2",
        js: "e2Geburtsdatum2",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E2Geburtsdatum3",
        js: "e2Geburtsdatum3",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E2Geburtsdatum4",
        js: "e2Geburtsdatum4",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E3Familienverhaeltnis",
        js: "e3Familienverhaeltnis",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E3Familienverhaeltnis2",
        js: "e3Familienverhaeltnis2",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E3Familienverhaeltnis3",
        js: "e3Familienverhaeltnis3",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E3Familienverhaeltnis4",
        js: "e3Familienverhaeltnis4",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E4Zahlung1",
        js: "e4Zahlung1",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E4Zahlung2",
        js: "e4Zahlung2",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E4Zahlung3",
        js: "e4Zahlung3",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E4Zahlung4",
        js: "e4Zahlung4",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E5Einnahmen1",
        js: "e5Einnahmen1",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "E5Einnahmen2",
        js: "e5Einnahmen2",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "E5Einnahmen3",
        js: "e5Einnahmen3",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "E5Einnahmen4",
        js: "e5Einnahmen4",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "E6Betrag1",
        js: "e6Betrag1",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E6Betrag2",
        js: "e6Betrag2",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E6Betrag3",
        js: "e6Betrag3",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "E6Betrag4",
        js: "e6Betrag4",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "F10KraftfahrzeugB",
        js: "f10KraftfahrzeugB",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F10KraftfahrzeugC",
        js: "f10KraftfahrzeugC",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F10KraftfahrzeugeA",
        js: "f10KraftfahrzeugeA",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F11Fahrzeugart",
        js: "f11Fahrzeugart",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "F12Verkehrswert",
        js: "f12Verkehrswert",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "F13Vermoegenswerte1",
        js: "f13Vermoegenswerte1",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F13Vermoegenswerte2",
        js: "f13Vermoegenswerte2",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F14InhaberA",
        js: "f14InhaberA",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F14InhaberB",
        js: "f14InhaberB",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F14VermoegenswerteC",
        js: "f14VermoegenswerteC",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F15Bezeichnung",
        js: "f15Bezeichnung",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "F16RueckkaufswertoderVerkehrswertinEUR",
        js: "f16RueckkaufswertoderVerkehrswertinEUR",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "F1InhaberA",
        js: "f1InhaberA",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F1Konten1",
        js: "f1Konten1",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F1Konten2",
        js: "f1Konten2",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F2InhaberB",
        js: "f2InhaberB",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F2InhaberC",
        js: "f2InhaberC",
        typ: u(undefined, r("BooleanField")),
      },
      { json: "F3Bank1", js: "f3Bank1", typ: u(undefined, r("StringField")) },
      {
        json: "F4Kontostand",
        js: "f4Kontostand",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "F5Grundeigentum1",
        js: "f5Grundeigentum1",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F5Grundeigentum2",
        js: "f5Grundeigentum2",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F6EigentuemerA",
        js: "f6EigentuemerA",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F6EigentuemerB",
        js: "f6EigentuemerB",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F6EigentuemerC",
        js: "f6EigentuemerC",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F7Nutzungsart",
        js: "f7Nutzungsart",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "F8Verkehrswert",
        js: "f8Verkehrswert",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "F9Kraftfahrzeug1",
        js: "f9Kraftfahrzeug1",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "F9Kraftfahrzeuge2",
        js: "f9Kraftfahrzeuge2",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "FamilienstanddesAntragstellers",
        js: "familienstanddesAntragstellers",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G10Belastungen",
        js: "g10Belastungen",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G11Zahlung",
        js: "g11Zahlung",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G12ZahlungP",
        js: "g12ZahlungP",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G1VerpflichtungenJ",
        js: "g1VerpflichtungenJ",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "G1VerpflichtungenN",
        js: "g1VerpflichtungenN",
        typ: u(undefined, r("BooleanField")),
      },
      { json: "G21", js: "g21", typ: u(undefined, r("StringField")) },
      { json: "G22", js: "g22", typ: u(undefined, r("StringField")) },
      { json: "G23", js: "g23", typ: u(undefined, r("StringField")) },
      { json: "G24", js: "g24", typ: u(undefined, r("StringField")) },
      { json: "G31", js: "g31", typ: u(undefined, r("StringField")) },
      { json: "G32", js: "g32", typ: u(undefined, r("StringField")) },
      { json: "G33", js: "g33", typ: u(undefined, r("StringField")) },
      { json: "G34", js: "g34", typ: u(undefined, r("StringField")) },
      {
        json: "G4Verwendungszweck1",
        js: "g4Verwendungszweck1",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G4Verwendungszweck2",
        js: "g4Verwendungszweck2",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G4Verwendungszweck3",
        js: "g4Verwendungszweck3",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G4Verwendungszweck4",
        js: "g4Verwendungszweck4",
        typ: u(undefined, r("StringField")),
      },
      { json: "G5Raten1", js: "g5Raten1", typ: u(undefined, r("StringField")) },
      { json: "G5Raten2", js: "g5Raten2", typ: u(undefined, r("StringField")) },
      { json: "G5Raten3", js: "g5Raten3", typ: u(undefined, r("StringField")) },
      { json: "G5Raten4", js: "g5Raten4", typ: u(undefined, r("StringField")) },
      {
        json: "G6Restschuld1",
        js: "g6Restschuld1",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G6Restschuld2",
        js: "g6Restschuld2",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G6Restschuld3",
        js: "g6Restschuld3",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G6Restschuld4",
        js: "g6Restschuld4",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G7Zahlung1",
        js: "g7Zahlung1",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G7Zahlung2",
        js: "g7Zahlung2",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G7Zahlung3",
        js: "g7Zahlung3",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G7Zahlung4",
        js: "g7Zahlung4",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G8ZahlungP1",
        js: "g8ZahlungP1",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G8ZahlungP2",
        js: "g8ZahlungP2",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G8ZahlungP3",
        js: "g8ZahlungP3",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G8ZahlungP4",
        js: "g8ZahlungP4",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "G9SonstigeBelastungenJ",
        js: "g9SonstigeBelastungenJ",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "G9SonstigeBelastungenN",
        js: "g9SonstigeBelastungenN",
        typ: u(undefined, r("BooleanField")),
      },
      {
        json: "GeburtsdatumdesAntragstellers",
        js: "geburtsdatumdesAntragstellers",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "GeschaeftsnummerdesAmtsgerichts",
        js: "geschaeftsnummerdesAmtsgerichts",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "IchbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern",
        js: "ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "NamedesAmtsgerichts",
        js: "namedesAmtsgerichts",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "OrtDatum2",
        js: "ortDatum2",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "PostleitzahlOrt",
        js: "postleitzahlOrt",
        typ: u(undefined, r("StringField")),
      },
      { json: "Sonst", js: "sonst", typ: u(undefined, r("BooleanField")) },
      {
        json: "TagsueberTelefonischerreichbarunterNummer",
        js: "tagsueberTelefonischerreichbarunterNummer",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "UnterschrftdesRechtspfegersderRechtspfegern",
        js: "unterschrftdesRechtspfegersderRechtspfegern",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "UnterschriftdesAntragstellersderAntragstellerin",
        js: "unterschriftdesAntragstellersderAntragstellerin",
        typ: u(undefined, r("StringField")),
      },
      {
        json: "Wohnkosten",
        js: "wohnkosten",
        typ: u(undefined, r("BooleanField")),
      },
    ],
    false,
  ),
  StringField: o(
    [
      { json: "name", js: "name", typ: u(undefined, "") },
      { json: "value", js: "value", typ: u(undefined, "") },
    ],
    false,
  ),
  BooleanField: o(
    [
      { json: "name", js: "name", typ: u(undefined, "") },
      { json: "value", js: "value", typ: u(undefined, true) },
    ],
    false,
  ),
};
