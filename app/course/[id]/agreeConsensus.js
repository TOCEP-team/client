'use client'

import { handleAssertionError } from "@/utils/error";
import { NO_DEPOSIT } from "@/utils/near-wallet";
import { useState } from "react";

const AgreeConsensus = ({wallet, contractId, course_id, course}) => {
  const [instructor, setInstructor] = useState('')
  const [instructorRemove, setInstructorRemove] = useState('')
  const [instructorTransfer, setInstructortransfer] = useState("")
  const [amountTransfer, setAmounttransfer] = useState(0)
  const [amount, setAmount] = useState(0)
  const [isAgreeConsensusSubmitting, setIsAgreeConsensusSubmitting] = useState(false);
  const [isUpdateConsensusSubmitting, setIsUpdateConsensusSubmitting] = useState(false);
  const [isAddInstructorSubmitting, setIsAddInstructorSubmitting] = useState(false);
  const [isRemoveInstructorSubmitting, setIsRemoveInstructorSubmitting] = useState(false);
  const [isTransferUnitSubmitting, setIsTransferUnitSubmitting] = useState(false);
  const [updateAmount, setUpdateAmount] = useState()
  const [error, setError] = useState('')

  const agreeConsensus = async (event) => {
    event.preventDefault();
    setError('')
    setIsAgreeConsensusSubmitting(true)
    try {
      await wallet.callMethod({
        contractId: contractId,
        method: "agree_consensus",
        args: {
          course_id: course_id,
          amount: amount,
        }
      });
      window.location.reload();
    } catch (err) {
      setError(err)
    } finally {
      setIsAgreeConsensusSubmitting(false);
      setAmount(null)
    }
  }

  const updateConsensus = async (event) => {
    event.preventDefault();
    setIsUpdateConsensusSubmitting(true)
    setError('')
    try {
      await wallet.callMethod({
        contractId: contractId,
        method: "update_consensus",
        args: {
          course_id: course_id,
          amount: updateAmount,
        }
      });
      window.location.reload();
    } catch (err) {
      setError(err)
    } finally {
      setIsUpdateConsensusSubmitting(false);
      setUpdateAmount(null)
    }
  }


  const removeInstructor = async (event) => {
    event.preventDefault();
    setIsRemoveInstructorSubmitting(true)
    setError('')
    try {
      await wallet.callMethod({
        contractId: contractId,
        method: "remove_instructor",
        args: {
          course_id: course_id,
          instructor_id: instructorRemove,
        },
        deposit: NO_DEPOSIT
      });
      window.location.reload()
    } catch (err) {
      setError(err)
    } finally {
      setIsRemoveInstructorSubmitting(false);
      setInstructorRemove('')
    }
  }
  const addInstructor = async (event) => {
    event.preventDefault();
    setIsAddInstructorSubmitting(true)
    setError('')
    try {
      await wallet.callMethod({
        contractId: contractId,
        method: "add_instructor",
        args: {
          course_id: course_id,
          new_instructor: instructor,
        },
        deposit: NO_DEPOSIT
      });
      window.location.reload()
    } catch (err) {
      setError(err)
    } finally {
      setIsAddInstructorSubmitting(false);
      setInstructor('')
    }
  }

  const transferUnit = async (event) => {
    event.preventDefault();
    setIsTransferUnitSubmitting(true)
    setError('')
    try {
      await wallet.callMethod({
        contractId: contractId,
        method: "transfer_unit",
        args: {
          course_id: course_id,
          instructor_id: instructorTransfer,
          amount: amountTransfer
        },
        deposit: NO_DEPOSIT
      });
      window.location.reload();
    } catch (err) {
      setError(err)
    } finally {
      setIsTransferUnitSubmitting(false);
      setInstructor('')
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto grid grid-cols-3">
      <div className="col-span-3 flex text-red-500 underline flex-col font-bold justify-between text-center items-center">
        {error !== '' ? handleAssertionError(error.toString()) : ''}
      </div>
      <div className="col-span-1 flex flex-col items-center">
        <form onSubmit={agreeConsensus}  className="space-x-4 items-center justify-center text-center flex flex-col">
          <h1 className="items items-start justify-start text-left semibold text-sm">Amount Agree<span className="text-red-500">*</span></h1>
          <input
            type="number"
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          <button disabled={isAgreeConsensusSubmitting} type="submit" className="mt-4 border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out">{isAgreeConsensusSubmitting ? "Loading..." : "Agree Consensus"}</button>
          {Object.entries(course.consensus).length >= 1 && Object.entries(course.consensus).map((user, index) => (
            <div className="flex flex-col items-center" key={index}>
              <div className="flex flex-col items-center">
                <h1>Consensus Argee</h1>
                <p>
                  <span className="font-bold">{user[0]}</span> authorized <span className="font-bold">{user[1]}</span> Unit
                </p>
              </div>
            </div>
          ))}
        </form>

        <form onSubmit={updateConsensus} className="col-span-1 flex flex-col items-center">
          <h1 className="items items-start justify-start text-left semibold text-sm">Amount Agree<span className="text-red-500">*</span></h1>
          <input
            type="number"
            onChange={(e) => setUpdateAmount(parseInt(e.target.value))}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
            <button disabled={isUpdateConsensusSubmitting} type="submit" className="mt-4 border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out">{isUpdateConsensusSubmitting ? "Loading..." : "Update Consensus"}</button>
        </form>
      </div>
      <div className="flex flex-col col-span-1 items-center">
      <form onSubmit={addInstructor} className="col-span-1 flex flex-col items-center">
        <h1 className="items items-start justify-start text-left semibold text-sm">Member Add<span className="text-red-500">*</span></h1>
        <input
          type="text"
          onChange={(e) => setInstructor(e.target.value)}
          className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
        />
        <button disabled={isAddInstructorSubmitting} type="submit" className=" mt-4 border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out">
          {isAddInstructorSubmitting ? "Loading..." : "Add A Member"}
          </button>
      </form>
      <form onSubmit={removeInstructor} className="col-span-1 flex flex-col items-center">
        <h1 className="items items-start justify-start text-left semibold text-sm">Member remove<span className="text-red-500">*</span></h1>
        <select
          onChange={(e) => setInstructorRemove(e.target.value)}
          className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
        >
          <option value="">Select an Member</option>
          {Object.entries(course.instructor_id).map((instructor, index) => (
            <option key={index} value={instructor[0]}>
              {instructor[0]}
            </option>
          ))}
        </select>
        <button disabled={isRemoveInstructorSubmitting} type="submit" className="mt-4 border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out">
          {isRemoveInstructorSubmitting ? "Loading...": "Remove A Member"}
        </button>
      </form>
      </div>
      <form onSubmit={transferUnit} className="col-span-1 flex flex-col items-center">
        <h1 className="items items-start justify-start text-left semibold text-sm">Transfer For<span className="text-red-500">*</span></h1>
        <select
          onChange={(e) => setInstructortransfer(e.target.value)}
          className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
        >
          <option value="">Select an member</option>
          {Object.entries(course.instructor_id).map((instructor, index) => (
            <option key={index} value={instructor[0]}>
              {instructor[0]}
            </option>
          ))}
        </select>
        <h1 className="items items-start justify-start text-left semibold text-sm">Amount<span className="text-red-500">*</span></h1>
        <input
          type="number"
          onChange={(e) => setAmounttransfer(parseInt(e.target.value))}
          className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
        />
        <button disabled={isTransferUnitSubmitting} type="submit" className="w-1/3 mt-4 border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out">
    {isTransferUnitSubmitting ? "Loading..." : "Transfer"}
          </button>
      </form>
      <div className="col-span-3 flex flex-col items-center py-4">
        <h1 className="font-semibold text-gray-600 flex text-center items-center justify-center text-xl">Members Of Course</h1>
        {Object.entries(course.instructor_id).map((user,index) => (
          <h1 key={index}>
            <span className="font-bold">{user[0]}</span> Have <span className="font-bold">{user[1]}</span> Unit </h1>
        ))}
      </div>
    </div>
  )
}

export default AgreeConsensus
