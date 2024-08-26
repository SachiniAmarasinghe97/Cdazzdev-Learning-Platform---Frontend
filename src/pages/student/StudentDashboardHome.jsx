import React,{useState,useEffect} from 'react'
import StudentDashboardLayout from '../../layouts/StudentDashboardLayout'
import StudentEnrolledCourses from '../../components/studentcomponents/StudentEnrolledCourses'

import { getAssignedCourses } from '../../services/api/CourseAssigns'
import {getCoursesForStudent} from '../../services/api/CourseService'
import StudentAllCourses from '../../components/common/StudentAllCourses'
import Cookies from 'js-cookie';
function StudentDashboardHome() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true);
  const access_token = Cookies.get('access_token');
  const userId = Cookies.get('userId')
  useEffect(() => {
    fetchData();
  }, [access_token]);
  
  const fetchAssignedCourses = async () => {
    try {
      const response = await getAssignedCourses();
      if (response) {
        setEnrolledCourses(response.data.learningCourses);
      } else {
        console.log('Failed to fetch enrolled courses.');
      }
    } catch (error) {
      console.log('An error occurred while fetching the enrolled courses.');
    }
  };

  const fetchAllCourses = async () => {
    try{
      const coursesResponse = await getCoursesForStudent();
      setAllCourses(coursesResponse.data.data);
      // console.log(JSON.stringify(allcourses))
    }
    catch(error){
      console.log(error)
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchAssignedCourses(), fetchAllCourses()]);
    setLoading(false);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <StudentDashboardLayout>
       <div><StudentEnrolledCourses enrolledCourses = {enrolledCourses}/></div>
       <div><StudentAllCourses allCourses={allCourses} userId={userId} refreshCourses={fetchData}/></div>
       
    </StudentDashboardLayout>
   
  )
}

export default StudentDashboardHome