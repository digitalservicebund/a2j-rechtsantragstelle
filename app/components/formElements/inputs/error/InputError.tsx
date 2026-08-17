import type { PropsWithChildren } from "react";
import { Icon } from "~/components/common/Icon";
import { type ErrorMessageProps } from "~/components/common/types";
import { translations } from "~/services/translations/translations";
import { decodeInvalidCharacters } from "~/services/validation/xjustiz/xjustizDatatype";

/**
 * I put a test error component besides the existing one, to avoid touching all the related components.
 * So ideally it will replace the exisitng one, once we agree on this solution.
 */
export const inputErrorMessage = (
  error: string | null,
  errorMessages?: ErrorMessageProps[],
) => {
  if (!error) return null;

  const invalidCharacters = decodeInvalidCharacters(error);
  if (invalidCharacters)
    return (
      <>
        {translations.xjustiz.invalidCharacters.de}
        <ul className="list-disc list-inside">
          {invalidCharacters.map((character) => (
            <li key={character}>{character}</li>
          ))}
        </ul>
      </>
    );

  return errorMessages?.find((err) => err.code === error)?.text ?? error;
};

type InputErrorProps = PropsWithChildren<{
  readonly id: string;
}>;

const InputError = ({ id, children }: InputErrorProps) => {
  if (!children) return null;
  return (
    // i used a div rather than a p tag, cause its not allowed to have a like lists in a p (:
    <div
      className="kern-error flex! flex-none!"
      data-testid="inputError"
      id={id}
      role="alert"
    >
      <Icon
        name="emergency-home"
        className="w-[1.2em]! h-[1.2em]! mt-2! fill-kern-feedback-danger!"
      />
      <span className="text-kern-feedback-danger!">{children}</span>
    </div>
  );
};

export default InputError;
