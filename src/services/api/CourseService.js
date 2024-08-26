import axios from "axios";
import Cookies from "js-cookie";
const apiEndPoint =import.meta.env.VITE_APP_API_URL + "courses/"

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + Cookies.get('access_token')
};

export const createCourse = async (data) => {
    console.log(apiEndPoint)
    console.log(JSON.stringify(data))
    return await axios.post(apiEndPoint,data,{headers})
    
}

export const getCourses = async () => {
    return await axios.get(apiEndPoint,{headers})
}

export const updateCourse = async (data) => {
    console.log(apiEndPoint)
    console.log(JSON.stringify(data))
    return await axios.put(apiEndPoint + data.id,data,{headers})
    
}

export const deleteCourse = async (data) => {
    console.log(apiEndPoint)
    console.log(JSON.stringify(data))
    return await axios.delete(apiEndPoint + data.id,{headers})
    
}

export const getCoursesForStudent = async () => {
    return await axios.get(apiEndPoint + 'user',{headers})
}
