'use client'

import axiosInstance from "@/axiosInstance";
import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice";
import { defaultCourseState } from "@/state";
import { Accordion, AccordionBody, AccordionHeader } from "@material-tailwind/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const LessonDetails = () => {
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const isLoading = useSelector(selectIsLoading);
  const [user, setUser] = useState(null);
  const [courseCT, setCourseCT] = useState(defaultCourseState)
  const route = usePathname();

  const [open, setOpen] = useState(null);
  const urlSplit = route.split("/");
  let course_id = urlSplit[2];
  let section_id = urlSplit[4];
  let lesson_id = urlSplit[6];

  const [sections, setSections] = useState([])
  const [lessons, setLessons] = useState([])
  const [hash, setHash] = useState()
  const [rating, setRating] = useState(0);

  const handleRatingChange = (event) => {
    const newRating = parseInt(event.target.value, 10);
    if (!isNaN(newRating) && newRating >= 1 && newRating <= 10) {
      setRating(newRating);
    }
  };


  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        await axiosInstance.get(`/course/${course_id}/sections`).then((res) => setSections(res.data));
        await axiosInstance.get(`/course/${course_id}/sections/${section_id}/lesson/${lesson_id}`).then((res) => setLessons(res.data));

      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    fetchCourse();
  }, [account]);


  useEffect(() => {
    if (wallet && account) {
      const fethash = async () => {
        let data = await axiosInstance.get(`/check-hash/${course_id}/${account}`);
        setHash(data.data)
      };
      fethash()
    }
  }, [account, wallet])

  const [isSubmitCompleted, setIssubmitcompleted] = useState(false)

  const makeCompletedCourse = async (course_id) => {
    setIssubmitcompleted(true)
    if (account && wallet) {
      let result = await axiosInstance.get(`/check-hash/${course_id}/${account}`);
      if (result.data?.hash_secret === '') {
        await wallet.callMethod({
          contractId: CONTRACT_ID,
          method: "make_user_finish_course",
          args: {
            course_id: course_id,
            media: "/images/logo.png",
            rating: rating,
            hash_collection: result.data.hashed_sent,
          }
        });
        router.push(`/profile/${account}`)
      } else {
        console.log("The Secret key error!")
        setIssubmitcompleted(false)
      }
    }
  }
  
  useEffect(() => {
    const fetchUser = async () => {
      if (urlSplit[1] === "course" && course_id !== undefined && wallet) {
        try {
          if (account) {
            await wallet.viewMethod({
              contractId: CONTRACT_ID,
              method: "get_user_metadata_by_user_id",
              args: {
                user_id: account
              }
            }).then((res) => setUser(res));
            await wallet.viewMethod({
              contractId: CONTRACT_ID,
              method: "get_course_metadata_by_course_id",
              args: {
                course_id: course_id
              }
            }).then((res) => setCourseCT(res))
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [wallet, isLoading]);

  const router = useRouter();

  const changeLesson = (sectionIndex, lessonIndex) => {
    const selectedSection = sections[sectionIndex];
    const selectedLesson = selectedSection.lessons[lessonIndex];
    
    if (selectedLesson.slug_lesson !== lesson_id) {
      router.push(`/course/${course_id}/sections/${selectedSection.slug_section}/lesson/${selectedLesson.slug_lesson}`);
    } else {
      console.log("ok");
    }
  }
  const makeCompleted = async () => {
    try {
      await axiosInstance.post(`/sections/completed`, {
        course_id: course_id,
        section_id: section_id, 
        user_id: account
      })
      window.location.reload();
    } catch (err) {
      console.log(err)
    }
  }


  if (user && user.courses.includes(course_id) || courseCT.instructor_id.hasOwnProperty(account)) {
    return (
      <section className="flex">
        <div className="w-2/3 p-4">
          <div className="video-container relative">
            <div className="video-container">
              {lessons.video && 
               <video controls width="100%" height="auto">
                 <source src={lessons.video} type="video/mp4" />
               </video>
              }
            </div>
            <h1>{lessons.title}</h1>
            <p>{lessons.content}</p>
          </div>
        </div>
        <div className="w-1/3 p-4">
          {sections && sections.length >= 1 && sections.map((section, sectionIndex) => (
            <div className="text-gray-800" key={section._id}>
              <Accordion open={open === section._id}>
                <div className="flex items-center justify-between">
                  <AccordionHeader onClick={() => handleOpen(section._id)}>{section.title}</AccordionHeader>
                </div>
                <AccordionBody>
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div className="text-gray-600" key={lesson._id}>
                      <Accordion open={open === lesson._id}>
                        <div className="flex items-center justify-between text-md">
                          <button onClick={() => changeLesson(sectionIndex, lessonIndex)}>
                            {lesson.title}
                          </button>
                          {lessonIndex === section.lessons.length - 1 && section.slug_section === section_id && !hash?.sectionCompleted?.includes(section_id) ? (
                            <button onClick={makeCompleted}>Complete Section</button>
                          ) : null}
                        </div>
                      </Accordion>
                    </div>
                  ))}
                </AccordionBody>
              </Accordion>
            </div>
          ))}
          <div className="flex flex-col items-center py-4 space-y-4">
            {courseCT && courseCT.instructor_id.hasOwnProperty(account) &&
             <Link
               className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-100 font-medium ease-in-out"
               href={`/course/${course_id}/sections/edit`}>Edit Lesson</Link>
            }
            {/* TODO: Make completed error not response */}
            {hash?.hash_secret === '' &&
             <>
               <input
                 type="number"
                 value={rating}
                 onChange={handleRatingChange}
                 min="1"
                 max="10"
               />

               <button
                 disabled={isSubmitCompleted}
                 className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out"
                 onClick={() => makeCompletedCourse(course_id, account)}>
                 { isSubmitCompleted ?"Loading..." :"Completed course"}</button>
             </>
            }
          </div>
        </div>
      </section>
    );
  }
}

export default LessonDetails


