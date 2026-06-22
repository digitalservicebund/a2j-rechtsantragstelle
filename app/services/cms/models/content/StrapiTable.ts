import { z } from "zod";

const StrapiTableColumnSchema = z.object({
  id: z.number(),
  label: z.string(),
});

const StrapiTableCellSchema = z.object({
  id: z.number(),
  content: z.string(),
  isHeader: z.boolean().optional(),
});

const StrapiTableRowSchema = z.object({
  id: z.number(),
  isHeaderRow: z.boolean().optional(),
  cells: z.array(StrapiTableCellSchema),
});

export const StrapiTableSchema = z.object({
  __component: z.literal("page.table"),
  heading: z.string().optional(),
  description: z.string().optional(),
  columns: z.array(StrapiTableColumnSchema).default([]),
  rows: z.array(StrapiTableRowSchema).default([]),
});
