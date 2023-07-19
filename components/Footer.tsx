import { ReactElement } from "react";
import Link from "next/link";
import SocialIcon from "@/components/SocialIcons";
import { siteConfig } from "./config/site.config";

const Footer = (): ReactElement => {
  return (
    <footer>
      <div className="flex flex-col items-center border-t-[1px] border-gray-200 text-gray-600 dark:border-gray-800 dark:text-gray-300">
        <div className="mb-3 mt-[1.75rem] flex space-x-3 text-xl">
          <SocialIcon kind="facebook" href={siteConfig.links.facebook} />
          <SocialIcon kind="twitter" href={siteConfig.links.twitter} />
          {/* <SocialIcon kind="instagram" href={siteConfig.links.instagram} /> */}
          <SocialIcon kind="linkedin" href={siteConfig.links.linkedin} />
          {/* <SocialIcon kind="youtube" href={siteConfig.links.youtube}/> */}
          <SocialIcon kind="github" href={siteConfig.links.github} />
          <SocialIcon kind="gmail" href={`mailto:${siteConfig.links.email}`} />
        </div>
        <div className="mb-6 flex space-x-2">
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteConfig.title}</Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
