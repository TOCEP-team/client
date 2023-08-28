'use client'

import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice"
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react"
import { useSelector } from "react-redux"
import {motion} from 'framer-motion'

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const PoolsRequest = () => {
  const wallet = useSelector(selectWallet);
  const isReady = useSelector(selectIsLoading);
  const [pools, setPools] = useState([])

  useEffect(() => {
    if (wallet) {
      const fetchData = async () => {
        await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_all_pool_metadata",
          args: {
            from_index: 0,
            limit: 20
          }
        }).then((res) => setPools(res));
      }
      fetchData()
    }
  },[isReady, wallet])

  return (
    <div className="grid grid-cols-3 gap-4 pt-4 max-w-[1440px] mx-auto">
      {pools && pools.map((pool, index) => (
        <motion.div
          initial={{y: -30, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{
            delay: index * 0.1
          }}
          className="p-4 shadow-md rounded-md space-y-2 bg-light/30 flex flex-col justify-between" key={pool.pool_id}>
          <div>
            <h1 className="truncate font-semibold text-gray-600 underline text-xl">{pool.pool_id}</h1>
            <ul className="list-disc ml-4">
              <li>Minimum: {pool.minimum_stake}</li>
              <li>Maximum: {pool.maximum_stake}</li>
              <li>Current Stake: {(pool.current_stake/Math.pow(10,24)).toFixed(2)} Near</li>
              <li>Subscribers Join: {Object.entries(pool.stake_info).length}</li>
            </ul>
            {pool.winner !== null &&
             <p className="font-bold text-gray-600 underline">Winner: {pool.winner.split(".")[0]}</p>
            }
          </div>
          <div className="flex items-center justify-center text-center">
            <Link href={`/pool-request/${pool.pool_id}`}
                  className="w-1/2 bg-button hover:bg-button-dark border border-gray-300 shadow-md px-3 py-1 rounded-md text-gray-600 hover:bg-gray-300 transition-all duration-100 font-medium ease-in-out" 
            >
              Details
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default PoolsRequest
