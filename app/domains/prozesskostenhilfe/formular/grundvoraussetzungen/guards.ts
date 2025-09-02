import type { GenericGuard } from "~/domains/guards.server";
import type { ProzesskostenhilfeGrundvoraussetzungenUserData } from "./userData";

export const verfahrenAnwalt: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => context.verfahrenArt === "verfahrenAnwalt";

export const isErstantrag: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => context.formularArt === "erstantrag";

export const isNachueberpruefung: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => context.formularArt === "nachueberpruefung";

export const verfahrenSelbststaendig: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => context.verfahrenArt === "verfahrenSelbststaendig";

export const erstantragAnwalt: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => isErstantrag({ context }) && verfahrenAnwalt({ context });

export const versandDigitalGericht: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) =>
  (isErstantrag({ context }) &&
    verfahrenSelbststaendig({ context }) &&
    context.versandArt === "digital") ||
  (context.formularArt === "nachueberpruefung" &&
    context.versandArt === "digital");

export const grundvoraussetzungenDone: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => {
  const nachueberpruefungDone = context.versandArt !== undefined;
  const erstantragDone =
    context.anhaengigesGerichtsverfahrenFrage !== undefined &&
    context.verfahrenArt !== undefined &&
    (verfahrenAnwalt({ context }) || context.versandArt !== undefined);
  return (
    context.formularArt !== undefined &&
    (context.formularArt === "nachueberpruefung"
      ? nachueberpruefungDone
      : erstantragDone)
  );
};
