import { z } from "zod";

export const configureZod = () =>
  z.config({
    jitless: true, // Disables eval check for z.object(), see https://github.com/colinhacks/zod/issues/4461
    customError: (iss) => {
      // Empty strings on enums trigger an 'invalid_value' error. However, we want a generic error message, which can be replace with a user-friendly message.
      if (iss.code === "invalid_value" && iss.input == "")
        return { message: "required" };
    },
  });
