import { z } from "zod";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

const schema = z.object({
  kidsTotal: buildKidsCountValidationSchema(),
});

export const kinderAnzahlSimpleStep = {
  schema,
};
