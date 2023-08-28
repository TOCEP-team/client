import { usePathname } from 'next/navigation';
import { selectIsLoading, selectWallet } from "@/features/walletSlice";
import { useEffect, useState } from "react";
import Image from "next/image";
import { defaultCourseState } from "@/state";
import { useSelector } from 'react-redux';

const CourseDetail = () => {
  const [courses, setCourses] = useState(defaultCourseState);
  const wallet = useSelector(selectWallet);
  const isLoading = useSelector(selectIsLoading);
  const route = usePathname();

  const urlSplit = route.split("/");

  useEffect(() => {
    const fetchUser = async () => {
      if (urlSplit[1] === "course" && urlSplit[2] !== undefined && wallet) {
        try {
          const result = await wallet.viewMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME || "",
            method: "get_course_metadata_by_course_id",
            args: {
              course_id: urlSplit[2],
            }
          });
          setCourses(result);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, [wallet, isLoading]);

  if (courses) {
    return (
      <section className="grid grid-cols-8 gap-4 max-w-[1440px] mx-auto lg:w-3/4 px-2 pt-4 text-gray-900">
        <div className="col-span-3">
          <Image src={courses.media ? courses.media : ""} alt="course image" width={1000} height={500}/>
          <div className="py-2"> <button className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out" >Payment</button>
          </div>
        </div>
        <div className="col-span-5">
          <h1><span className="font-bold">Title:</span> {courses.title}</h1>
          <p><span className="font-bold">Created At:</span> {courses.created_at}</p>
          <p><span className="font-bold">Rating:</span> {courses.rating}</p>
          <p><span className="font-bold">Rating Count:</span> {courses.rating_count}</p>
          <span><span className="font-bold">Description:</span>{courses.description ? courses.description : "Don't Have"}</span>
        </div>
        <div></div>
      </section>
    );
  }
};

export default CourseDetail;
