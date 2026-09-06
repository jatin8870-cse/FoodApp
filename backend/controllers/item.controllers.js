import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req,res) => {
    try{
     const {name,category,foodtype,price} = req.body
     let image;
     if(req.file){
        image = await uploadOnCloudinary(req.file.path)
     }
     const shop = await  Shop.findOne({owner:req.userId})
     if(!shop){
        return res.status(400).json({message:"shop not found"})
     }
     const item =  await Item.create({
        name,category,foodtype,price,image,shop:shop._id
     })
     
     shop.items.push(item._id)
    await shop.save()
     await shop.populate({
    path: "items",
    options: {
        sort: { updatedAt: -1 }
    }
});

await shop.populate("owner");
    return res.status(201).json(shop)

    } catch(error){ 
    console.log("ADD ITEM ERROR:", error);

    return res.status(500).json({
        message: "add item error",
        error: error.message
    });
}
}


export const editItems = async (req, res) => {
    try {
        const itemId = req.params.itemId;

        const { name, category, foodtype, price } = req.body;

        let updateData = {
            name,
            category,
            foodtype,
            price
        };

        // Only update image if a new image was uploaded
        if (req.file) {
            const uploadedImage = await uploadOnCloudinary(req.file.path);
            updateData.image = uploadedImage;
        }

        const item = await Item.findByIdAndUpdate(
            itemId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        const shopData = await Shop
            .findOne({ owner: req.userId })
            .populate({
               path:"items",
               options:{sort:{updatedAt: -1}}
            });

        return res.status(200).json(shopData);

    } catch (error) {
        console.log("EDIT ITEM ERROR:", error);

        return res.status(500).json({
            message: "Edit item error",
            error: error.message
        });
    }
};

export const getItemById = async (req,res) =>{
   try{
   const itemId = req.params.itemId
   const item = await Item.findById(itemId)
   if(!item){
      return res.status(400).json({message:"item not found"})
   }

   return res.status(200).json(item)
   } catch(error){
      return res.status(400).json({message:`get item error ${error}`})
   }
}

export const deleteItem = async (req,res) =>{
   try{
        const itemId = req.params.itemId
        const item = await Item.findByIdAndDelete(itemId)
        if(!item){
            return res.status(400).json({message:"item not found"})
        }
         const shop = await Shop.findOne({owner:req.userId})
          shop.items=shop.items.filter(i=>i._id!==item._id)
          await shop.save()
          shop.populate({
            path:"items",
        options:{sort:{updatedAt: -1}}
          })
          return res.status(200).json(shop)
   } catch(error){
        return res.status(400).json({message:`delete item error ${error}`})
   }
}