import axios from "axios";
import Cookies from "js-cookie";
const apiEndPoint =import.meta.env.VITE_APP_API_URL
const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + Cookies.get('access_token')
};

export const getAllStudents = async () => {
    return await axios.get(apiEndPoint +"auth/getStudents" ,{headers})
}

export const deleteStudent = async (id) => {
    return await axios.delete(apiEndPoint +"auth/student/delete/" + id,{headers})
}

export const updateStudent = async (data) => {
    return await axios.put(apiEndPoint + "auth/student/update/"+ data.id,data,{headers})
    
}

