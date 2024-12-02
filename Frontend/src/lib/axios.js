import axios from "axios"

export const axiosInstance = axios.create({
baseURL:"http://localhost:5001/api",
//for send the jwt token from the cookies
withCredentials:true
})