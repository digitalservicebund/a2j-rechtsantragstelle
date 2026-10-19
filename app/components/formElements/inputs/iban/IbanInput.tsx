import { type FunctionComponent } from "react";
import { IMaskMixin, type IMaskMixinProps } from "react-imask";
import TextInput, { type InputProps } from "../text/TextInput";
import { useControlledField } from "~/components/hooks/useControlledField";
import { type ControlledFieldConfig } from "~/domains/pageSchemas";

type MaskedInputProps = Omit<InputProps, "size">;
type MaskedIbanInputProps = MaskedInputProps &
  IMaskMixinProps<HTMLInputElement> & { size?: InputProps["size"] };

const MaskedIbanInput = IMaskMixin<HTMLInputElement, MaskedInputProps>(
  (props) => {
    return <TextInput {...(props as InputProps)} />;
  },
) as unknown as FunctionComponent<MaskedIbanInputProps>;

const IbanInput = (
  props: InputProps & {
    controlledFieldConfig?: ControlledFieldConfig;
  },
) => {
  const { SrAnnouncementComponent } = useControlledField(
    props.name,
    props.controlledFieldConfig,
  );

  return (
    <div key={props.name} className="flex flex-col gap-15">
      <MaskedIbanInput
        mask={"**** **** **** **** **** **** **** **** **"}
        prepareChar={(str) => str.toUpperCase()}
        ariaDescribedBy="bankName"
        {...props}
      />

      {SrAnnouncementComponent}
    </div>
  );
};

export default IbanInput;
