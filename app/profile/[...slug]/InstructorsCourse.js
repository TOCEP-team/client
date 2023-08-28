'use client'

import { useState } from "react";
import { useEffect } from "react";
import Courses from "./Courses";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectWallet } from "@/features/walletSlice";

const InstructorCourse = ({instructor_id}) => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(5)
  const route = usePathname();
  const wallet = useSelector(selectWallet);

  const urlSplit = route.split("/");

  const handlePage = () => {
    let result = page + 5;
    setPage(result)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (urlSplit[1] === "profile" && urlSplit[2] !== undefined && wallet) {
        try {
          await wallet.viewMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME || "",
            method: "get_all_courses_per_instructor",
            args: {
              instructor_id,
              start: 0,
              limit: page,
            }
          }).then((res) => setCourses(res));
        } catch (err) {
          console.log(err)
        }
      }
    }
    fetchData();
  }, [])
  return (
    <>
      {courses.map((course) => (
        <Courses course={course} key={course.course_id}/>
      ))}
      {courses.length >= 5 &&
       <div className="items-center justify-center items-center flex border border-gray-400 mt-4 w-1/3 py-2 rounded-md mx-auto">
         <button onClick={handlePage} >Get More</button>
       </div>
      }
    </>
  )
}

export default InstructorCourse
