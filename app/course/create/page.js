'use client'

import axiosInstance from "@/axiosInstance";
import { selectAccountId, selectWallet } from "@/features/walletSlice";
import { handleAssertionError } from "@/utils/error";
import {Textarea} from '@material-tailwind/react'
import { utils } from "near-api-js";
import Image from "next/image";
import { useState } from "react"
import { useSelector } from "react-redux";
import {useRouter} from 'next/navigation'
import { NO_DEPOSIT } from "@/utils/near-wallet";
import { convertToSlug } from "@/utils/convert_slug";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const options = ["Rust", "React", "Javascript", "Blockchain", "Solidity", "HTML", "CSS", "C", "C++"]

const CreateCourse = () => {
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const [isLoading, setIsloading] = useState(false)
  const [error, setError] = useState(null)
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState('')
  const [media, setMedia] = useState(null)
  const [price, setPrice] = useState(0)
  const route = useRouter();
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSkillSelect = (option) => {
    if (selectedSkills.includes(option)) {
      setSelectedSkills(selectedSkills.filter(skill => skill !== option));
    } else {
      setSelectedSkills([...selectedSkills, option]);
    }
  };

  const [courseError, setCourseerror] = useState('')

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsloading(true)
    setError("")

    const specialCharacters = /^[0-9a-zA-Z ]*$/;
    if (!specialCharacters.test(title)) {
      setCourseerror('Course title should not contain special characters.');
      setIsloading(false);
      return;
    } else {
      setCourseerror('');
      try {
        const formData = new FormData();
        formData.append('image', media);

        const response = await axiosInstance.post('/course/upload-image', formData);

        if (response.status === 201) {
          const uploadedAvatar = response.data.response[0].presignedUrl;
          let args = {}
          args.media = uploadedAvatar;
          if (title !== null) args.title = title.trim();
          if (description !== null) args.description = description;

          await wallet.callMethod({
            contractId: CONTRACT_ID,
            method: "create_course",
            args: {
              title: title,
              description: description,
              price: price,
              media: uploadedAvatar,
              skills: selectedSkills,
            },
            deposit: NO_DEPOSIT
          });
          await axiosInstance.post(
            '/course/create',
            {name: `${title}_${account.split(".")[0]}`,
             description: description !== "" ? description : "",
             price: price,
             image: uploadedAvatar
            });
          route.push(`/course/${convertToSlug(title)}_${account.split(".")[0]}`);
        } else {
          console.log('Image upload failed');
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsloading(false);
      }
    }
  };

  return  (
    <div className="text-gray-900 max-w-[1440px] mx-auto w-3/4">
      <form onSubmit={handleFormSubmit} >
        <h1>Create Course</h1>
        <div className="flex flex-col">
          <h1 className="items items-start justify-start text-left semibold text-sm">Title <span className="text-red-500">*</span></h1>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />
          {courseError &&
           <p className="text-red-500 text-sm">{courseError}</p>
          }
          <h1 className="items items-start justify-start text-left semibold text-sm">Description</h1>
          <Textarea
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description about your course"
            id="textarea"
            cols="30"
            rows="7"
          />
          <div className="flex flex-col">
            <h1 className="items items-start justify-start text-left semibold text-sm">Skills</h1>
            {options.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(option)}
                  onChange={() => handleSkillSelect(option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
          <h1 className="items items-start justify-start text-left semibold text-sm">Price <span className="text-red-500">*</span></h1>
          <input
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          />

          <h1 className="items items-start justify-start text-left semibold text-sm">Image <span className="text-red-500">*</span></h1>
          <input
            type="file"
            name="myImage"
            onChange={(event) => {
              setMedia(event.target.files[0]);
            }}
          />

          {media && (
            <div className="items-start flex flex-col items-center">
              <div  className="w-[600px] h-[300px] relative">
                <Image
                  fill
                  alt="Avatar"
                  className="object-cover"
                  src={URL.createObjectURL(media) ?? ""}
                />
                <br />
              </div>
              <button className="justify-start items-start" onClick={() => setMedia(null)}>Remove</button>
            </div>
          )}

        </div>
        <div className="flex items-center justify-center">
          {isLoading ? (
            <button className="border-gray-300 shadow-md bg-[#fbc40f] px-8 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
              Loading..</button>
          ) : (
            <button type="submit" className="border-gray-300 shadow-md bg-[#fbc40f] px-8 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
              Create
            </button>
          )}
        </div>
        {error && (
          handleAssertionError(error.toString())
        )}
      </form>
    </div>
  )
}

export default CreateCourse
