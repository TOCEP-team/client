'use client'

import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice"
import { useState } from "react";
import { useEffect } from "react"
import { useSelector } from "react-redux"
import Link from "next/link";
import axios from "axios";
import axiosInstance from "@/axiosInstance";

const CourseMetadata = ({course_id, contract_id, combo_id, combo_course, agree = false}) => {
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const isLoading = useSelector(selectIsLoading);
  const [walletReady, setWalletready] = useState(false);
  const [course, setCourse] = useState()
  const [isSubmit, setIsSubmit] = useState(false)

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletready(true);
    }
  }, [isLoading, wallet]);

  useEffect(() => {
    if (course_id) {
      const fetchCombo = async () => {
        await wallet.viewMethod({
          contractId: contract_id,
          method: "get_course_metadata_by_course_id",
          args: {
            course_id: course_id
          }
        }).then((res) => setCourse(res)).catch((err) => console.log(err))
      }
      fetchCombo()
    }
  }, [walletReady])

  const angreeCollab = async () => {
    setIsSubmit(true)
    try {
      await wallet.callMethod({
        contractId: contract_id,
        method: "enable_course",
        args: {
          combo_id: combo_id,
          course_id: course_id
        }
      }).then((res) => console.log(res)).catch((err) => console.log(err))
      window.location.reload();
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmit(false)
    }
  }

  return (
    <div className="text-gray-600 w-[600px] px-4 flex flex-col py-8">
      <div className="flex flex-col items-start">
        <h1 className="text-xl truncate"><span className="font-semibold">Title:</span> {course?.title}</h1>
        <h1 className="text-xl"><span className="font-semibold">Instructor:</span> {course && Object.entries(course?.instructor_id)[0][0].split(".")[0]}</h1>
        <div className="flex">
          <span className="font-bold">Skill: </span>
          {course?.skills.map((skill,index) => (
            <span key={index} className="ml-1">{skill},</span>
          ))}
        </div>
        <h1>{combo_course?.enable_course?.includes(course_id) ? "Active" : "Deactive"}</h1>
      </div>
      <div className="flex justify-center items-center text-center">
        <Link className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out mt-4" href={`/course/${course?.course_id}`}>
          Course Details
        </Link>
      </div>
      {course?.instructor_id.hasOwnProperty(account) && !combo_course?.enable_course?.includes(course_id) ? (
       <div className="flex justify-center items-center text-center">
         <button onClick={() => angreeCollab()} disabled={isSubmit} className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out mt-4">
           {isSubmit ? "Loading..." : "Agree to Collab"}
         </button>
       </div>
      ) : (
        null
      )}
    </div>
  )
}

export default CourseMetadata
