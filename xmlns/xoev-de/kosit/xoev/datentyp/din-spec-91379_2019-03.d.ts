import * as Primitive from "../../../../xml-primitives";

// Source files:
// file:///Users/spencerpeace/repos/a2j-rechtsantragstelle/data/xml/din-91379-datatypes.xsd

interface BaseType {
  _exists: boolean;
  _namespace: string;
}
/** Der Datentyp A gibt wieder, welche Schriftzeichen in hoheitlichen Dokumenten für Namen natürlicher Personen verwendet werden. */
export type datatypeA = string;
type _datatypeA = Primitive._string;

/** Der Datentyp B wurde vor allem für sonstige Namen, wie z. B. Ortsnamen und Straßennamen mit Hausnummer, entworfen. */
export type datatypeB = string;
type _datatypeB = Primitive._string;

/** Der Datentyp C wurde für alle normativen Schriftzeichen der DIN SPEC entworfen. Er ist somit die technische Umsetzung der Schnittstellenvereinbarung Alle nach DIN SPEC 91379 normativen Schriftzeichen. Texte mit griechischen oder kyrillischen Buchstaben oder mit erweiterten (nicht-normativen) Nicht-Buchstaben sind unzulässig. */
export type datatypeC = string;
type _datatypeC = Primitive._string;

/** Der Datentyp D wurde vor allem für Namen juristischer Personen und für Produktnamen entworfen. */
export type datatypeD = string;
type _datatypeD = Primitive._string;

/** Der Datentyp E wurde für alle normativen und erweiterten Schriftzeichen der DIN SPEC entworfen. Ein Einsatzgebiet dieses Datentyps kann der grenzüberschreitende Datenaustausch sein, wenn auch griechische und kyrillische Buchstaben benötigt werden. Er ist somit die technische Umsetzung der Schnittstellenvereinbarung Alle nach DIN SPEC 91379 normativen und nicht-normativen Schriftzeichen. Texte mit Buchstaben oder Nicht-Buchstaben, die in der DIN SPEC nicht enthalten sind, wie z. B. asiatische oder arabische Buchstaben, sind unzulässig. */
export type datatypeE = string;
type _datatypeE = Primitive._string;

export interface document extends BaseType {}
export var document: document;
