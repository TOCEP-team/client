'use client'

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccountId } from "@/features/walletSlice";
import { usePathname } from "next/navigation";


const UserInfo = ({userdata}) => {
  const [showResume, setShowResume] = useState(false); // State to manage the visibility of the pop-up
  const account = useSelector(selectAccountId);
  const url = usePathname();
  let user_id = url.split("/")[2]

  if (!userdata) {
    return null;
  }

  const {
    avatar,
    first_name,
    last_name,
    courses_owned,
    students,
    bio,
    nickname,
    created_at,
    updated_at,
    resume,
    total_credit,
  } = userdata.metadata;

  const toggleResume = () => {
    setShowResume((prevState) => !prevState); // Toggle the visibility state of the pop-up
  };

  return (
    <div className="border border-gray-400/30 shadow-md bg-light/30 rounded-md grid grid-cols-8 px-2 py-4">
      <div className="col-span-2 text-center flex flex-col justify-center items-center relative">
        <div className="relative">
        <img
          src={avatar ? avatar : "/images/logo.jpg"}
          alt="avatar"
          className="w-40 h-40 object-center object-cover"
        />
    <div className={`absolute -top-4 -right-4 font-bold border border-gray-500 w-12 h-12 flex items-center justify-center rounded-full ${total_credit <= 100 ? "bg-yellow-400" : "bg-green-400"}`} >{total_credit}</div>
        </div>
      </div>
      <div className="col-span-2">
        <h1>
          {first_name || last_name ? (
            <>
              <span className="font-bold">Fullname:</span> {first_name} {""}{" "} {last_name}
            </>
          ) : (
            <>
              <span className="font-bold">Fullname:</span> {nickname}
            </>
          )}
        </h1>
        <h1>
          <span className="font-bold">Courses Onwed:</span> {courses_owned}
        </h1>
        <h1>
          <span className="font-bold">Students:</span> {students}
        </h1>
        <p>
          <span className="font-bold">Created at</span>:{" "}
          {created_at ? new Date(created_at).toLocaleString().split(",")[0] : "N/A"}
        </p>
        <p>
          <span className="font-bold">Updated at</span>:{" "}
          {updated_at ? new Date(updated_at).toLocaleString().split(",")[0] : "N/A"}
        </p>
      </div>
      <div className="col-span-4">
        <p><span className="font-bold">About Me:</span> {bio}</p>
      </div>
      {account === user_id && 
      <div className="flex flex-col items-center col-span-8">
        <Link href="/profile/update" className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">Update Profile</Link>
      </div>
      }
    </div>
  );
};

export default UserInfo;
