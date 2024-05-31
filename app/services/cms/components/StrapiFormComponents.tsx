import { keyFromElement } from "~/services/cms/keyFromElement";
import { StrapiCheckbox } from "../components/StrapiCheckbox";
import { StrapiDateInput } from "../components/StrapiDateInput";
import { StrapiDropdown } from "../components/StrapiDropdown";
import { StrapiFileInput } from "../components/StrapiFileInput";
import { StrapiInput } from "../components/StrapiInput";
import { StrapiSelect } from "../components/StrapiSelect";
import StrapiSuggestionInput from "../components/StrapiSuggestionInput";
import { StrapiTextarea } from "../components/StrapiTextarea";
import StrapiTileGroup from "../components/StrapiTileGroup";
import { StrapiTimeInput } from "../components/StrapiTimeInput";
import type { StrapiFormComponent } from "../models/StrapiFormComponent";

const FormComponent = ({
  component,
}: Readonly<{ component: StrapiFormComponent }>) => {
  switch (component.__component) {
    case "form-elements.suggestion-input":
      return <StrapiSuggestionInput {...component} />;
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
