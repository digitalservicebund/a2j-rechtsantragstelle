import { FormatOptionLabelMeta } from "react-select";
import { DataListOptions } from "../SuggestionInput";

const FormatOptionLabel = (
  { label, subDescription }: DataListOptions,
  { context }: FormatOptionLabelMeta<DataListOptions>,
) => {
  if (context === "menu") {
    return (
      <div style={{ flex: "10" }}>
        <span data-testid="suggestion-input-menu-item">{label}</span>
        <div>
          <span className="primary">{subDescription}</span>
        </div>
      </div>
    );
  }

  return <span className="focus:text-blue-100">{label}</span>;
};

export default FormatOptionLabel;
