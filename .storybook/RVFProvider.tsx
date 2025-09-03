import { FormProvider, useForm } from "@rvf/react-router";
import { ReactNode, useEffect } from "react";
import { z, ZodObject } from "zod";
import { AllowedUserTypes } from "~/domains/userData";

type Props = {
  children: ReactNode;
  schema?: ZodObject;
  defaultValues?: Record<string, AllowedUserTypes>;
  triggerValidationOnMount?: boolean;
};

export const RVFProvider = ({
  schema = z.object({ name: z.string().optional() }),
  defaultValues = { name: "" },
  children,
  triggerValidationOnMount = false,
}: Props) => {
  const form = useForm({
    schema,
    defaultValues,
  });

  useEffect(() => {
    if (triggerValidationOnMount) {
      form.validate();
    }
  }, [form, triggerValidationOnMount]);

  return (
    <FormProvider scope={form.scope()}>
      <form {...form.getFormProps()}>{children}</form>
    </FormProvider>
  );
};
