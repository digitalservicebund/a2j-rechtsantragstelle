export type FileInputProps = {
  name: string;
  label?: string;
};

export const FileInput = ({ name, label }: FileInputProps) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input type="file" accept=".pdf" id={name}></input>
    </div>
  );
};
