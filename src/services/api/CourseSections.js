import axios from "axios";
import Cookies from "js-cookie";
const apiEndPoint =import.meta.env.VITE_APP_API_URL + "course-content/"

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + Cookies.get('access_token')
};

export const createCourseSection = async (data) => {
    console.log(JSON.stringify(data))
    return await axios.post(apiEndPoint,data,{headers})
    
}

export const updateCourseSection = async (data) => {
    return await axios.put(apiEndPoint + data.id,data,{headers})
}

export const getCourseContents = async (id) => {
    return await axios.get(apiEndPoint + "course/"+ id,{headers})
}

export const deleteCourseContent = async(id)=>{
    return await axios.delete(apiEndPoint + id, {headers})
}


