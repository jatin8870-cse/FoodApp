import React from 'react'
import { useState } from 'react';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners"
import { setUserData } from '../redux/userSlice';
import { useDispatch } from "react-redux";


const signUp = () => {
    const primaryColor = "#ff4d2d"; // Example primary color
    const hovercolor = "#e64323"; // Example hover color
    const bgcolor = "#fff9f6";
    const borderColor = "ddd"

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("");
    const navigate = useNavigate("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [err, seterr] = useState("")
    const [loading, setloading] = useState(false)
    const dispatch = useDispatch()
    const [invitationCode, setInvitationCode] = useState("");


    const handleSignUp = async () => {

        console.log("Selected role:", role);
        if (!role) {
            seterr("Please select a role");
            return;
        }

        setloading(true);
        seterr("");
        try {

            const result = await axios.post(`${serverUrl}/api/auth/singUp`, {
                fullName,
                email,
                mobile,
                password,
                role: role
            }, { withCredentials: true });
            navigate("/VerifysingupOtp", {
                state: {
                    email: result.data.email
                }
            });
        
            setloading(false)
            seterr("")
        } catch (error) {
            seterr(error?.response?.data?.message)
            setloading(false)
        }
    }

    const handleGoogleAuth = async () => {
        if (!mobile) {
            seterr("mobile no is required")
            return
        }

        if (!role) {
            seterr("Please select a role")
            return
        }


        try {

            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)

            const { data } = await axios.post(`${serverUrl}/api/auth/googleauthSignup`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            }, { withCredentials: true })

            dispatch(setUserData(data.user))

            navigate("/");
        } catch (error) {
            console.log("Google Auth Error:", error);
            seterr(error.response?.data?.message || error.message);
        }

    }




    return (
        <div className='min-h-screen flex items-center justify-center p-4  w-full' style={{ backgroundColor: bgcolor }}>
            <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-1px style={{ borderColor: borderColor }}    `}>
                <h1 className={`text-3xl font-bold mb-2 `} style={{ color: primaryColor }}>
                    Vingo
                </h1>

                <p className={`text-gray-600 mb-8 `} >
                    Fresh, tasty, and delightful food made with love every day.
                </p>

                {/* fullName */}

                <div className='mb-4'>
                    <label htmlFor="FullName" className='block text-gray-700 font-medium mb-1'>Full Name</label>
                    <input type="text" className='w-full border rounded-lg px-3 py-2 focus: outline-none focus:border-orange-500' placeholder='Enter your full name' style={{ border: `1px solid ${borderColor}` }}
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName} required
                    />
                </div>

                {/* Email */}
                <div className='mb-4'>
                    <label htmlFor="Email" className='block text-gray-700 font-medium mb-1'>Email</label>
                    <input type="email" className='w-full border rounded-lg px-3 py-2 focus: outline-none focus:border-orange-500' placeholder='Enter your email' style={{ border: `1px solid ${borderColor}` }}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email} required
                    />
                </div>

                {/* Mobile */}
                <div className='mb-4'>
                    <label htmlFor="mobile" className='block text-gray-700 font-medium mb-1'>Mobile Number</label>
                    <input type="tel" className='w-full border rounded-lg px-3 py-2 focus: outline-none focus:border-orange-500' placeholder='Enter your mobile number' style={{ border: `1px solid ${borderColor}` }}
                        onChange={(e) => setMobile(e.target.value)}
                        value={mobile} required
                    />
                </div>

                {/* Password */}
                <div className='mb-4'>
                    <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>Password</label>
                    <div className='relative'>
                        <input type={showPassword ? "text" : "password"} className='w-full border rounded-lg px-3 py-2 focus: outline-none focus:border-orange-500' placeholder='Enter your password' style={{ border: `1px solid ${borderColor}` }}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password} required
                        />

                        <button className='absolute  cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>


                {/* Role */}
                <div className='mb-4'>
                    <label htmlFor="role" className='block text-gray-700 font-medium mb-1'>Role</label>
                    <div className='flex  gap-2'>
                        {["user", "owner", "deliveryBoy"].map((r) => (

                            <button
                                type="button"
                                key={r}
                                className={`mr-2 px-4 cursor-pointer py-2 rounded-lg ${role === r ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setRole(r)}
                            >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* {role === "owner" && (
    <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
            Owner Invitation Code
        </label>

        <input
            type="text"
            placeholder="Enter owner invitation code"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
        />
    </div>
)} */}
                <button className='w-full cursor-pointer bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                    onClick={handleSignUp} disabled={loading}>
                    {loading ? <ClipLoader size={20} /> : "SignUp"}

                </button>
                {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}


                <button className='w-full mt-4 cursor-pointer bg-white text-orange-500 border border-orange-500 py-2 rounded-lg hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                    onClick={handleGoogleAuth}>
                    <FcGoogle className='inline-block mr-2' />
                    <span>Signup with Google</span>
                </button>
                <p className='text-center cursor-pointer text-gray-600 mt-4' onClick={() => navigate('/signin')}>
                    Already have an account ? <span className='text-orange-500 hover:underline cursor-pointer'>Sign in</span>
                </p>
            </div>
        </div>
    )
}

export default signUp

