export type ApiErrorResponse = {
  errors: {
    path?: string | number;
    message: string;
  }[];
};
