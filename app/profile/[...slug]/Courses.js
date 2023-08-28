import Image from "next/image"
import Link from "next/link"
import RatingStars from '@/components/common/ratingStars';

const Courses = ({course}) => {
  const studentsCompletedValues = Object.values(course.students_completed);
  const totalStudentsCompleted = studentsCompletedValues.reduce((acc, value) => acc + value, 0);
  return (
    <div className="flex grid grid-cols-3 max-w-[1440px] mx-auto space-x-4 pt-4 text-md ">
      <div style={{ width: '100%', paddingTop: '60%', position: 'relative' }}>
        <Link href={`/course/${course.course_id}`} className="col-span-1 rounded-md hover:rounded-none overflow-hidden">
          <Image src={course.media ? course.media : "/images/logo.jpg"} alt="course image" fill className="rounded-md hover:rounded-none transition-all duration-200 ease-in-out hover:scale-105 object-cover"/>
        </Link>
      </div>
      <div className="flex flex-col items-start justify-between col-span-2">
        <div>
          <h1><span className="font-bold">Title:</span> {course.title}</h1>
          <div className="flex items-center space-x-2 flex">
            <RatingStars totalStars={5} rating={totalStudentsCompleted} size={3} length={Object.entries(course?.students_completed).length} /> <span className="text-sm text-blue-600">({Object.entries(course.students_completed).length})</span>
          </div>
          <p><span className="font-bold">Publish At:</span> {new Date(course.created_at).toLocaleString()}</p>
        </div>
        <Link href={`/course/${course.course_id}`} className="border border-gray-400 bg-[#fbc40f] px-2 py-1 rounded-md text-gray-600 hover:bg-button-dark transition-all duration-100 text-xs font-bold ease-in-out"
        >View Detail</Link>
      </div>
    </div>
  )
}

export default Courses
