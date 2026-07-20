import { StrapiCardSchema } from "../StrapiCard";

const validCard = {
  heading: { text: "Heading", tagName: "h2", id: 1 },
  title: "Title",
  description: "Description",
  buttonLabel: "Click me",
  id: 1,
};
describe("StrapiCard", () => {
  it("should parse a valid card", () => {
    const result = StrapiCardSchema.safeParse(validCard);

    expect(result.success).toBe(true);
  });

  it("should fail if required fields are missing", () => {
    const {
      heading: _heading,
      title: _title,
      description: _description,
      buttonLabel: _buttonLabel,
      ...rest
    } = validCard;

    const result = StrapiCardSchema.safeParse(rest);

    expect(result.success).toBe(false);
  });

  it("should fail if description, title, heading and buttonLabel are invalid", () => {
    const {
      heading: _heading,
      title: _title,
      description: _description,
      buttonLabel: _buttonLabel,
      ...rest
    } = validCard;

    const result = StrapiCardSchema.safeParse(rest);

    expect(result.success).toBe(false);
  });
});
