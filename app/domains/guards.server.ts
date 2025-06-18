import type { AllUserDataKeys } from "./common";
import type { UserData } from "./userData";

export type GenericGuard<TUserData extends UserData> = ({
  context,
}: {
  context: TUserData;
}) => boolean;

export type Guards<TContext extends UserData = UserData> = Record<
  string,
  GenericGuard<TContext>
>;

export function yesNoGuards<Field extends AllUserDataKeys>(field: Field) {
  const fieldYes = `${field}Yes` as const;
  const fieldNo = `${field}No` as const;
  return {
    [fieldYes]: ({ context }: { context: UserData }) =>
      context[field] === "yes",
    [fieldNo]: ({ context }: { context: UserData }) => context[field] === "no",
  } as Record<typeof fieldYes | typeof fieldNo, GenericGuard<UserData>>;
}
export function hasOptionalString(value: string | undefined): boolean {
  return typeof value === "string";
}
