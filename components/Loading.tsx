import { ReactElement } from "react";

const Loading = (): ReactElement => {
  return (
    <div className="min-h-[80vh] p-4 sm:p-8">
      <div className="pt-6 pb-0 space-y-2 xl:space-y-3">
        <div className="animate-pulse mb-3 h-4 w-60 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
        <div className="animate-pulse h-4 w-auto bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
      </div>

      <div className="pt-6">
        <div className="py-4">
          <div className="p-10 rounded-xl shadow-light dark:bg-gray-900">
            <div className="animate-pulse h-4 w-auto mt-1 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            <div className="animate-pulse h-4 w-auto mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
        <div className="py-4">
          <div className="p-10 rounded-xl shadow-light dark:bg-gray-900">
            <div className="animate-pulse h-4 w-auto mt-1 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            <div className="animate-pulse h-4 w-auto mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
        <div className="py-4">
          <div className="p-10 rounded-xl shadow-light dark:bg-gray-900">
            <div className="animate-pulse h-4 w-auto mt-1 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            <div className="animate-pulse h-4 w-auto mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
