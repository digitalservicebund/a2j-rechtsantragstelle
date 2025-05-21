import { FormProvider, useForm } from "@rvf/react-router";
import { ReactNode } from "react";
import { z } from "zod";

type Props = {
  children: ReactNode;
};

export const RFCFormerProvider = ({ children }: Props) => {
  const form = useForm({
    schema: z.object({ name: z.string().optional() }),
    defaultValues: { name: "" },
  });

  return <FormProvider scope={form.scope()}>{children}</FormProvider>;
};
