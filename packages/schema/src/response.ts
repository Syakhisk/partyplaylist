import { z } from "zod";

export function httpResponse<T extends z.ZodTypeAny>(schema: T) {
  return z.object({
    data: schema,
  });
}

export type HttpResponse<T extends z.ZodType> = z.infer<
  ReturnType<typeof httpResponse<T>>
>;
