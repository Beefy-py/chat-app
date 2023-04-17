import { api } from "@/utils/api";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { TRPCClientErrorBase, type TRPCClientError } from "@trpc/client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Loader from "./common/Loader";
import { useSession } from "next-auth/react";

type Props = {
  setShow: Function;
};

type FormInput = {
  name: string;
  maxUsers: number;
  topic: string;
  description: string;
};

const CreateChatForm = ({ setShow }: Props) => {
  const { data: sessionData, status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const utils = api.useContext();
  const chatMutation = api.chat.createChat.useMutation({
    async onSuccess() {
      // refetches chats after a chat is added
      console.log("Invalidate Chats. . .");
      await utils.chat.getAll.invalidate();
      await utils.chat.countChats.invalidate();
    },
  });

  const createChat: SubmitHandler<FormInput> = async (data) => {
    setErrorMessage("");
    console.log(data);

    chatMutation
      .mutateAsync({ ...data, creator: sessionData?.user.id! })
      .then((res) => {
        // console.log(res);
        reset();
        setShow(false);
      })
      .catch((err) => {
        setErrorMessage("Something went wrong!");
      });
  };

  const inputClasses =
    "block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-800 focus:border-emerald-600 focus:outline-none";

  const displayInputError = (inputError: any) => {
    if (!inputError) return "";
    return (
      <div className="mt-2 flex items-center font-semibold text-red-600">
        <ExclamationTriangleIcon className="mr-2 h-6 w-6" />
        <p>{inputError.message ?? "Error"}</p>
      </div>
    );
  };

  return (
    <section className="relative mb-5 rounded-md border-2 bg-white">
      {/* Up carot */}
      <div className="absolute -top-[0.7rem] right-2/4 border-b-[0.7rem] border-l-[0.4rem] border-r-[0.4rem] border-b-gray-300 border-l-transparent border-r-transparent"></div>
      {/* Loading display */}

      {chatMutation.isLoading && (
        <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-md bg-black/60">
          <Loader text="Creating Chat. . ." size="2xl" />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-2 py-8 ">
        <form action="#" onSubmit={handleSubmit(createChat)}>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", {
                  required: { value: true, message: "Your chat needs a name" },
                  maxLength: 50,
                })}
                className={`${inputClasses}`}
                placeholder="Chat name"
              />
              {displayInputError(errors.name)}
            </div>
            <div>
              <label
                htmlFor="topic"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Topic
              </label>
              <select
                id="topic"
                {...register("topic")}
                className={`${inputClasses}`}
              >
                <option value="Random">Random</option>
                <option value="TV">TV/Monitors</option>
                <option value="PC">PC</option>
                <option value="GA">Gaming/Console</option>
                <option value="PH">Phones</option>
              </select>{" "}
              {displayInputError(errors.topic)}
            </div>
            <div>
              <label
                htmlFor="maxUsers"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Max users
              </label>
              <input
                type="number"
                {...register("maxUsers", {
                  required: {
                    value: true,
                    message: "Specify a max number of users",
                  },
                  min: {
                    value: 2,
                    message: "You need company",
                  },
                  max: {
                    value: 10,
                    message: "Okay, that's too much company",
                  },
                  valueAsNumber: true,
                  setValueAs: (v) => parseInt(v),
                })}
                id="maxUsers"
                className={`${inputClasses}`}
                placeholder="3"
              />{" "}
              {displayInputError(errors.maxUsers)}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Description
              </label>
              <textarea
                id="description"
                {...register("description", { required: false })}
                rows={8}
                className={`${inputClasses}`}
                placeholder="Chat description"
              ></textarea>
              {displayInputError(errors.description)}
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 inline-flex items-center rounded-md border-2 border-emerald-700 bg-emerald-300 px-5 py-2.5 text-center text-sm font-medium text-gray-800 transition hover:bg-emerald-400 sm:mt-6"
          >
            Confirm
          </button>
        </form>
        {errorMessage && (
          <div className="mt-2 flex items-center border-t pt-2 font-semibold text-red-600">
            <ExclamationTriangleIcon className="mr-2 h-6 w-6" />
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CreateChatForm;
