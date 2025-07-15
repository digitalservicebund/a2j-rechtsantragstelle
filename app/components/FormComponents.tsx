import FilesUpload from "~/components/filesUpload/FilesUpload";
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
import { type StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

const FormComponent = ({
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
