"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("next-auth/react");
const Loader_1 = __importDefault(require("@/components/common/Loader"));
const outline_1 = require("@heroicons/react/24/outline");
const react_2 = require("react");
const SignInModal_1 = __importDefault(require("./SignInModal"));
const SignOutModal_1 = __importDefault(require("./SignOutModal"));
const image_1 = __importDefault(require("next/image"));
const AuthShowcase = () => {
    var _a;
    const { data: sessionData, status } = (0, react_1.useSession)();
    console.log(sessionData);
    const [showSignInModal, setShowSignInModal] = (0, react_2.useState)(false);
    const [showSignOutModal, setShowSignOutModal] = (0, react_2.useState)(false);
    const btnClasses = "rounded-md sm:px-8 sm:py-2 font-semibold text-gray-800 no-underline transition flex items-center";
    return (<div className="mb-2 mt-10 flex w-full flex-col-reverse justify-between gap-4 pb-2 sm:flex-row sm:items-center">
      {status === "loading" ? (<Loader_1.default text=""/>) : (<>
          {sessionData ? (<div className="inline-flex items-center gap-2 text-lg text-gray-800">
              <p>Logged in as</p>
              <span className="font-semibold text-emerald-800">
                {(_a = sessionData.user) === null || _a === void 0 ? void 0 : _a.name}
              </span>
              {sessionData.user ? (<div className="relative h-7 w-7">
                  {sessionData.user.image ? (<image_1.default src={sessionData.user.image} fill className="rounded-md" alt={sessionData.user.name}/>) : (<outline_1.UserCircleIcon className={`
                     text-emerald-800
                    `}/>)}
                </div>) : (<outline_1.PhotoIcon className="h-6 w-6"/>)}
            </div>) : (<p className="font-semibold text-gray-800">Unauthenticated</p>)}
          {sessionData ? (<button className={`${btnClasses} hover:text-red-500`} onClick={() => setShowSignOutModal(true)}>
              <outline_1.ArrowLeftOnRectangleIcon className="mr-1 h-6 w-6"/>
              <span>Sign out</span>
            </button>) : (<button className={`${btnClasses} hover:text-emerald-500`} onClick={() => setShowSignInModal(true)}>
              <outline_1.ArrowRightOnRectangleIcon className="mr-1 h-6 w-6"/>
              <span> Sign In</span>
            </button>)}
        </>)}
      {showSignInModal && <SignInModal_1.default setShow={setShowSignInModal}/>}
      {showSignOutModal && <SignOutModal_1.default setShow={setShowSignOutModal}/>}
    </div>);
};
exports.default = AuthShowcase;
