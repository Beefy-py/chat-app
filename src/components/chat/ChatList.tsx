import React from "react";
import { api, type RouterOutputs } from "@/utils/api";
import ChatItem from "./ChatItem";
import Loader from "../common/Loader";
import { ArchiveBoxIcon, FolderOpenIcon } from "@heroicons/react/24/outline";

type Chats = RouterOutputs["chat"]["getAll"];
type Chat = RouterOutputs["chat"]["getAll"][0];

const ChatList = () => {
  const { data, isLoading, error, refetch } = api.chat.getAll.useQuery();

  if (isLoading) return <Loader text="Loading Chats" size="lg" />;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {data ? (
        data.map((chat: Chat) => <ChatItem key={chat.id} chat={chat} />)
      ) : (
        <div className="col-span-full flex h-full w-full items-center text-gray-500">
          <FolderOpenIcon className="mr-2 h-10 w-10" />
          <h2 className="text-lg font-semibold">There are no chats.</h2>
        </div>
      )}
    </div>
  );
};

export default ChatList;
