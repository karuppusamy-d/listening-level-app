import { ReactElement } from "react";
import Link from "next/link";

const About = (): ReactElement => {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 min-h-[80vh]">
      <div className="pt-10 pb-5 xl:pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 xl:text-5xl">
          About
        </h1>
      </div>

      <div className="pt-6">
        <p>It is a open source project Listening App created with next.js.</p>

        <p className="pt-4">Source code is available in GitHub</p>
        <br />

        <Link
          href="https://github.com/karuppusamy-d/listening-level-app.git"
          target="_blank"
          className="btn text-[0.75rem] sm:text-sm"
          aria-label="Source code"
        >
          Source code
        </Link>
      </div>
    </div>
  );
};

export default About;
