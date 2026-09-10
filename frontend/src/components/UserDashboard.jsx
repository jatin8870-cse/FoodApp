import React from 'react'
import Nav from './Nav'
import CategoryCard from "./CategoryCard";
import { categories } from "../categories";

const UserDashboard = () => {
  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Inspiration for your first order </h1>
        <div className='w-full '>
       <div className="w-full flex overflow-x-auto gap-4 pb-2 scroll-smooth hide-scrollbar">
          {categories.map((cate, index) => (
            <CategoryCard data={cate} key={index} />
          ))}
        </div>
      </div>
    </div>
    </div>

  )
}

export default UserDashboard

