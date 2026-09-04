import React, { useState } from 'react'
import { IoLocation } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import { serverUrl } from '../App';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from '../redux/userSlice';
import { setCity } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa6";
import { LuReceipt } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';



const Nav = () => {
   const { userData, city } = useSelector((state) => state.user);
    const { myShopData} = useSelector((state) => state.owner);
   const [showInfo, setshowInfo] = useState(false)
   const [showsearch, setshowsearch] = useState(false)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   
   const handleLogout = async () => {
      try {
         const result = axios.get(`${serverUrl}/api/auth/signout`,
            { withCredentials: true })
         dispatch(setUserData(null))
      } catch (error) {
         console.log(error)
      }
   }
   return (
      <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] 
fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible">

         {showsearch && userData.role == "user" && <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg flex items-center gap-[20px] flex fixed top-[80px] left-[5%]">

            <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px]
        border-r-[2px] border-gray-400'>
               <IoLocation size={25} className='text-[#ff4d2d]' />
               <div className='w-[80%] truncate text-gray-600'>{city}</div>
            </div>

            <div className='w-[80%] flex items-center gap-[10px]'>
               <FaSearch size={25} className='text-[#ff4d2d]' />
               <input type='text' placeholder='search delicious food...' className='px-[10px]
           text-gray-700 outline-0 w-full'/>
            </div>
         </div>}
         <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">
            Vingo
         </h1>
         {userData.role == "user" && <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg flex items-center gap-[20px] hidden md:flex">
            <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px]
        border-r-[2px] border-gray-400'>
               <IoLocation size={25} className='text-[#ff4d2d]' />
               <div className='w-[80%] truncate text-gray-600'>{city}</div>
            </div>

            <div className='w-[80%] flex items-center gap-[10px]'>
               <FaSearch size={25} className='text-[#ff4d2d]' />
               <input type='text' placeholder='search delicious food...' className='px-[10px]
           text-gray-700 outline-0 w-full'/>
            </div>
         </div>}

         <div className='flex justify-items-center gap-4'>

            {userData.role == "user" && (showsearch ? <RxCross2 size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setshowsearch(false)} /> : <FaSearch size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setshowsearch(true)} />)}

            {userData.role == "owner" ? <>
             {myShopData && <>

               <button className=" hidden md:flex item-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
               onClick={() => navigate("/add-food")}>
                  <FaPlus size={20} />
                  <span>Add Food Item</span>
               </button>

               <button className="md:hidden item-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
                   onClick={() => navigate("/add-food")}>
                  <FaPlus size={20} />
               </button>
             </>}
             
                  {userData.role=="user" &&
                   <div className=' hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1  rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium'>
                  <LuReceipt />
                  <span>My Order</span>
                  <span className='absolute right-[-9px] top-[-12px] text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px] '>0</span>
               </div>
                  }
              


               <div className='md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1  rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium'>
                  <LuReceipt />
                  
                  <span className='absolute right-[-9px] top-[-12px] text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px] '>0</span>
               </div>
            </> : (
               <>
                  <div className='relative cursor-pointer'>
                     <FaCartShopping size={25} className='text-[#ff4d2d]' />
                     <span className='absolute right-[-9px] top-[-12px] text-[#ff4d2d]'>0</span>
                  </div>

                   
                  <button className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d]
            text-sm font-medium'>
                     My Order
                  </button>
               </>
            )}



            <div className='w-[40px] h-[40px]  rounded-full flex items-center justify-center bg-[#ff4d2d]
            text-white text-[18px] shadow-xl font-semibold cursor-pointer' onClick={() => setshowInfo
                  (prev => !prev)}>
               {userData?.fullName.slice(0, 1)}
            </div>
            {showInfo && <div className='fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%]
                         w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex-col gap-[10px] z-[9999]'>
               <div className='text-[17px] font-semibold'>{userData.fullName}</div>
               {userData.role == "user" && <div className='md:hidden text-[#ff4d2d] font-semibold cursor-pointer'>My Order</div>}
               
               <div className='text-[#ff4d2d] font-semibold cursor-pointer ' onClick={handleLogout}>Log Out</div>
            </div>}

         </div>

      </div>
   )
}

export default Nav
