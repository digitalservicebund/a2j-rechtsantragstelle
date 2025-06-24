import { useField } from "@rvf/react-router";
import { useFetcher, useLoaderData, useLocation } from "react-router";
import Button, { type ButtonProps } from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import { type ErrorMessageProps } from "~/components/inputs";
import Input from "~/components/inputs/Input";
import InputLabel from "~/components/inputs/InputLabel";
import RichText from "~/components/RichText";
import { type loader } from "~/routes/shared/formular.server";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

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
  const field = useField(name);
  const fetcher = useFetcher();
  const { csrf } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();
  return (
    <div className="ds-stack ds-stack-16">
      {description && (
        <RichText className="ds-body-01-reg" html={description} />
      )}
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <input type="hidden" name="_skipSave" value={"true"} />
      <fetcher.Form
        method="post"
        action={submit.href}
        className="flex max-w-[630px] gap-16 flex-wrap !mt-0"
      >
        <div className="grow">
          <Input
            {...field.getInputProps()}
            errorMessages={[invalidEmailError]}
          />
          <input type="hidden" name={CSRFKey} value={csrf} />
          <input type="hidden" name="_url" value={pathname} />
        </div>
        {submit && (
          <ButtonContainer className="h-[4rem]">
            <Button
              {...{
                ...submit,
                href: undefined,
                disabled: !!field.error() || field.value() === "",
              }}
              type="submit"
            />
          </ButtonContainer>
        )}
      </fetcher.Form>
    </div>
  );
};
