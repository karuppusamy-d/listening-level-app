"use client";
import { FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/contexts/useAuthContext";
import { ApiErrorResponse } from "@/components/types/ApiErrorResponse";

const Signup = (): ReactElement => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false);
  const [error, setError] = useState({ type: "", message: "" });
  const { currentUser, signup } = useAuthContext();

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
    setError({ type: ele.id, message });
  };

  // Function to handle signup form submit
  async function handleSignup(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    // Check if email and password are not empty
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !passwordConfirmRef.current
    )
      return alert("Something went wrong");

    // Reset error
    if (isRequestPending) {
      return;
    }
    setIsRequestPending(true);
    setError({ type: "", message: "" });

    try {
      // Get email and password
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const passwordConfirm = passwordConfirmRef.current.value;

      // Check if password and passwordConfirm are equal
      if (password !== passwordConfirm) {
        setIsRequestPending(false);
        return handleError(
          passwordConfirmRef.current,
          "Passwords didn’t match"
        );
      }

      // Signup with email and password
      await signup(email, password);
    } catch (err) {
      // Handle error
      handleAxiosError(err as AxiosError<ApiErrorResponse>);
    } finally {
      setIsRequestPending(false);
    }
  }

  const handleAxiosError = (err: AxiosError<ApiErrorResponse>): void => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !passwordConfirmRef.current
    )
      return alert("Something went wrong");

    const response = err.response?.data;

    if (response) {
      const error = response.errors[0];
      if (error.path == "email") {
        handleError(emailRef.current, error.message);
      } else if (error.path == "password") {
        handleError(passwordRef.current, error.message);
      } else {
        handleError(passwordConfirmRef.current, error.message);
      }
    }
  };

  return (
    <div className="py-20 min-h-[80vh]">
      <div className="p-8 sm:p-14 max-w-md sm:max-w-lg m-auto rounded-lg shadow-light dark:shadow-card-dark">
        {/* Signup form */}
        <form className="flex flex-col" onSubmit={handleSignup}>
          <h2 className="text-primary-400 dark:text-gray-100 text-center text-3xl font-bold mb-8">
            Signup
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
          {error.type == "email" && (
            <div className="mt-3 text-xs font-medium text-red-500 dark:text-red-400">
              {error.message}
            </div>
          )}

          {/* Password Input */}
          <label className="font-semibold text-xs mt-4 mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="input"
            id="password"
            ref={passwordRef}
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />

          {/* Password error message */}
          {error.type == "password" && (
            <div className="mt-3 text-xs font-medium text-red-500 dark:text-red-400">
              {error.message}
            </div>
          )}
          {/* Password Confirm Input */}
          <label
            className="font-semibold text-xs mt-4 mb-2"
            htmlFor="passwordConfirm"
          >
            Password Confirm
          </label>
          <input
            className="input"
            id="passwordConfirm"
            ref={passwordConfirmRef}
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />

          {/* Password confirm error message */}
          {error.type == "passwordConfirm" && (
            <div className="mt-3 text-xs font-medium text-red-500 dark:text-red-400">
              {error.message}
            </div>
          )}

          {/* Signup Button */}
          <button className="btn h-10 mt-8 rounded" type="submit">
            Signup
          </button>
        </form>

        <div className="flex mt-6 justify-center text-xs">
          {/* Link to forgot password page */}
          <Link
            href="/resetPassword"
            className="text-primary-400 hover:text-primary-500"
          >
            Forgot Password
          </Link>
          <span className="mx-2 text-gray-300 dark:text-gray-400">/</span>
          {/* Link to signup page */}
          <Link
            href="/login"
            className="text-primary-400 hover:text-primary-500"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
