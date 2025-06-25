import { useForm } from "@rvf/react-router";
import classNames from "classnames";
import { useLoaderData, useLocation } from "react-router";
import { z } from "zod";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import {
  InlineNotice,
  type InlineNoticeProps,
} from "~/components/InlineNotice";
import { type ErrorMessageProps } from "~/components/inputs";
import InputError from "~/components/inputs/InputError";
import InputLabel from "~/components/inputs/InputLabel";
import RichText from "~/components/RichText";
import { type loader } from "~/routes/shared/formular.server";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { emailSchema } from "~/services/validation/email";

export type EmailCaptureProps = {
  successBanner: InlineNoticeProps;
  errorBanner: InlineNoticeProps;
  label?: string;
  description?: string;
  buttonLabel?: string;
};

export const invalidEmailError: ErrorMessageProps = {
  code: "invalid",
  text: "Bitte verwenden Sie eine gültige E-Mail Adresse",
};

export const emailCaptureSchema = z.object({
  email: emailSchema,
});

export const EmailCapture = ({
  successBanner,
  errorBanner,
  label,
  description,
  buttonLabel,
}: EmailCaptureProps) => {
  const { csrf } = useLoaderData<typeof loader>();
  const { pathname, search } = useLocation();
  const form = useForm({
    schema: emailCaptureSchema,
    defaultValues: { email: "" },
    preventScrollReset: true,
    action: "/action/send-email",
    method: "post",
  });
  const field = form.field("email");
  const searchArg = search.split("?")[1];
  const error = !!field.error() || searchArg === invalidEmailError.code;

  switch (searchArg) {
    case "success":
      return <InlineNotice {...successBanner} />;
    case "error":
      return <InlineNotice {...errorBanner} />;
    default:
      return (
        <div className="ds-stack ds-stack-16">
          {description && (
            <RichText className="ds-body-01-reg" html={description} />
          )}
          {label && <InputLabel id={"email"}>{label}</InputLabel>}
          <form
            {...form.getFormProps()}
            className="flex max-w-[630px] gap-16 flex-wrap !mt-0"
          >
            <div className="grow">
              <input
                {...field.getInputProps()}
                className={classNames("ds-input forced-color-adjust-none", {
                  "has-error": error,
                })}
              ></input>
              {error && (
                <InputError id={"email-error"}>
                  {invalidEmailError.text}
                </InputError>
              )}
              <input type="hidden" name={CSRFKey} value={csrf} />
              <input type="hidden" name="_url" value={pathname} />
            </div>
            <ButtonContainer className="h-[4rem]">
              <Button text={buttonLabel} disabled={false} type={"submit"} />
            </ButtonContainer>
          </form>
        </div>
      );
  }
};
