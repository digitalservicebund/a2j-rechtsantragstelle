import * as Primitive from "../../../../xml-primitives";

interface BaseType {
	_exists: boolean;
	_namespace: string;
}
/** Der Datentyp A gibt wieder, welche Schriftzeichen für Namen natürlicher Personen verwendet werden sollten. */
export type datatypeA = string;
type _datatypeA = Primitive._string;

/** Der Datentyp B wurde vor allem für sonstige Namen, wie z. B. Ortsnamen und Straßennamen mit Hausnummer, entworfen. */
export type datatypeB = string;
type _datatypeB = Primitive._string;

/** Der Datentyp C wurde für alle normativen Schriftzeichen der DIN-Norm entworfen. Er ist somit die technische Umsetzung der Schnittstellenvereinbarung Alle nach Norm DIN 91379 normativen Schriftzeichen. Texte mit griechischen oder kyrillischen Buchstaben oder mit erweiterten (nicht-normativen) Nicht-Buchstaben sind unzulässig. */
export type datatypeC = string;
type _datatypeC = Primitive._string;

/** Dieser Datentyp kann nur von solchen IT-Verfahren unterstützt werden, die auch die nicht-normativen Schriftzeichen der Norm DIN 91379 unterstützen. Der Datentyp D wurde vor allem für Namen juristischer Personen und für Produktnamen entworfen. */
export type datatypeD = string;
type _datatypeD = Primitive._string;

/** Dieser Datentyp kann nur von solchen IT-Verfahren unterstützt werden, die auch die nicht-normativen Schriftzeichen der Norm DIN 91379 unterstützen. Der Datentyp E wurde für alle normativen und erweiterten Schriftzeichen der DIN-Norm entworfen. Ein Einsatzgebiet dieses Datentyps kann der grenzüberschreitende Datenaustausch sein, wenn auch griechische und kyrillische Buchstaben benötigt werden. Er ist somit die technische Umsetzung der Schnittstellenvereinbarung Alle nach Norm DIN 91379 normativen und nicht-normativen Schriftzeichen. Texte mit Buchstaben oder Nicht-Buchstaben, die in der DIN-Norm nicht enthalten sind, wie z. B. asiatische oder arabische Buchstaben, sind unzulässig. */
export type datatypeE = string;
type _datatypeE = Primitive._string;

export interface document extends BaseType {
}
export var document: document;
