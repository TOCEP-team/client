'use client'

import axiosInstance from "@/axiosInstance"
import { selectAccountId, selectIsConnected, selectIsLoading, selectWallet } from "@/features/walletSlice"
import { convertToSlug } from "@/utils/convert_slug"
import { utils } from "near-api-js"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSelector } from "react-redux"

const NewTasks = () => {
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const [isSubmit, setIsSubmit] = useState(false)
  const [mentoringTitle, setMentoringTitle] = useState('')
  const [pricePerLesson, setPricePerLesson] = useState('')
  const [description, setDescription] = useState('')
  const route = useRouter();
  const [mentoringError, setMentoringerror] = useState("")

  const createTasks = async (event) => {
    event.preventDefault();
    setIsSubmit(true)
    const specialCharacters = /^[0-9a-zA-Z ]*$/;
    if (!specialCharacters.test(mentoringTitle)) {
      setMentoringerror('Mentoring title should not contain special characters.');
      setIsSubmit(false);
      return;
    } else {
      setMentoringerror('');
      if (wallet && account) {
        try {
          await wallet.callMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
            method: "create_mentoring",
            args: {
              mentoring_title: mentoringTitle,
              price_per_lession: pricePerLesson,
              description: description,
            }
          })
          await axiosInstance.post("/mentor/create", {
            description: description,
            mentoring_owner: account,
            mentoring_title: mentoringTitle,
            price_per_lesson: utils.format.parseNearAmount(pricePerLesson),
          })

          route.push(`/mentors/task/mentoring_${convertToSlug(mentoringTitle)}_${account.split(".")[0]}`)
        } catch (err) {
          console.log(err)
        } finally {
          setIsSubmit(false)
        }
      }
    }
  }

  if (account) {
    return (
      <section className="max-w-[1440px] mx-auto">
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl font-semibold mb-4">Create Mentoring</h2>
            <form onSubmit={createTasks}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mentoring Title:</label>
                <input
                  className="mt-1 p-1 border rounded w-full"
                  type="text"
                  value={mentoringTitle}
                  onChange={(e) => {
                    setMentoringTitle(e.target.value);
                    setMentoringerror('')
                  }}
                />
                {mentoringError && (
                  <p className="text-red-500 text-sm">{mentoringError}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price Per Lesson:</label>
                <input
                  className="mt-1 p-1 border rounded w-full"
                  type="text"
                  value={pricePerLesson}
                  onChange={(e) => setPricePerLesson(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea
                  className="mt-1 p-1 border rounded w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                
              </div>
              <button 
                className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out"
                type="submit"
                disabled={isSubmit}
              >
                {isSubmit ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div> 
      </section>
    )
  }
}

export default NewTasks
