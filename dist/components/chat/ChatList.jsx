"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const api_1 = require("@/utils/api");
const ChatItem_1 = __importDefault(require("./ChatItem"));
const Loader_1 = __importDefault(require("../common/Loader"));
const outline_1 = require("@heroicons/react/24/outline");
const ChatList = () => {
    const { data, isLoading, error, refetch } = api_1.api.chat.getAll.useQuery();
    if (isLoading)
        return <Loader_1.default text="Loading Chats" size="lg"/>;
    return (<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {data ? (data.map((chat) => <ChatItem_1.default key={chat.id} chat={chat}/>)) : (<div className="col-span-full flex h-full w-full items-center text-gray-500">
          <outline_1.FolderOpenIcon className="mr-2 h-10 w-10"/>
          <h2 className="text-lg font-semibold">There are no chats.</h2>
        </div>)}
    </div>);
};
exports.default = ChatList;
