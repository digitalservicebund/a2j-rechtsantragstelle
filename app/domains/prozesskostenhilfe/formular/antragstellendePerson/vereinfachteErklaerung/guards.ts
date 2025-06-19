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

export const frageVermoegen: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) =>
  minderjaehrig({ context }) &&
  famFG({ context }) &&
  (geringesEinkommen({ context }) || keinEinkommen({ context }));

export const vermoegenUnder10000: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => context.vermoegenUnder10000 === "yes";

export const hasVermoegenAndEmptyArray: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) =>
  hasVermoegen({ context }) && !arrayIsNonEmpty(context.vermoegen);

export const qualifiesForVereinfachteErklaerung: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) =>
  frageVermoegen({ context }) &&
  (!hasVermoegen({ context }) ||
    (vermoegenUnder10000({ context }) &&
      !hasVermoegenAndEmptyArray({ context })));

export const vereinfachteErklaerungDone: GenericGuard<
  ProzesskostenhilfeVereinfachteErklaerungUserData
> = ({ context }) => {
  const vermoegenEntered =
    context.vermoegenUnder10000 !== undefined &&
    vermoegenUnder10000({ context })
      ? arrayIsNonEmpty(context.vermoegen)
      : true;
  const vermoegenDone =
    context.hasVermoegen !== undefined &&
    (hasVermoegen({ context }) ? vermoegenEntered : true);
  return (
    objectKeysNonEmpty(context.child, [
      "vorname",
      "nachname",
      "geburtsdatum",
    ]) &&
    objectKeysNonEmpty(context, [
      "livesTogether",
      "minderjaehrig",
      "unterhaltsOrAbstammungssachen",
      "hasEinnahmen",
    ]) &&
    (childLivesSeparately({ context })
      ? context.child?.unterhaltsSumme !== undefined
      : true) &&
    (unterhaltsOrAbstammungssachen({ context })
      ? context.rechtlichesThema !== undefined
      : true) &&
    (hasEinnahmen({ context })
      ? arrayIsNonEmpty(context.einnahmen) &&
        context.hohesEinkommen !== undefined
      : true) &&
    (frageVermoegen({ context }) ? vermoegenDone : true)
  );
};
