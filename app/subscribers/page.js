'use client'

import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import InstructorInfo from "../profile/[...slug]/InstructorInfo";

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState([])
  const [role, setRole] = useState('Instructor')
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const isLoading = useSelector(selectIsLoading);
  const route = usePathname();
  const breadcrumbs = [
    {
      path: "/",
    },
    {
      path: "profile"
    },
  ]
  useEffect(() => {
    const fetchData = async () => {
      if (wallet) {
        try {
          await wallet.viewMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME || "",
            method: "get_all_instructor_metadata",
            args: {
              from_index: 0,
              limit: 5
            }
          }).then((res) => setInstructors(res));
          await wallet.viewMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME || "",
            method: "check_user_role",
            args: {
              user_id: account,
            }
          }).then((res) => setRole(res))
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
    };
    fetchData();
  }, [wallet, isLoading]);

  return (
    <section className="max-w-[1440px] mx-auto pt-8">
      {
        role !== "Instructor" &&
        <section className="max-w-[1440px] mx-auto pt-4" >
          <Link href="/subscribers/register" className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out">
            Become an Instructor
          </Link>
        </section>
      }
      <div className="grid grid-cols-3 pt-8">
      {instructors.map((instructor) => (
        <InstructorInfo userdata={instructor}/>
      ))}
      </div>
    </section>
  )
}

export default InstructorsPage
