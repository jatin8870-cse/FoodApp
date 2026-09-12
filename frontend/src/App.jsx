import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import {ToastContainer} from "react-toastify";

import SignUp from "./pages/signUp";
import SignIn from "./pages/signIn";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hook/useGetCurrentUser";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useGetCity from "./hook/useGetCity";
import useGetItemsByCity from "./hook/useGetItemsByCity";
import CreateEditShop from "./pages/CreateEditShop";
import AddItems from "./pages/AddItems";
import EditItem from "./pages/EditItem";
import VerifyOtp from "./pages/VerifyOtp";
import VerifysingupOtp from "./pages/VerifysingupOtp";


export const serverUrl = import.meta.env.VITE_API_URL;
const App = () => {
  useGetCurrentUser()
  useGetCity()
  // useGetMyShop()
  // useGetShopByCity()
   useGetItemsByCity()
   
  const {userData} =  useSelector(state=>state.user)
  
  return (
    <>
    <Routes>
      <Route path="/signup" element={!userData?<SignUp/>:<Navigate to={"/"}/>} />
      <Route path="/signin" element={!userData?<SignIn/>:<Navigate to={"/"}/>} />
      <Route path="/forgot-password" element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>} />
      <Route path="/" element={userData?<Home/>:<Navigate to={"/signin"}/>} />
      <Route path='/create-edit-shop' element={userData ? <CreateEditShop/>:<Navigate to={"/"}/>}/>
       <Route path='/add-food' element={userData ? <AddItems/>:<Navigate to={"/"}/>}/>
       <Route path='/edititem/:itemId' element={userData ? <EditItem/>:<Navigate to={"/"}/>}/>
      <Route path="/verifyotp" element={<VerifyOtp />} />
     <Route
    path="/VerifysingupOtp"
    element={<VerifysingupOtp />}
/>

</Routes>
     <ToastContainer/>
     </>
  );
};

export default App;
