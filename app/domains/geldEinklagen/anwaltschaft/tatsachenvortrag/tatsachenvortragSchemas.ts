import z from "zod";

const MAX_ABSAETZE = 50;

export const absaetzeArraySchema = z.array(z.object({})).max(MAX_ABSAETZE);
