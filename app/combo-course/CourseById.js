'use client'

import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice"
import { useState } from "react";
import { useEffect } from "react"
import { useSelector } from "react-redux"
import Link from "next/link";

const CourseMetadataById = ({course_id, contract_id}) => {
  const wallet = useSelector(selectWallet);
  const isLoading = useSelector(selectIsLoading);
  const [walletReady, setWalletready] = useState(false);
  const [course, setCourse] = useState()

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

  return (
      <div className="flex flex-col">
        <h1 className="text-md"><span className="font-semibold text-gray-700">Title: </span> {course?.title}</h1>
        <h1 className="text-md"><span className="font-semibold text-gray-700">Instructor: </span>{course && Object.entries(course?.instructor_id)[0][0].split(".")[0]}</h1>
        <div className="flex">
          <span className="font-bold text-gray-700">Skill: </span>
          {course?.skills.map((skill,index) => (
            <span key={index} className="ml-1">{skill},</span>
          ))}
        </div>
      </div>
  )
}

export default CourseMetadataById
