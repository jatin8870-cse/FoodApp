import mongoose from "mongoose";
const shopOrderItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "shop" },
    price:Number,
    quantity:Number
  },
  { timestamps: true },
);
const shopOrderSchema = new mongoose.Schema(
  {
    shope: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subtotal: Number,
    shopOrderItems: [shopOrderItemSchema],
  },
  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },

    deliveryAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
    },
    TotalAmount: {
      type: Number,
    },
    shopOrder: [shopOrderSchema],
  },
  { timestamss: true },
);

const Order = mongoose.model("Order",orderSchema)
export default Order
