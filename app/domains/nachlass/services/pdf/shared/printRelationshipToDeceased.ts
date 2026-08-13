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

export const printRelationshipToDeceased = (
  relationshipType?: NachlassRelationshipType,
) => {
  return relationshipType ? relationshipTypeMap[relationshipType] : "";
};
