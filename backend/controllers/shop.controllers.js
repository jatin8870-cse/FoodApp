import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


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
        const shop = await Shop.findOne({owner : req.userId}).populate("owner items")
        if(!shop){
           return null
        }
        return res.status(200).json(shop)
    } catch(error){
   
 return res.status(500).json({
            message: `get my shop error ${error}`
        });

    }
}