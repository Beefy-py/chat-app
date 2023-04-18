import {
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { signIn, useSession } from "next-auth/react";
import React from "react";

type Props = {
  setShow: Function;
};

const SignInModal = ({ setShow }: Props) => {
  const { data: sessionData } = useSession();
  console.log(sessionData);
  const btnClasses =
    "rounded-md font-semibold text-gray-800 no-underline transition flex items-center";

  const providers = ["discord", "google", "github", "linkedin"];

  return (
    <div
      id="crypto-modal"
      className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden p-4 backdrop-blur-sm md:inset-0"
    >
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-md border-2 bg-white">
          <button
            type="button"
            onClick={() => setShow(false)}
            className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-md bg-transparent p-1.5 text-sm text-gray-400 transition hover:bg-gray-200 hover:text-gray-900"
            data-modal-hide="crypto-modal"
          >
            <XMarkIcon className="h-7 w-7" />
            <span className="sr-only">Close modal</span>
          </button>

          <div className="rounded-t border-b px-6 py-4">
            <h3 className="text-base font-semibold text-gray-900 lg:text-xl">
              Sign in with:
            </h3>
          </div>

          <ul className="m-6 my-4 space-y-3">
            {providers.map((provider, index) => (
              <li key={`provider-${index}`}>
                <button
                  className={`${btnClasses} hover:text-emerald-500`}
                  onClick={() => void signIn(provider)}
                >
                  <i className={`fa-brands fa-${provider}`}></i>
                  <span className="ml-3 flex-1 whitespace-nowrap">
                    {provider.toUpperCase()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
