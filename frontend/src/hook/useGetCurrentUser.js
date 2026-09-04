import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from "react-redux";
import axios from 'axios';
import { setUserData } from "../redux/userSlice.js";
const useGetCurrentUser = () => {

    const dispatch = useDispatch()
  useEffect(() => {
    const fetchUser = async () => {
    try{

       const result = await axios.get(`${serverUrl}/api/user/current`,
       { withCredentials: true })
        // console.log(result);
        dispatch(setUserData(result.data))
  
    } catch(error){
        console.log(error)
    }
}

fetchUser()
  },[])
}

export default useGetCurrentUser
