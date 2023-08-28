'use client'

import axiosInstance from "@/axiosInstance"
import BreadcrumbRoundedElevatedIconPreview from "@/components/common/bradcrumbs"
import { selectAccountId, selectWallet } from "@/features/walletSlice"
import { convertToSlug } from "@/utils/convert_slug"
import { Textarea } from "@material-tailwind/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSelector } from "react-redux"

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME;

const RequestCourse = () => {
  const wallet = useSelector(selectWallet);
  const [poolId, setPoolid] = useState(null)
  const [poolIdError, setPoolIdError] = useState('');
  const [mini, setMini] = useState(10)
  const [max, setMax] = useState(100)
  const [description, setDescription] = useState('')
  const [isSubmit, setIssubmit] = useState(false)
  const route = useRouter();
  const account = useSelector(selectAccountId);

  const breadcrumbs = [
    {
      path: "/",
    },
    {
      path: "request-course"
    },
  ]
  const createPoolRequest = async (event) => {
    event.preventDefault();
    setIssubmit(true)
    const specialCharacters = /^[0-9a-zA-Z ]*$/;
    if (!specialCharacters.test(poolId)) {
      setPoolIdError('Pool title should not contain special characters.');
      setIssubmit(false);
      return;
    } else {
      setPoolIdError('')
      try {
        await wallet.callMethod({
          contractId: CONTRACT_ID,
          method: "create_pool_request",
          args: {
            pool_title: poolId,
            description: description !== '' ? description : "",
            minimum_stake: mini,
            maximum_stake: max,
          }
        });
        await axiosInstance.post("/pool/create", {
          pool_id: poolId,
          owner_id: account,
          title: poolId
        })
        route.push(`/pool-request/${convertToSlug(poolId)}`)
      } catch (err) {
        console.log(err)
      } finally {
        setIssubmit(false)
      }
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto grid grid-cols-8">
      <div className="col-span-8">
        <BreadcrumbRoundedElevatedIconPreview breadcrumbs={breadcrumbs}/>
      </div>
      <div className="col-span-8">
        <div className="flex flex-col items-center justify-center">
          <form onSubmit={createPoolRequest}>
            <h1 className="items items-start justify-start text-left semibold text-sm">Title <span className="text-red-500">*</span></h1>
            <Textarea
              className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
              onChange={(e) => {
                setPoolid(e.target.value);
                setPoolIdError('')
              }}
              placeholder="Title of the pool"
              id="textarea"
              cols="80"
              rows="2"
            />
            {poolIdError && (
              <p className="text-red-500 text-sm">{poolIdError}</p>
            )}
            <h1 className="items items-start justify-start text-left semibold text-sm">Description <span className="text-red-500">*</span></h1>
            <Textarea
              className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description about your request"
              id="textarea"
              cols="80"
              rows="10"
            />

            <h1 className="items items-start justify-start text-left semibold text-sm">Minimun <span className="text-red-500">*</span></h1>
            <Textarea
              className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
              onChange={(e) => setMini(e.target.value)}
              placeholder="Description about your request"
              id="textarea"
              cols="20"
              rows="1"
            />
            <h1 className="items items-start justify-start text-left semibold text-sm">Maximum <span className="text-red-500">*</span></h1>
            <Textarea
              className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
              onChange={(e) => setMax(e.target.value)}
              placeholder="Description about your request"
              id="textarea"
              cols="20"
              rows="1"
            />
            {!isSubmit ? (
              <button type='submit' className="w-1/3 mt-4 border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out" >
                Submit
              </button>
            ) : (
              <button className="w-1/3 mt-4 border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out" >
                Loading..
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default RequestCourse
