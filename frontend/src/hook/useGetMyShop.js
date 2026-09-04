import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from "react-redux";
import axios from 'axios';
import { setMyShopData } from '../redux/ownerSlice.js';
const useGetMyShop = () => {

    const dispatch = useDispatch()
  useEffect(() => {
    const fetchShop = async () => {
    try{

       const result = await axios.get(`${serverUrl}/api/shop/get-my`,
       { withCredentials: true })
        
       
                dispatch(setMyShopData(result.data));
  
    } catch(error){
        console.log(error)
    }
}

fetchShop()
  },[])
}

export default useGetMyShop
