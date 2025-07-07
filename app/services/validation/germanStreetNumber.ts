/* eslint-disable sonarjs/slow-regex */
import { z } from "zod";
import { translations } from "~/services/translations/translations";

const houseNumberRegex =
  /(?<number>\d+\s*[a-zA-Z]?\s*([-/]\s*\d+\s*[a-zA-Z]*)*)$/gm;

export const germanStreetNumberSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .refine(
    (val) => {
      const regex = new RegExp(houseNumberRegex);
      const streetNumber = regex.exec(val.replaceAll(" ", ""))?.groups?.number;
      return streetNumber !== undefined && streetNumber.length > 0;
    },
    { message: translations.gerichtFinder.invalidHousenumber.de },
  );
