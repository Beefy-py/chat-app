import Loader from "@/components/common/Loader";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import extendedDayjs from "@/utils/extendedDayjs";
import Link from "next/link";
import ChatMessageForm from "@/components/ChatMessageForm";
import { useSession } from "next-auth/react";
import SignInModal from "@/components/SignInModal";

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
        : false)
  );

  const handleJoinGroup = () => {
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
    }
    setShowSignInModal(true);
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
                      <p>members online</p>
                    </div>
                    <div className=" pl-2">
                      <button
                        onClick={handleJoinGroup}
                        className="rounded-md bg-emerald-500 p-0.5 px-2 text-white"
                      >
                        Join Group
                      </button>
                    </div>
                  </div>
                  <p>{chatData.description}</p>
                </div>
              </div>
              {mayInteractWithChat ? (
                <div className="rounded-md bg-slate-100 p-5">
                  <div>
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
                        ? messagesData.map((message) => (
                            <div key={message.id} className="mt-2">
                              <p>{message.content}</p>
                            </div>
                          ))
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
