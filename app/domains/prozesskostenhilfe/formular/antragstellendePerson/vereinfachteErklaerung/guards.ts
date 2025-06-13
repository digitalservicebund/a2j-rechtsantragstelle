import { type GenericGuard } from "~/domains/guards.server";
import { type ProzesskostenhilfeVereinfachteErklaerungUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/userData";
import { arrayIsNonEmpty } from "~/util/array";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const childLivesSeparately: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => context.livesTogether === "no";

export const minderjaehrig: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => context.minderjaehrig === "yes";

export const hasEinnahmen: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => context.hasEinnahmen === "yes";

export const hasEinnahmenAndEmptyArray: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) =>
  hasEinnahmen({ context }) && !arrayIsNonEmpty(context.einnahmen);

export const hasVermoegen: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => context.hasVermoegen === "yes";

export const famFG: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) =>
  context.unterhaltsOrAbstammungssachen === "yes" &&
  Boolean(context.rechtlichesThema) &&
  context.rechtlichesThema !== "other";

export const geringesEinkommen: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => context.hohesEinkommen === "no";

export const keinEinkommen: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => context.hasEinnahmen === "no";

export const unterhaltsOrAbstammungssachen: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => context.unterhaltsOrAbstammungssachen === "yes";

export const vereinfachteErklaerungDone: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => objectKeysNonEmpty(context.child, ["vorname", "nachname"]);

export const frageVermoegen: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) =>
  minderjaehrig({ context }) &&
  famFG({ context }) &&
  (geringesEinkommen({ context }) || keinEinkommen({ context }));

export const vereinfachteErklaerungFulfilled: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => frageVermoegen({ context }) && !hasVermoegen({ context });
