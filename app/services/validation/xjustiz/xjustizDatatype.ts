import {
  datatypeA,
  datatypeB,
  datatypeC,
  datatypeD,
  datatypeE,
} from "@digitalservicebund/a2j-xjustiz-converter/nachricht/zahlungsklage";
import { type z } from "zod";

const errorPrefix = "invalidCharacters:";

const invalidCharacters = (characters: Readonly<Set<string>>) =>
  `${errorPrefix}${[...characters].join(", ")}`;

const parsers = {
  A: datatypeA.customize({ invalidCharacters }),
  B: datatypeB.customize({ invalidCharacters }),
  C: datatypeC.customize({ invalidCharacters }),
  D: datatypeD.customize({ invalidCharacters }),
  E: datatypeE.customize({ invalidCharacters }),
} as const;

export const decodeInvalidCharacters = (error?: string | null) =>
  error?.startsWith(errorPrefix)
    ? error.slice(errorPrefix.length).split(", ")
    : undefined;

export const xjustizDatatype = <T extends z.ZodString>(
  schema: T,
  datatype: keyof typeof parsers,
) =>
  schema.check((ctx) => {
    const result = parsers[datatype](ctx.value);
    if (result.issues)
      ctx.issues.push({
        code: "custom",
        input: ctx.value,
        message: result.issues[0].message,
      });
  });
