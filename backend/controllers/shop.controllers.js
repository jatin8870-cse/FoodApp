import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Item from "../models/item.model.js";



export const createEditShop = async (req, res) => {
    try {
       
        const { name, city, state, address } = req.body;

        let image;

        if (req.file) {
            console.log(req.file)
            image = await uploadOnCloudinary(req.file.path);
        }

        // IMPORTANT
        if (!image) {
            return res.status(400).json({
                message: "Image upload failed"
            });
        }

        let shop = await Shop.findOne({ owner: req.userId });

        if (!shop) {
            shop = await Shop.create({
                name,
                city,
                state,
                address,
                image,
                owner: req.userId
            });
        } else {
            shop = await Shop.findByIdAndUpdate(
                shop._id,
                {
                    name,
                    city,
                    state,
                    address,
                    image,
                    owner: req.userId
                },
                { new: true }
            );
        }

       await shop.populate([
    { path: "owner" },
    {
        path: "items",
        options: { sort: { updatedAt: -1 } }
    }
]);

        return res.status(201).json(shop);

    } catch (error) {
        console.log("CREATE SHOP ERROR:", error);

        return res.status(500).json({
            message: `create shop error ${error}`
        });
    }
};

export const getMyShop = async (req,res) => {
    try{
        
            const allShops = await Shop.find({});
          
        const shop = await Shop.findOne({owner : req.userId}).populate("owner items")
    
        if(!shop){
          return res.status(404).json({
                message: "Shop not found"
            });
        }
        return res.status(200).json(shop)
    } catch(error){
   
 return res.status(500).json({
            message: `get my shop error ${error}`
        });

    }
}

export const getshopByCity = async (req,res) => {
    try{
       const {city} = req.params

       const shop = await Shop.find({
        city:{$regex:new RegExp(`^${city}$`,"i")}
       }).populate('items')
       if(!shop){
        return res.status(400).json({message:"shops not found"})
       }
       return res.status(200).json(shop)
    } catch(error){
      return req.status(500).json({message:`get my shop bu city  error ${error}`})
    }
}

export const deleteShop = async (req, res) => {
  try {
    console.log("hit dlete")
    const shopId = req.params.id;

    // 1. Find the shop first
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        message: "Shop not found"
      });
    }

    // 2. Delete all items of this shop
    await Item.deleteMany({
      _id: { $in: shop.items }
    });

    // 3. Delete the shop
    await Shop.findByIdAndDelete(shopId);

    return res.status(200).json({
      message: "Shop and all items deleted successfully"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: `Delete shop error: ${error.message}`
    });
  }
};