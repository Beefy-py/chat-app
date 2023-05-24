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
const outline_1 = require("@heroicons/react/24/outline");
const react_1 = __importStar(require("react"));
const CreateChatForm_1 = __importDefault(require("./CreateChatForm"));
const api_1 = require("@/utils/api");
const Loader_1 = __importDefault(require("../common/Loader"));
const react_2 = require("next-auth/react");
const ChatsHeader = () => {
    const { data: sessionData, status } = (0, react_2.useSession)();
    const [showCreateChatForm, setShowCreateChatForm] = (0, react_1.useState)(false);
    const { data: chatCount, isLoading } = api_1.api.chat.countChats.useQuery();
    return (<>
      <section className="relative mx-auto mb-2 w-full overflow-hidden rounded-md border-2 bg-white">
        <div className="flex-row items-center justify-between space-y-3 p-4 sm:flex sm:space-x-4 sm:space-y-0">
          <div>
            <h2 className="flex items-center font-semibold">
              <span className="text-gray-600"> Chats</span>
              {isLoading ? (<Loader_1.default extraClasses="h-5 w-5 ml-2"/>) : (<span className="ml-2 inline-block rounded border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  {chatCount !== null && chatCount !== void 0 ? chatCount : 0}
                </span>)}
            </h2>
            <p className="text-gray-500">Join a chat group or make your own.</p>
          </div>
          {status === "authenticated" && (<button type="button" onClick={() => setShowCreateChatForm(!showCreateChatForm)} className={`transition ${showCreateChatForm
                ? "border-gray-300 hover:bg-gray-200"
                : "border-emerald-700 bg-emerald-300 hover:bg-emerald-400"} flex items-center justify-center rounded-md border-2 px-8 py-2 text-sm font-medium text-gray-800 focus:outline-none`}>
              {showCreateChatForm ? (<outline_1.XMarkIcon className="mr-1 h-6 w-6"/>) : (<outline_1.PlusIcon className="mr-1 h-6 w-6"/>)}
              <span> {showCreateChatForm ? "Close" : "Create A Chat"}</span>
            </button>)}
        </div>
      </section>
      {showCreateChatForm && <CreateChatForm_1.default setShow={setShowCreateChatForm}/>}
    </>);
};
exports.default = ChatsHeader;
