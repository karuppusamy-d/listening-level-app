import { ReactNode } from "react";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";

export type SiteFooter = {
  text: string;
  link: string;
};

export type SiteLinks = {
  email: string;
  github: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  [key: string]: string;
};

export type SiteConfig = {
  title: string;
  url: string;
  description: string;
  navbarLogo: ReactNode;
  fontSans: NextFontWithVariable;
  footer: SiteFooter;
  links: SiteLinks;
};
