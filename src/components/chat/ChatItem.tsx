import React from "react";
import { api, type RouterOutputs } from "@/utils/api";
import Link from "next/link";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import extendedDayjs from "@/utils/extendedDayjs";

type Chat = RouterOutputs["chat"]["getAll"][0];

const ChatItem = ({ chat }: { chat: Chat }) => {
  return (
    <Link
      href={{ pathname: `/${chat.id}` }}
      className="flex w-full cursor-pointer flex-col justify-between rounded-md border-2 bg-white p-4 leading-normal transition hover:shadow-md"
    >
      <div className="space-y-1">
        <p className="flex items-center text-sm text-gray-600">
          <UserGroupIcon className="h-6 w-6" />
          <span className="ml-2 font-semibold">
            {chat.userCount} / {chat.maxUsers}
          </span>
        </p>
        <h2 className="text-xl font-bold text-emerald-800">{chat.name}</h2>
        <p className="text-sm font-semibold text-gray-400">
          Created, {extendedDayjs(chat.createdAt).fromNow()}
        </p>
        <p className="text-sm text-emerald-600">
          Last message: {extendedDayjs(chat.lastMessageDate).fromNow()}
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
    </Link>
  );
};

export default ChatItem;
