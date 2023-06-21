import { z } from "zod";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

const schema = z.object({
  kids6Below: buildKidsCountValidationSchema(),
  kids7To14: buildKidsCountValidationSchema(),
  kids15To18: buildKidsCountValidationSchema(),
  kids18Above: buildKidsCountValidationSchema(),
});

export const kinderAnzahlStep = {
  schema,
};
