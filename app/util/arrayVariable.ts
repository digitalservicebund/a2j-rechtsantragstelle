// HTML forms cannot deal with arrays. We use the following char to mark a variable as belonging to an array
// For example: The form field 'accounts#owner' belongs to the object field 'owner' inside the 'accounts' array

const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldname: string) =>
  fieldname.includes(arrayChar);
