import React, { useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Pagination } from 'swiper/modules';
import {useNavigate} from 'react-router-dom';

export default function StudentEnrolledCourse({enrolledCourses}) {
  const navigate = useNavigate();

  const handleViewCourse = (course) =>{
    navigate(`/student/course/${course.id}`,{ state: { data: course } });
  }

  return (
    <>
      <div>
        <h1 className="text-xl p-4 font-bold">Enrolled Courses</h1>

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
          {/* {enrolledCourses.length === 0 && (
        <p className='text-red-500'>No enrolled courses</p>
      )} */}
          {enrolledCourses.map((course, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => handleViewCourse(course)}
                className="bg-white p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border"
              >
                <div className="relative mb-4 rounded-2xl">
                  <img src={course.imgURL} alt={course.title} className="w-full h-48 object-cover rounded-2xl" />
                  <div
                    className="flex justify-center items-center bg-blue-700 bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
                    
                  >
                    View Course
                    <svg
                      className="ml-2 w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      ></path>
                    </svg>
                  </div>
                </div>
                <h3 className="font-medium text-xl leading-8">
                    {course.title}
                </h3>
                
                <div></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      
    </>
  );
}
