"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@/utils/api");
const outline_1 = require("@heroicons/react/24/outline");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_2 = require("next-auth/react");
const Loader_1 = __importDefault(require("../common/Loader"));
const CreateChatForm = ({ setShow }) => {
    const { data: sessionData, status } = (0, react_2.useSession)();
    const { register, handleSubmit, reset, formState: { errors }, } = (0, react_hook_form_1.useForm)();
    const [errorMessage, setErrorMessage] = (0, react_1.useState)("");
    const utils = api_1.api.useContext();
    const chatMutation = api_1.api.chat.createChat.useMutation({
        async onSuccess() {
            // refetches chats after a chat is added
            console.log("Invalidate Chats. . .");
            await utils.chat.getAll.invalidate();
            await utils.chat.countChats.invalidate();
        },
    });
    const createChat = async (data) => {
        setErrorMessage("");
        chatMutation
            .mutateAsync({ ...data, creator: sessionData === null || sessionData === void 0 ? void 0 : sessionData.user.id })
            .then((res) => {
            // console.log(res);
            reset();
            setShow(false);
        })
            .catch((err) => {
            setErrorMessage("Something went wrong!");
        });
    };
    const inputClasses = "block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-800 focus:border-emerald-600 focus:outline-none";
    const displayInputError = (inputError) => {
        var _a;
        if (!inputError)
            return "";
        return (<div className="mt-2 flex items-center font-semibold text-red-600">
        <outline_1.ExclamationTriangleIcon className="mr-2 h-6 w-6"/>
        <p>{(_a = inputError.message) !== null && _a !== void 0 ? _a : "Error"}</p>
      </div>);
    };
    return (<section className="relative mb-5 rounded-md border-2 bg-white">
      {/* Up carot */}
      <div className="absolute -top-[0.7rem] right-2/4 border-b-[0.7rem] border-l-[0.4rem] border-r-[0.4rem] border-b-gray-300 border-l-transparent border-r-transparent"></div>
      {/* Loading display */}

      {chatMutation.isLoading && (<div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-md bg-black/60">
          <Loader_1.default text="Creating Chat. . ." size="2xl"/>
        </div>)}

      <div className="mx-auto max-w-2xl px-2 py-8 ">
        <form action="#" onSubmit={handleSubmit(createChat)}>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-800">
                Name
              </label>
              <input type="text" id="name" {...register("name", {
        required: { value: true, message: "Your chat needs a name" },
        maxLength: 50,
    })} className={`${inputClasses}`} placeholder="Chat name"/>
              {displayInputError(errors.name)}
            </div>
            <div>
              <label htmlFor="topic" className="mb-2 block text-sm font-medium text-gray-800">
                Topic
              </label>
              <select id="topic" {...register("topic")} className={`${inputClasses}`}>
                <option value="Random">Random</option>
                <option value="TV">TV/Monitors</option>
                <option value="PC">PC</option>
                <option value="GA">Gaming/Console</option>
                <option value="PH">Phones</option>
              </select>{" "}
              {displayInputError(errors.topic)}
            </div>
            <div>
              <label htmlFor="maxUsers" className="mb-2 block text-sm font-medium text-gray-800">
                Max users
              </label>
              <input type="number" {...register("maxUsers", {
        required: {
            value: true,
            message: "Specify a max number of users",
        },
        min: {
            value: 2,
            message: "You need company",
        },
        max: {
            value: 10,
            message: "Okay, that's too much company",
        },
        valueAsNumber: true,
        setValueAs: (v) => parseInt(v),
    })} id="maxUsers" className={`${inputClasses}`} placeholder="3"/>{" "}
              {displayInputError(errors.maxUsers)}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-800">
                Description
              </label>
              <textarea id="description" {...register("description", { required: false })} rows={8} className={`${inputClasses}`} placeholder="Chat description"></textarea>
              {displayInputError(errors.description)}
            </div>
          </div>
          <button type="submit" className="mt-4 inline-flex items-center rounded-md border-2 border-emerald-700 bg-emerald-300 px-5 py-2.5 text-center text-sm font-medium text-gray-800 transition hover:bg-emerald-400 sm:mt-6">
            Confirm
          </button>
        </form>
        {errorMessage && (<div className="mt-2 flex items-center border-t pt-2 font-semibold text-red-600">
            <outline_1.ExclamationTriangleIcon className="mr-2 h-6 w-6"/>
            <p>{errorMessage}</p>
          </div>)}
      </div>
    </section>);
};
exports.default = CreateChatForm;
