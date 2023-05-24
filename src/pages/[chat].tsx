import Loader from "@/components/common/Loader";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  ArrowLeftIcon,
  ChatBubbleBottomCenterTextIcon,
  ExclamationCircleIcon,
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
  const { chat: chatId } = router.query as ChatRouteQuery;
  const utils = api.useContext();
  const { data: sessionData, status } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    data: chatData,
    isLoading: chatLoading,
    isError,
    error,
  } = api.chat.getOne.useQuery(chatId);

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

  if (isError) {
    return (
      <main className="flex  h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="item-center flex text-3xl font-bold text-red-600">
            <ExclamationCircleIcon className="h-10 w-10" />
            <p className="ml-2">{error.message}</p>
          </div>
          <Link
            href={"/"}
            className="group mt-2 flex items-center font-semibold text-emerald-800 hover:text-emerald-600"
          >
            <ArrowLeftIcon className="h-7 w-7 transition group-hover:-translate-x-4" />
            <p>Back to all chats</p>
          </Link>
        </div>
      </main>
    );
  }

  const [currentlyTyping, setCurrentlyTyping] = useState<string[]>([]);
  api.message.whoIsTyping.useSubscription(undefined, {
    onData(data) {
      setCurrentlyTyping(data);
    },
  });

  return (
    <main className="container mx-auto h-screen max-w-screen-md px-4 py-20 lg:px-0">
      <Link
        href={"/"}
        className="group flex items-center font-semibold text-emerald-800 transition hover:text-emerald-700"
      >
        <ArrowLeftIcon className="h-6 w-6 transition group-hover:-translate-x-1" />
        <span className="ml-1 ">Back to chats</span>
      </Link>
      {chatLoading ? (
        <Loader text="Loading chat. . ." />
      ) : (
        <>
          {chatData && (
            <section className="py-20">
              <div className="mb-2 flex flex-col items-center border-b-2 pb-2">
                <ChatBubbleBottomCenterTextIcon className="h-20 w-20 text-emerald-600" />
                <h1 className="mb-4 text-center text-2xl font-extrabold tracking-tight text-gray-800 sm:text-6xl md:text-4xl">
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
                  <div className="system-message mb-4">
                    <p className="text-center font-semibold italic text-emerald-700">
                      {extendedDayjs(chatData.createdAt).format("LLL")}
                    </p>
                  </div>
                  {messagesLoading ? (
                    <Loader
                      extraClasses="w-7 h-7"
                      text="Loading messages. . ."
                    />
                  ) : (
                    <>
                      {messagesData ? (
                        <>
                          {messagesData.map((message) => {
                            const isCurrentUser =
                              message.userId === sessionData?.user.id;
                            const currentMessageIndex = messagesData.findIndex(
                              (m) => m.id === message.id
                            );
                            const previousMessage =
                              messagesData[currentMessageIndex - 1];

                            const currentMessage =
                              messagesData[currentMessageIndex];

                            // console.log(
                            //   `Difference between [${
                            //     currentMessage?.content
                            //   }] and [${
                            //     previousMessage?.content
                            //   }] is ${extendedDayjs(
                            //     currentMessage?.createdAt
                            //   ).diff(previousMessage?.createdAt, "h")}`
                            // );

                            const hourDiffernceBetweenMessages = extendedDayjs(
                              currentMessage?.createdAt
                            ).diff(previousMessage?.createdAt, "h");

                            const dayDiffernceBetweenMessages = extendedDayjs(
                              currentMessage?.createdAt
                            ).diff(previousMessage?.createdAt, "d");

                            // console.log(
                            //   `[${currentMessage?.content}] is after [${
                            //     previousMessage?.content
                            //   }] ===  ${extendedDayjs(
                            //     currentMessage?.createdAt
                            //   ).isAfter(previousMessage?.createdAt, "d")}`
                            // );

                            const previousMessageWasYesterday = extendedDayjs(
                              currentMessage?.createdAt
                            ).isAfter(previousMessage?.createdAt, "d");

                            return (
                              <>
                                {previousMessageWasYesterday && (
                                  <div className="system-message w-full">
                                    <p className="py-4 text-center font-semibold italic text-emerald-700">
                                      {extendedDayjs(
                                        currentMessage?.createdAt
                                      ).format("LLLL")}
                                    </p>
                                  </div>
                                )}
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
                                          sizes="(max-width: 768px) 100vw,
                                                 (max-width: 1200px) 50vw,
                                                 33vw"
                                        />
                                      </div>
                                    ) : (
                                      <UserCircleIcon
                                        className={`h-10 w-10 ${
                                          isCurrentUser
                                            ? "text-emerald-800"
                                            : ""
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
                                        {extendedDayjs(
                                          message.createdAt
                                        ).format("HH:mm")}
                                      </time>
                                      <p> {message.userName}</p>
                                    </div>
                                    <p className={`break-words opacity-80`}>
                                      {message.content}
                                    </p>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                          <p className="bold h-2 animate-pulse italic text-gray-500 md:h-4">
                            {currentlyTyping.length
                              ? `${currentlyTyping.join(", ")} typing...`
                              : ""}
                          </p>
                        </>
                      ) : (
                        "ghost town. . ."
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-6">
                  <h2 className="text-lg font-semibold md:text-xl">
                    Join This Group To Chat
                  </h2>
                </div>
              )}

              {mayInteractWithChat && <ChatMessageForm chatId={chatId} />}
            </section>
          )}
        </>
      )}

      {showSignInModal && <SignInModal setShow={setShowSignInModal} />}
    </main>
  );
}

export default ChatPage;
