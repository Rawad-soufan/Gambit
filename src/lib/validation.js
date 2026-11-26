import { z } from "zod";
import { exercises } from "../constants/theme";
import { todayLocal } from "./calculations";
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});
function convertNumber(value) {
  if (typeof value !== "string") return value;
  if (value.trim() === "") return NaN;
  return Number(value);
}

function numberInput(schema) {
  return z.preprocess(convertNumber, schema);
}
export function validCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export const liftSchema = z.object({
  exercise: z.enum(exercises, {
    error: "Choose squat, bench press, or deadlift.",
  }),
  weightKg: numberInput(
    z
      .number({ error: "Enter a valid weight." })
      .positive("Enter a weight greater than zero.")
      .max(500, "Weight must be 500 kg or less."),
  ),
  sets: numberInput(
    z
      .number({ error: "Enter the number of sets." })
      .int("Sets must be a whole number.")
      .min(1, "Enter at least one set.")
      .max(10, "Use 10 sets or fewer."),
  ),
  reps: numberInput(
    z
      .number({ error: "Enter the number of reps." })
      .int("Reps must be a whole number.")
      .min(1, "Enter at least one rep.")
      .max(10, "Use 10 reps or fewer."),
  ),
  date: z
    .string()
    .refine(validCalendarDate, "Enter a real date as YYYY-MM-DD.")
    .refine(
      (value) => value <= todayLocal(),
      "The date cannot be in the future.",
    ),
  notes: z.string().trim().max(300, "Keep notes to 300 characters."),
});
export const storedEntrySchema = liftSchema.extend({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export const storedCollectionSchema = z
  .array(storedEntrySchema)
  .refine(
    (entries) =>
      new Set(entries.map((entry) => entry.id)).size === entries.length,
    "Stored entry IDs must be unique.",
  );
export function fieldErrors(error) {
  const errors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0]);
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}
