import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import React from "react";

type Props = {
  setShow: Function;
};

const SignOutModal = ({ setShow }: Props) => {
  const { status } = useSession();
  console.log(status);

  return (
    <div
      id="popup-modal"
      className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full items-center justify-center overflow-y-auto overflow-x-hidden p-4 backdrop-blur-sm md:inset-0"
    >
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-md border-2 bg-white">
          <button
            type="button"
            onClick={() => setShow(false)}
            className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-md bg-transparent p-1.5 text-sm text-gray-400 transition hover:bg-gray-200 hover:text-gray-900"
            data-modal-hide="popup-modal"
          >
            <XMarkIcon className="h-7 w-7" />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6 text-center">
            <div className="flex flex-col items-center">
              <ExclamationCircleIcon className="h-14 w-14" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Are you sure you want to sign out?
              </h3>
            </div>

            <button
              data-modal-hide="popup-modal"
              type="button"
              onClick={() => void signOut()}
              className="mr-2 inline-flex items-center rounded-md bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              {status === "loading" ? "Signing out. . ." : "Yes, I'm sure"}
            </button>
            <button
              data-modal-hide="popup-modal"
              type="button"
              onClick={() => setShow(false)}
              className="rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
