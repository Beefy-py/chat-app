import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import CreateChatForm from "./CreateChatForm";
import { api } from "@/utils/api";
import Loader from "../common/Loader";
import { useSession } from "next-auth/react";

const ChatsHeader = () => {
  const { data: sessionData, status } = useSession();
  const [showCreateChatForm, setShowCreateChatForm] = useState(false);
  const { data: chatCount, isLoading } = api.chat.countChats.useQuery();

  return (
    <>
      <section className="relative mx-auto mb-2 w-full overflow-hidden rounded-md border-2 bg-white">
        <div className="flex-row items-center justify-between space-y-3 p-4 sm:flex sm:space-x-4 sm:space-y-0">
          <div>
            <h2 className="flex items-center font-semibold">
              <span className="text-gray-600"> Chats</span>
              {isLoading ? (
                <Loader extraClasses="h-5 w-5 ml-2" />
              ) : (
                <span className="ml-2 inline-block rounded border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  {chatCount ?? 0}
                </span>
              )}
            </h2>
            <p className="text-gray-500">Join a chat group or make your own.</p>
          </div>
          {status === "authenticated" && (
            <button
              type="button"
              onClick={() => setShowCreateChatForm(!showCreateChatForm)}
              className={`transition ${
                showCreateChatForm
                  ? "border-gray-300 hover:bg-gray-200"
                  : "border-emerald-700 bg-emerald-300 hover:bg-emerald-400"
              } flex items-center justify-center rounded-md border-2 px-8 py-2 text-sm font-medium text-gray-800 focus:outline-none`}
            >
              {showCreateChatForm ? (
                <XMarkIcon className="mr-1 h-6 w-6" />
              ) : (
                <PlusIcon className="mr-1 h-6 w-6" />
              )}
              <span> {showCreateChatForm ? "Close" : "Create A Chat"}</span>
            </button>
          )}
        </div>
      </section>
      {showCreateChatForm && <CreateChatForm setShow={setShowCreateChatForm} />}
    </>
  );
};

export default ChatsHeader;
