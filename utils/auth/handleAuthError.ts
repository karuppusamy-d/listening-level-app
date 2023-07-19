export type AuthError = {
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

export const handleAuthError = (authError?: AuthError) => {
  let message = "";
  let path = "";
  switch (authError?.error?.message) {
    case "EMAIL_NOT_FOUND":
      path = "email";
      message = "Please check your email.";
      break;
    case "EMAIL_EXISTS":
      path = "email";
      message = "User already exists for this email.";
      break;
    case "INVALID_PASSWORD":
      path = "password";
      message = "Please check your password.";
      break;
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      message = "Too many attempts, Please try again later";
      break;
    case "USER_DISABLED":
      message = "Your account has been disabled.";
      break;
    default:
      message = "Something went wrong, please try again later.";
  }

  return {
    errors: [
      {
        path,
        message,
      },
    ],
  };
};
