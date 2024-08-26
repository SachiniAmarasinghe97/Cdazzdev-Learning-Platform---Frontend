import axios from "axios";
import Cookies from "js-cookie";
const apiEndPoint =import.meta.env.VITE_APP_API_URL
const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + Cookies.get('access_token')
};

export const getUnAssignedStudents = async (data) => {
    console.log(JSON.stringify(data))
    return await axios.get(apiEndPoint +"auth/getNotAssignedStudents/" + data.courseId,{headers})
}

export const assignStudentToCourse = async (data) => {
    console.log(JSON.stringify(data))
    return await axios.post(apiEndPoint + "course-students",data,{headers})
    
}

export const getAssignedCourses = async () =>{
    return await axios.get(apiEndPoint + "course-students/getAssignedCourses",{headers})
}

export const removeUserFromCourse = async (data) =>{
    return await axios.post(apiEndPoint + "course-students/remove",data,{headers})
}

