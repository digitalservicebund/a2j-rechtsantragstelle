import Button from "./Button";
import ButtonContainer from "./ButtonContainer";

type NavigationButton = {
  destination?: string;
  label: string;
  disabled?: boolean;
};

export type ButtonNavigationProps = {
  readonly back?: NavigationButton;
  readonly next?: NavigationButton;
};

export function ButtonNavigation({ back, next }: ButtonNavigationProps) {
  return (
    <ButtonContainer
      reverseOrder={true}
      className="pt-kern-space-x-large pb-kern-space-x-large"
    >
      {back?.destination && (
        <Button
          href={back.destination}
          look="secondary"
          className="w-fit print:hidden"
          disabled={back.disabled}
        >
          {back.label}
        </Button>
      )}
      {next && (
        <Button
          type={next.destination ? undefined : "submit"}
          name={next.destination ? undefined : "_action"}
          href={next.destination}
          value="next"
          className="w-fit"
          disabled={next.disabled}
        >
          {next.label}
        </Button>
      )}
    </ButtonContainer>
  );
}
