'use client'

import axiosInstance from "@/axiosInstance";
import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice";
import { defaultCourseState } from "@/state";
import { Textarea } from "@material-tailwind/react";
import { Accordion, AccordionBody, AccordionHeader } from "@material-tailwind/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const addNewLession = () => {
  const route = usePathname();
  const [open, setOpen] = useState(1);
  const [lessonOpen, setLessonOpen] = useState(0);
  const [course, setCourse] = useState([])
  const router = useRouter();
  const wallet = useSelector(selectWallet)
  const account = useSelector(selectAccountId);
  const isLoading = useSelector(selectIsLoading)
  const [titleSection, setTitleSection] = useState([])
  const [titleLesson, setTitleLesson] = useState('')
  const [contentLesson, setContentLesson] = useState('')
  const [videoUrl, setVideoUrl] = useState(null)
  const [isSubmit, setIsSubmit] = useState(false)
  const [isLessonSubmit, setIslessonsubmit] = useState(false)

  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  const handleLessonOpen = (value) => setLessonOpen(lessonOpen === value ? 0 : value);

  const urlSplit = route.split("/");
  let course_id = urlSplit[2];

  const [courses, setCourses] = useState(defaultCourseState)

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
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [wallet, isLoading]);

  useEffect(() => {
    const fetchCourse = async () => {
      await axiosInstance.get(`/course/${course_id}`).then((res) => setCourse(res.data));
    }
    fetchCourse();
  }, []);
  console.log("cc", course)

  const addNewSections = async (event) => {
    event.preventDefault();
    setIsSubmit(true);
    try {
      await axiosInstance.post(`/course/${course.slug}/sections`, {
        title: titleSection,
      });
      window.location.reload()
      // router.push(`/course/${course.slug}`)
      router.refresh()
    } catch (err) {
      console.log(err)
    } finally {
      setTitleSection('')
      setIsSubmit(false);
    }
  }

  const addNewLesson = async (event) => {
    event.preventDefault();
    setIslessonsubmit(true);
    try {
      const formData = new FormData();
      formData.append('image', videoUrl);

      const response = await axiosInstance.post('/course/upload-image', formData);

      if (response.status === 201) {
        const video = response.data.response[0].presignedUrl;
        await axiosInstance.post(`/course/${course.slug}/sections/${titleSection}/lesson`, {
          title: titleLesson,
          content: contentLesson,
          video: video
        });
        window.location.reload()
        router.refresh()
      } else {
        console.log("Upload error")
      }
    } catch (err) {
      console.log(err)
    } finally {
      setContentLesson('')
      setTitleLesson('')
      setVideoUrl('')
      setIslessonsubmit(false);
    }
  }

  return (
    <div className="col-span-5">
      <h1 className="col-span-5 col-start-2 font-bold text-3xl underline"> Outline </h1>
      <a href={`/profile/${account}`} className="col-span-5 col-start-2 font-bold text-3xl underline"> View Course </a>
      {course.sections && course.sections.length >= 1 && course.sections.map((section) => (
        <div className="text-gray-800" key={section._id}>
          <Accordion open={open === section._id}>
            <div className="flex items-center justify-between">
              <AccordionHeader onClick={() => handleOpen(section._id)}>{section.title}</AccordionHeader>
              <Link href={`/course/${course_id}/sections/${section.slug_section}`}  className="text-xs">Add Lesson</Link>
            </div>
            <AccordionBody>
              {section.lessons.length >= 1 && section.lessons.map((lesson) => (
                <div className="text-gray-600" key={lesson._id ? lesson._id : lesson.slug_lesson}>
                  <Accordion open={lessonOpen === lesson._id}>
                    <div className="flex items-center justify-between text-md">
                      <AccordionHeader onClick={() => handleLessonOpen(lesson._id)}>{lesson.title}</AccordionHeader>
                    </div>
                    <AccordionBody>
                      {lesson.content}
                      <Link href={`/course/${course_id}/sections/${section.slug_section}/lesson/${lesson.slug_lesson}`}>Learn</Link>
                    </AccordionBody>
                  </Accordion>
                </div>
              ))}
            </AccordionBody>
          </Accordion>
        </div>
      ))}
      <form onSubmit={addNewLesson} className="flex flex-col">
        <select
          onChange={(e) => setTitleSection(e.target.value)}
          className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
        >
          <option value="">Select a section</option>
          {course.sections &&
           course.sections.map((section) => (
             <option key={section._id} value={section.slug_section}>
               {section.title}
             </option>
           ))}
        </select>
        <h1 className="items items-start justify-start text-left semibold text-sm">Title Lesson <span className="text-red-500">*</span></h1>
        <Textarea
          className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          onChange={(e) => setTitleLesson(e.target.value)}
          value={titleLesson}
          placeholder="Description about your course"
          id="textarea"
          cols="30"
          rows="2"
        />
        <h1 className="items items-start justify-start text-left semibold text-sm">Content Lesson <span className="text-red-500">*</span></h1>
        <Textarea
          className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
          onChange={(e) => setContentLesson(e.target.value)}
          value={contentLesson}
          placeholder="Description about your course"
          id="textarea"
          cols="30"
          rows="2"
        />
        <h1 className="items items-start justify-start text-left semibold text-sm">Video <span className="text-red-500">*</span></h1>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            setVideoUrl(event.target.files[0]);
          }}
        />
        {
          courses.instructor_id.hasOwnProperty(account) &&
            <button disabled={isLessonSubmit} type='submit' className="w-1/3 mx-auto mt-4 border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out" >
          {isLessonSubmit ? "Loading..." : "Add new Lesson"}
            </button>
        }
      </form>

      {courses.instructor_id.hasOwnProperty(account) &&
       <form onSubmit={addNewSections} className="flex flex-col">
         <h1 className="items items-start justify-start text-left semibold text-sm">Title Section <span className="text-red-500">*</span></h1>
         <Textarea
           className="peer rounded-md px-2 py-1 email-input text-gray-800 border border-gray-300"
           onChange={(e) => setTitleSection(e.target.value)}
           value={titleSection}
           placeholder="Description about your course"
           id="textarea"
           cols="10"
           rows="0.5"
         />
         {isSubmit ? (
           <button className="w-1/3 mx-auto mt-4 border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
             loading
           </button>
         ) : (
           courses.instructor_id.hasOwnProperty(account) &&
             <button type='submit' className="w-1/3 mx-auto mt-4 border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
               Add New Section
             </button>
         )}
       </form>}

    </div>
  )
}

export default addNewLession
