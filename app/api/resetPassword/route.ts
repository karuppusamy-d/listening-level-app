import z, { ZodError } from "zod";
import { sendResetPasswordLink } from "@/utils/auth/sendResetPasswordLink";
import { loginSchema } from "@/utils/zod/authSchema";
import { NextResponse } from "next/server";
import { AxiosError } from "axios";
import { handleAuthError } from "@/utils/auth/handleAuthError";
import { handleZodError } from "@/utils/zod/handleZodError";
import { ApiErrorResponse } from "@/components/types/ApiErrorResponse";

type AuthError = {
  error: {
    errors: {
      domain: string;
      reason: string;
      message: string;
    }[];
    code: number;
    message: string;
  };
};

const requestSchema = z.object({
  email: z.string().email(),
});

type ResponseData = {
  email: string;
};

export type Params = z.infer<typeof loginSchema>;

export async function POST(request: Request) {
  let params: z.infer<typeof requestSchema>;
  try {
    params = requestSchema.parse(await request.json());
  } catch (err: any) {
    const res: ApiErrorResponse = handleZodError(err as ZodError);
    return NextResponse.json(res, { status: 400 });
  }
  try {
    const result = await sendResetPasswordLink(params.email);
    if (result) {
      return NextResponse.json<ResponseData>({
        email: result.email,
      });
    }
  } catch (err: any) {
    const axiosError: AxiosError<AuthError> = err;
    const res: ApiErrorResponse = handleAuthError(axiosError?.response?.data);
    return NextResponse.json(res, { status: 400 });
  }
  return NextResponse.json<ApiErrorResponse>(
    {
      errors: [
        {
          message: "Something went wrong, Please try again later.",
        },
      ],
    },
    { status: 400 }
  );
}
