import { z } from "zod";

const StrapiTableColumnSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
});

const StrapiTableCellSchema = z.object({
  id: z.string().optional(),
  content: z.string(),
  isHeader: z.boolean().optional(),
});

const StrapiTableRowSchema = z.object({
  id: z.string().optional(),
  isHeaderRow: z.boolean().optional(),
  cells: z.array(StrapiTableCellSchema),
});

export const StrapiTableSchema = z.object({
  __component: z.literal("page.table"),
  id: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  columns: z.array(StrapiTableColumnSchema).default([]),
  rows: z.array(StrapiTableRowSchema).default([]),
});
