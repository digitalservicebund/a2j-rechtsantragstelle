import { z } from "zod";

export const HeadingSchema = z.object({
  id: z.number(),
  __component: z.literal("basic.heading"),
  text: z.string(),
  tagName: z.union([
    z.literal("h1"),
    z.literal("h2"),
    z.literal("h3"),
    z.literal("h4"),
    z.literal("h5"),
    z.literal("h6"),
    z.literal("p"),
    z.literal("div"),
  ]),
  look: z.union([
    z.literal("default"),
    z.literal("ds-heading-01-reg"),
    z.literal("ds-heading-02-reg"),
    z.literal("ds-heading-03-reg"),
    z.literal("ds-heading-03-bold"),
    z.literal("ds-subhead"),
    z.literal("ds-label-01-reg"),
    z.literal("ds-label-01-bold"),
    z.literal("ds-label-02-reg"),
    z.literal("ds-label-02-bold"),
    z.literal("ds-label-03-reg"),
    z.literal("ds-label-03-bold"),
    z.literal("ds-label-section"),
    z.literal("ds-body-01-reg"),
    z.literal("ds-body-02-reg"),
  ]),
});

export type Heading = z.infer<typeof HeadingSchema>;
