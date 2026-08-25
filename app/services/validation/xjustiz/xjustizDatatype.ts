import { datatypeC as originalDatatypeC } from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import { type z } from "zod";
import { translations } from "~/services/translations/translations";

const invalidCharacters = (characters: Readonly<Set<string>>) =>
  `${translations.xjustiz.invalidCharacters.de} ${[...characters].join(", ")}`;

type Parse = (value: string) => {
  issues?: ReadonlyArray<{ message: string }>;
};

/** Applies an xJustiz datatype for validation only, without its branded type. */
const characterCheck =
  (parse: Parse): z.core.CheckFn<string> =>
  (ctx) => {
    const result = parse(ctx.value);
    if (result.issues)
      ctx.issues.push({
        code: "custom",
        input: ctx.value,
        message: result.issues[0].message,
      });
  };

export const datatypeC = characterCheck(
  originalDatatypeC.customize({ invalidCharacters }),
);
