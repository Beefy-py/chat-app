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
const react_1 = require("next-auth/react");
const react_2 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const Loader_1 = __importDefault(require("../common/Loader"));
const ChatMessageForm = ({ chatId }) => {
    const utils = api_1.api.useContext();
    const messageMutation = api_1.api.message.createMessage.useMutation({
        async onSuccess() {
            // refetches chats after a chat is added
            console.log("Invalidate Messages. . .");
            await utils.message.getAllInChat.invalidate();
        },
    });
    const { data: sessionData, status } = (0, react_1.useSession)();
    const { register, handleSubmit, reset, formState: { errors }, } = (0, react_hook_form_1.useForm)();
    const [errorMessage, setErrorMessage] = (0, react_2.useState)("");
    const isTyping = api_1.api.message.isTyping.useMutation();
    const sendMessage = async (data) => {
        const { user } = sessionData;
        const { name, id, image } = user;
        setErrorMessage("");
        // console.debug("SESSION USER ID", sessionData!.user.id);
        const message = {
            ...data,
            chatId,
            userId: id,
            userName: name,
            userImage: image,
            lastMessageDate: new Date(),
        };
        messageMutation
            .mutateAsync(message)
            .then((res) => {
            // console.log(res);
            reset();
        })
            .catch((err) => {
            setErrorMessage("Something went wrong!");
        });
    };
    return (<form className="mt-2" onSubmit={handleSubmit(sendMessage)}>
      <div className="mb-4 w-full rounded-md border border-gray-200 bg-gray-50">
        <div className="rounded-t-md bg-white px-4 py-2">
          <label htmlFor="content" className="sr-only">
            Your message
          </label>
          <textarea id="content" rows={3} className="w-full border-0 bg-white px-0 text-sm text-gray-900 outline-none focus:ring-0" placeholder="Write a message..." {...register("content", {
        required: { value: true, message: "You can't just send nothing" },
    })} onKeyDown={async (e) => {
            isTyping.mutate({ typing: true });
        }} onBlur={() => {
            isTyping.mutate({ typing: false });
        }}></textarea>
          {errors.content && (<div className="flex items-center text-red-600">
              <outline_1.ExclamationTriangleIcon className="mr-2 h-6 w-6"/>
              <p className="font-semibold">{errors.content.message}</p>
            </div>)}
        </div>
        <div className="flex items-center justify-between rounded-b-md border-t bg-white px-3 py-2">
          <div className="flex cursor-not-allowed space-x-1 pl-0 sm:pl-2">
            <button type="button" className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
              <outline_1.PaperClipIcon className="h-6 w-6"/>
              <span className="sr-only">Attach file</span>
            </button>
            <button type="button" className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
              <outline_1.MapPinIcon className="h-6 w-6"/>
              <span className="sr-only">Set location</span>
            </button>
            <button type="button" className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
              <outline_1.PhotoIcon className="h-6 w-6"/>
              <span className="sr-only">Upload image</span>
            </button>
          </div>
          {messageMutation.isLoading ? (<Loader_1.default text="Sending. . ."/>) : (<button type="submit" className="inline-flex items-center rounded-md bg-emerald-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-200">
              Post message
            </button>)}
        </div>
      </div>
    </form>);
};
exports.default = ChatMessageForm;
