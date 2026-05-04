import { useForm } from "@rvf/react-router";
import classNames from "classnames";
import { useLoaderData, useLocation } from "react-router";
import {
  emailCaptureSchema,
  invalidEmailError,
} from "~/components/content/emailCapture/emailCaptureHelpers";
import { type InlineNoticeProps } from "~/components/content/InlineNotice";
import InputError from "~/components/kern/formElements/InputError";
import { type loader } from "~/routes/shared/formular";
import { autocompleteMap } from "~/util/autocompleteMap";
import { KernInlineNotice } from "~/components/kern/KernInlineNotice";
import { mapLookValue } from "~/components/content/ContentComponents";
import KernRichText from "~/components/kern/KernRichText";
import KernButton from "~/components/kern/KernButton";
import KernButtonContainer from "~/components/kern/KernButtonContainer";
import { CsrfInput } from "~/components/formElements/CsrfInput";

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
    return (
      <KernInlineNotice
        {...successBanner}
        look={mapLookValue(successBanner.look)}
      />
    );
  } else if (searchArg === "error") {
    return (
      <KernInlineNotice
        {...errorBanner}
        look={mapLookValue(errorBanner.look)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-kern-space-large">
      {description && <KernRichText className="kern-body" html={description} />}
      <form
        {...form.getFormProps()}
        data-testid="email-capture-form"
        className="mt-0!"
        autoComplete="on"
      >
        <div
          className={classNames("kern-form-input", {
            "kern-form-input--error": invalidEmail,
          })}
        >
          <div className="flex flex-col items-start md:flex-row gap-kern-space-default w-full md:items-end">
            <div className="flex flex-col grow min-w-full md:min-w-0">
              {label && (
                <label
                  htmlFor={fieldName}
                  className="flex items-center gap-kern-space-small"
                >
                  <p className="kern-label">{label}</p>{" "}
                  <p className="kern-label text-kern-layout-text-muted! font-normal!">
                    - Optional
                  </p>
                </label>
              )}
              <input
                className={classNames("kern-form-input__input bg-white!", {
                  "kern-form-input__input--error": invalidEmail,
                })}
                {...field.getInputProps({ id: fieldName })}
                aria-errormessage={field.error() ? errorId : undefined}
                autoComplete={autocompleteMap[fieldName] ?? "off"}
                type="email"
                name="email"
              />
            </div>
            <KernButtonContainer className="max-h-min">
              <KernButton
                text={buttonLabel}
                look="secondary"
                disabled={false}
                type={"submit"}
                textClassName="mb-0!"
              />
            </KernButtonContainer>
          </div>
          {invalidEmail && (
            <InputError id={errorId}>{invalidEmailError.text}</InputError>
          )}
          <CsrfInput />
          <input type="hidden" name="_url" value={pathname} />
        </div>
      </form>
    </div>
  );
};
