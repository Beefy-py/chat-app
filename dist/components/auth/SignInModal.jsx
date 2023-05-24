"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("@heroicons/react/24/outline");
const react_1 = require("next-auth/react");
const react_2 = __importDefault(require("react"));
const SignInModal = ({ setShow }) => {
    const { data: sessionData } = (0, react_1.useSession)();
    console.log(sessionData);
    const btnClasses = "rounded-md font-semibold text-gray-800 no-underline transition flex items-center";
    const providers = ["discord", "google", "github", "linkedin"];
    return (<div id="crypto-modal" className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden p-4 backdrop-blur-sm md:inset-0">
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-md border-2 bg-white">
          <button type="button" onClick={() => setShow(false)} className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-md bg-transparent p-1.5 text-sm text-gray-400 transition hover:bg-gray-200 hover:text-gray-900" data-modal-hide="crypto-modal">
            <outline_1.XMarkIcon className="h-7 w-7"/>
            <span className="sr-only">Close modal</span>
          </button>

          <div className="rounded-t border-b px-6 py-4">
            <h3 className="text-base font-semibold text-gray-900 lg:text-xl">
              Sign in with:
            </h3>
          </div>

          <ul className="m-6 my-4 space-y-3">
            {providers.map((provider, index) => (<li key={`provider-${index}`}>
                <button className={`${btnClasses} hover:text-emerald-500`} onClick={() => void (0, react_1.signIn)(provider)}>
                  <i className={`fa-brands fa-${provider}`}></i>
                  <span className="ml-3 flex-1 whitespace-nowrap">
                    {provider.toUpperCase()}
                  </span>
                </button>
              </li>))}
          </ul>
        </div>
      </div>
    </div>);
};
exports.default = SignInModal;
