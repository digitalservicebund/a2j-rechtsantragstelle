import {
  datatypeA as originalDatatypeA,
  datatypeB as originalDatatypeB,
  datatypeC as originalDatatypeC,
  datatypeD as originalDatatypeD,
} from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import { type z } from "zod";
import { translations } from "~/services/translations/translations";

const invalidCharacters = (characters: Readonly<Set<string>>) =>
  `${translations.xjustiz.invalidCharacters.de} ${[...characters].join(", ")}`;

type Parse = (value: string) => {
  issues?: ReadonlyArray<{ message: string }>;
};

/**
 * Applies an xJustiz datatype for validation only, without its branded type.
 * Accepts `undefined` so it can be attached to optional fields as well, where
 * there is no value to check against a character set.
 */
const characterCheck =
  (parse: Parse): z.core.CheckFn<string | undefined> =>
  (ctx) => {
    if (ctx.value === undefined) return;
    const result = parse(ctx.value);
    if (result.issues)
      ctx.issues.push({
        code: "custom",
        input: ctx.value,
        message: result.issues[0].message,
      });
  };

export const datatypeA = characterCheck(
  originalDatatypeA.customize({ invalidCharacters }),
);

export const datatypeB = characterCheck(
  originalDatatypeB.customize({ invalidCharacters }),
);

export const datatypeC = characterCheck(
  originalDatatypeC.customize({ invalidCharacters }),
);

export const datatypeD = characterCheck(
  originalDatatypeD.customize({ invalidCharacters }),
);
