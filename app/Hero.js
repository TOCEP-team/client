'use client'

import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice"
import {  useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import LoadingAnimation from "@/components/common/loading";
import { motion } from 'framer-motion'

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "elearning.vbi-academy.testnet";

const Hero = () => {
  const wallet = useSelector(selectWallet);
  const isLoading = useSelector(selectIsLoading);
  const [walletReady, setWalletready] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletready(true);
    }
  }, [isLoading, wallet]);

  useEffect(() => {
    const getData = async () => {
      if (wallet) {
        await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_all_user_metadata",
          args: {
            from_index: 0,
            limit: 5
          }
        }).then((res) => setAllUser(res)).catch((err) => console.log(err));
        await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_all_course_metadata",
          args: {
            from_index: 0,
            limit: 5
          }
        }).then((res) => setAllCourses(res)).catch((err) => console.log(err));
        setDone(true);
      }
    };
    getData();
  }, [walletReady]);

  const account = useSelector(selectAccountId);
  const [coursePurchase, setCoursePurchase] = useState([])

  useEffect(() => {
    if (account) {
      const fetchCourse = async () => {
        await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_purchase_course_by_user_id",
          args: {
            user_id: account,
            from_index: 0,
            limit: 5
          }
        }).then((res) => setCoursePurchase(res)).catch((err) => console.log(err));
      }
      fetchCourse();
    }
  }, [walletReady])

  return (
    !done ? (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f8f3ee] z-50 flex-col">
        <LoadingAnimation />
      </div>
    ) : (
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
          className="col-span-8 space-y-4">
          <Link href="https://nearapac.org/">
            <div className="relative flex w-full h-[400px] group overflow-hidden">
              <Image
                src={"/banner.jpeg"}
                alt="course image"
                fill
                className="object-cover group-hover:scale-105 transition-all duration-400 ease-in-out"
              />
            </div>
          </Link>
        </motion.div>
        <div className="grid grid-cols-8 max-w-[1440px] mx-auto px-4 gap-4" >
          {coursePurchase?.length >= 1 && 
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{
               type: "spring",
               stiffness: 260,
               damping: 20,
               delay: 0.1
             }}
             className="col-span-8 space-y-4 pt-4">
             <h1 className="font-semibold text-gray-600 underline text-3xl">Continue Learn</h1>
             <div className="shadow-xl border-gray-300 border-b border-r rounded-md bg-light/30 p-4 grid grid-cols-5 gap-4">
               {coursePurchase?.reverse().map((course, index) => (
                 <motion.div
                   initial={{x: 50, opacity: 0}}
                   animate={{x: 0, opacity: 1}}
                   transition={{
                     delay: index * 0.1
                   }}
                   className="" key={course.course_id}>
                   <Link href={`/course/${course.course_id}`}>
                     <div className="col-span-8 lg:col-span-1 overflow-hidden">
                       <div style={{ width: '100%', paddingTop: '60%', position: 'relative' }}>
                         <Image
                           src={course.media ? course.media : "/images/logo.jpg"}
                           alt="course image"
                           fill
                           className="object-cover rounded-md hover:rounded-none transition-all duration-200 ease-in-out hover:scale-105"
                         />
                       </div>
                     </div>
                   </Link>
                   <h1 className="truncate">{course.title}</h1>
                   <p>
                     <span className="font-bold">Rating:</span> {course.rating}
                   </p>
                   <p>
                     <span className="font-bold">Price:</span> {course.price}N
                   </p>
                   <div className="flex space-x-1 line-clamp-1"><span className="font-bold">Skills:</span>
                     {course.skills.map((item, index) => (
                       <h1 key={index}>{item},</h1>
                     ))}
                   </div>
                 </motion.div>
               ))}
             </div>
           </motion.div>
          }

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{
               type: "spring",
               stiffness: 260,
               damping: 20,
             }}
            whileInView={true}
            className="col-span-8 space-y-4 pt-4">
            <h1 className="font-semibold text-gray-600 underline text-3xl">Newest Courses</h1>
             <div className="shadow-xl border-gray-300 border-b border-r rounded-md bg-light/30 p-4 grid grid-cols-5 gap-4">
               {allCourses.length >= 1 && allCourses.reverse().map((course, index) => (
                 <motion.div
                   initial={{x: 30, opacity: 0}}
                   animate={{x: 0, opacity: 1}}
                   transition={{
                     delay: index * 0.1
                   }}
                   className="" key={course.course_id}>
                  <Link href={`/course/${course.course_id}`}>
                    <div className="col-span-8 lg:col-span-1 overflow-hidden">
                      <div style={{ width: '100%', paddingTop: '60%', position: 'relative' }}>
                        <Image
                          src={course.media ? course.media : "/images/logo.jpg"}
                          alt="course image"
                          fill
                          className="object-cover rounded-md hover:rounded-none transition-all duration-200 ease-in-out hover:scale-105"
                        />
                      </div>
                    </div>
                  </Link>
                  <h1 className="truncate">{course.title}</h1>
                  <p>
                    <span className="font-bold">Rating:</span> {course.rating}
                  </p>
                  <p>
                    <span className="font-bold">Price:</span> {course.price}N
                  </p>
                   <div className="flex space-x-1 line-clamp-1"><span className="font-bold">Skills: </span>
                     {course.skills.map((item,index) => (
                       <h1 key={index}>{item},</h1>
                     ))}
                   </div>
                 </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            viewport={{once: true}}
            whileInView={{opacity: 1}}
            transition={{
              delay: 0.1
            }}
            className="font-semibold text-3xl text-gray-600 underline pt-4 col-span-8">Members</motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            viewport={{once: true}}
            whileInView={{opacity: 1}}
            transition={{
              delay: 0.2
            }}
            className="shadow-xl border-gray-300 border-b border-r rounded-md bg-light/30 col-span-8 lg:col-span-4 items-center px-4 py-2 space-y-4">
            <h1 className="font-semibold text-2xl underline text-gray-600">Subscriber</h1>
            {allUser.length > 0 &&
             allUser.map((user) => (
               user.metadata.role === "Subscriber" &&
                 <div className="flex space-x-4" key={user.user_id ? user.user_id : ""}>
                   <Link href={`/profile/${user.metadata.user_id}`}>
                     <img src={user.metadata.avatar ? user.metadata.avatar : "/images/logo.jpg"} alt="avatar"  className="h-20 w-20 rounded-full border-4 border-gray-900 transition-all duration-200 ease-in-out hover:scale-105 "/>
                   </Link>
                   <div className="items-start justify-center flex flex-col">
                     <h3>Name: {user.metadata.nickname}</h3>
                     <h3>Credit: {user.metadata.total_credit}</h3>
                   </div>
                 </div>
             ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            viewport={{once: true}}
            whileInView={{opacity: 1}}
            transition={{
              delay: 0.4
            }}
            className="shadow-xl border-gray-300 border-b border-r rounded-md bg-light/30 col-span-8 lg:col-span-4 items-center px-4 py-2 space-y-4">
            <h1 className="font-semibold text-2xl underline text-gray-600 hover-none">Instructor Of The Month</h1>
            {allUser.length > 0 &&
             allUser.map((user) => (
               user.metadata.role === "Instructor" &&
                 <div className="flex space-x-4" key={user.user_id ? user.user_id : ""}>
                   <Link href={`/profile/${user.metadata.user_id}`}>
                     <img src={user.metadata.avatar ? user.metadata.avatar : "/images/logo.jpg"} alt="avatar"  className="h-20 w-20 rounded-full border-4 border-gray-900 transition-all duration-200 ease-in-out hover:scale-105"/>
                   </Link>
                   <div className="items-start justify-center flex flex-col">
                     <h3>Name: {user.metadata.nickname}</h3>
                     <h3>Credit: {user.metadata.total_credit}</h3>
                   </div>
                 </div>
             ))}
          </motion.div>
        </div>
      </section>
    )
  )
}

export default Hero
