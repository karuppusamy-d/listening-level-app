"use client";
import { FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/contexts/useAuthContext";
import { ApiErrorResponse } from "@/components/types/ApiErrorResponse";

const Login = (): ReactElement => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState({ type: "", message: "" });
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false);
  const { currentUser, resetPassword } = useAuthContext();

  useEffect(() => {
    // Redirect if user is already logged in
    if (currentUser) router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Function to handle error
  const handleError = (ele: HTMLInputElement, message: string): void => {
    // Add error class to the element
    ele.setAttribute("aria-invalid", "true");

    // To Remove error class on value change
    ele.addEventListener(
      "input",
      (e: Event) => {
        setError({ type: "", message: "" });
        (e.target as HTMLInputElement).removeAttribute("aria-invalid");
      },
      { once: true }
    );

    // Focus on the element
    ele.focus();
    // Set error message
    setError({ type: "error", message });
  };

  // Function to handle login form submit
  async function handleResetPassword(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    // Check if email and password are not empty
    if (!emailRef.current) return alert("Something went wrong");

    // Reset error
    if (isRequestPending) {
      return;
    }
    setIsRequestPending(true);
    setError({ type: "", message: "" });

    try {
      // Get email and password
      const email = emailRef.current.value;

      // Login with email and password
      const res = await resetPassword(email);
      if (res) {
        setError({
          type: "success",
          message: "Please check your email to reset password.",
        });
      }
    } catch (err) {
      // Handle error
      handleAxiosError(err as AxiosError<ApiErrorResponse>);
    }
    setIsRequestPending(false);
  }

  const handleAxiosError = (err: AxiosError<ApiErrorResponse>): void => {
    if (!emailRef.current) return alert("Something went wrong");

    const response = err.response?.data;
    if (response) {
      const error = response.errors[0];
      handleError(emailRef.current, error.message);
    }
  };

  return (
    <div className="py-20 min-h-[80vh]">
      <div className="p-8 sm:p-14 max-w-md sm:max-w-md m-auto rounded-lg shadow-light dark:shadow-card-dark">
        {/* Login form */}
        <form className="flex flex-col" onSubmit={handleResetPassword}>
          <h2 className="text-primary-400 dark:text-gray-100 text-center text-3xl font-bold mb-8">
            Reset Password
          </h2>

          {/* Email Input */}
          <label className="font-semibold text-xs mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="input"
            id="email"
            ref={emailRef}
            type="email"
            autoComplete="username"
            required
          />

          {/* Email error message */}
          {error.type.length > 0 && (
            <div
              className={`mt-3 text-xs font-medium ${
                error.type == "success"
                  ? "text-green-500 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {error.message}
            </div>
          )}

          {/* Login Button */}
          <button className="btn h-10 mt-8 rounded" type="submit">
            Reset Password
          </button>
        </form>

        <div className="flex mt-6 justify-center text-xs">
          {/* Link to forgot password page */}
          <Link
            href="/login"
            className="text-primary-400 hover:text-primary-500"
          >
            Login
          </Link>
          <span className="mx-2 text-gray-300 dark:text-gray-400">/</span>
          {/* Link to signup page */}
          <Link
            href="/signup"
            className="text-primary-400 hover:text-primary-500"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
