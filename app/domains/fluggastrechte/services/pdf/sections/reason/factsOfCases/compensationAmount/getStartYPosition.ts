// check if should use the current Y position before to use the compensation start y position
export const getStartYPosition = (
  compensationStartYPosition: number,
  currentYPosition: number,
) => {
  return currentYPosition < 150 ? currentYPosition : compensationStartYPosition;
};
