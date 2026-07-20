import { StrapiCardGroupSchema } from "../StrapiCardGroup";

describe("StrapiCardGroup", () => {
  const validCard = {
    heading: { text: "Heading", tagName: "h2", id: 1 },
    title: "Title",
    description: "Description",
    buttonLabel: "Click me",
    id: 1,
  };

  const validCardGroup = {
    __component: "page.card-group",
    cards: [validCard],
    id: 1,
  };

  it("should parse a valid card group with one card", () => {
    const result = StrapiCardGroupSchema.safeParse(validCardGroup);

    expect(result.success).toBe(true);
  });

  it("should allow up to 6 cards", () => {
    const cards = Array.from({ length: 6 }, (_, i) => ({
      ...validCard,
      id: i,
    }));

    const result = StrapiCardGroupSchema.safeParse({
      ...validCardGroup,
      cards,
    });

    expect(result.success).toBe(true);
  });

  it("should fail if more than 6 cards are provided", () => {
    const cards = Array.from({ length: 7 }, (_, i) => ({
      ...validCard,
      id: i,
    }));

    const result = StrapiCardGroupSchema.safeParse({
      ...validCardGroup,
      cards,
    });

    expect(result.success).toBe(false);
  });

  it("should fail if cards array is empty", () => {
    const result = StrapiCardGroupSchema.safeParse({
      ...validCardGroup,
      cards: [],
    });

    expect(result.success).toBe(false);
  });

  it("should fail if one card is invalid", () => {
    const invalidCard = { ...validCard, title: 123 };

    const result = StrapiCardGroupSchema.safeParse({
      ...validCardGroup,
      cards: [invalidCard],
    });

    expect(result.success).toBe(false);
  });
});
