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
import { ClipLoader } from 'react-spinners';
import { useDispatch } from "react-redux";
import { setUserData } from '../redux/userSlice';



const signIn = () => {
    const primaryColor = "#ff4d2d"; // Example primary color
    const hovercolor = "#e64323"; // Example hover color
    const bgcolor = "#fff9f6";
    const borderColor = "ddd"

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("user");
    const navigate = useNavigate();
    const [usestate, setUsestate] = useState("");
    const [email, setEmail] = useState("");
   
    const [password, setPassword] = useState("");
    const [err,seterr] = useState("");
    const [loading,setloading]=useState(false)
    const dispatch = useDispatch()
   

    const handleSignIn = async () => {
        setloading(true)
      
        try {
            const result = await axios.post(`${serverUrl}/api/auth/singIn`, {
                email,
                password,
                
            },{withCredentials: true});
            //  console.log(result);
            dispatch(setUserData(result.data))
            setloading(false)
            seterr("")
            
            navigate("/");
        } catch (error) {
            
            seterr(error?.response?.data?.message);
                   setloading(false)
        }
    }

    const handleGoogleAuth = async () => {
           
            try{
    
                 const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth,provider)
            
               const {data} = await axios.post(`${serverUrl}/api/auth/googleSignIn`,{
                email:result.user.email,
               },{withCredentials: true})
               console.log(data)

            dispatch(setUserData(data.user))
            navigate("/")
            } catch(error){
                
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

              

                {/* Email */}
                <div className='mb-4'>
                    <label htmlFor="Email" className='block text-gray-700 font-medium mb-1'>Email</label>
                    <input type="email" className='w-full border rounded-lg px-3 py-2 focus: outline-none focus:border-orange-500' placeholder='Enter your email' style={{ border: `1px solid ${borderColor}` }}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}  required
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
             
                <div className='text-right mb-4 text-[#ff4d2d] cursor-pointer hover:text-[#e64323]' onClick={() => navigate('/forgot-password')}>
                    Forgot Password
                </div>

                <button className='w-full cursor-pointer bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                onClick={handleSignIn} disabled={loading} >
                    {loading?<ClipLoader  size={20}/>:"SignIn"}
                </button>
  {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}

                <button className='w-full mt-4 cursor-pointer bg-white text-orange-500 border border-orange-500 py-2 rounded-lg hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                onClick={handleGoogleAuth}>
                    <FcGoogle className='inline-block mr-2' />
                    <span>Sign in with Google</span>
                </button>
                <p className='text-center cursor-pointer text-gray-600 mt-4' onClick={() => navigate('/signup')}>
                    Want to create new account ? <span className='text-orange-500 hover:underline cursor-pointer'>Sign up</span>
                </p>
            </div>
        </div>
    )
}

export default signIn
