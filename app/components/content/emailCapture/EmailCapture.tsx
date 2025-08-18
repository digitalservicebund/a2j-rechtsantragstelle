import { useForm } from "@rvf/react-router";
import classNames from "classnames";
import { useLoaderData, useLocation } from "react-router";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import {
  emailCaptureSchema,
  invalidEmailError,
} from "~/components/content/emailCapture/emailCaptureHelpers";
import {
  InlineNotice,
  type InlineNoticeProps,
} from "~/components/content/InlineNotice";
import InputError from "~/components/formElements/InputError";
import InputLabel from "~/components/formElements/InputLabel";
import RichText from "~/components/RichText";
import { type loader } from "~/routes/shared/formular";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

export type EmailCaptureProps = {
  successBanner: InlineNoticeProps;
  errorBanner: InlineNoticeProps;
  label?: string;
  description?: string;
  buttonLabel?: string;
};

export const EmailCapture = ({
  successBanner,
  errorBanner,
  label,
  description,
  buttonLabel,
}: EmailCaptureProps) => {
  const { csrf, emailCaptureConsent } = useLoaderData<typeof loader>();
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
  const invalidEmail = !!field.error() || searchArg === invalidEmailError.code;

  if (emailCaptureConsent || searchArg === "success") {
    return <InlineNotice {...successBanner} />;
  } else if (searchArg === "error") {
    return <InlineNotice {...errorBanner} />;
  }

  return (
    <div className="ds-stack ds-stack-16">
      {description && (
        <RichText className="ds-body-01-reg" html={description} />
      )}
      {label && <InputLabel id={"email"}>{label}</InputLabel>}
      <form
        {...form.getFormProps()}
        data-testid="email-capture-form"
        className="flex max-w-[630px] gap-16 flex-wrap !mt-0"
      >
        <div className="grow">
          <input
            {...field.getInputProps()}
            className={classNames("ds-input forced-color-adjust-none", {
              "has-error": invalidEmail,
            })}
          ></input>
          {invalidEmail && (
            <InputError id={"email-error"}>{invalidEmailError.text}</InputError>
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
};
