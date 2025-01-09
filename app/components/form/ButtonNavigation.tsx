import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";

type NavigationButton = {
  destination?: string;
  label: string;
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
          className="w-fit"
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
        >
          {next.label}
        </Button>
      )}
    </ButtonContainer>
  );
}
