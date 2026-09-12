import React, { useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { setMyShopData } from '../redux/ownerSlice';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';


const CreateEditShop = () => {

    const { myShopData } = useSelector(state => state.owner)
    const { city, state, currentAddress } = useSelector(state => state.user)

    const navigate = useNavigate()
    const [name, setName] = useState(myShopData?.name || "")
    const [address, setaddress] = useState(myShopData?.address || currentAddress)
    const [City, setCity] = useState(myShopData?.city || city)
    const [State, setState] = useState(myShopData?.state || state)
    const [frontendImage, setFrontendImage] = useState(myShopData?.image || null)
    const [backendImage, setbackendImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const handleImage = (e) => {
        const file = e.target.files[0]
        setbackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
         if (!backendImage) {
        toast.error("Please Reselect shop image");
        return;
    }
        setIsLoading(true);
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("city", City)
            formData.append("state", State)
            formData.append("address", address)
            if (backendImage) {
                formData.append("image", backendImage)
            }

            const result = await axios.post(`${serverUrl}/api/shop/createedit`, formData,
                { withCredentials: true })

            dispatch(setMyShopData(result.data))
             navigate("/");
           
        } catch (error) {
            console.log(error)
        }  finally {
        setIsLoading(false);
    }
    }

    return (
        <div className=' "relative min-h-screen bg-gradient-to-br from-orange-50 to-white'>
            <div className='absoulte  top-5 left-5 z-10' onClick={() => navigate("/")}>
                <IoMdArrowBack size={35} className='text-[#ff4d2d]' />
            </div>

            <div className="flex min-h-screen justify-center items-center p-6">
                <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
                    <div className=' flex flex-col items-center mb-6'>
                        <div className='bg-orange-100 p-4 rounded-full mb-4'>
                            <FaUtensils className='text-[#ff4d2d] w-16 h-16' />
                        </div>
                        <div className='text-3xl font-extrabold text-gray-900'>
                            {myShopData ? "Edit Shop" : 'Add Shop'}
                        </div>
                    </div>
                    <form className='space-y-5' onSubmit={handleSubmit}>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                            <input type="text" placeholder='Enter Shop Name'  required className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Shop Image</label>
                            <input type="file" accept='image/*' required={!myShopData} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                onChange={handleImage} />
                            {frontendImage &&
                                <div className='mt-4'>
                                    <img src={frontendImage} alt="" className="w-full h-48 object-cover rounded-lg border" />
                                </div>}


                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                                <input type="text" placeholder='City'  required className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    onChange={(e) => setCity(e.target.value)}
                                    value={City} />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
                                <input type="text" placeholder='State'  required className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    onChange={(e) => setState(e.target.value)}
                                    value={State} />
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                            <input type="text" placeholder='Enter Shop  Address'  required  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                onChange={(e) => setaddress(e.target.value)}
                                value={address} />
                        </div>

                        <button type="submit"
                            disabled={isLoading} className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg
                        font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200' >
                           {isLoading?<ClipLoader  size={20} color='white'/>:"Save"}
                        </button>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default CreateEditShop
