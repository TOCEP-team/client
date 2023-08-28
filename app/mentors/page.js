'use client'

import axiosInstance from "@/axiosInstance"
import ButtonLink from "@/components/Button"
import ImageAccount from "@/components/getImageByAccount"
import {  selectWallet } from "@/features/walletSlice"
import Link from "next/link"
import { useEffect,useState } from "react"
import { useSelector } from "react-redux"
import {motion} from 'framer-motion'


const MentorsPage = () => {
  const wallet = useSelector(selectWallet);
  const [allTasks, setAlltasks] = useState()

  useEffect(() => {
    const fetchData = async () => {
      if (wallet) {
        try {
          await axiosInstance.get("/mentors").then((res) => setAlltasks(res.data.reverse().splice(0,9)))
        } catch (err) {
          console.log(err)
        }
      }
    }
    fetchData()
  }, [wallet])

  return (
    <section className="max-w-[1440px] mx-auto grid grid-cols-3 gap-4">
      <div className="col-span-3 flex items-center justify-center">
        <Link href={`/mentors/new-task`} className="border border-gray-400 rounded-md px-2 py-2 items-center justify-center w-full text-center mt-4 col-span-3">
          New Tasks
        </Link>
      </div>
      <div className="grid grid-cols-3 col-span-3 gap-4">
      {allTasks && allTasks.map((task,index) => (
        <motion.div
          initial={{y: -50, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{
            delay: index * 0.05
          }}
          className="col-span-1 border border-gray-400 rounded-md px-4 py-2 flex flex-col space-x-4 justify-between" key={task._id}>
          <div className="grid grid-cols-3 justify-between">
            <div className="col-span-2">
              <h1 className="text-2xl font-bold">{task.mentoring_title}</h1>
              <p className="line-clamp-4"><span className="font-bold">Description:</span> {task.description}</p>
              <p><span className="font-bold">Price:</span> {(task.price_per_lesson/Math.pow(10,24)).toFixed(2)} Near</p>
            </div>
            <div className="flex w-full h-[200px] relative rounded-full overflow-hidden">
              <ImageAccount user_id={task.mentoring_owner}/>
            </div>
          </div>
          <ButtonLink link={`/mentors/task/${task.mentoring_id}`}>
            Details
          </ButtonLink>
        </motion.div>
      ))}
      </div>
    </section>
  )
}

export default MentorsPage
