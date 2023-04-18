import Loader from "@/components/common/Loader";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  ArrowLeftIcon,
  ChatBubbleBottomCenterTextIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import extendedDayjs from "@/utils/extendedDayjs";
import Link from "next/link";
import ChatMessageForm from "@/components/chat/ChatMessageForm";
import { useSession } from "next-auth/react";
import SignInModal from "@/components/auth/SignInModal";
import Image from "next/image";

type ChatRouteQuery = {
  chat: string;
};

function ChatPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { data: sessionData, status } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { chat: chatId } = router.query as ChatRouteQuery;

  const { data: chatData, isLoading: chatLoading } =
    api.chat.getOne.useQuery(chatId);

  const { data: messagesData, isLoading: messagesLoading } =
    api.message.getAllInChat.useQuery(chatId);

  const chatMutation = api.chat.joinChat.useMutation({
    async onSuccess() {
      // refetches chats after a chat is added
      console.log("Invalidate Chat. . .");
      await utils.chat.getOne.invalidate();
    },
  });

  const mayInteractWithChat = Boolean(
    status === "authenticated" &&
      (sessionData
        ? chatData?.users.find((user) => user.id === sessionData?.user.id)
        : false) // user joined
  );

  const handleJoinGroup = () => {
    if (!chatMutation.isLoading) {
      if (status === "authenticated") {
        setErrorMessage("");

        chatMutation
          .mutateAsync({ chatId: chatData?.id!, userId: sessionData.user.id })
          .then((res) => {
            // console.log(res);
          })
          .catch((err) => {
            setErrorMessage("Something went wrong!");
          });
      } else {
        setShowSignInModal(true);
      }
    } else {
      console.warn("Hold on dude...");
    }
  };

  return (
    <main className="container mx-auto h-screen max-w-screen-md py-20">
      <Link
        href={"/"}
        className="group flex items-center font-semibold text-emerald-800"
      >
        <ArrowLeftIcon className="h-6 w-6 transition group-hover:-translate-x-1" />
        <span className="ml-1 ">Back to chats</span>
      </Link>
      {chatLoading ? (
        <div className="flex h-full items-center justify-center py-10">
          <Loader
            text="Loading Chat. . ."
            size="4xl"
            extraClasses="w-12 h-12"
          />
        </div>
      ) : (
        <>
          {chatData ? (
            <section className="py-20">
              <div className="mb-2 flex flex-col items-center border-b-2 pb-2">
                <ChatBubbleBottomCenterTextIcon className="h-20 w-20 text-emerald-600" />
                <h1 className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-800 sm:text-6xl">
                  <span className="text-emerald-700">{chatData.name}</span> Chat
                </h1>
                <div className="">
                  <div className="grid grid-cols-2 divide-x-2">
                    <div className=" mr-2">
                      <p>{chatData.topic}</p>
                    </div>
                    <div className=" pl-2">
                      {!mayInteractWithChat ? (
                        <>
                          {chatData.maxUsers === chatData.userCount ? (
                            <button className="rounded-sm bg-red-500 p-0.5 px-2 text-white">
                              Full
                            </button>
                          ) : (
                            <button
                              onClick={handleJoinGroup}
                              className="rounded-sm bg-emerald-500 p-0.5 px-2 text-white"
                            >
                              {chatMutation.isLoading
                                ? "Joining. . ."
                                : "Join Group"}
                            </button>
                          )}
                        </>
                      ) : (
                        <p className="font-semibold italic text-emerald-500">
                          Joined
                        </p>
                      )}
                    </div>
                  </div>
                  <p>{chatData.description}</p>
                </div>
              </div>
              {mayInteractWithChat ? (
                <div className="rounded-md bg-slate-100 p-5">
                  <div className="system-message mb-3">
                    <p className="text-center">
                      {extendedDayjs(chatData.createdAt).format("LLLL")}
                    </p>
                  </div>
                  {messagesLoading ? (
                    <Loader
                      extraClasses="w-7 h-7"
                      text="Loading messages. . ."
                    />
                  ) : (
                    <>
                      {messagesData
                        ? messagesData.map((message) => {
                            const isCurrentUser =
                              message.userId === sessionData?.user.id;
                            return (
                              <div
                                key={message.id}
                                className={`chat ${
                                  isCurrentUser ? "chat-end" : "chat-start"
                                }`}
                              >
                                <div className="chat-image avatar">
                                  {message.userImage ? (
                                    <div className="relative w-10">
                                      <Image
                                        src={message.userImage}
                                        className="rounded-full"
                                        fill
                                        alt={message.userName}
                                      />
                                    </div>
                                  ) : (
                                    <UserCircleIcon
                                      className={`h-10 w-10 ${
                                        isCurrentUser ? "text-emerald-800" : ""
                                      }`}
                                    />
                                  )}
                                </div>

                                <div
                                  className={`chat-bubble rounded-md ${
                                    isCurrentUser
                                      ? "bg-emerald-200 text-gray-800"
                                      : ""
                                  }`}
                                >
                                  <div className="chat-header mb-2">
                                    <time
                                      className={`${
                                        isCurrentUser
                                          ? "text-gray-600"
                                          : "text-emerald-200"
                                      } text-xs`}
                                    >
                                      {extendedDayjs(message.createdAt).format(
                                        "HH:mm"
                                      )}
                                    </time>
                                    <p> {message.userName}</p>
                                  </div>
                                  <p className={`break-words opacity-80`}>
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        : "ghost town. . ."}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-6">
                  <h2 className="text-xl font-semibold">
                    Join This Group To Chat
                  </h2>
                </div>
              )}

              {mayInteractWithChat && <ChatMessageForm chatId={chatId} />}
            </section>
          ) : (
            "NOTHING"
          )}
        </>
      )}
      {showSignInModal && <SignInModal setShow={setShowSignInModal} />}
    </main>
  );
}

export default ChatPage;
