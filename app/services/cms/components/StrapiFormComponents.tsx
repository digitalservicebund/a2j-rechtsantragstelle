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
import { getFilesUploadProps } from "~/services/cms/components/StrapiFilesUpload";
import { keyFromElement } from "~/services/cms/keyFromElement";
import { type StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

const FormComponent = ({
  component,
}: Readonly<{ component: StrapiFormComponent }>) => {
  switch (component.__component) {
    case "form-elements.auto-suggest-input":
      return <AutoSuggestInput {...component} />;
    case "form-elements.input":
      return <Input {...component} />;
    case "form-elements.date-input":
      return <DateInput {...component} />;
    case "form-elements.time-input":
      return <TimeInput {...component} />;
    case "form-elements.files-upload":
      return <FilesUpload {...getFilesUploadProps(component)} />;
    case "form-elements.textarea":
      return <Textarea {...component} />;
    case "form-elements.select":
      return <RadioGroup {...component} />;
    case "form-elements.dropdown":
      return <Select {...component} />;
    case "form-elements.checkbox":
      return <Checkbox {...component} />;
    case "form-elements.tile-group":
      return <TileGroup {...component} />;
    case "form-elements.hidden-input":
      return <HiddenInput {...component} />;
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
