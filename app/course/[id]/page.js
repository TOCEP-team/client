'use client';

import { usePathname } from 'next/navigation';
import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice";
import {Textarea} from '@material-tailwind/react'
import { useEffect, useState } from "react";
import Image from "next/image";
import { defaultCourseState } from "@/state";
import { useSelector } from 'react-redux';
import Link from 'next/link';
import BreadcrumbRoundedElevatedIconPreview from '@/components/common/bradcrumbs';
import RatingStars from '@/components/common/ratingStars';
import { Accordion, AccordionBody, AccordionHeader } from '@material-tailwind/react';
import axiosInstance from '@/axiosInstance';
import LoadingAnimation from '@/components/common/loading';
import {useRouter} from 'next/navigation'
import AgreeConsensus from './agreeConsensus';
import {motion} from 'framer-motion'
import ImageAccount from '@/components/getImageByAccount';
import { utils } from 'near-api-js';

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const CourseDetail = () => {
  const [courses, setCourses] = useState(defaultCourseState);
  const [user, setUser] = useState(null);
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const isLoading = useSelector(selectIsLoading);
  const [isSubmit, setIsSubmit] = useState(false)
  const route = usePathname();
  const [open, setOpen] = useState(0);
  const [lessonOpen, setLessonOpen] = useState(0);
  const [description, setDescription] = useState()
  const [idCourse, setIdcourse] = useState({image: "/images/logo.jpg", sections: [], description: ""})
  const [whatYoullLearn, setWhatyoulllearn] = useState('')
  const [requirements, setRequirements] = useState('')
  const router = useRouter();
  const [isSubmitWhatyoulearn, setIsSubmitWhatyoulearn] = useState(false)
  const [isSubmitRequirements, setIsSubmitRequirements] = useState(false)
  
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  const handleLessonOpen = (value) => setLessonOpen(lessonOpen === value ? 0 : value);

  const urlSplit = route.split("/");
  let course_id = urlSplit[2];

  useEffect(() => {
    const fetchUser = async () => {
      if (urlSplit[1] === "course" && course_id !== undefined && wallet) {
        try {
          await wallet.viewMethod({
            contractId: CONTRACT_ID,
            method: "get_course_metadata_by_course_id",
            args: {
              course_id: course_id,
            }
          }).then((res) => setCourses(res));
          if (account) {
            await wallet.viewMethod({
              contractId: CONTRACT_ID,
              method: "get_user_metadata_by_user_id",
              args: {
                user_id: account
              }
            }).then((res) => setUser(res));
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [wallet, isLoading]);

  useEffect(() => {
    const fetchCourse = async () => {
      await axiosInstance.get(`/course/${course_id}`).then((res) => setIdcourse(res.data));
    }
    fetchCourse();
  }, [requirements, description, whatYoullLearn]);

  const payment = async (price) => {
    if (account) {
      setIsSubmit(true)

      let hash = await axiosInstance.post("/hash", {
        course_id: course_id,
        user_id: account
      });

      try {
        if (hash) {
          await wallet.callMethod({
            contractId: CONTRACT_ID,
            method: "payment_course",
            args: {
              course_id: course_id,
              encode_check: hash.data.encodedHash,
            },
            deposit: utils.format.parseNearAmount(price.toString())
          });
          router.push(`/pool-request/${convertToSlug(pool_id)}`);
        }
        else {
          console.log("hash error");
        }
      } catch (err) {
        console.log(err)
      } finally {
        setIsSubmit(false)
      }
    }
  }

  let breadcrumbs = [
    {
      path: "/"
    },
    {
      path: "course"
    },
    {
      path: `${courses.title}`
    }
  ]

  const [hash, setHash] = useState("")

  useEffect(() => {
    if (user) {
      const fetchHash = async () => {
        await axiosInstance.get(`/check-hash/${course_id}/${account}`).then((res) => setHash(res.data))
      }
      fetchHash();
    }
  }, [account])

  const updateDescription = async (event) => {
    event.preventDefault();
    setIsSubmit(true);
    try {
      await axiosInstance.put(`/course/${course_id}`, {
        description: description
      })
    } catch (err) {
      console.log(err)
    } finally {
      setDescription('')
      setIsSubmit(false);
    }
  }
  const updateRequirements = async (event) => {
    event.preventDefault();
    setIsSubmitRequirements(true);
    try {
      await axiosInstance.put(`/course/${course_id}`, {
        requirements: requirements,
      });
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitRequirements(false);
    }
  }

  const updateWhatLearn = async (event) => {
    event.preventDefault();
    setIsSubmitWhatyoulearn(true);
    try {
      await axiosInstance.put(`/course/${course_id}`, {
        whatYoullLearn: whatYoullLearn
      });
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitWhatyoulearn(false);
    }
  }

  const studentsCompletedValues = Object.values(courses.students_completed);
  const totalStudentsCompleted = studentsCompletedValues.reduce((acc, value) => acc + value, 0);
  return (
    courses.course_id === '' ? (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f8f3ee] z-50 flex-col">
        <LoadingAnimation />
      </div>
    ) : (
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          viewport={{once: true}}
          whileInView={{opacity: 1}}
          transition={{
            delay: 0.1
          }}
          className="max-w-[1440px] mx-auto pt-2">
          <BreadcrumbRoundedElevatedIconPreview breadcrumbs={breadcrumbs}/>
        </motion.div>
        <div className="mx-auto px-2 text-gray-900 bg-secondary/10 py-8">
          <div className="max-w-[1440px] mx-auto grid grid-cols-8 gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{opacity: 1}}
              transition={{
                delay: 0.2
              }}
              className="col-span-5 flex flex-col justify-between items-start">
              <div>
                <h1 className="font-bold text-3xl pb-4">{courses.title}</h1>
                <span>{idCourse.description}</span>
                {courses.instructor_id.hasOwnProperty(account) &&
                 <form onSubmit={updateDescription} className="flex flex-col">
                   <h1 className="items items-start justify-start text-left semibold text-sm">Description <span className="text-red-500">*</span></h1>
                   <Textarea
                     className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
                     onChange={(e) => setDescription(e.target.value)}
                     value={description}
                     placeholder="Description about your course"
                     id="textarea"
                     cols="20"
                     rows="3"
                   />
                   <button type="submit" className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out"> Submit</button>
                 </form>
                }
              </div>
              <div className="flex space-x-4 items-center">
                <p className="text-sm text-gray-700"><span className="font-sm">Created At:</span> {new Date(courses.created_at).toLocaleString()}</p>
                <p className="text-sm text-gray-700"><span className="">Students:</span> {Object.entries(courses.students_studying_map).length}</p>
                {hash?.hash_secret === '' &&
                 <h1>Already To Completed</h1>
                }
                <div className="flex">
                  <span className="font-bold">Skill: </span>
                  {courses.skills.map((skill,index) => (
                    <span key={index}>{skill},</span>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{opacity: 1}}
              transition={{
                delay: 0.3
              }}
              className="col-span-3 overflow-hidden">
              <div className="w-[100%] pt-[60%] relative">
                <Image src={idCourse.image ? idCourse.image : "/images/logo.jpg"} alt="course image" className="object-cover" fill priority/>
              </div>
            </motion.div>
            <div className="col-span-3 col-start-6 flex justify-between items-center space-x-4">
              <div className="flex space-x-2 items-center">
                  <>
                    <RatingStars totalStars={5} rating={totalStudentsCompleted} length={Object.entries(courses?.students_completed).length} /> <span className="text-sm text-blue-600">({Object.entries(courses.students_completed).length})</span>
                  </>
              </div>
              {!account && (
                <button onClick={() => wallet.signIn()} className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out" >
                  Connect Wallet
                </button>
              )}
              {courses.students_studying_map.hasOwnProperty(account) | courses.students_completed.hasOwnProperty(account) && 
               <Link href={`/course/${course_id}/sections/${idCourse?.sections[0]?.slug_section}/lesson/${idCourse?.sections[0]?.lessons[0].slug_lesson}`} className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out" >
                 Learn Now
               </Link>
              }
              {courses.instructor_id.hasOwnProperty(account)  && 
               <Link href={`/course/${course_id}/sections/${idCourse?.sections[0]?.slug_section}/lesson/${idCourse?.sections[0]?.lessons[0]?.slug_lesson}`} className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out" >
                 Learn Now
               </Link>
              }
              {user && account && !user?.courses?.includes(course_id) && !courses?.instructor_id.hasOwnProperty(account) && (
                !isSubmit ? (
                  <button onClick={() => payment(idCourse.price)} className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out" >
                    Payment {idCourse.price} Near
                  </button>
                ) : (
                  <button className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out" >
                    Loading....
                  </button>
                )
              )} 
              {account && user === null &&
               <Link href={"/profile/create"} className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out" >
                 Register to Buy Course
               </Link>
              }
            </div>
          </div>
        </div>
        {/* What will learn */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.4}}
          className="max-w-[1440px] mx-auto pt-2 grid grid-cols-8 pt-8 gap-4">
          <div className="col-span-3 rounded-sm py-4 px-2">
            <h1 className="text-xl font-bold">What you will learn!</h1>
            <span>{idCourse.whatYoullLearn}</span>
            {courses.instructor_id.hasOwnProperty(account) &&
             <form onSubmit={updateWhatLearn} className="flex flex-col">
               <Textarea
                 className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
                 onChange={(e) => setWhatyoulllearn(e.target.value)}
                 value={whatYoullLearn}
                 placeholder="Description about your course"
                 id="textarea"
                 cols="30"
                 rows="3"
               />
               <button type="submit" disabled={isSubmitWhatyoulearn} className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out"> {isSubmitWhatyoulearn ? "Loading..." : "Submit"}</button>
             </form>
            }
            <h1 className="text-xl font-bold">Requirements</h1>
            <span>{idCourse.requirements}</span>
            {courses.instructor_id.hasOwnProperty(account) &&
             <form onSubmit={updateRequirements} className="flex flex-col">
               <Textarea
                 className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
                 onChange={(e) => setRequirements(e.target.value)}
                 placeholder="Description about your course"
                 value={requirements}
                 id="textarea"
                 cols="30"
                 rows="3"
               />
             <button type="submit" disabled={isSubmitRequirements} className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out"> {isSubmitRequirements ? "Loading..." : "Submit"}</button>
             </form>}
          </div>
          {/* Outline */}
          <div className="col-span-5">
            <h1 className="col-span-5 col-start-2 font-bold text-3xl underline"> Outline </h1>
            {courses && courses.instructor_id.hasOwnProperty(account) &&
             <Link href={`/course/${course_id}/sections`}  className="text-xs">Edit Lesson</Link>
            }
            {idCourse.sections && idCourse.sections.length >= 1 && idCourse.sections.map((section) => (
              <div className="text-gray-800" key={section._id}>
                <Accordion open={open === section._id}>
                  <div className="flex items-center justify-between">
                    <AccordionHeader onClick={() => handleOpen(section._id)}>{section.title}</AccordionHeader>
                  </div>
                  <AccordionBody>
                    {section.lessons.map((lesson) => (
                      <div className="text-gray-600" key={lesson._id}>
                        <Accordion open={open === lesson._id}>
                          <div className="flex items-center justify-between text-md">
                            <button onClick={() => handleLessonOpen(lesson._id)}>{lesson.title}</button>
                          </div>
                          <AccordionBody>
                            {lesson.content}
                          </AccordionBody>
                        </Accordion>
                      </div>
                    ))}
                  </AccordionBody>
                </Accordion>
              </div>
            ))}
          </div>
        </motion.div>
        <div>
          {courses.instructor_id.hasOwnProperty(account) && 
           <AgreeConsensus wallet={wallet} contractId={CONTRACT_ID} course_id={course_id} course={courses}/>
          }
        </div>
        <h1 className="font-semibold text-gray-600 flex text-center items-center justify-center text-xl">Completed Students</h1>
        <div className="max-w-[1440px] mx-auto flex items-center justify-center pt-4">
          {Object.entries(courses.students_completed).map(([user, rating]) => (
            <a href={`/profile/${user}`} className="flex items-center justify-center flex-col space-y-2">
              <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden flex">
                <ImageAccount user_id={user}/>
              </div>
              <h1>{user.split(".")[0]} - {rating} Point</h1>
            </a>
          ))}
        </div>
      </section>
    )
  );
}

export default CourseDetail;
