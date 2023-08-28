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
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [bio, setBio] = useState(null)
  const [resume, setResume] = useState(null)
  const route = useRouter()

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsloading(true);

      const formData = new FormData();
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      try {
        // Try to upload the image
        const response = await axiosInstance.post('/course/upload-image', formData);

        if (response) {
          const uploadedAvatar = response.data.response[0].presignedUrl;
          const args = {}

          if (uploadedAvatar) args.avatar = uploadedAvatar;
          if (name) args.nickname = name;
          if (firstName) args.first_name = firstName;
          if (lastName) args.last_name = lastName;
          if (bio) args.bio = bio;
          if (email) args.email = email;
          if (resume) args.resume = resume;

          await wallet.callMethod({
            contractId: CONTRACT_ID,
            method: "update_user_information",
            args,
            deposit: NO_DEPOSIT
          }).then(() => route.push(`/profile/${account}`));
        } else {
          console.error('Image upload failed');
        }
      } catch (imageUploadError) {
        console.error('Image upload error:', imageUploadError);
        // Continue with the rest of the process even if image upload fails
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
          <h1 className="items items-start justify-start text-left semibold text-sm">Name <span className="text-red-500">*</span></h1>
          <input
            type="text"
            name="Name"
            onChange={(e) => setName(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          <h1 className="items items-start justify-start text-left semibold text-sm">Avatar <span className="text-red-500">*</span></h1>
          {selectedImage && (
            <div className="items-start flex flex-col items-center">
              <div  className="w-[200px] h-[200px] relative">
                <Image
                  fill
                  alt="Avatar"
                  className="object-cover rounded-full"
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
          <h1 className="items items-start justify-start text-left semibold text-sm">FirstName <span className="text-red-500">*</span></h1>
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          <h1 className="items items-start justify-start text-left semibold text-sm">LastName <span className="text-red-500">*</span></h1>
          <input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          <h1 className="items items-start justify-start text-left semibold text-sm">Bio <span className="text-red-500">*</span></h1>
          <input
            type="text"
            onChange={(e) => setBio(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          <h1 className="items items-start justify-start text-left semibold text-sm">Email <span className="text-red-500">*</span></h1>
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          <h1 className="items items-start justify-start text-left semibold text-sm">Resume <span className="text-red-500">*</span></h1>
          <input
            type="text"
            onChange={(e) => setResume(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
        </div>
        {isLoading ? (
          <button className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out mt-4">
            Loading..</button>
        ) : (
          <button type="submit" className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out mt-4">
            Update
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
