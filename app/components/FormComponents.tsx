import FilesUpload from "~/components/filesUpload/FilesUpload";
import AutoSuggestInput from "~/components/formElements/AutoSuggestInput";
import Checkbox from "~/components/formElements/Checkbox";
import DateInput from "~/components/formElements/DateInput";
import { FieldSet } from "~/components/formElements/FieldSet";
import HiddenInput from "~/components/formElements/HiddenInput";
import Input from "~/components/formElements/Input";
import RadioGroup from "~/components/formElements/RadioGroup";
import Select from "~/components/formElements/Select";
import Textarea from "~/components/formElements/Textarea";
import TileGroup from "~/components/formElements/tile/TileGroup";
import TimeInput from "~/components/formElements/TimeInput";
import { type StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export const FormComponent = ({
  componentProps,
}: Readonly<{ componentProps: StrapiFormComponent }>) => {
  switch (componentProps.__component) {
    case "form-elements.auto-suggest-input":
      return <AutoSuggestInput {...componentProps} />;
    case "form-elements.input":
      return <Input {...componentProps} />;
    case "form-elements.date-input":
      return <DateInput {...componentProps} />;
    case "form-elements.time-input":
      return <TimeInput {...componentProps} />;
    case "form-elements.files-upload":
      return <FilesUpload {...componentProps} />;
    case "form-elements.textarea":
      return <Textarea {...componentProps} />;
    case "form-elements.select":
      return <RadioGroup {...componentProps} />;
    case "form-elements.dropdown":
      return <Select {...componentProps} />;
    case "form-elements.checkbox":
      return <Checkbox {...componentProps} />;
    case "form-elements.tile-group":
      return <TileGroup {...componentProps} />;
    case "form-elements.hidden-input":
      return <HiddenInput {...componentProps} />;
    case "form-elements.fieldset":
      return <FieldSet {...componentProps} />;
  }
};

export const FormComponents = ({
  components,
}: Readonly<{ components: StrapiFormComponent[] }>) => (
  <>
    {components.map((componentProps) => (
      <FormComponent
        key={`${componentProps.__component}_${componentProps.id}`}
        componentProps={componentProps}
      />
    ))}
  </>
);
