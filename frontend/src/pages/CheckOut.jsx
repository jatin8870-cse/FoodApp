import React, { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import { MdDeliveryDining } from "react-icons/md";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import axios from 'axios';
import L from "leaflet";
import { FaMobileScreen } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";


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
function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null
}

//set location 
const CheckOut = () => {
  const navigate = useNavigate()
  const { location, address } = useSelector(state => state.map)
  const { cartItems,totalAmount } = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const dispatch = useDispatch()
  const apikey = import.meta.env.VITE_GEOAPIKEY
 const deliveryFees=totalAmount>500?0:40
 const AmountWithDeliveryFee=totalAmount+deliveryFees
  const onDragEnd = (e) => {
    // console.log(e.target._latlng)
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)

  }

  //for change the map location address

  const getAddressByLatLng = async (lat, lng) => {
    try {

      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`)
      dispatch(setAddress(result.data.results[0].address_line1))
    } catch (error) {
      console.log(error)
    }
  }

  //Give the current location 
  const getcurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }))
      getAddressByLatLng(latitude, longitude)
    })
  }


  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&type=city&filter=countrycode:in&format=json&apiKey=${apikey}`)
      const { lat, lon } = (result.data.results[0]);
      dispatch(setLocation({ lat, lon }))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setAddressInput(address)
  }, [address])
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

        {/* //Map Section make the make for location  */}

        <section>
          <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'><FaLocationDot size={12} className='text-[#ff4d2d]' />Delivery Location</h2>
          <div className='flex gap-2 mb-3'>
            <input type='text' className='flex-1 border border-gray-300 rounded-lg p-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter Your Delivery Address...' value={addressInput} onChange={(e) =>
                setAddressInput(e.target.value)
              } />
            <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex
      items-center justify-center'onClick={getLatLngByAddress}><IoSearch size={17} /></button>
            <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={getcurrentLocation}><BiCurrentLocation size={17} /> </button>
          </div>
          <div className='rounded-xl border overflow-hidden'>
            <div className='h-64 w-full flex item-center justify-center'>
              <MapContainer className={"w-full h-full"}
                center={[location?.lat, location?.lon]}
                zoom={16} >

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker position={[location?.lat, location?.lon]} icon={defaultIcon} draggable eventHandlers={{ dragend: onDragEnd }} />
              </MapContainer>
            </div>
          </div>
        </section>

        {/* //Payment Location make for the payment Section  */}

        <section>
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Pyment Method</h2>

          {/* For Cash On Hand Payment */}

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"
              }`} onClick={() => setPaymentMethod("cod")}>

              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                <MdDeliveryDining className='text-green-600 text-xl' />
              </span>

              <div>
                <p className='font-medium text-gray-800'>Cash On Delivery</p>
                <p className='font-xs text-gray-500'>Pay when your food arrives</p>
              </div>

            </div>

            {/* For Online Payment  */}

            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"
              }`} onClick={() => setPaymentMethod("online")}>

              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                <FaMobileScreen className='text-purple-700 text-lg' />
              </span>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                <FaCreditCard className='text-blue-700 text-lg' />
              </span>
              <div>
                <p className='font-medium text-gray-800'>UPI / Creadit / Debit Card</p>
                <p className='font-medium text-gray-500'>Pay Securely Online</p>
              </div>
            </div>
          </div>

        </section>

       <section>
        <h2 className='text-lg font-semibold mb-3 text-gray-800'> Order Summary</h2>
        <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
        {cartItems.map((item,index)=>(
          <div key={index} className='flex justify-between text-sm text-gray-800 '>
          <span>{item.name} x {item.quantity}</span>
          <span> ₹{item.price *item.quantity}</span>
          </div>
        ))}
        <hr className='border-gray-200 my-2'/>

        <div className='flex justify-between font-medium text-gray-800'>
          <span>Subtotal</span>
          <span>{totalAmount}</span>
        </div>

        <div className='flex justify-between text-gray-700'>
        <span>Delivery Fees</span>
        <span>{deliveryFees==0?"Free":deliveryFees}</span>
        </div>

        <div className='flex justify-between text-lg font-bold text-[#ff4d2d] pt-2'>
        <span>Total</span>
        <span>{AmountWithDeliveryFee}</span>
        </div>
        </div>
       </section>

       <button className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl
       font-semibold'>
        {paymentMethod=="cod"? "Place Order":"Pay & Place Order"}</button>
                                                                      
      </div>

    </div>
  )
}

export default CheckOut
