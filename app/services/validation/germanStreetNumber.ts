import { z } from "zod";
import { translations } from "~/services/translations/translations";

export const houseNumberRegex =
  // eslint-disable-next-line sonarjs/slow-regex
  /(?<number>\d+\s*[a-zA-Z]?\s*([-/]\s*\d*\s*\w+\s*)*)$/gm;

export const germanStreetNumberSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .refine(
    (val) => {
      // eslint-disable-next-line sonarjs/slow-regex
      const regex = new RegExp(houseNumberRegex);
      const streetNumber = regex.exec(val.replaceAll(" ", ""))?.groups?.number;
      return streetNumber !== undefined && streetNumber.length > 0;
    },
    { message: translations.gerichtFinder.invalidHousenumber.de },
  );
