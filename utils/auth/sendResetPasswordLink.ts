"use server";
import axios, { AxiosResponse } from "axios";

type ResponseData = {
  email: string;
};

// https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
// https://cloud.google.com/identity-platform/docs/reference/rest/v1/accounts/signInWithPassword
export const sendResetPasswordLink = async (
  email: string
): Promise<ResponseData | null> => {
  const apiKey = process.env.FIREBASE_API_KEY;

  // https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=
  const resetPasswordUrl = `${process.env.FIREBASE_IDENTITY_BASE_URL}:sendOobCode?key=${apiKey}`;

  if (!resetPasswordUrl?.length || !apiKey?.length) return null;

  const response: AxiosResponse<ResponseData> = await axios.post(
    resetPasswordUrl,
    {
      email,
      requestType: "PASSWORD_RESET",
    }
  );

  if (parseInt(response.status.toString()) === 200) {
    if (response.data.email) {
      return response.data;
    }
  }

  return null;
};
