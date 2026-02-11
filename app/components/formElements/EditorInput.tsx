import { useQuill } from "react-quilljs";
// oxlint-disable-next-line import/no-unassigned-import
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";
import { useField } from "@rvf/react";

const modules = {
  toolbar: [
    [
      "bold",
      "italic",
      "underline",
      "strike",
      { list: "ordered" },
      { list: "bullet" },
    ],
  ],
};

type EditorInputProps = Readonly<{
  name: string;
}>;

export function EditorInput({ name }: EditorInputProps) {
  const field = useField(name);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const defaultValue = field.getInputProps().defaultValue as string | undefined;

  const { quill, quillRef } = useQuill({ modules });

  useEffect(() => {
    if (quill && defaultValue) {
      quill.root.innerHTML = defaultValue;
    }
  }, [quill, defaultValue]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        if (hiddenInputRef.current) {
          hiddenInputRef.current.value = quill.root.innerHTML;
        }
      });
    }
  }, [quill]);

  return (
    <div
      style={{
        width: 700,
        height: 200,
        border: "1px solid lightgray",
        marginBottom: 20,
      }}
    >
      <div ref={quillRef} />
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        defaultValue={defaultValue}
      />
    </div>
  );
}
