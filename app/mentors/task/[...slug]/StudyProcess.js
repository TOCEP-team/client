import React from 'react';

const StudyProcessComponent = ({ studyProcesses, makeLessonCompleted, account, isSubmit }) => {
  if (studyProcesses) {
    const completedStudents = [];
    const incompleteStudents = [];

    // Loop through studyProcesses to categorize students
    Object.keys(studyProcesses).forEach(instructor => {
      const studentList = studyProcesses[instructor].study_process_list;

      Object.keys(studentList).forEach(course => {
        const courseInfo = studentList[course];

        if (courseInfo.mentoring_completed) {
          completedStudents.push({
            instructor,
            course,
            courseInfo
          });
        } else {
          incompleteStudents.push({
            instructor,
            course,
            courseInfo
          });
        }
      });
    });

    const StudentCard = ({ student, shouldShowButton }) => (
      <div key={student.instructor + student.course} className="m-4 p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-600 underline">Student: {student.instructor.split(".")[0]}</h2>
        <p>Started at: {new Date(student.courseInfo.start_at).toLocaleString()}</p>
        <p>Total Lessons: {student.courseInfo.total_lession}</p>
        <p>Lessons Completed: {student.courseInfo.lession_completed}</p>
        <p>Remaining Amount: {(student.courseInfo.remaining_amount/Math.pow(10,24)).toFixed(2)} Near</p>
        <p>Claimable Amount: {(student.courseInfo.total_claim/Math.pow(10,24)).toFixed(2)} Near</p>
        <p>Mentoring Completed: {student.courseInfo.mentoring_completed ? 'Yes' : 'No'}</p>
        {account === student.courseInfo.student_id && shouldShowButton && (
          !isSubmit ? (
            <button
              onClick={() => makeLessonCompleted(student.courseInfo.study_process_id)}
              className="text-blue-500 cursor-pointer hover:underline" >
              Mark as Completed
            </button>
          ) : (
            <button className="text-blue-500 cursor-pointer hover:underline" >
              Loading...
            </button>
          )
        )}
        <hr className="my-2" />
      </div>
    );

    return (
      <div className="flex justify-center w-full grid grid-cols-2 ">
        <div className="flex flex-col p-4 border rounded-lg shadow-md mb-4 col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-gray-600 underline">Incomplete Mentoring</h2>
          {incompleteStudents.map(student => (
            <StudentCard
              key={student.instructor + student.course}
              student={student}
              shouldShowButton={true}
            />
          ))}
        </div>
        <div className="flex flex-col p-4 border rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-gray-600 underline">Completed Mentoring</h2>
          {completedStudents.map(student => (
            <StudentCard
              key={student.instructor + student.course}
              student={student}
              shouldShowButton={false}
            />
          ))}
        </div>
      </div>
    );
  }
};

export default StudyProcessComponent;
