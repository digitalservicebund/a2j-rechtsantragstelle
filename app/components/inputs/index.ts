import { z } from "zod";

export const ErrorMessagePropsSchema = z.object({
  code: z.string(),
  text: z.string(),
});

export type ErrorMessageProps = {
  code: string;
  text: string;
};
