import React from 'react'
import Nav from './Nav'
import CategoryCard from "./CategoryCard";
import { categories } from "../categories";
import { useSelector } from 'react-redux';
import useGetShopByCity from "../hook/useGetShopByCity";
import ShopCard from "./Shopcard";

const UserDashboard = () => {
   useGetShopByCity()
  const {city,shopsInMyCity} = useSelector(state=>state.user)
  console.log("SHOPS FROM REDUX:", shopsInMyCity);
  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Inspiration for your first order </h1>
        <div className='w-full relative '>
       <div className="w-full flex overflow-x-auto gap-4 pb-2 scroll-smooth hide-scrollbar">
          {categories.map((cate, index) => (
            <CategoryCard data={cate} key={index} index={index} />
          ))}
        </div>
      </div>
    </div>
    <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
      <h1 className='text-gray-800 text-2xl sm:text-3xl'>Best Shop in <span className='text-red-400 text-3xl font-bold'> {city} </span>  </h1>
       <div className="w-full flex overflow-x-auto gap-4 pb-2 scroll-smooth hide-scrollbar">
           {shopsInMyCity?.map((shop) => (
            <ShopCard
              key={shop._id}
              data={shop}
            />
          ))}
        </div>
    </div>
     
    </div>

  )
}

export default UserDashboard

