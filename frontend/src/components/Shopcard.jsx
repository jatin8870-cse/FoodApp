import React from 'react';

const ShopCard = ({ data }) => {
  console.log("SHOP CARD DATA:", data);
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">

      <img
        src={data.image}
        alt={data.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">

        <h2 className="text-xl font-bold text-gray-800">
          {data.name}
        </h2>

        <p className="text-gray-500 mt-1">
          {data.city}
        </p>

        <p className="text-gray-500">
          {data.address}
        </p>

      </div>

    </div>
  );
};

export default ShopCard;