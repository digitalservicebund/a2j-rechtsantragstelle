import { FormProvider, useForm } from "@rvf/react-router";
import { ReactNode } from "react";
import { z, ZodObject } from "zod";
import { AllowedUserTypes } from "~/domains/userData";

type Props = {
  children: ReactNode;
  schema?: ZodObject;
  defaultValues?: Record<string, AllowedUserTypes>;
};

export const RVFProvider = ({
  schema = z.object({ name: z.string().optional() }),
  defaultValues = { name: "" },
  children,
}: Props) => {
  const form = useForm({
    schema,
    defaultValues,
  });

  return <FormProvider scope={form.scope()}>{children}</FormProvider>;
};
