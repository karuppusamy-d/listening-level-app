"use server";
import axios, { AxiosResponse } from "axios";

type ResponseData = {
  localId: string;
  idToken: string;
  email: string;
  displayName: string;
  refreshToken: string;
  expiresIn: string;
  registered: boolean;
};

// https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
// https://cloud.google.com/identity-platform/docs/reference/rest/v1/accounts/signInWithPassword
export const validateUserAccount = async (
  email: string,
  password: string
): Promise<ResponseData | null> => {
  const apiKey = process.env.FIREBASE_API_KEY;

  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=
  const verifyPasswordUrl = `${process.env.FIREBASE_IDENTITY_BASE_URL}:signInWithPassword?key=${apiKey}`;

  if (!verifyPasswordUrl?.length || !apiKey?.length) return null;

  const response: AxiosResponse<ResponseData> = await axios.post(
    verifyPasswordUrl,
    {
      email,
      password,
      returnSecureToken: true, // This returns the refresh token
    }
  );

  if (parseInt(response.status.toString()) === 200) {
    if (response.data.localId) return response.data;
  }

  return null;
};
