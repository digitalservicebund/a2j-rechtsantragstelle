import { type FunctionComponent } from "react";
import { IMaskMixin, type IMaskMixinProps } from "react-imask";
import TextInput, { type InputProps } from "../text/TextInput";
import { useControlledField } from "~/components/hooks/useControlledField";
import { type ControlledFieldConfig } from "~/domains/pageSchemas";

type MaskedIbanInputProps = InputProps & IMaskMixinProps<HTMLInputElement>;

const MaskedIbanInput: FunctionComponent<MaskedIbanInputProps> = IMaskMixin<
  HTMLInputElement,
  InputProps
>((props) => {
  // Needs to be uncontrolled, so that the value gets masked on page load
  return <TextInput {...props} controlled={false} />;
});

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
        type="number"
        prepareChar={(str) => str.toUpperCase()}
        ariaDescribedBy="bankName"
        {...props}
      />

      {SrAnnouncementComponent}
    </div>
  );
};

export default IbanInput;
