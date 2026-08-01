"use client";

import { useEffect } from "react";

type Props = {
  defaultTheme: "dark" | "light";
  defaultAccent: string;
};

export function ThemeController({ defaultTheme, defaultAccent }: Props) {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as "dark" | "light" | null;
    const storedAccent = window.localStorage.getItem("accent") || defaultAccent;

    const theme = storedTheme ?? defaultTheme;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--accent", storedAccent);
  }, [defaultTheme, defaultAccent]);

  return null;
}
