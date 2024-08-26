import axios from "axios";
const apiEndPoint =import.meta.env.VITE_APP_API_URL + "auth/"

const headers = {
    'Content-Type': 'application/json'
};
export const userLogin = async (data) => {

    return await axios.post(apiEndPoint + "login",data,{headers})
    
}

export const userRegister = async (data) => {
    return await axios.post(apiEndPoint + "register",data,{headers})
    
}

export const sendOTP = async (data) => {

    return await axios.post(apiEndPoint + "sendOTP",data,{headers})
    
}

export const verifyOTP = async (data) => {

    return await axios.post(apiEndPoint + "verifyOTP",data,{headers})
    
}

export const resetPassword = async (data) => {

    return await axios.post(apiEndPoint + "resetPassword",data,{headers})
    
}