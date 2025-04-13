export function formatZodErrors(formattedError: any): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const key in formattedError) {
    if (key !== "_errors" && formattedError[key]._errors.length > 0) {
      errors[key] = formattedError[key]._errors.join(", ");
    }
  }

  return errors;
}