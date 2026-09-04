import React from 'react'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import { useSelector } from 'react-redux'


const Home = () => {
    const {userData} = useSelector(state=>state.user);

  if (!userData) {
    return <div>Loading...</div>;
  }
  return (
    <div className='w-[100vw] min-h-[100vh] pt-[100px] flex flex-col item-center bg-[#fff9f6]'>
      {userData.role=="user" && <UserDashboard/>}
      {userData.role=="owner" && <OwnerDashboard/>}
       {userData.role=="deliveryboy" && <DeliveryBoy/>}
    </div>
  )
}

export default Home
