import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice.js";
import { useLocation } from "react-router-dom";

const useGetCurrentUser = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {

        if (
            location.pathname === "/signup" ||
            location.pathname === "/signin" ||
            location.pathname === "/forgot-password"
        ) {
            return;
        }

        const fetchUser = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/user/current`,
                    {
                        withCredentials: true
                    }
                );

                

                dispatch(setUserData(result.data));

            } catch (error) {
                console.log(
                    "CURRENT USER ERROR:",
                    error.response?.data || error.message
                );
            }
        };

        fetchUser();

    }, [location.pathname, dispatch]);
};

export default useGetCurrentUser;