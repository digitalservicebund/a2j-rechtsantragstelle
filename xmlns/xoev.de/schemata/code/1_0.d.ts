import * as Primitive from "../../../xml-primitives";

// Source files:
// file:///Users/spencerpeace/repos/a2j-rechtsantragstelle/data/xml/xoev-code.xsd

interface BaseType {
  _exists: boolean;
  _namespace: string;
}
/** Der XÖV-Datentyp Code ermöglicht die Übermittlung von Werten, so genannter Codes, aus vordefinierten Codelisten. Eine Codeliste ist eine Liste von Codes und der Beschreibung ihrer jeweiligen Bedeutung. Eine entscheidende Eigenschaft des Datentyps ist die Möglichkeit auf differenzierte Weise Bezug zu Codelisten zu nehmen (Code-Typ 1 bis 4). In jedem Fall erlauben die übermittelten Daten eine eindeutige Identifizierung der zugrundeliegenden Codeliste. */
interface _Code extends BaseType {
  /** Mit diesem XML-Attribut wird die Kennung der Codeliste übermittelt, in deren Kontext der jeweilige Code zu interpretieren ist. Die Kennung identifiziert die Codeliste, nicht jedoch deren Version eindeutig. Wird bereits im Rahmen des XÖV-Standards eine Kennung vorgegeben (es handelt sich in diesem Fall um einen Code-Typ 1, 2 oder 3) darf auf eine nochmalige Angabe der Kennung bei der Übermittlung eines Codes verzichtet werden. Aus diesem Grund ist das XML-Attribut listURI zunächst als optional deklariert. */
  listURI?: string;
  /** Die konkrete Version der zu nutzenden Codeliste wird mit diesem XML-Attribut übertragen. Analog zum listURI ist die Bestimmung der Version einer Codeliste bei der Übertragung eines Codes zwingend. Die Version kann jedoch ebenfalls bereits im XÖV-Standard festgelegt werden (es handelt sich in diesem Fall um einen Code-Typ 1 oder 2). */
  listVersionID?: string;
  /** In diesem XML-Element wird der Code einer Codeliste übermittelt. */
  code: string;
  /** Mit diesem optionalen XML-Element kann die Beschreibung des Codes, wie in der jeweiligen Beschreibungsspalte der Codeliste vorgegeben, übermittelt werden. */
  name?: string;
}
export interface Code extends _Code {
  constructor: { new (): Code };
}
export var Code: { new (): Code };

export interface document extends BaseType {}
export var document: document;
