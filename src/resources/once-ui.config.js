// Import and set font for each variant
import { Montserrat } from "next/font/google";
import { Geist_Mono } from "next/font/google";

const heading = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const label = Montserrat({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});

const code = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const fonts = {
  heading: heading,
  body: body,
  label: label,
  code: code,
};

// default customization applied to the HTML in the main layout.tsx
const style = {
  theme: "light",
  brand: "blue",
  accent: "pink",
  neutral: "gray",
  border: "rounded",
  solid: "color",
  solidStyle: "plastic",
  surface: "filled",
  transition: "all",
  scaling: "100",
}
const dataStyle = {
  variant: "gradient", // flat | gradient | outline
  mode: "categorical", // categorical | divergent | sequential
  height: 24, // default chart height
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false
  },
};

export { fonts, style, dataStyle };
