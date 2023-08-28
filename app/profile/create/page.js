'use client'

import axiosInstance from "@/axiosInstance";
import { selectAccountId, selectWallet } from "@/features/walletSlice";
import { handleAssertionError } from "@/utils/error";
import { NO_DEPOSIT } from "@/utils/near-wallet";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { useSelector } from "react-redux";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "ver-1.vbi-academy.testnet";

const RegiterUser = () => {
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const [isLoading, setIsloading] = useState(false)
  const [error, setError] = useState(null)
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [bio, setBio] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null);
  const route = useRouter();
  const [errorName, setErrorName] = useState('')

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsloading(true);

    const specialCharacters = /^[0-9a-zA-Z ]*$/;
    if (!specialCharacters.test(name)) {
      setErrorName("Combo title should not contain special characters.")
      setIsloading(false); 
      return;
    } else {
      setErrorName("")
      try {
        const formData = new FormData();
        formData.append('image', selectedImage);

        const response = await axiosInstance.post('/course/upload-image', formData);
        
        if (response.data.message === "Successfully uploaded") {
          const uploadedAvatar = response.data.response[0].presignedUrl;
          const args = {}

          args.avatar = uploadedAvatar;
          if (name !== null) args.nickname = name;
          if (firstName !== null) args.first_name = firstName;
          if (lastName !== null) args.last_name = lastName;
          if (bio !== null) args.bio = bio;
          if (email !== null) args.email = email;
          
          await wallet.callMethod({
            contractId: CONTRACT_ID,
            method: "create_user",
            args,
            deposit: NO_DEPOSIT
          });
          route.push(`/profile/${account}`)
        } else {
          console.error('Image upload failed');
        }
      } catch (err) {
        console.log('Error:', err);
      } finally {
        setIsloading(false);
      }
    }
  };

  return (
    <div className="text-gray-900 max-w-[1440px] mx-auto w-1/4 flex flex-col justify-center h-full items-center text-center">
      <form onSubmit={handleFormSubmit} >
        <h1
          className="mt-8 font-bold text-2xl text-gray-600 underline px-4 py-2"
        >CREATE USER</h1>
        <div className="flex flex-col">
          <h1 className="items items-start justify-start text-left semibold text-sm">Name <span className="text-red-500">*</span></h1>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          {errorName &&
           <p className="text-red-500 text-sm">{errorName}</p>
          }
          <h1 className="items items-start justify-start text-left semibold text-sm">FirstName </h1>
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          <h1 className="items items-start justify-start text-left semibold text-sm">LastName</h1>
          <input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          <h1 className="items items-start justify-start text-left semibold text-sm">Bio </h1>
          <input
            type="text"
            onChange={(e) => setBio(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          <h1 className="items items-start justify-start text-left semibold text-sm">Email</h1>
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          <h1 className="items items-start justify-start text-left semibold text-sm">Avatar <span className="text-red-500">*</span></h1>
          {selectedImage && (
            <div className="flex flex-col items-center justify-center">
              <img
                alt="not found"
                width={"250px"}
                src={URL.createObjectURL(selectedImage)}
              />
              <br />
              <button onClick={() => setSelectedImage(null)}>Remove</button>
            </div>
          )}

          <input
            type="file"
            name="myImage"
            onChange={(event) => {
              console.log(event.target.files[0]);
              setSelectedImage(event.target.files[0]);
            }}
          />
        </div>
        {isLoading ? (

          <button className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
            Loading..</button>
        ) : (
          <button className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out mt-4">
            Create
          </button>
        )}
        {error && (
          handleAssertionError(error.toString())
        )}
      </form>
    </div>
  )
}

export default RegiterUser
