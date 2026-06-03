import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { type GenericGuard } from "~/domains/guards.server";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";
import { toDate } from "~/services/validation/dateObject";
import { addYears, today } from "~/util/date";

type NachlassErbausschlagungAnfrageDaten =
  GenericGuard<NachlassErbausschlagungAnfrageUserData>;

export const isKinderWohnortBeiAntragstellerYes: NachlassErbausschlagungAnfrageDaten =
  ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    const kinderWohnortBeiAntragsteller =
      kinder?.at(arrayIndex)?.wohnortBeiAntragsteller;
    return kinderWohnortBeiAntragsteller === "yes";
  };

export const isKinderAbove18YearsOld: NachlassErbausschlagungAnfrageDaten = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const currentKid = kinder?.at(arrayIndex);
  if (!currentKid?.geburtsdatum) return false;

  const birthDate = toDate(currentKid.geburtsdatum);
  if (Number.isNaN(birthDate.getTime())) return false;

  const eighteenYearsAgo = addYears(today(), -18);

  return birthDate <= eighteenYearsAgo;
};

export const kinderNotFilled: NachlassErbausschlagungAnfrageDaten = ({
  context: { hasKid, numberOfKids, kinder },
}) => {
  if (hasKid === "no" || numberOfKids === 0) {
    return false;
  }

  return numberOfKids !== kinder?.length;
};

export const hasKinderSorgerechtSameAddressNo: NachlassErbausschlagungAnfrageDaten =
  ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    const kinderHasSorgerechtSameAddress =
      kinder?.at(arrayIndex)?.hasSorgerechtSameAddress;
    return kinderHasSorgerechtSameAddress === "no";
  };

export const shouldBackSorgerechtAddress: NachlassErbausschlagungAnfrageDaten =
  ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;

    const optionSorgerecht = getOptionSorgerecht({ pageData, kinder });

    return (
      kinder?.at(arrayIndex)?.hasSorgerechtSameAddress === "no" &&
      optionSorgerecht === "shared"
    );
  };

export const getOptionSorgerecht = ({
  pageData,
  kinder,
}: NachlassErbausschlagungAnfrageUserData) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return undefined;
  return kinder?.at(arrayIndex)?.optionSorgerecht;
};
