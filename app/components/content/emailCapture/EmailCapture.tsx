import { useForm } from "@rvf/react-router";
import classNames from "classnames";
import { useLoaderData, useLocation } from "react-router";
import {
  emailCaptureSchema,
  invalidEmailError,
} from "~/components/content/emailCapture/emailCaptureHelpers";
import {
  InlineNotice,
  type InlineNoticeProps,
} from "~/components/content/InlineNotice";
import { CsrfInput } from "~/components/formElements/CsrfInput";
import InputError from "~/components/formElements/InputError";
import InputLabel from "~/components/formElements/InputLabel";
import KernButton from "~/components/kern/KernButton";
import KernButtonContainer from "~/components/kern/KernButtonContainer";
import KernRichText from "~/components/kern/KernRichText";
import { type loader } from "~/routes/shared/formular";
import { autocompleteMap } from "~/util/autocompleteMap";

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
  const fieldName = "email";
  const errorId = "email-error";
  const { emailCaptureConsent } = useLoaderData<typeof loader>();
  const { pathname, search } = useLocation();
  const form = useForm({
    schema: emailCaptureSchema,
    defaultValues: { email: "" },
    preventScrollReset: true,
    action: "/action/send-email",
    method: "post",
  });
  const field = form.field(fieldName);
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
        <KernRichText className="ds-body-01-reg" html={description} />
      )}
      {label && <InputLabel id={fieldName}>{label}</InputLabel>}
      <form
        {...form.getFormProps()}
        data-testid="email-capture-form"
        className="flex max-w-[630px] gap-16 flex-wrap mt-0!"
        autoComplete="on"
      >
        <div className="grow">
          <input
            {...field.getInputProps()}
            id={fieldName}
            aria-errormessage={field.error() ? errorId : undefined}
            className={classNames(
              "ds-input forced-colors:border-4 ph-no-capture",
              {
                "has-error": invalidEmail,
              },
            )}
            autoComplete={autocompleteMap[fieldName] ?? "off"}
            type="email"
            name="email"
          />
          {invalidEmail && (
            <InputError id={errorId}>{invalidEmailError.text}</InputError>
          )}
          <CsrfInput />
          <input type="hidden" name="_url" value={pathname} />
        </div>
        <KernButtonContainer className="h-[4rem]">
          <KernButton text={buttonLabel} disabled={false} type={"submit"} />
        </KernButtonContainer>
      </form>
    </div>
  );
};
