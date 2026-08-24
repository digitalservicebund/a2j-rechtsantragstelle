import {
  printImpliedRelationshipToDeceased,
  printRelationshipToDeceased,
} from "~/domains/nachlass/services/pdf/shared/printRelationshipToDeceased";
import { type NachlassRelationshipType } from "~/domains/nachlass/shared/schemas";

describe("printRelationshipToDeceased", () => {
  it.each([
    ["not-related", "Nicht verwandt"],
    ["wife-husband", "Ehefrau/Ehemann"],
    ["life-partner", "Lebenspartner*in"],
    ["daughter-son", "Tochter/Sohn"],
    ["granddaughter-grandson", "Enkelin/Enkel"],
    ["mother-father", "Mutter/Vater"],
    ["sister-brother", "Schwester/Bruder"],
    ["half-sister-half-brother", "Halbschwester/Halbbruder"],
    ["niece-nephew", "Nichte/Neffe"],
    ["grandmother-grandfather", "Großmutter/Großvater"],
    ["aunt-uncle", "Tante/Onkel"],
    ["cousin", "Cousine/Cousin"],
    ["great-grandmother-great-grandfather", "Urgroßmutter/Urgroßvater"],
    ["great-aunt-great-uncle", "Großtante/Großonkel"],
    ["adoptive-mother-adoptive-father", "Pflegemutter/Pflegevater"],
    ["adoptive-daughter-adoptive-son", "Adoptivtochter/Adoptivsohn"],
    ["other", "Sonstiges"],
  ])(
    "should return the correct label for relationship type %s",
    (relationshipType, expectedLabel) => {
      const result = printRelationshipToDeceased(
        relationshipType as NachlassRelationshipType,
      );
      expect(result).toBe(expectedLabel);
    },
  );
});

describe("printImpliedRelationshipToDeceased", () => {
  it.each([
    [1, "Kind"],
    [2, "Enkelkind"],
    [3, "Urenkel"],
    [4, "Ur-Urenkel"],
    [5, "Ur-Ur-Urenkel"],
  ])(
    "should return the correct first-order relationship label for depth %i",
    (depth, expectedLabel) => {
      const result = printImpliedRelationshipToDeceased(depth, 1);
      expect(result).toBe(expectedLabel);
    },
  );

  it.each([
    [1, "Elternteil"],
    [2, "Geschwister"],
    [3, "Nichte oder Neffe"],
    [4, "Großnichte/Großneffe"],
    [5, "Urgroßnichte/Urgroßneffe"],
    [6, "Ur-Urgroßnichte/Ur-Urgroßneffe"],
  ])(
    "should return the correct second-order relationship label for depth %i",
    (depth, expectedLabel) => {
      const result = printImpliedRelationshipToDeceased(depth, 2);
      expect(result).toBe(expectedLabel);
    },
  );
});
