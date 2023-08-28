'use client'

import React, { useState } from "react";


const InstructorInfo = ({userdata}) => {
  const [showResume, setShowResume] = useState(false); // State to manage the visibility of the pop-up

  if (!userdata) {
    return null;
  }

  const {
    avatar,
    first_name,
    last_name,
    courses_owned,
    students,
    nickname,
    total_credit,
  } = userdata.metadata;

  return (
    <div className="border border-gray-400 rounded-md grid grid-cols-8 px-2 py-4 space-x-4">
      <div className="col-span-4 text-center flex flex-col justify-center items-center relative">
        <div className="relative">
        <img
          src={avatar ? avatar : "/images/logo.jpg"}
          alt="avatar"
          className="w-40 h-40 object-center object-cover"
        />
          <div className={`absolute -top-4 -right-4 font-bold border border-gray-500 w-12 h-12 flex items-center justify-center rounded-full ${total_credit <= 100 ? "bg-yellow-400" : "bg-green-400"}`} >{total_credit}</div>
        </div>
      </div>
      <div className="col-span-4">
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
      </div>
    </div>
  );
};

export default InstructorInfo;
