'use client'

import {  selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice"
import { usePathname } from "next/navigation"
import { useEffect,useState } from "react"
import { useSelector } from "react-redux"
import {Input} from '@material-tailwind/react'
import { utils } from "near-api-js"
import Image from "next/image"
import StudyProcessComponent from "./StudyProcess"
import {motion} from 'framer-motion'


const TaskDetails = () => {
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const isLoading = useSelector(selectIsLoading);
  const [walletReady, setWalletready] = useState(false);
  const [task, setTask] = useState({})
  const [user, setUser] = useState({})
  const path = usePathname();
  const [amount, setAmount] = useState()

  const urlPath = path.split('/');
  let user_id = urlPath[urlPath.length - 1].split("_").pop()+`.${process.env.NEXT_PUBLIC_NETWORK}`;
  let mentoring_id = urlPath[3];
  if (urlPath[4]) {
    mentoring_id = urlPath[3] + `/` + urlPath[4]
  }

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletready(true);
    }
  }, [isLoading, wallet]);

  useEffect(() => {
    const fetchData = async () => {
      if (wallet) {
        try {
          await wallet.viewMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
            method: "get_user_metadata_by_user_id",
            args: {
              user_id: user_id,
            }
          }).then((res) => setUser(res))
          await wallet.viewMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
            method: "get_mentoring_metadata_by_mentoring_id",
            args: {
              mentoring_id: mentoring_id,
            }
          }).then((res) => setTask(res))
        } catch (err) {
          console.log(err)
        }
      }
    }
    fetchData()
  }, [walletReady])

  const [isSubmit, setIssubmit] = useState(false)

  const MakeCompleted = async (studentProcessId) => {
    setIssubmit(true)
    try {
      await wallet.callMethod({
        contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
        method: "make_lession_completed",
        args: {
          mentoring_id: urlPath[3],
          study_process_id: studentProcessId
        }
      }).then((res) => console.log(res));
      window.location.reload();
    } catch (err) {
      console.log(err)
    } finally {
      setIssubmit(false)
    }
  };

  const buyMentoring = async (event) => {
    event.preventDefault();
    let price = utils.format.parseNearAmount(amount.toString())
    console.log(price)
    await wallet.callMethod({
      contractId: process.env.NEXT_PUBLIC_POOL_CONTRACT,
      method: "buy_mentoring",
      args: {
        mentoring_id: urlPath[3],
      },
      deposit: price
    })
  }

  return (
    <section className="max-w-[1440px] mx-auto pt-8 gap-4 grid grid-cols-4">
      <div className="border border-gray-400 rounded-md px-4 py-2 col-span-4" >
        <motion.div className="flex space-x-4 justify-between grid grid-cols-4"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2
                    }}
        >
          <div className="col-span-3">
                <h1 className="text-2xl font-semibold text-gray-600">{task?.mentoring_title}</h1>
                <p><span className="font-bold">Description:</span> {task?.description}</p>
            <p><span className="font-bold">Price:</span> {(task?.price_per_lession/Math.pow(10,24)).toFixed(2)}$</p>
          </div>
          <div className="col-span-1 w-[300px] h-[300px] shadow-md relative rounded-full overflow-hidden">
             <Image src={user?.metadata?.avatar ? user?.metadata?.avatar : "/images/logo.jpg"} alt="avatar" fill className="object-cover"/>
          </div>
        </motion.div>
        {account && 
         <motion.div
           initial={{ x: 300, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{
             type: "spring",
             stiffness: 260,
             damping: 20,
             delay: 0.4
           }}
           className="flex items-center justify-center">
           <form onSubmit={buyMentoring} className="flex space-x-4">
             <Input
               className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300 shadow-md"
               onChange={(e) => setAmount(e.target.value)}
               placeholder="Amount"
               id="text"
               cols="40"
               rows="10"
             />
             <button type="submit" className="border bg-button border-gray-400 px-16 py-2 rounded-md text-gray-600 hover:bg-button-dark transition-all duration-100 font-medium ease-in-out shadow-md">
               Access
             </button>
           </form>
         </motion.div>
        }
      </div>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.6
        }}
        className="col-span-4">
        {task && <StudyProcessComponent studyProcesses={task.study_process} makeLessonCompleted={MakeCompleted} account={account} isSubmit={isSubmit}/>}
      </motion.div>
    </section>
  )
}

export default TaskDetails


// fn buy_mentoring(&mut self, mentoring_id: MentoringId, course_id: CourseId) -> PromiseOrValue<U128> {
