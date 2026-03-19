import Input from "~/components/formElements/Input";
import Select from "~/components/formElements/Select";
import type { ErrorMessageProps } from "~/components/common/types";

type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
};

type MultiItemInputProps = Readonly<{
  /** Number of items to render */
  count: number;
  /** Array name for form data (e.g., "kinder") */
  arrayName: string;
  /** Title template with {{index}} placeholder (e.g., "Kind {{index}}") */
  itemTitleTemplate: string;
  /** Fields to render for each item */
  fields: ReadonlyArray<FieldConfig>;
  /** Shared CMS-configured validation messages for required fields */
  errorMessages?: ErrorMessageProps[];
}>;

/**
 * MultiItemInput - Renders N input groups on a single page.
 * Used for the "geschlossen" variant where user specifies count upfront,
 * then enters all items on one page.
 *
 * Example for 3 children:
 * - Kind 1: [vorname] [istVerstorben]
 * - Kind 2: [vorname] [istVerstorben]
 * - Kind 3: [vorname] [istVerstorben]
 */
export function MultiItemInput({
  count,
  arrayName,
  itemTitleTemplate,
  fields,
  errorMessages,
}: MultiItemInputProps) {
  return (
    <div className="ds-stack ds-stack-32">
      {Array.from({ length: count }).map((_, index) => {
        const title = itemTitleTemplate.replace(
          "{{index}}",
          String(index + 1),
        );
        const itemKey = `${arrayName}-${index}`;

        return (
          <fieldset
            key={itemKey}
            className="ds-box p-24 bg-white border border-gray-400 rounded"
          >
            <legend className="ds-heading-03-bold mb-16">{title}</legend>

            <div className="ds-stack ds-stack-24">
              {fields.map((field) => {
                const fieldName = `${arrayName}[${index}].${field.name}`;

                if (field.type === "select" && field.options) {
                  return (
                    <Select
                      key={fieldName}
                      name={fieldName}
                      label={field.label}
                      placeholder="Bitte auswählen"
                      options={field.options.map((opt) => ({
                        value: opt.value,
                        text: opt.label,
                      }))}
                      errorMessages={
                        field.required
                          ? (errorMessages ?? [
                              {
                                code: "required",
                                text: "Bitte treffen Sie eine Auswahl",
                              },
                            ])
                          : undefined
                      }
                    />
                  );
                }

                return (
                  <Input
                    key={fieldName}
                    name={fieldName}
                    label={field.label}
                    errorMessages={
                      field.required
                        ? (errorMessages ?? [
                            {
                              code: "required",
                              text: "Dieses Feld muss ausgefüllt werden",
                            },
                          ])
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
