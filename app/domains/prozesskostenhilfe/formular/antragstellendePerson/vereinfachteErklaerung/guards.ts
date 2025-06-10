import { type GenericGuard } from "~/domains/guards.server";
import { type ProzesskostenhilfeVereinfachteErklaerungUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const vereinfachteErklaerungDone: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => objectKeysNonEmpty(context.kind, ["vorname", "nachname"]);
