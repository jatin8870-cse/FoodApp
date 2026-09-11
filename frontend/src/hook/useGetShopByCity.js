import React, { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setShopsInMyCity } from "../redux/userSlice.js";
import { useLocation } from "react-router-dom";

const useGetShopByCity = () => {
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

        const fetchShop = async () => {
            try {
                console.log("Fetching shop for:", city);
                const result = await axios.get(
                    `${serverUrl}/api/shop/get-by-city/${city}`,
                    {
                        withCredentials: true
                    }
                );
                console.log("SHOP:",result.data);

                 dispatch(setShopsInMyCity(result.data));
                console.log(result.data)

            } catch (error) {
                console.log(
                    "CURRENT USER ERROR:",
                    error.response?.data || error.message
                );
            }
        };

        fetchShop();

    }, [city ,location.pathname]);
};

export default useGetShopByCity;