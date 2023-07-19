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
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState({ type: "", message: "" });
  const { currentUser, login } = useAuthContext();

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

  // Function to handle login form submit
  async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    // Check if email and password are not empty
    if (!emailRef.current || !passwordRef.current)
      return alert("Something went wrong");

    // Reset error
    setError({ type: "", message: "" });

    try {
      // Get email and password
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      // Login with email and password
      await login(email, password);
    } catch (err) {
      // Handle error
      handleAxiosError(err as AxiosError<ApiErrorResponse>);
    }
  }

  const handleAxiosError = (err: AxiosError<ApiErrorResponse>): void => {
    if (!emailRef.current || !passwordRef.current)
      return alert("Something went wrong");

    const response = err.response?.data;

    if (response) {
      const error = response.errors[0];
      if (error.path == "email") {
        handleError(emailRef.current, error.message);
      } else {
        handleError(passwordRef.current, error.message);
      }
    }
  };

  return (
    <div className="py-20 min-h-[80vh]">
      <div className="p-8 sm:p-14 max-w-md m-auto rounded-lg shadow-light dark:shadow-card-dark">
        {/* Login form */}
        <form className="flex flex-col" onSubmit={handleLogin}>
          <h2 className="text-primary-400 dark:text-gray-100 text-center text-3xl font-bold mb-8">
            Login
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
            autoComplete="current-password"
            required
            minLength={8}
          />

          {/* Password error message */}
          {error.type == "password" && (
            <div className="mt-3 text-xs font-medium text-red-500 dark:text-red-400">
              {error.message}
            </div>
          )}

          {/* Login Button */}
          <button className="btn h-10 mt-8 rounded" type="submit">
            Login
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
