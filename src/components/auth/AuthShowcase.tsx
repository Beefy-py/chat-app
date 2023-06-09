import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Loader from "@/components/common/Loader";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  PhotoIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import SignInModal from "./SignInModal";
import SignOutModal from "./SignOutModal";
import Image from "next/image";

const AuthShowcase: React.FC = () => {
  const { data: sessionData, status } = useSession();
  console.log(sessionData);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const btnClasses =
    "rounded-md sm:px-8 sm:py-2 font-semibold text-gray-800 no-underline transition flex items-center";

  return (
    <div className="mb-2 mt-10 flex w-full flex-col-reverse justify-between gap-4 pb-2 sm:flex-row sm:items-center">
      {status === "loading" ? (
        <Loader text="" />
      ) : (
        <>
          {sessionData ? (
            <div className="inline-flex items-center gap-2 text-lg text-gray-800">
              <p>Logged in as</p>
              <span className="font-semibold text-emerald-800">
                {sessionData.user?.name}
              </span>
              {sessionData.user ? (
                <div className="relative h-7 w-7">
                  {sessionData.user.image ? (
                    <Image
                      src={sessionData.user.image!}
                      fill
                      className="rounded-md"
                      alt={sessionData.user.name!}
                    />
                  ) : (
                    <UserCircleIcon
                      className={`
                     text-emerald-800
                    `}
                    />
                  )}
                </div>
              ) : (
                <PhotoIcon className="h-6 w-6" />
              )}
            </div>
          ) : (
            <p className="font-semibold text-gray-800">Unauthenticated</p>
          )}
          {sessionData ? (
            <button
              className={`${btnClasses} hover:text-red-500`}
              onClick={() => setShowSignOutModal(true)}
            >
              <ArrowLeftOnRectangleIcon className="mr-1 h-6 w-6" />
              <span>Sign out</span>
            </button>
          ) : (
            <button
              className={`${btnClasses} hover:text-emerald-500`}
              onClick={() => setShowSignInModal(true)}
            >
              <ArrowRightOnRectangleIcon className="mr-1 h-6 w-6" />
              <span> Sign In</span>
            </button>
          )}
        </>
      )}
      {showSignInModal && <SignInModal setShow={setShowSignInModal} />}
      {showSignOutModal && <SignOutModal setShow={setShowSignOutModal} />}
    </div>
  );
};

export default AuthShowcase;
