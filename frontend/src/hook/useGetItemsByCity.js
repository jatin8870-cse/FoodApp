import React, { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setItemsInMyCity } from "../redux/userSlice.js";
import { useLocation } from "react-router-dom";

const useGetItemsByCity = () => { 
    
    const dispatch = useDispatch();
    const {city} = useSelector(state=>state.user);

       const location = useLocation();

    useEffect(() => {

          if (!city) {
            return;
        } 

        if (
            location.pathname === "/signup" ||
            location.pathname === "/signin" ||
            location.pathname === "/forgot-password"
        ) {
            return;
        }

        const fetchItems = async () => {
            try {
            
                const result = await axios.get(
                    `${serverUrl}/api/item/get-by-city/${city}`,
                    {
                        withCredentials: true
                    }
                );

                 dispatch(setItemsInMyCity(result.data));
                

            } catch (error) {
                console.log(
                    "CURRENT USER ERROR:",
                    error.response?.data || error.message
                );
            }
        };

        fetchItems();

    }, [city ,location.pathname]);
};

export default useGetItemsByCity;