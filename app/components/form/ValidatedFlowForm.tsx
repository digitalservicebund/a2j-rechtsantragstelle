import TimerOutlinedIcon from "@digitalservicebund/icons/TimerOutlined";
import { ValidatedForm } from "@rvf/react-router";
import { posthog } from "posthog-js";
import { useLocation } from "react-router";
import type { ButtonNavigationProps } from "~/components/form/ButtonNavigation";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import type { Context } from "~/domains/contexts";
import { StrapiFormComponents } from "~/services/cms/components/StrapiFormComponents";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { schemaForFieldNames } from "~/services/validation/stepValidator/schemaForFieldNames";

type ValidatedFlowFormProps = {
  stepData: Context;
  formElements: StrapiFormComponent[];
  buttonNavigationProps: ButtonNavigationProps;
  csrf: string;
};

function ValidatedFlowForm({
  stepData,
  formElements,
  buttonNavigationProps,
  csrf,
}: Readonly<ValidatedFlowFormProps>) {
  const { pathname } = useLocation();
  const fieldNames = formElements.map((entry) => entry.name);
  const schema = schemaForFieldNames(fieldNames, pathname);

  // THIS IS A TEMPORARY SOLUTION FOR THE AB TEST IN PROZESSKOSTENHILFE

  // Manually override the feature flag for testing purposes
  posthog.featureFlags.overrideFeatureFlags({
    flags: { "conversion-rate-pkh-flow": "test" },
  });

  // Get the feature flag key for the ab test
  // Using the "test" variant key to display the estimated time string in the form
  // When the variant value is "control" the string will not be displayed
  const getPKHABTestFeatureFlag =
    posthog.getFeatureFlag("conversion-rate-pkh-flow") === "test";

  return (
    <ValidatedForm
      method="post"
      encType="multipart/form-data"
      schema={schema}
      defaultValues={stepData}
      noValidate
      action={pathname}
    >
      <input type="hidden" name={CSRFKey} value={csrf} />
      <div className="ds-stack ds-stack-40">
        <StrapiFormComponents components={formElements} />
        {/*THIS IS A TEMPORARY SOLUTION FOR THE AB TEST IN PROZESSKOSTENHILFE*/}
        {/* Rendering the estimated time string in the form for the ab test in prozesskostenhilfe */}
        {pathname.includes("prozesskostenhilfe/formular/start/start") &&
          getPKHABTestFeatureFlag && (
            <span className="flex items-center ds-body-02-reg text-gray-900">
              <TimerOutlinedIcon className="shrink-0 fill-gray-900 mr-4" />{" "}
              {"Geschätzte Zeit: 20 Minuten"}
            </span>
          )}

        <ButtonNavigation {...buttonNavigationProps} />
      </div>
    </ValidatedForm>
  );
}

export default ValidatedFlowForm;
