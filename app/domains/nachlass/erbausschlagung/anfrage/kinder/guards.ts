import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { type GenericGuard } from "~/domains/guards.server";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";
import { type DateObject, toDate } from "~/services/validation/dateObject";
import { addYears, today } from "~/util/date";
import { erbausschlagungKinderArraySchema } from "~/domains/nachlass/erbausschlagung/anfrage/kinder/pages";

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

const isBirthDateAbove18Years = (birthDateObject: DateObject) => {
  const birthDate = toDate(birthDateObject);
  if (Number.isNaN(birthDate.getTime())) return false;

  const eighteenYearsAgo = addYears(today(), -18);

  return birthDate <= eighteenYearsAgo;
};

export const isKinderAbove18YearsOld: NachlassErbausschlagungAnfrageDaten = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const currentKid = kinder?.at(arrayIndex);
  if (!currentKid?.geburtsdatum) return false;

  return isBirthDateAbove18Years(currentKid.geburtsdatum);
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

export const isKinderUebersichtFilled: NachlassErbausschlagungAnfrageDaten = ({
  context: { numberOfKids, kinder },
}) => {
  if (numberOfKids === undefined || kinder === undefined) return false;

  if (numberOfKids !== kinder.length) return false;

  return erbausschlagungKinderArraySchema.safeParse(kinder).success;
};
