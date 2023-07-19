import z, { ZodError } from "zod";
import { loginSchema } from "@/utils/zod/authSchema";
import { NextResponse } from "next/server";
import { AxiosError } from "axios";
import { handleAuthError } from "@/utils/auth/handleAuthError";
import { handleZodError } from "@/utils/zod/handleZodError";
import { createUserAccount } from "@/utils/auth/createUserAccount";
import { ApiErrorResponse } from "@/components/types/ApiErrorResponse";
import { sign } from "jsonwebtoken";
import { User } from "@/components/types/user";

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

const JWT_SECRET = process.env.JWT_SECRET as string;

export type Params = z.infer<typeof loginSchema>;

export async function POST(request: Request) {
  let auth;
  try {
    auth = loginSchema.parse(await request.json());
  } catch (err: any) {
    const res: ApiErrorResponse = handleZodError(err as ZodError);
    return NextResponse.json(res, { status: 400 });
  }
  try {
    const user = await createUserAccount(auth.email, auth.password);
    if (user) {
      const access_token = sign({ uid: user.localId }, JWT_SECRET, {
        expiresIn: "24h",
      });
      return NextResponse.json<User>({
        email: user.email,
        access_token,
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
