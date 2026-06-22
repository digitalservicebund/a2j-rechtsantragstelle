import { FormProvider, useForm } from "@rvf/react-router";
import { type ReactNode, useEffect } from "react";
import type { ActionFunction, LoaderFunction } from "react-router";
import { z, type ZodObject } from "zod";
import { type AllowedUserTypes } from "../app/domains/userData";
import { reactRouterContext } from "./reactRouterContext";

type Props = {
  children: ReactNode;
  schema?: ZodObject;
  defaultValues?: Record<string, AllowedUserTypes>;
  triggerValidationOnMount?: boolean;
};

const DEFAULT_EMPTY_VALUES: Record<string, AllowedUserTypes> = { name: "" };

const RVFProvider = ({
  schema = z.object({ name: z.string().optional() }),
  defaultValues = DEFAULT_EMPTY_VALUES,
  children,
  triggerValidationOnMount = false,
}: Props) => {
  const form = useForm({ schema, defaultValues });

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

export const reactRouterFormContext = (
  children: ReactNode,
  schema?: ZodObject,
  loader?: LoaderFunction,
  action?: ActionFunction,
) =>
  reactRouterContext(
    () => RVFProvider({ children, schema, triggerValidationOnMount: !!schema }),
    loader,
    action,
  );
