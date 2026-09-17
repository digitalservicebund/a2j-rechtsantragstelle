/**
 * TODO: Remove after migration
 */
export const fromXStateGuard =
  <T>(
    guardFunction: (input: { context: T }) => boolean,
  ): ((context: T) => boolean) =>
  (context) =>
    guardFunction({ context });
