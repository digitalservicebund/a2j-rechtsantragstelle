import { keyFromElement } from "~/services/cms/keyFromElement";
import StrapiAutoSuggestInput from "./StrapiAutoSuggestInput";
import { StrapiCheckbox } from "./StrapiCheckbox";
import { StrapiDateInput } from "./StrapiDateInput";
import { StrapiDropdown } from "./StrapiDropdown";
import { StrapiFileInput } from "./StrapiFileInput";
import { StrapiHiddenInput } from "./StrapiHiddenInput";
import { StrapiInput } from "./StrapiInput";
import { StrapiSelect } from "./StrapiSelect";
import { StrapiTextarea } from "./StrapiTextarea";
import { StrapiTileGroup } from "./StrapiTileGroup";
import { StrapiTimeInput } from "./StrapiTimeInput";
import type { StrapiFormComponent } from "../models/StrapiFormComponent";

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
      return <StrapiFileInput />;
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
    case "form-elements.hidden-input":
      return <StrapiHiddenInput {...component} />;
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
