import { useField } from "@rvf/react-router";
import { useFetcher } from "react-router";
import Button, { type ButtonProps } from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import { type ErrorMessageProps } from "~/components/inputs";
import Input from "~/components/inputs/Input";
import InputLabel from "~/components/inputs/InputLabel";
import RichText from "~/components/RichText";

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
        </div>
        {submit && (
          <ButtonContainer className="h-[4rem]">
            <Button
              {...{ ...submit, href: undefined, disabled: !!field.error() }}
              type="submit"
            />
          </ButtonContainer>
        )}
      </fetcher.Form>
    </div>
  );
};
