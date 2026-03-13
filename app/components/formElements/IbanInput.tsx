import { useField } from "@rvf/react";
import { type InputProps } from "~/components/formElements/Input";
import MaskedInput from "~/components/formElements/MaskedInput";
import { bankNameFromIBAN } from "~/services/bankCodes";
import InfoOutline from "@digitalservicebund/icons/InfoOutline";

function IbanInput(props: InputProps) {
  const iban = useField<string | undefined>(props.name).value();
  const bankName = bankNameFromIBAN(iban);
  return (
    <div key={props.name} className="flex flex-col gap-[15px]">
      <MaskedInput
        mask={"**** **** **** **** **** **** **** **** **"}
        type="number"
        prepareChar={(str) => str.toUpperCase()}
        {...props}
      />
      {bankName && (
        <output
          id="bank name"
          aria-atomic={true}
          className="border-2 border-blue-800 flex items-center gap-4 mt-0 w-min whitespace-nowrap pr-16 pl-12 py-2 font-bold"
        >
          <InfoOutline className="fill-blue-800" />
          {bankName}
        </output>
      )}
    </div>
  );
}

export default IbanInput;
