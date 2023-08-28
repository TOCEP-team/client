'use client';

import { usePathname } from 'next/navigation';
import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice";
import { useEffect, useState } from "react"; import UserInfo from "./UserInfo";
import Courses from "./Courses";
import { defaultUserState } from '@/state';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import BreadcrumbRoundedElevatedIconPreview from '@/components/common/bradcrumbs';
import InstructorCourse from './InstructorsCourse';

const ProfileDetail = () => {
  const [coursesSub, setCoursesSub] = useState([]);
  const [user, setUser] = useState(defaultUserState);
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const isLoading = useSelector(selectIsLoading);
  const route = usePathname();

  const urlSplit = route.split("/");

  const user_id = urlSplit[2];

  useEffect(() => {
    const fetchData = async () => {
      if (urlSplit[1] === "profile" && urlSplit[2] !== undefined && wallet) {
        try {
          await wallet.viewMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME || "",
            method: "get_user_metadata_by_user_id",
            args: {
              user_id: user_id,
            }
          }).then((res) => setUser(res));
          await wallet.viewMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME || "",
            method: "get_purchase_course_by_user_id",
            args: {
              user_id: user_id,
            }
          }).then((res) => setCoursesSub(res));
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
    };
    fetchData();
  }, [wallet, isLoading]);

  const renderSkillInfo = (SkillInfo) => {
    return Object.entries(SkillInfo).map(([skillId, info]) => (
      <div key={skillId} className="">
        <span className="font-bold"> {skillId} </span> - <span className="font-bold">{info}</span> Point /
      </div>
    ));
  };

  const breadcrumbs = [
    {
      path: "/",
    },
    {
      path: "profile"
    },
    {
      path: urlSplit[2].split('.')[0]
    }
  ]
  const [isUpdate, setIsupdate] = useState(false)

  const updateToInstructors = async () => {
    setIsupdate(true)
    try {
      await wallet.callMethod({
        contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
        method: "update_role",
        args: {}
      });
      window.location.reload();
    } catch (err) {
      console.log(err)
    } finally {
      setIsupdate(false)
    }
  }

  return (
    <section className="max-w-[1440px] mx-auto lg:w-3/4 px-2 pt-4 text-gray-900">
      <BreadcrumbRoundedElevatedIconPreview breadcrumbs={breadcrumbs}/>
      {/* User Information */}
      <UserInfo userdata={user} />
      {user && user.metadata.role === "Subscriber" && account === urlSplit[2] && (
        <div className="pt-4">
          <button onClick={updateToInstructors} className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
            Become to Instructors
          </button>
        </div>
      )}
      {user && user.metadata.role === "Instructor" && account === urlSplit[2] && (
        <div className="pt-4">
          <button className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
            <Link href="/course/create" className="px-4 py-2">Create Course</Link>
          </button>
        </div>
      )}
      {user.skill && Object.entries(user.skill).length >= 1 &&
       <div className="flex border border-gray-400 rounded-md mt-4 items-center justify-center text-center px-2 py-2">
         {renderSkillInfo(user.skill)}
       </div>
      }
      <div className="col-span-1 pt-2">
        {coursesSub?.length >= 1 &&
         <h1 className="font-bold">Course Completed</h1>
        }
        <div className="grid grid-cols-4 gap-2">
          {coursesSub && coursesSub.length >= 1 && coursesSub.map((course) => (
            <div key={course.course_id} className="col-span-2">
              {!course.students_completed.hasOwnProperty(user_id) ? "" : (
                <Courses course={course}/>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 mt-4 border border-gray-400/30 shadow-md bg-light/30 p-4 rounded-md divide-x divide-gray-400">
        <div className="col-span-1">
          <h1 className="font-semibold text-2xl text-gray-600 underline">Published Courses</h1>
          {user && user.metadata.role === "Instructor" &&
           <InstructorCourse instructor_id={user_id}/>
          }
        </div>
        <div className="col-span-1 pl-4">
          <h1 className="font-semibold text-2xl text-gray-600 underline">In Processing</h1>
          {coursesSub && coursesSub.length >= 1 && coursesSub.map((course) => (
            <div key={course.course_id}>
              {course.students_completed.hasOwnProperty(user_id) ? "" : (
                <Courses course={course}/>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileDetail;
