import { useForm } from "@rvf/react-router";
import classNames from "classnames";
import { useLoaderData, useLocation } from "react-router";
import Button, { type ButtonProps } from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type ErrorMessageProps } from "~/components/inputs";
import InputError from "~/components/inputs/InputError";
import InputLabel from "~/components/inputs/InputLabel";
import RichText from "~/components/RichText";
import { type loader } from "~/routes/shared/formular.server";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { schemaForFieldNames } from "~/services/validation/stepValidator/schemaForFieldNames";

export type EmailCaptureProps = {
  name: string;
  submit: ButtonProps;
  description?: string;
  label?: string;
};

const invalidEmailError: ErrorMessageProps = {
  code: "invalid",
  text: "Bitte verwenden Sie eine gültige E-Mail Adresse",
};

export const EmailCapture = ({
  name,
  submit,
  description,
  label,
}: EmailCaptureProps) => {
  const { csrf } = useLoaderData<typeof loader>();
  const jsAvailable = useJsAvailable();
  const { pathname, search } = useLocation();
  const schema = schemaForFieldNames([name], pathname);
  const componentForm = useForm({
    method: "post",
    schema: schema,
    defaultValues: undefined,
    action: submit.href,
  });
  const componentField = componentForm.field(name);
  const error =
    (componentField.error() ?? search === "validationError")
      ? invalidEmailError.code
      : undefined;

  return (
    <div className="ds-stack ds-stack-16">
      {description && (
        <RichText className="ds-body-01-reg" html={description} />
      )}
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <form
        {...componentForm.getFormProps()}
        className="flex max-w-[630px] gap-16 flex-wrap !mt-0"
      >
        <div className="grow">
          <input
            {...componentField.getInputProps()}
            className={classNames("ds-input forced-color-adjust-none", {
              "has-error": error,
            })}
          />
          <InputError id={`${name}-error`}>
            {invalidEmailError.code === error ? invalidEmailError.text : error}
          </InputError>
          <input type="hidden" name={CSRFKey} value={csrf} />
          <input type="hidden" name="_url" value={pathname} />
        </div>
        {submit && (
          <ButtonContainer className="h-[4rem]">
            <Button
              {...{
                ...submit,
                href: undefined,
                disabled: jsAvailable && (!componentField.value() || !!error),
              }}
              type={"submit"}
            />
          </ButtonContainer>
        )}
      </form>
    </div>
  );
};
