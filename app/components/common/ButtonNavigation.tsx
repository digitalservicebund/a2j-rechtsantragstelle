import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";

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
    <ButtonContainer reverseOrder={true}>
      {back?.destination && (
        <Button
          href={back.destination}
          look="tertiary"
          size="large"
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
          size="large"
          className="w-fit"
          disabled={next.disabled}
        >
          {next.label}
        </Button>
      )}
    </ButtonContainer>
  );
}
