import KernButton from "./KernButton";
import KernButtonContainer from "./KernButtonContainer";

type NavigationButton = {
  destination?: string;
  label: string;
  disabled?: boolean;
};

export type ButtonNavigationProps = {
  readonly back?: NavigationButton;
  readonly next?: NavigationButton;
};

export function KernButtonNavigation({ back, next }: ButtonNavigationProps) {
  return (
    <KernButtonContainer reverseOrder={true}>
      {back?.destination && (
        <KernButton
          href={back.destination}
          look="tertiary"
          className="w-fit print:hidden"
          disabled={back.disabled}
        >
          {back.label}
        </KernButton>
      )}
      {next && (
        <KernButton
          type={next.destination ? undefined : "submit"}
          name={next.destination ? undefined : "_action"}
          href={next.destination}
          value="next"
          className="w-fit"
          disabled={next.disabled}
        >
          {next.label}
        </KernButton>
      )}
    </KernButtonContainer>
  );
}