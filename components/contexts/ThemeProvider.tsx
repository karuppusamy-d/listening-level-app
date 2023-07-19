"use client";

import { ThemeProvider as Provider } from "next-themes";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider defaultTheme="system" disableTransitionOnChange attribute="class">
      {children}
    </Provider>
  );
}

export default ThemeProvider;
export { ThemeProvider };
