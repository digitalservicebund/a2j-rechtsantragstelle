import { lazy } from "react";
import { keyFromElement } from "~/services/cms/keyFromElement";
import StrapiSelect from "./StrapiSelect";
import type { StrapiFormComponent } from "../models/StrapiFormComponent";

/**
 * Load the form components using lazy loading to avoid including unnecessary data in the bundle.
 * The only exception is the StrapiSelect component,
 * which should not use lazy loading due to issues encountered during E2E tests.
 */
const StrapiAutoSuggestInput = lazy(() => import("./StrapiAutoSuggestInput"));
const StrapiInput = lazy(() => import("../components/StrapiInput"));
const StrapiDateInput = lazy(() => import("../components/StrapiDateInput"));
const StrapiTimeInput = lazy(() => import("../components/StrapiTimeInput"));
const StrapiFileInput = lazy(() => import("../components/StrapiFileInput"));
const StrapiCheckbox = lazy(() => import("../components/StrapiCheckbox"));
const StrapiDropdown = lazy(() => import("../components/StrapiDropdown"));
const StrapiTextarea = lazy(() => import("../components/StrapiTextarea"));
const StrapiTileGroup = lazy(() => import("../components/StrapiTileGroup"));

const FormComponent = ({
  component,
}: Readonly<{ component: StrapiFormComponent }>) => {
  switch (component.__component) {
    case "form-elements.auto-suggest-input":
      return <StrapiAutoSuggestInput {...component} />;
    case "form-elements.input":
      return <StrapiInput {...component} />;
    case "form-elements.date-input":
      return <StrapiDateInput {...component} />;
    case "form-elements.time-input":
      return <StrapiTimeInput {...component} />;
    case "form-elements.file-input":
      return <StrapiFileInput {...component} />;
    case "form-elements.textarea":
      return <StrapiTextarea {...component} />;
    case "form-elements.select":
      return <StrapiSelect {...component} />;
    case "form-elements.dropdown":
      return <StrapiDropdown {...component} />;
    case "form-elements.checkbox":
      return <StrapiCheckbox {...component} />;
    case "form-elements.tile-group":
      return <StrapiTileGroup {...component} />;
  }
  return null;
};

export const StrapiFormComponents = ({
  components,
}: Readonly<{ components: StrapiFormComponent[] }>) => (
  <>
    {components.map((el) => (
      <FormComponent key={keyFromElement(el)} component={el} />
    ))}
  </>
);
