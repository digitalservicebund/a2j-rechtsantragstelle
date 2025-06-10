import z from "zod";
import { vornameNachnameSchema } from "~/domains/shared/formular/persoenlicheDaten/userData";

export const prozesskostenhilfeVereinfachteErklaerungInputSchema = {
  kind: z.object(vornameNachnameSchema),
};

const _partialSchema = z
  .object(prozesskostenhilfeVereinfachteErklaerungInputSchema)
  .partial();

export type ProzesskostenhilfeVereinfachteErklaerungUserData = z.infer<
  typeof _partialSchema
>;
