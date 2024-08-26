import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

import { assignStudentToCourse, removeUserFromCourse } from '../../services/api/CourseAssigns';

export default function StudentAllCourses({ allCourses, userId, refreshCourses }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleEnrollmentClick = (course) => {
    setSelectedCourse(course);
    setShowConfirm(true);
  };

  const confirmEnrollment = async () => {
    try {
      if (selectedCourse.isEnroll) {
        // Unenroll the student from the course
        const response = await removeUserFromCourse({ courseId: selectedCourse.id, userId });
        if (response.status === 200) {
          toast.success(`Successfully unenrolled from course: ${selectedCourse.title}`);
          console.log(`Successfully unenrolled from course: ${selectedCourse.title}`);
          refreshCourses();
        }
        else{
          toast.error("Error occured: Please try again!!!");
        }
      } else {
        // Enroll the student in the course
        const response = await assignStudentToCourse({ courseId: selectedCourse.id, studentId: userId });
        if (response.status === 201) {
          toast.success(`Successfully enrolled in course: ${selectedCourse.title}`);
          refreshCourses();
        }
        else{
          toast.error("Error occured: Please try again!!!");
        }
      }
    } catch (error) {
      console.error('Error during enrollment process:', error);
    } finally {
      setShowConfirm(false);
      setSelectedCourse(null);
    }
  };

  const cancelEnrollment = () => {
    setShowConfirm(false);
    setSelectedCourse(null);
  };

  return (
    <>
      <div>
        <h1 className='text-xl p-4 font-bold'>All Available Courses</h1>
      </div>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {allCourses.map((course, index) => (
          <SwiperSlide key={index}>
            <div
              className="bg-white p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border"
            >
              <div className="relative mb-4 rounded-2xl">
                <img src={course.imgURL} alt={course.title} className="w-full h-48 object-cover rounded-2xl" />
              </div>
              <h3 className="font-medium text-xl leading-8">
                <a
                  href=""
                  className="block relative group-hover:text-red-700 transition-colors duration-200"
                >
                  {course.title}
                </a>
              </h3>
              <div className="mt-4">
                <button
                  onClick={() => handleEnrollmentClick(course)}
                  className={`px-4 py-2 rounded ${
                    course.isEnroll ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {course.isEnroll ? 'Unenroll' : 'Enroll'}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm {selectedCourse.isEnroll ? 'Unenrollment' : 'Enrollment'}</h2>
            <p className="mb-6">Are you sure you want to {selectedCourse.isEnroll ? 'unenroll from' : 'enroll in'} this course?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelEnrollment}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnrollment}
                className={`px-4 py-2 rounded ${selectedCourse.isEnroll ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
              >
                {selectedCourse.isEnroll ? 'Unenroll' : 'Enroll'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}
