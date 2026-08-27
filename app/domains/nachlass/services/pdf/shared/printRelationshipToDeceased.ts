import {
  FIRST_ORDER_LABELS,
  SECOND_ORDER_LABELS,
} from "~/domains/nachlass/erbschein/shared/erbfolgeLabels";
import { type NachlassRelationshipType } from "~/domains/nachlass/shared/schemas";

const relationshipTypeMap: Record<NachlassRelationshipType, string> = {
  "not-related": "Nicht verwandt",
  "wife-husband": "Ehefrau/Ehemann",
  "life-partner": "Lebenspartner*in",
  "daughter-son": "Tochter/Sohn",
  "granddaughter-grandson": "Enkelin/Enkel",
  "mother-father": "Mutter/Vater",
  "sister-brother": "Schwester/Bruder",
  "half-sister-half-brother": "Halbschwester/Halbbruder",
  "niece-nephew": "Nichte/Neffe",
  "grandmother-grandfather": "Großmutter/Großvater",
  "aunt-uncle": "Tante/Onkel",
  cousin: "Cousine/Cousin",
  "great-grandmother-great-grandfather": "Urgroßmutter/Urgroßvater",
  "great-aunt-great-uncle": "Großtante/Großonkel",
  "adoptive-mother-adoptive-father": "Pflegemutter/Pflegevater",
  "adoptive-daughter-adoptive-son": "Adoptivtochter/Adoptivsohn",
  other: "Sonstiges",
};

const impliedFirstOrderRelationshipMap: Record<number, string> = {
  1: FIRST_ORDER_LABELS[0], // Kind
  2: FIRST_ORDER_LABELS[1], // Enkelkind
  3: FIRST_ORDER_LABELS[2], // Urenkel
  4: FIRST_ORDER_LABELS[3], // Ur-Urenkel
  5: FIRST_ORDER_LABELS[4], // Ur-Ur-Urenkel
};

const impliedSecondOrderRelationshipMap: Record<number, string> = {
  1: SECOND_ORDER_LABELS[0], // Elternteil
  2: SECOND_ORDER_LABELS[1], // Geschwister
  3: SECOND_ORDER_LABELS[2], // Nichte oder Neffe
  4: SECOND_ORDER_LABELS[3], // Großnichte/Großneffe
  5: SECOND_ORDER_LABELS[4], // Urgroßnichte/Urgroßneffe
  6: SECOND_ORDER_LABELS[5], // Ur-Urgroßnichte/Ur-Urgroßneffe
};

export const printRelationshipToDeceased = (
  relationshipType?: NachlassRelationshipType,
) => {
  return relationshipType ? relationshipTypeMap[relationshipType] : "";
};

export const printImpliedRelationshipToDeceased = (
  depth: number,
  order: number,
) => {
  return order === 1
    ? impliedFirstOrderRelationshipMap[depth]
    : impliedSecondOrderRelationshipMap[depth];
};
