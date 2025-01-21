import AutoSuggestInput from "~/components/inputs/autoSuggestInput/AutoSuggestInput";
import Checkbox from "~/components/inputs/Checkbox";
import DateInput from "~/components/inputs/DateInput";
import HiddenInput from "~/components/inputs/HiddenInput";
import Input from "~/components/inputs/Input";
import RadioGroup from "~/components/inputs/RadioGroup";
import Select from "~/components/inputs/Select";
import Textarea from "~/components/inputs/Textarea";
import TileGroup from "~/components/inputs/tile/TileGroup";
import TimeInput from "~/components/inputs/TimeInput";
import { getAutoSuggestInputProps } from "~/services/cms/components/StrapiAutoSuggestInput";
import { getCheckboxProps } from "~/services/cms/components/StrapiCheckbox";
import { getHiddenInputProps } from "~/services/cms/components/StrapiHiddenInput";
import { getInputProps } from "~/services/cms/components/StrapiInput";
import { getRadioGroupProps } from "~/services/cms/components/StrapiSelect";
import { getTextareaProps } from "~/services/cms/components/StrapiTextarea";
import { getTileGroupProps } from "~/services/cms/components/StrapiTileGroup";
import { getTimeInputProps } from "~/services/cms/components/StrapiTimeInput";
import { keyFromElement } from "~/services/cms/keyFromElement";
import { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { getDateInputProps } from "./StrapiDateInput";
import { getSelectProps } from "./StrapiDropdown";

const FormComponent = ({
  component,
}: Readonly<{ component: StrapiFormComponent }>) => {
  switch (component.__component) {
    case "form-elements.auto-suggest-input":
      return <AutoSuggestInput {...getAutoSuggestInputProps(component)} />;
    case "form-elements.input":
      return <Input {...getInputProps(component)} />;
    case "form-elements.date-input":
      return <DateInput {...getDateInputProps(component)} />;
    case "form-elements.time-input":
      return <TimeInput {...getTimeInputProps(component)} />;
    case "form-elements.file-input":
      // Currently not used/implemented, but still exists in Strapi
      return null;
    case "form-elements.textarea":
      return <Textarea {...getTextareaProps(component)} />;
    case "form-elements.select":
      return <RadioGroup {...getRadioGroupProps(component)} />;
    case "form-elements.dropdown":
      return <Select {...getSelectProps(component)} />;
    case "form-elements.checkbox":
      return <Checkbox {...getCheckboxProps(component)} />;
    case "form-elements.tile-group":
      return <TileGroup {...getTileGroupProps(component)} />;
    case "form-elements.hidden-input":
      return <HiddenInput {...getHiddenInputProps(component)} />;
  }
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
