import React, { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import axios from 'axios';
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

//for Recenter the location in the map
function RecenterMap({location}){
  if(location.lat && location.lon){
const map = useMap()
   map.setView([location.lat,location.lon],16,{animate:true})
  }
   return null
}

//set location 
const CheckOut = () => {
  const {location,address} = useSelector(state=>state.map)
  const [addressInput,setAddressInput] = useState("")
   const dispatch = useDispatch()
     const apikey = import.meta.env.VITE_GEOAPIKEY
  const  onDragEnd = (e) =>{
    // console.log(e.target._latlng)
    const {lat,lng}=e.target._latlng
   dispatch(setLocation({lat,lon:lng}))
   getAddressByLatLng(lat,lng)

  }

  //for change the map location address
  
  const getAddressByLatLng = async (lat,lng)=>{
    try{
     
  const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`)
  dispatch(setAddress(result.data.results[0].address_line1))
    } catch(error){
   console.log(error)
    }
  }

  //Give the current location 
  const getcurrentLocation = () =>{
     navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({lat:latitude,lon:longitude}))
         getAddressByLatLng(latitude,longitude)
  })}


  const getLatLngByAddress = async () => {
      try{
        const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&type=city&filter=countrycode:in&format=json&apiKey=${apikey}`)
     const {lat,lon}=(result.data.results[0]);
       dispatch(setLocation({lat,lon}))
      } catch(error){
console.log(error)
      }
  }

  useEffect(()=>{
  setAddressInput(address)
  },[address])
  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
      <div
        className='cursor-pointer absolute top-[20px] left-[20px] z-[10px]'
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack
          size={35}
          className='text-[#ff4d2d]'
        />
      </div>
      <div className='w-full max-w-[900] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
   <h1 className='text-2xl font-bold text-gray-800'>Checkout</h1>
   <section>
    <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'><FaLocationDot size={12} className='text-[#ff4d2d]'/>Delivery Location</h2>
    <div className='flex gap-2 mb-3'>
      <input type='text' className='flex-1 border border-gray-300 rounded-lg p-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter Your Delivery Address...' value={addressInput} onChange={(e)=>
      setAddressInput(e.target.value)
      }/>
      <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex
      items-center justify-center'onClick={ getLatLngByAddress}><IoSearch size={17}/></button>
      <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center'onClick={getcurrentLocation}><BiCurrentLocation size={17}/> </button>
    </div>
    <div className='rounded-xl border overflow-hidden'>
     <div className='h-64 w-full flex item-center justify-center'>
        <MapContainer className={"w-full h-full"}
          center={[location?.lat,location?.lon]}
          zoom={16} > 
           
           <TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
    <RecenterMap location ={location} />
        <Marker position={[location?.lat,location?.lon]}    icon={defaultIcon}  draggable eventHandlers={{dragend : onDragEnd}}/>
        </MapContainer>
     </div>
    </div>
   </section>
      </div>

    </div>
  )
}

export default CheckOut
