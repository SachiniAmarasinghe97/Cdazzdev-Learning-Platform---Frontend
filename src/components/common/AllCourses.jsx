import React, { useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import {getCourses} from '../../services/api/CourseService'
// import required modules
import { Pagination } from 'swiper/modules';

export default function AllCourses() {
  const [courses, setCourses] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      const coursesResponse = await getCourses();
      setCourses(coursesResponse.data);
    };
  
    fetchData();
  }, []);
  
  console.log(courses)
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
        {courses.map((course, index) => (
            <SwiperSlide key={index}>
              <div
                className="bg-white p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border"
              >
                <a
                  target="_self"
                  href=""
                  className="absolute opacity-0 top-0 right-0 left-0 bottom-0"
                ></a>
                <div className="relative mb-4 rounded-2xl">
                  <img src={course.imgURL} alt={course.title} className="w-full h-48 object-cover rounded-2xl" />
                  <a
                    className="flex justify-center items-center bg-blue-700 bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
                    href=""
                    target="_self"
                    rel="noopener noreferrer"
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
                  </a>
                </div>
                <h3 className="font-medium text-xl leading-8">
                  <a
                    href=""
                    className="block relative group-hover:text-red-700 transition-colors duration-200"
                  >
                    {course.courseID} - {course.title}
                  </a>
                </h3>
                <div></div>
              </div>
            </SwiperSlide>
          ))}

      </Swiper>
    </>
  );
}
