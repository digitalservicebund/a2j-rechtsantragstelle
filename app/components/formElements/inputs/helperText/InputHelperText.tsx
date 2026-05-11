export const InputHelperText = ({
  helperText,
  helperId,
}: {
  helperText: string;
  helperId: string;
}) => {
  return (
    <div className="kern-body text-kern-layout-text-muted!" id={helperId}>
      {helperText}
    </div>
  );
};
