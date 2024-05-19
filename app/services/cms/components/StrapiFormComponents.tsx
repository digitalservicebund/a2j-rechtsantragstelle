import type { StrapiFormComponent } from "../models/StrapiFormComponent";
import { keyFromElement } from "~/services/cms/keyFromElement";
import { StrapiCheckbox } from "../components/StrapiCheckbox";
import { StrapiDateInput } from "../components/StrapiDateInput";
import { StrapiDropdown } from "../components/StrapiDropdown";
import { StrapiFileInput } from "../components/StrapiFileInput";
import { StrapiInput } from "../components/StrapiInput";
import { StrapiSelect } from "../components/StrapiSelect";
import { StrapiTextarea } from "../components/StrapiTextarea";
import { StrapiTimeInput } from "../components/StrapiTimeInput";
import StrapiSuggestionInput from "../components/StrapiSuggestionInput";
import StrapiTileGroup from "../components/StrapiTileGroup";

function StrapiFormComponent({ content }: { content: StrapiFormComponent }) {
  switch (content.__component) {
    case "form-elements.suggestion-input":
      return <StrapiSuggestionInput {...content} />;
    case "form-elements.input":
      return <StrapiInput {...content} />;
    case "form-elements.date-input":
      return <StrapiDateInput {...content} />;
    case "form-elements.time-input":
      return <StrapiTimeInput {...content} />;
    case "form-elements.file-input":
      return <StrapiFileInput {...content} />;
    case "form-elements.textarea":
      return <StrapiTextarea {...content} />;
    case "form-elements.select":
      return <StrapiSelect {...content} />;
    case "form-elements.dropdown":
      return <StrapiDropdown {...content} />;
    case "form-elements.checkbox":
      return <StrapiCheckbox {...content} />;
    case "form-elements.tile-group":
      return <StrapiTileGroup {...content} />;
    default:
      return <></>;
  }
}

const skipComponents = ["page.array-summary"];

export const FormComponents = (
  props: Readonly<{ content: Array<StrapiFormComponent> }>,
) => (
  <>
    {props.content
      .filter((el) => !skipComponents.includes(el.__component))
      .map((el) => (
        <StrapiFormComponent key={keyFromElement(el)} content={el} />
      ))}
  </>
);
