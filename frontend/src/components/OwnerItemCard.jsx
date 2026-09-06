import React from 'react'
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
 import axios from 'axios';
import { serverUrl } from '../App';

function OwnerItemCard({ data }) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [items, setItems] = useState([]);

    const handleDelete = async () => {
        try{
            const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`,
                {withCredentials:true})

                 setItems(prevItems =>
            prevItems.filter(item => item._id !== data._id)
        );

        } catch(error){
       console.log(error);
    }
    } 
    return (
        <div className='flex   bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl divide-x divide-gray-200'>

            <div className='w-37 flex-shrink:0 bg-gray-400'>
                <img src={data.image} alt="" className="w-full h-full object-cover" />
            </div>

            <div className='flex flex-col justify-between p-3 flex-1'>
                <div>
                    <h2 className='text-base font-semibold text-[#ff4d2d]'>{data.name}</h2>
                    <p><span className='font-medium text-gray-70'>Category:</span>{data.category}</p>
                    <p><span className='font-medium text-gray-70'>Food Type:</span>{data.foodtype}</p>
                </div>
                <div className='flex items-center justify-between'>
                    <div className='text-[#ff4d2d]'>Price:{data.price}</div>

                    <div className='flex item-center gap-2'>
                        <div className='p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]  cursor-pointer' onClick={()=>navigate(`/edititem/${data._id}`)}>
                            <FaPen size={16} />
                        </div>

                        <div className='p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer' onClick={handleDelete}>
                            <FaRegTrashCan size={16} />
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default OwnerItemCard
