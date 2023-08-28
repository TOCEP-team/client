'use client'

import axiosInstance from "@/axiosInstance";
import { selectAccountId, selectWallet } from "@/features/walletSlice";
import { handleAssertionError } from "@/utils/error";
import Image from "next/image";
import { useState } from "react"
import { useSelector } from "react-redux";
import {useRouter} from 'next/navigation'
import { NO_DEPOSIT } from "@/utils/near-wallet";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const UpdateUser = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const [isLoading, setIsloading] = useState(false)
  const [error, setError] = useState(null)
  const route = useRouter()

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsloading(true);

      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axiosInstance.post('/course/upload-image', formData);
      
      if (response.data.message === "Successfully uploaded") {
        const uploadedAvatar = response.data.response[0].presignedUrl;
        const args = {}

        args.avatar = null;
        args.nickname = null;
        args.last_name = null;
        args.first_name = null;
        args.first_name = null;
        args.email = null;
        args.resume = uploadedAvatar;
        
        await wallet.callMethod({
          contractId: CONTRACT_ID,
          method: "update_user_information",
          args,
          deposit: NO_DEPOSIT
        })
        route.push(`/profile/${account}`)
      } else {
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="text-gray-900 max-w-[1440px] mx-auto w-3/4">
      <form onSubmit={handleFormSubmit} >
        <h1>Create user</h1>
        <div className="flex flex-col">
          {selectedImage && (
            <div className="items-start flex flex-col items-center">
              <div  className="w-[250px] h-[400px] relative">
                <Image
                  fill
                  alt="Avatar"
                  className="object-cover"
                  src={URL.createObjectURL(selectedImage) ?? ""}
                />
                <br />
              </div>
              <button className="justify-start items-start" onClick={() => setSelectedImage(null)}>Remove</button>
            </div>
          )}

          <input
            type="file"
            name="myImage"
            onChange={(event) => {
              setSelectedImage(event.target.files[0]);
            }}
          />
        </div>
        {isLoading ? (
          <button className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out mt-4">
            Loading..</button>
        ) : (
          <button type="submit" className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out mt-4">
            Upload your Resume to Register
          </button>
        )}
        {error && (
          handleAssertionError(error.toString())
        )}
      </form>
    </div>
  )
}

export default UpdateUser
