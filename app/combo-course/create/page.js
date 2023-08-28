'use client'

import { selectWallet } from "@/features/walletSlice"
import { useEffect } from "react";
import { useState } from "react";
import {motion} from 'framer-motion'
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation";
import { convertToSlug } from "@/utils/convert_slug";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME;

const ComboCoursePage = () => {
  const wallet = useSelector(selectWallet);
  const [comboTitle, setComboTitle] = useState('');
  const [courses, setCourses] = useState([{ course_id: '', price: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };
  const [comboError, setComboerror] = useState()

  const createCombo = async () => {
    setIsLoading(true); 
    const specialCharacters = /^[0-9a-zA-Z ]*$/;
    if (!specialCharacters.test(comboTitle)) {
      setComboerror("Combo title should not contain special characters.")
      setIsLoading(false); 
      return;
    } else {
      setComboerror("")
      try {
        const formattedCourses = courses.map(course => ({
          ...course,
          price: parseFloat(course.price) // Ensure price is a number
        }));

        await wallet.callMethod({
          contractId: CONTRACT_ID,
          method: 'create_combo',
          args: {
            combo_title: comboTitle,
            courses: formattedCourses,
          },
        });
        route.push(`/combo-course/combo_${convertToSlug(comboTitle)}`)
      } catch (error) {
        console.log(error)
        setIsLoading(false); 
      } finally {
        setIsLoading(false); 
      }
    }
  };

  const [courseId, setCourseid] = useState([])

  useEffect(() => {
    const fetchCourse = async () => {
      await wallet.viewMethod({
        contractId: CONTRACT_ID,
        method: "get_all_course_id",
        args: {}
      }).then((res) => setCourseid(res))
    }
    fetchCourse();
  }, [])

  return (
    <section className="min-h-screen flex justify-center items-center">
      <motion.div
        initial={{opacity: 0, y: 100}}
        animate={{opacity: 1, y: 0}}
        transition={{
          delay: 0.1
        }}
        className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create Combo Course</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Combo Title:</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            value={comboTitle}
            onChange={(e) => setComboTitle(e.target.value)}
          />
          {comboError &&
           <p className="text-red-500 text-sm">{comboError}</p>
          }
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Courses:</label>
          {courses.map((course, index) => (
            <div key={index} className="mb-2">
              <select
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                value={course.course_id || ''}
                onChange={(e) => handleCourseChange(index, 'course_id', e.target.value)}
              >
                <option value="">Select a Course</option>
                {courseId.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>              <input
              type="number"
              placeholder={`Course ${index + 1} Price`}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={course.price || ''}
              onChange={(e) => handleCourseChange(index, 'price', e.target.value)}
                 />
            </div>
          ))}
          <button
            className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out"
            onClick={() => setCourses([...courses, { course_id: courseId[0] || '', price: '' }])}
          >
            Add Course
          </button>
        </div>
        <button
          disabled={isLoading}
          className="bg-green-500 border-gray-300 shadow-md px-4 py-2 rounded-md text-gray-600 hover:bg-green-700 hover:text-white transition-all duration-100 font-medium ease-in-out"

          onClick={createCombo}
        >
          {isLoading ? "Loading..." : "Create Combo"}
        </button>
      </motion.div>
    </section>
  );
}

export default ComboCoursePage
