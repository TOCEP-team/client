'use client'
import BreadcrumbRoundedElevatedIconPreview from "@/components/common/bradcrumbs";
import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice"
import { convertToSlug } from "@/utils/convert_slug";
import { utils } from "near-api-js";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react"
import { useSelector } from "react-redux"
import VotesInstructor from "./VotesInstructor";
import ImageAccount from "@/components/getImageByAccount";
import { NO_DEPOSIT } from "@/utils/near-wallet";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";
const POOL_CONTRACT = process.env.NEXT_PUBLIC_POOL_CONTRACT || "";

const PoolDetails = () => {
  const route = usePathname();
  const router = useRouter();
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const isReady = useSelector(selectIsLoading);
  const [pool, setPool] = useState(null);
  const [amount, setAmount] = useState()
  const [isSubmit, setIssubmit] = useState(false)
  const [isJoinPool, setIsJoinPool] = useState(false)
  const [isUnstake, setIsUnstake] = useState(false)

  const urlSplit = route.split("/");
  const pool_id = urlSplit[2];

  useEffect(() => {
    if (wallet) {
      const fetchData = async () => {
        await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_pool_metadata_by_pool_id",
          args: {
            pool_id: pool_id
          }
        }).then((res) => setPool(res));
      }
      fetchData()
    }
  },[isReady, wallet])

  const breadcrumbs = [
    {
      path: "/",
    },
    {
      path: "pool-request"
    },
    {
      path: urlSplit[2].split('.')[0]
    }
  ]

  const stake = async (event) => {
    setIsJoinPool(true)
    event.preventDefault();
    try {
      await wallet.callMethod({
        contractId: POOL_CONTRACT,
        method: "stake",
        args: {
          pool_id: pool_id
        },
        deposit: utils.format.parseNearAmount(amount)
      });
      router.push(`/pool-request/${convertToSlug(pool_id)}`);
    } catch (err) {
      console.log(err)
    } finally {
      setIsJoinPool(false)
    }
  }

  const unstake = async () => {
    setIsUnstake(true)
    try {
      await wallet.callMethod({
        contractId: CONTRACT_ID,
        method: "unstake",
        args: {
          pool_id: pool_id
        },
        deposit: NO_DEPOSIT
      });
      window.location.reload();
    } catch (err) {
      console.log(err)
    } finally {
      setIsUnstake(false)
    }
  }

  const renderStakeInfo = (stakeInfo) => {
    return Object.entries(stakeInfo).map(([stakerId, info]) => (
      <div key={stakerId} className="mb-2 items-end">
        {info.staker_id.split(".")[0]} {' '}<span className="font-bold">was staked</span> {(info.stake_value/10**24).toFixed(2)} Near <span className="font-bold">{" "}on</span> {new Date(info.stake_at).toLocaleString()}
      </div>
    ));
  };

  const renderUnStakeInfo = (stakeInfo) => {
    return Object.entries(stakeInfo).map(([stakerId, info]) => (
      <div key={stakerId} className="mb-2 items-end">
        {info.staker_id.split(".")[0]} {' '}<span className="font-bold">was staked</span> {(info.unstake_value/10**24).toFixed(2)} Near <span className="font-bold">{" "}at</span> {new Date(info.unstake_at).toLocaleString()}
      </div>
    ));
  };

  const applyPool = async (event) => {
    setIssubmit(true)
    event.preventDefault();
    try {
      await wallet.callMethod({
        contractId: CONTRACT_ID,
        method: "apply_pool",
        args: {
          pool_id: pool_id
        },
      }),
      window.location.reload();
    } catch (err) {
      console.log(err)
    } finally {
      setIssubmit(false)
    }
  }
  const [isSubmitWinner, setIssubmitwinner] = useState(false)

  const getWinner = async () => {
    setIssubmitwinner(true)
    try {
      await wallet.callMethod({
        contractId: CONTRACT_ID,
        method: "make_end_stake_process",
        args: {
          pool_id: pool_id
        }
      });
      window.location.reload();
    } catch (err) {
      console.log(err)
    } finally {
      setIssubmitwinner(false)
    }
  }

  if (pool !== null) {
    return (
      <section className="max-w-[1440px] mx-auto">
        <BreadcrumbRoundedElevatedIconPreview breadcrumbs={breadcrumbs}/>
        <div className="bg-gray-100 p-4 rounded-md shadow-md mx-auto mt-12 w-1/2">
          <h2 className="text-3xl font-semibold mb-4 text-gray-600 underline">Pool Details</h2>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="font-semibold">Create At:</span>
              <span>{new Date(pool.create_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Current Stake:</span>
              <span>{(pool.current_stake/10**24).toFixed(2)} Near</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Description:</span>
              <span>{pool.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Maximum Stake:</span>
              <span>{pool.maximum_stake}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Minimum Stake:</span>
              <span>{pool.minimum_stake}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Owner ID:</span>
              <span>{pool.owner_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Stake Info:</span>
              <span>{renderStakeInfo(pool.stake_info)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Staking Period:</span>
              <span>{pool.staking_period/1000/60/60/24} Day</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Stake:</span>
              <span>{(pool.total_stake/10**24).toFixed(2)} Near</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Unstake Info:</span>
              <span>{pool.unstake_info && renderUnStakeInfo(pool.unstake_info)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Unstaking Period:</span>
              <span>{pool.unstaking_period/1000/60/60/24} Day</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 w-1/2 mx-auto">
          <div className="col-span-1">
            <form onSubmit={stake} className="pt-8 ">
              <div>For Subscribers</div>
              <input
                type="number"
                onChange={(e) => setAmount(e.target.value)}
                className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-100 font-medium ease-in-out mr-4"
              />
              <button disabled={isJoinPool} type="submit" className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
                {isJoinPool ? "Loading..." : "Join Pool"}
              </button>
            </form>
            {
              pool.stake_info.hasOwnProperty(account) &&
            <button disabled={isUnstake} onClick={() => unstake()} className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
              {isUnstake ? "Loading..." : "Unstake"}
            </button>
            }
          </div >
          <form onSubmit={stake} className="pt-8 col-span-1 pb-40 flex flex-col justify-end">
            <div>For Instructors</div>
            <button disabled={isSubmit} onClick={applyPool} className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
      {isSubmit ? "Loading..." : "Apply to Teach"}
              </button>
          </form>
        </div>
        <div className="flex items-center justify-center mx-auto">
          {pool.winner !== null ? (
              <div className="flex flex-col items-center text-center" >
                <h1 className="font-bold text-2xl">Winner: <span className="text-red-400">{pool.winner.split(".")[0]}</span></h1>
                <div className="w-[300px] h-[300px] relative overflow-hidden rounded-full">
                  <ImageAccount user_id={pool.winner}/>
                </div>
              </div>
            ) : (
              <div>
                <VotesInstructor poolInfo={pool}/>
              </div>
            )}
        </div>
        { account === pool.owner_id && pool.winner === null &&
          <div className="flex items-center justify-center py-16 w-1/2 mx-auto">
            <button disabled={isSubmitWinner} onClick={getWinner} className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
          {isSubmitWinner ? "Loading..." : "Get Winner"}
            </button>
          </div>
        }
      </section>
    )
  }
}

export default PoolDetails

