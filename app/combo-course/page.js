'use client'

import { selectAccountId, selectWallet } from "@/features/walletSlice"
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux"
import {motion} from 'framer-motion'
import { useEffect } from "react";
import CourseMetadataById from "./CourseById";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME;

const ComboCoursePage = () => {
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const [data, setData] = useState()
  const [isDataFetched, setDataFetched] = useState(false)
  
  useEffect(() => {
    const getData = async () => {
      if (wallet) {
        let result = await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_all_combo_metadata",
          args: {}
        })
        setData(result);
        setDataFetched(true);
      }
    }
    getData()
  }, [wallet, isDataFetched])


  return (
    <section className="max-w-[1440px] mx-auto flex justify-center items-center grid grid-cols-3 pt-6">
      <motion.div
        className="col-span-1 col-start-2"
        initial={{opacity: 0, y: -20}}
        animate={{opacity:1, y: 0}}
        transition={{
          delay: 0.1
        }}
      >
        <Link href="/combo-course/create" className="flex items-center justify-center border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-700 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">Create Course</Link>
      </motion.div>
      <div className="col-span-3 col-start-1 grid grid-cols-3 gap-4">
        {data?.map((combo, index) => (
          <motion.div
            key={index}
            initial={{opacity: 0, y: -20}}
            animate={{opacity:1, y: 0}}
            transition={{
              delay: 0.1 * index
            }}
            className="bg-light/30 rounded-md shadow-md">
           <div className="p-4">
             <h1 className="truncate">
               <span className="font-semibold text-gray-700">Combo id: </span>{combo.combo_id}
             </h1>
             <h3>
               <span className="font-semibold text-gray-700">State: </span>{combo.combo_state}
             </h3>
             <h2>
               <span className="font-semibold text-gray-700">Collab of: </span>
               <ul className="list-disc ml-4">
               {combo.courses.map((course) => (
                 <li><CourseMetadataById course_id={course.course_id} contract_id={CONTRACT_ID}/></li>
               ))}
               </ul>
             </h2>
             <h2>
               <span className="font-semibold text-gray-700">Price:</span> {combo.courses.reduce((accumulator, course) => accumulator + course.price, 0)} Near
             </h2>
             <Link
               className="flex items-center justify-center border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-700 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out" href={`/combo-course/${combo.combo_id}`}>
               Details
             </Link>
           </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ComboCoursePage
