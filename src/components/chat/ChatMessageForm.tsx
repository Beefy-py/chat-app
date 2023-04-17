import { api } from "@/utils/api";
import {
  MapPinIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Loader from "../common/Loader";

type Props = {
  chatId: string;
};

type FormInput = {
  content: string;
};

const ChatMessageForm = ({ chatId }: Props) => {
  const utils = api.useContext();
  const messageMutation = api.message.createMessage.useMutation({
    async onSuccess() {
      // refetches chats after a chat is added
      console.log("Invalidate Messages. . .");
      await utils.message.getAllInChat.invalidate();
    },
  });

  const { data: sessionData, status } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const sendMessage: SubmitHandler<FormInput> = async (data) => {
    setErrorMessage("");
    // console.debug("SESSION USER ID", sessionData!.user.id);
    const message = { ...data, chatId, userId: sessionData!.user.id };
    console.log(message);

    messageMutation
      .mutateAsync(message)
      .then((res) => {
        // console.log(res);
        reset();
      })
      .catch((err) => {
        setErrorMessage("Something went wrong!");
      });
  };
  return (
    <form className="mt-2" onSubmit={handleSubmit(sendMessage)}>
      <div className="mb-4 w-full rounded-md border border-gray-200 bg-gray-50">
        <div className="rounded-t-md bg-white px-4 py-2">
          <label htmlFor="content" className="sr-only">
            Your message
          </label>
          <textarea
            id="content"
            rows={3}
            className="w-full border-0 bg-white px-0 text-sm text-gray-900 outline-none focus:ring-0"
            placeholder="Write a message..."
            {...register("content")}
          ></textarea>
        </div>
        <div className="flex items-center justify-between rounded-b-md border-t bg-white px-3 py-2">
          <div className="flex cursor-not-allowed space-x-1 pl-0 sm:pl-2">
            <button
              type="button"
              className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <PaperClipIcon className="h-6 w-6" />
              <span className="sr-only">Attach file</span>
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <MapPinIcon className="h-6 w-6" />
              <span className="sr-only">Set location</span>
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <PhotoIcon className="h-6 w-6" />
              <span className="sr-only">Upload image</span>
            </button>
          </div>
          {messageMutation.isLoading ? (
            <Loader text="Sending. . ." />
          ) : (
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-emerald-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-200"
            >
              Post message
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ChatMessageForm;
