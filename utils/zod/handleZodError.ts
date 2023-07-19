import { ZodError } from "zod";

export const handleZodError = (zodErr: ZodError) => {
  return {
    errors: zodErr.errors.map((error) => {
      return {
        path: error.path[0],
        message: error.message,
      };
    }),
  };
};
