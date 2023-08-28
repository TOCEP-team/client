'use client'

import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice"
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react"
import { useSelector } from "react-redux"
import CourseMetadata from "./CourseWithCourseId";
import {motion} from 'framer-motion'
import axiosInstance from "@/axiosInstance";
import { utils } from "near-api-js";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME;

const ComboDetails = () => {
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const path = usePathname();
  const combo_id = path.split("/")[2]
  const [comboCourses, setCombocourses] = useState([])
  const isLoading = useSelector(selectIsLoading);
  const [walletReady, setWalletready] = useState(false);

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletready(true);
    }
  }, [isLoading, wallet]);

  useEffect(() => {
    if (wallet) {
      const fetchCombo = async () => {
        let comboData = await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_combometadata_by_combo_id",
          args: {
            combo_id:  combo_id
          }
        })
        setCombocourses(comboData)
      }
      fetchCombo()
    }
  }, [walletReady])
  
  const [isSubmit, setIsSubmit] = useState(false)

  const payment = async () => {
    setIsSubmit(true)
    if (account) {
      try {
        const courseIds = []
        for (const course of comboCourses.courses) {
          let hash = await axiosInstance.post("/hash", {
            course_id: course.course_id,
            user_id: account
          });
          courseIds.push(hash.data.encodedHash)
        }
        const totalPrice = comboCourses.courses.reduce(
          (total, course) => total + course.price,
          0
        );

        const comboHash = await comboCourses.courses.map((course, index) => ({
          course_id: course.course_id,
          encode_check: courseIds[index],
        }));

        const payload = {
          combo_id: combo_id,
          combo_hash: comboHash,
        };

        await wallet.callMethod({
          contractId: CONTRACT_ID,
          method: "payment_combo",
          args: payload,
          deposit: utils.format.parseNearAmount(totalPrice.toString())
        });
    } catch (err) {
      console.log("Error log", err)
    } finally {
        setIsSubmit(false)
      }
    }
  }

  return (
    <section className="flex flex-col justify-center items-center text-center h-screen">
      <div className="flex justify-center items-center space-x-4">
        {comboCourses?.courses?.map((course, index) => (
          <motion.div
            initial={{y: -30, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{
              delay: index * 0.1
            }}
            className="bg-light/30 rounded-xl" key={index}>
            <CourseMetadata course_id={course?.course_id} contract_id={CONTRACT_ID} combo_id={combo_id} combo_course={comboCourses} agree={true}/>

          </motion.div>
        ))}
      </div>
      <div className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out mt-4">{comboCourses.combo_state}</div>
      <button disabled={isSubmit} className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out mt-4" onClick={payment}>{isSubmit ? "Loading..." : "Payment"}</button>
    </section>
  )
}

export default ComboDetails
