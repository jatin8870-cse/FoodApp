import React, { useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { setMyShopData } from '../redux/ownerSlice';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';



const AddItems = () => {

    const { myShopData } = useSelector(state => state.owner)
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setbackendImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const [category, setCategory] = useState("")
    const [foodtype, setFoodType] = useState("veg")
    const categories = [
        "snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Others"
    ]
    const handleImage = (e) => {
        const file = e.target.files[0]
        setbackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
          if (!backendImage) {
                toast.error("Please Select Food Image");
                return;
          }
        setIsLoading(true);
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("category", category)
            formData.append("foodtype", foodtype)
            formData.append("price", price)
            if (backendImage) {
                formData.append("image", backendImage)
            }

            const result = await axios.post(`${serverUrl}/api/item/additem`, formData,
                { withCredentials: true })

            dispatch(setMyShopData(result.data))
            navigate("/");
          
        } catch (error) {
            console.log(error)
        } finally {
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
                            Add Food
                        </div>
                    </div>
                    <form className='space-y-5' onSubmit={handleSubmit}>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                            <input type="text" placeholder='Enter Food Name' required className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                            <input type="file" accept='image/*' required={!myShopData} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                onChange={handleImage} />
                            {frontendImage &&
                                <div className='mt-4'>
                                    <img src={frontendImage} alt="" className="w-full h-48 object-cover rounded-lg border" />
                                </div>}
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                            <input type="number" placeholder='0' required className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category</label>
                            <select required className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cate, index) => (
                                    <option value={cate} key={index}>{cate}</option>
                                ))}
                            </select>
                        </div>


                         <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Select FoodType</label>
                            <select className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                onChange={(e) => setFoodType(e.target.value)}
                                value={foodtype}
                            >
                              <option value='veg'>veg</option>
                               <option value='non veg'> non veg</option>
                            </select>
                        </div>


                        <button type="submit"
                            disabled={isLoading} className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg
                        font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200' >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                "Save"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default AddItems

