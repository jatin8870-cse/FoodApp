import React from 'react'
import { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from '../App';
import {ClipLoader} from "react-spinners"



const ForgotPassword = () => {
    const [step, setstep] = useState(1);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [err,seterr] = useState("");
    const [loading,setloading] = useState(false)

    const handleSendOtp = async () => {
        setloading(true)
        console.log("email id is : ",email)
        try{
   const result = await axios.post(`${serverUrl}/api/auth/sendotp`, {email},
      {withCredentials:true})
      console.log(result)
      seterr("")
      setstep(2)
      setloading(false)
        } 
     catch(error){
        seterr(error?.response?.data?.message)
        setloading(false)
    }
    }

       const handleVerifyOtp = async () => {
        setloading(true)
        try{
   const result = await axios.post(`${serverUrl}/api/auth/verifyOtp`, {email,otp},
      {withCredentials:true})
      console.log(result)
      seterr("")
      setstep(3)
      setloading(false)
        } 
     catch(error){
       seterr(error?.response?.data?.message)
       setloading(false)
    }
    }


     const handleResetPassword = async () => {
        if(newPassword!=confirmPassword){
            seterr("Passwords do not match");
            return
        }
            setloading(true)
        try{
   const result = await axios.post(`${serverUrl}/api/auth/resetPassword`, {email,newPassword},
      {withCredentials:true})
      seterr("")
      navigate("/signUp")
          setloading(false)
        } 
     catch(error){
         seterr(error?.response?.data?.message)
             setloading(false)
    }
    }


    return (
        <div className='flex w-full flex-col items-center justify-center h-screen bg:[#fff9f6]'>
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <div className='flex items-center gap-4 mb-6 cursor-pointer'>
                    <IoIosArrowRoundBack size={34} className='text-[#ff4d2d]' onClick={() => navigate("/signIn")} />
                    <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
                </div>
                {step == 1 &&
                    <div>
                        {/* Email */}
                        <div className='mb-6'>
                            <label htmlFor="Email" className='block text-gray-700 font-medium mb-1'>Email</label>
                            <input type="email" className='w-full border rounded-lg px-3 py-2 focus: outline-none focus:border-orange-500' placeholder='Enter your email'
                                onChange={(e) => setEmail(e.target.value)} value={email}
                            />
                        </div>
                        <button className='w-full cursor-pointer bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                        onClick={handleSendOtp} disabled={loading}>
                             {loading?<ClipLoader size={20}/>:"Send OTP"}
                        </button>
                       {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}

                    </div>}

                {step == 2 &&
                    <div>
                        {/* Enter otp */}
                        <div className='mb-6'>
                            <label htmlFor="Email" className='block text-gray-700 font-medium mb-1'>OTP</label>
                            <input type="email" className='w-full border rounded-lg px-3 py-2 focus: outline-none focus:border-orange-500' placeholder='Enter OTP'
                                onChange={(e) => setOtp(e.target.value)} value={otp}
                            />
                        </div>
                        <button className='w-full cursor-pointer bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                        onClick={handleVerifyOtp } disabled={loading}>
                            {loading?<ClipLoader size={20}/>:"Verify OTP"}
                        </button>
                      {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
                    </div>}

                {step == 3 &&
                    <div>
                        {/*  */}
                        <div className='mb-6'>
                            <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
                            <input type="password" className='w-full border rounded-lg px-3 py-2 focus: outline-none focus:border-orange-500' placeholder='Enter new password'
                             onChange={(e) => setNewPassword(e.target.value)} value={newPassword}
                            />
                        </div>


                        <div className='mb-6'>
                            <label htmlFor="confirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
                            <input type="password" className='w-full border rounded-lg px-3 py-2 focus: outline-none focus:border-orange-500' placeholder='Confirm new password'
                            onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}
                            />
                        </div>


                        <button className='w-full cursor-pointer bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                        onClick={handleResetPassword} disabled={loading}>
                          {loading?<ClipLoader size={20}/>:"Reset Password"}
                        </button>
                       {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}

                    </div>}

            </div>
        </div>
    )
}

export default ForgotPassword
