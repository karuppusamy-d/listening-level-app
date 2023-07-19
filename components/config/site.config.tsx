import { Poppins } from "next/font/google";

import { SiteConfig } from "./SiteConfigTypes";

const fontSans = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteConfig: SiteConfig = {
  title: "Listening App",
  url: "https://listening.karuppusamy.me",
  description:
    "The ultimate listening app that helps you stay organized and accomplish more. With its sleek and user-friendly interface, Listening App allows you to effortlessly create and manage your listening level.",
  fontSans: fontSans,
  navbarLogo: "Listening App",
  footer: {
    text: "Listening App",
    link: "/",
  },
  links: {
    email: "d.karuppusamy@outlook.com",
    github: "https://github.com/karuppusamy-d",
    facebook: "https://facebook.com/karuppusamy2001/",
    twitter: "https://twitter.com/karuppusamy_",
    instagram: "https://instagram.com/karuppusamy.d",
    linkedin: "https://linkedin.com/in/karuppusamy",
    youtube: "",
  },
};

export { siteConfig };
