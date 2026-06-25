import { z } from "zod";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";

const StrapiTableColumnSchema = z.object({
  ...HasStrapiIdSchema.shape,
  header: z.string(),
});

const StrapiTableCellSchema = z.object({
  ...HasStrapiIdSchema.shape,
  header: z.string(),
  content: z.string(),
});

const StrapiTableRowSchema = z.object({
  ...HasStrapiIdSchema.shape,
  cells: z.array(StrapiTableCellSchema),
});

export const StrapiTableSchema = z.object({
  __component: z.literal("page.table"),
  heading: StrapiHeadingSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  columns: z.array(StrapiTableColumnSchema),
  rows: z.array(StrapiTableRowSchema),
});
