"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const outline_1 = require("@heroicons/react/24/outline");
const extendedDayjs_1 = __importDefault(require("@/utils/extendedDayjs"));
const ChatItem = ({ chat }) => {
    return (<link_1.default href={{ pathname: `/${chat.id}` }} className="flex w-full cursor-pointer flex-col justify-between rounded-md border-2 bg-white p-4 leading-normal transition hover:shadow-md">
      <div className="space-y-1">
        <p className="flex items-center text-sm text-gray-600">
          <outline_1.UserGroupIcon className="h-6 w-6"/>
          <span className="ml-2 font-semibold">
            {chat.userCount} / {chat.maxUsers}
          </span>
        </p>
        <h2 className="text-xl font-bold text-emerald-800">{chat.name}</h2>
        <p className="text-sm font-semibold text-gray-400">
          Created, {(0, extendedDayjs_1.default)(chat.createdAt).fromNow()}
        </p>
        <p className="text-sm text-emerald-600">
          Last message: {(0, extendedDayjs_1.default)(chat.lastMessageDate).fromNow()}
        </p>
        <p className="text-sm text-gray-700">
          <span className="text-emerald-800">{chat.messageCount}</span>
          <span className="ml-1">messages</span>
        </p>
      </div>
      {/* <div className="flex items-center">
            <div className="relative h-8 w-8">
              <Image
                className="mr-4 h-10 w-10 rounded-full"
                src="/img/jonathan.jpg"
                alt="Avatar of Jonathan Reinink"
                fill
              />
            </div>
            <div className="text-sm">
              <p className="leading-none text-gray-900">Jonathan Reinink</p>
              <p className="text-gray-600">Aug 18</p>
            </div>
          </div> */}
    </link_1.default>);
};
exports.default = ChatItem;
