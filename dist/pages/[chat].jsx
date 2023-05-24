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
const Loader_1 = __importDefault(require("@/components/common/Loader"));
const api_1 = require("@/utils/api");
const router_1 = require("next/router");
const react_1 = __importStar(require("react"));
const outline_1 = require("@heroicons/react/24/outline");
const extendedDayjs_1 = __importDefault(require("@/utils/extendedDayjs"));
const link_1 = __importDefault(require("next/link"));
const ChatMessageForm_1 = __importDefault(require("@/components/chat/ChatMessageForm"));
const react_2 = require("next-auth/react");
const SignInModal_1 = __importDefault(require("@/components/auth/SignInModal"));
const image_1 = __importDefault(require("next/image"));
function ChatPage() {
    const router = (0, router_1.useRouter)();
    const { chat: chatId } = router.query;
    const utils = api_1.api.useContext();
    const { data: sessionData, status } = (0, react_2.useSession)();
    const [showSignInModal, setShowSignInModal] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)("");
    const { data: chatData, isLoading: chatLoading, isError, error, } = api_1.api.chat.getOne.useQuery(chatId);
    const { data: messagesData, isLoading: messagesLoading } = api_1.api.message.getAllInChat.useQuery(chatId);
    const chatMutation = api_1.api.chat.joinChat.useMutation({
        async onSuccess() {
            // refetches chats after a chat is added
            console.log("Invalidate Chat. . .");
            await utils.chat.getOne.invalidate();
        },
    });
    const mayInteractWithChat = Boolean(status === "authenticated" &&
        (sessionData
            ? chatData === null || chatData === void 0 ? void 0 : chatData.users.find((user) => user.id === (sessionData === null || sessionData === void 0 ? void 0 : sessionData.user.id))
            : false) // user joined
    );
    const handleJoinGroup = () => {
        if (!chatMutation.isLoading) {
            if (status === "authenticated") {
                setErrorMessage("");
                chatMutation
                    .mutateAsync({ chatId: chatData === null || chatData === void 0 ? void 0 : chatData.id, userId: sessionData.user.id })
                    .then((res) => {
                    // console.log(res);
                })
                    .catch((err) => {
                    setErrorMessage("Something went wrong!");
                });
            }
            else {
                setShowSignInModal(true);
            }
        }
        else {
            console.warn("Hold on dude...");
        }
    };
    if (isError) {
        return (<main className="flex  h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="item-center flex text-3xl font-bold text-red-600">
            <outline_1.ExclamationCircleIcon className="h-10 w-10"/>
            <p className="ml-2">{error.message}</p>
          </div>
          <link_1.default href={"/"} className="group mt-2 flex items-center font-semibold text-emerald-800 hover:text-emerald-600">
            <outline_1.ArrowLeftIcon className="h-7 w-7 transition group-hover:-translate-x-4"/>
            <p>Back to all chats</p>
          </link_1.default>
        </div>
      </main>);
    }
    const [currentlyTyping, setCurrentlyTyping] = (0, react_1.useState)([]);
    api_1.api.message.whoIsTyping.useSubscription(undefined, {
        onData(data) {
            setCurrentlyTyping(data);
        },
    });
    return (<main className="container mx-auto h-screen max-w-screen-md px-4 py-20 lg:px-0">
      <link_1.default href={"/"} className="group flex items-center font-semibold text-emerald-800 transition hover:text-emerald-700">
        <outline_1.ArrowLeftIcon className="h-6 w-6 transition group-hover:-translate-x-1"/>
        <span className="ml-1 ">Back to chats</span>
      </link_1.default>
      {chatLoading ? (<Loader_1.default text="Loading chat. . ."/>) : (<>
          {chatData && (<section className="py-20">
              <div className="mb-2 flex flex-col items-center border-b-2 pb-2">
                <outline_1.ChatBubbleBottomCenterTextIcon className="h-20 w-20 text-emerald-600"/>
                <h1 className="mb-4 text-center text-2xl font-extrabold tracking-tight text-gray-800 sm:text-6xl md:text-4xl">
                  <span className="text-emerald-700">{chatData.name}</span> Chat
                </h1>
                <div className="">
                  <div className="grid grid-cols-2 divide-x-2">
                    <div className=" mr-2">
                      <p>{chatData.topic}</p>
                    </div>
                    <div className=" pl-2">
                      {!mayInteractWithChat ? (<>
                          {chatData.maxUsers === chatData.userCount ? (<button className="rounded-sm bg-red-500 p-0.5 px-2 text-white">
                              Full
                            </button>) : (<button onClick={handleJoinGroup} className="rounded-sm bg-emerald-500 p-0.5 px-2 text-white">
                              {chatMutation.isLoading
                            ? "Joining. . ."
                            : "Join Group"}
                            </button>)}
                        </>) : (<p className="font-semibold italic text-emerald-500">
                          Joined
                        </p>)}
                    </div>
                  </div>
                  <p>{chatData.description}</p>
                </div>
              </div>
              {mayInteractWithChat ? (<div className="rounded-md bg-slate-100 p-5">
                  <div className="system-message mb-4">
                    <p className="text-center font-semibold italic text-emerald-700">
                      {(0, extendedDayjs_1.default)(chatData.createdAt).format("LLL")}
                    </p>
                  </div>
                  {messagesLoading ? (<Loader_1.default extraClasses="w-7 h-7" text="Loading messages. . ."/>) : (<>
                      {messagesData ? (<>
                          {messagesData.map((message) => {
                                const isCurrentUser = message.userId === (sessionData === null || sessionData === void 0 ? void 0 : sessionData.user.id);
                                const currentMessageIndex = messagesData.findIndex((m) => m.id === message.id);
                                const previousMessage = messagesData[currentMessageIndex - 1];
                                const currentMessage = messagesData[currentMessageIndex];
                                // console.log(
                                //   `Difference between [${
                                //     currentMessage?.content
                                //   }] and [${
                                //     previousMessage?.content
                                //   }] is ${extendedDayjs(
                                //     currentMessage?.createdAt
                                //   ).diff(previousMessage?.createdAt, "h")}`
                                // );
                                const hourDiffernceBetweenMessages = (0, extendedDayjs_1.default)(currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.createdAt).diff(previousMessage === null || previousMessage === void 0 ? void 0 : previousMessage.createdAt, "h");
                                const dayDiffernceBetweenMessages = (0, extendedDayjs_1.default)(currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.createdAt).diff(previousMessage === null || previousMessage === void 0 ? void 0 : previousMessage.createdAt, "d");
                                // console.log(
                                //   `[${currentMessage?.content}] is after [${
                                //     previousMessage?.content
                                //   }] ===  ${extendedDayjs(
                                //     currentMessage?.createdAt
                                //   ).isAfter(previousMessage?.createdAt, "d")}`
                                // );
                                const previousMessageWasYesterday = (0, extendedDayjs_1.default)(currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.createdAt).isAfter(previousMessage === null || previousMessage === void 0 ? void 0 : previousMessage.createdAt, "d");
                                return (<>
                                {previousMessageWasYesterday && (<div className="system-message w-full">
                                    <p className="py-4 text-center font-semibold italic text-emerald-700">
                                      {(0, extendedDayjs_1.default)(currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.createdAt).format("LLLL")}
                                    </p>
                                  </div>)}
                                <div key={message.id} className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}>
                                  <div className="chat-image avatar">
                                    {message.userImage ? (<div className="relative w-10">
                                        <image_1.default src={message.userImage} className="rounded-full" fill alt={message.userName} sizes="(max-width: 768px) 100vw,
                                                 (max-width: 1200px) 50vw,
                                                 33vw"/>
                                      </div>) : (<outline_1.UserCircleIcon className={`h-10 w-10 ${isCurrentUser
                                            ? "text-emerald-800"
                                            : ""}`}/>)}
                                  </div>

                                  <div className={`chat-bubble rounded-md ${isCurrentUser
                                        ? "bg-emerald-200 text-gray-800"
                                        : ""}`}>
                                    <div className="chat-header mb-2">
                                      <time className={`${isCurrentUser
                                        ? "text-gray-600"
                                        : "text-emerald-200"} text-xs`}>
                                        {(0, extendedDayjs_1.default)(message.createdAt).format("HH:mm")}
                                      </time>
                                      <p> {message.userName}</p>
                                    </div>
                                    <p className={`break-words opacity-80`}>
                                      {message.content}
                                    </p>
                                  </div>
                                </div>
                              </>);
                            })}
                          <p className="bold h-2 animate-pulse italic text-gray-500 md:h-4">
                            {currentlyTyping.length
                                ? `${currentlyTyping.join(", ")} typing...`
                                : ""}
                          </p>
                        </>) : ("ghost town. . .")}
                    </>)}
                </div>) : (<div className="flex h-full items-center justify-center p-6">
                  <h2 className="text-lg font-semibold md:text-xl">
                    Join This Group To Chat
                  </h2>
                </div>)}

              {mayInteractWithChat && <ChatMessageForm_1.default chatId={chatId}/>}
            </section>)}
        </>)}

      {showSignInModal && <SignInModal_1.default setShow={setShowSignInModal}/>}
    </main>);
}
exports.default = ChatPage;
