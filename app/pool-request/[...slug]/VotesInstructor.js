'use client'

import ImageAccount from '@/components/getImageByAccount';
import { selectAccountId, selectWallet } from '@/features/walletSlice';
import { handleAssertionError } from '@/utils/error';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const VotesInstructor = ({ poolInfo }) => {
  if (!poolInfo) {
    return <div>Loading...</div>;
  }

  const { instructors_votes, owner_id, pool_id, stake_info } = poolInfo;
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const [error, setError] = useState(null)

  const [isSubmit, setIsSubmit] = useState(false)
  const vote = async (instructor) => {
    setIsSubmit(true)
    setError('')
    try {
      await wallet.callMethod({
        contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
        method: "vote_instructor",
        args: {
          pool_id: pool_id,
          instructor_id: instructor
        }
      })
      window.location.reload();
    } catch (err) {
      setError(err)
    } finally {
      setIsSubmit(false)
    }
  }

  const isAccountInStakeInfo = stake_info && stake_info[account] && stake_info[account].stake_value > 0;

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Instructors Information</h2>
      <div className="border p-4 rounded-lg shadow-md grid grid-cols-4 gap-4">
        {Object.keys(instructors_votes).map(instructor => (
          <div key={instructor} className="flex flex-col border border-lg p-4">
            {instructor.split(".")[0]}: with {instructors_votes[instructor]} votes
            <Link href={`/profile/${instructor}`} className="w-[100px] pt-[100px] relative mx-auto rounded-full overflow-hidden hover:scale-105 transition-all duration-200">
              <ImageAccount user_id={instructor}/>
            </Link>
            {isAccountInStakeInfo && (
              !isSubmit ? (
              <button
                className="border border-gray-600 px-4 text-center mt-2 w-1/2 mx-auto py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out"
                onClick={() => vote(instructor)}
              >
                Vote for
              </button>
              ) : (
              <button
                className="border border-gray-600 px-4 text-center mt-2 w-1/2 mx-auto py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out"
              >
                Loading...
              </button>
              )
            )}
            <div className="text-center">
              {error && handleAssertionError(error.toString())}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotesInstructor;
